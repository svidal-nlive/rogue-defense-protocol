# Phase 1 Engagement Implementation Specification

## Overview

This document provides detailed technical specifications for implementing the Phase 1 engagement improvements identified in the Game Loop Analysis. These changes are designed to be implemented in 1-2 weeks with high impact on player engagement.

---

## Feature 1: Manual Aim Mode

### Problem
Currently, the turret auto-aims at the nearest enemy and auto-fires. Players have no control over targeting.

### Solution
Allow players to aim with mouse/touch and fire manually, with auto-aim as a fallback/toggle option.

### Implementation Details

#### New State Variables (BattleScreen.tsx)

```typescript
// Add to component state
const [aimMode, setAimMode] = useState<'AUTO' | 'MANUAL'>('MANUAL');
const [aimPosition, setAimPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
const [isAiming, setIsAiming] = useState(false);
const [ammo, setAmmo] = useState(30);
const [maxAmmo] = useState(30);
const [isReloading, setIsReloading] = useState(false);
const [reloadProgress, setReloadProgress] = useState(0);
```

#### Pointer Event Handlers

```typescript
// Track mouse/touch position for manual aim
const handlePointerMove = useCallback((e: React.PointerEvent) => {
  if (aimMode !== 'MANUAL' || paused || gameOver) return;
  
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  setAimPosition({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  });
  setIsAiming(true);
}, [aimMode, paused, gameOver]);

// Fire on click/tap
const handlePointerDown = useCallback((e: React.PointerEvent) => {
  if (aimMode !== 'MANUAL' || paused || gameOver || isReloading) return;
  if (ammo <= 0) {
    startReload();
    return;
  }
  
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const targetX = e.clientX - rect.left;
  const targetY = e.clientY - rect.top;
  
  fireProjectileAt(targetX, targetY);
  setAmmo(prev => prev - 1);
}, [aimMode, paused, gameOver, ammo, isReloading]);
```

#### Modified Firing Logic

```typescript
// In the game loop, replace auto-fire with conditional
if (aimMode === 'AUTO') {
  // Existing auto-fire logic
  gState.fireTimer += delta;
  if (gState.fireTimer >= fireInterval) {
    // ... existing auto-targeting code
  }
} else {
  // Manual mode: fire handled by pointer events
  // Just update turret angle to point at aim position
  if (isAiming) {
    const dx = aimPosition.x - gState.basePosition.x;
    const dy = aimPosition.y - gState.basePosition.y;
    gState.turretAngle = Math.atan2(dy, dx);
  }
}
```

#### Fire Projectile Function

```typescript
const fireProjectileAt = useCallback((targetX: number, targetY: number) => {
  const gState = gameStateRef.current;
  const bx = gState.basePosition.x;
  const by = gState.basePosition.y;
  
  const dx = targetX - bx;
  const dy = targetY - by;
  const angle = Math.atan2(dy, dx);
  const projSpeed = 0.8 * currentWeapon.projectileSpeed * boostEffects.speedMultiplier;
  
  const boostedDamage = stats.damage * currentWeapon.damageMultiplier * boostEffects.damageMultiplier;
  
  gState.projectiles.push({
    id: Math.random().toString(),
    x: bx,
    y: by - 40,
    vx: Math.cos(angle) * projSpeed,
    vy: Math.sin(angle) * projSpeed,
    damage: boostedDamage,
    color: equippedWeaponSkin?.projectileColor || currentWeapon.projectileColor,
    weaponType: equippedWeapon,
    // No targetId - projectile flies straight
    trail: [],
    splashRadius: currentWeapon.splashRadius,
    slowPercent: currentWeapon.slowPercent,
    slowDuration: currentWeapon.slowDuration,
    piercing: currentWeapon.piercing,
    hitEnemies: [],
    trailColor: equippedWeaponSkin?.trailColor || currentWeapon.projectileColor,
    trailStyle: equippedWeaponSkin?.trailStyle || 'normal',
  });
  
  // Screen shake feedback
  triggerScreenShake();
}, [/* dependencies */]);
```

#### Draw Aim Reticle

