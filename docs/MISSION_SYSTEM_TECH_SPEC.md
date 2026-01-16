# Mission System - Technical Implementation Specification

## Overview

This document provides the technical specifications for implementing the Mission & Chip Progression System in **Rogue Defense Protocol**.

---

## New Type Definitions

Add these to `types.ts`:

```typescript
// ============================================
// MISSION SYSTEM TYPES
// ============================================

export type MissionCategory = 
  | 'TUTORIAL'
  | 'COMBAT'
  | 'SURVIVAL'
  | 'MASTERY'
  | 'EXPLORATION'
  | 'DAILY'
  | 'WEEKLY'
  | 'MILESTONE';

export type MissionStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';

export type ObjectiveType = 
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
  | 'BOSS_KILLS'
  | 'USE_ABILITY'
  | 'EQUIP_CHIPS'
  | 'UPGRADE_CHIPS';

export interface MissionObjective {
  id: string;
  type: ObjectiveType;
  target: number;
  current: number;
  description: string;
  // Optional filters
  enemyType?: EnemyType;
  weaponType?: WeaponType;
  waveNumber?: number;
}

export interface MissionReward {
  type: 'CHIP' | 'GOLD' | 'GEMS' | 'CHIP_SLOT' | 'WEAPON' | 'SKIN' | 'BOOST';
  id?: string;
  amount?: number;
  rarity?: ChipRarity;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  category: MissionCategory;
  objectives: MissionObjective[];
  rewards: MissionReward[];
  prerequisites?: string[];
  unlockWave?: number;
  repeatable: boolean;
  expiresAt?: number;
  status: MissionStatus;
}

export interface MissionState {
  activeMissions: Mission[];
  completedMissions: string[];
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  dailyMissionsRefreshedAt: number;
  weeklyMissionsRefreshedAt: number;
  totalMissionsCompleted: number;
}

// ============================================
// ACHIEVEMENT SYSTEM TYPES
// ============================================

export type AchievementCategory = 
  | 'COMBAT'
  | 'PROGRESSION'
  | 'COLLECTION'
  | 'MASTERY'
  | 'SECRET';

export type AchievementTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface AchievementProgress {
  id: string;
  currentValue: number;
  unlockedTiers: AchievementTier[];
  lastUnlockedAt?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tiers: {
    tier: AchievementTier;
    requirement: number;
    reward: MissionReward;
  }[];
  hidden: boolean;
}

export interface AchievementState {
  progress: Record<string, AchievementProgress>;
  totalUnlocked: number;
}

// ============================================
// UPDATED CHIP STATE
// ============================================

export interface ChipSlot {
  index: number;
  unlocked: boolean;
  unlockedByMission?: string;
  equippedChipId?: string;
}

export interface ChipStateV2 {
  ownedChips: OwnedChip[];
  slots: ChipSlot[];
  totalSlotsUnlocked: number;
}

// ============================================
// UPDATED GAME STATE
// ============================================

// Add to GameState interface:
// missionState: MissionState;
// achievementState: AchievementState;
// chipState: ChipStateV2;  // Updated version

// ============================================
// NEW GAME ACTIONS
// ============================================

// Add to GameAction union:
// | { type: 'MISSION_PROGRESS'; payload: { missionId: string; objectiveId: string; increment: number } }
// | { type: 'COMPLETE_MISSION'; payload: { missionId: string } }
// | { type: 'CLAIM_MISSION_REWARD'; payload: { missionId: string } }
// | { type: 'UNLOCK_CHIP_SLOT'; payload: { slotIndex: number; missionId?: string } }
// | { type: 'GRANT_CHIP'; payload: { chipId: string; level?: number } }
// | { type: 'REFRESH_DAILY_MISSIONS' }
// | { type: 'REFRESH_WEEKLY_MISSIONS' }
// | { type: 'ACHIEVEMENT_PROGRESS'; payload: { achievementId: string; value: number } }
// | { type: 'UNLOCK_ACHIEVEMENT_TIER'; payload: { achievementId: string; tier: AchievementTier } }
```

---

## New Constants Files

### constants/missions.ts

