(function() {
'use strict';
const C = W.Colors;

// NEKKER - small, fast, pack creature. Weak to SILVER.
W.Nekker = class extends W.Enemy {
    constructor(x, y) {
        super(x, y, {
            w: 24, h: 30, hp: 25, damage: 5, speed: 2.5,
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

        // Bouncy hop when chasing
        const hopBob = isChasing ? Math.abs(Math.sin(t * 2.5)) * 6 : Math.sin(t) * 1.5;
        // Walk cycle for legs
        const walkCycle = isChasing ? Math.sin(t * 3) : 0;

        ctx.save();
        if (f === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        // Hit flash
        if (isHit && Math.floor(t * 10) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        const by = y - hopBob; // base y with hop

        // Legs - short, alternating when moving
        const legSwing1 = walkCycle * 4;
        const legSwing2 = -walkCycle * 4;
        ctx.fillStyle = C.NEKKER_BROWN || '#5a4a2a';
        ctx.fillRect(x + 6, by + 23 + Math.max(0, legSwing1), 4, 5 - Math.abs(legSwing1) * 0.3);
        ctx.fillRect(x + 14, by + 23 + Math.max(0, legSwing2), 4, 5 - Math.abs(legSwing2) * 0.3);

        // Feet with claws
        ctx.fillStyle = '#3a2a0a';
        ctx.fillRect(x + 5, by + 27 + Math.max(0, legSwing1), 5, 3);
        ctx.fillRect(x + 13, by + 27 + Math.max(0, legSwing2), 5, 3);

        // Body - small hunched torso, leans forward when chasing
        const leanX = isChasing ? 2 : 0;
        ctx.fillStyle = C.NEKKER_BROWN || '#5a4a2a';
        ctx.fillRect(x + 4 + leanX, by + 10, 16, 14);
        // Belly detail
        ctx.fillStyle = '#4a3a1a';
        ctx.fillRect(x + 7 + leanX, by + 16, 10, 4);

        // Head - big for body, bobs with hop
        const headBob = Math.sin(t * 1.5) * 1;
        ctx.fillStyle = '#6a5a3a';
        ctx.fillRect(x + 5 + leanX, by + 2 + headBob, 14, 10);

        // Eyes - glowing, pulsing
        const eyePulse = 0.7 + Math.sin(t * 2) * 0.3;
        const eyeR = Math.floor(170 * eyePulse);
        const eyeG = Math.floor(255 * eyePulse);
        ctx.fillStyle = `rgb(${eyeR},${eyeG},68)`;
        ctx.fillRect(x + 7 + leanX, by + 5 + headBob, 3, 2);
        ctx.fillRect(x + 13 + leanX, by + 5 + headBob, 3, 2);
        // Eye glow
        ctx.globalAlpha = ctx.globalAlpha * 0.25;
        ctx.fillStyle = '#aaff44';
        ctx.fillRect(x + 6 + leanX, by + 4 + headBob, 5, 4);
        ctx.fillRect(x + 12 + leanX, by + 4 + headBob, 5, 4);
        ctx.globalAlpha = isHit && Math.floor(t * 10) % 2 === 0 ? 0.5 : 1;

        // Mouth - opens during attack
        ctx.fillStyle = '#3a2a1a';
        const mouthOpen = isAttacking ? 3 : 1;
        ctx.fillRect(x + 9 + leanX, by + 9 + headBob, 6, mouthOpen + 1);
        if (isAttacking) {
            // Teeth when mouth open
            ctx.fillStyle = '#ddd';
            ctx.fillRect(x + 9 + leanX, by + 9 + headBob, 1, 1);
            ctx.fillRect(x + 11 + leanX, by + 9 + headBob, 1, 1);
            ctx.fillRect(x + 13 + leanX, by + 9 + headBob, 1, 1);
        }

        // Arms with claws - swing opposite to legs, extend during attack
        const armSwing1 = isChasing ? Math.sin(t * 3) * 5 : Math.sin(t * 0.8) * 2;
        const armSwing2 = isChasing ? -Math.sin(t * 3) * 5 : -Math.sin(t * 0.8) * 2;
        const clawExtend = isAttacking ? attackProgress * 8 : 0;

        ctx.fillStyle = '#4a3a1a';
        // Left arm
        ctx.fillRect(x + 1 + leanX + armSwing1, by + 12, 4, 8);
        // Right arm (weapon arm) - extends forward during attack
        ctx.fillRect(x + 19 + leanX + armSwing2 + clawExtend, by + 12, 4, 8);

        // Claws - sharper, extend during attack
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 0 + leanX + armSwing1, by + 19, 2, 3);
        ctx.fillRect(x + 2 + leanX + armSwing1, by + 20, 1, 2);
        // Right claws extend further during attack
        ctx.fillRect(x + 22 + leanX + armSwing2 + clawExtend, by + 19, 2, 3);
        ctx.fillRect(x + 20 + leanX + armSwing2 + clawExtend, by + 20, 1, 2);
        ctx.fillRect(x + 24 + leanX + armSwing2 + clawExtend, by + 18, 1, 4);

        // Spine ridge detail
        ctx.fillStyle = '#3a2a0a';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x + 11 + leanX, by + 10 + i * 4, 2, 2);
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

        // Lurching shamble - asymmetric bob
        const shambleBob = isChasing ? Math.sin(t * 1.8) * 3 + Math.sin(t * 3.6) * 1 : Math.sin(t * 0.6) * 1.5;
        const shambleLean = isChasing ? Math.sin(t * 1.8) * 2 : 0;
        const walkCycle = isChasing ? Math.sin(t * 1.8) : 0;

        ctx.save();
        if (f === -1) { ctx.translate(x + this.w / 2, 0); ctx.scale(-1, 1); ctx.translate(-(x + this.w / 2), 0); }

        if (isHit && Math.floor(t * 10) % 2 === 0) ctx.globalAlpha = 0.5;

        const by = y - Math.max(0, shambleBob);

        // Water drip particles - continuously falling
        ctx.fillStyle = 'rgba(80,160,180,0.6)';
        const drip1Y = (t * 30) % 20;
        const drip2Y = ((t * 30) + 10) % 20;
        ctx.fillRect(x + 10 + Math.sin(t * 2) * 2, by + 20 + drip1Y, 2, 3);
        ctx.fillRect(x + 22 + Math.sin(t * 2.5) * 2, by + 16 + drip2Y, 2, 3);

        // Legs - lurching walk
        const legSwing1 = walkCycle * 5;
        const legSwing2 = -walkCycle * 5;
        ctx.fillStyle = C.DROWNER_DARK || '#2a4a3a';
        ctx.fillRect(x + 8 + legSwing1, by + 33, 6, 12);
        ctx.fillRect(x + 20 + legSwing2, by + 33, 6, 12);

        // Webbed feet - splay when stepping
        ctx.fillStyle = '#4a8a6a';
        ctx.fillRect(x + 6 + legSwing1, by + 44, 9, 4);
        ctx.fillRect(x + 19 + legSwing2, by + 44, 9, 4);
        // Toe webbing detail
        ctx.fillStyle = '#3a7a5a';
        ctx.fillRect(x + 6 + legSwing1, by + 44, 2, 5);
        ctx.fillRect(x + 13 + legSwing1, by + 44, 2, 5);
        ctx.fillRect(x + 19 + legSwing2, by + 44, 2, 5);
        ctx.fillRect(x + 26 + legSwing2, by + 44, 2, 5);

        // Body - slimy with color variation
        const slimeShift = Math.sin(t * 0.7) * 10;
        const bodyR = Math.floor(58 + slimeShift);
        const bodyG = Math.floor(106 - slimeShift * 0.5);
        const bodyB = Math.floor(90 + slimeShift * 0.5);
        ctx.fillStyle = `rgb(${bodyR},${bodyG},${bodyB})`;
        ctx.fillRect(x + 6 + shambleLean, by + 14, 22, 20);

        // Slimy patches - shift over time
        ctx.fillStyle = C.DROWNER_DARK || '#2a4a3a';
        ctx.fillRect(x + 8 + shambleLean + Math.sin(t * 0.3) * 2, by + 18, 5, 3);
        ctx.fillRect(x + 18 + shambleLean + Math.cos(t * 0.4) * 2, by + 22, 5, 3);
        // Slime highlight
        ctx.fillStyle = 'rgba(100,200,170,0.3)';
        ctx.fillRect(x + 12 + shambleLean, by + 16, 3, 2);
        ctx.fillRect(x + 20 + shambleLean, by + 20, 3, 2);

        // Head - fish-like, bobs with shamble
        const headBob = Math.sin(t * 1.2) * 1.5;
        ctx.fillStyle = C.DROWNER_SKIN || '#3a6a5a';
        ctx.fillRect(x + 8 + shambleLean, by + 2 + headBob, 18, 14);

        // Darker head patches
        ctx.fillStyle = C.DROWNER_DARK || '#2a4a3a';
        ctx.fillRect(x + 10 + shambleLean, by + 4 + headBob, 4, 3);
        ctx.fillRect(x + 20 + shambleLean, by + 6 + headBob, 4, 3);

        // Eyes - bulging, pulse slightly
        const eyePulse = 0.8 + Math.sin(t * 1.5) * 0.2;
        ctx.fillStyle = `rgba(${Math.floor(170 * eyePulse)},${Math.floor(186 * eyePulse)},68,1)`;
        ctx.fillRect(x + 10 + shambleLean, by + 6 + headBob, 4, 3);
        ctx.fillRect(x + 18 + shambleLean, by + 6 + headBob, 4, 3);
        ctx.fillStyle = '#222';
        ctx.fillRect(x + 11 + shambleLean, by + 7 + headBob, 2, 2);
        ctx.fillRect(x + 19 + shambleLean, by + 7 + headBob, 2, 2);

        // Mouth with teeth - opens during attack
        const mouthOpen = isAttacking ? attackProgress * 4 : 0;
        ctx.fillStyle = '#2a3a2a';
        ctx.fillRect(x + 12 + shambleLean, by + 12 + headBob, 10, 3 + mouthOpen);
        ctx.fillStyle = '#ddd';
        ctx.fillRect(x + 13 + shambleLean, by + 12 + headBob, 2, 2);
        ctx.fillRect(x + 17 + shambleLean, by + 12 + headBob, 2, 2);
        ctx.fillRect(x + 20 + shambleLean, by + 12 + headBob, 2, 2);
        if (isAttacking) {
            // Bottom teeth visible
            ctx.fillRect(x + 14 + shambleLean, by + 14 + headBob + mouthOpen, 2, 2);
            ctx.fillRect(x + 18 + shambleLean, by + 14 + headBob + mouthOpen, 2, 2);
        }

        // Webbed hands/arms - swing + claw swipe during attack
        const armSwing = isChasing ? Math.sin(t * 1.8) * 4 : Math.sin(t * 0.5) * 2;
        const clawExtend = isAttacking ? attackProgress * 10 : 0;

        ctx.fillStyle = '#4a8a6a';
        ctx.fillRect(x + 1 + shambleLean + armSwing, by + 16, 6, 12);
        ctx.fillRect(x + 27 + shambleLean - armSwing + clawExtend, by + 16, 6, 12);

        // Finger/claw webs
        ctx.fillStyle = '#3a7a5a';
        ctx.fillRect(x + 0 + shambleLean + armSwing, by + 26, 3, 4);
        ctx.fillRect(x + 4 + shambleLean + armSwing, by + 27, 2, 3);
        // Right hand claws extend during attack
        ctx.fillRect(x + 30 + shambleLean - armSwing + clawExtend, by + 26, 3, 4);
        ctx.fillRect(x + 34 + shambleLean - armSwing + clawExtend, by + 25, 2, 5);

        ctx.restore();
    }
};

})();
