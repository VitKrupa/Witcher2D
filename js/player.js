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

// Draw the full Geralt body (Lovable-style) relative to origin at feet.
// Used by draw(), drawHang(), drawClimb() to avoid duplication.
function drawGeraltBody(ctx, legAnim, breathe, attackTimer, activeSword, state, flash) {
    // Boots
    ctx.fillStyle = '#1a1a22';
    drawRoundRect(ctx, -7, -4, 6, 4, 1);
    drawRoundRect(ctx, 1, -4 + Math.abs(legAnim) * 0.2, 6, 4, 1);

    // Legs - dark trousers
    ctx.fillStyle = '#1e1e2a';
    drawRoundRect(ctx, -6, -16, 5, 13, 1);
    drawRoundRect(ctx, 1, -16 + legAnim * 0.5, 5, 13 - Math.abs(legAnim) * 0.3, 1);

    // Body - dark leather armor
    ctx.fillStyle = '#252538';
    drawRoundRect(ctx, -9, -32 + breathe, 18, 18, 2);

    // Armor detail - chest piece
    ctx.fillStyle = '#303048';
    drawRoundRect(ctx, -7, -30 + breathe, 14, 10, 1);

    // Shoulder pauldrons
    ctx.fillStyle = '#2a2a40';
    drawRoundRect(ctx, -10, -32 + breathe, 5, 6, 2);
    drawRoundRect(ctx, 5, -32 + breathe, 5, 6, 2);

    // Armor studs (rivets)
    ctx.fillStyle = '#606080';
    for (var i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(-4 + i * 4, -26 + breathe, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    // Belt
    ctx.fillStyle = '#3a2a1a';
    drawRoundRect(ctx, -9, -15, 18, 3, 1);
    // Belt buckle
    ctx.fillStyle = GOLD;
    drawRoundRect(ctx, -2, -15, 4, 3, 1);

    // Neck
    ctx.fillStyle = '#d0c4b0';
    drawRoundRect(ctx, -3, -35 + breathe, 6, 4, 1);

    // Head
    ctx.fillStyle = '#dbd0c0';
    drawRoundRect(ctx, -6, -42, 12, 10, 3);

    // White hair - top
    ctx.fillStyle = '#e0ddd4';
    drawRoundRect(ctx, -7, -44, 14, 6, 3);
    // Side hair
    drawRoundRect(ctx, 5, -42, 3, 10, 1);
    // Ponytail
    ctx.fillStyle = '#d0ccc0';
    drawRoundRect(ctx, 6, -40, 2, 8, 1);
    drawRoundRect(ctx, 7, -34, 2, 5, 1);

    // Eyes (dark sockets)
    ctx.fillStyle = '#111';
    drawRoundRect(ctx, -3, -38, 3, 2, 1);
    drawRoundRect(ctx, 1, -38, 3, 2, 1);
    // Amber pupils
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-2, -38, 1.5, 1.5);
    ctx.fillRect(2, -38, 1.5, 1.5);

    // Scar (left eye)
    ctx.strokeStyle = '#aa6666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -41);
    ctx.lineTo(-1, -37);
    ctx.lineTo(0, -33);
    ctx.stroke();

    // Stubble
    ctx.fillStyle = '#c0b8a840';
    drawRoundRect(ctx, -4, -34, 8, 2, 1);

    // Sword rendering
    var ironColor = '#6a6058';
    var ironGlow = '#8a7868';
    var silverColor = '#c0c8d8';
    var silverGlow = '#e0e8f8';
    var swordColor = activeSword === 'silver' ? silverColor : ironColor;
    var swordGlowColor = activeSword === 'silver' ? silverGlow : ironGlow;

    if (state === States.ATTACK) {
        var angle = -Math.PI / 4 + (attackTimer / 15) * Math.PI * 0.8;
        ctx.save();
        ctx.translate(5, -28);
        ctx.rotate(angle);
        // Blade
        ctx.fillStyle = swordColor;
        drawRoundRect(ctx, -1.5, -30, 3, 30, 1);
        // Blade edge highlight
        ctx.fillStyle = swordGlowColor;
        ctx.fillRect(-1.5, -30, 1, 8);
        // Guard
        ctx.fillStyle = activeSword === 'silver' ? '#888' : GOLD;
        drawRoundRect(ctx, -4, -2, 8, 3, 1);
        // Grip
        ctx.fillStyle = activeSword === 'silver' ? '#2a2a3a' : '#3a2a1a';
        drawRoundRect(ctx, -1.5, 1, 3, 7, 1);
        // Pommel
        ctx.fillStyle = activeSword === 'silver' ? '#999' : GOLD;
        ctx.beginPath();
        ctx.arc(0, 9, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else {
        // Both swords on back
        ctx.save();
        ctx.translate(-4, -42);
        ctx.rotate(-0.2);
        // Silver sword
        ctx.fillStyle = silverColor;
        drawRoundRect(ctx, -1, -22, 2, 22, 1);
        ctx.fillStyle = '#888';
        drawRoundRect(ctx, -2.5, -1, 5, 2, 1);
        ctx.restore();
        ctx.save();
        ctx.translate(-6, -40);
        ctx.rotate(-0.3);
        // Iron sword
        ctx.fillStyle = ironColor;
        drawRoundRect(ctx, -1, -20, 2, 20, 1);
        ctx.fillStyle = GOLD;
        drawRoundRect(ctx, -2.5, -1, 5, 2, 1);
        ctx.restore();
    }

    // Witcher medallion
    var time = Date.now() * 0.003;
    var medalGlow = 0.5 + Math.sin(time) * 0.2;
    ctx.globalAlpha = flash ? 0.5 : medalGlow;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(0, -30 + breathe, 3, 0, Math.PI * 2);
    ctx.fill();
    // Chain
    ctx.strokeStyle = '#aa8800';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-2, -33 + breathe);
    ctx.lineTo(0, -30 + breathe);
    ctx.lineTo(2, -33 + breathe);
    ctx.stroke();
    ctx.globalAlpha = flash ? 0.5 : 1;
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

        // Draw full body
        var atkTimer = this.state === States.ATTACK ? this.stateTimer : 0;
        drawGeraltBody(ctx, legAnim, breathe, atkTimer, this.activeSword, this.state, flash);

        ctx.restore();
        ctx.globalAlpha = 1;
    }

    drawRoll(ctx) {
        const cx = this.x + this.w / 2;
        const bottomY = this.y + this.h;
        const progress = 1 - this.stateTimer / 10;
        const angle = progress * Math.PI * 2 * this.facing;
        const r = 14;

        ctx.save();
        ctx.translate(cx, bottomY - r);
        ctx.rotate(angle);

        // Body ball — dark armor
        ctx.fillStyle = '#252538';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Hair streak
        ctx.fillStyle = '#e0ddd4';
        drawRoundRect(ctx, -3, -r + 2, 6, 4, 2);

        // Leather detail
        ctx.fillStyle = '#303048';
        drawRoundRect(ctx, -5, -2, 10, 4, 1);

        // Belt flash
        ctx.fillStyle = '#3a2a1a';
        drawRoundRect(ctx, -6, 1, 12, 2, 1);

        ctx.restore();

        // Dust on ground
        ctx.fillStyle = 'rgba(150,130,100,0.5)';
        ctx.beginPath();
        ctx.ellipse(cx, bottomY, 8, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawDead(ctx) {
        const cx = this.x + this.w / 2;
        const groundY = this.y + this.h;

        ctx.save();
        ctx.translate(cx, groundY);

        // Collapsed body on ground (sideways)
        ctx.fillStyle = '#252538';
        drawRoundRect(ctx, -16, -8, 32, 8, 2);
        // Armor detail
        ctx.fillStyle = '#303048';
        drawRoundRect(ctx, -12, -7, 24, 5, 1);
        // Head
        ctx.fillStyle = '#dbd0c0';
        drawRoundRect(ctx, -20, -10, 10, 8, 3);
        // Hair
        ctx.fillStyle = '#e0ddd4';
        drawRoundRect(ctx, -22, -11, 8, 4, 2);
        // Legs
        ctx.fillStyle = '#1e1e2a';
        drawRoundRect(ctx, 10, -6, 12, 5, 1);
        // Boots
        ctx.fillStyle = '#1a1a22';
        drawRoundRect(ctx, 20, -5, 6, 4, 1);

        ctx.restore();
    }

    drawHang(ctx) {
        const cx = this.x + this.w / 2;
        const bottomY = this.y + this.h;
        const flash = this.invincible && Math.floor(this.invincibleTimer / 4) % 2 === 0;
        if (flash) ctx.globalAlpha = 0.5;

        ctx.save();
        ctx.translate(cx, bottomY);
        ctx.scale(this.facing, 1);

        const t = this.animTimer;
        const sway = Math.sin(t * 0.06) * 1.5;
        const breathe = Math.sin(t * 0.05) * 0.5;

        // Arms reaching up (above origin, which is at feet)
        // Player hangs so feet are lower — body stretched
        ctx.fillStyle = '#d0c4b0';
        drawRoundRect(ctx, -8, -52, 4, 12, 1);  // left arm
        drawRoundRect(ctx, 4, -52, 4, 12, 1);   // right arm
        // Hands gripping ledge
        ctx.fillStyle = '#dbd0c0';
        drawRoundRect(ctx, -9, -54, 5, 3, 1);
        drawRoundRect(ctx, 4, -54, 5, 3, 1);

        // Draw body (no leg anim while hanging, slight sway via breathe)
        drawGeraltBody(ctx, sway, breathe, 0, this.activeSword, States.HANG, flash);

        ctx.restore();
        ctx.globalAlpha = 1;
    }

    drawClimb(ctx) {
        const cx = this.x + this.w / 2;
        const bottomY = this.y + this.h;
        const flash = this.invincible && Math.floor(this.invincibleTimer / 4) % 2 === 0;
        if (flash) ctx.globalAlpha = 0.5;

        const progress = 1 - (this.stateTimer / 12);

        ctx.save();
        ctx.translate(cx, bottomY);
        ctx.scale(this.facing, 1);

        const t = this.animTimer;
        const breathe = Math.sin(t * 0.05) * 0.5;

        // Arms pushing down as body rises — transition from hang to stand
        var armY = -52 + progress * 20;
        ctx.fillStyle = '#d0c4b0';
        drawRoundRect(ctx, -8, armY, 4, 12 - progress * 6, 1);
        drawRoundRect(ctx, 4, armY, 4, 12 - progress * 6, 1);

        // Legs tuck up then extend — simple offset
        var legTuck = progress < 0.5 ? progress * 8 : (1 - progress) * 8;
        drawGeraltBody(ctx, legTuck, breathe, 0, this.activeSword, States.CLIMB, flash);

        ctx.restore();
        ctx.globalAlpha = 1;
    }
};

})();
