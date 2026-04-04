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
    ],
    rooms: [
        // Room 1: Alley (x:0-800)
        {x:0, y:80, w:800, h:320, theme:'village',
         doors:[{side:'right', offset:200, size:140}],
         features:[{type:'torch',x:400,y:100}, {type:'cobweb',x:20,y:20}, {type:'cobweb',x:740,y:20}]},
        // Room 2: House Ground Floor (x:800-1600)
        {x:800, y:80, w:800, h:320, theme:'village',
         doors:[{side:'left', offset:200, size:140}, {side:'right', offset:0, size:120}],
         features:[{type:'torch',x:100,y:120}, {type:'shelf',x:100,y:160,w:200}, {type:'torch',x:600,y:120}]},
        // Room 3: House Upper + Courtyard Drop (x:1600-2400)
        {x:1600, y:80, w:800, h:320, theme:'village',
         doors:[{side:'left', offset:120, size:140}, {side:'right', offset:160, size:160}],
         features:[{type:'torch',x:100,y:100}, {type:'window',x:400,y:100}, {type:'cobweb',x:750,y:20}]},
        // Room 4: Church (x:2400-3200) — tall, no ceiling
        {x:2400, y:80, w:800, h:320, theme:'village',
         doors:[{side:'left', offset:160, size:160}, {side:'right', offset:180, size:160}],
         features:[{type:'torch',x:100,y:120}, {type:'torch',x:680,y:120}, {type:'banner',x:400,y:90}, {type:'window',x:200,y:100}, {type:'window',x:600,y:100}]},
        // Room 5: Market Cellar (x:3200-4000)
        {x:3200, y:80, w:800, h:380, theme:'village',
         doors:[{side:'left', offset:180, size:160}, {side:'right', offset:160, size:160}],
         features:[{type:'torch',x:100,y:240}, {type:'cobweb',x:300,y:20}, {type:'shelf',x:600,y:200,w:80}, {type:'chains',x:400,y:260}]},
        // Room 6: Damaged Building (x:4000-4800)
        {x:4000, y:80, w:800, h:320, theme:'village',
         doors:[{side:'left', offset:160, size:160}, {side:'right', offset:200, size:120}],
         features:[{type:'torch',x:200,y:100}, {type:'cobweb',x:20,y:20}, {type:'cobweb',x:750,y:20}, {type:'shelf',x:500,y:160,w:60}]},
        // Room 7: Nekker Cave (x:4800-5600)
        {x:4800, y:80, w:800, h:320, theme:'village',
         doors:[{side:'left', offset:200, size:180}, {side:'right', offset:220, size:160}],
         features:[{type:'cobweb',x:100,y:220}, {type:'cobweb',x:400,y:220}, {type:'chains',x:600,y:240}, {type:'torch',x:700,y:250}]},
        // Room 8: Exit Corridor (x:5600-6400)
        {x:5600, y:80, w:800, h:320, theme:'village',
         doors:[{side:'left', offset:220, size:160}],
         features:[{type:'torch',x:200,y:100}, {type:'torch',x:600,y:100}, {type:'banner',x:400,y:90}, {type:'cobweb',x:750,y:20}]}
    ]
};

