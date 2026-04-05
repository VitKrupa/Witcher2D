(function() {
'use strict';
const C = W.Colors;

// BANDIT - basic human fighter. Weak to IRON.
W.Bandit = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 30, h: 52, hp: 30, damage: 7, speed: 1.5,
            attackRange: 35, attackCooldown: 50, category: 'human',
            scoreLoot: 40, name: 'Bandit', aggroRange: 260
        });
    }
    drawBody(ctx) {
        const dr = W.drawRoundRect;
        if (this._t === undefined) this._t = 0;
        this._t += 0.13;
        const t = this._t;
        const isHit = this.state === 'hit';
        const isHurt = isHit;
        const bodyColor = isHurt ? '#bbaa88' : '#6a5a42';
        const skinColor = isHurt ? '#ddc8a8' : '#c8b8a0';

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
        ctx.fillStyle = isHurt ? '#aa9978' : '#5a4a38';
        dr(ctx, -5, -14, 4, 14, 1);
        dr(ctx, 1, -14, 4, 14, 1);
        // Boots
        ctx.fillStyle = '#3a2a1a';
        dr(ctx, -6, -2, 5, 3, 1);
        dr(ctx, 1, -2, 5, 3, 1);

        // Body - leather jerkin
        ctx.fillStyle = bodyColor;
        dr(ctx, -8, -30 + bobAnim, 16, 18, 2);
        // Leather stitching detail
        ctx.strokeStyle = '#5a4a3060';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -28 + bobAnim);
        ctx.lineTo(0, -14 + bobAnim);
        ctx.stroke();

        // Belt
        ctx.fillStyle = '#4a3a28';
        dr(ctx, -8, -14, 16, 3, 1);
        ctx.fillStyle = '#aa9060';
        dr(ctx, -1, -14, 2, 3, 1);

        // Head
        ctx.fillStyle = skinColor;
        dr(ctx, -5, -38 + bobAnim, 10, 10, 3);

        // Bandana
        ctx.fillStyle = '#6a3030';
        dr(ctx, -6, -40 + bobAnim, 12, 5, 2);
        // Bandana knot
        ctx.fillStyle = '#5a2020';
        dr(ctx, -7, -37 + bobAnim, 3, 4, 1);

        // Eyes (menacing)
        ctx.fillStyle = '#221100';
        dr(ctx, -3, -35 + bobAnim, 2, 2, 1);
        dr(ctx, 2, -35 + bobAnim, 2, 2, 1);

        // Stubble/beard
        ctx.fillStyle = '#9a886860';
        dr(ctx, -3, -30 + bobAnim, 6, 3, 1);

        // Sword in hand
        ctx.fillStyle = '#8a8078';
        dr(ctx, 7, -28 + bobAnim, 2, 18, 1);
        ctx.fillStyle = '#aa9060';
        dr(ctx, 6, -12 + bobAnim, 4, 2, 1);

        ctx.restore();
    }
};

