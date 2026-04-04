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

        // Ghostly glow aura - layered for depth
        ctx.globalAlpha = 0.06 + Math.sin(t * 0.6) * 0.03;
        ctx.fillStyle = '#6666cc';
        ctx.beginPath();
        ctx.arc(x + 16, by + 25, 30 + Math.sin(t * 1.2) * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.1 + Math.sin(t * 0.8) * 0.07;
        ctx.fillStyle = '#8888ff';
        ctx.beginPath();
        ctx.arc(x + 16, by + 25, 22 + Math.sin(t * 1.5) * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = alphaBase;

        // --- Outer flowing robe layer (translucent, widest) ---
        const outerGrad = ctx.createLinearGradient(x, by, x, by + 56);
        outerGrad.addColorStop(0, 'rgba(100,115,175,0.15)');
        outerGrad.addColorStop(0.4, 'rgba(90,105,165,0.2)');
        outerGrad.addColorStop(1, 'rgba(70,85,140,0.02)');
        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.moveTo(x + 6 + sway, by + 6);
        ctx.quadraticCurveTo(x - 2 + sway * 0.3, by + 30, x - 1 + Math.sin(t * 1.8) * 3, by + 54 + breathe);
        // Wavy tattered bottom edge
        for (let i = 0; i <= 8; i++) {
            const wx = x - 1 + i * (36 / 8);
            const wy = by + 54 + breathe + Math.sin(t * 2.2 + i * 1.3) * 3.5 + Math.sin(t * 1.1 + i * 0.7) * 2 + (i % 2 === 0 ? 4 : 0);
            ctx.lineTo(wx + Math.sin(t * 1.9 + i * 0.9) * 2, wy);
        }
        ctx.lineTo(x + 35 + Math.sin(t * 1.8 + 2) * 3, by + 54 + breathe);
        ctx.quadraticCurveTo(x + 34 + sway * 0.3, by + 30, x + 26 + sway, by + 6);
        ctx.closePath();
        ctx.fill();

        // --- Middle robe layer (more opaque) ---
        const midGrad = ctx.createLinearGradient(x, by, x, by + 52);
        midGrad.addColorStop(0, 'rgba(120,140,200,0.7)');
        midGrad.addColorStop(0.35, 'rgba(105,125,185,0.5)');
        midGrad.addColorStop(0.7, 'rgba(90,110,170,0.25)');
        midGrad.addColorStop(1, 'rgba(75,95,150,0.03)');
        ctx.fillStyle = midGrad;
        ctx.beginPath();
        ctx.moveTo(x + 7 + sway, by + 5);
        ctx.quadraticCurveTo(x + 1 + sway * 0.4, by + 28, x + 2 + Math.sin(t * 2) * 2, by + 50 + breathe);
        // Wavy tattered bottom edge (slightly different phase)
        for (let i = 0; i <= 7; i++) {
            const wx = x + 2 + i * (28 / 7);
            const wy = by + 50 + breathe + Math.sin(t * 2 + i * 1.5) * 3 + (i % 2 === 0 ? 3 : 0);
            ctx.lineTo(wx + Math.sin(t * 2 + i) * 2, wy);
        }
        ctx.lineTo(x + 30 + Math.sin(t * 2 + 3) * 2, by + 50 + breathe);
        ctx.quadraticCurveTo(x + 31 + sway * 0.4, by + 28, x + 25 + sway, by + 5);
        ctx.closePath();
        ctx.fill();

        // --- Inner robe layer (core shape, most opaque) ---
        const innerGrad = ctx.createLinearGradient(x + 10, by + 8, x + 22, by + 45);
        innerGrad.addColorStop(0, 'rgba(130,150,210,0.6)');
        innerGrad.addColorStop(0.5, 'rgba(110,130,190,0.35)');
        innerGrad.addColorStop(1, 'rgba(90,110,170,0.05)');
        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.moveTo(x + 10 + sway * 0.7, by + 10);
        ctx.lineTo(x + 22 + sway * 0.7, by + 10);
        ctx.quadraticCurveTo(x + 26, by + 30, x + 27 + Math.sin(t * 2.3) * 1.5, by + 46 + breathe);
        // Smaller wavy edge
        for (let i = 0; i <= 4; i++) {
            const wx = x + 27 - i * (22 / 4);
            const wy = by + 46 + breathe + Math.sin(t * 2.5 + i * 2) * 2.5;
            ctx.lineTo(wx, wy);
        }
        ctx.quadraticCurveTo(x + 6, by + 30, x + 10 + sway * 0.7, by + 10);
        ctx.fill();

        // --- Barely visible skeleton inside ---
        ctx.globalAlpha = alphaBase * 0.15;
        ctx.strokeStyle = '#aabbdd';
        ctx.lineWidth = 1;
        // Spine
        ctx.beginPath();
        ctx.moveTo(x + 16 + sway * 0.4, by + 18);
        ctx.lineTo(x + 16 + sway * 0.2, by + 40);
        ctx.stroke();
        // Ribs (faint)
        for (let r = 0; r < 4; r++) {
            const ry = by + 20 + r * 4;
            ctx.beginPath();
            ctx.moveTo(x + 16 + sway * 0.3, ry);
            ctx.quadraticCurveTo(x + 12 + sway * 0.2, ry + 2, x + 9, ry + 1);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 16 + sway * 0.3, ry);
            ctx.quadraticCurveTo(x + 20 + sway * 0.2, ry + 2, x + 23, ry + 1);
            ctx.stroke();
        }
        // Pelvis hint
        ctx.beginPath();
        ctx.moveTo(x + 11 + sway * 0.2, by + 38);
        ctx.quadraticCurveTo(x + 16 + sway * 0.2, by + 42, x + 21 + sway * 0.2, by + 38);
        ctx.stroke();
        // Skull outline inside hood
        ctx.beginPath();
        ctx.arc(x + 16 + sway * 0.6, by + 11, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = alphaBase;

        // --- Hood shape ---
        ctx.fillStyle = midGrad;
        ctx.beginPath();
        ctx.moveTo(x + 6 + sway, by + 2);
        ctx.quadraticCurveTo(x + 16 + sway, by - 3, x + 26 + sway, by + 2);
        ctx.lineTo(x + 27 + sway * 0.7, by + 18);
        ctx.lineTo(x + 5 + sway * 0.7, by + 18);
        ctx.closePath();
        ctx.fill();

        // Hood inner shadow (deeper darkness)
        const hoodShadow = ctx.createRadialGradient(x + 16 + sway * 0.8, by + 10, 2, x + 16 + sway * 0.8, by + 11, 9);
        hoodShadow.addColorStop(0, 'rgba(5,5,20,0.95)');
        hoodShadow.addColorStop(0.6, 'rgba(10,10,30,0.8)');
        hoodShadow.addColorStop(1, 'rgba(30,30,60,0.3)');
        ctx.fillStyle = hoodShadow;
        ctx.beginPath();
        ctx.moveTo(x + 9 + sway * 0.8, by + 5);
        ctx.quadraticCurveTo(x + 16 + sway * 0.8, by + 3, x + 23 + sway * 0.8, by + 5);
        ctx.lineTo(x + 24 + sway * 0.7, by + 16);
        ctx.lineTo(x + 8 + sway * 0.7, by + 16);
        ctx.closePath();
        ctx.fill();

        // Ghostly face features - hollow dark eye sockets
        ctx.fillStyle = 'rgba(0,0,10,0.9)';
        ctx.beginPath();
        ctx.ellipse(x + 13 + sway * 0.8, by + 10, 2.5, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + 19 + sway * 0.8, by + 10, 2.5, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Faint cheekbone ridges
        ctx.globalAlpha = alphaBase * 0.2;
        ctx.strokeStyle = '#8899bb';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x + 11 + sway * 0.8, by + 12);
        ctx.lineTo(x + 13 + sway * 0.8, by + 13);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 21 + sway * 0.8, by + 12);
        ctx.lineTo(x + 19 + sway * 0.8, by + 13);
        ctx.stroke();
        // Nasal ridge hint
        ctx.beginPath();
        ctx.moveTo(x + 16 + sway * 0.8, by + 10);
        ctx.lineTo(x + 16 + sway * 0.8, by + 13);
        ctx.stroke();
        // Mouth line (thin, dark)
        ctx.globalAlpha = alphaBase * 0.3;
        ctx.strokeStyle = 'rgba(0,0,10,0.6)';
        ctx.beginPath();
        ctx.moveTo(x + 13.5 + sway * 0.8, by + 14);
        ctx.quadraticCurveTo(x + 16 + sway * 0.8, by + 14.5 + Math.sin(t * 0.5) * 0.3, x + 18.5 + sway * 0.8, by + 14);
        ctx.stroke();
        ctx.globalAlpha = alphaBase;

        // Glowing eyes deep in sockets
        const eyeBright = 0.7 + Math.sin(t * 2) * 0.3;
        // Eye glow halo
        ctx.globalAlpha = alphaBase * 0.25;
        const eyeGlowGrad1 = ctx.createRadialGradient(x + 13 + sway * 0.8, by + 10, 0, x + 13 + sway * 0.8, by + 10, 4);
        eyeGlowGrad1.addColorStop(0, `rgba(170,210,255,${eyeBright})`);
        eyeGlowGrad1.addColorStop(1, 'rgba(100,140,255,0)');
        ctx.fillStyle = eyeGlowGrad1;
        ctx.beginPath();
        ctx.arc(x + 13 + sway * 0.8, by + 10, 4, 0, Math.PI * 2);
        ctx.fill();
        const eyeGlowGrad2 = ctx.createRadialGradient(x + 19 + sway * 0.8, by + 10, 0, x + 19 + sway * 0.8, by + 10, 4);
        eyeGlowGrad2.addColorStop(0, `rgba(170,210,255,${eyeBright})`);
        eyeGlowGrad2.addColorStop(1, 'rgba(100,140,255,0)');
        ctx.fillStyle = eyeGlowGrad2;
        ctx.beginPath();
        ctx.arc(x + 19 + sway * 0.8, by + 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alphaBase;
        // Eye points
        ctx.fillStyle = `rgba(170,210,255,${eyeBright})`;
        ctx.beginPath();
        ctx.arc(x + 13 + sway * 0.8, by + 10, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 19 + sway * 0.8, by + 10, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Tattered robe edge wisps (wavy paths trailing off)
        ctx.strokeStyle = 'rgba(100,120,180,0.3)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) {
            const wx = x + 4 + i * 6.5;
            const wBase = by + 48 + breathe + Math.sin(t * 2 + i) * 2;
            ctx.beginPath();
            ctx.moveTo(wx + Math.sin(t * 1.5 + i) * 1, wBase);
            ctx.quadraticCurveTo(
                wx + Math.sin(t * 2.2 + i * 1.3) * 3, wBase + 3 + Math.sin(t * 1.8 + i * 0.9) * 1.5,
                wx + Math.sin(t * 2.8 + i * 1.7) * 4, wBase + 7 + Math.sin(t * 1.5 + i * 2) * 2
            );
            ctx.stroke();
        }
        // Extra long tattered strands at edges
        ctx.globalAlpha = alphaBase * 0.4;
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const sx = (i === 0) ? x + 2 : (i === 1) ? x + 30 : x + 16;
            const sBase = by + 50 + breathe;
            ctx.beginPath();
            ctx.moveTo(sx + Math.sin(t * 1.3 + i * 2) * 1, sBase);
            ctx.bezierCurveTo(
                sx + Math.sin(t * 2 + i) * 3, sBase + 4,
                sx + Math.sin(t * 1.7 + i * 1.5) * 5, sBase + 7,
                sx + Math.sin(t * 2.5 + i * 0.8) * 4, sBase + 10 + Math.sin(t * 1.2 + i) * 2
            );
            ctx.stroke();
        }
        ctx.globalAlpha = alphaBase;

        // --- Spectral arms as limbs ---
        const armFloat = Math.sin(t * 1.2) * 3;
        const attackExtend = isAttacking ? attackProgress * 16 : 0;
        const armSwayL = isChasing ? Math.sin(t * 1.5) * 2 : Math.sin(t * 0.5) * 1.5;
        const armSwayR = isChasing ? -Math.sin(t * 1.5) * 2 : -Math.sin(t * 0.5) * 1.5;

        const armColor = 'rgba(100,120,180,0.45)';
        // Left arm
        this._drawJointedLimb(ctx, x + 6 + sway * 0.5, by + 22, x + 2 + sway * 0.3 + armSwayL, by + 28 + armFloat, x + 0 + armSwayL, by + 34 + armFloat, 5, armColor);
        // Right arm (attack arm)
        this._drawJointedLimb(ctx, x + 26 + sway * 0.5, by + 20, x + 30 + sway * 0.3 + armSwayR + attackExtend * 0.4, by + 24 - armFloat, x + 32 + armSwayR + attackExtend, by + 30 - armFloat, 5, armColor);

        // Spectral fingers on both hands
        ctx.strokeStyle = 'rgba(140,160,220,0.4)';
        ctx.lineWidth = 1;
        const flx = x + 0 + armSwayL, fly = by + 34 + armFloat;
        for (let f = 0; f < 3; f++) {
            ctx.beginPath();
            ctx.moveTo(flx, fly);
            ctx.lineTo(flx - 2 + f * 2 + Math.sin(t * 2 + f) * 0.5, fly + 4 + Math.sin(t * 1.5 + f) * 1);
            ctx.stroke();
        }
        if (isAttacking) {
            ctx.strokeStyle = 'rgba(160,180,240,0.6)';
            ctx.lineWidth = 1.5;
        }
        const frx = x + 32 + armSwayR + attackExtend, fry = by + 30 - armFloat;
        for (let f = 0; f < 3; f++) {
            ctx.beginPath();
            ctx.moveTo(frx, fry);
            ctx.lineTo(frx + 2 + f * 1.5 + Math.sin(t * 2.2 + f) * 0.5, fry - 3 + f * 3 + Math.sin(t * 1.7 + f) * 1);
            ctx.stroke();
        }

        // Floating spectral particles (more of them, varied size)
        for (let i = 0; i < 6; i++) {
            const pAlpha = 0.2 + Math.sin(t * 0.9 + i * 1.7) * 0.15;
            ctx.globalAlpha = alphaBase * pAlpha;
            ctx.fillStyle = i % 2 === 0 ? 'rgba(140,160,255,0.6)' : 'rgba(180,200,255,0.4)';
            const px = x + 16 + Math.sin(t * 0.8 + i * 2.1) * 20;
            const py = by + 22 + Math.cos(t * 0.6 + i * 2.5) * 16;
            const ps = 1 + Math.sin(t * 1.3 + i) * 0.5;
            ctx.beginPath();
            ctx.arc(px, py, ps, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
};

})();