// Level 2: The Swamp Depths (10 rooms = 9600px)
// PRINCE-OF-PERSIA room-based design: walled rooms ~800-960px, swamp theme
W.StoryLevel2 = {
    name: 'The Swamp Depths',
    width: 9600,
    bgTheme: 'swamp',
    storyText: 'The trail leads deep into the swamp. Witch Hunter camps dot the mire — they\'re driving monsters toward the village.',
    platforms: [
        // ============================================================
        // ROOM 1: SWAMP ENTRANCE HUT (x:0–960)
        // Wooden hut at swamp edge. Small interior. 1 ghoul outside.
        // ============================================================
        // Floor
        {x:0, y:340, w:960, h:60},
        // Walls
        {x:0, y:140, w:16, h:200},                // left wall
        {x:944, y:140, w:16, h:200},              // right wall
        // Interior
        {x:100, y:240, w:200, h:16, type:'wood'}, // hut loft
        {x:350, y:280, w:120, h:16, type:'wood'}, // crate shelf
        {x:600, y:260, w:140, h:16, type:'wood'}, // porch awning

        // ============================================================
        // ROOM 2: HOLLOW TREE (x:960–1920)
        // Trunk walls. Climb branches inside tree. 1 drowner.
        // ============================================================
        // Floor
        {x:960, y:340, w:960, h:60},
        // Trunk walls
        {x:960, y:100, w:16, h:240},              // left trunk wall
        {x:1904, y:100, w:16, h:240},             // right trunk wall
        // Branches (climb up inside)
        {x:1100, y:240, w:160, h:14, type:'wood'},// branch at y:240
        {x:1300, y:160, w:180, h:14, type:'wood'},// branch at y:160
        {x:1500, y:100, w:200, h:14, type:'wood'},// branch at y:100
        {x:1720, y:180, w:120, h:14, type:'wood'},// descent branch

        // ============================================================
        // ROOM 3: CANOPY BRIDGE (x:1920–2880)
        // High floor y:160 (canopy). No ground — fall = death.
        // Wood platforms. 2 ghouls.
        // ============================================================
        // Walls
        {x:1920, y:120, w:16, h:220},             // left wall
        {x:2864, y:120, w:16, h:220},             // right wall
        // Canopy planks (the only footing — no ground below!)
        {x:1960, y:160, w:200, h:16, type:'wood'},// canopy plank 1
        {x:2200, y:160, w:180, h:16, type:'wood'},// canopy plank 2
        {x:2420, y:160, w:160, h:16, type:'wood'},// canopy plank 3
        {x:2620, y:160, w:220, h:16, type:'wood'},// canopy plank 4
        // High branches
        {x:2100, y:100, w:100, h:14, type:'wood'},// high branch
        {x:2500, y:100, w:100, h:14, type:'wood'},// high branch 2

        // ============================================================
        // ROOM 4: CAVE ENTRANCE (x:2880–3840)
        // Descent. Floor drops y:380→y:420. Ceiling y:300. Drowners.
        // ============================================================
        // Walls
        {x:2880, y:140, w:16, h:260},             // left wall
        {x:3824, y:140, w:16, h:260},             // right wall
        // Ceiling
        {x:2880, y:300, w:960, h:16},
        // Descending floors
        {x:2920, y:340, w:300, h:60},             // upper floor y:340
        {x:3300, y:380, w:280, h:20},             // mid drop y:380
        {x:3620, y:420, w:200, h:20},             // deep floor y:420
        // Stepping stone
        {x:3400, y:340, w:80, h:14, type:'wood'}, // wood stepping stone

        // ============================================================
        // ROOM 5: CAVE TUNNEL (x:3840–4800)
        // Underground. Low ceiling y:280. Tight. Spikes on floor.
        // ============================================================
        // Walls
        {x:3840, y:140, w:16, h:260},             // left wall
        {x:4784, y:140, w:16, h:260},             // right wall
        // Low ceiling
        {x:3840, y:280, w:960, h:16},
        // Floor
        {x:3840, y:340, w:960, h:60},
        // Raised planks (over spike gaps)
        {x:3960, y:310, w:120, h:14, type:'wood'},// raised plank 1
        {x:4200, y:310, w:100, h:14, type:'wood'},// raised plank 2
        {x:4500, y:310, w:140, h:14, type:'wood'},// raised plank 3

        // ============================================================
        // ROOM 6: WITCH HUNTER STOCKADE (x:4800–5760)
        // Wooden walls, 2 floors (y:340 ground, y:200 upper).
        // 2 witch hunters.
        // ============================================================
        // Walls
        {x:4800, y:100, w:16, h:300},             // left wall
        {x:5744, y:100, w:16, h:300},             // right wall
        // Ground floor
        {x:4800, y:340, w:960, h:60},
        // Upper floor (two sections with gap)
        {x:4850, y:200, w:400, h:16, type:'wood'},// upper floor left
        {x:5350, y:200, w:380, h:16, type:'wood'},// upper floor right
        // Mid scaffold + lookout
        {x:5100, y:270, w:120, h:14, type:'wood'},// mid scaffold
        {x:4900, y:130, w:100, h:14, type:'wood'},// high lookout

        // ============================================================
        // ROOM 7: PRISON ROOM (x:5760–6560) — TINY
        // Walls close. Ceiling low y:240. 1 witch hunter blocks exit.
        // ============================================================
        // Walls
        {x:5760, y:100, w:16, h:240},             // left wall
        {x:6544, y:100, w:16, h:240},             // right wall
        // Low ceiling
        {x:5760, y:240, w:800, h:16},
        // Floor
        {x:5760, y:340, w:800, h:60},
        // Shelves
        {x:5860, y:290, w:100, h:14, type:'wood'},// low shelf left
        {x:6300, y:290, w:100, h:14, type:'wood'},// low shelf right

        // ============================================================
        // ROOM 8: UNDERGROUND RIVER (x:6560–7520)
        // Cave, spike pits, stepping stones over gaps. 1 drowner.
        // ============================================================
        // Walls
        {x:6560, y:120, w:16, h:280},             // left wall
        {x:7504, y:120, w:16, h:280},             // right wall
        // Ground (split by river gaps)
        {x:6600, y:340, w:200, h:60},             // ground left
        // Stepping stones over river
        {x:6840, y:320, w:60, h:14, type:'wood'}, // stepping stone 1
        {x:6940, y:300, w:60, h:14, type:'wood'}, // stepping stone 2
        {x:7040, y:320, w:60, h:14, type:'wood'}, // stepping stone 3
        // Ground right
        {x:7200, y:340, w:300, h:60},
        // Elevated plank
        {x:7100, y:260, w:100, h:14, type:'wood'},// elevated plank

        // ============================================================
        // ROOM 9: BOSS APPROACH (x:7520–8480)
        // Tighter, walls close, ceiling lowers. 2 witch hunters.
        // ============================================================
        // Walls
        {x:7520, y:120, w:16, h:280},             // left wall
        {x:8464, y:120, w:16, h:280},             // right wall
        // Lowered ceiling
        {x:7520, y:260, w:960, h:16},
        // Floor
        {x:7520, y:340, w:960, h:60},
        // Planks
        {x:7620, y:300, w:140, h:14, type:'wood'},// plank 1
        {x:7900, y:300, w:120, h:14, type:'wood'},// plank 2
        {x:8200, y:300, w:140, h:14, type:'wood'},// plank 3

        // ============================================================
        // ROOM 10: BOSS CAVERN (x:8480–9600) — 1120px arena
        // Walled arena. Multi-level. Witch hunter captain + 2 ghouls.
        // ============================================================
        // Walls
        {x:8480, y:60, w:16, h:340},              // left wall
        {x:9584, y:60, w:16, h:340},              // right wall
        // Arena floor
        {x:8480, y:340, w:1120, h:60},
        // Upper platforms
        {x:8580, y:240, w:250, h:16, type:'wood'},// upper platform left
        {x:9200, y:240, w:250, h:16, type:'wood'},// upper platform right
        // Top center platform
        {x:8900, y:160, w:300, h:16, type:'wood'},// top center platform
        // Low steps
        {x:8700, y:300, w:100, h:14, type:'wood'},// low step left
        {x:9350, y:300, w:100, h:14, type:'wood'},// low step right
    ],
    enemies: [
        // Room 1: 1 ghoul outside hut
        {type:'ghoul', x:700, y:280},
        // Room 2: 1 drowner at base of tree
        {type:'drowner', x:1400, y:280},
        // Room 3: 2 ghouls on canopy
        {type:'ghoul', x:2250, y:100},
        {type:'ghoul', x:2650, y:100},
        // Room 4: 2 drowners in cave descent
        {type:'drowner', x:3350, y:320},
        {type:'drowner', x:3650, y:360},
        // Room 5: 2 ghouls in tunnel
        {type:'ghoul', x:4100, y:280},
        {type:'ghoul', x:4450, y:280},
        // Room 6: 2 witch hunters in stockade
        {type:'witchHunter', x:5000, y:280},
        {type:'witchHunter', x:5500, y:140},
        // Room 7: 1 witch hunter blocks exit
        {type:'witchHunter', x:6300, y:280},
        // Room 8: 1 drowner by the river
        {type:'drowner', x:7100, y:280},
        // Room 9: 2 witch hunters in approach
        {type:'witchHunter', x:7800, y:280},
        {type:'witchHunter', x:8300, y:280},
        // Room 10: witch hunter captain + 2 ghouls
        {type:'witchHunter', x:9050, y:100},
        {type:'ghoul', x:8700, y:280},
        {type:'ghoul', x:9350, y:280},
    ],
    spikes: [
        // Room 5: spikes on tunnel floor (gaps between planks)
        {x:4080, y:330, w:100, direction:'up'},
        {x:4350, y:330, w:100, direction:'up'},
        // Room 8: spike pits in river gaps
        {x:6810, y:390, w:100, direction:'up'},
        {x:7110, y:390, w:60, direction:'up'},
    ],
    secrets: [
        // Room 6: hidden loot on high lookout
        {triggerX:4950, triggerY:130, reward:250,
         enemies:[{type:'wraith',x:4970,y:80},{type:'ghoul',x:5010,y:80}]},
    ],
    rooms: [
        // Room 1: Swamp Entrance Hut (x:0-960)
        {x:0, y:140, w:960, h:260, theme:'swamp',
         doors:[{side:'right', offset:0, size:200}],
         features:[{type:'torch',x:200,y:40}, {type:'roots',x:800,y:180}, {type:'cobweb',x:20,y:20}]},
        // Room 2: Hollow Tree (x:960-1920)
        {x:960, y:100, w:960, h:300, theme:'swamp',
         doors:[{side:'left', offset:0, size:240}, {side:'right', offset:0, size:240}],
         features:[{type:'roots',x:100,y:40}, {type:'roots',x:800,y:40}, {type:'cobweb',x:480,y:20}, {type:'roots',x:400,y:200}]},
        // Room 3: Canopy Bridge (x:1920-2880)
        {x:1920, y:120, w:960, h:220, theme:'swamp',
         doors:[{side:'left', offset:0, size:220}, {side:'right', offset:0, size:220}],
         features:[{type:'roots',x:100,y:20}, {type:'roots',x:860,y:20}, {type:'cobweb',x:480,y:10}]},
        // Room 4: Cave Entrance (x:2880-3840)
        {x:2880, y:140, w:960, h:300, theme:'swamp',
         doors:[{side:'left', offset:0, size:260}, {side:'right', offset:0, size:260}],
         features:[{type:'roots',x:100,y:20}, {type:'cobweb',x:800,y:20}, {type:'torch',x:480,y:180}, {type:'roots',x:600,y:200}]},
        // Room 5: Cave Tunnel (x:3840-4800)
        {x:3840, y:140, w:960, h:260, theme:'swamp',
         doors:[{side:'left', offset:0, size:260}, {side:'right', offset:0, size:260}],
         features:[{type:'cobweb',x:100,y:150}, {type:'cobweb',x:500,y:150}, {type:'roots',x:800,y:160}, {type:'crystals',x:300,y:160}]},
        // Room 6: Witch Hunter Stockade (x:4800-5760)
        {x:4800, y:100, w:960, h:300, theme:'swamp',
         doors:[{side:'left', offset:0, size:300}, {side:'right', offset:0, size:300}],
         features:[{type:'torch',x:150,y:40}, {type:'torch',x:800,y:40}, {type:'torch',x:480,y:120}, {type:'banner',x:480,y:30}]},
        // Room 7: Prison Room (x:5760-6560)
        {x:5760, y:100, w:800, h:300, theme:'swamp',
         doors:[{side:'left', offset:0, size:240}, {side:'right', offset:0, size:240}],
         features:[{type:'chains',x:200,y:120}, {type:'chains',x:600,y:120}, {type:'cobweb',x:400,y:20}, {type:'torch',x:400,y:160}]},
        // Room 8: Underground River (x:6560-7520)
        {x:6560, y:120, w:960, h:280, theme:'swamp',
         doors:[{side:'left', offset:0, size:280}, {side:'right', offset:0, size:280}],
         features:[{type:'roots',x:100,y:20}, {type:'cobweb',x:800,y:20}, {type:'torch',x:480,y:40}, {type:'crystals',x:300,y:200}]},
        // Room 9: Boss Approach (x:7520-8480)
        {x:7520, y:120, w:960, h:280, theme:'swamp',
         doors:[{side:'left', offset:0, size:280}, {side:'right', offset:0, size:280}],
         features:[{type:'torch',x:200,y:40}, {type:'torch',x:760,y:40}, {type:'cobweb',x:480,y:150}, {type:'roots',x:600,y:180}]},
        // Room 10: Boss Cavern (x:8480-9600)
        {x:8480, y:60, w:1120, h:340, theme:'swamp',
         doors:[{side:'left', offset:0, size:340}],
         features:[{type:'torch',x:200,y:40}, {type:'torch',x:920,y:40}, {type:'torch',x:560,y:40}, {type:'roots',x:100,y:20}, {type:'roots',x:1020,y:20}, {type:'crystals',x:560,y:260}]}
    ]
};

})();
