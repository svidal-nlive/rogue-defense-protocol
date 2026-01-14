# 🎮 ROGUE DEFENSE PROTOCOL - Enhancement Plan

## 📊 Current State Analysis

**What exists:**
- React/TypeScript tower defense game with Vite build system
- 5 screens: Home, Battle, Guardian (stats), Skills (skill tree), Shop (placeholder)
- Canvas-based battle system with enemies, projectiles, and particles
- Basic mobile-first layout with `lg:` breakpoints for desktop
- Cyberpunk neon aesthetic (cyan, pink, yellow, purple)
- Partial state management (score is tracked but not persisted, gold/gems are static)

**Key Issues to Fix:**
1. **No Docker/Traefik integration** - Missing docker-compose.yml, Dockerfile
2. **Disconnected economy** - Stats/gold/gems are hardcoded in constants, not earned in-game
3. **No wave progression** - Wave counter never increments
4. **Shop is offline** - Just a placeholder
5. **Skills don't apply** - Upgrade system is visual only
6. **Battle lacks weapon variety** - Only basic projectile, no skills used
7. **No persistent state** - Progress lost on reload
8. **Visual polish needed** - Base design is basic, enemies are simple shapes

---

## 🚀 Proposed Enhancement Plan

### **Phase 1: Docker & Traefik Integration**
```
- [ ] Create Dockerfile (multi-stage Node build)
- [ ] Create docker-compose.yml with Traefik labels
- [ ] Create .env.example for configuration
- [ ] Add nginx/server.js for production static serving
- [ ] Configure for rogue-defense.vectorhost.net domain
```

### **Phase 2: State Management & Economy System**
```
- [ ] Create GameContext for global state (React Context + useReducer)
- [ ] Connect battle score → gold earnings (10 gold per kill, wave bonus)
- [ ] Wave progression system (advance after clearing X enemies)
- [ ] Persist state to localStorage 
- [ ] Display earned credits in header (dynamic, not static)
- [ ] Battle end summary screen with loot breakdown
```

### **Phase 3: Skill Tree Integration**
```
- [ ] Skills affect actual gameplay stats
- [ ] Upgrade nodes deduct gold
- [ ] Unlock prerequisites system working
- [ ] Active abilities usable in battle (hotkeys Q/W/E)
  - Plasma Burst: AoE damage
  - Shield Overcharge: Temp invulnerability
  - Overclock: 2x fire rate temporarily
```

### **Phase 4: Weapon & Combat Enhancements**
```
- [ ] Multiple weapon types:
  - Basic Blaster (current)
  - Homing Missiles (splash damage)
  - Laser Beam (continuous DPS)
  - Cryo Cannon (slows enemies)
- [ ] Weapon selection in Guardian screen
- [ ] Critical hit visual feedback (screen shake, damage numbers)
- [ ] Enemy variety:
  - Swarm (small, fast, low HP)
  - Tank (slow, high HP, large)
  - Boss (every 5 waves, massive HP, unique attacks)
```

### **Phase 5: Visual Masterpiece Upgrades**

#### **Base Defense Station:**
```
- [ ] Multi-layer animated base with rotating rings
- [ ] Shield bubble effect (pulsing transparency)
- [ ] Weapon turret that rotates toward targets
- [ ] Energy core glow effect
- [ ] Damage sparks when hit
```

#### **Enemy Enhancements:**
```
- [ ] Animated SVG-style enemies instead of simple shapes
- [ ] Glowing trails as they move
- [ ] Death explosion particles with debris
- [ ] Shield indicators for tanky enemies
- [ ] Boss unique designs with multiple hit zones
```

#### **Projectile & Effects:**
```
- [ ] Weapon-specific projectile designs
- [ ] Plasma trails with gradient fade
- [ ] Impact explosions with shockwave rings
- [ ] Screen shake on critical hits
- [ ] Background nebula/starfield parallax
```

