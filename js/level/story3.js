(function() {
'use strict';

// Level 5: The Summit (14 rooms, ~960px each = 13440px)
// Prince-of-Persia room-based design: walls w:16 h:200+, floor y:340, ceiling y:80
W.StoryLevel5 = {
    name: 'The Summit',
    width: 13440,
    bgTheme: 'mountain',
    storyText: 'The mountain peak. The bound griffin must be freed — but the Wild Hunt wants it as a weapon.',
    platforms: [
        // ===== ROOMS 1–2: Mountain Path (x:0–1920) =====
        // Ice floors, rock walls. Wind sections (narrow gaps).

        // Room 1 (x:0-960)
        {x:0, y:340, w:960, h:60, type:'ice'},      // ice floor (solid)
        {x:0, y:80, w:16, h:260},                    // left rock wall
        {x:944, y:80, w:16, h:260},                  // right rock wall
        {x:0, y:80, w:960, h:16},                    // ceiling
        // Interior rock walls (wind corridors)
        {x:300, y:140, w:16, h:200},
        {x:600, y:140, w:16, h:200},

        // Room 2 (x:960-1920)
        {x:960, y:340, w:960, h:60, type:'ice'},     // ice floor (solid)
        {x:960, y:80, w:16, h:260},                  // left rock wall
        {x:1904, y:80, w:16, h:260},                 // right rock wall
        {x:960, y:80, w:960, h:16},                  // ceiling
        // Interior rock walls (wind corridor)
        {x:1150, y:120, w:16, h:220},
        {x:1400, y:140, w:16, h:200},
        {x:1650, y:120, w:16, h:220},

        // ===== ROOMS 3-4: Ice Cave (x:1920-3840) =====

        // Room 3 (x:1920-2880)
        {x:1920, y:340, w:960, h:60, type:'ice'},   // ice floor (solid)
        {x:1920, y:80, w:16, h:260},                // left wall
        {x:2864, y:80, w:16, h:260},                // right wall
        {x:1920, y:80, w:960, h:16},                // ceiling
        // Ice pillars (walls)
        {x:2150, y:120, w:16, h:220},
        {x:2400, y:140, w:16, h:200},
        {x:2650, y:120, w:16, h:220},

        // Room 4 (x:2880-3840)
        {x:2880, y:340, w:960, h:60, type:'ice'},   // ice floor (solid)
        {x:2880, y:80, w:16, h:260},                // left wall
        {x:3824, y:80, w:16, h:260},                // right wall
        {x:2880, y:80, w:960, h:16},                // ceiling
        // Ice walls (tight cave)
        {x:3050, y:100, w:16, h:240},
        {x:3250, y:120, w:16, h:220},
        {x:3450, y:100, w:16, h:240},
        {x:3650, y:120, w:16, h:220},

        // ===== ROOMS 5-6: Frozen Hall (x:3840-5760) =====

        // Room 5 (x:3840-4800)
        {x:3840, y:340, w:960, h:60, type:'ice'},   // ice floor (solid)
        {x:3840, y:80, w:16, h:260},                // left wall
        {x:4784, y:80, w:16, h:260},                // right wall
        {x:3840, y:80, w:960, h:16},                // ceiling
        // Ice pillars (columns)
        {x:4080, y:80, w:16, h:200},
        {x:4320, y:80, w:16, h:200},
        {x:4560, y:80, w:16, h:200},
        // Thick 2nd floor (gap 4200-4380 for climbing)
        {x:3860, y:220, w:340, h:40, type:'ice'},   // upper floor left
        {x:4380, y:220, w:400, h:40, type:'ice'},   // upper floor right

        // Room 6 (x:4800-5760)
        {x:4800, y:340, w:960, h:60, type:'ice'},   // ice floor (solid)
        {x:4800, y:80, w:16, h:260},                // left wall
        {x:5744, y:80, w:16, h:260},                // right wall
        {x:4800, y:80, w:960, h:16},                // ceiling
        // Ice pillars
        {x:5040, y:80, w:16, h:200},
        {x:5280, y:80, w:16, h:200},
        {x:5520, y:80, w:16, h:200},
        // Thick 2nd floor
        {x:4820, y:220, w:900, h:40, type:'ice'},   // upper floor (full width)

        // ===== ROOMS 7-8: Ascent Shaft (x:5760-7680) =====

        // Room 7 (x:5760-6720)
        {x:5760, y:340, w:960, h:60, type:'ice'},   // base floor (solid)
        {x:5760, y:80, w:16, h:260},                // left wall
        {x:6704, y:80, w:16, h:260},                // right wall
        {x:5760, y:80, w:960, h:16},                // ceiling
        // Narrow shaft walls
        {x:5960, y:80, w:16, h:260},
        {x:6504, y:80, w:16, h:260},
        // Thick ascending floors inside shaft
        {x:5980, y:260, w:520, h:40, type:'ice'},   // floor 2 (full shaft width)
        {x:5980, y:180, w:520, h:40, type:'ice'},   // floor 3
        {x:5980, y:100, w:520, h:40, type:'ice'},   // floor 4 (top)

        // Room 8 (x:6720-7680)
        {x:6720, y:340, w:960, h:60, type:'ice'},   // base floor (solid)
        {x:6720, y:80, w:16, h:260},                // left wall
        {x:7664, y:80, w:16, h:260},                // right wall
        {x:6720, y:80, w:960, h:16},                // ceiling
        // Narrow shaft walls
        {x:6920, y:80, w:16, h:260},
        {x:7464, y:80, w:16, h:260},
        // Thick ascending floors
        {x:6940, y:260, w:520, h:40, type:'ice'},   // floor 2
        {x:6940, y:180, w:520, h:40, type:'ice'},   // floor 3
        {x:6940, y:100, w:520, h:40, type:'ice'},   // floor 4 (top)

        // ===== ROOMS 9-10: Wild Hunt Fortress (x:7680-9600) =====

        // Room 9 (x:7680-8640)
        {x:7680, y:340, w:960, h:60},               // floor (solid)
        {x:7680, y:80, w:16, h:260},                // left wall
        {x:8624, y:80, w:16, h:260},                // right wall
        {x:7680, y:80, w:960, h:16},                // ceiling
        // Fortress corridor walls
        {x:7920, y:140, w:16, h:200},
        {x:8160, y:120, w:16, h:220},
        {x:8400, y:140, w:16, h:200},

        // Room 10 (x:8640-9600)
        {x:8640, y:340, w:960, h:60},               // floor (solid)
        {x:8640, y:80, w:16, h:260},                // left wall
        {x:9584, y:80, w:16, h:260},                // right wall
        {x:8640, y:80, w:960, h:16},                // ceiling
        // Fortress corridors
        {x:8880, y:120, w:16, h:220},
        {x:9120, y:140, w:16, h:200},
        {x:9360, y:120, w:16, h:220},

        // ===== ROOMS 11-12: Throne Room Approach (x:9600-11520) =====

        // Room 11 (x:9600-10560)
        {x:9600, y:340, w:960, h:60},               // floor (solid)
        {x:9600, y:80, w:16, h:260},                // left wall
        {x:10544, y:80, w:16, h:260},               // right wall
        {x:9600, y:80, w:960, h:16},                // ceiling
        // Narrowing corridor walls
        {x:9800, y:100, w:16, h:240},
        {x:10000, y:110, w:16, h:230},
        {x:10200, y:100, w:16, h:240},
        {x:10350, y:110, w:16, h:230},

        // Room 12 (x:10560-11520)
        {x:10560, y:340, w:960, h:60},              // floor (solid)
        {x:10560, y:80, w:16, h:260},               // left wall
        {x:11504, y:80, w:16, h:260},               // right wall
        {x:10560, y:80, w:960, h:16},               // ceiling
        // Tightest corridor walls
        {x:10700, y:100, w:16, h:240},
        {x:10880, y:110, w:16, h:230},
        {x:11060, y:100, w:16, h:240},
        {x:11240, y:100, w:16, h:240},
        {x:11380, y:110, w:16, h:230},

        // ===== ROOMS 13-14: Griffin Arena (x:11520-13440) =====
        {x:11520, y:340, w:1920, h:60, type:'ice'}, // wide arena floor (solid)
        {x:11520, y:80, w:16, h:260},               // left wall
        {x:13424, y:80, w:16, h:260},               // right wall
        // NO CEILING — open sky!
        // Arena pillars (low, for cover)
        {x:11900, y:200, w:16, h:140},
        {x:12300, y:200, w:16, h:140},
        {x:12700, y:200, w:16, h:140},
        {x:13100, y:200, w:16, h:140},
        // Thick elevated platforms for boss arena
        {x:11700, y:220, w:300, h:40, type:'ice'},   // thick shelf left
        {x:12400, y:220, w:300, h:40, type:'ice'},   // thick shelf center
        {x:13000, y:220, w:300, h:40, type:'ice'},   // thick shelf right

        // SECRET: Dragon's cache — hidden high in ascent shaft
        {x:6150, y:90, w:160, h:40, type:'ice'},
    ],
    rooms: [
        // Room 1: Mountain Path West (wind corridors)
        {x:0, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:150, y:300},
                {type:'crystal', x:500, y:280},
                {type:'chains', x:300, y:140},
                {type:'chains', x:600, y:140}
            ]},
        // Room 2: Mountain Path East
        {x:960, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:1100, y:300},
                {type:'crystal', x:1500, y:280},
                {type:'chains', x:1400, y:120},
                {type:'chains', x:1650, y:120}
            ]},
        // Room 3: Ice Cave West (tight passages)
        {x:1920, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:2050, y:300},
                {type:'crystal', x:2550, y:280},
                {type:'chains', x:2150, y:120},
                {type:'chains', x:2650, y:120}
            ]},
        // Room 4: Ice Cave East (even tighter)
        {x:2880, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:2980, y:300},
                {type:'crystal', x:3400, y:280},
                {type:'crystal', x:3700, y:290},
                {type:'chains', x:3250, y:120}
            ]},
        // Room 5: Frozen Hall West (ice pillars)
        {x:3840, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:3950, y:300},
                {type:'crystal', x:4400, y:260},
                {type:'chains', x:4080, y:100},
                {type:'chains', x:4560, y:100}
            ]},
        // Room 6: Frozen Hall East
        {x:4800, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:4950, y:290},
                {type:'crystal', x:5400, y:280},
                {type:'chains', x:5040, y:100},
                {type:'chains', x:5520, y:100}
            ]},
        // Room 7: Ascent Shaft Lower (vertical climb)
        {x:5760, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:5860, y:300},
                {type:'crystal', x:6400, y:300},
                {type:'chains', x:5960, y:100},
                {type:'chains', x:6504, y:100}
            ]},
        // Room 8: Ascent Shaft Upper
        {x:6720, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:6820, y:300},
                {type:'crystal', x:7350, y:300},
                {type:'chains', x:6920, y:100},
                {type:'chains', x:7464, y:100}
            ]},
        // Room 9: Wild Hunt Fortress West
        {x:7680, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:7800, y:300},
                {type:'crystal', x:8300, y:280},
                {type:'chains', x:7920, y:140}
            ]},
        // Room 10: Wild Hunt Fortress East
        {x:8640, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:8780, y:300},
                {type:'crystal', x:9250, y:280},
                {type:'chains', x:8880, y:120},
                {type:'chains', x:9360, y:120}
            ]},
        // Room 11: Throne Room Approach West (narrowing)
        {x:9600, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:9720, y:300},
                {type:'crystal', x:10150, y:280},
                {type:'chains', x:9800, y:100},
                {type:'chains', x:10200, y:100}
            ]},
        // Room 12: Throne Room Approach East (tightest)
        {x:10560, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:200, size:60}],
            features:[
                {type:'crystal', x:10660, y:300},
                {type:'crystal', x:11180, y:280},
                {type:'chains', x:10700, y:100},
                {type:'chains', x:11240, y:100},
                {type:'crystal', x:11350, y:290}
            ]},
        // Room 13: Griffin Arena West (open sky, no ceiling)
        {x:11520, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:200, size:60}, {side:'right', offset:0, size:340}],
            features:[
                {type:'crystal', x:11650, y:300},
                {type:'crystal', x:12050, y:260},
                {type:'chains', x:11900, y:200}
            ]},
        // Room 14: Griffin Arena East (open sky, no ceiling)
        {x:12480, y:60, w:960, h:340, theme:'mountain',
            doors:[{side:'left', offset:0, size:340}],
            features:[
                {type:'crystal', x:12600, y:300},
                {type:'crystal', x:13000, y:260},
                {type:'crystal', x:13200, y:280},
                {type:'chains', x:12700, y:200}
            ]},
    ],
    secrets: [
        {
            x: 6150, y: 90, w: 160, h: 40,
            triggerX: 6200, triggerY: 90,
            reward: 400,
            enemies: [
                {type: 'griffin', x: 6180, y: 70}
            ]
        }
    ],
    spikes: [
        // Rooms 1–2: mountain path ice spikes
        {x: 200, y: 324, w: 60},
        {x: 800, y: 324, w: 48},
        {x: 1300, y: 324, w: 48},
        {x: 1700, y: 324, w: 60},
        // Rooms 3–4: ice cave floor spikes
        {x: 2100, y: 324, w: 60},
        {x: 2550, y: 324, w: 48},
        {x: 3100, y: 324, w: 48},
        {x: 3500, y: 324, w: 60},
        // Rooms 5–6: frozen hall ceiling icicles
        {x: 4200, y: 96, w: 60, direction: 'down'},
        {x: 4500, y: 96, w: 48, direction: 'down'},
        {x: 5150, y: 96, w: 60, direction: 'down'},
        {x: 5450, y: 96, w: 48, direction: 'down'},
        // Rooms 7–8: shaft floor spikes (death below)
        {x: 5850, y: 324, w: 48},
        {x: 6800, y: 324, w: 48},
        // Rooms 9–10: fortress traps
        {x: 8050, y: 324, w: 60},
        {x: 8300, y: 324, w: 48},
        {x: 9000, y: 324, w: 60},
        {x: 9300, y: 324, w: 48},
        // Rooms 11–12: corridor spikes
        {x: 10050, y: 324, w: 48},
        {x: 10900, y: 324, w: 48},
        {x: 11200, y: 324, w: 60},
    ],
    enemies: [
        // Rooms 1–2: Mountain path — nekkers
        {type:'nekker', x:400, y:320},
        {type:'nekker', x:700, y:320},
        {type:'nekker', x:1250, y:320},
        {type:'nekker', x:1600, y:320},
        // Rooms 3–4: Ice cave — wraiths
        {type:'wraith', x:2200, y:320},
        {type:'wraith', x:2600, y:320},
        {type:'wraith', x:3150, y:320},
        {type:'wraith', x:3550, y:320},
        // Rooms 5–6: Frozen hall — wild hunt
        {type:'wildHunt', x:4150, y:320},
        {type:'wildHunt', x:4500, y:320},
        {type:'wildHunt', x:5100, y:320},
        {type:'wildHunt', x:5400, y:320},
        // Rooms 7–8: Ascent shaft (sparse)
        {type:'nekker', x:6100, y:280},
        {type:'nekker', x:7100, y:280},
        // Rooms 9–10: Wild Hunt fortress — 2 per room
        {type:'wildHunt', x:8000, y:320},
        {type:'wildHunt', x:8400, y:320},
        {type:'wildHunt', x:8950, y:320},
        {type:'wildHunt', x:9350, y:320},
        // Rooms 11–12: Throne room approach — wild hunt + wraiths
        {type:'wildHunt', x:9900, y:320},
        {type:'wraith', x:10150, y:320},
        {type:'wildHunt', x:10800, y:320},
        {type:'wraith', x:11100, y:320},
        // Rooms 13–14: Griffin arena — griffin boss + 2 noblemen
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
