(function() {
'use strict';

W.Enemy = class {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.w = config.w || 32;
        this.h = config.h || 52;
        this.vx = 0;
        this.vy = 0;
        this.hp = config.hp || 40;
        this.maxHp = this.hp;
        this.damage = config.damage || 8;
        this.speed = config.speed || 1.5;
        this.attackRange = config.attackRange || 40;
        this.attackCooldown = config.attackCooldown || 60;
        this.attackTimer = 0;
        this.category = config.category; // 'creature' or 'human'
        this.state = 'idle'; // idle, chase, attack, hit, dead
        this.facing = -1;
        this.animFrame = 0;
        this.animTimer = 0;
        this.stateTimer = 0;
        this.scoreLoot = config.scoreLoot || 50;
        this.name = config.name || 'Enemy';
        this.onGround = false;
        this.aggroRange = config.aggroRange || 300;
        this.gravity = config.gravity !== undefined ? config.gravity : true;
        this.knockbackVx = 0;
    }

    get alive() { return this.hp > 0; }
    get hitbox() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
    get attackBox() {
        if (this.state !== 'attack' || this.stateTimer > 15 || this.stateTimer < 3) return null;
        const ax = this.facing === 1 ? this.x + this.w : this.x - this.attackRange;
        return { x: ax, y: this.y + 5, w: this.attackRange, h: this.h - 10 };
    }

    takeDamage(amount, swordType) {
        const effective = (swordType === 'silver' && this.category === 'creature') ||
                         (swordType === 'iron' && this.category === 'human');
        const dmg = effective ? amount : Math.floor(amount * 0.33);
        this.hp -= dmg;
        this.knockbackVx = this.facing * -3;
        if (this.hp <= 0) {
            this.hp = 0;
            this.state = 'dead';
            this.stateTimer = 30; // initialize fade-out timer for draw()
            return { result: 'dead', dmg, effective };
        }
        this.state = 'hit';
        this.stateTimer = 10;
        return { result: 'hit', dmg, effective };
    }

    update(dt, playerX, playerY, platforms) {
        const spd = dt * 60;
        this.animTimer += spd;
        if (this.animTimer > 10) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }

        // Knockback decay
        if (this.knockbackVx) {
            this.x += this.knockbackVx * spd;
            this.knockbackVx *= 0.85;
            if (Math.abs(this.knockbackVx) < 0.1) this.knockbackVx = 0;
        }

        if (this.state === 'dead') return;
        if (this.state === 'hit') {
            this.stateTimer -= spd;
            if (this.stateTimer <= 0) this.state = 'chase';
            return;
        }

        // Face player
        if (playerX > this.x + this.w / 2) this.facing = 1;
        else this.facing = -1;

        const dist = Math.abs(playerX - (this.x + this.w / 2));

        // State transitions
        if (this.state === 'attack') {
            this.stateTimer -= spd;
            if (this.stateTimer <= 0) {
                this.state = 'chase';
                this.attackTimer = this.attackCooldown;
            }
            return;
        }

        this.attackTimer -= spd;

        if (dist < this.attackRange + 10 && this.attackTimer <= 0) {
            this.state = 'attack';
            this.stateTimer = 20;
            this.vx = 0;
        } else if (dist < this.aggroRange) {
            this.state = 'chase';
            this.vx = this.facing * this.speed;
        } else {
            this.state = 'idle';
            this.vx = 0;
        }

        this.x += this.vx * spd;

        // Gravity & platforms
        if (this.gravity) {
            this.vy += W.GRAVITY * spd;
            if (this.vy > 10) this.vy = 10;
            this.y += this.vy * spd;
            this.onGround = false;
            for (const p of platforms) {
                const pr = p.rect || p;
                if (this.x + this.w > pr.x && this.x < pr.x + pr.w) {
                    if (this.vy >= 0 && this.y + this.h > pr.y && this.y + this.h < pr.y + pr.h + 10) {
                        this.y = pr.y - this.h;
                        this.vy = 0;
                        this.onGround = true;
                    }
                }
            }
        }
    }

    draw(ctx) {
        if (this.state === 'dead') {
            ctx.globalAlpha = Math.max(0, this.stateTimer / 30);
            this.drawBody(ctx);
            ctx.globalAlpha = 1;
            this.stateTimer -= 0.5;
            return;
        }
        this.drawBody(ctx);
        // Health bar
        if (this.hp < this.maxHp) {
            const bw = this.w + 10, bh = 4;
            const bx = this.x - 5, by = this.y - 10;
            ctx.fillStyle = '#333';
            ctx.fillRect(bx, by, bw, bh);
            ctx.fillStyle = this.category === 'creature' ? '#8888dd' : '#cc8844';
            ctx.fillRect(bx, by, bw * (this.hp / this.maxHp), bh);
        }
    }

    // Helper: draw a thick rounded limb between two points
    _drawLimb(ctx, x1, y1, x2, y2, width, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // Helper: draw a two-segment limb (upper + lower) with a knee/elbow joint
    _drawJointedLimb(ctx, x1, y1, midX, midY, x2, y2, width, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(midX, midY);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    drawBody(ctx) { /* override in subclass */ }
};
})();
