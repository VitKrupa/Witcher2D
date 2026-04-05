(function() {
'use strict';

W.Npc = class {
    constructor(cfg) {
        this.x = cfg.x;
        this.y = cfg.y;
        this.name = cfg.name || 'NPC';
        this.lines = cfg.lines || [];
        this.currentLine = 0;
        this.triggered = false;
        this.w = 20;
        this.h = 40;
    }

    draw(ctx, playerX, playerY) {
        var cx = this.x + this.w / 2;
        var footY = this.y + this.h;

        // Body — teal robe (distinct from enemies)
        ctx.fillStyle = '#2a7a6a';
        ctx.fillRect(this.x + 4, this.y + 14, 12, 20);

        // Head
        ctx.fillStyle = '#d4b896';
        ctx.beginPath();
        ctx.arc(cx, this.y + 8, 7, 0, Math.PI * 2);
        ctx.fill();

        // Hair/hat accent
        ctx.fillStyle = '#5a3a1a';
        ctx.beginPath();
        ctx.arc(cx, this.y + 5, 7, Math.PI, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(this.x + 5, this.y + 34, 4, 6);
        ctx.fillRect(this.x + 11, this.y + 34, 4, 6);

        // Name label above head
        ctx.save();
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#daa520';
        ctx.fillText(this.name, cx, this.y - 8);
        ctx.restore();

        // "!" indicator when player is nearby and untriggered
        if (!this.triggered && playerX !== undefined) {
            var dx = Math.abs(playerX - cx);
            var dy = Math.abs(playerY - (this.y + this.h / 2));
            if (dx < 80 && dy < 60) {
                var bob = Math.sin(Date.now() * 0.005) * 2;
                ctx.save();
                ctx.font = 'bold 14px monospace';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#ffcc00';
                ctx.fillText('!', cx, this.y - 18 + bob);
                ctx.restore();
            }
        }
    }
};

})();
