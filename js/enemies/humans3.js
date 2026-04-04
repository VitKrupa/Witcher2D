(function() {
'use strict';
const C = W.Colors;

// NOBLEMAN THUG - fast dual-dagger fighter. Weak to IRON.
W.NoblemanThug = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 28, h: 52, hp: 35, damage: 9, speed: 1.5,
            attackRange: 30, attackCooldown: 35, category: 'human',
            scoreLoot: 60, name: 'Nobleman', aggroRange: 280
        });
        this.dodgeCooldown = 0;
    }
    update(dt, px, py, platforms) {
        const spd = dt * 60;
        this.dodgeCooldown -= spd;
        super.update(dt, px, py, platforms);
        // Dodge back after attacking
        if (this.state === 'attack' && this.stateTimer < 3 && this.dodgeCooldown <= 0) {
            this.x -= this.facing * 30;
            this.dodgeCooldown = 80;
        }
    }
    drawBody(ctx) {
        if (this._t === undefined) this._t = 0;
        this._t += 0.14;
        const x = this.x, y = this.y;
        const t = this._t;
        const isChasing = this.state === 'chase';
        const isAttacking = this.state === 'attack';
        const isHit = this.state === 'hit';
        const attackProgress = isAttacking ? (1 - this.stateTimer / 20) : 0;

        // Walk cycle - quick nimble movement
        const walkCycle = t * 3;
        const stride = isChasing ? Math.sin(walkCycle) : 0;
        const bodyBob = isChasing ? Math.abs(Math.sin(walkCycle)) * 2.5 : Math.sin(t * 0.5) * 0.8;
        const breathe = Math.sin(t * 0.5) * 0.5;
        const atkLean = isAttacking ? attackProgress * 4 : 0;

        // Dodge state
        const isDodging = this.dodgeCooldown > 60;
        const dodgeSpin = isDodging ? Math.sin((80 - this.dodgeCooldown) * 0.3) * 0.5 : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        if (isDodging) {
            ctx.translate(x + this.w / 2, y + this.h / 2);
            ctx.rotate(dodgeSpin);
            ctx.translate(-(x + this.w / 2), -(y + this.h / 2));
        }

        const by = y - bodyBob;

        // --- Legs as jointed limbs ---
        const hipLX = x + 9, hipRX = x + 18, hipY = by + 32;
        const footStride = stride * 7;
        const kneeBendL = (1 - Math.abs(stride)) * 3.5;
        const kneeBendR = (1 - Math.abs(-stride)) * 3.5;
        const footLY = by + 45 - Math.max(0, stride) * 2.5;
        const footRY = by + 45 - Math.max(0, -stride) * 2.5;

        const legColor = '#2a1a3a';
        this._drawJointedLimb(ctx, hipLX, hipY, hipLX + footStride * 0.3, hipY + 6 + kneeBendL, hipLX + footStride, footLY, 6, legColor);
        this._drawJointedLimb(ctx, hipRX, hipY, hipRX - footStride * 0.3, hipY + 6 + kneeBendR, hipRX - footStride, footRY, 6, legColor);

        // Expensive boots with gold trim
        ctx.fillStyle = '#3a2020';
        ctx.fillRect(hipLX + footStride - 3, footLY, 8, 5);
        ctx.fillRect(hipRX - footStride - 3, footRY, 8, 5);
        ctx.fillStyle = '#c8a032';
        ctx.fillRect(hipLX + footStride - 3, footLY, 8, 1);
        ctx.fillRect(hipRX - footStride - 3, footRY, 8, 1);

        // --- Fancy purple tunic ---
        ctx.fillStyle = C.NOBLEMAN_PURPLE || '#5a2a6a';
        ctx.fillRect(x + 4 + atkLean, by + 16, 20, 16 + breathe);
        ctx.fillStyle = '#c8a032';
        ctx.fillRect(x + 4 + atkLean, by + 16, 20, 2);
        ctx.fillRect(x + 4 + atkLean, by + 30, 20, 2);
        ctx.fillRect(x + 12 + atkLean, by + 18, 4, 12);
        ctx.fillStyle = '#4a1a5a';
        ctx.fillRect(x + 6 + atkLean, by + 22, 2, 6);
        ctx.fillRect(x + 20 + atkLean, by + 22, 2, 6);

        // --- Left arm with dagger (opposite to legs) ---
        const armSwingL = isChasing ? -stride * 4 : Math.sin(t * 0.6) * 1;
        const leftDaggerStrike = isAttacking ? Math.sin(attackProgress * Math.PI * 2) * 8 : 0;
        const shLX = x + 2 + atkLean, shLY = by + 19;
        this._drawJointedLimb(ctx, shLX, shLY, shLX - 1 + armSwingL * 0.3, shLY + 5 - leftDaggerStrike * 0.2, shLX - 1 + armSwingL, shLY + 11 - leftDaggerStrike * 0.3, 5, '#4a1a5a');

        // Left dagger
        const lHandX = shLX - 1 + armSwingL;
        const lHandY = shLY + 11 - leftDaggerStrike * 0.3;
        ctx.fillStyle = isAttacking && leftDaggerStrike > 3 ? '#fff' : '#ccc';
        ctx.fillRect(lHandX - 1, lHandY - 8 - leftDaggerStrike * 0.2, 2, 10);
        ctx.fillStyle = '#664422';
        ctx.fillRect(lHandX - 2, lHandY - 1, 4, 3);

        // --- Right arm with dagger (opposite phase) ---
        const armSwingR = isChasing ? stride * 4 : -Math.sin(t * 0.6) * 1;
        const rightDaggerStrike = isAttacking ? Math.sin(attackProgress * Math.PI * 2 + Math.PI) * 8 : 0;
        const shRX = x + 25 + atkLean, shRY = by + 19;
        this._drawJointedLimb(ctx, shRX, shRY, shRX + 1 + armSwingR * 0.3, shRY + 5 - rightDaggerStrike * 0.2, shRX + 1 + armSwingR, shRY + 11 - rightDaggerStrike * 0.3, 5, '#4a1a5a');

        // Right dagger
        const rHandX = shRX + 1 + armSwingR;
        const rHandY = shRY + 11 - rightDaggerStrike * 0.3;
        ctx.fillStyle = isAttacking && rightDaggerStrike > 3 ? '#fff' : '#ccc';
        ctx.fillRect(rHandX - 1, rHandY - 8 - rightDaggerStrike * 0.2, 2, 10);
        ctx.fillStyle = '#664422';
        ctx.fillRect(rHandX - 2, rHandY - 1, 4, 3);

        // Dagger flash effect
        if (isAttacking) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#fff';
            if (leftDaggerStrike > 4) ctx.fillRect(lHandX - 3, lHandY - 10 - leftDaggerStrike * 0.2, 6, 3);
            if (rightDaggerStrike > 4) ctx.fillRect(rHandX - 3, rHandY - 10 - rightDaggerStrike * 0.2, 6, 3);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // --- Head ---
        const headBob = isChasing ? Math.sin(walkCycle) * 1 : Math.sin(t * 0.5) * 0.3;
        // Slicked hair
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + 6 + atkLean, by + headBob, 16, 6);
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(x + 8 + atkLean, by + 1 + headBob, 6, 2);

        // Face
        ctx.fillStyle = '#dab088';
        ctx.fillRect(x + 7 + atkLean, by + 5 + headBob, 14, 11);

        // Arrogant eyes
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 9 + atkLean, by + 8 + headBob, 3, 2);
        ctx.fillRect(x + 16 + atkLean, by + 8 + headBob, 3, 2);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + 16 + atkLean, by + 7 + headBob, 3, 1);

        // Smirk
        ctx.fillStyle = '#b08868';
        ctx.fillRect(x + 11 + atkLean, by + 13 + headBob, 6, 1);
        ctx.fillRect(x + 16 + atkLean, by + 12 + headBob, 2, 1);

        // Thin mustache
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(x + 10 + atkLean, by + 12 + headBob, 8, 1);

        ctx.restore();
    }
};

// ENEMY FACTORY + TYPE REGISTRY
W.EnemyTypes = {
    nekker: W.Nekker,
    drowner: W.Drowner,
    ghoul: W.Ghoul,
    wraith: W.Wraith,
    griffin: W.Griffin,
    bandit: W.Bandit,
    nilfSoldier: W.NilfSoldier,
    wildHunt: W.WildHuntWarrior,
    witchHunter: W.WitchHunter,
    nobleman: W.NoblemanThug
};

W.createEnemy = function(type, x, y, difficulty) {
    difficulty = difficulty || 1;
    const Cls = W.EnemyTypes[type];
    if (!Cls) { console.warn('Unknown enemy type:', type); return null; }
    const enemy = new Cls(x, y);
    if (difficulty > 1) {
        enemy.hp = Math.floor(enemy.hp * difficulty);
        enemy.maxHp = enemy.hp;
        enemy.damage = Math.floor(enemy.damage * (1 + (difficulty-1)*0.5));
    }
    return enemy;
};

})();