```typescript
import { Mission, MissionCategory, MissionObjective, MissionReward } from '../types';

// ============================================
// TUTORIAL MISSIONS
// ============================================

export const TUTORIAL_MISSIONS: Omit<Mission, 'status'>[] = [
  {
    id: 'tut_first_blood',
    name: 'First Blood',
    description: 'Eliminate your first enemy threat.',
    category: 'TUTORIAL',
    objectives: [{
      id: 'obj_kill_1',
      type: 'KILL_ENEMIES',
      target: 1,
      current: 0,
      description: 'Kill 1 enemy'
    }],
    rewards: [{ type: 'GOLD', amount: 50 }],
    repeatable: false
  },
  {
    id: 'tut_circle_hunter',
    name: 'Circle Hunter',
    description: 'The basic drones are your primary targets. Eliminate them.',
    category: 'TUTORIAL',
    prerequisites: ['tut_first_blood'],
    objectives: [{
      id: 'obj_kill_circles_10',
      type: 'KILL_ENEMY_TYPE',
      target: 10,
      current: 0,
      description: 'Kill 10 Circle enemies',
      enemyType: 'CIRCLE'
    }],
    rewards: [
      { type: 'CHIP', id: 'atk_plasma_core' },
      { type: 'CHIP_SLOT' }
    ],
    repeatable: false
  },
  {
    id: 'tut_boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeat your first boss enemy.',
    category: 'TUTORIAL',
    prerequisites: ['tut_circle_hunter'],
    unlockWave: 5,
    objectives: [{
      id: 'obj_kill_boss_1',
      type: 'BOSS_KILLS',
      target: 1,
      current: 0,
      description: 'Defeat 1 boss'
    }],
    rewards: [{ type: 'CHIP', id: 'def_nano_plating' }],
    repeatable: false
  },
  {
    id: 'tut_experiment',
    name: 'Experiment',
    description: 'Try using a different weapon in battle.',
    category: 'TUTORIAL',
    prerequisites: ['tut_boss_slayer'],
    objectives: [{
      id: 'obj_use_weapons',
      type: 'USE_WEAPON',
      target: 2,
      current: 0,
      description: 'Use 2 different weapons'
    }],
    rewards: [{ type: 'CHIP', id: 'util_precision_optics' }],
    repeatable: false
  },
  {
    id: 'tut_survivor',
    name: 'Survivor I',
    description: 'Reach Wave 10 to establish your first checkpoint.',
    category: 'TUTORIAL',
    prerequisites: ['tut_experiment'],
    objectives: [{
      id: 'obj_reach_wave_10',
      type: 'REACH_WAVE',
      target: 10,
      current: 0,
      description: 'Reach Wave 10'
    }],
    rewards: [
      { type: 'CHIP_SLOT' },
      { type: 'GOLD', amount: 200 }
    ],
    repeatable: false
  }
];

// ============================================
// COMBAT MISSIONS
// ============================================

export const COMBAT_MISSIONS: Omit<Mission, 'status'>[] = [
  {
    id: 'cbt_circle_destroyer',
    name: 'Circle Destroyer',
    description: 'Become proficient at eliminating basic drones.',
    category: 'COMBAT',
    prerequisites: ['tut_survivor'],
    objectives: [{
      id: 'obj_kill_circles_100',
      type: 'KILL_ENEMY_TYPE',
      target: 100,
      current: 0,
      description: 'Kill 100 Circle enemies',
      enemyType: 'CIRCLE'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_spark_plug' }],
    repeatable: false
  },
  {
    id: 'cbt_tank_buster',
    name: 'Tank Buster',
    description: 'Learn to take down heavily armored targets.',
    category: 'COMBAT',
    unlockWave: 12,
    objectives: [{
      id: 'obj_kill_tanks_10',
      type: 'KILL_ENEMY_TYPE',
      target: 10,
      current: 0,
      description: 'Kill 10 Tank enemies',
      enemyType: 'TANK'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_fury_driver' }],
    repeatable: false
  },
  {
    id: 'cbt_swarm_crusher',
    name: 'Swarm Crusher',
    description: 'Master crowd control against swarm enemies.',
    category: 'COMBAT',
    unlockWave: 15,
    objectives: [{
      id: 'obj_kill_swarm_200',
      type: 'KILL_ENEMY_TYPE',
      target: 200,
      current: 0,
      description: 'Kill 200 Swarm enemies',
      enemyType: 'SWARM'
    }],
    rewards: [{ type: 'CHIP', id: 'def_reactive_armor' }],
    repeatable: false
  },
  {
    id: 'cbt_boss_exec_1',
    name: 'Boss Executioner I',
    description: 'Prove yourself against multiple boss enemies.',
    category: 'COMBAT',
    prerequisites: ['tut_boss_slayer'],
    objectives: [{
      id: 'obj_kill_bosses_5',
      type: 'BOSS_KILLS',
      target: 5,
      current: 0,
      description: 'Defeat 5 bosses'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_inferno_core' }],
    repeatable: false
  },
  {
    id: 'cbt_boss_exec_2',
    name: 'Boss Executioner II',
    description: 'You are becoming a true boss slayer.',
    category: 'COMBAT',
    prerequisites: ['cbt_boss_exec_1'],
    objectives: [{
      id: 'obj_kill_bosses_25',
      type: 'BOSS_KILLS',
      target: 25,
      current: 0,
      description: 'Defeat 25 bosses'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_assassin_protocol' }],
    repeatable: false
  },
  {
    id: 'cbt_boss_exec_3',
    name: 'Boss Executioner III',
    description: 'The ultimate boss hunter.',
    category: 'COMBAT',
    prerequisites: ['cbt_boss_exec_2'],
    objectives: [{
      id: 'obj_kill_bosses_100',
      type: 'BOSS_KILLS',
      target: 100,
      current: 0,
      description: 'Defeat 100 bosses'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_godslayer' }],
    repeatable: false
  },
  {
    id: 'cbt_triple_threat',
    name: 'Triple Threat',
    description: 'Defeat 3 bosses in a single battle.',
    category: 'COMBAT',
    unlockWave: 15,
    objectives: [{
      id: 'obj_3_bosses_1_battle',
      type: 'BOSS_KILLS',
      target: 3,
      current: 0,
      description: 'Defeat 3 bosses in one battle'
      // Note: This requires special tracking - resets each battle
    }],
    rewards: [{ type: 'CHIP_SLOT' }],
    repeatable: false
  }
];

// ============================================
// SURVIVAL MISSIONS
// ============================================

export const SURVIVAL_MISSIONS: Omit<Mission, 'status'>[] = [
  {
    id: 'srv_survivor_2',
    name: 'Survivor II',
    description: 'Push further into enemy territory.',
    category: 'SURVIVAL',
    prerequisites: ['tut_survivor'],
    objectives: [{
      id: 'obj_reach_wave_20',
      type: 'REACH_WAVE',
      target: 20,
      current: 0,
      description: 'Reach Wave 20'
    }],
    rewards: [{ type: 'CHIP', id: 'util_velocity_boost' }],
    repeatable: false
  },
  {
    id: 'srv_veteran_1',
    name: 'Veteran I',
    description: 'Only seasoned defenders reach this far.',
    category: 'SURVIVAL',
    prerequisites: ['srv_survivor_2'],
    objectives: [{
      id: 'obj_reach_wave_30',
      type: 'REACH_WAVE',
      target: 30,
      current: 0,
      description: 'Reach Wave 30'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_berserker_module' }],
    repeatable: false
  },
  {
    id: 'srv_slot_unlock_3',
    name: 'Expansion Protocol',
    description: 'Expand your neural interface capacity.',
    category: 'SURVIVAL',
    unlockWave: 15,
    objectives: [{
      id: 'obj_reach_wave_15',
      type: 'REACH_WAVE',
      target: 15,
      current: 0,
      description: 'Reach Wave 15'
    }],
    rewards: [
      { type: 'CHIP_SLOT' },
      { type: 'GEMS', amount: 100 }
    ],
    repeatable: false
  },
  {
    id: 'srv_veteran_2',
    name: 'Veteran II',
    description: 'Your combat experience grows.',
    category: 'SURVIVAL',
    prerequisites: ['srv_veteran_1'],
    objectives: [{
      id: 'obj_reach_wave_40',
      type: 'REACH_WAVE',
      target: 40,
      current: 0,
      description: 'Reach Wave 40'
    }],
    rewards: [{ type: 'CHIP_SLOT' }],
    repeatable: false
  },
  {
    id: 'srv_commander_1',
    name: 'Commander I',
    description: 'You have proven yourself as a true defender.',
    category: 'SURVIVAL',
    prerequisites: ['srv_veteran_2'],
    objectives: [{
      id: 'obj_reach_wave_50',
      type: 'REACH_WAVE',
      target: 50,
      current: 0,
      description: 'Reach Wave 50'
    }],
    rewards: [
      { type: 'CHIP_SLOT' },
      { type: 'CHIP', rarity: 'LEGENDARY' }  // Player choice
    ],
    repeatable: false
  },
  {
    id: 'srv_commander_2',
    name: 'Commander II',
    description: 'Elite status achieved.',
    category: 'SURVIVAL',
    prerequisites: ['srv_commander_1'],
    objectives: [{
      id: 'obj_reach_wave_60',
      type: 'REACH_WAVE',
      target: 60,
      current: 0,
      description: 'Reach Wave 60'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_annihilator' }],
    repeatable: false
  },
  {
    id: 'srv_commander_3',
    name: 'Commander III',
    description: 'Among the elite defenders.',
    category: 'SURVIVAL',
    prerequisites: ['srv_commander_2'],
    objectives: [{
      id: 'obj_reach_wave_70',
      type: 'REACH_WAVE',
      target: 70,
      current: 0,
      description: 'Reach Wave 70'
    }],
    rewards: [{ type: 'CHIP', id: 'def_titan_core' }],
    repeatable: false
  },
  {
    id: 'srv_elite_commander',
    name: 'Elite Commander',
    description: 'The highest echelon of defenders.',
    category: 'SURVIVAL',
    prerequisites: ['srv_commander_3'],
    objectives: [{
      id: 'obj_reach_wave_80',
      type: 'REACH_WAVE',
      target: 80,
      current: 0,
      description: 'Reach Wave 80'
    }],
    rewards: [{ type: 'CHIP_SLOT' }],
    repeatable: false
  },
  {
    id: 'srv_master_defender',
    name: 'Master Defender',
    description: 'Legendary status.',
    category: 'SURVIVAL',
    prerequisites: ['srv_elite_commander'],
    objectives: [{
      id: 'obj_reach_wave_90',
      type: 'REACH_WAVE',
      target: 90,
      current: 0,
      description: 'Reach Wave 90'
    }],
    rewards: [{ type: 'CHIP', id: 'util_quantum_core' }],
    repeatable: false
  },
  {
    id: 'srv_century',
    name: 'Century',
    description: 'The ultimate achievement. Wave 100.',
    category: 'SURVIVAL',
    prerequisites: ['srv_master_defender'],
    objectives: [{
      id: 'obj_reach_wave_100',
      type: 'REACH_WAVE',
      target: 100,
      current: 0,
      description: 'Reach Wave 100'
    }],
    rewards: [
      { type: 'CHIP_SLOT' },
      { type: 'SKIN', id: 'skin_century_gold' },
      { type: 'CHIP', id: 'spec_ascension' }
    ],
    repeatable: false
  }
];

// ============================================
// MASTERY MISSIONS
// ============================================

export const MASTERY_MISSIONS: Omit<Mission, 'status'>[] = [
  {
    id: 'mst_critical_master',
    name: 'Critical Master',
    description: 'Land 500 critical hits total.',
    category: 'MASTERY',
    unlockWave: 15,
    objectives: [{
      id: 'obj_crits_500',
      type: 'DEAL_CRIT_DAMAGE',
      target: 500,
      current: 0,
      description: 'Land 500 critical hits'
    }],
    rewards: [{ type: 'CHIP', id: 'util_lucky_charm' }],
    repeatable: false
  },
  {
    id: 'mst_damage_dealer_1',
    name: 'Damage Dealer I',
    description: 'Deal massive amounts of damage.',
    category: 'MASTERY',
    unlockWave: 20,
    objectives: [{
      id: 'obj_damage_100k',
      type: 'DEAL_DAMAGE',
      target: 100000,
      current: 0,
      description: 'Deal 100,000 total damage'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_devastator' }],
    repeatable: false
  },
  {
    id: 'mst_damage_dealer_2',
    name: 'Damage Dealer II',
    description: 'True destruction incarnate.',
    category: 'MASTERY',
    prerequisites: ['mst_damage_dealer_1'],
    objectives: [{
      id: 'obj_damage_1m',
      type: 'DEAL_DAMAGE',
      target: 1000000,
      current: 0,
      description: 'Deal 1,000,000 total damage'
    }],
    rewards: [{ type: 'CHIP', id: 'atk_omega_strike' }],
    repeatable: false
  },
  {
    id: 'mst_untouchable',
    name: 'Untouchable',
    description: 'Complete a wave without taking any damage.',
    category: 'MASTERY',
    unlockWave: 10,
    objectives: [{
      id: 'obj_flawless_wave',
      type: 'NO_DAMAGE_WAVE',
      target: 1,
      current: 0,
      description: 'Complete 1 wave without damage'
    }],
    rewards: [{ type: 'CHIP', id: 'def_void_barrier' }],
    repeatable: false
  },
  {
    id: 'mst_kill_streak',
    name: 'Combo King',
    description: 'Kill 25 enemies within 10 seconds.',
    category: 'MASTERY',
    unlockWave: 20,
    objectives: [{
      id: 'obj_kill_streak_25',
      type: 'KILL_STREAK',
      target: 25,
      current: 0,
      description: 'Kill 25 enemies in 10 seconds'
    }],
    rewards: [{ type: 'CHIP', id: 'spec_chain_lightning' }],
    repeatable: false
  }
];

// ============================================
// EXPLORATION MISSIONS (Weapon-based)
// ============================================

export const EXPLORATION_MISSIONS: Omit<Mission, 'status'>[] = [
  {
    id: 'exp_blaster_expert',
    name: 'Blaster Expert',
    description: 'Master the Plasma Blaster.',
    category: 'EXPLORATION',
    objectives: [{
      id: 'obj_blaster_kills_500',
      type: 'KILL_ENEMIES',
      target: 500,
      current: 0,
      description: 'Kill 500 enemies with Blaster',
      weaponType: 'BLASTER'
    }],
    rewards: [{ type: 'CHIP', id: 'util_energy_cell' }],
    repeatable: false
  },
  {
    id: 'exp_missile_master',
    name: 'Missile Master',
    description: 'Master the Homing Missiles.',
    category: 'EXPLORATION',
    objectives: [{
      id: 'obj_missile_kills_300',
      type: 'KILL_ENEMIES',
      target: 300,
      current: 0,
      description: 'Kill 300 enemies with Missiles',
      weaponType: 'MISSILE'
    }],
    rewards: [{ type: 'CHIP', id: 'spec_frozen_core' }],
    repeatable: false
  },
  {
    id: 'exp_laser_legend',
    name: 'Laser Legend',
    description: 'Master the Focus Laser.',
    category: 'EXPLORATION',
    objectives: [{
      id: 'obj_laser_kills_400',
      type: 'KILL_ENEMIES',
      target: 400,
      current: 0,
      description: 'Kill 400 enemies with Laser',
      weaponType: 'LASER'
    }],
    rewards: [{ type: 'CHIP', id: 'spec_vampiric_shard' }],
    repeatable: false
  },
  {
    id: 'exp_cryo_champion',
    name: 'Cryo Champion',
    description: 'Master the Cryo Cannon.',
    category: 'EXPLORATION',
    objectives: [{
      id: 'obj_cryo_kills_200',
      type: 'KILL_ENEMIES',
      target: 200,
      current: 0,
      description: 'Kill 200 enemies with Cryo',
      weaponType: 'CRYO'
    }],
    rewards: [{ type: 'CHIP', id: 'spec_time_dilation' }],
    repeatable: false
  },
  {
    id: 'exp_weapon_master',
    name: 'Weapon Master',
    description: 'Complete a battle using each weapon type.',
    category: 'EXPLORATION',
    prerequisites: ['exp_blaster_expert', 'exp_missile_master', 'exp_laser_legend', 'exp_cryo_champion'],
    objectives: [{
      id: 'obj_all_weapons',
      type: 'USE_WEAPON',
      target: 4,
      current: 0,
      description: 'Use all 4 weapon types'
    }],
    rewards: [{ type: 'CHIP', id: 'util_omnichip' }],
    repeatable: false
  }
];

// ============================================
// DAILY MISSION POOL
// ============================================

export const DAILY_MISSION_POOL: Omit<Mission, 'status' | 'expiresAt'>[] = [
  {
    id: 'daily_kill_50',
    name: 'Daily Patrol',
    description: 'Eliminate 50 enemies today.',
    category: 'DAILY',
    objectives: [{
      id: 'obj_daily_kill_50',
      type: 'KILL_ENEMIES',
      target: 50,
      current: 0,
      description: 'Kill 50 enemies'
    }],
    rewards: [{ type: 'GOLD', amount: 100 }],
    repeatable: true
  },
  {
    id: 'daily_boss_2',
    name: 'Boss Bounty',
    description: 'Defeat 2 bosses today.',
    category: 'DAILY',
    objectives: [{
      id: 'obj_daily_boss_2',
      type: 'BOSS_KILLS',
      target: 2,
      current: 0,
      description: 'Defeat 2 bosses'
    }],
    rewards: [{ type: 'GEMS', amount: 10 }],
    repeatable: true
  },
  {
    id: 'daily_crit_25',
    name: 'Precision Day',
    description: 'Land 25 critical hits today.',
    category: 'DAILY',
    objectives: [{
      id: 'obj_daily_crit_25',
      type: 'DEAL_CRIT_DAMAGE',
      target: 25,
      current: 0,
      description: 'Land 25 critical hits'
    }],
    rewards: [{ type: 'GOLD', amount: 75 }],
    repeatable: true
  },
  {
    id: 'daily_waves_10',
    name: 'Wave Runner',
    description: 'Complete 10 waves today.',
    category: 'DAILY',
    objectives: [{
      id: 'obj_daily_waves_10',
      type: 'SURVIVE_WAVES',
      target: 10,
      current: 0,
      description: 'Complete 10 waves'
    }],
    rewards: [{ type: 'GOLD', amount: 150 }],
    repeatable: true
  },
  {
    id: 'daily_complete_1',
    name: 'Battle Ready',
    description: 'Complete 1 battle today.',
    category: 'DAILY',
    objectives: [{
      id: 'obj_daily_battle_1',
      type: 'COMPLETE_BATTLE',
      target: 1,
      current: 0,
      description: 'Complete 1 battle'
    }],
    rewards: [{ type: 'GOLD', amount: 50 }],
    repeatable: true
  }
];

// ============================================
// WEEKLY MISSION POOL
// ============================================

export const WEEKLY_MISSION_POOL: Omit<Mission, 'status' | 'expiresAt'>[] = [
  {
    id: 'weekly_kills_1000',
    name: 'Weekly Purge',
    description: 'Eliminate 1000 enemies this week.',
    category: 'WEEKLY',
    objectives: [{
      id: 'obj_weekly_kill_1000',
      type: 'KILL_ENEMIES',
      target: 1000,
      current: 0,
      description: 'Kill 1000 enemies'
    }],
    rewards: [{ type: 'CHIP', rarity: 'RARE' }],
    repeatable: true
  },
  {
    id: 'weekly_waves_100',
    name: 'Wave Warrior',
    description: 'Complete 100 total waves this week.',
    category: 'WEEKLY',
    objectives: [{
      id: 'obj_weekly_waves_100',
      type: 'SURVIVE_WAVES',
      target: 100,
      current: 0,
      description: 'Complete 100 waves'
    }],
    rewards: [{ type: 'GEMS', amount: 50 }],
    repeatable: true
  },
  {
    id: 'weekly_gold_10k',
    name: 'Fortune Seeker',
    description: 'Earn 10,000 gold this week.',
    category: 'WEEKLY',
    objectives: [{
      id: 'obj_weekly_gold_10k',
      type: 'EARN_GOLD',
      target: 10000,
      current: 0,
      description: 'Earn 10,000 gold'
    }],
    rewards: [{ type: 'BOOST', id: 'boost_gold_x2' }],
    repeatable: true
  }
];

// ============================================
// ALL MISSIONS COMBINED
// ============================================

export const ALL_MISSIONS = [
  ...TUTORIAL_MISSIONS,
  ...COMBAT_MISSIONS,
  ...SURVIVAL_MISSIONS,
  ...MASTERY_MISSIONS,
  ...EXPLORATION_MISSIONS
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getMissionById = (id: string): Omit<Mission, 'status'> | undefined => {
  return ALL_MISSIONS.find(m => m.id === id);
};

export const getAvailableMissions = (
  completedMissions: string[],
  currentWave: number
): Mission[] => {
  return ALL_MISSIONS
    .filter(mission => {
      // Already completed?
      if (completedMissions.includes(mission.id)) return false;
      
      // Check prerequisites
      if (mission.prerequisites) {
        const allPrereqsMet = mission.prerequisites.every(prereq => 
          completedMissions.includes(prereq)
        );
        if (!allPrereqsMet) return false;
      }
      
      // Check wave requirement
      if (mission.unlockWave && currentWave < mission.unlockWave) {
        return false;
      }
      
      return true;
    })
    .map(m => ({ ...m, status: 'AVAILABLE' as const }));
};

export const generateDailyMissions = (): Mission[] => {
  // Shuffle and pick 3
  const shuffled = [...DAILY_MISSION_POOL].sort(() => Math.random() - 0.5);
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  
  return shuffled.slice(0, 3).map(m => ({
    ...m,
    status: 'AVAILABLE' as const,
    expiresAt: midnight.getTime()
  }));
};

export const generateWeeklyMissions = (): Mission[] => {
  // Get all weekly missions
  const nextMonday = new Date();
  nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
  nextMonday.setHours(0, 0, 0, 0);
  
  return WEEKLY_MISSION_POOL.map(m => ({
    ...m,
    status: 'AVAILABLE' as const,
    expiresAt: nextMonday.getTime()
  }));
};
```

