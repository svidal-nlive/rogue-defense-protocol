# 🎮 Rogue Defense Protocol - Comprehensive Balance & Progression System

> **Version:** 2.0  
> **Created:** 2026-01-14  
> **Updated:** 2026-01-14  
> **Status:** ✅ Implemented  
> **Goal:** Establish persistent, formula-driven balance with meaningful build requirements

---

## 🎯 Design Philosophy

### Core Roguelike Principles
1. **Incremental Mastery** - Each run should feel like progress toward a goal
2. **Build Investment Required** - Players must invest in upgrades to progress beyond early waves
3. **Meaningful Choices** - Chips, skills, and weapons create distinct playstyles
4. **Consistent Scaling** - All values derive from clear, predictable formulas
5. **Fail States Matter** - Early waves should punish negligence, not just late waves

### Current Problems Identified
| Issue | Impact | Root Cause |
|-------|--------|------------|
| Wave 1 AFK-able | Undermines roguelike feel | Player damage >> enemy HP |
| Collision damage inconsistent | No clear threat model | Hardcoded `100` or `500` values |
| Defense stat unused | Chips provide defense but it's never applied | Missing damage reduction formula |
| No "soft wall" mechanic | Players don't feel progression needs | Linear scaling too gentle |
| Builds feel optional | Can progress without investment | Stats too generous at start |

---

## 📊 Current State Analysis

### Player Stats (Fresh Start)
```typescript
// constants.ts - INITIAL_STATS
{
  level: 50,      // ← Should be 1 for fresh players
  gold: 3174,     // ← Should be 0
  gems: 5650,     // ← Should be 0
  energy: 35,
  maxEnergy: 30,
  damage: 35,     // ← Too high for Wave 1
  attackSpeed: 1.2,
  critRate: 15,   // ← Too generous
  critDamage: 150
}
```

### Enemy Collision Damage (Current - Hardcoded)
```typescript
// BattleScreen.tsx line 520
const damage = enemy.type === EnemyType.BOSS ? 500 : 100;
```

**Problem:** All non-boss enemies deal identical 100 damage regardless of:
- Enemy type (TANK should hurt more than SWARM)
- Wave number (Wave 10 enemies should be scarier)
- Player defense stat (never consulted)

### Enemy Health (Current - Scattered Logic)
```typescript
// BattleScreen.tsx - spawn logic
let enemyHp = 100 * waveConfig.enemyHpMultiplier;  // CIRCLE base
// Then type-specific multipliers scattered through if/else
```

**Problem:** No single source of truth for enemy stats.

---

## 🔧 Proposed System: Unified Enemy Definition

### New Enemy Configuration (Centralized)

Create a new constants file or extend `types.ts`:

```typescript
// types.ts or constants/enemies.ts

export interface EnemyDefinition {
  type: EnemyType;
  baseHp: number;
  baseSpeed: number;
  baseDamage: number;      // NEW: Collision damage
  radius: number;
  color: string;
  spawnWeight: number;     // Relative spawn chance
  goldReward: number;
  scoreReward: number;
}

export const ENEMY_DEFINITIONS: Record<EnemyType, EnemyDefinition> = {
  [EnemyType.CIRCLE]: {
    type: EnemyType.CIRCLE,
    baseHp: 150,           // Up from 100
    baseSpeed: 0.055,      // Slightly faster
    baseDamage: 75,        // NEW: Collision damage
    radius: 15,
    color: '#00F0FF',
    spawnWeight: 50,
    goldReward: 5,
    scoreReward: 10,
  },
  [EnemyType.TRIANGLE]: {
    type: EnemyType.TRIANGLE,
    baseHp: 200,           // Up from 150
    baseSpeed: 0.045,
    baseDamage: 100,       // Medium damage
    radius: 18,
    color: '#FCEE0A',
    spawnWeight: 25,
    goldReward: 10,
    scoreReward: 15,
  },
  [EnemyType.SQUARE]: {
    type: EnemyType.SQUARE,
    baseHp: 350,           // Up from 250
    baseSpeed: 0.035,
    baseDamage: 150,       // High damage, slow
    radius: 20,
    color: '#BC13FE',
    spawnWeight: 10,
    goldReward: 15,
    scoreReward: 25,
  },
  [EnemyType.SWARM]: {
    type: EnemyType.SWARM,
    baseHp: 65,            // Up from 50
    baseSpeed: 0.08,       // Very fast
    baseDamage: 40,        // Low damage per unit
    radius: 8,
    color: '#39FF14',
    spawnWeight: 10,
    goldReward: 2,
    scoreReward: 5,
  },
  [EnemyType.TANK]: {
    type: EnemyType.TANK,
    baseHp: 600,           // Up from 500
    baseSpeed: 0.02,
    baseDamage: 250,       // Very high damage
    radius: 30,
    color: '#8B4513',
    spawnWeight: 5,
    goldReward: 30,
    scoreReward: 50,
  },
  [EnemyType.BOSS]: {
    type: EnemyType.BOSS,
    baseHp: 2500,          // Up from 2000
    baseSpeed: 0.018,
    baseDamage: 500,       // Devastating
    radius: 40,
    color: '#FF003C',
    spawnWeight: 0,        // Special spawn logic
    goldReward: 100,
    scoreReward: 500,
  },
};
```

