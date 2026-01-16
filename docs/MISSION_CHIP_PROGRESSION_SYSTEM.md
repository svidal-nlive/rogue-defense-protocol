# Mission & Chip Progression System Design Document

## Overview

This document outlines a comprehensive mission-based progression system for **Rogue Defense Protocol**. The goal is to transform the game from giving players 6 starter chips to an engaging unlock experience where chips and other rewards are earned through missions, achievements, and wave milestones.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Mission System Architecture](#mission-system-architecture)
3. [Wave-Mission Structure](#wave-mission-structure)
4. [Complete Chip Roster](#complete-chip-roster)
5. [Mission Types & Rewards](#mission-types--rewards)
6. [Unlock Progression Flow](#unlock-progression-flow)
7. [Achievement System](#achievement-system)
8. [Daily & Weekly Challenges](#daily--weekly-challenges)
9. [Implementation Roadmap](#implementation-roadmap)

---

## Current State Analysis

### What We Have Now

**Starter Chips (Given at Game Start):**
| Chip ID | Name | Rarity | Level | Type |
|---------|------|--------|-------|------|
| `atk_plasma_core` | Plasma Core | COMMON | 2 | ATTACK |
| `def_nano_plating` | Nano Plating | COMMON | 4 | DEFENSE |
| `util_precision_optics` | Precision Optics | COMMON | 1 | UTILITY |
| `atk_fury_driver` | Fury Driver | RARE | 1 | ATTACK |
| `util_velocity_boost` | Velocity Boost | RARE | 3 | UTILITY |
| `def_reactive_armor` | Reactive Armor | RARE | 1 | DEFENSE |

**Current Chip Roster (16 chips):**
- 4 Attack chips (1 each rarity)
- 4 Defense chips (1 each rarity)
- 8 Utility chips (varied rarities)

### Problem Statement

Players start with fully equipped chips, removing the sense of progression and discovery. The game needs:
- **Early game challenge** (no chips = harder start)
- **Clear progression goals** (unlock X for doing Y)
- **Meaningful rewards** (chips that change playstyle)
- **Replayability** (missions to complete each run)

---

## Mission System Architecture

### Core Concepts

```typescript
// New Types for Mission System
type MissionCategory = 
  | 'TUTORIAL'      // First-time player guidance
  | 'COMBAT'        // Kill-based objectives
  | 'SURVIVAL'      // Wave/time survival goals
  | 'MASTERY'       // Skill-based challenges
  | 'EXPLORATION'   // Try different weapons/strategies
  | 'DAILY'         // Rotating daily challenges
  | 'WEEKLY'        // Longer-term goals
  | 'MILESTONE';    // Permanent progression

type MissionStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';

interface Mission {
  id: string;
  name: string;
  description: string;
  category: MissionCategory;
  objectives: MissionObjective[];
  rewards: MissionReward[];
  prerequisites?: string[];     // Mission IDs that must be completed first
  unlockWave?: number;          // Wave that must be reached to unlock
  repeatable: boolean;
  expiresAt?: number;           // For daily/weekly missions
  progress?: MissionProgress;
}

interface MissionObjective {
  id: string;
  type: ObjectiveType;
  target: number;
  current: number;
  description: string;
}

type ObjectiveType = 
  | 'KILL_ENEMIES'
  | 'KILL_ENEMY_TYPE'
  | 'REACH_WAVE'
  | 'SURVIVE_WAVES'
  | 'DEAL_DAMAGE'
  | 'DEAL_CRIT_DAMAGE'
  | 'EARN_GOLD'
  | 'USE_WEAPON'
  | 'COMPLETE_BATTLE'
  | 'NO_DAMAGE_WAVE'
  | 'KILL_STREAK'
  | 'BOSS_KILLS';

interface MissionReward {
  type: 'CHIP' | 'GOLD' | 'GEMS' | 'CHIP_SLOT' | 'WEAPON' | 'SKIN' | 'BOOST';
  id?: string;        // For specific items
  amount?: number;    // For currency
  rarity?: ChipRarity; // For random chip rewards
}
```

### State Integration

```typescript
// Add to GameState
interface MissionState {
  missions: Mission[];
  completedMissions: string[];
  dailyMissionsRefreshedAt: number;
  weeklyMissionsRefreshedAt: number;
  totalMissionsCompleted: number;
  chipSlotsUnlocked: number;  // Start with 0-2, unlock up to 8
}
```

---

## Wave-Mission Structure

### Tier 1: Tutorial Phase (Waves 1-10)

The first 10 waves serve as an extended tutorial where players learn mechanics and earn their first chips.

| Wave | Event | Mission Unlocked | Reward |
|------|-------|------------------|--------|
| 1 | Game Start | "First Blood" | 50 Gold |
| 3 | Enemy variety | "Circle Hunter" | **Plasma Core** (COMMON ATK) |
| 5 | First Boss | "Boss Slayer I" | **Nano Plating** (COMMON DEF) + 1st Chip Slot |
| 7 | Weapon tutorial | "Experiment" | **Precision Optics** (COMMON UTIL) |
| 10 | Checkpoint! | "Survivor I" | **2nd Chip Slot** + 200 Gold |

### Tier 2: Early Game (Waves 11-30)

Players establish their loadout and encounter new enemy types.

| Wave | Event | Mission Available | Possible Rewards |
|------|-------|-------------------|------------------|
| 12 | Tank enemies appear | "Tank Buster" | **Fury Driver** (RARE ATK) |
| 15 | Second boss tier | "Boss Slayer II" | **3rd Chip Slot** + 100 Gems |
| 18 | Swarm enemies | "Swarm Crusher" | **Reactive Armor** (RARE DEF) |
| 20 | Checkpoint! | "Survivor II" | **Velocity Boost** (RARE UTIL) |
| 25 | Boss rush teaser | "Triple Threat" | **4th Chip Slot** |
| 30 | Checkpoint! | "Veteran I" | **Berserker Module** (EPIC ATK) |

### Tier 3: Mid Game (Waves 31-50)

Difficulty ramps up; epic chips become available.

| Wave | Event | Mission Available | Possible Rewards |
|------|-------|-------------------|------------------|
| 35 | Elite enemies | "Elite Hunter" | **Fortress Protocol** (EPIC DEF) |
| 40 | Checkpoint! | "Veteran II" | **5th Chip Slot** |
| 45 | Legendary teaser | "Perfect Wave" | **Overdrive System** (EPIC UTIL) |
| 50 | Checkpoint! | "Commander I" | **6th Chip Slot** + Legendary Chip Choice |

### Tier 4: Late Game (Waves 51-100)

Legendary chips and mastery challenges.

| Wave | Event | Mission Available | Possible Rewards |
|------|-------|-------------------|------------------|
| 60 | Checkpoint! | "Commander II" | **Annihilator Core** (LEGENDARY ATK) |
| 70 | Checkpoint! | "Commander III" | **Titan Core** (LEGENDARY DEF) |
| 80 | Checkpoint! | "Elite Commander" | **7th Chip Slot** |
| 90 | Checkpoint! | "Master Defender" | **Quantum Core** (LEGENDARY UTIL) |
| 100 | Ultimate! | "Century" | **8th Chip Slot** + Exclusive Skin |

---

## Complete Chip Roster

### Expanded Chip Categories

We're expanding from 16 chips to **40+ chips** across multiple categories.

---

### 🔥 ATTACK CHIPS (12 Total)

| ID | Name | Rarity | Base Bonus | Unlock Method |
|----|------|--------|------------|---------------|
| `atk_plasma_core` | Plasma Core | COMMON | +5 damage | Mission: "Circle Hunter" (Wave 3) |
| `atk_spark_plug` | Spark Plug | COMMON | +3 damage, +1% crit | Kill 50 enemies |
| `atk_voltage_spike` | Voltage Spike | COMMON | +4 damage, +2% attack speed | Complete 3 battles |
| `atk_fury_driver` | Fury Driver | RARE | +8 damage, +5% dmg | Mission: "Tank Buster" (Wave 12) |
| `atk_razor_edge` | Razor Edge | RARE | +6 damage, +3% crit, +10% crit dmg | Kill 500 enemies |
| `atk_inferno_core` | Inferno Core | RARE | +10 damage, +5% splash | Defeat 10 bosses |
| `atk_berserker_module` | Berserker Module | EPIC | +12 damage, +8% dmg, +10% crit dmg | Mission: "Veteran I" (Wave 30) |
| `atk_assassin_protocol` | Assassin Protocol | EPIC | +8 damage, +8% crit, +25% crit dmg | Kill 100 enemies in 1 wave |
| `atk_devastator` | Devastator Chip | EPIC | +15 damage, +10% dmg, +5% splash | Reach Wave 40 |
| `atk_annihilator` | Annihilator Core | LEGENDARY | +20 damage, +12% dmg, +5% crit, +20% crit dmg | Mission: "Commander II" (Wave 60) |
| `atk_omega_strike` | Omega Strike | LEGENDARY | +25 damage, +15% dmg, +10% crit | Deal 1,000,000 total damage |
| `atk_godslayer` | Godslayer Module | LEGENDARY | +30 damage, +20% boss damage | Kill 100 bosses |

---

### 🛡️ DEFENSE CHIPS (12 Total)

| ID | Name | Rarity | Base Bonus | Unlock Method |
|----|------|--------|------------|---------------|
| `def_nano_plating` | Nano Plating | COMMON | +100 HP | Mission: "Boss Slayer I" (Wave 5) |
| `def_barrier_node` | Barrier Node | COMMON | +80 HP, +2 defense | Survive 10 waves |
| `def_regen_pulse` | Regen Pulse | COMMON | +50 HP, +1% HP regen | Take 5000 damage total |
| `def_reactive_armor` | Reactive Armor | RARE | +150 HP, +3 defense | Mission: "Swarm Crusher" (Wave 18) |
| `def_absorption_matrix` | Absorption Matrix | RARE | +120 HP, +5 defense | Block 1000 damage |
| `def_guardian_shell` | Guardian Shell | RARE | +100 HP, +4 defense, +3% dodge | Survive wave 25 |
| `def_fortress_protocol` | Fortress Protocol | EPIC | +250 HP, +5% HP, +5 defense | Mission: "Elite Hunter" (Wave 35) |
| `def_immortal_frame` | Immortal Frame | EPIC | +200 HP, +8% HP, +8 defense | Survive 50 waves in a single run |
| `def_void_barrier` | Void Barrier | EPIC | +180 HP, +10 defense, +5% dodge | Complete wave with <10% HP |
| `def_titan_core` | Titan Core | LEGENDARY | +500 HP, +10% HP, +10 defense | Mission: "Commander III" (Wave 70) |
| `def_eternal_guard` | Eternal Guard | LEGENDARY | +400 HP, +15% HP, +15 defense | Survive wave 80 |
| `def_phoenix_core` | Phoenix Core | LEGENDARY | +300 HP, +1 revive per battle | Die and continue 10 times |

---

### ⚡ UTILITY CHIPS (16 Total)

| ID | Name | Rarity | Base Bonus | Unlock Method |
|----|------|--------|------------|---------------|
| `util_precision_optics` | Precision Optics | COMMON | +2% crit rate | Mission: "Experiment" (Wave 7) |
| `util_coin_magnet` | Coin Magnet | COMMON | +5% gold bonus | Earn 1000 gold total |
| `util_quick_loader` | Quick Loader | COMMON | +3% attack speed | Fire 500 projectiles |
| `util_velocity_boost` | Velocity Boost | RARE | +5% attack speed, +2% crit | Mission: "Survivor II" (Wave 20) |
| `util_scavenger_node` | Scavenger Node | RARE | +10% gold bonus | Earn 10,000 gold total |
| `util_lucky_charm` | Lucky Charm | RARE | +3% gem drop rate | Find 50 gems |
| `util_energy_cell` | Energy Cell | RARE | +10 max energy | Use 100 energy |
| `util_overdrive_system` | Overdrive System | EPIC | +8% attack speed, +3% crit, +15% crit dmg | Mission: "Perfect Wave" (Wave 45) |
| `util_treasure_hunter` | Treasure Hunter | EPIC | +20% gold, +5% gem chance | Earn 50,000 gold total |
| `util_hypercharge` | Hypercharge Node | EPIC | +12% attack speed, +5 energy | Use abilities 100 times |
| `util_synergy_core` | Synergy Core | EPIC | All bonuses +10% effective | Equip 6 chips at once |
| `util_quantum_core` | Quantum Core | LEGENDARY | +12% attack speed, +5% crit, +25% crit dmg, +15% gold, +10 energy | Mission: "Master Defender" (Wave 90) |
| `util_infinity_loop` | Infinity Loop | LEGENDARY | Cooldowns -20% | Use each ability 50 times |
| `util_jackpot_module` | Jackpot Module | LEGENDARY | +50% gold, +10% gem chance | Earn 500,000 gold total |
| `util_omnichip` | Omnichip | LEGENDARY | +5% to ALL stats | Complete all missions |
| `util_chaos_engine` | Chaos Engine | LEGENDARY | Random bonus (rerolls each battle) | Win 100 battles |

---

### 🎯 SPECIAL CHIPS (New Category - 8 Total)

Unique chips with special mechanics.

| ID | Name | Rarity | Effect | Unlock Method |
|----|------|--------|--------|---------------|
| `spec_chain_lightning` | Chain Lightning | RARE | 15% chance: damage chains to nearby | Kill 3+ enemies in 1 second |
| `spec_frozen_core` | Frozen Core | RARE | 10% chance: freeze enemy 1s | Use Cryo weapon 50 times |
| `spec_vampiric_shard` | Vampiric Shard | EPIC | 5% lifesteal on damage | Heal 5000 HP total |
| `spec_mirror_shield` | Mirror Shield | EPIC | Reflect 10% damage taken | Block 500 damage |
| `spec_time_dilation` | Time Dilation | EPIC | 5% chance: slow all enemies 2s | Slow 200 enemies |
| `spec_nuclear_core` | Nuclear Core | LEGENDARY | Enemies explode on death (10% HP AoE) | Kill 50 enemies with explosions |
| `spec_gravity_well` | Gravity Well | LEGENDARY | Pull enemies toward base slowly | Kill 1000 enemies near base |
| `spec_ascension` | Ascension Protocol | LEGENDARY | +2% all stats per wave survived | Reach wave 100 |

---

## Mission Types & Rewards

### Tutorial Missions (Always Available First)

```typescript
const TUTORIAL_MISSIONS: Mission[] = [
  {
    id: 'mission_first_blood',
    name: 'First Blood',
    description: 'Eliminate your first enemy threat.',
    category: 'TUTORIAL',
    objectives: [{
      id: 'kill_1',
      type: 'KILL_ENEMIES',
      target: 1,
      current: 0,
      description: 'Kill 1 enemy'
    }],
    rewards: [{ type: 'GOLD', amount: 50 }],
    repeatable: false
  },
  {
    id: 'mission_circle_hunter',
    name: 'Circle Hunter',
    description: 'The basic drones are your primary target.',
    category: 'TUTORIAL',
    prerequisites: ['mission_first_blood'],
    objectives: [{
      id: 'kill_circles',
      type: 'KILL_ENEMY_TYPE',
      target: 10,
      current: 0,
      description: 'Kill 10 Circle enemies'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_plasma_core' }],
    repeatable: false
  },
  // ... more tutorial missions
];
```

### Combat Missions

| Mission | Objective | Reward |
|---------|-----------|--------|
| Circle Destroyer | Kill 100 Circle enemies | Spark Plug (COMMON ATK) |
| Square Smasher | Kill 50 Square enemies | Barrier Node (COMMON DEF) |
| Triangle Terror | Kill 75 Triangle enemies | Quick Loader (COMMON UTIL) |
| Swarm Annihilator | Kill 200 Swarm enemies | Coin Magnet (COMMON UTIL) |
| Tank Demolisher | Kill 25 Tank enemies | Razor Edge (RARE ATK) |
| Boss Executioner I | Defeat 5 Bosses | Inferno Core (RARE ATK) |
| Boss Executioner II | Defeat 25 Bosses | Assassin Protocol (EPIC ATK) |
| Boss Executioner III | Defeat 100 Bosses | Godslayer Module (LEGENDARY ATK) |

### Survival Missions

| Mission | Objective | Reward |
|---------|-----------|--------|
| Survivor I | Reach Wave 10 | 2nd Chip Slot |
| Survivor II | Reach Wave 20 | Velocity Boost (RARE UTIL) |
| Survivor III | Reach Wave 30 | Berserker Module (EPIC ATK) |
| Endurance I | Survive 25 waves in one battle | Fortress Protocol (EPIC DEF) |
| Endurance II | Survive 50 waves in one battle | Immortal Frame (EPIC DEF) |
| Endurance III | Survive 75 waves in one battle | Eternal Guard (LEGENDARY DEF) |
| Century | Reach Wave 100 | 8th Chip Slot + Century Badge |

### Mastery Missions

| Mission | Objective | Reward |
|---------|-----------|--------|
| Critical Master | Land 500 critical hits | Lucky Charm (RARE UTIL) |
| Damage Dealer I | Deal 100,000 total damage | Devastator (EPIC ATK) |
| Damage Dealer II | Deal 1,000,000 total damage | Omega Strike (LEGENDARY ATK) |
| Untouchable | Complete a wave without taking damage | Void Barrier (EPIC DEF) |
| Perfect Run | Complete waves 1-10 without damage | Synergy Core (EPIC UTIL) |
| Speedrunner | Kill 50 enemies in under 60 seconds | Hypercharge Node (EPIC UTIL) |
| Kill Streak | Kill 25 enemies in 10 seconds | Chain Lightning (RARE SPEC) |

### Exploration Missions (Weapon-Based)

| Mission | Objective | Reward |
|---------|-----------|--------|
| Blaster Expert | Kill 500 enemies with Blaster | Energy Cell (RARE UTIL) |
| Missile Master | Kill 300 enemies with Missiles | Frozen Core (RARE SPEC) |
| Laser Legend | Kill 400 enemies with Laser | Vampiric Shard (EPIC SPEC) |
| Cryo Champion | Kill 200 enemies with Cryo | Time Dilation (EPIC SPEC) |
| Weapon Master | Complete a battle with each weapon | Omnichip (LEGENDARY UTIL) |

---

## Unlock Progression Flow

### Visual Progression Path

```
START (0 chips, 0 slots)
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  TUTORIAL PHASE (Waves 1-10)                                │
│                                                             │
│  Wave 3: 🔓 Plasma Core (ATK) + 1st Slot                   │
│  Wave 5: 🔓 Nano Plating (DEF)                             │
│  Wave 7: 🔓 Precision Optics (UTIL)                        │
│  Wave 10: 🔓 2nd Slot + 200 Gold                           │
│                                                             │
│  Exit: 3 chips, 2 slots                                    │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  EARLY GAME (Waves 11-30)                                   │
│                                                             │
│  Wave 12: 🔓 Fury Driver (RARE ATK)                        │
│  Wave 15: 🔓 3rd Slot + 100 Gems                           │
│  Wave 18: 🔓 Reactive Armor (RARE DEF)                     │
│  Wave 20: 🔓 Velocity Boost (RARE UTIL)                    │
│  Wave 25: 🔓 4th Slot                                      │
│  Wave 30: 🔓 Berserker Module (EPIC ATK)                   │
│                                                             │
│  Exit: 6 chips, 4 slots                                    │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  MID GAME (Waves 31-50)                                     │
│                                                             │
│  Wave 35: 🔓 Fortress Protocol (EPIC DEF)                  │
│  Wave 40: 🔓 5th Slot                                      │
│  Wave 45: 🔓 Overdrive System (EPIC UTIL)                  │
│  Wave 50: 🔓 6th Slot + Legendary Choice                   │
│                                                             │
│  Exit: 9 chips, 6 slots                                    │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  LATE GAME (Waves 51-100)                                   │
│                                                             │
│  Wave 60: 🔓 Annihilator Core (LEGENDARY ATK)              │
│  Wave 70: 🔓 Titan Core (LEGENDARY DEF)                    │
│  Wave 80: 🔓 7th Slot                                      │
│  Wave 90: 🔓 Quantum Core (LEGENDARY UTIL)                 │
│  Wave 100: 🔓 8th Slot + Exclusive Rewards                 │
│                                                             │
│  Exit: 12+ chips, 8 slots                                  │
└─────────────────────────────────────────────────────────────┘
```

### Slot Unlock Requirements

| Slot # | Unlock Requirement | Mission |
|--------|-------------------|---------|
| 1 | Complete "Circle Hunter" | Wave 3 mission |
| 2 | Complete "Survivor I" | Reach Wave 10 |
| 3 | Complete "Boss Slayer II" | Reach Wave 15 |
| 4 | Complete "Triple Threat" | Defeat 3 bosses in one battle |
| 5 | Complete "Veteran II" | Reach Wave 40 |
| 6 | Complete "Commander I" | Reach Wave 50 |
| 7 | Complete "Elite Commander" | Reach Wave 80 |
| 8 | Complete "Century" | Reach Wave 100 |

---

## Achievement System

### Achievement Categories

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tiers: AchievementTier[];
  hidden?: boolean;
}

type AchievementCategory = 
  | 'COMBAT'
  | 'PROGRESSION'
  | 'COLLECTION'
  | 'MASTERY'
  | 'SECRET';

interface AchievementTier {
  tier: number;  // Bronze, Silver, Gold, Platinum
  requirement: number;
  reward: MissionReward;
}
```

### Achievement List

#### Combat Achievements

| Achievement | Tiers | Rewards |
|-------------|-------|---------|
| **Enemy Slayer** | 100 / 1K / 10K / 100K kills | Gold: 50 → 500 → 5K → 50K |
| **Boss Hunter** | 5 / 25 / 100 / 500 bosses | Chips + Gems |
| **Critical Striker** | 50 / 500 / 5K / 50K crits | Crit-focused chips |
| **Damage Master** | 10K / 100K / 1M / 10M damage | Attack chips |
| **Combo King** | 10 / 25 / 50 / 100 kill streak | Special chips |

#### Progression Achievements

| Achievement | Tiers | Rewards |
|-------------|-------|---------|
| **Wave Climber** | Wave 10 / 25 / 50 / 100 | Chip slots + chips |
| **Battle Veteran** | 10 / 50 / 200 / 1000 battles | Utility chips |
| **Checkpoint Master** | 1 / 5 / 10 / 20 checkpoints | Defense chips |
| **Gold Hoarder** | 1K / 10K / 100K / 1M gold | Gold bonus chips |
| **Gem Collector** | 10 / 100 / 500 / 2000 gems | Rare+ chips |

#### Collection Achievements

| Achievement | Tiers | Rewards |
|-------------|-------|---------|
| **Chip Collector** | 5 / 15 / 30 / 48 chips | Exclusive chips |
| **Rarity Hunter** | 1 / 5 / 10 of each rarity | Legendary chips |
| **Skill Master** | 5 / 15 / 30 / all skills maxed | Synergy Core |
| **Weapon Arsenal** | 2 / 3 / 4 weapons unlocked | Weapon skins |
| **Full Loadout** | 4 / 6 / 8 slots filled | Omnichip |

#### Secret Achievements (Hidden until unlocked)

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| **Glass Cannon** | Win battle with 1 HP remaining | Phoenix Core |
| **Speed Demon** | Clear wave in under 30 seconds | Chaos Engine |
| **Untouchable** | Wave 1-20 no damage | Ascension Protocol |
| **The One** | Kill 1000 enemies in single battle | Nuclear Core |
| **Completionist** | 100% all missions + achievements | Exclusive Title + Skin |

---

## Daily & Weekly Challenges

### Daily Missions (Reset at midnight UTC)

```typescript
const DAILY_MISSION_POOL: Mission[] = [
  {
    id: 'daily_kill_50',
    name: 'Daily Patrol',
    description: 'Eliminate 50 enemies today.',
    category: 'DAILY',
    objectives: [{ type: 'KILL_ENEMIES', target: 50 }],
    rewards: [{ type: 'GOLD', amount: 100 }],
    repeatable: false
  },
  {
    id: 'daily_boss_3',
    name: 'Boss Bounty',
    description: 'Defeat 3 bosses today.',
    category: 'DAILY',
    objectives: [{ type: 'BOSS_KILLS', target: 3 }],
    rewards: [{ type: 'GEMS', amount: 10 }],
    repeatable: false
  },
  {
    id: 'daily_crit_25',
    name: 'Precision Day',
    description: 'Land 25 critical hits.',
    category: 'DAILY',
    objectives: [{ type: 'DEAL_CRIT_DAMAGE', target: 25 }],
    rewards: [{ type: 'GOLD', amount: 75 }],
    repeatable: false
  },
  // Pool of 20+ dailies, 3 selected each day
];
```

**Daily Reward Structure:**
- Complete 1 daily: 100 Gold
- Complete 2 dailies: +50 Gems
- Complete 3 dailies (all): +Random Chip Fragment

### Weekly Missions (Reset on Monday)

```typescript
const WEEKLY_MISSIONS: Mission[] = [
  {
    id: 'weekly_kills',
    name: 'Weekly Purge',
    description: 'Eliminate 1000 enemies this week.',
    category: 'WEEKLY',
    objectives: [{ type: 'KILL_ENEMIES', target: 1000 }],
    rewards: [{ type: 'CHIP', rarity: 'RARE' }],  // Random rare chip
    repeatable: true
  },
  {
    id: 'weekly_waves',
    name: 'Wave Warrior',
    description: 'Survive 100 total waves this week.',
    category: 'WEEKLY',
    objectives: [{ type: 'SURVIVE_WAVES', target: 100 }],
    rewards: [{ type: 'GEMS', amount: 50 }],
    repeatable: true
  },
  {
    id: 'weekly_gold',
    name: 'Fortune Seeker',
    description: 'Earn 10,000 gold this week.',
    category: 'WEEKLY',
    objectives: [{ type: 'EARN_GOLD', target: 10000 }],
    rewards: [{ type: 'BOOST', id: 'boost_gold_x2' }],
    repeatable: true
  },
];
```

**Weekly Reward Structure:**
- Complete 1 weekly: Random RARE chip
- Complete 2 weeklies: +100 Gems
- Complete 3 weeklies (all): Guaranteed EPIC chip

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Tasks:**
- [ ] Define new types in `types.ts`
- [ ] Create `constants/missions.ts` with mission definitions
- [ ] Create `constants/achievements.ts` with achievement definitions
- [ ] Expand `constants/chips.ts` with new chip roster
- [ ] Update `GameState` to include `MissionState`
- [ ] Modify `createInitialGameState()` to start with 0 chips, 0 slots

**New Files:**
- `constants/missions.ts`
- `constants/achievements.ts`
- `components/Screens/MissionsScreen.tsx`

### Phase 2: Reducer Actions (Week 2-3)

**New Actions:**
```typescript
| { type: 'UPDATE_MISSION_PROGRESS'; payload: { missionId: string; objectiveId: string; progress: number } }
| { type: 'COMPLETE_MISSION'; payload: { missionId: string } }
| { type: 'CLAIM_MISSION_REWARD'; payload: { missionId: string } }
| { type: 'UNLOCK_CHIP_SLOT' }
| { type: 'ADD_CHIP'; payload: { chipId: string; level?: number } }
| { type: 'REFRESH_DAILY_MISSIONS' }
| { type: 'REFRESH_WEEKLY_MISSIONS' }
| { type: 'UNLOCK_ACHIEVEMENT'; payload: { achievementId: string; tier: number } }
```

### Phase 3: Mission Tracking (Week 3-4)

**Integrate Mission Progress:**
- Hook into `ENEMY_KILLED` action for kill tracking
- Hook into `ADVANCE_WAVE` for wave tracking
- Hook into `END_BATTLE` for battle tracking
- Hook into `COLLECT_REWARDS` for gold/gem tracking

### Phase 4: UI Implementation (Week 4-5)

**New Screens:**
- Missions Screen (tab in navigation)
- Achievement popup system
- Daily/Weekly challenge widget on HomeScreen
- Chip unlock celebration modal

### Phase 5: Polish & Balance (Week 5-6)

**Tasks:**
- Test progression curve
- Balance chip unlock rates
- Tune daily/weekly difficulty
- Add sound effects for unlocks
- Implement notification badges

---

## Appendix A: Full Chip Stat Reference

### Stat Scaling by Rarity

| Stat | COMMON (×1) | RARE (×1.5) | EPIC (×2) | LEGENDARY (×3) |
|------|-------------|-------------|-----------|----------------|
| Damage | +5 | +8 | +12 | +20 |
| Damage % | +3% | +5% | +8% | +12% |
| HP | +100 | +150 | +250 | +500 |
| HP % | +3% | +5% | +8% | +15% |
| Defense | +2 | +4 | +6 | +10 |
| Crit Rate | +2% | +3% | +5% | +8% |
| Crit Damage | +8% | +12% | +18% | +25% |
| Attack Speed | +3% | +5% | +8% | +12% |
| Gold Bonus | +5% | +10% | +15% | +25% |
| Energy | +3 | +5 | +8 | +12 |

### Upgrade Cost Formula

```typescript
upgradeCost = baseCost × (costMultiplier ^ (currentLevel - 1))
```

| Rarity | Base Cost | Multiplier | Level 5 Cost | Level 10 Cost |
|--------|-----------|------------|--------------|---------------|
| COMMON | 100 | 1.5 | 506 | 3,844 |
| RARE | 250 | 1.6 | 1,639 | 17,592 |
| EPIC | 500 | 1.7 | 4,181 | 61,752 |
| LEGENDARY | 1000 | 1.8 | 10,498 | 214,991 |

---

## Appendix B: Mission Dependency Tree

```
Tutorial Missions
├── First Blood (Kill 1)
│   └── Circle Hunter (Kill 10 Circles) → [Plasma Core]
│       └── Boss Slayer I (Kill first boss) → [Nano Plating, Slot 1]
│           └── Experiment (Use 2 weapons) → [Precision Optics]
│               └── Survivor I (Reach Wave 10) → [Slot 2]

Combat Missions
├── Tank Buster (Kill 10 Tanks) → [Fury Driver]
├── Swarm Crusher (Kill 100 Swarm) → [Reactive Armor]
├── Triple Threat (3 bosses 1 battle) → [Slot 4]
└── Boss Executioner chain
    ├── I (5 bosses) → [Inferno Core]
    ├── II (25 bosses) → [Assassin Protocol]
    └── III (100 bosses) → [Godslayer]

Survival Missions
├── Survivor II (Wave 20) → [Velocity Boost]
├── Veteran I (Wave 30) → [Berserker Module]
├── Veteran II (Wave 40) → [Slot 5]
├── Commander I (Wave 50) → [Slot 6, Legendary Choice]
├── Commander II (Wave 60) → [Annihilator Core]
├── Commander III (Wave 70) → [Titan Core]
├── Elite Commander (Wave 80) → [Slot 7]
├── Master Defender (Wave 90) → [Quantum Core]
└── Century (Wave 100) → [Slot 8, Exclusive Skin]

Mastery Missions (unlocked at Wave 15+)
├── Critical Master (500 crits) → [Lucky Charm]
├── Untouchable (flawless wave) → [Void Barrier]
├── Kill Streak (25 in 10s) → [Chain Lightning]
└── Damage Dealer chain
    ├── I (100K damage) → [Devastator]
    └── II (1M damage) → [Omega Strike]
```

---

## Appendix C: New Initial State

```typescript
// Updated createInitialGameState()
export const createInitialGameState = (): GameState => ({
  stats: { ...INITIAL_STATS, gold: 0, gems: 0, level: 1, defense: 0 },
  battle: { /* unchanged */ },
  
  // Chips - START EMPTY
  chipState: {
    ownedChips: [],  // NO STARTER CHIPS
    slots: [],       // NO STARTER SLOTS - unlock through missions
    unlockedSlots: 0 // New field to track how many slots unlocked
  },
  
  // Missions - NEW
  missionState: {
    missions: [...TUTORIAL_MISSIONS],
    completedMissions: [],
    dailyMissionsRefreshedAt: Date.now(),
    weeklyMissionsRefreshedAt: Date.now(),
    totalMissionsCompleted: 0,
  },
  
  // Achievements - NEW
  achievementState: {
    unlockedAchievements: [],
    progress: {},
  },
  
  // Rest unchanged...
});
```

---

## Summary

This design transforms **Rogue Defense Protocol** from a "chips given at start" model to a rich **mission-based progression system** where:

1. **Players start with nothing** - creating immediate goals
2. **Tutorial missions** guide first 10 waves with guaranteed chip unlocks
3. **48 unique chips** across 4 categories (ATK, DEF, UTIL, SPECIAL)
4. **8 chip slots** unlocked through wave milestones
5. **Missions, achievements, and daily/weekly challenges** provide constant goals
6. **Clear progression curve** from Wave 1 to Wave 100

This system adds depth, replayability, and a strong sense of progression that keeps players engaged beyond just "survive more waves."
