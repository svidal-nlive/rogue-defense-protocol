import { WeaponSkin, BaseSkin, BoostItem, WeaponType } from '../types';

// ============================================
// WEAPON SKINS
// ============================================

export const WEAPON_SKINS: WeaponSkin[] = [
  // Default (free)
  {
    id: 'skin_default',
    type: 'WEAPON_SKIN',
    name: 'Standard Issue',
    description: 'Default projectile appearance.',
    price: 0,
    currency: 'gold',
    icon: 'circle',
    rarity: 'COMMON',
    weaponType: 'ALL',
    projectileColor: '#00F0FF',
    trailColor: '#00F0FF',
    trailStyle: 'normal',
  },
  // Gold tier (purchased with gold)
  {
    id: 'skin_flame',
    type: 'WEAPON_SKIN',
    name: 'Inferno Core',
    description: 'Blazing projectiles that leave a trail of flames.',
    price: 5000,
    currency: 'gold',
    icon: 'flame',
    rarity: 'RARE',
    weaponType: 'ALL',
    projectileColor: '#FF6B00',
    trailColor: '#FF3300',
    trailStyle: 'flame',
    particleEffect: 'smoke',
  },
  {
    id: 'skin_electric',
    type: 'WEAPON_SKIN',
    name: 'Tesla Surge',
    description: 'Crackling electric energy courses through each shot.',
    price: 7500,
    currency: 'gold',
    icon: 'zap',
    rarity: 'RARE',
    weaponType: 'ALL',
    projectileColor: '#FCEE0A',
    trailColor: '#00F0FF',
    trailStyle: 'electric',
    particleEffect: 'lightning',
  },
  {
    id: 'skin_frost',
    type: 'WEAPON_SKIN',
    name: 'Arctic Blast',
    description: 'Frozen projectiles with crystalline trails.',
    price: 7500,
    currency: 'gold',
    icon: 'snowflake',
    rarity: 'RARE',
    weaponType: 'ALL',
    projectileColor: '#88FFFF',
    trailColor: '#FFFFFF',
    trailStyle: 'ice',
    particleEffect: 'snowflake',
  },
  // Premium tier (gems only)
  {
    id: 'skin_void',
    type: 'WEAPON_SKIN',
    name: 'Void Walker',
    description: 'Dark matter projectiles that consume light.',
    price: 100,
    currency: 'gems',
    icon: 'moon',
    rarity: 'EPIC',
    weaponType: 'ALL',
    projectileColor: '#8B00FF',
    trailColor: '#4B0082',
    trailStyle: 'void',
    particleEffect: 'sparkle',
  },
  {
    id: 'skin_rainbow',
    type: 'WEAPON_SKIN',
    name: 'Prismatic Fury',
    description: 'Color-shifting projectiles with rainbow trails.',
    price: 150,
    currency: 'gems',
    icon: 'palette',
    rarity: 'LEGENDARY',
    weaponType: 'ALL',
    projectileColor: '#FF00FF',
    trailColor: '#00FFFF',
    trailStyle: 'rainbow',
    particleEffect: 'sparkle',
  },
  {
    id: 'skin_gold_elite',
    type: 'WEAPON_SKIN',
    name: 'Golden Arsenal',
    description: 'Prestigious gold-plated rounds for the elite.',
    price: 200,
    currency: 'gems',
    icon: 'crown',
    rarity: 'LEGENDARY',
    weaponType: 'ALL',
    projectileColor: '#FFD700',
    trailColor: '#FFA500',
    trailStyle: 'normal',
    particleEffect: 'sparkle',
  },
];

// ============================================
// BASE SKINS
// ============================================

