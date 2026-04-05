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
            if (this.y < 0) this.y = 0;
            this.swoopCooldown = W.randRange(150, 250);
            return;
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
        const isSwooping = this.swooping;
        const bodyColor = isHurt ? '#c4aa70' : '#8a7a40';
        const darkColor = isHurt ? '#aa9a60' : '#5a4020';

        const cx = this.x + this.w / 2;
        const bottomY = this.y + this.h;
        const bobAnim = Math.sin(t * 0.1) * 1.5;
        const wingFlap = isSwooping ? Math.sin(t * 6) * 12 : Math.sin(this.wingFrame) * 8;

        ctx.save();
        ctx.translate(cx, bottomY);
        ctx.scale(this.facing, 1);

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha *= 0.5;

        // Shadow
        ctx.fillStyle = '#00000025';
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.fillStyle = darkColor;
        const tailSway = Math.sin(t * 1.5) * 3;
        dr(ctx, -28 + tailSway, -20 + bobAnim, 10, 5, 2);
        dr(ctx, -32 + tailSway * 1.3, -18 + bobAnim, 6, 4, 2);

        // Wings
        const wingSpread = isSwooping ? 8 : 0;
        // Left wing
        ctx.fillStyle = '#6a5030';
        ctx.beginPath();
        ctx.moveTo(-10, -30 + bobAnim);
        ctx.lineTo(-30 - wingSpread, -42 + wingFlap);
        ctx.lineTo(-34 - wingSpread, -38 + wingFlap);
        ctx.lineTo(-24 - wingSpread, -22 + wingFlap * 0.5);
        ctx.lineTo(-10, -22 + bobAnim);
        ctx.fill();
        // Right wing
        ctx.fillStyle = '#6a5030';
        ctx.beginPath();
        ctx.moveTo(10, -30 + bobAnim);
        ctx.lineTo(30 + wingSpread, -42 + wingFlap);
        ctx.lineTo(34 + wingSpread, -38 + wingFlap);
        ctx.lineTo(24 + wingSpread, -22 + wingFlap * 0.5);
        ctx.lineTo(10, -22 + bobAnim);
        ctx.fill();

        // Feather texture on wings
        ctx.strokeStyle = '#4a3518';
        ctx.lineWidth = 0.7;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-18 - wingSpread + i * 5, -35 + wingFlap + i * 4, 3, Math.PI * 0.9, Math.PI * 0.1, true);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(18 + wingSpread - i * 5, -35 + wingFlap + i * 4, 3, Math.PI * 0.9, Math.PI * 0.1, true);
            ctx.stroke();
        }

        // Legs
        ctx.fillStyle = darkColor;
        dr(ctx, -8, -12, 6, 12, 2);
        dr(ctx, 2, -12, 6, 12, 2);
        // Talons
        ctx.fillStyle = '#3a3a3a';
        dr(ctx, -10, -3, 4, 4, 1);
        dr(ctx, -5, -3, 4, 5, 1);
        dr(ctx, 0, -3, 4, 5, 1);
        dr(ctx, 5, -3, 4, 4, 1);

        // Body (large, golden-brown)
        ctx.fillStyle = bodyColor;
        dr(ctx, -14, -38 + bobAnim, 28, 28, 5);
        // Feather scale texture
        ctx.strokeStyle = '#6a5a28';
        ctx.lineWidth = 0.6;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                ctx.beginPath();
                ctx.arc(-8 + col * 6 + (row % 2) * 3, -34 + bobAnim + row * 7, 3, Math.PI * 0.8, Math.PI * 0.2, true);
                ctx.stroke();
            }
        }

        // Eagle head
        ctx.fillStyle = '#c4aa70';
        dr(ctx, 10, -48 + bobAnim, 14, 12, 4);

        // Eye
        ctx.fillStyle = '#5a4a28';
        dr(ctx, 15, -46 + bobAnim, 5, 4, 2);
        ctx.fillStyle = '#ffaa00';
        dr(ctx, 16, -45 + bobAnim, 3, 3, 1);
        ctx.fillStyle = '#111';
        ctx.fillRect(17, -45 + bobAnim, 1, 3);

        // Beak
        ctx.fillStyle = '#ddb030';
        ctx.beginPath();
        ctx.moveTo(22, -44 + bobAnim);
        ctx.lineTo(28, -42 + bobAnim);
        ctx.lineTo(22, -40 + bobAnim);
        ctx.fill();
        // Beak hook
        ctx.fillStyle = '#aa7a18';
        ctx.fillRect(26, -43 + bobAnim, 2, 2);

        ctx.restore();
    }
};

})();
