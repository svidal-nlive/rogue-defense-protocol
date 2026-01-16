# Complete Chip Roster Reference

## Overview

This document contains the full expanded chip roster for **Rogue Defense Protocol**, including all 48 chips across 4 categories with their stats, unlock methods, and visual properties.

---

## Chip Categories

| Category | Color Theme | Icon Base | Purpose |
|----------|-------------|-----------|---------|
| **ATTACK** | Orange/Red | Flame, Zap, Target | Increase damage output |
| **DEFENSE** | Blue/Cyan | Shield | Increase survivability |
| **UTILITY** | Green/Yellow | CPU, Coins | Various bonuses |
| **SPECIAL** | Purple | Sparkle | Unique mechanics |

---

## Rarity System

| Rarity | Color | Border Glow | Stat Multiplier | Max Drop Chance |
|--------|-------|-------------|-----------------|-----------------|
| COMMON | `#888888` | None | 1.0× | From missions only |
| RARE | `#00F0FF` | Cyan glow | 1.5× | From missions only |
| EPIC | `#BC13FE` | Purple glow | 2.0× | From missions only |
| LEGENDARY | `#FFD700` | Gold glow | 3.0× | From missions only |

---

## 🔥 ATTACK CHIPS (12 Total)

### Common Attack Chips

#### Plasma Core
```typescript
{
  id: 'atk_plasma_core',
  name: 'Plasma Core',
  type: 'ATTACK',
  rarity: 'COMMON',
  level: 1,
  maxLevel: 10,
  icon: 'zap',
  description: 'Channels plasma energy to boost weapon damage.',
  baseBonus: { damage: 5 },
  upgradeCost: 100,
  upgradeCostMultiplier: 1.5,
  // Unlock: Mission "Circle Hunter" (Wave 3)
}
```

#### Spark Plug
```typescript
{
  id: 'atk_spark_plug',
  name: 'Spark Plug',
  type: 'ATTACK',
  rarity: 'COMMON',
  level: 1,
  maxLevel: 10,
  icon: 'zap',
  description: 'Electric discharge amplifier for consistent damage.',
  baseBonus: { damage: 3, critRate: 1 },
  upgradeCost: 100,
  upgradeCostMultiplier: 1.5,
  // Unlock: Mission "Circle Destroyer" (100 Circle kills)
}
```

#### Voltage Spike
```typescript
{
  id: 'atk_voltage_spike',
  name: 'Voltage Spike',
  type: 'ATTACK',
  rarity: 'COMMON',
  level: 1,
  maxLevel: 10,
  icon: 'activity',
  description: 'Power surge module for faster, stronger attacks.',
  baseBonus: { damage: 4, attackSpeed: 2 },
  upgradeCost: 100,
  upgradeCostMultiplier: 1.5,
  // Unlock: Complete 3 battles
}
```

### Rare Attack Chips

#### Fury Driver
```typescript
{
  id: 'atk_fury_driver',
  name: 'Fury Driver',
  type: 'ATTACK',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'flame',
  description: 'Overclocked processor that amplifies attack power.',
  baseBonus: { damage: 8, damagePercent: 5 },
  upgradeCost: 250,
  upgradeCostMultiplier: 1.6,
  // Unlock: Mission "Tank Buster" (Wave 12)
}
```

#### Razor Edge
```typescript
{
  id: 'atk_razor_edge',
  name: 'Razor Edge',
  type: 'ATTACK',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'crosshair',
  description: 'Precision cutting algorithms for critical strikes.',
  baseBonus: { damage: 6, critRate: 3, critDamage: 10 },
  upgradeCost: 250,
  upgradeCostMultiplier: 1.6,
  // Unlock: Kill 500 enemies total
}
```

#### Inferno Core
```typescript
{
  id: 'atk_inferno_core',
  name: 'Inferno Core',
  type: 'ATTACK',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'flame',
  description: 'Superheated plasma enhances splash damage.',
  baseBonus: { damage: 10, splashRadius: 5 },  // splashRadius is % bonus
  upgradeCost: 250,
  upgradeCostMultiplier: 1.6,
  // Unlock: Mission "Boss Executioner I" (5 bosses)
}
```

### Epic Attack Chips

