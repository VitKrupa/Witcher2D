(function() {
'use strict';
const C = W.Colors;

// NOBLEMAN THUG - fast dual-dagger fighter. Weak to IRON.
W.NoblemanThug = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 28, h: 52, hp: 35, damage: 9, speed: 1.5,
            attackRange: 30, attackCooldown: 35, category: 'human',
            scoreLoot: 60, name: 'Nobleman', aggroRange: 280
        });
        this.dodgeCooldown = 0;
    }
    update(dt, px, py, platforms) {
        const spd = dt * 60;
        this.dodgeCooldown -= spd;
        super.update(dt, px, py, platforms);
        // Dodge back after attacking
        if (this.state === 'attack' && this.stateTimer < 3 && this.dodgeCooldown <= 0) {
            this.x -= this.facing * 30;
            this.dodgeCooldown = 80;
        }
    }
    drawBody(ctx) {
        const dr = W.drawRoundRect;
        if (this._t === undefined) this._t = 0;
        this._t += 0.14;
        const t = this._t;
        const isHit = this.state === 'hit';
        const isHurt = isHit;
        const tunicColor = isHurt ? '#7a4a8a' : '#5a2a6a';
        const skinColor = isHurt ? '#eac098' : '#dab088';
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
        ctx.ellipse(0, 0, 8, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs (dark purple)
        ctx.fillStyle = '#2a1a3a';
        dr(ctx, -5, -14, 4, 14, 1);
        dr(ctx, 1, -14, 4, 14, 1);
        // Expensive boots with gold trim
        ctx.fillStyle = '#3a2020';
        dr(ctx, -6, -2, 5, 3, 1);
        dr(ctx, 1, -2, 5, 3, 1);
        ctx.fillStyle = goldColor;
        dr(ctx, -6, -2, 5, 1, 1);
        dr(ctx, 1, -2, 5, 1, 1);

        // Fancy purple tunic
        ctx.fillStyle = tunicColor;
        dr(ctx, -8, -32 + bobAnim, 16, 20, 2);
        // Gold trim top and bottom
        ctx.fillStyle = goldColor;
        dr(ctx, -8, -32 + bobAnim, 16, 2, 1);
        dr(ctx, -8, -14 + bobAnim, 16, 2, 1);
        // Gold center stripe
        dr(ctx, -1, -30 + bobAnim, 3, 14, 1);
        // Tunic detail panels
        ctx.fillStyle = '#4a1a5a';
        dr(ctx, -6, -26 + bobAnim, 2, 6, 1);
        dr(ctx, 4, -26 + bobAnim, 2, 6, 1);

        // Head
        ctx.fillStyle = skinColor;
        dr(ctx, -5, -40 + bobAnim, 10, 10, 3);

        // Slicked hair
        ctx.fillStyle = '#1a1a1a';
        dr(ctx, -5, -42 + bobAnim, 10, 5, 2);
        ctx.fillStyle = '#2a2a2a';
        dr(ctx, -3, -42 + bobAnim, 4, 3, 1);

        // Arrogant eyes (one raised brow)
        ctx.fillStyle = '#333';
        dr(ctx, -3, -37 + bobAnim, 2, 2, 1);
        dr(ctx, 2, -37 + bobAnim, 2, 2, 1);
        // Raised eyebrow
        ctx.fillStyle = '#1a1a1a';
        dr(ctx, 2, -38 + bobAnim, 3, 1, 1);

        // Thin mustache
        ctx.fillStyle = '#2a2a2a';
        dr(ctx, -2, -33 + bobAnim, 5, 1, 1);

        // Smirk
        ctx.fillStyle = '#b08868';
        dr(ctx, -1, -32 + bobAnim, 4, 1, 1);

        // Left dagger
        ctx.fillStyle = '#ccc';
        dr(ctx, -9, -28 + bobAnim, 2, 14, 1);
        ctx.fillStyle = '#664422';
        dr(ctx, -10, -16 + bobAnim, 4, 2, 1);

        // Right dagger
        ctx.fillStyle = '#ccc';
        dr(ctx, 7, -28 + bobAnim, 2, 14, 1);
        ctx.fillStyle = '#664422';
        dr(ctx, 6, -16 + bobAnim, 4, 2, 1);

        ctx.restore();
    }
};

// ENEMY FACTORY + TYPE REGISTRY
W.EnemyTypes = {
    nekker: W.Nekker,
    drowner: W.Drowner,
    ghoul: W.Ghoul,
    wraith: W.Wraith,
    griffin: W.Griffin,
    bandit: W.Bandit,
    nilfSoldier: W.NilfSoldier,
    wildHunt: W.WildHuntWarrior,
    witchHunter: W.WitchHunter,
    nobleman: W.NoblemanThug
};

W.createEnemy = function(type, x, y, difficulty) {
    difficulty = difficulty || 1;
    const Cls = W.EnemyTypes[type];
    if (!Cls) { console.warn('Unknown enemy type:', type); return null; }
    const enemy = new Cls(x, y);
    if (difficulty > 1) {
        enemy.hp = Math.floor(enemy.hp * difficulty);
        enemy.maxHp = enemy.hp;
        enemy.damage = Math.floor(enemy.damage * (1 + (difficulty-1)*0.5));
    }
    return enemy;
};

})();
