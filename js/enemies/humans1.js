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

        // Boots with detail
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(hipLX + footStride - 3, footLY, 7, 5);
        ctx.fillRect(hipRX - footStride - 3, footRY, 7, 5);
        // Boot tops / straps
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(hipLX + footStride - 3, footLY, 7, 1);
        ctx.fillRect(hipRX - footStride - 3, footRY, 7, 1);
        // Boot soles
        ctx.fillStyle = '#1a1008';
        ctx.fillRect(hipLX + footStride - 3, footLY + 4, 7, 1);
        ctx.fillRect(hipRX - footStride - 3, footRY + 4, 7, 1);

        // --- Body with gradient leather armor ---
        const armorGrad = ctx.createLinearGradient(x + 6 + atkLean, by + 16, x + 24 + atkLean, by + 32 + breathe);
        armorGrad.addColorStop(0, '#7a6a4a');
        armorGrad.addColorStop(0.3, '#6a5a3a');
        armorGrad.addColorStop(0.7, '#5a4a2a');
        armorGrad.addColorStop(1, '#4a3a1a');
        ctx.fillStyle = armorGrad;
        ctx.fillRect(x + 6 + atkLean, by + 16, 18, 16 + breathe);

        // Leather stitching (center seam)
        ctx.strokeStyle = '#4a3a1a';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(x + 15 + atkLean, by + 17);
        ctx.lineTo(x + 15 + atkLean, by + 31 + breathe);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cloth wrinkle lines on torso
        ctx.strokeStyle = 'rgba(40,30,15,0.35)';
        ctx.lineWidth = 0.6;
        // Diagonal wrinkles from shoulder area
        ctx.beginPath();
        ctx.moveTo(x + 7 + atkLean, by + 18); ctx.lineTo(x + 12 + atkLean, by + 22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 23 + atkLean, by + 18); ctx.lineTo(x + 18 + atkLean, by + 22);
        ctx.stroke();
        // Horizontal crease near belly
        ctx.beginPath();
        ctx.moveTo(x + 8 + atkLean, by + 26); ctx.lineTo(x + 22 + atkLean, by + 25);
        ctx.stroke();
        // Another subtle wrinkle
        ctx.beginPath();
        ctx.moveTo(x + 7 + atkLean, by + 29 + breathe); ctx.lineTo(x + 13 + atkLean, by + 28 + breathe);
        ctx.stroke();

        // Leather highlight (light catch on surface)
        ctx.fillStyle = 'rgba(160,140,100,0.12)';
        ctx.fillRect(x + 8 + atkLean, by + 17, 6, 8);

        // Belt
        ctx.fillStyle = '#4a3a1a';
        ctx.fillRect(x + 6 + atkLean, by + 30, 18, 3);
        // Belt buckle with highlight
        ctx.fillStyle = '#aa8833';
        ctx.fillRect(x + 13 + atkLean, by + 30, 4, 3);
        ctx.fillStyle = 'rgba(255,220,120,0.3)';
        ctx.fillRect(x + 13 + atkLean, by + 30, 2, 1);

        // --- Left arm (swings opposite to legs) ---
        const armSwingL = isChasing ? -stride * 5 : Math.sin(t * 0.5) * 1;
        const shLX = x + 4 + atkLean, shLY = by + 19;
        this._drawJointedLimb(ctx, shLX, shLY, shLX - 1 + armSwingL * 0.3, shLY + 5, shLX - 1 + armSwingL, shLY + 11, 5, '#d4a574');

        // --- Right arm + sword (attack arm) ---
        const armSwingR = isChasing ? stride * 4 : -Math.sin(t * 0.5) * 1;
        const swordArmAngle = isAttacking ? attackProgress * 8 : 0;
        const shRX = x + 25 + atkLean, shRY = by + 19;
        this._drawJointedLimb(ctx, shRX, shRY, shRX + 1 + armSwingR * 0.3, shRY + 5 - swordArmAngle * 0.3, shRX + 1 + armSwingR, shRY + 11 - swordArmAngle * 0.5, 5, '#d4a574');

        // Sword with shine highlight
        const swordExtend = isAttacking ? attackProgress * 10 : 0;
        const handRX = shRX + 1 + armSwingR;
        const handRY = shRY + 11 - swordArmAngle * 0.5;
        const swordY = handRY - 10 - swordExtend * 0.3;
        const swordH = 18 + swordExtend * 0.5;

        // Blade gradient
        const bladeGrad = ctx.createLinearGradient(handRX, swordY, handRX + 2, swordY);
        bladeGrad.addColorStop(0, '#999');
        bladeGrad.addColorStop(0.5, '#ccc');
        bladeGrad.addColorStop(1, '#888');
        ctx.fillStyle = bladeGrad;
        ctx.fillRect(handRX, swordY, 2, swordH);

        // Blade shine streak (bright highlight running along the edge)
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(handRX, swordY + 2, 1, swordH - 4);
        // Blade tip highlight
        ctx.fillStyle = '#eee';
        ctx.fillRect(handRX, swordY, 2, 2);

        // Blade edge shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(handRX + 1, swordY + 3, 1, swordH - 5);

        // Crossguard
        ctx.fillStyle = '#888';
        ctx.fillRect(handRX - 3, handRY - 2, 8, 1);
        ctx.fillStyle = '#666';
        ctx.fillRect(handRX - 3, handRY - 1, 8, 1);
        // Hilt / grip
        ctx.fillStyle = '#664422';
        ctx.fillRect(handRX - 1, handRY, 4, 3);
        // Grip wrap lines
        ctx.fillStyle = '#553318';
        ctx.fillRect(handRX - 1, handRY + 1, 4, 1);
        // Pommel
        ctx.fillStyle = '#777';
        ctx.fillRect(handRX, handRY + 3, 2, 1);

        // --- Head (round shape with stubble) ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1.2 : Math.sin(t * 0.4) * 0.4;
        const hx = x + 8 + atkLean;
        const hy = by + 2 + headBob;

        // Hood
        ctx.fillStyle = '#6a5a3a';
        ctx.fillRect(hx - 1, hy - 2, 16, 6);
        ctx.fillRect(hx - 2, hy + 1, 2, 6);
        ctx.fillRect(hx + 14, hy + 1, 2, 6);
        // Hood shadow
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(hx, hy + 3, 14, 2);

        // Face - round head shape using filled arcs
        ctx.fillStyle = '#d4a574';
        ctx.beginPath();
        ctx.arc(hx + 7, hy + 9, 7, 0, Math.PI * 2);
        ctx.fill();

        // Ear
        ctx.fillStyle = '#c49564';
        ctx.fillRect(hx - 1, hy + 7, 2, 4);

        // Eyes
        ctx.fillStyle = '#333';
        ctx.fillRect(hx + 2, hy + 7, 3, 2);
        ctx.fillRect(hx + 9, hy + 7, 3, 2);
        // Eyebrow scowl
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(hx + 2, hy + 6, 3, 1);
        ctx.fillRect(hx + 9, hy + 6, 3, 1);
        // Eye whites
        ctx.fillStyle = '#ddd';
        ctx.fillRect(hx + 2, hy + 7, 1, 1);
        ctx.fillRect(hx + 9, hy + 7, 1, 1);

        // Nose
        ctx.fillStyle = '#c49564';
        ctx.fillRect(hx + 6, hy + 9, 2, 2);

        // Stubble dots pattern
        ctx.fillStyle = 'rgba(80,65,50,0.45)';
        // Chin stubble
        ctx.fillRect(hx + 3, hy + 12, 1, 1);
        ctx.fillRect(hx + 5, hy + 13, 1, 1);
        ctx.fillRect(hx + 7, hy + 13, 1, 1);
        ctx.fillRect(hx + 9, hy + 12, 1, 1);
        ctx.fillRect(hx + 11, hy + 12, 1, 1);
        // Jaw stubble
        ctx.fillRect(hx + 2, hy + 11, 1, 1);
        ctx.fillRect(hx + 4, hy + 12, 1, 1);
        ctx.fillRect(hx + 6, hy + 12, 1, 1);
        ctx.fillRect(hx + 8, hy + 12, 1, 1);
        ctx.fillRect(hx + 10, hy + 11, 1, 1);
        ctx.fillRect(hx + 12, hy + 11, 1, 1);
        // Upper lip stubble
        ctx.fillRect(hx + 4, hy + 11, 1, 1);
        ctx.fillRect(hx + 6, hy + 11, 1, 1);
        ctx.fillRect(hx + 8, hy + 11, 1, 1);

        // Mouth
        ctx.fillStyle = '#8a5a40';
        ctx.fillRect(hx + 5, hy + 11, 4, 1);

        // Scar on cheek
        ctx.strokeStyle = 'rgba(180,120,100,0.5)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(hx + 10, hy + 8);
        ctx.lineTo(hx + 12, hy + 11);
        ctx.stroke();

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

        // Boots - polished military
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(hipLX + footStride - 3, footLY, 8, 6);
        ctx.fillRect(hipRX - footStride - 3, footRY, 8, 6);
        // Boot shine
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(hipLX + footStride - 2, footLY + 1, 3, 2);
        ctx.fillRect(hipRX - footStride - 2, footRY + 1, 3, 2);
        // Boot tops
        ctx.fillStyle = '#333';
        ctx.fillRect(hipLX + footStride - 3, footLY, 8, 1);
        ctx.fillRect(hipRX - footStride - 3, footRY, 8, 1);

        // --- Body - polished black armor with white reflections ---
        const armorGrad = ctx.createLinearGradient(x + 5 + atkLean, by + 15, x + 27 + atkLean, by + 33 + breathe);
        armorGrad.addColorStop(0, '#2a2a3a');
        armorGrad.addColorStop(0.3, '#1a1a2a');
        armorGrad.addColorStop(0.6, '#141420');
        armorGrad.addColorStop(1, '#1a1a2a');
        ctx.fillStyle = armorGrad;
        ctx.fillRect(x + 5 + atkLean, by + 15, 22, 18 + breathe);

        // White reflection streaks on polished armor
        ctx.fillStyle = 'rgba(200,200,220,0.15)';
        ctx.fillRect(x + 7 + atkLean, by + 16, 2, 12);
        ctx.fillStyle = 'rgba(200,200,220,0.1)';
        ctx.fillRect(x + 10 + atkLean, by + 17, 1, 10);
        ctx.fillStyle = 'rgba(200,200,220,0.08)';
        ctx.fillRect(x + 22 + atkLean, by + 16, 2, 8);
        // Subtle moving reflection
        const refShift = Math.sin(t * 0.8) * 2;
        ctx.fillStyle = 'rgba(220,220,240,0.12)';
        ctx.fillRect(x + 14 + atkLean + refShift, by + 17, 1, 6);

        // Armor plate edge lines
        ctx.strokeStyle = 'rgba(60,60,80,0.6)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x + 5 + atkLean, by + 23); ctx.lineTo(x + 27 + atkLean, by + 23);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 5 + atkLean, by + 28); ctx.lineTo(x + 27 + atkLean, by + 28);
        ctx.stroke();

        // --- Detailed gold sun emblem ---
        const ecx = x + 16 + atkLean; // emblem center x
        const ecy = by + 23; // emblem center y
        const rayPulse = Math.sin(t * 1.5) * 0.8;

        // Sun disc center
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.beginPath();
        ctx.arc(ecx, ecy, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner sun ring
        ctx.strokeStyle = '#ddb840';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(ecx, ecy, 2, 0, Math.PI * 2);
        ctx.stroke();

        // Sun rays - 8 pointed
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        const rayLen = 4 + rayPulse;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const rx = Math.cos(angle);
            const ry = Math.sin(angle);
            // Main ray
            ctx.fillRect(ecx + rx * 3.5 - 0.5, ecy + ry * 3.5 - 0.5, 1 + Math.abs(rx) * 1.5, 1 + Math.abs(ry) * 1.5);
            // Ray tip
            if (i % 2 === 0) {
                ctx.fillRect(ecx + rx * rayLen - 0.5, ecy + ry * rayLen - 0.5, 1.5, 1.5);
            }
        }

        // Cardinal rays (longer, thicker)
        ctx.fillRect(ecx - 1, ecy - rayLen - 2, 2, rayLen + 1);  // top
        ctx.fillRect(ecx - 1, ecy + 3, 2, rayLen + 1);            // bottom
        ctx.fillRect(ecx - rayLen - 2, ecy - 1, rayLen + 1, 2);   // left
        ctx.fillRect(ecx + 3, ecy - 1, rayLen + 1, 2);            // right

        // Emblem glow
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.1 : 0.15 + Math.sin(t * 1.5) * 0.08;
        ctx.fillStyle = '#ffcc44';
        ctx.beginPath();
        ctx.arc(ecx, ecy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        // --- Shoulder pauldrons ---
        const shPadGrad = ctx.createLinearGradient(x + 2 + atkLean, by + 15, x + 7 + atkLean, by + 21);
        shPadGrad.addColorStop(0, '#3a3a4a');
        shPadGrad.addColorStop(0.5, '#2a2a3a');
        shPadGrad.addColorStop(1, '#1a1a2a');
        ctx.fillStyle = shPadGrad;
        ctx.fillRect(x + 2 + atkLean, by + 15, 5, 6);
        ctx.fillRect(x + 25 + atkLean, by + 15, 5, 6);
        // Gold trim on pauldrons
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x + 2 + atkLean, by + 15, 5, 1);
        ctx.fillRect(x + 25 + atkLean, by + 15, 5, 1);
        // Pauldron rivet
        ctx.fillStyle = '#888';
        ctx.fillRect(x + 4 + atkLean, by + 18, 1, 1);
        ctx.fillRect(x + 27 + atkLean, by + 18, 1, 1);
        // Reflection streak on pauldrons
        ctx.fillStyle = 'rgba(200,200,220,0.15)';
        ctx.fillRect(x + 3 + atkLean, by + 16, 1, 3);
        ctx.fillRect(x + 26 + atkLean, by + 16, 1, 3);

        // --- Shield arm (left, opposite to legs) ---
        const armSwingL = isChasing ? -stride * 4 : Math.sin(t * 0.4) * 1;
        const shieldRaise = this.blocking ? -6 : 0;
        const shLX = x + 3 + atkLean, shLY = by + 20 + shieldRaise;
        this._drawLimb(ctx, shLX, shLY, shLX + armSwingL, shLY + 12, 5, '#1a1a2a');

        // Shield with detailed emblem
        const shdX = shLX + armSwingL - 4;
        const shdY = shLY - 2;
        // Shield body gradient
        const shieldGrad = ctx.createLinearGradient(shdX, shdY, shdX + 6, shdY + 14);
        shieldGrad.addColorStop(0, '#3a3a4a');
        shieldGrad.addColorStop(0.5, '#2a2a3a');
        shieldGrad.addColorStop(1, '#222233');
        ctx.fillStyle = shieldGrad;
        ctx.fillRect(shdX, shdY, 6, 14);
        // Shield border
        ctx.strokeStyle = '#4a4a5a';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(shdX + 0.5, shdY + 0.5, 5, 13);
        // Shield gold trim edge
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(shdX, shdY, 6, 1);
        ctx.fillRect(shdX, shdY + 13, 6, 1);
        // Small sun emblem on shield
        ctx.fillRect(shdX + 1, shdY + 5, 4, 4);
        ctx.fillRect(shdX + 2, shdY + 4, 2, 6);
        // Shield reflection
        ctx.fillStyle = 'rgba(200,200,220,0.1)';
        ctx.fillRect(shdX + 1, shdY + 2, 1, 8);

        if (this.blocking) {
            ctx.globalAlpha = 0.3 + Math.sin(t * 8) * 0.2;
            ctx.fillStyle = '#aaaacc';
            ctx.fillRect(shdX, shdY, 6, 14);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // --- Sword arm (right) ---
        const armSwingR = isChasing ? stride * 3 : -Math.sin(t * 0.4) * 1;
        const swordArmDrop = isAttacking ? attackProgress * 10 : 0;
        const shRX = x + 28 + atkLean, shRY = by + 20;
        this._drawJointedLimb(ctx, shRX, shRY, shRX + 1 + armSwingR * 0.3, shRY + 5 - swordArmDrop * 0.2, shRX + 1 + armSwingR, shRY + 11 - swordArmDrop * 0.3, 5, '#1a1a2a');

        // Sword
        const swordLen = 18 + (isAttacking ? attackProgress * 4 : 0);
        const swordHandY = shRY + 11 - swordArmDrop * 0.3;
        const swordTop = swordHandY - swordLen + 4;
        const swordX = shRX + 1 + armSwingR;

        // Blade gradient
        const swordGrad = ctx.createLinearGradient(swordX, swordTop, swordX + 2, swordTop);
        swordGrad.addColorStop(0, '#aaa');
        swordGrad.addColorStop(0.5, '#ddd');
        swordGrad.addColorStop(1, '#999');
        ctx.fillStyle = swordGrad;
        ctx.fillRect(swordX, swordTop, 2, swordLen);

        // Blade shine streak
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fillRect(swordX, swordTop + 2, 1, swordLen - 4);
        // Blade tip
        ctx.fillStyle = '#eee';
        ctx.fillRect(swordX, swordTop, 2, 2);
        // Blade edge shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(swordX + 1, swordTop + 3, 1, swordLen - 5);

        // Crossguard with gold
        ctx.fillStyle = '#444';
        ctx.fillRect(swordX - 1, swordHandY - 2, 6, 3);
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(swordX - 1, swordHandY - 2, 6, 1);
        // Grip
        ctx.fillStyle = '#222';
        ctx.fillRect(swordX, swordHandY + 1, 2, 3);
        // Pommel
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(swordX - 0.5, swordHandY + 4, 3, 1);

        // --- Helmet (proper shape with visor) ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1 : Math.sin(t * 0.4) * 0.3;
        const hlx = x + 7 + atkLean;
        const hly = by + headBob;

        // Helmet dome - gradient
        const helmGrad = ctx.createLinearGradient(hlx, hly, hlx + 18, hly + 14);
        helmGrad.addColorStop(0, '#2a2a3a');
        helmGrad.addColorStop(0.4, '#1a1a2a');
        helmGrad.addColorStop(0.7, '#141420');
        helmGrad.addColorStop(1, '#1a1a2a');
        ctx.fillStyle = helmGrad;
        // Main helmet shape - rounded top
        ctx.fillRect(hlx + 2, hly - 1, 14, 3);  // top curve
        ctx.fillRect(hlx, hly + 2, 18, 12);       // main body

        // Helmet reflection streaks
        ctx.fillStyle = 'rgba(200,200,220,0.15)';
        ctx.fillRect(hlx + 3, hly, 2, 10);
        ctx.fillStyle = 'rgba(200,200,220,0.08)';
        ctx.fillRect(hlx + 8, hly + 1, 1, 8);

        // Gold trim at bottom of helmet
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(hlx, hly + 13, 18, 2);
        // Gold crest on top
        ctx.fillRect(hlx + 7, hly - 3, 4, 4);
        ctx.fillStyle = '#ddb840';
        ctx.fillRect(hlx + 8, hly - 3, 2, 3);
        // Crest highlight
        ctx.fillStyle = 'rgba(255,220,120,0.3)';
        ctx.fillRect(hlx + 8, hly - 2, 1, 2);

        // Visor slit - dark horizontal gap with depth
        ctx.fillStyle = '#111';
        ctx.fillRect(hlx + 3, hly + 6, 12, 4);
        // Visor upper edge (brow)
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(hlx + 2, hly + 5, 14, 1);
        // Visor lower edge
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(hlx + 3, hly + 10, 12, 1);

        // Nose guard (vertical bar in visor)
        ctx.fillStyle = '#222233';
        ctx.fillRect(hlx + 8, hly + 5, 2, 6);
        // Nose guard highlight
        ctx.fillStyle = 'rgba(200,200,220,0.12)';
        ctx.fillRect(hlx + 8, hly + 5, 1, 4);

        // Eyes glinting behind visor
        ctx.fillStyle = '#bbb';
        ctx.fillRect(hlx + 5, hly + 7, 2, 2);
        ctx.fillRect(hlx + 11, hly + 7, 2, 2);
        // Eye glow hint
        ctx.fillStyle = 'rgba(180,180,200,0.3)';
        ctx.fillRect(hlx + 4, hly + 7, 1, 2);
        ctx.fillRect(hlx + 13, hly + 7, 1, 2);

        // Cheek plates
        ctx.fillStyle = '#1a1a28';
        ctx.fillRect(hlx, hly + 8, 3, 5);
        ctx.fillRect(hlx + 15, hly + 8, 3, 5);
        // Cheek plate reflection
        ctx.fillStyle = 'rgba(200,200,220,0.1)';
        ctx.fillRect(hlx + 1, hly + 9, 1, 3);
        ctx.fillRect(hlx + 16, hly + 9, 1, 3);

        ctx.restore();
    }
};

})();
