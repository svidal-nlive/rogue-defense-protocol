# 🎮 Rogue Defense Protocol - Playthrough Testing Strategy

> **Public URL:** https://rogue-defense.vectorhost.net  
> **Test Date:** 2026-01-14  
> **Tester:** AI Agent (Playwright MCP)  
> **Status:** ⏳ Pending Confirmation

---

## Overview

This document outlines a comprehensive testing strategy for Rogue Defense Protocol, a tower defense game with roguelike elements. Testing will cover desktop and mobile viewports, core gameplay mechanics, UI/UX, shop system, and specifically investigate the reported **fast forward/speed-up button wave reset bug**.

---

## 🐛 Known Issue to Investigate

**Issue:** When pressing the fast forward (speed up) button, the wave appears to reset. The same behavior occurs when deselecting the speed-up button.

**Investigation Priority:** HIGH  
**Test Focus:** 
- Document exact conditions when wave resets
- Capture before/after screenshots
- Test toggle on/off sequences
- Check if enemy count, positions, or wave progress resets
- Verify if gold/kills are affected

---

## Testing Phases

### Phase 1: Initial Load & Desktop Navigation (1920x1080) ✅
- [x] Navigate to https://rogue-defense.vectorhost.net
- [x] Take accessibility snapshot of home screen
- [x] Verify header displays (gold, gems counters) - Shows Gold: 0→30, Gems: 0→1 after battle
- [x] Screenshot home screen layout - `phase1-home-desktop.png`
- [x] Navigate through all screens (Home → Guardian → Skills → Shop → Battle)
  - Control (Home): Mission display, Deploy button, Daily Ops
  - Construct (Guardian): Stats radar chart, Damage 59, HP 3625, Crit 26%
  - Neural (Skills): Skill tree with OFFENSE/DEFENSE/UTILITY tabs
  - Supply (Shop): Boosts, Weapons, Base tabs with pricing
  - Battle: Full gameplay with canvas, abilities, speed controls
- [x] Verify navigation responsiveness - All navigation instant, no lag

### Phase 2: Shop System Testing (Desktop) ✅
- [x] Enter Shop screen
- [x] Verify tabs display (Boosts, Weapon Skins, Base Skins)
- [x] Check rarity indicators and pricing display
- [x] Screenshot each shop tab
- [x] Test purchase flow (insufficient currency shows "Not Enough Currency" disabled button)
- [x] Verify skin equip functionality (owned items show "Currently Equipped" status)

### Phase 3: Guardian & Skills Screen (Desktop) ✅
- [x] Open Guardian screen (Construct tab)
- [x] Verify weapon/guardian stats UI (radar chart showing Damage, HP, Crit, etc.)
- [x] Screenshot guardian stats
- [x] Open Skills screen (Neural tab)
- [x] Verify skill tree display (OFFENSE, DEFENSE, UTILITY categories)
- [x] Check skill details modal (Plasma Core: +10% damage, Level 0/10, Cost 100 gold)
- [x] Test skill purchase (shows "INSUFFICIENT_FUNDS" when not enough gold)

### Phase 4: Battle Gameplay - Core Mechanics (Desktop) ✅
- [x] Start a battle from Home screen (DEPLOY button)
- [x] Screenshot initial battle state
- [x] Observe enemy spawning (verified wave progression)
- [x] Verify projectile firing (auto-fire on enemies)
- [x] Check damage numbers display (shown in combat log)
- [x] Monitor wave progression (tracked in Wave Progress: X/12)
- [x] Test active abilities (Q=Plasma Burst with 8s cooldown, W=Shield, E=Overclock)
- [x] Test Pause/Resume functionality (working correctly)
- [x] Verify speed toggle (1x/2x) - FIX CONFIRMED WORKING
- [x] Screenshot battle in progress