#### **UI Polish:**
```
- [ ] Animated health bar with glow
- [ ] Floating damage numbers
- [ ] Wave transition animations
- [ ] Victory/defeat cinematic screens
- [ ] Particle system for idle ambient effects
```

### **Phase 6: Mobile-First Responsive Overhaul**
```
- [ ] Portrait mode (default):
  - Canvas takes ~70% height
  - Controls in bottom tray
  - Minimal HUD overlay on canvas
  
- [ ] Landscape mode (desktop/tablet):
  - Horizontal layout (sidebar + canvas + sidebar)
  - Full stat displays visible
  - Keyboard shortcuts enabled
  
- [ ] Touch controls:
  - Tap to target enemy priority
  - Swipe to activate abilities
  - Pinch zoom disabled (lock scale)
```

### **Phase 7: Shop System**
```
- [ ] Premium currency (gems) for cosmetics
- [ ] Gold for upgrades
- [ ] Purchasable items:
  - Weapon skins
  - Base skins
  - Boost items (2x gold, shield repair)
```

---

## 🎨 Visual Theme Enhancement

**Color Palette (keeping cyberpunk neon):**
- Primary: `#00F0FF` (Cyan) - Player elements
- Danger: `#FF003C` (Pink/Red) - Enemies, damage
- Reward: `#FCEE0A` (Yellow) - Gold, crits
- Power: `#BC13FE` (Purple) - Abilities, rare items
- System: `#0AFF64` (Green) - Health, success

**New Visual Elements:**
- Hexagonal grid pattern background
- Floating holographic UI panels
- Scan line overlay for CRT effect (already exists, enhance)
- Chromatic aberration on damage
- Bloom effects on energy weapons

---

## 📁 New File Structure

```
rogue-defense-protocol/
├── docker-compose.yml          # NEW
├── Dockerfile                   # NEW
├── .env.example                 # NEW
├── nginx.conf                   # NEW (static serving)
├── server.js                    # NEW (Express static server)
├── src/                         # NEW directory
│   ├── App.tsx
│   ├── index.tsx
│   ├── contexts/
│   │   └── GameContext.tsx      # NEW - Global state
│   ├── hooks/
│   │   └── useGameLoop.ts       # NEW - Battle logic hook
│   ├── components/
│   │   ├── Layout/
│   │   ├── Screens/
│   │   ├── Battle/              # NEW
│   │   │   ├── Canvas.tsx
│   │   │   ├── Base.tsx
│   │   │   ├── Enemy.tsx
│   │   │   └── Effects.tsx
│   │   └── UI/                  # NEW
│   │       ├── DamageNumber.tsx
│   │       └── WaveTransition.tsx
│   ├── types/
│   ├── constants/
│   └── utils/
│       ├── storage.ts           # NEW - localStorage
│       └── particles.ts         # NEW - Particle system
├── public/
│   └── favicon.ico
└── index.html
```

---

## 🔧 Technical Stack

- **Build:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS (via CDN → bundled)
- **Canvas:** HTML5 Canvas 2D (keeping current approach)
- **State:** React Context + useReducer + localStorage
- **Deployment:** Docker + Traefik + nginx/Express static

---

## ⏱️ Estimated Implementation Order

| Phase | Priority | Complexity |
|-------|----------|------------|
| 1. Docker/Traefik | 🔴 Critical | Low |
| 2. State Management | 🔴 Critical | Medium |
| 6. Responsive Layout | 🟡 High | Medium |
| 3. Skill Integration | 🟡 High | Medium |
| 4. Weapons/Combat | 🟡 High | High |
| 5. Visual Polish | 🟢 Medium | High |
| 7. Shop System | 🟢 Low | Medium |

---

## ✅ Deliverables

1. **Fully functional Docker stack** with Traefik routing at `rogue-defense.vectorhost.net`
2. **Complete game loop** where battle → earn gold → upgrade skills → harder battle
3. **Mobile-first responsive design** that transforms for desktop/landscape
4. **Visually stunning** cyberpunk aesthetic with smooth animations
5. **Persistent progress** across sessions

---
