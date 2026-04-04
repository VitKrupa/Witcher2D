// ============================================================================
// mobile.js — Mobile touch controls: virtual joystick + action buttons
// Auto-detects touch devices and shows/hides controls accordingly
// ============================================================================
(function() {
'use strict';

W.Mobile = {
    active: false,
    joystick: null,
    buttons: {},
    container: null,

    // Virtual joystick state
    joyX: 0,    // -1 to 1
    joyY: 0,    // -1 to 1
    joyActive: false,
    joyTouchId: null,
    joyCenterX: 0,
    joyCenterY: 0,
    joyRadius: 60,

    // Check if device supports touch
    isTouchDevice: function() {
        return ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    },

    init: function() {
        if (!this.isTouchDevice()) return;
        this.active = true;
        this.createControls();
        this.bindEvents();

        // Hide keyboard controls hint, show mobile hint
        var controlsInfo = document.querySelector('.controls-info');
        if (controlsInfo) {
            controlsInfo.innerHTML =
                '<span style="color:#c8a032;">Touch Controls Active</span><br>' +
                'Left joystick: Move + Jump/Roll<br>' +
                'Right buttons: Silver & Iron swords + Block';
        }

        // Also hide the old sword buttons (we have new bigger ones)
        var oldBtns = document.querySelector('.sword-buttons');
        if (oldBtns) oldBtns.style.display = 'none';

        // Hide info panel on mobile (takes space)
        var info = document.querySelector('.info-panel');
        if (info) info.style.display = 'none';
    },

    createControls: function() {
        var container = document.createElement('div');
        container.id = 'mobileControls';
        container.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:15;display:none;';

        // === LEFT SIDE: Virtual Joystick ===
        var joyArea = document.createElement('div');
        joyArea.id = 'joyArea';
        joyArea.style.cssText = 'position:absolute;left:8px;bottom:30px;width:180px;height:180px;pointer-events:all;';

        var joyBase = document.createElement('div');
        joyBase.id = 'joyBase';
        joyBase.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);' +
            'width:150px;height:150px;border-radius:50%;' +
            'background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.12);';

        var joyKnob = document.createElement('div');
        joyKnob.id = 'joyKnob';
        joyKnob.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);' +
            'width:56px;height:56px;border-radius:50%;' +
            'background:rgba(200,160,50,0.25);border:2px solid rgba(200,160,50,0.4);' +
            'transition:none;';

        // Direction arrows overlay
        var arrows = document.createElement('div');
        arrows.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:80px;height:80px;pointer-events:none;';
        arrows.innerHTML =
            '<div style="position:absolute;top:5px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.2);font-size:14px;">↑</div>' +
            '<div style="position:absolute;bottom:5px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.2);font-size:14px;">↓</div>' +
            '<div style="position:absolute;left:5px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.2);font-size:14px;">←</div>' +
            '<div style="position:absolute;right:5px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.2);font-size:14px;">→</div>';

        joyBase.appendChild(arrows);
        joyBase.appendChild(joyKnob);
        joyArea.appendChild(joyBase);
        container.appendChild(joyArea);

        // === RIGHT SIDE: Two BIG sword attack buttons ===
        var btnArea = document.createElement('div');
        btnArea.id = 'btnArea';
        btnArea.style.cssText = 'position:absolute;right:10px;bottom:35px;width:180px;height:120px;pointer-events:all;';

        // Silver sword (left, big)
        var silverBtn = this.makeBigButton('silverTouch', '⚔', 'SILVER', 'Monsters',
            'rgba(25,25,70,0.75)', '#8888cc', 0, 10);
        // Iron sword (right, big)
        var ironBtn = this.makeBigButton('ironTouch', '🗡', 'IRON', 'Humans',
            'rgba(70,35,15,0.75)', '#cc8844', 95, 10);

        btnArea.appendChild(silverBtn);
        btnArea.appendChild(ironBtn);
        container.appendChild(btnArea);

        // Append to body (NOT gameContainer) to avoid CSS transform issues
        document.body.appendChild(container);
        container.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:1000;display:none;';
        this.container = container;
        this.joystick = { area: joyArea, base: joyBase, knob: joyKnob };
    },

    makeButton: function(id, icon, label, bg, borderColor, offsetX, offsetY) {
        var btn = document.createElement('div');
        btn.id = id;
        btn.style.cssText = 'position:absolute;width:50px;height:50px;border-radius:50%;' +
            'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
            'background:' + bg + ';border:2px solid ' + borderColor + ';' +
            'color:' + borderColor + ';font-size:9px;font-weight:bold;' +
            'left:' + offsetX + 'px;top:' + offsetY + 'px;' +
            'user-select:none;-webkit-user-select:none;' +
            'box-shadow:0 0 8px rgba(0,0,0,0.5);';
        btn.innerHTML = '<span style="font-size:18px;line-height:1;">' + icon + '</span>' +
                        '<span style="font-size:7px;margin-top:1px;">' + label + '</span>';
        this.buttons[id] = btn;
        return btn;
    },

    makeBigButton: function(id, icon, label, sublabel, bg, borderColor, offsetX, offsetY) {
        var btn = document.createElement('div');
        btn.id = id;
        btn.style.cssText = 'position:absolute;width:80px;height:95px;border-radius:16px;' +
            'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
            'background:' + bg + ';border:2px solid ' + borderColor + ';' +
            'color:' + borderColor + ';font-weight:bold;' +
            'left:' + offsetX + 'px;top:' + offsetY + 'px;' +
            'user-select:none;-webkit-user-select:none;' +
            'box-shadow:0 0 12px rgba(0,0,0,0.4);' +
            'opacity:0.45;'; // more transparent so game is visible
        btn.innerHTML = '<span style="font-size:28px;line-height:1;">' + icon + '</span>' +
                        '<span style="font-size:11px;margin-top:3px;">' + label + '</span>' +
                        '<span style="font-size:8px;opacity:0.6;">' + sublabel + '</span>';
        this.buttons[id] = btn;
        return btn;
    },

    show: function() {
        if (this.container) this.container.style.display = 'block';
    },

    hide: function() {
        if (this.container) this.container.style.display = 'none';
    },

    bindEvents: function() {
        var self = this;

        // Prevent default touch behaviors on game area
        var gameContainer = document.getElementById('gameContainer');
        gameContainer.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive: false });

        // === JOYSTICK TOUCH HANDLING ===
        var joyArea = this.joystick.area;

        joyArea.addEventListener('touchstart', function(e) {
            e.preventDefault();
            var touch = e.changedTouches[0];
            self.joyTouchId = touch.identifier;
            var rect = joyArea.getBoundingClientRect();
            self.joyCenterX = rect.left + rect.width / 2;
            self.joyCenterY = rect.top + rect.height / 2;
            self.updateJoystick(touch.clientX, touch.clientY);
            self.joyActive = true;
        }, { passive: false });

        document.addEventListener('touchmove', function(e) {
            if (!self.joyActive) return;
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === self.joyTouchId) {
                    self.updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                    break;
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', function(e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === self.joyTouchId) {
                    self.joyActive = false;
                    self.joyX = 0;
                    self.joyY = 0;
                    self.joyTouchId = null;
                    self.joystick.knob.style.transform = 'translate(-50%, -50%)';
                    break;
                }
            }
        }, { passive: false });

        // === ACTION BUTTONS (two big sword buttons only) ===
        this.bindButton('silverTouch', function() { if (window.game) game.attack('silver'); });
        this.bindButton('ironTouch', function() { if (window.game) game.attack('iron'); });
    },

    bindButton: function(id, onDown, onUp) {
        var btn = this.buttons[id];
        if (!btn) return;

        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            btn.style.opacity = '0.6';
            btn.style.transform = 'scale(0.9)';
            if (onDown) onDown();
        }, { passive: false });

        btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
            if (onUp) onUp();
        }, { passive: false });

        btn.addEventListener('touchcancel', function(e) {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
            if (onUp) onUp();
        });
    },

    updateJoystick: function(touchX, touchY) {
        var dx = touchX - this.joyCenterX;
        var dy = touchY - this.joyCenterY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var maxDist = this.joyRadius;

        if (dist > maxDist) {
            dx = (dx / dist) * maxDist;
            dy = (dy / dist) * maxDist;
        }

        this.joyX = dx / maxDist; // -1 to 1
        this.joyY = dy / maxDist; // -1 to 1

        // Move knob visually
        this.joystick.knob.style.transform =
            'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
    },

    // Apply joystick state to game keys — called each frame
    applyToKeys: function(keys) {
        if (!this.active || !this.joyActive) {
            // Don't clear keys if joystick not active (keyboard might be in use)
            if (this.active) {
                keys['a'] = false;
                keys['d'] = false;
            }
            return;
        }

        var deadzone = 0.25;

        // Horizontal movement
        if (this.joyX < -deadzone) {
            keys['a'] = true;
            keys['d'] = false;
        } else if (this.joyX > deadzone) {
            keys['d'] = true;
            keys['a'] = false;
        } else {
            keys['a'] = false;
            keys['d'] = false;
        }

        // Vertical: up = jump (edge-triggered, held for a few frames)
        var wantJump = this.joyY < -0.4;
        if (wantJump && !this._prevJoyUp) {
            this._jumpFrames = 5; // hold for 5 frames to ensure it registers
        }
        this._prevJoyUp = wantJump;
        if (this._jumpFrames > 0) {
            keys['w'] = true;
            this._jumpFrames--;
        } else {
            keys['w'] = false;
        }
        if (this.joyY > 0.5) {
            keys['s'] = true;
            // Brief press for roll
            setTimeout(function() { keys['s'] = false; }, 100);
        }
    }
};

})();
