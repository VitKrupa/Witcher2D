/**
 * core.js - Witcher 2D Engine Foundation
 *
 * Global namespace W with engine constants, Camera system, and utility functions.
 * This file must be loaded before all other game modules.
 */

// ---------------------------------------------------------------------------
// Global namespace
// ---------------------------------------------------------------------------
var W = {};

// ---------------------------------------------------------------------------
// Engine constants
// ---------------------------------------------------------------------------
W.CANVAS_W = 960;
W.CANVAS_H = 540;
W.GRAVITY  = 0.55;
W.GROUND_Y = 480; // default ground level (pixels from top)

// ---------------------------------------------------------------------------
// Camera
// ---------------------------------------------------------------------------

/**
 * Side-scrolling camera with smooth follow and screen-shake support.
 */
W.Camera = class Camera {
    constructor() {
        /** Horizontal scroll offset (world units). */
        this.offsetX = 0;
        /** Vertical scroll offset (world units). */
        this.offsetY = 0;

        // Screen-shake state
        this.shakeX         = 0;
        this.shakeY         = 0;
        this.shakeDuration  = 0;
        this.shakeIntensity = 0;
    }

    /**
     * Smoothly follow a target entity, keeping it roughly centred on screen.
     * The camera is clamped so it never scrolls past the level boundaries.
     *
     * @param {Object} target     - Must have numeric `x` and `y` properties.
     * @param {number} levelWidth - Total width of the current level in pixels.
     */
    follow(target, levelWidth) {
        var targetOffsetX = target.x - W.CANVAS_W / 2;
        // Keep player in lower third of screen
        var targetOffsetY = target.y - W.CANVAS_H * 0.65;

        // Smooth lerp
        this.offsetX = W.lerp(this.offsetX, targetOffsetX, 0.08);
        this.offsetY = W.lerp(this.offsetY, targetOffsetY, 0.05);

        // Clamp
        this.offsetX = W.clamp(this.offsetX, 0, Math.max(0, levelWidth - W.CANVAS_W));
        // Vertical: only shift down slightly when player jumps high, never shift up past ground view
        this.offsetY = W.clamp(this.offsetY, -20, 80);
    }

    /**
     * Start a screen-shake effect.
     *
     * @param {number} intensity - Maximum pixel displacement per frame.
     * @param {number} duration  - How many frames the shake lasts.
     */
    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration  = duration;
    }

    /**
     * Tick the shake timer and compute random offsets for the current frame.
     *
     * @param {number} dt - Delta time (not currently used; frame-based decay).
     */
    update(dt) {
        if (this.shakeDuration > 0) {
            this.shakeDuration--;
            // Random displacement within [-intensity, +intensity]
            this.shakeX = (Math.random() * 2 - 1) * this.shakeIntensity;
            this.shakeY = (Math.random() * 2 - 1) * this.shakeIntensity;
            // Decay intensity linearly so the shake fades out
            this.shakeIntensity *= 0.92;
        } else {
            this.shakeX = 0;
            this.shakeY = 0;
            this.shakeIntensity = 0;
        }
    }

    /**
     * Apply the camera transform to a canvas context.
     * Call this before drawing world-space objects.
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    apply(ctx) {
        ctx.save();
        ctx.translate(
            -this.offsetX + this.shakeX,
            this.shakeY
        );
    }

    /**
     * Restore the canvas context after world-space drawing.
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    restore(ctx) {
        ctx.restore();
    }
};

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/**
 * Clamp a numeric value between min and max (inclusive).
 *
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
W.clamp = function (val, min, max) {
    return val < min ? min : val > max ? max : val;
};

/**
 * Linear interpolation from a toward b by factor t.
 *
 * @param {number} a - Start value.
 * @param {number} b - End value.
 * @param {number} t - Interpolation factor (0-1).
 * @returns {number}
 */
W.lerp = function (a, b, t) {
    return a + (b - a) * t;
};

/**
 * Return a random floating-point number in [min, max).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
W.randRange = function (min, max) {
    return min + Math.random() * (max - min);
};

/**
 * Return a random integer in [min, max] (inclusive on both ends).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
W.randInt = function (min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
};

/**
 * Axis-Aligned Bounding Box overlap test.
 * Both objects must have numeric x, y, w, h properties.
 *
 * @param {Object} a - First box {x, y, w, h}.
 * @param {Object} b - Second box {x, y, w, h}.
 * @returns {boolean} True if the boxes overlap.
 */
W.boxCollision = function (a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
};

/**
 * Euclidean distance between two points with {x, y} properties.
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
W.distBetween = function (a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Pick a random element from an array.
 *
 * @param {Array} array
 * @returns {*} A random element, or undefined if the array is empty.
 */
W.choice = function (array) {
    if (!array || array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
};