---

## 📐 Proposed Formulas: Persistent Scaling Logic

### 1. Enemy Health Scaling

```typescript
/**
 * Calculate enemy HP at a given wave
 * Formula: baseHp × (1 + (wave - 1) × 0.20)
 * 
 * This creates a 20% HP increase per wave (up from 15%)
 * Wave 1:  1.0x multiplier
 * Wave 5:  1.8x multiplier  
 * Wave 10: 2.8x multiplier
 * Wave 20: 4.8x multiplier ← "Soft wall" without upgrades
 */
export const getEnemyHp = (definition: EnemyDefinition, wave: number): number => {
  const waveMultiplier = 1 + (wave - 1) * 0.20;
  return Math.floor(definition.baseHp * waveMultiplier);
};
```

### 2. Enemy Collision Damage Scaling

```typescript
/**
 * Calculate collision damage at a given wave
 * Formula: baseDamage × (1 + (wave - 1) × 0.15) - playerDefense
 * 
 * Defense reduces damage by flat amount (from chips/skills)
 * Minimum damage is always 10% of base to prevent immunity
 */
export const getCollisionDamage = (
  definition: EnemyDefinition, 
  wave: number, 
  playerDefense: number
): number => {
  const waveMultiplier = 1 + (wave - 1) * 0.15;
  const rawDamage = Math.floor(definition.baseDamage * waveMultiplier);
  const reducedDamage = rawDamage - playerDefense;
  const minimumDamage = Math.floor(definition.baseDamage * 0.10);
  return Math.max(reducedDamage, minimumDamage);
};
```

### 3. Enemy Speed Scaling

```typescript
/**
 * Calculate enemy speed at a given wave
 * Formula: baseSpeed × (1 + (wave - 1) × 0.03)
 * 
 * Gentle 3% increase per wave - speed gets oppressive if too fast
 */
export const getEnemySpeed = (definition: EnemyDefinition, wave: number): number => {
  const waveMultiplier = 1 + (wave - 1) * 0.03;
  return definition.baseSpeed * waveMultiplier;
};
```

### 4. Spawn Pressure Scaling

```typescript
/**
 * Calculate spawn interval at a given wave
 * Formula: max(500, 1800 - wave × 100)
 * 
 * Wave 1:  1800ms (slower start)
 * Wave 5:  1300ms
 * Wave 10: 800ms
 * Wave 13+: 500ms (cap)
 */
export const getSpawnInterval = (wave: number): number => {
  return Math.max(500, 1800 - wave * 100);
};

/**
 * Calculate enemies required per wave
 * Formula: min(8 + wave × 3, 60)
 * 
 * Wave 1:  11 enemies
 * Wave 5:  23 enemies
 * Wave 10: 38 enemies
 * Wave 18+: 60 enemies (cap)
 */
export const getEnemiesRequired = (wave: number): number => {
  return Math.min(8 + wave * 3, 60);
};
```

---

## 🛡️ Defense Stat Integration

### Current State
The `defense` stat exists in the chip system but is **never applied** to damage calculations:

```typescript
// constants/chips.ts - chips provide defense
baseBonus: { hp: 150, defense: 3 },  // defense: 3 does nothing!
```

### Proposed Implementation

```typescript
// In BattleScreen.tsx - collision handling

// Calculate player's total defense from chips + skills
const getPlayerDefense = (): number => {
  let totalDefense = 0;
  
  // Sum defense from equipped chips
  state.chipState.slots.forEach(slot => {
    if (slot.equippedChipId) {
      const chip = state.chipState.ownedChips.find(c => c.id === slot.equippedChipId);
      if (chip) {
        const bonus = calculateChipBonus(getChipById(chip.chipId)!, chip.level);
        totalDefense += bonus.defense || 0;
      }
    }
  });
  
  // Add defense from skills (Nano Plating, Reactive Armor, etc.)
  const nanoPlating = state.skillNodes.find(s => s.id === 'd1');
  if (nanoPlating && nanoPlating.currentLevel > 0) {
    totalDefense += nanoPlating.currentLevel * 5;  // 5 defense per level
  }
  
  return totalDefense;
};

// Then in collision code:
if (dist < enemy.radius + 40) {
  const definition = ENEMY_DEFINITIONS[enemy.type];
  const damage = getCollisionDamage(definition, wave, getPlayerDefense());
  
  if (!gState.shieldActive) {
    setHp(prev => Math.max(0, prev - damage));
  }
  // ... rest of collision handling
}
```

