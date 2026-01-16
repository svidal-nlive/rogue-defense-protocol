# Copilot Instructions: Rogue Defense Protocol

## Project Overview
**Rogue Defense Protocol** is a cyberpunk-themed wave-based tower defense game built with React, TypeScript, and Vite. Players defend against procedurally-generated enemies by selecting weapons, upgrading skills, and managing loadouts through chip modifiers.

## Architecture

### Core Game State (GameContext)
- **Location**: [contexts/GameContext.tsx](contexts/GameContext.tsx)
- Single source of truth using React Context + useReducer pattern
- **Key Concepts**:
  - **Game Loop**: Battle state mutations (ENEMY_KILLED → rewards → ADVANCE_WAVE → END_BATTLE)
  - **Checkpoint System**: Players resume at wave 10, 20, 30 (calculated as `Math.floor(highestWave / 10) * 10`)
  - **Pending Rewards**: Accumulated during battle, applied to permanent stats only after COLLECT_REWARDS action
  - **Wave Scaling**: Gold multipliers and enemy counts scale via `getWaveConfig(wave)` in [utils/storage.ts](utils/storage.ts)

### Game State Structure
```typescript
GameState {
  stats: { gold, gems, level, defense }           // Permanent currency & progression
  battle: { currentWave, highestWave, waveCheckpoint, pendingRewards }
  skillNodes: SkillNode[]                         // Skill tree progression (6 upgrade tiers)
  chipState: { ownedChips, slots }                // Chip system for passive modifiers
  equippedWeapon: WeaponType                      // Active weapon (BLASTER, MISSILE, LASER, CRYO)
  shop: { ownedSkins, equippedWeaponSkin, ... }  // Cosmetics & owned items
}
```

### Screen Navigation
- **App.tsx**: Routes between screens, manages battle summary modal
- **Screens** (components/Screens/):
  - `HomeScreen` - Main menu, stats display
  - `BattleScreen` - Real-time tower defense gameplay
  - `GuardianScreen` - Player character/base customization
  - `SkillScreen` - Skill tree UI (6 upgradeable nodes, ~6-7 levels per node)
  - `ShopScreen` - Weapon/skin purchases with gold/gems
  - `BattleSummary` - Post-battle rewards modal

## Key Patterns

### State Mutations via Actions
All game logic flows through `gameReducer()` with standardized action types:
```typescript
dispatch({ type: 'ENEMY_KILLED', payload: { enemyType, isCrit, damage } })
dispatch({ type: 'ADVANCE_WAVE' })
dispatch({ type: 'END_BATTLE', payload: { won } })
dispatch({ type: 'COLLECT_REWARDS' })
```
**Important**: Rewards are held in `pendingRewards` until explicitly collected—enemies killed mid-battle don't credit gold until summary screen.

### Skill Modifiers & Multipliers
Skills apply multiplicative bonuses in combat:
- **u1 (Scavenger)**: Adds 10% gold per level → `goldEarned * (1 + scavengerLevel * 0.1)`
- Each skill in [constants/index.ts](constants/index.ts) defines cost, description, and scaling formula
- Applied at action dispatch time, not as stored multipliers

### Wave Configuration
```typescript
getWaveConfig(wave) → { enemiesRequired, goldMultiplier, waveBonus }
```
Called during START_BATTLE and ADVANCE_WAVE to scale difficulty and rewards. **Checkpoint restart uses the checkpoint wave's config**, not wave 1.

### Chip System
- **Location**: [constants/chips.ts](constants/chips.ts) (chip definitions), [types.ts](types.ts) (ChipState interface)
- Chips occupy **slots** with passive effects (e.g., +5% crit rate, +10% defense)
- Distinct from skills: skills are permanent upgrades, chips are loadout-based
- Supports upgrade costs via `calculateUpgradeCost(chipId, level)`

### Persistence
- **Location**: [utils/storage.ts](utils/storage.ts)
- Game state auto-saved to localStorage with version tracking (currently v6)
- `loadGameState()` migrates legacy saves; `saveGameState()` wraps with metadata
- Gracefully handles missing/corrupted data

## Styling Conventions

### Tailwind + Custom CSS
- **Color scheme**: Cyberpunk dark (`bg-cyber-black = #05050A`)
- **Font**: Rajdhani (body), Orbitron (headings)
- **Responsive**: Mobile-first; navigation switches from bottom nav (mobile) to sidebar (desktop) via `lg:flex-row`
- **Effects**: CRT scanlines + vignette overlays (visual elements from index.css, applied to all screens)

### Responsive Layout
- Mobile: Vertical flex with bottom navigation
- Desktop (lg breakpoint): Horizontal flex with left sidebar navigation
- Use `useResponsive` hook for programmatic breakpoint detection

## Development Workflow

### Setup
```bash
npm install
npm run dev          # Vite dev server on :3000
npm run build        # TypeScript + Vite production build → dist/
npm run preview      # Serve dist/ locally
```

### Build Configuration
- **Vite**: React Fast Refresh enabled, source maps disabled for production
- **Code Splitting**: Vendor (React/DOM), charts (Recharts), icons (Lucide) bundles
- **Host**: 0.0.0.0 (accessible from any interface, required for Docker)

