# Feature Enhancement: Mission & Chip Progression System

## Quick Summary

This enhancement package transforms **Rogue Defense Protocol** from giving players 6 starter chips at game start to a fully mission-driven progression system where every chip and slot is earned through gameplay.

---

## What Changes

### Before (Current)
- Player starts with **6 chips** already equipped
- Player starts with **6 slots** already unlocked  
- No clear progression goals beyond surviving waves
- Chips feel less meaningful (always had them)

### After (New System)
- Player starts with **0 chips** and **0 slots**
- **Tutorial missions** guide first 10 waves
- **48 unique chips** to unlock across 4 categories
- **8 slots** unlocked through wave milestones
- **Missions, achievements, daily & weekly challenges**
- Clear goals at every stage of the game

---

## Documentation Files

| Document | Purpose |
|----------|---------|
| [MISSION_CHIP_PROGRESSION_SYSTEM.md](./MISSION_CHIP_PROGRESSION_SYSTEM.md) | Full design document with system overview, wave structure, mission types, and implementation roadmap |
| [MISSION_SYSTEM_TECH_SPEC.md](./MISSION_SYSTEM_TECH_SPEC.md) | Technical specification with TypeScript types, reducer actions, and integration code |
| [COMPLETE_CHIP_ROSTER.md](./COMPLETE_CHIP_ROSTER.md) | Full roster of 48 chips with stats, unlock methods, and implementation notes |

---

## Key Features

### 1. Mission-Based Progression

```
Wave 1-10: Tutorial Phase
├── First Blood → 50 Gold
├── Circle Hunter → Plasma Core + Slot 1
├── Boss Slayer → Nano Plating  
├── Experiment → Precision Optics
└── Survivor I → Slot 2 + 200 Gold

Wave 11-30: Early Game
├── Tank Buster → Fury Driver (RARE)
├── Expansion Protocol → Slot 3 + 100 Gems
├── Swarm Crusher → Reactive Armor (RARE)
└── Veteran I → Berserker Module (EPIC)

Wave 31-50: Mid Game
├── Elite Hunter → Fortress Protocol (EPIC)
├── Veteran II → Slot 5
├── Perfect Wave → Overdrive System (EPIC)
└── Commander I → Slot 6 + Legendary Choice

Wave 51-100: Late Game
├── Commander II → Annihilator Core (LEGENDARY)
├── Commander III → Titan Core (LEGENDARY)
├── Elite Commander → Slot 7
├── Master Defender → Quantum Core (LEGENDARY)
└── Century → Slot 8 + Exclusive Rewards
```

### 2. Expanded Chip Roster (48 Chips)

| Category | Common | Rare | Epic | Legendary | Total |
|----------|--------|------|------|-----------|-------|
| ATTACK | 3 | 3 | 3 | 3 | **12** |
| DEFENSE | 3 | 3 | 3 | 3 | **12** |
| UTILITY | 3 | 4 | 4 | 5 | **16** |
| SPECIAL | - | 2 | 3 | 3 | **8** |
| **Total** | **9** | **12** | **13** | **14** | **48** |

### 3. Mission Categories

- **Tutorial**: Guide new players (5 missions)
- **Combat**: Kill-based objectives (15+ missions)
- **Survival**: Wave milestones (15+ missions)
- **Mastery**: Skill challenges (10+ missions)
- **Exploration**: Weapon mastery (5 missions)
- **Daily**: 3 rotating missions/day
- **Weekly**: 3 longer-term goals/week

### 4. Achievement System

- 30+ achievements across 5 categories
- Tiered rewards (Bronze → Silver → Gold → Platinum)
- Hidden achievements for secret discoveries
- Permanent progression tracking

---

## New Game State Structure

