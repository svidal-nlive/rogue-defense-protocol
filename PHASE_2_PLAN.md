# Phase 2: Advanced Systems - Implementation Plan

## Scope Overview

Phase 2 introduces three complementary systems that add depth and replayability:

### 1. Wave Modifiers (Primary Feature)
Random modifiers that change enemy behavior/stats each wave

**Examples**:
- **Fortified**: +30% enemy HP
- **Swift**: +20% enemy speed
- **Swarm**: -30% enemy HP, -50% spawn interval (more small enemies)
- **Resilient**: Enemies take 20% reduced damage
- **Aggressive**: Enemies deal +50% collision damage
- **Regenerating**: Enemies heal 2 HP/second
- **Evasive**: Enemies move erratically (harder to hit)

**Implementation**:
- Store active modifier in BattleState
- Apply multipliers to wave config
- Display modifier name and icon in UI
- New random modifier each wave (or allow repeats)

### 2. Upgrade Synergies (Secondary Feature)
Bonus multipliers when certain upgrade combinations are active

**Examples**:
- **Shock Therapy**: Rapid Fire + Neural Accelerator chip = +20% crit chance
- **Fortress**: Defense skill + Base Armor skin = +15% defense multiplier
- **Overcharge**: Overclock ability + Rapid Fire Protocol boost = -1s cooldown
- **Vampire**: Scavenger skill + Wealth Accumulator chip = +10% gold per crit

**Implementation**:
- Detect upgrade combinations each battle
- Calculate synergy bonuses
- Display in UI (maybe tooltip or banner)
- Apply bonuses to relevant stats automatically

### 3. Enemy Behavior Variations (Tertiary Feature)
Different behavior patterns for enemies based on type/wave

**Patterns**:
- **Aggressive**: Rush directly to base (default)
- **Evasive**: Bounce around, harder to hit
- **Tanky**: Move slower but harder to damage
- **Swarmer**: Move fast in groups
- **Boss**: Unique special attacks

**Implementation**:
- Add behavior type to enemy object
- Modify movement/attack logic per behavior
- Select behavior based on wave/modifier
- Create visual tells for behavior type

### 4. Audio System (Polish Feature)
Sound effects and ambient audio

**Sounds**:
- Ability activation (pop, electric, healing sound)
- Enemy spawn, hit, death
- Wave transitions
- Priority target warning
- UI feedback (button clicks, notifications)

**Implementation**:
- Web Audio API or HTML5 <audio>
- Preload sounds on component mount
- Play on relevant events
- Volume control in settings

---

## Implementation Order

1. **Wave Modifiers** (High Priority)
   - Core game loop variation
   - Visible/clear feedback
   - Directly impacts gameplay

2. **Enemy Behavior Variations** (Medium Priority)
   - Visual depth
   - Gameplay variety
   - Depends on: modifiers (optional), enemy spawning

3. **Upgrade Synergies** (Medium Priority)
   - Rewards player planning
   - Non-critical to gameplay loop
   - Depends on: current upgrade system

4. **Audio** (Low Priority)
   - Polish/juice
   - Non-critical
   - Can add anytime

---

## Technical Decisions

### Wave Modifiers Storage
```typescript
// In BattleState
waveModifier: {
  id: string;
  name: string;
  description: string;
  icon: string;
  multipliers: {
    enemyHp?: number;
    enemySpeed?: number;
    spawnInterval?: number;
    damage?: number;
    difficulty?: number;
  };
}
```

### Synergy System
```typescript
// In GameState or new file
activeSynergies: Array<{
  id: string;
  name: string;
  condition: () => boolean;
  bonus: { attackSpeed?: number; gold?: number; ... }
}>
```

### Enemy Behavior
```typescript
// Add to enemy object in BattleScreen
behavior: 'aggressive' | 'evasive' | 'tanky' | 'swarmer';
```

### Audio
```typescript
// New audio manager
const sounds = {
  ability_q: new Audio('...')
  ability_w: new Audio('...')
  ...
};
```

---

## Implementation Steps

### Phase 2.1: Wave Modifiers
1. Define modifier types in constants
2. Create modifier selection function
3. Apply modifiers to wave config
4. Display in UI (wave header)
5. Test with multiple modifiers

### Phase 2.2: Enemy Behavior
1. Add behavior property to enemy type
2. Implement behavior logic (evasive movement, etc.)
3. Select behavior based on wave/modifier
4. Test behavior variety

### Phase 2.3: Upgrade Synergies
1. Define synergy list
2. Create synergy detection function
3. Calculate bonuses
4. Display in UI (tooltip/banner)
5. Apply bonuses to relevant stats

### Phase 2.4: Audio
1. Create audio manager
2. Add sound effects
3. Integrate with game events
4. Volume control

---

## Estimated Effort

- **Wave Modifiers**: 2-3 hours
- **Enemy Behaviors**: 2-3 hours
- **Upgrade Synergies**: 1-2 hours
- **Audio**: 1-2 hours
- **Total**: ~6-10 hours for full Phase 2

---

## Success Criteria

- [x] Wave modifiers apply correctly to enemies
- [x] 5+ different modifier types implemented
- [x] Each modifier has unique visual/mechanical impact
- [x] Enemy behaviors vary and affect gameplay
- [x] Synergies grant meaningful bonuses
- [x] Audio enhances gameplay without being annoying
- [x] Build verifies (0 errors)
- [x] All features documented

