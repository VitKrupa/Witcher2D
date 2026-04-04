(function() {
'use strict';

// Level 1: The Blighted Village (8 rooms, Prince-of-Persia style)
// ROOM-BASED: walled rooms ~800px each, doorways = gaps in walls
W.StoryLevel1 = {
    name: 'The Blighted Village',
    width: 6400,
    bgTheme: 'village',
    storyText: 'A village plagued by drowners... The alderman\'s contract seems straightforward, but something feels wrong.',
    platforms: [
        // ============================================================
        // ROOM 1: ALLEY (x:0-800) — floor, walls, ceiling, crates
        // ============================================================
        // Floor
        {x:0, y:340, w:800, h:60},
        // Ceiling
        {x:0, y:80, w:800, h:16},
        // Left wall (solid, no door)
        {x:0, y:80, w:16, h:260},
        // Right wall — gap (doorway) from y:200 to y:340
        {x:784, y:80, w:16, h:120},           // upper right wall
        // Crates to climb
        {x:200, y:260, w:80, h:16},           // crate 1 (low)
        {x:300, y:180, w:80, h:16},           // crate 2 (high)
        // Ledge near ceiling
        {x:500, y:120, w:120, h:16},          // upper ledge

        // ============================================================
        // ROOM 2: HOUSE GROUND FLOOR (x:800-1600) — shelf, stairs up
        // ============================================================
        // Floor
        {x:800, y:340, w:800, h:60},
        // Left wall — gap (doorway) matching room 1 exit
        {x:800, y:80, w:16, h:120},           // upper left wall
        // Right wall — gap (doorway) from y:80 to y:200 (upper exit)
        {x:1584, y:200, w:16, h:140},         // lower right wall
        // Internal shelf
        {x:900, y:240, w:200, h:16},          // shelf
        // Stairs going up: platforms ascending right
        {x:1100, y:240, w:100, h:16},         // stair step 1
        {x:1250, y:160, w:120, h:16},         // stair step 2 (upper floor)
        // Vertical pillar (interior wall segment)
        {x:1050, y:160, w:16, h:100},         // interior pillar

        // ============================================================
        // ROOM 3: HOUSE UPPER + COURTYARD DROP (x:1600-2400)
        // ============================================================
        // Upper floor continues from room 2
        {x:1600, y:160, w:300, h:16},         // upper floor
        // Left wall — gap at top (doorway from room 2 upper exit)
        {x:1600, y:200, w:16, h:140},         // lower left wall
        // Courtyard floor (drop down)
        {x:1600, y:340, w:800, h:60},         // ground floor
        // Corridor walls
        {x:1900, y:80, w:16, h:260},          // mid wall (corridor divider)
        // Gap in mid wall at bottom: y:280-340 for passage
        // Platforms on right side
        {x:2000, y:260, w:120, h:16},         // right side ledge
        {x:2150, y:180, w:100, h:16},         // right side upper
        // Right wall — doorway at ground level y:240-340
        {x:2384, y:80, w:16, h:160},          // upper right wall

        // ============================================================
        // ROOM 4: CHURCH (x:2400-3200) — tall room, tower climb
        // ============================================================
        // Floor
        {x:2400, y:340, w:800, h:60},
        // Left wall — doorway at ground y:240-340
        {x:2400, y:80, w:16, h:160},          // upper left wall
        // Right wall — doorway at ground y:260-340
        {x:3184, y:80, w:16, h:180},          // upper right wall
        // NO ceiling (tall room, open to sky)
        // Tower ledges — climbing sequence
        {x:2500, y:280, w:80, h:16},          // ledge 1
        {x:2620, y:220, w:80, h:16},          // ledge 2
        {x:2500, y:160, w:80, h:16},          // ledge 3
        {x:2620, y:100, w:100, h:16},         // ledge 4 (near top)
        {x:2750, y:80, w:120, h:16},          // tower top platform
        // Descent on right side
        {x:2950, y:140, w:80, h:16},          // step down 1
        {x:3050, y:220, w:100, h:16},         // step down 2

        // ============================================================
        // ROOM 5: MARKET CELLAR (x:3200-4000) — drop underground
        // ============================================================
        // Ground level entry (partial floor)
        {x:3200, y:340, w:200, h:60},         // entry ground
        // Left wall — doorway at ground y:260-340
        {x:3200, y:80, w:16, h:180},          // upper left wall
        // DROP: no floor from x:3400-3700
        // Underground platforms
        {x:3350, y:380, w:150, h:16},         // underground ledge 1
        {x:3500, y:420, w:200, h:16},         // deep floor
        // Low ceiling over underground section
        {x:3300, y:300, w:500, h:16},         // cellar ceiling
        // Climb back up
        {x:3700, y:360, w:80, h:16},          // step up 1
        {x:3780, y:300, w:80, h:16},          // step up 2
        {x:3850, y:240, w:100, h:16},         // step up 3
        // Exit ground
        {x:3800, y:340, w:200, h:60},         // exit ground
        // Right wall — doorway y:240-340
        {x:3984, y:80, w:16, h:160},          // upper right wall

        // ============================================================
        // ROOM 6: DAMAGED BUILDING (x:4000-4800) — broken floors
        // ============================================================
        // Floor
        {x:4000, y:340, w:800, h:60},
        // Left wall — doorway y:240-340
        {x:4000, y:80, w:16, h:160},          // upper left wall
        // Right wall — doorway y:280-340
        {x:4784, y:80, w:16, h:200},          // upper right wall
        // Broken floors at 3 heights
        {x:4080, y:280, w:150, h:16},         // broken floor low
        {x:4280, y:200, w:120, h:16},         // broken floor mid
        {x:4480, y:130, w:140, h:16},         // broken floor high
        // Interior walls creating tight corridors
        {x:4230, y:200, w:16, h:140},         // interior wall 1
        {x:4450, y:130, w:16, h:140},         // interior wall 2
        // Connecting ledge
        {x:4600, y:220, w:100, h:16},         // connector

        // ============================================================
        // ROOM 7: NEKKER CAVE (x:4800-5600) — underground, tight
        // ============================================================
        // Ceiling (low, oppressive)
        {x:4800, y:280, w:800, h:16},
        // Floor
        {x:4800, y:380, w:800, h:20},
        // Left wall — small doorway y:280-380
        {x:4800, y:80, w:16, h:200},          // upper left wall (above ceiling)
        // Right wall — doorway y:300-380
        {x:5584, y:280, w:16, h:20},          // right wall above door
        // Interior obstacles
        {x:4950, y:340, w:80, h:16},          // raised rock 1
        {x:5150, y:320, w:100, h:16},         // raised rock 2
        {x:5350, y:340, w:60, h:16},          // raised rock 3
        // Ceiling stalactites (narrow platforms above)
        {x:5050, y:300, w:60, h:16},          // stalactite ledge 1
        {x:5250, y:300, w:60, h:16},          // stalactite ledge 2

        // ============================================================
        // ROOM 8: EXIT CORRIDOR (x:5600-6400) — ground level, final
        // ============================================================
        // Floor
        {x:5600, y:340, w:800, h:60},
        // Left wall — doorway y:300-380 matching cave exit
        {x:5600, y:80, w:16, h:220},          // upper left wall
        // Right wall (solid, level end)
        {x:6384, y:80, w:16, h:260},
        // Ceiling (partial)
        {x:5600, y:80, w:400, h:16},
        // Vertical elements
        {x:5700, y:260, w:100, h:16},         // ledge low
        {x:5850, y:180, w:120, h:16},         // ledge mid
        {x:6050, y:260, w:100, h:16},         // ledge low 2
        {x:6200, y:180, w:120, h:16},         // ledge mid 2
        // Interior pillar
        {x:5980, y:180, w:16, h:160},         // corridor pillar
    ],
    enemies: [
        // Room 1: Alley — 1 bandit
        {type:'bandit', x:600, y:280},
        // Room 2: House ground floor — 2 drowners
        {type:'drowner', x:950, y:280},
        {type:'drowner', x:1200, y:180},
        // Room 3: (no enemies, traversal challenge)
        // Room 4: Church — 1 bandit at top, 1 at bottom
        {type:'bandit', x:2780, y:20},         // tower top guard
        {type:'bandit', x:2550, y:280},        // ground patrol
        // Room 5: Market cellar — nekkers underground
        {type:'nekker', x:3450, y:360},
        {type:'nekker', x:3550, y:360},
        // Room 6: Damaged building — 2 bandits in corridors
        {type:'bandit', x:4180, y:280},
        {type:'bandit', x:4520, y:70},
        // Room 7: Nekker cave — 3 nekkers (tight)
        {type:'nekker', x:4950, y:320},
        {type:'nekker', x:5150, y:320},
        {type:'nekker', x:5350, y:320},
        // Room 8: Exit corridor — 3 drowners
        {type:'drowner', x:5800, y:280},
        {type:'drowner', x:6000, y:280},
        {type:'drowner', x:6200, y:280},
    ],
    spikes: [
        {x:3500, y:440, w:120, direction:'up'},     // cellar deep floor
        {x:5050, y:370, w:80, direction:'up'},       // nekker cave floor
        {x:5250, y:370, w:80, direction:'up'},       // nekker cave floor 2
    ],
    secrets: [
        {triggerX:2780, triggerY:80, reward:200,
         enemies:[{type:'nobleman',x:2800,y:20},{type:'nobleman',x:2850,y:20}]},
    ]
};

// Level 2: The Swamp Depths (10 screens = 9600px)
// VERTICAL: ground → tree canopy → underground caves → watchtower
W.StoryLevel2 = {
    name: 'The Swamp Depths',
    width: 9600,
    bgTheme: 'swamp',
    storyText: 'The trail leads deep into the swamp. Witch Hunter camps dot the mire — they\'re driving monsters toward the village.',
    platforms: [
        // === SCREEN 1: Swamp entrance — descending path ===
        {x:0, y:340, w:350, h:60},
        {x:200, y:260, w:80, h:16, type:'wood'},  // elevated root
        // Drop to lower ground
        {x:400, y:370, w:200, h:30},              // lower marsh
        {x:500, y:300, w:80, h:12, type:'wood'},   // log bridge

        // === SCREEN 2: Tree canopy section ===
        {x:650, y:340, w:200, h:60},              // ground island
        {x:700, y:250, w:60, h:12, type:'wood'},   // branch 1
        {x:780, y:180, w:80, h:12, type:'wood'},   // branch 2 (higher)
        {x:870, y:120, w:100, h:12, type:'wood'},  // canopy platform
        {x:980, y:180, w:70, h:12, type:'wood'},   // descent branch
        {x:1050, y:250, w:80, h:12, type:'wood'},  // descent branch 2

        // === SCREEN 3: Floating debris multi-height ===
        {x:1150, y:340, w:150, h:60},             // ground
        {x:1350, y:310, w:80, h:12, type:'wood'},  // low float
        {x:1450, y:250, w:100, h:12, type:'wood'}, // mid float
        {x:1560, y:190, w:80, h:12, type:'wood'},  // high float
        {x:1660, y:250, w:80, h:12, type:'wood'},  // back down
        {x:1750, y:340, w:200, h:60},             // ground

        // === SCREEN 4: Underground cave system ===
        {x:2000, y:340, w:150, h:60},             // ground before cave
        // Cave entrance: drop down
        {x:2050, y:380, w:200, h:20},             // cave level 1
        {x:2100, y:420, w:250, h:20},             // cave level 2 (deep)
        {x:2250, y:360, w:100, h:16},             // cave stepping stone
        {x:2350, y:300, w:80, h:16},              // cave exit up
        {x:2400, y:240, w:100, h:16},             // cave exit
        {x:2450, y:340, w:200, h:60},             // back to surface

        // === SCREEN 5-6: Witch hunter camp — fortress structure ===
        {x:2700, y:340, w:800, h:60},             // camp ground
        {x:2750, y:260, w:120, h:16, type:'wood'}, // camp platform 1
        {x:2900, y:180, w:150, h:16, type:'wood'}, // watchtower floor 1
        {x:2950, y:110, w:100, h:16, type:'wood'}, // watchtower floor 2
        {x:3000, y:50, w:80, h:16, type:'wood'},   // watchtower top!
        {x:3100, y:180, w:100, h:16, type:'wood'}, // camp platform 2
        {x:3200, y:260, w:120, h:16, type:'wood'}, // camp platform 3
        {x:3350, y:340, w:200, h:60},             // camp exit ground

        // === SCREEN 7: Treacherous crossing ===
        {x:3600, y:370, w:100, h:30},             // low marsh
        {x:3720, y:310, w:60, h:12, type:'wood'},  // log 1
        {x:3800, y:250, w:80, h:12, type:'wood'},  // log 2 (higher)
        {x:3900, y:310, w:60, h:12, type:'wood'},  // log 3
        {x:3980, y:370, w:100, h:30},             // low marsh 2

        // === SCREEN 8: Deep swamp approach ===
        {x:4130, y:340, w:400, h:60},             // solid ground
        {x:4200, y:260, w:100, h:16},             // elevated
        {x:4350, y:190, w:80, h:16},              // high
        {x:4450, y:260, w:100, h:16},             // back down

        // === SCREEN 9-10: Boss area ===
        {x:4600, y:340, w:600, h:60},             // boss ground
        {x:4650, y:250, w:120, h:16},             // boss upper 1
        {x:4800, y:170, w:100, h:16},             // boss upper 2
        {x:4950, y:250, w:100, h:16},             // boss upper 3
        // Extended
        {x:5260, y:340, w:4340, h:60},
    ],
    enemies: [
        // Canopy ghouls
        {type:'ghoul', x:780, y:120},
        {type:'ghoul', x:1000, y:120},
        // Floating debris drowners
        {type:'drowner', x:1400, y:250},
        {type:'drowner', x:1600, y:130},
        // Cave ghouls
        {type:'ghoul', x:2120, y:360},
        {type:'ghoul', x:2200, y:360},
        // Witch hunter camp (multi-level!)
        {type:'witchHunter', x:2800, y:280},
        {type:'witchHunter', x:2950, y:120},  // watchtower
        {type:'witchHunter', x:3050, y:0},     // watchtower top!
        {type:'witchHunter', x:3150, y:280},
        // Crossing drowners
        {type:'drowner', x:3750, y:250},
        {type:'drowner', x:3900, y:250},
        // Boss area
        {type:'witchHunter', x:4700, y:280},
        {type:'ghoul', x:4800, y:110},
        {type:'ghoul', x:4950, y:190},
    ],
    spikes: [
        {x:2100, y:440, w:120, direction:'up'},   // deep cave
        {x:3650, y:390, w:80, direction:'up'},     // marsh trap
    ],
    secrets: [
        {triggerX:3000, triggerY:50, reward:250,
         enemies:[{type:'wraith',x:3020,y:0},{type:'ghoul',x:3060,y:0}]},
    ]
};

})();
