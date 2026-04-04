(function() {
'use strict';
const C = W.Colors;

// WILD HUNT WARRIOR - dark spectral armor with ice effects. Weak to IRON.
W.WildHuntWarrior = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 36, h: 58, hp: 80, damage: 14, speed: 1.8,
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
        // Ice dash - teleport forward
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
        const x = this.x, y = this.y;
        ctx.save();
        if (this.facing === -1) { ctx.translate(x+this.w/2,0); ctx.scale(-1,1); ctx.translate(-(x+this.w/2),0); }
        // Frost aura
        ctx.globalAlpha = 0.15 + Math.sin(this.frostAura) * 0.08;
        ctx.fillStyle = C.WILD_HUNT_ICE || '#88aacc';
        ctx.beginPath();
        ctx.arc(x+18, y+28, 28, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // Spiked helmet
        ctx.fillStyle = C.WILD_HUNT_DARK || '#0a0a1a';
        ctx.fillRect(x+8, y+2, 20, 16);
        // Helmet spikes
        ctx.fillRect(x+6, y, 3, 6);
        ctx.fillRect(x+16, y-3, 4, 6);
        ctx.fillRect(x+27, y, 3, 6);
        // Ice-blue eye glow
        ctx.fillStyle = '#66ccff';
        ctx.fillRect(x+12, y+8, 4, 3);
        ctx.fillRect(x+20, y+8, 4, 3);
        // Glow effect around eyes
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#44aaff';
        ctx.fillRect(x+10, y+7, 16, 5);
        ctx.globalAlpha = 1;
        // Dark plate armor body
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x+5, y+18, 26, 20);
        // Ice accents on armor
        ctx.fillStyle = '#4488aa';
        ctx.fillRect(x+7, y+20, 2, 8);
        ctx.fillRect(x+27, y+20, 2, 8);
        ctx.fillRect(x+14, y+24, 8, 2);
        // Spiked shoulders
        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(x+1, y+16, 7, 8);
        ctx.fillRect(x+28, y+16, 7, 8);
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x-1, y+14, 3, 4);
        ctx.fillRect(x+34, y+14, 3, 4);
        // Arms
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x+1, y+24, 5, 14);
        ctx.fillRect(x+30, y+24, 5, 14);
        // Large sword
        ctx.fillStyle = '#8ab';
        ctx.fillRect(x+32, y+6, 3, 26);
        ctx.fillStyle = '#0a0a2a';
        ctx.fillRect(x+30, y+18, 7, 3);
        // Ice crystals on sword
        ctx.fillStyle = '#aaddff';
        ctx.fillRect(x+33, y+8, 2, 3);
        ctx.fillRect(x+31, y+14, 2, 3);
        // Legs
        ctx.fillStyle = '#111';
        ctx.fillRect(x+8, y+38, 7, 14);
        ctx.fillRect(x+21, y+38, 7, 14);
        // Boots with spikes
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x+6, y+50, 10, 6);
        ctx.fillRect(x+20, y+50, 10, 6);
        ctx.fillStyle = '#334';
        ctx.fillRect(x+5, y+50, 3, 3);
        ctx.fillRect(x+28, y+50, 3, 3);
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
        // Ranged attack
        if (dist > 100 && dist < 350 && this.shootCooldown <= 0) {
            this.projectiles.push({
                x: this.x + this.w/2,
                y: this.y + 20,
                vx: this.facing * 5,
                life: 120
            });
            this.shootCooldown = W.randRange(80, 140);
        }
        // Update projectiles
        for (let p of this.projectiles) {
            p.x += p.vx * spd;
            p.life -= spd;
        }
        this.projectiles = this.projectiles.filter(p => p.life > 0);
        super.update(dt, px, py, platforms);
    }
    draw(ctx) {
        super.draw(ctx);
        // Draw projectiles
        for (const p of this.projectiles) {
            ctx.fillStyle = '#8a6a3a';
            ctx.fillRect(p.x, p.y, 8, 2);
            ctx.fillStyle = '#555';
            ctx.fillRect(p.x + (p.vx > 0 ? 8 : -3), p.y-1, 3, 4);
        }
    }
    drawBody(ctx) {
        const x = this.x, y = this.y;
        ctx.save();
        if (this.facing === -1) { ctx.translate(x+this.w/2,0); ctx.scale(-1,1); ctx.translate(-(x+this.w/2),0); }
        // Wide-brim hat
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(x+2, y+4, 26, 4); // brim
        ctx.fillRect(x+8, y, 14, 6); // crown
        // Face
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(x+8, y+8, 14, 10);
        // Stern eyes
        ctx.fillStyle = '#333';
        ctx.fillRect(x+10, y+11, 3, 2);
        ctx.fillRect(x+17, y+11, 3, 2);
        // Frown
        ctx.fillStyle = '#9a7a5a';
        ctx.fillRect(x+11, y+15, 8, 1);
        // Dark red robes
        ctx.fillStyle = C.WITCH_HUNTER_RED || '#8a2a1a';
        ctx.fillRect(x+5, y+18, 20, 18);
        // Robe details
        ctx.fillStyle = '#6a1a0a';
        ctx.fillRect(x+14, y+18, 2, 18);
        // Cross/emblem
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x+13, y+22, 4, 6);
        ctx.fillRect(x+11, y+24, 8, 2);
        // Arms
        ctx.fillStyle = '#7a2a1a';
        ctx.fillRect(x+1, y+20, 5, 12);
        ctx.fillRect(x+24, y+20, 5, 12);
        // Crossbow
        ctx.fillStyle = '#5a4020';
        ctx.fillRect(x+24, y+22, 8, 3);
        ctx.fillStyle = '#888';
        ctx.fillRect(x+22, y+20, 2, 7);
        // Legs (under robe)
        ctx.fillStyle = '#3a1a0a';
        ctx.fillRect(x+8, y+36, 6, 12);
        ctx.fillRect(x+16, y+36, 6, 12);
        // Boots
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(x+7, y+47, 7, 5);
        ctx.fillRect(x+16, y+47, 7, 5);
        ctx.restore();
    }
};

})();
