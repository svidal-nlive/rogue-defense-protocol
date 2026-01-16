import { Chip, ChipBonus, ChipRarity, ChipType, OwnedChip } from '../types';

// ============================================
// CHIP DEFINITIONS - COMPLETE 48 CHIP ROSTER
// ============================================

// Rarity multipliers for stat bonuses
export const RARITY_MULTIPLIERS: Record<ChipRarity, number> = {
  COMMON: 1.0,
  RARE: 1.5,
  EPIC: 2.0,
  LEGENDARY: 3.0,
};

// All available chip types (48 total)
export const CHIP_DEFINITIONS: Chip[] = [
  // ============================================
  // 🔥 ATTACK CHIPS (12 Total) - Increase damage output
  // ============================================
  
  // --- Common Attack Chips (3) ---
  {
    id: 'atk_plasma_core',
    name: 'Plasma Core',
    type: 'ATTACK',
    rarity: 'COMMON',
    level: 1,
    maxLevel: 10,
    icon: 'zap',
    description: 'Channels plasma energy to boost weapon damage.',
    baseBonus: { damage: 5 },
    upgradeCost: 100,
    upgradeCostMultiplier: 1.5,
  },
  {
    id: 'atk_spark_plug',
    name: 'Spark Plug',
    type: 'ATTACK',
    rarity: 'COMMON',
    level: 1,
    maxLevel: 10,
    icon: 'zap',
    description: 'Electric discharge amplifier for consistent damage.',
    baseBonus: { damage: 3, critRate: 1 },
    upgradeCost: 100,
    upgradeCostMultiplier: 1.5,
  },
  {
    id: 'atk_voltage_spike',
    name: 'Voltage Spike',
    type: 'ATTACK',
    rarity: 'COMMON',
    level: 1,
    maxLevel: 10,
    icon: 'activity',
    description: 'Power surge module for faster, stronger attacks.',
    baseBonus: { damage: 4, attackSpeed: 2 },
    upgradeCost: 100,
    upgradeCostMultiplier: 1.5,
  },

  // --- Rare Attack Chips (3) ---
  {
    id: 'atk_fury_driver',
    name: 'Fury Driver',
    type: 'ATTACK',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'flame',
    description: 'Overclocked processor that amplifies attack power.',
    baseBonus: { damage: 8, damagePercent: 5 },
    upgradeCost: 250,
    upgradeCostMultiplier: 1.6,
  },
  {
    id: 'atk_razor_edge',
    name: 'Razor Edge',
    type: 'ATTACK',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'crosshair',
    description: 'Precision cutting algorithms for critical strikes.',
    baseBonus: { damage: 6, critRate: 3, critDamage: 10 },
    upgradeCost: 250,
    upgradeCostMultiplier: 1.6,
  },
  {
    id: 'atk_inferno_core',
    name: 'Inferno Core',
    type: 'ATTACK',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'flame',
    description: 'Superheated plasma enhances splash damage.',
    baseBonus: { damage: 10, splashRadius: 5 },
    upgradeCost: 250,
    upgradeCostMultiplier: 1.6,
  },

  // --- Epic Attack Chips (3) ---
  {
    id: 'atk_berserker_module',
    name: 'Berserker Module',
    type: 'ATTACK',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'crosshair',
    description: 'Aggressive combat protocols for maximum devastation.',
    baseBonus: { damage: 12, damagePercent: 8, critDamage: 10 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },
  {
    id: 'atk_assassin_protocol',
    name: 'Assassin Protocol',
    type: 'ATTACK',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'target',
    description: 'Stealth targeting system for lethal precision.',
    baseBonus: { damage: 8, critRate: 8, critDamage: 25 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },
  {
    id: 'atk_devastator',
    name: 'Devastator Chip',
    type: 'ATTACK',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'flame',
    description: 'Heavy ordinance amplifier for massive damage.',
    baseBonus: { damage: 15, damagePercent: 10, splashRadius: 5 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },

  // --- Legendary Attack Chips (3) ---
  {
    id: 'atk_annihilator',
    name: 'Annihilator Core',
    type: 'ATTACK',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'target',
    description: 'Legendary combat chip with devastating power.',
    baseBonus: { damage: 20, damagePercent: 12, critRate: 5, critDamage: 20 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'atk_omega_strike',
    name: 'Omega Strike',
    type: 'ATTACK',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'zap',
    description: 'The pinnacle of offensive technology.',
    baseBonus: { damage: 25, damagePercent: 15, critRate: 10 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'atk_godslayer',
    name: 'Godslayer Module',
    type: 'ATTACK',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'target',
    description: 'Specifically designed to eliminate boss-class threats.',
    baseBonus: { damage: 30, bossDamage: 20 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },

  // ============================================
  // 🛡️ DEFENSE CHIPS (12 Total) - Increase survivability
  // ============================================
  
  // --- Common Defense Chips (3) ---
  {
    id: 'def_nano_plating',
    name: 'Nano Plating',
    type: 'DEFENSE',
    rarity: 'COMMON',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Nanoscale armor plating for basic protection.',
    baseBonus: { hp: 100 },
    upgradeCost: 100,
    upgradeCostMultiplier: 1.5,
  },
  {
    id: 'def_barrier_node',
    name: 'Barrier Node',
    type: 'DEFENSE',
    rarity: 'COMMON',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Generates a protective energy barrier.',
    baseBonus: { hp: 80, defense: 2 },
    upgradeCost: 100,
    upgradeCostMultiplier: 1.5,
  },
  {
    id: 'def_regen_pulse',
    name: 'Regen Pulse',
    type: 'DEFENSE',
    rarity: 'COMMON',
    level: 1,
    maxLevel: 10,
    icon: 'activity',
    description: 'Continuous repair nanobots for sustained health.',
    baseBonus: { hp: 50, hpRegen: 1 },
    upgradeCost: 100,
    upgradeCostMultiplier: 1.5,
  },

  // --- Rare Defense Chips (3) ---
  {
    id: 'def_reactive_armor',
    name: 'Reactive Armor',
    type: 'DEFENSE',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Advanced armor that adapts to incoming damage.',
    baseBonus: { hp: 150, defense: 3 },
    upgradeCost: 250,
    upgradeCostMultiplier: 1.6,
  },
  {
    id: 'def_absorption_matrix',
    name: 'Absorption Matrix',
    type: 'DEFENSE',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Converts incoming damage to shield energy.',
    baseBonus: { hp: 120, defense: 5 },
    upgradeCost: 250,
    upgradeCostMultiplier: 1.6,
  },
  {
    id: 'def_guardian_shell',
    name: 'Guardian Shell',
    type: 'DEFENSE',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Multi-layer defense with evasion protocols.',
    baseBonus: { hp: 100, defense: 4, dodge: 3 },
    upgradeCost: 250,
    upgradeCostMultiplier: 1.6,
  },

  // --- Epic Defense Chips (3) ---
  {
    id: 'def_fortress_protocol',
    name: 'Fortress Protocol',
    type: 'DEFENSE',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Military-grade defensive system.',
    baseBonus: { hp: 250, hpPercent: 5, defense: 5 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },
  {
    id: 'def_immortal_frame',
    name: 'Immortal Frame',
    type: 'DEFENSE',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Near-indestructible chassis reinforcement.',
    baseBonus: { hp: 200, hpPercent: 8, defense: 8 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },
  {
    id: 'def_void_barrier',
    name: 'Void Barrier',
    type: 'DEFENSE',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Phase-shifting barrier for damage avoidance.',
    baseBonus: { hp: 180, defense: 10, dodge: 5 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },

  // --- Legendary Defense Chips (3) ---
  {
    id: 'def_titan_core',
    name: 'Titan Core',
    type: 'DEFENSE',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Legendary defensive matrix of unparalleled protection.',
    baseBonus: { hp: 500, hpPercent: 10, defense: 10 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'def_eternal_guard',
    name: 'Eternal Guard',
    type: 'DEFENSE',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Transcendent protection technology.',
    baseBonus: { hp: 400, hpPercent: 15, defense: 15 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'def_phoenix_core',
    name: 'Phoenix Core',
    type: 'DEFENSE',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'flame',
    description: 'Rise from defeat. Grants one revival per battle.',
    baseBonus: { hp: 300, revive: 1 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },

  // ============================================
  // ⚡ UTILITY CHIPS (16 Total) - Various bonuses
  // ============================================
  
  // --- Common Utility Chips (3) ---
  {
    id: 'util_precision_optics',
    name: 'Precision Optics',
    type: 'UTILITY',
    rarity: 'COMMON',
    level: 1,
    maxLevel: 10,
    icon: 'crosshair',
    description: 'Enhanced targeting for improved critical hits.',
    baseBonus: { critRate: 2 },
    upgradeCost: 100,
    upgradeCostMultiplier: 1.5,
  },
  {
    id: 'util_coin_magnet',
    name: 'Coin Magnet',
    type: 'UTILITY',
    rarity: 'COMMON',
    level: 1,
    maxLevel: 10,
    icon: 'coins',
    description: 'Magnetizes nearby gold for increased collection.',
    baseBonus: { goldBonus: 5 },
    upgradeCost: 100,
    upgradeCostMultiplier: 1.5,
  },
  {
    id: 'util_quick_loader',
    name: 'Quick Loader',
    type: 'UTILITY',
    rarity: 'COMMON',
    level: 1,
    maxLevel: 10,
    icon: 'activity',
    description: 'Faster ammunition cycling for quicker fire rate.',
    baseBonus: { attackSpeed: 3 },
    upgradeCost: 100,
    upgradeCostMultiplier: 1.5,
  },

  // --- Rare Utility Chips (4) ---
  {
    id: 'util_velocity_boost',
    name: 'Velocity Boost',
    type: 'UTILITY',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'activity',
    description: 'Accelerated firing systems for faster attacks.',
    baseBonus: { attackSpeed: 5, critRate: 2 },
    upgradeCost: 250,
    upgradeCostMultiplier: 1.6,
  },
  {
    id: 'util_scavenger_node',
    name: 'Scavenger Node',
    type: 'UTILITY',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'coins',
    description: 'Resource extraction protocols for bonus gold.',
    baseBonus: { goldBonus: 10 },
    upgradeCost: 300,
    upgradeCostMultiplier: 1.6,
  },
  {
    id: 'util_lucky_charm',
    name: 'Lucky Charm',
    type: 'UTILITY',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'sparkles',
    description: 'Increases gem drop rate from enemies.',
    baseBonus: { gemChance: 3 },
    upgradeCost: 300,
    upgradeCostMultiplier: 1.6,
  },
  {
    id: 'util_energy_cell',
    name: 'Energy Cell',
    type: 'UTILITY',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'battery',
    description: 'Additional power storage for abilities.',
    baseBonus: { energyMax: 10 },
    upgradeCost: 250,
    upgradeCostMultiplier: 1.6,
  },

  // --- Epic Utility Chips (4) ---
  {
    id: 'util_overdrive_system',
    name: 'Overdrive System',
    type: 'UTILITY',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'cpu',
    description: 'Pushes all systems beyond normal limits.',
    baseBonus: { attackSpeed: 8, critRate: 3, critDamage: 15 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },
  {
    id: 'util_treasure_hunter',
    name: 'Treasure Hunter',
    type: 'UTILITY',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'coins',
    description: 'Maximum resource acquisition protocols.',
    baseBonus: { goldBonus: 20, gemChance: 5 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },
  {
    id: 'util_hypercharge',
    name: 'Hypercharge Node',
    type: 'UTILITY',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'zap',
    description: 'Extreme power cycling for rapid attacks.',
    baseBonus: { attackSpeed: 12, energyMax: 5 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },
  {
    id: 'util_synergy_core',
    name: 'Synergy Core',
    type: 'UTILITY',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'cpu',
    description: 'Amplifies all other chip bonuses by 10%.',
    baseBonus: { chipAmplify: 10 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },

  // --- Legendary Utility Chips (5) ---
  {
    id: 'util_quantum_core',
    name: 'Quantum Core',
    type: 'UTILITY',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'cpu',
    description: 'Quantum-enhanced processing for all combat systems.',
    baseBonus: { attackSpeed: 12, critRate: 5, critDamage: 25, goldBonus: 15, energyMax: 10 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'util_infinity_loop',
    name: 'Infinity Loop',
    type: 'UTILITY',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'cpu',
    description: 'Time-bending technology reduces all cooldowns.',
    baseBonus: { cooldownReduction: 20 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'util_jackpot_module',
    name: 'Jackpot Module',
    type: 'UTILITY',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'coins',
    description: 'Maximum wealth extraction technology.',
    baseBonus: { goldBonus: 50, gemChance: 10 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'util_omnichip',
    name: 'Omnichip',
    type: 'UTILITY',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'sparkles',
    description: 'The ultimate chip. Enhances everything.',
    baseBonus: { 
      damage: 5, 
      damagePercent: 5, 
      hp: 100, 
      hpPercent: 5, 
      defense: 5, 
      critRate: 5, 
      critDamage: 10, 
      attackSpeed: 5, 
      goldBonus: 10 
    },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'util_chaos_engine',
    name: 'Chaos Engine',
    type: 'UTILITY',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'cpu',
    description: 'Unpredictable quantum effects. Rerolls bonus each battle.',
    baseBonus: { random: true },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },

  // ============================================
  // 🎯 SPECIAL CHIPS (8 Total) - Unique mechanics
  // ============================================
  
  // --- Rare Special Chips (2) ---
  {
    id: 'spec_chain_lightning',
    name: 'Chain Lightning',
    type: 'SPECIAL',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'zap',
    description: 'Attacks have 15% chance to chain to nearby enemies.',
    baseBonus: { chainChance: 15, chainTargets: 2 },
    upgradeCost: 300,
    upgradeCostMultiplier: 1.6,
  },
  {
    id: 'spec_frozen_core',
    name: 'Frozen Core',
    type: 'SPECIAL',
    rarity: 'RARE',
    level: 1,
    maxLevel: 10,
    icon: 'snowflake',
    description: '10% chance to freeze enemies for 1 second.',
    baseBonus: { freezeChance: 10, freezeDuration: 1000 },
    upgradeCost: 300,
    upgradeCostMultiplier: 1.6,
  },

  // --- Epic Special Chips (3) ---
  {
    id: 'spec_vampiric_shard',
    name: 'Vampiric Shard',
    type: 'SPECIAL',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'droplet',
    description: 'Lifesteal: Heal 5% of damage dealt.',
    baseBonus: { lifesteal: 5 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },
  {
    id: 'spec_mirror_shield',
    name: 'Mirror Shield',
    type: 'SPECIAL',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'shield',
    description: 'Reflect 10% of damage taken back to attackers.',
    baseBonus: { reflect: 10 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },
  {
    id: 'spec_time_dilation',
    name: 'Time Dilation',
    type: 'SPECIAL',
    rarity: 'EPIC',
    level: 1,
    maxLevel: 10,
    icon: 'clock',
    description: '5% chance on hit to slow all enemies for 2 seconds.',
    baseBonus: { globalSlowChance: 5, slowDuration: 2000, slowPercent: 30 },
    upgradeCost: 500,
    upgradeCostMultiplier: 1.7,
  },

  // --- Legendary Special Chips (3) ---
  {
    id: 'spec_nuclear_core',
    name: 'Nuclear Core',
    type: 'SPECIAL',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'flame',
    description: 'Enemies explode on death, dealing 10% HP as AoE damage.',
    baseBonus: { deathExplosion: true, explosionDamage: 10 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'spec_gravity_well',
    name: 'Gravity Well',
    type: 'SPECIAL',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'target',
    description: 'Creates gravity field that slowly pulls enemies toward base.',
    baseBonus: { gravityPull: 0.1 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
  {
    id: 'spec_ascension',
    name: 'Ascension Protocol',
    type: 'SPECIAL',
    rarity: 'LEGENDARY',
    level: 1,
    maxLevel: 10,
    icon: 'sparkles',
    description: 'Gain +2% to all stats for each wave survived.',
    baseBonus: { waveScaling: 2 },
    upgradeCost: 1000,
    upgradeCostMultiplier: 1.8,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * All chips combined for easy access
 */
export const ALL_CHIPS = CHIP_DEFINITIONS;

/**
 * Get chip definition by ID
 */
export const getChipById = (chipId: string): Chip | undefined => {
  return CHIP_DEFINITIONS.find(c => c.id === chipId);
};

/**
 * Calculate chip bonus at a specific level
 * Bonuses scale linearly with level, multiplied by rarity
 * Special effects (booleans, fixed values) don't scale
 */
export const calculateChipBonus = (chip: Chip, level: number): ChipBonus => {
  const rarityMult = RARITY_MULTIPLIERS[chip.rarity];
  const levelMult = level;
  
  const result: ChipBonus = {};
  
  // Standard scaling stats (linear with level * rarity)
  if (chip.baseBonus.damage) {
    result.damage = Math.floor(chip.baseBonus.damage * levelMult * rarityMult);
  }
  if (chip.baseBonus.damagePercent) {
    result.damagePercent = chip.baseBonus.damagePercent * levelMult * rarityMult;
  }
  if (chip.baseBonus.hp) {
    result.hp = Math.floor(chip.baseBonus.hp * levelMult * rarityMult);
  }
  if (chip.baseBonus.hpPercent) {
    result.hpPercent = chip.baseBonus.hpPercent * levelMult * rarityMult;
  }
  if (chip.baseBonus.defense) {
    result.defense = chip.baseBonus.defense * levelMult * rarityMult;
  }
  if (chip.baseBonus.critRate) {
    result.critRate = chip.baseBonus.critRate * levelMult * rarityMult;
  }
  if (chip.baseBonus.critDamage) {
    result.critDamage = chip.baseBonus.critDamage * levelMult * rarityMult;
  }
  if (chip.baseBonus.attackSpeed) {
    result.attackSpeed = chip.baseBonus.attackSpeed * levelMult * rarityMult;
  }
  if (chip.baseBonus.goldBonus) {
    result.goldBonus = chip.baseBonus.goldBonus * levelMult * rarityMult;
  }
  if (chip.baseBonus.energyMax) {
    result.energyMax = Math.floor(chip.baseBonus.energyMax * levelMult * rarityMult);
  }
  
  // New scaling stats for expanded chip roster
  if (chip.baseBonus.hpRegen) {
    result.hpRegen = chip.baseBonus.hpRegen * levelMult * rarityMult;
  }
  if (chip.baseBonus.dodge) {
    result.dodge = chip.baseBonus.dodge * levelMult * rarityMult;
  }
  if (chip.baseBonus.splashRadius) {
    result.splashRadius = chip.baseBonus.splashRadius * levelMult * rarityMult;
  }
  if (chip.baseBonus.bossDamage) {
    result.bossDamage = chip.baseBonus.bossDamage * levelMult * rarityMult;
  }
  if (chip.baseBonus.gemChance) {
    result.gemChance = chip.baseBonus.gemChance * levelMult * rarityMult;
  }
  if (chip.baseBonus.cooldownReduction) {
    result.cooldownReduction = chip.baseBonus.cooldownReduction * levelMult * rarityMult;
  }
  if (chip.baseBonus.chipAmplify) {
    result.chipAmplify = chip.baseBonus.chipAmplify * levelMult * rarityMult;
  }
  if (chip.baseBonus.revive !== undefined) {
    // Revive scales slower - +1 revive per 5 levels at legendary
    result.revive = Math.floor(chip.baseBonus.revive + (levelMult - 1) * 0.2);
  }
  
  // Special chip effects (scale with level but have special behaviors)
  if (chip.baseBonus.chainChance) {
    result.chainChance = chip.baseBonus.chainChance + (levelMult - 1) * 2;  // +2% per level
    result.chainTargets = (chip.baseBonus.chainTargets || 2) + Math.floor((levelMult - 1) / 3);  // +1 target every 3 levels
  }
  if (chip.baseBonus.freezeChance) {
    result.freezeChance = chip.baseBonus.freezeChance + (levelMult - 1) * 1.5;  // +1.5% per level
    result.freezeDuration = (chip.baseBonus.freezeDuration || 1000) + (levelMult - 1) * 100;  // +100ms per level
  }
  if (chip.baseBonus.lifesteal) {
    result.lifesteal = chip.baseBonus.lifesteal + (levelMult - 1) * 0.5;  // +0.5% per level
  }
  if (chip.baseBonus.reflect) {
    result.reflect = chip.baseBonus.reflect + (levelMult - 1) * 1;  // +1% per level
  }
  if (chip.baseBonus.globalSlowChance) {
    result.globalSlowChance = chip.baseBonus.globalSlowChance + (levelMult - 1) * 0.5;  // +0.5% per level
    result.slowDuration = chip.baseBonus.slowDuration || 2000;
    result.slowPercent = (chip.baseBonus.slowPercent || 30) + (levelMult - 1) * 2;  // +2% slow per level
  }
  if (chip.baseBonus.deathExplosion) {
    result.deathExplosion = true;
    result.explosionDamage = (chip.baseBonus.explosionDamage || 10) + (levelMult - 1) * 2;  // +2% per level
  }
  if (chip.baseBonus.gravityPull) {
    result.gravityPull = chip.baseBonus.gravityPull + (levelMult - 1) * 0.02;  // +0.02 per level
  }
  if (chip.baseBonus.waveScaling) {
    result.waveScaling = chip.baseBonus.waveScaling + (levelMult - 1) * 0.3;  // +0.3% per level
  }
  if (chip.baseBonus.random) {
    result.random = true;  // Boolean doesn't scale
  }
  
  return result;
};

/**
 * Calculate upgrade cost for a chip at a specific level
 */
export const calculateUpgradeCost = (chip: Chip, currentLevel: number): number => {
  return Math.floor(chip.upgradeCost * Math.pow(chip.upgradeCostMultiplier, currentLevel - 1));
};

/**
 * Calculate total bonuses from all equipped chips
 * Includes support for all 48 chip types
 */
export const calculateTotalChipBonuses = (ownedChips: OwnedChip[]): ChipBonus => {
  const total: ChipBonus = {
    // Standard combat stats
    damage: 0,
    damagePercent: 0,
    hp: 0,
    hpPercent: 0,
    defense: 0,
    critRate: 0,
    critDamage: 0,
    attackSpeed: 0,
    goldBonus: 0,
    energyMax: 0,
    // Expanded roster stats
    hpRegen: 0,
    dodge: 0,
    splashRadius: 0,
    bossDamage: 0,
    gemChance: 0,
    cooldownReduction: 0,
    chipAmplify: 0,
    revive: 0,
    // Special effects (accumulated)
    chainChance: 0,
    chainTargets: 0,
    freezeChance: 0,
    freezeDuration: 0,
    lifesteal: 0,
    reflect: 0,
    globalSlowChance: 0,
    slowDuration: 0,
    slowPercent: 0,
    explosionDamage: 0,
    gravityPull: 0,
    waveScaling: 0,
  };
  
  ownedChips.filter(oc => oc.equipped).forEach(ownedChip => {
    const chip = getChipById(ownedChip.chipId);
    if (!chip) return;
    
    const bonus = calculateChipBonus(chip, ownedChip.level);
    
    // Standard stats
    total.damage = (total.damage || 0) + (bonus.damage || 0);
    total.damagePercent = (total.damagePercent || 0) + (bonus.damagePercent || 0);
    total.hp = (total.hp || 0) + (bonus.hp || 0);
    total.hpPercent = (total.hpPercent || 0) + (bonus.hpPercent || 0);
    total.defense = (total.defense || 0) + (bonus.defense || 0);
    total.critRate = (total.critRate || 0) + (bonus.critRate || 0);
    total.critDamage = (total.critDamage || 0) + (bonus.critDamage || 0);
    total.attackSpeed = (total.attackSpeed || 0) + (bonus.attackSpeed || 0);
    total.goldBonus = (total.goldBonus || 0) + (bonus.goldBonus || 0);
    total.energyMax = (total.energyMax || 0) + (bonus.energyMax || 0);
    
    // Expanded roster stats
    total.hpRegen = (total.hpRegen || 0) + (bonus.hpRegen || 0);
    total.dodge = (total.dodge || 0) + (bonus.dodge || 0);
    total.splashRadius = (total.splashRadius || 0) + (bonus.splashRadius || 0);
    total.bossDamage = (total.bossDamage || 0) + (bonus.bossDamage || 0);
    total.gemChance = (total.gemChance || 0) + (bonus.gemChance || 0);
    total.cooldownReduction = (total.cooldownReduction || 0) + (bonus.cooldownReduction || 0);
    total.chipAmplify = (total.chipAmplify || 0) + (bonus.chipAmplify || 0);
    total.revive = (total.revive || 0) + (bonus.revive || 0);
    
    // Special effects (additive)
    total.chainChance = (total.chainChance || 0) + (bonus.chainChance || 0);
    total.chainTargets = Math.max(total.chainTargets || 0, bonus.chainTargets || 0);  // Take highest
    total.freezeChance = (total.freezeChance || 0) + (bonus.freezeChance || 0);
    total.freezeDuration = Math.max(total.freezeDuration || 0, bonus.freezeDuration || 0);  // Take highest
    total.lifesteal = (total.lifesteal || 0) + (bonus.lifesteal || 0);
    total.reflect = (total.reflect || 0) + (bonus.reflect || 0);
    total.globalSlowChance = (total.globalSlowChance || 0) + (bonus.globalSlowChance || 0);
    total.slowDuration = Math.max(total.slowDuration || 0, bonus.slowDuration || 0);  // Take highest
    total.slowPercent = Math.max(total.slowPercent || 0, bonus.slowPercent || 0);  // Take highest
    total.explosionDamage = (total.explosionDamage || 0) + (bonus.explosionDamage || 0);
    total.gravityPull = (total.gravityPull || 0) + (bonus.gravityPull || 0);
    total.waveScaling = (total.waveScaling || 0) + (bonus.waveScaling || 0);
    
    // Boolean flags
    if (bonus.deathExplosion) total.deathExplosion = true;
    if (bonus.random) total.random = true;
  });
  
  return total;
};

/**
 * Get rarity color for UI
 */
export const getChipRarityColor = (rarity: ChipRarity): string => {
  switch (rarity) {
    case 'LEGENDARY': return '#FFD700';
    case 'EPIC': return '#BC13FE';
    case 'RARE': return '#00F0FF';
    default: return '#888888';
  }
};

/**
 * Get rarity border class for UI
 */
export const getChipRarityBorder = (rarity: ChipRarity): string => {
  switch (rarity) {
    case 'LEGENDARY': return 'border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.3)]';
    case 'EPIC': return 'border-purple-500 shadow-[0_0_15px_rgba(188,19,254,0.3)]';
    case 'RARE': return 'border-cyber-blue shadow-[0_0_15px_rgba(0,240,255,0.3)]';
    default: return 'border-gray-600';
  }
};

// ============================================
// STARTER CHIPS (given to new players)
// ============================================
export const STARTER_CHIPS: OwnedChip[] = [
  { chipId: 'atk_plasma_core', instanceId: 'starter_atk_1', level: 2, equipped: true, slotIndex: 0 },
  { chipId: 'def_nano_plating', instanceId: 'starter_def_1', level: 4, equipped: true, slotIndex: 1 },
  { chipId: 'util_precision_optics', instanceId: 'starter_util_1', level: 1, equipped: true, slotIndex: 2 },
  { chipId: 'atk_fury_driver', instanceId: 'starter_atk_2', level: 1, equipped: true, slotIndex: 3 },
  { chipId: 'util_velocity_boost', instanceId: 'starter_util_2', level: 3, equipped: true, slotIndex: 4 },
  { chipId: 'def_reactive_armor', instanceId: 'starter_def_2', level: 1, equipped: true, slotIndex: 5 },
];

export const INITIAL_CHIP_SLOTS: (string | null)[] = [
  'starter_atk_1',
  'starter_def_1', 
  'starter_util_1',
  'starter_atk_2',
  'starter_util_2',
  'starter_def_2',
];
