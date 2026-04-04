(function() {
'use strict';

// ============================================================
// Level 1: The Blighted Village - Prince of Persia ROOM design
// 8 rooms, each ~960px wide. Canvas: 960x400, GROUND_Y=340
// Each room: floor at y=340 h=60, walls w=16, ceiling y varies
// Doorways = gaps in walls (60-80px) connecting rooms
// ============================================================

var R1 = 0, R2 = 960, R3 = 1920, R4 = 2880, R5 = 3840, R6 = 4800, R7 = 5760, R8 = 6720;

W.StoryLevel1 = {
    name: 'The Blighted Village',
    width: 7680,
    bgTheme: 'village',
    storyText: "A village plagued by drowners... The alderman's contract seems straightforward, but something feels wrong.",
    platforms: [
        // ==============================
        // ROOM 1: Alley Entrance (0-960)
        // Solid floor, walls, ceiling. One thick shelf for climbing.
        // ==============================
        {x:R1, y:340, w:960, h:60},                   // floor (solid, room-wide)
        {x:R1, y:60, w:16, h:280},                    // left wall
        {x:R1, y:60, w:960, h:16},                    // ceiling
        {x:R1+944, y:60, w:16, h:200},                // right wall upper (gap 260-340 = doorway)
        // Thick shelf for vertical interest
        {x:R1+300, y:240, w:200, h:40, type:'wood'},   // wooden shelf (thick)
        {x:R1+700, y:200, w:160, h:40},               // stone ledge (thick, near exit)

        // ==============================
        // ROOM 2: House Interior (960-1920)
        // Two floors: ground + thick 2nd floor wall-to-wall (gap for climbing)
        // ==============================
        {x:R2, y:340, w:960, h:60},                   // ground floor (solid)
        {x:R2, y:60, w:16, h:200},                    // left wall upper (gap matches R1 doorway)
        {x:R2, y:60, w:960, h:16},                    // ceiling
        {x:R2+944, y:60, w:16, h:200},                // right wall upper
        // Thick 2nd floor spanning room (gap 600-700 for climbing between floors)
        {x:R2+16, y:210, w:584, h:40, type:'wood'},    // 2nd floor left section
        {x:R2+700, y:210, w:244, h:40, type:'wood'},   // 2nd floor right section
        // Wall-attached climbing ledge
        {x:R2+600, y:280, w:60, h:30},                // stepping block to 2nd floor

        // ==============================
        // ROOM 3: Courtyard (1920-2880)
        // Semi-open (no ceiling), well pit in floor
        // ==============================
        {x:R3, y:340, w:400, h:60},                   // floor left (solid)
        {x:R3+500, y:340, w:460, h:60},               // floor right (100px well gap = pit)
        {x:R3, y:80, w:16, h:260},                    // left wall
        {x:R3+944, y:80, w:16, h:180},                // right wall upper
        // NO ceiling - open courtyard
        // One thick upper floor section for balcony
        {x:R3+100, y:200, w:300, h:40},               // thick stone balcony
        {x:R3+600, y:200, w:300, h:40, type:'wood'},   // thick wooden scaffold

        // ==============================
        // ROOM 4: Church Interior (2880-3840)
        // Tall room, 2 thick internal floors
        // ==============================
        {x:R4, y:340, w:960, h:60},                   // ground floor (solid)
        {x:R4, y:40, w:16, h:300},                    // left wall (tall)
        {x:R4, y:40, w:960, h:16},                    // ceiling (high vaulted)
        {x:R4+944, y:40, w:16, h:220},                // right wall upper
        // Thick intermediate floor (gap 380-520 for climbing)
        {x:R4+16, y:240, w:364, h:40},                // floor 2 left section
        {x:R4+520, y:240, w:424, h:40},               // floor 2 right section
        // Thick choir loft (upper floor)
        {x:R4+200, y:140, w:500, h:40},               // floor 3 choir loft (thick)
        // Climbing ledge attached to wall
        {x:R4+16, y:300, w:60, h:30},                 // wall ledge ground to floor 2

        // ==============================
        // ROOM 5: Market Cellar (3840-4800)
        // Underground, nekkers, low ceiling. One thick shelf.
        // ==============================
        {x:R5, y:340, w:960, h:60},                   // floor (solid)
        {x:R5, y:100, w:16, h:240},                   // left wall
        {x:R5, y:100, w:960, h:16},                   // ceiling (low cellar)
        {x:R5+944, y:100, w:16, h:160},               // right wall upper
        // Thick storage shelf spanning most of room
        {x:R5+100, y:220, w:700, h:40, type:'wood'},   // thick wooden shelf

        // ==============================
        // ROOM 6: Damaged Building (4800-5760)
        // Broken floor with gap, thick upper floor section
        // ==============================
        {x:R6, y:340, w:400, h:60},                   // floor left (solid)
        {x:R6+600, y:340, w:360, h:60},               // floor right section (200px collapse gap)
        {x:R6, y:60, w:16, h:280},                    // left wall
        {x:R6, y:60, w:960, h:16},                    // ceiling
        {x:R6+944, y:60, w:16, h:200},                // right wall upper
        // Thick upper floor sections
        {x:R6+16, y:200, w:400, h:40},                // intact upper left
        {x:R6+550, y:200, w:394, h:40},               // intact upper right

        // ==============================
        // ROOM 7: Nekker Nest (5760-6720)
        // Cave room, low ceiling. Solid floor only.
        // ==============================
        {x:R7, y:340, w:960, h:60},                   // floor (solid)
        {x:R7, y:120, w:16, h:220},                   // left wall
        {x:R7, y:120, w:960, h:16},                   // ceiling (low cave)
        {x:R7+944, y:120, w:16, h:140},               // right wall upper
        // Thick rock shelf
        {x:R7+300, y:230, w:300, h:40},               // thick cave ledge

        // ==============================
        // ROOM 8: Swamp Gate (6720-7680)
        // Boss drowner room, exit right. Open arena.
        // ==============================
        {x:R8, y:340, w:960, h:60},                   // floor (solid)
        {x:R8, y:80, w:16, h:260},                    // left wall
        {x:R8, y:80, w:960, h:16},                    // ceiling
        // NO right wall - level exit
        // Thick elevated platform for boss arena
        {x:R8+350, y:220, w:250, h:40},               // center thick platform
    ],
    enemies: [
        // Room 1: Bandit guards (2)
        {type:'bandit', x:R1+350, y:280},
        {type:'bandit', x:R1+750, y:280},
        // Room 2: Drowner in cellar, bandit on 2nd floor (2)
        {type:'drowner', x:R2+200, y:280},
        {type:'bandit', x:R2+300, y:160},
        // Room 3: Drowners near well (2)
        {type:'drowner', x:R3+300, y:280},
        {type:'drowner', x:R3+700, y:280},
        // Room 4: Bandits on each floor (3)
        {type:'bandit', x:R4+200, y:280},
        {type:'bandit', x:R4+600, y:210},
        {type:'bandit', x:R4+400, y:70},
        // Room 5: Nekkers in cellar (4)
        {type:'nekker', x:R5+200, y:280},
        {type:'nekker', x:R5+400, y:280},
        {type:'nekker', x:R5+600, y:280},
        {type:'nekker', x:R5+800, y:280},
        // Room 6: Bandits in ruins (2)
        {type:'bandit', x:R6+200, y:280},
        {type:'bandit', x:R6+700, y:280},
        // Room 7: Nekkers in nest (4)
        {type:'nekker', x:R7+200, y:280},
        {type:'nekker', x:R7+400, y:280},
        {type:'nekker', x:R7+600, y:280},
        {type:'nekker', x:R7+800, y:280},
        // Room 8: Boss drowners (3)
        {type:'drowner', x:R8+300, y:280},
        {type:'drowner', x:R8+500, y:280},
        {type:'drowner', x:R8+700, y:280},
    ],
    spikes: [
        // Room 3: spikes at bottom of well shaft
        {x:R3+400, y:390, w:96, direction:'up'},
        // Room 7: spikes in nekker nest
        {x:R7+200, y:324, w:96, direction:'up'},
        {x:R7+550, y:324, w:96, direction:'up'},
    ],
    secrets: [
        // Room 4: secret in church choir loft
        {triggerX:R4+400, triggerY:130, reward:200,
         enemies:[{type:'nobleman', x:R4+420, y:70}, {type:'nobleman', x:R4+480, y:70}]},
    ]
};


// ============================================================
// Level 2: The Swamp Depths - Prince of Persia ROOM design
// 10 rooms, each ~960px wide. Swamp/cave theme.
// ============================================================

var S1 = 0, S2 = 960, S3 = 1920, S4 = 2880, S5 = 3840, S6 = 4800;
var S7 = 5760, S8 = 6720, S9 = 7680, S10 = 8640;

W.StoryLevel2 = {
    name: 'The Swamp Depths',
    width: 9600,
    bgTheme: 'swamp',
    storyText: "The trail leads deep into the swamp. Witch Hunter camps dot the mire - they're driving monsters toward the village.",
    platforms: [
        // ==============================
        // ROOM 1: Swamp Entrance - wooden hut (0-960)
        // ==============================
        {x:S1, y:340, w:960, h:60, type:'wood'},       // wooden floor (solid, room-wide)
        {x:S1, y:80, w:16, h:260},                     // left wall
        {x:S1, y:80, w:960, h:16, type:'wood'},        // ceiling (wooden hut)
        {x:S1+944, y:80, w:16, h:180},                 // right wall upper
        // Thick interior shelves
        {x:S1+100, y:240, w:200, h:40, type:'wood'},   // thick table/shelf
        {x:S1+550, y:200, w:250, h:40, type:'wood'},   // thick upper shelf

        // ==============================
        // ROOM 2: Hollow Tree - tall room (960-1920)
        // Two thick floors spanning wall-to-wall, gap for climbing
        // ==============================
        {x:S2, y:340, w:960, h:60},                    // ground floor (solid)
        {x:S2, y:40, w:16, h:300},                     // left wall (tall tree)
        {x:S2, y:40, w:960, h:16},                     // canopy ceiling
        {x:S2+944, y:40, w:16, h:220},                 // right wall upper
        // Thick 2nd floor (gap 400-560 for climbing)
        {x:S2+16, y:210, w:384, h:40, type:'wood'},    // 2nd floor left section
        {x:S2+560, y:210, w:384, h:40, type:'wood'},   // 2nd floor right section
        // Thick upper floor
        {x:S2+200, y:120, w:500, h:40, type:'wood'},   // 3rd floor (canopy level)
        // Climbing ledge
        {x:S2+16, y:280, w:60, h:30},                  // wall stepping block

        // ==============================
        // ROOM 3: Cave Tunnel 1 - low ceiling, tight (1920-2880)
        // ==============================
        {x:S3, y:340, w:960, h:60},                    // floor (solid)
        {x:S3, y:140, w:16, h:200},                    // left wall
        {x:S3, y:140, w:960, h:16},                    // ceiling (low)
        {x:S3+944, y:140, w:16, h:200},                // right wall full
        // One thick rock shelf spanning most of room
        {x:S3+100, y:240, w:700, h:40},                // thick cave shelf

        // ==============================
        // ROOM 4: Cave Tunnel 2 - continuation (2880-3840)
        // ==============================
        {x:S4, y:340, w:960, h:60},                    // floor (solid)
        {x:S4, y:140, w:16, h:200},                    // left wall
        {x:S4, y:140, w:960, h:16},                    // ceiling (low)
        {x:S4+944, y:140, w:16, h:120},                // right wall upper (gap at bottom)
        // Thick rock shelf
        {x:S4+200, y:240, w:500, h:40},                // thick cave shelf

        // ==============================
        // ROOM 5: Witch Hunter Camp 1 - stockade (3840-4800)
        // ==============================
        {x:S5, y:340, w:960, h:60, type:'wood'},       // wooden floor (solid)
        {x:S5, y:80, w:16, h:260},                     // left wall
        {x:S5, y:80, w:960, h:16, type:'wood'},        // ceiling
        {x:S5+944, y:80, w:16, h:260},                 // right wall (full)
        // Thick 2nd floor walkway (gap 600-720 for climbing)
        {x:S5+16, y:210, w:584, h:40, type:'wood'},    // upper walkway left
        {x:S5+720, y:210, w:224, h:40, type:'wood'},   // upper walkway right
        // Climbing ledge
        {x:S5+600, y:280, w:60, h:30, type:'wood'},    // stepping block

        // ==============================
        // ROOM 6: Witch Hunter Camp 2 - guard quarters (4800-5760)
        // ==============================
        {x:S6, y:340, w:960, h:60, type:'wood'},       // wooden floor (solid)
        {x:S6, y:80, w:16, h:260},                     // left wall
        {x:S6, y:80, w:960, h:16, type:'wood'},        // ceiling
        {x:S6+944, y:80, w:16, h:180},                 // right wall upper
        // Thick 2nd floor (gap 400-560 for climbing)
        {x:S6+16, y:210, w:384, h:40, type:'wood'},    // upper floor left
        {x:S6+560, y:210, w:384, h:40, type:'wood'},   // upper floor right
        // Climbing ledge
        {x:S6+400, y:280, w:60, h:30, type:'wood'},    // stepping block

        // ==============================
        // ROOM 7: Prison Cell - tight, must fight to exit (5760-6720)
        // ==============================
        {x:S7, y:340, w:960, h:60},                    // floor (solid)
        {x:S7, y:100, w:16, h:240},                    // left wall
        {x:S7, y:100, w:960, h:16},                    // ceiling
        {x:S7+944, y:100, w:16, h:160},                // right wall upper
        // One thick shelf
        {x:S7+200, y:230, w:500, h:40},                // thick stone shelf

        // ==============================
        // ROOM 8: Underground River - spike pits (6720-7680)
        // ==============================
        {x:S8, y:340, w:350, h:60},                    // floor left (solid)
        {x:S8+450, y:340, w:200, h:60},                // floor center island
        {x:S8+750, y:340, w:210, h:60},                // floor right (solid)
        {x:S8, y:80, w:16, h:260},                     // left wall
        {x:S8, y:80, w:960, h:16},                     // ceiling
        {x:S8+944, y:80, w:16, h:180},                 // right wall upper
        // Thick upper floor section
        {x:S8+100, y:210, w:700, h:40},                // thick upper floor

        // ==============================
        // ROOM 9: Boss Cavern Entry (7680-8640)
        // ==============================
        {x:S9, y:340, w:960, h:60},                    // floor (solid)
        {x:S9, y:60, w:16, h:280},                     // left wall
        {x:S9, y:60, w:960, h:16},                     // ceiling (tall cavern)
        {x:S9+944, y:60, w:16, h:280},                 // right wall (connects to R10)
        // Thick intermediate floor (gap 350-550 for climbing)
        {x:S9+16, y:210, w:334, h:40},                 // floor 2 left
        {x:S9+550, y:210, w:394, h:40},                // floor 2 right
        // Climbing ledge
        {x:S9+350, y:280, w:60, h:30},                 // stepping block

        // ==============================
        // ROOM 10: Boss Cavern - Witch Hunter Captain (8640-9600)
        // ==============================
        {x:S10, y:340, w:960, h:60},                   // floor (solid)
        {x:S10, y:60, w:16, h:280},                    // left wall
        {x:S10, y:60, w:960, h:16},                    // ceiling
        // NO right wall - level exit
        // Thick elevated platform for boss arena
        {x:S10+250, y:220, w:400, h:40},               // thick center platform
    ],
    enemies: [
        // Room 1: Ghouls in hut (2)
        {type:'ghoul', x:S1+300, y:280},
        {type:'ghoul', x:S1+700, y:280},
        // Room 2: Ghouls in tree (2)
        {type:'ghoul', x:S2+300, y:280},
        {type:'ghoul', x:S2+600, y:60},
        // Room 3: Ghouls in cave (3)
        {type:'ghoul', x:S3+200, y:280},
        {type:'ghoul', x:S3+500, y:280},
        {type:'ghoul', x:S3+800, y:280},
        // Room 4: Ghouls deeper (2)
        {type:'ghoul', x:S4+300, y:280},
        {type:'ghoul', x:S4+650, y:280},
        // Room 5: Witch hunters (3)
        {type:'witchHunter', x:S5+200, y:280},
        {type:'witchHunter', x:S5+500, y:280},
        {type:'witchHunter', x:S5+800, y:120},
        // Room 6: Witch hunters (3)
        {type:'witchHunter', x:S6+200, y:280},
        {type:'witchHunter', x:S6+500, y:280},
        {type:'witchHunter', x:S6+750, y:120},
        // Room 7: Prison guards (2)
        {type:'witchHunter', x:S7+400, y:280},
        {type:'witchHunter', x:S7+700, y:280},
        // Room 8: Drowners (3)
        {type:'drowner', x:S8+200, y:280},
        {type:'drowner', x:S8+500, y:280},
        {type:'drowner', x:S8+800, y:280},
        // Room 9: Guards (2)
        {type:'witchHunter', x:S9+300, y:280},
        {type:'witchHunter', x:S9+700, y:280},
        // Room 10: Boss fight (3)
        {type:'witchHunter', x:S10+300, y:280},
        {type:'witchHunter', x:S10+600, y:280},
        {type:'ghoul', x:S10+450, y:280},
    ],
    spikes: [
        // Room 3: well shaft bottom
        {x:R3+400, y:390, w:96, direction:'up'},
        // Room 7: prison floor spikes
        {x:S7+450, y:324, w:72, direction:'up'},
        // Room 8: spike pits in underground river
        {x:S8+350, y:390, w:96, direction:'up'},
        {x:S8+650, y:390, w:96, direction:'up'},
    ],
    secrets: [
        // Room 9: hidden in high center
        {triggerX:S9+350, triggerY:200, reward:250,
         enemies:[{type:'wraith', x:S9+380, y:140}, {type:'ghoul', x:S9+500, y:140}]},
    ]
};

})();
