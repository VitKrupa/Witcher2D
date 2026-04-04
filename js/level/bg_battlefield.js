(function() {
'use strict';
if (!W.Backgrounds) W.Backgrounds = {};
W.Backgrounds.battlefield = function(ctx, cameraX) {
    const cw = W.CANVAS_W || 960, ch = W.CANVAS_H || 400, t = Date.now() * 0.001;

    // SKY gradient: deep purple -> orange -> blood red at horizon
    var sky = ctx.createLinearGradient(0, 0, 0, ch * 0.55);
    sky.addColorStop(0, '#1a0a1a');
    sky.addColorStop(0.5, '#8a4010');
    sky.addColorStop(1, '#6a2010');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, cw, ch * 0.55);

    // Sun disk half below horizon
    var sunX = cw * 0.7, sunY = ch * 0.52;
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#cc6a20';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 50, 0, Math.PI * 2);
    ctx.fill();

    // Sun rays - triangles radiating outward
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#cc8030';
    for (var r = 0; r < 5; r++) {
        var angle = -Math.PI * 0.15 + r * Math.PI * 0.22;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(sunX + Math.cos(angle - 0.06) * 180, sunY + Math.sin(angle - 0.06) * 180);
        ctx.lineTo(sunX + Math.cos(angle + 0.06) * 180, sunY + Math.sin(angle + 0.06) * 180);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Crows - small V shapes moving across sky
    ctx.strokeStyle = '#0a0508';
    ctx.lineWidth = 1.5;
    for (var c = 0; c < 4; c++) {
        var cx2 = ((t * 18 + c * 250) % (cw + 100)) - 50;
        var cy2 = 60 + c * 35 + Math.sin(t * 1.5 + c) * 10;
        ctx.beginPath();
        ctx.moveTo(cx2 - 8, cy2 + 4);
        ctx.lineTo(cx2, cy2);
        ctx.lineTo(cx2 + 8, cy2 + 4);
        ctx.stroke();
    }

    // Ground base
    ctx.fillStyle = '#1a1008';
    ctx.fillRect(0, ch * 0.52, cw, ch * 0.48);

    // Scorched earth patches
    ctx.fillStyle = '#100a04';
    var farOff = cameraX * 0.15;
    for (var se = 0; se < 5; se++) {
        var sx = ((se * 230 + 80) - farOff % 800 + 800) % 1100 - 100;
        ctx.fillRect(sx, ch * 0.72 + se * 12, 90 + se * 20, 10);
    }

    // Smoke columns (far parallax 0.15x)
    for (var s = 0; s < 4; s++) {
        var smokeX = ((s * 280 + 100) - farOff % 1200 + 1200) % 1200 - 60;
        ctx.globalAlpha = 0.15 + Math.sin(t + s) * 0.05;
        ctx.fillStyle = '#4a4040';
        for (var sy = 0; sy < 6; sy++) {
            var sway = Math.sin(t * 0.7 + s + sy * 0.5) * (8 + sy * 4);
            var sw = 14 + sy * 6;
            ctx.beginPath();
            ctx.arc(smokeX + sway, ch * 0.52 - sy * 35, sw, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1;

    // Shattered walls (mid parallax 0.3x)
    var midOff = cameraX * 0.3;
    ctx.fillStyle = '#2a1a10';
    var wallSegs = [[150, 80], [420, 60], [700, 90]];
    for (var w = 0; w < wallSegs.length; w++) {
        var wx = ((wallSegs[w][0]) - midOff % 1000 + 1000) % 1100 - 50;
        var wh = wallSegs[w][1];
        ctx.fillRect(wx, ch * 0.52 - wh, 18, wh);
        ctx.fillRect(wx + 18, ch * 0.52 - wh * 0.6, 14, wh * 0.6);
        ctx.fillRect(wx + 32, ch * 0.52 - wh * 0.35, 10, wh * 0.35);
    }

    // Broken siege equipment silhouettes (mid parallax)
    ctx.fillStyle = '#1a0e06';
    // Catapult
    var catX = (300 - midOff % 960 + 960) % 1060 - 50;
    ctx.fillRect(catX, ch * 0.52 - 50, 50, 8);
    ctx.fillRect(catX + 10, ch * 0.52 - 50, 6, 50);
    ctx.fillRect(catX + 34, ch * 0.52 - 50, 6, 50);
    ctx.fillRect(catX + 5, ch * 0.52 - 55, 40, 5);
    // Battering ram
    var ramX = (650 - midOff % 960 + 960) % 1060 - 50;
    ctx.fillRect(ramX, ch * 0.52 - 20, 70, 8);
    ctx.fillRect(ramX + 10, ch * 0.52 - 30, 5, 30);
    ctx.fillRect(ramX + 55, ch * 0.52 - 30, 5, 30);

    // Near parallax elements (0.5x)
    var nearOff = cameraX * 0.5;

    // Swords stuck in ground
    ctx.strokeStyle = '#7a7a80';
    ctx.lineWidth = 2;
    for (var sw2 = 0; sw2 < 5; sw2++) {
        var swX = ((sw2 * 210 + 60) - nearOff % 1100 + 1100) % 1100 - 30;
        var swBase = ch * 0.73 + sw2 * 8;
        var swAngle = -0.15 + sw2 * 0.08;
        ctx.beginPath();
        ctx.moveTo(swX, swBase);
        ctx.lineTo(swX + Math.sin(swAngle) * 40, swBase - 40);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(swX + Math.sin(swAngle) * 12 - 6, swBase - 12);
        ctx.lineTo(swX + Math.sin(swAngle) * 12 + 6, swBase - 12);
        ctx.stroke();
    }

    // Fallen shields
    ctx.fillStyle = '#3a2a18';
    for (var sh = 0; sh < 4; sh++) {
        var shX = ((sh * 260 + 140) - nearOff % 1100 + 1100) % 1100 - 30;
        ctx.beginPath();
        ctx.ellipse(shX, ch * 0.78 + sh * 5, 12, 6, 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Skeleton outlines
    ctx.strokeStyle = '#9a9080';
    ctx.lineWidth = 1.5;
    for (var sk = 0; sk < 3; sk++) {
        var skX = ((sk * 350 + 200) - nearOff % 1100 + 1100) % 1100 - 30;
        var skY = ch * 0.76 + sk * 6;
        // Skull
        ctx.beginPath();
        ctx.arc(skX, skY - 8, 5, 0, Math.PI * 2);
        ctx.stroke();
        // Ribs
        for (var rb = 0; rb < 3; rb++) {
            ctx.beginPath();
            ctx.moveTo(skX - 4, skY + rb * 4);
            ctx.lineTo(skX + 4, skY + rb * 4);
            ctx.stroke();
        }
    }

    // Puddles reflecting red sky
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#4a1510';
    for (var p = 0; p < 4; p++) {
        var px = ((p * 240 + 90) - nearOff % 1000 + 1000) % 1060 - 30;
        ctx.beginPath();
        ctx.ellipse(px, ch * 0.82 + p * 8, 25 + p * 5, 5, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Embers floating upward
    for (var e = 0; e < 10; e++) {
        var ePhase = t * 0.6 + e * 1.7;
        var eY = ch * 0.8 - ((ePhase * 40) % (ch * 0.6));
        var eX = 80 + e * 95 + Math.sin(ePhase * 1.3) * 20;
        var eSize = 1.5 + Math.sin(e + t) * 0.8;
        ctx.globalAlpha = 0.6 + Math.sin(t * 3 + e) * 0.3;
        ctx.fillStyle = e % 2 === 0 ? '#ff8a20' : '#ffcc40';
        ctx.beginPath();
        ctx.arc(eX, eY, eSize, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
};
})();
