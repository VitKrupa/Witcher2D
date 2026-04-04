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

        const walkBob = isChasing ? Math.abs(Math.sin(t * 2.5)) * 2 : Math.sin(t * 0.7) * 1;
        const walkCycle = isChasing ? Math.sin(t * 2.5) : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - walkBob;

        // Legs - walk cycle
        const legSwing1 = walkCycle * 5;
        const legSwing2 = -walkCycle * 5;
        ctx.fillStyle = '#4a4030';
        ctx.fillRect(x + 8 + legSwing1 * 0.4, by + 33, 6, 14);
        ctx.fillRect(x + 16 + legSwing2 * 0.4, by + 33, 6, 14);

        // Boots - step animation
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(x + 7 + legSwing1 * 0.4, by + 46, 7, 5);
        ctx.fillRect(x + 16 + legSwing2 * 0.4, by + 46, 7, 5);

        // Body - leather armor
        ctx.fillStyle = C.BANDIT_LEATHER || '#6a5a3a';
        ctx.fillRect(x + 6, by + 16, 18, 16);
        // Leather stitching detail
        ctx.fillStyle = '#5a4a2a';
        ctx.fillRect(x + 14, by + 17, 2, 14);

        // Belt
        ctx.fillStyle = '#4a3a1a';
        ctx.fillRect(x + 6, by + 30, 18, 3);
        ctx.fillStyle = '#aa8833';
        ctx.fillRect(x + 13, by + 30, 4, 3);

        // Left arm - swings with walk
        const leftArmSwing = isChasing ? Math.sin(t * 2.5) * 4 : Math.sin(t * 0.5) * 1;
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(x + 2, by + 18 + leftArmSwing, 5, 12);

        // Right arm + sword - swings during attack
        const swordArmAngle = isAttacking ? attackProgress * 8 : (isChasing ? -Math.sin(t * 2.5) * 3 : 0);
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(x + 23, by + 18 - swordArmAngle, 5, 12);

        // Sword - visible, swings during attack
        ctx.fillStyle = '#aaa';
        const swordExtend = isAttacking ? attackProgress * 10 : 0;
        const swordY = by + 8 - swordArmAngle - swordExtend * 0.3;
        ctx.fillRect(x + 24, swordY, 2, 18 + swordExtend * 0.5);
        // Sword shine
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 24, swordY + 2, 1, 4);
        // Hilt
        ctx.fillStyle = '#664422';
        ctx.fillRect(x + 22, by + 16 - swordArmAngle, 6, 3);
        // Crossguard
        ctx.fillStyle = '#888';
        ctx.fillRect(x + 21, by + 16 - swordArmAngle, 8, 1);

        // Head with hood - bobs
        const headBob = isChasing ? Math.sin(t * 2.5) * 1.5 : Math.sin(t * 0.7) * 0.5;
        ctx.fillStyle = '#6a5a3a';
        ctx.fillRect(x + 7, by + headBob, 16, 6);
        // Hood sides
        ctx.fillRect(x + 6, by + 3 + headBob, 2, 6);
        ctx.fillRect(x + 22, by + 3 + headBob, 2, 6);

        // Face
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(x + 8, by + 6 + headBob, 14, 10);

        // Eyes - narrow, mean
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 10, by + 9 + headBob, 3, 2);
        ctx.fillRect(x + 17, by + 9 + headBob, 3, 2);
        // Eyebrow scowl
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(x + 10, by + 8 + headBob, 3, 1);
        ctx.fillRect(x + 17, by + 8 + headBob, 3, 1);

        // Stubble
        ctx.fillStyle = '#8a7a6a';
        ctx.fillRect(x + 10, by + 13 + headBob, 9, 2);

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

        // Disciplined march - crisp, even steps
        const marchBob = isChasing ? Math.abs(Math.sin(t * 2.2)) * 1.5 : Math.sin(t * 0.6) * 0.5;
        const walkCycle = isChasing ? Math.sin(t * 2.2) : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - marchBob;

        // Legs - disciplined march, precise steps
        const legSwing1 = walkCycle * 4;
        const legSwing2 = -walkCycle * 4;
        ctx.fillStyle = '#222';
        ctx.fillRect(x + 8 + legSwing1 * 0.4, by + 33, 6, 14);
        ctx.fillRect(x + 18 + legSwing2 * 0.4, by + 33, 6, 14);

        // Boots - heavy, armored
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + 7 + legSwing1 * 0.4, by + 46, 8, 6);
        ctx.fillRect(x + 17 + legSwing2 * 0.4, by + 46, 8, 6);
        // Boot metal trim
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 7 + legSwing1 * 0.4, by + 46, 8, 1);
        ctx.fillRect(x + 17 + legSwing2 * 0.4, by + 46, 8, 1);

        // Body - black plate armor
        ctx.fillStyle = C.NILF_BLACK || '#1a1a2a';
        ctx.fillRect(x + 5, by + 15, 22, 18);

        // Gold sun emblem on chest - animated radiance
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x + 13, by + 20, 6, 6); // center
        ctx.fillRect(x + 11, by + 22, 10, 2); // horizontal
        ctx.fillRect(x + 15, by + 18, 2, 10); // vertical
        // Diagonal rays that pulse
        const rayPulse = Math.sin(t * 1.5) * 1;
        ctx.fillRect(x + 11 - rayPulse, by + 19 - rayPulse, 2, 2); // top-left
        ctx.fillRect(x + 19 + rayPulse, by + 19 - rayPulse, 2, 2); // top-right
        ctx.fillRect(x + 11 - rayPulse, by + 25 + rayPulse, 2, 2); // bottom-left
        ctx.fillRect(x + 19 + rayPulse, by + 25 + rayPulse, 2, 2); // bottom-right
        // Emblem glow
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.15 : 0.2 + Math.sin(t * 1.5) * 0.1;
        ctx.fillStyle = '#ffcc44';
        ctx.fillRect(x + 10, by + 18, 12, 10);
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        // Shoulders - pauldrons
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(x + 2, by + 15, 5, 6);
        ctx.fillRect(x + 25, by + 15, 5, 6);
        // Shoulder trim
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x + 2, by + 15, 5, 1);
        ctx.fillRect(x + 25, by + 15, 5, 1);

        // Shield arm (left) - raises during block
        const shieldRaise = this.blocking ? -6 : 0;
        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(x + 2, by + 20 + shieldRaise, 4, 12);

        // Shield - raises when blocking
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(x - 2, by + 18 + shieldRaise, 6, 14);
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x - 1, by + 23 + shieldRaise, 4, 4);
        // Shield edge highlight
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(x - 2, by + 18 + shieldRaise, 1, 14);
        if (this.blocking) {
            // Shield flash when blocking
            ctx.globalAlpha = 0.3 + Math.sin(t * 8) * 0.2;
            ctx.fillStyle = '#aaaacc';
            ctx.fillRect(x - 2, by + 18 + shieldRaise, 6, 14);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // Sword arm (right) - strikes downward during attack
        const swordArmDrop = isAttacking ? attackProgress * 10 : (isChasing ? -Math.sin(t * 2.2) * 2 : 0);
        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(x + 26, by + 20 - swordArmDrop * 0.3, 4, 12);

        // Sword - strikes downward during attack
        ctx.fillStyle = '#bbb';
        const swordLen = 18 + (isAttacking ? attackProgress * 4 : 0);
        const swordTop = by + 10 - swordArmDrop * 0.5;
        ctx.fillRect(x + 28, swordTop, 2, swordLen);
        // Sword shine
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 28, swordTop + 2, 1, 5);
        // Crossguard + hilt
        ctx.fillStyle = '#444';
        ctx.fillRect(x + 26, by + 18 - swordArmDrop * 0.3, 6, 3);
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x + 26, by + 18 - swordArmDrop * 0.3, 6, 1);

        // Helmet - black with gold trim
        const headBob = isChasing ? Math.sin(t * 2.2) * 1 : 0;
        ctx.fillStyle = C.NILF_BLACK || '#1a1a2a';
        ctx.fillRect(x + 7, by + headBob, 18, 14);
        // Gold helmet trim
        ctx.fillStyle = C.NILF_GOLD || '#c8a032';
        ctx.fillRect(x + 7, by + 13 + headBob, 18, 2);
        // Helmet crest
        ctx.fillRect(x + 13, by - 1 + headBob, 6, 3);
        // Crest detail
        ctx.fillStyle = '#a88022';
        ctx.fillRect(x + 14, by - 1 + headBob, 4, 2);

        // Face slit / visor
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 10, by + 6 + headBob, 12, 4);

        // Eyes behind visor - slight glow
        ctx.fillStyle = '#bbb';
        ctx.fillRect(x + 12, by + 7 + headBob, 2, 2);
        ctx.fillRect(x + 18, by + 7 + headBob, 2, 2);

        ctx.restore();
    }
};

})();