---

## 🎮 Build Requirement Mechanics

### "Soft Walls" - Wave Thresholds

The goal is to create natural breakpoints where unupgraded players will struggle:

| Wave Range | Challenge | Build Requirement |
|------------|-----------|-------------------|
| 1-3 | Tutorial zone | None - learn mechanics |
| 4-6 | First soft wall | ~1-2 skill upgrades or 1 chip |
| 7-10 | Intermediate | Multiple skills + chips equipped |
| 11-15 | Serious challenge | Full chip loadout + weapon choice |
| 16-20 | Expert zone | Optimized build + mastery |
| 21+ | Endless scaling | Min-maxed everything |

### Wave Difficulty Check Table

With proposed values, here's what an **unupgraded player** faces:

| Wave | CIRCLE HP | Player TTK | Spawn Rate | Collision Dmg | Survivable? |
|------|-----------|------------|------------|---------------|-------------|
| 1 | 150 | 6s | 1.8s | 75 | ✅ With effort |
| 3 | 210 | 8.4s | 1.5s | 98 | ⚠️ Challenging |
| 5 | 270 | 10.8s | 1.3s | 120 | ❌ Need upgrades |
| 10 | 420 | 16.8s | 0.8s | 186 | ❌❌ Impossible |

### Player Progression Path

```
Wave 1-3: Learn abilities (Q/W/E), survive with base stats
    ↓ Earn ~150-300 gold
Wave 4: Buy first skill upgrade (Plasma Core +10% dmg)
    ↓ Earn ~200-400 gold  
Wave 5-6: Equip first chip (if found/bought)
    ↓ BOSS wave - requires Shield ability usage
Wave 7+: Multiple upgrades needed, weapon choice matters
```

---

## 🔄 Player Starting Stats Revision

### Fresh Player Stats (Proposed)

```typescript
export const INITIAL_STATS: PlayerStats = {
  level: 1,           // Was 50 (testing value left in)
  gold: 0,            // Was 3174
  gems: 0,            // Was 5650  
  energy: 30,
  maxEnergy: 30,
  damage: 25,         // Down from 35 (29% nerf)
  attackSpeed: 1.0,   // Down from 1.2 (17% nerf)
  critRate: 10,       // Down from 15 (33% nerf)
  critDamage: 150     // Unchanged
};
```

### Stat Scaling Per Upgrade

| Upgrade Source | Stat | Gain Per Level |
|----------------|------|----------------|
| Plasma Core (o1) | Damage | +10% |
| Rapid Fire (o2) | Attack Speed | +5% |
| Crit Optics (o3) | Crit Rate | +2% |
| Nano Plating (d1) | HP | +100, Defense +5 |
| Common Chip (ATK) | Damage | +5 × level |
| Rare Chip (ATK) | Damage | +8 × level, +5% |
| Epic Chip (DEF) | HP | +250, Defense +5% |

---

## 📋 Complete Implementation Checklist

### Phase 1: Data Consolidation
- [ ] Create `constants/enemies.ts` with `ENEMY_DEFINITIONS`
- [ ] Add `baseDamage` property to all enemy types
- [ ] Migrate existing enemy stat values to centralized definitions
- [ ] Export helper functions: `getEnemyHp()`, `getCollisionDamage()`, `getEnemySpeed()`

### Phase 2: Player Stats Correction
- [ ] Update `INITIAL_STATS` in `constants.ts`:
  - [ ] `level: 1` (not 50)
  - [ ] `gold: 0` (not 3174)
  - [ ] `gems: 0` (not 5650)
  - [ ] `damage: 25` (down from 35)
  - [ ] `attackSpeed: 1.0` (down from 1.2)
  - [ ] `critRate: 10` (down from 15)

### Phase 3: Enemy Spawn Refactor
- [ ] Refactor `spawnEnemy()` in `BattleScreen.tsx` to use `ENEMY_DEFINITIONS`
- [ ] Apply `getEnemyHp(definition, wave)` formula
- [ ] Apply `getEnemySpeed(definition, wave)` formula
- [ ] Use `spawnWeight` for type selection instead of hardcoded percentages

### Phase 4: Collision Damage System
- [ ] Implement `getPlayerDefense()` function in BattleScreen
- [ ] Replace hardcoded collision damage with `getCollisionDamage()`
- [ ] Ensure Shield ability still blocks all damage when active
- [ ] Add visual indicator when defense reduces damage

