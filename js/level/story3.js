(function() {
'use strict';

// Level 5: The Summit (14 rooms, ~960px each = 13440px)
// Collision generated from Room.generateCollision() — platforms: [] is empty
// Mountain theme: ice rooms, ascending shaft rooms, open-sky griffin arena
// Room floor Y = room.y + room.h - 28. Enemy Y = floor Y - 52.
W.StoryLevel5 = {
    name: 'The Summit',
    width: 13440,
    bgTheme: 'mountain',
    storyText: 'The mountain peak. The bound griffin must be freed — but the Wild Hunt wants it as a weapon.',
    platforms: [],
    rooms: [
        // Room 1: Mountain Path West (x:0-960) — wind corridors
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:0, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'right', offset:200, size:60}],
            floors:[],
            features:[
                {type:'crystals', x:150, y:260},
                {type:'crystals', x:500, y:240},
                {type:'chains', x:300, y:80},
                {type:'chains', x:600, y:80}
            ]},
        // Room 2: Mountain Path East (x:960-1920)
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:960, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[],
            features:[
                {type:'crystals', x:140, y:260},
                {type:'crystals', x:540, y:240},
                {type:'chains', x:440, y:60},
                {type:'chains', x:690, y:60}
            ]},
        // Room 3: Ice Cave West (x:1920-2880) — tight passages
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:1920, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[],
            features:[
                {type:'crystals', x:130, y:260},
                {type:'crystals', x:630, y:240},
                {type:'chains', x:230, y:60},
                {type:'chains', x:730, y:60}
            ]},
        // Room 4: Ice Cave East (x:2880-3840) — even tighter
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:2880, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[],
            features:[
                {type:'crystals', x:100, y:260},
                {type:'crystals', x:520, y:240},
                {type:'crystals', x:820, y:250},
                {type:'chains', x:370, y:60}
            ]},
        // Room 5: Frozen Hall West (x:3840-4800) — ice pillars, upper floor
        // y:60, h:340, floor Y=372, upper floor at y:160
        {x:3840, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:160, w:340, h:40, x:28},     // upper floor left
                {y:160, w:400, h:40, x:540}     // upper floor right
            ],
            features:[
                {type:'crystals', x:110, y:260},
                {type:'crystals', x:560, y:220},
                {type:'chains', x:240, y:40},
                {type:'chains', x:720, y:40}
            ]},
        // Room 6: Frozen Hall East (x:4800-5760) — full upper floor
        // y:60, h:340, floor Y=372, upper floor at y:160
        {x:4800, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:160, w:900, h:40, x:28}      // upper floor (full width)
            ],
            features:[
                {type:'crystals', x:150, y:250},
                {type:'crystals', x:600, y:240},
                {type:'chains', x:240, y:40},
                {type:'chains', x:720, y:40}
            ]},
        // Room 7: Ascent Shaft Lower (x:5760-6720) — vertical climb
        // y:60, h:340, floor Y=372, 3 ascending floors inside shaft
        {x:5760, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:200, w:520, h:40, x:220},    // floor 2
                {y:120, w:520, h:40, x:220},    // floor 3
                {y:40, w:520, h:40, x:220}      // floor 4 (top)
            ],
            features:[
                {type:'crystals', x:100, y:260},
                {type:'crystals', x:640, y:260},
                {type:'chains', x:200, y:40},
                {type:'chains', x:744, y:40}
            ]},
        // Room 8: Ascent Shaft Upper (x:6720-7680)
        // y:60, h:340, floor Y=372, 3 ascending floors
        {x:6720, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[
                {y:200, w:520, h:40, x:220},    // floor 2
                {y:120, w:520, h:40, x:220},    // floor 3
                {y:40, w:520, h:40, x:220}      // floor 4 (top)
            ],
            features:[
                {type:'crystals', x:100, y:260},
                {type:'crystals', x:630, y:260},
                {type:'chains', x:200, y:40},
                {type:'chains', x:744, y:40}
            ]},
        // Room 9: Wild Hunt Fortress West (x:7680-8640)
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:7680, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[],
            features:[
                {type:'crystals', x:120, y:260},
                {type:'crystals', x:620, y:240},
                {type:'chains', x:240, y:80}
            ]},
        // Room 10: Wild Hunt Fortress East (x:8640-9600)
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:8640, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[],
            features:[
                {type:'crystals', x:140, y:260},
                {type:'crystals', x:610, y:240},
                {type:'chains', x:240, y:60},
                {type:'chains', x:720, y:60}
            ]},
        // Room 11: Throne Room Approach West (x:9600-10560) — narrowing
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:9600, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[],
            features:[
                {type:'crystals', x:120, y:260},
                {type:'crystals', x:550, y:240},
                {type:'chains', x:200, y:40},
                {type:'chains', x:600, y:40}
            ]},
        // Room 12: Throne Room Approach East (x:10560-11520) — tightest
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:10560, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            floors:[],
            features:[
                {type:'crystals', x:100, y:260},
                {type:'crystals', x:620, y:240},
                {type:'chains', x:140, y:40},
                {type:'chains', x:680, y:40},
                {type:'crystals', x:790, y:250}
            ]},
        // Room 13: Griffin Arena West (x:11520-12480) — open sky, no ceiling
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:11520, y:60, w:960, h:340, theme:'mountain',
            noCeiling: true,
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:0, size:340}],
            floors:[
                {y:160, w:300, h:40, x:180}     // elevated shelf
            ],
            features:[
                {type:'crystals', x:130, y:260},
                {type:'crystals', x:530, y:220},
                {type:'chains', x:380, y:140}
            ]},
        // Room 14: Griffin Arena East (x:12480-13440) — open sky, no ceiling
        // y:60, h:340, floor Y=372, enemy Y≈320
        {x:12480, y:60, w:960, h:340, theme:'mountain',
            noCeiling: true,
            doors:[{side:'left', offset:0, size:340}],
            floors:[
                {y:160, w:300, h:40, x:400},    // center shelf
                {y:160, w:300, h:40, x:520}     // right shelf
            ],
            features:[
                {type:'crystals', x:120, y:260},
                {type:'crystals', x:520, y:220},
                {type:'crystals', x:720, y:240},
                {type:'chains', x:220, y:140}
            ]},
    ],
    secrets: [
        // Dragon's cache — hidden high in ascent shaft (room 7 area)
        {
            x: 6150, y: 90, w: 160, h: 40,
            triggerX: 6200, triggerY: 90,
            reward: 400,
            enemies: [
                {type: 'griffin', x: 6180, y: 40}
            ]
        }
    ],
    spikes: [
        // Rooms 1-2: mountain path ice spikes (floor Y=372)
        {x: 200, y: 356, w: 60},
        {x: 800, y: 356, w: 48},
        {x: 1300, y: 356, w: 48},
        {x: 1700, y: 356, w: 60},
        // Rooms 3-4: ice cave floor spikes (floor Y=372)
        {x: 2100, y: 356, w: 60},
        {x: 2550, y: 356, w: 48},
        {x: 3100, y: 356, w: 48},
        {x: 3500, y: 356, w: 60},
        // Rooms 5-6: frozen hall ceiling icicles
        {x: 4200, y: 88, w: 60, direction: 'down'},
        {x: 4500, y: 88, w: 48, direction: 'down'},
        {x: 5150, y: 88, w: 60, direction: 'down'},
        {x: 5450, y: 88, w: 48, direction: 'down'},
        // Rooms 7-8: shaft floor spikes (floor Y=372)
        {x: 5850, y: 356, w: 48},
        {x: 6800, y: 356, w: 48},
        // Rooms 9-10: fortress traps (floor Y=372)
        {x: 8050, y: 356, w: 60},
        {x: 8300, y: 356, w: 48},
        {x: 9000, y: 356, w: 60},
        {x: 9300, y: 356, w: 48},
        // Rooms 11-12: corridor spikes (floor Y=372)
        {x: 10050, y: 356, w: 48},
        {x: 10900, y: 356, w: 48},
        {x: 11200, y: 356, w: 60},
    ],
    enemies: [
        // Rooms 1-2: Mountain path — nekkers, floor Y=372, enemy Y≈320
        {type:'nekker', x:400, y:320},
        {type:'nekker', x:700, y:320},
        {type:'nekker', x:1250, y:320},
        {type:'nekker', x:1600, y:320},
        // Rooms 3-4: Ice cave — wraiths, floor Y=372, enemy Y≈320
        {type:'wraith', x:2200, y:320},
        {type:'wraith', x:2600, y:320},
        {type:'wraith', x:3150, y:320},
        {type:'wraith', x:3550, y:320},
        // Rooms 5-6: Frozen hall — wild hunt, ground Y≈320
        {type:'wildHunt', x:4150, y:320},
        {type:'wildHunt', x:4500, y:320},
        {type:'wildHunt', x:5100, y:320},
        {type:'wildHunt', x:5400, y:320},
        // Rooms 7-8: Ascent shaft — nekkers on floor 2 at room.y+200=260, enemy Y≈208
        {type:'nekker', x:6100, y:208},
        {type:'nekker', x:7100, y:208},
        // Rooms 9-10: Wild Hunt fortress — floor Y=372, enemy Y≈320
        {type:'wildHunt', x:8000, y:320},
        {type:'wildHunt', x:8400, y:320},
        {type:'wildHunt', x:8950, y:320},
        {type:'wildHunt', x:9350, y:320},
        // Rooms 11-12: Throne room approach — floor Y=372, enemy Y≈320
        {type:'wildHunt', x:9900, y:320},
        {type:'wraith', x:10150, y:320},
        {type:'wildHunt', x:10800, y:320},
        {type:'wraith', x:11100, y:320},
        // Rooms 13-14: Griffin arena — floor Y=372, griffin Y≈270, noblemen Y≈320
        {type:'griffin', x:12400, y:270},
        {type:'nobleman', x:11800, y:320},
        {type:'nobleman', x:13000, y:320},
    ]
};

// STORY LEVELS REGISTRY — collects all 5 levels in order
W.StoryLevels = [
    W.StoryLevel1,
    W.StoryLevel2,
    W.StoryLevel3,
    W.StoryLevel4,
    W.StoryLevel5
];

})();
