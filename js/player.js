// ============================================================================
// player.js — Geralt of Rivia: movement, combat, animation, pixel art
// ============================================================================
(function() {
'use strict';

const States = {
    IDLE: 'idle', RUN: 'run', JUMP: 'jump', FALL: 'fall',
    ATTACK: 'attack', ROLL: 'roll', BLOCK: 'block',
    HURT: 'hurt', DEAD: 'dead'
};
W.PlayerStates = States;

// Articulated body animation system — Prince of Persia style
const C = W.Colors;
const HAIR = C.WHITE_HAIR;
const SKIN = C.SKIN;
const ARMOR = C.DARK_LEATHER;
const LEATH = C.LEATHER;
const BOOT = '#2a1a0a';
const BELT = '#888';
const MEDAL = C.WITCHER_GOLD;

// Draw a tapered limb segment (thicker at start, thinner at end)
function drawLimb(ctx, x1, y1, x2, y2, w, color, w2) {
    const endW = w2 !== undefined ? w2 : w * 0.7;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len, ny = dx / len;
    // Build a filled quadrilateral with different widths at each end
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1 + nx * w / 2, y1 + ny * w / 2);
    ctx.lineTo(x2 + nx * endW / 2, y2 + ny * endW / 2);
    ctx.lineTo(x2 - nx * endW / 2, y2 - ny * endW / 2);
    ctx.lineTo(x1 - nx * w / 2, y1 - ny * w / 2);
    ctx.closePath();
    ctx.fill();
    // Smooth ends with arcs
    ctx.beginPath(); ctx.arc(x1, y1, w / 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x2, y2, endW / 2, 0, Math.PI * 2); ctx.fill();
}

// Draw a joint circle
function drawJoint(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

// Draw a boot shape (wider sole, narrower ankle)
function drawBoot(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle || 0);
    // Ankle
    ctx.fillStyle = BOOT;
    ctx.beginPath();
    ctx.moveTo(-2, -3);
    ctx.lineTo(2, -3);
    ctx.lineTo(3, 0);
    ctx.lineTo(-2, 0);
    ctx.closePath();
    ctx.fill();
    // Sole (wider)
    ctx.fillStyle = '#1a0e05';
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(5, 0);
    ctx.lineTo(5, 3);
    ctx.quadraticCurveTo(4, 4, -2, 4);
    ctx.lineTo(-3, 3);
    ctx.closePath();
    ctx.fill();
    // Boot top highlight
    ctx.fillStyle = '#3a2a1a';
    ctx.beginPath();
    ctx.moveTo(-1, -3);
    ctx.lineTo(1, -3);
    ctx.lineTo(2, -1);
    ctx.lineTo(-1, -1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// Smooth interpolation helper
function wave(t, speed, amp) { return Math.sin(t * speed) * amp; }

// Body part drawing functions
const Body = {
    head(ctx, x, y, t, state) {
        // Hair flowing behind
        const hairFlow = wave(t, 0.08, 2);
        ctx.fillStyle = HAIR;
        ctx.fillRect(x - 5, y - 2 + hairFlow * 0.3, 12, 4); // hair top
        ctx.fillRect(x - 7, y + 1, 4, 7 + Math.abs(hairFlow)); // hair flowing back
        ctx.fillRect(x - 5, y + 2, 3, 5 + Math.abs(hairFlow) * 0.5);
        // Head shape
        ctx.fillStyle = SKIN;
        ctx.fillRect(x - 3, y, 10, 11);
        // Yellow cat eyes
        ctx.fillStyle = C.YELLOW_EYES;
        const blink = (Math.floor(t * 0.02) % 80 === 0) ? 0 : 2;
        ctx.fillRect(x - 1, y + 3, 2, blink);
        ctx.fillRect(x + 4, y + 3, 2, blink);
        // Eye glow
        ctx.fillStyle = 'rgba(218,165,32,0.3)';
        ctx.fillRect(x - 2, y + 3, 4, 2);
        ctx.fillRect(x + 3, y + 3, 4, 2);
        // Stubble shadow
        ctx.fillStyle = '#8a7a6a';
        ctx.fillRect(x - 1, y + 8, 7, 2);
        // Scar (left cheek)
        ctx.fillStyle = '#c09070';
        ctx.fillRect(x, y + 5, 1, 4);
    },

    torso(ctx, x, y, breathe) {
        // Armor body
        ctx.fillStyle = ARMOR;
        ctx.fillRect(x - 7, y, 14, 16);
        // Leather under-layer
        ctx.fillStyle = LEATH;
        ctx.fillRect(x - 6, y + 2, 12, 4);
        ctx.fillRect(x - 5, y + 8, 10, 6);
        // Medallion (wolf head - gold pixel)
        ctx.fillStyle = MEDAL;
        ctx.fillRect(x - 1, y + 3, 3, 3);
        ctx.fillStyle = '#daa520';
        ctx.fillRect(x, y + 4, 1, 1);
        // Belt
        ctx.fillStyle = BELT;
        ctx.fillRect(x - 7, y + 14, 14, 2);
        // Belt buckle
        ctx.fillStyle = MEDAL;
        ctx.fillRect(x - 1, y + 14, 3, 2);
        // Shoulder pads
        ctx.fillStyle = '#4a3a2a';
        ctx.fillRect(x - 9, y - 1, 4, 4);
        ctx.fillRect(x + 5, y - 1, 4, 4);
        // Breathing animation (subtle chest expand)
        if (breathe > 0.5) {
            ctx.fillStyle = LEATH;
            ctx.fillRect(x - 7, y + 1, 1, 3);
            ctx.fillRect(x + 6, y + 1, 1, 3);
        }
    },

    swordsOnBack(ctx, x, y) {
        // Silver sword hilt (left shoulder)
        ctx.fillStyle = C.SILVER_BLADE;
        ctx.fillRect(x - 10, y - 4, 2, 12);
        ctx.fillStyle = '#aab';
        ctx.fillRect(x - 11, y - 2, 4, 2);
        // Iron sword hilt (right shoulder)
        ctx.fillStyle = C.IRON_BLADE;
        ctx.fillRect(x + 8, y - 4, 2, 12);
        ctx.fillStyle = '#886';
        ctx.fillRect(x + 7, y - 2, 4, 2);
    },

    cape(ctx, x, y, t, speed) {
        const flutter = wave(t, 0.06 + speed * 0.02, 3 + speed * 2);
        ctx.fillStyle = 'rgba(40,30,20,0.7)';
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x - 8 + flutter, y + 14);
        ctx.lineTo(x - 4 + flutter * 0.5, y + 18);
        ctx.lineTo(x - 2, y + 4);
        ctx.fill();
    }
};

W.Player = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 56;
        this.vx = 0;
        this.vy = 0;
        this.speed = 2.2;
        this.jumpForce = -11;
        this.hp = 100;
        this.maxHp = 100;
        this.facing = 1;
        this.state = States.IDLE;
        this.activeSword = 'silver';
        this.animFrame = 0;
        this.animTimer = 0;
        this.stateTimer = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.score = 0;
        this.onGround = false;
        this.attackHitbox = null;
        this.rollSpeed = 4.0;
        this.comboCount = 0;
        this.jumpConsumed = false; // prevents repeated jumps while key/joystick held
    }

    get alive() { return this.hp > 0; }
    get isAttacking() { return this.state === States.ATTACK; }
    get hitbox() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }

    update(dt, keys, platforms) {
        const spd = dt * 60; // normalize to 60fps

        // Invincibility timer
        if (this.invincible) {
            this.invincibleTimer -= spd;
            if (this.invincibleTimer <= 0) this.invincible = false;
        }

        // State machine
        switch (this.state) {
            case States.IDLE:
            case States.RUN:
                this.handleMovement(keys, spd);
                if (keys['w'] || keys['arrowup']) this.jump();
                if (keys['s'] || keys['arrowdown']) this.rollDodge();
                if (keys['shift']) { this.state = States.BLOCK; }
                break;

            case States.JUMP:
            case States.FALL:
                this.handleAirMovement(keys, spd);
                break;

            case States.ATTACK:
                this.stateTimer -= spd;
                // Attack hitbox active during mid-frames
                if (this.stateTimer < 18 && this.stateTimer > 5) {
                    const hbx = this.facing === 1 ? this.x + this.w : this.x - 45;
                    this.attackHitbox = { x: hbx, y: this.y + 5, w: 45, h: 35 };
                } else {
                    this.attackHitbox = null;
                }
                if (this.stateTimer <= 0) {
                    this.state = States.IDLE;
                    this.attackHitbox = null;
                }
                break;

            case States.ROLL:
                this.x += this.facing * this.rollSpeed * spd;
                this.stateTimer -= spd;
                if (this.stateTimer <= 0) {
                    this.state = States.IDLE;
                    this.invincible = false;
                }
                break;

            case States.BLOCK:
                this.vx = 0;
                if (!keys['shift']) this.state = States.IDLE;
                break;

            case States.HURT:
                this.stateTimer -= spd;
                this.vx *= 0.85;
                if (this.stateTimer <= 0) {
                    this.state = States.IDLE;
                }
                break;

            case States.DEAD:
                this.vx = 0;
                return;
        }

        // Gravity
        if (!this.onGround) {
            this.vy += W.GRAVITY * spd;
            if (this.vy > 12) this.vy = 12;
        }

        // Apply velocity
        this.x += this.vx * spd;
        this.y += this.vy * spd;

        // Platform collision
        this.onGround = false;
        for (const p of platforms) {
            const pr = p.rect || p;
            if (this.x + this.w > pr.x && this.x < pr.x + pr.w) {
                // Landing on top
                if (this.vy >= 0 && this.y + this.h > pr.y && this.y + this.h < pr.y + pr.h + 10) {
                    this.y = pr.y - this.h;
                    this.vy = 0;
                    this.onGround = true;
                    if (this.state === States.JUMP || this.state === States.FALL) {
                        this.state = States.IDLE;
                    }
                }
            }
        }

        // Fall off screen death
        if (this.y > W.CANVAS_H + 100) {
            this.hp = 0;
            this.state = States.DEAD;
        }

        // Clamp to level bounds (0 minimum)
        if (this.x < 0) this.x = 0;

        // Jump -> fall transition
        if (this.state === States.JUMP && this.vy > 0) {
            this.state = States.FALL;
        }

        // Animation timer
        this.animTimer += spd;
        if (this.animTimer > 10) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
    }

    handleMovement(keys, spd) {
        this.vx = 0;
        let moving = false;
        if (keys['a'] || keys['arrowleft']) {
            this.vx = -this.speed;
            this.facing = -1;
            moving = true;
        }
        if (keys['d'] || keys['arrowright']) {
            this.vx = this.speed;
            this.facing = 1;
            moving = true;
        }
        this.state = moving ? States.RUN : States.IDLE;
    }

    handleAirMovement(keys, spd) {
        if (keys['a'] || keys['arrowleft']) {
            this.vx = -this.speed * 0.85;
            this.facing = -1;
        } else if (keys['d'] || keys['arrowright']) {
            this.vx = this.speed * 0.85;
            this.facing = 1;
        } else {
            this.vx *= 0.9;
        }
    }

    jump() {
        if (this.onGround) {
            this.vy = this.jumpForce;
            this.state = States.JUMP;
            this.onGround = false;
        }
    }

    attack(swordType) {
        if (this.state === States.ATTACK || this.state === States.ROLL ||
            this.state === States.HURT || this.state === States.DEAD) return;
        this.activeSword = swordType;
        this.state = States.ATTACK;
        this.stateTimer = 22;
        this.attackHitbox = null;
    }

    rollDodge() {
        if (this.state === States.ROLL || this.state === States.DEAD) return;
        this.state = States.ROLL;
        this.stateTimer = 15;
        this.invincible = true;
        this.invincibleTimer = 15;
    }

    takeDamage(amount) {
        if (this.invincible || this.state === States.ROLL || this.state === States.DEAD) return false;
        if (this.state === States.BLOCK) amount = Math.floor(amount * 0.25);

        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.state = States.DEAD;
        } else {
            this.state = States.HURT;
            this.stateTimer = 12;
            this.invincible = true;
            this.invincibleTimer = 30;
            this.vx = -this.facing * 3;
        }
        return true; // signal to shake camera
    }

    draw(ctx) {
        ctx.save();
        const t = this.animTimer;
        const f = this.facing;

        // Invincibility flicker
        if (this.invincible && Math.floor(t) % 3 === 0) ctx.globalAlpha = 0.4;

        // Mirror for facing left
        if (f === -1) {
            ctx.translate(this.x + this.w / 2, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(this.x + this.w / 2), 0);
        }

        // Body center reference point
        const cx = this.x + this.w / 2;
        const cy = this.y + 14; // shoulder height

        // Ground shadow
        W.Draw.shadow(ctx, cx, this.y + this.h + 2, this.w * 0.8);

        // Animation parameters by state
        const breathe = wave(t, 0.05, 1);
        const isRun = this.state === States.RUN;
        const isAttack = this.state === States.ATTACK;
        const isBlock = this.state === States.BLOCK;
        const isHurt = this.state === States.HURT;
        const isRoll = this.state === States.ROLL;
        const isDead = this.state === States.DEAD;
        const isJump = this.state === States.JUMP || this.state === States.FALL;
        const runCycle = t * 0.15; // smooth run phase
        const atkProgress = isAttack ? (1 - this.stateTimer / 22) : 0;

        if (isRoll) {
            this.drawRoll(ctx, cx, cy + 14, t);
            ctx.restore();
            return;
        }

        if (isDead) {
            this.drawDead(ctx, cx, cy);
            ctx.restore();
            return;
        }

        // === CALCULATE JOINT POSITIONS ===
        // Hip position
        const hipX = cx;
        const hipY = cy + 16 + breathe * 0.5 + (isRun ? wave(runCycle * 2, 1, 1.5) : 0);

        // Leg angles (radians from vertical)
        let lLegAngle, rLegAngle, lKneeAngle, rKneeAngle;
        if (isRun) {
            lLegAngle = Math.sin(runCycle) * 0.7;
            rLegAngle = Math.sin(runCycle + Math.PI) * 0.7;
            lKneeAngle = Math.max(0, -Math.sin(runCycle - 0.5)) * 0.8;
            rKneeAngle = Math.max(0, -Math.sin(runCycle + Math.PI - 0.5)) * 0.8;
        } else if (isJump) {
            lLegAngle = -0.3; rLegAngle = 0.2;
            lKneeAngle = 0.6; rKneeAngle = 0.4;
        } else if (isBlock) {
            lLegAngle = -0.15; rLegAngle = 0.15;
            lKneeAngle = 0.2; rKneeAngle = 0.2;
        } else {
            lLegAngle = -0.05 + breathe * 0.02;
            rLegAngle = 0.05 + breathe * 0.02;
            lKneeAngle = 0.05; rKneeAngle = 0.05;
        }

        const legLen = 12;
        const shinLen = 12;

        // Calculate leg endpoints
        const lKneeX = hipX - 3 + Math.sin(lLegAngle) * legLen;
        const lKneeY = hipY + Math.cos(lLegAngle) * legLen;
        const lFootX = lKneeX + Math.sin(lLegAngle + lKneeAngle) * shinLen;
        const lFootY = lKneeY + Math.cos(lLegAngle + lKneeAngle) * shinLen;

        const rKneeX = hipX + 3 + Math.sin(rLegAngle) * legLen;
        const rKneeY = hipY + Math.cos(rLegAngle) * legLen;
        const rFootX = rKneeX + Math.sin(rLegAngle + rKneeAngle) * shinLen;
        const rFootY = rKneeY + Math.cos(rLegAngle + rKneeAngle) * shinLen;

        // Arm angles
        let lArmAngle, rArmAngle, lElbowAngle, rElbowAngle;
        const armLen = 10;
        const foreLen = 10;

        if (isAttack) {
            // Ease-in-out for snappy strike timing
            const easedAtk = atkProgress < 0.5
                ? 4 * atkProgress * atkProgress * atkProgress
                : 1 - Math.pow(-2 * atkProgress + 2, 3) / 2;
            if (this.activeSword === 'silver') {
                // Silver: horizontal pirouette slash — arm goes from pulled back to extended forward
                rArmAngle = -1.2 + easedAtk * 1.5;   // shoulder rotates from behind to forward-extended
                rElbowAngle = 0.8 - easedAtk * 0.7;   // elbow straightens as arm extends
                lArmAngle = 0.2 - easedAtk * 0.4;     // off-hand pulls back for balance
                lElbowAngle = 0.5 + easedAtk * 0.2;
            } else {
                // Iron: overhead chop — arm raised high, comes down
                rArmAngle = -1.6 + easedAtk * 1.8;    // from above head to below hip
                rElbowAngle = 0.2 + easedAtk * 0.15;  // stays mostly straight (two-handed chop feel)
                lArmAngle = -1.2 + easedAtk * 1.0;    // off-hand follows (supporting the chop)
                lElbowAngle = 0.3 + easedAtk * 0.2;
            }
        } else if (isBlock) {
            rArmAngle = -0.8; rElbowAngle = 1.2;
            lArmAngle = -0.5; lElbowAngle = 0.8;
        } else if (isRun) {
            lArmAngle = Math.sin(runCycle + Math.PI) * 0.5;
            rArmAngle = Math.sin(runCycle) * 0.5;
            lElbowAngle = 0.4 + Math.abs(Math.sin(runCycle + Math.PI)) * 0.3;
            rElbowAngle = 0.4 + Math.abs(Math.sin(runCycle)) * 0.3;
        } else if (isHurt) {
            const hurtT = this.stateTimer / 12;
            lArmAngle = -0.5 - hurtT; rArmAngle = 0.5 + hurtT;
            lElbowAngle = 0.2; rElbowAngle = 0.2;
        } else if (isJump) {
            lArmAngle = -0.6; rArmAngle = -0.6;
            lElbowAngle = 0.3; rElbowAngle = 0.3;
        } else {
            lArmAngle = -0.1 + breathe * 0.03;
            rArmAngle = 0.1 + breathe * 0.03;
            lElbowAngle = 0.15; rElbowAngle = 0.15;
        }

        const shoulderY = cy + 1;
        const lShX = cx - 7, rShX = cx + 7;

        const lElbX = lShX + Math.sin(lArmAngle) * armLen;
        const lElbY = shoulderY + Math.cos(lArmAngle) * armLen;
        const lHandX = lElbX + Math.sin(lArmAngle + lElbowAngle) * foreLen;
        const lHandY = lElbY + Math.cos(lArmAngle + lElbowAngle) * foreLen;

        const rElbX = rShX + Math.sin(rArmAngle) * armLen;
        const rElbY = shoulderY + Math.cos(rArmAngle) * armLen;
        const rHandX = rElbX + Math.sin(rArmAngle + rElbowAngle) * foreLen;
        const rHandY = rElbY + Math.cos(rArmAngle + rElbowAngle) * foreLen;

        // Head position
        const headX = cx;
        const headY = cy - 8 + breathe * 0.5 + (isRun ? wave(runCycle * 2, 1, 1) : 0)
            + (isHurt ? -3 : 0);

        // === DRAW ORDER (back to front) ===

        // Cape (behind everything)
        Body.cape(ctx, cx, cy, t, isRun ? 3 : 0);

        // Swords on back (only when not attacking)
        if (!isAttack) Body.swordsOnBack(ctx, cx, cy);

        // Back leg
        drawLimb(ctx, hipX + 3, hipY, rKneeX, rKneeY, 5, '#2a2018');
        drawLimb(ctx, rKneeX, rKneeY, rFootX, rFootY, 4, '#2a2018');
        // Boot
        ctx.fillStyle = BOOT;
        ctx.fillRect(rFootX - 3, rFootY - 1, 7, 4);

        // Back arm
        drawLimb(ctx, rShX, shoulderY, rElbX, rElbY, 4, SKIN);
        drawLimb(ctx, rElbX, rElbY, rHandX, rHandY, 3, SKIN);
        drawJoint(ctx, rElbX, rElbY, 2, ARMOR);

        // Torso
        Body.torso(ctx, cx, cy, breathe + 0.5);

        // Front leg
        drawLimb(ctx, hipX - 3, hipY, lKneeX, lKneeY, 5, ARMOR);
        drawLimb(ctx, lKneeX, lKneeY, lFootX, lFootY, 4, '#3a2a18');
        // Boot
        ctx.fillStyle = BOOT;
        ctx.fillRect(lFootX - 3, lFootY - 1, 7, 4);
        // Boot detail
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(lFootX - 2, lFootY - 1, 5, 1);

        // Dust particles when running
        if (isRun && Math.sin(runCycle) > 0.8) {
            ctx.fillStyle = 'rgba(150,130,100,0.4)';
            ctx.fillRect(lFootX - 2, lFootY + 3, 4, 2);
            ctx.fillRect(lFootX + 2, lFootY + 2, 3, 2);
        }

        // Front arm
        drawLimb(ctx, lShX, shoulderY, lElbX, lElbY, 4, SKIN);
        drawLimb(ctx, lElbX, lElbY, lHandX, lHandY, 3, SKIN);
        drawJoint(ctx, lElbX, lElbY, 2, ARMOR);
        // Hand
        drawJoint(ctx, lHandX, lHandY, 2, SKIN);

        // Head
        Body.head(ctx, headX - 2, headY, t, this.state);

        // === SWORD DURING ATTACK ===
        if (isAttack) {
            this.drawSwordSwing(ctx, rHandX, rHandY, atkProgress);
        }

        // Block sword position
        if (isBlock) {
            const isSilver = this.activeSword === 'silver';
            ctx.strokeStyle = isSilver ? C.SILVER_BLADE : C.IRON_BLADE;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(rHandX, rHandY);
            ctx.lineTo(rHandX + 3, rHandY - 20);
            ctx.stroke();
            // Guard
            ctx.strokeStyle = MEDAL;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(rHandX - 4, rHandY - 2);
            ctx.lineTo(rHandX + 4, rHandY - 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawRoll(ctx, cx, cy, t) {
        const progress = 1 - this.stateTimer / 15;
        const angle = progress * Math.PI * 2 * this.facing;
        const r = 14;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Body ball
        ctx.fillStyle = ARMOR;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Hair streak
        ctx.fillStyle = HAIR;
        const hairAngle = -angle * 0.5;
        ctx.fillRect(-3 + Math.cos(hairAngle) * 6, -8 + Math.sin(hairAngle) * 3, 6, 4);

        // Leather detail
        ctx.fillStyle = LEATH;
        ctx.fillRect(-5, -2, 10, 4);

        // Belt flash
        ctx.fillStyle = BELT;
        ctx.fillRect(-6, 1, 12, 1);

        // Limbs tucked
        ctx.fillStyle = SKIN;
        ctx.fillRect(-r + 2, -3, 4, 3);
        ctx.fillRect(r - 6, -3, 4, 3);

        ctx.restore();

        // Dust on ground
        ctx.fillStyle = 'rgba(150,130,100,0.5)';
        ctx.fillRect(cx - 8, cy + r + 2, 16, 3);
    }

    drawDead(ctx, cx, cy) {
        // Collapsed body on ground
        const groundY = this.y + this.h - 8;
        ctx.fillStyle = ARMOR;
        ctx.fillRect(cx - 16, groundY, 32, 8);
        ctx.fillStyle = LEATH;
        ctx.fillRect(cx - 12, groundY + 1, 24, 4);
        // Head
        ctx.fillStyle = SKIN;
        ctx.fillRect(cx - 18, groundY - 2, 8, 7);
        ctx.fillStyle = HAIR;
        ctx.fillRect(cx - 20, groundY - 3, 6, 4);
        // Limbs splayed
        ctx.fillStyle = SKIN;
        ctx.fillRect(cx + 14, groundY - 2, 10, 3);
        ctx.fillRect(cx - 14, groundY + 6, 8, 3);
        // Boots
        ctx.fillStyle = BOOT;
        ctx.fillRect(cx + 12, groundY + 5, 8, 4);
    }

    drawSwordSwing(ctx, handX, handY, progress) {
        const isSilver = this.activeSword === 'silver';
        const swordLen = 26;
        const hiltLen = 4; // short hilt behind the hand

        // Eased progress: fast in the middle, slow at start/end (cubic ease)
        const easedProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        // Blade angle — the direction the sword points FROM the hand
        let bladeAngle;
        if (isSilver) {
            // Silver (pirouette/horizontal slash): blade sweeps ~100 degrees
            // from behind-and-up to forward-and-slightly-down at chest height
            const startAngle = -Math.PI * 0.85; // pointing back and up
            const endAngle = -Math.PI * 0.15;   // pointing forward and slightly down
            bladeAngle = startAngle + (endAngle - startAngle) * easedProgress;
        } else {
            // Iron (overhead chop): blade sweeps ~110 degrees
            // from above head straight down to hip level
            const startAngle = -Math.PI * 0.92; // pointing almost straight up
            const endAngle = Math.PI * 0.2;     // pointing down and slightly forward
            bladeAngle = startAngle + (endAngle - startAngle) * easedProgress;
        }

        // Tip and hilt-end positions (sword is a straight line through the hand)
        const tipX = handX + Math.cos(bladeAngle) * swordLen;
        const tipY = handY + Math.sin(bladeAngle) * swordLen;
        const hiltEndX = handX - Math.cos(bladeAngle) * hiltLen;
        const hiltEndY = handY - Math.sin(bladeAngle) * hiltLen;

        // Crossguard perpendicular to blade
        const guardAngle = bladeAngle + Math.PI / 2;
        const guardLen = 5;
        const g1x = handX + Math.cos(guardAngle) * guardLen;
        const g1y = handY + Math.sin(guardAngle) * guardLen;
        const g2x = handX - Math.cos(guardAngle) * guardLen;
        const g2y = handY - Math.sin(guardAngle) * guardLen;

        // === TRAIL: thin fading arcs showing where the blade swept ===
        if (progress > 0.12 && progress < 0.88) {
            const trailColor = isSilver ? C.SILVER_TRAIL : C.IRON_TRAIL;
            // Compute the angle range that has been swept so far
            let startAngle, endAngle;
            if (isSilver) {
                startAngle = -Math.PI * 0.85;
                endAngle = -Math.PI * 0.15;
            } else {
                startAngle = -Math.PI * 0.92;
                endAngle = Math.PI * 0.2;
            }
            // Trail covers from a bit behind current position back toward the start
            const trailHead = bladeAngle;
            const trailSpan = (endAngle - startAngle) * easedProgress * 0.45; // trail length
            const trailTail = trailHead - trailSpan;
            const arcFrom = Math.min(trailTail, trailHead);
            const arcTo = Math.max(trailTail, trailHead);

            // 3 thin arcs at different radii (near tip, mid-blade, inner)
            for (let i = 0; i < 3; i++) {
                const radius = swordLen - 1 - i * 5;
                const alpha = (0.35 - i * 0.1) * (1 - Math.abs(progress - 0.5) * 1.5);
                if (alpha <= 0 || radius <= 0) continue;
                ctx.strokeStyle = trailColor;
                ctx.lineWidth = 1.5 - i * 0.3;
                ctx.globalAlpha = Math.max(0, alpha);
                ctx.beginPath();
                ctx.arc(handX, handY, radius, arcFrom, arcTo);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        // === BLADE with glow ===
        ctx.save();
        if (isSilver) {
            ctx.shadowColor = '#aaccff';
            ctx.shadowBlur = 10;
        } else {
            ctx.shadowColor = '#ff8833';
            ctx.shadowBlur = 8;
        }
        // Main blade line
        ctx.strokeStyle = isSilver ? C.SILVER_BLADE : C.IRON_BLADE;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
        ctx.restore();

        // Subtle glow aura along the blade
        ctx.strokeStyle = isSilver ? 'rgba(180,200,255,0.25)' : 'rgba(255,160,60,0.25)';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Hilt (pommel behind the hand)
        ctx.strokeStyle = '#654';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(hiltEndX, hiltEndY);
        ctx.stroke();

        // Crossguard
        ctx.strokeStyle = MEDAL;
        ctx.lineWidth = 2;
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.moveTo(g1x, g1y);
        ctx.lineTo(g2x, g2y);
        ctx.stroke();

        // Tip effect: small sparkle (silver) or ember (iron) during active swing
        if (progress > 0.2 && progress < 0.7) {
            const intensity = 1 - Math.abs(progress - 0.45) * 3;
            if (isSilver) {
                ctx.fillStyle = '#ddeeff';
                ctx.globalAlpha = 0.6 * Math.max(0, intensity);
                ctx.beginPath();
                ctx.arc(tipX, tipY, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = '#ffaa33';
                ctx.globalAlpha = 0.5 * Math.max(0, intensity);
                ctx.beginPath();
                ctx.arc(tipX, tipY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }
};

})();
