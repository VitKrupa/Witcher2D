(function() {
'use strict';
const C = W.Colors;

// NEKKER - small, fast, pack creature. Weak to SILVER.
W.Nekker = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 24, h: 30, hp: 25, damage: 5, speed: 1.6,
            attackRange: 25, attackCooldown: 40, category: 'creature',
            scoreLoot: 30, name: 'Nekker', aggroRange: 250
        });
    }
    drawBody(ctx) {
        const dr = W.drawRoundRect;
        if (this._t === undefined) this._t = 0;
        this._t += 0.15;
        const t = this._t;
        const isHit = this.state === 'hit';
        const isHurt = isHit;
        const bodyColor = isHurt ? '#7a6a4a' : '#5a4a2a';
        const darkColor = isHurt ? '#5a4a2a' : '#3a2a0a';

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
        ctx.ellipse(0, 0, 7, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillStyle = darkColor;
        dr(ctx, -4, -10, 3, 10, 1);
        dr(ctx, 1, -10, 3, 10, 1);
        // Clawed feet
        ctx.fillStyle = darkColor;
        dr(ctx, -6, -2, 6, 2, 1);
        dr(ctx, 0, -2, 6, 2, 1);

        // Body (small, hunched)
        ctx.fillStyle = bodyColor;
        dr(ctx, -7, -22 + bobAnim, 14, 14, 3);
        // Belly
        ctx.fillStyle = darkColor;
        dr(ctx, -4, -17 + bobAnim, 8, 5, 2);

        // Head (big for body, goblin-like)
        ctx.fillStyle = '#6a5a3a';
        dr(ctx, -6, -30 + bobAnim, 12, 10, 4);

        // Big glowing eyes
        const eyePulse = 0.7 + Math.sin(t * 2) * 0.3;
        ctx.fillStyle = `rgb(${Math.floor(170 * eyePulse)},${Math.floor(255 * eyePulse)},68)`;
        ctx.beginPath();
        ctx.arc(-2, -26 + bobAnim, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4, -26 + bobAnim, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Pupils
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(-1.5, -26 + bobAnim, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4.5, -26 + bobAnim, 1, 0, Math.PI * 2);
        ctx.fill();
        // Eye glow
        ctx.fillStyle = '#aaff4418';
        ctx.beginPath();
        ctx.arc(1, -26 + bobAnim, 7, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.fillStyle = '#3a2a1a';
        dr(ctx, -3, -22 + bobAnim, 6, 2, 1);
        // Teeth
        ctx.fillStyle = '#ddd';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(-2 + i * 2, -22 + bobAnim, 1, 1.5);
        }

        // Claws (short)
        ctx.strokeStyle = darkColor;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            ctx.moveTo(6, -18 + bobAnim + i * 3);
            ctx.quadraticCurveTo(9, -19 + bobAnim + i * 3, 8, -16 + bobAnim + i * 3);
            ctx.stroke();
        }

        // Spine ridges
        ctx.fillStyle = darkColor;
        for (let i = 0; i < 3; i++) {
            dr(ctx, -1, -21 + bobAnim + i * 3, 2, 2, 1);
        }

        ctx.restore();
    }
};

// DROWNER - medium, slimy blue-green amphibian. Weak to SILVER.
W.Drowner = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 34, h: 50, hp: 40, damage: 8, speed: 1.8,
            attackRange: 35, attackCooldown: 55, category: 'creature',
            scoreLoot: 50, name: 'Drowner', aggroRange: 280
        });
    }
    drawBody(ctx) {
        const dr = W.drawRoundRect;
        if (this._t === undefined) this._t = 0;
        this._t += 0.12;
        const t = this._t;
        const isHit = this.state === 'hit';
        const isHurt = isHit;
        const bodyColor = isHurt ? '#5aaa80' : '#2a6a4a';
        const darkColor = isHurt ? '#488a68' : '#1e4535';

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
        ctx.ellipse(0, 0, 9, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dripping water
        ctx.fillStyle = bodyColor + '30';
        for (let i = 0; i < 3; i++) {
            const dripY = (t * 0.5 + i * 11) % 12;
            ctx.beginPath();
            ctx.ellipse(-4 + i * 4, -dripY, 1, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Legs (webbed)
        ctx.fillStyle = darkColor;
        dr(ctx, -5, -12, 4, 12, 1);
        dr(ctx, 1, -12, 4, 12, 1);
        // Webbed feet
        ctx.fillStyle = darkColor;
        dr(ctx, -7, -2, 7, 2, 1);
        dr(ctx, 0, -2, 7, 2, 1);

        // Body (hunched, slimy)
        ctx.fillStyle = bodyColor;
        dr(ctx, -8, -30 + bobAnim, 16, 20, 3);
        // Rib texture
        ctx.fillStyle = '#88ccaa50';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(-5, -27 + bobAnim + i * 5, 10, 1);
        }

        // Head (fish-like)
        ctx.fillStyle = bodyColor;
        dr(ctx, -6, -38 + bobAnim, 12, 10, 4);

        // Large bulging eye
        ctx.fillStyle = '#ccffcc';
        ctx.beginPath();
        ctx.arc(2, -34 + bobAnim, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#115511';
        ctx.beginPath();
        ctx.arc(2.5, -34 + bobAnim, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Mouth (wide, gaping)
        ctx.fillStyle = '#0a2a1a';
        dr(ctx, -4, -30 + bobAnim, 8, 3, 1);
        // Tiny teeth
        ctx.fillStyle = '#aaeeaa60';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(-3 + i * 2, -30 + bobAnim, 1, 1.5);
        }

        // Claws (long, curved)
        ctx.strokeStyle = darkColor;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(7, -26 + bobAnim + i * 3);
            ctx.quadraticCurveTo(12, -27 + bobAnim + i * 3, 11, -24 + bobAnim + i * 3);
            ctx.stroke();
        }

        ctx.restore();
    }
};

})();
