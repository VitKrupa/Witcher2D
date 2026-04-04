// ============================================================
// Witcher2D — Particle System
// Extends global W namespace (defined by core.js)
// ============================================================

(function () {
  "use strict";

  var W = window.W || (window.W = {});

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ----------------------------------------------------------
  // W.Particle
  // ----------------------------------------------------------

  function Particle(config) {
    this.x       = config.x       || 0;
    this.y       = config.y       || 0;
    this.vx      = config.vx      || 0;
    this.vy      = config.vy      || 0;
    this.color   = config.color   || "#fff";
    this.size    = config.size    || 2;
    this.life    = config.life    || 1;
    this.maxLife = config.maxLife  || this.life;
    this.gravity = config.gravity != null ? config.gravity : 0;
    this.fade    = config.fade    != null ? config.fade    : true;
    this.shrink  = config.shrink  != null ? config.shrink  : false;

    // Optional: text mode (used by resistText)
    this.text    = config.text    || null;
    this.font    = config.font    || "bold 12px monospace";
  }

  Particle.prototype.update = function (dt) {
    this.vy += this.gravity * dt;
    this.x  += this.vx * dt;
    this.y  += this.vy * dt;
    this.life -= dt;
  };

  Particle.prototype.draw = function (ctx) {
    if (this.life <= 0) return;

    var ratio = Math.max(0, this.life / this.maxLife);
    var alpha = this.fade ? ratio : 1;
    var sz    = this.shrink ? this.size * ratio : this.size;

    ctx.save();
    ctx.globalAlpha = alpha;

    if (this.text) {
      ctx.font = this.font;
      ctx.fillStyle = this.color;
      ctx.textAlign = "center";
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x - sz * 0.5, this.y - sz * 0.5, sz, sz);
    }

    ctx.restore();
  };

  Object.defineProperty(Particle.prototype, "dead", {
    get: function () {
      return this.life <= 0;
    }
  });

  W.Particle = Particle;

  // ----------------------------------------------------------
  // W.ParticleSystem
  // ----------------------------------------------------------

  function ParticleSystem() {
    this.particles = [];
  }

  ParticleSystem.prototype.emit = function (count, config) {
    for (var i = 0; i < count; i++) {
      // Apply per-particle randomization around the base config values
      var c = {};
      for (var k in config) {
        if (config.hasOwnProperty(k)) c[k] = config[k];
      }

      // Randomise velocity
      if (config.vxMin != null && config.vxMax != null) {
        c.vx = rand(config.vxMin, config.vxMax);
      }
      if (config.vyMin != null && config.vyMax != null) {
        c.vy = rand(config.vyMin, config.vyMax);
      }

      // Randomise life
      if (config.lifeMin != null && config.lifeMax != null) {
        c.life    = rand(config.lifeMin, config.lifeMax);
        c.maxLife = c.life;
      }

      // Randomise size
      if (config.sizeMin != null && config.sizeMax != null) {
        c.size = rand(config.sizeMin, config.sizeMax);
      }

      // Randomise position offset
      if (config.xSpread) {
        c.x = (config.x || 0) + rand(-config.xSpread, config.xSpread);
      }
      if (config.ySpread) {
        c.y = (config.y || 0) + rand(-config.ySpread, config.ySpread);
      }

      // Pick from color array
      if (Array.isArray(config.colors)) {
        c.color = pick(config.colors);
      }

      this.particles.push(new Particle(c));
    }
  };

  ParticleSystem.prototype.update = function (dt) {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (this.particles[i].dead) {
        this.particles.splice(i, 1);
      }
    }
  };

  ParticleSystem.prototype.draw = function (ctx) {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(ctx);
    }
  };

  ParticleSystem.prototype.clear = function () {
    this.particles.length = 0;
  };

  W.ParticleSystem = ParticleSystem;

  // ----------------------------------------------------------
  // W.Emitters — preset particle effects
  // ----------------------------------------------------------

  W.Emitters = {};

  // 1. blood(ps, x, y, dir)
  //    8-15 dark red particles spraying in dir, gravity, fast fade
  W.Emitters.blood = function (ps, x, y, dir) {
    var count = randInt(8, 15);
    var d = dir || 1; // 1 = right, -1 = left
    ps.emit(count, {
      x: x, y: y,
      xSpread: 2,
      ySpread: 2,
      vxMin: d * 20,  vxMax: d * 120,
      vyMin: -80,     vyMax: 10,
      colors: ["#8b0000", "#a00000", "#6b0000", "#cc1100"],
      sizeMin: 1.5,   sizeMax: 3.5,
      lifeMin: 0.2,   lifeMax: 0.5,
      gravity: 350,
      fade: true,
      shrink: false
    });
  };

  // 2. sparks(ps, x, y)
  //    5-10 bright yellow/white tiny particles, fast velocity, short life
  W.Emitters.sparks = function (ps, x, y) {
    var count = randInt(5, 10);
    ps.emit(count, {
      x: x, y: y,
      xSpread: 1,
      ySpread: 1,
      vxMin: -160, vxMax: 160,
      vyMin: -160, vyMax: 60,
      colors: ["#fff", "#ffe066", "#ffcc00", "#fff8dc"],
      sizeMin: 1,   sizeMax: 2,
      lifeMin: 0.08, lifeMax: 0.22,
      gravity: 0,
      fade: true,
      shrink: true
    });
  };

  // 3. silverSlash(ps, x, y, dir)
  //    12-20 blue-white sparkle particles in arc pattern
  W.Emitters.silverSlash = function (ps, x, y, dir) {
    var count = randInt(12, 20);
    var d = dir || 1;
    for (var i = 0; i < count; i++) {
      var angle = rand(-0.8, 0.8); // arc spread
      var speed = rand(60, 180);
      var color = pick(["#c0d8ff", "#e0eaff", "#a8c4f0", "#ffffff", "#b0d0ff"]);
      ps.emit(1, {
        x: x + rand(-3, 3),
        y: y + rand(-3, 3),
        vx: d * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(10, 40),
        color: color,
        size: rand(1, 3),
        life: rand(0.2, 0.5),
        maxLife: 0.5,
        gravity: -20, // slight upward drift for sparkle feel
        fade: true,
        shrink: true
      });
    }
  };

  // 4. ironSlash(ps, x, y, dir)
  //    12-20 orange-amber ember particles in arc, some with gravity
  W.Emitters.ironSlash = function (ps, x, y, dir) {
    var count = randInt(12, 20);
    var d = dir || 1;
    for (var i = 0; i < count; i++) {
      var angle = rand(-0.7, 0.7);
      var speed = rand(50, 150);
      var color = pick(["#ff8c00", "#ffa040", "#ff6600", "#ffb347", "#e85d00"]);
      var hasGravity = Math.random() > 0.4;
      ps.emit(1, {
        x: x + rand(-2, 2),
        y: y + rand(-2, 2),
        vx: d * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(5, 25),
        color: color,
        size: rand(1, 3.5),
        life: rand(0.25, 0.6),
        maxLife: 0.6,
        gravity: hasGravity ? rand(100, 250) : 0,
        fade: true,
        shrink: false
      });
    }
  };

  // 5. magicBurst(ps, x, y, color)
  //    15-25 particles exploding outward, hue based on color param
  W.Emitters.magicBurst = function (ps, x, y, color) {
    var count = randInt(15, 25);
    var hues;
    switch (color) {
      case "igni":
        hues = ["#ff4400", "#ff7700", "#ffaa00", "#ff2200", "#ffcc33"];
        break;
      case "aard":
        hues = ["#88bbff", "#aaccff", "#6699dd", "#cce0ff", "#ffffff"];
        break;
      case "yrden":
        hues = ["#cc44ff", "#9933cc", "#bb66ee", "#dd88ff", "#aa22dd"];
        break;
      case "quen":
        hues = ["#ffdd00", "#ffe566", "#ffcc00", "#fff5aa", "#ffbb00"];
        break;
      case "axii":
        hues = ["#44ff88", "#66ffaa", "#22cc66", "#aaffcc", "#00ee55"];
        break;
      default:
        // Treat color as a CSS color string; build a small palette around it
        hues = [color || "#fff", "#ffffff", color || "#ccc"];
        break;
    }

    for (var i = 0; i < count; i++) {
      var angle = rand(0, Math.PI * 2);
      var speed = rand(40, 200);
      ps.emit(1, {
        x: x, y: y,
        xSpread: 2,
        ySpread: 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: pick(hues),
        size: rand(1.5, 4),
        life: rand(0.3, 0.7),
        maxLife: 0.7,
        gravity: 0,
        fade: true,
        shrink: true
      });
    }
  };

  // 6. dust(ps, x, y)
  //    3-6 small brown/grey particles, low velocity
  W.Emitters.dust = function (ps, x, y) {
    var count = randInt(3, 6);
    ps.emit(count, {
      x: x, y: y,
      xSpread: 4,
      vxMin: -20, vxMax: 20,
      vyMin: -30, vyMax: -5,
      colors: ["#9e8c6c", "#8a7a5a", "#b0a080", "#777", "#999"],
      sizeMin: 1,   sizeMax: 2.5,
      lifeMin: 0.25, lifeMax: 0.55,
      gravity: 0,
      fade: true,
      shrink: true
    });
  };

  // 7. deathBurst(ps, x, y, colors)
  //    20-30 particles, big explosion, uses provided color array
  W.Emitters.deathBurst = function (ps, x, y, colors) {
    var count = randInt(20, 30);
    var palette = colors && colors.length ? colors : ["#ff0000", "#880000", "#cc3300"];
    for (var i = 0; i < count; i++) {
      var angle = rand(0, Math.PI * 2);
      var speed = rand(50, 250);
      ps.emit(1, {
        x: x + rand(-4, 4),
        y: y + rand(-4, 4),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: pick(palette),
        size: rand(2, 4),
        life: rand(0.4, 1.0),
        maxLife: 1.0,
        gravity: rand(50, 150),
        fade: true,
        shrink: true
      });
    }
  };

  // 8. ambient(ps, bounds)
  //    1-2 tiny firefly particles at random position within bounds, long life
  //    bounds = { x, y, w, h }
  W.Emitters.ambient = function (ps, bounds) {
    var count = randInt(1, 2);
    var bx = bounds.x || 0;
    var by = bounds.y || 0;
    var bw = bounds.w || 320;
    var bh = bounds.h || 180;
    for (var i = 0; i < count; i++) {
      ps.emit(1, {
        x: rand(bx, bx + bw),
        y: rand(by, by + bh),
        vx: rand(-6, 6),
        vy: rand(-8, 4),
        color: pick(["#bbff66", "#ccff88", "#aaee44", "#ddffaa", "#99dd33"]),
        size: rand(1, 2),
        life: rand(2.5, 5.0),
        maxLife: 5.0,
        gravity: 0,
        fade: true,
        shrink: false
      });
    }
  };

  // 9. resistText(ps, x, y)
  //    Floating "RESIST" text particle + grey puff
  W.Emitters.resistText = function (ps, x, y) {
    // The text particle
    ps.particles.push(new Particle({
      x: x,
      y: y,
      vx: rand(-5, 5),
      vy: -40,
      color: "#aaaaaa",
      size: 0,
      life: 0.8,
      maxLife: 0.8,
      gravity: 0,
      fade: true,
      shrink: false,
      text: "RESIST",
      font: "bold 10px monospace"
    }));
    // Small grey puff around text
    ps.emit(randInt(3, 5), {
      x: x, y: y,
      xSpread: 6,
      ySpread: 2,
      vxMin: -25, vxMax: 25,
      vyMin: -35, vyMax: -10,
      colors: ["#999", "#aaa", "#bbb", "#888"],
      sizeMin: 1,  sizeMax: 2,
      lifeMin: 0.2, lifeMax: 0.4,
      gravity: 0,
      fade: true,
      shrink: true
    });
  };

  // 10. iceShards(ps, x, y, dir)
  //     8-12 light blue/white angular particles for Wild Hunt enemies
  W.Emitters.iceShards = function (ps, x, y, dir) {
    var count = randInt(8, 12);
    var d = dir || 1;
    for (var i = 0; i < count; i++) {
      var angle = rand(-0.6, 0.6);
      var speed = rand(70, 190);
      ps.emit(1, {
        x: x + rand(-3, 3),
        y: y + rand(-4, 4),
        vx: d * Math.cos(angle) * speed + rand(-15, 15),
        vy: Math.sin(angle) * speed - rand(10, 30),
        color: pick(["#d0eeff", "#e8f4ff", "#b0d4f1", "#ffffff", "#a0ccee", "#c8e8ff"]),
        size: rand(1.5, 3.5),
        life: rand(0.25, 0.55),
        maxLife: 0.55,
        gravity: rand(20, 80),
        fade: true,
        shrink: false
      });
    }
  };

})();