### Phase 5: � FIXED - Speed-Up Button Bug Investigation (Desktop) ✅
- [x] Start fresh battle
- [x] Wait for wave to begin, note enemy count/positions
- [x] Screenshot pre-speed-up state with wave/enemy info visible
- [x] Press fast forward/speed-up button
- [x] Screenshot immediately after enabling speed-up
- [x] Document: Did wave reset? Did enemies reset? **YES - BUG CONFIRMED**
- [x] Let game run for 5-10 seconds in fast mode
- [x] Press speed-up button again to disable
- [x] Screenshot after disabling speed-up
- [x] Document: Did wave reset again? **YES - BUG CONFIRMED**
- [x] Repeat toggle test 3 times, noting each outcome
- [x] Record exact button element and behavior
- [x] **ROOT CAUSE IDENTIFIED & FIXED**

### Phase 6: Battle End & Summary ✅
- [x] Exit battle mid-wave (clicked Exit during wave 1)
- [x] Screenshot battle summary screen
- [x] Verify loot breakdown displayed:
  - Gold Earned: 15
  - Gems Found: 0
  - Score: 30
  - Waves: 0
- [x] Verify Combat Analysis displayed:
  - Enemies Eliminated: 3
  - Critical Hits: 0
  - Damage Dealt: 105
  - Crit Rate: 0%
- [x] Check "COLLECT_REWARDS" button flow (working)
- [x] Verify rewards added to wallet (Gold: 30→45 after collection)

### Phase 7: Mobile View Testing (390x844 - iPhone 14 Pro) ✅
- [x] Resize browser to mobile dimensions
- [x] Screenshot home screen (portrait mode)
- [x] Verify top navigation (Control, Construct, Neural, Supply, Settings)
- [x] Test tap navigation to each screen (all working)
- [x] Enter battle mode
- [x] Screenshot mobile battle layout (compact HUD, touch-friendly ability buttons)
- [x] Verify touch controls visible (Q, W, E ability buttons with large touch targets)
- [x] Test battle controls (Pause, Speed, Exit as icon buttons)
- [x] Exit battle and return to main menu

### Phase 8: Mobile Landscape Testing (844x390) ✅
- [x] Rotate to landscape
- [x] Screenshot landscape layout
- [x] Verify navigation and header adapts
- [x] Enter battle and verify controls
- [x] Screenshot landscape battle (full labels on ability buttons: "Plasma Burst Q", "Shield W", etc.)
- [x] Battle controls: Pause, 1x Speed, Exit (with text labels)

### Phase 9: Tablet View Testing (768x1024 - iPad) ✅
- [x] Resize to tablet dimensions
- [x] Verify layout adapts properly (desktop-style layout with full navigation)
- [x] Test all screens (Home, Shop, Neural/Skills)
- [x] Battle test (full desktop-style HUD with all panels)
- [x] All functionality working as expected

### Phase 10: Visual Effects & Polish Verification ✅
- [x] Observe base station animations (visible in battle)
- [x] Check enemy spawning and movement (verified)
- [x] Verify projectile firing from base (auto-fire working)
- [x] Check damage tracking in combat log (real-time updates)
- [x] Observe wave transition (wave counter updates, new enemies spawn)
- [x] Verify floating UI elements (score, gold counters animate)

---

## Bug Report Template

For any bugs discovered:

```markdown
### Bug: [Title]
**Severity:** Critical / High / Medium / Low
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:** What should happen
**Actual Behavior:** What actually happens
**Screenshots:** [attached]
**Device/Viewport:** Desktop 1920x1080 / Mobile 390x844 / etc.
```

---

## Test Results (To Be Filled During Testing)

### Phase 1 Results ✅
| Test | Status | Notes |
|------|--------|-------|
| Home load | ✅ | Page loads instantly, title "Rogue Defense Protocol" |
| Navigation | ✅ | All 4 screens accessible: Control, Construct, Neural, Supply |
| Header display | ✅ | Gold/Gems counters visible, energy 35/30, level 1 |
| Battle entry | ✅ | DEPLOY button works, battle canvas renders properly |
| Battle exit | ✅ | Summary modal shows rewards, COLLECT_REWARDS works |
| Rewards | ✅ | Gold increased 0→30, Gems 0→1 after collection |

