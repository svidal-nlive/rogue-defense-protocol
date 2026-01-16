import { Mission, MissionCategory, MissionObjective, MissionReward, EnemyType, WeaponType } from '../types';

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
      enemyType: EnemyType.CIRCLE
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
      enemyType: EnemyType.CIRCLE
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
      enemyType: EnemyType.TANK
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
      enemyType: EnemyType.SWARM
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
      { type: 'CHIP', rarity: 'LEGENDARY' }
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
      weaponType: WeaponType.BLASTER
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
      weaponType: WeaponType.MISSILE
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
      weaponType: WeaponType.LASER
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
      weaponType: WeaponType.CRYO
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

// Alias for consistency
export const ALL_PERMANENT_MISSIONS = ALL_MISSIONS;

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getMissionById = (id: string): Omit<Mission, 'status'> | undefined => {
  return ALL_MISSIONS.find(m => m.id === id);
};

export const getMissionCategoryName = (category: MissionCategory): string => {
  const names: Record<MissionCategory, string> = {
    TUTORIAL: 'Tutorial',
    COMBAT: 'Combat',
    SURVIVAL: 'Survival',
    MASTERY: 'Mastery',
    EXPLORATION: 'Exploration',
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    MILESTONE: 'Milestone'
  };
  return names[category];
};

export const getMissionCategoryColor = (category: MissionCategory): string => {
  const colors: Record<MissionCategory, string> = {
    TUTORIAL: '#00F0FF',    // Cyan
    COMBAT: '#FF6B00',      // Orange
    SURVIVAL: '#00FF88',    // Green
    MASTERY: '#BC13FE',     // Purple
    EXPLORATION: '#FFD700', // Gold
    DAILY: '#00BFFF',       // Light blue
    WEEKLY: '#FF69B4',      // Pink
    MILESTONE: '#FFFFFF'    // White
  };
  return colors[category];
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

export const shouldRefreshDailyMissions = (lastRefreshedAt: number): boolean => {
  const now = Date.now();
  const lastRefreshDate = new Date(lastRefreshedAt);
  const today = new Date();
  
  // Check if last refresh was before today
  return lastRefreshDate.toDateString() !== today.toDateString();
};

export const shouldRefreshWeeklyMissions = (lastRefreshedAt: number): boolean => {
  const now = Date.now();
  const lastRefreshDate = new Date(lastRefreshedAt);
  const today = new Date();
  
  // Get the Monday of current week
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  currentMonday.setHours(0, 0, 0, 0);
  
  return lastRefreshDate < currentMonday;
};

// ============================================
// MISSION PROGRESS SYNC
// ============================================

export interface MissionTrackingStats {
  totalEnemiesKilled: number;
  totalBossesKilled: number;
  totalDamageDealt: number;
  totalCriticalHits: number;
  totalGoldEarned: number;
  totalWavesCompleted: number;
  totalBattlesCompleted: number;
  highestWaveReached: number;
  weaponsUsed: WeaponType[];
  currentBattleBossKills: number;
  currentBattleMaxKillStreak: number;
  // Enemy type tracking
  circlesKilled: number;
  squaresKilled: number;
  trianglesKilled: number;
  swarmsKilled: number;
  tanksKilled: number;
}

/**
 * Calculate mission objective progress based on tracking stats
 * This syncs the objective.current value with the actual stats
 */
export const calculateObjectiveProgress = (
  objective: MissionObjective,
  stats: MissionTrackingStats
): number => {
  switch (objective.type) {
    case 'KILL_ENEMIES':
      return stats.totalEnemiesKilled;
    case 'KILL_ENEMY_TYPE':
      switch (objective.enemyType) {
        case EnemyType.CIRCLE:
          return stats.circlesKilled;
        case EnemyType.SQUARE:
          return stats.squaresKilled;
        case EnemyType.TRIANGLE:
          return stats.trianglesKilled;
        case EnemyType.SWARM:
          return stats.swarmsKilled;
        case EnemyType.TANK:
          return stats.tanksKilled;
        case EnemyType.BOSS:
          return stats.totalBossesKilled;
        default:
          return 0;
      }
    case 'BOSS_KILLS':
      return stats.totalBossesKilled;
    case 'REACH_WAVE':
      return stats.highestWaveReached;
    case 'SURVIVE_WAVES':
      return stats.totalWavesCompleted;
    case 'DEAL_DAMAGE':
      return stats.totalDamageDealt;
    case 'DEAL_CRIT_DAMAGE':
      return stats.totalCriticalHits;
    case 'EARN_GOLD':
      return stats.totalGoldEarned;
    case 'USE_WEAPON':
      return stats.weaponsUsed.length;
    case 'COMPLETE_BATTLE':
      return stats.totalBattlesCompleted;
    case 'KILL_STREAK':
      return stats.currentBattleMaxKillStreak;
    default:
      return objective.current;
  }
};

/**
 * Sync all mission progress based on current tracking stats
 */
export const syncMissionProgress = (
  missions: Mission[],
  stats: MissionTrackingStats
): Mission[] => {
  return missions.map(mission => {
    const updatedObjectives = mission.objectives.map(obj => ({
      ...obj,
      current: Math.min(calculateObjectiveProgress(obj, stats), obj.target)
    }));
    
    // Check if all objectives are complete
    const allComplete = updatedObjectives.every(o => o.current >= o.target);
    const newStatus = mission.status === 'CLAIMED' 
      ? 'CLAIMED' 
      : allComplete 
        ? 'COMPLETED' 
        : mission.status === 'LOCKED' 
          ? 'LOCKED' 
          : 'IN_PROGRESS';
    
    return {
      ...mission,
      objectives: updatedObjectives,
      status: newStatus as Mission['status']
    };
  });
};
