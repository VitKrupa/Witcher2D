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

        // 3. CARVE OUT interior (clearRect to show dark interior)
        ctx.fillStyle = c.interior;
        ctx.fillRect(x + wt, y + wt, w - wt * 2, h - wt * 2);

        // 4. CARVE OUT door openings
        for (var i = 0; i < this.doors.length; i++) {
            var d = this.doors[i];
            ctx.fillStyle = c.interior;
            if (d.side === 'left') {
                ctx.fillRect(x, y + d.offset, wt, d.size);
                // Door frame
                ctx.fillStyle = c.wallDark;
                ctx.fillRect(x + wt - 3, y + d.offset, 3, d.size);
            } else if (d.side === 'right') {
                ctx.fillRect(x + w - wt, y + d.offset, wt, d.size);
                ctx.fillStyle = c.wallDark;
                ctx.fillRect(x + w - wt, y + d.offset, 3, d.size);
            } else if (d.side === 'top') {
                ctx.fillRect(x + d.offset, y, d.size, wt);
            } else if (d.side === 'bottom') {
                ctx.fillRect(x + d.offset, y + h - wt, d.size, wt);
            }
        }

        // 5. Floor texture inside room
        this._drawFloor(ctx, x + wt, y + h - wt - 8, w - wt * 2, 8);

        // 6. Ceiling shadow gradient
        var grad = ctx.createLinearGradient(x, y + wt, x, y + wt + 30);
        grad.addColorStop(0, 'rgba(0,0,0,0.5)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x + wt, y + wt, w - wt * 2, 30);

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
        ctx.fillStyle = c.floor;
        ctx.fillRect(x, y, w, h);
        // Tile lines
        ctx.fillStyle = c.floorDark;
        for (var fx = 0; fx < w; fx += 24) {
            ctx.fillRect(x + fx, y, 1, h);
        }
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(x, y, w, 1);
    }

    _drawFeatures(ctx) {
        var x = this.x, y = this.y;
        var t = (typeof W.gameTime === 'number') ? W.gameTime : Date.now() * 0.001;

        for (var i = 0; i < this.features.length; i++) {
            var f = this.features[i];
            var fx = x + f.x, fy = y + f.y;

            switch (f.type) {
                case 'torch':
                    // Bracket
                    ctx.fillStyle = '#555';
                    ctx.fillRect(fx, fy, 4, 12);
                    ctx.fillRect(fx - 4, fy, 12, 3);
                    // Flame (animated)
                    var flicker = Math.sin(t * 6 + f.x) * 0.3 + 0.7;
                    ctx.fillStyle = 'rgba(255,160,40,' + flicker + ')';
                    ctx.beginPath();
                    ctx.ellipse(fx + 2, fy - 4, 4, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'rgba(255,220,80,' + (flicker * 0.8) + ')';
                    ctx.beginPath();
                    ctx.ellipse(fx + 2, fy - 5, 2, 4, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Glow
                    ctx.fillStyle = 'rgba(200,120,30,' + (flicker * 0.08) + ')';
                    ctx.beginPath();
                    ctx.arc(fx + 2, fy, 40, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case 'window':
                    // Window opening
                    ctx.fillStyle = '#1a2040';
                    ctx.fillRect(fx, fy, f.w || 20, f.h || 30);
                    // Moonlight beam
                    ctx.fillStyle = 'rgba(60,60,100,0.1)';
                    ctx.beginPath();
                    ctx.moveTo(fx, fy + (f.h || 30));
                    ctx.lineTo(fx - 20, fy + (f.h || 30) + 80);
                    ctx.lineTo(fx + (f.w || 20) + 10, fy + (f.h || 30) + 80);
                    ctx.lineTo(fx + (f.w || 20), fy + (f.h || 30));
                    ctx.fill();
                    // Cross divider
                    ctx.fillStyle = '#333';
                    ctx.fillRect(fx + (f.w || 20) / 2 - 1, fy, 2, f.h || 30);
                    ctx.fillRect(fx, fy + (f.h || 30) / 2 - 1, f.w || 20, 2);
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
                    ctx.strokeStyle = '#666';
                    ctx.lineWidth = 2;
                    var sway = Math.sin(t * 0.5 + f.x * 0.01) * 3;
                    ctx.beginPath();
                    ctx.moveTo(fx, fy);
                    ctx.lineTo(fx + sway, fy + (f.len || 40));
                    ctx.stroke();
                    // Links
                    for (var li = 0; li < (f.len || 40); li += 6) {
                        ctx.fillStyle = li % 12 < 6 ? '#777' : '#555';
                        ctx.fillRect(fx + sway * (li / (f.len || 40)) - 1, fy + li, 3, 5);
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
                    ctx.fillStyle = 'rgba(100,180,255,0.6)';
                    ctx.beginPath();
                    ctx.moveTo(fx, fy + 12);
                    ctx.lineTo(fx + 5, fy);
                    ctx.lineTo(fx + 10, fy + 12);
                    ctx.fill();
                    // Glow
                    ctx.fillStyle = 'rgba(100,180,255,0.1)';
                    ctx.beginPath();
                    ctx.arc(fx + 5, fy + 6, 10, 0, Math.PI * 2);
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
