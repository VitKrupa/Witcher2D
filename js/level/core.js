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
        const fn = W.Backgrounds[this.bgTheme];
        if (fn) fn(ctx, cameraX);
    }

    drawPlatforms(ctx) {
        for (const p of this.platforms) p.draw(ctx);
    }

    drawForeground(ctx, cameraX) {
        // Grass tufts on platforms
        ctx.fillStyle = '#2a5a1a';
        const near = cameraX * 0.9;
        for (const p of this.platforms) {
            for (let gx = p.x + 5; gx < p.x + p.w - 5; gx += 18 + (gx % 7)) {
                ctx.fillRect(gx, p.y - 3, 2, 3);
                ctx.fillRect(gx + 3, p.y - 5, 1, 5);
                ctx.fillRect(gx - 2, p.y - 4, 1, 4);
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
    platforms.push({x:0, y:480, w:960, h:60});
    // Some elevated platforms
    platforms.push({x:150, y:380, w:120, h:16});
    platforms.push({x:400, y:340, w:160, h:16});
    platforms.push({x:700, y:380, w:120, h:16});
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
