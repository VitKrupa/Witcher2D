(function() {
'use strict';

W.Level = class {
    constructor(config) {
        this.name = config.name || 'Level';
        this.width = config.width || 3840;
        this.bgTheme = config.bgTheme || 'village';
        this.storyText = config.storyText || '';
        this.platforms = (config.platforms || []).map(p =>
            p instanceof W.Platform ? p : new W.Platform(p.x, p.y, p.w, p.h, p.type)
        );
        this.enemySpawns = config.enemies || [];
    }

    drawBackground(ctx, cameraX) {
        try {
            const fn = W.Backgrounds[this.bgTheme];
            if (fn) fn(ctx, cameraX);
        } catch(e) { console.error('BG error:', e); }
    }

    drawPlatforms(ctx) {
        for (const p of this.platforms) {
            try { p.draw(ctx); } catch(e) { /* fallback: simple rect */
                ctx.fillStyle = '#6b4226';
                ctx.fillRect(p.x, p.y, p.w, p.h);
            }
        }
    }

    drawForeground(ctx, cameraX) {
        // Deterministic hash for position-based details
        function ph(x, y, s) {
            let h = (x * 374761393 + y * 668265263 + s * 1274126177) | 0;
            h = ((h ^ (h >> 13)) * 1103515245 + 12345) | 0;
            return (h & 0x7fffffff) / 0x7fffffff;
        }

        for (const p of this.platforms) {
            const isCastle = this.bgTheme === 'castle';

            // ---- Grass tufts as small triangles/lines ----
            if (p.type !== 'ice') {
                for (let gx = p.x + 4; gx < p.x + p.w - 4; gx += 12 + ((gx * 7 + p.x) % 9)) {
                    const h1 = 3 + ph(gx, p.y, 1) * 5;
                    const h2 = 2 + ph(gx, p.y, 2) * 4;
                    const h3 = 3 + ph(gx, p.y, 3) * 6;
                    const lean1 = (ph(gx, p.y, 4) - 0.5) * 3;
                    const lean2 = (ph(gx, p.y, 5) - 0.5) * 2;

                    // Each blade is a thin triangle
                    const shadeR = 30 + ph(gx, p.y, 6) * 20 | 0;
                    const shadeG = 75 + ph(gx, p.y, 7) * 35 | 0;
                    ctx.fillStyle = 'rgb(' + shadeR + ',' + shadeG + ',20)';

                    // Blade 1
                    ctx.beginPath();
                    ctx.moveTo(gx, p.y);
                    ctx.lineTo(gx + lean1, p.y - h1);
                    ctx.lineTo(gx + 1.5, p.y);
                    ctx.fill();
                    // Blade 2
                    ctx.fillStyle = 'rgb(' + (shadeR + 8) + ',' + (shadeG + 10) + ',22)';
                    ctx.beginPath();
                    ctx.moveTo(gx + 3, p.y);
                    ctx.lineTo(gx + 3 + lean2, p.y - h2);
                    ctx.lineTo(gx + 4.5, p.y);
                    ctx.fill();
                    // Blade 3
                    ctx.fillStyle = 'rgb(' + (shadeR - 5) + ',' + (shadeG - 8) + ',18)';
                    ctx.beginPath();
                    ctx.moveTo(gx - 2, p.y);
                    ctx.lineTo(gx - 2 - lean1 * 0.5, p.y - h3);
                    ctx.lineTo(gx - 0.5, p.y);
                    ctx.fill();
                }
            }

            // ---- Pebbles on ground near platforms ----
            for (let px2 = p.x - 5; px2 < p.x + p.w + 5; px2 += 20 + ((px2 * 3) % 11)) {
                if (ph(px2, p.y, 20) > 0.4) continue;
                const pebX = px2 + ph(px2, p.y, 21) * 10;
                const pebY = p.y + p.h + 1 + ph(px2, p.y, 22) * 3;
                const pebR = 1 + ph(px2, p.y, 23) * 1.5;
                const grey = 100 + ph(px2, p.y, 24) * 60 | 0;
                ctx.fillStyle = 'rgb(' + grey + ',' + grey + ',' + (grey + 5) + ')';
                ctx.beginPath();
                ctx.ellipse(pebX, pebY, pebR, pebR * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // ---- Flowers occasionally ----
            for (let fx = p.x + 8; fx < p.x + p.w - 8; fx += 30 + ((fx * 11) % 19)) {
                if (ph(fx, p.y, 30) > 0.25) continue;
                const flowerX = fx + ph(fx, p.y, 31) * 6;
                const stemH = 4 + ph(fx, p.y, 32) * 5;

                // Stem
                ctx.strokeStyle = '#2a6a18';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(flowerX, p.y);
                ctx.lineTo(flowerX + (ph(fx, p.y, 33) - 0.5) * 2, p.y - stemH);
                ctx.stroke();

                // Flower head (colored dot)
                const colors = ['#e44', '#dd3', '#e8e', '#fa4', '#8af'];
                const ci = (ph(fx, p.y, 34) * colors.length) | 0;
                ctx.fillStyle = colors[ci];
                ctx.beginPath();
                ctx.arc(flowerX + (ph(fx, p.y, 33) - 0.5) * 2, p.y - stemH, 1.5 + ph(fx, p.y, 35) * 1, 0, Math.PI * 2);
                ctx.fill();
                // Center dot
                ctx.fillStyle = '#fe3';
                ctx.beginPath();
                ctx.arc(flowerX + (ph(fx, p.y, 33) - 0.5) * 2, p.y - stemH, 0.7, 0, Math.PI * 2);
                ctx.fill();
            }

            // ---- Moss hanging from platform edges ----
            if (p.type === 'stone' || isCastle) {
                // Left edge moss
                if (ph(p.x, p.y, 40) > 0.4) {
                    for (let my = 0; my < 4; my++) {
                        const mx = p.x + ph(p.x, p.y + my, 41) * 3;
                        const mLen = 3 + ph(p.x, p.y + my, 42) * 5;
                        ctx.strokeStyle = 'rgba(35,80,25,0.5)';
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(mx, p.y + p.h);
                        ctx.quadraticCurveTo(mx - 1, p.y + p.h + mLen * 0.6, mx + 1, p.y + p.h + mLen);
                        ctx.stroke();
                        // Moss leaf
                        ctx.fillStyle = 'rgba(40,90,30,0.5)';
                        ctx.beginPath();
                        ctx.arc(mx + 1, p.y + p.h + mLen, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                // Right edge moss
                if (ph(p.x + p.w, p.y, 43) > 0.45) {
                    for (let my = 0; my < 3; my++) {
                        const mx = p.x + p.w - ph(p.x + p.w, p.y + my, 44) * 3;
                        const mLen = 2 + ph(p.x + p.w, p.y + my, 45) * 4;
                        ctx.strokeStyle = 'rgba(35,80,25,0.5)';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(mx, p.y + p.h);
                        ctx.quadraticCurveTo(mx + 1, p.y + p.h + mLen * 0.5, mx - 1, p.y + p.h + mLen);
                        ctx.stroke();
                    }
                }
                // Bottom edge moss patches
                for (let mx = p.x + 6; mx < p.x + p.w - 6; mx += 22 + ((mx * 7) % 13)) {
                    if (ph(mx, p.y + p.h, 46) > 0.3) continue;
                    const dropLen = 2 + ph(mx, p.y, 47) * 6;
                    ctx.strokeStyle = 'rgba(30,75,20,0.4)';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(mx, p.y + p.h);
                    ctx.lineTo(mx + (ph(mx, p.y, 48) - 0.5) * 3, p.y + p.h + dropLen);
                    ctx.stroke();
                }
            }

            // ---- Torch brackets on walls of castle platforms ----
            if (isCastle && p.h >= 30) {
                const torchSpacing = 80 + (p.x % 30);
                for (let tx = p.x + 20; tx < p.x + p.w - 20; tx += torchSpacing) {
                    if (ph(tx, p.y, 50) > 0.5) continue;
                    const ty = p.y + 6;
                    // Bracket (L-shaped)
                    ctx.strokeStyle = '#3a3a3a';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(tx, ty);
                    ctx.lineTo(tx, ty + 8);
                    ctx.lineTo(tx + 5, ty + 8);
                    ctx.stroke();
                    // Torch body
                    ctx.fillStyle = '#5a3a1a';
                    ctx.fillRect(tx + 3, ty - 3, 4, 11);
                    // Flame glow
                    const time = typeof W.gameTime === 'number' ? W.gameTime : Date.now() * 0.001;
                    const flicker = Math.sin(time * 5 + tx * 0.1) * 0.15 + 0.85;
                    const grd = ctx.createRadialGradient(tx + 5, ty - 5, 0, tx + 5, ty - 5, 10);
                    grd.addColorStop(0, 'rgba(255,200,50,' + (0.4 * flicker).toFixed(2) + ')');
                    grd.addColorStop(0.5, 'rgba(255,120,20,' + (0.15 * flicker).toFixed(2) + ')');
                    grd.addColorStop(1, 'rgba(255,80,0,0)');
                    ctx.fillStyle = grd;
                    ctx.fillRect(tx - 5, ty - 15, 20, 20);
                    // Flame shape
                    ctx.fillStyle = 'rgba(255,180,40,' + (0.8 * flicker).toFixed(2) + ')';
                    ctx.beginPath();
                    ctx.moveTo(tx + 3, ty - 2);
                    ctx.quadraticCurveTo(tx + 5, ty - 8 - flicker * 3, tx + 7, ty - 2);
                    ctx.fill();
                    ctx.fillStyle = 'rgba(255,230,100,' + (0.6 * flicker).toFixed(2) + ')';
                    ctx.beginPath();
                    ctx.moveTo(tx + 4, ty - 2);
                    ctx.quadraticCurveTo(tx + 5, ty - 5 - flicker * 2, tx + 6, ty - 2);
                    ctx.fill();
                }
            }

            // ---- Puddles near ice platforms ----
            if (p.type === 'ice') {
                for (let pdx = 0; pdx < 3; pdx++) {
                    if (ph(p.x + pdx * 37, p.y, 60) > 0.5) continue;
                    const puddleX = p.x + 5 + ph(p.x, p.y, 61 + pdx) * (p.w - 10);
                    const puddleY = p.y + p.h + 2 + ph(p.x, p.y, 64 + pdx) * 2;
                    const puddleW = 6 + ph(p.x, p.y, 67 + pdx) * 10;
                    const puddleH = 1.5 + ph(p.x, p.y, 70 + pdx) * 1.5;
                    // Dark reflective ellipse
                    ctx.fillStyle = 'rgba(80,120,150,0.3)';
                    ctx.beginPath();
                    ctx.ellipse(puddleX, puddleY, puddleW, puddleH, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Highlight reflection
                    ctx.fillStyle = 'rgba(180,210,230,0.2)';
                    ctx.beginPath();
                    ctx.ellipse(puddleX - puddleW * 0.2, puddleY - puddleH * 0.2, puddleW * 0.4, puddleH * 0.5, -0.2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    spawnEnemies(difficulty) {
        return this.enemySpawns.map(e => W.createEnemy(e.type, e.x, e.y, difficulty)).filter(Boolean);
    }
};

W.WaveManager = class {
    constructor() {
        this.currentWave = 0;
        this.enemiesRemaining = 0;
        this.spawnQueue = [];
        this.betweenWaves = true;
        this.waveTimer = 120; // 2sec before first wave
        this.difficulty = 1.0;
        this.spawnTimer = 0;
    }

    getWaveComposition(num) {
        const waves = [
            [{type:'nekker',count:3},{type:'bandit',count:2}],
            [{type:'drowner',count:3},{type:'nilfSoldier',count:2}],
            [{type:'ghoul',count:2},{type:'witchHunter',count:3}],
            [{type:'wraith',count:2},{type:'wildHunt',count:2}],
            [{type:'griffin',count:1},{type:'nobleman',count:3}],
        ];
        const idx = (num - 1) % waves.length;
        return waves[idx];
    }

    startWave(num) {
        this.currentWave = num;
        this.betweenWaves = false;
        this.spawnQueue = [];
        const comp = this.getWaveComposition(num);
        for (const entry of comp) {
            for (let i = 0; i < entry.count; i++) {
                this.spawnQueue.push(entry.type);
            }
        }
        this.enemiesRemaining = this.spawnQueue.length;
        this.spawnTimer = 0;
    }

    update(dt, enemies, levelWidth) {
        const spd = dt * 60;
        if (this.betweenWaves) {
            this.waveTimer -= spd;
            if (this.waveTimer <= 0) {
                this.startWave(this.currentWave + 1);
                if (this.currentWave > 5) this.difficulty *= 1.2;
            }
            return null; // no announcement yet
        }
        // Spawn from queue
        this.spawnTimer -= spd;
        if (this.spawnQueue.length > 0 && this.spawnTimer <= 0) {
            const type = this.spawnQueue.shift();
            const side = Math.random() < 0.5 ? 50 : levelWidth - 80;
            const enemy = W.createEnemy(type, side, 200, this.difficulty);
            if (enemy) enemies.push(enemy);
            this.spawnTimer = 40;
        }
        // Check wave clear
        const alive = enemies.filter(e => e.alive).length;
        if (this.spawnQueue.length === 0 && alive === 0) {
            this.betweenWaves = true;
            this.waveTimer = 180; // 3sec between waves
        }
        return null;
    }

    get waveCleared() {
        return this.betweenWaves && this.currentWave > 0;
    }

    get displayText() {
        return 'Wave ' + this.currentWave;
    }
};

W.createWaveLevel = function() {
    const platforms = [];
    // Main ground
    platforms.push({x:0, y:200, w:960, h:60});
    // Some elevated platforms
    platforms.push({x:150, y:240, w:120, h:16});
    platforms.push({x:400, y:200, w:160, h:16});
    platforms.push({x:700, y:240, w:120, h:16});
    return new W.Level({
        name: 'Arena',
        width: 960,
        bgTheme: 'castle',
        platforms: platforms,
        enemies: [],
        storyText: ''
    });
};

})();
