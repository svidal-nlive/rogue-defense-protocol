// Upgrade Synergies System
// Detects combinations of upgraded skills and applies bonus multipliers
// Creates strategic decision-making around skill upgrade order

import { SkillNode } from '../types';

export interface Synergy {
  id: string;
  name: string;
  description: string;
  requiredSkills: string[];  // Skill IDs that must be upgraded
  minLevels: { [skillId: string]: number }; // Minimum level for each skill
  bonusType: 'damage' | 'defense' | 'utility' | 'mixed';
  bonusValue: number | { [key: string]: number }; // Multiplier or flat bonus
  icon: string;
}

// Define all synergies between skills
export const SYNERGIES: Synergy[] = [
  // Offense Synergies
  {
    id: 'syn_rapid_death',
    name: 'Rapid Death',
    description: 'Rapid Fire + Death Ray: Rapid Fire boosts damage further when Death Ray is active.',
    requiredSkills: ['o2', 'o5'],
    minLevels: { 'o2': 1, 'o5': 1 },
    bonusType: 'damage',
    bonusValue: 1.25, // 25% damage bonus
    icon: '⚡',
  },
  {
    id: 'syn_multishot_master',
    name: 'Multishot Master',
    description: 'Rapid Fire + Multi-Shot: Increases multi-shot proc chance to 20%.',
    requiredSkills: ['o2', 'o4'],
    minLevels: { 'o2': 2, 'o4': 1 },
    bonusType: 'damage',
    bonusValue: 1.2, // 20% damage bonus from extra shots
    icon: '◆',
  },
  {
    id: 'syn_critical_precision',
    name: 'Critical Precision',
    description: 'Crit Optics + Multi-Shot: Critical hits proc Multi-Shot more often.',
    requiredSkills: ['o3', 'o4'],
    minLevels: { 'o3': 2, 'o4': 1 },
    bonusType: 'damage',
    bonusValue: { critDamage: 1.3 }, // 30% crit damage boost
    icon: '⦿',
  },
  {
    id: 'syn_plasma_annihilation',
    name: 'Plasma Annihilation',
    description: 'Plasma Core + Annihilation: Every kill heals 5% max HP.',
    requiredSkills: ['o1', 'o7'],
    minLevels: { 'o1': 3, 'o7': 1 },
    bonusType: 'mixed',
    bonusValue: { lifeSteal: 0.05 }, // 5% HP per kill
    icon: '◉',
  },
  {
    id: 'syn_overcharge_mastery',
    name: 'Overcharge Mastery',
    description: 'Overcharge + Plasma Core: Overcharge cooldown reduced by 50%.',
    requiredSkills: ['o6', 'o1'],
    minLevels: { 'o6': 1, 'o1': 5 },
    bonusType: 'utility',
    bonusValue: { cooldownReduction: 0.5 }, // 50% cooldown reduction
    icon: '⚡⚡',
  },

  // Defense Synergies
  {
    id: 'syn_defensive_shield',
    name: 'Defensive Shield',
    description: 'Nano Plating + Forcefield: Forcefield blocks extra attacks.',
    requiredSkills: ['d1', 'd4'],
    minLevels: { 'd1': 3, 'd4': 2 },
    bonusType: 'defense',
    bonusValue: 1.15, // 15% effective defense boost
    icon: '■',
  },
  {
    id: 'syn_thorny_reflection',
    name: 'Thorny Reflection',
    description: 'Thorns + Regen Field: Reflected damage heals you.',
    requiredSkills: ['d3', 'd2'],
    minLevels: { 'd3': 2, 'd2': 2 },
    bonusType: 'defense',
    bonusValue: { damageReflection: 0.2 }, // 20% damage reflection
    icon: '※',
  },
  {
    id: 'syn_titan_fortress',
    name: 'Titan Fortress',
    description: 'Titan Hull + Nano Plating: Defense multiplied 1.5x.',
    requiredSkills: ['d5', 'd1'],
    minLevels: { 'd5': 1, 'd1': 8 },
    bonusType: 'defense',
    bonusValue: 1.5, // 50% defense bonus
    icon: '▲',
  },

  // Utility Synergies
  {
    id: 'syn_energy_scavenger',
    name: 'Energy Scavenger',
    description: 'Scavenger + Battery: Energy recharges 20% faster.',
    requiredSkills: ['u1', 'u2'],
    minLevels: { 'u1': 2, 'u2': 2 },
    bonusType: 'utility',
    bonusValue: { energyRechargeRate: 1.2 }, // 20% faster energy regen
    icon: '◯',
  },
  {
    id: 'syn_overclock_rush',
    name: 'Overclock Rush',
    description: 'Overclock + Scavenger: Killing enemies reduces cooldowns by 0.5s.',
    requiredSkills: ['u3', 'u1'],
    minLevels: { 'u3': 3, 'u1': 3 },
    bonusType: 'utility',
    bonusValue: { cooldownOnKill: 0.5 }, // 0.5s cooldown reduction per kill
    icon: '→',
  },
  {
    id: 'syn_lucky_scavenger',
    name: 'Lucky Scavenger',
    description: 'Lucky Shot + Scavenger: Instakill drops triple gold.',
    requiredSkills: ['u4', 'u1'],
    minLevels: { 'u4': 2, 'u1': 4 },
    bonusType: 'utility',
    bonusValue: { goldMultiplierOnKill: 3.0 }, // 3x gold from lucky kills
    icon: '✦',
  },

  // Cross-Category Synergies
  {
    id: 'syn_offensive_fortress',
    name: 'Offensive Fortress',
    description: 'Plasma Core + Titan Hull: 15% damage + 25% defense.',
    requiredSkills: ['o1', 'd5'],
    minLevels: { 'o1': 4, 'd5': 1 },
    bonusType: 'mixed',
    bonusValue: { damage: 1.15, defense: 1.25 }, // Combined bonuses
    icon: '◊',
  },
];

