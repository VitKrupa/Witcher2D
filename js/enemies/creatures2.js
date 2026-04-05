(function() {
'use strict';
const C = W.Colors;

// GHOUL - fast, hunched beast with exposed bones. Weak to SILVER.
W.Ghoul = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 36, h: 48, hp: 50, damage: 10, speed: 1.8,
            attackRange: 40, attackCooldown: 45, category: 'creature',
            scoreLoot: 70, name: 'Ghoul', aggroRange: 320
        });
    }
    update(dt, px, py, platforms) {
        super.update(dt, px, py, platforms);
        // Leaping attack - jump toward player when in range
        if (this.state === 'chase' && this.onGround) {
            const dist = Math.abs(px - this.x);
            if (dist < 150 && dist > 60 && Math.random() < 0.02) {
                this.vy = -8; this.vx = this.facing * 4;
            }
        }
    }
    drawBody(ctx) {
        const dr = W.drawRoundRect;
        if (this._t === undefined) this._t = 0;
        this._t += 0.15;
        const t = this._t;
        const isHit = this.state === 'hit';
        const isHurt = isHit;
        const bodyColor = isHurt ? '#aa6666' : '#6a2a2a';
        const darkColor = isHurt ? '#884444' : '#3a1a1a';

        const cx = this.x + this.w / 2;
        const bottomY = this.y + this.h;
        const bobAnim = Math.sin(t * 0.1) * 1.5;

        ctx.save();
        ctx.translate(cx, bottomY);
        ctx.scale(this.facing, 1);

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha *= 0.5;

        // Shadow
        ctx.fillStyle = '#00000025';
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Blood drips
        ctx.fillStyle = '#5c3a3a40';
        ctx.beginPath();
        ctx.ellipse(3, -2, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs (muscular)
        ctx.fillStyle = darkColor;
        dr(ctx, -7, -12, 6, 12, 2);
        dr(ctx, 1, -12, 6, 12, 2);
        // Talons
        ctx.fillStyle = '#2a0a0a';
        dr(ctx, -8, -2, 7, 2, 1);
        dr(ctx, 1, -2, 7, 2, 1);

        // Body (hunched, massive)
        ctx.fillStyle = bodyColor;
        dr(ctx, -10, -34 + bobAnim, 20, 24, 3);
        // Muscle ridges
        ctx.fillStyle = '#aa666630';
        dr(ctx, -7, -30 + bobAnim, 14, 3, 1);
        dr(ctx, -6, -22 + bobAnim, 12, 3, 1);

        // Head (bestial)
        ctx.fillStyle = bodyColor;
        dr(ctx, -8, -44 + bobAnim, 16, 12, 4);

        // Horns
        ctx.fillStyle = '#4a2a2a';
        ctx.beginPath();
        ctx.moveTo(-7, -42 + bobAnim);
        ctx.lineTo(-10, -50 + bobAnim);
        ctx.lineTo(-5, -44 + bobAnim);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(7, -42 + bobAnim);
        ctx.lineTo(10, -50 + bobAnim);
        ctx.lineTo(5, -44 + bobAnim);
        ctx.fill();

        // Glowing eyes
        ctx.fillStyle = '#ff3333';
        ctx.beginPath();
        ctx.arc(1, -39 + bobAnim, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff8888';
        ctx.beginPath();
        ctx.arc(1.5, -39.5 + bobAnim, 1, 0, Math.PI * 2);
        ctx.fill();
        // Eye glow effect
        ctx.fillStyle = '#ff000018';
        ctx.beginPath();
        ctx.arc(1, -39 + bobAnim, 8, 0, Math.PI * 2);
        ctx.fill();

        // Jaw with prominent teeth
        ctx.fillStyle = '#2a1010';
        dr(ctx, -6, -34 + bobAnim, 12, 4, 2);
        ctx.fillStyle = '#dddddd90';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(-4 + i * 2.5, -32 + bobAnim);
            ctx.lineTo(-3 + i * 2.5, -29 + bobAnim);
            ctx.lineTo(-2 + i * 2.5, -32 + bobAnim);
            ctx.fill();
        }

        // Large claws
        ctx.strokeStyle = '#4a2020';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(9, -30 + bobAnim + i * 4);
            ctx.quadraticCurveTo(16, -32 + bobAnim + i * 4, 14, -27 + bobAnim + i * 4);
            ctx.stroke();
        }

        ctx.restore();
    }
};

