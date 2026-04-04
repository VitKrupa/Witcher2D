(function() {
'use strict';

// Level 3: The Abandoned Keep (12 screens = 11520px)
W.StoryLevel3 = {
    name: 'The Abandoned Keep',
    width: 11520,
    bgTheme: 'castle',
    storyText: 'Captured documents reveal Nilfgaard funds the Witch Hunters. Their base: an old fortress.',
    platforms: [
        // Screen 1: castle gate
        {x:0, y:340, w:720, h:60},
        {x:200, y:280, w:120, h:16},
        {x:380, y:275, w:100, h:16},
        // Screen 2: wall climb
        {x:780, y:340, w:400, h:60},
        {x:800, y:290, w:100, h:16},
        {x:950, y:280, w:120, h:16},
        {x:1050, y:290, w:80, h:16},
        // Screen 3: interior corridor
        {x:1190, y:340, w:1020, h:60},
        {x:1400, y:280, w:200, h:16},
        {x:1660, y:275, w:120, h:16},
        // Screen 4: great hall
        {x:2270, y:340, w:830, h:60},
        {x:2400, y:300, w:150, h:16},
        {x:2610, y:275, w:180, h:16},
        {x:2900, y:300, w:100, h:16},
        // Screen 5: stairwell
        {x:3160, y:340, w:340, h:60},
        {x:3300, y:310, w:150, h:16},
        {x:3200, y:290, w:150, h:16},
        {x:3300, y:260, w:150, h:16},
        {x:3200, y:240, w:150, h:16},
        // Screen 6: upper corridor
        {x:3500, y:340, w:960, h:60},
        {x:3600, y:290, w:120, h:16},
        {x:3780, y:275, w:140, h:16},
        {x:4050, y:290, w:100, h:16},
        // Screens 7-8: deeper halls
        {x:4520, y:340, w:840, h:60},
        {x:4700, y:300, w:160, h:16},
        {x:4920, y:275, w:120, h:16},
        {x:5100, y:300, w:100, h:16},
        // Screen 9-10: dungeon descent
        {x:5420, y:340, w:640, h:60},
        {x:5500, y:270, w:100, h:16},
        {x:5650, y:300, w:80, h:16},
        {x:5800, y:270, w:100, h:16},
        {x:6100, y:340, w:800, h:60},
        {x:6200, y:290, w:140, h:16},
        // Screen 11: dungeon
        {x:6960, y:340, w:740, h:60},
        {x:7050, y:290, w:120, h:16},
        {x:7230, y:275, w:100, h:16},
        // Screen 12: boss chamber
        {x:7760, y:340, w:960, h:60},
        {x:7900, y:300, w:160, h:16},
        {x:8120, y:275, w:140, h:16},
        {x:8500, y:300, w:120, h:16},
        // Extended to end
        {x:8780, y:340, w:2740, h:60},
        // SECRET 1: Hidden dungeon below main path
        {x:4950, y:380, w:160, h:16},
        // SECRET 2: Hidden armory high platform
        {x:7950, y:170, w:160, h:16},
    ],
    secrets: [
        {
            x: 4950, y: 380, w: 160, h: 16,
            triggerX: 5000, triggerY: 380,
            reward: 300,
            enemies: [
                {type: 'wraith', x: 4970, y: 360},
                {type: 'nilfSoldier', x: 5050, y: 360}
            ]
        },
        {
            x: 7950, y: 170, w: 160, h: 16,
            triggerX: 8000, triggerY: 170,
            reward: 350,
            enemies: [
                {type: 'nilfSoldier', x: 7970, y: 150},
                {type: 'nilfSoldier', x: 8030, y: 150},
                {type: 'nilfSoldier', x: 8090, y: 150}
            ]
        }
    ],
    spikes: [
        // Spike pit in gap between screen 1 and screen 2 (x:720..780)
        {x: 725, y: 384, w: 48},
        // Corridor traps - screen 3
        {x: 1500, y: 324, w: 60},
        {x: 1700, y: 324, w: 48},
        // Ceiling spikes in great hall - screen 4
        {x: 2500, y: 260, w: 72, direction: 'down'},
        {x: 2750, y: 260, w: 60, direction: 'down'},
        // Dungeon spike pits - screens 9-10
        {x: 5380, y: 384, w: 36},
        {x: 6080, y: 384, w: 36},
        // Dungeon floor spikes - screen 11
        {x: 7100, y: 324, w: 72},
    ],
    enemies: [
        // Nilfgaardians screens 2,4,6,8
        {type:'nilfSoldier', x:900, y:280},
        {type:'nilfSoldier', x:1100, y:280},
        {type:'nilfSoldier', x:2500, y:280},
        {type:'nilfSoldier', x:2800, y:280},
        {type:'nilfSoldier', x:3700, y:280},
        {type:'nilfSoldier', x:4000, y:280},
        {type:'nilfSoldier', x:4800, y:280},
        {type:'nilfSoldier', x:5050, y:280},
        // Nobleman screen 5
        {type:'nobleman', x:3250, y:280},
        {type:'nobleman', x:3350, y:280},
        // Wraiths in dungeon screens 9,10
        {type:'wraith', x:5600, y:260},
        {type:'wraith', x:6300, y:260},
        {type:'wraith', x:6500, y:280},
        // Boss: armored nilfgaardian
        {type:'nilfSoldier', x:8100, y:280},
        {type:'nilfSoldier', x:8300, y:280},
        {type:'nilfSoldier', x:8500, y:280},
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
