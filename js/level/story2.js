(function() {
'use strict';

// Level 3: The Abandoned Keep — Prince-of-Persia room-based castle (12 rooms = 11520px)
// Collision generated from Room.generateCollision() — platforms: [] is empty
// Room floor Y = room.y + room.h - 28 (wallThick). Enemy Y = floor Y - 52.
W.StoryLevel3 = {
    name: 'The Abandoned Keep',
    width: 11520,
    bgTheme: 'castle',
    storyText: 'Captured documents reveal Nilfgaard funds the Witch Hunters. Their base: an old fortress.',
    platforms: [],
    rooms: [
        // Room 1: Gate Room (x:0-960) — floor Y=372, enemy Y≈320
        {x:0, y:60, w:960, h:340, theme:'castle',
            doors:[{side:'right', offset:200, size:60}],
            floors:[
                {y:180, w:500, h:40, x:200}    // portcullis ledge (thick)
            ],
            features:[
                {type:'torch', x:80, y:160},
                {type:'torch', x:800, y:160},
                {type:'banner', x:460, y:100},
                {type:'cobweb', x:16, y:80}
            ]},
        // Room 2: Entry Hall (x:960-1920) — floor Y=372, balcony at y:180
        {x:960, y:60, w:960, h:340, theme:'castle',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:120, w:280, h:40, x:28},     // balcony left
                {y:120, w:280, h:40, x:660},    // balcony right
                {y:200, w:60, h:30, x:300}      // stepping block
            ],
            features:[
                {type:'torch', x:100, y:180},
                {type:'torch', x:840, y:180},
                {type:'banner', x:440, y:100},
                {type:'window', x:480, y:120}
            ]},
        // Room 3: Staircase Room (x:1920-2880) — floor Y=372, 3 ascending floors
        {x:1920, y:60, w:960, h:340, theme:'castle',
            doors:[{side:'left', offset:0, size:60}, {side:'right', offset:0, size:60}],
            floors:[
                {y:210, w:300, h:40, x:40},     // floor 2 (low)
                {y:130, w:300, h:40, x:380},    // floor 3 (mid)
                {y:60, w:260, h:40, x:680}      // floor 4 (top)
            ],
            features:[
                {type:'torch', x:80, y:160},
                {type:'torch', x:830, y:160},
                {type:'chains', x:480, y:100}
            ]},
        // Room 4: Upper Corridor (x:2880-3840) — raised room, floor Y=272, enemy Y≈220
        {x:2880, y:120, w:960, h:180, theme:'castle',
            doors:[{side:'left', offset:0, size:60}, {side:'right', offset:0, size:60}],
            floors:[
                {y:90, w:60, h:30, x:220},      // obstacle crate 1
                {y:90, w:60, h:30, x:520}       // obstacle crate 2
            ],
            features:[
                {type:'torch', x:100, y:50},
                {type:'torch', x:820, y:50},
                {type:'cobweb', x:320, y:28},
                {type:'cobweb', x:520, y:28}
            ]},
        // Room 5: Great Hall (x:3840-4800) — tall room, floor Y=372, upper floor at y:160
        {x:3840, y:40, w:960, h:360, theme:'castle',
            doors:[{side:'left', offset:200, size:80}, {side:'right', offset:200, size:80}],
            floors:[
                {y:160, w:400, h:40, x:28},     // upper floor left
                {y:160, w:380, h:40, x:560},    // upper floor right
                {y:240, w:60, h:30, x:420}      // stepping block
            ],
            features:[
                {type:'torch', x:100, y:140},
                {type:'torch', x:860, y:140},
                {type:'banner', x:240, y:80},
                {type:'banner', x:720, y:80},
                {type:'window', x:460, y:80}
            ]},
        // Room 6: Kitchen / Storage (x:4800-5760) — low room, floor Y=372, enemy Y≈320
        {x:4800, y:220, w:960, h:180, theme:'castle',
            doors:[{side:'left', offset:0, size:60}, {side:'right', offset:0, size:60}],
            floors:[
                {y:80, w:80, h:40, x:100},      // crate stack 1
                {y:70, w:200, h:50, x:300},     // crate stack 2
                {y:80, w:160, h:40, x:600}      // crate stack 3
            ],
            features:[
                {type:'torch', x:80, y:40},
                {type:'cobweb', x:250, y:28},
                {type:'cobweb', x:600, y:28}
            ]},
        // Room 7: Dungeon Descent (x:5760-6720) — deep room, floor Y=372
        // Floors: entry ledge, descent platforms
        {x:5760, y:60, w:960, h:340, theme:'castle',
            doors:[{side:'left', offset:0, size:60}, {side:'right', offset:0, size:60}],
            floors:[
                {y:190, w:300, h:40, x:40},     // upper ledge
                {y:280, w:400, h:40, x:440},    // mid ledge
                {y:320, w:60, h:30, x:640}      // climbing block
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'chains', x:440, y:100},
                {type:'chains', x:740, y:100},
                {type:'cobweb', x:140, y:80}
            ]},
        // Room 8: Dungeon Cells (x:6720-7680) — underground, floor Y=372, enemy Y≈320
        {x:6720, y:260, w:960, h:140, theme:'castle',
            doors:[{side:'left', offset:0, size:60}, {side:'right', offset:0, size:60}],
            floors:[],
            features:[
                {type:'chains', x:130, y:30},
                {type:'chains', x:430, y:30},
                {type:'chains', x:730, y:30},
                {type:'cobweb', x:280, y:28}
            ]},
        // Room 9: Dungeon Exit (x:7680-8640) — deep room, ascending floors
        {x:7680, y:60, w:960, h:340, theme:'castle',
            doors:[{side:'left', offset:0, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:280, w:300, h:40, x:120},    // floor 2
                {y:200, w:300, h:40, x:470},    // floor 3
                {y:120, w:200, h:40, x:770}     // floor 4 (exit level)
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'torch', x:820, y:180},
                {type:'chains', x:420, y:100}
            ]},
        // Room 10: Tower Climb (x:8640-9600) — tall room, floor Y=372, 3 interior floors
        {x:8640, y:40, w:960, h:360, theme:'castle',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:220, w:880, h:40, x:28},     // floor 2 (full width)
                {y:140, w:400, h:40, x:28},     // floor 3 left
                {y:140, w:380, h:40, x:560},    // floor 3 right
                {y:60, w:400, h:40, x:260}      // floor 4 (top)
            ],
            features:[
                {type:'torch', x:100, y:140},
                {type:'torch', x:840, y:140},
                {type:'window', x:460, y:80},
                {type:'banner', x:560, y:100}
            ]},
        // Room 11: Sky Bridge (x:9600-10560) — high narrow room, floor Y=132, enemy Y≈80
        {x:9600, y:60, w:960, h:100, theme:'castle',
            noCeiling: false,
            doors:[{side:'left', offset:0, size:40}, {side:'right', offset:0, size:40}],
            floors:[],
            features:[
                {type:'banner', x:250, y:20},
                {type:'banner', x:600, y:20},
                {type:'window', x:450, y:20}
            ]},
        // Room 12: Boss Chamber (x:10560-11520) — floor Y=372, upper floor at y:150
        {x:10560, y:60, w:960, h:340, theme:'castle',
            doors:[{side:'left', offset:0, size:60}],
            floors:[
                {y:150, w:320, h:40, x:28},     // upper floor left
                {y:150, w:400, h:40, x:540},    // upper floor right
                {y:220, w:60, h:30, x:340}      // stepping block
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'torch', x:840, y:160},
                {type:'banner', x:390, y:100},
                {type:'banner', x:640, y:100},
                {type:'chains', x:240, y:100}
            ]},
    ],
    secrets: [
        // Hidden dungeon alcove (below room 8 floor)
        {
            x: 7100, y: 380, w: 160, h: 40,
            triggerX: 7150, triggerY: 380,
            reward: 300,
            enemies: [
                {type: 'wraith', x: 7120, y: 360},
                {type: 'nilfSoldier', x: 7200, y: 360}
            ]
        },
        // Hidden armory above great hall (room 5 area)
        {
            x: 4200, y: 50, w: 160, h: 40,
            triggerX: 4250, triggerY: 50,
            reward: 350,
            enemies: [
                {type: 'nilfSoldier', x: 4220, y: 30},
                {type: 'nilfSoldier', x: 4280, y: 30},
                {type: 'nilfSoldier', x: 4340, y: 30}
            ]
        }
    ],
    spikes: [
        // Room 1: portcullis trap (floor Y=372, spike on floor)
        {x: 400, y: 356, w: 60},
        // Room 3: staircase hazard
        {x: 2300, y: 356, w: 48},
        // Room 4: corridor floor spikes (floor Y=272)
        {x: 3250, y: 256, w: 72},
        // Room 5: great hall ceiling spikes
        {x: 4150, y: 68, w: 60, direction: 'down'},
        {x: 4450, y: 68, w: 60, direction: 'down'},
        // Room 7: dungeon descent pit spikes (floor Y=372)
        {x: 6200, y: 356, w: 60},
        // Room 8: dungeon cell floor spikes (floor Y=372)
        {x: 6850, y: 356, w: 48},
        {x: 7150, y: 356, w: 48},
        // Room 11: sky bridge gap spikes
        {x: 9920, y: 384, w: 36},
        {x: 10160, y: 384, w: 36},
    ],
    enemies: [
        // Room 1 — Gate Room: floor Y=372, enemy Y=320
        {type:'nilfSoldier', x:350, y:320},
        {type:'nilfSoldier', x:700, y:320},
        // Room 2 — Entry Hall: balcony floor at room.y+120=180, enemy Y=130
        {type:'nilfSoldier', x:1620, y:130},
        // Room 3 — Staircase: ground enemy Y=320, upper floor at room.y+60=120, enemy Y=70
        {type:'nilfSoldier', x:2050, y:320},
        {type:'nilfSoldier', x:2650, y:70},
        // Room 4 — Upper Corridor: floor Y=272, enemy Y=220
        {type:'nilfSoldier', x:3150, y:220},
        {type:'nilfSoldier', x:3550, y:220},
        // Room 5 — Great Hall: ground Y=320, upper floor at room.y+160=200, enemy Y=148
        {type:'nilfSoldier', x:3950, y:320},
        {type:'nilfSoldier', x:4200, y:148},
        {type:'nilfSoldier', x:4650, y:148},
        // Room 6 — Kitchen/Storage: floor Y=372, enemy Y=320
        {type:'nobleman', x:5300, y:320},
        // Room 7 — Dungeon Descent: floor Y=372, enemy Y=320
        {type:'wraith', x:6350, y:320},
        // Room 8 — Dungeon Cells: floor Y=372, enemy Y=320
        {type:'wraith', x:6850, y:320},
        {type:'wraith', x:7400, y:320},
        // Room 10 — Tower Climb: top floor at room.y+60=100, enemy Y=48
        {type:'nilfSoldier', x:9150, y:48},
        // Room 11 — Sky Bridge: floor Y=132, enemy Y=80
        {type:'wildHunt', x:9850, y:80},
        {type:'wildHunt', x:10300, y:80},
        // Room 12 — Boss Chamber: ground Y=320, upper floor at room.y+150=210, enemy Y=158
        {type:'nilfSoldier', x:10750, y:320},
        {type:'nilfSoldier', x:11050, y:158},
        {type:'nilfSoldier', x:11350, y:320},
    ]
};

