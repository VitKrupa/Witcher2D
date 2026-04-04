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
        ctx.fillStyle = '#5a4020';
        ctx.fillRect(x + 4 + tailSway * 0.3, by + 22, 10, 4);
        ctx.fillRect(x + 0 + tailSway * 0.6, by + 20, 6, 6);
        ctx.fillStyle = '#4a3518';
        ctx.fillRect(x - 2 + tailSway, by + 18, 4, 10);
        ctx.fillRect(x - 4 + tailSway * 1.2, by + 20, 3, 6);
        // Tail tuft feathers
        ctx.fillStyle = '#6a5030';
        ctx.fillRect(x - 6 + tailSway * 1.3, by + 17, 4, 3);
        ctx.fillRect(x - 7 + tailSway * 1.4, by + 20, 3, 4);
        ctx.fillRect(x - 5 + tailSway * 1.3, by + 24, 3, 3);

        // --- Wings with feather texture ---
        const wingFlap = isSwooping ? Math.sin(t * 6) * 12 : wingY;
        const wingSpread = isSwooping ? 8 : 0;

        // Left wing base shape
        const lwGrad = ctx.createLinearGradient(x - 16 - wingSpread, by + 4 + wingFlap, x + 10, by + 24);
        lwGrad.addColorStop(0, '#8a7040');
        lwGrad.addColorStop(0.4, '#6a5030');
        lwGrad.addColorStop(1, '#5a4020');
        ctx.fillStyle = lwGrad;
        ctx.beginPath();
        ctx.moveTo(x + 10, by + 16);
        ctx.lineTo(x - 12 - wingSpread, by + 4 + wingFlap);
        ctx.lineTo(x - 16 - wingSpread, by + 8 + wingFlap);
        ctx.lineTo(x - 8 - wingSpread, by + 26 + wingFlap * 0.5);
        ctx.lineTo(x + 10, by + 24);
        ctx.fill();

        // Left wing feather overlapping arcs (scales)
        ctx.strokeStyle = '#4a3518';
        ctx.lineWidth = 0.7;
        for (let r = 0; r < 4; r++) {
            const ry = by + 10 + r * 4 + wingFlap * (1 - r * 0.2);
            const rxStart = x - 12 - wingSpread + r * 5;
            for (let c = 0; c < 4 - r; c++) {
                ctx.beginPath();
                ctx.arc(rxStart + c * 5, ry, 3, Math.PI * 0.9, Math.PI * 0.1, true);
                ctx.stroke();
            }
        }
        // Left wing highlight streaks
        ctx.strokeStyle = 'rgba(180,160,100,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 6, by + 18); ctx.lineTo(x - 6 - wingSpread, by + 10 + wingFlap);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 4, by + 22); ctx.lineTo(x - 4 - wingSpread, by + 16 + wingFlap * 0.7);
        ctx.stroke();

        // Right wing base shape
        const rwGrad = ctx.createLinearGradient(x + 54, by + 24, x + 80 + wingSpread, by + 4 + wingFlap);
        rwGrad.addColorStop(0, '#5a4020');
        rwGrad.addColorStop(0.6, '#6a5030');
        rwGrad.addColorStop(1, '#8a7040');
        ctx.fillStyle = rwGrad;
        ctx.beginPath();
        ctx.moveTo(x + 54, by + 16);
        ctx.lineTo(x + 76 + wingSpread, by + 4 + wingFlap);
        ctx.lineTo(x + 80 + wingSpread, by + 8 + wingFlap);
        ctx.lineTo(x + 72 + wingSpread, by + 26 + wingFlap * 0.5);
        ctx.lineTo(x + 54, by + 24);
        ctx.fill();

        // Right wing feather overlapping arcs
        ctx.strokeStyle = '#4a3518';
        ctx.lineWidth = 0.7;
        for (let r = 0; r < 4; r++) {
            const ry = by + 10 + r * 4 + wingFlap * (1 - r * 0.2);
            const rxStart = x + 76 + wingSpread - r * 5;
            for (let c = 0; c < 4 - r; c++) {
                ctx.beginPath();
                ctx.arc(rxStart - c * 5, ry, 3, Math.PI * 0.9, Math.PI * 0.1, true);
                ctx.stroke();
            }
        }
        // Right wing highlight streaks
        ctx.strokeStyle = 'rgba(180,160,100,0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 58, by + 18); ctx.lineTo(x + 70 + wingSpread, by + 10 + wingFlap);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 60, by + 22); ctx.lineTo(x + 68 + wingSpread, by + 16 + wingFlap * 0.7);
        ctx.stroke();

        // --- Body with gradient ---
        const bodyGrad = ctx.createLinearGradient(x + 14, by + 18, x + 50, by + 42 + breathe);
        bodyGrad.addColorStop(0, '#a08a50');
        bodyGrad.addColorStop(0.3, '#8a7a40');
        bodyGrad.addColorStop(0.7, '#7a6a30');
        bodyGrad.addColorStop(1, '#5a4a20');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(x + 14, by + 18, 36, 24 + breathe);

        // Fur detail - overlapping scale/feather texture on body
        ctx.strokeStyle = '#6a5a28';
        ctx.lineWidth = 0.6;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                const fx = x + 16 + col * 7 + (row % 2) * 3;
                const fy = by + 20 + row * 7;
                ctx.beginPath();
                ctx.arc(fx, fy, 3, Math.PI * 0.8, Math.PI * 0.2, true);
                ctx.stroke();
            }
        }
        // Body highlight
        ctx.fillStyle = 'rgba(200,180,120,0.15)';
        ctx.fillRect(x + 16, by + 19, 14, 6);
        // Body shadow underside
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(x + 14, by + 36, 36, 6 + breathe);

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

        // Talons with individual claws - left foot
        const talonLX = fHipLX + frontStride;
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(talonLX - 5, fFootLY, 3, 5);
        ctx.fillRect(talonLX - 1, fFootLY, 3, 6);
        ctx.fillRect(talonLX + 3, fFootLY, 3, 5);
        // Claw tips
        ctx.fillStyle = '#222';
        ctx.fillRect(talonLX - 5, fFootLY + 4, 2, 2);
        ctx.fillRect(talonLX - 1, fFootLY + 5, 2, 2);
        ctx.fillRect(talonLX + 3, fFootLY + 4, 2, 2);
        // Claw highlight
        ctx.fillStyle = 'rgba(200,200,200,0.2)';
        ctx.fillRect(talonLX - 5, fFootLY, 1, 3);
        ctx.fillRect(talonLX - 1, fFootLY, 1, 4);
        ctx.fillRect(talonLX + 3, fFootLY, 1, 3);

        // Talons - right foot
        const talonRX = fHipRX - frontStride;
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(talonRX - 5, fFootRY, 3, 5);
        ctx.fillRect(talonRX - 1, fFootRY, 3, 6);
        ctx.fillRect(talonRX + 3, fFootRY, 3, 5);
        ctx.fillStyle = '#222';
        ctx.fillRect(talonRX - 5, fFootRY + 4, 2, 2);
        ctx.fillRect(talonRX - 1, fFootRY + 5, 2, 2);
        ctx.fillRect(talonRX + 3, fFootRY + 4, 2, 2);
        ctx.fillStyle = 'rgba(200,200,200,0.2)';
        ctx.fillRect(talonRX - 5, fFootRY, 1, 3);
        ctx.fillRect(talonRX - 1, fFootRY, 1, 4);
        ctx.fillRect(talonRX + 3, fFootRY, 1, 3);

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
        const hx = x + 44 + atkLean;
        const hy = by + 6 + headBob;

        // Head gradient
        const headGrad = ctx.createLinearGradient(hx, hy, hx + 16, hy + 16);
        headGrad.addColorStop(0, '#c4aa70');
        headGrad.addColorStop(0.5, '#aa9a60');
        headGrad.addColorStop(1, '#8a7a50');
        ctx.fillStyle = headGrad;
        ctx.fillRect(hx, hy + 2, 16, 14);
        // Feathered crown on head
        ctx.fillStyle = '#b09858';
        ctx.fillRect(hx, hy, 8, 3);
        ctx.fillRect(hx + 2, hy - 1, 5, 2);
        // Feather texture on head
        ctx.strokeStyle = 'rgba(90,70,30,0.4)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(hx + 4 + i * 4, hy + 6, 2.5, Math.PI * 0.8, Math.PI * 0.2, true);
            ctx.stroke();
        }
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(hx + 2 + i * 4, hy + 10, 2.5, Math.PI * 0.8, Math.PI * 0.2, true);
            ctx.stroke();
        }

        // Detailed eagle eye - larger with iris detail
        const beakOpen = isAttacking ? attackProgress * 4 : 0;
        const eyeBright = isAttacking ? 1.0 : 0.7;
        // Eye socket shadow
        ctx.fillStyle = '#5a4a28';
        ctx.fillRect(hx + 5, hy + 4, 6, 5);
        // Iris - amber/orange
        ctx.fillStyle = `rgba(255,${Math.floor(160 * eyeBright)},0,1)`;
        ctx.fillRect(hx + 6, hy + 5, 4, 3);
        // Pupil - sharp vertical slit
        ctx.fillStyle = '#111';
        ctx.fillRect(hx + 7, hy + 5, 2, 3);
        ctx.fillStyle = '#000';
        ctx.fillRect(hx + 8, hy + 5, 1, 3);
        // Eye highlight / catchlight
        ctx.fillStyle = 'rgba(255,240,180,0.7)';
        ctx.fillRect(hx + 6, hy + 5, 1, 1);
        // Brow ridge
        ctx.fillStyle = '#7a6a38';
        ctx.fillRect(hx + 5, hy + 3, 6, 2);

        // Beak upper mandible with curve
        const beakGrad = ctx.createLinearGradient(hx + 14, hy + 7, hx + 22, hy + 12);
        beakGrad.addColorStop(0, '#ddb030');
        beakGrad.addColorStop(0.5, '#cc9922');
        beakGrad.addColorStop(1, '#aa7a18');
        ctx.fillStyle = beakGrad;
        ctx.beginPath();
        ctx.moveTo(hx + 14, hy + 8 - beakOpen * 0.3);
        ctx.lineTo(hx + 22, hy + 10 - beakOpen * 0.5);
        ctx.lineTo(hx + 20, hy + 12 - beakOpen * 0.3);
        ctx.lineTo(hx + 14, hy + 11);
        ctx.fill();
        // Beak hook tip
        ctx.fillStyle = '#886614';
        ctx.fillRect(hx + 20, hy + 10 - beakOpen * 0.5, 2, 2);

        // Lower mandible
        ctx.fillStyle = '#bb8820';
        ctx.beginPath();
        ctx.moveTo(hx + 14, hy + 12 + beakOpen * 0.3);
        ctx.lineTo(hx + 20, hy + 13 + beakOpen * 0.5);
        ctx.lineTo(hx + 14, hy + 14 + beakOpen * 0.3);
        ctx.fill();

        // Inner mouth (visible when attacking)
        if (isAttacking && attackProgress > 0.2) {
            ctx.fillStyle = '#661818';
            ctx.fillRect(hx + 14, hy + 11, 5, 1 + beakOpen * 0.6);
            // Tongue hint
            ctx.fillStyle = '#993030';
            ctx.fillRect(hx + 15, hy + 11 + beakOpen * 0.2, 3, beakOpen * 0.3);
        }

        // Nostril on beak
        ctx.fillStyle = '#886614';
        ctx.fillRect(hx + 15, hy + 9 - beakOpen * 0.3, 1, 1);

        ctx.restore();
    }
};

})();