// NILFGAARDIAN SOLDIER - disciplined, armored. Weak to IRON.
W.NilfSoldier = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 32, h: 54, hp: 50, damage: 10, speed: 1.6,
            attackRange: 38, attackCooldown: 60, category: 'human',
            scoreLoot: 80, name: 'Nilfgaardian', aggroRange: 300
        });
        this.blocking = false;
    }
    update(dt, px, py, platforms) {
        super.update(dt, px, py, platforms);
        if (!this.blocking && this.state === 'chase' && Math.random() < 0.005) {
            this.blocking = true;
            this._blockTimer = 60;
        }
        if (this.blocking) {
            this._blockTimer -= dt * 60;
            if (this._blockTimer <= 0) this.blocking = false;
        }
    }
    takeDamage(amount, swordType) {
        if (this.blocking) amount = Math.floor(amount * 0.4);
        return super.takeDamage(amount, swordType);
    }
    drawBody(ctx) {
        const dr = W.drawRoundRect;
        if (this._t === undefined) this._t = 0;
        this._t += 0.12;
        const t = this._t;
        const isHit = this.state === 'hit';
        const isHurt = isHit;
        const armorColor = isHurt ? '#3a3a4a' : '#1a1a2a';
        const goldColor = '#c8a032';

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

        // Legs (armored, black)
        ctx.fillStyle = isHurt ? '#3a3a4a' : '#1a1a2a';
        dr(ctx, -6, -14, 5, 14, 1);
        dr(ctx, 1, -14, 5, 14, 1);
        // Greaves
        ctx.fillStyle = '#2a2a3a';
        dr(ctx, -7, -8, 6, 4, 1);
        dr(ctx, 1, -8, 6, 4, 1);
        // Boots
        ctx.fillStyle = '#1a1a1a';
        dr(ctx, -7, -2, 6, 3, 1);
        dr(ctx, 1, -2, 6, 3, 1);

        // Body - black chainmail armor
        ctx.fillStyle = armorColor;
        dr(ctx, -9, -32 + bobAnim, 18, 20, 2);
        // Chainmail pattern
        ctx.fillStyle = '#3a3a4a50';
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                ctx.beginPath();
                ctx.arc(-6 + col * 3, -29 + bobAnim + row * 5, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // Gold sun emblem on chest
        ctx.fillStyle = goldColor;
        ctx.beginPath();
        ctx.arc(0, -24 + bobAnim, 3, 0, Math.PI * 2);
        ctx.fill();
        // Sun rays
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            ctx.fillRect(-0.5 + Math.cos(angle) * 3, -24.5 + bobAnim + Math.sin(angle) * 3, 1, 1);
        }

        // Torn tabard (dark gold)
        ctx.fillStyle = '#3a3a1a40';
        dr(ctx, -4, -30 + bobAnim, 8, 16, 1);

        // Head
        ctx.fillStyle = isHurt ? '#ddc8a8' : '#c0b098';
        dr(ctx, -5, -40 + bobAnim, 10, 10, 3);

        // Open-face helmet (black + gold)
        ctx.fillStyle = armorColor;
        dr(ctx, -6, -43 + bobAnim, 12, 6, 2);
        // Cheek guards
        dr(ctx, -7, -40 + bobAnim, 3, 8, 1);
        dr(ctx, 4, -40 + bobAnim, 3, 8, 1);
        // Gold trim on helmet
        ctx.fillStyle = goldColor;
        dr(ctx, -6, -43 + bobAnim, 12, 1, 1);
        // Gold crest
        dr(ctx, -1, -45 + bobAnim, 2, 3, 1);
        // Nose guard
        ctx.fillStyle = '#222233';
        dr(ctx, -1, -40 + bobAnim, 2, 5, 1);

        // Eyes
        ctx.fillStyle = '#bbb';
        dr(ctx, -3, -37 + bobAnim, 2, 2, 1);
        dr(ctx, 2, -37 + bobAnim, 2, 2, 1);

        // Sword
        ctx.fillStyle = '#aaaaaa';
        dr(ctx, 8, -30 + bobAnim, 2, 20, 1);
        ctx.fillStyle = goldColor;
        dr(ctx, 7, -12 + bobAnim, 4, 2, 1);
        // Pommel
        dr(ctx, 8, -10 + bobAnim, 2, 1, 1);

        // Shield on back
        ctx.fillStyle = armorColor;
        dr(ctx, -11, -32 + bobAnim, 4, 14, 2);
        ctx.fillStyle = goldColor;
        dr(ctx, -10, -29 + bobAnim, 2, 8, 1);

        // Block flash
        if (this.blocking) {
            ctx.globalAlpha = 0.3 + Math.sin(t * 8) * 0.2;
            ctx.fillStyle = '#aaaacc';
            dr(ctx, -11, -32 + bobAnim, 4, 14, 2);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        ctx.restore();
    }
};

})();