```typescript
// Add to canvas rendering loop
if (aimMode === 'MANUAL' && isAiming) {
  // Draw crosshair at aim position
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  
  const cx = aimPosition.x;
  const cy = aimPosition.y;
  const size = 15;
  
  // Crosshair lines
  ctx.beginPath();
  ctx.moveTo(cx - size, cy);
  ctx.lineTo(cx - size/3, cy);
  ctx.moveTo(cx + size/3, cy);
  ctx.lineTo(cx + size, cy);
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx, cy - size/3);
  ctx.moveTo(cx, cy + size/3);
  ctx.lineTo(cx, cy + size);
  ctx.stroke();
  
  // Outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, size, 0, Math.PI * 2);
  ctx.stroke();
  
  // Highlight nearest enemy in range
  const nearestInRange = gState.enemies.find(e => {
    const dist = Math.sqrt(Math.pow(e.x - cx, 2) + Math.pow(e.y - cy, 2));
    return dist < e.radius + 30;
  });
  
  if (nearestInRange) {
    ctx.strokeStyle = '#FF003C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(nearestInRange.x, nearestInRange.y, nearestInRange.radius + 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1;
}
```

#### UI: Aim Mode Toggle & Ammo Display

```tsx
// Add to the control panel (mobile/desktop)
<div className="flex items-center gap-2">
  <button
    onClick={() => setAimMode(prev => prev === 'AUTO' ? 'MANUAL' : 'AUTO')}
    className={`
      px-3 py-2 rounded-lg border text-xs font-orbitron
      ${aimMode === 'MANUAL' 
        ? 'bg-cyber-blue text-black border-cyber-blue' 
        : 'bg-white/5 border-white/10 text-gray-400'}
    `}
  >
    {aimMode === 'MANUAL' ? 'MANUAL AIM' : 'AUTO AIM'}
  </button>
</div>

// Ammo display (for manual mode)
{aimMode === 'MANUAL' && (
  <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/10">
    <div className="text-[9px] text-gray-500 font-orbitron">AMMO</div>
    <div className="text-lg font-bold font-orbitron text-cyber-yellow">
      {isReloading ? 'RELOADING...' : `${ammo}/${maxAmmo}`}
    </div>
    {isReloading && (
      <div className="h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
        <div 
          className="h-full bg-cyber-blue transition-all"
          style={{ width: `${reloadProgress}%` }}
        />
      </div>
    )}
  </div>
)}
```

---

## Feature 2: Reduced Ability Cooldowns & New Abilities

### Problem
Current abilities have 10-20 second cooldowns, meaning players interact with abilities only 3-6 times per minute.

### Solution
Reduce cooldowns by 50% and add 2 new abilities for more frequent interaction.

### Implementation Details

#### Updated Ability Definitions

```typescript
const [abilities, setAbilities] = useState<Ability[]>([
  { 
    id: 'plasma_burst', 
    name: 'Plasma Burst', 
    hotkey: 'Q', 
    cooldown: 5000,  // Reduced from 10000
    currentCooldown: 0, 
    duration: 0, 
    activeUntil: 0, 
    icon: <Flame size={22} />, 
    color: 'text-orange-500' 
  },
  { 
    id: 'shield', 
    name: 'Shield', 
    hotkey: 'W', 
    cooldown: 8000,  // Reduced from 15000
    currentCooldown: 0, 
    duration: 4000,  // Reduced from 5000
    activeUntil: 0, 
    icon: <Shield size={22} />, 
    color: 'text-cyber-blue' 
  },
  { 
    id: 'overclock', 
    name: 'Overclock', 
    hotkey: 'E', 
    cooldown: 12000,  // Reduced from 20000
    currentCooldown: 0, 
    duration: 6000,   // Reduced from 8000
    activeUntil: 0, 
    icon: <Zap size={22} />, 
    color: 'text-cyber-yellow' 
  },
  // NEW ABILITIES
  { 
    id: 'emp_pulse', 
    name: 'EMP Pulse', 
    hotkey: 'R', 
    cooldown: 6000,
    currentCooldown: 0, 
    duration: 0, 
    activeUntil: 0, 
    icon: <Radio size={22} />,  // Import from lucide-react
    color: 'text-purple-500',
    description: 'Stuns all enemies for 2 seconds'
  },
  { 
    id: 'repair_drone', 
    name: 'Repair Drone', 
    hotkey: 'F', 
    cooldown: 15000,
    currentCooldown: 0, 
    duration: 0, 
    activeUntil: 0, 
    icon: <Wrench size={22} />,  // Import from lucide-react
    color: 'text-green-500',
    description: 'Restores 300 HP'
  },
]);
```

#### New Ability Implementations