**Screenshots captured:**
- `phase1-home-desktop.png` - Home screen with mission card
- `phase1-guardian-desktop.png` - Guardian stats with radar chart
- `phase1-neural-desktop.png` - Skill tree view
- `phase1-shop-boosts-desktop.png` - Shop with boost items
- `phase1-battle-desktop.png` - Active battle gameplay
- `phase1-battle-summary.png` - End of battle summary modal

### Phase 5 Results - Speed-Up Bug ✅ FIXED
| Toggle Action | Wave Before | Wave After | Enemies Reset? | Notes |
|---------------|-------------|------------|----------------|-------|
| Enable speed-up | 01 | 01 | ✅ YES (BUG) | Hostiles dropped 3→0 |
| Disable speed-up | 01 | 01 | ✅ YES (BUG) | Hostiles dropped 3→0 |
| Toggle #2 On | 01 | 01 | ✅ YES (BUG) | Hostiles dropped 2→0 |
| Toggle #2 Off | 01 | 01 | ✅ YES (BUG) | Hostiles dropped 2→0 |
| Toggle #3 On | 01 | 01 | ✅ YES (BUG) | Hostiles dropped 2→0 |
| Toggle #3 Off | 01 | 01 | ✅ YES (BUG) | Hostiles dropped to 0 |

#### 🔴 Root Cause Analysis
**Location:** `components/Screens/BattleScreen.tsx`

**Problem:** The main game loop `useEffect` had `speedMultiplier` in its dependency array. When the speed button was clicked, React would:
1. Update `speedMultiplier` state (1→2 or 2→1)
2. Re-run the entire `useEffect` due to dependency change
3. Execute the "reset game state on mount" block which cleared all enemies, projectiles, and particles

**Code causing the bug (lines 374-384):**
```tsx
// Reset game state on mount  ← THIS RUNS ON EVERY SPEED CHANGE!
gameStateRef.current = {
  ...gameStateRef.current,
  enemies: [],        // ← CLEARS ALL ENEMIES
  projectiles: [],    // ← CLEARS ALL PROJECTILES  
  particles: [],
  damageNumbers: [],
  hp: 3000,
  lastTime: performance.now()
};
```

**Dependency array causing re-run (line 1733):**
```tsx
}, [paused, speedMultiplier, gameOver, stats, wave, ...]);
//          ↑ THIS TRIGGERS FULL EFFECT RE-RUN
```

#### 🟢 Fix Applied
1. Added `speedMultiplierRef` to track speed value via ref instead of direct state access
2. Added sync effect to update ref when state changes
3. Updated game loop to use `speedMultiplierRef.current` instead of `speedMultiplier`
4. Removed `speedMultiplier` from dependency array

**Changes made:**
- Line 91: Added `const speedMultiplierRef = useRef(1);`
- Lines 152-155: Added sync effect for speedMultiplier → ref
- Line 409: Changed `speedMultiplier` to `speedMultiplierRef.current`
- Line 1749: Removed `speedMultiplier` from dependency array

#### ✅ Fix Verification
| Toggle Action | Hostiles Before | Hostiles After | Game State |
|---------------|-----------------|----------------|------------|
| Enable 2x | 2 | 3 (spawned) | ✅ Preserved |
| Disable 2x | 4 | 4 | ✅ Preserved |
| Score/Gold | - | - | ✅ Accumulating |
| Wave Progress | 0/12 | 2/12 | ✅ Progressing |

**Screenshots captured:**
- `phase5-pre-speedup-state.png` - Before enabling speed
- `phase5-after-speedup-enabled.png` - After enabling (bug shown)
- `phase5-BUG-after-disabling-speed-reset.png` - Bug confirmed on disable
- `phase5-FIX-WORKING-after-enable-2x.png` - Fix verified on enable
- `phase5-FIX-CONFIRMED-after-disable-2x.png` - Fix verified on disable

