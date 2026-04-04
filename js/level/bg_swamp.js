(function() {
'use strict';
if (!W.Backgrounds) W.Backgrounds = {};

W.Backgrounds.swamp = function(ctx, cameraX) {
    const cw = W.CANVAS_W || 960, ch = W.CANVAS_H || 540;
    const t = Date.now() * 0.001;

    // === SKY: sickly murky green ===
    const sky = ctx.createLinearGradient(0, 0, 0, ch);
    sky.addColorStop(0, '#0a1a0a');
    sky.addColorStop(0.5, '#152518');
    sky.addColorStop(1, '#1a2a18');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, cw, ch);

    // === FAR (0.1x): dead tree line, distant ruins ===
    const far = cameraX * 0.1;
    ctx.fillStyle = '#0e180e';
    for (let i = -1; i < 8; i++) {
        const tx = i * 150 - (far % 150);
        // Dead tree trunk
        ctx.fillRect(tx + 60, 260, 6, 140);
        // Bare branches
        ctx.save();
        ctx.translate(tx + 63, 280);
        ctx.rotate(-0.5);
        ctx.fillRect(0, 0, 35, 3);
        ctx.restore();
        ctx.save();
        ctx.translate(tx + 63, 300);
        ctx.rotate(0.4);
        ctx.fillRect(0, 0, 30, 3);
        ctx.restore();
        ctx.save();
        ctx.translate(tx + 63, 320);
        ctx.rotate(-0.3);
        ctx.fillRect(0, 0, 25, 2);
        ctx.restore();
    }
    // Distant ruin silhouette
    const ruinX = 500 - (far % 700);
    ctx.fillStyle = '#0c150c';
    ctx.fillRect(ruinX, 300, 40, 80);
    ctx.fillRect(ruinX + 30, 320, 25, 60);
    ctx.beginPath();
    ctx.moveTo(ruinX - 5, 300); ctx.lineTo(ruinX + 20, 270); ctx.lineTo(ruinX + 45, 300);
    ctx.fill();

    // === MID (0.3x): twisted trees, swamp details ===
    const mid = cameraX * 0.3;
    for (let i = -1; i < 8; i++) {
        const tx = i * 170 - (mid % 170);
        // Gnarled trunk with roots
        ctx.fillStyle = '#1a1a0a';
        ctx.fillRect(tx + 65, 280, 10, 130);
        // Visible roots
        ctx.fillRect(tx + 55, 400, 30, 5);
        ctx.fillRect(tx + 50, 398, 8, 8);
        ctx.fillRect(tx + 85, 398, 8, 8);
        // Branches with hanging moss
        ctx.save();
        ctx.translate(tx + 70, 300);
        ctx.rotate(-0.45);
        ctx.fillRect(0, 0, 40, 4);
        // Moss strings
        ctx.fillStyle = '#2a3a1a';
        ctx.fillRect(15, 3, 2, 18 + Math.sin(t + i) * 3);
        ctx.fillRect(28, 3, 2, 22 + Math.sin(t * 0.8 + i) * 4);
        ctx.fillRect(35, 3, 1, 15 + Math.sin(t * 1.2 + i) * 2);
        ctx.restore();
        ctx.save();
        ctx.fillStyle = '#1a1a0a';
        ctx.translate(tx + 70, 320);
        ctx.rotate(0.35);
        ctx.fillRect(0, 0, 35, 4);
        ctx.fillStyle = '#2a3a1a';
        ctx.fillRect(12, 3, 2, 15 + Math.sin(t * 0.7 + i) * 3);
        ctx.fillRect(25, 3, 1, 20 + Math.sin(t + i * 2) * 4);
        ctx.restore();
    }

    // Mushroom clusters
    for (let i = 0; i < 6; i++) {
        const mx = (i * 190 + 40) - (mid % 190);
        ctx.fillStyle = '#4a3a2a';
        ctx.fillRect(mx, 415, 2, 6);
        ctx.fillStyle = '#8a4a2a';
        ctx.beginPath();
        ctx.arc(mx + 1, 414, 4, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(mx + 6, 417, 2, 4);
        ctx.fillStyle = '#6a3a1a';
        ctx.beginPath();
        ctx.arc(mx + 7, 416, 3, Math.PI, 0);
        ctx.fill();
    }

    // Animated bubbles in water
    ctx.fillStyle = 'rgba(60,100,60,0.4)';
    for (let i = 0; i < 5; i++) {
        const bx = (i * 210 + 80) - (mid % 210);
        const bubblePhase = (t * 0.8 + i * 1.7) % 3;
        if (bubblePhase < 2) {
            const r = bubblePhase * 3;
            const by = 435 - bubblePhase * 5;
            ctx.beginPath();
            ctx.arc(bx, by, r, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // Glowing fungi on trees (pulsing)
    for (let i = 0; i < 8; i++) {
        const fx = (i * 170 + 73) - (mid % 170);
        const pulse = 0.4 + Math.sin(t * 1.5 + i * 1.3) * 0.3;
        ctx.fillStyle = `rgba(60,255,100,${pulse})`;
        ctx.beginPath();
        ctx.arc(fx, 340 + (i % 3) * 20, 3, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.fillStyle = `rgba(60,255,100,${pulse * 0.15})`;
        ctx.beginPath();
        ctx.arc(fx, 340 + (i % 3) * 20, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    // === NEAR (0.6x): cattails, fog ===
    const near = cameraX * 0.6;
    // Cattails/reeds
    for (let i = 0; i < 15; i++) {
        const rx = (i * 70 + 20) - (near % 70);
        const sway = Math.sin(t * 0.6 + i) * 2;
        ctx.fillStyle = '#2a4a1a';
        ctx.fillRect(rx + sway * 0.5, 400, 2, 30);
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(rx - 1 + sway, 398, 4, 6);
    }

    // Rolling fog at ground level
    ctx.fillStyle = 'rgba(40,60,40,0.2)';
    for (let i = -1; i < 6; i++) {
        const fogX = i * 250 - ((t * 10 + near * 0.5) % 250);
        ctx.beginPath();
        ctx.ellipse(fogX + 125, 430, 140, 20, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Fireflies
    for (let i = 0; i < 8; i++) {
        const fx = (i * 130 + Math.sin(t * 0.3 + i * 2) * 30) - (near % 130);
        const fy = 350 + Math.sin(t * 0.5 + i * 1.7) * 40;
        const brightness = 0.3 + Math.sin(t * 2 + i * 3) * 0.3;
        ctx.fillStyle = `rgba(180,255,100,${brightness})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(180,255,100,${brightness * 0.2})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Dead bones on ground
    ctx.fillStyle = 'rgba(180,170,150,0.3)';
    for (let i = 0; i < 3; i++) {
        const bx = (i * 350 + 200) - (near % 350);
        ctx.fillRect(bx, 428, 12, 2);
        ctx.fillRect(bx + 4, 426, 2, 6);
    }
};
})();
