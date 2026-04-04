(function() {
'use strict';
if (!W.Backgrounds) W.Backgrounds = {};

W.Backgrounds.castle = function(ctx, cameraX) {
    const cw = W.CANVAS_W || 960, ch = W.CANVAS_H || 540, t = Date.now() * 0.001;

    // === BASE: dark stone background ===
    const bg = ctx.createLinearGradient(0, 0, 0, ch);
    bg.addColorStop(0, '#1a1a22');
    bg.addColorStop(0.6, '#22222a');
    bg.addColorStop(1, '#18181e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cw, ch);

    // === WALL LAYER (0.2x): stone bricks with mortar ===
    const wall = cameraX * 0.2;
    const brickW = 48, brickH = 22, mortarW = 2;
    ctx.fillStyle = '#2a2a30';
    for (let row = 0; row < 26; row++) {
        const offset = (row % 2) * (brickW / 2);
        const y = row * (brickH + mortarW);
        for (let col = -1; col < 22; col++) {
            const x = col * (brickW + mortarW) + offset - (wall % (brickW + mortarW));
            // Brick face with subtle shade variation
            const shade = 38 + ((row * 7 + col * 13) % 12);
            ctx.fillStyle = `rgb(${shade},${shade},${shade + 6})`;
            ctx.fillRect(x, y, brickW, brickH);
        }
    }
    // Mortar lines (horizontal)
    ctx.fillStyle = '#1a1a20';
    for (let row = 0; row <= 26; row++) {
        ctx.fillRect(0, row * (brickH + mortarW) - 1, cw, mortarW);
    }

    // === MID LAYER (0.3x): windows, torches, banners, chains ===
    const mid = cameraX * 0.3;

    // Arched windows with moonlight (4 windows)
    for (let i = 0; i < 4; i++) {
        const wx = i * 280 + 80 - (mid % 280);
        const wy = 80;
        // Window arch
        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(wx, wy + 20, 40, 80);
        ctx.beginPath();
        ctx.arc(wx + 20, wy + 20, 20, Math.PI, 0);
        ctx.fill();
        // Moonlight in window
        ctx.fillStyle = 'rgba(120,140,180,0.25)';
        ctx.fillRect(wx + 4, wy + 24, 32, 72);
        ctx.beginPath();
        ctx.arc(wx + 20, wy + 24, 16, Math.PI, 0);
        ctx.fill();
        // Moonlight beam angled down
        ctx.fillStyle = 'rgba(80,100,160,0.06)';
        ctx.save();
        ctx.translate(wx + 20, wy + 100);
        ctx.rotate(0.15);
        ctx.fillRect(-18, 0, 36, 300);
        ctx.restore();
    }

    // Torches on walls (6 torches)
    for (let i = 0; i < 6; i++) {
        const tx = i * 175 + 50 - (mid % 175);
        const ty = 200;
        // Bracket
        ctx.fillStyle = '#555';
        ctx.fillRect(tx - 1, ty - 12, 4, 18);
        ctx.fillRect(tx - 5, ty - 14, 12, 3);
        // Flame (3 overlapping layers animated with sin)
        const f1 = 8 + Math.sin(t * 5 + i) * 3;
        const f2 = 6 + Math.sin(t * 7 + i * 2) * 2;
        const f3 = 4 + Math.sin(t * 9 + i * 3) * 2;
        ctx.fillStyle = 'rgba(200,80,20,0.9)';
        ctx.fillRect(tx - f1 / 2, ty - 14 - f1, f1, f1);
        ctx.fillStyle = 'rgba(240,160,30,0.85)';
        ctx.fillRect(tx - f2 / 2, ty - 16 - f2, f2, f2);
        ctx.fillStyle = 'rgba(255,220,80,0.8)';
        ctx.fillRect(tx - f3 / 2, ty - 18 - f3, f3, f3);
        // Warm glow
        ctx.fillStyle = 'rgba(200,120,30,0.07)';
        ctx.beginPath();
        ctx.arc(tx, ty - 18, 55, 0, Math.PI * 2);
        ctx.fill();
        // Rising embers (3 per torch)
        for (let e = 0; e < 3; e++) {
            const emberCycle = (t * 0.6 + i * 1.3 + e * 2.1) % 3.0;
            const ey = ty - 28 - emberCycle * 40;
            const ex = tx + Math.sin(t * 2 + i * 4 + e * 3) * 8;
            const alpha = Math.max(0, 1 - emberCycle / 3.0);
            ctx.fillStyle = `rgba(255,140,30,${(alpha * 0.8).toFixed(2)})`;
            ctx.fillRect(ex - 1, ey - 1, 2, 2);
        }
    }

    // Hanging chains from ceiling (5 chains)
    for (let i = 0; i < 5; i++) {
        const cx = i * 210 + 130 - (mid % 210);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1.5;
        const chainLen = 40 + (i % 3) * 15;
        for (let link = 0; link < chainLen; link += 6) {
            ctx.beginPath();
            ctx.moveTo(cx, link);
            ctx.lineTo(cx + (link % 12 < 6 ? 2 : -2), link + 3);
            ctx.lineTo(cx, link + 6);
            ctx.stroke();
        }
    }

    // Banners / tapestries (3 banners)
    for (let i = 0; i < 3; i++) {
        const bx = i * 340 + 200 - (mid % 340);
        ctx.fillStyle = '#5a1a1a';
        ctx.fillRect(bx, 30, 28, 90);
        // Gold trim lines
        ctx.fillStyle = '#aa8830';
        ctx.fillRect(bx, 30, 28, 2);
        ctx.fillRect(bx, 118, 28, 2);
        ctx.fillRect(bx - 1, 30, 2, 90);
        ctx.fillRect(bx + 27, 30, 2, 90);
        // Center emblem line
        ctx.fillRect(bx + 8, 60, 12, 2);
        ctx.fillRect(bx + 12, 55, 4, 12);
    }

    // Cobwebs in upper corners
    ctx.strokeStyle = 'rgba(140,140,140,0.15)';
    ctx.lineWidth = 0.7;
    for (let s = 0; s < 5; s++) {
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(30 + s * 14, s * 22); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cw, 0); ctx.lineTo(cw - 30 - s * 14, s * 22); ctx.stroke();
    }

    // === FOREGROUND (0.6x): armor, drips, fog ===
    const near = cameraX * 0.6;

    // Suit of armor silhouette
    const ax = 500 - (near % 600);
    ctx.fillStyle = '#3a3a42';
    // Body
    ctx.fillRect(ax - 8, 380, 16, 40);
    // Head
    ctx.beginPath();
    ctx.arc(ax, 374, 9, 0, Math.PI * 2);
    ctx.fill();
    // Shoulders
    ctx.fillRect(ax - 14, 383, 28, 5);
    // Legs
    ctx.fillRect(ax - 7, 420, 5, 18);
    ctx.fillRect(ax + 2, 420, 5, 18);
    // Stand
    ctx.fillStyle = '#333';
    ctx.fillRect(ax - 12, 438, 24, 4);

    // Dripping water (2 drips cycling down from ceiling)
    for (let d = 0; d < 2; d++) {
        const dx = d * 400 + 300 - (near % 400);
        const dropCycle = (t * 0.8 + d * 1.5) % 2.5;
        const dy = dropCycle * 180;
        const dropAlpha = dy < 400 ? 0.6 : 0;
        ctx.fillStyle = `rgba(100,130,200,${dropAlpha.toFixed(2)})`;
        ctx.fillRect(dx, dy, 2, 3);
    }

    // Dark atmospheric fog at ground level
    for (let i = 0; i < 12; i++) {
        const fx = (i * 95 + Math.sin(t * 0.3 + i) * 20) - (near % 95);
        const fy = ch - 60 + Math.sin(t * 0.5 + i * 0.8) * 8;
        const fw = 80 + (i % 4) * 20;
        ctx.fillStyle = 'rgba(20,20,30,0.25)';
        ctx.beginPath();
        ctx.arc(fx, fy, fw * 0.35, 0, Math.PI * 2);
        ctx.fill();
    }
    // Fog gradient overlay at bottom
    const fog = ctx.createLinearGradient(0, ch - 80, 0, ch);
    fog.addColorStop(0, 'rgba(15,15,22,0)');
    fog.addColorStop(1, 'rgba(15,15,22,0.5)');
    ctx.fillStyle = fog;
    ctx.fillRect(0, ch - 80, cw, 80);
};
})();
