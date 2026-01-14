export enum Screen {
  HOME = 'HOME',
  BATTLE = 'BATTLE',
  GUARDIAN = 'GUARDIAN',
  SKILLS = 'SKILLS',
  SHOP = 'SHOP'
}

export enum EnemyType {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  TRIANGLE = 'TRIANGLE',
  SWARM = 'SWARM',
  TANK = 'TANK',
  BOSS = 'BOSS'
}

// Weapon types available to player
export enum WeaponType {
  BLASTER = 'BLASTER',
  MISSILE = 'MISSILE',
  LASER = 'LASER',
  CRYO = 'CRYO'
}

// Weapon definitions with stats
export interface WeaponDefinition {
  id: WeaponType;
  name: string;
  description: string;
  damageMultiplier: number;
  attackSpeedMultiplier: number;
  projectileSpeed: number;
  projectileColor: string;
  splashRadius?: number;      // For missiles
  slowPercent?: number;       // For cryo
  slowDuration?: number;      // For cryo (ms)
  piercing?: boolean;         // For laser
  unlockCost: number;
  icon: string;
}

export const WEAPONS: Record<WeaponType, WeaponDefinition> = {
  [WeaponType.BLASTER]: {
    id: WeaponType.BLASTER,
    name: 'Plasma Blaster',
    description: 'Balanced single-target weapon with consistent damage.',
    damageMultiplier: 1.0,
    attackSpeedMultiplier: 1.0,
    projectileSpeed: 0.8,
    projectileColor: '#00F0FF',
    unlockCost: 0,
    icon: 'zap'
  },
  [WeaponType.MISSILE]: {
    id: WeaponType.MISSILE,
    name: 'Homing Missiles',
    description: 'Slower fire rate but deals splash damage on impact.',
    damageMultiplier: 1.5,
    attackSpeedMultiplier: 0.6,
    projectileSpeed: 0.5,
    projectileColor: '#FF6B00',
    splashRadius: 60,
    unlockCost: 2000,
    icon: 'target'
  },
  [WeaponType.LASER]: {
    id: WeaponType.LASER,
    name: 'Focus Laser',
    description: 'Rapid-fire beam that pierces through enemies.',
    damageMultiplier: 0.4,
    attackSpeedMultiplier: 3.0,
    projectileSpeed: 2.0,
    projectileColor: '#BC13FE',
    piercing: true,
    unlockCost: 3000,
    icon: 'crosshair'
  },
  [WeaponType.CRYO]: {
    id: WeaponType.CRYO,
    name: 'Cryo Cannon',
    description: 'Slows enemies on hit, making them easier targets.',
    damageMultiplier: 0.7,
    attackSpeedMultiplier: 0.8,
    projectileSpeed: 0.6,
    projectileColor: '#00FFFF',
    slowPercent: 50,
    slowDuration: 3000,
    unlockCost: 2500,
    icon: 'snowflake'
  }
};

// Enemy gold reward values based on type
export const ENEMY_REWARDS: Record<EnemyType, { gold: number; score: number }> = {
  [EnemyType.CIRCLE]: { gold: 5, score: 10 },
  [EnemyType.SQUARE]: { gold: 15, score: 25 },
  [EnemyType.TRIANGLE]: { gold: 10, score: 15 },
  [EnemyType.SWARM]: { gold: 2, score: 5 },
  [EnemyType.TANK]: { gold: 30, score: 50 },
  [EnemyType.BOSS]: { gold: 100, score: 500 },
};

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  baseSpeed: number;          // Original speed (for slow effects)
  radius: number;
  color: string;
  frozen?: boolean;
  slowedUntil?: number;       // Timestamp when slow effect ends
  slowPercent?: number;       // Current slow percentage
  // Visual props
  rotation?: number;
  rotationSpeed?: number;
  pulsePhase?: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  color: string;
  weaponType: WeaponType;
  targetId?: string;
  trail?: {x: number, y: number}[];
  splashRadius?: number;
  slowPercent?: number;
  slowDuration?: number;
  piercing?: boolean;
  hitEnemies?: string[];      // Track pierced enemies to not hit twice
  // Skin properties
  trailColor?: string;
  trailStyle?: 'normal' | 'flame' | 'electric' | 'ice' | 'rainbow' | 'void';
  particleEffect?: 'sparkle' | 'smoke' | 'lightning' | 'snowflake';
}

