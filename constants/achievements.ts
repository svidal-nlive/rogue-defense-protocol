import { Achievement, AchievementCategory, AchievementTier, AchievementProgress, MissionReward } from '../types';

// ============================================
// ACHIEVEMENT DEFINITIONS
// ============================================

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Combat Achievements
  {
    id: 'ach_slayer',
    name: 'Slayer',
    description: 'Kill enemies to prove your worth.',
    icon: 'sword',
    category: 'COMBAT',
    tiers: [
      { tier: 'BRONZE', requirement: 100, reward: { type: 'GOLD', amount: 100 } },
      { tier: 'SILVER', requirement: 1000, reward: { type: 'GOLD', amount: 500 } },
      { tier: 'GOLD', requirement: 10000, reward: { type: 'GEMS', amount: 50 } },
      { tier: 'PLATINUM', requirement: 100000, reward: { type: 'CHIP', rarity: 'LEGENDARY' } },
    ],
    hidden: false
  },
  {
    id: 'ach_boss_hunter',
    name: 'Boss Hunter',
    description: 'Defeat bosses to earn this title.',
    icon: 'skull',
    category: 'COMBAT',
    tiers: [
      { tier: 'BRONZE', requirement: 5, reward: { type: 'GOLD', amount: 200 } },
      { tier: 'SILVER', requirement: 25, reward: { type: 'GOLD', amount: 1000 } },
      { tier: 'GOLD', requirement: 100, reward: { type: 'GEMS', amount: 100 } },
      { tier: 'PLATINUM', requirement: 500, reward: { type: 'CHIP', id: 'spec_boss_bane' } },
    ],
    hidden: false
  },
  {
    id: 'ach_critical_striker',
    name: 'Critical Striker',
    description: 'Land critical hits to maximize damage.',
    icon: 'zap',
    category: 'COMBAT',
    tiers: [
      { tier: 'BRONZE', requirement: 50, reward: { type: 'GOLD', amount: 100 } },
      { tier: 'SILVER', requirement: 500, reward: { type: 'GOLD', amount: 500 } },
      { tier: 'GOLD', requirement: 5000, reward: { type: 'GEMS', amount: 50 } },
      { tier: 'PLATINUM', requirement: 50000, reward: { type: 'CHIP', id: 'util_critical_master' } },
    ],
    hidden: false
  },

  // Progression Achievements
  {
    id: 'ach_wave_climber',
    name: 'Wave Climber',
    description: 'Reach higher waves to prove your endurance.',
    icon: 'mountain',
    category: 'PROGRESSION',
    tiers: [
      { tier: 'BRONZE', requirement: 10, reward: { type: 'GOLD', amount: 200 } },
      { tier: 'SILVER', requirement: 30, reward: { type: 'GOLD', amount: 1000 } },
      { tier: 'GOLD', requirement: 60, reward: { type: 'GEMS', amount: 100 } },
      { tier: 'PLATINUM', requirement: 100, reward: { type: 'SKIN', id: 'skin_platinum_wave' } },
    ],
    hidden: false
  },
  {
    id: 'ach_wealth',
    name: 'Wealth',
    description: 'Accumulate gold to show your riches.',
    icon: 'coins',
    category: 'PROGRESSION',
    tiers: [
      { tier: 'BRONZE', requirement: 1000, reward: { type: 'GOLD', amount: 100 } },
      { tier: 'SILVER', requirement: 10000, reward: { type: 'GOLD', amount: 500 } },
      { tier: 'GOLD', requirement: 100000, reward: { type: 'GEMS', amount: 50 } },
      { tier: 'PLATINUM', requirement: 1000000, reward: { type: 'CHIP', id: 'util_gold_magnet' } },
    ],
    hidden: false
  },
  {
    id: 'ach_veteran',
    name: 'Veteran',
    description: 'Complete battles to gain experience.',
    icon: 'shield',
    category: 'PROGRESSION',
    tiers: [
      { tier: 'BRONZE', requirement: 10, reward: { type: 'GOLD', amount: 150 } },
      { tier: 'SILVER', requirement: 50, reward: { type: 'GOLD', amount: 750 } },
      { tier: 'GOLD', requirement: 200, reward: { type: 'GEMS', amount: 75 } },
      { tier: 'PLATINUM', requirement: 1000, reward: { type: 'CHIP', id: 'def_veteran_shield' } },
    ],
    hidden: false
  },

  // Collection Achievements
  {
    id: 'ach_chip_collector',
    name: 'Chip Collector',
    description: 'Collect unique chips to expand your arsenal.',
    icon: 'cpu',
    category: 'COLLECTION',
    tiers: [
      { tier: 'BRONZE', requirement: 5, reward: { type: 'GOLD', amount: 200 } },
      { tier: 'SILVER', requirement: 15, reward: { type: 'GOLD', amount: 1000 } },
      { tier: 'GOLD', requirement: 30, reward: { type: 'GEMS', amount: 100 } },
      { tier: 'PLATINUM', requirement: 48, reward: { type: 'CHIP', id: 'spec_collector_bonus' } },
    ],
    hidden: false
  },
  {
    id: 'ach_weapon_master',
    name: 'Weapon Master',
    description: 'Unlock and master all weapons.',
    icon: 'crosshair',
    category: 'COLLECTION',
    tiers: [
      { tier: 'BRONZE', requirement: 2, reward: { type: 'GOLD', amount: 300 } },
      { tier: 'SILVER', requirement: 3, reward: { type: 'GOLD', amount: 800 } },
      { tier: 'GOLD', requirement: 4, reward: { type: 'GEMS', amount: 50 } },
      { tier: 'PLATINUM', requirement: 4, reward: { type: 'CHIP', id: 'util_weapon_amplifier' } },
    ],
    hidden: false
  },

  // Mastery Achievements
  {
    id: 'ach_damage_dealer',
    name: 'Damage Dealer',
    description: 'Deal massive amounts of total damage.',
    icon: 'flame',
    category: 'MASTERY',
    tiers: [
      { tier: 'BRONZE', requirement: 10000, reward: { type: 'GOLD', amount: 150 } },
      { tier: 'SILVER', requirement: 100000, reward: { type: 'GOLD', amount: 750 } },
      { tier: 'GOLD', requirement: 1000000, reward: { type: 'GEMS', amount: 75 } },
      { tier: 'PLATINUM', requirement: 10000000, reward: { type: 'CHIP', id: 'atk_damage_lord' } },
    ],
    hidden: false
  },
  {
    id: 'ach_untouchable',
    name: 'Untouchable',
    description: 'Complete waves without taking damage.',
    icon: 'shield-off',
    category: 'MASTERY',
    tiers: [
      { tier: 'BRONZE', requirement: 1, reward: { type: 'GOLD', amount: 200 } },
      { tier: 'SILVER', requirement: 10, reward: { type: 'GOLD', amount: 1000 } },
      { tier: 'GOLD', requirement: 50, reward: { type: 'GEMS', amount: 100 } },
      { tier: 'PLATINUM', requirement: 100, reward: { type: 'CHIP', id: 'def_ghost_barrier' } },
    ],
    hidden: false
  },

  // Secret Achievements
  {
    id: 'ach_speed_demon',
    name: 'Speed Demon',
    description: '???',
    icon: 'timer',
    category: 'SECRET',
    tiers: [
      { tier: 'BRONZE', requirement: 20, reward: { type: 'GOLD', amount: 500 } },
      { tier: 'SILVER', requirement: 30, reward: { type: 'GEMS', amount: 25 } },
      { tier: 'GOLD', requirement: 40, reward: { type: 'GEMS', amount: 50 } },
      { tier: 'PLATINUM', requirement: 50, reward: { type: 'CHIP', id: 'spec_time_warp' } },
    ],
    hidden: true
  },
  {
    id: 'ach_survivor',
    name: 'True Survivor',
    description: '???',
    icon: 'heart',
    category: 'SECRET',
    tiers: [
      { tier: 'BRONZE', requirement: 1, reward: { type: 'GOLD', amount: 300 } },
      { tier: 'SILVER', requirement: 5, reward: { type: 'GEMS', amount: 30 } },
      { tier: 'GOLD', requirement: 10, reward: { type: 'GEMS', amount: 75 } },
      { tier: 'PLATINUM', requirement: 25, reward: { type: 'CHIP', id: 'def_phoenix_core' } },
    ],
    hidden: true
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getAchievementById = (id: string): Achievement | undefined => {
  return ALL_ACHIEVEMENTS.find(a => a.id === id);
};

export const checkAchievementTierReached = (
  achievement: Achievement,
  currentValue: number
): AchievementTier | null => {
  // Find the highest tier that has been reached
  let reachedTier: AchievementTier | null = null;
  
  for (const tier of achievement.tiers) {
    if (currentValue >= tier.requirement) {
      reachedTier = tier.tier;
    }
  }
  
  return reachedTier;
};

export const getNextTier = (
  achievement: Achievement,
  currentTiers: AchievementTier[]
): { tier: AchievementTier; requirement: number; reward: MissionReward } | null => {
  const tierOrder: AchievementTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
  
  for (const tier of achievement.tiers) {
    if (!currentTiers.includes(tier.tier)) {
      return tier;
    }
  }
  
  return null;
};

export const getTierColor = (tier: AchievementTier): string => {
  const colors: Record<AchievementTier, string> = {
    BRONZE: '#CD7F32',
    SILVER: '#C0C0C0',
    GOLD: '#FFD700',
    PLATINUM: '#E5E4E2'
  };
  return colors[tier];
};

export const initializeAchievements = (): Record<string, AchievementProgress> => {
  const progress: Record<string, AchievementProgress> = {};
  
  for (const achievement of ALL_ACHIEVEMENTS) {
    progress[achievement.id] = {
      id: achievement.id,
      currentValue: 0,
      unlockedTiers: []
    };
  }
  
  return progress;
};
