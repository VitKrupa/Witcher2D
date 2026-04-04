(function() {
'use strict';

W.Effects = {
    // Draw effects around an enemy based on its type
    drawEnemyEffects: function(ctx, enemy, t) {
        const x = enemy.x, y = enemy.y, w = enemy.w, h = enemy.h;
        const name = enemy.name;

        if (name === 'Drowner') {
            // Water drips falling from body
            ctx.fillStyle = 'rgba(80,160,200,0.5)';
            const drip1 = (t * 40) % 30;
            const drip2 = (t * 40 + 15) % 30;
            ctx.fillRect(x + w*0.3, y + h*0.4 + drip1, 2, 4);
            ctx.fillRect(x + w*0.7, y + h*0.3 + drip2, 2, 3);
            // Wet footprints
            ctx.fillStyle = 'rgba(40,80,80,0.15)';
            ctx.beginPath();
            ctx.ellipse(x + w/2 - 10, y + h + 2, 5, 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        if (name === 'Ghoul') {
            // Green stink wisps rising
            ctx.fillStyle = 'rgba(80,140,40,0.2)';
            for (let i = 0; i < 3; i++) {
                const wx = x + w/2 + Math.sin(t * 0.8 + i * 2) * 10;
                const wy = y - 5 - ((t * 20 + i * 12) % 25);
                ctx.beginPath();
                ctx.arc(wx, wy, 3 + Math.sin(t + i) * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            // Buzzing flies (small black dots orbiting)
            ctx.fillStyle = 'rgba(30,30,30,0.7)';
            for (let i = 0; i < 2; i++) {
                const angle = t * 4 + i * Math.PI;
                const fx = x + w/2 + Math.cos(angle) * 14;
                const fy = y + 5 + Math.sin(angle) * 8;
                ctx.fillRect(fx, fy, 2, 2);
            }
        }

        if (name === 'Wraith') {
            // Spectral trailing wisps
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#8888ff';
            for (let i = 1; i <= 3; i++) {
                ctx.fillRect(x - i * 4 * enemy.facing, y + 5 + i * 3, w * 0.6, h * 0.4);
            }
            ctx.globalAlpha = 1;
            // Cold breath puffs
            ctx.fillStyle = 'rgba(180,200,255,0.2)';
            const breathX = x + (enemy.facing === 1 ? w + 3 : -8);
            ctx.beginPath();
            ctx.arc(breathX, y + 10, 3 + Math.sin(t * 1.5) * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        if (name === 'Wild Hunt') {
            // Frost trail on ground
            ctx.fillStyle = 'rgba(150,200,255,0.12)';
            for (let i = 1; i <= 4; i++) {
                ctx.fillRect(x + w/2 - i * 8 * enemy.facing - 3, y + h - 2, 6, 3);
            }
            // Ice crystals orbiting (in addition to what's drawn in the enemy itself)
            // Cold mist around feet
            ctx.fillStyle = 'rgba(140,180,220,0.1)';
            ctx.beginPath();
            ctx.ellipse(x + w/2, y + h, w * 0.8, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        if (name === 'Griffin') {
            // Wind gusts under wings (curved lines)
            if (enemy.state === 'chase' || enemy.swooping) {
                ctx.strokeStyle = 'rgba(200,200,200,0.15)';
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    const gy = y + h - 5 + i * 4;
                    ctx.beginPath();
                    ctx.moveTo(x - 10, gy);
                    ctx.quadraticCurveTo(x + w/2, gy + 5 + Math.sin(t * 3 + i) * 3, x + w + 10, gy);
                    ctx.stroke();
                }
            }
            // Feathers drifting down
            ctx.fillStyle = 'rgba(120,100,60,0.4)';
            for (let i = 0; i < 2; i++) {
                const fx = x + w/2 + Math.sin(t * 0.5 + i * 3) * 20;
                const fy = y + h + ((t * 15 + i * 20) % 40);
                ctx.fillRect(fx, fy, 3, 1.5);
            }
        }

        if (name === 'Nobleman') {
            // Purple arrogance shimmer particles rising
            ctx.fillStyle = 'rgba(120,60,160,0.2)';
            for (let i = 0; i < 2; i++) {
                const px = x + w/2 + Math.sin(t * 1.2 + i * 2.5) * 8;
                const py = y - 3 - ((t * 12 + i * 8) % 18);
                ctx.fillRect(px, py, 2, 2);
            }
        }

        if (name === 'Nilfgaardian') {
            // Gold armor shimmer (occasional flash)
            if (Math.sin(t * 3 + enemy.x * 0.1) > 0.9) {
                ctx.fillStyle = 'rgba(200,160,50,0.4)';
                ctx.fillRect(x + w/2 - 2, y + 20, 4, 4);
            }
        }
    },

    // Draw effects around Geralt
    drawPlayerEffects: function(ctx, player, t, enemies) {
        const x = player.x, y = player.y, w = player.w, h = player.h;

        // Medallion vibration near creatures
        let nearCreature = false;
        if (enemies) {
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].category === 'creature' && Math.abs(enemies[i].x - x) < 200) {
                    nearCreature = true;
                    break;
                }
            }
        }
        if (nearCreature) {
            // Vibration lines around medallion area
            ctx.strokeStyle = 'rgba(200,160,50,0.4)';
            ctx.lineWidth = 1;
            const mx = x + w/2, my = y + 17;
            for (let i = 0; i < 3; i++) {
                const vx = Math.sin(t * 15 + i * 2) * 3;
                const vy = Math.cos(t * 15 + i * 3) * 2;
                ctx.beginPath();
                ctx.moveTo(mx + vx - 2, my + vy);
                ctx.lineTo(mx + vx + 2, my + vy);
                ctx.stroke();
            }
        }

        // Footstep dust when running
        if (player.state === 'run' && player.onGround) {
            ctx.fillStyle = 'rgba(140,120,90,0.25)';
            const dustPhase = Math.sin(t * 8);
            if (dustPhase > 0.7) {
                ctx.fillRect(x + w/2 - 4, y + h, 8, 3);
                ctx.fillRect(x + w/2 - 6, y + h + 1, 3, 2);
            }
        }

        // Cat eyes glow (subtle always-on)
        ctx.fillStyle = 'rgba(218,165,32,0.15)';
        const eyeX = player.facing === 1 ? x + w/2 + 2 : x + w/2 - 4;
        ctx.beginPath();
        ctx.arc(eyeX, y + 8, 4, 0, Math.PI * 2);
        ctx.fill();
    },

    // Weapon trail effects during attack
    drawWeaponEffects: function(ctx, player, t) {
        if (player.state !== 'attack') return;
        const isSilver = player.activeSword === 'silver';
        const progress = 1 - player.stateTimer / 22;

        if (progress > 0.2 && progress < 0.7) {
            // Speed lines
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1;
            const cx = player.x + player.w/2;
            const cy = player.y + 15;
            for (let i = 0; i < 3; i++) {
                const angle = -0.6 + progress * 0.8 - i * 0.1;
                const len = 25 + i * 5;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(angle) * 10 * player.facing, cy + Math.sin(angle) * 10);
                ctx.lineTo(cx + Math.cos(angle) * len * player.facing, cy + Math.sin(angle) * len);
                ctx.stroke();
            }
        }
    }
};

})();