```typescript
// In activateAbility callback
case 'emp_pulse':
  // Stun all enemies for 2 seconds
  const stunDuration = 2000;
  gState.enemies.forEach(enemy => {
    enemy.stunnedUntil = now + stunDuration;
    createExplosion(enemy.x, enemy.y, '#BC13FE', 5);
  });
  // Create large shockwave
  gState.shockwaves.push({
    x: gState.basePosition.x,
    y: gState.basePosition.y,
    radius: 0,
    maxRadius: 400,
    color: '#BC13FE',
    life: 1.0
  });
  break;

case 'repair_drone':
  // Heal 300 HP (10% of max)
  const healAmount = 300;
  setHp(prev => Math.min(maxHp, prev + healAmount));
  // Create heal particles
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    gState.particles.push({
      x: gState.basePosition.x + Math.cos(angle) * 30,
      y: gState.basePosition.y + Math.sin(angle) * 30,
      vx: Math.cos(angle) * -0.5,
      vy: Math.sin(angle) * -0.5,
      life: 1.0,
      color: '#0AFF64',
      size: 3
    });
  }
  // Show heal number
  gameStateRef.current.damageNumbers.push({
    x: gState.basePosition.x,
    y: gState.basePosition.y - 50,
    value: healAmount,
    life: 1.0,
    isCrit: false,
    isHeal: true  // New flag for green color
  });
  break;
```

#### Enemy Stun Implementation

```typescript
// Add to Enemy interface (types.ts)
export interface Enemy {
  // ... existing properties
  stunnedUntil?: number;  // Timestamp when stun ends
}

// In game loop - enemy movement update
for (let i = gState.enemies.length - 1; i >= 0; i--) {
  const enemy = gState.enemies[i];
  
  // Check if stunned
  if (enemy.stunnedUntil && now < enemy.stunnedUntil) {
    // Skip movement, enemy is stunned
    // Draw stun effect
    continue;
  }
  
  // ... existing movement code
}
```

---

## Feature 3: Priority Target System

### Problem
All enemies feel the same. No urgency or micro-goals during waves.

### Solution
Randomly spawn "Priority Targets" that give bonus rewards if killed quickly.

### Implementation Details

#### New State & Types

```typescript
// Add to types.ts
export interface PriorityTarget {
  enemyId: string;
  expiresAt: number;
  bonusMultiplier: number;
  bonusType: 'GOLD' | 'SCORE' | 'GEMS';
}

// Add to BattleScreen state
const [priorityTarget, setPriorityTarget] = useState<PriorityTarget | null>(null);
```

#### Spawn Priority Targets

```typescript
// In spawnEnemy function, after creating enemy
const spawnEnemy = useCallback((canvasWidth: number, canvasHeight: number) => {
  // ... existing spawn code ...
  
  gameStateRef.current.enemies.push(enemy);
  
  // 12% chance to become priority target (if no current priority)
  if (!priorityTarget && Math.random() < 0.12 && type !== EnemyType.BOSS) {
    const bonusTypes: ('GOLD' | 'SCORE' | 'GEMS')[] = ['GOLD', 'GOLD', 'GOLD', 'SCORE', 'GEMS'];
    const bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
    
    setPriorityTarget({
      enemyId: enemy.id,
      expiresAt: Date.now() + 6000, // 6 seconds to kill
      bonusMultiplier: 2.0, // Double rewards
      bonusType
    });
  }
}, [wave, priorityTarget]);
```

#### Check Priority Target on Kill

```typescript
// In killEnemy or ENEMY_KILLED handler
const handleEnemyKilled = (enemyId: string, enemyType: EnemyType, damage: number, isCrit: boolean) => {
  let goldMultiplier = 1;
  let scoreMultiplier = 1;
  let gemMultiplier = 1;
  let showBonus = false;
  
  // Check if this was priority target
  if (priorityTarget && priorityTarget.enemyId === enemyId) {
    if (Date.now() < priorityTarget.expiresAt) {
      // Successfully killed in time!
      switch (priorityTarget.bonusType) {
        case 'GOLD':
          goldMultiplier = priorityTarget.bonusMultiplier;
          break;
        case 'SCORE':
          scoreMultiplier = priorityTarget.bonusMultiplier;
          break;
        case 'GEMS':
          gemMultiplier = priorityTarget.bonusMultiplier;
          break;
      }
      showBonus = true;
    }
    setPriorityTarget(null);
  }
  
  killEnemy(enemyType, isCrit, damage, { goldMultiplier, scoreMultiplier, gemMultiplier });
  
  if (showBonus) {
    showBonusPopup(priorityTarget.bonusType, priorityTarget.bonusMultiplier);
  }
};
```

#### Update Priority Target Expiry

