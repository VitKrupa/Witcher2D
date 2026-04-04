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

// Pixel art sprite data for Geralt (20 wide x 28 tall, 2px per pixel = 40x56)
// null = transparent, colors reference W.Colors keys
const C = W.Colors;
const _ = null;
const W_ = C.WHITE_HAIR;
const SK = C.SKIN;
const DL = C.DARK_LEATHER;
const LE = C.LEATHER;
const YE = C.YELLOW_EYES;
const BT = '#2a1a0a'; // boot
const MT = '#888'; // metal/buckle
const MD = C.WITCHER_GOLD; // medallion
const SB = C.SILVER_BLADE; // silver sword hilt
const IB = C.IRON_BLADE;   // iron sword hilt

// Idle frame 1
const IDLE_1 = [
    [_,_,_,_,_,_,_,W_,W_,W_,W_,W_,W_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,W_,W_,W_,W_,W_,W_,W_,W_,_,_,_,_,_,_],
    [_,_,_,_,_,_,W_,SK,SK,SK,SK,SK,SK,W_,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,SK,YE,SK,SK,YE,SK,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,SK,SK,SK,SK,SK,SK,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,SK,SK,'#8a6a4a',SK,SK,SK,_,_,_,_,_,_,_],
    [_,_,_,_,_,SB,_,_,DL,DL,DL,DL,_,_,IB,_,_,_,_,_],
    [_,_,_,_,_,SB,_,DL,DL,DL,DL,DL,DL,_,IB,_,_,_,_,_],
    [_,_,_,_,_,SB,SK,DL,DL,MD,DL,DL,DL,SK,IB,_,_,_,_,_],
    [_,_,_,_,_,_,SK,DL,DL,DL,DL,DL,DL,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,DL,LE,LE,LE,LE,DL,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,LE,LE,LE,LE,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,LE,LE,LE,LE,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,DL,DL,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,LE,LE,MT,LE,LE,LE,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,_,_,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,_,_,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,_,_,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,BT,BT,_,_,BT,BT,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,BT,BT,_,_,BT,BT,_,_,_,_,_,_,_],
];

// Idle frame 2 (head bobs down 1 pixel - breathing)
const IDLE_2 = [
    [_,_,_,_,_,_,_,_,W_,W_,W_,W_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,W_,W_,W_,W_,W_,W_,W_,W_,_,_,_,_,_,_],
    [_,_,_,_,_,_,W_,SK,SK,SK,SK,SK,SK,W_,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,SK,YE,SK,SK,YE,SK,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,SK,SK,SK,SK,SK,SK,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,SK,SK,'#8a6a4a',SK,SK,SK,_,_,_,_,_,_,_],
    [_,_,_,_,_,SB,_,_,DL,DL,DL,DL,_,_,IB,_,_,_,_,_],
    [_,_,_,_,_,SB,_,DL,DL,DL,DL,DL,DL,_,IB,_,_,_,_,_],
    [_,_,_,_,_,SB,SK,DL,DL,MD,DL,DL,DL,SK,IB,_,_,_,_,_],
    [_,_,_,_,_,_,SK,DL,DL,DL,DL,DL,DL,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,DL,LE,LE,LE,LE,DL,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,LE,LE,LE,LE,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,LE,LE,LE,LE,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,DL,DL,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,LE,LE,MT,LE,LE,LE,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,_,_,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,_,_,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,_,_,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,BT,BT,_,_,BT,BT,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,BT,BT,_,_,BT,BT,_,_,_,_,_,_,_],
];

