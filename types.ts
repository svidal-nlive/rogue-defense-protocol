export enum Screen {
  HOME = 'HOME',
  BATTLE = 'BATTLE',
  GUARDIAN = 'GUARDIAN',
  SKILLS = 'SKILLS',
  SHOP = 'SHOP',
  MISSIONS = 'MISSIONS'
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
  // Wave modifier properties
  baseHp?: number;            // Base HP before modifiers (for regenerating modifier)
  hpMultiplier?: number;      // HP multiplier from wave config
  evasionTimer?: number;      // Timer for evasive movement direction changes
  evasionAngle?: number;      // Random angle for evasive movement
  // Behavior properties
  behavior?: string;          // Behavior type (standard/aggressive/evasive/tanky)
  behaviorColor?: string;     // Color indicator for behavior
  damageTakenMultiplier?: number; // Incoming damage multiplier (for tanky behavior)
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

export type ChipType = 'ATTACK' | 'DEFENSE' | 'UTILITY' | 'SPECIAL';
export type ChipRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface ChipBonus {
  // Core stats
  damage?: number;            // Flat damage bonus
  damagePercent?: number;     // % damage bonus
  hp?: number;                // Flat HP bonus
  hpPercent?: number;         // % HP bonus
  defense?: number;           // Damage reduction %
  critRate?: number;          // Flat crit rate bonus
  critDamage?: number;        // Crit damage % bonus
  attackSpeed?: number;       // Attack speed % bonus
  goldBonus?: number;         // Gold drop % bonus
  energyMax?: number;         // Max energy bonus
  
  // Extended stats (Phase 5 chip roster)
  splashRadius?: number;      // AOE splash radius %
  bossDamage?: number;        // % bonus damage to bosses
  hpRegen?: number;           // HP regeneration per second
  dodge?: number;             // % chance to dodge attacks
  revive?: number;            // Number of revives per battle
  gemChance?: number;         // % bonus gem drop chance
  chipAmplify?: number;       // % bonus to all chip effects
  cooldownReduction?: number; // % cooldown reduction
  
  // Special effect chips
  chainChance?: number;       // % chance to chain lightning
  chainTargets?: number;      // Number of chain targets
  freezeChance?: number;      // % chance to freeze enemies
  freezeDuration?: number;    // Freeze duration in ms
  lifesteal?: number;         // % of damage healed
  reflect?: number;           // % damage reflected back
  globalSlowChance?: number;  // % chance to slow all enemies
  slowDuration?: number;      // Slow effect duration in ms
  slowPercent?: number;       // Slow effect percentage
  deathExplosion?: boolean;   // Whether to trigger explosion on enemy death
  explosionDamage?: number;   // Explosion damage amount
  gravityPull?: number;       // Pull enemies toward center
  waveScaling?: number;       // Bonus per wave survived
  random?: boolean;           // Random bonus on battle start
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
  // 8 slots using the ChipSlot interface
  slots: ChipSlot[];
  // Track how many slots have been unlocked
  totalSlotsUnlocked: number;
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
  waveModifier?: {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
  };
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
  
  // Mission & Achievement systems
  missionState: MissionState;
  achievementState: AchievementState;
  
  // Synergy tracking
  activeSynergies: string[]; // IDs of active synergies
  
  // Audio settings
  audioSettings: {
    enabled: boolean;
    masterVolume: number;
    sfxVolume: number;
    musicVolume: number;
  };
  
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
  | { type: 'GRANT_CHIP'; payload: { chipId: string; level?: number } }
  | { type: 'UNLOCK_CHIP_SLOT'; payload: { slotIndex: number; missionId?: string } }
  // Shop actions
  | { type: 'PURCHASE_SKIN'; payload: { skinId: string } }
  | { type: 'EQUIP_WEAPON_SKIN'; payload: { skinId: string } }
  | { type: 'EQUIP_BASE_SKIN'; payload: { skinId: string } }
  | { type: 'PURCHASE_BOOST'; payload: { boostId: string } }
  | { type: 'ACTIVATE_BOOST'; payload: { boostId: string } }
  | { type: 'DEACTIVATE_BOOST'; payload: { boostId: string } }
  // Mission actions
  | { type: 'UPDATE_MISSION_PROGRESS'; payload: { missionId: string; objectiveId: string; increment: number } }
  | { type: 'COMPLETE_MISSION'; payload: { missionId: string } }
  | { type: 'CLAIM_MISSION_REWARD'; payload: { missionId: string } }
  | { type: 'REFRESH_DAILY_MISSIONS' }
  | { type: 'REFRESH_WEEKLY_MISSIONS' }
  | { type: 'SYNC_MISSION_PROGRESS' }
  | { type: 'CHECK_MISSION_UNLOCKS' }
  // Achievement actions
  | { type: 'UPDATE_ACHIEVEMENT_PROGRESS'; payload: { achievementId: string; value: number } }
  | { type: 'UNLOCK_ACHIEVEMENT_TIER'; payload: { achievementId: string; tier: AchievementTier } }
  // Audio actions
  | { type: 'TOGGLE_AUDIO'; payload: { enabled: boolean } }
  | { type: 'SET_MASTER_VOLUME'; payload: { volume: number } }
  | { type: 'SET_SFX_VOLUME'; payload: { volume: number } }
  | { type: 'SET_MUSIC_VOLUME'; payload: { volume: number } };

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

// ============================================
// MISSION SYSTEM TYPES
// ============================================

export type MissionCategory = 
  | 'TUTORIAL'
  | 'COMBAT'
  | 'SURVIVAL'
  | 'MASTERY'
  | 'EXPLORATION'
  | 'DAILY'
  | 'WEEKLY'
  | 'MILESTONE';

export type MissionStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';

export type ObjectiveType = 
  | 'KILL_ENEMIES'
  | 'KILL_ENEMY_TYPE'
  | 'REACH_WAVE'
  | 'SURVIVE_WAVES'
  | 'DEAL_DAMAGE'
  | 'DEAL_CRIT_DAMAGE'
  | 'EARN_GOLD'
  | 'USE_WEAPON'
  | 'COMPLETE_BATTLE'
  | 'NO_DAMAGE_WAVE'
  | 'KILL_STREAK'
  | 'BOSS_KILLS'
  | 'USE_ABILITY'
  | 'EQUIP_CHIPS'
  | 'UPGRADE_CHIPS';

export interface MissionObjective {
  id: string;
  type: ObjectiveType;
  target: number;
  current: number;
  description: string;
  // Optional filters
  enemyType?: EnemyType;
  weaponType?: WeaponType;
  waveNumber?: number;
}

export interface MissionReward {
  type: 'CHIP' | 'GOLD' | 'GEMS' | 'CHIP_SLOT' | 'WEAPON' | 'SKIN' | 'BOOST';
  id?: string;
  amount?: number;
  rarity?: ChipRarity;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  category: MissionCategory;
  objectives: MissionObjective[];
  rewards: MissionReward[];
  prerequisites?: string[];
  unlockWave?: number;
  repeatable: boolean;
  expiresAt?: number;
  status: MissionStatus;
}

export interface MissionState {
  activeMissions: Mission[];
  completedMissions: string[];
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  dailyMissionsRefreshedAt: number;
  weeklyMissionsRefreshedAt: number;
  totalMissionsCompleted: number;
  // Tracking stats for mission progress
  totalEnemiesKilled: number;
  totalBossesKilled: number;
  totalDamageDealt: number;
  totalCriticalHits: number;
  totalGoldEarned: number;
  totalWavesCompleted: number;
  totalBattlesCompleted: number;
  highestWaveReached: number;
  weaponsUsed: WeaponType[];
  // Per-enemy-type tracking
  circlesKilled: number;
  squaresKilled: number;
  trianglesKilled: number;
  swarmsKilled: number;
  tanksKilled: number;
  // Per-battle tracking (reset each battle)
  currentBattleBossKills: number;
  currentBattleKillStreak: number;
  currentBattleMaxKillStreak: number;
  lastKillTime: number;
}

// ============================================
// ACHIEVEMENT SYSTEM TYPES
// ============================================

export type AchievementCategory = 
  | 'COMBAT'
  | 'PROGRESSION'
  | 'COLLECTION'
  | 'MASTERY'
  | 'SECRET';

export type AchievementTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface AchievementProgress {
  id: string;
  currentValue: number;
  unlockedTiers: AchievementTier[];
  lastUnlockedAt?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tiers: {
    tier: AchievementTier;
    requirement: number;
    reward: MissionReward;
  }[];
  hidden: boolean;
}

export interface AchievementState {
  progress: Record<string, AchievementProgress>;
  totalUnlocked: number;
}

// ============================================
// UPDATED CHIP SLOT (for mission unlocks)
// ============================================

export interface ChipSlot {
  index: number;
  unlocked: boolean;
  unlockedByMission?: string;
  equippedChipId: string | null;
}