export const BASE_SKINS: BaseSkin[] = [
  // Default
  {
    id: 'base_default',
    type: 'BASE_SKIN',
    name: 'Protocol Standard',
    description: 'Default defense station appearance.',
    price: 0,
    currency: 'gold',
    icon: 'shield',
    rarity: 'COMMON',
    coreColor: '#00F0FF',
    ringColor: '#00F0FF',
    shieldColor: '#00F0FF',
    glowColor: '#00F0FF',
    style: 'default',
  },
  // Gold tier
  {
    id: 'base_neon',
    type: 'BASE_SKIN',
    name: 'Neon Reactor',
    description: 'Vibrant neon lighting with pulsing effects.',
    price: 8000,
    currency: 'gold',
    icon: 'zap',
    rarity: 'RARE',
    coreColor: '#FF00FF',
    ringColor: '#00FFFF',
    shieldColor: '#FF00FF',
    glowColor: '#00FFFF',
    style: 'neon',
  },
  {
    id: 'base_fire',
    type: 'BASE_SKIN',
    name: 'Infernal Fortress',
    description: 'Burning core with flame-like shield effects.',
    price: 10000,
    currency: 'gold',
    icon: 'flame',
    rarity: 'RARE',
    coreColor: '#FF4500',
    ringColor: '#FF6B00',
    shieldColor: '#FF0000',
    glowColor: '#FF3300',
    style: 'fire',
  },
  {
    id: 'base_ice',
    type: 'BASE_SKIN',
    name: 'Cryo Citadel',
    description: 'Frozen fortress with crystalline shields.',
    price: 10000,
    currency: 'gold',
    icon: 'snowflake',
    rarity: 'RARE',
    coreColor: '#00FFFF',
    ringColor: '#88FFFF',
    shieldColor: '#FFFFFF',
    glowColor: '#00FFFF',
    style: 'ice',
  },
  // Premium tier
  {
    id: 'base_void',
    type: 'BASE_SKIN',
    name: 'Void Sanctum',
    description: 'Dark matter core that bends reality.',
    price: 150,
    currency: 'gems',
    icon: 'moon',
    rarity: 'EPIC',
    coreColor: '#8B00FF',
    ringColor: '#4B0082',
    shieldColor: '#9400D3',
    glowColor: '#8B00FF',
    style: 'void',
  },
  {
    id: 'base_gold',
    type: 'BASE_SKIN',
    name: 'Gilded Bastion',
    description: 'Luxurious gold-plated defense station.',
    price: 250,
    currency: 'gems',
    icon: 'crown',
    rarity: 'LEGENDARY',
    coreColor: '#FFD700',
    ringColor: '#FFA500',
    shieldColor: '#FFD700',
    glowColor: '#FFFF00',
    style: 'gold',
  },
  {
    id: 'base_rainbow',
    type: 'BASE_SKIN',
    name: 'Prismatic Nexus',
    description: 'Ever-shifting rainbow core with chromatic shields.',
    price: 300,
    currency: 'gems',
    icon: 'palette',
    rarity: 'LEGENDARY',
    coreColor: '#FF0000',
    ringColor: '#00FF00',
    shieldColor: '#0000FF',
    glowColor: '#FFFFFF',
    style: 'rainbow',
  },
];

// ============================================
// BOOST ITEMS
// ============================================