// Run frames (4 frames with leg movement)
const RUN_1 = [
    [_,_,_,_,_,_,_,W_,W_,W_,W_,W_,W_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,W_,W_,W_,W_,W_,W_,W_,W_,_,_,_,_,_,_],
    [_,_,_,_,_,_,W_,SK,SK,SK,SK,SK,SK,W_,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,SK,YE,SK,SK,YE,SK,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,SK,SK,SK,SK,SK,SK,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,SK,SK,SK,SK,SK,SK,_,_,_,_,_,_,_],
    [_,_,_,_,_,SB,SK,_,DL,DL,DL,DL,_,_,IB,_,_,_,_,_],
    [_,_,_,_,_,SB,_,DL,DL,DL,DL,DL,DL,SK,IB,_,_,_,_,_],
    [_,_,_,_,_,SB,_,DL,DL,MD,DL,DL,DL,_,IB,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,DL,DL,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,LE,LE,LE,LE,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,LE,LE,LE,LE,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,DL,DL,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,LE,LE,MT,LE,LE,LE,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,DL,_,DL,DL,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,DL,_,DL,_,_,DL,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,DL,_,_,DL,_,_,_,DL,_,_,_,_,_,_,_],
    [_,_,_,_,BT,_,_,_,BT,_,_,_,_,BT,_,_,_,_,_,_],
    [_,_,_,_,BT,_,_,_,_,_,_,_,_,BT,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const RUN_2 = [
    [_,_,_,_,_,_,_,W_,W_,W_,W_,W_,W_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,W_,W_,W_,W_,W_,W_,W_,W_,_,_,_,_,_,_],
    [_,_,_,_,_,_,W_,SK,SK,SK,SK,SK,SK,W_,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,SK,YE,SK,SK,YE,SK,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,SK,SK,SK,SK,SK,SK,SK,SK,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,SK,SK,SK,SK,SK,SK,_,_,_,_,_,_,_],
    [_,_,_,_,_,SB,SK,_,DL,DL,DL,DL,_,SK,IB,_,_,_,_,_],
    [_,_,_,_,_,SB,_,DL,DL,DL,DL,DL,DL,_,IB,_,_,_,_,_],
    [_,_,_,_,_,SB,_,DL,DL,MD,DL,DL,DL,_,IB,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,DL,DL,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,LE,LE,LE,LE,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,LE,LE,LE,LE,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,DL,DL,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,LE,LE,MT,LE,LE,LE,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,DL,DL,_,_,DL,DL,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,DL,_,_,DL,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,BT,BT,_,_,BT,BT,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,BT,_,_,_,_,BT,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

W.Player = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 56;
        this.vx = 0;
        this.vy = 0;
        this.speed = 3.2;
        this.jumpForce = -9.5;
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
        this.rollSpeed = 5.5;
        this.comboCount = 0;
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
            this.vx = -this.speed * 0.7;
            this.facing = -1;
        } else if (keys['d'] || keys['arrowright']) {
            this.vx = this.speed * 0.7;
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

        // Invincibility flicker
        if (this.invincible && Math.floor(this.animTimer) % 3 === 0) {
            ctx.globalAlpha = 0.4;
        }

        const px = 2; // pixel size
        const drawX = this.facing === 1 ? this.x : this.x;
        const drawY = this.y;

        // Choose sprite frame
        let sprite;
        switch (this.state) {
            case States.IDLE:
                sprite = this.animFrame % 2 === 0 ? IDLE_1 : IDLE_2;
                break;
            case States.RUN:
                sprite = this.animFrame % 2 === 0 ? RUN_1 : RUN_2;
                break;
            case States.ATTACK:
                sprite = IDLE_1; // base body during attack
                break;
            case States.ROLL:
                this.drawRoll(ctx, drawX, drawY);
                ctx.restore();
                return;
            default:
                sprite = IDLE_1;
        }

        // Draw mirrored if facing left
        if (this.facing === -1) {
            ctx.save();
            ctx.translate(this.x + this.w / 2, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(this.x + this.w / 2), 0);
        }

        // Draw pixel grid
        W.Draw.pixelGrid(ctx, this.x, drawY, px, sprite);

        if (this.facing === -1) ctx.restore();

        // Draw sword swing effect during attack
        if (this.state === States.ATTACK) {
            this.drawSwordSwing(ctx);
        }

        // Ground shadow
        W.Draw.shadow(ctx, this.x + this.w / 2, this.y + this.h + 2, this.w * 0.7);

        ctx.restore();
    }

    drawRoll(ctx, x, y) {
        // Draw as a rolling ball shape
        const cx = x + this.w / 2;
        const cy = y + this.h / 2 + 8;
        const r = 14;
        const angle = this.animTimer * 0.5;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle * this.facing);

        // Body ball
        ctx.fillStyle = DL;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Hair flash
        ctx.fillStyle = W_;
        ctx.beginPath();
        ctx.arc(-4, -8, 5, 0, Math.PI * 2);
        ctx.fill();

        // Leather detail
        ctx.fillStyle = LE;
        ctx.fillRect(-6, -3, 12, 6);

        ctx.restore();
    }

    drawSwordSwing(ctx) {
        const progress = 1 - (this.stateTimer / 22);
        const isSilver = this.activeSword === 'silver';

        const cx = this.x + this.w / 2;
        const cy = this.y + 15;

        // Sword blade
        const swordLen = 35;
        const startAngle = -Math.PI * 0.7;
        const swingRange = Math.PI * 1.2;
        const currentAngle = startAngle + swingRange * progress;

        const tipX = cx + Math.cos(currentAngle) * swordLen * this.facing;
        const tipY = cy + Math.sin(currentAngle) * swordLen;

        // Sword line
        ctx.strokeStyle = isSilver ? C.SILVER_BLADE : C.IRON_BLADE;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx + this.facing * 8, cy);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Glow
        ctx.strokeStyle = isSilver ? C.SILVER_GLOW : C.IRON_GLOW;
        ctx.lineWidth = 6;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(cx + this.facing * 8, cy);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Slash arc trail
        if (progress > 0.2 && progress < 0.8) {
            ctx.strokeStyle = isSilver ? C.SILVER_TRAIL : C.IRON_TRAIL;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.6 * (1 - progress);
            ctx.beginPath();
            const arcStart = startAngle + swingRange * 0.2;
            const arcEnd = currentAngle;
            if (this.facing === 1) {
                ctx.arc(cx, cy, swordLen - 3, arcStart, arcEnd);
            } else {
                ctx.arc(cx, cy, swordLen - 3, Math.PI - arcEnd, Math.PI - arcStart);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
};

})();
