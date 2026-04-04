(function() {
'use strict';
const C = W.Colors;

// WILD HUNT WARRIOR - dark spectral armor with ice effects. Weak to IRON.
W.WildHuntWarrior = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 36, h: 58, hp: 80, damage: 14, speed: 1.2,
            attackRange: 45, attackCooldown: 65, category: 'human',
            scoreLoot: 150, name: 'Wild Hunt', aggroRange: 350
        });
        this.iceDashCooldown = 180;
        this.frostAura = 0;
    }
    update(dt, px, py, platforms) {
        const spd = dt * 60;
        this.frostAura += spd * 0.05;
        this.iceDashCooldown -= spd;
        // Ice dash - teleport forward
        if (this.iceDashCooldown <= 0 && this.state === 'chase') {
            const dist = Math.abs(px - this.x);
            if (dist > 80 && dist < 250) {
                this.x += this.facing * 60;
                this.iceDashCooldown = W.randRange(140, 220);
            }
        }
        super.update(dt, px, py, platforms);
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

        // Walk cycle - heavy menacing stride
        const walkCycle = t * 1.8;
        const stride = isChasing ? Math.sin(walkCycle) : 0;
        const bodyBob = isChasing ? Math.abs(Math.sin(walkCycle)) * 2 : Math.sin(t * 0.4) * 0.8;
        const breathe = Math.sin(t * 0.5) * 0.5;
        const atkLean = isAttacking ? attackProgress * 5 : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - bodyBob;

        // Frost aura
        const auraSize = 26 + Math.sin(this.frostAura * 1.2) * 5;
        ctx.globalAlpha = 0.12 + Math.sin(this.frostAura) * 0.06;
        ctx.fillStyle = C.WILD_HUNT_ICE || '#88aacc';
        ctx.beginPath();
        ctx.arc(x + 18, by + 28, auraSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.08 + Math.sin(this.frostAura * 1.5) * 0.04;
        ctx.fillStyle = '#aaccee';
        ctx.beginPath();
        ctx.arc(x + 18, by + 28, auraSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        // Ice particles
        ctx.fillStyle = '#aaddff';
        for (let i = 0; i < 3; i++) {
            const angle = t * 0.8 + i * (Math.PI * 2 / 3);
            const radius = 20 + Math.sin(t * 1.5 + i) * 4;
            const px = x + 18 + Math.cos(angle) * radius;
            const py = by + 26 + Math.sin(angle) * radius * 0.6;
            ctx.fillRect(px, py, 2, 2);
            ctx.globalAlpha = 0.3;
            ctx.fillRect(px - Math.cos(angle) * 3, py - Math.sin(angle) * 2, 2, 2);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // --- Legs as jointed limbs ---
        const hipLX = x + 11, hipRX = x + 24, hipY = by + 38;
        const footStride = stride * 6;
        const kneeBendL = (1 - Math.abs(stride)) * 3;
        const kneeBendR = (1 - Math.abs(-stride)) * 3;
        const footLY = by + 51 - Math.max(0, stride) * 2;
        const footRY = by + 51 - Math.max(0, -stride) * 2;

        const legColor = '#111';
        this._drawJointedLimb(ctx, hipLX, hipY, hipLX + footStride * 0.3, hipY + 6 + kneeBendL, hipLX + footStride, footLY, 7, legColor);
        this._drawJointedLimb(ctx, hipRX, hipY, hipRX - footStride * 0.3, hipY + 6 + kneeBendR, hipRX - footStride, footRY, 7, legColor);

        // Boots with spikes
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(hipLX + footStride - 4, footLY, 10, 6);
        ctx.fillRect(hipRX - footStride - 4, footRY, 10, 6);
        ctx.fillStyle = '#334';
        ctx.fillRect(hipLX + footStride - 5, footLY, 3, 3);
        ctx.fillRect(hipRX - footStride + 6, footRY, 3, 3);

        // --- Dark plate armor body ---
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x + 5 + atkLean, by + 18, 26, 20 + breathe);

        // Ice accents
        const icePulse = 0.7 + Math.sin(this.frostAura * 1.5) * 0.3;
        const iceR = Math.floor(68 * icePulse);
        const iceG = Math.floor(136 * icePulse);
        const iceB = Math.floor(170 * icePulse);
        ctx.fillStyle = `rgb(${iceR},${iceG},${iceB})`;
        ctx.fillRect(x + 7 + atkLean, by + 20, 2, 8);
        ctx.fillRect(x + 27 + atkLean, by + 20, 2, 8);
        ctx.fillRect(x + 14 + atkLean, by + 24, 8, 2);
        ctx.fillRect(x + 12 + atkLean, by + 30, 12, 1);

        // Spiked shoulders
        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(x + 1 + atkLean, by + 16, 7, 8);
        ctx.fillRect(x + 28 + atkLean, by + 16, 7, 8);
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x - 1 + atkLean, by + 13, 3, 5);
        ctx.fillRect(x + 34 + atkLean, by + 13, 3, 5);
        ctx.fillStyle = `rgb(${iceR},${iceG},${iceB})`;
        ctx.fillRect(x - 1 + atkLean, by + 13, 1, 2);
        ctx.fillRect(x + 36 + atkLean, by + 13, 1, 2);

        // --- Arms as jointed limbs, opposite to legs ---
        const armSwingL = isChasing ? -stride * 4 : Math.sin(t * 0.4) * 1;
        const armSwingR = isChasing ? stride * 4 : -Math.sin(t * 0.4) * 1;
        const armColor = '#0a0a1a';

        // Left arm
        const shLX = x + 3 + atkLean, shLY = by + 24;
        this._drawJointedLimb(ctx, shLX, shLY, shLX - 1 + armSwingL * 0.3, shLY + 6, shLX - 1 + armSwingL, shLY + 13, 5, armColor);

        // Right arm
        const shRX = x + 32 + atkLean, shRY = by + 24;
        this._drawJointedLimb(ctx, shRX, shRY, shRX + 1 + armSwingR * 0.3, shRY + 6, shRX + 1 + armSwingR, shRY + 13, 5, armColor);

        // --- Large sword ---
        const swordRaise = isAttacking ? (1 - attackProgress) * 12 : 0;
        const swordSwing = isAttacking ? attackProgress * 14 : 0;
        const swordX = shRX + 1 + armSwingR;
        ctx.fillStyle = '#8ab';
        ctx.fillRect(swordX, by + 4 - swordRaise + swordSwing, 3, 26);
        ctx.fillStyle = '#aaddff';
        ctx.fillRect(swordX + 1, by + 6 - swordRaise + swordSwing, 2, 3);
        ctx.fillRect(swordX - 1, by + 12 - swordRaise + swordSwing, 2, 3);
        ctx.fillRect(swordX + 1, by + 18 - swordRaise + swordSwing, 2, 3);
        // Hilt
        ctx.fillStyle = '#0a0a2a';
        ctx.fillRect(swordX - 2, by + 18 - swordRaise * 0.5, 7, 3);
        ctx.fillStyle = `rgb(${iceR},${iceG},${iceB})`;
        ctx.fillRect(swordX - 2, by + 18 - swordRaise * 0.5, 7, 1);

        // --- Spiked helmet ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1 : Math.sin(t * 0.4) * 0.3;
        ctx.fillStyle = C.WILD_HUNT_DARK || '#0a0a1a';
        ctx.fillRect(x + 8 + atkLean, by + 2 + headBob, 20, 16);

        // Helmet spikes
        ctx.fillRect(x + 6 + atkLean, by + headBob, 3, 6);
        ctx.fillRect(x + 16 + atkLean, by - 3 + headBob, 4, 6);
        ctx.fillRect(x + 27 + atkLean, by + headBob, 3, 6);

        // Ice-blue eye glow
        const eyeGlow = 0.7 + Math.sin(t * 2) * 0.3;
        ctx.fillStyle = `rgba(102,204,255,${eyeGlow})`;
        ctx.fillRect(x + 12 + atkLean, by + 8 + headBob, 4, 3);
        ctx.fillRect(x + 20 + atkLean, by + 8 + headBob, 4, 3);

        // Eye glow bleed
        ctx.globalAlpha = 0.35 + Math.sin(t * 2) * 0.15;
        ctx.fillStyle = '#44aaff';
        ctx.fillRect(x + 10 + atkLean, by + 7 + headBob, 16, 5);
        if (isChasing) {
            ctx.globalAlpha = 0.15;
            ctx.fillRect(x + 8 + atkLean, by + 8 + headBob, 4, 3);
        }
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        ctx.restore();
    }
};

