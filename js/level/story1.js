(function() {
'use strict';

// Level 1: The Blighted Village (8 screens = 7680px)
W.StoryLevel1 = {
    name: 'The Blighted Village',
    width: 7680,
    bgTheme: 'village',
    storyText: 'A village plagued by drowners... The alderman\'s contract seems straightforward, but something feels wrong.',
    platforms: [
        // Screen 1: entrance road
        {x:0, y:480, w:800, h:60},
        {x:200, y:400, w:100, h:16}, // crate
        // Screen 2: houses with rooftops
        {x:860, y:480, w:500, h:60},
        {x:900, y:370, w:120, h:16}, // rooftop
        {x:1050, y:390, w:100, h:16}, // higher roof
        // Screen 3: bridge area
        {x:1420, y:480, w:460, h:60},
        {x:1600, y:390, w:80, h:16},
        // Screen 4: gap then more village
        {x:1940, y:480, w:600, h:60},
        {x:2000, y:380, w:140, h:16},
        {x:2180, y:390, w:100, h:16},
        // Screen 5: marketplace
        {x:2600, y:480, w:700, h:60},
        {x:2700, y:400, w:80, h:16, type:'wood'},
        {x:2840, y:400, w:100, h:16, type:'wood'},
        {x:3100, y:400, w:80, h:16, type:'wood'},
        // Screen 6: damaged area
        {x:3360, y:480, w:560, h:60},
        {x:3500, y:380, w:120, h:16},
        {x:3680, y:390, w:100, h:16},
        // Screen 7: nekker nest area
        {x:3980, y:480, w:860, h:60},
        {x:4200, y:390, w:100, h:16},
        {x:4360, y:400, w:80, h:16},
        {x:4600, y:390, w:100, h:16},
        // Screen 8: swamp edge - boss
        {x:4900, y:480, w:1020, h:60},
        {x:5100, y:380, w:140, h:16},
        {x:5300, y:390, w:160, h:16},
        // Extended ground to end
        {x:5980, y:480, w:1700, h:60},
    ],
    enemies: [
        // Screen 2-3: drowners
        {type:'drowner', x:950, y:420},
        {type:'drowner', x:1100, y:420},
        {type:'drowner', x:1500, y:420},
        // Screen 4: bandits
        {type:'bandit', x:2050, y:420},
        {type:'bandit', x:2250, y:420},
        // Screen 5: more drowners
        {type:'drowner', x:2800, y:420},
        {type:'drowner', x:3000, y:420},
        // Screen 6: bandits + nobleman
        {type:'bandit', x:3550, y:420},
        {type:'nobleman', x:3750, y:420},
        {type:'bandit', x:3850, y:420},
        // Screen 7: nekker pack
        {type:'nekker', x:4250, y:440},
        {type:'nekker', x:4350, y:440},
        {type:'nekker', x:4450, y:440},
        // Screen 8: boss drowner
        {type:'drowner', x:5300, y:420},
        {type:'drowner', x:5500, y:420},
        {type:'drowner', x:5700, y:420},
    ]
};

// Level 2: The Swamp Depths (10 screens = 9600px)
W.StoryLevel2 = {
    name: 'The Swamp Depths',
    width: 9600,
    bgTheme: 'swamp',
    storyText: 'The trail leads deep into the swamp. Witch Hunter camps dot the mire — they\'re driving monsters toward the village.',
    platforms: [
        // Screen 1: swamp entrance
        {x:0, y:480, w:520, h:60},
        {x:300, y:400, w:80, h:16, type:'wood'},
        // Floating logs over void
        {x:580, y:460, w:100, h:12, type:'wood'},
        {x:740, y:440, w:90, h:12, type:'wood'},
        {x:880, y:420, w:110, h:12, type:'wood'},
        // Screen 2-3: more floating
        {x:1050, y:450, w:80, h:12, type:'wood'},
        {x:1190, y:430, w:120, h:12, type:'wood'},
        {x:1370, y:460, w:100, h:12, type:'wood'},
        {x:1530, y:440, w:80, h:12, type:'wood'},
        // Screen 4: solid ground patch
        {x:1670, y:480, w:630, h:60},
        {x:1800, y:380, w:100, h:16},
        {x:2000, y:340, w:120, h:16},
        // Screen 5-6: witch hunter camp (solid ground)
        {x:2360, y:480, w:940, h:60},
        {x:2500, y:390, w:100, h:16, type:'wood'},
        {x:2700, y:350, w:140, h:16, type:'wood'},
        {x:2950, y:390, w:100, h:16, type:'wood'},
        // Screen 7: back to floating
        {x:3360, y:460, w:100, h:12, type:'wood'},
        {x:3520, y:440, w:90, h:12, type:'wood'},
        {x:3670, y:420, w:110, h:12, type:'wood'},
        // Screen 8: drowner ambush ground
        {x:3840, y:480, w:560, h:60},
        {x:4000, y:390, w:80, h:16},
        // Screen 9-10: final approach + boss
        {x:4460, y:480, w:640, h:60},
        {x:4600, y:380, w:120, h:16},
        {x:4800, y:340, w:100, h:16},
        {x:5160, y:480, w:1000, h:60},
        {x:5400, y:370, w:140, h:16},
        // Extended to end
        {x:6200, y:480, w:3400, h:60},
    ],
    enemies: [
        // Ghouls screens 1,3,4
        {type:'ghoul', x:350, y:420},
        {type:'ghoul', x:1300, y:370},
        {type:'ghoul', x:1850, y:420},
        // Drowners from water screens 2,8
        {type:'drowner', x:800, y:400},
        {type:'drowner', x:4050, y:420},
        {type:'drowner', x:4200, y:420},
        // Witch hunters screens 5,6,7
        {type:'witchHunter', x:2550, y:420},
        {type:'witchHunter', x:2750, y:420},
        {type:'witchHunter', x:2950, y:420},
        {type:'witchHunter', x:3100, y:420},
        // Boss: witch hunter captain (just a tough witch hunter)
        {type:'witchHunter', x:5500, y:420},
        {type:'ghoul', x:5300, y:420},
        {type:'ghoul', x:5700, y:420},
    ]
};

})();
