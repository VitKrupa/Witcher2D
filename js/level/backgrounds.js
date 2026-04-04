(function() {
'use strict';

var CW = 960, CH = 540;

function seededRand(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

W.Backgrounds = {

    village: function(ctx, cameraX) {
        var t = Date.now() * 0.001;
        var far = cameraX * 0.1, mid = cameraX * 0.3, near = cameraX * 0.6;

        // --- SKY GRADIENT ---
        var sky = ctx.createLinearGradient(0, 0, 0, CH);
        sky.addColorStop(0, '#2a3050');
        sky.addColorStop(0.3, '#4a506a');
        sky.addColorStop(0.6, '#7a6a5a');
        sky.addColorStop(1, '#aa8866');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, CW, CH);

        // --- LAYERED CLOUDS (far, animated drift) ---
        ctx.save();
        for (var c = 0; c < 6; c++) {
            var cx = ((c * 220 + t * 4) % (CW + 300)) - 150 - far * 0.2;
            var cy = 50 + c * 25 + Math.sin(c * 1.5) * 15;
            ctx.fillStyle = 'rgba(180,170,160,' + (0.15 + c * 0.02) + ')';
            ctx.beginPath();
            ctx.arc(cx, cy, 40 + c * 5, 0, Math.PI * 2);
            ctx.arc(cx + 35, cy - 8, 30 + c * 3, 0, Math.PI * 2);
            ctx.arc(cx + 60, cy, 35 + c * 4, 0, Math.PI * 2);
            ctx.arc(cx - 25, cy + 3, 28 + c * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // --- DISTANT ROLLING HILLS with trees (far layer) ---
        ctx.fillStyle = '#2a3028';
        for (var i = -1; i < 5; i++) {
            var hx = i * 400 - (far % 400);
            ctx.beginPath();
            ctx.moveTo(hx, 340);
            ctx.quadraticCurveTo(hx + 100, 290 + Math.sin(i * 2) * 15, hx + 200, 310);
            ctx.quadraticCurveTo(hx + 300, 280 + Math.cos(i * 3) * 10, hx + 400, 340);
            ctx.lineTo(hx + 400, CH);
            ctx.lineTo(hx, CH);
            ctx.fill();
        }
        // Trees on hills
        ctx.fillStyle = '#1e2820';
        for (var i = 0; i < 12; i++) {
            var tx = (i * 127 + 30) - (far % 300);
            var ty = 310 + Math.sin(i * 1.7) * 15;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx + 8, ty - 30 - (i % 3) * 8);
            ctx.lineTo(tx + 16, ty);
            ctx.fill();
            ctx.fillRect(tx + 6, ty, 4, 8);
        }

        // --- MID LAYER: houses with peaked roofs ---
        for (var i = -1; i < 7; i++) {
            var bx = i * 180 - (mid % 180);
            var bw = 55 + (i % 3) * 15;
            var bh = 50 + (i % 2) * 20;
            var by = 370 - bh;

            // House body
            ctx.fillStyle = '#3a3028';
            ctx.fillRect(bx + 20, by, bw, bh);

            // Peaked roof
            ctx.fillStyle = '#2a1a14';
            ctx.beginPath();
            ctx.moveTo(bx + 12, by);
            ctx.lineTo(bx + 20 + bw / 2, by - 25);
            ctx.lineTo(bx + 28 + bw, by);
            ctx.fill();

            // Chimney
            ctx.fillStyle = '#4a3828';
            var chimX = bx + 30 + (i % 2) * 25;
            ctx.fillRect(chimX, by - 30, 8, 20);

            // Animated smoke wisps from chimney
            for (var s = 0; s < 4; s++) {
                var smokeY = by - 32 - s * 18 - ((t * 12 + i * 5) % 30);
                var smokeX = chimX + 4 + Math.sin(t * 0.8 + s * 1.2 + i) * 6;
                var smokeAlpha = 0.25 - s * 0.05;
                if (smokeAlpha > 0) {
                    ctx.fillStyle = 'rgba(120,110,100,' + smokeAlpha + ')';
                    ctx.beginPath();
                    ctx.arc(smokeX, smokeY, 4 + s * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Windows (some glowing warm yellow)
            var winGlow = (i % 3 !== 0);
            ctx.fillStyle = winGlow ? '#ddaa44' : '#1a1410';
            ctx.fillRect(bx + 30, by + 12, 9, 11);
            ctx.fillRect(bx + 45, by + 12, 9, 11);
            if (winGlow) {
                ctx.fillStyle = 'rgba(221,170,68,0.15)';
                ctx.beginPath();
                ctx.arc(bx + 40, by + 18, 20, 0, Math.PI * 2);
                ctx.fill();
            }

            // Door
            ctx.fillStyle = '#1a1208';
            ctx.fillRect(bx + 36, by + bh - 18, 12, 18);
        }

        // --- WELL with bucket ---
        var wellX = 300 - (mid % 180);
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(wellX, 365, 30, 20);
        ctx.fillRect(wellX + 5, 365, 20, -3);
        // Posts
        ctx.fillRect(wellX + 2, 345, 3, 20);
        ctx.fillRect(wellX + 25, 345, 3, 20);
        // Crossbar
        ctx.fillRect(wellX, 345, 30, 2);
        // Bucket
        ctx.fillStyle = '#4a3a2a';
        ctx.fillRect(wellX + 12, 350, 8, 6);
        // Rope
        ctx.fillStyle = '#6a5a4a';
        ctx.fillRect(wellX + 15, 346, 1, 5);

        // --- HAYSTACKS ---
        for (var h = 0; h < 3; h++) {
            var hsx = 80 + h * 260 - (mid % 180);
            ctx.fillStyle = '#8a7a40';
            ctx.beginPath();
            ctx.arc(hsx, 380, 15, Math.PI, 0);
            ctx.lineTo(hsx + 15, 385);
            ctx.lineTo(hsx - 15, 385);
            ctx.fill();
        }

        // --- BARRELS ---
        for (var b = 0; b < 4; b++) {
            var barX = 500 + b * 140 - (mid % 180);
            ctx.fillStyle = '#5a3a1a';
            ctx.fillRect(barX, 370, 14, 16);
            ctx.fillStyle = '#3a2a10';
            ctx.fillRect(barX - 1, 373, 16, 2);
            ctx.fillRect(barX - 1, 380, 16, 2);
        }

        // --- WOODEN CART ---
        var cartX = 650 - (mid % 180);
        ctx.fillStyle = '#5a4020';
        ctx.fillRect(cartX, 366, 40, 14);
        ctx.fillStyle = '#4a3018';
        ctx.beginPath();
        ctx.arc(cartX + 8, 382, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cartX + 32, 382, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3a2010';
        ctx.beginPath();
        ctx.arc(cartX + 8, 382, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cartX + 32, 382, 3, 0, Math.PI * 2);
        ctx.fill();

        // --- CROW silhouette flying across (animated) ---
        var crowX = ((t * 35) % (CW + 200)) - 100;
        var crowY = 100 + Math.sin(t * 2) * 20;
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.moveTo(crowX, crowY);
        ctx.lineTo(crowX - 8, crowY - 5 - Math.sin(t * 8) * 3);
        ctx.lineTo(crowX - 3, crowY);
        ctx.lineTo(crowX + 3, crowY);
        ctx.lineTo(crowX + 8, crowY - 5 - Math.sin(t * 8 + 1) * 3);
        ctx.fill();

        // --- NEAR: fence posts, lantern, grass ---
        ctx.fillStyle = '#5a4a30';
        for (var f = 0; f < 25; f++) {
            var fx = f * 50 - (near % 50);
            ctx.fillRect(fx, 400, 4, 25);
            if (f % 2 === 0) {
                ctx.fillRect(fx, 410, 50, 2);
                ctx.fillRect(fx, 418, 50, 2);
            }
            // Pointed top
            ctx.beginPath();
            ctx.moveTo(fx, 400);
            ctx.lineTo(fx + 2, 395);
            ctx.lineTo(fx + 4, 400);
            ctx.fill();
        }

        // Hanging lantern
        var lanX = 480 - (near % 50);
        ctx.fillStyle = '#5a4a30';
        ctx.fillRect(lanX, 395, 1, 8);
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(lanX - 3, 403, 7, 9);
        // Lantern glow
        var glowAlpha = 0.12 + Math.sin(t * 3) * 0.04;
        ctx.fillStyle = 'rgba(255,200,80,' + glowAlpha + ')';
        ctx.beginPath();
        ctx.arc(lanX, 407, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffcc55';
        ctx.fillRect(lanX - 1, 405, 3, 5);

        // Cobblestone hints
        ctx.fillStyle = 'rgba(60,55,45,0.3)';
        for (var cb = 0; cb < 30; cb++) {
            var cbx = cb * 38 + (cb % 2) * 12 - (near % 38);
            ctx.fillRect(cbx, 430 + (cb % 3) * 3, 16, 8);
        }

        // Grass tufts
        ctx.fillStyle = '#3a5a20';
        for (var g = 0; g < 20; g++) {
            var gx = g * 55 + 10 - (near % 55);
            var sway = Math.sin(t * 1.5 + g * 0.8) * 2;
            ctx.beginPath();
            ctx.moveTo(gx, 425);
            ctx.lineTo(gx + 2 + sway, 412);
            ctx.lineTo(gx + 4, 425);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(gx + 5, 425);
            ctx.lineTo(gx + 8 + sway, 410);
            ctx.lineTo(gx + 10, 425);
            ctx.fill();
        }

        // Ground fill
        ctx.fillStyle = '#2a2a1a';
        ctx.fillRect(0, 435, CW, CH - 435);
    },


    swamp: function(ctx, cameraX) {
        var t = Date.now() * 0.001;
        var far = cameraX * 0.1, mid = cameraX * 0.3, near = cameraX * 0.6;

        // --- SICKLY SKY ---
        var sky = ctx.createLinearGradient(0, 0, 0, CH);
        sky.addColorStop(0, '#0a0e08');
        sky.addColorStop(0.4, '#1a2a14');
        sky.addColorStop(0.7, '#2a3a1e');
        sky.addColorStop(1, '#1a2818');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, CW, CH);

        // --- ROLLING FOG (far, multiple layers) ---
        for (var fl = 0; fl < 3; fl++) {
            var fogSpeed = (fl + 1) * 6;
            var fogAlpha = 0.06 + fl * 0.03;
            ctx.fillStyle = 'rgba(50,70,40,' + fogAlpha + ')';
            for (var fi = -1; fi < 6; fi++) {
                var fogX = fi * 250 - ((t * fogSpeed + far * 0.3) % 250);
                var fogY = 300 + fl * 50 + Math.sin(t * 0.3 + fi + fl) * 12;
                ctx.beginPath();
                ctx.arc(fogX + 125, fogY, 140, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // --- TWISTED GNARLED TREES with roots and moss (mid) ---
        for (var i = -1; i < 9; i++) {
            var tx = i * 140 - (mid % 140);
            var treeH = 140 + (i % 3) * 30;

            // Trunk (thick, gnarled)
            ctx.fillStyle = '#1a1608';
            ctx.beginPath();
            ctx.moveTo(tx + 60, 420);
            ctx.quadraticCurveTo(tx + 55 + Math.sin(i) * 5, 350, tx + 65, 420 - treeH);
            ctx.lineTo(tx + 75, 420 - treeH);
            ctx.quadraticCurveTo(tx + 80 + Math.cos(i) * 4, 350, tx + 74, 420);
            ctx.fill();

            // Visible roots
            ctx.fillStyle = '#1a1608';
            for (var r = 0; r < 3; r++) {
                var rootAngle = -0.5 + r * 0.5;
                ctx.save();
                ctx.translate(tx + 67, 418);
                ctx.rotate(rootAngle);
                ctx.fillRect(0, 0, 25 + r * 8, 4);
                ctx.restore();
            }

            // Branches
            for (var b = 0; b < 4; b++) {
                var bAngle = -0.8 + b * 0.4 + Math.sin(i + b) * 0.2;
                var bLen = 30 + b * 8;
                var by = 420 - treeH + 15 + b * 22;
                ctx.save();
                ctx.translate(tx + 67, by);
                ctx.rotate(bAngle);
                ctx.fillStyle = '#1a1608';
                ctx.fillRect(0, -2, bLen, 4);
                ctx.restore();

                // Hanging moss strings
                ctx.fillStyle = '#2a4a1a';
                for (var m = 0; m < 3; m++) {
                    var mx = tx + 67 + Math.cos(bAngle) * (10 + m * 10);
                    var my = by + Math.sin(bAngle) * (10 + m * 10);
                    var mossLen = 12 + m * 6 + Math.sin(t * 0.5 + m + i) * 3;
                    ctx.fillRect(mx, my, 1, mossLen);
                }
            }
        }

        // --- DEAD ANIMAL BONES ---
        ctx.fillStyle = '#8a8a70';
        for (var bn = 0; bn < 5; bn++) {
            var bnx = 100 + bn * 210 - (mid % 210);
            // Ribcage hint
            ctx.fillRect(bnx, 430, 18, 2);
            ctx.fillRect(bnx + 3, 428, 2, 6);
            ctx.fillRect(bnx + 8, 427, 2, 7);
            ctx.fillRect(bnx + 13, 428, 2, 6);
            // Skull
            ctx.beginPath();
            ctx.arc(bnx - 3, 430, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- FALLEN LOG ---
        var logX = 400 - (mid % 200);
        ctx.fillStyle = '#2a2010';
        ctx.fillRect(logX, 420, 60, 10);
        ctx.beginPath();
        ctx.arc(logX + 60, 425, 5, 0, Math.PI * 2);
        ctx.fill();
        // Rings on log end
        ctx.strokeStyle = '#3a3020';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(logX + 60, 425, 3, 0, Math.PI * 2);
        ctx.stroke();

        // --- MUSHROOM CLUSTERS ---
        for (var mc = 0; mc < 6; mc++) {
            var msx = 50 + mc * 175 - (mid % 175);
            ctx.fillStyle = '#6a3020';
            ctx.fillRect(msx, 425, 2, 8);
            ctx.fillRect(msx + 6, 423, 2, 10);
            ctx.fillRect(msx + 11, 426, 2, 7);
            // Caps
            ctx.fillStyle = '#8a4030';
            ctx.beginPath();
            ctx.arc(msx + 1, 425, 5, Math.PI, 0);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(msx + 7, 423, 6, Math.PI, 0);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(msx + 12, 426, 4, Math.PI, 0);
            ctx.fill();
        }

        // --- CATTAILS / REEDS waving ---
        ctx.fillStyle = '#3a4a20';
        for (var ct = 0; ct < 15; ct++) {
            var ctX = ct * 72 + 20 - (near % 72);
            var sway = Math.sin(t * 1.2 + ct * 0.7) * 4;
            ctx.fillRect(ctX + sway * 0.3, 390, 2, 45);
            // Cattail head
            ctx.fillStyle = '#4a3a18';
            ctx.fillRect(ctX - 1 + sway * 0.3, 390, 4, 10);
            ctx.fillStyle = '#3a4a20';
        }

        // --- ANIMATED BUBBLES popping in water ---
        for (var bb = 0; bb < 8; bb++) {
            var bubPhase = (t * 0.7 + bb * 1.3) % 3.0;
            var bubX = 80 + bb * 120 - (mid % 120);
            var bubY = 445 - bubPhase * 8;
            var bubR = bubPhase < 2.5 ? 1 + bubPhase * 1.2 : (3.0 - bubPhase) * 8;
            var bubAlpha = bubPhase < 2.5 ? 0.4 : (3.0 - bubPhase) * 0.8;
            ctx.fillStyle = 'rgba(80,120,70,' + bubAlpha + ')';
            ctx.beginPath();
            ctx.arc(bubX, bubY, Math.max(0.5, bubR), 0, Math.PI * 2);
            ctx.fill();
        }

        // --- GLOWING FUNGI on tree trunks (pulsing) ---
        for (var gf = 0; gf < 12; gf++) {
            var gfx = (gf * 140 + 75) - (mid % 140);
            var gfy = 340 + (gf % 4) * 20;
            var pulse = 0.3 + Math.sin(t * 2 + gf * 1.1) * 0.2;
            // Glow
            ctx.fillStyle = 'rgba(50,255,120,' + (pulse * 0.3) + ')';
            ctx.beginPath();
            ctx.arc(gfx, gfy, 12, 0, Math.PI * 2);
            ctx.fill();
            // Fungus body
            ctx.fillStyle = 'rgba(50,255,120,' + pulse + ')';
            ctx.beginPath();
            ctx.arc(gfx, gfy, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- FIREFLIES with sine wave paths ---
        for (var ff = 0; ff < 14; ff++) {
            var ffx = (ff * 83 + Math.sin(t * 0.4 + ff * 2.1) * 50) % CW;
            var ffy = 250 + Math.sin(t * 0.6 + ff * 1.7) * 60 + ff * 12;
            var ffAlpha = 0.3 + Math.sin(t * 3 + ff * 0.9) * 0.3;
            ctx.fillStyle = 'rgba(255,255,100,' + Math.max(0, ffAlpha) + ')';
            ctx.beginPath();
            ctx.arc(ffx, ffy, 2, 0, Math.PI * 2);
            ctx.fill();
            // Glow around firefly
            ctx.fillStyle = 'rgba(255,255,100,' + Math.max(0, ffAlpha * 0.2) + ')';
            ctx.beginPath();
            ctx.arc(ffx, ffy, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- WATER SURFACE ---
        ctx.fillStyle = 'rgba(20,40,20,0.5)';
        ctx.fillRect(0, 440, CW, CH - 440);
    },


    castle: function(ctx, cameraX) {
        var t = Date.now() * 0.001;
        var far = cameraX * 0.1, mid = cameraX * 0.3, near = cameraX * 0.6;

        // --- DARK INTERIOR ---
        ctx.fillStyle = '#0c0c14';
        ctx.fillRect(0, 0, CW, CH);

        // --- STONE WALL with brick texture (alternating rows) ---
        var wallOff = cameraX * 0.15;
        for (var by = 0; by < CH; by += 22) {
            var rowOffset = (Math.floor(by / 22) % 2) * 22;
            for (var bx = -44; bx < CW + 44; bx += 44) {
                var shade = 18 + seededRand(bx * 7 + by * 13) * 8;
                ctx.fillStyle = 'rgb(' + shade + ',' + shade + ',' + (shade + 6) + ')';
                ctx.fillRect(bx - (wallOff % 44) + rowOffset, by, 42, 20);
            }
        }
        // Mortar lines (slightly lighter)
        ctx.fillStyle = 'rgba(30,30,40,0.5)';
        for (var by = 0; by < CH; by += 22) {
            ctx.fillRect(0, by + 20, CW, 2);
        }

        // --- ARCHED DOORWAYS ---
        for (var d = 0; d < 3; d++) {
            var dx = 150 + d * 350 - (mid % 350);
            ctx.fillStyle = '#060610';
            ctx.fillRect(dx, 280, 50, 120);
            ctx.beginPath();
            ctx.arc(dx + 25, 280, 25, Math.PI, 0);
            ctx.fill();
            // Arch stones
            ctx.strokeStyle = '#2a2a30';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(dx + 25, 280, 27, Math.PI, 0);
            ctx.stroke();
        }

        // --- TALL WINDOWS with moonlight beams ---
        for (var w = -1; w < 5; w++) {
            var wx = w * 260 - (mid % 260);
            // Window frame
            ctx.fillStyle = '#0a1030';
            ctx.fillRect(wx + 100, 60, 35, 80);
            ctx.beginPath();
            ctx.arc(wx + 117, 60, 17, Math.PI, 0);
            ctx.fill();
            // Moonlight color inside
            ctx.fillStyle = '#1a2050';
            ctx.fillRect(wx + 103, 65, 29, 72);
            // Cross divider
            ctx.fillStyle = '#1a1a20';
            ctx.fillRect(wx + 116, 60, 3, 80);
            ctx.fillRect(wx + 100, 95, 35, 3);

            // Moonlight BEAM (angled transparent rectangle)
            ctx.fillStyle = 'rgba(60,70,120,0.06)';
            ctx.beginPath();
            ctx.moveTo(wx + 100, 140);
            ctx.lineTo(wx + 60, CH);
            ctx.lineTo(wx + 180, CH);
            ctx.lineTo(wx + 135, 140);
            ctx.fill();
            // Inner brighter beam
            ctx.fillStyle = 'rgba(80,90,150,0.04)';
            ctx.beginPath();
            ctx.moveTo(wx + 108, 140);
            ctx.lineTo(wx + 85, CH);
            ctx.lineTo(wx + 155, CH);
            ctx.lineTo(wx + 127, 140);
            ctx.fill();
        }

        // --- HANGING CHAINS ---
        for (var ch = 0; ch < 6; ch++) {
            var chx = ch * 180 + 50 - (mid % 180);
            var chainLen = 60 + (ch % 3) * 30;
            ctx.strokeStyle = '#3a3a40';
            ctx.lineWidth = 2;
            for (var cl = 0; cl < chainLen; cl += 8) {
                ctx.beginPath();
                ctx.arc(chx + (cl % 2) * 2, cl, 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        // --- TORCHES with animated flames, glow, embers ---
        for (var ti = -1; ti < 7; ti++) {
            var torchX = ti * 170 - (mid % 170) + 85;
            var torchY = 230;

            // Bracket
            ctx.fillStyle = '#4a4a50';
            ctx.fillRect(torchX - 1, torchY, 6, 18);
            ctx.fillRect(torchX - 5, torchY, 14, 4);

            // Warm glow circle
            var glowPulse = 0.08 + Math.sin(t * 4 + ti * 2) * 0.03;
            ctx.fillStyle = 'rgba(220,140,40,' + glowPulse + ')';
            ctx.beginPath();
            ctx.arc(torchX + 2, torchY - 8, 55 + Math.sin(t * 3 + ti) * 5, 0, Math.PI * 2);
            ctx.fill();

            // Flame (3-4 flickering shapes)
            var flicker = Math.sin(t * 10 + ti * 3);
            var flicker2 = Math.cos(t * 12 + ti * 5);
            // Outer flame
            ctx.fillStyle = '#cc5500';
            ctx.beginPath();
            ctx.moveTo(torchX - 4, torchY);
            ctx.quadraticCurveTo(torchX + 2 + flicker * 3, torchY - 20, torchX + 8, torchY);
            ctx.fill();
            // Mid flame
            ctx.fillStyle = '#ff8822';
            ctx.beginPath();
            ctx.moveTo(torchX - 2, torchY);
            ctx.quadraticCurveTo(torchX + 2 + flicker2 * 2, torchY - 15, torchX + 6, torchY);
            ctx.fill();
            // Inner flame
            ctx.fillStyle = '#ffcc44';
            ctx.beginPath();
            ctx.moveTo(torchX, torchY);
            ctx.quadraticCurveTo(torchX + 2 + flicker * 1.5, torchY - 10, torchX + 4, torchY);
            ctx.fill();
            // Core
            ctx.fillStyle = '#ffffaa';
            ctx.fillRect(torchX + 1, torchY - 4, 2, 4);

            // Embers / sparks rising
            for (var e = 0; e < 5; e++) {
                var emberPhase = (t * 1.5 + e * 0.7 + ti * 0.4) % 2.5;
                var ex = torchX + 2 + Math.sin(t * 2 + e * 1.5 + ti) * (3 + emberPhase * 4);
                var ey = torchY - 10 - emberPhase * 35;
                var eAlpha = Math.max(0, 0.8 - emberPhase * 0.35);
                ctx.fillStyle = 'rgba(255,' + Math.floor(150 + e * 20) + ',30,' + eAlpha + ')';
                ctx.fillRect(ex, ey, 2, 2);
            }
        }

        // --- SUIT OF ARMOR silhouettes ---
        for (var a = 0; a < 3; a++) {
            var ax = 80 + a * 350 - (mid % 350);
            ctx.fillStyle = '#16161e';
            // Head
            ctx.beginPath();
            ctx.arc(ax + 15, 320, 8, 0, Math.PI * 2);
            ctx.fill();
            // Body
            ctx.fillRect(ax + 7, 328, 16, 35);
            // Shoulders
            ctx.fillRect(ax, 328, 30, 5);
            // Legs
            ctx.fillRect(ax + 9, 363, 5, 25);
            ctx.fillRect(ax + 17, 363, 5, 25);
            // Sword
            ctx.fillStyle = '#2a2a35';
            ctx.fillRect(ax + 28, 330, 2, 40);
            ctx.fillRect(ax + 25, 330, 8, 2);
        }

        // --- BANNERS / TAPESTRIES ---
        for (var bn = 0; bn < 4; bn++) {
            var bnx = bn * 250 + 120 - (mid % 250);
            var bannerSway = Math.sin(t * 0.5 + bn) * 3;
            ctx.fillStyle = '#3a1018';
            ctx.beginPath();
            ctx.moveTo(bnx, 50);
            ctx.lineTo(bnx + 22, 50);
            ctx.lineTo(bnx + 22 + bannerSway, 120);
            ctx.lineTo(bnx + 11 + bannerSway, 110);
            ctx.lineTo(bnx + bannerSway, 120);
            ctx.fill();
            // Trim
            ctx.fillStyle = '#5a3020';
            ctx.fillRect(bnx - 2, 48, 26, 4);
            // Pattern
            ctx.fillStyle = '#4a1a22';
            ctx.fillRect(bnx + 8 + bannerSway * 0.3, 70, 6, 6);
        }

        // --- COBWEBS (thin lines) ---
        ctx.strokeStyle = 'rgba(80,80,90,0.2)';
        ctx.lineWidth = 1;
        for (var cw = 0; cw < 4; cw++) {
            var cwx = cw * 280 + 20 - (far % 280);
            ctx.beginPath();
            ctx.moveTo(cwx, 0);
            ctx.lineTo(cwx + 40, 30);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cwx, 0);
            ctx.lineTo(cwx + 30, 45);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cwx, 0);
            ctx.lineTo(cwx + 15, 40);
            ctx.stroke();
            // Cross threads
            ctx.beginPath();
            ctx.moveTo(cwx + 10, 10);
            ctx.quadraticCurveTo(cwx + 25, 20, cwx + 35, 18);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cwx + 5, 25);
            ctx.quadraticCurveTo(cwx + 20, 32, cwx + 38, 28);
            ctx.stroke();
        }

        // --- DRIPPING WATER ---
        for (var dw = 0; dw < 6; dw++) {
            var dropPhase = (t * 0.8 + dw * 1.1) % 3.0;
            var dwx = 100 + dw * 170 - (near % 170);
            var dwy = dropPhase * 150;
            var dropAlpha = dropPhase < 2.8 ? 0.5 : (3.0 - dropPhase) * 2.5;
            ctx.fillStyle = 'rgba(100,120,180,' + dropAlpha + ')';
            ctx.beginPath();
            ctx.arc(dwx, dwy, 1.5, 0, Math.PI * 2);
            ctx.fill();
            // Splash at bottom
            if (dropPhase > 2.7) {
                var splashR = (dropPhase - 2.7) * 25;
                ctx.strokeStyle = 'rgba(100,120,180,' + (0.3 - splashR * 0.03) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(dwx, CH - 100, splashR, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    },


    battlefield: function(ctx, cameraX) {
        var t = Date.now() * 0.001;
        var far = cameraX * 0.1, mid = cameraX * 0.3, near = cameraX * 0.6;

        // --- DRAMATIC SUNSET SKY ---
        var sky = ctx.createLinearGradient(0, 0, 0, CH);
        sky.addColorStop(0, '#1a0820');
        sky.addColorStop(0.25, '#3a1030');
        sky.addColorStop(0.45, '#8a3010');
        sky.addColorStop(0.6, '#cc5510');
        sky.addColorStop(0.72, '#aa2a08');
        sky.addColorStop(1, '#2a0a04');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, CW, CH);

        // --- SUN disk partially below horizon with rays ---
        var sunX = CW * 0.65;
        var sunY = 330;
        // Rays
        ctx.save();
        for (var r = 0; r < 12; r++) {
            var rayAngle = r * Math.PI / 6 + t * 0.02;
            ctx.fillStyle = 'rgba(200,100,20,0.04)';
            ctx.beginPath();
            ctx.moveTo(sunX, sunY);
            ctx.lineTo(sunX + Math.cos(rayAngle) * 250, sunY + Math.sin(rayAngle) * 250);
            ctx.lineTo(sunX + Math.cos(rayAngle + 0.15) * 250, sunY + Math.sin(rayAngle + 0.15) * 250);
            ctx.fill();
        }
        ctx.restore();
        // Sun body
        ctx.fillStyle = 'rgba(255,120,20,0.5)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,180,60,0.3)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 35, 0, Math.PI * 2);
        ctx.fill();
        // Horizon cover
        ctx.fillStyle = '#2a0a04';
        ctx.fillRect(0, 355, CW, CH - 355);

        // --- SMOKE COLUMNS (animated, swaying) ---
        for (var s = 0; s < 5; s++) {
            var smx = s * 230 + 60 - (far % 230);
            for (var sp = 0; sp < 8; sp++) {
                var spY = 340 - sp * 22 - ((t * 8 + s * 3) % 20);
                var spX = smx + Math.sin(t * 0.4 + sp * 0.5 + s) * (4 + sp * 2);
                var spAlpha = 0.12 - sp * 0.012;
                var spSize = 8 + sp * 5;
                if (spAlpha > 0) {
                    ctx.fillStyle = 'rgba(30,15,8,' + spAlpha + ')';
                    ctx.beginPath();
                    ctx.arc(spX, spY, spSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // --- SHATTERED WALLS ---
        for (var w = 0; w < 3; w++) {
            var wallX = w * 380 + 50 - (far % 380);
            ctx.fillStyle = '#2a1a10';
            // Standing portion
            ctx.fillRect(wallX, 300, 20, 55);
            ctx.fillRect(wallX + 20, 320, 15, 35);
            // Broken edge
            ctx.beginPath();
            ctx.moveTo(wallX + 35, 355);
            ctx.lineTo(wallX + 35, 330);
            ctx.lineTo(wallX + 45, 340);
            ctx.lineTo(wallX + 40, 355);
            ctx.fill();
            // Rubble
            for (var rb = 0; rb < 5; rb++) {
                ctx.fillRect(wallX + 30 + rb * 8, 350 + (rb % 2) * 3, 6, 4);
            }
        }

        // --- BROKEN SIEGE EQUIPMENT ---
        for (var se = -1; se < 4; se++) {
            var sex = se * 300 + 100 - (mid % 300);
            ctx.fillStyle = '#1a0c05';
            // Catapult frame
            ctx.fillRect(sex, 365, 50, 5);
            ctx.fillRect(sex + 10, 340, 6, 25);
            // Broken arm at angle
            ctx.save();
            ctx.translate(sex + 13, 342);
            ctx.rotate(-0.7);
            ctx.fillRect(0, 0, 35, 4);
            ctx.restore();
            // Wheels
            ctx.strokeStyle = '#1a0c05';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sex + 8, 372, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(sex + 42, 372, 8, 0, Math.PI * 2);
            ctx.stroke();
        }

        // --- SWORDS stuck in ground, fallen shields, skeleton outlines ---
        for (var sw = 0; sw < 8; sw++) {
            var swx = sw * 130 + 20 - (mid % 130);
            var swAngle = -0.2 + seededRand(sw * 17) * 0.4;
            // Sword
            ctx.fillStyle = '#5a5a5a';
            ctx.save();
            ctx.translate(swx, 378);
            ctx.rotate(swAngle);
            ctx.fillRect(-1, -30, 2, 30);
            // Crossguard
            ctx.fillRect(-5, -5, 10, 2);
            // Handle
            ctx.fillStyle = '#3a2a1a';
            ctx.fillRect(-1, 0, 2, 8);
            ctx.restore();
        }

        // Fallen shields
        for (var sh = 0; sh < 4; sh++) {
            var shx = 90 + sh * 260 - (mid % 260);
            ctx.fillStyle = '#3a2a18';
            ctx.beginPath();
            ctx.arc(shx, 380, 10, 0, Math.PI);
            ctx.fill();
            ctx.strokeStyle = '#4a3a28';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(shx, 380, 10, 0, Math.PI);
            ctx.stroke();
        }

        // Skeleton outlines
        for (var sk = 0; sk < 3; sk++) {
            var skx = 200 + sk * 350 - (mid % 350);
            ctx.fillStyle = '#7a7a60';
            // Skull
            ctx.beginPath();
            ctx.arc(skx, 382, 5, 0, Math.PI * 2);
            ctx.fill();
            // Eye sockets
            ctx.fillStyle = '#2a0a04';
            ctx.fillRect(skx - 3, 381, 2, 2);
            ctx.fillRect(skx + 1, 381, 2, 2);
            // Body
            ctx.fillStyle = '#7a7a60';
            ctx.fillRect(skx - 1, 387, 2, 15);
            // Ribs
            for (var rib = 0; rib < 3; rib++) {
                ctx.fillRect(skx - 5, 390 + rib * 4, 10, 1);
            }
        }

        // --- SCORCHED EARTH ---
        ctx.fillStyle = 'rgba(10,5,2,0.4)';
        for (var sc = 0; sc < 20; sc++) {
            var scx = sc * 55 - (near % 55);
            ctx.beginPath();
            ctx.arc(scx + 20, 395 + (sc % 3) * 5, 12 + (sc % 4) * 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- EMBERS floating upward (animated) ---
        for (var em = 0; em < 20; em++) {
            var emPhase = (t * 0.4 + em * 0.5) % 4.0;
            var emX = (em * 53 + Math.sin(t * 0.5 + em) * 30) % CW;
            var emY = 400 - emPhase * 90;
            var emAlpha = Math.max(0, 0.8 - emPhase * 0.2);
            var emColor = em % 3 === 0 ? '255,200,50' : '255,130,30';
            ctx.fillStyle = 'rgba(' + emColor + ',' + emAlpha + ')';
            ctx.fillRect(emX, emY, 2, 2);
        }

        // --- CROWS: V shapes moving across sky ---
        for (var cr = 0; cr < 5; cr++) {
            var crX = ((t * 20 + cr * 200) % (CW + 300)) - 150;
            var crY = 80 + cr * 35 + Math.sin(t * 1.5 + cr * 2) * 15;
            var wingFlap = Math.sin(t * 6 + cr * 3) * 3;
            ctx.fillStyle = '#0a0505';
            ctx.beginPath();
            ctx.moveTo(crX, crY);
            ctx.lineTo(crX - 7, crY - 4 - wingFlap);
            ctx.lineTo(crX - 3, crY - 1);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(crX, crY);
            ctx.lineTo(crX + 7, crY - 4 + wingFlap);
            ctx.lineTo(crX + 3, crY - 1);
            ctx.fill();
        }

        // Ground
        ctx.fillStyle = '#1a0a04';
        ctx.fillRect(0, 390, CW, CH - 390);
    },

