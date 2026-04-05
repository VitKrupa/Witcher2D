(function() {
'use strict';

// Lovable color palette
var COLORS = {
    bg: '#080c12',
    bgMid: '#0d1219',
    bgGrad: '#121a24',
    wallDark: '#151a22',
    wallMid: '#1e252f',
    wallCrack: '#111820',
    vine: '#1e3a28',
    vineLight: '#2a5038',
    torchFlame: '#ff8c20',
    chainColor: '#555e6a',
    fog: '#1a2030'
};

// Seeded random for consistent decorations (matches Lovable)
function seededRandom(seed) {
    var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

W.DungeonRenderer = {

    // ---------------------------------------------------------------
    // drawBackground — parallax treeline, ruins, moon, stars, clouds
    // Renders in SCREEN SPACE (no camera transform applied yet)
    // ---------------------------------------------------------------
    drawBackground: function(ctx, cameraX, canvasW, canvasH) {
        // Deep background gradient
        var bgGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
        bgGrad.addColorStop(0, COLORS.bg);
        bgGrad.addColorStop(0.4, COLORS.bgMid);
        bgGrad.addColorStop(1, COLORS.bgGrad);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Far distant treeline silhouette
        ctx.fillStyle = '#0a0f15';
        for (var i = 0; i < 12; i++) {
            var x = i * 160 - (cameraX * 0.03) % 160;
            var treeH = 60 + seededRandom(i * 3) * 50;
            ctx.beginPath();
            ctx.moveTo(x, canvasH * 0.75);
            ctx.lineTo(x + 30, canvasH * 0.75 - treeH);
            ctx.lineTo(x + 40, canvasH * 0.75 - treeH * 0.6);
            ctx.lineTo(x + 55, canvasH * 0.75 - treeH * 0.9);
            ctx.lineTo(x + 70, canvasH * 0.75 - treeH * 0.5);
            ctx.lineTo(x + 90, canvasH * 0.75 - treeH * 0.8);
            ctx.lineTo(x + 120, canvasH * 0.75 - treeH * 0.4);
            ctx.lineTo(x + 160, canvasH * 0.75);
            ctx.fill();
        }

        // Mid-ground ruins silhouette
        ctx.fillStyle = '#0e141c';
        for (var i = 0; i < 6; i++) {
            var x = i * 320 - (cameraX * 0.06) % 320;
            var ruinH = 40 + seededRandom(i * 7 + 2) * 60;
            // Tower shapes
            ctx.fillRect(x + 20, canvasH * 0.8 - ruinH, 25, ruinH);
            ctx.fillRect(x + 15, canvasH * 0.8 - ruinH - 8, 35, 8);
            // Broken wall
            ctx.fillRect(x + 60, canvasH * 0.8 - ruinH * 0.5, 80, ruinH * 0.5);
            // Window holes
            ctx.fillStyle = '#060a10';
            ctx.fillRect(x + 28, canvasH * 0.8 - ruinH + 12, 8, 10);
            ctx.fillStyle = '#0e141c';
            // Arch
            ctx.fillRect(x + 150, canvasH * 0.8 - ruinH * 0.3, 15, ruinH * 0.3);
            ctx.fillRect(x + 200, canvasH * 0.8 - ruinH * 0.4, 15, ruinH * 0.4);
            ctx.fillRect(x + 150, canvasH * 0.8 - ruinH * 0.3 - 6, 65, 6);
        }

        // Moon with glow
        var moonX = canvasW * 0.75 - cameraX * 0.015;
        var moonY = 55;
        // Moon glow
        var moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80);
        moonGlow.addColorStop(0, 'rgba(192,192,192,0.094)');
        moonGlow.addColorStop(0.3, 'rgba(192,192,192,0.039)');
        moonGlow.addColorStop(1, 'rgba(192,192,192,0)');
        ctx.fillStyle = moonGlow;
        ctx.fillRect(moonX - 80, moonY - 80, 160, 160);

        // Moon body (crescent)
        ctx.fillStyle = 'rgba(192,192,192,0.145)';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = COLORS.bg;
        ctx.beginPath();
        ctx.arc(moonX + 7, moonY - 4, 19, 0, Math.PI * 2);
        ctx.fill();

        // Stars with twinkle
        var time = (typeof W.gameTime === 'number') ? W.gameTime : Date.now() * 0.001;
        for (var i = 0; i < 50; i++) {
            var sx = (i * 137.5 + 50) % canvasW;
            var sy = (i * 73.1 + 10) % (canvasH * 0.5);
            var twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * (1 + seededRandom(i) * 2) + i));
            var size = 0.8 + seededRandom(i * 3) * 1.2;
            ctx.globalAlpha = twinkle * 0.15;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx, sy, size, size);
        }
        ctx.globalAlpha = 1;

        // Distant clouds / mist
        ctx.fillStyle = 'rgba(26,32,48,0.039)';
        for (var i = 0; i < 5; i++) {
            var cx = (i * 280 + time * 3 - cameraX * 0.04) % (canvasW + 200) - 100;
            var cy = 40 + seededRandom(i * 11) * 80;
            var cw = 120 + seededRandom(i * 13) * 100;
            var ch = 15 + seededRandom(i * 5) * 10;
            ctx.beginPath();
            ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    // ---------------------------------------------------------------
    // drawWalls — stone tile grid across entire visible canvas
    // Renders in WORLD SPACE (camera transform already applied)
    // Stone size: 64x48, crack probability ~15%, moss ~10%
    // ---------------------------------------------------------------
    drawWalls: function(ctx, cameraX, canvasW, canvasH) {
        var startX = Math.floor(cameraX / 64) * 64;
        var endX = startX + canvasW + 128;

        // Back wall with varied stones
        for (var x = startX; x < endX; x += 64) {
            for (var y = 200; y < canvasH + cameraX * 0 + 500; y += 48) {
                var seed = x * 100 + y;
                var shade = 0.7 + seededRandom(seed) * 0.3;
                var r = Math.floor(20 * shade);
                var g = Math.floor(28 * shade);
                var b = Math.floor(38 * shade);
                ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                ctx.fillRect(x, y, 64, 48);

                // Mortar lines
                ctx.fillStyle = COLORS.wallDark;
                ctx.fillRect(x, y, 64, 1);
                ctx.fillRect(x, y, 1, 48);

                // Random cracks (~15%)
                if (seededRandom(seed + 1) > 0.85) {
                    ctx.strokeStyle = COLORS.wallCrack;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x + 10 + seededRandom(seed + 2) * 40, y + 5);
                    ctx.lineTo(x + 20 + seededRandom(seed + 3) * 30, y + 25);
                    ctx.lineTo(x + 15 + seededRandom(seed + 4) * 35, y + 42);
                    ctx.stroke();
                }

                // Moss patches (~10%)
                if (seededRandom(seed + 5) > 0.9) {
                    ctx.fillStyle = 'rgba(30,58,40,0.376)';
                    ctx.fillRect(x + 5, y + 2, 12 + seededRandom(seed + 6) * 15, 6);
                }
            }
        }
    },

    // ---------------------------------------------------------------
    // drawDecorations — torches, chains, vines, skulls
    // Renders in WORLD SPACE
    // ---------------------------------------------------------------
    drawDecorations: function(ctx, cameraX, canvasW, canvasH) {
        var time = (typeof W.gameTime === 'number') ? W.gameTime : Date.now() * 0.001;
        var startX = Math.floor(cameraX / 200) * 200;
        var endX = startX + canvasW + 400;

        for (var x = startX; x < endX; x += 200) {
            var seed = Math.floor(x / 200);
            var type = seededRandom(seed) > 0.5 ? 'torch' : 'chain';

            if (type === 'torch') {
                this._drawTorch(ctx, x + 50 + seededRandom(seed + 1) * 80, 300 + seededRandom(seed + 2) * 80, time);
            } else {
                this._drawChain(ctx, x + 30 + seededRandom(seed + 3) * 100, 200, 60 + seededRandom(seed + 4) * 40);
            }

            // Additional hanging vines
            if (seededRandom(seed + 10) > 0.6) {
                this._drawVines(ctx, x + 100 + seededRandom(seed + 11) * 60, 200);
            }

            // Skull decoration
            if (seededRandom(seed + 20) > 0.8) {
                this._drawSkull(ctx, x + 140, 390 + seededRandom(seed + 21) * 20);
            }
        }
    },

    // ---------------------------------------------------------------
    // drawGroundFog — fog patches at floor level
    // Renders in WORLD SPACE
    // ---------------------------------------------------------------
    drawGroundFog: function(ctx, cameraX, canvasW, canvasH) {
        var time = (typeof W.gameTime === 'number') ? W.gameTime : Date.now() * 0.001;
        var startX = cameraX - 50;
        var endX = cameraX + canvasW + 50;

        for (var i = 0; i < 12; i++) {
            var fogX = startX + (i * 110 + Math.sin(time * 0.3 + i) * 30);
            if (fogX > endX) continue;
            var fogY = 410 + Math.sin(time * 0.5 + i * 1.3) * 8;
            var fogW = 80 + seededRandom(i * 17) * 60;

            var fogGrad = ctx.createRadialGradient(fogX + fogW / 2, fogY, 0, fogX + fogW / 2, fogY, fogW / 2);
            fogGrad.addColorStop(0, 'rgba(42,58,80,0.082)');
            fogGrad.addColorStop(0.5, 'rgba(26,42,64,0.063)');
            fogGrad.addColorStop(1, 'rgba(26,42,64,0)');
            ctx.fillStyle = fogGrad;
            ctx.fillRect(fogX, fogY - fogW / 2, fogW, fogW);
        }
    },

    // ---------------------------------------------------------------
    // drawForegroundFog — vignette/atmosphere overlay
    // Renders in WORLD SPACE (uses camera coords for positioning)
    // ---------------------------------------------------------------
    drawForegroundFog: function(ctx, cameraX, cameraY, canvasW, canvasH) {
        // Top darkness vignette
        var topGrad = ctx.createLinearGradient(0, cameraY, 0, cameraY + 80);
        topGrad.addColorStop(0, 'rgba(8,12,18,0.5)');
        topGrad.addColorStop(1, 'rgba(8,12,18,0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(cameraX, cameraY, canvasW, 80);

        // Bottom subtle fog
        var botGrad = ctx.createLinearGradient(0, cameraY + canvasH - 40, 0, cameraY + canvasH);
        botGrad.addColorStop(0, 'rgba(10,14,20,0)');
        botGrad.addColorStop(1, 'rgba(10,14,20,0.251)');
        ctx.fillStyle = botGrad;
        ctx.fillRect(cameraX, cameraY + canvasH - 40, canvasW, 40);
    },

    // ---------------------------------------------------------------
    // _drawTorch — multi-layer flame with glow (Lovable faithful port)
    // ---------------------------------------------------------------
    _drawTorch: function(ctx, x, y, time) {
        // Bracket
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(x - 2, y - 20, 4, 25);
        ctx.fillRect(x - 6, y - 22, 12, 4);

        // Flame glow on wall
        var glowR = 50 + Math.sin(time * 6) * 8;
        var glow = ctx.createRadialGradient(x, y - 25, 0, x, y - 25, glowR);
        glow.addColorStop(0, 'rgba(255,136,0,0.125)');
        glow.addColorStop(0.4, 'rgba(255,102,0,0.063)');
        glow.addColorStop(1, 'rgba(255,102,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(x - glowR, y - 25 - glowR, glowR * 2, glowR * 2);

        // Flame flicker
        var flicker1 = Math.sin(time * 8 + x) * 2;
        var flicker2 = Math.cos(time * 11 + x) * 1.5;

        // Outer flame
        ctx.fillStyle = 'rgba(255,68,0,0.376)';
        ctx.beginPath();
        ctx.moveTo(x - 5, y - 20);
        ctx.quadraticCurveTo(x + flicker1, y - 38 + flicker2, x + 1, y - 20);
        ctx.fill();

        // Inner flame
        ctx.fillStyle = 'rgba(255,140,32,0.565)';
        ctx.beginPath();
        ctx.moveTo(x - 3, y - 20);
        ctx.quadraticCurveTo(x + flicker1 * 0.5, y - 32 + flicker2, x + 1, y - 20);
        ctx.fill();

        // Bright core
        ctx.fillStyle = 'rgba(255,204,68,0.565)';
        ctx.beginPath();
        ctx.moveTo(x - 1.5, y - 20);
        ctx.quadraticCurveTo(x, y - 26 + flicker2 * 0.5, x + 1, y - 20);
        ctx.fill();

        // Embers
        var savedAlpha = ctx.globalAlpha;
        for (var i = 0; i < 3; i++) {
            var ex = x + Math.sin(time * 3 + i * 2 + x) * 6;
            var emberPhase = (time * 15 + i * 7 + x) % 20;
            var ey = y - 30 - emberPhase;
            var eAlpha = (1 - emberPhase / 20) * 0.6;
            ctx.globalAlpha = Math.max(0, eAlpha);
            ctx.fillStyle = '#ffaa22';
            ctx.fillRect(ex, ey, 1.5, 1.5);
        }
        ctx.globalAlpha = savedAlpha;
    },

    // ---------------------------------------------------------------
    // _drawChain — elliptical links with alternating colors
    // ---------------------------------------------------------------
    _drawChain: function(ctx, x, startY, length) {
        ctx.lineWidth = 2;
        for (var i = 0; i < length; i += 8) {
            ctx.strokeStyle = i % 16 < 8 ? COLORS.chainColor : '#4a5360';
            ctx.beginPath();
            ctx.ellipse(x, startY + i + 4, 2, 4, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    },

    // ---------------------------------------------------------------
    // _drawVines — curved stems with leaves
    // ---------------------------------------------------------------
    _drawVines: function(ctx, x, startY) {
        ctx.strokeStyle = COLORS.vine;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.quadraticCurveTo(x + 8, startY + 30, x - 3, startY + 60);
        ctx.quadraticCurveTo(x + 5, startY + 80, x, startY + 100);
        ctx.stroke();

        // Leaves
        ctx.fillStyle = 'rgba(42,80,56,0.502)';
        ctx.beginPath();
        ctx.ellipse(x + 5, startY + 35, 5, 3, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x - 4, startY + 65, 4, 3, -0.3, 0, Math.PI * 2);
        ctx.fill();
    },

    // ---------------------------------------------------------------
    // _drawSkull — skull decoration
    // ---------------------------------------------------------------
    _drawSkull: function(ctx, x, y) {
        // Cranium
        ctx.fillStyle = 'rgba(192,184,168,0.125)';
        ctx.beginPath();
        ctx.arc(x, y - 4, 5, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(x - 5, y - 4, 10, 5);
        // Eyes
        ctx.fillStyle = 'rgba(10,10,10,0.376)';
        ctx.fillRect(x - 3, y - 4, 2, 2);
        ctx.fillRect(x + 1, y - 4, 2, 2);
        // Jaw
        ctx.fillStyle = 'rgba(192,184,168,0.082)';
        ctx.fillRect(x - 3, y + 1, 6, 2);
    }
};

})();
