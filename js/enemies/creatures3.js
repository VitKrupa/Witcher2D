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
        if (this._t === undefined) this._t = 0;
        this._t += 0.12;
        const x = this.x, y = this.y;
        const t = this._t;
        const wingY = Math.sin(this.wingFrame) * 8;
        const isChasing = this.state === 'chase';
        const isAttacking = this.state === 'attack';
        const isHit = this.state === 'hit';
        const attackProgress = isAttacking ? (1 - this.stateTimer / 20) : 0;
        const isSwooping = this.swooping;

        // Walk cycle for grounded movement
        const walkCycle = t * 2;
        const stride = (isChasing && this.onGround) ? Math.sin(walkCycle) : 0;
        const bodyBob = (isChasing && this.onGround) ? Math.abs(Math.sin(walkCycle)) * 1.5 : Math.sin(t * 0.5) * 0.8;
        const tailSway = Math.sin(t * 1.5) * 4;
        const breathe = Math.sin(t * 0.6) * 0.5;
        const atkLean = isAttacking ? attackProgress * 4 : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - bodyBob;

        // --- Tail ---
        ctx.fillStyle = C.GRIFFIN_BROWN || '#6a5030';
        ctx.fillRect(x + 4 + tailSway * 0.3, by + 22, 10, 4);
        ctx.fillRect(x + 0 + tailSway * 0.6, by + 20, 6, 6);
        ctx.fillStyle = '#5a4020';
        ctx.fillRect(x - 2 + tailSway, by + 18, 4, 10);
        ctx.fillRect(x - 4 + tailSway * 1.2, by + 20, 3, 6);

        // --- Wings ---
        const wingFlap = isSwooping ? Math.sin(t * 6) * 12 : wingY;
        const wingSpread = isSwooping ? 8 : 0;
        ctx.fillStyle = C.GRIFFIN_BROWN || '#6a5030';

        ctx.beginPath();
        ctx.moveTo(x + 10, by + 16);
        ctx.lineTo(x - 12 - wingSpread, by + 4 + wingFlap);
        ctx.lineTo(x - 16 - wingSpread, by + 8 + wingFlap);
        ctx.lineTo(x - 8 - wingSpread, by + 26 + wingFlap * 0.5);
        ctx.lineTo(x + 10, by + 24);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 54, by + 16);
        ctx.lineTo(x + 76 + wingSpread, by + 4 + wingFlap);
        ctx.lineTo(x + 80 + wingSpread, by + 8 + wingFlap);
        ctx.lineTo(x + 72 + wingSpread, by + 26 + wingFlap * 0.5);
        ctx.lineTo(x + 54, by + 24);
        ctx.fill();

        // Wing feather details
        ctx.fillStyle = '#8a7040';
        ctx.fillRect(x - 8 - wingSpread, by + 10 + wingFlap, 16, 2);
        ctx.fillRect(x + 56 + wingSpread, by + 10 + wingFlap, 16, 2);
        ctx.fillStyle = '#7a6030';
        ctx.fillRect(x - 4 - wingSpread, by + 16 + wingFlap * 0.6, 12, 2);
        ctx.fillRect(x + 56 + wingSpread, by + 16 + wingFlap * 0.6, 12, 2);

        // --- Body ---
        ctx.fillStyle = C.GRIFFIN_GOLD || '#8a7a40';
        ctx.fillRect(x + 14, by + 18, 36, 24 + breathe);

        // Fur detail
        ctx.fillStyle = '#9a8a50';
        ctx.fillRect(x + 16, by + 20 + breathe, 4, 3);
        ctx.fillRect(x + 22, by + 22, 4, 3);
        ctx.fillRect(x + 28, by + 20 - breathe, 4, 3);
        ctx.fillRect(x + 34, by + 22, 4, 3);
        ctx.fillStyle = '#7a6a30';
        ctx.fillRect(x + 30, by + 18, 2, 14);

        // --- Front legs as jointed limbs ---
        const frontStride = stride * 6;
        const fKneeBendL = (1 - Math.abs(stride)) * 3;
        const fKneeBendR = (1 - Math.abs(-stride)) * 3;
        const fHipLX = x + 19, fHipRX = x + 29, fHipY = by + 40;
        const fFootLY = by + 52 - Math.max(0, stride) * 2;
        const fFootRY = by + 52 - Math.max(0, -stride) * 2;

        const frontLegColor = '#7a6a30';
        this._drawJointedLimb(ctx, fHipLX, fHipY, fHipLX + frontStride * 0.3, fHipY + 5 + fKneeBendL, fHipLX + frontStride, fFootLY, 6, frontLegColor);
        this._drawJointedLimb(ctx, fHipRX, fHipY, fHipRX - frontStride * 0.3, fHipY + 5 + fKneeBendR, fHipRX - frontStride, fFootRY, 6, frontLegColor);

        // Talons
        ctx.fillStyle = '#444';
        ctx.fillRect(fHipLX + frontStride - 4, fFootLY, 4, 4);
        ctx.fillRect(fHipLX + frontStride + 1, fFootLY, 4, 4);
        ctx.fillRect(fHipRX - frontStride - 4, fFootRY, 4, 4);
        ctx.fillRect(fHipRX - frontStride + 1, fFootRY, 4, 4);
        ctx.fillStyle = '#333';
        ctx.fillRect(fHipLX + frontStride - 4, fFootLY + 3, 2, 2);
        ctx.fillRect(fHipRX - frontStride - 4, fFootRY + 3, 2, 2);

        // --- Back legs as jointed limbs (opposite phase) ---
        const backStride = -stride * 5;
        const bHipLX = x + 41, bHipRX = x + 49, bHipY = by + 40;
        const bFootLY = by + 52 - Math.max(0, -stride) * 2;
        const bFootRY = by + 52 - Math.max(0, stride) * 2;

        const backLegColor = C.GRIFFIN_GOLD || '#8a7a40';
        this._drawJointedLimb(ctx, bHipLX, bHipY, bHipLX + backStride * 0.3, bHipY + 5, bHipLX + backStride, bFootLY, 6, backLegColor);
        this._drawJointedLimb(ctx, bHipRX, bHipY, bHipRX - backStride * 0.3, bHipY + 5, bHipRX - backStride, bFootRY, 6, backLegColor);

        // --- Eagle head ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1.5 : Math.sin(t * 0.5) * 0.6;
        ctx.fillStyle = '#aa9a60';
        ctx.fillRect(x + 44 + atkLean, by + 8 + headBob, 16, 14);
        ctx.fillStyle = '#8a7a50';
        ctx.fillRect(x + 44 + atkLean, by + 6 + headBob, 8, 3);

        // Beak
        const beakOpen = isAttacking ? attackProgress * 4 : 0;
        ctx.fillStyle = '#cc9922';
        ctx.fillRect(x + 58 + atkLean, by + 12 + headBob - beakOpen * 0.3, 8, 3);
        ctx.fillRect(x + 58 + atkLean, by + 15 + headBob + beakOpen * 0.5, 6, 2);
        if (isAttacking && attackProgress > 0.3) {
            ctx.fillStyle = '#882222';
            ctx.fillRect(x + 58 + atkLean, by + 14 + headBob, 5, 1 + beakOpen * 0.5);
        }

        // Eye
        const eyeBright = isAttacking ? 1.0 : 0.7;
        ctx.fillStyle = `rgba(255,${Math.floor(136 * eyeBright)},0,1)`;
        ctx.fillRect(x + 50 + atkLean, by + 11 + headBob, 4, 3);
        ctx.fillStyle = '#111';
        ctx.fillRect(x + 51 + atkLean, by + 12 + headBob, 2, 2);
        ctx.fillStyle = 'rgba(255,200,100,0.5)';
        ctx.fillRect(x + 50 + atkLean, by + 11 + headBob, 1, 1);

        ctx.restore();
    }
};

})();
