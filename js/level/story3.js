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

        // Room 1 (x:0–960)
        {x:0, y:340, w:960, h:60, type:'ice'},      // ice floor
        {x:0, y:80, w:16, h:260},                    // left rock wall
        {x:944, y:80, w:16, h:260},                  // right rock wall
        {x:0, y:80, w:960, h:16},                    // ceiling
        // Narrow wind section — interior walls
        {x:300, y:140, w:16, h:200},                 // rock wall 1
        {x:600, y:140, w:16, h:200},                 // rock wall 2
        {x:150, y:280, w:100, h:16, type:'ice'},     // ice step
        {x:420, y:260, w:80, h:16, type:'ice'},      // ice step
        {x:720, y:270, w:100, h:16, type:'ice'},     // ice step

        // Room 2 (x:960–1920)
        {x:960, y:340, w:960, h:60, type:'ice'},     // ice floor
        {x:960, y:80, w:16, h:260},                  // left rock wall
        {x:1904, y:80, w:16, h:260},                 // right rock wall
        {x:960, y:80, w:960, h:16},                  // ceiling
        // Narrow wind corridor
        {x:1150, y:120, w:16, h:220},               // rock wall
        {x:1400, y:140, w:16, h:200},               // rock wall
        {x:1650, y:120, w:16, h:220},               // rock wall
        {x:1050, y:280, w:80, h:16, type:'ice'},
        {x:1280, y:260, w:80, h:16, type:'ice'},
        {x:1520, y:270, w:80, h:16, type:'ice'},
        {x:1760, y:280, w:100, h:16, type:'ice'},

        // ===== ROOMS 3–4: Ice Cave (x:1920–3840) =====
        // Ceiling, walls, floor. Tight passages.

        // Room 3 (x:1920–2880)
        {x:1920, y:340, w:960, h:60, type:'ice'},   // ice floor
        {x:1920, y:80, w:16, h:260},                // left wall
        {x:2864, y:80, w:16, h:260},                // right wall
        {x:1920, y:80, w:960, h:16},                // ceiling
        // Cave pillars — tight corridors
        {x:2150, y:120, w:16, h:220},               // ice pillar
        {x:2400, y:140, w:16, h:200},               // ice pillar
        {x:2650, y:120, w:16, h:220},               // ice pillar
        {x:2000, y:280, w:100, h:16, type:'ice'},
        {x:2250, y:260, w:80, h:16, type:'ice'},
        {x:2500, y:270, w:100, h:16, type:'ice'},
        {x:2750, y:260, w:80, h:16, type:'ice'},

        // Room 4 (x:2880–3840)
        {x:2880, y:340, w:960, h:60, type:'ice'},   // ice floor
        {x:2880, y:80, w:16, h:260},                // left wall
        {x:3824, y:80, w:16, h:260},                // right wall
        {x:2880, y:80, w:960, h:16},                // ceiling
        // Even tighter cave
        {x:3050, y:100, w:16, h:240},               // ice wall
        {x:3250, y:120, w:16, h:220},               // ice wall
        {x:3450, y:100, w:16, h:240},               // ice wall
        {x:3650, y:120, w:16, h:220},               // ice wall
        {x:2950, y:270, w:80, h:16, type:'ice'},
        {x:3150, y:260, w:80, h:16, type:'ice'},
        {x:3350, y:280, w:80, h:16, type:'ice'},
        {x:3550, y:260, w:80, h:16, type:'ice'},
        {x:3750, y:270, w:60, h:16, type:'ice'},

        // ===== ROOMS 5–6: Frozen Hall (x:3840–5760) =====
        // Large icy room with ice pillars. Wild Hunt.

        // Room 5 (x:3840–4800)
        {x:3840, y:340, w:960, h:60, type:'ice'},   // ice floor
        {x:3840, y:80, w:16, h:260},                // left wall
        {x:4784, y:80, w:16, h:260},                // right wall
        {x:3840, y:80, w:960, h:16},                // ceiling
        // Ice pillars (decorative columns)
        {x:4080, y:80, w:16, h:200},                // ice pillar 1
        {x:4320, y:80, w:16, h:200},                // ice pillar 2
        {x:4560, y:80, w:16, h:200},                // ice pillar 3
        // Platforms between pillars
        {x:3900, y:280, w:140, h:16, type:'ice'},
        {x:4140, y:240, w:140, h:16, type:'ice'},
        {x:4380, y:200, w:140, h:16, type:'ice'},
        {x:4620, y:280, w:120, h:16, type:'ice'},

        // Room 6 (x:4800–5760)
        {x:4800, y:340, w:960, h:60, type:'ice'},   // ice floor
        {x:4800, y:80, w:16, h:260},                // left wall
        {x:5744, y:80, w:16, h:260},                // right wall
        {x:4800, y:80, w:960, h:16},                // ceiling
        // More ice pillars
        {x:5040, y:80, w:16, h:200},                // pillar 1
        {x:5280, y:80, w:16, h:200},                // pillar 2
        {x:5520, y:80, w:16, h:200},                // pillar 3
        {x:4900, y:270, w:100, h:16, type:'ice'},
        {x:5120, y:240, w:120, h:16, type:'ice'},
        {x:5360, y:260, w:100, h:16, type:'ice'},
        {x:5600, y:280, w:100, h:16, type:'ice'},

        // ===== ROOMS 7–8: Ascent Shaft (x:5760–7680) =====
        // Vertical climb through narrow shaft. Platforms every ~60px.

        // Room 7 (x:5760–6720)
        {x:5760, y:340, w:960, h:60, type:'ice'},   // base floor
        {x:5760, y:80, w:16, h:260},                // left wall
        {x:6704, y:80, w:16, h:260},                // right wall
        {x:5760, y:80, w:960, h:16},                // ceiling
        // Narrow shaft walls
        {x:5960, y:80, w:16, h:260},                // inner left
        {x:6504, y:80, w:16, h:260},                // inner right
        // Platforms every ~60px ascending
        {x:5980, y:280, w:120, h:16, type:'ice'},
        {x:6360, y:280, w:120, h:16, type:'ice'},
        {x:5980, y:220, w:120, h:16, type:'ice'},
        {x:6360, y:220, w:120, h:16, type:'ice'},
        {x:5980, y:160, w:120, h:16, type:'ice'},
        {x:6360, y:160, w:120, h:16, type:'ice'},
        {x:6120, y:100, w:160, h:16, type:'ice'},   // top

        // Room 8 (x:6720–7680)
        {x:6720, y:340, w:960, h:60, type:'ice'},   // base floor
        {x:6720, y:80, w:16, h:260},                // left wall
        {x:7664, y:80, w:16, h:260},                // right wall
        {x:6720, y:80, w:960, h:16},                // ceiling
        // Narrow shaft walls
        {x:6920, y:80, w:16, h:260},                // inner left
        {x:7464, y:80, w:16, h:260},                // inner right
        // Platforms ascending
        {x:6940, y:280, w:120, h:16, type:'ice'},
        {x:7320, y:280, w:120, h:16, type:'ice'},
        {x:6940, y:220, w:120, h:16, type:'ice'},
        {x:7320, y:220, w:120, h:16, type:'ice'},
        {x:6940, y:160, w:120, h:16, type:'ice'},
        {x:7320, y:160, w:120, h:16, type:'ice'},
        {x:7100, y:100, w:160, h:16, type:'ice'},   // top

        // ===== ROOMS 9–10: Wild Hunt Fortress (x:7680–9600) =====
        // Room-based fortress. Tight corridors. 2 wild hunt per room.

        // Room 9 (x:7680–8640)
        {x:7680, y:340, w:960, h:60},               // floor
        {x:7680, y:80, w:16, h:260},                // left wall
        {x:8624, y:80, w:16, h:260},                // right wall
        {x:7680, y:80, w:960, h:16},                // ceiling
        // Fortress interior walls — tight corridors
        {x:7920, y:140, w:16, h:200},               // wall 1
        {x:8160, y:120, w:16, h:220},               // wall 2
        {x:8400, y:140, w:16, h:200},               // wall 3
        {x:7780, y:280, w:100, h:16},
        {x:8020, y:260, w:100, h:16},
        {x:8260, y:280, w:100, h:16},
        {x:8480, y:260, w:100, h:16},

        // Room 10 (x:8640–9600)
        {x:8640, y:340, w:960, h:60},               // floor
        {x:8640, y:80, w:16, h:260},                // left wall
        {x:9584, y:80, w:16, h:260},                // right wall
        {x:8640, y:80, w:960, h:16},                // ceiling
        // More fortress corridors
        {x:8880, y:120, w:16, h:220},               // wall 1
        {x:9120, y:140, w:16, h:200},               // wall 2
        {x:9360, y:120, w:16, h:220},               // wall 3
        {x:8740, y:280, w:100, h:16},
        {x:8980, y:260, w:100, h:16},
        {x:9220, y:270, w:100, h:16},
        {x:9440, y:280, w:100, h:16},

        // ===== ROOMS 11–12: Throne Room Approach (x:9600–11520) =====
        // Narrowing corridors, wild hunt + wraiths.

        // Room 11 (x:9600–10560)
        {x:9600, y:340, w:960, h:60},               // floor
        {x:9600, y:80, w:16, h:260},                // left wall
        {x:10544, y:80, w:16, h:260},               // right wall
        {x:9600, y:80, w:960, h:16},                // ceiling
        // Narrowing corridor walls
        {x:9800, y:100, w:16, h:240},               // wall 1
        {x:10000, y:110, w:16, h:230},              // wall 2
        {x:10200, y:100, w:16, h:240},              // wall 3
        {x:10350, y:110, w:16, h:230},              // wall 4 (very tight)
        {x:9700, y:280, w:80, h:16},
        {x:9900, y:260, w:80, h:16},
        {x:10100, y:270, w:80, h:16},
        {x:10280, y:260, w:60, h:16},

        // Room 12 (x:10560–11520)
        {x:10560, y:340, w:960, h:60},              // floor
        {x:10560, y:80, w:16, h:260},               // left wall
        {x:11504, y:80, w:16, h:260},               // right wall
        {x:10560, y:80, w:960, h:16},               // ceiling
        // Even tighter — walls closing in
        {x:10700, y:100, w:16, h:240},              // wall 1
        {x:10880, y:110, w:16, h:230},              // wall 2
        {x:11060, y:100, w:16, h:240},              // wall 3
        {x:11240, y:100, w:16, h:240},              // wall 4
        {x:11380, y:110, w:16, h:230},              // wall 5 (final squeeze)
        {x:10640, y:280, w:60, h:16},
        {x:10800, y:260, w:60, h:16},
        {x:10970, y:270, w:60, h:16},
        {x:11150, y:260, w:60, h:16},
        {x:11300, y:270, w:60, h:16},

        // ===== ROOMS 13–14: Griffin Arena (x:11520–13440) =====
        // ONLY open room — wide, walled but NO ceiling! Griffin boss + 2 noblemen.
        {x:11520, y:340, w:1920, h:60, type:'ice'}, // wide arena floor
        {x:11520, y:80, w:16, h:260},               // left wall
        {x:13424, y:80, w:16, h:260},               // right wall
        // NO CEILING — open sky!
        // Arena interior pillars (low, for cover)
        {x:11900, y:200, w:16, h:140},              // pillar 1
        {x:12300, y:200, w:16, h:140},              // pillar 2
        {x:12700, y:200, w:16, h:140},              // pillar 3
        {x:13100, y:200, w:16, h:140},              // pillar 4
        // Combat platforms
        {x:11650, y:280, w:140, h:16, type:'ice'},
        {x:11960, y:240, w:120, h:16, type:'ice'},
        {x:12200, y:280, w:140, h:16, type:'ice'},
        {x:12500, y:240, w:120, h:16, type:'ice'},
        {x:12760, y:280, w:140, h:16, type:'ice'},
        {x:13050, y:240, w:120, h:16, type:'ice'},
        // High perches (griffin landing spots)
        {x:12000, y:160, w:100, h:16, type:'ice'},
        {x:12600, y:160, w:100, h:16, type:'ice'},
        {x:13150, y:160, w:100, h:16, type:'ice'},

        // SECRET: Dragon's cache — hidden high in ascent shaft
        {x:6150, y:90, w:160, h:16, type:'ice'},
    ],
    secrets: [
        {
            x: 6150, y: 90, w: 160, h: 16,
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
