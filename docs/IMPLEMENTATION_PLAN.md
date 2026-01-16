# Mission & Chip Progression System - Implementation Plan

> **Document Version:** 1.0  
> **Created:** January 16, 2026  
> **Status:** In Progress

---

## Overview

This document tracks the implementation of the Mission-Based Chip Progression System for Rogue Defense Protocol. Players will start with 0 chips and earn them through gameplay missions.

---

## Phase Summary

| Phase | Name | Status | Description |
|-------|------|--------|-------------|
| 1 | Foundation | ✅ Complete | Types, constants, storage updates |
| 2 | Reducer Logic | ✅ Complete | GameContext actions and progress hooks |
| 3 | UI Components | 🔄 In Progress | MissionsScreen and navigation |
| 4 | Auto-Check System | ⬜ Not Started | Automatic mission objective checking |
| 5 | Expanded Chip Roster | ⬜ Not Started | All 48 chips in constants |
| 6 | Polish & Testing | ⬜ Not Started | Edge cases, animations, testing |

---

## Phase 1: Foundation ✅ COMPLETE

### Tasks

- [x] **1.1** Add mission/achievement types to `types.ts`
  - MissionCategory, MissionStatus, ObjectiveType
  - Mission, MissionObjective, MissionReward interfaces
  - MissionState, AchievementState interfaces
  - ChipSlot interface with unlock tracking
  - New GameAction types (8 new actions)

- [x] **1.2** Create `constants/missions.ts`
  - TUTORIAL_MISSIONS (5 missions, waves 1-10)
  - COMBAT_MISSIONS (9 missions, kill-based)
  - SURVIVAL_MISSIONS (13 missions, wave milestones)
  - MASTERY_MISSIONS (7 missions, skill challenges)
  - EXPLORATION_MISSIONS (5 missions, weapon mastery)
  - DAILY_MISSION_POOL (6 templates)
  - WEEKLY_MISSION_POOL (4 templates)
  - Helper functions: getMissionById, getAvailableMissions, generateDailyMissions, etc.

- [x] **1.3** Create `constants/achievements.ts`
  - COMBAT_ACHIEVEMENTS (5 achievements)
  - PROGRESSION_ACHIEVEMENTS (4 achievements)
  - ECONOMY_ACHIEVEMENTS (3 achievements)
  - WEAPON_ACHIEVEMENTS (5 achievements)
  - COLLECTION_ACHIEVEMENTS (3 achievements)
  - CHALLENGE_ACHIEVEMENTS (4 achievements)
  - Helper functions: getAchievementById, checkAchievementTierReached, etc.

- [x] **1.4** Update `utils/storage.ts`
  - Bump version to v7
  - createInitialChipState() → 0 chips, 8 locked slots
  - createInitialMissionState() → tutorial missions available
  - createInitialAchievementState() → all at 0 progress
  - Add v6→v7 migration logic (preserves existing player progress)

### Files Modified
- `types.ts`
- `constants/missions.ts` (new)
- `constants/achievements.ts` (new)
- `utils/storage.ts`

---

## Phase 2: Reducer Logic ✅ COMPLETE

### Tasks

- [x] **2.1** Update chip reducers in `GameContext.tsx`
  - GRANT_CHIP - Awards a chip by ID
  - UNLOCK_CHIP_SLOT - Unlocks a slot (0-7)
  - Update EQUIP_CHIP for new ChipSlot structure
  - Update UNEQUIP_CHIP for new ChipSlot structure

- [x] **2.2** Add mission reducers
  - UPDATE_MISSION_PROGRESS - Increment objective progress
  - COMPLETE_MISSION - Mark mission complete
  - CLAIM_MISSION_REWARD - Process rewards (gold, gems, chips, slots, weapons, skins)
  - REFRESH_DAILY_MISSIONS - Generate new dailies
  - REFRESH_WEEKLY_MISSIONS - Generate new weeklies
  - CHECK_MISSION_UNLOCKS - Re-evaluate available missions

- [x] **2.3** Add achievement reducers
  - UPDATE_ACHIEVEMENT_PROGRESS - Update progress value
  - UNLOCK_ACHIEVEMENT_TIER - Unlock tier and grant reward

- [x] **2.4** Wire mission tracking into existing actions
  - START_BATTLE: Track weapon usage, reset per-battle stats
  - ENEMY_KILLED: Track kills, bosses, damage, crits, gold, kill streaks
  - ADVANCE_WAVE: Track waves completed, highest wave
  - END_BATTLE: Track battles completed, highest wave

### Files Modified
- `contexts/GameContext.tsx`

---

## Phase 3: UI Components 🔄 IN PROGRESS

### Tasks

- [ ] **3.1** Create `components/Screens/MissionsScreen.tsx`
  - Category tabs (Tutorial, Combat, Survival, etc.)
  - Mission cards with progress bars
  - Objective checklist display
  - Claim button for completed missions
  - Reward preview
  - Daily/Weekly mission section with timers

