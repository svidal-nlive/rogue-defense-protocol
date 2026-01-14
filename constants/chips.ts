import { Chip, ChipBonus, ChipRarity, ChipType, OwnedChip } from '../types';

// ============================================
// CHIP DEFINITIONS
// ============================================

// Rarity multipliers for stat bonuses
export const RARITY_MULTIPLIERS: Record<ChipRarity, number> = {
  COMMON: 1.0,
  RARE: 1.5,
  EPIC: 2.0,
  LEGENDARY: 3.0,
};

// All available chip types
export const CHIP_DEFINITIONS: Chip[] = [
  // ============================================
  // ATTACK CHIPS - Increase damage output
  // ============================================
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

  // ============================================
  // DEFENSE CHIPS - Increase survivability
  // ============================================
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

  // ============================================
  // UTILITY CHIPS - Various bonuses
  // ============================================
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
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get chip definition by ID
 */
export const getChipById = (chipId: string): Chip | undefined => {
  return CHIP_DEFINITIONS.find(c => c.id === chipId);
};

/**
 * Calculate chip bonus at a specific level
 * Bonuses scale linearly with level, multiplied by rarity
 */
export const calculateChipBonus = (chip: Chip, level: number): ChipBonus => {
  const rarityMult = RARITY_MULTIPLIERS[chip.rarity];
  const levelMult = level;
  
  const result: ChipBonus = {};
  
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
 */
export const calculateTotalChipBonuses = (ownedChips: OwnedChip[]): ChipBonus => {
  const total: ChipBonus = {
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
  };
  
  ownedChips.filter(oc => oc.equipped).forEach(ownedChip => {
    const chip = getChipById(ownedChip.chipId);
    if (!chip) return;
    
    const bonus = calculateChipBonus(chip, ownedChip.level);
    
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
