(function() {
'use strict';
if (!W.Backgrounds) W.Backgrounds = {};
W.Backgrounds.mountain = function(ctx, cameraX) {
    const cw = W.CANVAS_W || 960, ch = W.CANVAS_H || 400, t = Date.now() * 0.001;
    // SKY: deep night blue gradient
    var skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
    skyGrad.addColorStop(0, '#050818');
    skyGrad.addColorStop(1, '#1a2a4a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);
    // STARS: twinkling
    var starSeed = [
        [120,30],[45,80],[300,25],[410,60],[520,15],[670,45],[780,70],[850,20],[90,120],[200,90],
        [340,110],[460,35],[560,100],[630,55],[720,10],[810,95],[150,140],[270,65],[390,130],[500,50],
        [610,125],[740,40],[55,55],[180,105],[330,75],[440,20],[580,85],[695,115],[770,60],[880,35],
        [100,10],[230,48],[370,92],[490,135],[550,28],[650,72],[730,108],[820,52],[910,88],[30,68],
        [260,42],[420,118],[590,8],[710,98],[840,128],[160,58],[310,22],[470,78],[620,38],[760,132]
    ];
    for (var i = 0; i < starSeed.length; i++) {
        var sx = starSeed[i][0], sy = starSeed[i][1];
        var flicker = 0.5 + 0.5 * Math.sin(t * (1.5 + (i % 7) * 0.4) + i * 2.3);
        ctx.globalAlpha = 0.4 + 0.6 * flicker;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx, sy, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;
    // MOON with glow and craters
    var mx = 760, my = 80;
    ctx.beginPath(); ctx.arc(mx, my, 50, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,220,255,0.08)'; ctx.fill();
    ctx.beginPath(); ctx.arc(mx, my, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(220,230,255,0.15)'; ctx.fill();
    ctx.beginPath(); ctx.arc(mx, my, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#e8eeff'; ctx.fill();
    ctx.fillStyle = 'rgba(180,190,210,0.5)';
    ctx.beginPath(); ctx.arc(mx - 5, my - 4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 7, my + 3, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx - 2, my + 7, 2.5, 0, Math.PI * 2); ctx.fill();
    // AURORA BOREALIS: undulating color bands
    var auroraColors = ['rgba(34,255,136,0.12)', 'rgba(68,170,255,0.10)', 'rgba(136,68,255,0.09)', 'rgba(34,255,136,0.07)'];
    for (var a = 0; a < 4; a++) {
        ctx.beginPath();
        var baseY = 60 + a * 30;
        ctx.moveTo(0, baseY + Math.sin(t * 0.3 + a) * 10);
        for (var ax = 0; ax <= cw; ax += 20) {
            var ay = baseY + Math.sin(ax * 0.008 + t * (0.4 + a * 0.15) + a * 1.5) * 18 + Math.sin(ax * 0.015 + t * 0.2) * 8;
            ctx.lineTo(ax, ay);
        }
        ctx.lineTo(cw, baseY + 35); ctx.lineTo(0, baseY + 35); ctx.closePath();
        ctx.fillStyle = auroraColors[a]; ctx.fill();
    }
    // FAR MOUNTAINS (0.15x parallax): massive snow-capped peaks
    var farOff = -(cameraX * 0.15) % cw;
    ctx.fillStyle = '#2a3550';
    var farPeaks = [[0,200,250],[200,160,220],[400,180,240],[600,140,260],[800,170,230],[1000,190,210]];
    for (var f = 0; f < farPeaks.length; f++) {
        var fp = farPeaks[f], fx = fp[0] + farOff;
        ctx.beginPath(); ctx.moveTo(fx - fp[2] / 2, ch); ctx.lineTo(fx, fp[1]); ctx.lineTo(fx + fp[2] / 2, ch); ctx.fill();
        // snow caps
        ctx.fillStyle = '#dde8f0';
        ctx.beginPath(); ctx.moveTo(fx - 25, fp[1] + 40); ctx.lineTo(fx, fp[1]); ctx.lineTo(fx + 25, fp[1] + 40); ctx.fill();
        ctx.fillStyle = '#2a3550';
    }
    // MID LAYER (0.3x parallax): rocky cliffs, pines, snow drifts
    var midOff = -(cameraX * 0.3) % cw;
    ctx.fillStyle = '#1e2a3a';
    var midPeaks = [[50,280,180],[250,300,160],[480,260,200],[700,290,170],[920,270,190],[1100,310,150]];
    for (var m = 0; m < midPeaks.length; m++) {
        var mp = midPeaks[m], mpx = mp[0] + midOff;
        ctx.beginPath(); ctx.moveTo(mpx - mp[2] / 2, ch); ctx.lineTo(mpx, mp[1]); ctx.lineTo(mpx + mp[2] / 2, ch); ctx.fill();
    }
    // Pine tree silhouettes (3 sizes)
    ctx.fillStyle = '#0e1a22';
    var pines = [[80,420,12,30],[160,430,8,20],[230,425,15,38],[350,435,10,24],[440,418,14,35],
                 [550,432,9,22],[640,420,13,32],[750,428,11,26],[860,422,16,40],[950,434,7,18]];
    for (var p = 0; p < pines.length; p++) {
        var pp = pines[p], px = pp[0] + midOff;
        ctx.beginPath(); ctx.moveTo(px, pp[1] - pp[3]); ctx.lineTo(px - pp[2], pp[1]); ctx.lineTo(px + pp[2], pp[1]); ctx.fill();
        ctx.fillRect(px - 1.5, pp[1], 3, 6);
    }
    // Snow drifts at base
    ctx.fillStyle = 'rgba(210,225,240,0.6)';
    for (var d = 0; d < 5; d++) {
        var dx = d * 220 + 60 + midOff, dy = ch - 30;
        ctx.beginPath(); ctx.ellipse(dx, dy, 60, 14, 0, 0, Math.PI * 2); ctx.fill();
    }
    // NEAR LAYER (0.6x parallax)
    var nearOff = -(cameraX * 0.6) % cw;
    // Frozen stream
    ctx.fillStyle = 'rgba(120,180,220,0.35)';
    ctx.fillRect(0, ch - 50, cw, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (var sl = 0; sl < 8; sl++) {
        var slx = sl * 130 + 20 + nearOff * 0.5;
        ctx.fillRect(slx % cw, ch - 45, 40, 3);
    }
    // Icicles from top of screen
    ctx.fillStyle = 'rgba(180,210,240,0.7)';
    var icicles = [30,95,170,260,340,430,510,600,680,770,850,920];
    for (var ic = 0; ic < icicles.length; ic++) {
        var ix = icicles[ic] + (nearOff * 0.2) % 40, ilen = 18 + (ic * 7) % 22;
        ctx.beginPath(); ctx.moveTo(ix - 3, 0); ctx.lineTo(ix, ilen); ctx.lineTo(ix + 3, 0); ctx.fill();
    }
    // Blowing snow particles
    for (var s = 0; s < 18; s++) {
        var sPhase = s * 47.3 + t * 60;
        var snx = ((sPhase * 1.7) % (cw + 100)) - 50 + nearOff * 0.3;
        var sny = 100 + (s * 73.7) % (ch - 150) + Math.sin(t * 2 + s) * 15;
        snx = ((snx % cw) + cw) % cw;
        ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t * 3 + s * 1.1);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(snx, sny, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    // Ice crystals: bright flashes
    ctx.globalAlpha = 1;
    for (var c = 0; c < 8; c++) {
        var cFlash = Math.sin(t * (4 + c * 0.7) + c * 5.1);
        if (cFlash > 0.85) {
            var cx = (c * 131.7 + nearOff * 0.4) % cw, cy = 150 + (c * 89.3) % 300;
            cx = ((cx % cw) + cw) % cw;
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillRect(cx - 3, cy, 6, 1); ctx.fillRect(cx, cy - 3, 1, 6);
        }
    }
    ctx.globalAlpha = 1;
};
})();