- [ ] **3.2** Update navigation
  - Add MISSIONS to `BottomNav.tsx`
  - Add MISSIONS to `Navigation.tsx` (desktop sidebar)

- [ ] **3.3** Update routing
  - Add MissionsScreen case to `App.tsx`
  - Export from `components/Screens/index.ts` (if exists)

- [ ] **3.4** Create mission notification badge
  - Show count of claimable missions
  - Animate when new mission available

### Files to Create/Modify
- `components/Screens/MissionsScreen.tsx` (new)
- `components/Layout/BottomNav.tsx`
- `components/Layout/Navigation.tsx`
- `App.tsx`

---

## Phase 4: Auto-Check System ⬜ NOT STARTED

### Tasks

- [ ] **4.1** Create mission checking utility
  - `utils/missionChecker.ts`
  - Function to check all active missions against current state
  - Return list of missions with updated progress

- [ ] **4.2** Hook auto-check into game actions
  - After ENEMY_KILLED: Check kill-based objectives
  - After ADVANCE_WAVE: Check wave/survival objectives
  - After END_BATTLE: Check battle completion objectives
  - After COLLECT_REWARDS: Check gold earning objectives

- [ ] **4.3** Add mission completion notifications
  - Toast/popup when mission completes
  - Sound effect (if audio system exists)

### Files to Create/Modify
- `utils/missionChecker.ts` (new)
- `contexts/GameContext.tsx`

---

## Phase 5: Expanded Chip Roster ⬜ NOT STARTED

### Tasks

- [ ] **5.1** Update `constants/chips.ts` with all 48 chips
  - 12 Attack chips
  - 12 Defense chips  
  - 12 Utility chips
  - 12 Special chips

- [ ] **5.2** Verify chip IDs match mission rewards
  - Cross-reference COMPLETE_CHIP_ROSTER.md
  - Ensure all reward chip IDs exist

- [ ] **5.3** Add chip icons/descriptions
  - Unique icons for each chip
  - Flavorful descriptions

- [ ] **5.4** Implement chip bonus application
  - Apply equipped chip bonuses in battle
  - Stack multiple chip effects correctly

### Files to Modify
- `constants/chips.ts`
- `components/Screens/BattleScreen.tsx` (for bonus application)

---

## Phase 6: Polish & Testing ⬜ NOT STARTED

### Tasks

- [ ] **6.1** Edge case handling
  - Handle missing chip definitions gracefully
  - Handle corrupted save data
  - Handle expired daily/weekly missions

- [ ] **6.2** UI animations
  - Mission complete celebration
  - Chip unlock animation
  - Slot unlock animation
  - Reward claim effects

- [ ] **6.3** Daily/Weekly mission refresh
  - Check on app load
  - Auto-refresh at midnight/weekly reset

- [ ] **6.4** Integration testing
  - New player flow: 0 chips → tutorial → first chip
  - Mission chain: Complete prerequisites → unlock next
  - Claim rewards → verify state updates
  - Existing player migration → verify progress preserved

- [ ] **6.5** Performance optimization
  - Memoize mission lists
  - Lazy load mission details
  - Optimize re-renders

### Files to Modify
- Various UI components
- `App.tsx` (refresh checks)
- `contexts/GameContext.tsx` (edge cases)

---

## Quick Reference

### Key File Locations

| File | Purpose |
|------|---------|
| `types.ts` | All TypeScript interfaces |
| `constants/missions.ts` | Mission definitions |
| `constants/achievements.ts` | Achievement definitions |
| `constants/chips.ts` | Chip definitions |
| `utils/storage.ts` | Save/load, initial state |
| `contexts/GameContext.tsx` | State management |
| `components/Screens/MissionsScreen.tsx` | Mission UI |

### Mission Categories

| Category | Count | Unlocks |
|----------|-------|---------|
| Tutorial | 5 | First chip slot + 3 chips |
| Combat | 9 | Kill-based chip rewards |
| Survival | 13 | Wave milestone rewards |
| Mastery | 7 | Skill-based rewards |
| Exploration | 5 | Weapon mastery rewards |
| Daily | 3/day | Gold, gems, small rewards |
| Weekly | 4/week | Rare chips, boosts |

### Chip Slot Unlocks

| Slot | Unlocked By |
|------|-------------|
| 1 | Tutorial Mission 2 (Circle Hunter) |
| 2 | Tutorial Mission 5 (Survivor I) |
| 3 | Survival: Expansion Protocol (Wave 15) |
| 4 | Survival: Endurance Test (Wave 25) |
| 5 | Survival: Veteran II (Wave 40) |
| 6 | Combat: Triple Threat (3 bosses in 1 battle) |
| 7 | Survival: Commander I (Wave 50) |
| 8 | Survival: Century (Wave 100) |

---

## Changelog

### 2026-01-16
- Initial document creation
- Phase 1 marked complete
- Phase 2 marked complete
- Phase 3 started

---

## Notes

- Existing players (v6 saves) get their chips preserved but migrated to new slot structure
- Tutorial missions auto-complete based on existing progress during migration
- All slot unlocks track which mission unlocked them for future analytics