export interface PlayerStats {
  level: number;
  gold: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  damage: number;
  attackSpeed: number;
  critRate: number;
  critDamage: number;
  defense: number;    // Reduces collision damage from enemies
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  description: string;
  cost: number;
  icon: string;
  color: string;
  unlocked: boolean;
}

export type SkillCategory = 'OFFENSE' | 'DEFENSE' | 'UTILITY';

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  currentLevel: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  parentId?: string;
  icon: string;
  position: { row: number; col: number }; // Grid position: Row 0-4, Col 0-2 (typically)
}

// ============================================
// CHIP SYSTEM TYPES
// ============================================

export type ChipType = 'ATTACK' | 'DEFENSE' | 'UTILITY';
export type ChipRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface ChipBonus {
  damage?: number;        // Flat damage bonus
  damagePercent?: number; // % damage bonus
  hp?: number;            // Flat HP bonus
  hpPercent?: number;     // % HP bonus
  defense?: number;       // Damage reduction %
  critRate?: number;      // Flat crit rate bonus
  critDamage?: number;    // Crit damage % bonus
  attackSpeed?: number;   // Attack speed % bonus
  goldBonus?: number;     // Gold drop % bonus
  energyMax?: number;     // Max energy bonus
}

export interface Chip {
  id: string;
  name: string;
  type: ChipType;
  rarity: ChipRarity;
  level: number;
  maxLevel: number;
  icon: string;
  description: string;
  // Base bonus at level 1, scales with level
  baseBonus: ChipBonus;
  // Cost to upgrade to next level
  upgradeCost: number;
  upgradeCostMultiplier: number;
}

// Chip state for a player's owned chip (tracks individual instance)
export interface OwnedChip {
  chipId: string;       // Reference to chip definition
  instanceId: string;   // Unique instance ID
  level: number;        // Current level of this chip
  equipped: boolean;    // Whether it's in a slot
  slotIndex?: number;   // Which slot (0-5) if equipped
}

export interface ChipState {
  ownedChips: OwnedChip[];
  // 6 slots, each can hold one chip instanceId or null
  slots: (string | null)[];
}

// ============================================
// GAME STATE TYPES (Phase 2: Economy System)
// ============================================

export interface BattleRewards {
  goldEarned: number;
  gemsEarned: number;
  scoreEarned: number;
  enemiesKilled: number;
  wavesCompleted: number;
  criticalHits: number;
  damageDealt: number;
}

export interface BattleState {
  isActive: boolean;
  currentWave: number;
  highestWave: number;
  waveCheckpoint: number;  // Persistent checkpoint at wave 10, 20, 30... Player restarts from here
  enemiesKilledThisWave: number;
  enemiesRequiredForWave: number;
  totalEnemiesKilled: number;
  pendingRewards: BattleRewards;
}

export interface GameState {
  // Player resources
  stats: PlayerStats;
  
  // Battle tracking
  battle: BattleState;
  
  // Progression
  totalGoldEarned: number;
  totalGemsEarned: number;
  totalBattlesPlayed: number;
  totalBattlesWon: number;
  highScore: number;
  
  // Skill tree state
  skillNodes: SkillNode[];
  
  // Chips/equipment (new system)
  chipState: ChipState;
  
  // Weapons
  equippedWeapon: WeaponType;
  unlockedWeapons: WeaponType[];
  
  // Shop & cosmetics (Phase 7)
  shop: ShopState;
  
  // Timestamps
  lastPlayed: number;
  createdAt: number;
}

