import { Skill, PlayerStats, SkillNode } from './types';
import { Zap, Crosshair, Shield, Cpu, Flame, Activity } from 'lucide-react';

export const INITIAL_STATS: PlayerStats = {
  level: 1,           // Fresh player starts at level 1
  gold: 0,            // No starting gold - must earn it
  gems: 0,            // No starting gems
  energy: 30,
  maxEnergy: 30,
  damage: 25,         // Reduced from 35 for balanced early game
  attackSpeed: 1.0,   // Reduced from 1.2 for balanced early game
  critRate: 10,       // Reduced from 15 for balanced early game
  critDamage: 150,
  defense: 0          // New stat: reduces collision damage
};

export const SKILL_TREE: SkillNode[] = [
    // OFFENSE
    { id: 'o1', name: 'Plasma Core', category: 'OFFENSE', description: 'Increases base weapon damage by 10%.', currentLevel: 1, maxLevel: 10, baseCost: 100, costMultiplier: 1.5, icon: 'zap', position: { row: 0, col: 1 } },
    { id: 'o2', name: 'Rapid Fire', category: 'OFFENSE', description: 'Increases attack speed by 5%.', currentLevel: 0, maxLevel: 5, baseCost: 200, costMultiplier: 1.5, parentId: 'o1', icon: 'activity', position: { row: 1, col: 0 } },
    { id: 'o3', name: 'Crit Optics', category: 'OFFENSE', description: 'Increases critical hit chance by 2%.', currentLevel: 0, maxLevel: 5, baseCost: 200, costMultiplier: 1.5, parentId: 'o1', icon: 'crosshair', position: { row: 1, col: 2 } },
    { id: 'o4', name: 'Multi-Shot', category: 'OFFENSE', description: '10% chance to fire an extra projectile.', currentLevel: 0, maxLevel: 3, baseCost: 1000, costMultiplier: 2.0, parentId: 'o2', icon: 'target', position: { row: 2, col: 0 } },
    { id: 'o5', name: 'Death Ray', category: 'OFFENSE', description: 'Unlocks the high-damage laser ability.', currentLevel: 0, maxLevel: 1, baseCost: 2500, costMultiplier: 1, parentId: 'o3', icon: 'flame', position: { row: 2, col: 2 } },
    { id: 'o6', name: 'Overcharge', category: 'OFFENSE', description: 'Ultimate: Temporarily double damage.', currentLevel: 0, maxLevel: 1, baseCost: 5000, costMultiplier: 1, parentId: 'o4', icon: 'zap', position: { row: 3, col: 1 } },
    { id: 'o7', name: 'Annihilation', category: 'OFFENSE', description: 'Passive: Enemies explode on death.', currentLevel: 0, maxLevel: 1, baseCost: 5000, costMultiplier: 1, parentId: 'o5', icon: 'flame', position: { row: 3, col: 2 } },

    // DEFENSE
    { id: 'd1', name: 'Nano Plating', category: 'DEFENSE', description: '+5 Defense per level (reduces collision damage).', currentLevel: 0, maxLevel: 10, baseCost: 100, costMultiplier: 1.2, icon: 'shield', position: { row: 0, col: 1 } },
    { id: 'd2', name: 'Regen Field', category: 'DEFENSE', description: 'Recover 1% HP per second.', currentLevel: 0, maxLevel: 5, baseCost: 300, costMultiplier: 1.5, parentId: 'd1', icon: 'activity', position: { row: 1, col: 1 } },
    { id: 'd3', name: 'Thorns', category: 'DEFENSE', description: 'Reflect 10% damage back to attackers.', currentLevel: 0, maxLevel: 5, baseCost: 400, costMultiplier: 1.5, parentId: 'd2', icon: 'zap', position: { row: 2, col: 0 } },
    { id: 'd4', name: 'Forcefield', category: 'DEFENSE', description: 'Blocks one attack every 10 seconds.', currentLevel: 0, maxLevel: 3, baseCost: 800, costMultiplier: 2.0, parentId: 'd2', icon: 'shield', position: { row: 2, col: 2 } },
    { id: 'd5', name: 'Titan Hull', category: 'DEFENSE', description: '+25 Defense. Become nearly impervious to weak enemies.', currentLevel: 0, maxLevel: 1, baseCost: 2000, costMultiplier: 1, parentId: 'd4', icon: 'shield', position: { row: 3, col: 1 } },

    // UTILITY
    { id: 'u1', name: 'Scavenger', category: 'UTILITY', description: 'Enemies drop 10% more Gold.', currentLevel: 0, maxLevel: 5, baseCost: 150, costMultiplier: 1.3, icon: 'coins', position: { row: 0, col: 1 } },
    { id: 'u2', name: 'Battery', category: 'UTILITY', description: 'Increases Max Energy by 5.', currentLevel: 0, maxLevel: 5, baseCost: 250, costMultiplier: 1.4, parentId: 'u1', icon: 'battery', position: { row: 1, col: 0 } },
    { id: 'u3', name: 'Overclock', category: 'UTILITY', description: 'Reduces skill cooldowns by 5%.', currentLevel: 0, maxLevel: 5, baseCost: 400, costMultiplier: 1.6, parentId: 'u1', icon: 'cpu', position: { row: 1, col: 2 } },
    { id: 'u4', name: 'Lucky Shot', category: 'UTILITY', description: '1% chance to instantly kill non-bosses.', currentLevel: 0, maxLevel: 3, baseCost: 1500, costMultiplier: 2.0, parentId: 'u3', icon: 'crosshair', position: { row: 2, col: 1 } },
];

export const SKILLS_DATA: Skill[] = [
  // Keeping this for backwards compatibility if needed, though SkillScreen now uses SKILL_TREE
  {
    id: 'flame_missile',
    name: 'Flame Missile',
    level: 2,
    maxLevel: 10,
    description: 'Launches homing missiles dealing splash damage.',
    cost: 150,
    icon: 'flame',
    color: 'text-orange-500',
    unlocked: true
  },
  {
    id: 'beam',
    name: 'Ion Beam',
    level: 1,
    maxLevel: 10,
    description: 'Fires a continuous beam piercing through enemies.',
    cost: 75,
    icon: 'beam',
    color: 'text-fuchsia-500',
    unlocked: true
  },
  {
    id: 'distortion',
    name: 'Distortion Field',
    level: 2,
    maxLevel: 5,
    description: 'Slows down enemies within range by 30%.',
    cost: 150,
    icon: 'wave',
    color: 'text-green-400',
    unlocked: true
  },
  {
    id: 'mortar',
    name: 'Plasma Mortar',
    level: 1,
    maxLevel: 10,
    description: 'Lobs explosive shells at distant enemies.',
    cost: 75,
    icon: 'target',
    color: 'text-blue-400',
    unlocked: true
  },
  {
    id: 'thunder',
    name: 'Thunder Core',
    level: 1,
    maxLevel: 10,
    description: 'Chains lightning between nearby targets.',
    cost: 75,
    icon: 'zap',
    color: 'text-yellow-400',
    unlocked: false
  },
  {
    id: 'laser',
    name: 'Focus Laser',
    level: 1,
    maxLevel: 10,
    description: 'Single target high damage beam.',
    cost: 75,
    icon: 'crosshair',
    color: 'text-purple-400',
    unlocked: false
  }
];

// Note: INITIAL_CHIPS has been moved to constants/chips.ts as STARTER_CHIPS
// with the new chip system format