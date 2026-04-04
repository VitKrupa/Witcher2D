# ⚔️ THE WITCHER 2D

### *A Prince of Persia-Style Browser Game Set in the World of The Witcher*

> *"Evil is evil. Lesser, greater, middling... makes no difference.  
> The degree is arbitrary, the definitions blurred.  
> If I'm to choose between one evil and another, I'd rather not choose at all."*  
> — Geralt of Rivia

---

```
    ╔══════════════════════════════════════════════════════════════════════╗
    ║  GERALT OF RIVIA           ❤️❤️❤️❤️❤️❤️❤️           Score: 1250  ║
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  HP                       Wave 3          ║
    ╠══════════════════════════════════════════════════════════════════════╣
    ║                                                                    ║
    ║        ☁                           ☁              ☁               ║
    ║                    ☁                                               ║
    ║   ⛰️         ⛰️              🌙                    ⛰️             ║
    ║                                                                    ║
    ║                                                 👹                 ║
    ║                    ⚔️🧔                        ╔═══╗              ║
    ║   ╔══════╗       ╔══╩══════════╗    ╔═══╗     ║   ║   ╔═══╗     ║
    ║   ║▒▒▒▒▒▒║       ║▓▓▓▓▓▓▓▓▓▓▓▓║    ║▒▒▒║     ║▓▓▓║   ║▒▒▒║     ║
    ║   ║▒▒▒▒▒▒║       ║▓▓▓▓▓▓▓▓▓▓▓▓║    ║▒▒▒║     ║▓▓▓║   ║▒▒▒║     ║
    ╠══════════════════════════════════════════════════════════════════════╣
    ║  🔵 SILVER [Q]  Monsters     |     🟠 IRON [E]  Humans            ║
    ╚══════════════════════════════════════════════════════════════════════╝
```

---

## 🎮 Overview

**The Witcher 2D** is a side-scrolling action platformer built entirely with **HTML5 Canvas and vanilla JavaScript** — no frameworks, no dependencies, no build tools. Every sprite, background, and particle effect is drawn procedurally with pixel art rendered directly on the canvas.

Inspired by the classic *Prince of Persia* and set in the dark fantasy world of *The Witcher 3: Wild Hunt*, you play as **Geralt of Rivia** — the legendary monster hunter — battling creatures and humans across five handcrafted story levels or surviving endless waves of increasingly dangerous foes.

**The twist?** You carry **two swords** — and you'd better use the right one.

---

## 🕹️ Game Modes

### 📖 Story Mode — *5 Levels*
Journey from a blighted village through treacherous swamps and cursed battlefields to a frozen mountain summit. Each level features unique enemies, platforming challenges, parallax backgrounds, and story text that drives the narrative forward.

### 🌊 Wave Mode — *Endless*
Fight off increasingly difficult waves of monsters and humans on a single arena stage. Each wave brings more enemies with tougher configurations. How long can the White Wolf survive?

---

## 🎮 Controls

| Action | Keyboard | Description |
|--------|----------|-------------|
| **Move Left / Right** | `A` / `D` or `←` / `→` | Walk and run across platforms |
| **Jump** | `W` or `↑` | Leap over gaps and onto platforms |
| **Roll / Dodge** | `S` or `↓` | Quick evasive roll with i-frames |
| **Silver Sword** | `Q` | Attack with silver — effective against **monsters** |
| **Iron Sword** | `E` | Attack with iron — effective against **humans** |
| **Block** | `Shift` | Raise guard to reduce incoming damage |

On-screen sword buttons are also available for mouse and touch input.

---

## ⚔️ The Two Swords System

A Witcher always carries two swords. This is not just lore — it is your core combat mechanic.

```
  🔵 SILVER SWORD [Q]                    🟠 IRON SWORD [E]
  ━━━━━━━━━━━━━━━━━━━                    ━━━━━━━━━━━━━━━━━━
  For monsters & creatures                For humans & soldiers
  Nekkers, Drowners, Ghouls,              Bandits, Nilfgaardians,
  Wraiths, Griffins                       Wild Hunt, Witch Hunters
```

| Sword Match | Damage | Visual Feedback |
|------------|--------|-----------------|
| **Correct sword** | **Full damage** (100%) | Normal hit sparks |
| **Wrong sword** | **1/3 damage** (33%) | Red **"RESIST"** floating text |

Choosing the wrong sword means a fight takes three times as long — and enemies don't wait around. Read the HUD hints, learn the enemy types, and swap swords on the fly to survive.

---

## 👹 Enemy Types

