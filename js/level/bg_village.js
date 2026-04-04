(function() {
'use strict';
// Ensure W.Backgrounds exists (may be created by another file)
if (!W.Backgrounds) W.Backgrounds = {};

W.Backgrounds.village = function(ctx, cameraX) {
    const cw = 960, ch = 540;
    const t = Date.now() * 0.001; // time in seconds

    // === SKY: overcast gradient with clouds ===
    const sky = ctx.createLinearGradient(0, 0, 0, ch);
    sky.addColorStop(0, '#3a3a48');
    sky.addColorStop(0.5, '#4a4a55');
    sky.addColorStop(1, '#5a5a60');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, cw, ch);

    // Clouds (soft rounded shapes)
    ctx.fillStyle = 'rgba(80,80,90,0.4)';
    for (let i = 0; i < 6; i++) {
        const cx = ((i * 200 + t * 8) % (cw + 200)) - 100;
        const cy = 40 + (i % 3) * 35;
        const w = 80 + (i % 4) * 30;
        ctx.beginPath();
        ctx.arc(cx, cy, w * 0.3, 0, Math.PI * 2);
        ctx.arc(cx + w * 0.25, cy - 8, w * 0.25, 0, Math.PI * 2);
        ctx.arc(cx + w * 0.5, cy, w * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Occasional crow silhouette
    ctx.fillStyle = '#222';
    const crowX = ((t * 40) % (cw + 100)) - 50;
    const crowY = 80 + Math.sin(t * 2) * 15;
    ctx.beginPath();
    ctx.moveTo(crowX, crowY);
    ctx.quadraticCurveTo(crowX - 6, crowY - 4, crowX - 12, crowY + 2);
    ctx.quadraticCurveTo(crowX - 6, crowY - 2, crowX, crowY);
    ctx.quadraticCurveTo(crowX + 6, crowY - 2, crowX + 12, crowY + 2);
    ctx.quadraticCurveTo(crowX + 6, crowY - 4, crowX, crowY);
    ctx.fill();

    // === FAR (0.1x): rolling hills with tree silhouettes ===
    const far = cameraX * 0.1;
    ctx.fillStyle = '#2a2a32';
    for (let i = -1; i < 5; i++) {
        const bx = i * 350 - (far % 350);
        ctx.beginPath();
        ctx.moveTo(bx, 370);
        ctx.quadraticCurveTo(bx + 90, 300, bx + 180, 340);
        ctx.quadraticCurveTo(bx + 260, 280, bx + 350, 370);
        ctx.lineTo(bx + 350, ch); ctx.lineTo(bx, ch);
        ctx.fill();
    }
    // Distant trees on hills
    ctx.fillStyle = '#1a2a1a';
    for (let i = 0; i < 12; i++) {
        const tx = (i * 110 + 30) - (far % 110);
        ctx.beginPath();
        ctx.moveTo(tx, 330); ctx.lineTo(tx + 8, 290); ctx.lineTo(tx + 16, 330);
        ctx.fill();
    }
    // Church steeple
    const steepleX = 600 - (far % 800);
    ctx.fillStyle = '#222230';
    ctx.fillRect(steepleX, 280, 12, 60);
    ctx.beginPath();
    ctx.moveTo(steepleX - 2, 280); ctx.lineTo(steepleX + 6, 255); ctx.lineTo(steepleX + 14, 280);
    ctx.fill();

    // === MID (0.3x): village buildings ===
    const mid = cameraX * 0.3;
    for (let i = -1; i < 8; i++) {
        const bx = i * 180 - (mid % 180);
        const bh = 50 + (i % 3) * 15;
        // House body
        ctx.fillStyle = '#3a3028';
        ctx.fillRect(bx + 20, 400 - bh, 55, bh);
        // Roof
        ctx.fillStyle = '#2a2018';
        ctx.beginPath();
        ctx.moveTo(bx + 14, 400 - bh); ctx.lineTo(bx + 47, 400 - bh - 25); ctx.lineTo(bx + 80, 400 - bh);
        ctx.fill();
        // Window (some lit)
        if (i % 2 === 0) {
            ctx.fillStyle = '#8a7a3a'; // warm light
            ctx.fillRect(bx + 35, 400 - bh + 12, 8, 10);
            // Window glow
            ctx.fillStyle = 'rgba(140,120,50,0.15)';
            ctx.beginPath();
            ctx.arc(bx + 39, 400 - bh + 17, 18, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#252520'; // dark window
            ctx.fillRect(bx + 35, 400 - bh + 12, 8, 10);
        }
        // Door
        ctx.fillStyle = '#2a2018';
        ctx.fillRect(bx + 40, 400 - 16, 10, 16);
        // Chimney with smoke
        ctx.fillStyle = '#333';
        ctx.fillRect(bx + 55, 400 - bh - 20, 6, 15);
        // Animated smoke wisps
        if (i % 3 === 0) {
            ctx.fillStyle = 'rgba(100,100,110,0.25)';
            for (let s = 0; s < 3; s++) {
                const sy = 400 - bh - 25 - s * 12 - ((t * 15 + i * 7) % 40);
                const sx = bx + 57 + Math.sin(t * 0.8 + s + i) * 5;
                ctx.beginPath();
                ctx.arc(sx, sy, 4 + s * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // === NEAR (0.6x): details ===
    const near = cameraX * 0.6;
    // Fence posts with cross-beams
    ctx.fillStyle = '#4a3a20';
    for (let i = 0; i < 20; i++) {
        const fx = i * 55 - (near % 55);
        ctx.fillRect(fx, 405, 3, 18);
        if (i % 2 === 0) ctx.fillRect(fx, 410, 55, 2);
        if (i % 2 === 0) ctx.fillRect(fx, 416, 55, 2);
    }
    // Barrels
    for (let i = 0; i < 4; i++) {
        const bx = i * 260 + 100 - (near % 260);
        ctx.fillStyle = '#5a4020';
        ctx.fillRect(bx, 408, 14, 16);
        ctx.fillStyle = '#444';
        ctx.fillRect(bx, 411, 14, 2);
        ctx.fillRect(bx, 418, 14, 2);
    }
    // Hanging lanterns with glow
    for (let i = 0; i < 5; i++) {
        const lx = i * 220 + 50 - (near % 220);
        // Post
        ctx.fillStyle = '#444';
        ctx.fillRect(lx, 390, 2, 14);
        ctx.fillRect(lx - 6, 390, 14, 2);
        // Lantern
        ctx.fillStyle = '#aa8822';
        ctx.fillRect(lx - 3, 392, 6, 8);
        // Flame flicker
        const flicker = Math.sin(t * 6 + i * 2) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255,200,80,${flicker * 0.8})`;
        ctx.fillRect(lx - 1, 394, 3, 4);
        // Warm glow
        ctx.fillStyle = `rgba(200,150,50,${flicker * 0.08})`;
        ctx.beginPath();
        ctx.arc(lx, 396, 25, 0, Math.PI * 2);
        ctx.fill();
    }
    // Cobblestone hints on ground
    ctx.fillStyle = 'rgba(60,55,45,0.3)';
    for (let i = 0; i < 30; i++) {
        const cx = ((i * 37 + 5) % cw);
        ctx.fillRect(cx - (near % 37), 425 + (i % 3) * 4, 8, 3);
    }
};
})();
