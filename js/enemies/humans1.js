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
        const x = this.x, y = this.y;
        ctx.save();
        if (this.facing === -1) { ctx.translate(x+this.w/2,0); ctx.scale(-1,1); ctx.translate(-(x+this.w/2),0); }
        // Head with hood
        ctx.fillStyle = '#6a5a3a';
        ctx.fillRect(x+7, y, 16, 6); // hood top
        ctx.fillStyle = '#d4a574'; // skin
        ctx.fillRect(x+8, y+6, 14, 10);
        // Eyes
        ctx.fillStyle = '#333';
        ctx.fillRect(x+10, y+9, 2, 2);
        ctx.fillRect(x+17, y+9, 2, 2);
        // Stubble
        ctx.fillStyle = '#8a7a6a';
        ctx.fillRect(x+10, y+13, 9, 2);
        // Body - leather armor
        ctx.fillStyle = C.BANDIT_LEATHER || '#6a5a3a';
        ctx.fillRect(x+6, y+16, 18, 16);
        // Belt
        ctx.fillStyle = '#4a3a1a';
        ctx.fillRect(x+6, y+30, 18, 3);
        ctx.fillStyle = '#aa8833'; // buckle
        ctx.fillRect(x+13, y+30, 4, 3);
        // Arms
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(x+2, y+18, 5, 12);
        ctx.fillRect(x+23, y+18, 5, 12);
        // Sword in hand
        ctx.fillStyle = '#999';
        ctx.fillRect(x+24, y+10, 2, 16);
        ctx.fillStyle = '#664422';
        ctx.fillRect(x+23, y+16, 4, 3); // hilt
        // Pants
        ctx.fillStyle = '#4a4030';
        ctx.fillRect(x+8, y+33, 6, 14);
        ctx.fillRect(x+16, y+33, 6, 14);
        // Boots
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(x+7, y+46, 7, 5);
        ctx.fillRect(x+16, y+46, 7, 5);
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
        // Occasionally block
        this.blocking = (this.state === 'chase' && Math.random() < 0.005);
    }
    takeDamage(amount, swordType) {
        if (this.blocking) amount = Math.floor(amount * 0.4);
        return super.takeDamage(amount, swordType);
    }
    drawBody(ctx) {
        const x = this.x, y = this.y;
        ctx.save();
        if (this.facing === -1) { ctx.translate(x+this.w/2,0); ctx.scale(-1,1); ctx.translate(-(x+this.w/2),0); }
        // Helmet - black with gold trim
        ctx.fillStyle = C.NILF_BLACK || '#1a1a2a';
        ctx.fillRect(x+7, y, 18, 14);
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x+7, y+13, 18, 2); // gold trim
        ctx.fillRect(x+13, y, 6, 2); // crest
        // Face slit
        ctx.fillStyle = '#333';
        ctx.fillRect(x+10, y+6, 12, 4);
        // Eyes behind visor
        ctx.fillStyle = '#aaa';
        ctx.fillRect(x+12, y+7, 2, 2);
        ctx.fillRect(x+18, y+7, 2, 2);
        // Body - black plate armor
        ctx.fillStyle = C.NILF_BLACK || '#1a1a2a';
        ctx.fillRect(x+5, y+15, 22, 18);
        // Gold sun emblem on chest
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x+13, y+20, 6, 6);
        ctx.fillRect(x+11, y+22, 10, 2);
        ctx.fillRect(x+15, y+18, 2, 10);
        // Shoulders
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(x+2, y+15, 5, 6);
        ctx.fillRect(x+25, y+15, 5, 6);
        // Arms
        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(x+2, y+20, 4, 12);
        ctx.fillRect(x+26, y+20, 4, 12);
        // Shield (left hand)
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(x-2, y+18, 6, 14);
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x-1, y+23, 4, 4);
        // Sword (right hand)
        ctx.fillStyle = '#bbb';
        ctx.fillRect(x+28, y+12, 2, 18);
        ctx.fillStyle = '#444';
        ctx.fillRect(x+26, y+18, 6, 3);
        // Legs
        ctx.fillStyle = '#222';
        ctx.fillRect(x+8, y+33, 6, 14);
        ctx.fillRect(x+18, y+33, 6, 14);
        // Boots
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x+7, y+46, 8, 6);
        ctx.fillRect(x+17, y+46, 8, 6);
        ctx.restore();
    }
};

})();