### Creatures — Use Silver Sword (Q)

| Enemy | HP | Damage | Speed | Difficulty | Description |
|-------|---:|-------:|------:|:----------:|-------------|
| **Nekker** | 25 | 5 | 2.5 | ★☆☆☆☆ | Small, fast pack creatures with glowing eyes. Swarm in groups. |
| **Drowner** | 40 | 8 | 1.5 | ★★☆☆☆ | Waterlogged corpses that haunt village outskirts and swamps. |
| **Ghoul** | 50 | 10 | 1.8 | ★★★☆☆ | Battlefield scavengers. Tougher and more aggressive than drowners. |
| **Wraith** | 45 | 12 | 1.2 | ★★★★☆ | Ethereal spirits that phase in and out, ignoring gravity. |
| **Griffin** | 200 | 18 | 1.0 | ★★★★★ | **BOSS** — Massive winged predator. The apex monster encounter. |

### Humans — Use Iron Sword (E)

| Enemy | HP | Damage | Speed | Difficulty | Description |
|-------|---:|-------:|------:|:----------:|-------------|
| **Bandit** | 30 | 7 | 1.5 | ★☆☆☆☆ | Common highway thugs in leather armor. |
| **Nobleman Thug** | 35 | 8 | 1.3 | ★★☆☆☆ | Hired muscle from wealthy estates. |
| **Witch Hunter** | 40 | 9 | 1.4 | ★★☆☆☆ | Fanatical hunters of magic users. Operate in organized groups. |
| **Nilfgaardian Soldier** | 50 | 10 | 1.3 | ★★★☆☆ | Disciplined imperial troops with heavy armor. |
| **Wild Hunt Warrior** | 70 | 14 | 1.6 | ★★★★☆ | Spectral riders of the Wild Hunt. Fast and deadly. |

---

## 🗺️ Story Levels

### Level 1 — *The Blighted Village*
> *"A village plagued by drowners... The alderman's contract seems straightforward, but something feels wrong."*

**Theme:** Overcast village with rolling hills, house silhouettes, fence posts, and window glows.  
**Enemies:** Drowners, Bandits, Nobleman Thugs  
**Length:** 8 screens (7,680 px)

---

### Level 2 — *The Swamp Depths*
> *"The trail leads deep into the swamp. Witch Hunter camps dot the mire — they're driving monsters toward the village."*

**Theme:** Murky green atmosphere with twisted trees and floating log platforms.  
**Enemies:** Ghouls, Drowners, Witch Hunters  
**Length:** 10 screens (9,600 px)

---

### Level 3 — *The Abandoned Keep*
> *"Captured documents reveal Nilfgaard funds the Witch Hunters. Their base: an old fortress."*

**Theme:** Dark castle interior with stone walls, torch-lit corridors, and vertical platforming.  
**Enemies:** Nilfgaardian Soldiers, Witch Hunters, Wraiths  
**Length:** 12 screens (11,520 px)

---

### Level 4 — *The Cursed Battlefield*
> *"An ancient battlefield where Nilfgaard performs a dark ritual to bind a griffin as weapon."*

**Theme:** Blood-red sky over war-torn fields with ember particles drifting through the air.  
**Enemies:** Ghouls, Wraiths, Nilfgaardian Soldiers, Wild Hunt Warriors  
**Length:** 10 screens (9,600 px)

---

### Level 5 — *The Summit*
> *"The mountain peak. The bound griffin must be freed — but the Wild Hunt wants it as a weapon."*

**Theme:** Snow-capped peaks with icy platforms, aurora borealis shimmering in the sky.  
**Enemies:** Wild Hunt Warriors, Wraiths, Nekkers + **Griffin Boss**  
**Length:** 14 screens (13,440 px)

---

## 🏗️ Technical Architecture

The entire game is built on a custom engine using the global `W` namespace. Zero dependencies. Zero build steps.