### Phase 2 Results - Shop System ✅
| Tab | Items | Pricing | Status |
|-----|-------|---------|--------|
| Boosts | 10 items (Gold Rush, Power Surge, Shield Boost, Rapid Fire, Lucky Shot, XP Boost, Mega Wave, Critical Strike, Regeneration, Max Power) | 500-5000 gold or 50-200 gems | ✅ All items display correctly |
| Weapons | 7 items (Standard Issue OWNED, Inferno Core, Tesla Surge, Arctic Blast, Void Walker, Prismatic Fury, Golden Arsenal) | 5K-7.5K gold or 100-200 gems | ✅ Equipped status shown |
| Base | 7 items (Protocol Standard OWNED, Neon Reactor, Infernal Fortress, Cryo Citadel, Void Sanctum, Gilded Bastion, Prismatic Nexus) | 8K-10K gold or 150-300 gems | ✅ Equipped status shown |

**Purchase Flow Tested:**
- Clicked "Gold Rush" (500 gold) with only 30 gold
- Modal correctly shows "Not Enough Currency" (disabled button)
- Modal includes item details: name, rarity, description, duration, price

**Skin Equip Tested:**
- Standard Issue (Weapons) shows "Currently Equipped" status in modal
- Protocol Standard (Base) shows "Equipped" badge on card and modal

**Screenshots captured:**
- `phase2-shop-boosts-tab.png` - Boosts tab with 10 items
- `phase2-shop-weapons-tab.png` - Weapons tab with 7 items
- `phase2-shop-base-tab.png` - Base tab with 7 items
- `phase2-shop-insufficient-funds.png` - Insufficient funds modal

### Phase 3 Results - Guardian & Skills ✅
| Screen | Feature | Status |
|--------|---------|--------|
| Construct (Guardian) | Radar chart display | ✅ Shows Damage 59, HP 3625, Crit 26%, Speed, Defense stats |
| Neural (Skills) | OFFENSE tab | ✅ 7 skill icons displayed |
| Neural (Skills) | DEFENSE tab | ✅ Skills displayed |
| Neural (Skills) | UTILITY tab | ✅ 4 skill icons displayed |
| Skill Detail | Plasma Core | ✅ Level 0/10, +10% damage, Cost 100 gold, "INSUFFICIENT_FUNDS" button |

**Screenshots captured:**
- `phase3-neural-overview.png` - Skills screen overview
- `phase3-skill-plasma-core.png` - Plasma Core skill detail modal
- `phase3-defense-skills.png` - Defense category skills
- `phase3-utility-skills.png` - Utility category skills

### Phase 4 Results - Battle Gameplay ✅
| Feature | Status | Notes |
|---------|--------|-------|
| Battle start | ✅ | DEPLOY button enters battle smoothly |
| Wave display | ✅ | Shows "WAVE 01" in HUD |
| Wave progress | ✅ | Displays X/12 progress bar |
| Combat log | ✅ | Shows hostiles, status, score in real-time |
| Gold tracking | ✅ | Displays earned gold during battle |
| Hull integrity | ✅ | Shows 100% health status |
| Tactical abilities | ✅ | Plasma Burst (Q), Shield (W), Overclock (E) with cooldowns |
| Ability cooldown | ✅ | Shows "8s" countdown after use, button disabled during cooldown |
| Pause/Resume | ✅ | Pause button changes to Resume, game freezes |
| Speed toggle | ✅ | 1x/2x toggle WORKING (Phase 5 fix verified) |
| Exit mid-battle | ✅ | Opens summary modal |

**Screenshots captured:**
- `phase4-mission-screen.png` - Pre-battle mission details
- `phase4-battle-in-progress.png` - Active battle state
- `phase4-ability-test.png` - After using Plasma Burst ability
- `phase4-pause-state.png` - Pause menu active

### Phase 6 Results - Battle End & Summary ✅
| Feature | Status | Notes |
|---------|--------|-------|
| Summary modal | ✅ | "SYSTEM_OFFLINE" title for early exit |
| Wave summary | ✅ | "Wave 1 | 3 hostiles neutralized" |
| Gold Earned | ✅ | 15 gold displayed |
| Gems Found | ✅ | 0 gems (no gems dropped this battle) |
| Score | ✅ | 30 points |
| Waves Completed | ✅ | 0 (exited mid-wave) |
| Combat Analysis | ✅ | Enemies: 3, Crits: 0, Damage: 105, Crit Rate: 0% |
| COLLECT_REWARDS button | ✅ | Works, returns to main menu |
| Wallet update | ✅ | Gold updated 30→45 after collection |

