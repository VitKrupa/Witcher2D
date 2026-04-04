(function() {
'use strict';

// Level 1: The Blighted Village (8 screens = 7680px)
// VERTICAL DESIGN: ground → rooftops → underground → back up
W.StoryLevel1 = {
    name: 'The Blighted Village',
    width: 7680,
    bgTheme: 'village',
    storyText: 'A village plagued by drowners... The alderman\'s contract seems straightforward, but something feels wrong.',
    platforms: [
        // === SCREEN 1: Village entrance — road + first building ===
        {x:0, y:340, w:400, h:60},           // ground
        {x:80, y:260, w:100, h:16},           // crate stack
        {x:250, y:180, w:120, h:16},          // building 1st floor
        {x:300, y:100, w:80, h:16},           // building rooftop
        // Building wall (tall pillar for visual)
        {x:370, y:100, w:16, h:240},          // right wall

        // === SCREEN 2: Two-story houses, rooftop path ===
        {x:450, y:340, w:300, h:60},          // ground
        {x:500, y:240, w:140, h:16},          // house 1 upper floor
        {x:500, y:340, w:140, h:16},          // house 1 ground (inside)
        {x:680, y:180, w:100, h:16},          // rooftop bridge
        {x:820, y:240, w:120, h:16},          // house 2 upper floor
        {x:820, y:340, w:120, h:60},          // house 2 ground

        // === SCREEN 3: Vertical shaft down + back up ===
        {x:980, y:340, w:200, h:60},          // ground before pit
        // PIT: no ground from 1180-1380
        {x:1200, y:380, w:120, h:20},         // underground ledge (below ground!)
        {x:1240, y:310, w:80, h:16},          // stepping stone up
        {x:1300, y:240, w:100, h:16},         // mid platform
        {x:1380, y:170, w:120, h:16},         // upper exit
        {x:1380, y:340, w:200, h:60},         // ground continues

        // === SCREEN 4: Church area — tower climb ===
        {x:1620, y:340, w:400, h:60},         // church ground
        {x:1650, y:270, w:80, h:16},          // church ledge 1
        {x:1700, y:200, w:60, h:16},          // church ledge 2
        {x:1750, y:130, w:70, h:16},          // church ledge 3
        {x:1820, y:70, w:100, h:16},          // church tower top!
        // Descent on other side
        {x:1920, y:140, w:80, h:16},          // step down 1
        {x:1960, y:210, w:80, h:16},          // step down 2
        {x:2020, y:280, w:100, h:16},         // step down 3

        // === SCREEN 5: Marketplace — multi-level stalls ===
        {x:2080, y:340, w:600, h:60},         // main ground
        {x:2150, y:260, w:100, h:16, type:'wood'}, // stall roof 1
        {x:2300, y:200, w:120, h:16, type:'wood'}, // stall roof 2 (higher)
        {x:2450, y:260, w:100, h:16, type:'wood'}, // stall roof 3
        {x:2350, y:130, w:80, h:16},          // watchtower platform
        {x:2550, y:180, w:80, h:16},          // elevated walkway

        // === SCREEN 6: Damaged district — crumbling floors ===
        {x:2740, y:340, w:300, h:60},         // ground
        {x:2800, y:250, w:60, h:16},          // broken floor 1
        {x:2880, y:180, w:80, h:16},          // broken floor 2
        {x:2970, y:250, w:60, h:16},          // broken floor 3
        {x:3040, y:340, w:250, h:60},         // ground continues
        {x:3060, y:170, w:100, h:16},         // upper walkway
        {x:3160, y:100, w:80, h:16},          // high ruin

        // === SCREEN 7: Nekker nest — underground ===
        {x:3350, y:340, w:200, h:60},         // ground before descent
        {x:3400, y:380, w:160, h:20},         // cave floor 1 (below ground)
        {x:3450, y:420, w:200, h:20},         // deep cave floor
        {x:3550, y:360, w:80, h:16},          // cave stepping stone
        {x:3620, y:300, w:100, h:16},         // cave exit ledge
        {x:3700, y:240, w:80, h:16},          // cave exit upper
        {x:3780, y:340, w:200, h:60},         // back to surface

        // === SCREEN 8: Swamp edge — boss approach (vertical) ===
        {x:4040, y:340, w:400, h:60},         // ground
        {x:4100, y:260, w:100, h:16},         // elevated 1
        {x:4200, y:180, w:120, h:16},         // elevated 2
        {x:4350, y:260, w:80, h:16},          // side platform
        {x:4480, y:340, w:600, h:60},         // boss arena ground
        {x:4550, y:240, w:100, h:16},         // boss arena upper
        {x:4700, y:160, w:80, h:16},          // boss arena high
        // Extended to end
        {x:5140, y:340, w:2540, h:60},
    ],
    enemies: [
        // Screen 2: drowners on ground + rooftop bandit
        {type:'drowner', x:500, y:280},
        {type:'bandit', x:700, y:120},
        {type:'drowner', x:850, y:280},
        // Screen 3: underground drowner
        {type:'drowner', x:1230, y:320},
        // Screen 4: bandits guarding church
        {type:'bandit', x:1700, y:280},
        {type:'bandit', x:1850, y:10},        // church tower guard!
        // Screen 5: marketplace mix
        {type:'drowner', x:2200, y:280},
        {type:'nobleman', x:2350, y:70},       // watchtower
        {type:'bandit', x:2500, y:280},
        // Screen 6: damaged area
        {type:'bandit', x:2850, y:280},
        {type:'drowner', x:3080, y:280},
        // Screen 7: nekker underground nest
        {type:'nekker', x:3430, y:360},
        {type:'nekker', x:3480, y:360},
        {type:'nekker', x:3520, y:360},
        {type:'nekker', x:3600, y:300},
        // Screen 8: boss drowners
        {type:'drowner', x:4550, y:280},
        {type:'drowner', x:4650, y:280},
        {type:'drowner', x:4750, y:280},
    ],
    spikes: [
        {x:1200, y:430, w:100, direction:'up'},     // pit bottom
        {x:3450, y:440, w:80, direction:'up'},       // deep cave
    ],
    secrets: [
        {triggerX:1850, triggerY:70, reward:200,
         enemies:[{type:'nobleman',x:1870,y:10},{type:'nobleman',x:1900,y:10}]},
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
