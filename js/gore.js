// ============================================================================
// gore.js — Gore/violence system scaled by age
// Gore levels: 0 = kids (no blood), 1 = teen (light blood), 2 = adult (full gore)
// ============================================================================
(function() {
'use strict';

W.Gore = {
    level: 0, // 0=clean, 1=moderate, 2=extreme
    bloodPools: [], // persistent blood on ground
    gibs: [], // flying body parts

    setFromAge: function(age) {
        if (age < 13) {
            this.level = 0;
        } else if (age < 18) {
            this.level = 1;
        } else {
            this.level = 2;
        }
    },

    getLevelName: function() {
        return ['Clean (Under 13)', 'Moderate Gore (13-17)', 'Full Gore (18+)'][this.level];
    },

    getLevelColor: function() {
        return ['#44aa44', '#cc8844', '#cc2222'][this.level];
    },

    // Called when an enemy is hit (not killed)
    onEnemyHit: function(ps, x, y, dir, damage) {
        if (this.level === 0) {
            // Stars/sparkles instead of blood
            W.Emitters.sparks(ps, x, y);
            return;
        }
        if (this.level === 1) {
            // Light blood - fewer particles, smaller
            W.Emitters.blood(ps, x, y, dir);
            return;
        }
        // Level 2: heavy blood spray
        W.Emitters.blood(ps, x, y, dir);
        W.Emitters.blood(ps, x, y + 5, dir);
        // Extra blood splatter
        for (let i = 0; i < 4; i++) {
            ps.emit(1, {
                x: x, y: y,
                vxMin: dir * 1, vxMax: dir * 5,
                vyMin: -4, vyMax: 1,
                colors: ['#8b0000', '#aa0000', '#660000', '#990000'],
                sizeMin: 2, sizeMax: 4,
                lifeMin: 30, lifeMax: 50,
                gravity: 300, fade: true
            });
        }
    },

    // Called when enemy dies
    onEnemyDeath: function(ps, enemy, dir) {
        const x = enemy.x + enemy.w / 2;
        const y = enemy.y + enemy.h / 2;

        if (this.level === 0) {
            // Poof! Disappear effect — magical sparkles
            ps.emit(15, {
                x: x, y: y,
                vxMin: -3, vxMax: 3,
                vyMin: -3, vyMax: 3,
                colors: ['#ffee88', '#ffcc44', '#ffffff', '#aaddff'],
                sizeMin: 2, sizeMax: 4,
                lifeMin: 20, lifeMax: 40,
                gravity: -50, fade: true, shrink: true
            });
            return;
        }

        if (this.level === 1) {
            // Moderate: blood burst + enemy falls
            W.Emitters.blood(ps, x, y, dir);
            W.Emitters.deathBurst(ps, x, y, ['#8b0000', '#aa0000', '#660000']);
            // Small blood pool
            this.bloodPools.push({
                x: enemy.x, y: enemy.y + enemy.h - 4,
                w: enemy.w * 0.8, alpha: 0.6, life: 600
            });
            return;
        }

        // Level 2: EXTREME GORE
        // Massive blood explosion
        W.Emitters.blood(ps, x, y, dir);
        W.Emitters.blood(ps, x, y - 10, dir);
        W.Emitters.blood(ps, x, y + 10, -dir);
        W.Emitters.deathBurst(ps, x, y, [
            '#8b0000', '#aa0000', '#660000', '#cc1111', '#550000'
        ]);

        // Flying body parts (gibs)
        const isCreature = enemy.category === 'creature';
        const bodyColor = isCreature ? (enemy.name === 'Drowner' ? '#3a6a5a' : '#6a6060') : '#6a5a3a';
        const boneColor = '#ccbbaa';
        const groundY = enemy.y + enemy.h; // foot position = ground level

        // Severed head
        this.gibs.push({
            x: x, y: y - 15,
            vx: dir * W.randRange(2, 5), vy: W.randRange(-6, -3),
            rotation: 0, rotSpeed: dir * W.randRange(0.1, 0.3),
            size: 8, color: isCreature ? bodyColor : '#d4a574',
            type: 'head', life: 200, gravity: 0.3,
            isCreature: isCreature, groundY: groundY
        });

        // Severed arm
        this.gibs.push({
            x: x + dir * 5, y: y,
            vx: dir * W.randRange(3, 7), vy: W.randRange(-5, -2),
            rotation: 0, rotSpeed: W.randRange(-0.2, 0.2),
            size: 10, color: bodyColor,
            type: 'arm', life: 180, gravity: 0.3,
            isCreature: isCreature, groundY: groundY
        });

        // Severed leg
        this.gibs.push({
            x: x - dir * 3, y: y + 15,
            vx: -dir * W.randRange(1, 4), vy: W.randRange(-4, -1),
            rotation: 0, rotSpeed: W.randRange(-0.15, 0.15),
            size: 12, color: bodyColor,
            type: 'leg', life: 180, gravity: 0.35,
            isCreature: isCreature, groundY: groundY
        });

        // Blood pool (large)
        this.bloodPools.push({
            x: enemy.x - 10, y: enemy.y + enemy.h - 4,
            w: enemy.w + 20, alpha: 0.8, life: 900
        });

        // Blood trail from gibs
        for (let i = 0; i < 8; i++) {
            ps.emit(1, {
                x: x + W.randRange(-15, 15), y: y + W.randRange(-10, 10),
                vxMin: -2, vxMax: 2, vyMin: -5, vyMax: -1,
                colors: ['#8b0000', '#aa0000', '#cc0000'],
                sizeMin: 3, sizeMax: 5,
                lifeMin: 40, lifeMax: 80,
                gravity: 250, fade: true
            });
        }
    },

    // Called when player is hit
    onPlayerHit: function(ps, x, y, dir, damage) {
        if (this.level === 0) {
            W.Emitters.sparks(ps, x, y);
            return;
        }
        if (this.level === 1) {
            W.Emitters.blood(ps, x, y, dir);
            return;
        }
        // Level 2: player bleeds heavily
        W.Emitters.blood(ps, x, y, dir);
        if (damage > 10) {
            W.Emitters.blood(ps, x, y - 5, dir);
            // Blood splatter on ground
            this.bloodPools.push({
                x: x - 8, y: y + 30,
                w: 16, alpha: 0.4, life: 400
            });
        }
    },

    // Update gibs physics
    update: function(dt) {
        const spd = dt * 60;

        // Update flying gibs
        for (let i = this.gibs.length - 1; i >= 0; i--) {
            const g = this.gibs[i];
            g.vy += g.gravity * spd;
            g.x += g.vx * spd;
            g.y += g.vy * spd;
            g.rotation += g.rotSpeed * spd;
            g.life -= spd;

            // Stop at ground (use enemy's foot position, fallback to 500)
            const floorY = g.groundY || (W.GROUND_Y + 60) || 400;
            if (g.y > floorY) {
                g.y = floorY;
                g.vy = 0;
                g.vx *= 0.8;
                g.rotSpeed *= 0.5;
            }

            if (g.life <= 0) this.gibs.splice(i, 1);
        }

        // Fade blood pools
        for (let i = this.bloodPools.length - 1; i >= 0; i--) {
            const p = this.bloodPools[i];
            p.life -= spd;
            if (p.life < 100) p.alpha *= 0.98;
            if (p.life <= 0) this.bloodPools.splice(i, 1);
        }
    },

    // Draw blood pools (call before entities)
    drawPools: function(ctx) {
        for (const p of this.bloodPools) {
            ctx.fillStyle = 'rgba(100, 0, 0, ' + p.alpha + ')';
            ctx.beginPath();
            ctx.ellipse(p.x + p.w / 2, p.y + 2, p.w / 2, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            // Darker center
            ctx.fillStyle = 'rgba(60, 0, 0, ' + (p.alpha * 0.6) + ')';
            ctx.beginPath();
            ctx.ellipse(p.x + p.w / 2, p.y + 2, p.w / 3, 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    // Draw flying gibs
    drawGibs: function(ctx) {
        for (const g of this.gibs) {
            ctx.save();
            ctx.translate(g.x, g.y);
            ctx.rotate(g.rotation);

            const fadeAlpha = Math.min(1, g.life / 30);
            ctx.globalAlpha = fadeAlpha;

            switch (g.type) {
                case 'head':
                    // Severed head
                    ctx.fillStyle = g.color;
                    ctx.fillRect(-4, -4, 8, 8);
                    if (g.isCreature) {
                        // Monster head - eyes
                        ctx.fillStyle = '#ff4444';
                        ctx.fillRect(-2, -2, 2, 2);
                        ctx.fillRect(2, -2, 2, 2);
                    } else {
                        // Human head - hair
                        ctx.fillStyle = '#3a2a1a';
                        ctx.fillRect(-4, -5, 8, 3);
                        // Eyes (closed)
                        ctx.fillStyle = '#333';
                        ctx.fillRect(-2, -1, 2, 1);
                        ctx.fillRect(2, -1, 2, 1);
                    }
                    // Blood drip from neck
                    ctx.fillStyle = '#8b0000';
                    ctx.fillRect(-2, 4, 5, 3);
                    ctx.fillRect(-1, 6, 3, 2);
                    break;

                case 'arm':
                    // Severed arm
                    ctx.fillStyle = g.color;
                    ctx.fillRect(-2, -5, 4, 12);
                    // Hand
                    ctx.fillStyle = g.isCreature ? g.color : '#d4a574';
                    ctx.fillRect(-2, 6, 5, 3);
                    // Bone stump
                    ctx.fillStyle = '#ccbbaa';
                    ctx.fillRect(-1, -6, 3, 3);
                    // Blood at stump
                    ctx.fillStyle = '#8b0000';
                    ctx.fillRect(-2, -7, 5, 2);
                    break;

                case 'leg':
                    // Severed leg
                    ctx.fillStyle = g.color;
                    ctx.fillRect(-2, -6, 5, 14);
                    // Boot
                    ctx.fillStyle = '#2a1a0a';
                    ctx.fillRect(-3, 7, 7, 4);
                    // Bone stump
                    ctx.fillStyle = '#ccbbaa';
                    ctx.fillRect(-1, -7, 3, 3);
                    // Blood
                    ctx.fillStyle = '#8b0000';
                    ctx.fillRect(-2, -8, 5, 2);
                    break;
            }

            ctx.globalAlpha = 1;
            ctx.restore();

            // Blood trail from gibs
            if (g.vy > 0 && Math.random() < 0.3) {
                ctx.fillStyle = 'rgba(139, 0, 0, 0.4)';
                ctx.fillRect(g.x - 1, g.y + 5, 2, 2);
            }
        }
    },

    // Clear all gore (on level change/restart)
    clear: function() {
        this.bloodPools = [];
        this.gibs = [];
    }
};

})();
