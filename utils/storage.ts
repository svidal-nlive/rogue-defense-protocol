import { GameState, WeaponType, ShopState, ChipState, MissionState, AchievementState, ChipSlot } from '../types';
import { INITIAL_STATS, SKILL_TREE } from '../constants';
import { getAvailableMissions, generateDailyMissions, generateWeeklyMissions } from '../constants/missions';
import { initializeAchievements } from '../constants/achievements';

const STORAGE_KEY = 'rogue-defense-protocol-save';
const STORAGE_VERSION = 7;  // v7: Mission & Achievement system

interface StorageWrapper {
  version: number;
  data: GameState;
}

/**
 * Creates initial shop state
 */
export const createInitialShopState = (): ShopState => ({
  ownedSkins: ['skin_default', 'base_default'],  // Default skins are free
  equippedWeaponSkin: 'skin_default',
  equippedBaseSkin: 'base_default',
  ownedBoosts: [],
  activeBoosts: [],
});

/**
 * Creates initial chip state - empty for mission-based progression
 */
export const createInitialChipState = (): ChipState => ({
  ownedChips: [],  // No starter chips - earn them through missions
  slots: Array(8).fill(null).map((_, i): ChipSlot => ({
    index: i,
    unlocked: false,  // All slots start locked
    equippedChipId: null
  })),
  totalSlotsUnlocked: 0,
});

/**
 * Creates initial mission state
 */
export const createInitialMissionState = (): MissionState => {
  const now = Date.now();
  const availableMissions = getAvailableMissions([], 1);
  
  return {
    activeMissions: availableMissions,
    completedMissions: [],
    dailyMissions: generateDailyMissions(),
    weeklyMissions: generateWeeklyMissions(),
    dailyMissionsRefreshedAt: now,
    weeklyMissionsRefreshedAt: now,
    totalMissionsCompleted: 0,
    // Tracking stats
    totalEnemiesKilled: 0,
    totalBossesKilled: 0,
    totalDamageDealt: 0,
    totalCriticalHits: 0,
    totalGoldEarned: 0,
    totalWavesCompleted: 0,
    totalBattlesCompleted: 0,
    highestWaveReached: 0,
    weaponsUsed: [],
    // Per-enemy-type tracking
    circlesKilled: 0,
    squaresKilled: 0,
    trianglesKilled: 0,
    swarmsKilled: 0,
    tanksKilled: 0,
    // Per-battle tracking
    currentBattleBossKills: 0,
    currentBattleKillStreak: 0,
    currentBattleMaxKillStreak: 0,
    lastKillTime: 0,
  };
};

/**
 * Creates initial achievement state
 */
export const createInitialAchievementState = (): AchievementState => ({
  progress: initializeAchievements(),
  totalUnlocked: 0,
});

/**
 * Creates a fresh game state with initial values
 */
export const createInitialGameState = (): GameState => ({
  stats: { ...INITIAL_STATS, gold: 0, gems: 0, level: 1, defense: 0 }, // Start fresh with 0 defense
  battle: {
    isActive: false,
    currentWave: 1,
    highestWave: 1,
    waveCheckpoint: 0,  // No checkpoint until player reaches wave 10
    enemiesKilledThisWave: 0,
    enemiesRequiredForWave: 10,
    totalEnemiesKilled: 0,
    pendingRewards: {
      goldEarned: 0,
      gemsEarned: 0,
      scoreEarned: 0,
      enemiesKilled: 0,
      wavesCompleted: 0,
      criticalHits: 0,
      damageDealt: 0,
    },
  },
  totalGoldEarned: 0,
  totalGemsEarned: 0,
  totalBattlesPlayed: 0,
  totalBattlesWon: 0,
  highScore: 0,
  skillNodes: SKILL_TREE.map(node => ({ ...node, currentLevel: 0 })), // Reset all skills
  chipState: createInitialChipState(),       // Chip system state - empty until missions grant them
  equippedWeapon: WeaponType.BLASTER,        // Start with basic blaster
  unlockedWeapons: [WeaponType.BLASTER],     // Only blaster unlocked initially
  shop: createInitialShopState(),             // Shop state
  missionState: createInitialMissionState(), // Mission system
  achievementState: createInitialAchievementState(), // Achievement system
  lastPlayed: Date.now(),
  createdAt: Date.now(),
});

/**
 * Saves game state to localStorage
 */
export const saveGameState = (state: GameState): boolean => {
  try {
    const wrapper: StorageWrapper = {
      version: STORAGE_VERSION,
      data: {
        ...state,
        lastPlayed: Date.now(),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    return false;
  }
};

/**
 * Loads game state from localStorage
 */
export const loadGameState = (): GameState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const wrapper: StorageWrapper = JSON.parse(raw);
    
    // Version migration could happen here
    if (wrapper.version !== STORAGE_VERSION) {
      console.warn('Save version mismatch, creating fresh state');
      return null;
    }

    return wrapper.data;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

/**
 * Clears saved game state
 */
export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};

/**
 * Checks if a save file exists
 */
export const hasSaveFile = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
};

/**
 * Formats large numbers for display
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
};

/**
 * Calculate wave difficulty scaling
 * Updated formulas for better early-game challenge
 */
export const getWaveConfig = (wave: number) => ({
  enemiesRequired: Math.min(8 + wave * 3, 60),    // 11, 14, 17... max 60 (more enemies per wave)
  enemyHpMultiplier: 1 + (wave - 1) * 0.20,       // +20% HP per wave (up from 15%)
  enemySpeedMultiplier: 1 + (wave - 1) * 0.03,    // +3% speed per wave (down from 5%)
  spawnInterval: Math.max(500, 1800 - wave * 100), // Faster start (1800ms vs 2000ms)
  goldMultiplier: 1 + (wave - 1) * 0.1,           // +10% gold per wave
  waveBonus: wave * 50,                            // Flat bonus for completing wave
  isBossWave: wave % 5 === 0,                      // Boss every 5 waves
});