// WRAITH - translucent floating ghost. Weak to SILVER. Does NOT use gravity.
W.Wraith = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 32, h: 54, hp: 60, damage: 12, speed: 1.5,
            attackRange: 45, attackCooldown: 70, category: 'creature',
            scoreLoot: 100, name: 'Wraith', aggroRange: 350, gravity: false
        });
        this.teleportTimer = 120;
        this.floatOffset = 0;
    }
    update(dt, px, py, platforms) {
        const spd = dt * 60;
        this.floatOffset = Math.sin(this.animTimer * 0.15) * 4;
        // Teleport occasionally
        this.teleportTimer -= spd;
        if (this.teleportTimer <= 0 && this.state === 'chase') {
            const dist = px - this.x;
            if (Math.abs(dist) > 80) {
                this.x += Math.sign(dist) * W.randRange(40, 80);
            }
            this.teleportTimer = W.randRange(90, 160);
        }
        super.update(dt, px, py, platforms);
    }
    drawBody(ctx) {
        const dr = W.drawRoundRect;
        if (this._t === undefined) this._t = 0;
        this._t += 0.1;
        const t = this._t;
        const isHit = this.state === 'hit';

        const cx = this.x + this.w / 2;
        const bottomY = this.y + this.h + this.floatOffset;
        const bobAnim = Math.sin(t * 0.1) * 2;
        const sway = Math.sin(t * 0.7) * 2;

        ctx.save();
        const alphaBase = isHit ? 0.3 : (0.5 + Math.sin(t * 1.2) * 0.2);
        ctx.globalAlpha = alphaBase;

        ctx.translate(cx, bottomY);
        ctx.scale(this.facing, 1);

        // Ghostly glow aura
        ctx.fillStyle = '#6666cc';
        ctx.globalAlpha = 0.08 + Math.sin(t * 0.6) * 0.04;
        ctx.beginPath();
        ctx.arc(0, -25, 28 + Math.sin(t * 1.2) * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alphaBase;

        // Shadow (faint, floating)
        ctx.fillStyle = '#00000015';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flowing robe bottom (tattered wisps)
        ctx.fillStyle = 'rgba(100,115,175,0.2)';
        ctx.beginPath();
        ctx.moveTo(-10, -6);
        for (let i = 0; i <= 6; i++) {
            const wx = -10 + i * (20 / 6);
            const wy = -4 + Math.sin(t * 2.2 + i * 1.3) * 3 + (i % 2 === 0 ? 3 : 0);
            ctx.lineTo(wx + Math.sin(t * 1.9 + i * 0.9) * 2, wy);
        }
        ctx.lineTo(10, -6);
        ctx.lineTo(10, -14 + bobAnim);
        ctx.lineTo(-10, -14 + bobAnim);
        ctx.closePath();
        ctx.fill();

        // Main robe body
        ctx.fillStyle = 'rgba(120,140,200,0.5)';
        dr(ctx, -9, -40 + bobAnim, 18, 28, 4);

        // Inner robe highlight
        ctx.fillStyle = 'rgba(130,150,210,0.3)';
        dr(ctx, -6, -36 + bobAnim, 12, 20, 3);

        // Skeleton hints inside
        ctx.globalAlpha = alphaBase * 0.15;
        ctx.strokeStyle = '#aabbdd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0 + sway * 0.4, -36 + bobAnim);
        ctx.lineTo(0 + sway * 0.2, -18 + bobAnim);
        ctx.stroke();
        for (let r = 0; r < 3; r++) {
            const ry = -34 + bobAnim + r * 5;
            ctx.beginPath();
            ctx.moveTo(0, ry);
            ctx.quadraticCurveTo(-3, ry + 2, -6, ry + 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, ry);
            ctx.quadraticCurveTo(3, ry + 2, 6, ry + 1);
            ctx.stroke();
        }
        ctx.globalAlpha = alphaBase;

        // Hood
        ctx.fillStyle = 'rgba(120,140,200,0.6)';
        ctx.beginPath();
        ctx.moveTo(-8 + sway, -42 + bobAnim);
        ctx.quadraticCurveTo(0 + sway, -48 + bobAnim, 8 + sway, -42 + bobAnim);
        ctx.lineTo(9, -34 + bobAnim);
        ctx.lineTo(-9, -34 + bobAnim);
        ctx.closePath();
        ctx.fill();

        // Hood inner shadow
        ctx.fillStyle = 'rgba(5,5,20,0.7)';
        dr(ctx, -6, -42 + bobAnim, 12, 8, 3);

        // Hollow eye sockets
        ctx.fillStyle = 'rgba(0,0,10,0.9)';
        ctx.beginPath();
        ctx.ellipse(-3 + sway * 0.3, -38 + bobAnim, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(3 + sway * 0.3, -38 + bobAnim, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glowing eye points
        const eyeBright = 0.7 + Math.sin(t * 2) * 0.3;
        ctx.fillStyle = `rgba(170,210,255,${eyeBright})`;
        ctx.beginPath();
        ctx.arc(-3 + sway * 0.3, -38 + bobAnim, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(3 + sway * 0.3, -38 + bobAnim, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Spectral arms
        ctx.strokeStyle = 'rgba(100,120,180,0.4)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        const armFloat = Math.sin(t * 1.2) * 3;
        // Left arm
        ctx.beginPath();
        ctx.moveTo(-8, -30 + bobAnim);
        ctx.quadraticCurveTo(-12, -24 + bobAnim + armFloat, -10, -18 + bobAnim + armFloat);
        ctx.stroke();
        // Right arm
        ctx.beginPath();
        ctx.moveTo(8, -30 + bobAnim);
        ctx.quadraticCurveTo(12, -24 + bobAnim - armFloat, 10, -18 + bobAnim - armFloat);
        ctx.stroke();

        // Floating spectral particles
        for (let i = 0; i < 4; i++) {
            const pAlpha = 0.2 + Math.sin(t * 0.9 + i * 1.7) * 0.15;
            ctx.globalAlpha = alphaBase * pAlpha;
            ctx.fillStyle = 'rgba(140,160,255,0.6)';
            const px = Math.sin(t * 0.8 + i * 2.1) * 16;
            const py = -25 + Math.cos(t * 0.6 + i * 2.5) * 14;
            ctx.beginPath();
            ctx.arc(px, py, 1 + Math.sin(t * 1.3 + i) * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
};

})();
