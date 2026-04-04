(function() {
'use strict';
const C = W.Colors;

W.Platform = class {
    constructor(x, y, w, h, type) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.type = type || 'stone';
    }
    get rect() { return {x:this.x, y:this.y, w:this.w, h:this.h}; }
    draw(ctx) {
        switch(this.type) {
        case 'stone':
            // Stone brick texture
            ctx.fillStyle = C.BRICK || '#6b4226';
            ctx.fillRect(this.x, this.y, this.w, this.h);
            // Mortar lines
            ctx.fillStyle = C.BRICK_DARK || '#4a2e18';
            for (let bx = this.x; bx < this.x + this.w; bx += 24) {
                ctx.fillRect(bx, this.y, 1, this.h);
            }
            for (let by = this.y; by < this.y + this.h; by += 12) {
                ctx.fillRect(this.x, by, this.w, 1);
            }
            // Lighter brick highlights
            ctx.fillStyle = C.BRICK_LIGHT || '#7a5236';
            for (let bx = this.x + 3; bx < this.x + this.w - 3; bx += 24) {
                for (let by = this.y + 2; by < this.y + this.h - 2; by += 12) {
                    ctx.fillRect(bx, by, 8, 4);
                }
            }
            // Top edge highlight
            ctx.fillStyle = '#8a6a4a';
            ctx.fillRect(this.x, this.y, this.w, 2);
            break;
        case 'wood':
            ctx.fillStyle = '#6a4a2a';
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#5a3a1a';
            for (let by = this.y + 3; by < this.y + this.h; by += 5) {
                ctx.fillRect(this.x, by, this.w, 1);
            }
            ctx.fillStyle = '#7a5a3a';
            ctx.fillRect(this.x, this.y, this.w, 1);
            break;
        case 'ice':
            ctx.fillStyle = '#8ab8cc';
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#aaddee';
            ctx.fillRect(this.x+4, this.y+2, this.w*0.3, 2);
            ctx.fillRect(this.x+this.w*0.5, this.y+4, this.w*0.25, 1);
            ctx.fillStyle = '#cceeff';
            ctx.fillRect(this.x, this.y, this.w, 1);
            break;
        }
    }
};

})();
