/**
 * game.js - Witcher 2D Main Game Orchestrator
 *
 * Ties together all engine modules: Camera, Player, Level, StoryLevels,
 * WaveManager, ParticleSystem, Emitters, createEnemy, etc.
 *
 * Depends on: core.js, rendering.js, particles.js, player.js, level.js,
 *             storylevels.js, wavemanager.js, enemies.js
 *             (all must define their exports on the global W namespace)
 */

(function () {
    "use strict";

    // ---------------------------------------------------------------
    // W.Game
    // ---------------------------------------------------------------

    W.Game = class Game {

        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.camera = null;
            this.player = null;
            this.level = null;
            this.particles = null;
            this.enemies = [];
            this.projectiles = [];
            this.keys = {};
            this.running = false;
            this.paused = false;
            this.lastTime = 0;
            this.gameMode = 'story';
            this.currentLevelIndex = 0;
            this.waveManager = null;
            this.storyTextTimer = 0;
            this.showingStoryText = false;
            this.floatingTexts = [];
            this.levelTransition = false;
            this.transitionAlpha = 0;

            // Bound reference so we can use it with requestAnimationFrame
            this._loopBound = this.loop.bind(this);
        }

        // -----------------------------------------------------------
        // init
        // -----------------------------------------------------------

        init() {
            this.canvas = document.getElementById('gameCanvas');
            this.canvas.width = W.CANVAS_W;
            this.canvas.height = W.CANVAS_H;
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', this.resizeCanvas.bind(this));
            window.addEventListener('orientationchange', function() {
                setTimeout(function() { window.game.resizeCanvas(); }, 200);
            });

            this.camera = new W.Camera();
            this.particles = new W.ParticleSystem();

            this.enemies = [];
            this.projectiles = [];
            this.floatingTexts = [];
            this.keys = {};
            this.running = false;
            this.paused = false;
            this.lastTime = 0;
            this.currentLevelIndex = 0;
            this.waveManager = null;
            this.storyTextTimer = 0;
            this.showingStoryText = false;
            this.levelTransition = false;
            this.transitionAlpha = 0;

            this.bindInput();
            this.setupStartScreen();
            W.Mobile.init();

            // Check sessionStorage for previous age confirmation
            var savedAge = sessionStorage.getItem('witcher2d_age');
            if (savedAge) {
                this._ageConfirmed = true;
                W.Gore.setFromAge(parseInt(savedAge, 10));
            }

            // Show age gate first (if not already confirmed)
            if (!this._ageConfirmed) {
                var ageGate = document.getElementById('ageGate');
                if (ageGate) ageGate.style.display = 'flex';
                document.getElementById('startScreen').style.display = 'none';
            } else {
                var ageGate = document.getElementById('ageGate');
                if (ageGate) ageGate.style.display = 'none';
                // Update gore indicator
                var indicator = document.getElementById('goreIndicator');
                if (indicator) {
                    indicator.innerHTML = 'Violence level: <span style="color:' +
                        W.Gore.getLevelColor() + '">' + W.Gore.getLevelName() + '</span>';
                }
                this.showStartScreen();
            }
        }

        confirmAge() {
            var input = document.getElementById('ageInput');
            var age = parseInt(input.value, 10);
            var warning = document.getElementById('ageWarning');

            if (!age || age < 1 || age > 120) {
                if (warning) warning.textContent = 'Please enter a valid age (1-120).';
                return;
            }

            W.Gore.setFromAge(age);
            this._ageConfirmed = true;
            this._playerAge = age;
            sessionStorage.setItem('witcher2d_age', age.toString());

            // Hide age gate, show start screen
            var ageGate = document.getElementById('ageGate');
            if (ageGate) ageGate.style.display = 'none';

            // Show gore level indicator on start screen
            var indicator = document.getElementById('goreIndicator');
            if (indicator) {
                indicator.innerHTML = 'Violence level: <span style="color:' +
                    W.Gore.getLevelColor() + '">' + W.Gore.getLevelName() + '</span>';
            }

            this.showStartScreen();
        }

        // -----------------------------------------------------------
        // Start-screen mode picker
        // -----------------------------------------------------------

        setupStartScreen() {
            // Buttons are already in HTML — no dynamic creation needed
        }

        resizeCanvas() {
            var container = document.getElementById('gameContainer');
            if (!container || !this.canvas) return;
            var vw = window.innerWidth;
            var vh = window.innerHeight;
            var screenRatio = vw / vh;
            var gameH = 400; // fixed height — smaller = everything bigger
            // Adjust canvas width to match screen aspect ratio
            var gameW = Math.round(gameH * screenRatio);
            gameW = Math.max(gameW, 800);  // minimum width
            gameW = Math.min(gameW, 1400); // maximum width

            // Update internal canvas resolution
            if (this.canvas.width !== gameW || this.canvas.height !== gameH) {
                this.canvas.width = gameW;
                this.canvas.height = gameH;
                W.CANVAS_W = gameW; // update global
            }

            // Scale to fill screen — width matches exactly, height fills
            var scale = vw / gameW;
            container.style.width = gameW + 'px';
            container.style.height = gameH + 'px';
            container.style.transform = 'scale(' + scale + ')';
            container.style.transformOrigin = 'top left';
            container.style.position = 'fixed';
            container.style.top = '0px';
            container.style.left = '0px';
        }

        showStartScreen() {
            document.getElementById('startScreen').style.display = 'flex';
            document.getElementById('gameOverScreen').style.display = 'none';
        }

        // -----------------------------------------------------------
        // start
        // -----------------------------------------------------------

        start(mode) {
            this.gameMode = mode || 'story';

            // Hide overlays
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('gameOverScreen').style.display = 'none';
            W.Mobile.show();

            // Reset state
            this.enemies = [];
            this.projectiles = [];
            this.floatingTexts = [];
            this.particles.clear();
            W.Gore.clear();
            this.camera = new W.Camera();
            this.currentLevelIndex = 0;
            this.levelTransition = false;
            this.transitionAlpha = 0;

            if (this.gameMode === 'story') {
                this.loadStoryLevel(0);
            } else {
                // Wave mode
                this.level = W.createWaveLevel();
                this.waveManager = new W.WaveManager();
                this.player = new W.Player(100, 280);
                this.player.score = 0;
                var waveDisp = document.getElementById('waveDisplay');
                if (waveDisp) waveDisp.textContent = 'Wave 1';
            }

            this.running = true;
            this.lastTime = 0;
            requestAnimationFrame(this._loopBound);
        }

        // -----------------------------------------------------------
        // restart
        // -----------------------------------------------------------

        restart() {
            if (this.gameMode === 'story' && this._lastCheckpointX) {
                this.respawnFromCheckpoint();
            } else {
                this.running = false;
                this._lastCheckpointX = 0;
                this.init();
                this.showStartScreen();
            }
        }

        // -----------------------------------------------------------
        // loadStoryLevel
        // -----------------------------------------------------------

        loadStoryLevel(index) {
            var storyData = W.StoryLevels[index];
            if (!storyData) return;

            this.currentLevelIndex = index;
            this._lastCheckpointX = 0; // reset checkpoint for new level
            this._checkpointLevel = index;
            this.level = new W.Level(storyData);
            this.enemies = [];
            this.projectiles = [];

            // Spawn enemies defined in the story level
            if (storyData.enemies) {
                for (var i = 0; i < storyData.enemies.length; i++) {
                    var def = storyData.enemies[i];
                    var enemy = W.createEnemy(def.type, def.x, def.y);
                    if (enemy) this.enemies.push(enemy);
                }
            }

            // Create / reposition player
            if (!this.player) {
                this.player = new W.Player(100, 280);
                this.player.score = 0;
            } else {
                this.player.x = 100;
                this.player.y = 280;
                this.player.vx = 0;
                this.player.vy = 0;
                this.player.hp = this.player.maxHp;
            }
            // Set dark level flag for cat-eye glow effect in castle theme
            this.player._darkLevel = (storyData.bgTheme === 'castle');

            // Show story intro text (only on first visit)
            if (!this._levelVisited) this._levelVisited = {};
            if (storyData.storyText && !this._levelVisited[index]) {
                this.showingStoryText = true;
                this.storyTextTimer = 120; // 2 seconds, shorter
                this._storyText = storyData.storyText;
                this._storyTitle = storyData.name || ('Level ' + (index + 1));
                this._levelVisited[index] = true;
            }

            // Update wave display to show level name
            var waveDisp = document.getElementById('waveDisplay');
            if (waveDisp) waveDisp.textContent = storyData.name || ('Level ' + (index + 1));
        }

        // -----------------------------------------------------------
        // loop
        // -----------------------------------------------------------

        loop(timestamp) {
            if (!this.running && !this.levelTransition) return;

            // Calculate delta time in seconds, capped at 50ms
            var dt;
            if (this.lastTime === 0) {
                dt = 1 / 60;
            } else {
                dt = (timestamp - this.lastTime) / 1000;
                if (dt > 0.05) dt = 0.05;
            }
            this.lastTime = timestamp;

            try {
                if (!this.paused) {
                    this.update(dt);
                }
                this.draw();
            } catch(e) {
                console.error('Game loop error:', e);
            }

            requestAnimationFrame(this._loopBound);
        }

        // -----------------------------------------------------------
        // update
        // -----------------------------------------------------------

        update(dt) {
            // Story text overlay countdown
            if (this.showingStoryText) {
                this.storyTextTimer -= dt * 60;
                // Dismiss on any key/touch OR after timer expires
                var anyKey = false;
                for (var k in this.keys) { if (this.keys[k]) anyKey = true; }
                if (this.storyTextTimer <= 0 || (anyKey && this.storyTextTimer < 150)) {
                    this.showingStoryText = false;
                }
                return;
            }

            // Level transition fade
            if (this.levelTransition) {
                this.handleLevelTransition(dt);
                return;
            }

            // --- Mobile joystick → keys ---
            W.Mobile.applyToKeys(this.keys);

            // --- Player ---
            if (this.player && this.level) {
                this.player.update(dt, this.keys, this.level.platforms);
            }

            // --- Enemies ---
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                if (enemy && this.player) {
                    enemy.update(dt, this.player.x + this.player.w / 2, this.player.y, this.level.platforms);
                }
            }

            // --- Particles ---
            this.particles.update(dt);

            // --- Collect enemy projectiles (e.g. Witch Hunter bolts) ---
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                if (enemy.projectiles && enemy.projectiles.length > 0) {
                    for (var j = 0; j < enemy.projectiles.length; j++) {
                        this.projectiles.push(enemy.projectiles[j]);
                    }
                    enemy.projectiles = [];
                }
            }

            // --- Projectiles ---
            this.handleProjectiles(dt);

            // --- Combat ---
            this.resolveCombat();
            this.resolveEnemyAttacks();

            // --- Update gore system ---
            W.Gore.update(dt);

            // --- Remove dead enemies ---
            for (var i = this.enemies.length - 1; i >= 0; i--) {
                var enemy = this.enemies[i];
                if (!enemy.alive && enemy.state === 'dead') {
                    // On first frame of death, trigger effects and score
                    if (!enemy._deathHandled) {
                        enemy._deathHandled = true;
                        enemy._deathTimer = 30; // frames for fade-out animation
                        // Score
                        if (this.player) {
                            this.player.score += (enemy.scoreLoot || 10);
                        }
                        // Gore-scaled death effect
                        var dir = this.player ? (this.player.facing || 1) : 1;
                        W.Gore.onEnemyDeath(this.particles, enemy, dir);
                    }
                    // Count down death animation
                    enemy._deathTimer -= dt * 60;
                    if (enemy._deathTimer <= 0) {
                        this.enemies.splice(i, 1);
                    }
                }
            }

            // --- Camera ---
            if (this.player && this.level) {
                this.camera.follow(this.player, this.level.width);
                this.camera.update(dt);
            }

            // --- Floating texts ---
            this.updateFloatingTexts(dt);

            // --- Checkpoint tracking (every 480px, per level) ---
            if (this.player && this.player.onGround && this.gameMode === 'story') {
                var screenPos = Math.floor(this.player.x / 480) * 480;
                if (screenPos > (this._lastCheckpointX || 0)) {
                    this._lastCheckpointX = screenPos;
                    this._checkpointLevel = this.currentLevelIndex;
                }
            }

            // --- Ambient particles ---
            if (Math.random() < 0.03 && this.level) {
                W.Emitters.ambient(this.particles, {
                    x: this.camera.offsetX,
                    y: 50,
                    w: W.CANVAS_W,
                    h: W.CANVAS_H - 100
                });
            }

            // --- Story mode: check level end ---
            if (this.gameMode === 'story' && this.player && this.level) {
                if (this.player.x > this.level.width - 100 && this.enemies.length === 0) {
                    this.nextLevel();
                }
            }

            // --- Wave mode: update wave manager ---
            if (this.gameMode === 'wave' && this.waveManager) {
                var spawns = this.waveManager.update(dt, this.enemies, this.level.width);
                if (spawns && spawns.length) {
                    for (var s = 0; s < spawns.length; s++) {
                        var sp = spawns[s];
                        var newEnemy = W.createEnemy(sp.type, sp.x, sp.y);
                        if (newEnemy) this.enemies.push(newEnemy);
                    }
                }
                // Update wave display
                var waveDisp = document.getElementById('waveDisplay');
                if (waveDisp) {
                    waveDisp.textContent = 'Wave ' + this.waveManager.currentWave;
                }
                // Show wave announcement
                if (this.waveManager.betweenWaves && this.waveManager.waveTimer > 100) {
                    var announceEl = document.getElementById('waveAnnounce');
                    if (announceEl) {
                        announceEl.textContent = 'WAVE ' + (this.waveManager.currentWave + 1);
                        announceEl.style.opacity = '1';
                    }
                } else {
                    var announceEl = document.getElementById('waveAnnounce');
                    if (announceEl) announceEl.style.opacity = '0';
                }
            }

            // --- Player death ---
            if (this.player && this.player.hp <= 0) {
                this.gameOver();
                return;
            }

            // --- HUD ---
            this.updateHUD();
        }

        // -----------------------------------------------------------
        // draw
        // -----------------------------------------------------------

        draw() {
            var ctx = this.ctx;
            ctx.clearRect(0, 0, W.CANVAS_W, W.CANVAS_H);

            if (!this.level) return;

            // World-space drawing
            this.camera.apply(ctx);

            // Background (parallax)
            this.level.drawBackground(ctx, this.camera.offsetX);

            // Platforms
            this.level.drawPlatforms(ctx);

            // Blood pools (under entities)
            W.Gore.drawPools(ctx);

            // Enemies sorted by y for depth
            var sortedEnemies = this.enemies.slice().sort(function (a, b) {
                return a.y - b.y;
            });
            var animT = this.lastTime * 0.001 || 0;
            for (var i = 0; i < sortedEnemies.length; i++) {
                try {
                    ctx.save();
                    sortedEnemies[i].draw(ctx);
                    ctx.restore();
                    if (W.Effects) { ctx.save(); W.Effects.drawEntityEffects(ctx, sortedEnemies[i], animT); ctx.restore(); }
                } catch(e) { ctx.restore(); }
            }

            // Player
            if (this.player) {
                try {
                    ctx.save();
                    this.player.draw(ctx);
                    ctx.restore();
                } catch(e) { ctx.restore(); console.error('Player draw error:', e); }
                try {
                    if (W.Effects) {
                        ctx.save();
                        W.Effects.drawPlayerEffects(ctx, this.player, animT, this.enemies);
                        W.Effects.drawWeaponEffects(ctx, this.player, animT);
                        ctx.restore();
                    }
                } catch(e) { ctx.restore(); }
            }

            // Projectiles
            for (var i = 0; i < this.projectiles.length; i++) {
                var proj = this.projectiles[i];
                ctx.fillStyle = proj.color || '#ffcc00';
                ctx.fillRect(proj.x - 3, proj.y - 1, 6, 2);
            }

            // Particles
            this.particles.draw(ctx);

            // Flying gibs (over particles)
            W.Gore.drawGibs(ctx);

            // Floating texts (world space)
            this.drawFloatingTexts(ctx);

            // Foreground
            this.level.drawForeground(ctx, this.camera.offsetX);

            this.camera.restore(ctx);

            // --- Screen-space overlays ---

            // Story text overlay
            if (this.showingStoryText) {
                this.drawStoryTextOverlay(ctx);
            }

            // Level transition fade
            if (this.levelTransition) {
                ctx.fillStyle = 'rgba(0,0,0,' + this.transitionAlpha + ')';
                ctx.fillRect(0, 0, W.CANVAS_W, W.CANVAS_H);
            }
        }

        // -----------------------------------------------------------
        // resolveCombat
        // -----------------------------------------------------------

        resolveCombat() {
            if (!this.player || !this.player.isAttacking || !this.player.attackHitbox) {
                // Reset hit tracking when not attacking
                if (this.player) {
                    this.player._hitEnemies = null;
                    this.player._hitEnemy = false;
                }
                return;
            }
            // Track which enemies have been hit during this attack
            if (!this.player._hitEnemies) this.player._hitEnemies = [];

            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                if (!enemy.alive) continue;
                if (!enemy.hitbox) continue;
                if (this.player._hitEnemies.indexOf(enemy) !== -1) continue; // already hit

                if (W.boxCollision(this.player.attackHitbox, enemy.hitbox)) {
                    this.player._hitEnemies.push(enemy);
                    this.player._hitEnemy = true; // signal for weapon effects
                    var swordType = this.player.activeSword || 'silver';

                    // Base damage; takeDamage handles sword effectiveness (1/3 for wrong sword)
                    var baseDamage = W.randInt(20, 25);
                    var result = enemy.takeDamage(baseDamage, swordType);
                    var damage = result.dmg;
                    var correctSword = result.effective;

                    // Determine direction for particles
                    var dir = this.player.facing || 1;
                    var hitX = (this.player.attackHitbox.x + this.player.attackHitbox.w / 2);
                    var hitY = (this.player.attackHitbox.y + this.player.attackHitbox.h / 2);

                    // Spawn particles based on sword type
                    if (swordType === 'silver') {
                        W.Emitters.silverSlash(this.particles, hitX, hitY, dir);
                    } else {
                        W.Emitters.ironSlash(this.particles, hitX, hitY, dir);
                    }
                    W.Gore.onEnemyHit(this.particles, hitX, hitY, dir, damage);

                    // Floating text
                    if (!correctSword) {
                        this.addFloatingText(enemy.x, enemy.y - 30, 'RESIST', W.Colors.RESIST_GREY);
                        this.addFloatingText(enemy.x, enemy.y - 15, '-' + damage, '#aaaaaa');
                        W.Emitters.sparks(this.particles, hitX, hitY);
                    } else {
                        var dmgColor = damage >= 23 ? '#ffee44' : '#ffffff';
                        this.addFloatingText(enemy.x, enemy.y - 30, '-' + damage, dmgColor);
                    }

                    // Camera shake on kill
                    if (enemy.hp <= 0) {
                        this.camera.shake(4, 6);
                    }
                }
            }
        }

        // -----------------------------------------------------------
        // resolveEnemyAttacks
        // -----------------------------------------------------------

        resolveEnemyAttacks() {
            if (!this.player || this.player.hp <= 0) return;

            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                if (enemy.state !== 'attack') {
                    enemy._attackHit = false; // reset hit tracking when not attacking
                    continue;
                }
                if (enemy._attackHit) continue; // already hit player this attack cycle
                var atkBox = enemy.attackBox;
                if (!atkBox) continue;

                var playerHitbox = this.player.hitbox;
                if (!playerHitbox) continue;

                if (W.boxCollision(atkBox, playerHitbox)) {
                    var damage = enemy.damage || 8;

                    // Check if player is blocking
                    if (this.player.state === 'block') {
                        damage = Math.floor(damage * 0.25);
                        W.Emitters.sparks(this.particles, this.player.x, this.player.y - 15);
                        this.addFloatingText(
                            this.player.x, this.player.y - 40,
                            'BLOCK', '#8888dd'
                        );
                    }

                    this.player.takeDamage(damage);

                    // Hit particles (gore-scaled)
                    var hitDir = enemy.x < this.player.x ? 1 : -1;
                    W.Gore.onPlayerHit(this.particles, this.player.x, this.player.y - 15, hitDir, damage);

                    if (damage > 0) {
                        this.addFloatingText(
                            this.player.x, this.player.y - 25,
                            '-' + damage, W.Colors.DAMAGE_RED
                        );
                    }

                    // Camera shake on heavy hits
                    if (damage > 10) {
                        this.camera.shake(damage * 0.5, 8);
                    }

                    // Mark this attack cycle as having hit (once per attack)
                    enemy._attackHit = true;
                }
            }
        }

        // -----------------------------------------------------------
        // handleProjectiles
        // -----------------------------------------------------------

        handleProjectiles(dt) {
            var spd = dt * 60;
            for (var i = this.projectiles.length - 1; i >= 0; i--) {
                var proj = this.projectiles[i];

                // Update position (vx/vy are per-frame values)
                proj.x += proj.vx * spd;
                proj.y += (proj.vy || 0) * spd;

                // Check collision with player
                if (this.player && this.player.hitbox) {
                    var projBox = {
                        x: proj.x - 3,
                        y: proj.y - 2,
                        w: 6,
                        h: 4
                    };
                    if (W.boxCollision(projBox, this.player.hitbox)) {
                        var damage = proj.damage || 5;
                        if (this.player.state === 'block') {
                            damage = Math.floor(damage * 0.25);
                            W.Emitters.sparks(this.particles, this.player.x, this.player.y - 15);
                        }
                        this.player.takeDamage(damage);
                        this.addFloatingText(
                            this.player.x, this.player.y - 25,
                            '-' + damage, W.Colors.DAMAGE_RED
                        );
                        W.Emitters.sparks(this.particles, proj.x, proj.y);
                        this.projectiles.splice(i, 1);
                        continue;
                    }
                }

                // Remove off-screen
                if (proj.x < this.camera.offsetX - 50 ||
                    proj.x > this.camera.offsetX + W.CANVAS_W + 50 ||
                    proj.y < -50 || proj.y > W.CANVAS_H + 50) {
                    this.projectiles.splice(i, 1);
                }
            }
        }

        // -----------------------------------------------------------
        // nextLevel
        // -----------------------------------------------------------

        nextLevel() {
            if (this.levelTransition) return;

            this.currentLevelIndex++;

            if (this.currentLevelIndex > 5 || this.currentLevelIndex >= W.StoryLevels.length) {
                // Victory!
                this.showVictory();
                return;
            }

            // Start transition
            this.levelTransition = true;
            this.transitionAlpha = 0;
            this._transitionPhase = 'fadeOut'; // fadeOut -> load -> fadeIn
        }

        handleLevelTransition(dt) {
            var speed = dt * 2; // transition takes ~0.5 seconds per phase

            if (this._transitionPhase === 'fadeOut') {
                this.transitionAlpha += speed;
                if (this.transitionAlpha >= 1) {
                    this.transitionAlpha = 1;
                    // Load the next level
                    this.loadStoryLevel(this.currentLevelIndex);
                    this._transitionPhase = 'fadeIn';
                }
            } else if (this._transitionPhase === 'fadeIn') {
                this.transitionAlpha -= speed;
                if (this.transitionAlpha <= 0) {
                    this.transitionAlpha = 0;
                    this.levelTransition = false;
                    this._transitionPhase = null;
                }
            }
        }

        showVictory() {
            this.running = false;
            var overScreen = document.getElementById('gameOverScreen');
            var title = overScreen.querySelector('h2');
            if (title) {
                title.textContent = 'VICTORY';
                title.style.color = '#c8a032';
                title.style.textShadow = '0 0 20px rgba(200, 160, 50, 0.5)';
            }
            var scoreEl = document.getElementById('finalScore');
            if (scoreEl) {
                scoreEl.textContent = 'Final Score: ' + (this.player ? this.player.score : 0);
            }
            overScreen.style.display = 'flex';
        }

        // -----------------------------------------------------------
        // updateHUD
        // -----------------------------------------------------------

        updateHUD() {
            if (!this.player) return;

            // Health bar
            var healthBar = document.getElementById('healthBar');
            if (healthBar) {
                var pct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
                healthBar.style.width = pct + '%';
            }

            // Score
            var scoreDisp = document.getElementById('scoreDisplay');
            if (scoreDisp) {
                scoreDisp.textContent = 'Score: ' + (this.player.score || 0);
            }

            // Wave / Level display
            var waveDisp = document.getElementById('waveDisplay');
            if (waveDisp) {
                if (this.gameMode === 'story') {
                    var levelData = W.StoryLevels[this.currentLevelIndex];
                    waveDisp.textContent = levelData ? (levelData.name || 'Level ' + (this.currentLevelIndex + 1)) : '';
                }
                // wave mode display is updated in the wave manager update section
            }

            // Active sword display
            var swordDisp = document.getElementById('activeSwordDisplay');
            if (swordDisp) {
                var sword = this.player.activeSword || 'silver';
                if (sword === 'silver') {
                    swordDisp.textContent = 'Silver Sword';
                    swordDisp.style.color = '#aab0ff';
                } else {
                    swordDisp.textContent = 'Iron Sword';
                    swordDisp.style.color = '#ffaa44';
                }
            }

            // Enemy hint - show contextual hint about nearest enemy
            var hintEl = document.getElementById('enemyHint');
            if (hintEl && this.enemies.length > 0) {
                // Find nearest enemy
                var nearest = null;
                var nearDist = Infinity;
                for (var i = 0; i < this.enemies.length; i++) {
                    var d = Math.abs(this.enemies[i].x - this.player.x);
                    if (d < nearDist) {
                        nearDist = d;
                        nearest = this.enemies[i];
                    }
                }
                if (nearest && nearDist < 300) {
                    var cat = nearest.category || 'creature';
                    var recommended = cat === 'creature' ? 'Silver [Q]' : 'Iron [E]';
                    hintEl.textContent = nearest.name + ' - Use ' + recommended;
                    hintEl.style.color = cat === 'creature' ? '#8888dd' : '#cc8844';
                } else {
                    hintEl.textContent = 'Use the right sword!';
                    hintEl.style.color = '#999';
                }
            } else if (hintEl) {
                hintEl.textContent = 'Area clear';
                hintEl.style.color = '#666';
            }
        }

        // -----------------------------------------------------------
        // bindInput
        // -----------------------------------------------------------

        bindInput() {
            var self = this;

            window.addEventListener('keydown', function (e) {
                var key = e.key.toLowerCase();

                // Map arrow keys to WASD equivalents
                if (e.key === 'ArrowLeft') key = 'a';
                if (e.key === 'ArrowRight') key = 'd';
                if (e.key === 'ArrowUp') key = 'w';
                if (e.key === 'ArrowDown') key = 's';

                self.keys[key] = true;

                // Sword attacks
                if (key === 'q') {
                    self.attack('silver');
                }
                if (key === 'e') {
                    self.attack('iron');
                }

                // Block
                if (e.key === 'Shift') {
                    self.keys['shift'] = true;
                }

                // Prevent scrolling with arrow keys and space
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(e.key) !== -1) {
                    e.preventDefault();
                }
            });

            window.addEventListener('keyup', function (e) {
                var key = e.key.toLowerCase();

                if (e.key === 'ArrowLeft') key = 'a';
                if (e.key === 'ArrowRight') key = 'd';
                if (e.key === 'ArrowUp') key = 'w';
                if (e.key === 'ArrowDown') key = 's';

                self.keys[key] = false;

                if (e.key === 'Shift') {
                    self.keys['shift'] = false;
                }
            });

            // Wire up the sword button click handlers (reinforcing the HTML onmousedown)
            var silverBtn = document.getElementById('silverSwordBtn');
            var ironBtn = document.getElementById('ironSwordBtn');
            if (silverBtn) {
                silverBtn.addEventListener('mousedown', function () { self.attack('silver'); });
                silverBtn.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    self.attack('silver');
                });
            }
            if (ironBtn) {
                ironBtn.addEventListener('mousedown', function () { self.attack('iron'); });
                ironBtn.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    self.attack('iron');
                });
            }
        }

        // -----------------------------------------------------------
        // attack
        // -----------------------------------------------------------

        attack(swordType) {
            if (!this.player || !this.running) return;

            this.player.activeSword = swordType;
            this.player.attack(swordType);

            // Visually highlight the active sword button
            var silverBtn = document.getElementById('silverSwordBtn');
            var ironBtn = document.getElementById('ironSwordBtn');
            if (swordType === 'silver') {
                if (silverBtn) silverBtn.style.transform = 'scale(1.1)';
                if (ironBtn) ironBtn.style.transform = 'scale(1)';
            } else {
                if (ironBtn) ironBtn.style.transform = 'scale(1.1)';
                if (silverBtn) silverBtn.style.transform = 'scale(1)';
            }

            // Update display
            var swordDisp = document.getElementById('activeSwordDisplay');
            if (swordDisp) {
                if (swordType === 'silver') {
                    swordDisp.textContent = 'Silver Sword';
                    swordDisp.style.color = '#aab0ff';
                } else {
                    swordDisp.textContent = 'Iron Sword';
                    swordDisp.style.color = '#ffaa44';
                }
            }
        }

        // -----------------------------------------------------------
        // addFloatingText
        // -----------------------------------------------------------

        addFloatingText(x, y, text, color) {
            this.floatingTexts.push({
                x: x,
                y: y,
                text: text,
                color: color || '#ffffff',
                life: 60,
                maxLife: 60,
                vy: -1.5
            });
        }

        updateFloatingTexts(dt) {
            var frameDt = dt * 60; // normalise to ~60fps frames
            for (var i = this.floatingTexts.length - 1; i >= 0; i--) {
                var ft = this.floatingTexts[i];
                ft.y += ft.vy * frameDt;
                ft.life -= frameDt;
                if (ft.life <= 0) {
                    this.floatingTexts.splice(i, 1);
                }
            }
        }

        drawFloatingTexts(ctx) {
            for (var i = 0; i < this.floatingTexts.length; i++) {
                var ft = this.floatingTexts[i];
                var alpha = Math.max(0, ft.life / ft.maxLife);
                ctx.save();
                ctx.globalAlpha = alpha;
                W.Draw.textPopup(ctx, ft.x, ft.y, ft.text, ft.color, 14);
                ctx.restore();
            }
        }

        // -----------------------------------------------------------
        // drawStoryTextOverlay
        // -----------------------------------------------------------

        drawStoryTextOverlay(ctx) {
            // Semi-transparent backdrop
            var alpha = Math.min(1, this.storyTextTimer / 30);
            ctx.fillStyle = 'rgba(0,0,0,' + (0.7 * alpha) + ')';
            ctx.fillRect(0, 0, W.CANVAS_W, W.CANVAS_H);

            ctx.save();
            ctx.globalAlpha = alpha;

            // Level title
            ctx.font = 'bold 32px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = W.Colors.WITCHER_GOLD;
            ctx.fillText(this._storyTitle || '', W.CANVAS_W / 2, W.CANVAS_H / 2 - 30);

            // Intro text
            ctx.font = '16px monospace';
            ctx.fillStyle = '#cccccc';
            var introText = this._storyText || '';
            // Simple word-wrap
            var words = introText.split(' ');
            var lines = [];
            var currentLine = '';
            for (var w = 0; w < words.length; w++) {
                var testLine = currentLine ? currentLine + ' ' + words[w] : words[w];
                if (ctx.measureText(testLine).width > W.CANVAS_W - 120) {
                    lines.push(currentLine);
                    currentLine = words[w];
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) lines.push(currentLine);

            for (var l = 0; l < lines.length; l++) {
                ctx.fillText(lines[l], W.CANVAS_W / 2, W.CANVAS_H / 2 + 20 + l * 24);
            }

            // "Press any key" hint
            if (this.storyTextTimer < 120) {
                ctx.font = '12px monospace';
                ctx.fillStyle = '#666';
                ctx.fillText('Press any key to continue...', W.CANVAS_W / 2, W.CANVAS_H / 2 + 20 + lines.length * 24 + 30);
            }

            ctx.restore();
        }

        // -----------------------------------------------------------
        // gameOver
        // -----------------------------------------------------------

        gameOver() {
            this.running = false;
            W.Mobile.hide();

            var overScreen = document.getElementById('gameOverScreen');
            var title = overScreen.querySelector('h2');
            if (title) {
                title.textContent = 'YOU DIED';
                title.style.color = '#cc2222';
                title.style.textShadow = '0 0 20px rgba(200, 0, 0, 0.5)';
            }

            var scoreEl = document.getElementById('finalScore');
            if (scoreEl) {
                scoreEl.textContent = 'Score: ' + (this.player ? this.player.score : 0);
            }

            overScreen.style.display = 'flex';

            // Keep drawing last frame so game over screen shows over game
            var self = this;
            this._gameOverDraw = function() {
                self.draw();
            };
            this._gameOverDraw();
        }

        // Respawn from checkpoint (same level, keep score)
        respawnFromCheckpoint() {
            if (!this.player) return;
            // Reset player state
            this.player.hp = this.player.maxHp;
            this.player.state = 'idle';
            this.player.vx = 0;
            this.player.vy = 0;
            this.player.invincible = false;
            // Move to checkpoint — only if it's for the current level
            var checkpointX = 100; // default: start of level
            if (this._checkpointLevel === this.currentLevelIndex && this._lastCheckpointX > 0) {
                checkpointX = this._lastCheckpointX;
            }
            this.player.x = checkpointX;
            this.player.y = W.GROUND_Y - this.player.h - 10;

            // Don't show story text on respawn
            this.showingStoryText = false;

            // Clear gore
            W.Gore.clear();

            // Respawn enemies
            this.enemies = [];
            this.projectiles = [];
            var storyData = W.StoryLevels[this.currentLevelIndex];
            if (storyData && storyData.enemies) {
                for (var i = 0; i < storyData.enemies.length; i++) {
                    var def = storyData.enemies[i];
                    // Only spawn enemies ahead of checkpoint
                    if (def.x >= checkpointX - 200) {
                        var enemy = W.createEnemy(def.type, def.x, def.y);
                        if (enemy) this.enemies.push(enemy);
                    }
                }
            }

            // Resume
            document.getElementById('gameOverScreen').style.display = 'none';
            W.Mobile.show();
            this.running = true;
            this.lastTime = 0;
            requestAnimationFrame(this._loopBound);
        }
    };

    // ---------------------------------------------------------------
    // Global setup
    // ---------------------------------------------------------------

    window.game = new W.Game();
    game.init();

})();
