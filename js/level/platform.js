(function() {
'use strict';
const C = W.Colors;

// Deterministic hash for position-based pseudo-random values
function posHash(x, y, seed) {
    let h = (x * 374761393 + y * 668265263 + seed * 1274126177) | 0;
    h = ((h ^ (h >> 13)) * 1103515245 + 12345) | 0;
    return (h & 0x7fffffff) / 0x7fffffff;
}

// Clamp a color channel 0-255
function clamp(v) { return v < 0 ? 0 : v > 255 ? 255 : v | 0; }

W.Platform = class {
    constructor(x, y, w, h, type) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.type = type || 'stone';
    }
    get rect() { return {x:this.x, y:this.y, w:this.w, h:this.h}; }
    draw(ctx) {
        switch(this.type) {
        case 'stone': this._drawStone(ctx); break;
        case 'wood':  this._drawWood(ctx);  break;
        case 'ice':   this._drawIce(ctx);   break;
        }
    }

    // ---- STONE ----
    _drawStone(ctx) {
        const px = this.x, py = this.y, pw = this.w, ph = this.h;
        const brickW = 24, brickH = 12;
        const mortarSize = 2;
        const baseR = 107, baseG = 66, baseB = 38; // #6b4226

        // Fill mortar background
        ctx.fillStyle = '#3a1e0e';
        ctx.fillRect(px, py, pw, ph);

        // Draw individual bricks
        let row = 0;
        for (let by = py; by < py + ph - mortarSize; by += brickH + mortarSize) {
            const offset = (row % 2) * (brickW / 2 + 1); // stagger rows
            let col = 0;
            for (let bx = px - offset; bx < px + pw; bx += brickW + mortarSize) {
                // Clip to platform bounds
                const x0 = bx < px ? px : bx;
                const y0 = by < py ? py : by;
                const x1 = (bx + brickW) > (px + pw) ? (px + pw) : (bx + brickW);
                const y1 = (by + brickH) > (py + ph) ? (py + ph) : (by + brickH);
                if (x1 <= x0 || y1 <= y0) { col++; continue; }

                const bw = x1 - x0, bh = y1 - y0;
                const h = posHash(bx, by, 1);
                const shade = (h - 0.5) * 30;
                const r = clamp(baseR + shade);
                const g = clamp(baseG + shade * 0.6);
                const b = clamp(baseB + shade * 0.4);

                // Brick body with slight rounded shape
                ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                const cr = 1.5; // corner radius
                ctx.beginPath();
                ctx.moveTo(x0 + cr, y0);
                ctx.lineTo(x1 - cr, y0);
                ctx.quadraticCurveTo(x1, y0, x1, y0 + cr);
                ctx.lineTo(x1, y1 - cr);
                ctx.quadraticCurveTo(x1, y1, x1 - cr, y1);
                ctx.lineTo(x0 + cr, y1);
                ctx.quadraticCurveTo(x0, y1, x0, y1 - cr);
                ctx.lineTo(x0, y0 + cr);
                ctx.quadraticCurveTo(x0, y0, x0 + cr, y0);
                ctx.closePath();
                ctx.fill();

                // Brick top highlight (light from above)
                if (bh > 4) {
                    ctx.fillStyle = 'rgba(255,240,210,0.15)';
                    ctx.fillRect(x0 + 1, y0 + 1, bw - 2, 2);
                }
                // Brick bottom shadow
                if (bh > 4) {
                    ctx.fillStyle = 'rgba(0,0,0,0.15)';
                    ctx.fillRect(x0 + 1, y1 - 2, bw - 2, 1);
                }
                // Side edge darkening
                if (bw > 6) {
                    ctx.fillStyle = 'rgba(0,0,0,0.08)';
                    ctx.fillRect(x0, y0, 2, bh);
                    ctx.fillRect(x1 - 2, y0, 2, bh);
                }

                // Moss detail on some bricks
                const mossChance = posHash(bx, by, 7);
                if (mossChance > 0.82 && bw > 6 && bh > 4) {
                    ctx.fillStyle = 'rgba(40,90,30,0.6)';
                    const mx = x0 + (posHash(bx, by, 8) * (bw - 4)) + 2;
                    const my = y0 + (posHash(bx, by, 9) * (bh - 3)) + 1;
                    ctx.fillRect(mx, my, 3, 2);
                    ctx.fillRect(mx + 1, my - 1, 1, 1);
                }
                // Crack detail on some bricks
                const crackChance = posHash(bx, by, 10);
                if (crackChance > 0.88 && bw > 8 && bh > 5) {
                    ctx.strokeStyle = 'rgba(30,15,5,0.4)';
                    ctx.lineWidth = 0.5;
                    const cx = x0 + bw * 0.3;
                    const cy = y0 + bh * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + bw * 0.25, cy + bh * 0.4);
                    ctx.lineTo(cx + bw * 0.45, cy + bh * 0.2);
                    ctx.stroke();
                }

                col++;
            }
            row++;
        }

        // Top edge highlight strip
        const topGrad = ctx.createLinearGradient(px, py, px, py + 4);
        topGrad.addColorStop(0, 'rgba(255,240,200,0.35)');
        topGrad.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(px, py, pw, 4);

        // Bottom edge shadow strip
        const botGrad = ctx.createLinearGradient(px, py + ph - 5, px, py + ph);
        botGrad.addColorStop(0, 'rgba(0,0,0,0)');
        botGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = botGrad;
        ctx.fillRect(px, py + ph - 5, pw, 5);

        // Side edge gradient darkening
        const leftGrad = ctx.createLinearGradient(px, py, px + 6, py);
        leftGrad.addColorStop(0, 'rgba(0,0,0,0.2)');
        leftGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = leftGrad;
        ctx.fillRect(px, py, 6, ph);

        const rightGrad = ctx.createLinearGradient(px + pw - 6, py, px + pw, py);
        rightGrad.addColorStop(0, 'rgba(0,0,0,0)');
        rightGrad.addColorStop(1, 'rgba(0,0,0,0.2)');
        ctx.fillStyle = rightGrad;
        ctx.fillRect(px + pw - 6, py, 6, ph);
    }

    // ---- WOOD ----
    _drawWood(ctx) {
        const px = this.x, py = this.y, pw = this.w, ph = this.h;
        const plankH = Math.max(8, ph); // single thick plank for thin platforms
        const plankCount = Math.max(1, Math.floor(ph / plankH));

        // Base wood fill
        ctx.fillStyle = '#6a4a2a';
        ctx.fillRect(px, py, pw, ph);

        // Draw planks
        for (let i = 0; i < plankCount; i++) {
            const plankY = py + i * plankH;
            const pHeight = Math.min(plankH, py + ph - plankY);

            // Plank base with slight shade variation
            const shade = posHash(px, plankY, 3);
            const r = clamp(106 + (shade - 0.5) * 20);
            const g = clamp(74 + (shade - 0.5) * 14);
            const b = clamp(42 + (shade - 0.5) * 10);
            ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            ctx.fillRect(px, plankY, pw, pHeight);

            // Wood grain lines - multiple thin lines of varying shade
            for (let gy = 0; gy < pHeight; gy += 2) {
                const grainShade = posHash(px, plankY + gy, 4);
                if (grainShade > 0.35) continue;
                const alpha = 0.08 + grainShade * 0.12;
                const dark = posHash(px + 1, plankY + gy, 5) > 0.5;
                ctx.strokeStyle = dark
                    ? 'rgba(40,20,5,' + alpha + ')'
                    : 'rgba(140,100,60,' + alpha + ')';
                ctx.lineWidth = 0.5 + grainShade;
                ctx.beginPath();
                // Slight waviness in grain
                let gx = px;
                ctx.moveTo(gx, plankY + gy);
                while (gx < px + pw) {
                    const seg = 12 + posHash(gx, plankY + gy, 6) * 20;
                    const waveY = plankY + gy + (posHash(gx, plankY + gy, 7) - 0.5) * 1.2;
                    gx += seg;
                    ctx.lineTo(Math.min(gx, px + pw), waveY);
                }
                ctx.stroke();
            }

            // Plank separator line (gap between planks)
            if (i > 0) {
                ctx.fillStyle = 'rgba(20,10,0,0.4)';
                ctx.fillRect(px, plankY, pw, 1);
                ctx.fillStyle = 'rgba(130,100,60,0.2)';
                ctx.fillRect(px, plankY + 1, pw, 1);
            }

            // Knot holes (dark circles) on some planks
            for (let k = 0; k < 3; k++) {
                const knotChance = posHash(px + k * 47, plankY, 11);
                if (knotChance > 0.18) continue;
                const kx = px + 10 + posHash(px + k, plankY, 12) * (pw - 20);
                const ky = plankY + 2 + posHash(px + k, plankY, 13) * (pHeight - 4);
                const kr = 1.5 + posHash(px + k, plankY, 14) * 1.5;
                // Knot ring
                ctx.fillStyle = 'rgba(50,25,8,0.6)';
                ctx.beginPath();
                ctx.arc(kx, ky, kr + 0.8, 0, Math.PI * 2);
                ctx.fill();
                // Knot center
                ctx.fillStyle = 'rgba(30,12,0,0.8)';
                ctx.beginPath();
                ctx.arc(kx, ky, kr, 0, Math.PI * 2);
                ctx.fill();
            }

            // Nail heads at regular intervals along plank
            ctx.fillStyle = 'rgba(40,35,30,0.7)';
            for (let nx = px + 8; nx < px + pw - 4; nx += 28 + (posHash(nx, plankY, 15) * 8 | 0)) {
                const ny = plankY + pHeight * 0.4 + posHash(nx, plankY, 16) * pHeight * 0.3;
                ctx.beginPath();
                ctx.arc(nx, ny, 1.2, 0, Math.PI * 2);
                ctx.fill();
                // Tiny highlight on nail
                ctx.fillStyle = 'rgba(180,170,150,0.3)';
                ctx.fillRect(nx - 0.5, ny - 1, 1, 1);
                ctx.fillStyle = 'rgba(40,35,30,0.7)';
            }
        }

        // Top edge with slight sine wave warp and highlight
        ctx.strokeStyle = 'rgba(180,150,100,0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        for (let wx = 0; wx <= pw; wx += 3) {
            const warp = Math.sin(wx * 0.08 + posHash(px, py, 17) * 6.28) * 0.8;
            ctx.lineTo(px + wx, py + warp);
        }
        ctx.stroke();

        // Lighter highlight on top 2px
        const topG = ctx.createLinearGradient(px, py, px, py + 3);
        topG.addColorStop(0, 'rgba(200,170,120,0.3)');
        topG.addColorStop(1, 'rgba(200,170,120,0)');
        ctx.fillStyle = topG;
        ctx.fillRect(px, py, pw, 3);

        // Bottom shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(px, py + ph - 2, pw, 2);
    }

    // ---- ICE ----
    _drawIce(ctx) {
        const px = this.x, py = this.y, pw = this.w, ph = this.h;

        // Slightly melted/rounded edges - clip with rounded rect
        ctx.save();
        const er = 3; // edge radius
        ctx.beginPath();
        ctx.moveTo(px + er, py);
        ctx.lineTo(px + pw - er, py);
        ctx.quadraticCurveTo(px + pw, py, px + pw, py + er);
        ctx.lineTo(px + pw, py + ph - er);
        ctx.quadraticCurveTo(px + pw, py + ph, px + pw - er, py + ph);
        ctx.lineTo(px + er, py + ph);
        ctx.quadraticCurveTo(px, py + ph, px, py + ph - er);
        ctx.lineTo(px, py + er);
        ctx.quadraticCurveTo(px, py, px + er, py);
        ctx.closePath();
        ctx.clip();

        // Semi-transparent blue-white gradient fill
        const iceGrad = ctx.createLinearGradient(px, py, px, py + ph);
        iceGrad.addColorStop(0, 'rgba(200,230,245,0.85)');
        iceGrad.addColorStop(0.3, 'rgba(140,195,220,0.8)');
        iceGrad.addColorStop(0.7, 'rgba(110,175,205,0.75)');
        iceGrad.addColorStop(1, 'rgba(90,155,190,0.8)');
        ctx.fillStyle = iceGrad;
        ctx.fillRect(px, py, pw, ph);

        // Horizontal gradient for depth
        const hGrad = ctx.createLinearGradient(px, py, px + pw, py);
        hGrad.addColorStop(0, 'rgba(255,255,255,0.1)');
        hGrad.addColorStop(0.3, 'rgba(255,255,255,0)');
        hGrad.addColorStop(0.7, 'rgba(255,255,255,0)');
        hGrad.addColorStop(1, 'rgba(200,220,240,0.15)');
        ctx.fillStyle = hGrad;
        ctx.fillRect(px, py, pw, ph);

        // Internal crack lines
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 0.5;
        for (let c = 0; c < 5; c++) {
            const cx = px + posHash(px, py, 20 + c) * pw;
            const cy = py + posHash(px, py, 25 + c) * ph;
            const angle = posHash(px, py, 30 + c) * Math.PI;
            const len = 6 + posHash(px, py, 35 + c) * 14;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len * 0.5);
            // Branch
            const bx = cx + Math.cos(angle) * len * 0.6;
            const by = cy + Math.sin(angle) * len * 0.3;
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(angle + 0.8) * len * 0.3, by + Math.sin(angle + 0.8) * len * 0.2);
            ctx.stroke();
        }

        // Bright white shine streaks (2-3 short angled lines)
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        for (let s = 0; s < 3; s++) {
            const sx = px + 8 + posHash(px, py, 40 + s) * (pw - 16);
            const sy = py + 2 + posHash(px, py, 43 + s) * (ph * 0.4);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + 6 + posHash(px, py, 46 + s) * 8, sy + 1);
            ctx.stroke();
        }
        ctx.lineCap = 'butt';

        // Sparkle points that animate using position-based pattern
        // Uses a time-like cycle based on platform position to create shimmering
        const time = typeof W.gameTime === 'number' ? W.gameTime : Date.now() * 0.001;
        for (let sp = 0; sp < 6; sp++) {
            const spx = px + 4 + posHash(px, py, 50 + sp) * (pw - 8);
            const spy = py + 2 + posHash(px, py, 56 + sp) * (ph - 4);
            // Each sparkle has its own phase based on position
            const phase = posHash(spx | 0, spy | 0, 62) * 6.28;
            const brightness = Math.sin(time * 2.5 + phase + sp * 1.1);
            if (brightness > 0.3) {
                const alpha = (brightness - 0.3) * 0.7;
                const sz = 1 + brightness * 1.5;
                ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(2) + ')';
                // Draw a tiny 4-point star
                ctx.beginPath();
                ctx.moveTo(spx, spy - sz);
                ctx.lineTo(spx + sz * 0.3, spy);
                ctx.lineTo(spx, spy + sz);
                ctx.lineTo(spx - sz * 0.3, spy);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(spx - sz, spy);
                ctx.lineTo(spx, spy + sz * 0.3);
                ctx.lineTo(spx + sz, spy);
                ctx.lineTo(spx, spy - sz * 0.3);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Top edge bright highlight
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fillRect(px, py, pw, 2);

        ctx.restore();
    }
};

})();