export const BOOST_ITEMS: BoostItem[] = [
  // Gold purchasable boosts
  {
    id: 'boost_double_gold',
    type: 'BOOST',
    name: 'Gold Rush',
    description: 'Double gold earnings for 1 battle.',
    price: 500,
    currency: 'gold',
    icon: 'coins',
    rarity: 'COMMON',
    effect: { type: 'GOLD_MULTIPLIER', value: 2 },
    duration: undefined, // Lasts 1 battle
    stackable: false,
  },
  {
    id: 'boost_damage_10',
    type: 'BOOST',
    name: 'Power Surge',
    description: '+25% damage for 1 battle.',
    price: 750,
    currency: 'gold',
    icon: 'zap',
    rarity: 'COMMON',
    effect: { type: 'DAMAGE_BOOST', value: 25 },
    duration: undefined,
    stackable: false,
  },
  {
    id: 'boost_speed_10',
    type: 'BOOST',
    name: 'Rapid Fire Protocol',
    description: '+25% attack speed for 1 battle.',
    price: 750,
    currency: 'gold',
    icon: 'fast-forward',
    rarity: 'COMMON',
    effect: { type: 'SPEED_BOOST', value: 25 },
    duration: undefined,
    stackable: false,
  },
  {
    id: 'boost_crit_10',
    type: 'BOOST',
    name: 'Precision Targeting',
    description: '+15% critical hit rate for 1 battle.',
    price: 1000,
    currency: 'gold',
    icon: 'target',
    rarity: 'RARE',
    effect: { type: 'CRIT_BOOST', value: 15 },
    duration: undefined,
    stackable: false,
  },
  {
    id: 'boost_shield_repair',
    type: 'BOOST',
    name: 'Emergency Repair Kit',
    description: 'Restore 1000 HP instantly during battle.',
    price: 1500,
    currency: 'gold',
    icon: 'wrench',
    rarity: 'RARE',
    effect: { type: 'SHIELD_REPAIR', value: 1000 },
    duration: undefined,
    stackable: true,
    maxStacks: 3,
  },
  // Premium boosts (gems)
  {
    id: 'boost_gem_chance',
    type: 'BOOST',
    name: 'Lucky Charm',
    description: '+20% gem drop chance for 1 battle.',
    price: 25,
    currency: 'gems',
    icon: 'gem',
    rarity: 'RARE',
    effect: { type: 'GEM_CHANCE_BONUS', value: 20 },
    duration: undefined,
    stackable: false,
  },
  {
    id: 'boost_full_repair',
    type: 'BOOST',
    name: 'Full Restoration',
    description: 'Instantly restore all HP during battle.',
    price: 50,
    currency: 'gems',
    icon: 'heart',
    rarity: 'EPIC',
    effect: { type: 'FULL_REPAIR' },
    duration: undefined,
    stackable: true,
    maxStacks: 2,
  },
  {
    id: 'boost_invincibility',
    type: 'BOOST',
    name: 'Temporal Shield',
    description: '10 seconds of invincibility.',
    price: 75,
    currency: 'gems',
    icon: 'shield',
    rarity: 'EPIC',
    effect: { type: 'INVINCIBILITY', value: 10 },
    duration: 10000,
    stackable: false,
  },
  {
    id: 'boost_mega_pack',
    type: 'BOOST',
    name: 'Mega Boost Pack',
    description: '2x Gold + 25% Damage + 25% Speed for 1 battle.',
    price: 100,
    currency: 'gems',
    icon: 'package',
    rarity: 'LEGENDARY',
    effect: { type: 'GOLD_MULTIPLIER', value: 2 }, // Primary effect, others applied via combo
    duration: undefined,
    stackable: false,
  },
  {
    id: 'boost_energy_refill',
    type: 'BOOST',
    name: 'Energy Cell',
    description: 'Fully restore energy.',
    price: 30,
    currency: 'gems',
    icon: 'battery',
    rarity: 'RARE',
    effect: { type: 'ENERGY_REFILL' },
    duration: undefined,
    stackable: false,
  },
];

// Helper to get all shop items
export const getAllShopItems = () => ({
  weaponSkins: WEAPON_SKINS,
  baseSkins: BASE_SKINS,
  boosts: BOOST_ITEMS,
});

// Helper to find item by ID
export const findShopItem = (id: string) => {
  return (
    WEAPON_SKINS.find(s => s.id === id) ||
    BASE_SKINS.find(s => s.id === id) ||
    BOOST_ITEMS.find(s => s.id === id)
  );
};

// Helper to get rarity color
export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'LEGENDARY': return '#FFD700';
    case 'EPIC': return '#BC13FE';
    case 'RARE': return '#00F0FF';
    default: return '#888888';
  }
};

export const getRarityBorder = (rarity: string): string => {
  switch (rarity) {
    case 'LEGENDARY': return 'border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.3)]';
    case 'EPIC': return 'border-purple-500 shadow-[0_0_15px_rgba(188,19,254,0.3)]';
    case 'RARE': return 'border-cyber-blue shadow-[0_0_15px_rgba(0,240,255,0.3)]';
    default: return 'border-gray-600';
  }
};
