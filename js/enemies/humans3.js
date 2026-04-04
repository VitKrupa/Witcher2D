(function() {
'use strict';
const C = W.Colors;

// NOBLEMAN THUG - fast dual-dagger fighter. Weak to IRON.
W.NoblemanThug = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 28, h: 52, hp: 35, damage: 9, speed: 2.2,
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
        const x = this.x, y = this.y;
        ctx.save();
        if (this.facing === -1) { ctx.translate(x+this.w/2,0); ctx.scale(-1,1); ctx.translate(-(x+this.w/2),0); }
        // Slicked hair
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x+6, y, 16, 6);
        // Face
        ctx.fillStyle = '#dab088';
        ctx.fillRect(x+7, y+5, 14, 11);
        // Arrogant eyes
        ctx.fillStyle = '#333';
        ctx.fillRect(x+9, y+8, 3, 2);
        ctx.fillRect(x+16, y+8, 3, 2);
        // Smirk
        ctx.fillStyle = '#b08868';
        ctx.fillRect(x+11, y+13, 6, 1);
        // Fancy purple tunic
        ctx.fillStyle = C.NOBLEMAN_PURPLE || '#5a2a6a';
        ctx.fillRect(x+4, y+16, 20, 16);
        // Gold trim
        ctx.fillStyle = '#c8a032';
        ctx.fillRect(x+4, y+16, 20, 2);
        ctx.fillRect(x+4, y+30, 20, 2);
        ctx.fillRect(x+12, y+18, 4, 12);
        // Arms
        ctx.fillStyle = '#4a1a5a';
        ctx.fillRect(x+0, y+18, 5, 12);
        ctx.fillRect(x+23, y+18, 5, 12);
        // Dual daggers
        ctx.fillStyle = '#ccc';
        ctx.fillRect(x-2, y+18, 2, 10);
        ctx.fillRect(x+26, y+18, 2, 10);
        ctx.fillStyle = '#664422';
        ctx.fillRect(x-3, y+17, 4, 3);
        ctx.fillRect(x+25, y+17, 4, 3);
        // Fancy pants
        ctx.fillStyle = '#2a1a3a';
        ctx.fillRect(x+6, y+32, 7, 14);
        ctx.fillRect(x+15, y+32, 7, 14);
        // Expensive boots
        ctx.fillStyle = '#3a2020';
        ctx.fillRect(x+5, y+45, 8, 5);
        ctx.fillRect(x+15, y+45, 8, 5);
        ctx.fillStyle = '#c8a032';
        ctx.fillRect(x+5, y+45, 8, 1);
        ctx.fillRect(x+15, y+45, 8, 1);
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
