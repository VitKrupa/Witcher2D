(function() {
'use strict';
const C = W.Colors;

// BANDIT - basic human fighter. Weak to IRON.
W.Bandit = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 30, h: 52, hp: 30, damage: 7, speed: 1.5,
            attackRange: 35, attackCooldown: 50, category: 'human',
            scoreLoot: 40, name: 'Bandit', aggroRange: 260
        });
    }
    drawBody(ctx) {
        if (this._t === undefined) this._t = 0;
        this._t += 0.13;
        const x = this.x, y = this.y;
        const t = this._t;
        const isChasing = this.state === 'chase';
        const isAttacking = this.state === 'attack';
        const isHit = this.state === 'hit';
        const attackProgress = isAttacking ? (1 - this.stateTimer / 20) : 0;

        // Walk cycle
        const walkCycle = t * 2.5;
        const stride = isChasing ? Math.sin(walkCycle) : 0;
        const bodyBob = isChasing ? Math.abs(Math.sin(walkCycle)) * 2 : Math.sin(t * 0.4) * 0.8;
        const breathe = Math.sin(t * 0.5) * 0.5;
        const atkLean = isAttacking ? attackProgress * 4 : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - bodyBob;

        // --- Legs as jointed limbs ---
        const hipLX = x + 11, hipRX = x + 19, hipY = by + 33;
        const footStride = stride * 7;
        const kneeBendL = (1 - Math.abs(stride)) * 3;
        const kneeBendR = (1 - Math.abs(-stride)) * 3;
        const footLY = by + 46 - Math.max(0, stride) * 2;
        const footRY = by + 46 - Math.max(0, -stride) * 2;

        const legColor = '#4a4030';
        this._drawJointedLimb(ctx, hipLX, hipY, hipLX + footStride * 0.3, hipY + 6 + kneeBendL, hipLX + footStride, footLY, 6, legColor);
        this._drawJointedLimb(ctx, hipRX, hipY, hipRX - footStride * 0.3, hipY + 6 + kneeBendR, hipRX - footStride, footRY, 6, legColor);

        // Boots
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(hipLX + footStride - 3, footLY, 7, 5);
        ctx.fillRect(hipRX - footStride - 3, footRY, 7, 5);

        // --- Body ---
        ctx.fillStyle = C.BANDIT_LEATHER || '#6a5a3a';
        ctx.fillRect(x + 6 + atkLean, by + 16, 18, 16 + breathe);
        // Leather stitching
        ctx.fillStyle = '#5a4a2a';
        ctx.fillRect(x + 14 + atkLean, by + 17, 2, 14);

        // Belt
        ctx.fillStyle = '#4a3a1a';
        ctx.fillRect(x + 6 + atkLean, by + 30, 18, 3);
        ctx.fillStyle = '#aa8833';
        ctx.fillRect(x + 13 + atkLean, by + 30, 4, 3);

        // --- Left arm (swings opposite to legs) ---
        const armSwingL = isChasing ? -stride * 5 : Math.sin(t * 0.5) * 1;
        const shLX = x + 4 + atkLean, shLY = by + 19;
        this._drawJointedLimb(ctx, shLX, shLY, shLX - 1 + armSwingL * 0.3, shLY + 5, shLX - 1 + armSwingL, shLY + 11, 5, '#d4a574');

        // --- Right arm + sword (attack arm) ---
        const armSwingR = isChasing ? stride * 4 : -Math.sin(t * 0.5) * 1;
        const swordArmAngle = isAttacking ? attackProgress * 8 : 0;
        const shRX = x + 25 + atkLean, shRY = by + 19;
        this._drawJointedLimb(ctx, shRX, shRY, shRX + 1 + armSwingR * 0.3, shRY + 5 - swordArmAngle * 0.3, shRX + 1 + armSwingR, shRY + 11 - swordArmAngle * 0.5, 5, '#d4a574');

        // Sword
        ctx.fillStyle = '#aaa';
        const swordExtend = isAttacking ? attackProgress * 10 : 0;
        const handRX = shRX + 1 + armSwingR;
        const handRY = shRY + 11 - swordArmAngle * 0.5;
        const swordY = handRY - 10 - swordExtend * 0.3;
        ctx.fillRect(handRX, swordY, 2, 18 + swordExtend * 0.5);
        ctx.fillStyle = '#ddd';
        ctx.fillRect(handRX, swordY + 2, 1, 4);
        // Hilt
        ctx.fillStyle = '#664422';
        ctx.fillRect(handRX - 2, handRY - 2, 6, 3);
        ctx.fillStyle = '#888';
        ctx.fillRect(handRX - 3, handRY - 2, 8, 1);

        // --- Head ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1.2 : Math.sin(t * 0.4) * 0.4;
        // Hood
        ctx.fillStyle = '#6a5a3a';
        ctx.fillRect(x + 7 + atkLean, by + headBob, 16, 6);
        ctx.fillRect(x + 6 + atkLean, by + 3 + headBob, 2, 6);
        ctx.fillRect(x + 22 + atkLean, by + 3 + headBob, 2, 6);

        // Face
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(x + 8 + atkLean, by + 6 + headBob, 14, 10);

        // Eyes
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 10 + atkLean, by + 9 + headBob, 3, 2);
        ctx.fillRect(x + 17 + atkLean, by + 9 + headBob, 3, 2);
        // Eyebrow scowl
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(x + 10 + atkLean, by + 8 + headBob, 3, 1);
        ctx.fillRect(x + 17 + atkLean, by + 8 + headBob, 3, 1);

        // Stubble
        ctx.fillStyle = '#8a7a6a';
        ctx.fillRect(x + 10 + atkLean, by + 13 + headBob, 9, 2);

        ctx.restore();
    }
};

