import React, { useState, useMemo } from 'react';
import { OwnedChip, WeaponType, WEAPONS } from '../../types';
import { 
  Shield, Zap, Cpu, Activity, Info, BarChart2, Layers, Lock, Crosshair, 
  Snowflake, Rocket, Radio, Flame, ChevronUp, Target, Coins, Check, X
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useGame } from '../../contexts/GameContext';
import { 
  getChipById, 
  calculateChipBonus, 
  calculateUpgradeCost, 
  calculateTotalChipBonuses,
  getChipRarityColor,
  getChipRarityBorder 
} from '../../constants/chips';
import { formatNumber } from '../../utils/storage';

const GuardianScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { stats, equippedWeapon, unlockedWeapons, chipState } = state;
  
  // Mobile View Toggle State
  const [mobileView, setMobileView] = useState<'STATS' | 'WEAPONS' | 'CHIPS'>('STATS');
  const [selectedChipInstanceId, setSelectedChipInstanceId] = useState<string | null>(null);

  // Calculate total bonuses from all equipped chips
  const chipBonuses = useMemo(() => {
    return calculateTotalChipBonuses(chipState.ownedChips);
  }, [chipState.ownedChips]);

  // Calculate effective stats (base + chip bonuses)
  const effectiveStats = useMemo(() => {
    const baseDamage = stats.damage;
    const baseCrit = stats.critRate;
    const baseCritDmg = stats.critDamage;
    const baseAtkSpeed = stats.attackSpeed;
    
    return {
      damage: Math.floor(baseDamage + (chipBonuses.damage || 0) + (baseDamage * (chipBonuses.damagePercent || 0) / 100)),
      critRate: Math.min(100, baseCrit + (chipBonuses.critRate || 0)),
      critDamage: baseCritDmg + (chipBonuses.critDamage || 0),
      attackSpeed: baseAtkSpeed * (1 + (chipBonuses.attackSpeed || 0) / 100),
      hp: 3000 + (chipBonuses.hp || 0) + (3000 * (chipBonuses.hpPercent || 0) / 100),
      defense: chipBonuses.defense || 0,
      goldBonus: chipBonuses.goldBonus || 0,
      energyMax: stats.maxEnergy + (chipBonuses.energyMax || 0),
    };
  }, [stats, chipBonuses]);

  // Radar chart data - now using real stats
  const radarData = useMemo(() => [
    { subject: 'ATK', A: Math.min(150, effectiveStats.damage * 2), fullMark: 150 },
    { subject: 'SPD', A: Math.min(150, effectiveStats.attackSpeed * 50), fullMark: 150 },
    { subject: 'CRT', A: Math.min(150, effectiveStats.critRate * 2), fullMark: 150 },
    { subject: 'DEF', A: Math.min(150, effectiveStats.defense * 10 + 50), fullMark: 150 },
    { subject: 'HP', A: Math.min(150, effectiveStats.hp / 30), fullMark: 150 },
    { subject: 'GLD', A: Math.min(150, effectiveStats.goldBonus * 5 + 50), fullMark: 150 },
  ], [effectiveStats]);

  // Get selected chip details
  const selectedOwnedChip = useMemo(() => {
    if (!selectedChipInstanceId) return null;
    return chipState.ownedChips.find(c => c.instanceId === selectedChipInstanceId) || null;
  }, [selectedChipInstanceId, chipState.ownedChips]);

  const selectedChipDef = useMemo(() => {
    if (!selectedOwnedChip) return null;
    return getChipById(selectedOwnedChip.chipId) || null;
  }, [selectedOwnedChip]);

  // Handlers
  const handleEquipChip = (instanceId: string, slotIndex: number) => {
    dispatch({ type: 'EQUIP_CHIP', payload: { instanceId, slotIndex } });
  };

  const handleUnequipChip = (instanceId: string) => {
    dispatch({ type: 'UNEQUIP_CHIP', payload: { instanceId } });
  };

  const handleUpgradeChip = (instanceId: string) => {
    dispatch({ type: 'UPGRADE_CHIP', payload: { instanceId } });
  };

  // Get chip in a specific slot
  const getChipInSlot = (slotIndex: number): OwnedChip | null => {
    const instanceId = chipState.slots[slotIndex];
    if (!instanceId) return null;
    return chipState.ownedChips.find(c => c.instanceId === instanceId) || null;
  };

  return (
    <div className="h-full flex flex-col lg:flex-row p-4 lg:p-8 gap-4 lg:gap-6 overflow-hidden relative">
      
      {/* Mobile View Switcher */}
      <div className="lg:hidden shrink-0 flex p-1 bg-white/5 rounded-xl border border-white/10 mb-2">
        <button 
          onClick={() => setMobileView('STATS')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mobileView === 'STATS' ? 'bg-cyber-blue text-black font-bold' : 'text-gray-500'}`}
        >
          <BarChart2 size={14} />
          <span className="text-[10px] font-orbitron">STATS</span>
        </button>
        <button 
          onClick={() => setMobileView('WEAPONS')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mobileView === 'WEAPONS' ? 'bg-cyber-pink text-black font-bold' : 'text-gray-500'}`}
        >
          <Crosshair size={14} />
          <span className="text-[10px] font-orbitron">WEAPONS</span>
        </button>
        <button 
          onClick={() => setMobileView('CHIPS')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${mobileView === 'CHIPS' ? 'bg-cyber-purple text-white font-bold' : 'text-gray-500'}`}
        >
          <Cpu size={14} />
          <span className="text-[10px] font-orbitron">CHIPS</span>
        </button>
      </div>

      {/* Left Column: Stats Overview */}
      <div className={`
        ${mobileView === 'STATS' ? 'flex' : 'hidden'} lg:flex
        lg:w-[420px] flex-col gap-4 overflow-y-auto no-scrollbar pb-24 lg:pb-0
      `}>
        {/* Radar Chart Panel */}
        <div className="bg-cyber-panel border border-white/5 rounded-3xl p-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={100} />
          </div>
          
          <h2 className="text-xs font-orbitron font-bold text-cyber-blue tracking-[0.3em] mb-4">SYSTEM_CORE_READOUT</h2>
          
          <div className="h-[220px] w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff50', fontSize: 10, fontFamily: 'Orbitron' }} />
                <PolarRadiusAxis domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Guardian" dataKey="A" stroke="#00F0FF" strokeWidth={2} fill="#00F0FF" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dynamic Stat Cards */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Damage" value={effectiveStats.damage} icon={<Zap size={14} />} color="text-cyber-blue" />
            <StatCard label="HP" value={Math.floor(effectiveStats.hp)} icon={<Shield size={14} />} color="text-cyber-green" />
            <StatCard label="Crit Rate" value={`${effectiveStats.critRate.toFixed(1)}%`} icon={<Target size={14} />} color="text-cyber-pink" />
            <StatCard label="Crit Dmg" value={`${effectiveStats.critDamage.toFixed(1)}%`} icon={<Flame size={14} />} color="text-orange-500" />
            <StatCard label="Atk Speed" value={`${effectiveStats.attackSpeed.toFixed(2)}x`} icon={<Activity size={14} />} color="text-cyber-yellow" />
            <StatCard label="Defense" value={`${effectiveStats.defense.toFixed(1)}%`} icon={<Shield size={14} />} color="text-cyan-400" />
          </div>
        </div>

        {/* Chip Bonus Summary */}
        <div className="bg-cyber-panel border border-white/5 rounded-2xl p-4">
          <h3 className="text-[10px] font-orbitron font-bold text-gray-500 tracking-wider mb-3">EQUIPPED CHIP BONUSES</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {chipBonuses.damage ? (
              <div className="flex items-center gap-2 text-cyber-blue">
                <Zap size={12} /> +{chipBonuses.damage} DMG
              </div>
            ) : null}
            {chipBonuses.damagePercent ? (
              <div className="flex items-center gap-2 text-cyber-blue">
                <Zap size={12} /> +{chipBonuses.damagePercent.toFixed(1)}% DMG
              </div>
            ) : null}
            {chipBonuses.hp ? (
              <div className="flex items-center gap-2 text-cyber-green">
                <Shield size={12} /> +{chipBonuses.hp} HP
              </div>
            ) : null}
            {chipBonuses.critRate ? (
              <div className="flex items-center gap-2 text-cyber-pink">
                <Target size={12} /> +{chipBonuses.critRate.toFixed(1)}% CRIT
              </div>
            ) : null}
            {chipBonuses.attackSpeed ? (
              <div className="flex items-center gap-2 text-cyber-yellow">
                <Activity size={12} /> +{chipBonuses.attackSpeed.toFixed(1)}% SPD
              </div>
            ) : null}
            {chipBonuses.goldBonus ? (
              <div className="flex items-center gap-2 text-yellow-400">
                <Coins size={12} /> +{chipBonuses.goldBonus.toFixed(1)}% GOLD
              </div>
            ) : null}
          </div>
        </div>

        {/* Desktop: Weapons Panel */}
        <div className="hidden lg:block bg-cyber-panel border border-white/5 rounded-2xl p-4">
          <h3 className="text-xs font-orbitron font-bold text-cyber-pink tracking-wider mb-3">WEAPON_SYSTEMS</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(WEAPONS).map(([key, weapon]) => {
              const weaponType = key as WeaponType;
              const isUnlocked = unlockedWeapons?.includes(weaponType);
              const isEquipped = equippedWeapon === weaponType;
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (isUnlocked) {
                      dispatch({ type: 'EQUIP_WEAPON', payload: { weapon: weaponType } });
                    } else if (stats.gold >= weapon.unlockCost) {
                      dispatch({ type: 'UNLOCK_WEAPON', payload: { weapon: weaponType } });
                    }
                  }}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all text-left
                    ${isEquipped ? 'border-cyber-pink bg-cyber-pink/20' : 
                      isUnlocked ? 'border-white/20 bg-white/5 hover:border-white/40' : 
                      'border-white/10 bg-black/30 opacity-70'}
                  `}
                >
                  {!isUnlocked && <Lock size={12} className="absolute top-2 right-2 text-gray-500" />}
                  {isEquipped && (
                    <div className="absolute top-2 right-2 text-[8px] font-bold text-cyber-pink">✓</div>
                  )}
                  <div className="flex items-center gap-2">
                    <WeaponIcon type={weaponType} size={20} />
                    <div>
                      <div className="text-xs font-bold">{weapon.name}</div>
                      {!isUnlocked && (
                        <div className="text-[9px] text-cyber-yellow">🪙 {weapon.unlockCost}</div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Weapons Panel */}
      <div className={`
        ${mobileView === 'WEAPONS' ? 'flex' : 'hidden'} lg:hidden
        flex-col gap-4 pb-24 overflow-y-auto
      `}>
        <div className="bg-cyber-panel border border-white/5 rounded-3xl p-6">
          <h2 className="text-xs font-orbitron font-bold text-cyber-pink tracking-[0.3em] mb-4">WEAPON_SYSTEMS</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(WEAPONS).map(([key, weapon]) => {
              const weaponType = key as WeaponType;
              const isUnlocked = unlockedWeapons?.includes(weaponType);
              const isEquipped = equippedWeapon === weaponType;
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (isUnlocked) {
                      dispatch({ type: 'EQUIP_WEAPON', payload: { weapon: weaponType } });
                    } else if (stats.gold >= weapon.unlockCost) {
                      dispatch({ type: 'UNLOCK_WEAPON', payload: { weapon: weaponType } });
                    }
                  }}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all
                    ${isEquipped ? 'border-cyber-pink bg-cyber-pink/20 ring-2 ring-cyber-pink/30' : 
                      isUnlocked ? 'border-white/20 bg-white/5 hover:border-white/40' : 
                      'border-white/10 bg-black/30 opacity-70'}
                  `}
                >
                  {!isUnlocked && <Lock size={14} className="absolute top-2 right-2 text-gray-500" />}
                  {isEquipped && (
                    <div className="absolute top-2 right-2 text-[8px] font-bold text-cyber-pink bg-cyber-pink/20 px-1.5 py-0.5 rounded">
                      EQUIPPED
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-xl ${isEquipped ? 'bg-cyber-pink/30' : 'bg-white/10'}`}>
                      <WeaponIcon type={weaponType} size={28} />
                    </div>
                    <div className="text-sm font-orbitron font-bold">{weapon.name}</div>
                    <div className="text-[10px] text-gray-400 text-center line-clamp-2">{weapon.description}</div>
                    
                    {!isUnlocked && (
                      <div className="flex items-center gap-1 text-cyber-yellow text-xs font-bold mt-1">
                        <Coins size={12} /> {weapon.unlockCost}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                      {weapon.splashRadius && <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">SPLASH</span>}
                      {weapon.piercing && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">PIERCE</span>}
                      {weapon.slowPercent && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">SLOW</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Your Gold:</span>
              <span className="text-sm font-bold text-cyber-yellow">🪙 {formatNumber(stats.gold)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Chip Array */}
      <div className={`
        ${mobileView === 'CHIPS' ? 'flex' : 'hidden'} lg:flex
        flex-1 flex-col min-h-0 bg-cyber-panel/50 border border-white/5 rounded-3xl p-4 lg:p-6 backdrop-blur-xl
        pb-2 lg:pb-6
      `}>
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h2 className="text-lg font-orbitron font-bold">NEURAL_ARRAY</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">6 Chip Slots • Tap to inspect</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Gold</div>
            <div className="text-sm font-bold text-cyber-yellow flex items-center gap-1">
              <Coins size={14} /> {formatNumber(stats.gold)}
            </div>
          </div>
        </div>

        {/* Chip Slots Grid (6 slots) */}
        <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
          {[0, 1, 2, 3, 4, 5].map(slotIndex => {
            const ownedChip = getChipInSlot(slotIndex);
            const chipDef = ownedChip ? getChipById(ownedChip.chipId) : null;
            const isSelected = selectedChipInstanceId === ownedChip?.instanceId;
            
            return (
              <button
                key={slotIndex}
                onClick={() => ownedChip && setSelectedChipInstanceId(ownedChip.instanceId)}
                className={`
                  aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all relative overflow-hidden
                  ${ownedChip && chipDef ? getChipRarityBorder(chipDef.rarity) : 'border-dashed border-white/20'}
                  ${isSelected ? 'ring-4 ring-white/30 scale-105 z-10' : 'hover:scale-[1.02]'}
                  ${ownedChip ? 'bg-cyber-dark/60' : 'bg-black/20'}
                `}
              >
                {ownedChip && chipDef ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <ChipIcon type={chipDef.type} size={24} color={getChipRarityColor(chipDef.rarity)} />
                    <div className="absolute bottom-1.5 font-mono text-[9px] font-black text-white/80">LV.{ownedChip.level}</div>
                    <div 
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: getChipRarityColor(chipDef.rarity) }}
                    />
                  </>
                ) : (
                  <div className="text-white/20 text-xs font-orbitron">EMPTY</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-4 shrink-0">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[9px] text-gray-500 font-orbitron">INVENTORY</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Inventory (unequipped chips) */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-2">
            {chipState.ownedChips.filter(c => !c.equipped).map(ownedChip => {
              const chipDef = getChipById(ownedChip.chipId);
              if (!chipDef) return null;
              const isSelected = selectedChipInstanceId === ownedChip.instanceId;
              
              return (
                <button
                  key={ownedChip.instanceId}
                  onClick={() => setSelectedChipInstanceId(ownedChip.instanceId)}
                  className={`
                    aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all relative
                    ${getChipRarityBorder(chipDef.rarity)}
                    ${isSelected ? 'ring-2 ring-white/30 scale-105' : 'hover:scale-[1.02]'}
                    bg-cyber-dark/40
                  `}
                >
                  <ChipIcon type={chipDef.type} size={18} color={getChipRarityColor(chipDef.rarity)} />
                  <div className="absolute bottom-1 font-mono text-[8px] font-bold">LV.{ownedChip.level}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Chip Details Panel */}
        <div className={`
          mt-4 pt-4 border-t border-white/10 shrink-0 min-h-[140px] mb-20 lg:mb-0
          transition-opacity duration-200
          ${selectedOwnedChip ? 'opacity-100' : 'opacity-30'}
        `}>
          {selectedOwnedChip && selectedChipDef ? (
            <div className="flex gap-4">
              {/* Chip Icon */}
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center border-2 shrink-0"
                style={{ borderColor: getChipRarityColor(selectedChipDef.rarity) }}
              >
                <ChipIcon type={selectedChipDef.type} size={32} color={getChipRarityColor(selectedChipDef.rarity)} />
              </div>
              
              {/* Chip Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-sm font-orbitron font-bold">{selectedChipDef.name}</h3>
                    <div 
                      className="text-[9px] font-bold uppercase"
                      style={{ color: getChipRarityColor(selectedChipDef.rarity) }}
                    >
                      {selectedChipDef.rarity} • LV.{selectedOwnedChip.level}/{selectedChipDef.maxLevel}
                    </div>
                  </div>
                  {selectedOwnedChip.equipped && (
                    <span className="text-[9px] font-bold text-cyber-blue bg-cyber-blue/20 px-2 py-0.5 rounded">EQUIPPED</span>
                  )}
                </div>
                
                <p className="text-[10px] text-gray-400 mb-2 line-clamp-2">{selectedChipDef.description}</p>
                
                {/* Current Bonuses */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(() => {
                    const bonus = calculateChipBonus(selectedChipDef, selectedOwnedChip.level);
                    return (
                      <>
                        {bonus.damage && <BonusTag label={`+${bonus.damage} DMG`} color="cyan" />}
                        {bonus.damagePercent && <BonusTag label={`+${bonus.damagePercent.toFixed(1)}% DMG`} color="cyan" />}
                        {bonus.hp && <BonusTag label={`+${bonus.hp} HP`} color="green" />}
                        {bonus.critRate && <BonusTag label={`+${bonus.critRate.toFixed(1)}% CRIT`} color="pink" />}
                        {bonus.critDamage && <BonusTag label={`+${bonus.critDamage.toFixed(1)}% CDMG`} color="orange" />}
                        {bonus.attackSpeed && <BonusTag label={`+${bonus.attackSpeed.toFixed(1)}% SPD`} color="yellow" />}
                        {bonus.defense && <BonusTag label={`+${bonus.defense.toFixed(1)}% DEF`} color="blue" />}
                        {bonus.goldBonus && <BonusTag label={`+${bonus.goldBonus.toFixed(1)}% GOLD`} color="gold" />}
                      </>
                    );
                  })()}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  {selectedOwnedChip.equipped ? (
                    <button
                      onClick={() => handleUnequipChip(selectedOwnedChip.instanceId)}
                      className="flex-1 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold
                        hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={12} /> Unequip
                    </button>
                  ) : (
                    <>
                      {/* Find first empty slot */}
                      {(() => {
                        const emptySlot = chipState.slots.findIndex(s => s === null);
                        if (emptySlot >= 0) {
                          return (
                            <button
                              onClick={() => handleEquipChip(selectedOwnedChip.instanceId, emptySlot)}
                              className="flex-1 py-2 rounded-lg bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue text-xs font-bold
                                hover:bg-cyber-blue/30 transition-colors flex items-center justify-center gap-1"
                            >
                              <Check size={12} /> Equip (Slot {emptySlot + 1})
                            </button>
                          );
                        }
                        return (
                          <div className="flex-1 py-2 text-center text-[10px] text-gray-500">
                            All slots full - unequip one first
                          </div>
                        );
                      })()}
                    </>
                  )}
                  
                  {/* Upgrade Button */}
                  {selectedOwnedChip.level < selectedChipDef.maxLevel && (
                    <button
                      onClick={() => handleUpgradeChip(selectedOwnedChip.instanceId)}
                      disabled={stats.gold < calculateUpgradeCost(selectedChipDef, selectedOwnedChip.level)}
                      className={`
                        flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors
                        ${stats.gold >= calculateUpgradeCost(selectedChipDef, selectedOwnedChip.level)
                          ? 'bg-cyber-yellow/20 border border-cyber-yellow/50 text-cyber-yellow hover:bg-cyber-yellow/30'
                          : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'}
                      `}
                    >
                      <ChevronUp size={12} /> 
                      Upgrade ({formatNumber(calculateUpgradeCost(selectedChipDef, selectedOwnedChip.level))})
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Info size={24} className="mb-2" />
              <p className="text-xs font-orbitron uppercase tracking-wider">Select a chip to inspect</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// HELPER COMPONENTS
// ============================================

const StatCard = ({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-2">
      <div className={`${color} opacity-70`}>{icon}</div>
      <div className="text-[9px] text-gray-500 uppercase tracking-tight">{label}</div>
    </div>
    <div className="text-xs font-bold font-mono">{value}</div>
  </div>
);

const BonusTag = ({ label, color }: { label: string; color: string }) => {
  const colorClasses: Record<string, string> = {
    cyan: 'bg-cyan-500/20 text-cyan-400',
    green: 'bg-green-500/20 text-green-400',
    pink: 'bg-pink-500/20 text-pink-400',
    orange: 'bg-orange-500/20 text-orange-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
    gold: 'bg-amber-500/20 text-amber-400',
  };
  
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${colorClasses[color] || colorClasses.cyan}`}>
      {label}
    </span>
  );
};

const ChipIcon = ({ type, size, color }: { type: string; size: number; color?: string }) => {
  const style = color ? { color } : {};
  switch (type) {
    case 'ATTACK': return <Zap size={size} style={style} />;
    case 'DEFENSE': return <Shield size={size} style={style} />;
    case 'UTILITY': return <Cpu size={size} style={style} />;
    default: return <Cpu size={size} style={style} />;
  }
};

const WeaponIcon = ({ type, size }: { type: WeaponType; size: number }) => {
  switch (type) {
    case WeaponType.BLASTER: return <Zap size={size} className="text-cyber-blue" />;
    case WeaponType.MISSILE: return <Rocket size={size} className="text-orange-500" />;
    case WeaponType.LASER: return <Radio size={size} className="text-cyan-400" />;
    case WeaponType.CRYO: return <Snowflake size={size} className="text-blue-400" />;
    default: return <Crosshair size={size} className="text-gray-400" />;
  }
};

export default GuardianScreen;