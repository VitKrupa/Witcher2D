(function() {
'use strict';
const C = W.Colors;

// NEKKER - small, fast, pack creature. Weak to SILVER.
W.Nekker = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 24, h: 30, hp: 25, damage: 5, speed: 2.5,
            attackRange: 25, attackCooldown: 40, category: 'creature',
            scoreLoot: 30, name: 'Nekker', aggroRange: 250
        });
    }
    drawBody(ctx) {
        const x = this.x, y = this.y, f = this.facing;
        ctx.save();
        if (f === -1) { ctx.translate(x + this.w/2, 0); ctx.scale(-1,1); ctx.translate(-(x + this.w/2), 0); }
        // Body - small hunched brown creature
        ctx.fillStyle = C.NEKKER_BROWN || '#5a4a2a';
        ctx.fillRect(x+4, y+10, 16, 14); // torso
        // Head - big for body
        ctx.fillStyle = '#6a5a3a';
        ctx.fillRect(x+5, y+2, 14, 10); // head
        // Eyes - glowing
        ctx.fillStyle = '#aaff44';
        ctx.fillRect(x+7, y+5, 3, 2);
        ctx.fillRect(x+13, y+5, 3, 2);
        // Mouth
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(x+9, y+9, 6, 2);
        // Arms with claws
        ctx.fillStyle = '#4a3a1a';
        ctx.fillRect(x+1, y+12, 4, 8);
        ctx.fillRect(x+19, y+12, 4, 8);
        // Claws
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x+0, y+19, 2, 3);
        ctx.fillRect(x+22, y+19, 2, 3);
        // Legs - short
        ctx.fillStyle = C.NEKKER_BROWN || '#5a4a2a';
        ctx.fillRect(x+6, y+23, 4, 5);
        ctx.fillRect(x+14, y+23, 4, 5);
        // Feet
        ctx.fillStyle = '#3a2a0a';
        ctx.fillRect(x+5, y+27, 5, 3);
        ctx.fillRect(x+13, y+27, 5, 3);
        // Hop animation
        if (this.state === 'chase' && this.animFrame % 2 === 0) {
            ctx.translate(0, -3);
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
        const x = this.x, y = this.y, f = this.facing;
        ctx.save();
        if (f === -1) { ctx.translate(x + this.w/2, 0); ctx.scale(-1,1); ctx.translate(-(x + this.w/2), 0); }
        // Body - slimy blue-green
        ctx.fillStyle = C.DROWNER_SKIN || '#3a6a5a';
        ctx.fillRect(x+6, y+14, 22, 20); // torso
        // Head - fish-like
        ctx.fillStyle = C.DROWNER_SKIN || '#3a6a5a';
        ctx.fillRect(x+8, y+2, 18, 14);
        // Darker patches
        ctx.fillStyle = C.DROWNER_DARK || '#2a4a3a';
        ctx.fillRect(x+10, y+4, 4, 3);
        ctx.fillRect(x+18, y+6, 4, 3);
        // Eyes - bulging yellowish
        ctx.fillStyle = '#aaba44';
        ctx.fillRect(x+10, y+6, 4, 3);
        ctx.fillRect(x+18, y+6, 4, 3);
        ctx.fillStyle = '#222';
        ctx.fillRect(x+11, y+7, 2, 2);
        ctx.fillRect(x+19, y+7, 2, 2);
        // Mouth with teeth
        ctx.fillStyle = '#2a3a2a';
        ctx.fillRect(x+12, y+12, 10, 3);
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x+13, y+12, 2, 2);
        ctx.fillRect(x+17, y+12, 2, 2);
        ctx.fillRect(x+20, y+12, 2, 2);
        // Webbed hands
        ctx.fillStyle = '#4a8a6a';
        ctx.fillRect(x+1, y+16, 6, 12);
        ctx.fillRect(x+27, y+16, 6, 12);
        // Fingers/webs
        ctx.fillStyle = '#3a7a5a';
        ctx.fillRect(x+0, y+26, 3, 4);
        ctx.fillRect(x+30, y+26, 3, 4);
        // Legs
        ctx.fillStyle = C.DROWNER_DARK || '#2a4a3a';
        ctx.fillRect(x+8, y+33, 6, 12);
        ctx.fillRect(x+20, y+33, 6, 12);
        // Feet
        ctx.fillStyle = '#4a8a6a';
        ctx.fillRect(x+6, y+44, 9, 4);
        ctx.fillRect(x+19, y+44, 9, 4);
        // Water drip effect
        if (this.animFrame % 3 === 0) {
            ctx.fillStyle = 'rgba(100,180,160,0.5)';
            ctx.fillRect(x+14, y+34 + this.animFrame*2, 2, 4);
        }
        ctx.restore();
    }
};

})();