#### Berserker Module
```typescript
{
  id: 'atk_berserker_module',
  name: 'Berserker Module',
  type: 'ATTACK',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'crosshair',
  description: 'Aggressive combat protocols for maximum devastation.',
  baseBonus: { damage: 12, damagePercent: 8, critDamage: 10 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Mission "Veteran I" (Wave 30)
}
```

#### Assassin Protocol
```typescript
{
  id: 'atk_assassin_protocol',
  name: 'Assassin Protocol',
  type: 'ATTACK',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'target',
  description: 'Stealth targeting system for lethal precision.',
  baseBonus: { damage: 8, critRate: 8, critDamage: 25 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Mission "Boss Executioner II" (25 bosses)
}
```

#### Devastator Chip
```typescript
{
  id: 'atk_devastator',
  name: 'Devastator Chip',
  type: 'ATTACK',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'flame',
  description: 'Heavy ordinance amplifier for massive damage.',
  baseBonus: { damage: 15, damagePercent: 10, splashRadius: 5 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Mission "Damage Dealer I" (100K damage)
}
```

### Legendary Attack Chips

#### Annihilator Core
```typescript
{
  id: 'atk_annihilator',
  name: 'Annihilator Core',
  type: 'ATTACK',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'target',
  description: 'Legendary combat chip with devastating power.',
  baseBonus: { damage: 20, damagePercent: 12, critRate: 5, critDamage: 20 },
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Mission "Commander II" (Wave 60)
}
```

#### Omega Strike
```typescript
{
  id: 'atk_omega_strike',
  name: 'Omega Strike',
  type: 'ATTACK',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'zap',
  description: 'The pinnacle of offensive technology.',
  baseBonus: { damage: 25, damagePercent: 15, critRate: 10 },
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Mission "Damage Dealer II" (1M damage)
}
```

#### Godslayer Module
```typescript
{
  id: 'atk_godslayer',
  name: 'Godslayer Module',
  type: 'ATTACK',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'target',
  description: 'Specifically designed to eliminate boss-class threats.',
  baseBonus: { damage: 30, bossDamage: 20 },  // bossDamage: +20% to bosses
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Mission "Boss Executioner III" (100 bosses)
}
```

---

## 🛡️ DEFENSE CHIPS (12 Total)

### Common Defense Chips

#### Nano Plating
```typescript
{
  id: 'def_nano_plating',
  name: 'Nano Plating',
  type: 'DEFENSE',
  rarity: 'COMMON',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Nanoscale armor plating for basic protection.',
  baseBonus: { hp: 100 },
  upgradeCost: 100,
  upgradeCostMultiplier: 1.5,
  // Unlock: Mission "Boss Slayer" (Wave 5)
}
```

#### Barrier Node
```typescript
{
  id: 'def_barrier_node',
  name: 'Barrier Node',
  type: 'DEFENSE',
  rarity: 'COMMON',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Generates a protective energy barrier.',
  baseBonus: { hp: 80, defense: 2 },
  upgradeCost: 100,
  upgradeCostMultiplier: 1.5,
  // Unlock: Survive 10 total waves
}
```

#### Regen Pulse
```typescript
{
  id: 'def_regen_pulse',
  name: 'Regen Pulse',
  type: 'DEFENSE',
  rarity: 'COMMON',
  level: 1,
  maxLevel: 10,
  icon: 'activity',
  description: 'Continuous repair nanobots for sustained health.',
  baseBonus: { hp: 50, hpRegen: 1 },  // hpRegen: +1% HP per second
  upgradeCost: 100,
  upgradeCostMultiplier: 1.5,
  // Unlock: Take 5000 total damage
}
```

### Rare Defense Chips

#### Reactive Armor
```typescript
{
  id: 'def_reactive_armor',
  name: 'Reactive Armor',
  type: 'DEFENSE',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Advanced armor that adapts to incoming damage.',
  baseBonus: { hp: 150, defense: 3 },
  upgradeCost: 250,
  upgradeCostMultiplier: 1.6,
  // Unlock: Mission "Swarm Crusher" (Wave 18)
}
```

