/**
 * effects.js - Ambient Visual Effects System
 *
 * Adds atmospheric detail effects around entities: enemy auras, player
 * sword glows, environmental particles, and weapon impacts.
 *
 * Extends the W namespace.
 * Depends on: core.js (W), rendering.js (W.Colors), particles.js.
 */
(function () {
'use strict';

var W = window.W || (window.W = {});
var C = W.Colors;

var sin  = Math.sin, cos = Math.cos, PI = Math.PI, abs = Math.abs;
var floor = Math.floor, rand = Math.random;
function rng(lo, hi) { return rand() * (hi - lo) + lo; }

// ====================================================================
// W.Effects
// ====================================================================
W.Effects = {

    // ----------------------------------------------------------------
    // drawEntityEffects — called per enemy each frame
    // ----------------------------------------------------------------
    drawEntityEffects: function (ctx, entity, t) {
        if (!entity.alive) return;
        var n  = entity.name;
        var cx = entity.x + entity.w * 0.5;
        var cy = entity.y + entity.h * 0.5;
        var bx = entity.x, by = entity.y;
        var bw = entity.w, bh = entity.h;
        var footY  = by + bh;
        var moving = abs(entity.vx) > 0.3;

        ctx.save();

        // ---------- Drowner ----------
        if (n === 'Drowner') {
            // Water drips falling from body
            for (var i = 0; i < 3; i++) {
                var dx = cx + sin(t * 0.04 + i * 2.1) * bw * 0.35;
                var dy = cy + ((t * 0.06 + i * 40) % bh) - bh * 0.3;
                ctx.globalAlpha = 0.55;
                ctx.fillStyle = '#4488cc';
                ctx.fillRect(dx, dy, 2, 3);
            }
            // Wet footprint patches
            if (moving) {
                for (var f = 0; f < 2; f++) {
                    var fpx  = bx + bw * 0.3 + f * bw * 0.4;
                    var fade = (sin(t * 0.03 + f * 3) + 1) * 0.25;
                    ctx.globalAlpha = fade;
                    ctx.fillStyle = '#1a2a2a';
                    ctx.fillRect(fpx - 3, footY - 1, 6, 2);
                }
            }
            // Splash droplets when walking
            if (moving) {
                ctx.globalAlpha = 0.35;
                ctx.fillStyle = '#5599bb';
                for (var s = 0; s < 3; s++) {
                    ctx.fillRect(cx + rng(-bw * 0.4, bw * 0.4),
                                 footY - rng(2, 8), 2, 2);
                }
            }

        // ---------- Ghoul ----------
        } else if (n === 'Ghoul') {
            // Green miasma wisps rising with sine drift
            for (var m = 0; m < 4; m++) {
                var mx = cx + sin(t * 0.025 + m * 1.7) * bw * 0.5;
                var my = cy - (t * 0.05 + m * 15) % (bh * 0.8);
                ctx.globalAlpha = 0.18 + sin(t * 0.03 + m) * 0.08;
                ctx.fillStyle = '#44aa33';
                ctx.beginPath();
                ctx.arc(mx, my, 3 + sin(t * 0.04 + m) * 1.5, 0, PI * 2);
                ctx.fill();
            }
            // Flies buzzing in circles
            ctx.fillStyle = '#111';
            for (var fl = 0; fl < 3; fl++) {
                var fa = t * 0.08 + fl * (PI * 2 / 3);
                var fr = 14 + sin(t * 0.05 + fl) * 4;
                ctx.globalAlpha = 0.8;
                ctx.fillRect(cx + cos(fa) * fr,
                             cy - bh * 0.25 + sin(fa * 1.3) * fr * 0.5, 2, 2);
            }

        // ---------- Wraith ----------
        } else if (n === 'Wraith') {
            // Spectral wisps trailing behind
            for (var w = 0; w < 4; w++) {
                var wx = cx - entity.facing * (8 + w * 6) + sin(t * 0.04 + w) * 3;
                var wy = cy + sin(t * 0.06 + w * 1.5) * 6;
                ctx.globalAlpha = 0.22 - w * 0.04;
                ctx.fillStyle = '#99aadd';
                ctx.fillRect(wx - 3, wy - 1, 7, 3);
            }
            // Ghostly afterimage (faded copy offset behind)
            ctx.globalAlpha = 0.12;
            ctx.fillStyle = C.WRAITH_GLOW || 'rgba(150,170,220,0.4)';
            ctx.fillRect(bx - entity.facing * 10, by + 2, bw, bh);
            // Cold breath puffs
            var breathX = cx + entity.facing * bw * 0.4;
            var breathY = by + bh * 0.2;
            ctx.globalAlpha = 0.2 + sin(t * 0.05) * 0.1;
            ctx.fillStyle = '#ddeeff';
            ctx.beginPath();
            ctx.arc(breathX + sin(t * 0.07) * 2, breathY,
                    3 + sin(t * 0.06) * 1, 0, PI * 2);
            ctx.fill();

        // ---------- Nekker ----------
        } else if (n === 'Nekker') {
            // Dirt/dust kicks when running
            if (moving) {
                for (var d = 0; d < 3; d++) {
                    var dT  = (t * 0.07 + d * 20) % 30;
                    var ddx = cx + rng(-bw * 0.3, bw * 0.3) - entity.facing * 6;
                    var ddy = footY - dT * 0.4;
                    ctx.globalAlpha = 0.3 * (1 - dT / 30);
                    ctx.fillStyle = '#7a6a4a';
                    ctx.fillRect(ddx, ddy, 3, 2);
                }
            }
            // Scratch marks on ground
            ctx.globalAlpha = 0.15;
            ctx.strokeStyle = '#5a4a2a';
            ctx.lineWidth = 1;
            for (var sc = 0; sc < 2; sc++) {
                var scx = bx + bw * 0.3 + sc * bw * 0.4;
                ctx.beginPath();
                ctx.moveTo(scx, footY);
                ctx.lineTo(scx + entity.facing * 5, footY + 1);
                ctx.stroke();
            }

        // ---------- Griffin ----------
        } else if (n === 'Griffin') {
            // Wind gusts under wings (animated curved lines)
            ctx.globalAlpha = 0.15;
            ctx.strokeStyle = '#aabbcc';
            ctx.lineWidth = 1;
            for (var g = 0; g < 3; g++) {
                var gy  = cy + bh * 0.1 + g * 5;
                var gx1 = cx - bw * 0.6 - sin(t * 0.05 + g) * 8;
                var gx2 = cx + bw * 0.6 + sin(t * 0.05 + g) * 8;
                ctx.beginPath();
                ctx.moveTo(gx1, gy);
                ctx.quadraticCurveTo(cx, gy + 6 + sin(t * 0.07) * 3, gx2, gy);
                ctx.stroke();
            }
            // Feathers drifting down with horizontal sway
            for (var fe = 0; fe < 3; fe++) {
                var feT = (t * 0.03 + fe * 35) % 60;
                var fex = cx + sin(t * 0.02 + fe * 2.5) * 20;
                var fey = cy + feT * 0.8;
                ctx.globalAlpha = 0.5 * (1 - feT / 60);
                ctx.fillStyle = '#8a7040';
                ctx.fillRect(fex, fey, 3, 1.5);
                ctx.fillRect(fex + 1, fey + 1, 1, 1);
            }

        // ---------- Bandit ----------
        // Nothing special — basic human.

        // ---------- Nilfgaardian ----------
        } else if (n === 'Nilfgaardian') {
            // Subtle gold shimmer on armor
            var shimmer = sin(t * 0.06) * sin(t * 0.09);
            if (shimmer > 0.7) {
                ctx.globalAlpha = (shimmer - 0.7) * 2.5;
                ctx.fillStyle = C.NILF_GOLD || '#c8a032';
                ctx.fillRect(cx + rng(-bw * 0.3, bw * 0.3),
                             cy + rng(-bh * 0.3, bh * 0.1), 2, 2);
            }
            // Disciplined footstep dust
            if (moving && floor(t * 0.06) % 3 === 0) {
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#8a7a5a';
                ctx.fillRect(cx - 4, footY - 2, 8, 2);
            }

        // ---------- Wild Hunt ----------
        } else if (n === 'Wild Hunt') {
            // Ice crystals orbiting body (3-4 light-blue diamonds)
            for (var ic = 0; ic < 4; ic++) {
                var ica = t * 0.05 + ic * (PI * 0.5);
                var icr = 18 + sin(t * 0.03 + ic) * 4;
                var icx = cx + cos(ica) * icr;
                var icy = cy + sin(ica) * icr * 0.5;
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = C.WILD_HUNT_ICE || '#88aacc';
                ctx.beginPath();
                ctx.moveTo(icx, icy - 3);
                ctx.lineTo(icx + 2, icy);
                ctx.lineTo(icx, icy + 3);
                ctx.lineTo(icx - 2, icy);
                ctx.closePath();
                ctx.fill();
            }
            // Frost trail on ground behind
            for (var ft = 0; ft < 5; ft++) {
                var ftx = cx - entity.facing * (10 + ft * 8);
                ctx.globalAlpha = 0.25 * (1 - ft / 5);
                ctx.fillStyle = '#aaccee';
                ctx.fillRect(ftx - 2, footY - 1, 5, 2);
            }
            // Cold mist / breath
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = '#bbddff';
            ctx.fillRect(bx - 6, by - 4, bw + 12, bh + 6);

        // ---------- Witch Hunter ----------
        } else if (n === 'Witch Hunter') {
            // Crossbow bolt glint
            if (sin(t * 0.08) > 0.85) {
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = '#fff';
                ctx.fillRect(cx + entity.facing * 8, cy - 4, 2, 2);
            }
            // Religious fervor — subtle red glow around cross emblem
            ctx.globalAlpha = 0.12 + sin(t * 0.04) * 0.06;
            ctx.fillStyle = C.WITCH_HUNTER_RED || '#8a2a1a';
            ctx.fillRect(cx - 3, cy - bh * 0.25, 6, 8);

        // ---------- Nobleman ----------
        } else if (n === 'Nobleman') {
            // Perfume / arrogance aura — purple shimmer particles rising
            for (var p = 0; p < 3; p++) {
                var pT = (t * 0.04 + p * 25) % 40;
                var px = cx + sin(t * 0.03 + p * 2) * bw * 0.4;
                var py = cy - pT * 0.5;
                ctx.globalAlpha = 0.2 * (1 - pT / 40);
                ctx.fillStyle = C.NOBLEMAN_PURPLE || '#5a2a6a';
                ctx.fillRect(px, py, 2, 2);
            }
        }

        ctx.restore();
    },

    // ----------------------------------------------------------------
    // drawPlayerEffects — Geralt ambient effects
    // ----------------------------------------------------------------
    drawPlayerEffects: function (ctx, player, t, enemies) {
        if (!player.alive) return;
        var cx    = player.x + player.w * 0.5;
        var cy    = player.y + player.h * 0.5;
        var footY = player.y + player.h;
        var moving = abs(player.vx) > 0.5;

        ctx.save();

        // --- Medallion vibrate when creatures nearby ---
        var nearMonster = false;
        if (enemies) {
            for (var e = 0; e < enemies.length; e++) {
                var en = enemies[e];
                if (en.alive && en.category === 'creature' &&
                    abs(en.x - player.x) < 200 && abs(en.y - player.y) < 200) {
                    nearMonster = true;
                    break;
                }
            }
        }
        if (player._nearMonster) nearMonster = true;

        if (nearMonster) {
            var medX = cx + player.facing * 2;
            var medY = cy - player.h * 0.15;
            ctx.strokeStyle = 'rgba(200,160,50,0.45)';
            ctx.lineWidth = 1;
            for (var v = 0; v < 3; v++) {
                var va = t * 0.15 + v * (PI * 2 / 3);
                var vr = 4 + sin(t * 0.12 + v) * 1.5;
                ctx.beginPath();
                ctx.moveTo(medX + cos(va) * vr, medY + sin(va) * vr);
                ctx.lineTo(medX + cos(va) * (vr + 2.5),
                           medY + sin(va) * (vr + 2.5));
                ctx.stroke();
            }
        }

        // --- Sword glow on hilt (even when sheathed) ---
        var isSilver  = player.activeSword === 'silver';
        var glowColor = isSilver ? '#6666cc' : '#cc8844';
        var hiltX     = cx - player.facing * 6;
        var hiltY     = player.y + 8;
        var pulse     = 0.15 + sin(t * 0.06) * 0.08;
        ctx.globalAlpha = pulse;
        ctx.fillStyle   = glowColor;
        ctx.fillRect(hiltX - 2, hiltY - 1, 4, 6);

        // --- Cat eyes glow in castle / dark levels ---
        if (player._darkLevel) {
            var eyeX = cx + player.facing * 3;
            var eyeY = player.y + 6;
            ctx.globalAlpha = 0.5 + sin(t * 0.04) * 0.15;
            ctx.fillStyle = C.YELLOW_EYES || '#daa520';
            ctx.fillRect(eyeX - 1, eyeY, 3, 2);
            ctx.fillRect(eyeX + 2, eyeY, 3, 2);
            // Small light cone
            ctx.globalAlpha = 0.06;
            ctx.beginPath();
            ctx.moveTo(eyeX + 1, eyeY + 1);
            ctx.lineTo(eyeX + player.facing * 35, eyeY - 12);
            ctx.lineTo(eyeX + player.facing * 35, eyeY + 14);
            ctx.closePath();
            ctx.fill();
        }

        // --- Footstep dust when running ---
        if (moving && player.onGround) {
            for (var fd = 0; fd < 2; fd++) {
                var fdT = (t * 0.08 + fd * 18) % 20;
                var fdx = cx - player.facing * 8 + rng(-3, 3);
                var fdy = footY - fdT * 0.5;
                ctx.globalAlpha = 0.25 * (1 - fdT / 20);
                ctx.fillStyle = '#8a7a5a';
                ctx.fillRect(fdx, fdy, 3, 2);
            }
        }

        // --- Cape trail when moving fast ---
        if (moving && abs(player.vx) > 1.5) {
            for (var ct = 0; ct < 3; ct++) {
                var clag = (ct + 1) * 6;
                ctx.globalAlpha = 0.2 - ct * 0.05;
                ctx.fillStyle = '#1a1a2a';
                ctx.fillRect(
                    cx - player.facing * (10 + clag) + sin(t * 0.06 + ct) * 2,
                    player.y + 10 + ct * 4,
                    6, player.h * 0.4 - ct * 4
                );
            }
        }

        ctx.restore();
    },

    // ----------------------------------------------------------------
    // drawWeaponEffects — active attack effects
    // ----------------------------------------------------------------
    drawWeaponEffects: function (ctx, player, t) {
        if (player.state !== 'attack') return;
        var cx = player.x + player.w * 0.5;
        var cy = player.y + player.h * 0.5;
        var isSilver = player.activeSword === 'silver';
        var progress = player.stateTimer / 22; // rough 0..1

        ctx.save();

        // --- Speed lines during mid-swing ---
        if (progress > 0.2 && progress < 0.7) {
            ctx.globalAlpha = 0.22;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth   = 1;
            for (var sl = 0; sl < 4; sl++) {
                var sla = (PI * -0.4) + sl * 0.3 + player.facing * 0.3;
                var slr = 18 + sl * 5;
                var slx = cx + player.facing * 12;
                var sly = cy - 6;
                ctx.beginPath();
                ctx.moveTo(slx + cos(sla) * slr, sly + sin(sla) * slr);
                ctx.lineTo(slx + cos(sla) * (slr + 10),
                           sly + sin(sla) * (slr + 10));
                ctx.stroke();
            }
        }

        // --- Blade afterimage ---
        if (progress > 0.15 && progress < 0.8) {
            var aAngle = PI * (-0.3 + progress * 1.2) * player.facing;
            var ax = cx + player.facing * 14;
            var ay = cy - 8;
            ctx.globalAlpha  = 0.15;
            ctx.strokeStyle  = isSilver ? (C.SILVER_TRAIL || '#aab0ff')
                                        : (C.IRON_TRAIL  || '#ffaa44');
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(ax + cos(aAngle) * 26, ay + sin(aAngle) * 26);
            ctx.stroke();
        }

        // --- Silver sword specifics ---
        if (isSilver) {
            // Blue-white sparks on hit
            if (player._hitEnemy) {
                for (var sp = 0; sp < 6; sp++) {
                    var spa = rng(0, PI * 2);
                    var spr = rng(4, 16);
                    ctx.globalAlpha = rng(0.4, 0.8);
                    ctx.fillStyle = sp % 2 === 0 ? '#aabbff' : '#fff';
                    ctx.fillRect(cx + player.facing * 20 + cos(spa) * spr,
                                 cy - 4 + sin(spa) * spr, 2, 2);
                }
            }
            // Moonlight glint on blade
            if (progress > 0.3 && progress < 0.5) {
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#fff';
                ctx.fillRect(cx + player.facing * 28, cy - 12, 3, 3);
            }
            // Magical rune glow along blade edge
            var rAngle = PI * (-0.2 + progress * 1.0) * player.facing;
            var rbx = cx + player.facing * 14;
            var rby = cy - 8;
            ctx.globalAlpha  = 0.2 + sin(t * 0.1) * 0.1;
            ctx.strokeStyle  = C.SILVER_GLOW || '#8888dd';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(rbx, rby);
            ctx.lineTo(rbx + cos(rAngle) * 24, rby + sin(rAngle) * 24);
            ctx.stroke();

        // --- Iron sword specifics ---
        } else {
            // Orange embers and metal sparks on hit
            if (player._hitEnemy) {
                for (var em = 0; em < 5; em++) {
                    var ema = rng(0, PI * 2);
                    var emr = rng(3, 14);
                    ctx.globalAlpha = rng(0.5, 0.9);
                    ctx.fillStyle = em % 2 === 0 ? '#ffaa33' : '#ffdd88';
                    ctx.fillRect(cx + player.facing * 18 + cos(ema) * emr,
                                 cy - 2 + sin(ema) * emr, 2, 2);
                }
                // Metal sparks
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = '#fff';
                for (var ms = 0; ms < 3; ms++) {
                    ctx.fillRect(cx + player.facing * 20 + rng(-8, 8),
                                 cy + rng(-10, 6), 1, 1);
                }
                // Small screen-local impact flash
                ctx.globalAlpha = 0.08;
                ctx.fillStyle = '#ffcc66';
                ctx.fillRect(cx - 20, cy - 20, 40, 40);
            }
        }

        ctx.restore();
    },

    // ----------------------------------------------------------------
    // drawEnvironmentEffects — global atmospheric particles
    // ----------------------------------------------------------------
    drawEnvironmentEffects: function (ctx, level, cameraX, t) {
        var theme   = level.bgTheme || 'village';
        var screenW = ctx.canvas.width;
        var screenH = ctx.canvas.height;

        ctx.save();

        // --- Dust motes (all themes) ---
        for (var dm = 0; dm < 15; dm++) {
            var seed = dm * 137.5;
            var dmx  = ((seed * 7.3 + t * 0.15 + dm * 50) % (screenW + 40)) - 20;
            var dmy  = ((seed * 3.1 + sin(t * 0.02 + dm) * 20 + dm * 30) % screenH);
            ctx.globalAlpha = 0.1 + sin(t * 0.01 + dm * 0.7) * 0.06;
            ctx.fillStyle = '#ccbb99';
            ctx.fillRect(dmx, dmy, 1, 1);
        }

        // --- Castle: torch embers rising from fixed positions ---
        if (theme === 'castle') {
            var torchSpacing = 320;
            var firstTorch   = floor(cameraX / torchSpacing) * torchSpacing;
            for (var tp = firstTorch;
                 tp < cameraX + screenW + torchSpacing;
                 tp += torchSpacing) {
                var tsx = tp - cameraX + 16;
                for (var te = 0; te < 5; te++) {
                    var teT = (t * 0.06 + te * 30 + tp * 0.1) % 50;
                    var tex = tsx + sin(t * 0.03 + te * 1.4 + tp) * 6;
                    var tey = screenH * 0.45 - teT * 1.8;
                    ctx.globalAlpha = 0.6 * (1 - teT / 50);
                    ctx.fillStyle = te % 2 === 0 ? '#ff8833' : '#ffaa44';
                    ctx.fillRect(tex, tey, 2, 2);
                }
            }
        }

        // --- Village / Swamp: fireflies ---
        if (theme === 'village' || theme === 'swamp') {
            for (var ff = 0; ff < 12; ff++) {
                var ffs  = ff * 97.3;
                var ffx  = (ffs * 5.7 + sin(t * 0.012 + ff * 0.8) * 40) % screenW;
                var ffy  = screenH * 0.3 + sin(t * 0.018 + ff * 1.3) * screenH * 0.25;
                var ffB  = sin(t * 0.04 + ff * 2.1);
                if (ffB > 0.3) {
                    ctx.globalAlpha = (ffB - 0.3) * 0.7;
                    ctx.fillStyle = '#bbdd44';
                    ctx.fillRect(ffx, ffy, 2, 2);
                    // Tiny glow halo
                    ctx.globalAlpha *= 0.3;
                    ctx.fillRect(ffx - 1, ffy - 1, 4, 4);
                }
            }
        }

        // --- Swamp: rain drops (subtle diagonal lines) ---
        if (theme === 'swamp') {
            ctx.globalAlpha  = 0.12;
            ctx.strokeStyle  = '#8899aa';
            ctx.lineWidth    = 1;
            for (var rd = 0; rd < 25; rd++) {
                var rds = rd * 53.7;
                var rdx = (rds * 11 + t * 3.5 + rd * 40) % (screenW + 60) - 30;
                var rdy = (rds * 7  + t * 5.0 + rd * 25) % (screenH + 40) - 20;
                ctx.beginPath();
                ctx.moveTo(rdx, rdy);
                ctx.lineTo(rdx + 3, rdy + 10);
                ctx.stroke();
            }
        }

        // --- Mountain: snow drifting diagonally ---
        if (theme === 'mountain') {
            for (var sn = 0; sn < 20; sn++) {
                var sns  = sn * 71.9;
                var snx  = (sns * 9.3 + t * 0.6 + sin(t * 0.015 + sn) * 15)
                           % (screenW + 30) - 15;
                var sny  = (sns * 4.1 + t * 0.8 + sn * 30)
                           % (screenH + 20) - 10;
                var snSz = (sn % 3 === 0) ? 2 : 1;
                ctx.globalAlpha = 0.4 + sin(t * 0.02 + sn * 1.1) * 0.15;
                ctx.fillStyle = '#eeeeff';
                ctx.fillRect(snx, sny, snSz, snSz);
            }
        }

        ctx.restore();
    }
};

})();