**Screenshots captured:**
- `phase6-exit-screen.png` - Battle summary modal
- `phase6-rewards-collected.png` - Post-collection main menu

### Phase 7 Results - Mobile Portrait (390x844) ✅
| Feature | Status | Notes |
|---------|--------|-------|
| Home screen | ✅ | All content visible, properly scaled |
| Navigation | ✅ | Top nav bar with all 5 buttons (Control, Construct, Neural, Supply, Settings) |
| Header | ✅ | Level, Gold (45), Gems (1), Energy (35/30) displayed |
| Shop screen | ✅ | All tabs accessible, items display correctly |
| Neural screen | ✅ | Skill tree renders in compact layout |
| Battle entry | ✅ | DEPLOY works, transitions smoothly |
| Battle HUD | ✅ | Compact layout: WAVE/SCORE/GOLD top bar, HULL/WAVE progress |
| Ability buttons | ✅ | Q/W/E buttons with large touch targets |
| Control buttons | ✅ | Pause/Speed/Exit as icon-only buttons |

**Screenshots captured:**
- `phase7-mobile-home.png` - Home screen portrait
- `phase7-mobile-shop.png` - Shop screen portrait
- `phase7-mobile-neural.png` - Skills screen portrait
- `phase7-mobile-battle.png` - Battle gameplay portrait

### Phase 8 Results - Mobile Landscape (844x390) ✅
| Feature | Status | Notes |
|---------|--------|-------|
| Home layout | ✅ | Desktop-style header with Protocol Instance name |
| Navigation | ✅ | Full nav bar visible |
| Battle layout | ✅ | Wide canvas, side controls |
| Ability buttons | ✅ | Full labels: "Plasma Burst Q", "Shield W", "Overclock E" |
| Control buttons | ✅ | Full labels: "Pause", "1x Speed", "Exit" |

**Screenshots captured:**
- `phase8-landscape-home.png` - Home screen landscape
- `phase8-landscape-battle.png` - Battle start landscape
- `phase8-landscape-battle-running.png` - Battle in progress

### Phase 9 Results - Tablet (768x1024) ✅
| Feature | Status | Notes |
|---------|--------|-------|
| Home layout | ✅ | Full desktop-style layout |
| Navigation | ✅ | Complete header with Protocol Instance details |
| Shop screen | ✅ | Grid layout with all items |
| Neural screen | ✅ | Full skill tree with categories |
| Battle layout | ✅ | Desktop-style HUD with all panels |

**Screenshots captured:**
- `phase9-tablet-home.png` - Home screen iPad
- `phase9-tablet-shop.png` - Shop screen iPad
- `phase9-tablet-neural.png` - Skills screen iPad
- `phase9-tablet-battle.png` - Battle gameplay iPad

---

## Viewport Configurations

| Device | Width | Height | Orientation |
|--------|-------|--------|-------------|
| Desktop HD | 1920 | 1080 | Landscape |
| Desktop Standard | 1280 | 800 | Landscape |
| iPhone 14 Pro | 390 | 844 | Portrait |
| iPhone 14 Pro Landscape | 844 | 390 | Landscape |
| iPad | 768 | 1024 | Portrait |
| iPad Landscape | 1024 | 768 | Landscape |

---

## ✅ Testing Complete

**Test Date:** 2026-01-14  
**Tester:** AI Agent (Playwright MCP)  
**Status:** ✅ ALL PHASES COMPLETE

### Summary
All 10 testing phases have been completed successfully:
- **Phase 1-4, 6:** Core desktop functionality ✅
- **Phase 5:** Speed-up bug FIXED ✅
- **Phase 7-9:** Responsive design (Mobile/Tablet) ✅
- **Phase 10:** Visual effects verified ✅

### Critical Bug Fixed
The speed-up button wave reset bug has been identified, fixed, and verified. The fix involved:
1. Using a `useRef` to track speed multiplier instead of state in game loop
2. Removing `speedMultiplier` from the game loop's dependency array
3. Syncing the ref value from state in a separate effect

**No additional bugs discovered during testing.**
