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

        // Menacing stride - heavy, deliberate
        const strideBob = isChasing ? Math.abs(Math.sin(t * 1.8)) * 2 : Math.sin(t * 0.5) * 1;
        const walkCycle = isChasing ? Math.sin(t * 1.8) : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - strideBob;

        // Frost aura - pulses with intensity
        const auraSize = 26 + Math.sin(this.frostAura * 1.2) * 5;
        ctx.globalAlpha = 0.12 + Math.sin(this.frostAura) * 0.06;
        ctx.fillStyle = C.WILD_HUNT_ICE || '#88aacc';
        ctx.beginPath();
        ctx.arc(x + 18, by + 28, auraSize, 0, Math.PI * 2);
        ctx.fill();
        // Inner aura
        ctx.globalAlpha = 0.08 + Math.sin(this.frostAura * 1.5) * 0.04;
        ctx.fillStyle = '#aaccee';
        ctx.beginPath();
        ctx.arc(x + 18, by + 28, auraSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        // Ice particles floating around body - 3 orbiting particles
        ctx.fillStyle = '#aaddff';
        for (let i = 0; i < 3; i++) {
            const angle = t * 0.8 + i * (Math.PI * 2 / 3);
            const radius = 20 + Math.sin(t * 1.5 + i) * 4;
            const px = x + 18 + Math.cos(angle) * radius;
            const py = by + 26 + Math.sin(angle) * radius * 0.6;
            ctx.fillRect(px, py, 2, 2);
            // Particle trail
            ctx.globalAlpha = 0.3;
            ctx.fillRect(px - Math.cos(angle) * 3, py - Math.sin(angle) * 2, 2, 2);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // Legs - heavy, menacing stride
        const legSwing1 = walkCycle * 4;
        const legSwing2 = -walkCycle * 4;
        ctx.fillStyle = '#111';
        ctx.fillRect(x + 8 + legSwing1 * 0.4, by + 38, 7, 14);
        ctx.fillRect(x + 21 + legSwing2 * 0.4, by + 38, 7, 14);

        // Boots with spikes
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x + 6 + legSwing1 * 0.4, by + 50, 10, 6);
        ctx.fillRect(x + 20 + legSwing2 * 0.4, by + 50, 10, 6);
        // Boot spikes
        ctx.fillStyle = '#334';
        ctx.fillRect(x + 5 + legSwing1 * 0.4, by + 50, 3, 3);
        ctx.fillRect(x + 28 + legSwing2 * 0.4, by + 50, 3, 3);

        // Dark plate armor body
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x + 5, by + 18, 26, 20);

        // Ice accents on armor - pulse with frost aura
        const icePulse = 0.7 + Math.sin(this.frostAura * 1.5) * 0.3;
        const iceR = Math.floor(68 * icePulse);
        const iceG = Math.floor(136 * icePulse);
        const iceB = Math.floor(170 * icePulse);
        ctx.fillStyle = `rgb(${iceR},${iceG},${iceB})`;
        ctx.fillRect(x + 7, by + 20, 2, 8);
        ctx.fillRect(x + 27, by + 20, 2, 8);
        ctx.fillRect(x + 14, by + 24, 8, 2);
        // Additional ice detail
        ctx.fillRect(x + 12, by + 30, 12, 1);

        // Spiked shoulders - menacing
        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(x + 1, by + 16, 7, 8);
        ctx.fillRect(x + 28, by + 16, 7, 8);
        // Shoulder spikes
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x - 1, by + 13, 3, 5);
        ctx.fillRect(x + 34, by + 13, 3, 5);
        // Spike tips with ice glow
        ctx.fillStyle = `rgb(${iceR},${iceG},${iceB})`;
        ctx.fillRect(x - 1, by + 13, 1, 2);
        ctx.fillRect(x + 36, by + 13, 1, 2);

        // Arms - swing with stride
        const armSwing = isChasing ? Math.sin(t * 1.8) * 3 : 0;
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x + 1, by + 24 + armSwing, 5, 14);
        ctx.fillRect(x + 30, by + 24 - armSwing, 5, 14);

        // Large sword - raised high during attack
        const swordRaise = isAttacking ? (1 - attackProgress) * 12 : 0;
        const swordSwing = isAttacking ? attackProgress * 14 : 0;
        ctx.fillStyle = '#8ab';
        ctx.fillRect(x + 32, by + 4 - swordRaise + swordSwing, 3, 26);
        // Sword ice crystals
        ctx.fillStyle = '#aaddff';
        ctx.fillRect(x + 33, by + 6 - swordRaise + swordSwing, 2, 3);
        ctx.fillRect(x + 31, by + 12 - swordRaise + swordSwing, 2, 3);
        ctx.fillRect(x + 33, by + 18 - swordRaise + swordSwing, 2, 3);
        // Sword hilt
        ctx.fillStyle = '#0a0a2a';
        ctx.fillRect(x + 30, by + 18 - swordRaise * 0.5, 7, 3);
        // Hilt ice accent
        ctx.fillStyle = `rgb(${iceR},${iceG},${iceB})`;
        ctx.fillRect(x + 30, by + 18 - swordRaise * 0.5, 7, 1);

        // Spiked helmet
        const headBob = isChasing ? Math.sin(t * 1.8) * 1 : 0;
        ctx.fillStyle = C.WILD_HUNT_DARK || '#0a0a1a';
        ctx.fillRect(x + 8, by + 2 + headBob, 20, 16);

        // Helmet spikes
        ctx.fillRect(x + 6, by + headBob, 3, 6);
        ctx.fillRect(x + 16, by - 3 + headBob, 4, 6);
        ctx.fillRect(x + 27, by + headBob, 3, 6);

        // Ice-blue eye glow - intense, pulsing
        const eyeGlow = 0.7 + Math.sin(t * 2) * 0.3;
        ctx.fillStyle = `rgba(102,204,255,${eyeGlow})`;
        ctx.fillRect(x + 12, by + 8 + headBob, 4, 3);
        ctx.fillRect(x + 20, by + 8 + headBob, 4, 3);

        // Eye glow bleed effect
        ctx.globalAlpha = 0.35 + Math.sin(t * 2) * 0.15;
        ctx.fillStyle = '#44aaff';
        ctx.fillRect(x + 10, by + 7 + headBob, 16, 5);
        // Eye trail when moving
        if (isChasing) {
            ctx.globalAlpha = 0.15;
            ctx.fillRect(x + 8, by + 8 + headBob, 4, 3);
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
                life: 120
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

        // Is shooting (cooldown just reset recently)
        const isShooting = this.shootCooldown > 60;

        const walkBob = isChasing ? Math.abs(Math.sin(t * 2)) * 1.5 : Math.sin(t * 0.6) * 0.8;
        const walkCycle = isChasing ? Math.sin(t * 2) : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - walkBob;

        // Legs under robe - walk cycle
        const legSwing1 = walkCycle * 4;
        const legSwing2 = -walkCycle * 4;
        ctx.fillStyle = '#3a1a0a';
        ctx.fillRect(x + 8 + legSwing1 * 0.4, by + 36, 6, 12);
        ctx.fillRect(x + 16 + legSwing2 * 0.4, by + 36, 6, 12);

        // Boots
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(x + 7 + legSwing1 * 0.4, by + 47, 7, 5);
        ctx.fillRect(x + 16 + legSwing2 * 0.4, by + 47, 7, 5);

        // Dark red robes - sway at bottom
        ctx.fillStyle = C.WITCH_HUNTER_RED || '#8a2a1a';
        ctx.fillRect(x + 5, by + 18, 20, 18);
        // Robe bottom sway
        const robeSway1 = Math.sin(t * 1.5) * 1.5;
        const robeSway2 = Math.sin(t * 1.5 + 1) * 1.5;
        ctx.fillRect(x + 4 + robeSway1, by + 34, 6, 4);
        ctx.fillRect(x + 20 + robeSway2, by + 34, 6, 4);

        // Robe center seam
        ctx.fillStyle = '#6a1a0a';
        ctx.fillRect(x + 14, by + 18, 2, 18);

        // Cross/emblem on chest
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 13, by + 22, 4, 6);
        ctx.fillRect(x + 11, by + 24, 8, 2);
        // Emblem glow
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.1 : 0.15;
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 11, by + 22, 8, 6);
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        // Left arm - holds crossbow support
        const leftArmSwing = isShooting ? -2 : (isChasing ? Math.sin(t * 2) * 3 : 0);
        ctx.fillStyle = '#7a2a1a';
        ctx.fillRect(x + 1, by + 20 + leftArmSwing, 5, 12);

        // Right arm - extends forward when shooting, swings during attack
        const rightArmExtend = isShooting ? 6 : (isAttacking ? attackProgress * 6 : (isChasing ? -Math.sin(t * 2) * 3 : 0));
        ctx.fillStyle = '#7a2a1a';
        ctx.fillRect(x + 24 + rightArmExtend * 0.5, by + 20 - rightArmExtend * 0.3, 5, 12);

        // Crossbow - aims forward when shooting
        const bowExtend = isShooting ? 4 : 0;
        ctx.fillStyle = '#5a4020';
        ctx.fillRect(x + 24 + bowExtend, by + 22 - bowExtend * 0.3, 8, 3);
        // Crossbow arms
        ctx.fillStyle = '#888';
        ctx.fillRect(x + 22 + bowExtend, by + 20 - bowExtend * 0.3, 2, 7);
        // Bowstring
        ctx.fillStyle = '#aaa';
        ctx.fillRect(x + 22 + bowExtend, by + 20 - bowExtend * 0.3, 1, 1);
        ctx.fillRect(x + 22 + bowExtend, by + 26 - bowExtend * 0.3, 1, 1);

        // Face
        ctx.fillStyle = '#d4a574';
        ctx.fillRect(x + 8, by + 8, 14, 10);

        // Stern eyes
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 10, by + 11, 3, 2);
        ctx.fillRect(x + 17, by + 11, 3, 2);
        // Furrowed brows
        ctx.fillStyle = '#9a7a5a';
        ctx.fillRect(x + 10, by + 10, 3, 1);
        ctx.fillRect(x + 17, by + 10, 3, 1);

        // Frown
        ctx.fillStyle = '#9a7a5a';
        ctx.fillRect(x + 11, by + 15, 8, 1);

        // Wide-brim hat - bobs slightly
        const hatBob = isChasing ? Math.sin(t * 2) * 0.5 : 0;
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(x + 2, by + 4 + hatBob, 26, 4); // brim
        ctx.fillRect(x + 8, by + hatBob, 14, 6); // crown
        // Hat band
        ctx.fillStyle = '#444';
        ctx.fillRect(x + 8, by + 4 + hatBob, 14, 1);

        // Hat shadow on face - darkens upper face
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 8, by + 8, 14, 4);
        ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;

        ctx.restore();
    }
};

})();
