(function() {
'use strict';
const C = W.Colors;

// GHOUL - fast, hunched beast with exposed bones. Weak to SILVER.
W.Ghoul = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 36, h: 48, hp: 50, damage: 10, speed: 2.8,
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
        const x = this.x, y = this.y;
        ctx.save();
        if (this.facing === -1) { ctx.translate(x+this.w/2,0); ctx.scale(-1,1); ctx.translate(-(x+this.w/2),0); }
        // Hunched body
        ctx.fillStyle = C.GHOUL_GREY || '#6a6060';
        ctx.fillRect(x+6, y+12, 24, 18);
        // Head - forward-leaning
        ctx.fillStyle = '#7a6a6a';
        ctx.fillRect(x+18, y+4, 14, 12);
        // Red eyes
        ctx.fillStyle = '#ff2222';
        ctx.fillRect(x+22, y+7, 3, 2);
        ctx.fillRect(x+28, y+7, 3, 2);
        // Jaw with teeth
        ctx.fillStyle = '#4a3030';
        ctx.fillRect(x+22, y+12, 10, 4);
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x+23, y+12, 2, 3); ctx.fillRect(x+26, y+12, 2, 3); ctx.fillRect(x+29, y+12, 2, 3);
        // Exposed ribs
        ctx.fillStyle = '#ccbbaa';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x+8, y+14+i*4, 18, 1);
        }
        // Long arms
        ctx.fillStyle = C.GHOUL_DARK || '#4a3a3a';
        ctx.fillRect(x+2, y+14, 5, 20);
        ctx.fillRect(x+29, y+10, 5, 18);
        // Claws
        ctx.fillStyle = '#bbb';
        ctx.fillRect(x+0, y+32, 3, 5); ctx.fillRect(x+3, y+33, 2, 4);
        ctx.fillRect(x+31, y+26, 3, 5); ctx.fillRect(x+33, y+27, 2, 4);
        // Legs - crouched
        ctx.fillStyle = C.GHOUL_GREY || '#6a6060';
        ctx.fillRect(x+8, y+29, 7, 14);
        ctx.fillRect(x+21, y+29, 7, 14);
        // Feet
        ctx.fillStyle = C.GHOUL_DARK || '#4a3a3a';
        ctx.fillRect(x+6, y+42, 10, 4);
        ctx.fillRect(x+20, y+42, 10, 4);
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
        const x = this.x, y = this.y + this.floatOffset;
        ctx.save();
        ctx.globalAlpha = 0.55 + Math.sin(this.animTimer * 0.1) * 0.15;
        if (this.facing === -1) { ctx.translate(this.x+this.w/2,0); ctx.scale(-1,1); ctx.translate(-(this.x+this.w/2),0); }
        // Flowing robes - ghostly blue
        const grad = ctx.createLinearGradient(x, y, x, y+54);
        grad.addColorStop(0, 'rgba(120,140,200,0.7)');
        grad.addColorStop(1, 'rgba(80,100,160,0.1)');
        ctx.fillStyle = grad;
        // Hooded head
        ctx.beginPath();
        ctx.moveTo(x+8, y+6); ctx.lineTo(x+24, y+6);
        ctx.lineTo(x+26, y+18); ctx.lineTo(x+6, y+18);
        ctx.fill();
        // Body flowing down, widening
        ctx.beginPath();
        ctx.moveTo(x+6, y+18); ctx.lineTo(x+26, y+18);
        ctx.lineTo(x+30, y+50); ctx.lineTo(x+2, y+50);
        ctx.fill();
        // Face - hollow dark
        ctx.fillStyle = 'rgba(20,20,40,0.8)';
        ctx.fillRect(x+10, y+8, 12, 8);
        // Glowing eyes
        ctx.fillStyle = '#aaccff';
        ctx.fillRect(x+12, y+10, 3, 2);
        ctx.fillRect(x+18, y+10, 3, 2);
        // Ghostly glow aura
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#8888ff';
        ctx.beginPath();
        ctx.arc(x+16, y+25, 22, 0, Math.PI*2);
        ctx.fill();
        // Spectral arms
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = 'rgba(100,120,180,0.5)';
        ctx.fillRect(x-2, y+20, 5, 16);
        ctx.fillRect(x+29, y+18, 5, 16);
        ctx.restore();
    }
};

})();
