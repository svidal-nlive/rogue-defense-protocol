// Enemy behavior types with distinct AI patterns and strategic implications
// Each behavior adds unique tactical challenges beyond base wave modifiers

export enum BehaviorType {
  STANDARD = 'standard',    // Normal approach behavior
  AGGRESSIVE = 'aggressive', // More dangerous: faster, higher damage
  EVASIVE = 'evasive',       // Harder to hit: movement unpredictability
  TANKY = 'tanky',           // More resilient: higher HP, damage reduction
}

export interface BehaviorDefinition {
  id: BehaviorType;
  name: string;
  description: string;
  spawnRate: number; // Percentage of enemies with this behavior (0-100)
  
  // Stat multipliers
  hpMultiplier: number;
  speedMultiplier: number;
  damageMultiplier: number;    // Collision damage multiplier
  
  // Special properties
  hasEvasion: boolean;          // Erratic movement enabled
  hasRegeneration: boolean;     // Health regeneration enabled
  hasDamageReduction: boolean;  // Incoming damage reduced
  
  // Visual indicator
  color: string;               // Color override for behavior type
  icon: string;               // Unicode symbol for UI
}

export const BEHAVIOR_DEFINITIONS: Record<BehaviorType, BehaviorDefinition> = {
  [BehaviorType.STANDARD]: {
    id: BehaviorType.STANDARD,
    name: 'STANDARD',
    description: 'Normal enemy behavior. Straightforward approach.',
    spawnRate: 60,
    hpMultiplier: 1.0,
    speedMultiplier: 1.0,
    damageMultiplier: 1.0,
    hasEvasion: false,
    hasRegeneration: false,
    hasDamageReduction: false,
    color: '#FFFFFF',
    icon: '◯',
  },
  [BehaviorType.AGGRESSIVE]: {
    id: BehaviorType.AGGRESSIVE,
    name: 'AGGRESSIVE',
    description: 'Faster, stronger attackers. Deal 50% more damage.',
    spawnRate: 25,
    hpMultiplier: 0.8,    // Slightly weaker but faster
    speedMultiplier: 1.4,  // 40% faster
    damageMultiplier: 1.5, // 50% more collision damage
    hasEvasion: false,
    hasRegeneration: false,
    hasDamageReduction: false,
    color: '#FF4444',
    icon: '⚡',
  },
  [BehaviorType.EVASIVE]: {
    id: BehaviorType.EVASIVE,
    name: 'EVASIVE',
    description: 'Unpredictable movement. Difficult to target.',
    spawnRate: 15,
    hpMultiplier: 0.7,    // Weaker but harder to hit
    speedMultiplier: 1.2,  // Slightly faster
    damageMultiplier: 1.0,
    hasEvasion: true,      // Advanced evasion algorithm
    hasRegeneration: false,
    hasDamageReduction: false,
    color: '#00FFFF',
    icon: '◆',
  },
  [BehaviorType.TANKY]: {
    id: BehaviorType.TANKY,
    name: 'TANKY',
    description: 'Durable enemies. Slow but hardy.',
    spawnRate: 10,
    hpMultiplier: 1.8,     // Much more HP
    speedMultiplier: 0.6,  // 40% slower
    damageMultiplier: 1.2,  // Slightly stronger
    hasEvasion: false,
    hasRegeneration: true,  // Heal over time
    hasDamageReduction: true, // 15% damage reduction
    color: '#00FF00',
    icon: '■',
  },
};

/**
 * Determine enemy behavior based on wave and current modifier
 * Behaviors are selected by spawn rate and wave progression
 */
export function selectEnemyBehavior(wave: number, modifierId?: string): BehaviorType {
  // Some modifiers bias toward certain behaviors
  const behaviorBiases: Record<string, BehaviorType | null> = {
    aggressive: BehaviorType.AGGRESSIVE,    // Aggressive modifier → Aggressive enemies
    evasive: BehaviorType.EVASIVE,         // Evasive modifier → Evasive enemies
    resilient: BehaviorType.TANKY,         // Resilient modifier → Tanky enemies
    regenerating: BehaviorType.TANKY,      // Regenerating modifier → Tanky enemies
  };

  // If modifier strongly suggests a behavior, 60% chance to spawn that behavior
  const suggestedBehavior = modifierId ? behaviorBiases[modifierId] : null;
  if (suggestedBehavior && Math.random() < 0.6) {
    return suggestedBehavior;
  }

  // Wave-based progression: higher waves have more aggressive/tanky enemies
  const waveProgression = Math.min(wave / 50, 1); // Max influence at wave 50+
  
  // Normalize spawn rates and add wave-based bias
  const rates = {
    [BehaviorType.STANDARD]: Math.max(20, BEHAVIOR_DEFINITIONS[BehaviorType.STANDARD].spawnRate - waveProgression * 20),
    [BehaviorType.AGGRESSIVE]: Math.min(40, BEHAVIOR_DEFINITIONS[BehaviorType.AGGRESSIVE].spawnRate + waveProgression * 15),
    [BehaviorType.EVASIVE]: Math.min(35, BEHAVIOR_DEFINITIONS[BehaviorType.EVASIVE].spawnRate + waveProgression * 10),
    [BehaviorType.TANKY]: Math.min(40, BEHAVIOR_DEFINITIONS[BehaviorType.TANKY].spawnRate + waveProgression * 15),
  };

  // Select behavior by weighted random
  const total = Object.values(rates).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  
  for (const [behavior, rate] of Object.entries(rates)) {
    random -= rate;
    if (random <= 0) {
      return behavior as BehaviorType;
    }
  }

  return BehaviorType.STANDARD; // Fallback
}

/**
 * Get behavior definition by type
 */
export function getBehaviorDefinition(behavior: BehaviorType): BehaviorDefinition {
  return BEHAVIOR_DEFINITIONS[behavior];
}
