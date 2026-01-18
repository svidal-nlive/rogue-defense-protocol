/**
 * Wave Modifiers - Dynamic wave difficulty multipliers
 * Each modifier changes enemy stats or behavior for added variety
 */

export enum ModifierId {
  FORTIFIED = 'fortified',
  SWIFT = 'swift',
  SWARM = 'swarm',
  RESILIENT = 'resilient',
  AGGRESSIVE = 'aggressive',
  REGENERATING = 'regenerating',
  EVASIVE = 'evasive',
}

export interface WaveModifier {
  id: ModifierId;
  name: string;
  description: string;
  color: string;
  icon: string;
  multipliers: {
    enemyHp?: number;
    enemySpeed?: number;
    spawnInterval?: number;
    collisionDamage?: number;
    damageReduction?: number;
    healPerSecond?: number;
  };
  difficulty: number; // 1-5 rating for player info
}

export const WAVE_MODIFIERS: Record<ModifierId, WaveModifier> = {
  [ModifierId.FORTIFIED]: {
    id: ModifierId.FORTIFIED,
    name: 'Fortified',
    description: '+30% Enemy HP',
    color: '#9370DB',
    icon: '🛡️',
    multipliers: { enemyHp: 1.3 },
    difficulty: 2,
  },
  [ModifierId.SWIFT]: {
    id: ModifierId.SWIFT,
    name: 'Swift',
    description: '+25% Enemy Speed',
    color: '#00FFFF',
    icon: '⚡',
    multipliers: { enemySpeed: 1.25 },
    difficulty: 2,
  },
  [ModifierId.SWARM]: {
    id: ModifierId.SWARM,
    name: 'Swarm',
    description: '-40% Enemy HP, -50% Spawn Time (more enemies)',
    color: '#FF6B6B',
    icon: '🐝',
    multipliers: { enemyHp: 0.6, spawnInterval: 0.5 },
    difficulty: 3,
  },
  [ModifierId.RESILIENT]: {
    id: ModifierId.RESILIENT,
    name: 'Resilient',
    description: 'Enemies take 20% reduced damage',
    color: '#FFD700',
    icon: '🔒',
    multipliers: { damageReduction: 0.2 },
    difficulty: 2,
  },
  [ModifierId.AGGRESSIVE]: {
    id: ModifierId.AGGRESSIVE,
    name: 'Aggressive',
    description: '+50% Collision Damage from enemies',
    color: '#FF0000',
    icon: '💥',
    multipliers: { collisionDamage: 1.5 },
    difficulty: 3,
  },
  [ModifierId.REGENERATING]: {
    id: ModifierId.REGENERATING,
    name: 'Regenerating',
    description: 'Enemies heal 1.5 HP/second',
    color: '#00FF00',
    icon: '💚',
    multipliers: { healPerSecond: 1.5 },
    difficulty: 3,
  },
  [ModifierId.EVASIVE]: {
    id: ModifierId.EVASIVE,
    name: 'Evasive',
    description: 'Enemies move erratically, harder to hit',
    color: '#FF1493',
    icon: '👻',
    multipliers: { enemySpeed: 1.1 },
    difficulty: 2,
  },
};

export const getRandomModifier = (excludeIds?: ModifierId[]): WaveModifier => {
  const modifierIds = Object.values(ModifierId).filter(
    id => !excludeIds?.includes(id)
  );
  const randomId = modifierIds[Math.floor(Math.random() * modifierIds.length)];
  return WAVE_MODIFIERS[randomId];
};