// NILFGAARDIAN SOLDIER - disciplined, armored. Weak to IRON.
W.NilfSoldier = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 32, h: 54, hp: 50, damage: 10, speed: 1.6,
            attackRange: 38, attackCooldown: 60, category: 'human',
            scoreLoot: 80, name: 'Nilfgaardian', aggroRange: 300
        });
        this.blocking = false;
    }
    update(dt, px, py, platforms) {
        super.update(dt, px, py, platforms);
        // Occasionally block
        this.blocking = (this.state === 'chase' && Math.random() < 0.005);
    }
    takeDamage(amount, swordType) {
        if (this.blocking) amount = Math.floor(amount * 0.4);
        return super.takeDamage(amount, swordType);
    }
    drawBody(ctx) {
        if (this._t === undefined) this._t = 0;
        this._t += 0.12;
        const x = this.x, y = this.y;
        const t = this._t;
        const isChasing = this.state === 'chase';
        const isAttacking = this.state === 'attack';
        const isHit = this.state === 'hit';
        const attackProgress = isAttacking ? (1 - this.stateTimer / 20) : 0;

        // Walk cycle - disciplined march
        const walkCycle = t * 2.2;
        const stride = isChasing ? Math.sin(walkCycle) : 0;
        const bodyBob = isChasing ? Math.abs(Math.sin(walkCycle)) * 1.5 : Math.sin(t * 0.4) * 0.5;
        const breathe = Math.sin(t * 0.5) * 0.4;
        const atkLean = isAttacking ? attackProgress * 4 : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - bodyBob;

        // --- Legs as jointed limbs ---
        const hipLX = x + 11, hipRX = x + 21, hipY = by + 33;
        const footStride = stride * 6;
        const kneeBendL = (1 - Math.abs(stride)) * 3;
        const kneeBendR = (1 - Math.abs(-stride)) * 3;
        const footLY = by + 47 - Math.max(0, stride) * 2;
        const footRY = by + 47 - Math.max(0, -stride) * 2;

        const legColor = '#222';
        this._drawJointedLimb(ctx, hipLX, hipY, hipLX + footStride * 0.3, hipY + 6 + kneeBendL, hipLX + footStride, footLY, 6, legColor);
        this._drawJointedLimb(ctx, hipRX, hipY, hipRX - footStride * 0.3, hipY + 6 + kneeBendR, hipRX - footStride, footRY, 6, legColor);

        // Boots
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(hipLX + footStride - 3, footLY, 8, 6);
        ctx.fillRect(hipRX - footStride - 3, footRY, 8, 6);
        ctx.fillStyle = '#333';
        ctx.fillRect(hipLX + footStride - 3, footLY, 8, 1);
        ctx.fillRect(hipRX - footStride - 3, footRY, 8, 1);

        // --- Body ---
        ctx.fillStyle = C.NILF_BLACK || '#1a1a2a';
        ctx.fillRect(x + 5 + atkLean, by + 15, 22, 18 + breathe);

        // Gold sun emblem
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x + 13 + atkLean, by + 20, 6, 6);
        ctx.fillRect(x + 11 + atkLean, by + 22, 10, 2);
        ctx.fillRect(x + 15 + atkLean, by + 18, 2, 10);
        const rayPulse = Math.sin(t * 1.5) * 1;
        ctx.fillRect(x + 11 + atkLean - rayPulse, by + 19 - rayPulse, 2, 2);
        ctx.fillRect(x + 19 + atkLean + rayPulse, by + 19 - rayPulse, 2, 2);
        ctx.fillRect(x + 11 + atkLean - rayPulse, by + 25 + rayPulse, 2, 2);
        ctx.fillRect(x + 19 + atkLean + rayPulse, by + 25 + rayPulse, 2, 2);
        // Emblem glow
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.15 : 0.2 + Math.sin(t * 1.5) * 0.1;
        ctx.fillStyle = '#ffcc44';
        ctx.fillRect(x + 10 + atkLean, by + 18, 12, 10);
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        // Shoulders
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(x + 2 + atkLean, by + 15, 5, 6);
        ctx.fillRect(x + 25 + atkLean, by + 15, 5, 6);
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x + 2 + atkLean, by + 15, 5, 1);
        ctx.fillRect(x + 25 + atkLean, by + 15, 5, 1);

        // --- Shield arm (left, opposite to legs) ---
        const armSwingL = isChasing ? -stride * 4 : Math.sin(t * 0.4) * 1;
        const shieldRaise = this.blocking ? -6 : 0;
        const shLX = x + 3 + atkLean, shLY = by + 20 + shieldRaise;
        this._drawLimb(ctx, shLX, shLY, shLX + armSwingL, shLY + 12, 5, '#1a1a2a');

        // Shield
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(shLX + armSwingL - 4, shLY - 2, 6, 14);
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(shLX + armSwingL - 3, shLY + 3, 4, 4);
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(shLX + armSwingL - 4, shLY - 2, 1, 14);
        if (this.blocking) {
            ctx.globalAlpha = 0.3 + Math.sin(t * 8) * 0.2;
            ctx.fillStyle = '#aaaacc';
            ctx.fillRect(shLX + armSwingL - 4, shLY - 2, 6, 14);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // --- Sword arm (right) ---
        const armSwingR = isChasing ? stride * 3 : -Math.sin(t * 0.4) * 1;
        const swordArmDrop = isAttacking ? attackProgress * 10 : 0;
        const shRX = x + 28 + atkLean, shRY = by + 20;
        this._drawJointedLimb(ctx, shRX, shRY, shRX + 1 + armSwingR * 0.3, shRY + 5 - swordArmDrop * 0.2, shRX + 1 + armSwingR, shRY + 11 - swordArmDrop * 0.3, 5, '#1a1a2a');

        // Sword
        ctx.fillStyle = '#bbb';
        const swordLen = 18 + (isAttacking ? attackProgress * 4 : 0);
        const swordHandY = shRY + 11 - swordArmDrop * 0.3;
        const swordTop = swordHandY - swordLen + 4;
        ctx.fillRect(shRX + 1 + armSwingR, swordTop, 2, swordLen);
        ctx.fillStyle = '#ddd';
        ctx.fillRect(shRX + 1 + armSwingR, swordTop + 2, 1, 5);
        ctx.fillStyle = '#444';
        ctx.fillRect(shRX - 1 + armSwingR, swordHandY - 2, 6, 3);
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(shRX - 1 + armSwingR, swordHandY - 2, 6, 1);

        // --- Helmet ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1 : Math.sin(t * 0.4) * 0.3;
        ctx.fillStyle = C.NILF_BLACK || '#1a1a2a';
        ctx.fillRect(x + 7 + atkLean, by + headBob, 18, 14);
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x + 7 + atkLean, by + 13 + headBob, 18, 2);
        ctx.fillRect(x + 13 + atkLean, by - 1 + headBob, 6, 3);
        ctx.fillStyle = '#a88022';
        ctx.fillRect(x + 14 + atkLean, by - 1 + headBob, 4, 2);

        // Visor
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 10 + atkLean, by + 6 + headBob, 12, 4);

        // Eyes behind visor
        ctx.fillStyle = '#bbb';
        ctx.fillRect(x + 12 + atkLean, by + 7 + headBob, 2, 2);
        ctx.fillRect(x + 18 + atkLean, by + 7 + headBob, 2, 2);

        ctx.restore();
    }
};

})();
