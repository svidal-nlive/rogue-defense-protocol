import React, { useState, useMemo } from 'react';
import { ShopCategory, WeaponSkin, BaseSkin, BoostItem, CurrencyType } from '../../types';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/storage';
import { WEAPON_SKINS, BASE_SKINS, BOOST_ITEMS, getRarityColor, getRarityBorder } from '../../constants/shopItems';
import { 
  ShoppingBag, Zap, Shield, Sparkles, Check, Coins, Gem, 
  X, Package, ChevronRight, Lock, Crown, Star, Timer
} from 'lucide-react';

const ShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('BOOSTS');
  const [selectedItem, setSelectedItem] = useState<WeaponSkin | BaseSkin | BoostItem | null>(null);
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(null);

  // Get item counts
  const getOwnedBoostCount = (boostId: string) => {
    const owned = state.shop.ownedBoosts.find(b => b.boostId === boostId);
    return owned?.quantity || 0;
  };

  const isOwned = (itemId: string) => state.shop.ownedSkins.includes(itemId);
  const isEquippedWeapon = (skinId: string) => state.shop.equippedWeaponSkin === skinId;
  const isEquippedBase = (skinId: string) => state.shop.equippedBaseSkin === skinId;

  const canAfford = (price: number, currency: CurrencyType) => {
    return currency === 'gems' ? state.stats.gems >= price : state.stats.gold >= price;
  };

  // Handle purchase
  const handlePurchase = (item: WeaponSkin | BaseSkin | BoostItem) => {
    if (!canAfford(item.price, item.currency)) return;
    
    if (item.type === 'BOOST') {
      dispatch({ type: 'PURCHASE_BOOST', payload: { boostId: item.id } });
    } else {
      if (isOwned(item.id)) return;
      dispatch({ type: 'PURCHASE_SKIN', payload: { skinId: item.id } });
    }
    
    setPurchaseAnimation(item.id);
    setTimeout(() => setPurchaseAnimation(null), 500);
  };

  // Handle equip
  const handleEquip = (item: WeaponSkin | BaseSkin) => {
    if (!isOwned(item.id)) return;
    
    if (item.type === 'WEAPON_SKIN') {
      dispatch({ type: 'EQUIP_WEAPON_SKIN', payload: { skinId: item.id } });
    } else {
      dispatch({ type: 'EQUIP_BASE_SKIN', payload: { skinId: item.id } });
    }
  };

  // Handle boost activation
  const handleActivateBoost = (boost: BoostItem) => {
    const owned = getOwnedBoostCount(boost.id);
    if (owned <= 0) return;
    dispatch({ type: 'ACTIVATE_BOOST', payload: { boostId: boost.id } });
  };

  const isBoostActive = (boostId: string) => {
    return state.shop.activeBoosts.some(b => b.boostId === boostId);
  };

  // Category tabs config
  const categories: { id: ShopCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'BOOSTS', label: 'Boosts', icon: <Zap size={16} /> },
    { id: 'WEAPON_SKINS', label: 'Weapons', icon: <Sparkles size={16} /> },
    { id: 'BASE_SKINS', label: 'Base', icon: <Shield size={16} /> },
  ];

  // Get current items
  const currentItems = useMemo(() => {
    switch (activeCategory) {
      case 'BOOSTS': return BOOST_ITEMS;
      case 'WEAPON_SKINS': return WEAPON_SKINS;
      case 'BASE_SKINS': return BASE_SKINS;
      default: return [];
    }
  }, [activeCategory]);

  // Render a single item card
  const renderItemCard = (item: WeaponSkin | BaseSkin | BoostItem) => {
    const owned = item.type === 'BOOST' 
      ? getOwnedBoostCount(item.id) 
      : isOwned(item.id);
    const equipped = item.type === 'WEAPON_SKIN' 
      ? isEquippedWeapon(item.id) 
      : item.type === 'BASE_SKIN' 
        ? isEquippedBase(item.id) 
        : false;
    const active = item.type === 'BOOST' && isBoostActive(item.id);
    const affordable = canAfford(item.price, item.currency);
    const isPurchasing = purchaseAnimation === item.id;
    const isFree = item.price === 0;

    return (
      <button
        key={item.id}
        onClick={() => setSelectedItem(item)}
        className={`
          relative p-4 rounded-2xl border-2 transition-all duration-300 text-left
          ${getRarityBorder(item.rarity)}
          ${selectedItem?.id === item.id ? 'ring-4 ring-white/20 scale-[1.02]' : 'hover:scale-[1.01]'}
          ${isPurchasing ? 'animate-pulse' : ''}
          bg-gradient-to-br from-white/5 to-transparent
        `}
      >
        {/* Rarity glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-20 blur-xl -z-10"
          style={{ backgroundColor: getRarityColor(item.rarity) }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Preview circle */}
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10"
              style={{ 
                background: item.type === 'WEAPON_SKIN' 
                  ? `linear-gradient(135deg, ${(item as WeaponSkin).projectileColor}, ${(item as WeaponSkin).trailColor})`
                  : item.type === 'BASE_SKIN'
                    ? `linear-gradient(135deg, ${(item as BaseSkin).coreColor}, ${(item as BaseSkin).ringColor})`
                    : 'linear-gradient(135deg, #00F0FF, #9D4EDD)'
              }}
            >
              {item.type === 'BOOST' && <Zap size={18} className="text-white drop-shadow-lg" />}
              {item.type === 'WEAPON_SKIN' && <Sparkles size={18} className="text-white drop-shadow-lg" />}
              {item.type === 'BASE_SKIN' && <Shield size={18} className="text-white drop-shadow-lg" />}
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm leading-tight">{item.name}</h4>
              <p 
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: getRarityColor(item.rarity) }}
              >
                {item.rarity}
              </p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-col items-end gap-1">
            {equipped && (
              <span className="px-2 py-0.5 bg-cyber-blue/20 border border-cyber-blue/50 rounded-full text-[9px] font-bold text-cyber-blue uppercase">
                Equipped
              </span>
            )}
            {active && (
              <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/50 rounded-full text-[9px] font-bold text-green-400 uppercase flex items-center gap-1">
                <Timer size={10} /> Active
              </span>
            )}
            {item.type === 'BOOST' && typeof owned === 'number' && owned > 0 && (
              <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded-full text-[9px] font-bold text-white">
                x{owned}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>

        {/* Price / Status */}
        <div className="flex items-center justify-between">
          {item.type !== 'BOOST' && isOwned(item.id) ? (
            <span className="flex items-center gap-1 text-green-400 text-xs font-bold">
              <Check size={14} /> Owned
            </span>
          ) : isFree ? (
            <span className="text-green-400 text-xs font-bold">FREE</span>
          ) : (
            <div className={`flex items-center gap-1.5 ${affordable ? '' : 'text-red-400'}`}>
              {item.currency === 'gems' ? (
                <Gem size={14} className="text-purple-400" />
              ) : (
                <Coins size={14} className="text-cyber-yellow" />
              )}
              <span className="font-mono font-bold text-sm">{formatNumber(item.price)}</span>
            </div>
          )}

          <ChevronRight size={16} className="text-gray-500" />
        </div>
      </button>
    );
  };

  // Detail panel for selected item
  const renderDetailPanel = () => {
    if (!selectedItem) return null;

    const owned = selectedItem.type === 'BOOST' 
      ? getOwnedBoostCount(selectedItem.id) 
      : isOwned(selectedItem.id);
    const equipped = selectedItem.type === 'WEAPON_SKIN' 
      ? isEquippedWeapon(selectedItem.id) 
      : selectedItem.type === 'BASE_SKIN' 
        ? isEquippedBase(selectedItem.id) 
        : false;
    const active = selectedItem.type === 'BOOST' && isBoostActive(selectedItem.id);
    const affordable = canAfford(selectedItem.price, selectedItem.currency);
    const isFree = selectedItem.price === 0;

    return (
      <div className={`
        bg-cyber-panel border-t lg:border-t-0 lg:border-l border-white/10 p-6 flex flex-col
        fixed lg:relative
        transition-transform duration-300 ease-in-out
        translate-y-0
        
        left-0 right-0 bottom-20 z-40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)]
        h-auto max-h-[70vh]
        
        lg:h-full lg:w-[380px] lg:rounded-none lg:bottom-0 lg:shadow-none lg:max-h-none
      `}>
        {/* Mobile handle */}
        <div className="lg:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" onClick={() => setSelectedItem(null)} />
        
        {/* Close button */}
        <button 
          onClick={() => setSelectedItem(null)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Item preview */}
        <div className="flex flex-col items-center mb-6">
          <div 
            className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4 border-2"
            style={{ 
              background: selectedItem.type === 'WEAPON_SKIN' 
                ? `linear-gradient(135deg, ${(selectedItem as WeaponSkin).projectileColor}, ${(selectedItem as WeaponSkin).trailColor})`
                : selectedItem.type === 'BASE_SKIN'
                  ? `linear-gradient(135deg, ${(selectedItem as BaseSkin).coreColor}, ${(selectedItem as BaseSkin).ringColor})`
                  : 'linear-gradient(135deg, #00F0FF, #9D4EDD)',
              borderColor: getRarityColor(selectedItem.rarity)
            }}
          >
            {selectedItem.type === 'BOOST' && <Zap size={40} className="text-white drop-shadow-lg" />}
            {selectedItem.type === 'WEAPON_SKIN' && <Sparkles size={40} className="text-white drop-shadow-lg" />}
            {selectedItem.type === 'BASE_SKIN' && <Shield size={40} className="text-white drop-shadow-lg" />}
          </div>

          <h3 className="text-xl font-orbitron font-bold text-center mb-1">{selectedItem.name}</h3>
          <p 
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-1"
            style={{ color: getRarityColor(selectedItem.rarity) }}
          >
            {selectedItem.rarity === 'LEGENDARY' && <Crown size={12} />}
            {selectedItem.rarity === 'EPIC' && <Star size={12} />}
            {selectedItem.rarity}
          </p>
        </div>

        {/* Description */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
          <p className="text-sm text-gray-300 leading-relaxed">{selectedItem.description}</p>
        </div>

        {/* Boost-specific info */}
        {selectedItem.type === 'BOOST' && (
          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Duration</span>
              <span className="font-bold text-purple-400">
                {(selectedItem as BoostItem).duration 
                  ? `${(selectedItem as BoostItem).duration! / 1000}s` 
                  : 'Instant'}
              </span>
            </div>
            {(selectedItem as BoostItem).stackable && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">Stackable</span>
                <span className="font-bold text-green-400">Yes</span>
              </div>
            )}
          </div>
        )}

        {/* Skin-specific info */}
        {selectedItem.type === 'WEAPON_SKIN' && (
          <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20 mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Applies To</span>
              <span className="font-bold text-cyan-400">
                {(selectedItem as WeaponSkin).weaponType === 'ALL' 
                  ? 'All Weapons' 
                  : (selectedItem as WeaponSkin).weaponType}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Trail Style</span>
              <span className="font-bold text-cyan-400 capitalize">
                {(selectedItem as WeaponSkin).trailStyle}
              </span>
            </div>
          </div>
        )}

        {selectedItem.type === 'BASE_SKIN' && (
          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Style</span>
              <span className="font-bold text-emerald-400 capitalize">
                {(selectedItem as BaseSkin).style}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto space-y-3">
          {/* Price display */}
          {selectedItem.type === 'BOOST' || !isOwned(selectedItem.id) ? (
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-gray-500 font-orbitron uppercase">Price</span>
              {isFree ? (
                <span className="text-green-400 font-bold">FREE</span>
              ) : (
                <div className={`flex items-center gap-2 ${affordable ? '' : 'text-red-400'}`}>
                  {selectedItem.currency === 'gems' ? (
                    <Gem size={16} className="text-purple-400" />
                  ) : (
                    <Coins size={16} className="text-cyber-yellow" />
                  )}
                  <span className="font-mono font-bold text-lg">{formatNumber(selectedItem.price)}</span>
                </div>
              )}
            </div>
          ) : null}

          {/* Buy button for skins */}
          {(selectedItem.type === 'WEAPON_SKIN' || selectedItem.type === 'BASE_SKIN') && !isOwned(selectedItem.id) && (
            <button
              onClick={() => handlePurchase(selectedItem)}
              disabled={!affordable}
              className={`
                w-full py-4 rounded-xl font-orbitron font-bold text-sm uppercase tracking-wider
                transition-all duration-300
                ${affordable 
                  ? 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white hover:shadow-lg hover:shadow-cyber-blue/30' 
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'}
              `}
            >
              {affordable ? (isFree ? 'Claim Free' : 'Purchase') : 'Not Enough Currency'}
            </button>
          )}

          {/* Equip button for owned skins */}
          {(selectedItem.type === 'WEAPON_SKIN' || selectedItem.type === 'BASE_SKIN') && isOwned(selectedItem.id) && !equipped && (
            <button
              onClick={() => handleEquip(selectedItem as WeaponSkin | BaseSkin)}
              className="w-full py-4 rounded-xl font-orbitron font-bold text-sm uppercase tracking-wider
                bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
            >
              Equip
            </button>
          )}

          {/* Already equipped */}
          {(selectedItem.type === 'WEAPON_SKIN' || selectedItem.type === 'BASE_SKIN') && equipped && (
            <div className="w-full py-4 rounded-xl font-orbitron font-bold text-sm uppercase tracking-wider text-center
              bg-white/5 border border-cyber-blue/50 text-cyber-blue">
              <Check size={16} className="inline mr-2" /> Currently Equipped
            </div>
          )}

          {/* Boost: Buy button */}
          {selectedItem.type === 'BOOST' && (
            <button
              onClick={() => handlePurchase(selectedItem)}
              disabled={!affordable}
              className={`
                w-full py-4 rounded-xl font-orbitron font-bold text-sm uppercase tracking-wider
                transition-all duration-300
                ${affordable 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30' 
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'}
              `}
            >
              {affordable 
                ? `Buy (You have: ${getOwnedBoostCount(selectedItem.id)})` 
                : 'Not Enough Currency'}
            </button>
          )}

          {/* Boost: Activate button */}
          {selectedItem.type === 'BOOST' && getOwnedBoostCount(selectedItem.id) > 0 && !active && (
            <button
              onClick={() => handleActivateBoost(selectedItem as BoostItem)}
              className="w-full py-4 rounded-xl font-orbitron font-bold text-sm uppercase tracking-wider
                bg-gradient-to-r from-green-500 to-emerald-500 text-white
                hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
            >
              <Zap size={16} className="inline mr-2" /> Activate Now
            </button>
          )}

          {/* Boost: Already active */}
          {selectedItem.type === 'BOOST' && active && (
            <div className="w-full py-4 rounded-xl font-orbitron font-bold text-sm uppercase tracking-wider text-center
              bg-green-500/10 border border-green-500/50 text-green-400 flex items-center justify-center gap-2">
              <Timer size={16} /> Boost Active
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-cyber-black relative">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 pb-24 lg:pb-8 min-h-0">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 shrink-0 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-orbitron font-black tracking-tighter flex items-center gap-3">
              <ShoppingBag className="text-cyber-purple" />
              MARKET_HUB
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-[0.4em]">Tactical Equipment Exchange</p>
          </div>

          {/* Category Tabs */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start lg:self-auto overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSelectedItem(null); }}
                className={`
                  px-4 py-2 rounded-lg text-xs font-bold font-orbitron uppercase transition-all whitespace-nowrap
                  flex items-center gap-2
                  ${activeCategory === cat.id 
                    ? 'bg-white text-black shadow-lg shadow-white/10' 
                    : 'text-gray-500 hover:text-white'}
                `}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentItems.map((item) => renderItemCard(item as WeaponSkin | BaseSkin | BoostItem))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedItem && renderDetailPanel()}
    </div>
  );
};

export default ShopScreen;