// WITCH HUNTER - ranged crossbow + melee. Weak to IRON.
W.WitchHunter = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 30, h: 54, hp: 35, damage: 8, speed: 1.2,
            attackRange: 35, attackCooldown: 80, category: 'human',
            scoreLoot: 70, name: 'Witch Hunter', aggroRange: 350
        });
        this.projectiles = [];
        this.shootCooldown = 100;
    }
    update(dt, px, py, platforms) {
        const spd = dt * 60;
        this.shootCooldown -= spd;
        const dist = Math.abs(px - this.x);
        // Ranged attack
        if (dist > 100 && dist < 350 && this.shootCooldown <= 0) {
            this.projectiles.push({
                x: this.x + this.w/2,
                y: this.y + 20,
                vx: this.facing * 5,
                life: 60
            });
            this.shootCooldown = W.randRange(80, 140);
        }
        // Update projectiles
        for (let p of this.projectiles) {
            p.x += p.vx * spd;
            p.life -= spd;
        }
        this.projectiles = this.projectiles.filter(p => p.life > 0);
        super.update(dt, px, py, platforms);
    }
    draw(ctx) {
        super.draw(ctx);
        // Draw projectiles
        for (const p of this.projectiles) {
            ctx.fillStyle = '#8a6a3a';
            ctx.fillRect(p.x, p.y, 8, 2);
            ctx.fillStyle = '#555';
            ctx.fillRect(p.x + (p.vx > 0 ? 8 : -3), p.y-1, 3, 4);
        }
    }
    drawBody(ctx) {
        if (this._t === undefined) this._t = 0;
        this._t += 0.11;
        const x = this.x, y = this.y;
        const t = this._t;
        const isChasing = this.state === 'chase';
        const isAttacking = this.state === 'attack';
        const isHit = this.state === 'hit';
        const attackProgress = isAttacking ? (1 - this.stateTimer / 20) : 0;

        const isShooting = this.shootCooldown > 60;

        // Walk cycle
        const walkCycle = t * 2;
        const stride = isChasing ? Math.sin(walkCycle) : 0;
        const bodyBob = isChasing ? Math.abs(Math.sin(walkCycle)) * 1.5 : Math.sin(t * 0.4) * 0.6;
        const breathe = Math.sin(t * 0.5) * 0.4;
        const atkLean = isAttacking ? attackProgress * 3 : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - bodyBob;

        // --- Legs as jointed limbs ---
        const hipLX = x + 11, hipRX = x + 19, hipY = by + 36;
        const footStride = stride * 6;
        const kneeBendL = (1 - Math.abs(stride)) * 3;
        const kneeBendR = (1 - Math.abs(-stride)) * 3;
        const footLY = by + 48 - Math.max(0, stride) * 2;
        const footRY = by + 48 - Math.max(0, -stride) * 2;

        const legColor = '#3a1a0a';
        this._drawJointedLimb(ctx, hipLX, hipY, hipLX + footStride * 0.3, hipY + 5 + kneeBendL, hipLX + footStride, footLY, 6, legColor);
        this._drawJointedLimb(ctx, hipRX, hipY, hipRX - footStride * 0.3, hipY + 5 + kneeBendR, hipRX - footStride, footRY, 6, legColor);

        // Boots
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(hipLX + footStride - 3, footLY, 7, 5);
        ctx.fillRect(hipRX - footStride - 3, footRY, 7, 5);

        // --- Dark red robes ---
        ctx.fillStyle = C.WITCH_HUNTER_RED || '#8a2a1a';
        ctx.fillRect(x + 5 + atkLean, by + 18, 20, 18 + breathe);
        // Robe bottom sway
        const robeSway1 = Math.sin(t * 1.5) * 1.5;
        const robeSway2 = Math.sin(t * 1.5 + 1) * 1.5;
        ctx.fillRect(x + 4 + atkLean + robeSway1, by + 34, 6, 4);
        ctx.fillRect(x + 20 + atkLean + robeSway2, by + 34, 6, 4);

        // Robe seam
        ctx.fillStyle = '#6a1a0a';
        ctx.fillRect(x + 14 + atkLean, by + 18, 2, 18);

        // Cross emblem
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 13 + atkLean, by + 22, 4, 6);
        ctx.fillRect(x + 11 + atkLean, by + 24, 8, 2);
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.1 : 0.15;
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 11 + atkLean, by + 22, 8, 6);
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        // --- Left arm (opposite to legs) ---
        const armSwingL = isShooting ? -2 : (isChasing ? -stride * 4 : Math.sin(t * 0.4) * 1);
        const shLX = x + 3 + atkLean, shLY = by + 22;
        this._drawJointedLimb(ctx, shLX, shLY, shLX - 1 + armSwingL * 0.3, shLY + 5, shLX - 1 + armSwingL, shLY + 11, 5, '#7a2a1a');

        // --- Right arm + crossbow ---
        const armSwingR = isChasing ? stride * 4 : -Math.sin(t * 0.4) * 1;
        const rightArmExtend = isShooting ? 6 : (isAttacking ? attackProgress * 6 : 0);
        const shRX = x + 26 + atkLean, shRY = by + 22;
        this._drawJointedLimb(ctx, shRX, shRY, shRX + 1 + armSwingR * 0.3 + rightArmExtend * 0.3, shRY + 5 - rightArmExtend * 0.2, shRX + 1 + armSwingR + rightArmExtend * 0.5, shRY + 11 - rightArmExtend * 0.3, 5, '#7a2a1a');

        // Crossbow
        const bowExtend = isShooting ? 4 : 0;
        const bowX = shRX + 1 + armSwingR + rightArmExtend * 0.5;
        const bowY = shRY + 6 - rightArmExtend * 0.2;
        ctx.fillStyle = '#5a4020';
        ctx.fillRect(bowX + bowExtend, bowY - bowExtend * 0.3, 8, 3);
        ctx.fillStyle = '#888';
        ctx.fillRect(bowX - 2 + bowExtend, bowY - 2 - bowExtend * 0.3, 2, 7);
        ctx.fillStyle = '#aaa';
        ctx.fillRect(bowX - 2 + bowExtend, bowY - 2 - bowExtend * 0.3, 1, 1);
        ctx.fillRect(bowX - 2 + bowExtend, bowY + 4 - bowExtend * 0.3, 1, 1);

        // --- Face ---
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(x + 8 + atkLean, by + 8, 14, 10);

        // Eyes
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 10 + atkLean, by + 11, 3, 2);
        ctx.fillRect(x + 17 + atkLean, by + 11, 3, 2);
        ctx.fillStyle = '#9a7a5a';
        ctx.fillRect(x + 10 + atkLean, by + 10, 3, 1);
        ctx.fillRect(x + 17 + atkLean, by + 10, 3, 1);

        // Frown
        ctx.fillStyle = '#9a7a5a';
        ctx.fillRect(x + 11 + atkLean, by + 15, 8, 1);

        // --- Wide-brim hat ---
        const headBob = isChasing ? Math.sin(walkCycle) * 0.8 : Math.sin(t * 0.4) * 0.3;
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(x + 2 + atkLean, by + 4 + headBob, 26, 4);
        ctx.fillRect(x + 8 + atkLean, by + headBob, 14, 6);
        ctx.fillStyle = '#444';
        ctx.fillRect(x + 8 + atkLean, by + 4 + headBob, 14, 1);

        // Hat shadow
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 8 + atkLean, by + 8, 14, 4);
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        ctx.restore();
    }
};

})();
