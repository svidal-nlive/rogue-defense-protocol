import { EnemyType } from '../types';

// ============================================
// CENTRALIZED ENEMY DEFINITIONS
// ============================================

/**
 * Complete enemy definition with all stats
 * This is the single source of truth for enemy balance
 */
export interface EnemyDefinition {
  type: EnemyType;
  baseHp: number;           // Base HP at Wave 1
  baseSpeed: number;        // Movement speed (units per ms * delta)
  baseDamage: number;       // Collision damage to player base
  radius: number;           // Hitbox/visual size
  color: string;            // Primary color
  spawnWeight: number;      // Relative spawn probability (0-100)
  goldReward: number;       // Gold dropped on kill
  scoreReward: number;      // Score points on kill
}

/**
 * All enemy type definitions
 * Centralized for easy balancing
 */
export const ENEMY_DEFINITIONS: Record<EnemyType, EnemyDefinition> = {
  [EnemyType.CIRCLE]: {
    type: EnemyType.CIRCLE,
    baseHp: 150,            // Up from 100
    baseSpeed: 0.055,       // Slightly faster than before
    baseDamage: 75,         // Moderate collision damage
    radius: 15,
    color: '#00F0FF',
    spawnWeight: 50,        // Most common
    goldReward: 5,
    scoreReward: 10,
  },
  [EnemyType.TRIANGLE]: {
    type: EnemyType.TRIANGLE,
    baseHp: 200,            // Up from 150
    baseSpeed: 0.045,
    baseDamage: 100,        // Higher damage, faster
    radius: 18,
    color: '#FCEE0A',
    spawnWeight: 25,
    goldReward: 10,
    scoreReward: 15,
  },
  [EnemyType.SQUARE]: {
    type: EnemyType.SQUARE,
    baseHp: 350,            // Tanky
    baseSpeed: 0.035,
    baseDamage: 150,        // High damage, slow
    radius: 20,
    color: '#BC13FE',
    spawnWeight: 10,
    goldReward: 15,
    scoreReward: 25,
  },
  [EnemyType.SWARM]: {
    type: EnemyType.SWARM,
    baseHp: 65,             // Up from 50
    baseSpeed: 0.08,        // Very fast
    baseDamage: 40,         // Low damage per unit
    radius: 8,
    color: '#39FF14',
    spawnWeight: 10,
    goldReward: 2,
    scoreReward: 5,
  },
  [EnemyType.TANK]: {
    type: EnemyType.TANK,
    baseHp: 600,            // Up from 500
    baseSpeed: 0.02,        // Very slow
    baseDamage: 250,        // Very high damage
    radius: 30,
    color: '#8B4513',
    spawnWeight: 5,
    goldReward: 30,
    scoreReward: 50,
  },
  [EnemyType.BOSS]: {
    type: EnemyType.BOSS,
    baseHp: 2500,           // Up from 2000
    baseSpeed: 0.018,
    baseDamage: 500,        // Devastating
    radius: 40,
    color: '#FF003C',
    spawnWeight: 0,         // Special spawn logic, not random
    goldReward: 100,
    scoreReward: 500,
  },
};

// ============================================
// SCALING FORMULAS
// ============================================

/**
 * Calculate enemy HP at a given wave
 * Formula: baseHp × (1 + (wave - 1) × 0.20)
 * 
 * Wave 1:  1.0x multiplier
 * Wave 5:  1.8x multiplier  
 * Wave 10: 2.8x multiplier
 * Wave 20: 4.8x multiplier
 */
export const getEnemyHp = (definition: EnemyDefinition, wave: number): number => {
  const waveMultiplier = 1 + (wave - 1) * 0.20;
  return Math.floor(definition.baseHp * waveMultiplier);
};

/**
 * Calculate collision damage at a given wave with defense reduction
 * Formula: baseDamage × (1 + (wave - 1) × 0.15) - playerDefense
 * 
 * Defense reduces damage by flat amount
 * Minimum damage is always 10% of base to prevent immunity
 */
export const getCollisionDamage = (
  definition: EnemyDefinition, 
  wave: number, 
  playerDefense: number = 0
): number => {
  const waveMultiplier = 1 + (wave - 1) * 0.15;
  const rawDamage = Math.floor(definition.baseDamage * waveMultiplier);
  const reducedDamage = rawDamage - playerDefense;
  const minimumDamage = Math.floor(definition.baseDamage * 0.10);
  return Math.max(reducedDamage, minimumDamage);
};

/**
 * Calculate enemy speed at a given wave
 * Formula: baseSpeed × (1 + (wave - 1) × 0.03)
 * 
 * Gentle 3% increase per wave
 */
export const getEnemySpeed = (definition: EnemyDefinition, wave: number): number => {
  const waveMultiplier = 1 + (wave - 1) * 0.03;
  return definition.baseSpeed * waveMultiplier;
};

/**
 * Calculate spawn interval at a given wave
 * Formula: max(500, 1800 - wave × 100)
 * 
 * Wave 1:  1800ms
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

/**
 * Select enemy type based on spawn weights
 * Returns the enemy type to spawn based on weighted random selection
 */
export const selectEnemyType = (wave: number, isBossWave: boolean, currentBossCount: number): EnemyType => {
  // Boss wave logic: spawn boss if we haven't already
  if (isBossWave && currentBossCount === 0 && Math.random() < 0.15) {
    return EnemyType.BOSS;
  }
  
  // Calculate total weight (excluding boss)
  const eligibleTypes = Object.values(ENEMY_DEFINITIONS).filter(d => d.spawnWeight > 0);
  const totalWeight = eligibleTypes.reduce((sum, d) => sum + d.spawnWeight, 0);
  
  // Weighted random selection
  let roll = Math.random() * totalWeight;
  for (const definition of eligibleTypes) {
    roll -= definition.spawnWeight;
    if (roll <= 0) {
      return definition.type;
    }
  }
  
  // Fallback to most common type
  return EnemyType.CIRCLE;
};

/**
 * Get the definition for an enemy type
 */
export const getEnemyDefinition = (type: EnemyType): EnemyDefinition => {
  return ENEMY_DEFINITIONS[type];
};