#### Absorption Matrix
```typescript
{
  id: 'def_absorption_matrix',
  name: 'Absorption Matrix',
  type: 'DEFENSE',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Converts incoming damage to shield energy.',
  baseBonus: { hp: 120, defense: 5 },
  upgradeCost: 250,
  upgradeCostMultiplier: 1.6,
  // Unlock: Block 1000 total damage
}
```

#### Guardian Shell
```typescript
{
  id: 'def_guardian_shell',
  name: 'Guardian Shell',
  type: 'DEFENSE',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Multi-layer defense with evasion protocols.',
  baseBonus: { hp: 100, defense: 4, dodge: 3 },  // dodge: 3% dodge chance
  upgradeCost: 250,
  upgradeCostMultiplier: 1.6,
  // Unlock: Survive Wave 25
}
```

### Epic Defense Chips

#### Fortress Protocol
```typescript
{
  id: 'def_fortress_protocol',
  name: 'Fortress Protocol',
  type: 'DEFENSE',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Military-grade defensive system.',
  baseBonus: { hp: 250, hpPercent: 5, defense: 5 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Mission "Elite Hunter" (Wave 35)
}
```

#### Immortal Frame
```typescript
{
  id: 'def_immortal_frame',
  name: 'Immortal Frame',
  type: 'DEFENSE',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Near-indestructible chassis reinforcement.',
  baseBonus: { hp: 200, hpPercent: 8, defense: 8 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Survive 50 waves in single run
}
```

#### Void Barrier
```typescript
{
  id: 'def_void_barrier',
  name: 'Void Barrier',
  type: 'DEFENSE',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Phase-shifting barrier for damage avoidance.',
  baseBonus: { hp: 180, defense: 10, dodge: 5 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Mission "Untouchable" (flawless wave)
}
```

### Legendary Defense Chips

#### Titan Core
```typescript
{
  id: 'def_titan_core',
  name: 'Titan Core',
  type: 'DEFENSE',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Legendary defensive matrix of unparalleled protection.',
  baseBonus: { hp: 500, hpPercent: 10, defense: 10 },
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Mission "Commander III" (Wave 70)
}
```

#### Eternal Guard
```typescript
{
  id: 'def_eternal_guard',
  name: 'Eternal Guard',
  type: 'DEFENSE',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Transcendent protection technology.',
  baseBonus: { hp: 400, hpPercent: 15, defense: 15 },
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Survive Wave 80
}
```

#### Phoenix Core
```typescript
{
  id: 'def_phoenix_core',
  name: 'Phoenix Core',
  type: 'DEFENSE',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'flame',
  description: 'Rise from defeat. Grants one revival per battle.',
  baseBonus: { hp: 300, revive: 1 },  // revive: resurrect once per battle
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Secret Achievement "Glass Cannon"
}
```

---

## ⚡ UTILITY CHIPS (16 Total)

### Common Utility Chips

#### Precision Optics
```typescript
{
  id: 'util_precision_optics',
  name: 'Precision Optics',
  type: 'UTILITY',
  rarity: 'COMMON',
  level: 1,
  maxLevel: 10,
  icon: 'crosshair',
  description: 'Enhanced targeting for improved critical hits.',
  baseBonus: { critRate: 2 },
  upgradeCost: 100,
  upgradeCostMultiplier: 1.5,
  // Unlock: Mission "Experiment" (Wave 7)
}
```

#### Coin Magnet
```typescript
{
  id: 'util_coin_magnet',
  name: 'Coin Magnet',
  type: 'UTILITY',
  rarity: 'COMMON',
  level: 1,
  maxLevel: 10,
  icon: 'coins',
  description: 'Magnetizes nearby gold for increased collection.',
  baseBonus: { goldBonus: 5 },
  upgradeCost: 100,
  upgradeCostMultiplier: 1.5,
  // Unlock: Earn 1000 total gold
}
```

#### Quick Loader
```typescript
{
  id: 'util_quick_loader',
  name: 'Quick Loader',
  type: 'UTILITY',
  rarity: 'COMMON',
  level: 1,
  maxLevel: 10,
  icon: 'activity',
  description: 'Faster ammunition cycling for quicker fire rate.',
  baseBonus: { attackSpeed: 3 },
  upgradeCost: 100,
  upgradeCostMultiplier: 1.5,
  // Unlock: Fire 500 projectiles
}
```

