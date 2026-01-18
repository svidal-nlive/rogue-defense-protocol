// Audio System - Web Audio API Implementation
// Provides sound effects and music for the game

export enum AudioType {
  // Abilities
  PLASMA_BURST = 'plasma_burst',
  EMP_PULSE = 'emp_pulse',
  REPAIR_DRONE = 'repair_drone',
  LASER = 'laser',
  MISSILE = 'missile',
  
  // Combat
  ENEMY_HIT = 'enemy_hit',
  ENEMY_DEATH = 'enemy_death',
  BOSS_DEATH = 'boss_death',
  COLLISION = 'collision',
  
  // UI
  BUTTON_CLICK = 'button_click',
  UPGRADE_SUCCESS = 'upgrade_success',
  WAVE_START = 'wave_start',
  WAVE_COMPLETE = 'wave_complete',
  BATTLE_VICTORY = 'battle_victory',
  BATTLE_DEFEAT = 'battle_defeat',
  
  // Ambient
  AMBIENT_LOOP = 'ambient_loop',
  CRITICAL_HIT = 'critical_hit',
}

export interface AudioConfig {
  enabled: boolean;
  masterVolume: number; // 0-1
  sfxVolume: number;    // 0-1
  musicVolume: number;  // 0-1
}

// Audio context (created on first interaction)
let audioContext: AudioContext | null = null;

/**
 * Initialize Web Audio API context
 * Must be called after user interaction (click, tap, etc.)
 */
export function initAudioContext(): AudioContext {
  if (audioContext) return audioContext;
  
  const contextClass = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
  audioContext = new contextClass();
  
  // Resume context if suspended
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(e => console.warn('Audio context resume failed:', e));
  }
  
  return audioContext;
}

/**
 * Play a synthesized sound effect
 * Different sounds use different frequencies and envelopes
 */
export function playSound(audioType: AudioType, options: { volume?: number; enabled?: boolean } = {}): void {
  if (!audioContext) {
    initAudioContext();
  }
  
  if (!audioContext || options.enabled === false) return;
  
  const ctx = audioContext;
  const now = ctx.currentTime;
  const volume = options.volume ?? 0.5; // Use provided volume or default
  
  // Create gain node for volume control
  const gainNode = ctx.createGain();
  gainNode.gain.value = volume;
  gainNode.connect(ctx.destination);
  
  // Create oscillator for tone generation
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.connect(gainNode);
  
  // Play different sounds based on type
  switch (audioType) {
    case AudioType.PLASMA_BURST:
      // High frequency burst
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
      
    case AudioType.EMP_PULSE:
      // Descending buzz (multiple pulses)
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
      gainNode.gain.setValueAtTime(volume * 0.6, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
      
    case AudioType.REPAIR_DRONE:
      // Ascending tone (positive healing sound)
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
      
    case AudioType.LASER:
      // Quick ascending sweep
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
      
    case AudioType.MISSILE:
      // Whoosh with descending tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.25);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
      break;
      
    case AudioType.ENEMY_HIT:
      // Short punch sound
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
      break;
      
    case AudioType.ENEMY_DEATH:
      // Descending sweep (death)
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;
      
    case AudioType.BOSS_DEATH:
      // Epic descending sound
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.8);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
      break;
      
    case AudioType.COLLISION:
      // Metallic impact
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
      
    case AudioType.BUTTON_CLICK:
      // UI click (light beep)
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
      
    case AudioType.UPGRADE_SUCCESS:
      // Ascending chime (success)
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
      
    case AudioType.WAVE_START:
      // Alarm/alert sound
      osc.frequency.setValueAtTime(500, now);
      // Frequency oscillates for alarm effect
      for (let i = 0; i < 3; i++) {
        osc.frequency.setValueAtTime(500, now + i * 0.1);
        osc.frequency.setValueAtTime(600, now + i * 0.1 + 0.05);
      }
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
      
    case AudioType.WAVE_COMPLETE:
      // Success fanfare (ascending tones)
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(500, now + 0.15);
      osc.frequency.setValueAtTime(600, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
      break;
      
    case AudioType.BATTLE_VICTORY:
      // Victory theme (ascending major chord feel)
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(500, now + 0.2);
      osc.frequency.setValueAtTime(600, now + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
      
    case AudioType.BATTLE_DEFEAT:
      // Defeat theme (descending minor chord feel)
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(300, now + 0.2);
      osc.frequency.setValueAtTime(200, now + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
      
    case AudioType.CRITICAL_HIT:
      // Sharp bright tone for critical hits
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
      break;
      
    default:
      // Default beep
      osc.frequency.setValueAtTime(440, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
  }
}

/**
 * Play a burst of noise (for impact sounds)
 */
export function playNoise(duration: number = 0.1, config: AudioConfig = { enabled: true, masterVolume: 0.7, sfxVolume: 0.7, musicVolume: 0.7 }): void {
  if (!config.enabled || !audioContext) return;
  
  const ctx = audioContext;
  const now = ctx.currentTime;
  const volume = config.masterVolume * config.sfxVolume;
  
  // Create gain node
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume * 0.3, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
  gainNode.connect(ctx.destination);
  
  // Create white noise using buffer source
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(gainNode);
  
  source.start(now);
  source.stop(now + duration);
}

/**
 * Stop all audio (emergency stop)
 */
export function stopAllAudio(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

/**
 * Test audio system
 */
export function testAudio(): void {
  if (!audioContext) initAudioContext();
  
  // Play a sequence of sounds for testing
  playSound(AudioType.BUTTON_CLICK);
  setTimeout(() => playSound(AudioType.PLASMA_BURST), 200);
  setTimeout(() => playSound(AudioType.UPGRADE_SUCCESS), 400);
  setTimeout(() => playNoise(0.2), 600);
}

// Default audio config
export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  enabled: true,
  masterVolume: 0.6,
  sfxVolume: 0.7,
  musicVolume: 0.5,
};