```
Witcher2D/
├── index.html                  # Entry point — HTML shell, CSS, UI overlay
│
└── js/
    ├── core.js                 # W namespace, constants, Camera (smooth follow + screen shake)
    ├── rendering.js            # Canvas rendering utilities and color palette (W.Colors)
    ├── particles.js            # Particle system — blood, sparks, silver/ice trails, embers
    ├── player.js               # Geralt: pixel art sprites, state machine, physics, combat
    ├── game.js                 # Main orchestrator — game loop, input, collision, transitions
    │
    ├── enemies/
    │   ├── base.js             # W.Enemy base class — AI states, hitboxes, damage system
    │   ├── creatures1.js       # Nekker, Drowner (category: creature → silver)
    │   ├── creatures2.js       # Ghoul (category: creature → silver)
    │   ├── creatures3.js       # Wraith, Griffin boss (category: creature → silver)
    │   ├── humans1.js          # Bandit, Nobleman Thug (category: human → iron)
    │   ├── humans2.js          # Nilfgaardian Soldier, Witch Hunter (category: human → iron)
    │   └── humans3.js          # Wild Hunt Warrior (category: human → iron)
    │
    └── level/
        ├── platform.js         # Platform types (stone, wood, ice) and collision
        ├── backgrounds.js      # 5 parallax background themes (village, swamp, castle, battlefield, mountain)
        ├── core.js             # Level loader, WaveManager for endless mode
        ├── story1.js           # Levels 1–2: Blighted Village, Swamp Depths
        ├── story2.js           # Levels 3–4: Abandoned Keep, Cursed Battlefield
        └── story3.js           # Level 5: The Summit + StoryLevels master array
```

### Key Technical Details

- **Resolution:** 960 x 540 canvas with `image-rendering: pixelated`
- **Rendering:** All sprites are procedural pixel art — no image assets loaded
- **Physics:** Custom gravity (0.55 px/frame), ground collision at Y=480
- **Camera:** Smooth-follow with configurable screen shake on hits
- **Enemy AI:** State machine (`idle` → `chase` → `attack` → `hit` → `dead`) with aggro ranges
- **Particle Types:** Blood splatter, weapon sparks, silver sword trails, ice crystals, ember drifts, magic bursts
- **Parallax:** Multi-layer scrolling backgrounds (0.1x, 0.3x, 0.5x depth layers)
- **Player Sprite:** 20x28 pixel grid scaled 2x, with per-pixel color data stored as JS arrays

---

## 🚀 How to Play

**No installation required.** No npm. No webpack. No node_modules.

```bash
# Option 1: Just open the file
open index.html
# (or double-click index.html in your file explorer)

# Option 2: Local server (if you prefer)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Clone and play
git clone https://github.com/VitKrupa/Witcher2D.git
cd Witcher2D
open index.html
```

Works in any modern browser — Chrome, Firefox, Safari, Edge. No extensions needed.

---

## ✨ Visual Features

- **5 unique parallax backgrounds** — each level has a distinct atmosphere with multi-layered scrolling
- **Procedural pixel art** — every character, enemy, and environment piece is drawn with code
- **Particle effects** — blood splatters on kills, sparks on sword clashes, silver trails from the silver sword, ice crystals on the frozen summit, embers floating across the battlefield
- **Screen shake** — on heavy hits for satisfying combat feedback
- **Floating damage text** — see your damage numbers and "RESIST" indicators in real-time
- **Wave announcements** — dramatic text overlays when new waves arrive
- **Aurora borealis** — The Summit's sky features shimmering northern lights

---

## 🎨 Color Palette

The game uses a carefully chosen Witcher-inspired palette defined in `W.Colors`:

| Element | Sample | Hex |
|---------|:------:|-----|
| Witcher Gold (UI) | 🟡 | `#c8a032` |
| Silver Blade | ⚪ | `#c0c0d0` |
| Iron Blade | 🟤 | `#8a7a6a` |
| Geralt's Hair | ⬜ | White |
| Geralt's Eyes | 🟡 | Yellow (cat-like) |
| Nekker Skin | 🟫 | `#5a4a2a` |
| Bandit Leather | 🟫 | `#6a5a3a` |
| Blood Particles | 🔴 | Various reds |

---

## 💡 Tips for Survival

- **Always check the enemy hint** in the bottom-left panel — it tells you what type of enemy is nearby
- **Roll through enemies** with `S` / `↓` to reposition behind them
- **Block heavy attacks** with `Shift` rather than trying to trade blows
- **In Wave Mode**, conserve health early — later waves mix creature and human enemies, forcing constant sword switching
- **Platforming matters** — use high ground to avoid being swarmed by Nekkers
- **The Griffin is a creature** — use your Silver Sword!

---

## 🙏 Credits & Inspiration

- **The Witcher 3: Wild Hunt** by CD Projekt Red — world, characters, lore, and the iconic two-sword system
- **Prince of Persia** (1989) by Jordan Mechner — side-scrolling platformer combat inspiration
- Built with nothing but HTML5 Canvas, vanilla JavaScript, and love for pixel art

---

<div align="center">

*Toss a coin to your Witcher...*

**Made with `<canvas>` and `ctx.fillRect()` — no sprites harmed in the making of this game.**

</div>