### Rare Utility Chips

#### Velocity Boost
```typescript
{
  id: 'util_velocity_boost',
  name: 'Velocity Boost',
  type: 'UTILITY',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'activity',
  description: 'Accelerated firing systems for faster attacks.',
  baseBonus: { attackSpeed: 5, critRate: 2 },
  upgradeCost: 250,
  upgradeCostMultiplier: 1.6,
  // Unlock: Mission "Survivor II" (Wave 20)
}
```

#### Scavenger Node
```typescript
{
  id: 'util_scavenger_node',
  name: 'Scavenger Node',
  type: 'UTILITY',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'coins',
  description: 'Resource extraction protocols for bonus gold.',
  baseBonus: { goldBonus: 10 },
  upgradeCost: 300,
  upgradeCostMultiplier: 1.6,
  // Unlock: Earn 10,000 total gold
}
```

#### Lucky Charm
```typescript
{
  id: 'util_lucky_charm',
  name: 'Lucky Charm',
  type: 'UTILITY',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'sparkle',
  description: 'Increases gem drop rate from enemies.',
  baseBonus: { gemChance: 3 },  // +3% gem drop chance
  upgradeCost: 300,
  upgradeCostMultiplier: 1.6,
  // Unlock: Mission "Critical Master" (500 crits)
}
```

#### Energy Cell
```typescript
{
  id: 'util_energy_cell',
  name: 'Energy Cell',
  type: 'UTILITY',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'battery',
  description: 'Additional power storage for abilities.',
  baseBonus: { energyMax: 10 },
  upgradeCost: 250,
  upgradeCostMultiplier: 1.6,
  // Unlock: Mission "Blaster Expert"
}
```

### Epic Utility Chips

#### Overdrive System
```typescript
{
  id: 'util_overdrive_system',
  name: 'Overdrive System',
  type: 'UTILITY',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'cpu',
  description: 'Pushes all systems beyond normal limits.',
  baseBonus: { attackSpeed: 8, critRate: 3, critDamage: 15 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Mission "Perfect Wave" (Wave 45)
}
```

#### Treasure Hunter
```typescript
{
  id: 'util_treasure_hunter',
  name: 'Treasure Hunter',
  type: 'UTILITY',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'coins',
  description: 'Maximum resource acquisition protocols.',
  baseBonus: { goldBonus: 20, gemChance: 5 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Earn 50,000 total gold
}
```

#### Hypercharge Node
```typescript
{
  id: 'util_hypercharge',
  name: 'Hypercharge Node',
  type: 'UTILITY',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'zap',
  description: 'Extreme power cycling for rapid attacks.',
  baseBonus: { attackSpeed: 12, energyMax: 5 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Use abilities 100 times
}
```

#### Synergy Core
```typescript
{
  id: 'util_synergy_core',
  name: 'Synergy Core',
  type: 'UTILITY',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'cpu',
  description: 'Amplifies all other chip bonuses by 10%.',
  baseBonus: { chipAmplify: 10 },  // +10% effectiveness to all equipped chips
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Equip 6 chips simultaneously
}
```

### Legendary Utility Chips

#### Quantum Core
```typescript
{
  id: 'util_quantum_core',
  name: 'Quantum Core',
  type: 'UTILITY',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'cpu',
  description: 'Quantum-enhanced processing for all combat systems.',
  baseBonus: { attackSpeed: 12, critRate: 5, critDamage: 25, goldBonus: 15, energyMax: 10 },
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Mission "Master Defender" (Wave 90)
}
```

#### Infinity Loop
```typescript
{
  id: 'util_infinity_loop',
  name: 'Infinity Loop',
  type: 'UTILITY',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'cpu',
  description: 'Time-bending technology reduces all cooldowns.',
  baseBonus: { cooldownReduction: 20 },  // -20% ability cooldowns
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Use each ability 50 times
}
```

#### Jackpot Module
```typescript
{
  id: 'util_jackpot_module',
  name: 'Jackpot Module',
  type: 'UTILITY',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'coins',
  description: 'Maximum wealth extraction technology.',
  baseBonus: { goldBonus: 50, gemChance: 10 },
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Earn 500,000 total gold
}
```