// Level 4: The Cursed Battlefield (10 rooms, ~960px each = 9600px)
// Collision generated from Room.generateCollision() — platforms: [] is empty
// Trench rooms have lower y values for sunken trenches.
W.StoryLevel4 = {
    name: 'The Cursed Battlefield',
    width: 9600,
    bgTheme: 'battlefield',
    storyText: 'An ancient battlefield where Nilfgaard performs a dark ritual to bind a griffin as weapon.',
    platforms: [],
    rooms: [
        // Room 1: Trench Entrance (x:0-960) — drop to trench
        // y:60, h:340, floor Y=372, entry ledge + trench shelf
        {x:0, y:60, w:960, h:340, theme:'battlefield',
            doors:[{side:'right', offset:240, size:60}],
            floors:[
                {y:280, w:200, h:40, x:28},     // entry ledge before drop
                {y:280, w:300, h:40, x:340}     // trench shelf
            ],
            features:[
                {type:'torch', x:80, y:180},
                {type:'roots', x:400, y:300},
                {type:'roots', x:700, y:300},
                {type:'cobweb', x:16, y:240}
            ]},
        // Room 2: Trench Corridor (x:960-1920) — sunken, y:260 h:140
        // floor Y=372, enemy Y≈320
        {x:960, y:260, w:960, h:140, theme:'battlefield',
            doors:[{side:'left', offset:100, size:40}, {side:'right', offset:100, size:40}],
            floors:[
                {y:60, w:200, h:40, x:190},     // shelf 1 over spikes
                {y:60, w:200, h:40, x:540}      // shelf 2 over spikes
            ],
            features:[
                {type:'roots', x:140, y:100},
                {type:'roots', x:640, y:100},
                {type:'cobweb', x:440, y:28}
            ]},
        // Room 3: Surface Breakout (x:1920-2880) — climb from trench
        // y:60, h:340, floor Y=372, ascending floors to surface
        {x:1920, y:60, w:960, h:340, theme:'battlefield',
            doors:[{side:'left', offset:240, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:240, w:300, h:40, x:40},     // floor 2 (climb from trench)
                {y:160, w:680, h:40, x:280}     // surface floor
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'roots', x:60, y:280},
                {type:'cobweb', x:580, y:110}
            ]},
        // Room 4: Siege Tower Interior (x:2880-3840) — vertical climb
        // y:60, h:340, floor Y=372, enemy Y≈320. 3 interior floors
        {x:2880, y:60, w:960, h:340, theme:'battlefield',
            doors:[{side:'left', offset:0, size:60}, {side:'right', offset:0, size:60}],
            floors:[
                {y:200, w:260, h:40, x:40},     // floor 2
                {y:140, w:244, h:40, x:356},    // floor 3
                {y:80, w:260, h:40, x:656}      // floor 4 (top)
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'torch', x:820, y:160},
                {type:'cobweb', x:320, y:80},
                {type:'cobweb', x:620, y:80}
            ]},
        // Room 5: Siege Tower Top + Descent (x:3840-4800)
        // y:60, h:340, no ground floor (noCeiling=false), descent platforms
        {x:3840, y:60, w:960, h:340, theme:'battlefield',
            doors:[{side:'left', offset:0, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:70, w:300, h:40, x:40},      // top floor
                {y:160, w:300, h:40, x:360},    // mid floor
                {y:260, w:300, h:40, x:660}     // landing floor
            ],
            features:[
                {type:'torch', x:100, y:80},
                {type:'cobweb', x:460, y:40},
                {type:'roots', x:760, y:260}
            ]},
        // Room 6: No Man's Land (x:4800-5760) — rubble corridors
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:4800, y:60, w:960, h:340, theme:'battlefield',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:180, w:300, h:40, x:60},        // rubble ledge left
                {y:150, w:280, h:40, x:620}        // rubble ledge right
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'roots', x:250, y:260},
                {type:'roots', x:550, y:260},
                {type:'cobweb', x:400, y:80}
            ]},
        // Room 7: Ritual Approach (x:5760-6720) — walls closing in
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:5760, y:60, w:960, h:340, theme:'battlefield',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:170, w:400, h:40, x:280}        // central platform
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'cobweb', x:340, y:60},
                {type:'roots', x:640, y:260}
            ]},
        // Room 8: Ritual Chamber (x:6720-7680) — sunken pit
        // y:60, h:340, floor Y=372, entry ledge + pit shelves
        {x:6720, y:60, w:960, h:340, theme:'battlefield',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:0, size:60}],
            floors:[
                {y:280, w:100, h:40, x:28},     // entry ledge
                {y:280, w:300, h:40, x:130},    // shelf left
                {y:280, w:200, h:40, x:580}     // shelf right (climb out)
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'torch', x:780, y:160},
                {type:'roots', x:280, y:320},
                {type:'cobweb', x:480, y:40}
            ]},
        // Room 9: Boss Arena West (x:7680-8640)
        // y:60, h:340, floor Y=372, enemy Y≈320. Center platform at y:160
        {x:7680, y:60, w:960, h:340, theme:'battlefield',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:80, size:60}],
            floors:[
                {y:160, w:400, h:40, x:280}     // center platform
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'cobweb', x:380, y:80},
                {type:'roots', x:620, y:260}
            ]},
        // Room 10: Boss Arena East (x:8640-9600)
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:8640, y:60, w:960, h:340, theme:'battlefield',
            doors:[{side:'left', offset:80, size:60}],
            floors:[
                {y:160, w:360, h:40, x:300}        // elevated arena platform
            ],
            features:[
                {type:'torch', x:100, y:160},
                {type:'torch', x:760, y:160},
                {type:'cobweb', x:560, y:80},
                {type:'roots', x:260, y:260}
            ]},
    ],
    secrets: [
        // Buried treasure beneath no man's land
        {
            x: 5100, y: 380, w: 160, h: 40,
            triggerX: 5150, triggerY: 380,
            reward: 300,
            enemies: [
                {type: 'wildHunt', x: 5120, y: 360},
                {type: 'wildHunt', x: 5200, y: 360}
            ]
        }
    ],
    spikes: [
        // Room 1: trench floor spikes (floor Y=372)
        {x: 500, y: 356, w: 60},
        {x: 780, y: 356, w: 48},
        // Room 2: trench corridor spikes (floor Y=372)
        {x: 1050, y: 356, w: 60},
        {x: 1350, y: 356, w: 60},
        {x: 1680, y: 356, w: 48},
        // Room 5: descent hazards (floor Y=372)
        {x: 4450, y: 356, w: 48},
        // Room 6: no man's land floor spikes (floor Y=372)
        {x: 5100, y: 356, w: 60},
        {x: 5500, y: 356, w: 48},
        // Room 8: ritual pit ceiling spikes
        {x: 7000, y: 88, w: 72, direction: 'down'},
        {x: 7300, y: 88, w: 60, direction: 'down'},
    ],
    enemies: [
        // Room 1: Trench entrance — floor Y=372, enemy Y≈320
        {type:'nekker', x:500, y:320},
        {type:'nekker', x:750, y:320},
        // Room 2: Trench corridor — floor Y=372, enemy Y≈320
        {type:'wraith', x:1400, y:320},
        // Room 3: Surface breakout — upper floor at room.y+160=220, enemy Y≈170
        {type:'ghoul', x:2400, y:170},
        {type:'ghoul', x:2650, y:170},
        // Room 4: Siege tower ground — floor Y=372, enemy Y≈320
        {type:'nekker', x:3050, y:320},
        // Room 4: Siege tower floor 2 — at room.y+200=260, enemy Y≈208
        {type:'nekker', x:3100, y:208},
        // Room 4: Siege tower floor 3 — at room.y+140=200, enemy Y≈148
        {type:'wraith', x:3350, y:148},
        // Room 6: No man's land — floor Y=372, enemy Y≈320
        {type:'wildHunt', x:5050, y:320},
        {type:'wildHunt', x:5350, y:320},
        // Room 7: Ritual approach — floor Y=372, enemy Y≈320
        {type:'wraith', x:6150, y:320},
        // Room 8: Ritual chamber — floor Y=372, enemy Y≈320
        {type:'wildHunt', x:7000, y:320},
        {type:'wildHunt', x:7300, y:320},
        // Rooms 9-10: Boss arena — floor Y=372, enemy Y≈320
        {type:'wildHunt', x:8200, y:320},
        {type:'wildHunt', x:8700, y:320},
        {type:'wildHunt', x:9100, y:320},
    ]
};

})();
