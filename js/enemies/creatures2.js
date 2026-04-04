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

        // Feet - large clawed toes
        ctx.fillStyle = C.GHOUL_DARK || '#4a3a3a';
        ctx.fillRect(hipLX + footStride - 4, footLY, 10, 4);
        ctx.fillRect(hipRX - footStride - 4, footRY, 10, 4);
        // Individual toe claws (3 per foot)
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 1.5;
        for (let tc = 0; tc < 3; tc++) {
            const tcOff = tc * 3;
            ctx.beginPath();
            ctx.moveTo(hipLX + footStride - 3 + tcOff, footLY + 4);
            ctx.lineTo(hipLX + footStride - 4 + tcOff, footLY + 8);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(hipRX - footStride - 3 + tcOff, footRY + 4);
            ctx.lineTo(hipRX - footStride - 4 + tcOff, footRY + 8);
            ctx.stroke();
        }

        // --- Hunched body with gradient ---
        const bodyGrad = ctx.createLinearGradient(x + 6 + runLean + atkLean, by + 12, x + 30 + runLean + atkLean, by + 30);
        bodyGrad.addColorStop(0, '#7a7070');
        bodyGrad.addColorStop(0.3, '#6a6060');
        bodyGrad.addColorStop(0.7, '#555050');
        bodyGrad.addColorStop(1, '#4a4242');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(x + 8 + runLean + atkLean, by + 12);
        ctx.lineTo(x + 30 + runLean + atkLean, by + 14);
        ctx.lineTo(x + 30 + runLean + atkLean, by + 30 + breathe);
        ctx.lineTo(x + 6 + runLean + atkLean, by + 30 + breathe);
        ctx.closePath();
        ctx.fill();

        // Exposed red muscle patches between ribs
        ctx.fillStyle = 'rgba(140,40,40,0.7)';
        ctx.fillRect(x + 10 + runLean + atkLean, by + 14, 14, 14 + breathe);

        // Exposed white rib bones with curvature
        ctx.strokeStyle = '#ddd8cc';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            const ribY = by + 14 + i * 3.2;
            const ribW = 14 - i * 1.2;
            ctx.beginPath();
            ctx.moveTo(x + 10 + runLean + atkLean, ribY);
            ctx.quadraticCurveTo(x + 10 + ribW * 0.5 + runLean + atkLean, ribY + 1.5 + breathe * 0.3, x + 10 + ribW + runLean + atkLean, ribY + 0.5);
            ctx.stroke();
            // Rib tip knob
            ctx.fillStyle = '#eee8dd';
            ctx.beginPath();
            ctx.arc(x + 10 + ribW + runLean + atkLean, ribY + 0.5 + breathe * 0.2, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        // Spine line (thicker, with vertebrae bumps)
        ctx.strokeStyle = '#bbaa99';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x + 9 + runLean + atkLean, by + 12);
        ctx.lineTo(x + 9 + runLean + atkLean, by + 30);
        ctx.stroke();
        ctx.fillStyle = '#ccbbaa';
        for (let v = 0; v < 5; v++) {
            ctx.beginPath();
            ctx.arc(x + 9 + runLean + atkLean, by + 14 + v * 3.2, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- Head ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1.8 : Math.sin(t * 0.5) * 0.6;
        // Head with gradient
        const headGrad = ctx.createRadialGradient(x + 25 + runLean + atkLean, by + 8 + headBob, 2, x + 25 + runLean + atkLean, by + 10 + headBob, 10);
        headGrad.addColorStop(0, '#8a7a7a');
        headGrad.addColorStop(1, '#5a4a4a');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.ellipse(x + 25 + runLean + atkLean, by + 10 + headBob, 7, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Jaw
        const jawOpen = isAttacking ? attackProgress * 5 : (isChasing ? Math.abs(Math.sin(walkCycle)) * 1.5 : 0);
        ctx.fillStyle = '#4a3030';
        ctx.beginPath();
        ctx.moveTo(x + 22 + runLean + atkLean, by + 13 + headBob);
        ctx.lineTo(x + 32 + runLean + atkLean, by + 13 + headBob);
        ctx.lineTo(x + 31 + runLean + atkLean, by + 16 + headBob + jawOpen);
        ctx.lineTo(x + 23 + runLean + atkLean, by + 16 + headBob + jawOpen);
        ctx.closePath();
        ctx.fill();
        // Upper teeth (jagged)
        ctx.fillStyle = '#eee';
        for (let ti = 0; ti < 4; ti++) {
            ctx.beginPath();
            ctx.moveTo(x + 23 + ti * 2.5 + runLean + atkLean, by + 13 + headBob);
            ctx.lineTo(x + 24 + ti * 2.5 + runLean + atkLean, by + 16 + headBob);
            ctx.lineTo(x + 25 + ti * 2.5 + runLean + atkLean, by + 13 + headBob);
            ctx.fill();
        }
        // Lower teeth
        if (jawOpen > 1) {
            ctx.fillStyle = '#ddd';
            for (let ti = 0; ti < 3; ti++) {
                ctx.beginPath();
                ctx.moveTo(x + 24 + ti * 2.5 + runLean + atkLean, by + 16 + headBob + jawOpen);
                ctx.lineTo(x + 25 + ti * 2.5 + runLean + atkLean, by + 13 + headBob + jawOpen);
                ctx.lineTo(x + 26 + ti * 2.5 + runLean + atkLean, by + 16 + headBob + jawOpen);
                ctx.fill();
            }
        }

        // Drool from jaw (thin dripping line)
        if (jawOpen > 0.5 || isChasing) {
            const droolLen = 3 + Math.sin(t * 2) * 2 + jawOpen;
            ctx.strokeStyle = 'rgba(180,200,180,0.6)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 26 + runLean + atkLean, by + 16 + headBob + jawOpen);
            ctx.quadraticCurveTo(x + 27 + Math.sin(t * 3) * 1 + runLean + atkLean, by + 18 + headBob + jawOpen + droolLen * 0.5, x + 26 + Math.sin(t * 4) * 0.5 + runLean + atkLean, by + 17 + headBob + jawOpen + droolLen);
            ctx.stroke();
            // Second drool strand
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.3 : 0.4;
            ctx.beginPath();
            ctx.moveTo(x + 29 + runLean + atkLean, by + 16 + headBob + jawOpen);
            ctx.quadraticCurveTo(x + 30 + Math.sin(t * 2.5) * 0.8 + runLean + atkLean, by + 19 + headBob + jawOpen + droolLen * 0.3, x + 29 + Math.sin(t * 3.5) * 0.5 + runLean + atkLean, by + 17 + headBob + jawOpen + droolLen * 0.7);
            ctx.stroke();
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // Round glowing red eyes
        const eyeGlow = isAttacking ? 1.0 : (isChasing ? 0.8 : 0.5 + Math.sin(t) * 0.2);
        const eyeR = Math.floor(255 * eyeGlow);
        const eyeG = Math.floor(34 * eyeGlow);
        // Eye glow halo
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.15 : 0.3;
        ctx.fillStyle = `rgba(${eyeR},${eyeG},${eyeG},0.4)`;
        ctx.beginPath();
        ctx.arc(x + 23 + runLean + atkLean, by + 8 + headBob, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 29 + runLean + atkLean, by + 8 + headBob, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        // Eye orbs
        ctx.fillStyle = `rgb(${eyeR},${eyeG},${eyeG})`;
        ctx.beginPath();
        ctx.arc(x + 23 + runLean + atkLean, by + 8 + headBob, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 29 + runLean + atkLean, by + 8 + headBob, 2, 0, Math.PI * 2);
        ctx.fill();
        // Bright pupil center
        ctx.fillStyle = '#ff8888';
        ctx.beginPath();
        ctx.arc(x + 23.5 + runLean + atkLean, by + 7.5 + headBob, 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 29.5 + runLean + atkLean, by + 7.5 + headBob, 0.8, 0, Math.PI * 2);
        ctx.fill();

        if (isAttacking) {
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.2 : 0.35;
            ctx.fillStyle = '#ff2222';
            ctx.beginPath();
            ctx.arc(x + 26 + runLean + atkLean, by + 8 + headBob, 7, 0, Math.PI * 2);
            ctx.fill();
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

        // Claws with individual fingers (4 per hand)
        const hlx = shLX - 1 + armSwingL, hly = shY + 18;
        const hrx = shRX + 1 + armSwingR + clawExtend, hry = shY + 14 - clawExtend * 0.2;
        ctx.lineWidth = 1.5;
        // Left hand fingers
        for (let f = 0; f < 4; f++) {
            const fSpread = (f - 1.5) * 2.5;
            const fWiggle = Math.sin(t * 2 + f) * 0.5;
            ctx.strokeStyle = '#7a6a6a';
            ctx.beginPath();
            ctx.moveTo(hlx + f * 2 - 1, hly);
            ctx.lineTo(hlx + f * 2 - 1 + fSpread * 0.3 + fWiggle, hly + 5);
            ctx.stroke();
            // Claw tip
            ctx.strokeStyle = '#ccc';
            ctx.beginPath();
            ctx.moveTo(hlx + f * 2 - 1 + fSpread * 0.3 + fWiggle, hly + 5);
            ctx.lineTo(hlx + f * 2 - 2 + fSpread * 0.4 + fWiggle, hly + 8);
            ctx.stroke();
        }
        // Right hand fingers
        for (let f = 0; f < 4; f++) {
            const fSpread = (f - 1.5) * 2.5;
            const fWiggle = Math.sin(t * 2.5 + f) * 0.8;
            ctx.strokeStyle = '#7a6a6a';
            ctx.beginPath();
            ctx.moveTo(hrx + f * 2, hry);
            ctx.lineTo(hrx + f * 2 + fSpread * 0.3 + fWiggle, hry + 5);
            ctx.stroke();
            // Claw tip (sharper during attack)
            ctx.strokeStyle = isAttacking ? '#fff' : '#ccc';
            ctx.lineWidth = isAttacking ? 2 : 1.5;
            ctx.beginPath();
            ctx.moveTo(hrx + f * 2 + fSpread * 0.3 + fWiggle, hry + 5);
            ctx.lineTo(hrx + f * 2 - 1 + fSpread * 0.5 + fWiggle, hry + 9 + clawExtend * 0.15);
            ctx.stroke();
        }

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
