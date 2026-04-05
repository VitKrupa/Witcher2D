(function() {
'use strict';

// Deterministic hash for textures
function posHash(x, y, s) {
    var h = (x * 374761 + y * 668265 + (s||0) * 127412) | 0;
    h = ((h ^ (h >> 13)) * 1103515 + 12345) | 0;
    return (h & 0x7fffffff) / 0x7fffffff;
}

// Theme color palettes
var THEMES = {
    village: {
        wall: '#4a3a2a', wallDark: '#3a2a1a', wallLight: '#5a4a3a',
        floor: '#5a4a30', floorDark: '#4a3a20',
        mortar: '#2a1a0a', beam: '#3a2a18',
        interior: '#1a1410'
    },
    swamp: {
        wall: '#2a3a1e', wallDark: '#1a2a0e', wallLight: '#3a4a2e',
        floor: '#2a2010', floorDark: '#1a1008',
        mortar: '#0a1a00', beam: '#1a2a0a',
        interior: '#0a0e08'
    },
    castle: {
        wall: '#2a1a0e', wallDark: '#1a0e05', wallLight: '#3a2a1e',
        floor: '#3a3030', floorDark: '#2a2020',
        mortar: '#0a0a05', beam: '#1a1010',
        interior: '#0e0a08'
    },
    battlefield: {
        wall: '#3a2a1a', wallDark: '#2a1a0a', wallLight: '#4a3a2a',
        floor: '#3a3020', floorDark: '#2a2010',
        mortar: '#1a0a00', beam: '#2a1a0a',
        interior: '#121008'
    },
    mountain: {
        wall: '#1a2a3a', wallDark: '#0a1a2a', wallLight: '#2a3a4a',
        floor: '#2a3a4a', floorDark: '#1a2a3a',
        mortar: '#0a1020', beam: '#1a2030',
        interior: '#080a10'
    }
};

W.Room = class {
    constructor(cfg) {
        this.x = cfg.x;
        this.y = cfg.y || 60;
        this.w = cfg.w;
        this.h = cfg.h || 340;
        this.theme = cfg.theme || 'castle';
        this.wallThick = 28;
        this.doors = cfg.doors || [];
        this.features = cfg.features || [];
        this.noCeiling = cfg.noCeiling || false;
        this.floors = cfg.floors || [];  // interior floors: [{y, w, h, x}]
        this._colors = THEMES[this.theme] || THEMES.castle;
    }

    draw(ctx) {
        var c = this._colors;
        var x = this.x, y = this.y, w = this.w, h = this.h;
        var wt = this.wallThick;

        ctx.save();

        // 1. FILL entire room rect as solid wall
        ctx.fillStyle = c.wall;
        ctx.fillRect(x, y, w, h);

        // 2. Draw brick texture on walls
        this._drawBricks(ctx, x, y, w, h);

        // 3. CARVE OUT interior with rich gradient (not flat black)
        var interiorGrad = ctx.createLinearGradient(x, y + wt, x, y + h - wt);
        interiorGrad.addColorStop(0, c.interior);
        interiorGrad.addColorStop(0.3, c.wallDark);
        interiorGrad.addColorStop(1, c.floor);
        ctx.fillStyle = interiorGrad;
        ctx.fillRect(x + wt, y + wt, w - wt * 2, h - wt * 2);

        // Interior subtle back wall texture (faint bricks)
        ctx.globalAlpha = 0.08;
        this._drawBricks(ctx, x + wt, y + wt, w - wt * 2, h - wt * 2);
        ctx.globalAlpha = 1;

        // 4. CARVE OUT door openings
        for (var i = 0; i < this.doors.length; i++) {
            var d = this.doors[i];
            // Door opening
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            if (d.side === 'left') {
                ctx.fillRect(x, y + d.offset, wt, d.size);
                // Door frame (stone arch)
                ctx.fillStyle = c.wallLight;
                ctx.fillRect(x + wt - 4, y + d.offset - 2, 4, d.size + 4);
                ctx.fillRect(x, y + d.offset - 2, wt, 4);
            } else if (d.side === 'right') {
                ctx.fillRect(x + w - wt, y + d.offset, wt, d.size);
                ctx.fillStyle = c.wallLight;
                ctx.fillRect(x + w - wt, y + d.offset - 2, 4, d.size + 4);
                ctx.fillRect(x + w - wt, y + d.offset - 2, wt, 4);
            } else if (d.side === 'top') {
                ctx.fillRect(x + d.offset, y, d.size, wt);
            } else if (d.side === 'bottom') {
                ctx.fillRect(x + d.offset, y + h - wt, d.size, wt);
            }
        }

        // 5. Floor — thick stone floor integrated into room
        var floorH = 12;
        this._drawFloor(ctx, x + wt, y + h - wt - floorH, w - wt * 2, floorH);

        // Interior floors (multi-story)
        if (this.floors) {
            for (var fi = 0; fi < this.floors.length; fi++) {
                var fl = this.floors[fi];
                var flx = x + (fl.x || wt);
                var fly = y + fl.y;
                var flw = fl.w || (w - wt * 2);
                var flh = fl.h || 20;
                this._drawFloor(ctx, flx, fly, flw, flh);
            }
        }

        // 6. Ceiling shadow + side vignette
        var grad = ctx.createLinearGradient(x, y + wt, x, y + wt + 40);
        grad.addColorStop(0, 'rgba(0,0,0,0.6)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x + wt, y + wt, w - wt * 2, 40);

        // Side wall shadows
        var sGrad = ctx.createLinearGradient(x + wt, 0, x + wt + 15, 0);
        sGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
        sGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sGrad;
        ctx.fillRect(x + wt, y + wt, 15, h - wt * 2);

        var rGrad = ctx.createLinearGradient(x + w - wt, 0, x + w - wt - 15, 0);
        rGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
        rGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rGrad;
        ctx.fillRect(x + w - wt - 15, y + wt, 15, h - wt * 2);

        // 7. Draw features
        this._drawFeatures(ctx);

        // 8. Ground fog — animated radial gradient patches along floor (Lovable technique)
        var fogTime = (typeof W.gameTime === 'number') ? W.gameTime : Date.now() * 0.001;
        var floorY = y + h - wt - 12; // just above the floor surface
        var interiorW = w - wt * 2;
        for (var fi = 0; fi < 5; fi++) {
            var fogX = x + wt + (fi * interiorW / 5) + Math.sin(fogTime * 0.3 + fi) * 15;
            var fogY2 = floorY + Math.sin(fogTime * 0.5 + fi * 1.3) * 4;
            var fogW = 30 + (fi * 37 % 25);
            var fogGrad = ctx.createRadialGradient(fogX + fogW / 2, fogY2, 0, fogX + fogW / 2, fogY2, fogW / 2);
            fogGrad.addColorStop(0, 'rgba(42,58,80,0.08)');
            fogGrad.addColorStop(0.5, 'rgba(26,42,64,0.05)');
            fogGrad.addColorStop(1, 'rgba(26,42,64,0)');
            ctx.fillStyle = fogGrad;
            ctx.fillRect(fogX, fogY2 - fogW / 2, fogW, fogW);
        }

        // 9. Top vignette darkness — adds depth from Lovable atmosphere technique
        var vigGrad = ctx.createLinearGradient(x, y + wt, x, y + wt + 30);
        vigGrad.addColorStop(0, 'rgba(8,12,18,0.35)');
        vigGrad.addColorStop(1, 'rgba(8,12,18,0)');
        ctx.fillStyle = vigGrad;
        ctx.fillRect(x + wt, y + wt, w - wt * 2, 30);

        ctx.restore();
    }

    _drawBricks(ctx, x, y, w, h) {
        var c = this._colors;
        var bw = 28, bh = 14;
        for (var by = 0; by < h; by += bh) {
            var offset = (Math.floor(by / bh) % 2) * (bw / 2);
            for (var bx = 0; bx < w; bx += bw) {
                var px = x + bx + offset;
                var py = y + by;
                var shade = posHash(bx, by, 7);
                // Slight color variation per brick
                var r = parseInt(c.wall.substring(1,3), 16);
                var g = parseInt(c.wall.substring(3,5), 16);
                var b = parseInt(c.wall.substring(5,7), 16);
                var v = Math.floor((shade - 0.5) * 20);
                ctx.fillStyle = 'rgb(' + Math.max(0,Math.min(255,r+v)) + ',' +
                    Math.max(0,Math.min(255,g+v)) + ',' + Math.max(0,Math.min(255,b+v)) + ')';
                ctx.fillRect(px + 1, py + 1, bw - 2, bh - 2);

                // Random cracks (Lovable technique — procedural wall damage)
                if (posHash(bx, by, 1) > 0.87) {
                    ctx.strokeStyle = c.mortar;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(px + 5 + posHash(bx, by, 2) * 15, py + 2);
                    ctx.lineTo(px + 10 + posHash(bx, by, 3) * 10, py + 8);
                    ctx.lineTo(px + 8 + posHash(bx, by, 4) * 12, py + bh - 2);
                    ctx.stroke();
                }

                // Moss patches on select bricks
                if (posHash(bx, by, 5) > 0.92) {
                    ctx.fillStyle = 'rgba(30,58,40,0.35)';
                    ctx.fillRect(px + 2, py + 1, 6 + posHash(bx, by, 6) * 8, 3);
                }
            }
        }
        // Mortar lines
        ctx.fillStyle = c.mortar;
        for (var my = 0; my < h; my += bh) {
            ctx.fillRect(x, y + my, w, 1);
        }
    }

    _drawFloor(ctx, x, y, w, h) {
        var c = this._colors;
        // Floor with top highlight gradient
        var fGrad = ctx.createLinearGradient(x, y, x, y + h);
        fGrad.addColorStop(0, c.wallLight || c.floor);
        fGrad.addColorStop(0.15, c.floor);
        fGrad.addColorStop(1, c.floorDark);
        ctx.fillStyle = fGrad;
        ctx.fillRect(x, y, w, h);
        // Stone tile pattern
        ctx.fillStyle = c.floorDark;
        for (var fx = 0; fx < w; fx += 20) {
            ctx.fillRect(x + fx, y + 1, 1, h - 2);
        }
        ctx.fillRect(x, y + Math.floor(h / 2), w, 1);
        // Top edge bright line (light source)
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(x, y, w, 1);
        // Bottom edge dark (shadow under floor)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x, y + h, w, 3);
    }

    _drawFeatures(ctx) {
        var x = this.x, y = this.y;
        var t = (typeof W.gameTime === 'number') ? W.gameTime : Date.now() * 0.001;

        for (var i = 0; i < this.features.length; i++) {
            var f = this.features[i];
            var fx = x + f.x, fy = y + f.y;

            switch (f.type) {
                case 'torch':
                    // Bracket — dark iron mount
                    ctx.fillStyle = '#3a3a3a';
                    ctx.fillRect(fx - 2, fy, 4, 16);
                    ctx.fillRect(fx - 6, fy - 2, 12, 4);

                    // Flame flickering parameters (two sine waves for organic motion)
                    var flicker1 = Math.sin(t * 8 + f.x) * 2;
                    var flicker2 = Math.cos(t * 11 + f.x) * 1.5;
                    var flicker = Math.sin(t * 6 + f.x) * 0.3 + 0.7;

                    // Wall glow — radial gradient behind flame
                    var glowR = 50 + Math.sin(t * 6) * 8;
                    var glow = ctx.createRadialGradient(fx, fy - 5, 0, fx, fy - 5, glowR);
                    glow.addColorStop(0, 'rgba(255,136,0,0.12)');
                    glow.addColorStop(0.4, 'rgba(255,102,0,0.06)');
                    glow.addColorStop(1, 'rgba(255,102,0,0)');
                    ctx.fillStyle = glow;
                    ctx.fillRect(fx - glowR, fy - 5 - glowR, glowR * 2, glowR * 2);

                    // Outer flame — shaped with quadratic curves
                    ctx.fillStyle = 'rgba(255,68,0,0.37)';
                    ctx.beginPath();
                    ctx.moveTo(fx - 5, fy);
                    ctx.quadraticCurveTo(fx + flicker1, fy - 18 + flicker2, fx + 1, fy);
                    ctx.fill();

                    // Middle flame
                    ctx.fillStyle = 'rgba(255,140,32,0.56)';
                    ctx.beginPath();
                    ctx.moveTo(fx - 3, fy);
                    ctx.quadraticCurveTo(fx + flicker1 * 0.5, fy - 12 + flicker2, fx + 1, fy);
                    ctx.fill();

                    // Bright core
                    ctx.fillStyle = 'rgba(255,204,68,0.56)';
                    ctx.beginPath();
                    ctx.moveTo(fx - 1.5, fy);
                    ctx.quadraticCurveTo(fx, fy - 6 + flicker2 * 0.5, fx + 1, fy);
                    ctx.fill();

                    // Rising embers — three small particles drifting up
                    var savedAlpha = ctx.globalAlpha;
                    for (var ei = 0; ei < 3; ei++) {
                        var ex = fx + Math.sin(t * 3 + ei * 2 + f.x) * 6;
                        var emberPhase = (t * 15 + ei * 7 + f.x) % 20;
                        var ey = fy - 10 - emberPhase;
                        var eAlpha = (1 - emberPhase / 20) * 0.6;
                        ctx.globalAlpha = Math.max(0, eAlpha);
                        ctx.fillStyle = '#ffaa22';
                        ctx.fillRect(ex, ey, 1.5, 1.5);
                    }
                    ctx.globalAlpha = savedAlpha;
                    break;

                case 'window':
                    var winW = f.w || 20, winH = f.h || 30;
                    // Window opening with night sky gradient
                    var skyGrad = ctx.createLinearGradient(fx, fy, fx, fy + winH);
                    skyGrad.addColorStop(0, '#0c1020');
                    skyGrad.addColorStop(1, '#1a2040');
                    ctx.fillStyle = skyGrad;
                    ctx.fillRect(fx, fy, winW, winH);
                    // Faint star dots inside window
                    ctx.fillStyle = 'rgba(255,255,255,0.15)';
                    ctx.fillRect(fx + 4, fy + 5, 1, 1);
                    ctx.fillRect(fx + 12, fy + 8, 1, 1);
                    ctx.fillRect(fx + 8, fy + 3, 1, 1);
                    // Moonlight beam — layered gradient for depth (Lovable technique)
                    var beamGrad = ctx.createLinearGradient(fx, fy + winH, fx, fy + winH + 80);
                    beamGrad.addColorStop(0, 'rgba(60,60,100,0.12)');
                    beamGrad.addColorStop(1, 'rgba(60,60,100,0)');
                    ctx.fillStyle = beamGrad;
                    ctx.beginPath();
                    ctx.moveTo(fx, fy + winH);
                    ctx.lineTo(fx - 20, fy + winH + 80);
                    ctx.lineTo(fx + winW + 10, fy + winH + 80);
                    ctx.lineTo(fx + winW, fy + winH);
                    ctx.fill();
                    // Dust motes in moonlight
                    var savedA = ctx.globalAlpha;
                    for (var mi = 0; mi < 4; mi++) {
                        var mx = fx + 2 + ((t * 5 + mi * 11) % (winW + 10));
                        var my = fy + winH + ((t * 8 + mi * 17) % 60);
                        ctx.globalAlpha = 0.15 + Math.sin(t * 2 + mi) * 0.08;
                        ctx.fillStyle = '#aaaacc';
                        ctx.fillRect(mx, my, 1, 1);
                    }
                    ctx.globalAlpha = savedA;
                    // Cross divider
                    ctx.fillStyle = '#333';
                    ctx.fillRect(fx + winW / 2 - 1, fy, 2, winH);
                    ctx.fillRect(fx, fy + winH / 2 - 1, winW, 2);
                    // Stone frame
                    ctx.fillStyle = 'rgba(80,80,80,0.3)';
                    ctx.fillRect(fx - 2, fy - 2, winW + 4, 2);
                    ctx.fillRect(fx - 2, fy + winH, winW + 4, 2);
                    ctx.fillRect(fx - 2, fy, 2, winH);
                    ctx.fillRect(fx + winW, fy, 2, winH);
                    break;

                case 'shelf':
                    ctx.fillStyle = '#4a3a20';
                    ctx.fillRect(fx, fy, f.w || 40, 4);
                    // Items on shelf
                    ctx.fillStyle = '#666';
                    ctx.fillRect(fx + 4, fy - 8, 6, 8);
                    ctx.fillStyle = '#884422';
                    ctx.fillRect(fx + 14, fy - 6, 8, 6);
                    break;

                case 'chains':
                    // Lovable-style elliptical chain links with alternating colors
                    ctx.lineWidth = 2;
                    var chainLen = f.len || 40;
                    for (var li = 0; li < chainLen; li += 8) {
                        ctx.strokeStyle = li % 16 < 8 ? '#555e6a' : '#4a5360';
                        ctx.beginPath();
                        ctx.ellipse(fx, fy + li + 4, 2, 4, 0, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    break;

                case 'cobweb':
                    ctx.strokeStyle = 'rgba(200,200,200,0.15)';
                    ctx.lineWidth = 0.5;
                    for (var ci = 0; ci < 5; ci++) {
                        ctx.beginPath();
                        ctx.moveTo(fx, fy);
                        ctx.quadraticCurveTo(
                            fx + 15 + ci * 8, fy + 5 + ci * 4,
                            fx + 10 + ci * 12, fy + 20 + ci * 6
                        );
                        ctx.stroke();
                    }
                    break;

                case 'banner':
                    var bannerH = f.h || 40;
                    var bannerW = f.w || 16;
                    ctx.fillStyle = f.color || '#6a1a1a';
                    ctx.fillRect(fx, fy, bannerW, bannerH);
                    // Gold trim
                    ctx.fillStyle = '#c8a032';
                    ctx.fillRect(fx, fy, bannerW, 2);
                    ctx.fillRect(fx, fy + bannerH - 2, bannerW, 2);
                    ctx.fillRect(fx, fy, 1, bannerH);
                    ctx.fillRect(fx + bannerW - 1, fy, 1, bannerH);
                    // Emblem center
                    ctx.fillStyle = '#c8a032';
                    ctx.fillRect(fx + bannerW/2 - 2, fy + bannerH/2 - 3, 4, 6);
                    ctx.fillRect(fx + bannerW/2 - 3, fy + bannerH/2 - 1, 6, 2);
                    break;

                case 'roots':
                    ctx.strokeStyle = '#3a2a10';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(fx, fy);
                    ctx.quadraticCurveTo(fx + 10, fy + 20, fx + 5, fy + (f.len || 30));
                    ctx.stroke();
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(fx + 6, fy);
                    ctx.quadraticCurveTo(fx + 15, fy + 15, fx + 12, fy + (f.len || 30) * 0.8);
                    ctx.stroke();
                    break;

                case 'crystals':
                    // Crystal glow aura (Lovable radial gradient technique)
                    var crystalPulse = 0.7 + Math.sin(t * 2 + f.x) * 0.3;
                    var cGlow = ctx.createRadialGradient(fx + 5, fy + 6, 0, fx + 5, fy + 6, 18);
                    cGlow.addColorStop(0, 'rgba(106,176,255,' + (0.12 * crystalPulse) + ')');
                    cGlow.addColorStop(0.5, 'rgba(74,144,217,' + (0.06 * crystalPulse) + ')');
                    cGlow.addColorStop(1, 'rgba(74,144,217,0)');
                    ctx.fillStyle = cGlow;
                    ctx.fillRect(fx - 13, fy - 12, 36, 36);
                    // Crystal shape
                    ctx.fillStyle = 'rgba(100,180,255,0.6)';
                    ctx.beginPath();
                    ctx.moveTo(fx, fy + 12);
                    ctx.lineTo(fx + 5, fy);
                    ctx.lineTo(fx + 10, fy + 12);
                    ctx.fill();
                    // Highlight edge
                    ctx.fillStyle = 'rgba(180,220,255,0.3)';
                    ctx.beginPath();
                    ctx.moveTo(fx + 5, fy);
                    ctx.lineTo(fx + 7, fy + 6);
                    ctx.lineTo(fx + 5, fy + 6);
                    ctx.fill();
                    break;
            }
        }
    }
    // Generate invisible collision rectangles from room definition
    generateCollision() {
        var x = this.x, y = this.y, w = this.w, h = this.h;
        var wt = this.wallThick;
        var rects = [];

        // Floor (bottom of room)
        rects.push({x: x, y: y + h - wt, w: w, h: wt});

        // Ceiling (top of room) — if room has ceiling
        if (!this.noCeiling) {
            rects.push({x: x, y: y, w: w, h: wt});
        }

        // Left wall — with door cutouts
        var leftDoors = this.doors.filter(function(d) { return d.side === 'left'; });
        if (leftDoors.length === 0) {
            rects.push({x: x, y: y, w: wt, h: h});
        } else {
            // Wall segments around doors
            for (var i = 0; i < leftDoors.length; i++) {
                var d = leftDoors[i];
                // Above door
                if (d.offset > 0) {
                    rects.push({x: x, y: y, w: wt, h: d.offset});
                }
                // Below door
                var doorBottom = d.offset + d.size;
                if (doorBottom < h) {
                    rects.push({x: x, y: y + doorBottom, w: wt, h: h - doorBottom});
                }
            }
        }

        // Right wall — with door cutouts
        var rightDoors = this.doors.filter(function(d) { return d.side === 'right'; });
        if (rightDoors.length === 0) {
            rects.push({x: x + w - wt, y: y, w: wt, h: h});
        } else {
            for (var i = 0; i < rightDoors.length; i++) {
                var d = rightDoors[i];
                if (d.offset > 0) {
                    rects.push({x: x + w - wt, y: y, w: wt, h: d.offset});
                }
                var doorBottom = d.offset + d.size;
                if (doorBottom < h) {
                    rects.push({x: x + w - wt, y: y + doorBottom, w: wt, h: h - doorBottom});
                }
            }
        }

        // Interior floors (for multi-story rooms)
        if (this.floors) {
            for (var i = 0; i < this.floors.length; i++) {
                var f = this.floors[i];
                rects.push({x: x + (f.x || wt), y: y + f.y, w: f.w || (w - wt * 2), h: f.h || 20});
            }
        }

        // Convert to Platform-like objects with rect getter
        return rects.map(function(r) {
            return { x: r.x, y: r.y, w: r.w, h: r.h, rect: r, draw: function() {} };
        });
    }
};

})();;