// Action types for reducer
export type GameAction =
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'RESET_STATE' }
  | { type: 'START_BATTLE' }
  | { type: 'END_BATTLE'; payload: { won: boolean } }
  | { type: 'ENEMY_KILLED'; payload: { enemyType: EnemyType; isCrit: boolean; damage: number } }
  | { type: 'WAVE_COMPLETED' }
  | { type: 'ADVANCE_WAVE' }
  | { type: 'COLLECT_REWARDS' }
  | { type: 'SPEND_GOLD'; payload: { amount: number } }
  | { type: 'SPEND_GEMS'; payload: { amount: number } }
  | { type: 'ADD_GOLD'; payload: { amount: number } }
  | { type: 'ADD_GEMS'; payload: { amount: number } }
  | { type: 'UPGRADE_SKILL'; payload: { skillId: string } }
  | { type: 'UPDATE_STATS'; payload: Partial<PlayerStats> }
  | { type: 'USE_ENERGY'; payload: { amount: number } }
  | { type: 'RESTORE_ENERGY'; payload: { amount: number } }
  | { type: 'EQUIP_WEAPON'; payload: { weapon: WeaponType } }
  | { type: 'UNLOCK_WEAPON'; payload: { weapon: WeaponType } }
  // Chip actions
  | { type: 'EQUIP_CHIP'; payload: { instanceId: string; slotIndex: number } }
  | { type: 'UNEQUIP_CHIP'; payload: { instanceId: string } }
  | { type: 'UPGRADE_CHIP'; payload: { instanceId: string } }
  // Shop actions
  | { type: 'PURCHASE_SKIN'; payload: { skinId: string } }
  | { type: 'EQUIP_WEAPON_SKIN'; payload: { skinId: string } }
  | { type: 'EQUIP_BASE_SKIN'; payload: { skinId: string } }
  | { type: 'PURCHASE_BOOST'; payload: { boostId: string } }
  | { type: 'ACTIVATE_BOOST'; payload: { boostId: string } }
  | { type: 'DEACTIVATE_BOOST'; payload: { boostId: string } };

// ============================================
// SHOP SYSTEM TYPES (Phase 7)
// ============================================

export type ShopCategory = 'BOOSTS' | 'WEAPON_SKINS' | 'BASE_SKINS';
export type CurrencyType = 'gold' | 'gems';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: CurrencyType;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

// Weapon skins change projectile appearance
export interface WeaponSkin extends ShopItem {
  type: 'WEAPON_SKIN';
  weaponType: WeaponType | 'ALL';  // 'ALL' means works for any weapon
  projectileColor: string;
  trailColor: string;
  trailStyle: 'normal' | 'flame' | 'electric' | 'ice' | 'rainbow' | 'void';
  particleEffect?: 'sparkle' | 'smoke' | 'lightning' | 'snowflake';
}

// Base skins change the defense station appearance
export interface BaseSkin extends ShopItem {
  type: 'BASE_SKIN';
  coreColor: string;
  ringColor: string;
  shieldColor: string;
  glowColor: string;
  style: 'default' | 'neon' | 'fire' | 'ice' | 'void' | 'gold' | 'rainbow';
}

// Boosts are consumable or timed buffs
export interface BoostItem extends ShopItem {
  type: 'BOOST';
  effect: BoostEffect;
  duration?: number;       // Duration in ms (undefined = permanent/instant)
  stackable: boolean;
  maxStacks?: number;
}

export type BoostEffect = 
  | { type: 'GOLD_MULTIPLIER'; value: number }      // 2x gold
  | { type: 'GEM_CHANCE_BONUS'; value: number }     // +X% gem drop
  | { type: 'SHIELD_REPAIR'; value: number }        // Repair X HP
  | { type: 'FULL_REPAIR' }                         // Full HP restore
  | { type: 'DAMAGE_BOOST'; value: number }         // +X% damage
  | { type: 'SPEED_BOOST'; value: number }          // +X% attack speed
  | { type: 'CRIT_BOOST'; value: number }           // +X% crit rate
  | { type: 'INVINCIBILITY'; value: number }        // Seconds of invincibility
  | { type: 'ENERGY_REFILL' };                      // Full energy

export interface ActiveBoost {
  boostId: string;
  activatedAt: number;
  expiresAt?: number;      // Undefined for instant/permanent boosts
  stacks: number;
}

export interface ShopState {
  ownedSkins: string[];
  equippedWeaponSkin: string | null;
  equippedBaseSkin: string | null;
  ownedBoosts: { boostId: string; quantity: number }[];
  activeBoosts: ActiveBoost[];
}