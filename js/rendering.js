/**
 * rendering.js - Witcher 2D Drawing Utilities & Color Palette
 *
 * Provides the W.Colors palette and W.Draw helper object for all
 * canvas rendering: rectangles, pixel-art sprites, shadows, text popups,
 * and gradient fills.
 *
 * Depends on: core.js (W namespace must exist).
 */

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------
W.Colors = {

    // -- Geralt --
    WHITE_HAIR:       '#e0dcd0',
    SKIN:             '#d4a574',
    DARK_LEATHER:     '#3a2a1a',
    LEATHER:          '#5a4030',
    YELLOW_EYES:      '#daa520',

    // -- Swords --
    SILVER_BLADE:     '#c8d0e8',
    SILVER_GLOW:      '#8888dd',
    SILVER_TRAIL:     '#aab0ff',
    IRON_BLADE:       '#888080',
    IRON_GLOW:        '#cc8844',
    IRON_TRAIL:       '#ffaa44',

    // -- Enemies: Creatures --
    DROWNER_SKIN:     '#3a6a5a',
    DROWNER_DARK:     '#2a4a3a',
    GHOUL_GREY:       '#6a6060',
    GHOUL_DARK:       '#4a3a3a',
    WRAITH_BLUE:      'rgba(100,120,180,0.6)',
    WRAITH_GLOW:      'rgba(150,170,220,0.4)',
    NEKKER_BROWN:     '#5a4a2a',
    GRIFFIN_GOLD:     '#8a7a40',
    GRIFFIN_BROWN:    '#6a5030',

    // -- Enemies: Humans --
    BANDIT_LEATHER:   '#6a5a3a',
    NILF_BLACK:       '#1a1a2a',
    NILF_GOLD:        '#c8a032',
    WILD_HUNT_DARK:   '#0a0a1a',
    WILD_HUNT_ICE:    '#88aacc',
    WITCH_HUNTER_RED: '#8a2a1a',
    NOBLEMAN_PURPLE:  '#5a2a6a',

    // -- Environment --
    SKY_TOP:          '#0c1020',
    SKY_BOTTOM:       '#1a2a40',
    MOUNTAIN_FAR:     '#1a2030',
    MOUNTAIN_MID:     '#152030',
    TREE_DARK:        '#0a1a0a',
    TREE_MID:         '#1a3a1a',
    BRICK:            '#6b4226',
    BRICK_DARK:       '#4a2e18',
    BRICK_LIGHT:      '#7a5236',
    STONE:            '#5a5a5a',
    STONE_DARK:       '#3a3a3a',
    GRASS:            '#2a4a1a',

    // -- Effects --
    BLOOD:            '#8b0000',
    BLOOD_BRIGHT:     '#cc1111',
    SPARK_YELLOW:     '#ffee44',
    FIRE_ORANGE:      '#ff8800',
    MAGIC_BLUE:       '#4488ff',

    // -- UI --
    WITCHER_GOLD:     '#c8a032',
    DAMAGE_RED:       '#ff4444',
    HEAL_GREEN:       '#44ff44',
    RESIST_GREY:      '#888888'
};

// ---------------------------------------------------------------------------
// Drawing helpers
// ---------------------------------------------------------------------------
W.Draw = {

    /**
     * Draw a filled rectangle.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x      - Left edge.
     * @param {number} y      - Top edge.
     * @param {number} w      - Width.
     * @param {number} h      - Height.
     * @param {string} color  - CSS color string.
     */
    rect: function (ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    },

    /**
     * Draw a single square "pixel" block (for retro / pixel-art rendering).
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x     - Left edge.
     * @param {number} y     - Top edge.
     * @param {number} size  - Side length of the pixel block.
     * @param {string} color - CSS color string.
     */
    pixel: function (ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    },

    /**
     * Draw a horizontal row of pixel blocks.
     * Each entry in the colors array is either a CSS color string or null
     * (null means "skip this cell / transparent").
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number}   x         - Left edge of the first pixel.
     * @param {number}   y         - Top edge of the row.
     * @param {number}   pixelSize - Side length of each pixel block.
     * @param {Array}    colors    - Array of color strings (or null).
     */
    pixelRow: function (ctx, x, y, pixelSize, colors) {
        for (var i = 0; i < colors.length; i++) {
            var c = colors[i];
            if (c !== null && c !== undefined) {
                ctx.fillStyle = c;
                ctx.fillRect(x + i * pixelSize, y, pixelSize, pixelSize);
            }
        }
    },

    /**
     * Draw a 2D pixel-art sprite from a grid of color values.
     *
     * `grid` is an array of rows (top to bottom). Each row is an array of
     * CSS color strings; use null for transparent cells.
     *
     * Example (3x2 smiley):
     *   W.Draw.pixelGrid(ctx, 100, 100, 4, [
     *       ['#ff0', null, '#ff0'],
     *       [null, '#f00', null ]
     *   ]);
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number}   x         - Left edge of the sprite.
     * @param {number}   y         - Top edge of the sprite.
     * @param {number}   pixelSize - Side length of each pixel block.
     * @param {Array[]}  grid      - 2D array [row][col] of color strings or null.
     */
    pixelGrid: function (ctx, x, y, pixelSize, grid) {
        for (var row = 0; row < grid.length; row++) {
            var rowData = grid[row];
            if (!rowData) continue;
            var py = y + row * pixelSize;
            for (var col = 0; col < rowData.length; col++) {
                var color = rowData[col];
                if (color !== null && color !== undefined) {
                    ctx.fillStyle = color;
                    ctx.fillRect(x + col * pixelSize, py, pixelSize, pixelSize);
                }
            }
        }
    },

    /**
     * Draw an elliptical ground shadow beneath an entity.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Centre X of the shadow.
     * @param {number} y - Centre Y of the shadow (typically entity foot level).
     * @param {number} w - Full width of the shadow ellipse.
     */
    shadow: function (ctx, x, y, w) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(x, y, w / 2, w / 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    /**
     * Draw a floating text popup (damage numbers, status text, etc.).
     * The text is centred horizontally at (x, y), with a thin dark outline
     * for readability against any background.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x     - Centre X.
     * @param {number} y     - Baseline Y.
     * @param {string} text  - The string to render.
     * @param {string} color - CSS fill color.
     * @param {number} size  - Font size in pixels.
     */
    textPopup: function (ctx, x, y, text, color, size) {
        ctx.font = 'bold ' + size + 'px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Dark outline for contrast
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x - 1, y - 1);
        ctx.fillText(text, x + 1, y - 1);
        ctx.fillText(text, x - 1, y + 1);
        ctx.fillText(text, x + 1, y + 1);

        // Foreground color
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    },

    /**
     * Draw a rectangle filled with a linear gradient.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number}  x        - Left edge.
     * @param {number}  y        - Top edge.
     * @param {number}  w        - Width.
     * @param {number}  h        - Height.
     * @param {string}  color1   - Start CSS color.
     * @param {string}  color2   - End CSS color.
     * @param {boolean} vertical - If true, gradient runs top-to-bottom;
     *                             otherwise left-to-right.
     */
    gradientRect: function (ctx, x, y, w, h, color1, color2, vertical) {
        var grd;
        if (vertical) {
            grd = ctx.createLinearGradient(x, y, x, y + h);
        } else {
            grd = ctx.createLinearGradient(x, y, x + w, y);
        }
        grd.addColorStop(0, color1);
        grd.addColorStop(1, color2);
        ctx.fillStyle = grd;
        ctx.fillRect(x, y, w, h);
    }
};
