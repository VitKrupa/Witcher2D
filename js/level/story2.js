(function() {
'use strict';

// Level 3: The Abandoned Keep — Prince-of-Persia room-based castle (12 rooms = 11520px)
W.StoryLevel3 = {
    name: 'The Abandoned Keep',
    width: 11520,
    bgTheme: 'castle',
    storyText: 'Captured documents reveal Nilfgaard funds the Witch Hunters. Their base: an old fortress.',
    platforms: [
        // ===== ROOM 1: Gate Room (x:0–960) =====
        // Floor
        {x:0, y:340, w:960, h:60},
        // Ceiling
        {x:0, y:80, w:960, h:16},
        // Left wall (level edge)
        {x:0, y:80, w:16, h:260},
        // Right wall (portcullis divider — gap at floor level for passage)
        {x:944, y:80, w:16, h:200},
        // Inner portcullis columns
        {x:300, y:80, w:16, h:120},
        {x:620, y:80, w:16, h:120},
        // Raised stone ledge (portcullis feel)
        {x:160, y:280, w:140, h:16},
        {x:480, y:260, w:160, h:16},
        {x:760, y:290, w:120, h:16},

        // ===== ROOM 2: Entry Hall (x:960–1920) =====
        // Floor
        {x:960, y:340, w:960, h:60},
        // Ceiling (tall room)
        {x:960, y:80, w:960, h:16},
        // Left wall
        {x:960, y:80, w:16, h:200},
        // Right wall
        {x:1904, y:80, w:16, h:200},
        // Balcony at y:160 (left side)
        {x:976, y:160, w:280, h:16},
        // Balcony at y:160 (right side)
        {x:1620, y:160, w:280, h:16},
        // Chandelier platform
        {x:1320, y:120, w:200, h:16},
        // Mid-height stepping ledge
        {x:1180, y:240, w:120, h:16},
        {x:1560, y:240, w:120, h:16},

        // ===== ROOM 3: Staircase Room (x:1920–2880) =====
        // Floor
        {x:1920, y:340, w:960, h:60},
        // Ceiling
        {x:1920, y:80, w:960, h:16},
        // Left wall
        {x:1920, y:80, w:16, h:260},
        // Right wall
        {x:2864, y:80, w:16, h:260},
        // Diagonal stepping platforms (y:340 up to y:100)
        {x:1960, y:300, w:120, h:16},
        {x:2100, y:260, w:120, h:16},
        {x:2240, y:220, w:120, h:16},
        {x:2380, y:180, w:120, h:16},
        {x:2520, y:140, w:120, h:16},
        {x:2680, y:100, w:160, h:16},

        // ===== ROOM 4: Upper Corridor (x:2880–3840) =====
        // Floor (raised — tight corridor)
        {x:2880, y:240, w:960, h:60},
        // Low ceiling
        {x:2880, y:140, w:960, h:16},
        // Left wall
        {x:2880, y:140, w:16, h:100},
        // Right wall
        {x:3824, y:140, w:16, h:100},
        // Small obstacle crates
        {x:3100, y:210, w:60, h:30},
        {x:3400, y:210, w:60, h:30},
        // Overhead ledge (barely reachable)
        {x:3200, y:170, w:140, h:16},

        // ===== ROOM 5: Great Hall (x:3840–4800) =====
        // Floor
        {x:3840, y:340, w:960, h:60},
        // High ceiling
        {x:3840, y:60, w:960, h:16},
        // Left wall
        {x:3840, y:60, w:16, h:280},
        // Right wall
        {x:4784, y:60, w:16, h:280},
        // Interior columns (thin walls)
        {x:4080, y:60, w:16, h:200},
        {x:4320, y:60, w:16, h:200},
        {x:4560, y:60, w:16, h:200},
        // Upper balcony left
        {x:3860, y:160, w:200, h:16},
        // Upper balcony right
        {x:4580, y:160, w:200, h:16},
        // Mid-level platforms between columns
        {x:4100, y:220, w:200, h:16},
        {x:4340, y:220, w:200, h:16},
        // High centre perch
        {x:4200, y:120, w:160, h:16},

        // ===== ROOM 6: Kitchen / Storage (x:4800–5760) =====
        // Floor
        {x:4800, y:340, w:960, h:60},
        // Low ceiling
        {x:4800, y:240, w:960, h:16},
        // Left wall
        {x:4800, y:240, w:16, h:100},
        // Right wall
        {x:5744, y:240, w:16, h:100},
        // Crate stacks
        {x:4900, y:300, w:80, h:40},
        {x:5050, y:310, w:60, h:30},
        {x:5200, y:290, w:100, h:50},
        {x:5400, y:300, w:80, h:40},
        {x:5560, y:310, w:60, h:30},

        // ===== ROOM 7: Dungeon Descent (x:5760–6720) =====
        // Upper entry floor (short)
        {x:5760, y:340, w:300, h:60},
        // Ceiling
        {x:5760, y:80, w:960, h:16},
        // Left wall
        {x:5760, y:80, w:16, h:400},
        // Right wall
        {x:6704, y:80, w:16, h:400},
        // Deep pit floor at y:420
        {x:6060, y:420, w:660, h:60},
        // Ledges to climb down
        {x:5900, y:280, w:120, h:16},
        {x:6080, y:340, w:120, h:16},
        {x:6260, y:380, w:120, h:16},
        {x:6460, y:340, w:120, h:16},
        // Mid ledge
        {x:6300, y:260, w:100, h:16},

        // ===== ROOM 8: Dungeon Cells (x:6720–7680) =====
        // Underground floor
        {x:6720, y:420, w:960, h:60},
        // Low ceiling (underground)
        {x:6720, y:340, w:960, h:16},
        // Left wall
        {x:6720, y:340, w:16, h:80},
        // Right wall
        {x:7664, y:340, w:16, h:80},
        // Cell divider walls
        {x:7000, y:340, w:16, h:60},
        {x:7300, y:340, w:16, h:60},
        // Tiny cell ledges
        {x:6780, y:390, w:80, h:16},
        {x:7080, y:380, w:80, h:16},
        {x:7380, y:390, w:80, h:16},

        // ===== ROOM 9: Dungeon Exit (x:7680–8640) =====
        // Deep floor
        {x:7680, y:420, w:300, h:60},
        // Ceiling
        {x:7680, y:80, w:960, h:16},
        // Left wall
        {x:7680, y:80, w:16, h:400},
        // Right wall
        {x:8624, y:80, w:16, h:260},
        // Stepping stones climbing from y:420 to y:160
        {x:7800, y:380, w:100, h:16},
        {x:7940, y:340, w:100, h:16},
        {x:8080, y:290, w:100, h:16},
        {x:8220, y:240, w:100, h:16},
        {x:8360, y:200, w:100, h:16},
        {x:8500, y:160, w:140, h:16},

        // ===== ROOM 10: Tower Climb (x:8640–9600) =====
        // Floor
        {x:8640, y:340, w:960, h:60},
        // Ceiling (very high)
        {x:8640, y:60, w:960, h:16},
        // Left wall
        {x:8640, y:60, w:16, h:280},
        // Right wall
        {x:9584, y:60, w:16, h:280},
        // Ledges every ~60px from y:340 up to y:60
        {x:8680, y:280, w:100, h:16},
        {x:9460, y:280, w:100, h:16},
        {x:8780, y:220, w:120, h:16},
        {x:9340, y:220, w:120, h:16},
        {x:8880, y:160, w:100, h:16},
        {x:9240, y:160, w:100, h:16},
        {x:9000, y:100, w:140, h:16},
        {x:9380, y:100, w:100, h:16},
        // Top platform
        {x:9100, y:80, w:200, h:16},

        // ===== ROOM 11: Sky Bridge (x:9600–10560) =====
        // HIGH floor — no ground below!
        {x:9600, y:120, w:960, h:16},
        // Left wall
        {x:9600, y:80, w:16, h:56},
        // Right wall
        {x:10544, y:80, w:16, h:56},
        // Ceiling
        {x:9600, y:80, w:960, h:16},
        // Narrow bridge segments (gaps for danger)
        {x:9700, y:120, w:200, h:16},
        {x:9960, y:120, w:180, h:16},
        {x:10200, y:120, w:200, h:16},
        {x:10460, y:120, w:80, h:16},

        // ===== ROOM 12: Boss Chamber (x:10560–11520) =====
        // Floor
        {x:10560, y:340, w:960, h:60},
        // Ceiling
        {x:10560, y:80, w:960, h:16},
        // Left wall
        {x:10560, y:80, w:16, h:260},
        // Right wall (level edge)
        {x:11504, y:80, w:16, h:260},
        // Arena interior walls (multi-level pillars)
        {x:10800, y:80, w:16, h:160},
        {x:11200, y:80, w:16, h:160},
        // Lower platforms
        {x:10620, y:280, w:160, h:16},
        {x:10880, y:280, w:160, h:16},
        {x:11240, y:280, w:160, h:16},
        // Upper platforms
        {x:10700, y:180, w:140, h:16},
        {x:11000, y:160, w:200, h:16},
        {x:11300, y:180, w:140, h:16},
        // High centre perch
        {x:10950, y:100, w:160, h:16},

        // SECRET 1: Hidden dungeon alcove (room 8 area)
        {x:7100, y:460, w:160, h:16},
        // SECRET 2: Hidden armory above great hall (room 5 area)
        {x:4200, y:90, w:160, h:16},
    ],
    secrets: [
        {
            x: 7100, y: 460, w: 160, h: 16,
            triggerX: 7150, triggerY: 460,
            reward: 300,
            enemies: [
                {type: 'wraith', x: 7120, y: 440},
                {type: 'nilfSoldier', x: 7200, y: 440}
            ]
        },
        {
            x: 4200, y: 90, w: 160, h: 16,
            triggerX: 4250, triggerY: 90,
            reward: 350,
            enemies: [
                {type: 'nilfSoldier', x: 4220, y: 70},
                {type: 'nilfSoldier', x: 4280, y: 70},
                {type: 'nilfSoldier', x: 4340, y: 70}
            ]
        }
    ],
    spikes: [
        // Room 1: portcullis trap
        {x: 400, y: 324, w: 60},
        // Room 3: staircase hazard
        {x: 2300, y: 324, w: 48},
        // Room 4: corridor floor spikes
        {x: 3250, y: 224, w: 72},
        // Room 5: great hall ceiling spikes
        {x: 4150, y: 76, w: 60, direction: 'down'},
        {x: 4450, y: 76, w: 60, direction: 'down'},
        // Room 7: dungeon descent pit spikes
        {x: 6200, y: 404, w: 60},
        // Room 8: dungeon cell floor spikes
        {x: 6850, y: 404, w: 48},
        {x: 7150, y: 404, w: 48},
        // Room 11: sky bridge gap spikes (instant death below)
        {x: 9920, y: 384, w: 36},
        {x: 10160, y: 384, w: 36},
    ],
    enemies: [
        // Room 1 — Gate Room: 2 nilfgaardians
        {type:'nilfSoldier', x:350, y:320},
        {type:'nilfSoldier', x:700, y:320},
        // Room 2 — Entry Hall: 1 nilfgaardian on balcony
        {type:'nilfSoldier', x:1650, y:140},
        // Room 3 — Staircase: 2 guards (one low, one high)
        {type:'nilfSoldier', x:2050, y:320},
        {type:'nilfSoldier', x:2600, y:120},
        // Room 4 — Upper Corridor: 2 nilfgaardians
        {type:'nilfSoldier', x:3150, y:220},
        {type:'nilfSoldier', x:3550, y:220},
        // Room 5 — Great Hall: 3 enemies multi-level
        {type:'nilfSoldier', x:3950, y:320},
        {type:'nilfSoldier', x:4200, y:200},
        {type:'nilfSoldier', x:4650, y:140},
        // Room 6 — Kitchen/Storage: 1 nobleman
        {type:'nobleman', x:5300, y:320},
        // Room 7 — Dungeon Descent: 1 wraith
        {type:'wraith', x:6350, y:400},
        // Room 8 — Dungeon Cells: 2 wraiths
        {type:'wraith', x:6850, y:400},
        {type:'wraith', x:7400, y:400},
        // Room 10 — Tower Climb: 1 guard on top
        {type:'nilfSoldier', x:9150, y:60},
        // Room 11 — Sky Bridge: 2 wild hunt
        {type:'wildHunt', x:9850, y:100},
        {type:'wildHunt', x:10300, y:100},
        // Room 12 — Boss Chamber: 3 nilfgaardians (boss fight)
        {type:'nilfSoldier', x:10750, y:320},
        {type:'nilfSoldier', x:11050, y:140},
        {type:'nilfSoldier', x:11350, y:320},
    ]
};

// Level 4: The Cursed Battlefield (10 screens = 9600px)
W.StoryLevel4 = {
    name: 'The Cursed Battlefield',
    width: 9600,
    bgTheme: 'battlefield',
    storyText: 'An ancient battlefield where Nilfgaard performs a dark ritual to bind a griffin as weapon.',
    platforms: [
        // Screen 1: trench entrance
        {x:0, y:340, w:620, h:60},
        {x:100, y:280, w:80, h:16},
        {x:350, y:290, w:100, h:16},
        // Screen 2: no man's land
        {x:680, y:340, w:400, h:60},
        {x:750, y:270, w:80, h:16},
        {x:900, y:295, w:80, h:16},
        // Screen 3: catapult wreckage
        {x:1140, y:340, w:520, h:60},
        {x:1200, y:290, w:150, h:16, type:'wood'},
        {x:1410, y:275, w:100, h:16, type:'wood'},
        // Screen 4: open field
        {x:1720, y:340, w:840, h:60},
        {x:1900, y:280, w:100, h:16},
        {x:2060, y:275, w:120, h:16},
        {x:2240, y:280, w:80, h:16},
        // Screen 5: rubble
        {x:2620, y:340, w:540, h:60},
        {x:2700, y:270, w:120, h:16},
        {x:2880, y:270, w:80, h:16},
        // Screen 6-7: assault uphill
        {x:3220, y:340, w:640, h:60},
        {x:3360, y:270, w:100, h:16},
        {x:3520, y:275, w:120, h:16},
        {x:3700, y:280, w:100, h:16},
        {x:3910, y:320, w:540, h:60},
        {x:4050, y:290, w:100, h:16},
        {x:4210, y:275, w:120, h:16},
        // Screen 8: wild hunt territory
        {x:4510, y:340, w:850, h:60},
        {x:4700, y:300, w:140, h:16},
        {x:4900, y:275, w:120, h:16},
        {x:5080, y:300, w:100, h:16},
        // Screen 9: ritual circle approach
        {x:5420, y:340, w:640, h:60},
        {x:5600, y:290, w:120, h:16},
        {x:5780, y:275, w:100, h:16},
        // Screen 10: boss arena
        {x:6120, y:340, w:1000, h:60},
        {x:6300, y:300, w:160, h:16},
        {x:6520, y:275, w:140, h:16},
        {x:6720, y:300, w:120, h:16},
        // Extended to end
        {x:7180, y:340, w:2420, h:60},
        // SECRET: Buried treasure pit
        {x:3950, y:380, w:160, h:16},
    ],
    secrets: [
        {
            x: 3950, y: 380, w: 160, h: 16,
            triggerX: 4000, triggerY: 380,
            reward: 300,
            enemies: [
                {type: 'wildHunt', x: 3970, y: 360},
                {type: 'wildHunt', x: 4060, y: 360}
            ]
        }
    ],
    spikes: [
        // Trench spikes - screen 1
        {x: 450, y: 324, w: 60},
        // No man's land gap (x:620..680)
        {x: 630, y: 384, w: 48},
        // Catapult wreckage traps - screen 3
        {x: 1350, y: 324, w: 48},
        // Spike trenches in open field - screen 4
        {x: 1850, y: 324, w: 72},
        {x: 2100, y: 324, w: 48},
        // Rubble area - screen 5
        {x: 2650, y: 324, w: 60},
    ],
    enemies: [
        // Wraiths screens 1,3,5
        {type:'wraith', x:300, y:260},
        {type:'wraith', x:1350, y:260},
        {type:'wraith', x:2800, y:260},
        // Nekkers screens 2,4
        {type:'nekker', x:800, y:280},
        {type:'nekker', x:900, y:280},
        {type:'nekker', x:2000, y:280},
        {type:'nekker', x:2200, y:280},
        // Wild Hunt screens 6,7,8
        {type:'wildHunt', x:3500, y:280},
        {type:'wildHunt', x:3800, y:280},
        {type:'wildHunt', x:4150, y:280},
        {type:'wildHunt', x:4800, y:280},
        // Ghouls screen 9
        {type:'ghoul', x:5650, y:280},
        {type:'ghoul', x:5850, y:280},
        // Boss: Wild Hunt Rider
        {type:'wildHunt', x:6500, y:280},
        {type:'wildHunt', x:6700, y:280},
        {type:'wildHunt', x:6900, y:280},
    ]
};

})();