#### Omnichip
```typescript
{
  id: 'util_omnichip',
  name: 'Omnichip',
  type: 'UTILITY',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'sparkle',
  description: 'The ultimate chip. Enhances everything.',
  baseBonus: { 
    damage: 5, 
    damagePercent: 5, 
    hp: 100, 
    hpPercent: 5, 
    defense: 5, 
    critRate: 5, 
    critDamage: 10, 
    attackSpeed: 5, 
    goldBonus: 10 
  },
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Mission "Weapon Master" (all weapon missions)
}
```

#### Chaos Engine
```typescript
{
  id: 'util_chaos_engine',
  name: 'Chaos Engine',
  type: 'UTILITY',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'cpu',
  description: 'Unpredictable quantum effects. Rerolls bonus each battle.',
  baseBonus: { random: true },  // Special: randomizes bonuses each battle
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Win 100 battles
}
```

---

## 🎯 SPECIAL CHIPS (8 Total)

Special chips have unique mechanics that go beyond simple stat bonuses.

### Rare Special Chips

#### Chain Lightning
```typescript
{
  id: 'spec_chain_lightning',
  name: 'Chain Lightning',
  type: 'SPECIAL',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'zap',
  description: 'Attacks have 15% chance to chain to nearby enemies.',
  baseBonus: { chainChance: 15, chainTargets: 2 },  // chains to 2 additional targets
  upgradeCost: 300,
  upgradeCostMultiplier: 1.6,
  // Unlock: Kill 3+ enemies within 1 second
}
```

#### Frozen Core
```typescript
{
  id: 'spec_frozen_core',
  name: 'Frozen Core',
  type: 'SPECIAL',
  rarity: 'RARE',
  level: 1,
  maxLevel: 10,
  icon: 'snowflake',
  description: '10% chance to freeze enemies for 1 second.',
  baseBonus: { freezeChance: 10, freezeDuration: 1000 },
  upgradeCost: 300,
  upgradeCostMultiplier: 1.6,
  // Unlock: Kill 50 enemies with Cryo weapon
}
```

### Epic Special Chips

#### Vampiric Shard
```typescript
{
  id: 'spec_vampiric_shard',
  name: 'Vampiric Shard',
  type: 'SPECIAL',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'droplet',
  description: 'Lifesteal: Heal 5% of damage dealt.',
  baseBonus: { lifesteal: 5 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Mission "Laser Legend"
}
```

#### Mirror Shield
```typescript
{
  id: 'spec_mirror_shield',
  name: 'Mirror Shield',
  type: 'SPECIAL',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'shield',
  description: 'Reflect 10% of damage taken back to attackers.',
  baseBonus: { reflect: 10 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Block 500 damage total
}
```

#### Time Dilation
```typescript
{
  id: 'spec_time_dilation',
  name: 'Time Dilation',
  type: 'SPECIAL',
  rarity: 'EPIC',
  level: 1,
  maxLevel: 10,
  icon: 'clock',
  description: '5% chance on hit to slow all enemies for 2 seconds.',
  baseBonus: { globalSlowChance: 5, slowDuration: 2000, slowPercent: 30 },
  upgradeCost: 500,
  upgradeCostMultiplier: 1.7,
  // Unlock: Mission "Cryo Champion"
}
```

### Legendary Special Chips

#### Nuclear Core
```typescript
{
  id: 'spec_nuclear_core',
  name: 'Nuclear Core',
  type: 'SPECIAL',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'flame',
  description: 'Enemies explode on death, dealing 10% HP as AoE damage.',
  baseBonus: { deathExplosion: true, explosionDamage: 10 },  // % of enemy max HP
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Kill 50 enemies with explosion damage
}
```

#### Gravity Well
```typescript
{
  id: 'spec_gravity_well',
  name: 'Gravity Well',
  type: 'SPECIAL',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'target',
  description: 'Creates gravity field that slowly pulls enemies toward base.',
  baseBonus: { gravityPull: 0.1 },  // Pull strength per second
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Kill 1000 enemies near base (within 200px)
}
```