---

## Reducer Integration

Add these cases to the game reducer:

```typescript
// In gameReducer switch statement:

case 'MISSION_PROGRESS': {
  const { missionId, objectiveId, increment } = action.payload;
  
  // Find mission in active missions
  const missionIndex = state.missionState.activeMissions.findIndex(m => m.id === missionId);
  if (missionIndex === -1) return state;
  
  const mission = state.missionState.activeMissions[missionIndex];
  const objectiveIndex = mission.objectives.findIndex(o => o.id === objectiveId);
  if (objectiveIndex === -1) return state;
  
  const objective = mission.objectives[objectiveIndex];
  const newProgress = Math.min(objective.current + increment, objective.target);
  
  const updatedObjective = { ...objective, current: newProgress };
  const updatedObjectives = [...mission.objectives];
  updatedObjectives[objectiveIndex] = updatedObjective;
  
  // Check if all objectives complete
  const allComplete = updatedObjectives.every(o => o.current >= o.target);
  const newStatus = allComplete ? 'COMPLETED' : 'IN_PROGRESS';
  
  const updatedMission = { ...mission, objectives: updatedObjectives, status: newStatus };
  const updatedMissions = [...state.missionState.activeMissions];
  updatedMissions[missionIndex] = updatedMission;
  
  return {
    ...state,
    missionState: {
      ...state.missionState,
      activeMissions: updatedMissions
    }
  };
}

case 'CLAIM_MISSION_REWARD': {
  const { missionId } = action.payload;
  
  const missionIndex = state.missionState.activeMissions.findIndex(
    m => m.id === missionId && m.status === 'COMPLETED'
  );
  if (missionIndex === -1) return state;
  
  const mission = state.missionState.activeMissions[missionIndex];
  let newState = { ...state };
  
  // Process each reward
  mission.rewards.forEach(reward => {
    switch (reward.type) {
      case 'GOLD':
        newState.stats.gold += reward.amount || 0;
        break;
      case 'GEMS':
        newState.stats.gems += reward.amount || 0;
        break;
      case 'CHIP_SLOT':
        // Unlock next slot
        const nextSlotIndex = newState.chipState.totalSlotsUnlocked;
        if (nextSlotIndex < 8) {
          newState.chipState.slots[nextSlotIndex].unlocked = true;
          newState.chipState.slots[nextSlotIndex].unlockedByMission = missionId;
          newState.chipState.totalSlotsUnlocked++;
        }
        break;
      case 'CHIP':
        if (reward.id) {
          // Grant specific chip
          const newChip: OwnedChip = {
            chipId: reward.id,
            instanceId: `${reward.id}_${Date.now()}`,
            level: 1,
            equipped: false
          };
          newState.chipState.ownedChips.push(newChip);
        }
        break;
    }
  });
  
  // Move to completed
  const updatedMissions = state.missionState.activeMissions.filter(m => m.id !== missionId);
  
  return {
    ...newState,
    missionState: {
      ...state.missionState,
      activeMissions: updatedMissions,
      completedMissions: [...state.missionState.completedMissions, missionId],
      totalMissionsCompleted: state.missionState.totalMissionsCompleted + 1
    }
  };
}

case 'GRANT_CHIP': {
  const { chipId, level = 1 } = action.payload;
  const newChip: OwnedChip = {
    chipId,
    instanceId: `${chipId}_${Date.now()}`,
    level,
    equipped: false
  };
  
  return {
    ...state,
    chipState: {
      ...state.chipState,
      ownedChips: [...state.chipState.ownedChips, newChip]
    }
  };
}

case 'UNLOCK_CHIP_SLOT': {
  const { slotIndex, missionId } = action.payload;
  
  if (slotIndex >= 8 || state.chipState.slots[slotIndex].unlocked) {
    return state;
  }
  
  const updatedSlots = [...state.chipState.slots];
  updatedSlots[slotIndex] = {
    ...updatedSlots[slotIndex],
    unlocked: true,
    unlockedByMission: missionId
  };
  
  return {
    ...state,
    chipState: {
      ...state.chipState,
      slots: updatedSlots,
      totalSlotsUnlocked: state.chipState.totalSlotsUnlocked + 1
    }
  };
}
```