```typescript
// In game loop or useEffect
useEffect(() => {
  if (!priorityTarget) return;
  
  const checkExpiry = setInterval(() => {
    if (Date.now() > priorityTarget.expiresAt) {
      // Target expired - enemy becomes enraged
      const enemy = gameStateRef.current.enemies.find(e => e.id === priorityTarget.enemyId);
      if (enemy) {
        enemy.baseSpeed *= 1.5; // 50% faster
        enemy.color = '#FF003C'; // Turn red
        // Show "ENRAGED" text
        gameStateRef.current.damageNumbers.push({
          x: enemy.x,
          y: enemy.y - 30,
          value: 0,
          life: 1.0,
          isCrit: false,
          text: 'ENRAGED!'
        });
      }
      setPriorityTarget(null);
    }
  }, 100);
  
  return () => clearInterval(checkExpiry);
}, [priorityTarget]);
```

#### Visual Indicators for Priority Target

```typescript
// In enemy rendering loop
if (priorityTarget && enemy.id === priorityTarget.enemyId) {
  const timeLeft = priorityTarget.expiresAt - Date.now();
  const timePercent = timeLeft / 6000;
  
  // Pulsing highlight ring
  ctx.save();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.5 + Math.sin(time * 0.01) * 0.3;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.radius + 20, 0, Math.PI * 2);
  ctx.stroke();
  
  // Timer arc
  ctx.strokeStyle = '#FF003C';
  ctx.lineWidth = 3;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.radius + 20, -Math.PI/2, -Math.PI/2 + (Math.PI * 2 * timePercent));
  ctx.stroke();
  
  // "PRIORITY" label
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 10px Orbitron';
  ctx.textAlign = 'center';
  ctx.fillText('PRIORITY', enemy.x, enemy.y - enemy.radius - 30);
  
  // Bonus indicator
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 8px Orbitron';
  ctx.fillText(`+${Math.floor((priorityTarget.bonusMultiplier - 1) * 100)}% ${priorityTarget.bonusType}`, enemy.x, enemy.y - enemy.radius - 42);
  
  ctx.restore();
}
```

---

## Feature 4: Combo System (Optional Phase 1 Addition)

### Problem
No skill expression or reward for playing well.

### Solution
Consecutive kills build a multiplier that increases rewards.

### Implementation Details

#### State Management

```typescript
// Add to BattleScreen or GameContext
const [comboState, setComboState] = useState({
  count: 0,
  multiplier: 1,
  lastKillTime: 0,
  isActive: false
});

const COMBO_TIMEOUT = 2500; // 2.5 seconds between kills to maintain
const COMBO_THRESHOLDS = [
  { kills: 5, multiplier: 1.25 },
  { kills: 10, multiplier: 1.5 },
  { kills: 20, multiplier: 2.0 },
  { kills: 35, multiplier: 2.5 },
  { kills: 50, multiplier: 3.0 },
];
```

#### Update Combo on Kill

```typescript
const updateCombo = useCallback(() => {
  const now = Date.now();
  
  setComboState(prev => {
    const timeSinceLastKill = now - prev.lastKillTime;
    
    if (timeSinceLastKill > COMBO_TIMEOUT && prev.count > 0) {
      // Combo expired
      return { count: 1, multiplier: 1, lastKillTime: now, isActive: true };
    }
    
    const newCount = prev.count + 1;
    let newMultiplier = 1;
    
    for (const threshold of COMBO_THRESHOLDS) {
      if (newCount >= threshold.kills) {
        newMultiplier = threshold.multiplier;
      }
    }
    
    return {
      count: newCount,
      multiplier: newMultiplier,
      lastKillTime: now,
      isActive: true
    };
  });
}, []);
```

#### Break Combo on Damage

```typescript
// When base takes damage
const handleDamage = (amount: number) => {
  if (gameStateRef.current.shieldActive) return;
  
  setHp(prev => Math.max(0, prev - amount));
  
  // Break combo on damage
  if (comboState.count > 5) {
    // Show combo lost message
    gameStateRef.current.damageNumbers.push({
      x: gameStateRef.current.basePosition.x,
      y: gameStateRef.current.basePosition.y - 80,
      value: 0,
      life: 1.0,
      text: `${comboState.count}x COMBO LOST!`,
      color: '#FF003C'
    });
  }
  
  setComboState({ count: 0, multiplier: 1, lastKillTime: 0, isActive: false });
};
```

#### Combo UI Display

```tsx
// Add to HUD
{comboState.isActive && comboState.count > 1 && (
  <div className={`
    absolute left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg
    bg-gradient-to-r from-cyber-yellow/20 to-orange-500/20
    border border-cyber-yellow/50
    ${comboState.multiplier >= 2 ? 'animate-pulse' : ''}
  `}
  style={{ top: '80px' }}
  >
    <div className="text-center">
      <div className="text-2xl font-black font-orbitron text-cyber-yellow">
        {comboState.count}x
      </div>
      <div className="text-[9px] font-bold text-gray-400 uppercase">
        Combo {comboState.multiplier > 1 && `(${comboState.multiplier}x rewards)`}
      </div>
    </div>
  </div>
)}
```