### Type Safety
- TypeScript strict mode; all action types defined in [types.ts](types.ts)
- Enums for Screen, EnemyType, WeaponType, etc. prevent string-based errors
- GameAction discriminated union ensures type-safe reducer cases

## Critical Details

### Wave Checkpoint Logic
- Checkpoint = `Math.floor(wave / 10) * 10` — player died on wave 23? checkpoint = 20, next battle starts wave 20
- **NOT** the last completed wave; a player who reaches wave 30 (even if defeated) gets checkpoint 30
- Recalculated in END_BATTLE reducer, never reset except on RESET_STATE

### Gem Drop Rate
- Standard enemies: 5% drop chance, 1 gem
- Bosses: 50% drop chance, 10 gems
- Hardcoded in ENEMY_KILLED reducer; modify here to adjust economy

### Enemy Rewards
- Defined in [constants/enemies.ts](constants/enemies.ts): `ENEMY_REWARDS[EnemyType] = { gold, score }`
- Score contributes to high score tracking, not used for currency
- Gold scaled by wave multiplier AND skill modifiers (Scavenger)

### Defense Stat
- Stored in stats but **not yet wired to gameplay logic** — prepared for future damage reduction mechanic
- Initialize to 0; future skill implementations should read `stats.defense`

## Common Tasks

**Add a new skill node**: Define in [constants/index.ts](constants/index.ts), add to SKILL_TREE array, implement modifier logic in ENEMY_KILLED or other relevant reducer cases.

**Add weapon type**: Create entry in WEAPONS constant [types.ts](types.ts), add WeaponType enum, wire damage/speed multipliers to BattleScreen weapon system.

**Balance wave difficulty**: Adjust `getWaveConfig()` return values in [utils/storage.ts](utils/storage.ts); test via checkpoint system to avoid replaying early waves.

**Add shop item**: Define in [constants/shopItems.ts](constants/shopItems.ts), add dispatch logic to ShopScreen for purchases.

## Deployment Workflow

### Overview
The project uses GitHub Actions to build Docker images and deploy to a self-hosted server via Traefik reverse proxy.

### Quick Deploy
```bash
make deploy          # Full automated deployment (push → build → pull → redeploy)
```

### Deployment Flow
1. **Push to main** → Triggers GitHub Actions workflow (`.github/workflows/docker-build.yml`)
2. **Build** → Docker image built and pushed to `ghcr.io/svidal-nlive/rogue-defense-protocol:latest`
3. **Pull** → Server pulls the new image from GitHub Container Registry
4. **Redeploy** → Container restarted with new image, health check confirms success

### Key Files
- **[Makefile](Makefile)** - Deployment commands and container management
- **[scripts/deploy.sh](scripts/deploy.sh)** - Automated deployment script with status reporting
- **[docker-compose.yml](docker-compose.yml)** - Container configuration with Traefik labels
- **[.github/workflows/docker-build.yml](.github/workflows/docker-build.yml)** - GitHub Actions workflow

### Available Make Commands
| Command | Description |
|---------|-------------|
| `make deploy` | Full deployment (push → build → pull → redeploy) with auto-confirm |
| `make deploy-interactive` | Full deployment with manual confirmations |
| `make redeploy` | Pull latest image and restart (skip build) |
| `make status` | Show container and workflow status |
| `make logs` | Follow container logs |
| `make workflow` | List recent GitHub Actions runs |

### Production URL
- **Live**: https://rogue-defense.vectorhost.net

### Health Check
The container includes a health endpoint at `/health` that returns HTTP 200 when the app is ready.

### Troubleshooting Deployment
```bash
make status          # Check container and image status
make logs            # View container logs
make workflow-logs   # View GitHub Actions logs
make health          # Check health endpoint directly
```

## Code Navigation (Table of Contents)

### Overview
The project includes a Table of Contents generator that creates a condensed index of all functions, classes, interfaces, and types across the codebase. This makes it faster to locate code elements without reading entire files.

### Generated Files
- **[TABLE_OF_CONTENTS.md](TABLE_OF_CONTENTS.md)** - Human-readable index with links to line numbers
- **[TABLE_OF_CONTENTS.json](TABLE_OF_CONTENTS.json)** - Machine-readable JSON for programmatic access

### Usage
```bash
./generate-toc.sh    # Regenerate the table of contents
```

### When to Use
- **Finding components**: Search the TOC instead of reading entire files
- **Locating functions**: Use the flat index to find functions by name across all files
- **Understanding structure**: Get a quick overview of what's defined in each file
- **After major refactors**: Regenerate to keep the index up-to-date

### AI Assistant Workflow
1. **Check TOC first**: When looking for a specific function, class, or component, search `TABLE_OF_CONTENTS.md` or `TABLE_OF_CONTENTS.json`
2. **Get line numbers**: The TOC provides exact line numbers for each code element
3. **Read targeted sections**: Use the line numbers to read only the relevant portion of a file
4. **Regenerate after changes**: Run `./generate-toc.sh` after adding new functions or refactoring

### What's Indexed
- Export functions and const functions
- Classes and interfaces
- Type definitions
- Methods (including private/protected/public)

### Files Scanned
The generator scans all `.ts`, `.tsx`, `.js`, and `.jsx` files, excluding `node_modules`, `dist`, `.git`, and `public` directories.