/**
 * Get active synergies based on current skill levels
 */
export function getActiveSynergies(skillNodes: SkillNode[]): Synergy[] {
  const activeSynergies: Synergy[] = [];
  
  for (const synergy of SYNERGIES) {
    // Check if all required skills are present and meet minimum levels
    const allRequirementsMet = synergy.requiredSkills.every(skillId => {
      const skill = skillNodes.find(s => s.id === skillId);
      const minLevel = synergy.minLevels[skillId] || 0;
      return skill && skill.currentLevel >= minLevel;
    });
    
    if (allRequirementsMet) {
      activeSynergies.push(synergy);
    }
  }
  
  return activeSynergies;
}

/**
 * Calculate cumulative bonuses from all active synergies
 * Returns multipliers for damage, defense, and other stats
 */
export function calculateSynergyBonuses(skillNodes: SkillNode[]): {
  damage: number;
  defense: number;
  critDamage: number;
  energyRegen: number;
  cooldownReduction: number;
  lifeSteal: number;
  damageReflection: number;
} {
  const activeSynergies = getActiveSynergies(skillNodes);
  
  const bonuses = {
    damage: 1.0,
    defense: 1.0,
    critDamage: 1.0,
    energyRegen: 1.0,
    cooldownReduction: 0.0,
    lifeSteal: 0.0,
    damageReflection: 0.0,
  };
  
  for (const synergy of activeSynergies) {
    if (typeof synergy.bonusValue === 'number') {
      // Simple multiplier bonuses
      if (synergy.bonusType === 'damage') {
        bonuses.damage *= synergy.bonusValue;
      } else if (synergy.bonusType === 'defense') {
        bonuses.defense *= synergy.bonusValue;
      }
    } else {
      // Object-based bonuses
      if (synergy.bonusValue.damage) bonuses.damage *= synergy.bonusValue.damage;
      if (synergy.bonusValue.defense) bonuses.defense *= synergy.bonusValue.defense;
      if (synergy.bonusValue.critDamage) bonuses.critDamage *= synergy.bonusValue.critDamage;
      if (synergy.bonusValue.energyRechargeRate) bonuses.energyRegen *= synergy.bonusValue.energyRechargeRate;
      if (synergy.bonusValue.cooldownReduction) bonuses.cooldownReduction += synergy.bonusValue.cooldownReduction;
      if (synergy.bonusValue.cooldownOnKill) bonuses.cooldownReduction += synergy.bonusValue.cooldownOnKill * 0.1;
      if (synergy.bonusValue.lifeSteal) bonuses.lifeSteal += synergy.bonusValue.lifeSteal;
      if (synergy.bonusValue.damageReflection) bonuses.damageReflection += synergy.bonusValue.damageReflection;
    }
  }
  
  return bonuses;
}

/**
 * Get synergies that are "almost unlocked" (one level away)
 * Useful for UI suggestions
 */
export function getUpcomingSynergies(skillNodes: SkillNode[]): Synergy[] {
  const upcomingSynergies: Synergy[] = [];
  
  for (const synergy of SYNERGIES) {
    // Skip if already active
    const isActive = synergy.requiredSkills.every(skillId => {
      const skill = skillNodes.find(s => s.id === skillId);
      const minLevel = synergy.minLevels[skillId] || 0;
      return skill && skill.currentLevel >= minLevel;
    });
    
    if (isActive) continue;
    
    // Check if "almost unlocked" (all but one requirement met, or one level away)
    let alreadyMet = 0;
    let levelShort = false;
    
    for (const skillId of synergy.requiredSkills) {
      const skill = skillNodes.find(s => s.id === skillId);
      const minLevel = synergy.minLevels[skillId] || 0;
      
      if (skill) {
        if (skill.currentLevel >= minLevel) {
          alreadyMet++;
        } else if (skill.currentLevel === minLevel - 1) {
          levelShort = true;
        }
      }
    }
    
    // "Upcoming" = all requirements met OR (all but one met AND one level short)
    if (alreadyMet === synergy.requiredSkills.length - 1 && levelShort) {
      upcomingSynergies.push(synergy);
    }
  }
  
  return upcomingSynergies;
}
