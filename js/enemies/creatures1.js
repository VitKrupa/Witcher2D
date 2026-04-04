(function() {
'use strict';
const C = W.Colors;

// NEKKER - small, fast, pack creature. Weak to SILVER.
W.Nekker = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 24, h: 30, hp: 25, damage: 5, speed: 1.6,
            attackRange: 25, attackCooldown: 40, category: 'creature',
            scoreLoot: 30, name: 'Nekker', aggroRange: 250
        });
    }
    drawBody(ctx) {
        if (this._t === undefined) this._t = 0;
        this._t += 0.15;
        const x = this.x, y = this.y, f = this.facing;
        const t = this._t;
        const isChasing = this.state === 'chase';
        const isAttacking = this.state === 'attack';
        const isHit = this.state === 'hit';
        const attackProgress = isAttacking ? (1 - this.stateTimer / 20) : 0;

        // Walk cycle - continuous phase for natural stride
        const walkCycle = t * 2.5;
        const stride = isChasing ? Math.sin(walkCycle) : 0;
        const bodyBob = isChasing ? Math.abs(Math.sin(walkCycle)) * 3 : Math.sin(t * 0.5) * 0.8;
        const breathe = Math.sin(t * 0.6) * 0.5;

        ctx.save();
        if (f === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - bodyBob;
        const leanX = isChasing ? 2 : 0;
        const atkLean = isAttacking ? attackProgress * 4 : 0;

        // --- Legs as jointed limbs ---
        const hipLX = x + 8, hipRX = x + 16, hipY = by + 22;
        const legLen = 6;
        // Stride moves foot forward/back, knee bends at mid-stride
        const footL_dx = stride * 5;
        const footR_dx = -stride * 5;
        const kneeBendL = (1 - Math.abs(stride)) * 2;
        const kneeBendR = (1 - Math.abs(-stride)) * 2;
        const footLY = by + 28 - Math.max(0, stride) * 2;
        const footRY = by + 28 - Math.max(0, -stride) * 2;
        const kneeLX = hipLX + footL_dx * 0.4;
        const kneeRX = hipRX + footR_dx * 0.4;
        const kneeLY = hipY + legLen * 0.5 + kneeBendL;
        const kneeRY = hipY + legLen * 0.5 + kneeBendR;

        const legColor = C.NEKKER_BROWN || '#5a4a2a';
        this._drawJointedLimb(ctx, hipLX, hipY, kneeLX, kneeLY, hipLX + footL_dx, footLY, 4, legColor);
        this._drawJointedLimb(ctx, hipRX, hipY, kneeRX, kneeRY, hipRX + footR_dx, footRY, 4, legColor);

        // Feet with claws
        ctx.fillStyle = '#3a2a0a';
        ctx.fillRect(hipLX + footL_dx - 2, footLY, 5, 3);
        ctx.fillRect(hipRX + footR_dx - 2, footRY, 5, 3);

        // --- Body ---
        ctx.fillStyle = C.NEKKER_BROWN || '#5a4a2a';
        ctx.fillRect(x + 4 + leanX + atkLean, by + 10, 16, 13 + breathe);
        // Belly detail
        ctx.fillStyle = '#4a3a1a';
        ctx.fillRect(x + 7 + leanX + atkLean, by + 16, 10, 4);

        // --- Head ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1.2 : Math.sin(t * 0.7) * 0.5;
        ctx.fillStyle = '#6a5a3a';
        ctx.fillRect(x + 5 + leanX + atkLean, by + 2 + headBob, 14, 10);

        // Eyes - glowing, pulsing
        const eyePulse = 0.7 + Math.sin(t * 2) * 0.3;
        const eyeR = Math.floor(170 * eyePulse);
        const eyeG = Math.floor(255 * eyePulse);
        ctx.fillStyle = `rgb(${eyeR},${eyeG},68)`;
        ctx.fillRect(x + 7 + leanX + atkLean, by + 5 + headBob, 3, 2);
        ctx.fillRect(x + 13 + leanX + atkLean, by + 5 + headBob, 3, 2);
        // Eye glow
        ctx.globalAlpha = ctx.globalAlpha * 0.25;
        ctx.fillStyle = '#aaff44';
        ctx.fillRect(x + 6 + leanX + atkLean, by + 4 + headBob, 5, 4);
        ctx.fillRect(x + 12 + leanX + atkLean, by + 4 + headBob, 5, 4);
        ctx.globalAlpha = isHit && Math.floor(t * 10) % 2 === 0 ? 0.5 : 1;

        // Mouth - opens during attack
        ctx.fillStyle = '#3a2a1a';
        const mouthOpen = isAttacking ? 3 : 1;
        ctx.fillRect(x + 9 + leanX + atkLean, by + 9 + headBob, 6, mouthOpen + 1);
        if (isAttacking) {
            ctx.fillStyle = '#ddd';
            ctx.fillRect(x + 9 + leanX + atkLean, by + 9 + headBob, 1, 1);
            ctx.fillRect(x + 11 + leanX + atkLean, by + 9 + headBob, 1, 1);
            ctx.fillRect(x + 13 + leanX + atkLean, by + 9 + headBob, 1, 1);
        }

        // --- Arms as limbs, swing opposite to legs ---
        const armSwingL = isChasing ? -stride * 5 : Math.sin(t * 0.8) * 2;
        const armSwingR = isChasing ? stride * 5 : -Math.sin(t * 0.8) * 2;
        const clawExtend = isAttacking ? attackProgress * 8 : 0;

        const shoulderLX = x + 4 + leanX + atkLean, shoulderRX = x + 20 + leanX + atkLean;
        const shoulderY = by + 13;
        const armColor = '#4a3a1a';

        // Left arm
        const elbowLX = shoulderLX - 2 + armSwingL * 0.3;
        const elbowLY = shoulderY + 5;
        const handLX = shoulderLX - 1 + armSwingL;
        const handLY = shoulderY + 10;
        this._drawJointedLimb(ctx, shoulderLX, shoulderY, elbowLX, elbowLY, handLX, handLY, 4, armColor);

        // Right arm (attack arm)
        const elbowRX = shoulderRX + 2 + armSwingR * 0.3 + clawExtend * 0.3;
        const elbowRY = shoulderY + 5 - clawExtend * 0.2;
        const handRX = shoulderRX + 1 + armSwingR + clawExtend;
        const handRY = shoulderY + 10 - clawExtend * 0.3;
        this._drawJointedLimb(ctx, shoulderRX, shoulderY, elbowRX, elbowRY, handRX, handRY, 4, armColor);

        // Claws
        ctx.fillStyle = '#ddd';
        ctx.fillRect(handLX - 1, handLY, 2, 3);
        ctx.fillRect(handLX + 1, handLY + 1, 1, 2);
        ctx.fillRect(handRX - 1, handRY, 2, 3);
        ctx.fillRect(handRX + 1, handRY - 1, 1, 3);
        ctx.fillRect(handRX - 2, handRY + 1, 1, 2);

        // Spine ridge detail
        ctx.fillStyle = '#3a2a0a';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x + 11 + leanX + atkLean, by + 10 + i * 4, 2, 2);
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
        if (this._t === undefined) this._t = 0;
        this._t += 0.12;
        const x = this.x, y = this.y, f = this.facing;
        const t = this._t;
        const isChasing = this.state === 'chase';
        const isAttacking = this.state === 'attack';
        const isHit = this.state === 'hit';
        const attackProgress = isAttacking ? (1 - this.stateTimer / 20) : 0;

        // Walk cycle - lurching shamble with forward stride
        const walkCycle = t * 1.8;
        const stride = isChasing ? Math.sin(walkCycle) : 0;
        const bodyBob = isChasing ? Math.abs(Math.sin(walkCycle)) * 2.5 + Math.sin(walkCycle * 2) * 0.8 : Math.sin(t * 0.4) * 1.2;
        const shambleLean = isChasing ? Math.sin(walkCycle) * 1.5 : 0;
        const breathe = Math.sin(t * 0.5) * 0.6;

        ctx.save();
        if (f === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - bodyBob;
        const atkLean = isAttacking ? attackProgress * 5 : 0;

        // Water drip particles
        ctx.fillStyle = 'rgba(80,160,180,0.6)';
        const drip1Y = (t * 30) % 20;
        const drip2Y = ((t * 30) + 10) % 20;
        ctx.fillRect(x + 10 + Math.sin(t * 2) * 2, by + 20 + drip1Y, 2, 3);
        ctx.fillRect(x + 22 + Math.sin(t * 2.5) * 2, by + 16 + drip2Y, 2, 3);

        // --- Legs as jointed limbs ---
        const hipLX = x + 11, hipRX = x + 23, hipY = by + 33;
        const footStride = stride * 7;
        const kneeBendL = (1 - Math.abs(stride)) * 3;
        const kneeBendR = (1 - Math.abs(-stride)) * 3;
        const footLY = by + 44 - Math.max(0, stride) * 3;
        const footRY = by + 44 - Math.max(0, -stride) * 3;

        const legColor = C.DROWNER_DARK || '#2a4a3a';
        this._drawJointedLimb(ctx, hipLX, hipY, hipLX + footStride * 0.3, hipY + 5 + kneeBendL, hipLX + footStride, footLY, 6, legColor);
        this._drawJointedLimb(ctx, hipRX, hipY, hipRX - footStride * 0.3, hipY + 5 + kneeBendR, hipRX - footStride, footRY, 6, legColor);

        // Webbed feet
        ctx.fillStyle = '#4a8a6a';
        ctx.fillRect(hipLX + footStride - 3, footLY, 9, 4);
        ctx.fillRect(hipRX - footStride - 3, footRY, 9, 4);
        // Toe webbing
        ctx.fillStyle = '#3a7a5a';
        ctx.fillRect(hipLX + footStride - 3, footLY, 2, 5);
        ctx.fillRect(hipLX + footStride + 4, footLY, 2, 5);
        ctx.fillRect(hipRX - footStride - 3, footRY, 2, 5);
        ctx.fillRect(hipRX - footStride + 4, footRY, 2, 5);

        // --- Body ---
        const slimeShift = Math.sin(t * 0.7) * 10;
        const bodyR = Math.floor(58 + slimeShift);
        const bodyG = Math.floor(106 - slimeShift * 0.5);
        const bodyB = Math.floor(90 + slimeShift * 0.5);
        ctx.fillStyle = `rgb(${bodyR},${bodyG},${bodyB})`;
        ctx.fillRect(x + 6 + shambleLean + atkLean, by + 14, 22, 20 + breathe);

        // Slimy patches
        ctx.fillStyle = C.DROWNER_DARK || '#2a4a3a';
        ctx.fillRect(x + 8 + shambleLean + atkLean + Math.sin(t * 0.3) * 2, by + 18, 5, 3);
        ctx.fillRect(x + 18 + shambleLean + atkLean + Math.cos(t * 0.4) * 2, by + 22, 5, 3);
        // Slime highlight
        ctx.fillStyle = 'rgba(100,200,170,0.3)';
        ctx.fillRect(x + 12 + shambleLean + atkLean, by + 16, 3, 2);
        ctx.fillRect(x + 20 + shambleLean + atkLean, by + 20, 3, 2);

        // --- Head ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1.5 : Math.sin(t * 0.5) * 0.7;
        ctx.fillStyle = C.DROWNER_SKIN || '#3a6a5a';
        ctx.fillRect(x + 8 + shambleLean + atkLean, by + 2 + headBob, 18, 14);

        ctx.fillStyle = C.DROWNER_DARK || '#2a4a3a';
        ctx.fillRect(x + 10 + shambleLean + atkLean, by + 4 + headBob, 4, 3);
        ctx.fillRect(x + 20 + shambleLean + atkLean, by + 6 + headBob, 4, 3);

        // Eyes
        const eyePulse = 0.8 + Math.sin(t * 1.5) * 0.2;
        ctx.fillStyle = `rgba(${Math.floor(170 * eyePulse)},${Math.floor(186 * eyePulse)},68,1)`;
        ctx.fillRect(x + 10 + shambleLean + atkLean, by + 6 + headBob, 4, 3);
        ctx.fillRect(x + 18 + shambleLean + atkLean, by + 6 + headBob, 4, 3);
        ctx.fillStyle = '#222';
        ctx.fillRect(x + 11 + shambleLean + atkLean, by + 7 + headBob, 2, 2);
        ctx.fillRect(x + 19 + shambleLean + atkLean, by + 7 + headBob, 2, 2);

        // Mouth with teeth
        const mouthOpen = isAttacking ? attackProgress * 4 : 0;
        ctx.fillStyle = '#2a3a2a';
        ctx.fillRect(x + 12 + shambleLean + atkLean, by + 12 + headBob, 10, 3 + mouthOpen);
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 13 + shambleLean + atkLean, by + 12 + headBob, 2, 2);
        ctx.fillRect(x + 17 + shambleLean + atkLean, by + 12 + headBob, 2, 2);
        ctx.fillRect(x + 20 + shambleLean + atkLean, by + 12 + headBob, 2, 2);
        if (isAttacking) {
            ctx.fillRect(x + 14 + shambleLean + atkLean, by + 14 + headBob + mouthOpen, 2, 2);
            ctx.fillRect(x + 18 + shambleLean + atkLean, by + 14 + headBob + mouthOpen, 2, 2);
        }

        // --- Arms as limbs, opposite to legs ---
        const armSwingL = isChasing ? -stride * 5 : Math.sin(t * 0.5) * 2;
        const armSwingR = isChasing ? stride * 5 : -Math.sin(t * 0.5) * 2;
        const clawExtend = isAttacking ? attackProgress * 10 : 0;

        const shLX = x + 6 + shambleLean + atkLean, shRX = x + 28 + shambleLean + atkLean;
        const shY = by + 18;
        const armColor = '#4a8a6a';

        // Left arm
        this._drawJointedLimb(ctx, shLX, shY, shLX - 2 + armSwingL * 0.3, shY + 6, shLX - 1 + armSwingL, shY + 12, 5, armColor);
        // Right arm (attack arm)
        this._drawJointedLimb(ctx, shRX, shY, shRX + 2 + armSwingR * 0.3 + clawExtend * 0.3, shY + 6 - clawExtend * 0.2, shRX + 1 + armSwingR + clawExtend, shY + 12 - clawExtend * 0.4, 5, armColor);

        // Claws
        ctx.fillStyle = '#3a7a5a';
        const hlx = shLX - 1 + armSwingL, hly = shY + 12;
        ctx.fillRect(hlx - 1, hly, 3, 4);
        ctx.fillRect(hlx + 2, hly + 1, 2, 3);
        const hrx = shRX + 1 + armSwingR + clawExtend, hry = shY + 12 - clawExtend * 0.4;
        ctx.fillRect(hrx - 1, hry, 3, 4);
        ctx.fillRect(hrx + 2, hry - 1, 2, 5);

        ctx.restore();
    }
};

})();
