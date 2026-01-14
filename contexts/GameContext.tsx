import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { GameState, GameAction, EnemyType, ENEMY_REWARDS, SkillNode, WeaponType, WEAPONS, WeaponSkin, BaseSkin, BoostItem, OwnedChip } from '../types';
import { 
  createInitialGameState, 
  createInitialShopState,
  createInitialChipState,
  saveGameState, 
  loadGameState, 
  getWaveConfig 
} from '../utils/storage';
import { SKILL_TREE } from '../constants';
import { WEAPON_SKINS, BASE_SKINS, BOOST_ITEMS, findShopItem } from '../constants/shopItems';
import { getChipById, calculateUpgradeCost } from '../constants/chips';

// ============================================
// REDUCER
// ============================================

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...action.payload };

    case 'RESET_STATE':
      return createInitialGameState();

    case 'START_BATTLE': {
      // Start from checkpoint wave (10, 20, 30...) or wave 1 if no checkpoint
      const startWave = state.battle.waveCheckpoint > 0 ? state.battle.waveCheckpoint : 1;
      return {
        ...state,
        battle: {
          ...state.battle,
          isActive: true,
          currentWave: startWave,
          enemiesKilledThisWave: 0,
          enemiesRequiredForWave: getWaveConfig(startWave).enemiesRequired,
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
        totalBattlesPlayed: state.totalBattlesPlayed + 1,
      };
    }

    case 'END_BATTLE': {
      const { won } = action.payload;
      const newHighScore = Math.max(state.highScore, state.battle.pendingRewards.scoreEarned);
      const newHighestWave = Math.max(state.battle.highestWave, state.battle.currentWave);
      
      // Calculate checkpoint: highest multiple of 10 reached
      // If died on wave 29, checkpoint = 20. If reached wave 30 (even if died on it), checkpoint = 30
      const newCheckpoint = Math.floor(newHighestWave / 10) * 10;
      
      return {
        ...state,
        battle: {
          ...state.battle,
          isActive: false,
          highestWave: newHighestWave,
          waveCheckpoint: newCheckpoint,
        },
        highScore: newHighScore,
        totalBattlesWon: won ? state.totalBattlesWon + 1 : state.totalBattlesWon,
      };
    }

    case 'ENEMY_KILLED': {
      const { enemyType, isCrit, damage } = action.payload;
      const rewards = ENEMY_REWARDS[enemyType];
      const waveConfig = getWaveConfig(state.battle.currentWave);
      
      // Calculate Scavenger bonus (u1 skill) - 10% more gold per level
      const scavengerSkill = state.skillNodes.find(s => s.id === 'u1');
      const scavengerBonus = scavengerSkill ? 1 + (scavengerSkill.currentLevel * 0.1) : 1;
      
      const goldEarned = Math.floor(rewards.gold * waveConfig.goldMultiplier * scavengerBonus);
      
      // Small chance for gem drop (5% base, higher for bosses)
      const gemChance = enemyType === EnemyType.BOSS ? 0.5 : 0.05;
      const gemsEarned = Math.random() < gemChance ? (enemyType === EnemyType.BOSS ? 10 : 1) : 0;

      const newEnemiesKilledThisWave = state.battle.enemiesKilledThisWave + 1;

      return {
        ...state,
        battle: {
          ...state.battle,
          enemiesKilledThisWave: newEnemiesKilledThisWave,
          totalEnemiesKilled: state.battle.totalEnemiesKilled + 1,
          pendingRewards: {
            ...state.battle.pendingRewards,
            goldEarned: state.battle.pendingRewards.goldEarned + goldEarned,
            gemsEarned: state.battle.pendingRewards.gemsEarned + gemsEarned,
            scoreEarned: state.battle.pendingRewards.scoreEarned + rewards.score,
            enemiesKilled: state.battle.pendingRewards.enemiesKilled + 1,
            criticalHits: state.battle.pendingRewards.criticalHits + (isCrit ? 1 : 0),
            damageDealt: state.battle.pendingRewards.damageDealt + damage,
          },
        },
      };
    }

    case 'ADVANCE_WAVE': {
      const nextWave = state.battle.currentWave + 1;
      const waveConfig = getWaveConfig(state.battle.currentWave);
      
      return {
        ...state,
        battle: {
          ...state.battle,
          currentWave: nextWave,
          enemiesKilledThisWave: 0,
          enemiesRequiredForWave: getWaveConfig(nextWave).enemiesRequired,
          pendingRewards: {
            ...state.battle.pendingRewards,
            goldEarned: state.battle.pendingRewards.goldEarned + waveConfig.waveBonus,
            wavesCompleted: state.battle.pendingRewards.wavesCompleted + 1,
          },
        },
      };
    }

    case 'COLLECT_REWARDS': {
      const { pendingRewards } = state.battle;
      return {
        ...state,
        stats: {
          ...state.stats,
          gold: state.stats.gold + pendingRewards.goldEarned,
          gems: state.stats.gems + pendingRewards.gemsEarned,
        },
        totalGoldEarned: state.totalGoldEarned + pendingRewards.goldEarned,
        totalGemsEarned: state.totalGemsEarned + pendingRewards.gemsEarned,
        battle: {
          ...state.battle,
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
      };
    }

    case 'SPEND_GOLD': {
      const { amount } = action.payload;
      if (state.stats.gold < amount) return state;
      return {
        ...state,
        stats: {
          ...state.stats,
          gold: state.stats.gold - amount,
        },
      };
    }

    case 'SPEND_GEMS': {
      const { amount } = action.payload;
      if (state.stats.gems < amount) return state;
      return {
        ...state,
        stats: {
          ...state.stats,
          gems: state.stats.gems - amount,
        },
      };
    }

    case 'ADD_GOLD':
      return {
        ...state,
        stats: {
          ...state.stats,
          gold: state.stats.gold + action.payload.amount,
        },
        totalGoldEarned: state.totalGoldEarned + action.payload.amount,
      };

    case 'ADD_GEMS':
      return {
        ...state,
        stats: {
          ...state.stats,
          gems: state.stats.gems + action.payload.amount,
        },
        totalGemsEarned: state.totalGemsEarned + action.payload.amount,
      };

    case 'UPGRADE_SKILL': {
      const { skillId } = action.payload;
      const skillIndex = state.skillNodes.findIndex(s => s.id === skillId);
      if (skillIndex === -1) return state;

      const skill = state.skillNodes[skillIndex];
      if (skill.currentLevel >= skill.maxLevel) return state;

      const cost = Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, skill.currentLevel));
      if (state.stats.gold < cost) return state;

      // Check if parent is unlocked
      if (skill.parentId) {
        const parent = state.skillNodes.find(s => s.id === skill.parentId);
        if (!parent || parent.currentLevel === 0) return state;
      }

      const newSkillNodes = [...state.skillNodes];
      newSkillNodes[skillIndex] = {
        ...skill,
        currentLevel: skill.currentLevel + 1,
      };

      // Calculate stat bonuses from skill based on skill ID
      let statUpdates: Partial<typeof state.stats> = {};
      switch (skill.id) {
        // OFFENSE SKILLS
        case 'o1': // Plasma Core - +10% base damage per level
          statUpdates.damage = Math.floor(state.stats.damage * 1.1);
          break;
        case 'o2': // Rapid Fire - +5% attack speed per level
          statUpdates.attackSpeed = state.stats.attackSpeed * 1.05;
          break;
        case 'o3': // Crit Optics - +2% crit rate per level
          statUpdates.critRate = state.stats.critRate + 2;
          break;
        case 'o4': // Multi-Shot - handled in battle logic (multishot chance)
          break;
        case 'o5': // Death Ray - unlocks laser ability
          break;
        case 'o6': // Overcharge - unlocks double damage ability
          break;
        case 'o7': // Annihilation - passive explosion on death
          break;
        
        // DEFENSE SKILLS
        case 'd1': // Nano Plating - +5 defense per level (reduces collision damage)
          statUpdates.defense = (state.stats.defense || 0) + 5;
          break;
        case 'd2': // Regen Field - passive HP regen (handled in battle)
          break;
        case 'd3': // Thorns - reflect damage (handled in battle)
          break;
        case 'd4': // Forcefield - block attack (handled in battle)
          break;
        case 'd5': // Titan Hull - massive defense boost (+25 defense)
          statUpdates.defense = (state.stats.defense || 0) + 25;
          break;
        
        // UTILITY SKILLS
        case 'u1': // Scavenger - gold bonus (handled in ENEMY_KILLED)
          break;
        case 'u2': // Battery - +5 max energy per level
          statUpdates.maxEnergy = state.stats.maxEnergy + 5;
          statUpdates.energy = Math.min(state.stats.energy + 5, state.stats.maxEnergy + 5);
          break;
        case 'u3': // Overclock - cooldown reduction (handled in battle)
          break;
        case 'u4': // Lucky Shot - insta-kill chance (handled in battle)
          break;
      }

      return {
        ...state,
        stats: {
          ...state.stats,
          gold: state.stats.gold - cost,
          ...statUpdates,
        },
        skillNodes: newSkillNodes,
      };
    }

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload,
        },
      };

    case 'USE_ENERGY': {
      const { amount } = action.payload;
      if (state.stats.energy < amount) return state;
      return {
        ...state,
        stats: {
          ...state.stats,
          energy: state.stats.energy - amount,
        },
      };
    }

    case 'RESTORE_ENERGY':
      return {
        ...state,
        stats: {
          ...state.stats,
          energy: Math.min(state.stats.maxEnergy, state.stats.energy + action.payload.amount),
        },
      };

    case 'EQUIP_WEAPON': {
      const { weapon } = action.payload;
      // Can only equip unlocked weapons
      if (!state.unlockedWeapons.includes(weapon)) return state;
      return {
        ...state,
        equippedWeapon: weapon,
      };
    }

    case 'UNLOCK_WEAPON': {
      const { weapon } = action.payload;
      // Already unlocked
      if (state.unlockedWeapons.includes(weapon)) return state;
      
      const weaponDef = WEAPONS[weapon];
      if (!weaponDef || state.stats.gold < weaponDef.unlockCost) return state;
      
      return {
        ...state,
        stats: {
          ...state.stats,
          gold: state.stats.gold - weaponDef.unlockCost,
        },
        unlockedWeapons: [...state.unlockedWeapons, weapon],
        equippedWeapon: weapon, // Auto-equip on purchase
      };
    }

    // ============================================
    // SHOP ACTIONS (Phase 7)
    // ============================================

    case 'PURCHASE_SKIN': {
      const { skinId } = action.payload;
      
      // Check if already owned
      if (state.shop.ownedSkins.includes(skinId)) return state;
      
      // Find the skin
      const skin = WEAPON_SKINS.find(s => s.id === skinId) || BASE_SKINS.find(s => s.id === skinId);
      if (!skin) return state;
      
      // Check currency
      const currency = skin.currency === 'gems' ? state.stats.gems : state.stats.gold;
      if (currency < skin.price) return state;
      
      return {
        ...state,
        stats: {
          ...state.stats,
          gold: skin.currency === 'gold' ? state.stats.gold - skin.price : state.stats.gold,
          gems: skin.currency === 'gems' ? state.stats.gems - skin.price : state.stats.gems,
        },
        shop: {
          ...state.shop,
          ownedSkins: [...state.shop.ownedSkins, skinId],
        },
      };
    }

    case 'EQUIP_WEAPON_SKIN': {
      const { skinId } = action.payload;
      if (!state.shop.ownedSkins.includes(skinId)) return state;
      
      return {
        ...state,
        shop: {
          ...state.shop,
          equippedWeaponSkin: skinId,
        },
      };
    }

    case 'EQUIP_BASE_SKIN': {
      const { skinId } = action.payload;
      if (!state.shop.ownedSkins.includes(skinId)) return state;
      
      return {
        ...state,
        shop: {
          ...state.shop,
          equippedBaseSkin: skinId,
        },
      };
    }

    case 'PURCHASE_BOOST': {
      const { boostId } = action.payload;
      
      const boost = BOOST_ITEMS.find(b => b.id === boostId);
      if (!boost) return state;
      
      // Check currency
      const currency = boost.currency === 'gems' ? state.stats.gems : state.stats.gold;
      if (currency < boost.price) return state;
      
      // Find existing owned boost
      const existingIndex = state.shop.ownedBoosts.findIndex(b => b.boostId === boostId);
      const maxStacks = boost.maxStacks || 99;
      
      // Check stack limit
      if (existingIndex >= 0 && state.shop.ownedBoosts[existingIndex].quantity >= maxStacks) {
        return state;
      }
      
      const newOwnedBoosts = [...state.shop.ownedBoosts];
      if (existingIndex >= 0) {
        newOwnedBoosts[existingIndex] = {
          ...newOwnedBoosts[existingIndex],
          quantity: newOwnedBoosts[existingIndex].quantity + 1,
        };
      } else {
        newOwnedBoosts.push({ boostId, quantity: 1 });
      }
      
      return {
        ...state,
        stats: {
          ...state.stats,
          gold: boost.currency === 'gold' ? state.stats.gold - boost.price : state.stats.gold,
          gems: boost.currency === 'gems' ? state.stats.gems - boost.price : state.stats.gems,
        },
        shop: {
          ...state.shop,
          ownedBoosts: newOwnedBoosts,
        },
      };
    }

    case 'ACTIVATE_BOOST': {
      const { boostId } = action.payload;
      
      // Find owned boost
      const ownedIndex = state.shop.ownedBoosts.findIndex(b => b.boostId === boostId);
      if (ownedIndex === -1 || state.shop.ownedBoosts[ownedIndex].quantity <= 0) return state;
      
      const boost = BOOST_ITEMS.find(b => b.id === boostId);
      if (!boost) return state;
      
      // Check if already active (for non-stackable boosts)
      if (!boost.stackable && state.shop.activeBoosts.some(b => b.boostId === boostId)) {
        return state;
      }
      
      // Decrement owned quantity
      const newOwnedBoosts = [...state.shop.ownedBoosts];
      newOwnedBoosts[ownedIndex] = {
        ...newOwnedBoosts[ownedIndex],
        quantity: newOwnedBoosts[ownedIndex].quantity - 1,
      };
      
      // Add to active boosts
      const now = Date.now();
      const newActiveBoost = {
        boostId,
        activatedAt: now,
        expiresAt: boost.duration ? now + boost.duration : undefined,
        stacks: 1,
      };
      
      return {
        ...state,
        shop: {
          ...state.shop,
          ownedBoosts: newOwnedBoosts.filter(b => b.quantity > 0),
          activeBoosts: [...state.shop.activeBoosts, newActiveBoost],
        },
      };
    }

    case 'DEACTIVATE_BOOST': {
      const { boostId } = action.payload;
      
      return {
        ...state,
        shop: {
          ...state.shop,
          activeBoosts: state.shop.activeBoosts.filter(b => b.boostId !== boostId),
        },
      };
    }

    // ============================================
    // CHIP ACTIONS
    // ============================================

    case 'EQUIP_CHIP': {
      const { instanceId, slotIndex } = action.payload;
      
      // Validate slot index
      if (slotIndex < 0 || slotIndex > 5) return state;
      
      // Find the chip to equip
      const chipToEquip = state.chipState.ownedChips.find(c => c.instanceId === instanceId);
      if (!chipToEquip) return state;
      
      // If chip is already equipped elsewhere, unequip it first
      const newOwnedChips = state.chipState.ownedChips.map(chip => {
        if (chip.instanceId === instanceId) {
          return { ...chip, equipped: true, slotIndex };
        }
        // Unequip any chip currently in this slot
        if (chip.slotIndex === slotIndex) {
          return { ...chip, equipped: false, slotIndex: undefined };
        }
        return chip;
      });
      
      // Update slots array
      const newSlots = [...state.chipState.slots];
      // Remove chip from old slot if it was equipped elsewhere
      const oldSlotIndex = state.chipState.slots.findIndex(s => s === instanceId);
      if (oldSlotIndex >= 0) {
        newSlots[oldSlotIndex] = null;
      }
      newSlots[slotIndex] = instanceId;
      
      return {
        ...state,
        chipState: {
          ...state.chipState,
          ownedChips: newOwnedChips,
          slots: newSlots,
        },
      };
    }

    case 'UNEQUIP_CHIP': {
      const { instanceId } = action.payload;
      
      const chipToUnequip = state.chipState.ownedChips.find(c => c.instanceId === instanceId);
      if (!chipToUnequip || !chipToUnequip.equipped) return state;
      
      const newOwnedChips = state.chipState.ownedChips.map(chip => {
        if (chip.instanceId === instanceId) {
          return { ...chip, equipped: false, slotIndex: undefined };
        }
        return chip;
      });
      
      const newSlots = state.chipState.slots.map(s => s === instanceId ? null : s);
      
      return {
        ...state,
        chipState: {
          ...state.chipState,
          ownedChips: newOwnedChips,
          slots: newSlots,
        },
      };
    }

    case 'UPGRADE_CHIP': {
      const { instanceId } = action.payload;
      
      const chipIndex = state.chipState.ownedChips.findIndex(c => c.instanceId === instanceId);
      if (chipIndex === -1) return state;
      
      const ownedChip = state.chipState.ownedChips[chipIndex];
      const chipDef = getChipById(ownedChip.chipId);
      if (!chipDef) return state;
      
      // Check if already max level
      if (ownedChip.level >= chipDef.maxLevel) return state;
      
      // Calculate upgrade cost
      const cost = calculateUpgradeCost(chipDef, ownedChip.level);
      if (state.stats.gold < cost) return state;
      
      const newOwnedChips = [...state.chipState.ownedChips];
      newOwnedChips[chipIndex] = {
        ...ownedChip,
        level: ownedChip.level + 1,
      };
      
      return {
        ...state,
        stats: {
          ...state.stats,
          gold: state.stats.gold - cost,
        },
        chipState: {
          ...state.chipState,
          ownedChips: newOwnedChips,
        },
      };
    }

    default:
      return state;
  }
};

