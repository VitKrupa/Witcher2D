(function() {
'use strict';
const C = W.Colors;

// GHOUL - fast, hunched beast with exposed bones. Weak to SILVER.
W.Ghoul = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 36, h: 48, hp: 50, damage: 10, speed: 1.8,
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
        if (this._t === undefined) this._t = 0;
        this._t += 0.15;
        const x = this.x, y = this.y;
        const t = this._t;
        const isChasing = this.state === 'chase';
        const isAttacking = this.state === 'attack';
        const isHit = this.state === 'hit';
        const attackProgress = isAttacking ? (1 - this.stateTimer / 20) : 0;
        const inAir = !this.onGround;

        // Walk cycle - crouching run with forward stride
        const walkCycle = t * 3;
        const stride = isChasing ? Math.sin(walkCycle) : 0;
        const bodyBob = isChasing ? Math.abs(Math.sin(walkCycle)) * 2.5 : Math.sin(t * 0.5) * 0.8;
        const runLean = isChasing ? 3 : 0;
        const breathe = Math.sin(t * 0.6) * 0.5;
        const atkLean = isAttacking ? attackProgress * 5 : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - bodyBob;
        const airTuck = inAir ? -4 : 0;

        // --- Legs as jointed limbs ---
        const hipLX = x + 11, hipRX = x + 24, hipY = by + 29 + airTuck;
        const footStride = stride * 8;
        const kneeBendL = (1 - Math.abs(stride)) * 3.5;
        const kneeBendR = (1 - Math.abs(-stride)) * 3.5;
        const footLY = by + 42 + airTuck - Math.max(0, stride) * 3;
        const footRY = by + 42 + airTuck - Math.max(0, -stride) * 3;

        const legColor = C.GHOUL_GREY || '#6a6060';
        this._drawJointedLimb(ctx, hipLX, hipY, hipLX + footStride * 0.3, hipY + 6 + kneeBendL, hipLX + footStride, footLY, 7, legColor);
        this._drawJointedLimb(ctx, hipRX, hipY, hipRX - footStride * 0.3, hipY + 6 + kneeBendR, hipRX - footStride, footRY, 7, legColor);

        // Feet - large clawed
        ctx.fillStyle = C.GHOUL_DARK || '#4a3a3a';
        ctx.fillRect(hipLX + footStride - 4, footLY, 10, 4);
        ctx.fillRect(hipRX - footStride - 4, footRY, 10, 4);
        // Toe claws
        ctx.fillStyle = '#888';
        ctx.fillRect(hipLX + footStride - 5, footLY, 2, 5);
        ctx.fillRect(hipRX - footStride - 5, footRY, 2, 5);

        // --- Hunched body ---
        ctx.fillStyle = C.GHOUL_GREY || '#6a6060';
        ctx.fillRect(x + 6 + runLean + atkLean, by + 12, 24, 18 + breathe);

        // Exposed rib bones
        ctx.fillStyle = '#ccbbaa';
        for (let i = 0; i < 4; i++) {
            const ribW = 16 - i * 2;
            ctx.fillRect(x + 8 + runLean + atkLean, by + 13 + i * 4, ribW, 1);
            ctx.fillRect(x + 8 + ribW + runLean + atkLean - 1, by + 13 + i * 4 + breathe, 2, 2);
        }
        // Spine line
        ctx.fillStyle = '#bbaa99';
        ctx.fillRect(x + 8 + runLean + atkLean, by + 12, 2, 18);

        // --- Head ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1.8 : Math.sin(t * 0.5) * 0.6;
        ctx.fillStyle = '#7a6a6a';
        ctx.fillRect(x + 18 + runLean + atkLean, by + 4 + headBob, 14, 12);

        // Jaw
        const jawOpen = isAttacking ? attackProgress * 5 : (isChasing ? Math.abs(Math.sin(walkCycle)) * 1.5 : 0);
        ctx.fillStyle = '#4a3030';
        ctx.fillRect(x + 22 + runLean + atkLean, by + 12 + headBob, 10, 4 + jawOpen);
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 23 + runLean + atkLean, by + 12 + headBob, 2, 3);
        ctx.fillRect(x + 26 + runLean + atkLean, by + 12 + headBob, 2, 3);
        ctx.fillRect(x + 29 + runLean + atkLean, by + 12 + headBob, 2, 3);
        if (jawOpen > 2) {
            ctx.fillRect(x + 24 + runLean + atkLean, by + 15 + headBob + jawOpen, 2, 2);
            ctx.fillRect(x + 28 + runLean + atkLean, by + 15 + headBob + jawOpen, 2, 2);
        }

        // Red eyes
        const eyeGlow = isAttacking ? 1.0 : (isChasing ? 0.8 : 0.5 + Math.sin(t) * 0.2);
        const eyeR = Math.floor(255 * eyeGlow);
        const eyeG = Math.floor(34 * eyeGlow);
        ctx.fillStyle = `rgb(${eyeR},${eyeG},${eyeG})`;
        ctx.fillRect(x + 22 + runLean + atkLean, by + 7 + headBob, 3, 2);
        ctx.fillRect(x + 28 + runLean + atkLean, by + 7 + headBob, 3, 2);
        if (isAttacking) {
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.2 : 0.35;
            ctx.fillStyle = '#ff2222';
            ctx.fillRect(x + 20 + runLean + atkLean, by + 5 + headBob, 12, 6);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // --- Arms as jointed limbs, opposite to legs ---
        const armSwingL = isChasing ? -stride * 7 : Math.sin(t * 0.6) * 2;
        const armSwingR = isChasing ? stride * 7 : -Math.sin(t * 0.6) * 2;
        const clawExtend = isAttacking ? attackProgress * 12 : 0;

        const shLX = x + 6 + runLean + atkLean, shRX = x + 30 + runLean + atkLean;
        const shY = by + 16;
        const armColor = C.GHOUL_DARK || '#4a3a3a';

        // Left arm
        this._drawJointedLimb(ctx, shLX, shY, shLX - 2 + armSwingL * 0.3, shY + 9, shLX - 1 + armSwingL, shY + 18, 5, armColor);
        // Right arm (attack arm)
        this._drawJointedLimb(ctx, shRX, shY, shRX + 2 + armSwingR * 0.3 + clawExtend * 0.3, shY + 7 - clawExtend * 0.3, shRX + 1 + armSwingR + clawExtend, shY + 14 - clawExtend * 0.2, 5, armColor);

        // Claws
        ctx.fillStyle = '#bbb';
        const hlx = shLX - 1 + armSwingL, hly = shY + 18;
        ctx.fillRect(hlx - 2, hly, 3, 5);
        ctx.fillRect(hlx + 1, hly + 1, 2, 4);
        ctx.fillRect(hlx + 3, hly + 2, 2, 3);
        const hrx = shRX + 1 + armSwingR + clawExtend, hry = shY + 14 - clawExtend * 0.2;
        ctx.fillRect(hrx - 1, hry, 3, 6);
        ctx.fillRect(hrx + 2, hry + 1, 2, 5);
        ctx.fillRect(hrx + 4, hry, 2, 6);

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
        if (this._t === undefined) this._t = 0;
        this._t += 0.1;
        const t = this._t;
        const ox = this.x;
        const x = this.x, y = this.y + this.floatOffset;
        const isChasing = this.state === 'chase';
        const isAttacking = this.state === 'attack';
        const isHit = this.state === 'hit';
        const attackProgress = isAttacking ? (1 - this.stateTimer / 20) : 0;

        // Floating movement - vertical bob + horizontal sway
        const floatBob = Math.sin(t * 1.5) * 3;
        const sway = Math.sin(t * 0.7) * 2;
        // Subtle breathing/weight shift for idle
        const breathe = Math.sin(t * 0.4) * 0.5;

        ctx.save();
        const alphaBase = isHit ? 0.3 : (0.5 + Math.sin(t * 1.2) * 0.2);
        ctx.globalAlpha = alphaBase;

        if (this.facing === -1) { ctx.translate(ox + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(ox + this.w / 2), 0); }

        const by = y + floatBob;

        // Ghostly glow aura
        ctx.globalAlpha = 0.1 + Math.sin(t * 0.8) * 0.07;
        ctx.fillStyle = '#8888ff';
        ctx.beginPath();
        ctx.arc(x + 16, by + 25, 24 + Math.sin(t * 1.5) * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = alphaBase;

        // Flowing robes gradient
        const grad = ctx.createLinearGradient(x, by, x, by + 54);
        grad.addColorStop(0, 'rgba(120,140,200,0.8)');
        grad.addColorStop(0.5, 'rgba(100,120,180,0.5)');
        grad.addColorStop(1, 'rgba(80,100,160,0.05)');
        ctx.fillStyle = grad;

        // Hooded head
        ctx.beginPath();
        ctx.moveTo(x + 8 + sway, by + 4);
        ctx.lineTo(x + 24 + sway, by + 4);
        ctx.lineTo(x + 26 + sway * 0.5, by + 18);
        ctx.lineTo(x + 6 + sway * 0.5, by + 18);
        ctx.fill();

        // Body flowing down with tattered bottom
        ctx.beginPath();
        ctx.moveTo(x + 6 + sway * 0.5, by + 18);
        ctx.lineTo(x + 26 + sway * 0.5, by + 18);
        ctx.lineTo(x + 30 + Math.sin(t * 2) * 2, by + 50 + breathe);
        for (let i = 0; i <= 6; i++) {
            const px = x + 30 - i * (28 / 6);
            const py = by + 50 + breathe + Math.sin(t * 2 + i * 1.5) * 3 + (i % 2 === 0 ? 3 : 0);
            ctx.lineTo(px + Math.sin(t * 2 + i) * 2, py);
        }
        ctx.lineTo(x + 2 + Math.sin(t * 2 + 3) * 2, by + 50 + breathe);
        ctx.fill();

        // Tattered wisps
        ctx.fillStyle = 'rgba(100,120,180,0.3)';
        for (let i = 0; i < 4; i++) {
            const wx = x + 6 + i * 7;
            const wlen = 4 + Math.sin(t * 1.5 + i * 2) * 3;
            ctx.fillRect(wx + Math.sin(t * 2 + i) * 1, by + 48 + breathe + Math.sin(t * 2 + i) * 2, 2, wlen);
        }

        // Face void
        ctx.fillStyle = 'rgba(10,10,30,0.9)';
        ctx.fillRect(x + 10 + sway, by + 8, 12, 8);

        // Glowing eyes
        const eyeBright = 0.7 + Math.sin(t * 2) * 0.3;
        ctx.fillStyle = `rgba(170,204,255,${eyeBright})`;
        ctx.fillRect(x + 12 + sway, by + 10, 3, 2);
        ctx.fillRect(x + 18 + sway, by + 10, 3, 2);
        ctx.globalAlpha = alphaBase * 0.3;
        ctx.fillStyle = '#aaccff';
        ctx.fillRect(x + 11 + sway, by + 9, 5, 4);
        ctx.fillRect(x + 17 + sway, by + 9, 5, 4);
        ctx.globalAlpha = alphaBase;

        // --- Spectral arms as limbs ---
        const armFloat = Math.sin(t * 1.2) * 3;
        const attackExtend = isAttacking ? attackProgress * 16 : 0;
        // Idle: subtle sway; chase: gentle opposite float
        const armSwayL = isChasing ? Math.sin(t * 1.5) * 2 : Math.sin(t * 0.5) * 1.5;
        const armSwayR = isChasing ? -Math.sin(t * 1.5) * 2 : -Math.sin(t * 0.5) * 1.5;

        const armColor = 'rgba(100,120,180,0.45)';
        // Left arm
        this._drawJointedLimb(ctx, x + 6 + sway * 0.5, by + 22, x + 2 + sway * 0.3 + armSwayL, by + 28 + armFloat, x + 0 + armSwayL, by + 34 + armFloat, 5, armColor);
        // Right arm (attack arm)
        this._drawJointedLimb(ctx, x + 26 + sway * 0.5, by + 20, x + 30 + sway * 0.3 + armSwayR + attackExtend * 0.4, by + 24 - armFloat, x + 32 + armSwayR + attackExtend, by + 30 - armFloat, 5, armColor);

        // Spectral fingers on attacking hand
        if (isAttacking) {
            ctx.fillStyle = 'rgba(140,160,220,0.5)';
            const fx = x + 32 + armSwayR + attackExtend;
            const fy = by + 30 - armFloat;
            ctx.fillRect(fx, fy - 4, 3, 2);
            ctx.fillRect(fx, fy, 3, 2);
            ctx.fillRect(fx, fy + 4, 3, 2);
        }

        // Floating spectral particles
        ctx.fillStyle = 'rgba(140,160,255,0.4)';
        for (let i = 0; i < 3; i++) {
            const px = x + 16 + Math.sin(t * 0.8 + i * 2.1) * 18;
            const py = by + 20 + Math.cos(t * 0.6 + i * 2.5) * 14;
            ctx.fillRect(px, py, 2, 2);
        }

        ctx.restore();
    }
};

})();
