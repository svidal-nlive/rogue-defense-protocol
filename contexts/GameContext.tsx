import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { GameState, GameAction, EnemyType, ENEMY_REWARDS, SkillNode, WeaponType, WEAPONS, WeaponSkin, BaseSkin, BoostItem, OwnedChip, ChipSlot, Mission, MissionObjective, AchievementTier } from '../types';
import { 
  createInitialGameState, 
  createInitialShopState,
  createInitialChipState,
  createInitialMissionState,
  createInitialAchievementState,
  saveGameState, 
  loadGameState, 
  getWaveConfig 
} from '../utils/storage';
import { SKILL_TREE } from '../constants';
import { WEAPON_SKINS, BASE_SKINS, BOOST_ITEMS, findShopItem } from '../constants/shopItems';
import { getChipById, calculateUpgradeCost, ALL_CHIPS } from '../constants/chips';
import { 
  getMissionById, 
  getAvailableMissions, 
  generateDailyMissions, 
  generateWeeklyMissions,
  shouldRefreshDailyMissions,
  shouldRefreshWeeklyMissions,
  ALL_PERMANENT_MISSIONS,
  syncMissionProgress,
  MissionTrackingStats
} from '../constants/missions';
import { getAchievementById, checkAchievementTierReached, ALL_ACHIEVEMENTS } from '../constants/achievements';
import { getActiveSynergies, calculateSynergyBonuses } from '../constants/synergies';

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
      
      // Generate random wave modifier (skip boss waves - every 5 waves)
      const isBossWave = startWave % 5 === 0;
      const shouldHaveModifier = !isBossWave && Math.random() < 0.7; // 70% chance for modifier
      
      let waveModifier = undefined;
      if (shouldHaveModifier) {
        // Simple modifier selection - will be fully imported at top of file
        const modifierIds = ['fortified', 'swift', 'swarm', 'resilient', 'aggressive', 'regenerating', 'evasive'];
        const randomId = modifierIds[Math.floor(Math.random() * modifierIds.length)];
        
        const modifierNames: Record<string, string> = {
          fortified: 'Fortified',
          swift: 'Swift',
          swarm: 'Swarm',
          resilient: 'Resilient',
          aggressive: 'Aggressive',
          regenerating: 'Regenerating',
          evasive: 'Evasive',
        };
        
        const modifierDescriptions: Record<string, string> = {
          fortified: '+30% Enemy HP',
          swift: '+25% Enemy Speed',
          swarm: '-40% Enemy HP, -50% Spawn Time',
          resilient: 'Enemies take 20% reduced damage',
          aggressive: '+50% Collision Damage',
          regenerating: 'Enemies heal 1.5 HP/second',
          evasive: 'Enemies move erratically',
        };
        
        const modifierColors: Record<string, string> = {
          fortified: '#9370DB',
          swift: '#00FFFF',
          swarm: '#FF6B6B',
          resilient: '#FFD700',
          aggressive: '#FF0000',
          regenerating: '#00FF00',
          evasive: '#FF1493',
        };
        
        waveModifier = {
          id: randomId,
          name: modifierNames[randomId],
          description: modifierDescriptions[randomId],
          color: modifierColors[randomId],
          icon: ['🛡️', '⚡', '🐝', '🔒', '💥', '💚', '👻'][modifierIds.indexOf(randomId)],
        };
      }
      
      // Track weapon usage for missions
      const weaponsUsed = state.missionState.weaponsUsed.includes(state.equippedWeapon)
        ? state.missionState.weaponsUsed
        : [...state.missionState.weaponsUsed, state.equippedWeapon];
      
      return {
        ...state,
        battle: {
          ...state.battle,
          isActive: true,
          currentWave: startWave,
          enemiesKilledThisWave: 0,
          enemiesRequiredForWave: getWaveConfig(startWave).enemiesRequired,
          totalEnemiesKilled: 0,
          waveModifier,
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
        missionState: {
          ...state.missionState,
          weaponsUsed,
          // Reset per-battle tracking
          currentBattleBossKills: 0,
          currentBattleKillStreak: 0,
          currentBattleMaxKillStreak: 0,
          lastKillTime: 0
        }
      };
    }

    case 'END_BATTLE': {
      const { won } = action.payload;
      const newHighScore = Math.max(state.highScore, state.battle.pendingRewards.scoreEarned);
      const newHighestWave = Math.max(state.battle.highestWave, state.battle.currentWave);
      
      // Calculate checkpoint: highest multiple of 10 reached
      // If died on wave 29, checkpoint = 20. If reached wave 30 (even if died on it), checkpoint = 30
      const newCheckpoint = Math.floor(newHighestWave / 10) * 10;
      
      // Update mission tracking
      const missionHighestWave = Math.max(state.missionState.highestWaveReached, state.battle.currentWave);
      
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
        missionState: {
          ...state.missionState,
          totalBattlesCompleted: state.missionState.totalBattlesCompleted + 1,
          highestWaveReached: missionHighestWave
        }
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
      
      // Track for missions - kill streak timing
      const now = Date.now();
      const KILL_STREAK_WINDOW = 10000; // 10 seconds
      let newKillStreak = 1;
      if (now - state.missionState.lastKillTime < KILL_STREAK_WINDOW) {
        newKillStreak = state.missionState.currentBattleKillStreak + 1;
      }
      const newMaxKillStreak = Math.max(state.missionState.currentBattleMaxKillStreak, newKillStreak);
      
      // Track per-enemy-type kills
      const isBoss = enemyType === EnemyType.BOSS;
      const newMissionState = {
        ...state.missionState,
        totalEnemiesKilled: state.missionState.totalEnemiesKilled + 1,
        totalBossesKilled: isBoss ? state.missionState.totalBossesKilled + 1 : state.missionState.totalBossesKilled,
        totalDamageDealt: state.missionState.totalDamageDealt + damage,
        totalCriticalHits: isCrit ? state.missionState.totalCriticalHits + 1 : state.missionState.totalCriticalHits,
        totalGoldEarned: state.missionState.totalGoldEarned + goldEarned,
        currentBattleBossKills: isBoss ? state.missionState.currentBattleBossKills + 1 : state.missionState.currentBattleBossKills,
        currentBattleKillStreak: newKillStreak,
        currentBattleMaxKillStreak: newMaxKillStreak,
        lastKillTime: now,
        // Per-enemy-type tracking
        circlesKilled: enemyType === EnemyType.CIRCLE ? state.missionState.circlesKilled + 1 : state.missionState.circlesKilled,
        squaresKilled: enemyType === EnemyType.SQUARE ? state.missionState.squaresKilled + 1 : state.missionState.squaresKilled,
        trianglesKilled: enemyType === EnemyType.TRIANGLE ? state.missionState.trianglesKilled + 1 : state.missionState.trianglesKilled,
        swarmsKilled: enemyType === EnemyType.SWARM ? state.missionState.swarmsKilled + 1 : state.missionState.swarmsKilled,
        tanksKilled: enemyType === EnemyType.TANK ? state.missionState.tanksKilled + 1 : state.missionState.tanksKilled,
      };

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
        missionState: newMissionState
      };
    }

    case 'ADVANCE_WAVE': {
      const nextWave = state.battle.currentWave + 1;
      const waveConfig = getWaveConfig(state.battle.currentWave);
      
      // Generate random wave modifier for next wave (skip boss waves)
      const isBossWave = nextWave % 5 === 0;
      const shouldHaveModifier = !isBossWave && Math.random() < 0.7; // 70% chance for modifier
      
      let waveModifier = undefined;
      if (shouldHaveModifier) {
        const modifierIds = ['fortified', 'swift', 'swarm', 'resilient', 'aggressive', 'regenerating', 'evasive'];
        const randomId = modifierIds[Math.floor(Math.random() * modifierIds.length)];
        
        const modifierNames: Record<string, string> = {
          fortified: 'Fortified',
          swift: 'Swift',
          swarm: 'Swarm',
          resilient: 'Resilient',
          aggressive: 'Aggressive',
          regenerating: 'Regenerating',
          evasive: 'Evasive',
        };
        
        const modifierDescriptions: Record<string, string> = {
          fortified: '+30% Enemy HP',
          swift: '+25% Enemy Speed',
          swarm: '-40% Enemy HP, -50% Spawn Time',
          resilient: 'Enemies take 20% reduced damage',
          aggressive: '+50% Collision Damage',
          regenerating: 'Enemies heal 1.5 HP/second',
          evasive: 'Enemies move erratically',
        };
        
        const modifierColors: Record<string, string> = {
          fortified: '#9370DB',
          swift: '#00FFFF',
          swarm: '#FF6B6B',
          resilient: '#FFD700',
          aggressive: '#FF0000',
          regenerating: '#00FF00',
          evasive: '#FF1493',
        };
        
        waveModifier = {
          id: randomId,
          name: modifierNames[randomId],
          description: modifierDescriptions[randomId],
          color: modifierColors[randomId],
          icon: ['🛡️', '⚡', '🐝', '🔒', '💥', '💚', '👻'][modifierIds.indexOf(randomId)],
        };
      }
      
      // Update mission tracking - wave completed
      const newHighestWave = Math.max(state.missionState.highestWaveReached, state.battle.currentWave);
      
      return {
        ...state,
        battle: {
          ...state.battle,
          currentWave: nextWave,
          enemiesKilledThisWave: 0,
          enemiesRequiredForWave: getWaveConfig(nextWave).enemiesRequired,
          waveModifier,
          pendingRewards: {
            ...state.battle.pendingRewards,
            goldEarned: state.battle.pendingRewards.goldEarned + waveConfig.waveBonus,
            wavesCompleted: state.battle.pendingRewards.wavesCompleted + 1,
          },
        },
        missionState: {
          ...state.missionState,
          totalWavesCompleted: state.missionState.totalWavesCompleted + 1,
          highestWaveReached: newHighestWave
        }
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
        // Recalculate active synergies after skill upgrade
        activeSynergies: getActiveSynergies(newSkillNodes).map(s => s.id),
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
    // CHIP ACTIONS (Updated for new slot-based system)
    // ============================================

    case 'GRANT_CHIP': {
      const { chipId, level = 1 } = action.payload;
      
      // Verify chip exists in definitions
      const chipDef = getChipById(chipId);
      if (!chipDef) {
        console.warn(`Cannot grant unknown chip: ${chipId}`);
        return state;
      }
      
      // Check if player already owns this chip
      const alreadyOwned = state.chipState.ownedChips.some(c => c.chipId === chipId);
      if (alreadyOwned) {
        console.log(`Player already owns chip: ${chipId}`);
        return state;
      }
      
      // Create new owned chip instance
      const newOwnedChip: OwnedChip = {
        chipId,
        instanceId: `${chipId}_${Date.now()}`,
        level,
        equipped: false,
        slotIndex: undefined
      };
      
      return {
        ...state,
        chipState: {
          ...state.chipState,
          ownedChips: [...state.chipState.ownedChips, newOwnedChip]
        }
      };
    }

    case 'UNLOCK_CHIP_SLOT': {
      const { slotIndex, missionId } = action.payload;
      
      // Validate slot index (0-7)
      if (slotIndex < 0 || slotIndex > 7) return state;
      
      // Check if slot already unlocked
      const slot = state.chipState.slots[slotIndex];
      if (slot && slot.unlocked) return state;
      
      // Update the slot
      const newSlots = [...state.chipState.slots];
      newSlots[slotIndex] = {
        index: slotIndex,
        unlocked: true,
        unlockedByMission: missionId,
        equippedChipId: undefined
      };
      
      return {
        ...state,
        chipState: {
          ...state.chipState,
          slots: newSlots,
          totalSlotsUnlocked: state.chipState.totalSlotsUnlocked + 1
        }
      };
    }

    case 'EQUIP_CHIP': {
      const { instanceId, slotIndex } = action.payload;
      
      // Validate slot index (0-7)
      if (slotIndex < 0 || slotIndex > 7) return state;
      
      // Check if slot is unlocked
      const targetSlot = state.chipState.slots[slotIndex];
      if (!targetSlot || !targetSlot.unlocked) {
        console.warn(`Cannot equip to locked slot ${slotIndex}`);
        return state;
      }
      
      // Find the chip to equip
      const chipToEquip = state.chipState.ownedChips.find(c => c.instanceId === instanceId);
      if (!chipToEquip) return state;
      
      // Update owned chips
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
      const newSlots = state.chipState.slots.map((slot, idx) => {
        if (idx === slotIndex) {
          return { ...slot, equippedChipId: instanceId };
        }
        // Remove from old slot if it was equipped elsewhere
        if (slot.equippedChipId === instanceId) {
          return { ...slot, equippedChipId: undefined };
        }
        return slot;
      });
      
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
      
      const newSlots = state.chipState.slots.map(slot => {
        if (slot.equippedChipId === instanceId) {
          return { ...slot, equippedChipId: undefined };
        }
        return slot;
      });
      
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

    // ============================================
    // MISSION ACTIONS
    // ============================================

    case 'UPDATE_MISSION_PROGRESS': {
      const { missionId, objectiveId, increment } = action.payload;
      
      // Find mission in active or daily/weekly missions
      let foundIn: 'active' | 'daily' | 'weekly' | null = null;
      let missionIndex = state.missionState.activeMissions.findIndex(m => m.id === missionId);
      if (missionIndex >= 0) foundIn = 'active';
      
      if (!foundIn) {
        missionIndex = state.missionState.dailyMissions.findIndex(m => m.id === missionId);
        if (missionIndex >= 0) foundIn = 'daily';
      }
      
      if (!foundIn) {
        missionIndex = state.missionState.weeklyMissions.findIndex(m => m.id === missionId);
        if (missionIndex >= 0) foundIn = 'weekly';
      }
      
      if (!foundIn || missionIndex < 0) return state;
      
      // Get the appropriate mission array
      const missions = foundIn === 'active' 
        ? [...state.missionState.activeMissions]
        : foundIn === 'daily' 
          ? [...state.missionState.dailyMissions]
          : [...state.missionState.weeklyMissions];
      
      const mission = { ...missions[missionIndex] };
      const objIndex = mission.objectives.findIndex(o => o.id === objectiveId);
      if (objIndex < 0) return state;
      
      // Update objective progress
      const newObjectives = [...mission.objectives];
      const obj = { ...newObjectives[objIndex] };
      obj.current = Math.min(obj.current + increment, obj.target);
      newObjectives[objIndex] = obj;
      mission.objectives = newObjectives;
      
      // Check if all objectives are complete
      const allComplete = mission.objectives.every(o => o.current >= o.target);
      if (allComplete && mission.status !== 'COMPLETED') {
        mission.status = 'COMPLETED';
      } else if (mission.status === 'AVAILABLE') {
        mission.status = 'IN_PROGRESS';
      }
      
      missions[missionIndex] = mission;
      
      return {
        ...state,
        missionState: {
          ...state.missionState,
          activeMissions: foundIn === 'active' ? missions : state.missionState.activeMissions,
          dailyMissions: foundIn === 'daily' ? missions : state.missionState.dailyMissions,
          weeklyMissions: foundIn === 'weekly' ? missions : state.missionState.weeklyMissions,
        }
      };
    }

    case 'COMPLETE_MISSION': {
      const { missionId } = action.payload;
      
      // Mark mission as completed
      if (state.missionState.completedMissions.includes(missionId)) return state;
      
      return {
        ...state,
        missionState: {
          ...state.missionState,
          completedMissions: [...state.missionState.completedMissions, missionId],
          totalMissionsCompleted: state.missionState.totalMissionsCompleted + 1
        }
      };
    }

    case 'CLAIM_MISSION_REWARD': {
      const { missionId } = action.payload;
      
      // Find the mission
      let mission = state.missionState.activeMissions.find(m => m.id === missionId);
      let missionSource: 'active' | 'daily' | 'weekly' = 'active';
      
      if (!mission) {
        mission = state.missionState.dailyMissions.find(m => m.id === missionId);
        missionSource = 'daily';
      }
      if (!mission) {
        mission = state.missionState.weeklyMissions.find(m => m.id === missionId);
        missionSource = 'weekly';
      }
      
      if (!mission || mission.status !== 'COMPLETED') return state;
      
      // Process rewards
      let newState = { ...state };
      
      for (const reward of mission.rewards) {
        switch (reward.type) {
          case 'GOLD':
            newState = {
              ...newState,
              stats: { ...newState.stats, gold: newState.stats.gold + (reward.amount || 0) },
              totalGoldEarned: newState.totalGoldEarned + (reward.amount || 0)
            };
            break;
          case 'GEMS':
            newState = {
              ...newState,
              stats: { ...newState.stats, gems: newState.stats.gems + (reward.amount || 0) },
              totalGemsEarned: newState.totalGemsEarned + (reward.amount || 0)
            };
            break;
          case 'CHIP':
            if (reward.id) {
              // Grant specific chip
              const chipDef = getChipById(reward.id);
              if (chipDef && !newState.chipState.ownedChips.some(c => c.chipId === reward.id)) {
                const newChip: OwnedChip = {
                  chipId: reward.id,
                  instanceId: `${reward.id}_${Date.now()}`,
                  level: 1,
                  equipped: false,
                  slotIndex: undefined
                };
                newState = {
                  ...newState,
                  chipState: {
                    ...newState.chipState,
                    ownedChips: [...newState.chipState.ownedChips, newChip]
                  }
                };
              }
            }
            // TODO: Handle random chip by rarity
            break;
          case 'CHIP_SLOT':
            // Find first locked slot and unlock it
            const lockedSlotIndex = newState.chipState.slots.findIndex(s => !s.unlocked);
            if (lockedSlotIndex >= 0) {
              const newSlots = [...newState.chipState.slots];
              newSlots[lockedSlotIndex] = {
                ...newSlots[lockedSlotIndex],
                unlocked: true,
                unlockedByMission: missionId
              };
              newState = {
                ...newState,
                chipState: {
                  ...newState.chipState,
                  slots: newSlots,
                  totalSlotsUnlocked: newState.chipState.totalSlotsUnlocked + 1
                }
              };
            }
            break;
          case 'WEAPON':
            if (reward.id && !newState.unlockedWeapons.includes(reward.id as WeaponType)) {
              newState = {
                ...newState,
                unlockedWeapons: [...newState.unlockedWeapons, reward.id as WeaponType]
              };
            }
            break;
          case 'SKIN':
            if (reward.id && !newState.shop.ownedSkins.includes(reward.id)) {
              newState = {
                ...newState,
                shop: {
                  ...newState.shop,
                  ownedSkins: [...newState.shop.ownedSkins, reward.id]
                }
              };
            }
            break;
        }
      }
      
      // Update mission status to CLAIMED and add to completed
      const updateMissionStatus = (missions: Mission[]) => 
        missions.map(m => m.id === missionId ? { ...m, status: 'CLAIMED' as const } : m);
      
      // Remove from active and add to completed (for permanent missions)
      if (missionSource === 'active') {
        newState = {
          ...newState,
          missionState: {
            ...newState.missionState,
            activeMissions: newState.missionState.activeMissions.filter(m => m.id !== missionId),
            completedMissions: [...newState.missionState.completedMissions, missionId],
            totalMissionsCompleted: newState.missionState.totalMissionsCompleted + 1
          }
        };
        
        // Unlock new missions based on this completion
        const newAvailable = getAvailableMissions(
          newState.missionState.completedMissions,
          newState.missionState.highestWaveReached
        );
        newState = {
          ...newState,
          missionState: {
            ...newState.missionState,
            activeMissions: newAvailable
          }
        };
      } else {
        // For daily/weekly, just mark as claimed
        newState = {
          ...newState,
          missionState: {
            ...newState.missionState,
            dailyMissions: missionSource === 'daily' 
              ? updateMissionStatus(newState.missionState.dailyMissions)
              : newState.missionState.dailyMissions,
            weeklyMissions: missionSource === 'weekly'
              ? updateMissionStatus(newState.missionState.weeklyMissions)
              : newState.missionState.weeklyMissions,
            totalMissionsCompleted: newState.missionState.totalMissionsCompleted + 1
          }
        };
      }
      
      return newState;
    }

    case 'REFRESH_DAILY_MISSIONS': {
      return {
        ...state,
        missionState: {
          ...state.missionState,
          dailyMissions: generateDailyMissions(),
          dailyMissionsRefreshedAt: Date.now()
        }
      };
    }

    case 'REFRESH_WEEKLY_MISSIONS': {
      return {
        ...state,
        missionState: {
          ...state.missionState,
          weeklyMissions: generateWeeklyMissions(),
          weeklyMissionsRefreshedAt: Date.now()
        }
      };
    }

    case 'CHECK_MISSION_UNLOCKS': {
      // Re-check which missions should be available based on current progress
      const newAvailable = getAvailableMissions(
        state.missionState.completedMissions,
        state.missionState.highestWaveReached
      );
      
      return {
        ...state,
        missionState: {
          ...state.missionState,
          activeMissions: newAvailable
        }
      };
    }

    case 'SYNC_MISSION_PROGRESS': {
      // Build tracking stats from missionState
      const trackingStats: MissionTrackingStats = {
        totalEnemiesKilled: state.missionState.totalEnemiesKilled,
        totalBossesKilled: state.missionState.totalBossesKilled,
        totalDamageDealt: state.missionState.totalDamageDealt,
        totalCriticalHits: state.missionState.totalCriticalHits,
        totalGoldEarned: state.missionState.totalGoldEarned,
        totalWavesCompleted: state.missionState.totalWavesCompleted,
        totalBattlesCompleted: state.missionState.totalBattlesCompleted,
        highestWaveReached: state.missionState.highestWaveReached,
        weaponsUsed: state.missionState.weaponsUsed,
        currentBattleBossKills: state.missionState.currentBattleBossKills,
        currentBattleMaxKillStreak: state.missionState.currentBattleMaxKillStreak,
        circlesKilled: state.missionState.circlesKilled,
        squaresKilled: state.missionState.squaresKilled,
        trianglesKilled: state.missionState.trianglesKilled,
        swarmsKilled: state.missionState.swarmsKilled,
        tanksKilled: state.missionState.tanksKilled,
      };
      
      // Sync all mission types
      const syncedActiveMissions = syncMissionProgress(
        state.missionState.activeMissions,
        trackingStats
      );
      const syncedDailyMissions = syncMissionProgress(
        state.missionState.dailyMissions,
        trackingStats
      );
      const syncedWeeklyMissions = syncMissionProgress(
        state.missionState.weeklyMissions,
        trackingStats
      );
      
      return {
        ...state,
        missionState: {
          ...state.missionState,
          activeMissions: syncedActiveMissions,
          dailyMissions: syncedDailyMissions,
          weeklyMissions: syncedWeeklyMissions
        }
      };
    }

    // ============================================
    // ACHIEVEMENT ACTIONS
    // ============================================

    case 'UPDATE_ACHIEVEMENT_PROGRESS': {
      const { achievementId, value } = action.payload;
      
      const currentProgress = state.achievementState.progress[achievementId];
      if (!currentProgress) return state;
      
      return {
        ...state,
        achievementState: {
          ...state.achievementState,
          progress: {
            ...state.achievementState.progress,
            [achievementId]: {
              ...currentProgress,
              currentValue: value
            }
          }
        }
      };
    }

    case 'UNLOCK_ACHIEVEMENT_TIER': {
      const { achievementId, tier } = action.payload;
      
      const currentProgress = state.achievementState.progress[achievementId];
      if (!currentProgress) return state;
      
      // Find the achievement definition to get the reward
      const achievementDef = getAchievementById(achievementId);
      if (!achievementDef) return state;
      
      const tierData = achievementDef.tiers.find(t => t.tier === tier);
      if (!tierData) return state;
      
      let newState = {
        ...state,
        achievementState: {
          ...state.achievementState,
          progress: {
            ...state.achievementState.progress,
            [achievementId]: {
              ...currentProgress,
              currentTier: tier
            }
          },
          totalUnlocked: state.achievementState.totalUnlocked + 1
        }
      };
      
      // Process tier reward
      const reward = tierData.reward;
      switch (reward.type) {
        case 'GOLD':
          newState = {
            ...newState,
            stats: { ...newState.stats, gold: newState.stats.gold + (reward.amount || 0) },
            totalGoldEarned: newState.totalGoldEarned + (reward.amount || 0)
          };
          break;
        case 'GEMS':
          newState = {
            ...newState,
            stats: { ...newState.stats, gems: newState.stats.gems + (reward.amount || 0) },
            totalGemsEarned: newState.totalGemsEarned + (reward.amount || 0)
          };
          break;
        case 'CHIP':
          if (reward.id) {
            const chipDef = getChipById(reward.id);
            if (chipDef && !newState.chipState.ownedChips.some(c => c.chipId === reward.id)) {
              const newChip: OwnedChip = {
                chipId: reward.id,
                instanceId: `${reward.id}_${Date.now()}`,
                level: 1,
                equipped: false,
                slotIndex: undefined
              };
              newState = {
                ...newState,
                chipState: {
                  ...newState.chipState,
                  ownedChips: [...newState.chipState.ownedChips, newChip]
                }
              };
            }
          }
          break;
        case 'CHIP_SLOT':
          const lockedSlotIndex = newState.chipState.slots.findIndex(s => !s.unlocked);
          if (lockedSlotIndex >= 0) {
            const newSlots = [...newState.chipState.slots];
            newSlots[lockedSlotIndex] = {
              ...newSlots[lockedSlotIndex],
              unlocked: true,
              unlockedByMission: `achievement_${achievementId}`
            };
            newState = {
              ...newState,
              chipState: {
                ...newState.chipState,
                slots: newSlots,
                totalSlotsUnlocked: newState.chipState.totalSlotsUnlocked + 1
              }
            };
          }
          break;
      }
      
      return newState;
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
