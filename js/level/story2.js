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
        {x:0, y:480, w:720, h:60},
        {x:200, y:390, w:120, h:16},
        {x:380, y:395, w:100, h:16},
        // Screen 2: wall climb
        {x:780, y:480, w:400, h:60},
        {x:800, y:380, w:100, h:16},
        {x:950, y:390, w:120, h:16},
        {x:1050, y:380, w:80, h:16},
        // Screen 3: interior corridor
        {x:1190, y:480, w:1020, h:60},
        {x:1400, y:390, w:200, h:16},
        {x:1660, y:395, w:120, h:16},
        // Screen 4: great hall
        {x:2270, y:480, w:830, h:60},
        {x:2400, y:370, w:150, h:16},
        {x:2610, y:395, w:180, h:16},
        {x:2900, y:370, w:100, h:16},
        // Screen 5: stairwell
        {x:3160, y:480, w:340, h:60},
        {x:3300, y:430, w:150, h:16},
        {x:3200, y:380, w:150, h:16},
        {x:3300, y:330, w:150, h:16},
        {x:3200, y:280, w:150, h:16},
        // Screen 6: upper corridor
        {x:3500, y:480, w:960, h:60},
        {x:3600, y:380, w:120, h:16},
        {x:3780, y:395, w:140, h:16},
        {x:4050, y:380, w:100, h:16},
        // Screens 7-8: deeper halls
        {x:4520, y:480, w:840, h:60},
        {x:4700, y:370, w:160, h:16},
        {x:4920, y:395, w:120, h:16},
        {x:5100, y:370, w:100, h:16},
        // Screen 9-10: dungeon descent
        {x:5420, y:480, w:640, h:60},
        {x:5500, y:400, w:100, h:16},
        {x:5650, y:350, w:80, h:16},
        {x:5800, y:400, w:100, h:16},
        {x:6100, y:480, w:800, h:60},
        {x:6200, y:380, w:140, h:16},
        // Screen 11: dungeon
        {x:6960, y:480, w:740, h:60},
        {x:7050, y:380, w:120, h:16},
        {x:7230, y:395, w:100, h:16},
        // Screen 12: boss chamber
        {x:7760, y:480, w:960, h:60},
        {x:7900, y:370, w:160, h:16},
        {x:8120, y:395, w:140, h:16},
        {x:8500, y:370, w:120, h:16},
        // Extended to end
        {x:8780, y:480, w:2740, h:60},
    ],
    enemies: [
        // Nilfgaardians screens 2,4,6,8
        {type:'nilfSoldier', x:900, y:420},
        {type:'nilfSoldier', x:1100, y:420},
        {type:'nilfSoldier', x:2500, y:420},
        {type:'nilfSoldier', x:2800, y:420},
        {type:'nilfSoldier', x:3700, y:420},
        {type:'nilfSoldier', x:4000, y:420},
        {type:'nilfSoldier', x:4800, y:420},
        {type:'nilfSoldier', x:5050, y:420},
        // Nobleman screen 5
        {type:'nobleman', x:3250, y:420},
        {type:'nobleman', x:3350, y:420},
        // Wraiths in dungeon screens 9,10
        {type:'wraith', x:5600, y:350},
        {type:'wraith', x:6300, y:350},
        {type:'wraith', x:6500, y:380},
        // Boss: armored nilfgaardian
        {type:'nilfSoldier', x:8100, y:420},
        {type:'nilfSoldier', x:8300, y:420},
        {type:'nilfSoldier', x:8500, y:420},
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
        {x:0, y:480, w:620, h:60},
        {x:100, y:420, w:80, h:16},
        {x:350, y:380, w:100, h:16},
        // Screen 2: no man's land
        {x:680, y:480, w:400, h:60},
        {x:750, y:400, w:80, h:16},
        {x:900, y:360, w:80, h:16},
        // Screen 3: catapult wreckage
        {x:1140, y:480, w:520, h:60},
        {x:1200, y:380, w:150, h:16, type:'wood'},
        {x:1410, y:395, w:100, h:16, type:'wood'},
        // Screen 4: open field
        {x:1720, y:480, w:840, h:60},
        {x:1900, y:390, w:100, h:16},
        {x:2060, y:395, w:120, h:16},
        {x:2240, y:390, w:80, h:16},
        // Screen 5: rubble
        {x:2620, y:480, w:540, h:60},
        {x:2700, y:400, w:120, h:16},
        {x:2880, y:400, w:80, h:16},
        // Screen 6-7: assault uphill
        {x:3220, y:480, w:640, h:60},
        {x:3360, y:400, w:100, h:16},
        {x:3520, y:395, w:120, h:16},
        {x:3700, y:390, w:100, h:16},
        {x:3910, y:460, w:540, h:60},
        {x:4050, y:380, w:100, h:16},
        {x:4210, y:395, w:120, h:16},
        // Screen 8: wild hunt territory
        {x:4510, y:480, w:850, h:60},
        {x:4700, y:370, w:140, h:16},
        {x:4900, y:395, w:120, h:16},
        {x:5080, y:370, w:100, h:16},
        // Screen 9: ritual circle approach
        {x:5420, y:480, w:640, h:60},
        {x:5600, y:380, w:120, h:16},
        {x:5780, y:395, w:100, h:16},
        // Screen 10: boss arena
        {x:6120, y:480, w:1000, h:60},
        {x:6300, y:370, w:160, h:16},
        {x:6520, y:395, w:140, h:16},
        {x:6720, y:370, w:120, h:16},
        // Extended to end
        {x:7180, y:480, w:2420, h:60},
    ],
    enemies: [
        // Wraiths screens 1,3,5
        {type:'wraith', x:300, y:380},
        {type:'wraith', x:1350, y:380},
        {type:'wraith', x:2800, y:380},
        // Nekkers screens 2,4
        {type:'nekker', x:800, y:440},
        {type:'nekker', x:900, y:440},
        {type:'nekker', x:2000, y:440},
        {type:'nekker', x:2200, y:440},
        // Wild Hunt screens 6,7,8
        {type:'wildHunt', x:3500, y:420},
        {type:'wildHunt', x:3800, y:420},
        {type:'wildHunt', x:4150, y:420},
        {type:'wildHunt', x:4800, y:420},
        // Ghouls screen 9
        {type:'ghoul', x:5650, y:420},
        {type:'ghoul', x:5850, y:420},
        // Boss: Wild Hunt Rider
        {type:'wildHunt', x:6500, y:420},
        {type:'wildHunt', x:6700, y:420},
        {type:'wildHunt', x:6900, y:420},
    ]
};

})();