#### Ascension Protocol
```typescript
{
  id: 'spec_ascension',
  name: 'Ascension Protocol',
  type: 'SPECIAL',
  rarity: 'LEGENDARY',
  level: 1,
  maxLevel: 10,
  icon: 'sparkle',
  description: 'Gain +2% to all stats for each wave survived.',
  baseBonus: { waveScaling: 2 },  // +2% all stats per wave
  upgradeCost: 1000,
  upgradeCostMultiplier: 1.8,
  // Unlock: Mission "Century" (Wave 100)
}
```

---

## New Stat Types

The expanded chip roster introduces new stat types that need to be added to the `ChipBonus` interface:

```typescript
export interface ChipBonus {
  // Existing stats
  damage?: number;
  damagePercent?: number;
  hp?: number;
  hpPercent?: number;
  defense?: number;
  critRate?: number;
  critDamage?: number;
  attackSpeed?: number;
  goldBonus?: number;
  energyMax?: number;
  
  // New stats
  hpRegen?: number;           // % HP regenerated per second
  dodge?: number;             // % chance to dodge damage
  splashRadius?: number;      // % increase to splash damage radius
  bossDamage?: number;        // % bonus damage vs bosses
  gemChance?: number;         // % bonus gem drop chance
  cooldownReduction?: number; // % reduction to ability cooldowns
  chipAmplify?: number;       // % bonus to all other chip effects
  revive?: number;            // Number of revives per battle
  
  // Special effect flags/values
  chainChance?: number;       // % chance to chain attacks
  chainTargets?: number;      // Number of chain targets
  freezeChance?: number;      // % chance to freeze
  freezeDuration?: number;    // Freeze duration in ms
  lifesteal?: number;         // % of damage healed
  reflect?: number;           // % of damage reflected
  globalSlowChance?: number;  // % chance to slow all enemies
  slowDuration?: number;      // Slow effect duration
  slowPercent?: number;       // Slow effect strength
  deathExplosion?: boolean;   // Enemies explode on death
  explosionDamage?: number;   // % of enemy HP as explosion damage
  gravityPull?: number;       // Pull strength
  waveScaling?: number;       // % stat gain per wave
  random?: boolean;           // Randomize bonuses each battle
}
```

---

## Chip Unlock Summary

### By Wave Milestone

| Wave | Chips Unlocked | Slots Unlocked |
|------|----------------|----------------|
| 3 | Plasma Core | 1 |
| 5 | Nano Plating | - |
| 7 | Precision Optics | - |
| 10 | - | 2 |
| 12 | Fury Driver | - |
| 15 | - | 3 |
| 18 | Reactive Armor | - |
| 20 | Velocity Boost | - |
| 25 | Guardian Shell | 4 |
| 30 | Berserker Module | - |
| 35 | Fortress Protocol | - |
| 40 | Devastator | 5 |
| 45 | Overdrive System | - |
| 50 | Legendary Choice | 6 |
| 60 | Annihilator Core | - |
| 70 | Titan Core | - |
| 80 | Eternal Guard | 7 |
| 90 | Quantum Core | - |
| 100 | Ascension Protocol | 8 |

### By Mission Category

| Category | Chips Available | Total |
|----------|-----------------|-------|
| Tutorial | 3 | 3 |
| Combat | 10 | 10 |
| Survival | 12 | 12 |
| Mastery | 8 | 8 |
| Exploration | 7 | 7 |
| Secret/Achievement | 8 | 8 |
| **TOTAL** | - | **48** |

---

## Implementation Notes

### Adding New Chip to CHIP_DEFINITIONS

1. Add the chip object to the appropriate section in `constants/chips.ts`
2. Add any new bonus types to the `ChipBonus` interface in `types.ts`
3. Implement the bonus calculation in `calculateChipBonus()` if using new stat types
4. Add the unlock condition to the mission system
5. Test the chip's effect in battle

### Special Chip Implementation

Special chips require additional logic in the battle system:

- **Chain Lightning**: Modify projectile hit logic to spawn chain projectiles
- **Frozen Core**: Add freeze state to enemies
- **Vampiric Shard**: Add healing on damage dealt
- **Nuclear Core**: Add explosion effect on enemy death
- **Gravity Well**: Add pull force to enemy movement
- **Ascension Protocol**: Track wave count and apply scaling multiplier

Each special effect should be implemented as a modular system that checks for the equipped chip and applies the effect accordingly.