---

## UI/UX Considerations

### Mobile Layout Changes

The additional abilities and ammo display need to fit in the mobile bottom tray:

```tsx
// Mobile ability layout (6 abilities now)
<div className="px-3 pt-2 pb-1">
  {/* First row: 3 main abilities */}
  <div className="flex justify-center gap-2 mb-2">
    {abilities.slice(0, 3).map(ability => renderAbilityButton(ability, 'mobile'))}
  </div>
  {/* Second row: 2 new abilities + ammo */}
  <div className="flex justify-center gap-2">
    {abilities.slice(3).map(ability => renderAbilityButton(ability, 'mobile'))}
    {aimMode === 'MANUAL' && <AmmoDisplay ammo={ammo} maxAmmo={maxAmmo} isReloading={isReloading} />}
  </div>
</div>
```

### Desktop Layout Changes

Add a new section to the side panel for aim mode toggle and ammo:

```tsx
// In right HUD panel
<div className="bg-white/5 rounded-xl p-4 space-y-3">
  <h3 className="text-[10px] uppercase text-gray-500 font-bold">Targeting</h3>
  <button
    onClick={() => setAimMode(prev => prev === 'AUTO' ? 'MANUAL' : 'AUTO')}
    className={`w-full h-10 rounded-lg border flex items-center justify-center gap-2 transition-all ${
      aimMode === 'MANUAL' 
        ? 'bg-cyber-blue text-black border-cyber-blue' 
        : 'bg-white/5 border-white/10'
    }`}
  >
    <Target size={16} />
    <span className="text-xs font-orbitron">{aimMode}</span>
  </button>
  
  {aimMode === 'MANUAL' && (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-gray-500">AMMO</span>
        <span className="text-lg font-bold font-mono text-cyber-yellow">
          {isReloading ? '...' : `${ammo}/${maxAmmo}`}
        </span>
      </div>
      {isReloading && (
        <div className="h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-cyber-yellow transition-all"
            style={{ width: `${reloadProgress}%` }}
          />
        </div>
      )}
    </div>
  )}
</div>
```

---

## Testing Checklist

### Manual Aim Mode
- [ ] Crosshair follows pointer on desktop
- [ ] Crosshair follows touch on mobile
- [ ] Projectiles fire toward crosshair position
- [ ] Turret rotates to aim direction
- [ ] Auto-aim toggle works
- [ ] Ammo depletes on fire
- [ ] Reload works (R key / button)
- [ ] Cannot fire while reloading

### Abilities
- [ ] All 5 abilities have correct cooldowns
- [ ] EMP stuns all enemies
- [ ] Repair Drone heals base
- [ ] Cooldown UI updates correctly
- [ ] Hotkeys work (Q, W, E, R, F)
- [ ] Mobile ability buttons work

### Priority Targets
- [ ] Priority targets spawn correctly
- [ ] Visual indicator shows on priority enemy
- [ ] Timer countdown shows
- [ ] Bonus applied when killed in time
- [ ] Enemy enrages if timer expires
- [ ] Only one priority target at a time

### Combo System
- [ ] Combo increases on consecutive kills
- [ ] Combo multiplier applies to rewards
- [ ] Combo breaks on base damage
- [ ] Combo breaks after timeout
- [ ] Visual feedback for combo state

---

## Rollout Strategy

### Phase 1a (Days 1-3)
1. Implement manual aim mode
2. Implement ammo/reload system
3. Add aim mode toggle UI

### Phase 1b (Days 4-6)
4. Reduce ability cooldowns
5. Add EMP Pulse ability
6. Add Repair Drone ability
7. Update UI for 5 abilities

### Phase 1c (Days 7-10)
8. Implement Priority Target system
9. Add visual indicators
10. Implement combo system
11. Full integration testing

### Phase 1d (Days 11-14)
12. User testing with original feedback group
13. Iterate based on feedback
14. Polish and bug fixes
15. Deploy to production

---

## Metrics to Track

After deployment, monitor:

1. **Inputs Per Minute (IPM)** - Goal: 30+ (up from ~5)
2. **Average Session Duration** - Goal: +20%
3. **Retry Rate** - Goal: >50% restart after death
4. **Ability Usage Frequency** - Goal: abilities used >20x per battle
5. **Combo Stats** - Track average combo, max combo reached

---

*Implementation Specification v1.0*
