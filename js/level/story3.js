(function() {
'use strict';

// Level 5: The Summit (14 screens = 13440px)
W.StoryLevel5 = {
    name: 'The Summit',
    width: 13440,
    bgTheme: 'mountain',
    storyText: 'The mountain peak. The bound griffin must be freed — but the Wild Hunt wants it as a weapon.',
    platforms: [
        // Screen 1: mountain path start
        {x:0, y:480, w:620, h:60, type:'ice'},
        {x:200, y:400, w:100, h:16, type:'ice'},
        {x:360, y:400, w:80, h:16, type:'ice'},
        // Screen 2: icy ledges
        {x:680, y:460, w:120, h:16, type:'ice'},
        {x:860, y:420, w:100, h:16, type:'ice'},
        {x:1020, y:380, w:120, h:16, type:'ice'},
        // Screen 3: wider plateau
        {x:1200, y:480, w:520, h:60, type:'ice'},
        {x:1300, y:380, w:120, h:16, type:'ice'},
        {x:1480, y:395, w:100, h:16, type:'ice'},
        // Screen 4: narrow bridge
        {x:1780, y:460, w:80, h:12, type:'ice'},
        {x:1920, y:440, w:80, h:12, type:'ice'},
        {x:2060, y:460, w:80, h:12, type:'ice'},
        {x:2200, y:440, w:80, h:12, type:'ice'},
        // Screen 5: combat plateau
        {x:2340, y:480, w:720, h:60, type:'ice'},
        {x:2450, y:380, w:140, h:16, type:'ice'},
        {x:2650, y:395, w:120, h:16, type:'ice'},
        // Screen 6: ascent
        {x:3120, y:480, w:420, h:60},
        {x:3200, y:420, w:100, h:16, type:'ice'},
        {x:3360, y:390, w:120, h:16, type:'ice'},
        {x:3540, y:395, w:100, h:16, type:'ice'},
        // Screen 7: high path
        {x:3600, y:480, w:620, h:60, type:'ice'},
        {x:3700, y:380, w:100, h:16, type:'ice'},
        {x:3860, y:395, w:140, h:16, type:'ice'},
        {x:4060, y:380, w:100, h:16, type:'ice'},
        // Screen 8-9: enemy gauntlet
        {x:4280, y:480, w:820, h:60, type:'ice'},
        {x:4400, y:380, w:120, h:16, type:'ice'},
        {x:4580, y:395, w:140, h:16, type:'ice'},
        {x:4780, y:380, w:100, h:16, type:'ice'},
        {x:5160, y:480, w:620, h:60, type:'ice'},
        {x:5250, y:390, w:120, h:16, type:'ice'},
        {x:5430, y:395, w:100, h:16, type:'ice'},
        // Screen 10-11: more gauntlet
        {x:5840, y:480, w:700, h:60, type:'ice'},
        {x:5950, y:380, w:140, h:16, type:'ice'},
        {x:6150, y:395, w:120, h:16, type:'ice'},
        {x:6330, y:380, w:100, h:16, type:'ice'},
        // Screen 12-14: GRIFFIN BOSS ARENA (wide open)
        {x:6560, y:480, w:2920, h:60, type:'ice'},
        {x:6800, y:380, w:160, h:16, type:'ice'},
        {x:7020, y:395, w:200, h:16, type:'ice'},
        {x:7280, y:380, w:160, h:16, type:'ice'},
        {x:7500, y:395, w:180, h:16, type:'ice'},
        {x:7740, y:380, w:140, h:16, type:'ice'},
        {x:7940, y:395, w:120, h:16, type:'ice'},
        // Extended to end
        {x:9480, y:480, w:3960, h:60, type:'ice'},
    ],
    enemies: [
        // Screens 3-6: Wild Hunt + Wraiths
        {type:'wildHunt', x:1400, y:420},
        {type:'wraith', x:1550, y:350},
        {type:'wildHunt', x:2500, y:420},
        {type:'wraith', x:2750, y:350},
        {type:'wildHunt', x:3300, y:420},
        {type:'wraith', x:3500, y:300},
        // Screens 8-10: mixed gauntlet
        {type:'nilfSoldier', x:4500, y:420},
        {type:'nekker', x:4650, y:440},
        {type:'nekker', x:4750, y:440},
        {type:'nilfSoldier', x:4900, y:420},
        {type:'nekker', x:5300, y:440},
        {type:'witchHunter', x:5500, y:420},
        // Screen 11: final guard
        {type:'wildHunt', x:6000, y:420},
        {type:'wildHunt', x:6250, y:420},
        {type:'witchHunter', x:6400, y:420},
        // Screens 12-14: GRIFFIN BOSS
        {type:'griffin', x:7500, y:400},
        // Support enemies
        {type:'nobleman', x:7100, y:420},
        {type:'nobleman', x:7900, y:420},
        {type:'nekker', x:8200, y:440},
        {type:'nekker', x:8400, y:440},
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