// ============================================
// CONTEXT
// ============================================

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Convenience methods
  startBattle: () => void;
  endBattle: (won: boolean) => void;
  killEnemy: (enemyType: EnemyType, isCrit: boolean, damage: number) => void;
  advanceWave: () => void;
  collectRewards: () => void;
  upgradeSkill: (skillId: string) => boolean;
  canAfford: (amount: number, currency?: 'gold' | 'gems') => boolean;
  spendGold: (amount: number) => boolean;
  spendGems: (amount: number) => boolean;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

// ============================================
// PROVIDER
// ============================================

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    // Try to load saved state, otherwise create initial
    const saved = loadGameState();
    return saved || createInitialGameState();
  });

  // Auto-save on state changes
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      saveGameState(state);
    }, 1000); // Debounce saves

    return () => clearTimeout(saveTimer);
  }, [state]);

  // Convenience methods
  const startBattle = useCallback(() => {
    dispatch({ type: 'START_BATTLE' });
  }, []);

  const endBattle = useCallback((won: boolean) => {
    dispatch({ type: 'END_BATTLE', payload: { won } });
  }, []);

  const killEnemy = useCallback((enemyType: EnemyType, isCrit: boolean, damage: number) => {
    dispatch({ type: 'ENEMY_KILLED', payload: { enemyType, isCrit, damage } });
  }, []);

  const advanceWave = useCallback(() => {
    dispatch({ type: 'ADVANCE_WAVE' });
  }, []);

  const collectRewards = useCallback(() => {
    dispatch({ type: 'COLLECT_REWARDS' });
  }, []);

  const upgradeSkill = useCallback((skillId: string): boolean => {
    const skill = state.skillNodes.find(s => s.id === skillId);
    if (!skill) return false;
    
    const cost = Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, skill.currentLevel));
    if (state.stats.gold < cost) return false;
    if (skill.currentLevel >= skill.maxLevel) return false;
    
    dispatch({ type: 'UPGRADE_SKILL', payload: { skillId } });
    return true;
  }, [state.skillNodes, state.stats.gold]);

  const canAfford = useCallback((amount: number, currency: 'gold' | 'gems' = 'gold'): boolean => {
    return currency === 'gold' ? state.stats.gold >= amount : state.stats.gems >= amount;
  }, [state.stats.gold, state.stats.gems]);

  const spendGold = useCallback((amount: number): boolean => {
    if (state.stats.gold < amount) return false;
    dispatch({ type: 'SPEND_GOLD', payload: { amount } });
    return true;
  }, [state.stats.gold]);

  const spendGems = useCallback((amount: number): boolean => {
    if (state.stats.gems < amount) return false;
    dispatch({ type: 'SPEND_GEMS', payload: { amount } });
    return true;
  }, [state.stats.gems]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const value: GameContextType = {
    state,
    dispatch,
    startBattle,
    endBattle,
    killEnemy,
    advanceWave,
    collectRewards,
    upgradeSkill,
    canAfford,
    spendGold,
    spendGems,
    resetGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
