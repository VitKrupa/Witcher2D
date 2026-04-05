(function() {
'use strict';
const C = W.Colors;

// WILD HUNT WARRIOR - dark spectral armor with ice effects. Weak to IRON.
W.WildHuntWarrior = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 36, h: 58, hp: 80, damage: 14, speed: 1.2,
            attackRange: 45, attackCooldown: 65, category: 'human',
            scoreLoot: 150, name: 'Wild Hunt', aggroRange: 350
        });
        this.iceDashCooldown = 180;
        this.frostAura = 0;
    }
    update(dt, px, py, platforms) {
        const spd = dt * 60;
        this.frostAura += spd * 0.05;
        this.iceDashCooldown -= spd;
        if (this.iceDashCooldown <= 0 && this.state === 'chase') {
            const dist = Math.abs(px - this.x);
            if (dist > 80 && dist < 250) {
                this.x += this.facing * 60;
                this.iceDashCooldown = W.randRange(140, 220);
            }
        }
        super.update(dt, px, py, platforms);
    }
    drawBody(ctx) {
        const dr = W.drawRoundRect;
        if (this._t === undefined) this._t = 0;
        this._t += 0.12;
        const t = this._t;
        const isHit = this.state === 'hit';
        const isHurt = isHit;
        const armorColor = isHurt ? '#1a1a3a' : '#0a0a1a';
        const iceColor = '#88aacc';

        const cx = this.x + this.w / 2;
        const bottomY = this.y + this.h;
        const bobAnim = Math.sin(t * 0.1) * 1.5;

        ctx.save();
        ctx.translate(cx, bottomY);
        ctx.scale(this.facing, 1);

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha *= 0.5;

        // Frost aura
        const auraSize = 26 + Math.sin(this.frostAura * 1.2) * 5;
        ctx.globalAlpha = 0.12 + Math.sin(this.frostAura) * 0.06;
        ctx.fillStyle = iceColor;
        ctx.beginPath();
        ctx.arc(0, -28, auraSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.08 + Math.sin(this.frostAura * 1.5) * 0.04;
        ctx.fillStyle = '#aaccee';
        ctx.beginPath();
        ctx.arc(0, -28, auraSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        // Ice particles
        ctx.fillStyle = '#aaddff';
        for (let i = 0; i < 3; i++) {
            const angle = t * 0.8 + i * (Math.PI * 2 / 3);
            const radius = 20 + Math.sin(t * 1.5 + i) * 4;
            const px = Math.cos(angle) * radius;
            const py = -28 + Math.sin(angle) * radius * 0.6;
            ctx.fillRect(px, py, 2, 2);
        }

        // Shadow
        ctx.fillStyle = '#00000025';
        ctx.beginPath();
        ctx.ellipse(0, 0, 11, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs (heavy armored)
        ctx.fillStyle = '#111';
        dr(ctx, -7, -14, 6, 14, 2);
        dr(ctx, 1, -14, 6, 14, 2);
        // Boots with spikes
        ctx.fillStyle = '#0a0a1a';
        dr(ctx, -8, -2, 7, 3, 1);
        dr(ctx, 1, -2, 7, 3, 1);
        // Boot spikes
        ctx.fillStyle = '#334';
        dr(ctx, -9, -2, 2, 2, 1);
        dr(ctx, 8, -2, 2, 2, 1);

        // Body - dark plate armor
        ctx.fillStyle = armorColor;
        dr(ctx, -10, -36 + bobAnim, 20, 24, 3);

        // Ice accent lines
        const icePulse = 0.7 + Math.sin(this.frostAura * 1.5) * 0.3;
        const iceR = Math.floor(68 * icePulse);
        const iceG = Math.floor(136 * icePulse);
        const iceB = Math.floor(170 * icePulse);
        ctx.fillStyle = `rgb(${iceR},${iceG},${iceB})`;
        dr(ctx, -8, -32 + bobAnim, 2, 8, 1);
        dr(ctx, 6, -32 + bobAnim, 2, 8, 1);
        dr(ctx, -3, -20 + bobAnim, 6, 2, 1);

        // Spiked shoulders
        ctx.fillStyle = '#1a1a2a';
        dr(ctx, -13, -34 + bobAnim, 5, 7, 2);
        dr(ctx, 8, -34 + bobAnim, 5, 7, 2);
        // Shoulder spikes
        ctx.fillStyle = armorColor;
        dr(ctx, -15, -38 + bobAnim, 3, 5, 1);
        dr(ctx, 12, -38 + bobAnim, 3, 5, 1);
        // Ice tips on spikes
        ctx.fillStyle = `rgb(${iceR},${iceG},${iceB})`;
        ctx.fillRect(-15, -38 + bobAnim, 1, 2);
        ctx.fillRect(14, -38 + bobAnim, 1, 2);

        // Spiked helmet
        ctx.fillStyle = armorColor;
        dr(ctx, -8, -50 + bobAnim, 16, 16, 3);

        // Helmet spikes
        dr(ctx, -10, -52 + bobAnim, 3, 6, 1);
        dr(ctx, -2, -55 + bobAnim, 4, 6, 1);
        dr(ctx, 7, -52 + bobAnim, 3, 6, 1);

        // Ice-blue eye glow
        const eyeGlow = 0.7 + Math.sin(t * 2) * 0.3;
        ctx.fillStyle = `rgba(102,204,255,${eyeGlow})`;
        dr(ctx, -5, -44 + bobAnim, 4, 3, 1);
        dr(ctx, 2, -44 + bobAnim, 4, 3, 1);

        // Eye glow bleed
        ctx.globalAlpha = 0.35 + Math.sin(t * 2) * 0.15;
        ctx.fillStyle = '#44aaff';
        dr(ctx, -6, -45 + bobAnim, 12, 5, 2);
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        // Large sword
        ctx.fillStyle = '#8ab';
        dr(ctx, 9, -48 + bobAnim, 3, 26, 1);
        // Ice runes on sword
        ctx.fillStyle = '#aaddff';
        dr(ctx, 10, -44 + bobAnim, 2, 3, 1);
        dr(ctx, 10, -36 + bobAnim, 2, 3, 1);
        dr(ctx, 10, -28 + bobAnim, 2, 3, 1);
        // Hilt
        ctx.fillStyle = '#0a0a2a';
        dr(ctx, 7, -24 + bobAnim, 7, 3, 1);
        ctx.fillStyle = `rgb(${iceR},${iceG},${iceB})`;
        dr(ctx, 7, -24 + bobAnim, 7, 1, 1);

        ctx.restore();
    }
};

// WITCH HUNTER - ranged crossbow + melee. Weak to IRON.
W.WitchHunter = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 30, h: 54, hp: 35, damage: 8, speed: 1.2,
            attackRange: 35, attackCooldown: 80, category: 'human',
            scoreLoot: 70, name: 'Witch Hunter', aggroRange: 350
        });
        this.projectiles = [];
        this.shootCooldown = 100;
    }
    update(dt, px, py, platforms) {
        const spd = dt * 60;
        this.shootCooldown -= spd;
        const dist = Math.abs(px - this.x);
        if (dist > 100 && dist < 350 && this.shootCooldown <= 0) {
            this.projectiles.push({
                x: this.x + this.w / 2,
                y: this.y + 20,
                vx: this.facing * 5,
                life: 60
            });
            this.shootCooldown = W.randRange(80, 140);
        }
        for (let p of this.projectiles) {
            p.x += p.vx * spd;
            p.life -= spd;
        }
        this.projectiles = this.projectiles.filter(p => p.life > 0);
        super.update(dt, px, py, platforms);
    }
    draw(ctx) {
        super.draw(ctx);
        for (const p of this.projectiles) {
            ctx.fillStyle = '#8a6a3a';
            ctx.fillRect(p.x, p.y, 8, 2);
            ctx.fillStyle = '#555';
            ctx.fillRect(p.x + (p.vx > 0 ? 8 : -3), p.y - 1, 3, 4);
        }
    }
    drawBody(ctx) {
        const dr = W.drawRoundRect;
        if (this._t === undefined) this._t = 0;
        this._t += 0.11;
        const t = this._t;
        const isHit = this.state === 'hit';
        const isHurt = isHit;
        const robeColor = isHurt ? '#aa4a3a' : '#8a2a1a';
        const skinColor = isHurt ? '#ddc8a8' : '#d4a574';

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

        // Legs
        ctx.fillStyle = '#3a1a0a';
        dr(ctx, -5, -14, 4, 14, 1);
        dr(ctx, 1, -14, 4, 14, 1);
        // Boots
        ctx.fillStyle = '#2a1a0a';
        dr(ctx, -6, -2, 5, 3, 1);
        dr(ctx, 1, -2, 5, 3, 1);

        // Dark red robes
        ctx.fillStyle = robeColor;
        dr(ctx, -8, -34 + bobAnim, 16, 22, 2);
        // Robe bottom tattered edges
        const robeSway = Math.sin(t * 1.5) * 1.5;
        dr(ctx, -9 + robeSway, -14, 5, 3, 1);
        dr(ctx, 4 - robeSway, -14, 5, 3, 1);

        // Robe seam
        ctx.fillStyle = '#6a1a0a';
        dr(ctx, -1, -32 + bobAnim, 2, 18, 1);

        // Cross emblem
        ctx.fillStyle = '#ddd';
        dr(ctx, -1, -28 + bobAnim, 3, 6, 1);
        dr(ctx, -3, -26 + bobAnim, 7, 2, 1);
        // Emblem glow
        ctx.fillStyle = '#ffffff15';
        ctx.beginPath();
        ctx.arc(0, -25 + bobAnim, 5, 0, Math.PI * 2);
        ctx.fill();

        // Face
        ctx.fillStyle = skinColor;
        dr(ctx, -5, -42 + bobAnim, 10, 10, 3);

        // Eyes (stern)
        ctx.fillStyle = '#333';
        dr(ctx, -3, -39 + bobAnim, 2, 2, 1);
        dr(ctx, 2, -39 + bobAnim, 2, 2, 1);
        // Brow ridge
        ctx.fillStyle = '#9a7a5a';
        dr(ctx, -3, -40 + bobAnim, 2, 1, 1);
        dr(ctx, 2, -40 + bobAnim, 2, 1, 1);

        // Frown
        ctx.fillStyle = '#9a7a5a';
        dr(ctx, -2, -34 + bobAnim, 5, 1, 1);

        // Wide-brim hat
        ctx.fillStyle = '#2a1a0a';
        dr(ctx, -10, -46 + bobAnim, 20, 4, 1);
        dr(ctx, -5, -52 + bobAnim, 10, 7, 2);
        // Hat band
        ctx.fillStyle = '#444';
        dr(ctx, -5, -46 + bobAnim, 10, 1, 1);

        // Hat shadow on face
        ctx.fillStyle = '#00000030';
        dr(ctx, -5, -42 + bobAnim, 10, 3, 1);

        // Crossbow in hand
        ctx.fillStyle = '#5a4020';
        dr(ctx, 7, -30 + bobAnim, 8, 3, 1);
        // Crossbow limbs
        ctx.fillStyle = '#888';
        dr(ctx, 5, -32 + bobAnim, 2, 7, 1);
        // Crossbow string dots
        ctx.fillStyle = '#aaa';
        ctx.fillRect(5, -32 + bobAnim, 1, 1);
        ctx.fillRect(5, -26 + bobAnim, 1, 1);

        ctx.restore();
    }
};

})();
