import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Enemy, EnemyType, Projectile, ENEMY_REWARDS, WeaponType, WEAPONS, WeaponSkin, BaseSkin } from '../../types';
import { useGame } from '../../contexts/GameContext';
import { getWaveConfig } from '../../utils/storage';
import { 
  ENEMY_DEFINITIONS, 
  getEnemyHp, 
  getEnemySpeed, 
  getCollisionDamage, 
  selectEnemyType,
  getEnemyDefinition 
} from '../../constants/enemies';
import { selectEnemyBehavior, getBehaviorDefinition } from '../../constants/behaviors';
import { useResponsive, useTapGesture, useSwipeGesture, TapEvent, SwipeGesture } from '../../hooks/useResponsive';
import { Pause, Play, FastForward, XCircle, Shield, Zap, Target, RefreshCw, Coins, Flame, ChevronUp, Radio } from 'lucide-react';
import { WEAPON_SKINS, BASE_SKINS, BOOST_ITEMS } from '../../constants/shopItems';

interface BattleScreenProps {
  onExit: (completed: boolean) => void;
}

// Ability definitions
interface Ability {
  id: string;
  name: string;
  hotkey: string;
  cooldown: number;      // Total cooldown in ms
  currentCooldown: number;
  duration: number;      // Effect duration in ms
  activeUntil: number;   // Timestamp when effect ends
  icon: React.ReactNode;
  color: string;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ onExit }) => {
  const { state, startBattle, killEnemy, advanceWave } = useGame();
  const { stats, equippedWeapon, shop } = state;
  const currentWeapon = WEAPONS[equippedWeapon] || WEAPONS[WeaponType.BLASTER];
  
  // Get equipped skins
  const equippedWeaponSkin = shop.equippedWeaponSkin 
    ? WEAPON_SKINS.find(s => s.id === shop.equippedWeaponSkin) 
    : WEAPON_SKINS[0]; // Default skin
  const equippedBaseSkin = shop.equippedBaseSkin
    ? BASE_SKINS.find(s => s.id === shop.equippedBaseSkin)
    : BASE_SKINS[0]; // Default skin
  
  // Calculate boost multipliers from active boosts
  const boostEffects = React.useMemo(() => {
    const effects = {
      goldMultiplier: 1,
      damageMultiplier: 1,
      speedMultiplier: 1,
      critBonus: 0,
      gemChanceBonus: 0,
    };
    
    const now = Date.now();
    shop.activeBoosts.forEach(activeBoost => {
      // Skip expired boosts
      if (activeBoost.expiresAt && now > activeBoost.expiresAt) return;
      
      const boost = BOOST_ITEMS.find(b => b.id === activeBoost.boostId);
      if (!boost) return;
      
      switch (boost.effect.type) {
        case 'GOLD_MULTIPLIER':
          effects.goldMultiplier *= boost.effect.value;
          break;
        case 'DAMAGE_BOOST':
          effects.damageMultiplier *= (1 + boost.effect.value);
          break;
        case 'SPEED_BOOST':
          effects.speedMultiplier *= (1 + boost.effect.value);
          break;
        case 'CRIT_BOOST':
          effects.critBonus += boost.effect.value;
          break;
        case 'GEM_CHANCE_BONUS':
          effects.gemChanceBonus += boost.effect.value;
          break;
      }
    });
    
    return effects;
  }, [shop.activeBoosts]);
  
  // Responsive layout
  const responsive = useResponsive();
  const { isMobile, isPortrait, isTouchDevice, showSidebars, safeAreaTop, safeAreaBottom } = responsive;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Local battle state
  const [hp, setHp] = useState(3000);
  const maxHp = 3000;
  const [paused, setPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const speedMultiplierRef = useRef(1); // Ref to avoid game loop restart on speed change
  const [gameOver, setGameOver] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [targetedEnemy, setTargetedEnemy] = useState<string | null>(null);
  
  // Manual aim mode state
  const [aimMode, setAimMode] = useState<'AUTO' | 'MANUAL'>('MANUAL');
  const [aimPosition, setAimPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAiming, setIsAiming] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [ammo, setAmmo] = useState(30);
  const maxAmmo = 30;
  const [isReloading, setIsReloading] = useState(false);
  const [reloadProgress, setReloadProgress] = useState(0);
  
  // Use a ref to track game over state for the game loop (avoids effect re-runs)
  const gameOverRef = useRef(false);
  
  // Track if game state has been initialized (to prevent re-initialization on effect re-runs)
  const isInitializedRef = useRef(false);
  
  // Track hold-to-fire timing for continuous fire while holding
  const holdFireTimerRef = useRef(0);
  
  // Ability state
  const [abilities, setAbilities] = useState<Ability[]>([
    { id: 'plasma_burst', name: 'Plasma Burst', hotkey: 'Q', cooldown: 5000, currentCooldown: 0, duration: 0, activeUntil: 0, icon: <Flame size={22} />, color: 'text-orange-500' },
    { id: 'shield', name: 'Shield', hotkey: 'W', cooldown: 8000, currentCooldown: 0, duration: 5000, activeUntil: 0, icon: <Shield size={22} />, color: 'text-cyber-blue' },
    { id: 'overclock', name: 'Overclock', hotkey: 'E', cooldown: 12000, currentCooldown: 0, duration: 8000, activeUntil: 0, icon: <Zap size={22} />, color: 'text-cyber-yellow' },
    { id: 'emp_pulse', name: 'EMP Pulse', hotkey: 'R', cooldown: 6000, currentCooldown: 0, duration: 0, activeUntil: 0, icon: <Zap size={22} />, color: 'text-cyan-400' },
    { id: 'repair_drone', name: 'Repair', hotkey: 'F', cooldown: 15000, currentCooldown: 0, duration: 0, activeUntil: 0, icon: <Shield size={22} />, color: 'text-green-500' },
  ]);
  
  // Display state (from context)
  const wave = state.battle.currentWave;
  const waveModifier = state.battle.waveModifier;
  const score = state.battle.pendingRewards.scoreEarned;
  const goldEarned = state.battle.pendingRewards.goldEarned;
  const enemiesKilledThisWave = state.battle.enemiesKilledThisWave;
  const enemiesRequired = state.battle.enemiesRequiredForWave;

  // Refs for game loop
  const gameStateRef = useRef({
    lastTime: 0,
    spawnTimer: 0,
    fireTimer: 0,
    waveTransitionTimer: 0,
    enemies: [] as Enemy[],
    projectiles: [] as Projectile[],
    particles: [] as {x: number, y: number, vx: number, vy: number, life: number, color: string, size?: number}[],
    damageNumbers: [] as {x: number, y: number, value: number, life: number, isCrit: boolean}[],
    shockwaves: [] as {x: number, y: number, radius: number, maxRadius: number, color: string, life: number}[],
    basePosition: { x: 0, y: 0 },
    hp: 3000,
    showWaveText: false,
    waveTextTimer: 0,
    shieldActive: false,
    overclockActive: false,
    // Visual enhancement data
    stars: [] as {x: number, y: number, size: number, brightness: number, twinkleSpeed: number, layer: number}[],
    nebulaClouds: [] as {x: number, y: number, radius: number, color: string, alpha: number}[],
    turretAngle: 0,
    starsInitialized: false,
    // Manual aim tracking
    reloadStartTime: 0,
    // Priority targets & stun tracking
    priorityTarget: null as {x: number, y: number, spawnTime: number} | null,
    enemyStunMap: new Map<any, number>(), // Map of enemy to stun end time
  });

  // Initialize battle
  useEffect(() => {
    if (!battleStarted) {
      startBattle();
      setBattleStarted(true);
    }
  }, [battleStarted, startBattle]);

  // Sync HP to ref
  useEffect(() => {
    gameStateRef.current.hp = hp;
  }, [hp]);

  // Sync gameOver to ref (so game loop checks ref instead of triggering effect re-run)
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  // Sync speedMultiplier to ref (so game loop doesn't restart on speed change)
  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // Wave progression check
  useEffect(() => {
    // Use ref to prevent wave advancement after game over
    if (enemiesKilledThisWave >= enemiesRequired && !gameOverRef.current) {
      advanceWave();
      gameStateRef.current.showWaveText = true;
      gameStateRef.current.waveTextTimer = 2000;
    }
  }, [enemiesKilledThisWave, enemiesRequired, advanceWave]);

  // Ability cooldown tick
  useEffect(() => {
    if (paused || gameOver) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      setAbilities(prev => prev.map(ability => {
        // Update cooldown
        let newCooldown = ability.currentCooldown > 0 ? ability.currentCooldown - 100 : 0;
        
        // Check if effect expired
        if (ability.activeUntil > 0 && now > ability.activeUntil) {
          if (ability.id === 'shield') gameStateRef.current.shieldActive = false;
          if (ability.id === 'overclock') gameStateRef.current.overclockActive = false;
          return { ...ability, currentCooldown: newCooldown, activeUntil: 0 };
        }
        
        return { ...ability, currentCooldown: newCooldown };
      }));
    }, 100);
    
    return () => clearInterval(interval);
  }, [paused, gameOver]);

  // Reload effect
  useEffect(() => {
    if (!isReloading || paused || gameOver) return;
    
    const RELOAD_TIME = 1500; // 1.5 seconds to reload
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - gameStateRef.current.reloadStartTime;
      const progress = Math.min(100, (elapsed / RELOAD_TIME) * 100);
      
      setReloadProgress(progress);
      
      if (elapsed >= RELOAD_TIME) {
        setAmmo(maxAmmo);
        setIsReloading(false);
        setReloadProgress(0);
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isReloading, paused, gameOver, maxAmmo]);

  // Spawn enemy with wave scaling - using centralized definitions
  const spawnEnemy = useCallback((canvasWidth: number, canvasHeight: number) => {
    const padding = 50;
    const x = 50 + Math.random() * (canvasWidth - 100);
    const y = -padding;

    const waveConfig = getWaveConfig(wave);
    const currentBossCount = gameStateRef.current.enemies.filter(e => e.type === EnemyType.BOSS).length;
    
    // Use centralized enemy type selection
    const type = selectEnemyType(wave, waveConfig.isBossWave, currentBossCount);
    const definition = getEnemyDefinition(type);
    
    // Select behavior based on wave and modifier
    const modifierId = waveModifier?.id;
    const behaviorType = selectEnemyBehavior(wave, modifierId);
    const behaviorDef = getBehaviorDefinition(behaviorType);
    
    // Calculate scaled stats using centralized formulas
    let enemyHp = getEnemyHp(definition, wave);
    let speed = getEnemySpeed(definition, wave);
    
    // Apply behavior multipliers
    enemyHp *= behaviorDef.hpMultiplier;
    speed *= behaviorDef.speedMultiplier;

    const enemy: Enemy = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x,
      y,
      hp: enemyHp,
      maxHp: enemyHp,
      speed,
      baseSpeed: speed,
      radius: definition.radius,
      color: definition.color,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      pulsePhase: Math.random() * Math.PI * 2,
      slowedUntil: 0,
      slowPercent: 0,
      // Behavior system
      behavior: behaviorType,
      behaviorColor: behaviorDef.color,
      damageTakenMultiplier: behaviorDef.hasDamageReduction ? 0.85 : 1.0,
    };

    gameStateRef.current.enemies.push(enemy);
  }, [wave, waveModifier]);

  // Create explosion particles
  const createExplosion = useCallback((x: number, y: number, color: string, count: number = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      gameStateRef.current.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color,
        size: Math.random() * 3 + 1
      });
    }
  }, []);

  // Trigger screen shake
  const triggerScreenShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 200);
  }, []);

  // Create damage number
  const createDamageNumber = useCallback((x: number, y: number, value: number, isCrit: boolean) => {
    gameStateRef.current.damageNumbers.push({
      x, y: y - 20,
      value: Math.floor(value),
      life: 1.0,
      isCrit
    });
    
    // Trigger screen shake on critical hits
    if (isCrit) {
      triggerScreenShake();
    }
  }, [triggerScreenShake]);

  // Activate ability
  const activateAbility = useCallback((abilityId: string) => {
    if (paused || gameOver) return;
    
    setAbilities(prev => prev.map(ability => {
      if (ability.id !== abilityId) return ability;
      if (ability.currentCooldown > 0) return ability; // Still on cooldown
      
      const now = Date.now();
      const gState = gameStateRef.current;
      
      switch (abilityId) {
        case 'plasma_burst':
          // Deal AoE damage to all enemies in range
          const burstRadius = 200;
          const burstDamage = stats.damage * 3;
          gState.enemies.forEach(enemy => {
            const dx = enemy.x - gState.basePosition.x;
            const dy = enemy.y - gState.basePosition.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < burstRadius) {
              enemy.hp -= burstDamage;
              createExplosion(enemy.x, enemy.y, '#FF6600', 5);
              createDamageNumber(enemy.x, enemy.y, burstDamage, true);
            }
          });
          // Create shockwave visual
          gState.shockwaves.push({
            x: gState.basePosition.x,
            y: gState.basePosition.y,
            radius: 0,
            maxRadius: burstRadius,
            color: '#FF6600',
            life: 1.0
          });
          break;
          
        case 'shield':
          gState.shieldActive = true;
          break;
          
        case 'overclock':
          gState.overclockActive = true;
          break;

        case 'emp_pulse':
          // Stun all enemies for 2 seconds (2000ms)
          const stunDuration = 2000;
          const empRadius = 300;
          gState.enemies.forEach(enemy => {
            const dx = enemy.x - gState.basePosition.x;
            const dy = enemy.y - gState.basePosition.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < empRadius) {
              // Set stun end time for this enemy
              gState.enemyStunMap.set(enemy, now + stunDuration);
              createExplosion(enemy.x, enemy.y, '#00FFFF', 4);
              // Create electric arc effect
              createDamageNumber(enemy.x, enemy.y, 0, false); // Show "STUNNED" as damage number
            }
          });
          // Create EMP shockwave visual
          gState.shockwaves.push({
            x: gState.basePosition.x,
            y: gState.basePosition.y,
            radius: 0,
            maxRadius: empRadius,
            color: '#00FFFF',
            life: 1.0
          });
          break;

        case 'repair_drone':
          // Restore 300 HP
          const repairAmount = 300;
          gState.hp = Math.min(gState.hp + repairAmount, 3000);
          createExplosion(gState.basePosition.x, gState.basePosition.y, '#00FF00', 3);
          createDamageNumber(gState.basePosition.x, gState.basePosition.y - 50, repairAmount, false);
          break;
      }
      
      return {
        ...ability,
        currentCooldown: ability.cooldown,
        activeUntil: ability.duration > 0 ? now + ability.duration : 0
      };
    }));
  }, [paused, gameOver, stats.damage, createExplosion, createDamageNumber]);

  // Reload weapon
  const startReload = useCallback(() => {
    if (isReloading || ammo === maxAmmo) return;
    setIsReloading(true);
    setReloadProgress(0);
    gameStateRef.current.reloadStartTime = Date.now();
  }, [isReloading, ammo, maxAmmo]);

  // Fire projectile at target position
  const fireProjectileAt = useCallback((targetX: number, targetY: number) => {
    if (ammo <= 0 || isReloading) {
      startReload();
      return;
    }
    
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
      trail: [],
      splashRadius: currentWeapon.splashRadius,
      slowPercent: currentWeapon.slowPercent,
      slowDuration: currentWeapon.slowDuration,
      piercing: currentWeapon.piercing,
      hitEnemies: [],
      trailColor: equippedWeaponSkin?.trailColor || currentWeapon.projectileColor,
      trailStyle: equippedWeaponSkin?.trailStyle || 'normal',
      particleEffect: equippedWeaponSkin?.particleEffect,
    });
    
    triggerScreenShake();
    setAmmo(prev => prev - 1);
  }, [ammo, isReloading, stats.damage, currentWeapon, boostEffects, equippedWeaponSkin, triggerScreenShake, startReload]);

  // Handle pointer move for aiming
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (aimMode !== 'MANUAL' || paused || gameOver) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    setAimPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsAiming(true);
  }, [aimMode, paused, gameOver]);

  // Handle pointer down for holding and continuous fire
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (aimMode !== 'MANUAL' || paused || gameOver) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;
    
    // Start holding - enable continuous fire
    setIsHolding(true);
    holdFireTimerRef.current = 0;
    
    // Fire immediately on click
    fireProjectileAt(targetX, targetY);
  }, [aimMode, paused, gameOver, fireProjectileAt]);

  // Handle pointer up to stop holding
  const handlePointerUp = useCallback(() => {
    setIsHolding(false);
    holdFireTimerRef.current = 0;
  }, []);

  // Handle pointer leave to stop aiming and holding
  const handlePointerLeave = useCallback(() => {
    setIsAiming(false);
    setIsHolding(false);
    holdFireTimerRef.current = 0;
  }, []);

  // Keyboard handler for abilities and reload
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (paused || gameOver) return;
      
      switch (e.key.toLowerCase()) {
        case 'q':
          activateAbility('plasma_burst');
          break;
        case 'w':
          activateAbility('shield');
          break;
        case 'e':
          activateAbility('overclock');
          break;
        case 'r':
          activateAbility('emp_pulse');
          break;
        case 'f':
          activateAbility('repair_drone');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activateAbility, paused, gameOver]);

  // Initialize game state on mount only (separate from game loop to prevent re-initialization)
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    // Initialize game state once on mount
    gameStateRef.current = {
      ...gameStateRef.current,
      enemies: [],
      projectiles: [],
      particles: [],
      damageNumbers: [],
      hp: 3000,
      lastTime: performance.now()
    };
    setHp(3000);
    setGameOver(false);
    gameOverRef.current = false;
  }, []);

  // Main Game Loop
  useEffect(() => {
    let frameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const waveConfig = getWaveConfig(wave);

    const loop = (time: number) => {
      // Use ref to check game over to avoid effect re-run triggering reset
      if (gameOverRef.current) return;

      const rawDelta = time - gameStateRef.current.lastTime;
      gameStateRef.current.lastTime = time;
      
      if (paused) {
        frameId = requestAnimationFrame(loop);
        return;
      }
      
      const delta = Math.min(rawDelta, 50) * speedMultiplierRef.current;
      const now = Date.now();
      const gState = gameStateRef.current;
      
      // Get wave config and apply modifier multipliers
      let baseWaveConfig = getWaveConfig(wave);
      let currentWaveConfig = baseWaveConfig;
      
      if (waveModifier) {
        // Map modifier ID to multipliers
        const modifierMultipliers: Record<string, any> = {
          fortified: { enemyHp: 1.3 },
          swift: { enemySpeed: 1.25 },
          swarm: { enemyHp: 0.6, spawnInterval: 0.5 },
          resilient: {}, // Damage reduction handled elsewhere
          aggressive: {}, // Collision damage handled elsewhere
          regenerating: {}, // Healing handled in enemy update
          evasive: { enemySpeed: 1.1 },
        };
        
        const mods = modifierMultipliers[waveModifier.id] || {};
        currentWaveConfig = {
          ...baseWaveConfig,
          enemyHpMultiplier: baseWaveConfig.enemyHpMultiplier * (mods.enemyHp || 1),
          enemySpeedMultiplier: baseWaveConfig.enemySpeedMultiplier * (mods.enemySpeed || 1),
          spawnInterval: baseWaveConfig.spawnInterval * (mods.spawnInterval || 1),
        };
      }

      // Update dimensions
      gState.basePosition = { x: canvas.width / 2, y: canvas.height - 100 };

      // Wave text timer
      if (gState.showWaveText) {
        gState.waveTextTimer -= delta;
        if (gState.waveTextTimer <= 0) {
          gState.showWaveText = false;
        }
      }

      // --- SPAWNING ---
      gState.spawnTimer += delta;
      if (gState.spawnTimer > currentWaveConfig.spawnInterval) {
        spawnEnemy(canvas.width, canvas.height);
        gState.spawnTimer = 0;
      }

      // --- PRIORITY TARGET SPAWNING ---
      // 20% chance to spawn a priority target every 8 seconds
      if (!gState.priorityTarget && Math.random() < 0.2) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 400;
        gState.priorityTarget = {
          x: gState.basePosition.x + Math.cos(angle) * distance,
          y: gState.basePosition.y + Math.sin(angle) * distance,
          spawnTime: Date.now()
        };
      }

      // --- FIRING ---
      gState.fireTimer += delta;
      // Apply overclock bonus (2x attack speed) and weapon attack speed modifier
      const attackSpeedMultiplier = (gState.overclockActive ? 2 : 1) * currentWeapon.attackSpeedMultiplier;
      const fireInterval = 1000 / ((stats.attackSpeed || 1) * attackSpeedMultiplier);
      
      if (aimMode === 'MANUAL') {
        // Manual aim mode: only update turret angle, don't auto-fire
        if (isAiming && aimPosition) {
          const dx = aimPosition.x - gState.basePosition.x;
          const dy = aimPosition.y - gState.basePosition.y;
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            gState.turretAngle = Math.atan2(dy, dx);
          }
        }
        
        // Handle hold-to-fire: continuous fire while holding at upgradeable rate
        if (isHolding && aimPosition && !isReloading) {
          holdFireTimerRef.current += delta;
          if (holdFireTimerRef.current >= fireInterval) {
            // Fire at current aim position
            fireProjectileAt(aimPosition.x, aimPosition.y);
            holdFireTimerRef.current = 0;
          }
        }
      } else {
        // AUTO aim mode: existing logic
        if (gState.fireTimer >= fireInterval) {
          let closestDist = Infinity;
          let target: Enemy | null = null;

          gState.enemies.forEach(enemy => {
            const dx = enemy.x - gState.basePosition.x;
            const dy = enemy.y - gState.basePosition.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < closestDist) {
              closestDist = dist;
              target = enemy;
            }
          });

          if (target && closestDist < 800) {
            const projSpeed = 0.8 * currentWeapon.projectileSpeed * boostEffects.speedMultiplier;
            const dx = (target as Enemy).x - gState.basePosition.x;
            const dy = (target as Enemy).y - gState.basePosition.y;
            const angle = Math.atan2(dy, dx);
            
            // Use skin colors if available, otherwise weapon defaults
            const projColor = equippedWeaponSkin?.projectileColor || currentWeapon.projectileColor;
            const trailColor = equippedWeaponSkin?.trailColor || currentWeapon.projectileColor;
            const trailStyle = equippedWeaponSkin?.trailStyle || 'normal';
            const particleEffect = equippedWeaponSkin?.particleEffect;
            
            // Apply damage boost
            const boostedDamage = stats.damage * currentWeapon.damageMultiplier * boostEffects.damageMultiplier;
            
            gState.projectiles.push({
              id: Math.random().toString(),
              x: gState.basePosition.x,
              y: gState.basePosition.y - 40,
              vx: Math.cos(angle) * projSpeed,
              vy: Math.sin(angle) * projSpeed,
              damage: boostedDamage,
              color: projColor,
              weaponType: equippedWeapon,
              targetId: (target as Enemy).id,
              trail: [],
              splashRadius: currentWeapon.splashRadius,
              slowPercent: currentWeapon.slowPercent,
              slowDuration: currentWeapon.slowDuration,
              piercing: currentWeapon.piercing,
              hitEnemies: [],
              trailColor: trailColor,
              trailStyle: trailStyle,
              particleEffect: particleEffect,
            });
            gState.fireTimer = 0;
          }
        }
      }

      // --- UPDATE ENEMIES ---
      for (let i = gState.enemies.length - 1; i >= 0; i--) {
        const enemy = gState.enemies[i];
        
        const dx = gState.basePosition.x - enemy.x;
        const dy = gState.basePosition.y - enemy.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Check if enemy is stunned
        const isStunned = gState.enemyStunMap.has(enemy) && now < (gState.enemyStunMap.get(enemy) || 0);
        if (isStunned && now >= (gState.enemyStunMap.get(enemy) || 0)) {
          gState.enemyStunMap.delete(enemy);
        }
        
        // Calculate speed with slow effect (stun prevents movement)
        let currentSpeed = enemy.baseSpeed || enemy.speed;
        if (!isStunned) {
          if (enemy.slowedUntil && now < enemy.slowedUntil && enemy.slowPercent) {
            currentSpeed *= (1 - enemy.slowPercent / 100);
          } else if (enemy.slowedUntil && now >= enemy.slowedUntil) {
            // Clear slow effect
            enemy.slowedUntil = 0;
            enemy.slowPercent = 0;
          }
        } else {
          currentSpeed = 0; // Stunned = no movement
        }
        
        // Apply evasive modifier: erratic movement (adds random direction changes)
        if (waveModifier?.id === 'evasive' && !isStunned && dist > 1) {
          // Initialize evasion timer if needed
          if (!enemy.evasionTimer) {
            enemy.evasionTimer = 0;
            enemy.evasionAngle = 0;
          }
          
          enemy.evasionTimer -= delta;
          if (enemy.evasionTimer <= 0) {
            // Change direction every 0.5-1.5 seconds
            enemy.evasionAngle = Math.random() * Math.PI * 2;
            enemy.evasionTimer = 500 + Math.random() * 1000;
          }
          
          // Add evasive movement component (30% of normal movement)
          const baseAngle = Math.atan2(dy, dx);
          const mixedAngle = baseAngle * 0.7 + enemy.evasionAngle * 0.3;
          enemy.x += Math.cos(mixedAngle) * currentSpeed * delta;
          enemy.y += Math.sin(mixedAngle) * currentSpeed * delta;
        } 
        // Apply evasive behavior: erratic movement with frequent direction changes
        else if (enemy.behavior === 'evasive' && !isStunned && dist > 1) {
          // Initialize evasion timer if needed
          if (!enemy.evasionTimer) {
            enemy.evasionTimer = 0;
            enemy.evasionAngle = 0;
          }
          
          enemy.evasionTimer -= delta;
          if (enemy.evasionTimer <= 0) {
            // Change direction every 0.3-0.8 seconds (faster than modifier)
            enemy.evasionAngle = Math.random() * Math.PI * 2;
            enemy.evasionTimer = 300 + Math.random() * 500;
          }
          
          // More erratic: 50% random movement vs 50% approach
          const baseAngle = Math.atan2(dy, dx);
          const mixedAngle = baseAngle * 0.5 + enemy.evasionAngle * 0.5;
          enemy.x += Math.cos(mixedAngle) * currentSpeed * delta;
          enemy.y += Math.sin(mixedAngle) * currentSpeed * delta;
        }
        else if (dist > 1 && !isStunned) {
          enemy.x += (dx / dist) * currentSpeed * delta;
          enemy.y += (dy / dist) * currentSpeed * delta;
        }

        if (enemy.rotation !== undefined && enemy.rotationSpeed !== undefined) {
          enemy.rotation += enemy.rotationSpeed * delta;
        }

        // Apply regenerating modifier: enemies heal over time
        if (waveModifier?.id === 'regenerating') {
          const maxHp = (enemy.baseHp || enemy.hp) * (enemy.hpMultiplier || 1);
          const healRate = maxHp * 0.015 * delta; // 1.5% of max HP per second
          if (enemy.hp < maxHp) {
            enemy.hp = Math.min(maxHp, enemy.hp + healRate);
          }
        }
        
        // Apply tanky behavior: regeneration for tanky enemies
        if (enemy.behavior === 'tanky') {
          const maxHp = enemy.maxHp;
          const healRate = maxHp * 0.010 * delta; // 1.0% of max HP per second (slower than modifier)
          if (enemy.hp < maxHp) {
            enemy.hp = Math.min(maxHp, enemy.hp + healRate);
          }
        }

        // Base collision - use centralized damage formula with defense
        if (dist < enemy.radius + 40) {
          const definition = getEnemyDefinition(enemy.type);
          const playerDefense = stats.defense || 0;
          let damage = getCollisionDamage(definition, wave, playerDefense);
          
          // Apply aggressive modifier damage multiplier
          if (waveModifier?.id === 'aggressive') {
            damage *= 1.5; // 50% increased collision damage
          }
          
          // Apply aggressive behavior damage multiplier
          if (enemy.behavior === 'aggressive') {
            damage *= 1.3; // 30% increased collision damage for aggressive behavior
          }
          
          // Shield blocks damage
          if (!gState.shieldActive) {
            setHp(prev => Math.max(0, prev - damage));
          }
          createExplosion(enemy.x, enemy.y, gState.shieldActive ? '#00F0FF' : '#FF003C', 15);
          gState.enemies.splice(i, 1);
          continue;
        }
      }

      // --- UPDATE PROJECTILES ---
      for (let i = gState.projectiles.length - 1; i >= 0; i--) {
        const proj = gState.projectiles[i];
        
        if (proj.targetId) {
          const target = gState.enemies.find(e => e.id === proj.targetId);
          if (target) {
            const dx = target.x - proj.x;
            const dy = target.y - proj.y;
            const angle = Math.atan2(dy, dx);
            const speed = 0.8;
            const turnFactor = 0.1;
            proj.vx = proj.vx * (1-turnFactor) + Math.cos(angle) * speed * turnFactor;
            proj.vy = proj.vy * (1-turnFactor) + Math.sin(angle) * speed * turnFactor;
          }
        }

        proj.x += proj.vx * delta;
        proj.y += proj.vy * delta;

        if (!proj.trail) proj.trail = [];
        proj.trail.push({x: proj.x, y: proj.y});
        if (proj.trail.length > 5) proj.trail.shift();

        if (proj.x < -50 || proj.x > canvas.width + 50 || proj.y < -50 || proj.y > canvas.height + 50) {
          gState.projectiles.splice(i, 1);
          continue;
        }

        // Enemy collision
        let hit = false;
        let shouldRemove = false;
        
        for (let j = gState.enemies.length - 1; j >= 0; j--) {
          const enemy = gState.enemies[j];
          
          // Skip enemies already hit by piercing projectile
          if (proj.piercing && proj.hitEnemies?.includes(enemy.id)) continue;
          
          const dx = enemy.x - proj.x;
          const dy = enemy.y - proj.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < enemy.radius + 5) {
            hit = true;
            
            // Apply crit bonus from boosts
            const effectiveCritRate = stats.critRate + boostEffects.critBonus;
            const isCrit = Math.random() * 100 < effectiveCritRate;
            const baseDmg = proj.damage || stats.damage;
            let dmg = isCrit ? baseDmg * (stats.critDamage / 100) : baseDmg;
            
            // Apply Resilient modifier damage reduction (20% reduction)
            if (waveModifier?.id === 'resilient') {
              dmg *= 0.8;
            }
            
            // Apply tanky behavior damage reduction (15% reduction for tanky enemies)
            if (enemy.damageTakenMultiplier && enemy.damageTakenMultiplier < 1) {
              dmg *= enemy.damageTakenMultiplier;
            }
            
            // Apply damage to primary target
            enemy.hp -= dmg;
            createDamageNumber(enemy.x, enemy.y, dmg, isCrit);
            createExplosion(proj.x, proj.y, proj.color, 3);
            
            // Apply slow effect (Cryo weapon)
            if (proj.slowPercent && proj.slowDuration) {
              enemy.slowedUntil = Date.now() + proj.slowDuration;
              enemy.slowPercent = proj.slowPercent;
              // Visual: ice particles
              createExplosion(enemy.x, enemy.y, '#88FFFF', 5);
            }
            
            // Handle splash damage (Missile weapon)
            if (proj.splashRadius && proj.splashRadius > 0) {
              // Create shockwave visual
              gState.shockwaves.push({
                x: proj.x,
                y: proj.y,
                radius: 0,
                maxRadius: proj.splashRadius,
                color: '#FF6600',
                life: 1.0
              });
              
              // Damage nearby enemies
              const splashDmg = dmg * 0.5; // 50% splash damage
              for (let k = gState.enemies.length - 1; k >= 0; k--) {
                if (k === j) continue; // Skip primary target
                const other = gState.enemies[k];
                const sdx = other.x - proj.x;
                const sdy = other.y - proj.y;
                const sdist = Math.sqrt(sdx*sdx + sdy*sdy);
                
                if (sdist < proj.splashRadius) {
                  other.hp -= splashDmg;
                  createDamageNumber(other.x, other.y, splashDmg, false);
                  createExplosion(other.x, other.y, '#FF6600', 3);
                  
                  if (other.hp <= 0) {
                    createExplosion(other.x, other.y, other.color, 15);
                    killEnemy(other.type, false, splashDmg);
                    gState.enemies.splice(k, 1);
                    if (k < j) j--; // Adjust index
                  }
                }
              }
            }
            
            // Handle piercing (Laser weapon)
            if (proj.piercing) {
              if (!proj.hitEnemies) proj.hitEnemies = [];
              proj.hitEnemies.push(enemy.id);
              // Don't remove projectile, continue through
            } else {
              shouldRemove = true;
            }
            
            // Check if primary target is dead
            if (enemy.hp <= 0) {
              createExplosion(enemy.x, enemy.y, enemy.color, 15);
              
              // Check if this was a priority target kill (bonus reward opportunity)
              if (gState.priorityTarget) {
                const distToPriority = Math.sqrt(
                  Math.pow(enemy.x - gState.priorityTarget.x, 2) +
                  Math.pow(enemy.y - gState.priorityTarget.y, 2)
                );
                const timeSincePrioritySpawn = now - gState.priorityTarget.spawnTime;
                
                // If killed the priority target within 6 seconds, clear it
                if (distToPriority < 50 && timeSincePrioritySpawn < 6000) {
                  gState.priorityTarget = null;
                }
              }
              
              killEnemy(enemy.type, isCrit, dmg);
              gState.enemies.splice(j, 1);
            }
            
            if (!proj.piercing) break;
          }
        }
        
        if (shouldRemove) {
          gState.projectiles.splice(i, 1);
        }
      }

      // --- UPDATE PARTICLES ---
      for (let i = gState.particles.length - 1; i >= 0; i--) {
        const p = gState.particles[i];
        p.x += p.vx * delta * 0.5;
        p.y += p.vy * delta * 0.5;
        p.life -= 0.003 * delta;
        if (p.life <= 0) gState.particles.splice(i, 1);
      }

      // --- UPDATE SHOCKWAVES ---
      for (let i = gState.shockwaves.length - 1; i >= 0; i--) {
        const s = gState.shockwaves[i];
        s.radius += delta * 0.5;
        s.life -= 0.003 * delta;
        if (s.life <= 0 || s.radius >= s.maxRadius) {
          gState.shockwaves.splice(i, 1);
        }
      }

      // --- UPDATE DAMAGE NUMBERS ---
      for (let i = gState.damageNumbers.length - 1; i >= 0; i--) {
        const d = gState.damageNumbers[i];
        d.y -= 0.05 * delta;
        d.life -= 0.002 * delta;
        if (d.life <= 0) gState.damageNumbers.splice(i, 1);
      }

      // Check game over - auto-exit to show summary after brief delay
      // Use ref to prevent multiple triggers and race conditions
      if (gState.hp <= 0 && !gameOverRef.current) {
        gameOverRef.current = true; // Set ref immediately to prevent re-triggers
        setGameOver(true);
        // Brief delay to show critical failure, then auto-exit to summary
        setTimeout(() => {
          onExit(false);
        }, 1500);
      }

      // --- DRAWING ---
      // Initialize stars and nebula on first frame
      if (!gState.starsInitialized) {
        gState.stars = [];
        gState.nebulaClouds = [];
        // Create 3 layers of stars for parallax
        for (let layer = 0; layer < 3; layer++) {
          const count = layer === 0 ? 100 : layer === 1 ? 60 : 30;
          for (let i = 0; i < count; i++) {
            gState.stars.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: layer === 0 ? 0.5 : layer === 1 ? 1 : 1.5 + Math.random(),
              brightness: 0.3 + Math.random() * 0.7,
              twinkleSpeed: 0.001 + Math.random() * 0.003,
              layer
            });
          }
        }
        // Create nebula clouds
        const nebulaColors = ['#00F0FF', '#BC13FE', '#FF003C', '#0AFF64'];
        for (let i = 0; i < 5; i++) {
          gState.nebulaClouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 100 + Math.random() * 150,
            color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
            alpha: 0.02 + Math.random() * 0.03
          });
        }
        gState.starsInitialized = true;
      }
      
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#020208');
      bgGradient.addColorStop(0.5, '#05050A');
      bgGradient.addColorStop(1, '#080815');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw nebula clouds (far background)
      gState.nebulaClouds.forEach(cloud => {
        const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
        gradient.addColorStop(0, cloud.color + '15');
        gradient.addColorStop(0.5, cloud.color + '08');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw stars with parallax and twinkling
      gState.stars.forEach(star => {
        const twinkle = 0.5 + Math.sin(time * star.twinkleSpeed) * 0.5;
        const alpha = star.brightness * twinkle;
        // Subtle parallax movement based on layer
        const parallaxOffset = (star.layer + 1) * Math.sin(time * 0.0001) * 2;
        const x = (star.x + parallaxOffset) % canvas.width;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = star.layer === 2 ? '#00F0FF' : '#ffffff';
        ctx.beginPath();
        ctx.arc(x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow to larger stars
        if (star.size > 1) {
          ctx.globalAlpha = alpha * 0.3;
          ctx.beginPath();
          ctx.arc(x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      
      // Subtle grid overlay
      ctx.strokeStyle = '#ffffff03';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for(let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for(let j = 0; j < canvas.height; j += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
      }

      // --- DRAW BASE DEFENSE STATION ---
      const bx = gState.basePosition.x;
      const by = gState.basePosition.y;
      
      // Get base skin colors (with fallbacks)
      const baseCoreColor = equippedBaseSkin?.coreColor || '#00F0FF';
      const baseRingColor = equippedBaseSkin?.ringColor || '#00F0FF';
      const baseShieldColor = equippedBaseSkin?.shieldColor || '#00FFFF';
      const baseGlowColor = equippedBaseSkin?.glowColor || '#00F0FF';
      const baseStyle = equippedBaseSkin?.style || 'default';
      
      // Calculate turret angle (point at nearest enemy or closest projectile target)
      let targetAngle = -Math.PI / 2; // Default pointing up
      if (gState.enemies.length > 0) {
        const nearestEnemy = gState.enemies.reduce((nearest, e) => {
          const d = Math.hypot(e.x - bx, e.y - by);
          return d < Math.hypot(nearest.x - bx, nearest.y - by) ? e : nearest;
        });
        targetAngle = Math.atan2(nearestEnemy.y - by, nearestEnemy.x - bx);
      }
      // Smooth turret rotation
      const angleDiff = targetAngle - gState.turretAngle;
      const normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
      gState.turretAngle += normalizedDiff * 0.05;
      
      ctx.shadowBlur = 40;
      ctx.shadowColor = gState.shieldActive ? baseShieldColor : (gState.overclockActive ? '#FCEE0A' : baseGlowColor);
      
      // Shield bubble (enhanced when active)
      if (gState.shieldActive) {
        // Outer shield ring
        ctx.strokeStyle = baseShieldColor;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.6 + Math.sin(time * 0.01) * 0.2;
        ctx.beginPath();
        ctx.arc(bx, by, 70, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner shield with hexagon pattern
        ctx.globalAlpha = 0.15 + Math.sin(time * 0.015) * 0.05;
        const shieldGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 70);
        shieldGrad.addColorStop(0, baseShieldColor + '00');
        shieldGrad.addColorStop(0.7, baseShieldColor + '30');
        shieldGrad.addColorStop(1, baseShieldColor + '60');
        ctx.fillStyle = shieldGrad;
        ctx.fill();
        
        // Hexagon shield pattern
        ctx.strokeStyle = baseShieldColor + '40';
        ctx.lineWidth = 1;
        for (let ring = 1; ring <= 3; ring++) {
          const r = ring * 22;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + time * 0.001;
            const px = bx + Math.cos(a) * r;
            const py = by + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      
      // Overclock effect (enhanced spinning energy)
      if (gState.overclockActive) {
        ctx.strokeStyle = '#FCEE0A';
        const rotAngle = time * 0.005;
        // Electric arcs
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5 + Math.sin(time * 0.02) * 0.3;
        for (let i = 0; i < 12; i++) {
          const angle = rotAngle + (i / 12) * Math.PI * 2;
          const innerR = 45 + Math.sin(time * 0.01 + i) * 5;
          const outerR = 75 + Math.sin(time * 0.015 + i * 2) * 8;
          ctx.beginPath();
          ctx.moveTo(bx + Math.cos(angle) * innerR, by + Math.sin(angle) * innerR);
          // Jagged lightning effect
          const midR = (innerR + outerR) / 2;
          const jitter = (Math.random() - 0.5) * 10;
          ctx.lineTo(bx + Math.cos(angle + 0.05) * midR + jitter, by + Math.sin(angle + 0.05) * midR + jitter);
          ctx.lineTo(bx + Math.cos(angle) * outerR, by + Math.sin(angle) * outerR);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      
      // Base style-specific effects
      if (baseStyle === 'fire' && !gState.shieldActive && !gState.overclockActive) {
        // Fire particles around the base
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 8; i++) {
          const fireAngle = (i / 8) * Math.PI * 2 + time * 0.002;
          const fireR = 50 + Math.sin(time * 0.01 + i) * 8;
          const fireX = bx + Math.cos(fireAngle) * fireR;
          const fireY = by + Math.sin(fireAngle) * fireR - Math.random() * 10;
          ctx.beginPath();
          ctx.arc(fireX, fireY, 4 + Math.random() * 4, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? '#FF6600' : '#FFD700';
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else if (baseStyle === 'ice' && !gState.shieldActive && !gState.overclockActive) {
        // Ice crystal particles
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 6; i++) {
          const iceAngle = (i / 6) * Math.PI * 2 + time * 0.001;
          const iceR = 52 + Math.sin(time * 0.008 + i * 2) * 5;
          ctx.save();
          ctx.translate(bx + Math.cos(iceAngle) * iceR, by + Math.sin(iceAngle) * iceR);
          ctx.rotate(time * 0.005 + i);
          ctx.fillStyle = '#88FFFF';
          ctx.fillRect(-3, -3, 6, 6);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      } else if (baseStyle === 'void' && !gState.shieldActive && !gState.overclockActive) {
        // Dark matter swirl
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 10; i++) {
          const voidAngle = (i / 10) * Math.PI * 2 + time * 0.003;
          const voidR = 48 + Math.sin(time * 0.01 + i * 1.5) * 10;
          ctx.beginPath();
          ctx.arc(bx + Math.cos(voidAngle) * voidR, by + Math.sin(voidAngle) * voidR, 5 + Math.sin(time * 0.02 + i) * 3, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? '#8B00FF' : '#4B0082';
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else if (baseStyle === 'rainbow' && !gState.shieldActive && !gState.overclockActive) {
        // Rainbow aura
        for (let i = 0; i < 6; i++) {
          const hue = (time * 0.05 + i * 60) % 360;
          const rainbowAngle = (i / 6) * Math.PI * 2 + time * 0.002;
          const rainbowR = 55;
          ctx.beginPath();
          ctx.arc(bx + Math.cos(rainbowAngle) * rainbowR, by + Math.sin(rainbowAngle) * rainbowR, 6, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.6)`;
          ctx.fill();
        }
      }
      
      // Outer rotating ring (Layer 3)
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(time * 0.0008);
      ctx.strokeStyle = gState.overclockActive ? '#FCEE0A50' : baseRingColor + '50';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 55, 0, Math.PI * 2);
      ctx.stroke();
      // Ring segments
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(0, 0, 55, a, a + 0.2);
        ctx.strokeStyle = gState.overclockActive ? '#FCEE0A' : baseRingColor;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      ctx.restore();
      
      // Middle rotating ring (Layer 2 - opposite direction)
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(-time * 0.001);
      ctx.strokeStyle = gState.overclockActive ? '#FCEE0A' : baseRingColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.stroke();
      // Dashed ring effect
      ctx.setLineDash([10, 5]);
      ctx.strokeStyle = '#ffffff30';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      
      // Main base platform
      const baseGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 38);
      baseGrad.addColorStop(0, '#0A0A12');
      baseGrad.addColorStop(0.7, '#050508');
      baseGrad.addColorStop(1, '#000000');
      ctx.beginPath();
      ctx.arc(bx, by, 38, 0, Math.PI * 2);
      ctx.fillStyle = baseGrad;
      ctx.fill();
      ctx.strokeStyle = baseCoreColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Weapon turret (uses weapon skin color for barrel glow)
      const projColor = equippedWeaponSkin?.projectileColor || currentWeapon.projectileColor;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(gState.turretAngle);
      
      // Turret base
      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = projColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Turret barrel
      ctx.fillStyle = '#0d0d15';
      ctx.fillRect(10, -4, 30, 8);
      ctx.strokeStyle = projColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(10, -4, 30, 8);
      
      // Barrel glow tip
      const barrelGlow = ctx.createRadialGradient(38, 0, 0, 38, 0, 8);
      barrelGlow.addColorStop(0, projColor);
      barrelGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = barrelGlow;
      ctx.beginPath();
      ctx.arc(38, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      // Energy core (multi-layer pulsing with skin color)
      const pulsePhase = time * 0.005;
      for (let layer = 3; layer >= 0; layer--) {
        const layerPulse = Math.sin(pulsePhase + layer * 0.5) * 0.5 + 0.5;
        const size = 8 + layer * 4 + layerPulse * 3;
        const alpha = (1 - layer * 0.2) * (0.3 + layerPulse * 0.2);
        
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(bx, by, size, 0, Math.PI * 2);
        
        if (layer === 0) {
          // Core center - bright
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        } else {
          // Outer layers - skin-colored glow
          const coreGrad = ctx.createRadialGradient(bx, by, 0, bx, by, size);
          coreGrad.addColorStop(0, baseCoreColor + '80');
          coreGrad.addColorStop(1, baseCoreColor + '00');
          ctx.fillStyle = coreGrad;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // --- DRAW PROJECTILES (Enhanced weapon-specific designs) ---
      gState.projectiles.forEach(p => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        
        // Draw trail with skin-based styling
        if (p.trail && p.trail.length > 1) {
          const trailColor = p.trailColor || p.color;
          const trailStyle = p.trailStyle || 'normal';
          
          for (let k = 1; k < p.trail.length; k++) {
            const progress = k / p.trail.length;
            const alpha = progress * 0.7;
            ctx.globalAlpha = alpha;
            
            // Trail style variations
            switch (trailStyle) {
              case 'flame':
                // Flickering flame trail
                const flameOffset = Math.sin(time * 0.05 + k * 0.5) * 2;
                ctx.strokeStyle = k % 2 === 0 ? '#FF6600' : '#FFD700';
                ctx.lineWidth = 2 + progress * 4 + Math.random() * 2;
                ctx.beginPath();
                ctx.moveTo(p.trail[k-1].x + flameOffset, p.trail[k-1].y);
                ctx.lineTo(p.trail[k].x - flameOffset, p.trail[k].y);
                ctx.stroke();
                break;
                
              case 'electric':
                // Jagged lightning trail
                ctx.strokeStyle = k % 3 === 0 ? '#FFFFFF' : '#00FFFF';
                ctx.lineWidth = 1 + Math.random() * 3;
                ctx.beginPath();
                ctx.moveTo(p.trail[k-1].x, p.trail[k-1].y);
                const jitterX = (Math.random() - 0.5) * 8;
                const jitterY = (Math.random() - 0.5) * 8;
                ctx.lineTo(p.trail[k].x + jitterX, p.trail[k].y + jitterY);
                ctx.stroke();
                // Small electric sparks
                if (k % 2 === 0) {
                  ctx.beginPath();
                  ctx.arc(p.trail[k].x + jitterX, p.trail[k].y + jitterY, 2, 0, Math.PI * 2);
                  ctx.fillStyle = '#FFFFFF';
                  ctx.fill();
                }
                break;
                
              case 'ice':
                // Crystalline ice trail with particles
                ctx.strokeStyle = k % 2 === 0 ? '#88FFFF' : '#FFFFFF';
                ctx.lineWidth = 1 + progress * 3;
                ctx.beginPath();
                ctx.moveTo(p.trail[k-1].x, p.trail[k-1].y);
                ctx.lineTo(p.trail[k].x, p.trail[k].y);
                ctx.stroke();
                // Ice crystals
                if (k % 3 === 0) {
                  ctx.save();
                  ctx.translate(p.trail[k].x, p.trail[k].y);
                  ctx.rotate(time * 0.01 + k);
                  ctx.fillStyle = '#FFFFFF80';
                  ctx.fillRect(-2, -2, 4, 4);
                  ctx.restore();
                }
                break;
                
              case 'rainbow':
                // Cycling rainbow colors
                const hue = (time * 0.1 + k * 20) % 360;
                ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
                ctx.lineWidth = 2 + progress * 3;
                ctx.beginPath();
                ctx.moveTo(p.trail[k-1].x, p.trail[k-1].y);
                ctx.lineTo(p.trail[k].x, p.trail[k].y);
                ctx.stroke();
                break;
                
              case 'void':
                // Dark matter with purple/black swirl
                ctx.strokeStyle = k % 2 === 0 ? '#8B00FF' : '#4B0082';
                ctx.lineWidth = 2 + progress * 3;
                const voidOffset = Math.sin(time * 0.03 + k * 0.3) * 3;
                ctx.beginPath();
                ctx.moveTo(p.trail[k-1].x + voidOffset, p.trail[k-1].y);
                ctx.lineTo(p.trail[k].x - voidOffset, p.trail[k].y);
                ctx.stroke();
                // Void particles
                if (k % 4 === 0) {
                  ctx.beginPath();
                  ctx.arc(p.trail[k].x, p.trail[k].y, 3 + Math.random() * 2, 0, Math.PI * 2);
                  ctx.fillStyle = '#8B00FF40';
                  ctx.fill();
                }
                break;
                
              default:
                // Normal trail
                ctx.strokeStyle = trailColor;
                ctx.lineWidth = 1 + progress * 2;
                ctx.beginPath();
                ctx.moveTo(p.trail[k-1].x, p.trail[k-1].y);
                ctx.lineTo(p.trail[k].x, p.trail[k].y);
                ctx.stroke();
            }
          }
          ctx.globalAlpha = 1;
        }
        
        // Weapon-specific projectile design
        if (p.weaponType === WeaponType.MISSILE) {
          // MISSILE - Rocket with exhaust flame
          ctx.save();
          ctx.translate(p.x, p.y);
          const angle = Math.atan2(p.vy, p.vx);
          ctx.rotate(angle);
          
          // Exhaust flame
          const flameFlicker = Math.random() * 0.3 + 0.7;
          const flameGrad = ctx.createLinearGradient(-20, 0, 0, 0);
          flameGrad.addColorStop(0, 'transparent');
          flameGrad.addColorStop(0.3, '#FF660080');
          flameGrad.addColorStop(0.6, '#FF6600');
          flameGrad.addColorStop(1, '#FFFF00');
          ctx.fillStyle = flameGrad;
          ctx.globalAlpha = flameFlicker;
          ctx.beginPath();
          ctx.moveTo(-15 - Math.random() * 5, 0);
          ctx.lineTo(0, -4);
          ctx.lineTo(0, 4);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = 1;
          
          // Missile body
          ctx.fillStyle = '#333';
          ctx.fillRect(-3, -3, 12, 6);
          ctx.fillStyle = p.color;
          ctx.fillRect(6, -3, 4, 6);
          
          // Fins
          ctx.fillStyle = '#666';
          ctx.beginPath();
          ctx.moveTo(-3, -3);
          ctx.lineTo(-6, -6);
          ctx.lineTo(-3, -3);
          ctx.lineTo(-3, 3);
          ctx.lineTo(-6, 6);
          ctx.closePath();
          ctx.fill();
          
          ctx.restore();
          
        } else if (p.weaponType === WeaponType.LASER) {
          // LASER - Long beam with glow
          ctx.save();
          ctx.translate(p.x, p.y);
          const angle = Math.atan2(p.vy, p.vx);
          ctx.rotate(angle);
          
          // Outer glow
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = p.color;
          ctx.fillRect(-30, -4, 35, 8);
          
          // Inner beam
          ctx.globalAlpha = 0.8;
          const beamGrad = ctx.createLinearGradient(-25, 0, 5, 0);
          beamGrad.addColorStop(0, 'transparent');
          beamGrad.addColorStop(0.3, p.color + '80');
          beamGrad.addColorStop(1, p.color);
          ctx.fillStyle = beamGrad;
          ctx.fillRect(-25, -2, 30, 4);
          
          // Core
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-5, -1, 10, 2);
          
          ctx.restore();
          
        } else if (p.weaponType === WeaponType.CRYO) {
          // CRYO - Ice shard with crystal effect
          ctx.save();
          ctx.translate(p.x, p.y);
          const angle = Math.atan2(p.vy, p.vx);
          ctx.rotate(angle + Math.PI / 2);
          
          // Ice glow
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = '#88FFFF';
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();
          
          // Main crystal
          ctx.globalAlpha = 0.9;
          const iceGrad = ctx.createLinearGradient(0, -8, 0, 8);
          iceGrad.addColorStop(0, '#ffffff');
          iceGrad.addColorStop(0.5, p.color);
          iceGrad.addColorStop(1, '#88FFFF');
          ctx.fillStyle = iceGrad;
          ctx.strokeStyle = '#ffffff80';
          ctx.lineWidth = 1;
          
          // Diamond shape
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(5, 0);
          ctx.lineTo(0, 10);
          ctx.lineTo(-5, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Sparkles
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.7 + Math.random() * 0.3;
          ctx.beginPath();
          ctx.arc(2, -4, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-2, 3, 1, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.globalAlpha = 1;
          ctx.restore();
          
        } else {
          // BLASTER - Plasma orb with glow
          // Outer glow
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          const plasmaGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
          plasmaGrad.addColorStop(0, p.color);
          plasmaGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = plasmaGrad;
          ctx.fill();
          
          // Inner orb
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          
          // Bright core
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.globalAlpha = 1;
      });
      ctx.shadowBlur = 0;

      // --- DRAW ENEMIES (Enhanced) ---
      gState.enemies.forEach(e => {
        const pulse = Math.sin((e.pulsePhase || 0) + time * 0.003) * 0.5 + 0.5;
        
        // Draw glowing trail
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y + e.radius * 0.3, e.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        ctx.shadowBlur = 25;
        ctx.shadowColor = e.color;

        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation || 0);

        if (e.type === EnemyType.BOSS) {
          // BOSS - Elaborate multi-layer hexagonal design
          // Outer glow ring
          ctx.globalAlpha = 0.3 + pulse * 0.2;
          ctx.strokeStyle = e.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, e.radius + 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
          
          // Main hexagon body
          const hexGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, e.radius);
          hexGrad.addColorStop(0, e.color + '80');
          hexGrad.addColorStop(0.6, e.color + '40');
          hexGrad.addColorStop(1, e.color + '20');
          ctx.fillStyle = hexGrad;
          ctx.strokeStyle = e.color;
          ctx.lineWidth = 3;
          
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const px = Math.cos(angle) * e.radius;
            const py = Math.sin(angle) * e.radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Inner rotating core
          ctx.save();
          ctx.rotate(time * 0.002);
          ctx.strokeStyle = '#ffffff50';
          ctx.lineWidth = 2;
          for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * e.radius * 0.7, Math.sin(angle) * e.radius * 0.7);
            ctx.stroke();
          }
          ctx.restore();
          
          // Evil eye core
          const eyeSize = 8 + pulse * 4;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, eyeSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = e.color;
          ctx.beginPath();
          ctx.arc(0, 0, eyeSize * 0.5, 0, Math.PI * 2);
          ctx.fill();
          
        } else if (e.type === EnemyType.TANK) {
          // TANK - Heavy armored design with shield indicator
          // Outer armor plating
          const tankGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, e.radius);
          tankGrad.addColorStop(0, '#8B6914');
          tankGrad.addColorStop(0.5, '#654321');
          tankGrad.addColorStop(1, '#3D2914');
          ctx.fillStyle = tankGrad;
          ctx.strokeStyle = '#A07020';
          ctx.lineWidth = 4;
          
          // Octagon body
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 - Math.PI / 8;
            const px = Math.cos(angle) * e.radius;
            const py = Math.sin(angle) * e.radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Armor plates (rivets)
          ctx.fillStyle = '#2a1a0a';
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const rx = Math.cos(angle) * (e.radius * 0.7);
            const ry = Math.sin(angle) * (e.radius * 0.7);
            ctx.beginPath();
            ctx.arc(rx, ry, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Shield indicator (HP-based)
          const hpRatio = e.hp / e.maxHp;
          if (hpRatio > 0.5) {
            ctx.strokeStyle = '#00FF00';
            ctx.globalAlpha = 0.4;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, e.radius + 5, 0, Math.PI * 2 * hpRatio);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
          
          // Inner core
          ctx.fillStyle = '#1a0a00';
          ctx.beginPath();
          ctx.arc(0, 0, e.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FF6600';
          ctx.lineWidth = 2;
          ctx.stroke();
          
        } else if (e.type === EnemyType.SWARM) {
          // SWARM - Fast, buzzing diamond
          // Jittering effect
          const jitter = Math.sin(time * 0.02 + (e.pulsePhase || 0)) * 2;
          
          ctx.fillStyle = e.color + '60';
          ctx.strokeStyle = e.color;
          ctx.lineWidth = 2;
          
          ctx.beginPath();
          ctx.moveTo(0, -e.radius + jitter);
          ctx.lineTo(e.radius - jitter, 0);
          ctx.lineTo(0, e.radius + jitter);
          ctx.lineTo(-e.radius + jitter, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Wing-like appendages
          ctx.strokeStyle = e.color + '80';
          ctx.lineWidth = 1;
          const wingFlap = Math.sin(time * 0.03 + (e.pulsePhase || 0)) * 0.3;
          ctx.beginPath();
          ctx.moveTo(-e.radius * 0.5, 0);
          ctx.quadraticCurveTo(-e.radius * 1.5, -e.radius * wingFlap, -e.radius * 0.5, -e.radius * 0.5);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(e.radius * 0.5, 0);
          ctx.quadraticCurveTo(e.radius * 1.5, -e.radius * wingFlap, e.radius * 0.5, -e.radius * 0.5);
          ctx.stroke();
          
        } else if (e.type === EnemyType.SQUARE) {
          // SQUARE - Rotating cube effect
          const squareGrad = ctx.createLinearGradient(-e.radius, -e.radius, e.radius, e.radius);
          squareGrad.addColorStop(0, e.color + '80');
          squareGrad.addColorStop(0.5, e.color + '40');
          squareGrad.addColorStop(1, e.color + '80');
          ctx.fillStyle = squareGrad;
          ctx.strokeStyle = e.color;
          ctx.lineWidth = 2;
          
          ctx.fillRect(-e.radius, -e.radius, e.radius * 2, e.radius * 2);
          ctx.strokeRect(-e.radius, -e.radius, e.radius * 2, e.radius * 2);
          
          // Inner cross pattern
          ctx.strokeStyle = e.color + '60';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-e.radius, 0);
          ctx.lineTo(e.radius, 0);
          ctx.moveTo(0, -e.radius);
          ctx.lineTo(0, e.radius);
          ctx.stroke();
          
        } else if (e.type === EnemyType.TRIANGLE) {
          // TRIANGLE - Sharp attacker
          const triGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, e.radius);
          triGrad.addColorStop(0, e.color + '90');
          triGrad.addColorStop(1, e.color + '30');
          ctx.fillStyle = triGrad;
          ctx.strokeStyle = e.color;
          ctx.lineWidth = 2;
          
          ctx.beginPath();
          ctx.moveTo(0, -e.radius);
          ctx.lineTo(e.radius, e.radius);
          ctx.lineTo(-e.radius, e.radius);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Inner triangle
          ctx.strokeStyle = e.color + '60';
          ctx.beginPath();
          ctx.moveTo(0, -e.radius * 0.4);
          ctx.lineTo(e.radius * 0.4, e.radius * 0.4);
          ctx.lineTo(-e.radius * 0.4, e.radius * 0.4);
          ctx.closePath();
          ctx.stroke();
          
        } else {
          // CIRCLE - Standard enemy with gradient
          const circGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, e.radius);
          circGrad.addColorStop(0, e.color + '80');
          circGrad.addColorStop(0.7, e.color + '40');
          circGrad.addColorStop(1, e.color + '20');
          ctx.fillStyle = circGrad;
          ctx.strokeStyle = e.color;
          ctx.lineWidth = 2;
          
          ctx.beginPath();
          ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          // Inner glow ring
          ctx.strokeStyle = '#ffffff40';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, e.radius * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Slow effect visual - enhanced ice crystals
        if (e.slowedUntil && Date.now() < e.slowedUntil) {
          ctx.strokeStyle = '#88FFFF';
          ctx.fillStyle = '#88FFFF20';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.8;
          
          // Ice ring
          ctx.beginPath();
          ctx.arc(0, 0, e.radius + 8, 0, Math.PI * 2);
          ctx.fill();
          
          // Ice crystals
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + time * 0.002;
            const innerR = e.radius + 3;
            const outerR = e.radius + 15;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
            ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
            // Crystal branches
            ctx.moveTo(Math.cos(angle) * (outerR - 5), Math.sin(angle) * (outerR - 5));
            ctx.lineTo(Math.cos(angle + 0.2) * outerR, Math.sin(angle + 0.2) * outerR);
            ctx.moveTo(Math.cos(angle) * (outerR - 5), Math.sin(angle) * (outerR - 5));
            ctx.lineTo(Math.cos(angle - 0.2) * outerR, Math.sin(angle - 0.2) * outerR);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
        
        // Enhanced HP bar with glow
        ctx.rotate(-(e.rotation || 0));
        const hpPct = e.hp / e.maxHp;
        const barWidth = e.type === EnemyType.BOSS ? 80 : e.type === EnemyType.TANK ? 50 : 24;
        const barHeight = e.type === EnemyType.BOSS ? 8 : 5;
        const barY = -e.radius - 15;
        
        // Bar background
        ctx.fillStyle = '#00000080';
        ctx.fillRect(-barWidth/2 - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        // Bar fill with gradient
        const hpColor = hpPct > 0.5 ? '#0AFF64' : hpPct > 0.25 ? '#FCEE0A' : '#FF003C';
        const hpGrad = ctx.createLinearGradient(-barWidth/2, barY, barWidth/2, barY);
        hpGrad.addColorStop(0, hpColor);
        hpGrad.addColorStop(1, hpColor + '80');
        ctx.fillStyle = hpGrad;
        ctx.fillRect(-barWidth/2, barY, barWidth * hpPct, barHeight);
        
        // Bar border
        ctx.strokeStyle = '#ffffff40';
        ctx.lineWidth = 1;
        ctx.strokeRect(-barWidth/2, barY, barWidth, barHeight);

        ctx.restore();
      });

      // --- DRAW PRIORITY TARGET ---
      if (gState.priorityTarget) {
        const pt = gState.priorityTarget;
        const timeSincePriority = now - pt.spawnTime;
        const isExpiring = timeSincePriority > 6000 - 1000; // Last 1 second
        const pulse = Math.sin(timeSincePriority * 0.01) * 0.5 + 0.5;
        
        // Pulsing ring around priority target location
        ctx.strokeStyle = isExpiring ? '#FF003C' : '#00FF00';
        ctx.lineWidth = isExpiring ? 4 : 3;
        ctx.globalAlpha = isExpiring ? 0.5 + pulse * 0.5 : 0.7;
        
        // Inner circle
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 30, 0, Math.PI * 2);
        ctx.stroke();
        
        // Outer circle
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        // Diamond shape marker
        ctx.fillStyle = isExpiring ? '#FF003C80' : '#00FF0080';
        const diamondSize = 20;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y - diamondSize);
        ctx.lineTo(pt.x + diamondSize, pt.y);
        ctx.lineTo(pt.x, pt.y + diamondSize);
        ctx.lineTo(pt.x - diamondSize, pt.y);
        ctx.closePath();
        ctx.fill();
        
        // Timer text
        const timeRemaining = Math.max(0, (6000 - timeSincePriority) / 1000).toFixed(1);
        ctx.fillStyle = isExpiring ? '#FF003C' : '#00FF00';
        ctx.font = 'bold 14px Rajdhani';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(timeRemaining, pt.x, pt.y - 70);
        
        ctx.globalAlpha = 1;
      }

      // --- DRAW PARTICLES (Enhanced) ---
      gState.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        
        // Particle glow
        const particleGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, (p.size || 2) * 2);
        particleGrad.addColorStop(0, p.color);
        particleGrad.addColorStop(0.5, p.color + '80');
        particleGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = particleGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (p.size || 2) * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, (p.size || 2) * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
      });

      // --- DRAW SHOCKWAVES (Enhanced) ---
      gState.shockwaves.forEach(s => {
        const progress = s.radius / s.maxRadius;
        
        // Outer ring
        ctx.globalAlpha = s.life * 0.6 * (1 - progress);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 6 - progress * 4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner glow ring
        ctx.globalAlpha = s.life * 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        // Fill effect
        ctx.globalAlpha = s.life * 0.1 * (1 - progress);
        const shockGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
        shockGrad.addColorStop(0, s.color);
        shockGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = shockGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
      });

      // --- DRAW DAMAGE NUMBERS (Enhanced) ---
      gState.damageNumbers.forEach(d => {
        ctx.globalAlpha = d.life;
        
        const fontSize = d.isCrit ? 24 : 16;
        ctx.font = `bold ${fontSize}px Orbitron`;
        ctx.textAlign = 'center';
        
        // Text shadow/glow
        if (d.isCrit) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#FCEE0A';
          ctx.fillStyle = '#FCEE0A';
          // Draw "CRIT!" above
          ctx.font = 'bold 10px Orbitron';
          ctx.fillText('CRIT!', d.x, d.y - 15);
          ctx.font = `bold ${fontSize}px Orbitron`;
        } else {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ffffff';
          ctx.fillStyle = '#ffffff';
        }
        
        // Outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(d.value.toString(), d.x, d.y);
        
        // Fill
        ctx.fillText(d.value.toString(), d.x, d.y);
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // --- DRAW WAVE TRANSITION (Enhanced) ---
      if (gState.showWaveText) {
        const progress = gState.waveTextTimer / 2000;
        const scale = 0.5 + progress * 0.5;
        const yOffset = (1 - progress) * 30;
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 - yOffset);
        ctx.scale(scale, scale);
        
        // Glow effect
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#00F0FF';
        
        // Background bar
        ctx.globalAlpha = progress * 0.3;
        ctx.fillStyle = '#00F0FF';
        ctx.fillRect(-150, -25, 300, 50);
        
        // Main text
        ctx.globalAlpha = progress;
        ctx.font = 'bold 48px Orbitron';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Text outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(`WAVE ${wave}`, 0, 0);
        
        // Text fill with gradient
        const textGrad = ctx.createLinearGradient(-100, 0, 100, 0);
        textGrad.addColorStop(0, '#00F0FF');
        textGrad.addColorStop(0.5, '#ffffff');
        textGrad.addColorStop(1, '#00F0FF');
        ctx.fillStyle = textGrad;
        ctx.fillText(`WAVE ${wave}`, 0, 0);
        
        // Subtitle
        ctx.font = 'bold 14px Orbitron';
        ctx.fillStyle = '#ffffff80';
        ctx.fillText('INCOMING', 0, 30);
        
        // Decorative lines
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2;
        ctx.globalAlpha = progress * 0.5;
        ctx.beginPath();
        ctx.moveTo(-180, 0);
        ctx.lineTo(-100, 0);
        ctx.moveTo(100, 0);
        ctx.lineTo(180, 0);
        ctx.stroke();
        
        ctx.restore();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // --- DRAW AIM CROSSHAIR (Manual Mode) ---
      if (aimMode === 'MANUAL' && isAiming) {
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
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(nearestInRange.x, nearestInRange.y, nearestInRange.radius + 10, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
      }

      frameId = requestAnimationFrame(loop);
    };

    const handleResize = () => {
      const parent = containerRef.current;
      if (parent && canvas) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    frameId = requestAnimationFrame(loop);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, stats, wave, spawnEnemy, createExplosion, createDamageNumber, killEnemy, boostEffects, equippedWeaponSkin, equippedBaseSkin, aimMode, isAiming, aimPosition, isHolding, isReloading]);

  // Handle tap to target enemy
  const handleCanvasTap = useCallback((tap: TapEvent) => {
    if (paused || gameOver) return;
    
    const gState = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Find enemy at tap location
    for (const enemy of gState.enemies) {
      const distance = Math.sqrt(Math.pow(tap.x - enemy.x, 2) + Math.pow(tap.y - enemy.y, 2));
      if (distance < enemy.radius + 20) { // 20px touch tolerance
        setTargetedEnemy(enemy.id);
        return;
      }
    }
    
    // Clear target if tapped empty space
    setTargetedEnemy(null);
  }, [paused, gameOver]);

  // Handle swipe to activate abilities
  const handleSwipe = useCallback((gesture: SwipeGesture) => {
    if (paused || gameOver) return;
    
    // Swipe up activates abilities in order
    if (gesture.direction === 'up' && gesture.distance > 80) {
      const availableAbility = abilities.find(a => a.currentCooldown <= 0);
      if (availableAbility) {
        activateAbility(availableAbility.id);
      }
    }
  }, [paused, gameOver, abilities, activateAbility]);

  // Register touch gestures
  useTapGesture(containerRef, handleCanvasTap);
  useSwipeGesture(containerRef, handleSwipe, 60);

  const resetGame = () => {
    gameOverRef.current = false;
    isInitializedRef.current = false; // Allow re-initialization
    setHp(3000);
    setGameOver(false);
    setPaused(false);
    startBattle();
    setTargetedEnemy(null);
    gameStateRef.current.enemies = [];
    gameStateRef.current.projectiles = [];
    gameStateRef.current.particles = [];
    gameStateRef.current.damageNumbers = [];
    gameStateRef.current.hp = 3000;
  };

  // Render ability button (reusable for mobile/desktop)
  const renderAbilityButton = (ability: Ability, variant: 'mobile' | 'desktop') => {
    const isOnCooldown = ability.currentCooldown > 0;
    const isActive = ability.activeUntil > Date.now();
    const cooldownPercent = isOnCooldown ? (ability.currentCooldown / ability.cooldown) * 100 : 0;

    if (variant === 'mobile') {
      return (
        <button
          key={ability.id}
          onClick={() => activateAbility(ability.id)}
          disabled={isOnCooldown}
          className={`
            w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden
            transition-all active:scale-95 touch-manipulation select-none
            ${isActive 
              ? 'bg-cyber-blue/30 border-cyber-blue shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
              : isOnCooldown 
                ? 'bg-gray-900/80 border-gray-700 text-gray-500' 
                : 'bg-white/10 border-white/20 active:bg-white/30'
            }
          `}
        >
          {isOnCooldown && (
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white/20"
              style={{ height: `${cooldownPercent}%` }}
            />
          )}
          <div className={`relative z-10 ${ability.color} ${isActive ? 'animate-pulse' : ''}`}>
            {ability.icon}
          </div>
          <span className="text-[9px] font-bold mt-0.5 relative z-10 font-orbitron">
            {isOnCooldown ? `${Math.ceil(ability.currentCooldown / 1000)}s` : ability.hotkey}
          </span>
        </button>
      );
    }

    return (
      <button 
        key={ability.id}
        onClick={() => activateAbility(ability.id)}
        disabled={isOnCooldown}
        className={`
          w-full flex items-center justify-between p-4 border rounded-xl transition-all group relative overflow-hidden
          ${isActive 
            ? 'bg-cyber-blue/20 border-cyber-blue text-white' 
            : isOnCooldown 
              ? 'bg-gray-900 border-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-white/5 border-white/5 hover:bg-white hover:text-black'
          }
        `}
      >
        {isOnCooldown && (
          <div className="absolute inset-0 bg-white/10" style={{ width: `${cooldownPercent}%` }} />
        )}
        <div className="flex items-center space-x-3 relative z-10">
          <div className={`opacity-70 group-hover:opacity-100 ${ability.color}`}>{ability.icon}</div>
          <span className="text-xs font-bold font-orbitron">{ability.name}</span>
        </div>
        <span className="text-[10px] font-black opacity-30 group-hover:opacity-100 relative z-10">
          {isOnCooldown ? `${Math.ceil(ability.currentCooldown / 1000)}s` : ability.hotkey}
        </span>
      </button>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-[10001] flex overflow-hidden touch-manipulation"
      style={{ 
        flexDirection: showSidebars ? 'row' : 'column',
        paddingTop: `${safeAreaTop}px`,
        paddingBottom: isMobile && isPortrait ? 0 : `${safeAreaBottom}px`,
      }}
    >
      
      {/* Left HUD: Defense Telemetry (Desktop/Landscape Only) */}
      {showSidebars && (
        <div className="flex flex-col w-72 xl:w-80 bg-cyber-dark/95 border-r border-white/10 p-6 xl:p-8 space-y-6 shrink-0 relative z-10">
          <div>
            <h2 className="text-xs font-orbitron font-bold text-cyber-blue tracking-widest mb-4">DEFENSE_MATRIX</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-gray-500 uppercase">Hull Integrity</span>
                  <span className="text-white">{Math.round((hp/maxHp)*100)}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-900 rounded-full border border-white/5 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${hp/maxHp > 0.5 ? 'bg-cyber-green' : hp/maxHp > 0.25 ? 'bg-cyber-yellow' : 'bg-cyber-pink'}`} 
                    style={{ width: `${(hp/maxHp)*100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-gray-500 uppercase">Wave Progress</span>
                  <span className="text-cyber-blue">{enemiesKilledThisWave}/{enemiesRequired}</span>
                </div>
                <div className="h-2.5 w-full bg-gray-900 rounded-full border border-white/5 overflow-hidden">
                  <div className="h-full bg-cyber-blue" style={{ width: `${(enemiesKilledThisWave/enemiesRequired)*100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-[10px] uppercase text-gray-500 font-bold mb-2">Combat Log</h3>
            <div className="text-[9px] font-mono text-gray-400 space-y-1">
              <p>&gt; Wave {wave} active</p>
              <p>&gt; Hostiles: {gameStateRef.current.enemies.length}</p>
              <p>&gt; Systems nominal</p>
              <p className="text-cyber-yellow">&gt; Score: {score}</p>
            </div>
          </div>

          <div className="bg-cyber-yellow/10 rounded-xl p-4 border border-cyber-yellow/20">
            <div className="flex items-center gap-2 mb-1">
              <Coins size={14} className="text-cyber-yellow" />
              <span className="text-[10px] uppercase text-gray-500 font-bold">Gold Earned</span>
            </div>
            <div className="text-xl font-bold font-mono text-cyber-yellow">{goldEarned}</div>
          </div>
        </div>
      )}

      {/* Main Battle Area */}
      <div 
        ref={containerRef} 
        className={`flex-1 relative bg-[#020205] ${screenShake ? 'shake' : ''}`}
        style={{ 
          minHeight: isMobile && isPortrait ? '60vh' : 'auto',
          touchAction: 'none',
        }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full" 
          style={{ touchAction: 'none' }}
        />
        
        {/* Game Over Screen - Brief visual before auto-exit to summary */}
        {gameOver && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <h1 className="text-2xl sm:text-4xl font-black font-orbitron text-red-500 mb-2 tracking-widest text-center animate-pulse">CRITICAL FAILURE</h1>
            <p className="text-gray-400 mb-4 font-mono text-sm">HULL INTEGRITY COMPROMISED</p>
            <div className="text-cyber-blue text-sm font-mono animate-pulse">Analyzing battle data...</div>
          </div>
        )}

        {/* Top HUD - Compact on mobile */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-3 sm:space-x-6 px-4 sm:px-6 py-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl pointer-events-none"
          style={{ top: isMobile ? '8px' : '16px' }}
        >
          <div className="text-center">
            <div className="text-[7px] sm:text-[8px] text-gray-500 font-orbitron">WAVE</div>
            <div className="text-base sm:text-lg font-bold font-orbitron">{String(wave).padStart(2, '0')}</div>
          </div>
          
          {/* Wave Modifier Badge */}
          {waveModifier && (
            <>
              <div className="w-px h-5 sm:h-6 bg-white/10" />
              <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg border text-[8px] sm:text-[9px] font-bold`}
                style={{ 
                  backgroundColor: `${waveModifier.color}15`, 
                  borderColor: `${waveModifier.color}40`,
                  color: waveModifier.color
                }}
                title={waveModifier.description}
              >
                <span>{waveModifier.icon}</span>
                <span className="uppercase font-orbitron">{waveModifier.name}</span>
              </div>
            </>
          )}
          
          <div className="w-px h-5 sm:h-6 bg-white/10" />
          <div className="text-center">
            <div className="text-[7px] sm:text-[8px] text-gray-500 font-orbitron">SCORE</div>
            <div className="text-base sm:text-lg font-bold font-orbitron text-cyber-yellow">{score}</div>
          </div>
          <div className="w-px h-5 sm:h-6 bg-white/10" />
          <div className="text-center">
            <div className="text-[7px] sm:text-[8px] text-gray-500 font-orbitron">GOLD</div>
            <div className="text-base sm:text-lg font-bold font-orbitron text-cyber-yellow flex items-center gap-1">
              <Coins size={10} className="sm:w-3 sm:h-3" /> {goldEarned}
            </div>
          </div>
        </div>

        {/* Mobile HP Bar - Only on mobile */}
        {!showSidebars && (
          <div className="absolute left-3 right-3" style={{ top: isMobile ? '52px' : '56px' }}>
            <div className="flex justify-between text-[9px] font-bold mb-1">
              <span className="text-gray-400">HULL</span>
              <span className={hp/maxHp > 0.5 ? 'text-cyber-green' : hp/maxHp > 0.25 ? 'text-cyber-yellow' : 'text-cyber-pink'}>
                {Math.round((hp/maxHp)*100)}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-gray-900/80 rounded-full overflow-hidden border border-white/10">
              <div 
                className={`h-full transition-all ${hp/maxHp > 0.5 ? 'bg-cyber-green' : hp/maxHp > 0.25 ? 'bg-cyber-yellow' : 'bg-cyber-pink'}`}
                style={{ width: `${(hp/maxHp)*100}%` }}
              />
            </div>
            {/* Wave progress mini bar */}
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[8px] text-gray-500 font-orbitron">WAVE</span>
              <div className="flex-1 h-1.5 bg-gray-900/80 rounded-full overflow-hidden">
                <div className="h-full bg-cyber-blue" style={{ width: `${(enemiesKilledThisWave/enemiesRequired)*100}%` }} />
              </div>
              <span className="text-[8px] text-cyber-blue font-bold">{enemiesKilledThisWave}/{enemiesRequired}</span>
            </div>
          </div>
        )}

        {/* Touch hint for targeting */}
        {isTouchDevice && targetedEnemy && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-cyber-blue/20 text-cyber-blue text-[10px] font-orbitron px-3 py-1 rounded-full border border-cyber-blue/30">
            <Target size={10} className="inline mr-1" /> TARGETING LOCKED
          </div>
        )}
      </div>

      {/* Right HUD: Controls - Stacked differently for mobile portrait */}
      {showSidebars ? (
        // Desktop/Landscape: Side panel
        <div className="w-72 xl:w-80 bg-cyber-dark/95 border-l border-white/10 p-6 xl:p-8 flex flex-col shrink-0 space-y-6 relative z-10">
          <div>
            <h2 className="text-xs font-orbitron font-bold text-gray-500 tracking-widest mb-4 uppercase">Tactical</h2>
            <div className="space-y-3">
              {abilities.map(ability => renderAbilityButton(ability, 'desktop'))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/5">
            <div>
              <h3 className="text-[10px] uppercase text-gray-500 font-bold mb-2">Targeting System</h3>
              <button
                onClick={() => setAimMode(prev => prev === 'AUTO' ? 'MANUAL' : 'AUTO')}
                className={`w-full h-10 rounded-lg border flex items-center justify-center gap-2 transition-all font-orbitron text-xs ${
                  aimMode === 'MANUAL' 
                    ? 'bg-cyber-blue text-black border-cyber-blue font-bold' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Target size={14} />
                <span>{aimMode === 'MANUAL' ? 'MANUAL AIM' : 'AUTO AIM'}</span>
              </button>
            </div>

            {aimMode === 'MANUAL' && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-gray-500 font-orbitron">AMMO {isHolding && '(HOLDING)'}</span>
                  <span className={`text-sm font-bold font-mono ${isReloading ? 'text-cyber-yellow animate-pulse' : isHolding ? 'text-cyber-blue animate-pulse' : 'text-white'}`}>
                    {isReloading ? 'RELOADING' : `${ammo}/${maxAmmo}`}
                  </span>
                </div>
                {isReloading ? (
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyber-blue transition-all duration-100"
                      style={{ width: `${reloadProgress}%` }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-[8px] text-gray-600 font-mono">
                      {`${(1000 / ((stats.attackSpeed || 1) * currentWeapon.attackSpeedMultiplier * ((gameStateRef.current?.overclockActive ? 2 : 1)))).toFixed(0)}ms/shot`}
                    </div>
                    <button
                      onClick={() => startReload()}
                      disabled={ammo === maxAmmo}
                      className={`w-full h-8 rounded-lg border text-xs font-orbitron transition-all ${
                        ammo === maxAmmo
                          ? 'bg-gray-900 border-gray-700 text-gray-600 cursor-not-allowed'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      RELOAD (R)
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex-1" />

          <div className="space-y-3">
            <button 
              onClick={() => setPaused(!paused)}
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
            >
              {paused ? <Play fill="white" size={18} /> : <Pause fill="white" size={18} />}
              <span className="text-sm font-orbitron">{paused ? 'Resume' : 'Pause'}</span>
            </button>
            
            <button 
              onClick={() => setSpeedMultiplier(prev => prev === 1 ? 2 : 1)}
              className={`
                w-full h-12 rounded-xl border flex items-center justify-center gap-3 transition-all
                ${speedMultiplier > 1 ? 'bg-cyber-blue text-black border-cyber-blue' : 'bg-white/5 border-white/10 text-white'}
              `}
            >
              <FastForward size={18} />
              <span className="text-sm font-orbitron">{speedMultiplier}x Speed</span>
            </button>

            <button 
              onClick={() => onExit(false)}
              className="w-full h-12 rounded-xl bg-red-900/20 border border-red-500/50 text-red-500 flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all"
            >
              <XCircle size={18} />
              <span className="text-sm font-orbitron">Exit</span>
            </button>
          </div>
        </div>
      ) : (
        // Mobile Portrait: Bottom control tray
        <div 
          className="w-full bg-cyber-dark/95 border-t border-white/10 shrink-0 relative z-10"
          style={{ paddingBottom: `${safeAreaBottom}px` }}
        >
          {/* Abilities Row */}
          <div className="px-4 pt-3 pb-2 flex justify-center gap-3">
            {abilities.map(ability => renderAbilityButton(ability, 'mobile'))}
          </div>
          
          {/* Ammo display (Manual mode only) */}
          {aimMode === 'MANUAL' && (
            <div className="px-4 pb-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-[8px] text-gray-500 font-orbitron mb-0.5">{isHolding ? 'HOLDING' : 'AMMO'}</div>
                  <div className={`text-sm font-bold font-mono ${isReloading ? 'text-cyber-yellow animate-pulse' : isHolding ? 'text-cyber-blue animate-pulse' : 'text-white'}`}>
                    {isReloading ? 'RELOAD' : `${ammo}/${maxAmmo}`}
                  </div>
                </div>
                {isReloading && (
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden ml-2">
                    <div 
                      className="h-full bg-cyber-blue transition-all duration-100"
                      style={{ width: `${reloadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Control buttons row */}
          <div className="px-4 pb-3 flex justify-center gap-3">
            <button 
              onClick={() => setAimMode(prev => prev === 'AUTO' ? 'MANUAL' : 'AUTO')}
              className={`w-14 h-12 rounded-xl border flex items-center justify-center active:scale-95 transition-transform touch-manipulation ${
                aimMode === 'MANUAL' 
                  ? 'bg-cyber-blue text-black border-cyber-blue' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}
              title={aimMode === 'MANUAL' ? 'MANUAL AIM' : 'AUTO AIM'}
            >
              <Target size={20} />
            </button>

            <button 
              onClick={() => setPaused(!paused)}
              className="w-14 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-transform touch-manipulation"
            >
              {paused ? <Play fill="white" size={20} /> : <Pause fill="white" size={20} />}
            </button>
            
            <button 
              onClick={() => setSpeedMultiplier(prev => prev === 1 ? 2 : 1)}
              className={`
                w-14 h-12 rounded-xl border flex items-center justify-center active:scale-95 transition-transform touch-manipulation
                ${speedMultiplier > 1 ? 'bg-cyber-blue text-black border-cyber-blue' : 'bg-white/5 border-white/10 text-white'}
              `}
            >
              <FastForward size={20} />
            </button>

            <button 
              onClick={() => onExit(false)}
              className="w-14 h-12 rounded-xl bg-red-900/20 border border-red-500/50 text-red-500 flex items-center justify-center active:scale-95 transition-transform touch-manipulation"
            >
              <XCircle size={20} />
            </button>
          </div>

          {/* Swipe hint for touch devices */}
          {isTouchDevice && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[9px] text-gray-500 font-orbitron">
              <ChevronUp size={12} className="animate-bounce" />
              <span>SWIPE UP FOR ABILITY</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BattleScreen;