### Phase 5: Wave Configuration
- [ ] Update `getWaveConfig()` in `utils/storage.ts`:
  - [ ] `spawnInterval: getSpawnInterval(wave)` (new formula)
  - [ ] `enemiesRequired: getEnemiesRequired(wave)` (new formula)
  - [ ] `enemyHpMultiplier` → deprecate, use per-enemy formula instead

### Phase 6: Skill Integration
- [ ] Make Nano Plating (d1) provide actual defense stat
- [ ] Ensure defense is added to player stat calculations
- [ ] Add HP bonus from defense skills (not just maxEnergy workaround)

---

## 📊 Collision Damage Reference Table

### By Enemy Type (Wave 1, 0 Defense)
| Enemy | Base Damage | At Wave 1 | At Wave 5 | At Wave 10 |
|-------|-------------|-----------|-----------|------------|
| SWARM | 40 | 40 | 64 | 94 |
| CIRCLE | 75 | 75 | 120 | 176 |
| TRIANGLE | 100 | 100 | 160 | 235 |
| SQUARE | 150 | 150 | 240 | 353 |
| TANK | 250 | 250 | 400 | 588 |
| BOSS | 500 | 500 | 800 | 1175 |

### Effect of Defense Stat
| Defense Value | Damage Reduction | Source Example |
|---------------|------------------|----------------|
| 0 | 0 | Fresh player |
| 15 | -15 flat | Nano Plating Lv3 |
| 30 | -30 flat | Epic Defense Chip |
| 50 | -50 flat | Full defensive build |
| 80+ | -80 flat | Endgame tank build |

**With 50 defense at Wave 5:**
- CIRCLE: 120 - 50 = **70 damage** (42% reduction)
- TANK: 400 - 50 = **350 damage** (12% reduction)

This makes defense valuable against swarms but less effective against bosses - as intended.

---

## ⚠️ Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Wave 1 too hard for casuals | Medium | Tune base enemy HP if needed; keep abilities strong |
| Defense becomes mandatory | Low | Offense builds viable with good play; defense is a crutch |
| Save compatibility breaks | Low | Version bump in storage clears old saves gracefully |
| Formula complexity confuses devs | Low | Document all formulas in code comments |
| Bosses become unkillable | Medium | Test boss HP scaling separately; cap at reasonable levels |

---

## 🧪 Testing Scenarios

### Test 1: Fresh Player Wave 1
- **Setup:** New save, no upgrades, no chips
- **Action:** Deploy battle, use abilities when available
- **Expected:** Pass Wave 1 with 40-60% HP remaining
- **If fail:** Enemy HP too high or spawn rate too aggressive

### Test 2: AFK Wave 1
- **Setup:** New save, start battle, do nothing
- **Expected:** Fail before Wave 2 (base HP reaches 0)
- **If pass:** Enemy damage or spawn pressure too low

### Test 3: Defense Build Effectiveness
- **Setup:** Equip 2 defense chips (total ~30 defense)
- **Action:** Let CIRCLE enemies hit base intentionally
- **Expected:** Take ~45 damage instead of 75 (Wave 1)
- **If no difference:** Defense stat not being applied

### Test 4: Wave 5 Soft Wall
- **Setup:** Fresh player, no upgrades
- **Action:** Try to reach Wave 6
- **Expected:** Fail at Wave 5 or early Wave 6 due to overwhelming pressure
- **If pass:** Scaling not aggressive enough

### Test 5: Upgraded Player Wave 10
- **Setup:** Plasma Core Lv3, Rapid Fire Lv2, 2 attack chips
- **Action:** Full engagement with abilities
- **Expected:** Pass Wave 10 with effort
- **If fail easily:** Scaling too harsh
- **If trivial:** Upgrades too powerful

---

## ✅ Confirmation Required

### Approve Implementation?

- [ ] **Phase 1:** Enemy data consolidation
- [ ] **Phase 2:** Player stats correction
- [ ] **Phase 3:** Enemy spawn refactor
- [ ] **Phase 4:** Collision damage system with defense
- [ ] **Phase 5:** Wave configuration formulas
- [ ] **Phase 6:** Skill integration

### Value Adjustments Requested?

| Parameter | Proposed | Your Preference |
|-----------|----------|-----------------|
| Starting Damage | 25 | ___ |
| Starting Attack Speed | 1.0 | ___ |
| Starting Crit Rate | 10 | ___ |
| CIRCLE Base HP | 150 | ___ |
| CIRCLE Base Damage | 75 | ___ |
| Wave HP Scaling | +20%/wave | ___ |
| Wave Damage Scaling | +15%/wave | ___ |
| Defense Effectiveness | 1:1 flat reduction | ___ |

---

## 📜 Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-14 | 1.0 | Initial Wave 1 balancing document | AI Agent |
| 2026-01-14 | 2.0 | Complete system overhaul: enemy definitions, collision damage, defense integration, build requirements | AI Agent |

