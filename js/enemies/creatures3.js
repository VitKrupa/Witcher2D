(function() {
'use strict';
const C = W.Colors;

// GRIFFIN - large winged boss beast. Weak to SILVER.
W.Griffin = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 64, h: 56, hp: 150, damage: 15, speed: 1.2,
            attackRange: 50, attackCooldown: 80, category: 'creature',
            scoreLoot: 300, name: 'Griffin', aggroRange: 400
        });
        this.swooping = false;
        this.swoopTimer = 0;
        this.swoopCooldown = 200;
        this.baseY = y;
        this.wingFrame = 0;
    }
    update(dt, px, py, platforms) {
        const spd = dt * 60;
        this.wingFrame += spd * 0.1;
        this.swoopCooldown -= spd;
        // Swoop attack pattern
        if (this.swooping) {
            this.swoopTimer -= spd;
            this.vy = 4;
            this.vx = this.facing * 3;
            if (this.swoopTimer <= 0 || this.onGround) {
                this.swooping = false;
                this.vy = 0;
            }
            this.x += this.vx * spd;
            this.y += this.vy * spd;
            // Platform check
            for (const p of platforms) {
                const pr = p.rect || p;
                if (this.x+this.w > pr.x && this.x < pr.x+pr.w && this.y+this.h > pr.y && this.y+this.h < pr.y+10) {
                    this.y = pr.y - this.h; this.vy = 0; this.onGround = true;
                }
            }
            return;
        }
        // Initiate swoop
        if (this.swoopCooldown <= 0 && this.state === 'chase') {
            this.swooping = true;
            this.swoopTimer = 40;
            this.y -= 80; // fly up first
            this.swoopCooldown = W.randRange(150, 250);
            return;
        }
        super.update(dt, px, py, platforms);
    }
    drawBody(ctx) {
        const x = this.x, y = this.y;
        ctx.save();
        if (this.facing === -1) { ctx.translate(x+this.w/2,0); ctx.scale(-1,1); ctx.translate(-(x+this.w/2),0); }
        const wingY = Math.sin(this.wingFrame) * 8;
        // Wings
        ctx.fillStyle = C.GRIFFIN_BROWN || '#6a5030';
        // Left wing
        ctx.beginPath();
        ctx.moveTo(x+10, y+16);
        ctx.lineTo(x-12, y+6+wingY);
        ctx.lineTo(x-8, y+28+wingY);
        ctx.lineTo(x+10, y+24);
        ctx.fill();
        // Right wing
        ctx.beginPath();
        ctx.moveTo(x+54, y+16);
        ctx.lineTo(x+76, y+6+wingY);
        ctx.lineTo(x+72, y+28+wingY);
        ctx.lineTo(x+54, y+24);
        ctx.fill();
        // Wing feather details
        ctx.fillStyle = '#8a7040';
        ctx.fillRect(x-6, y+10+wingY, 14, 2);
        ctx.fillRect(x+56, y+10+wingY, 14, 2);
        // Body - lion
        ctx.fillStyle = C.GRIFFIN_GOLD || '#8a7a40';
        ctx.fillRect(x+14, y+18, 36, 24);
        // Fur detail
        ctx.fillStyle = '#9a8a50';
        ctx.fillRect(x+16, y+20, 4, 3);
        ctx.fillRect(x+26, y+22, 4, 3);
        ctx.fillRect(x+36, y+20, 4, 3);
        // Eagle head
        ctx.fillStyle = '#aa9a60';
        ctx.fillRect(x+44, y+8, 16, 14);
        // Beak
        ctx.fillStyle = '#cc9922';
        ctx.fillRect(x+58, y+12, 8, 4);
        ctx.fillRect(x+58, y+15, 6, 3);
        // Eye
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(x+50, y+11, 4, 3);
        ctx.fillStyle = '#111';
        ctx.fillRect(x+51, y+12, 2, 2);
        // Front legs with talons
        ctx.fillStyle = '#7a6a30';
        ctx.fillRect(x+16, y+40, 6, 12);
        ctx.fillRect(x+26, y+40, 6, 12);
        // Talons
        ctx.fillStyle = '#444';
        ctx.fillRect(x+14, y+50, 4, 4);
        ctx.fillRect(x+20, y+50, 4, 4);
        ctx.fillRect(x+24, y+50, 4, 4);
        ctx.fillRect(x+30, y+50, 4, 4);
        // Back legs
        ctx.fillStyle = C.GRIFFIN_GOLD || '#8a7a40';
        ctx.fillRect(x+38, y+40, 6, 12);
        ctx.fillRect(x+46, y+40, 6, 12);
        // Tail
        ctx.fillStyle = C.GRIFFIN_BROWN || '#6a5030';
        ctx.fillRect(x+6, y+24, 10, 4);
        ctx.fillRect(x+2, y+22, 6, 6);
        // Tuft
        ctx.fillStyle = '#5a4020';
        ctx.fillRect(x, y+20, 4, 8);
        ctx.restore();
    }
};

})();
