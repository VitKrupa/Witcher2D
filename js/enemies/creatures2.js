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

        // Low crouching run - body lowers and leans forward
        const runBob = isChasing ? Math.abs(Math.sin(t * 3)) * 3 : Math.sin(t * 0.8) * 1;
        const runLean = isChasing ? 3 : 0;
        const walkCycle = isChasing ? Math.sin(t * 3) : 0;

        ctx.save();
        if (this.facing === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        // Hit flash
        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - runBob;
        const airTuck = inAir ? -4 : 0; // tuck legs when leaping

        // Legs - crouched, alternating in run
        const legSwing1 = walkCycle * 6;
        const legSwing2 = -walkCycle * 6;
        ctx.fillStyle = C.GHOUL_GREY || '#6a6060';
        ctx.fillRect(x + 8 + legSwing1, by + 29 + airTuck, 7, 14 + Math.min(0, legSwing1));
        ctx.fillRect(x + 21 + legSwing2, by + 29 + airTuck, 7, 14 + Math.min(0, legSwing2));

        // Feet - large clawed
        ctx.fillStyle = C.GHOUL_DARK || '#4a3a3a';
        ctx.fillRect(x + 6 + legSwing1, by + 42 + airTuck, 10, 4);
        ctx.fillRect(x + 20 + legSwing2, by + 42 + airTuck, 10, 4);
        // Toe claws
        ctx.fillStyle = '#888';
        ctx.fillRect(x + 5 + legSwing1, by + 42 + airTuck, 2, 5);
        ctx.fillRect(x + 19 + legSwing2, by + 42 + airTuck, 2, 5);

        // Hunched body - leans forward when running
        ctx.fillStyle = C.GHOUL_GREY || '#6a6060';
        ctx.fillRect(x + 6 + runLean, by + 12, 24, 18);

        // Exposed rib bones - animate slightly with breathing
        const breathe = Math.sin(t * 1.2) * 0.5;
        ctx.fillStyle = '#ccbbaa';
        for (let i = 0; i < 4; i++) {
            const ribW = 16 - i * 2;
            ctx.fillRect(x + 8 + runLean, by + 13 + i * 4, ribW, 1);
            // Rib curve
            ctx.fillRect(x + 8 + ribW + runLean - 1, by + 13 + i * 4 + breathe, 2, 2);
        }
        // Spine line
        ctx.fillStyle = '#bbaa99';
        ctx.fillRect(x + 8 + runLean, by + 12, 2, 18);

        // Head - forward-leaning, bobs with run
        const headBob = isChasing ? Math.sin(t * 3) * 2 : Math.sin(t * 0.8) * 1;
        ctx.fillStyle = '#7a6a6a';
        ctx.fillRect(x + 18 + runLean, by + 4 + headBob, 14, 12);

        // Jaw - opens wider during attack
        const jawOpen = isAttacking ? attackProgress * 5 : (isChasing ? Math.abs(Math.sin(t * 3)) * 1.5 : 0);
        ctx.fillStyle = '#4a3030';
        ctx.fillRect(x + 22 + runLean, by + 12 + headBob, 10, 4 + jawOpen);
        // Teeth
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 23 + runLean, by + 12 + headBob, 2, 3);
        ctx.fillRect(x + 26 + runLean, by + 12 + headBob, 2, 3);
        ctx.fillRect(x + 29 + runLean, by + 12 + headBob, 2, 3);
        if (jawOpen > 2) {
            // Bottom teeth
            ctx.fillRect(x + 24 + runLean, by + 15 + headBob + jawOpen, 2, 2);
            ctx.fillRect(x + 28 + runLean, by + 15 + headBob + jawOpen, 2, 2);
        }

        // Red eyes - glow brighter during attack
        const eyeGlow = isAttacking ? 1.0 : (isChasing ? 0.8 : 0.5 + Math.sin(t) * 0.2);
        const eyeR = Math.floor(255 * eyeGlow);
        const eyeG = Math.floor(34 * eyeGlow);
        ctx.fillStyle = `rgb(${eyeR},${eyeG},${eyeG})`;
        ctx.fillRect(x + 22 + runLean, by + 7 + headBob, 3, 2);
        ctx.fillRect(x + 28 + runLean, by + 7 + headBob, 3, 2);
        // Eye glow aura
        if (isAttacking) {
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.2 : 0.35;
            ctx.fillStyle = '#ff2222';
            ctx.fillRect(x + 20 + runLean, by + 5 + headBob, 12, 6);
            ctx.globalAlpha = (isHit && Math.floor(t * 10) % 2 === 0) ? 0.5 : 1;
        }

        // Long arms - swing with run, extend claws during attack
        const armSwing1 = isChasing ? Math.sin(t * 3) * 6 : Math.sin(t * 0.6) * 2;
        const armSwing2 = isChasing ? -Math.sin(t * 3) * 6 : -Math.sin(t * 0.6) * 2;
        const clawExtend = isAttacking ? attackProgress * 12 : 0;

        ctx.fillStyle = C.GHOUL_DARK || '#4a3a3a';
        // Left arm
        ctx.fillRect(x + 2 + runLean + armSwing1, by + 14, 5, 20);
        // Right arm - extends during attack
        ctx.fillRect(x + 29 + runLean + armSwing2 + clawExtend, by + 10, 5, 18);

        // Claws - long and sharp
        ctx.fillStyle = '#bbb';
        // Left claws
        ctx.fillRect(x + 0 + runLean + armSwing1, by + 32, 3, 5);
        ctx.fillRect(x + 3 + runLean + armSwing1, by + 33, 2, 4);
        ctx.fillRect(x + 5 + runLean + armSwing1, by + 34, 2, 3);
        // Right claws - extend during attack
        ctx.fillRect(x + 31 + runLean + armSwing2 + clawExtend, by + 26, 3, 6);
        ctx.fillRect(x + 33 + runLean + armSwing2 + clawExtend, by + 27, 2, 5);
        ctx.fillRect(x + 35 + runLean + armSwing2 + clawExtend, by + 26, 2, 6);

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

        // Vertical bob for floating
        const floatBob = Math.sin(t * 1.5) * 3;
        // Horizontal sway
        const sway = Math.sin(t * 0.7) * 2;

        ctx.save();
        // Transparency pulses
        const alphaBase = isHit ? 0.3 : (0.5 + Math.sin(t * 1.2) * 0.2);
        ctx.globalAlpha = alphaBase;

        if (this.facing === -1) { ctx.translate(ox + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(ox + this.w / 2), 0); }

        const by = y + floatBob;

        // Ghostly glow aura - pulses
        ctx.globalAlpha = 0.1 + Math.sin(t * 0.8) * 0.07;
        ctx.fillStyle = '#8888ff';
        ctx.beginPath();
        ctx.arc(x + 16, by + 25, 24 + Math.sin(t * 1.5) * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = alphaBase;

        // Flowing robes - gradient fades to transparent
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

        // Body flowing down - tattered bottom edge using sin wave
        ctx.beginPath();
        ctx.moveTo(x + 6 + sway * 0.5, by + 18);
        ctx.lineTo(x + 26 + sway * 0.5, by + 18);
        // Right edge with waviness
        ctx.lineTo(x + 30 + Math.sin(t * 2) * 2, by + 50);
        // Tattered bottom edge - wavy
        for (let i = 0; i <= 6; i++) {
            const px = x + 30 - i * (28 / 6);
            const py = by + 50 + Math.sin(t * 2 + i * 1.5) * 3 + (i % 2 === 0 ? 3 : 0);
            ctx.lineTo(px + Math.sin(t * 2 + i) * 2, py);
        }
        ctx.lineTo(x + 2 + Math.sin(t * 2 + 3) * 2, by + 50);
        ctx.fill();

        // Tattered wisps hanging from bottom
        ctx.fillStyle = 'rgba(100,120,180,0.3)';
        for (let i = 0; i < 4; i++) {
            const wx = x + 6 + i * 7;
            const wlen = 4 + Math.sin(t * 1.5 + i * 2) * 3;
            ctx.fillRect(wx + Math.sin(t * 2 + i) * 1, by + 48 + Math.sin(t * 2 + i) * 2, 2, wlen);
        }

        // Face - hollow dark void
        ctx.fillStyle = 'rgba(10,10,30,0.9)';
        ctx.fillRect(x + 10 + sway, by + 8, 12, 8);

        // Glowing eyes - pulse and leave slight trails
        const eyeBright = 0.7 + Math.sin(t * 2) * 0.3;
        ctx.fillStyle = `rgba(170,204,255,${eyeBright})`;
        ctx.fillRect(x + 12 + sway, by + 10, 3, 2);
        ctx.fillRect(x + 18 + sway, by + 10, 3, 2);
        // Eye glow bleed
        ctx.globalAlpha = alphaBase * 0.3;
        ctx.fillStyle = '#aaccff';
        ctx.fillRect(x + 11 + sway, by + 9, 5, 4);
        ctx.fillRect(x + 17 + sway, by + 9, 5, 4);
        ctx.globalAlpha = alphaBase;

        // Spectral arms - extend during attack
        const armFloat = Math.sin(t * 1.2) * 3;
        const attackExtend = isAttacking ? attackProgress * 16 : 0;
        ctx.fillStyle = 'rgba(100,120,180,0.45)';
        // Left arm - floats gently
        ctx.fillRect(x - 2 + sway * 0.5, by + 20 + armFloat, 5, 14);
        // Right arm - extends forward during attack
        ctx.fillRect(x + 29 + sway * 0.5 + attackExtend, by + 18 - armFloat, 5, 16);

        // Spectral fingers on attacking hand
        if (isAttacking) {
            ctx.fillStyle = 'rgba(140,160,220,0.5)';
            ctx.fillRect(x + 34 + attackExtend, by + 18, 3, 2);
            ctx.fillRect(x + 34 + attackExtend, by + 22, 3, 2);
            ctx.fillRect(x + 34 + attackExtend, by + 26, 3, 2);
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
