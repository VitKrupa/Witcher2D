(function() {
'use strict';
const C = W.Colors;

// NOBLEMAN THUG - fast dual-dagger fighter. Weak to IRON.
W.NoblemanThug = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 28, h: 52, hp: 35, damage: 9, speed: 2.2,
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

        // Quick nimble movement - light, springy
        const nimbleBob = isChasing ? Math.abs(Math.sin(t * 3)) * 2.5 : Math.sin(t * 0.8) * 1;
        const walkCycle = isChasing ? Math.sin(t * 3) : 0;
        // Dodge spin - when dodge cooldown is high, character is mid-dodge
        const isDodging = this.dodgeCooldown > 60;
        const dodgeSpin = isDodging ? Math.sin((80 - this.dodgeCooldown) * 0.3) * 0.5 : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        // During dodge, add slight lean-back
        if (isDodging) {
            ctx.translate(x + this.w / 2, y + this.h / 2);
            ctx.rotate(dodgeSpin);
            ctx.translate(-(x + this.w / 2), -(y + this.h / 2));
        }

        const by = y - nimbleBob;

        // Legs - quick footwork
        const legSwing1 = walkCycle * 5;
        const legSwing2 = -walkCycle * 5;
        ctx.fillStyle = '#2a1a3a';
        ctx.fillRect(x + 6 + legSwing1 * 0.5, by + 32, 7, 14);
        ctx.fillRect(x + 15 + legSwing2 * 0.5, by + 32, 7, 14);

        // Expensive boots with gold trim
        ctx.fillStyle = '#3a2020';
        ctx.fillRect(x + 5 + legSwing1 * 0.5, by + 45, 8, 5);
        ctx.fillRect(x + 15 + legSwing2 * 0.5, by + 45, 8, 5);
        ctx.fillStyle = '#c8a032';
        ctx.fillRect(x + 5 + legSwing1 * 0.5, by + 45, 8, 1);
        ctx.fillRect(x + 15 + legSwing2 * 0.5, by + 45, 8, 1);

        // Fancy purple tunic
        ctx.fillStyle = C.NOBLEMAN_PURPLE || '#5a2a6a';
        ctx.fillRect(x + 4, by + 16, 20, 16);
        // Tunic detail - gold center stripe
        ctx.fillStyle = '#c8a032';
        ctx.fillRect(x + 4, by + 16, 20, 2);
        ctx.fillRect(x + 4, by + 30, 20, 2);
        ctx.fillRect(x + 12, by + 18, 4, 12);
        // Tunic shadow folds
        ctx.fillStyle = '#4a1a5a';
        ctx.fillRect(x + 6, by + 22, 2, 6);
        ctx.fillRect(x + 20, by + 22, 2, 6);

        // Left arm with dagger - alternating strike pattern
        const leftDaggerStrike = isAttacking ? Math.sin(attackProgress * Math.PI * 2) * 8 : 0;
        const leftArmSwing = isChasing ? Math.sin(t * 3) * 3 : Math.sin(t * 0.6) * 1;
        ctx.fillStyle = '#4a1a5a';
        ctx.fillRect(x + 0, by + 18 + leftArmSwing - leftDaggerStrike * 0.3, 5, 12);

        // Left dagger - flashes during attack
        ctx.fillStyle = isAttacking && leftDaggerStrike > 3 ? '#fff' : '#ccc';
        ctx.fillRect(x - 2, by + 18 + leftArmSwing - leftDaggerStrike * 0.5, 2, 10);
        ctx.fillStyle = '#664422';
        ctx.fillRect(x - 3, by + 17 + leftArmSwing - leftDaggerStrike * 0.3, 4, 3);

        // Right arm with dagger - alternating opposite to left
        const rightDaggerStrike = isAttacking ? Math.sin(attackProgress * Math.PI * 2 + Math.PI) * 8 : 0;
        const rightArmSwing = isChasing ? -Math.sin(t * 3) * 3 : -Math.sin(t * 0.6) * 1;
        ctx.fillStyle = '#4a1a5a';
        ctx.fillRect(x + 23, by + 18 + rightArmSwing - rightDaggerStrike * 0.3, 5, 12);

        // Right dagger - flashes during attack
        ctx.fillStyle = isAttacking && rightDaggerStrike > 3 ? '#fff' : '#ccc';
        ctx.fillRect(x + 26, by + 18 + rightArmSwing - rightDaggerStrike * 0.5, 2, 10);
        ctx.fillStyle = '#664422';
        ctx.fillRect(x + 25, by + 17 + rightArmSwing - rightDaggerStrike * 0.3, 4, 3);

        // Dagger flash effect during attack
        if (isAttacking) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#fff';
            if (leftDaggerStrike > 4) ctx.fillRect(x - 4, by + 16 - leftDaggerStrike * 0.5, 6, 3);
            if (rightDaggerStrike > 4) ctx.fillRect(x + 24, by + 16 - rightDaggerStrike * 0.5, 6, 3);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // Slicked hair
        const headBob = isChasing ? Math.sin(t * 3) * 1 : 0;
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + 6, by + headBob, 16, 6);
        // Hair shine
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(x + 8, by + 1 + headBob, 6, 2);

        // Face - arrogant expression
        ctx.fillStyle = '#dab088';
        ctx.fillRect(x + 7, by + 5 + headBob, 14, 11);

        // Arrogant eyes - narrow
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 9, by + 8 + headBob, 3, 2);
        ctx.fillRect(x + 16, by + 8 + headBob, 3, 2);
        // Raised eyebrow
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + 16, by + 7 + headBob, 3, 1);

        // Smirk - asymmetric
        ctx.fillStyle = '#b08868';
        ctx.fillRect(x + 11, by + 13 + headBob, 6, 1);
        ctx.fillRect(x + 16, by + 12 + headBob, 2, 1); // smirk corner

        // Thin mustache
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(x + 10, by + 12 + headBob, 8, 1);

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
