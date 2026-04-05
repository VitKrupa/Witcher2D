// ============================================================================
// player.js — Geralt of Rivia: movement, combat, animation, pixel art
// ============================================================================
(function() {
'use strict';

const States = {
    IDLE: 'idle', RUN: 'run', JUMP: 'jump', FALL: 'fall',
    ATTACK: 'attack', ROLL: 'roll', BLOCK: 'block',
    HURT: 'hurt', DEAD: 'dead',
    HANG: 'hang', CLIMB: 'climb'
};
W.PlayerStates = States;

// Color shortcuts
const C = W.Colors;
const GOLD = C.WITCHER_GOLD;

// Rounded rectangle helper (Lovable-style: fill only)
function drawRoundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
}

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
        this.rollSpeed = 2.5;
        this.rollCooldown = 0;
        this.comboCount = 0;
        this.jumpConsumed = false; // prevents repeated jumps while key/joystick held
        this._drawTimer = 0; // continuous timer for smooth visual animations (never resets)
    }

    get alive() { return this.hp > 0; }
    get isAttacking() { return this.state === States.ATTACK; }
    get hitbox() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }

    update(dt, keys, platforms, enemies) {
        const spd = dt * 60; // normalize to 60fps

        // Invincibility timer
        if (this.invincible) {
            this.invincibleTimer -= spd;
            if (this.invincibleTimer <= 0) this.invincible = false;
        }

        // Roll cooldown timer
        if (this.rollCooldown > 0) {
            this.rollCooldown -= spd;
        }

        // State machine
        switch (this.state) {
            case States.IDLE:
            case States.RUN:
                this.handleMovement(keys, spd);
                if (keys['w'] || keys['arrowup']) {
                    if (!this.jumpConsumed) this.jump();
                } else {
                    this.jumpConsumed = false;
                }
                if (keys['s'] || keys['arrowdown']) this.rollDodge();
                if (keys['shift']) { this.state = States.BLOCK; }
                break;

            case States.JUMP:
            case States.FALL:
                this.handleAirMovement(keys, spd);
                // Check for ledge grab
                for (const p of platforms) {
                    const pr = p.rect || p;
                    // Near left edge of platform
                    if (Math.abs(this.x + this.w - pr.x) < 15 &&
                        this.y > pr.y - 20 && this.y < pr.y + 5 && this.vy > 0) {
                        this.state = States.HANG;
                        this._hangPlatform = pr;
                        this._hangSide = 'left';
                        this.x = pr.x - this.w + 5;
                        this.y = pr.y - 5;
                        this.vy = 0; this.vx = 0;
                        break;
                    }
                    // Near right edge of platform
                    if (Math.abs(this.x - (pr.x + pr.w)) < 15 &&
                        this.y > pr.y - 20 && this.y < pr.y + 5 && this.vy > 0) {
                        this.state = States.HANG;
                        this._hangPlatform = pr;
                        this._hangSide = 'right';
                        this.x = pr.x + pr.w - 5;
                        this.y = pr.y - 5;
                        this.vy = 0; this.vx = 0;
                        break;
                    }
                }
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
                // Stop roll on enemy collision
                if (enemies) {
                    var playerBox = this.hitbox;
                    for (var ei = 0; ei < enemies.length; ei++) {
                        var enemy = enemies[ei];
                        if (enemy && enemy.hitbox && W.boxCollision(playerBox, enemy.hitbox)) {
                            this.stateTimer = 0;
                            break;
                        }
                    }
                }
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

            case States.HANG:
                this.vx = 0; this.vy = 0;
                if (keys['w'] || keys['arrowup']) {
                    this.state = States.CLIMB;
                    this.stateTimer = 12;
                } else if (keys['s'] || keys['arrowdown']) {
                    this.state = States.FALL;
                    this.vy = 1;
                } else if (keys['a'] || keys['arrowleft'] || keys['d'] || keys['arrowright']) {
                    this.state = States.FALL;
                    this.vy = 0;
                }
                break;

            case States.CLIMB:
                this.stateTimer -= spd;
                this.vx = 0; this.vy = 0;
                // Animate moving up onto platform
                if (this._hangPlatform) {
                    var progress = 1 - (this.stateTimer / 12);
                    this.y = this._hangPlatform.y - 5 - progress * (this.h - 5);
                }
                if (this.stateTimer <= 0) {
                    this.state = States.IDLE;
                    if (this._hangPlatform) {
                        this.y = this._hangPlatform.y - this.h;
                        this.onGround = true;
                    }
                }
                break;

            case States.DEAD:
                this.vx = 0;
                return;
        }

        // Gravity (skip during hang/climb — player is stationary on ledge)
        if (!this.onGround && this.state !== States.HANG && this.state !== States.CLIMB) {
            this.vy += W.GRAVITY * spd;
            if (this.vy > 12) this.vy = 12;
        }

        // Apply velocity
        this.x += this.vx * spd;
        this.y += this.vy * spd;

        // Platform collision (skip during hang/climb — player is locked to ledge)
        if (this.state === States.HANG || this.state === States.CLIMB) {
            // Skip platform collision; player position is managed by state handler
        } else {
            var wasOnGround = this.onGround;
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
                // Side collision (walls)
                if (this.y + this.h > pr.y + 4 && this.y < pr.y + pr.h - 4) {
                    // Hitting wall from left
                    if (this.vx > 0 && this.x + this.w > pr.x && this.x + this.w < pr.x + 16) {
                        this.x = pr.x - this.w;
                        this.vx = 0;
                    }
                    // Hitting wall from right
                    if (this.vx < 0 && this.x < pr.x + pr.w && this.x > pr.x + pr.w - 16) {
                        this.x = pr.x + pr.w;
                        this.vx = 0;
                    }
                }
                // Ceiling collision (head bonk)
                if (this.vy < 0 && this.x + this.w > pr.x && this.x < pr.x + pr.w) {
                    if (this.y < pr.y + pr.h && this.y > pr.y + pr.h - 10) {
                        this.y = pr.y + pr.h;
                        this.vy = 0;
                    }
                }
            }

            // Coyote time: 6 frames after leaving ground you can still jump
            if (this.onGround) {
                this._coyoteFrames = 6;
            } else if (wasOnGround) {
                this._coyoteFrames = 6;
            } else if (this._coyoteFrames > 0) {
                this._coyoteFrames -= spd;
            }

            // Jump -> fall transition
            if (this.state === States.JUMP && this.vy > 0) {
                this.state = States.FALL;
            }
        }

        // Fall off screen death
        if (this.y > W.CANVAS_H + 100) {
            this.hp = 0;
            this.state = States.DEAD;
        }

        // Clamp to level bounds (0 minimum)
        if (this.x < 0) this.x = 0;

        // Animation timer — continuous (never resets) for smooth sin/cos curves
        this.animTimer += spd;
        // animFrame still cycles for any legacy frame-based code
        if (Math.floor(this.animTimer / 10) !== Math.floor((this.animTimer - spd) / 10)) {
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
        // Coyote time: allow jump for a few frames after leaving ground
        if (this.onGround || (this._coyoteFrames && this._coyoteFrames > 0)) {
            this.vy = this.jumpForce;
            this.state = States.JUMP;
            this._coyoteFrames = 0;
            this.onGround = false;
            this.jumpConsumed = true; // prevent repeated jumps while key held
        }
    }

    attack(swordType) {
        if (this.state === States.ATTACK || this.state === States.ROLL ||
            this.state === States.HURT || this.state === States.DEAD ||
            this.state === States.HANG || this.state === States.CLIMB) return;
        this.activeSword = swordType;
        this.state = States.ATTACK;
        this.stateTimer = 22;
        this.attackHitbox = null;
    }

    rollDodge() {
        if (this.state === States.ROLL || this.state === States.DEAD ||
            this.state === States.HANG || this.state === States.CLIMB) return;
        if (this.rollCooldown > 0) return;
        this.state = States.ROLL;
        this.stateTimer = 10;
        this.invincible = true;
        this.invincibleTimer = 8;
        this.rollCooldown = 40;
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

    // ================================================================
    // Lovable-style drawing: simple roundRect body parts, no joint math
    // Origin at feet center, scale for facing direction
    // ================================================================
    draw(ctx) {
        if (this.state === States.DEAD) { this.drawDead(ctx); return; }

        const cx = this.x + this.w / 2;
        const bottomY = this.y + this.h;
        const flash = this.invincible && Math.floor(this.invincibleTimer / 4) % 2 === 0;
        if (flash) ctx.globalAlpha = 0.5;

        ctx.save();
        ctx.translate(cx, bottomY);
        ctx.scale(this.facing, 1);

        const t = this.animTimer;
        const legAnim = this.state === States.RUN ? Math.sin(t * 0.3) * 6 : 0;
        const breathe = Math.sin(t * 0.05) * 0.5;

        if (this.state === States.ROLL) { ctx.restore(); ctx.globalAlpha = 1; this.drawRoll(ctx); return; }
        if (this.state === States.HANG) { ctx.restore(); ctx.globalAlpha = 1; this.drawHang(ctx); return; }
        if (this.state === States.CLIMB) { ctx.restore(); ctx.globalAlpha = 1; this.drawClimb(ctx); return; }

        // Shadow
        ctx.fillStyle = '#00000030';
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Leg angles (radians from vertical) — more forward/back, less lateral spread
        let lLegAngle, rLegAngle, lKneeAngle, rKneeAngle;
        if (isRun) {
            // Increased amplitude for longer strides; sin drives forward/back swing
            lLegAngle = Math.sin(runCycle) * 0.85;
            rLegAngle = Math.sin(runCycle + Math.PI) * 0.85;
            // Natural knee bend: bends more when leg swings back (push-off) and during lift
            // Uses a shifted sin so knee bends at the right phase
            lKneeAngle = 0.15 + Math.max(0, -Math.sin(runCycle - 0.8)) * 1.0;
            rKneeAngle = 0.15 + Math.max(0, -Math.sin(runCycle + Math.PI - 0.8)) * 1.0;
            // Slight foot-contact delay: extra knee bend at foot-plant (adds weight)
            const lPlant = Math.max(0, Math.cos(runCycle) * 0.3);
            const rPlant = Math.max(0, Math.cos(runCycle + Math.PI) * 0.3);
            lKneeAngle += lPlant;
            rKneeAngle += rPlant;
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

        // Calculate leg endpoints (narrow hip spread: 2px each side, not 3)
        const lKneeX = hipX - 2 + Math.sin(lLegAngle) * legLen;
        const lKneeY = hipY + Math.cos(lLegAngle) * legLen;
        const lFootX = lKneeX + Math.sin(lLegAngle + lKneeAngle) * shinLen;
        const lFootY = lKneeY + Math.cos(lLegAngle + lKneeAngle) * shinLen;

        const rKneeX = hipX + 2 + Math.sin(rLegAngle) * legLen;
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
            // Arms swing opposite to legs but with LESS range (0.35 vs legs 0.85)
            lArmAngle = Math.sin(runCycle + Math.PI) * 0.35;
            rArmAngle = Math.sin(runCycle) * 0.35;
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

        const shoulderY = cy + 1 + (isHurt ? -hurtJolt * 0.3 : 0);
        const lShX = cx - 7 + joltX, rShX = cx + 7 + joltX;

        const lElbX = lShX + Math.sin(lArmAngle) * armLen;
        const lElbY = shoulderY + Math.cos(lArmAngle) * armLen;
        const lHandX = lElbX + Math.sin(lArmAngle + lElbowAngle) * foreLen;
        const lHandY = lElbY + Math.cos(lArmAngle + lElbowAngle) * foreLen;

        const rElbX = rShX + Math.sin(rArmAngle) * armLen;
        const rElbY = shoulderY + Math.cos(rArmAngle) * armLen;
        const rHandX = rElbX + Math.sin(rArmAngle + rElbowAngle) * foreLen;
        const rHandY = rElbY + Math.cos(rArmAngle + rElbowAngle) * foreLen;

        // Head position — includes head bob synced with steps, and hurt jolt
        const headX = cx + joltX + (isRun ? bodyLean * 12 : 0);
        const headY = cy - 8 + breathe * 0.3 + headBob
            + (isHurt ? -3 - hurtJolt * 0.5 : 0);

        // === DRAW ORDER (back to front) ===

        // Cape (behind everything)
        Body.cape(ctx, cx, cy, t, isRun ? 3 : 0);

        // Swords on back (only when not attacking)
        if (!isAttack) Body.swordsOnBack(ctx, cx, cy);

        // Back leg (thigh thicker than shin)
        drawLimb(ctx, hipX + 3, hipY, rKneeX, rKneeY, 6, '#2a2018', 4.5);
        drawJoint(ctx, rKneeX, rKneeY, 2.5, '#222');
        drawLimb(ctx, rKneeX, rKneeY, rFootX, rFootY, 4.5, '#2a2018', 3);
        // Boot
        drawBoot(ctx, rFootX, rFootY, 0);

        // Back arm (thicker at shoulder, thinner at wrist)
        drawLimb(ctx, rShX, shoulderY, rElbX, rElbY, 5, '#c09060', 3.5);
        drawJoint(ctx, rElbX, rElbY, 2.2, ARMOR);
        drawLimb(ctx, rElbX, rElbY, rHandX, rHandY, 3.5, '#c09060', 2.5);
        // Gauntlet on back hand
        drawJoint(ctx, rHandX, rHandY, 2.5, '#4a3a2a');

        // Torso (shifted by hurt jolt; lean forward when running)
        ctx.save();
        if (isRun) {
            ctx.translate(cx + joltX, cy);
            ctx.rotate(bodyLean);
            ctx.translate(-(cx + joltX), -cy);
        }
        Body.torso(ctx, cx + joltX, cy, breathe + 0.5);
        if (isRun) ctx.restore(); else ctx.restore();

        // Front leg (thigh thicker than shin)
        drawLimb(ctx, hipX - 3, hipY, lKneeX, lKneeY, 6, ARMOR, 4.5);
        drawJoint(ctx, lKneeX, lKneeY, 2.5, '#222');
        drawLimb(ctx, lKneeX, lKneeY, lFootX, lFootY, 4.5, '#3a2a18', 3);
        // Boot
        drawBoot(ctx, lFootX, lFootY, 0);

        // Dust particles when running (small circles instead of rects)
        if (isRun && Math.sin(runCycle) > 0.8) {
            ctx.fillStyle = 'rgba(150,130,100,0.4)';
            ctx.beginPath(); ctx.arc(lFootX - 1, lFootY + 4, 2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(150,130,100,0.25)';
            ctx.beginPath(); ctx.arc(lFootX + 3, lFootY + 3, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(lFootX - 3, lFootY + 3, 1, 0, Math.PI * 2); ctx.fill();
        }

        // Front arm (thicker at shoulder, thinner at wrist)
        drawLimb(ctx, lShX, shoulderY, lElbX, lElbY, 5, SKIN, 3.5);
        drawJoint(ctx, lElbX, lElbY, 2.2, ARMOR);
        drawLimb(ctx, lElbX, lElbY, lHandX, lHandY, 3.5, SKIN, 2.5);
        // Gauntlet/glove on front hand
        drawJoint(ctx, lHandX, lHandY, 2.8, '#4a3a2a');
        // Skin of fingers peeking out
        drawJoint(ctx, lHandX + 0.5, lHandY + 1, 1.2, SKIN);

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
        const progress = 1 - this.stateTimer / 10;
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

        // Tip effect: glow aura + sparkle/ember during active swing (Lovable technique)
        if (progress > 0.15 && progress < 0.75) {
            const intensity = 1 - Math.abs(progress - 0.45) * 2.5;
            const clampedI = Math.max(0, Math.min(1, intensity));
            if (isSilver) {
                // Radial glow at tip
                const tipGlow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 8);
                tipGlow.addColorStop(0, 'rgba(180,210,255,' + (0.4 * clampedI) + ')');
                tipGlow.addColorStop(1, 'rgba(180,210,255,0)');
                ctx.fillStyle = tipGlow;
                ctx.fillRect(tipX - 8, tipY - 8, 16, 16);
                // Bright core spark
                ctx.fillStyle = '#ddeeff';
                ctx.globalAlpha = 0.7 * clampedI;
                ctx.beginPath();
                ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Warm ember glow at tip
                const tipGlow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 8);
                tipGlow.addColorStop(0, 'rgba(255,160,60,' + (0.35 * clampedI) + ')');
                tipGlow.addColorStop(1, 'rgba(255,100,20,0)');
                ctx.fillStyle = tipGlow;
                ctx.fillRect(tipX - 8, tipY - 8, 16, 16);
                // Core ember
                ctx.fillStyle = '#ffcc44';
                ctx.globalAlpha = 0.6 * clampedI;
                ctx.beginPath();
                ctx.arc(tipX, tipY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    drawHang(ctx, cx, cy, t) {
        const breathe = wave(t, 0.06, 1.5);

        // Cape behind
        Body.cape(ctx, cx, cy, t, 0);

        // Body hangs lower — torso shifted down
        const bodyY = cy + 8;

        // Arms reaching up to ledge
        const lShX = cx - 7, rShX = cx + 7;
        const shoulderY = bodyY;
        // Hands grip the ledge above (at roughly cy - 8)
        const ledgeY = cy - 10;
        const lHandX = cx - 6, lHandY = ledgeY;
        const rHandX = cx + 6, rHandY = ledgeY;
        // Elbows between shoulders and hands
        const lElbX = lShX - 2, lElbY = shoulderY - 8;
        const rElbX = rShX + 2, rElbY = shoulderY - 8;

        // Back arm
        drawLimb(ctx, rShX, shoulderY, rElbX, rElbY, 5, '#c09060', 3.5);
        drawJoint(ctx, rElbX, rElbY, 2.2, ARMOR);
        drawLimb(ctx, rElbX, rElbY, rHandX, rHandY, 3.5, '#c09060', 2.5);
        drawJoint(ctx, rHandX, rHandY, 2.5, '#4a3a2a');

        // Torso (stretched)
        Body.torso(ctx, cx, bodyY, 0.5);

        // Legs dangling — slight sway
        const sway = breathe * 0.5;
        const hipY = bodyY + 16;
        const lKneeX = cx - 4 + sway, lKneeY = hipY + 12;
        const lFootX = cx - 5 + sway * 1.5, lFootY = hipY + 24;
        const rKneeX = cx + 4 + sway, rKneeY = hipY + 11;
        const rFootX = cx + 3 + sway * 1.5, rFootY = hipY + 23;

        // Back leg
        drawLimb(ctx, cx + 3, hipY, rKneeX, rKneeY, 6, '#2a2018', 4.5);
        drawJoint(ctx, rKneeX, rKneeY, 2.5, '#222');
        drawLimb(ctx, rKneeX, rKneeY, rFootX, rFootY, 4.5, '#2a2018', 3);
        drawBoot(ctx, rFootX, rFootY, 0);

        // Front leg
        drawLimb(ctx, cx - 3, hipY, lKneeX, lKneeY, 6, ARMOR, 4.5);
        drawJoint(ctx, lKneeX, lKneeY, 2.5, '#222');
        drawLimb(ctx, lKneeX, lKneeY, lFootX, lFootY, 4.5, '#3a2a18', 3);
        drawBoot(ctx, lFootX, lFootY, 0);

        // Front arm
        drawLimb(ctx, lShX, shoulderY, lElbX, lElbY, 5, SKIN, 3.5);
        drawJoint(ctx, lElbX, lElbY, 2.2, ARMOR);
        drawLimb(ctx, lElbX, lElbY, lHandX, lHandY, 3.5, SKIN, 2.5);
        drawJoint(ctx, lHandX, lHandY, 2.8, '#4a3a2a');

        // Fingers gripping ledge
        ctx.fillStyle = SKIN;
        ctx.fillRect(lHandX - 2, lHandY - 1, 4, 2);
        ctx.fillRect(rHandX - 2, rHandY - 1, 4, 2);

        // Head
        const headY = bodyY - 10 + breathe * 0.3;
        Body.head(ctx, cx - 2, headY, t, States.HANG);
    }

    drawClimb(ctx, cx, cy, t) {
        const progress = 1 - (this.stateTimer / 12);
        // Body rises from hanging position to standing on platform
        const bodyY = cy + 8 - progress * 22;
        const armLift = Math.min(progress * 2, 1); // arms push down first half

        // Cape behind
        Body.cape(ctx, cx, cy - progress * 15, t, 1);

        const shoulderY = bodyY;
        const lShX = cx - 7, rShX = cx + 7;
        const ledgeY = cy - 10;

        // Arms transition: from gripping ledge to pushing down on it
        var lHandY, rHandY, lElbY, rElbY;
        if (progress < 0.5) {
            // Pushing up phase — hands on ledge, arms straighten
            lHandY = ledgeY;
            rHandY = ledgeY;
            lElbY = ledgeY + (shoulderY - ledgeY) * (1 - armLift);
            rElbY = ledgeY + (shoulderY - ledgeY) * (1 - armLift);
        } else {
            // Swinging legs up phase — hands release, arms come to sides
            var lateProgress = (progress - 0.5) * 2;
            lHandY = ledgeY + lateProgress * 10;
            rHandY = ledgeY + lateProgress * 10;
            lElbY = ledgeY + lateProgress * 5;
            rElbY = ledgeY + lateProgress * 5;
        }

        var lHandX = cx - 6, rHandX = cx + 6;
        var lElbX = lShX - 2, rElbX = rShX + 2;

        // Back arm
        drawLimb(ctx, rShX, shoulderY, rElbX, rElbY, 5, '#c09060', 3.5);
        drawJoint(ctx, rElbX, rElbY, 2.2, ARMOR);
        drawLimb(ctx, rElbX, rElbY, rHandX, rHandY, 3.5, '#c09060', 2.5);
        drawJoint(ctx, rHandX, rHandY, 2.5, '#4a3a2a');

        // Torso
        Body.torso(ctx, cx, bodyY, 0.5);

        // Legs — tuck up during climb, then extend down
        const hipY = bodyY + 16;
        var legTuck = progress < 0.6 ? progress / 0.6 : 1 - (progress - 0.6) / 0.4;
        var kneeUp = legTuck * 10;
        var lKneeX = cx - 3, lKneeY = hipY + 12 - kneeUp;
        var lFootX = cx - 4, lFootY = hipY + 24 - kneeUp * 1.5;
        var rKneeX = cx + 3, rKneeY = hipY + 11 - kneeUp;
        var rFootX = cx + 2, rFootY = hipY + 23 - kneeUp * 1.5;

        // Back leg
        drawLimb(ctx, cx + 3, hipY, rKneeX, rKneeY, 6, '#2a2018', 4.5);
        drawJoint(ctx, rKneeX, rKneeY, 2.5, '#222');
        drawLimb(ctx, rKneeX, rKneeY, rFootX, rFootY, 4.5, '#2a2018', 3);
        drawBoot(ctx, rFootX, rFootY, 0);

        // Front leg
        drawLimb(ctx, cx - 3, hipY, lKneeX, lKneeY, 6, ARMOR, 4.5);
        drawJoint(ctx, lKneeX, lKneeY, 2.5, '#222');
        drawLimb(ctx, lKneeX, lKneeY, lFootX, lFootY, 4.5, '#3a2a18', 3);
        drawBoot(ctx, lFootX, lFootY, 0);

        // Front arm
        drawLimb(ctx, lShX, shoulderY, lElbX, lElbY, 5, SKIN, 3.5);
        drawJoint(ctx, lElbX, lElbY, 2.2, ARMOR);
        drawLimb(ctx, lElbX, lElbY, lHandX, lHandY, 3.5, SKIN, 2.5);
        drawJoint(ctx, lHandX, lHandY, 2.8, '#4a3a2a');

        // Head
        const headY = bodyY - 10;
        Body.head(ctx, cx - 2, headY, t, States.CLIMB);
    }
};

})();
