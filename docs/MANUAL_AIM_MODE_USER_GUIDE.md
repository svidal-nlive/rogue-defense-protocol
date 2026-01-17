# Manual Aim Mode - User Experience Guide

## Desktop Layout

### Right HUD Panel - Targeting System

```
┌─────────────────────────────┐
│ TACTICAL                     │
│                              │
│ [Ability Buttons...]         │
│                              │
├─────────────────────────────┤
│ TARGETING SYSTEM             │
│ [MANUAL AIM] or [AUTO AIM]  │ ← Toggle button
│                              │
│ AMMO: 23/30                  │ ← When in manual mode
│ ████████░░░░░░░░░░░░         │
│ [RELOAD (R)]                 │ ← During reload or empty
│                              │
├─────────────────────────────┤
│ [PAUSE]                      │
│ [2x SPEED]                   │
│ [EXIT]                       │
└─────────────────────────────┘
```

## Mobile Layout

### Bottom Control Tray (Portrait)

```
┌────────────────────────────────────┐
│ [A] [B] [C]                        │ ← Ability buttons
├────────────────────────────────────┤
│ AMMO: 23/30 | ████░░ (reload bar) │ ← Shows when reloading
├────────────────────────────────────┤
│ [👁] [▶] [⏩] [⊗]                  │
│     ↑    ↑   ↑   ↑                 │
│  AIM  PAUSE 2x EXIT                │
└────────────────────────────────────┘

👁 = Target/Aim Mode Toggle (cyan when MANUAL)
```

## Canvas Display (In-Game)

### Crosshair (Manual Mode Only)

```
            ╭───────────────╮
            │               │
    ─────── │ ┌─────────┐ │ ───────
            │ │    📍   │ │
    ─────── │ └─────────┘ │ ───────
            │               │
            ╰───────────────╯

WHITE     = Standard crosshair
RED       = Enemy in range
CYAN      = Crosshair circle
```

### Aiming at Different Targets

**Empty Space (No Enemy):**
```
Crosshair stays CYAN
Turret rotates to angle
No red highlight
```

**Enemy in Range:**
```
Enemy circle turns RED
Crosshair stays CYAN
Ready to click to fire
```

**Multiple Enemies:**
```
Closest enemy highlighted RED
Other enemies show normal health bars
Click fires at crosshair location
```

## Gameplay Comparison

### AUTO MODE (Default - No Change)

```
Player sees:
  • Turret auto-aims at nearest enemy
  • Auto-fires constantly
  • No crosshair
  • "AUTO AIM" button visible

Input required per minute: ~5 clicks
```

### MANUAL MODE (New)

```
Player sees:
  • Crosshair follows pointer
  • Turret rotates to aim position
  • Enemies highlighted when in range
  • Ammo counter visible
  • "MANUAL AIM" button (highlighted)

Interaction flow:
  1. Move pointer
  2. See crosshair
  3. Position on target
  4. Click to fire
  5. Watch ammo count
  6. Press R to reload

Input required per minute: 30+ clicks/movements
```

## State Indicators

### Ammo States

| State | Display | Can Fire? |
|-------|---------|-----------|
| Full | 30/30 ✓ | Yes |
| Partial | 15/30 ✓ | Yes |
| Low | 1/30 ⚠ | Yes |
| Empty | 0/30 ✗ | No → Auto-reload |
| Reloading | 1.5s... | No |
| Reloaded | 30/30 ✓ | Yes |

### Visual Indicators

**Ammo Display Colors:**
- WHITE: Ammo available
- YELLOW + PULSE: Reloading in progress
- GRAY: Full ammo (reload button disabled)

**Reload Bar:**
- CYAN: Reload progress
- FULL: Ready to fire

## Player Actions in Manual Mode

| Action | Input | Effect |
|--------|-------|--------|
| Aim | Move Mouse/Touch | Crosshair follows |
| Fire | Click/Tap | Projectile fires, -1 ammo |
| Reload | Press R or Click "RELOAD" | 1.5s wait, full ammo |
| Toggle Mode | Click Button | Switch to AUTO |
| No Action | (Idle) | Crosshair stays, no firing |

## Ammo Behavior

### Firing
```
User clicks → Ammo depletes
  24 → 23 → 22 → ... → 1 → 0
```

### Reloading
```
User presses R (when 0 ammo)
  RELOADING → [▓▓▓░░░░░░] 
  1.5s passes
  READY → 30/30
```

### Auto-Reload (Safety)
```
User clicks with 0 ammo
  System auto-triggers reload
  Ammo resets to 30/30
  Next click fires
```

## Feedback Systems

### Visual Feedback
- ✓ Crosshair appears/disappears smoothly
- ✓ Enemies highlight in red when near cursor
- ✓ Screen shakes on firing
- ✓ Reload progress bar fills smoothly

### Auditory Feedback (Existing)
- Weapon fire sound
- Hit confirmation
- Shield activation sound
- Wave transition sound

### Haptic Feedback (Mobile)
- Could trigger vibration on fire
- Could trigger haptic on reload complete
- (Future enhancement)

## Edge Cases Handled

### What happens if...

**Player switches modes mid-battle?**
- ✓ Ammo state preserved
- ✓ Crosshair disappears when switching to AUTO
- ✓ Auto-fire resumes instantly

**Ammo is 0 and player clicks?**
- ✓ Auto-reload triggered
- ✓ After 1.5s, next click fires

**Window loses focus?**
- ✓ Crosshair disabled (isAiming = false)
- ✓ Pointer events ignored until refocus

**Screen resizes?**
- ✓ Crosshair updates to new canvas coordinates
- ✓ No visual glitches

**Multiple enemies at cursor position?**
- ✓ Closest enemy highlighted
- ✓ Projectile fires at cursor (may hit others too)
- ✓ Works with all weapon types

## Performance Notes

### What's Optimized
- Crosshair draws only in MANUAL mode
- Pointer events throttled via requestAnimationFrame
- Minimal DOM updates
- No layout thrashing

### What's Efficient
- Ammo state: single number
- Reload progress: simple percentage
- Crosshair: 4 lines + 1 circle

### No Performance Impact
- AUTO mode unchanged
- No garbage collection issues
- Smooth 60 FPS maintained

---

*This guide explains how players will experience and interact with Manual Aim Mode.*