```typescript
interface GameState {
  // ... existing fields ...
  
  // Updated chip state (start empty)
  chipState: {
    ownedChips: OwnedChip[];  // Start: []
    slots: ChipSlot[];         // Start: 8 slots, all locked
    totalSlotsUnlocked: number; // Start: 0
  };
  
  // NEW: Mission tracking
  missionState: {
    activeMissions: Mission[];
    completedMissions: string[];
    dailyMissions: Mission[];
    weeklyMissions: Mission[];
    dailyMissionsRefreshedAt: number;
    weeklyMissionsRefreshedAt: number;
    totalMissionsCompleted: number;
  };
  
  // NEW: Achievement tracking
  achievementState: {
    progress: Record<string, AchievementProgress>;
    totalUnlocked: number;
  };
}
```

---

## Implementation Priority

### Phase 1: Core Mission System (High Priority)
- [ ] Add mission types to `types.ts`
- [ ] Create `constants/missions.ts` with all mission definitions
- [ ] Modify `createInitialGameState()` to start with 0 chips/slots
- [ ] Add mission reducer actions
- [ ] Create Missions Screen UI

### Phase 2: Mission Progress Tracking (High Priority)
- [ ] Hook `ENEMY_KILLED` for kill tracking
- [ ] Hook `ADVANCE_WAVE` for wave tracking
- [ ] Hook `END_BATTLE` for battle tracking
- [ ] Hook `COLLECT_REWARDS` for gold/gem tracking
- [ ] Add mission completion notifications

### Phase 3: Expanded Chip Roster (Medium Priority)
- [ ] Add all 48 chips to `constants/chips.ts`
- [ ] Add new bonus types to `ChipBonus` interface
- [ ] Implement special chip mechanics in battle

### Phase 4: Achievement System (Medium Priority)
- [ ] Add achievement types to `types.ts`
- [ ] Create `constants/achievements.ts`
- [ ] Add achievement UI components
- [ ] Implement achievement popups

### Phase 5: Daily/Weekly Challenges (Lower Priority)
- [ ] Add time-based mission refresh logic
- [ ] Create daily/weekly mission UI on HomeScreen
- [ ] Implement streak bonuses

---

## Player Experience Flow

```
NEW PLAYER
    │
    ▼
┌─────────────────────────────────────────────┐
│ First Battle - No chips, no slots           │
│ Very challenging! Must learn mechanics      │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│ Wave 3 - First chip unlocked!               │
│ "Circle Hunter" complete → Plasma Core      │
│ Player feels REWARDED                       │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│ Wave 5-10 - Tutorial phase complete         │
│ 3 chips, 2 slots equipped                   │
│ Player understands the loop                 │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│ Wave 11-30 - Early game progression         │
│ Rare chips start dropping                   │
│ Player building their loadout               │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│ Wave 31-50 - Mid game mastery               │
│ Epic chips become available                 │
│ Player experimenting with builds            │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│ Wave 51+ - End game content                 │
│ Legendary chips as ultimate goals           │
│ 100% completion for dedicated players       │
└─────────────────────────────────────────────┘
```

---

## Benefits

1. **Better Onboarding**: Tutorial missions teach game mechanics
2. **Clear Goals**: Always something to work toward
3. **Meaningful Rewards**: Chips feel special when earned
4. **Replayability**: Daily/weekly challenges + achievements
5. **Depth**: 48 chips with unique effects create build variety
6. **Progression**: 8-slot unlock creates long-term goals
7. **Engagement**: Mission notifications keep players motivated

---

## Questions to Consider

Before implementation, discuss these design decisions:

1. **Difficulty Curve**: Is starting with 0 chips too hard? Consider giving 1 basic chip at start.

2. **Slot Unlock Speed**: Should slots unlock faster in early game?

3. **Daily Mission Rewards**: Are the rewards balanced for the time investment?

4. **Special Chip Effects**: Which special chips are highest priority to implement?

5. **UI Placement**: Where should the Missions screen be in navigation?

6. **Storage Migration**: How to handle existing players' saved games?

---

## Next Steps

1. Review this design documentation
2. Discuss any changes or additions
3. Prioritize which phases to implement first
4. Begin with Phase 1: Core Mission System
5. Iterate based on playtesting feedback