---

## Mission Progress Hooks

Create these hooks in battle and reward collection to update mission progress:

```typescript
// In ENEMY_KILLED case, add mission tracking:
// After calculating rewards...

// Track kills for missions
const killMissions = state.missionState.activeMissions.filter(m =>
  m.objectives.some(o => 
    o.type === 'KILL_ENEMIES' || 
    (o.type === 'KILL_ENEMY_TYPE' && o.enemyType === enemyType)
  )
);

killMissions.forEach(mission => {
  mission.objectives.forEach(obj => {
    if (obj.type === 'KILL_ENEMIES') {
      // Dispatch progress
    } else if (obj.type === 'KILL_ENEMY_TYPE' && obj.enemyType === enemyType) {
      // Dispatch progress
    }
  });
});

// Track boss kills
if (enemyType === EnemyType.BOSS) {
  // Update BOSS_KILLS objectives
}

// Track critical hits
if (isCrit) {
  // Update DEAL_CRIT_DAMAGE objectives
}

// Track damage
// Update DEAL_DAMAGE objectives with damage amount
```

---

## Storage Migration

Update storage version and migration logic:

```typescript
const STORAGE_VERSION = 7;  // v7: Mission system

// In loadGameState():
if (wrapper.version < 7) {
  // Migrate to mission system
  wrapper.data.missionState = createInitialMissionState();
  wrapper.data.achievementState = createInitialAchievementState();
  
  // Reset chips to empty (fresh start for missions)
  wrapper.data.chipState = {
    ownedChips: [],
    slots: Array(8).fill(null).map((_, i) => ({
      index: i,
      unlocked: false,
      equippedChipId: undefined
    })),
    totalSlotsUnlocked: 0
  };
}
```

---

## Summary

This technical specification provides all the types, constants, and reducer logic needed to implement the Mission & Chip Progression System. The key changes are:

1. **New Types**: Mission, Achievement, updated ChipState
2. **New Constants**: All mission definitions in `constants/missions.ts`
3. **Reducer Actions**: MISSION_PROGRESS, CLAIM_MISSION_REWARD, GRANT_CHIP, UNLOCK_CHIP_SLOT
4. **Integration Hooks**: Update mission progress on enemy kills, wave completion, etc.
5. **Storage Migration**: Upgrade existing saves to new system

This creates a robust foundation for the mission-based progression system.
