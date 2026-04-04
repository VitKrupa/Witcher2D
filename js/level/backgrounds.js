(function() {
'use strict';

W.Backgrounds = {
    // Each draws a full-screen parallax background onto ctx
    // cameraX = current camera offset, canvasW/H = 960/540

    village: function(ctx, cameraX) {
        const cw = W.CANVAS_W || 960, ch = W.CANVAS_H || 400;
        // Sky - overcast grey
        const sky = ctx.createLinearGradient(0, 0, 0, ch);
        sky.addColorStop(0, '#3a3a44');
        sky.addColorStop(1, '#5a5a60');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, cw, ch);

        const gnd = W.GROUND_Y || 340;
        // Far layer (0.1x) - rolling hills
        const far = cameraX * 0.1;
        ctx.fillStyle = '#2a2a30';
        for (let i = -1; i < 4; i++) {
            const bx = i * 400 - (far % 400);
            ctx.beginPath();
            ctx.moveTo(bx, gnd - 60); ctx.quadraticCurveTo(bx+200, gnd - 130, bx+400, gnd - 60);
            ctx.lineTo(bx+400, ch); ctx.lineTo(bx, ch); ctx.fill();
        }

        // Mid layer (0.3x) - village building silhouettes
        const mid = cameraX * 0.3;
        ctx.fillStyle = '#3a3028';
        for (let i = -1; i < 6; i++) {
            const bx = i * 200 - (mid % 200);
            // House shape
            ctx.fillRect(bx+20, gnd - 70, 60, 80);
            // Roof triangle
            ctx.beginPath();
            ctx.moveTo(bx+15, gnd - 70); ctx.lineTo(bx+50, gnd - 100); ctx.lineTo(bx+85, gnd - 70); ctx.fill();
            // Window glow
            ctx.fillStyle = '#554422';
            ctx.fillRect(bx+35, gnd - 50, 10, 12);
            ctx.fillStyle = '#3a3028';
        }

        // Fence posts
        ctx.fillStyle = '#4a3a20';
        for (let i = 0; i < 20; i++) {
            const fx = i * 60 - (mid % 60);
            ctx.fillRect(fx, gnd - 10, 3, 20);
            if (i % 2 === 0) ctx.fillRect(fx, gnd - 4, 60, 2);
        }
    },

    swamp: function(ctx, cameraX) {
        const cw = W.CANVAS_W || 960, ch = W.CANVAS_H || 400;
        // Sky - murky green
        const sky = ctx.createLinearGradient(0, 0, 0, ch);
        sky.addColorStop(0, '#0a1a0a');
        sky.addColorStop(0.6, '#1a2a18');
        sky.addColorStop(1, '#2a3a20');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, cw, ch);

        // Fog layer
        ctx.fillStyle = 'rgba(40,60,40,0.3)';
        const fogOff = cameraX * 0.05;
        for (let i = -1; i < 5; i++) {
            const fx = i * 300 - (fogOff % 300);
            ctx.beginPath();
            ctx.ellipse(fx+150, 360, 180, 40, 0, 0, Math.PI*2);
            ctx.fill();
        }

        // Twisted trees (0.3x)
        const mid = cameraX * 0.3;
        ctx.fillStyle = '#1a1a0a';
        for (let i = -1; i < 8; i++) {
            const tx = i * 160 - (mid % 160);
            // Trunk
            ctx.fillRect(tx+70, 250, 8, 170);
            // Branches - twisted
            ctx.save();
            ctx.translate(tx+74, 280);
            ctx.rotate(-0.4);
            ctx.fillRect(0, 0, 40, 4);
            ctx.restore();
            ctx.save();
            ctx.translate(tx+74, 300);
            ctx.rotate(0.3);
            ctx.fillRect(0, 0, 35, 4);
            ctx.restore();
            // Hanging moss
            ctx.fillStyle = '#2a3a1a';
            ctx.fillRect(tx+90, 278, 2, 20);
            ctx.fillRect(tx+100, 275, 2, 15);
            ctx.fillStyle = '#1a1a0a';
        }

        // Glowing fungi
        ctx.fillStyle = '#44ff66';
        ctx.globalAlpha = 0.3 + Math.sin(Date.now()*0.002)*0.15;
        for (let i = 0; i < 10; i++) {
            const gx = ((i*137+50) % 900) - (cameraX*0.2 % 300);
            ctx.beginPath();
            ctx.arc(gx, 420 + (i%3)*15, 3, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },

    castle: function(ctx, cameraX) {
        const cw = W.CANVAS_W || 960, ch = W.CANVAS_H || 400;
        // Dark interior
        ctx.fillStyle = '#0e0e14';
        ctx.fillRect(0, 0, cw, ch);

        // Stone wall texture (0.2x)
        const wall = cameraX * 0.2;
        ctx.fillStyle = '#1a1a20';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#151520';
        for (let bx = 0; bx < cw + 40; bx += 40) {
            for (let by = 0; by < ch; by += 20) {
                const offset = (Math.floor(by/20) % 2) * 20;
                ctx.fillRect(bx - (wall%40) + offset, by, 38, 18);
            }
        }

        // Arched windows (0.3x)
        const mid = cameraX * 0.3;
        for (let i = -1; i < 5; i++) {
            const wx = i * 250 - (mid % 250);
            // Window arch
            ctx.fillStyle = '#1a2040';
            ctx.fillRect(wx+90, 100, 40, 60);
            ctx.beginPath();
            ctx.arc(wx+110, 100, 20, Math.PI, 0);
            ctx.fill();
            // Moonlight through window
            ctx.fillStyle = 'rgba(60,60,100,0.15)';
            ctx.beginPath();
            ctx.moveTo(wx+90, 160); ctx.lineTo(wx+70, 450);
            ctx.lineTo(wx+150, 450); ctx.lineTo(wx+130, 160);
            ctx.fill();
        }

        // Torch glow circles
        ctx.fillStyle = 'rgba(200,130,40,0.08)';
        for (let i = -1; i < 6; i++) {
            const tx = i * 200 - (mid % 200);
            ctx.beginPath();
            ctx.arc(tx+100, 280, 60 + Math.sin(Date.now()*0.003+i)*5, 0, Math.PI*2);
            ctx.fill();
            // Torch bracket
            ctx.fillStyle = '#444';
            ctx.fillRect(tx+97, 260, 6, 15);
            // Flame
            ctx.fillStyle = '#ff8822';
            ctx.fillRect(tx+96, 253, 8, 8);
            ctx.fillStyle = '#ffcc44';
            ctx.fillRect(tx+98, 250, 4, 6);
            ctx.fillStyle = 'rgba(200,130,40,0.08)';
        }
    },

    battlefield: function(ctx, cameraX) {
        const cw = W.CANVAS_W || 960, ch = W.CANVAS_H || 400;
        // Dusk sky - red/orange
        const sky = ctx.createLinearGradient(0, 0, 0, ch);
        sky.addColorStop(0, '#1a0a0a');
        sky.addColorStop(0.3, '#4a1a0a');
        sky.addColorStop(0.6, '#6a3010');
        sky.addColorStop(1, '#2a1a0a');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, cw, ch);

        // Sun on horizon
        ctx.fillStyle = '#cc4400';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(cw*0.7, 320, 50, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Ruined siege silhouettes (0.2x)
        const far = cameraX * 0.2;
        ctx.fillStyle = '#1a0a05';
        for (let i = -1; i < 5; i++) {
            const sx = i * 280 - (far % 280);
            // Catapult wreck
            ctx.fillRect(sx+40, 340, 60, 6);
            ctx.fillRect(sx+50, 300, 8, 40);
            ctx.fillRect(sx+40, 300, 30, 5);
            // Broken wheel
            ctx.beginPath();
            ctx.arc(sx+55, 346, 12, 0, Math.PI*2);
            ctx.stroke();
        }

        // Scattered bones/debris (0.4x)
        const mid = cameraX * 0.4;
        ctx.fillStyle = '#bba888';
        for (let i = 0; i < 15; i++) {
            const bx = ((i*97+30) % 800) - (mid % 200);
            ctx.fillRect(bx, 430 + (i%3)*8, 12, 2);
            ctx.fillRect(bx+4, 428+(i%3)*8, 2, 6);
        }

        // Smoke columns
        ctx.fillStyle = 'rgba(40,20,10,0.2)';
        for (let i = 0; i < 3; i++) {
            const smx = (i*350+100) - (far % 350);
            ctx.fillRect(smx, 200, 15, 150);
            ctx.beginPath();
            ctx.ellipse(smx+7, 200, 25, 12, 0, 0, Math.PI*2);
            ctx.fill();
        }
    },

    mountain: function(ctx, cameraX) {
        const cw = W.CANVAS_W || 960, ch = W.CANVAS_H || 400;
        // Night sky
        const sky = ctx.createLinearGradient(0, 0, 0, ch);
        sky.addColorStop(0, '#050818');
        sky.addColorStop(1, '#1a2a4a');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, cw, ch);

        // Stars
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 40; i++) {
            const sx = (i*73+17) % cw;
            const sy = (i*47+11) % 250;
            const sz = (i % 3 === 0) ? 2 : 1;
            ctx.globalAlpha = 0.3 + (i%5)*0.15;
            ctx.fillRect(sx, sy, sz, sz);
        }
        ctx.globalAlpha = 1;

        // Aurora borealis
        ctx.globalAlpha = 0.12;
        const t = Date.now() * 0.0005;
        ctx.fillStyle = '#22ff88';
        ctx.fillRect(0, 60 + Math.sin(t)*10, cw, 15);
        ctx.fillStyle = '#44aaff';
        ctx.fillRect(0, 80 + Math.sin(t+1)*12, cw, 10);
        ctx.fillStyle = '#8844ff';
        ctx.fillRect(0, 95 + Math.sin(t+2)*8, cw, 8);
        ctx.globalAlpha = 1;

        // Snow mountains (0.15x)
        const far = cameraX * 0.15;
        ctx.fillStyle = '#1a2a4a';
        for (let i = -1; i < 5; i++) {
            const mx = i * 350 - (far % 350);
            ctx.beginPath();
            ctx.moveTo(mx, 400); ctx.lineTo(mx+175, 180); ctx.lineTo(mx+350, 400); ctx.fill();
            // Snow caps
            ctx.fillStyle = '#ddeeff';
            ctx.beginPath();
            ctx.moveTo(mx+140, 240); ctx.lineTo(mx+175, 180); ctx.lineTo(mx+210, 240);
            ctx.fill();
            ctx.fillStyle = '#1a2a4a';
        }

        // Mid mountains (0.3x)
        const mid = cameraX * 0.3;
        ctx.fillStyle = '#152035';
        for (let i = -1; i < 6; i++) {
            const mx = i * 250 - (mid % 250);
            ctx.beginPath();
            ctx.moveTo(mx, 420); ctx.lineTo(mx+125, 300); ctx.lineTo(mx+250, 420);
            ctx.lineTo(mx+250, ch); ctx.lineTo(mx, ch);
            ctx.fill();
        }

        // Wind/snow particles
        ctx.fillStyle = '#ddeeff';
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 20; i++) {
            const px = ((Date.now()*0.05 + i*47) % (cw+100)) - 50;
            const py = (i*31+10) % ch;
            ctx.fillRect(px, py, 3, 1);
        }
        ctx.globalAlpha = 1;
    }
};

})();
