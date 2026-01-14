# Project Table of Contents

*Generated on 2026-01-14 17:21:40*

This document provides a quick reference guide to all files, functions, classes, interfaces, and types in the project. Use the line numbers to quickly navigate to specific code sections when working with AI coding assistants.

---

## Quick Navigation

- [App.tsx](#app.tsx)
- [components/Layout/BottomNav.tsx](#components-layout-bottomnav.tsx)
- [components/Layout/Header.tsx](#components-layout-header.tsx)
- [components/Layout/Navigation.tsx](#components-layout-navigation.tsx)
- [components/Screens/BattleScreen.tsx](#components-screens-battlescreen.tsx)
- [components/Screens/BattleSummary.tsx](#components-screens-battlesummary.tsx)
- [components/Screens/GuardianScreen.tsx](#components-screens-guardianscreen.tsx)
- [components/Screens/HomeScreen.tsx](#components-screens-homescreen.tsx)
- [components/Screens/ShopScreen.tsx](#components-screens-shopscreen.tsx)
- [components/Screens/SkillScreen.tsx](#components-screens-skillscreen.tsx)
- [constants/chips.ts](#constants-chips.ts)
- [constants/enemies.ts](#constants-enemies.ts)
- [constants/shopItems.ts](#constants-shopitems.ts)
- [contexts/GameContext.tsx](#contexts-gamecontext.tsx)
- [hooks/useResponsive.ts](#hooks-useresponsive.ts)
- [server.js](#server.js)
- [types.ts](#types.ts)
- [utils/storage.ts](#utils-storage.ts)

---

## App.tsx

### Functions

- **navigateTo** (const function) - [Line 18](App.tsx#18)
- **handleBattleExit** (const function) - [Line 22](App.tsx#22)
- **handleSummaryClose** (const function) - [Line 30](App.tsx#30)
- **handleSummaryRetry** (const function) - [Line 35](App.tsx#35)
- **renderScreen** (const function) - [Line 40](App.tsx#40)

### Methods

- **setCurrentScreen** (method) - [Line 19](App.tsx#19)
- **setShowBattleSummary** (method) - [Line 24](App.tsx#24)
- **setCurrentScreen** (method) - [Line 26](App.tsx#26)
- **setShowBattleSummary** (method) - [Line 31](App.tsx#31)
- **setCurrentScreen** (method) - [Line 32](App.tsx#32)
- **setShowBattleSummary** (method) - [Line 36](App.tsx#36)
- **setCurrentScreen** (method) - [Line 37](App.tsx#37)
- **return** (method) - [Line 57](App.tsx#57)
- **return** (method) - [Line 90](App.tsx#90)

## components/Layout/BottomNav.tsx

### Interfaces

- **BottomNavProps** (interface) - [Line 5](components/Layout/BottomNav.tsx#5)

### Methods

- **return** (method) - [Line 19](components/Layout/BottomNav.tsx#19)
- **return** (method) - [Line 41](components/Layout/BottomNav.tsx#41)
- **return** (method) - [Line 66](components/Layout/BottomNav.tsx#66)

## components/Layout/Header.tsx

### Functions

- **ResourceItem** (const function) - [Line 52](components/Layout/Header.tsx#52)

### Methods

- **return** (method) - [Line 10](components/Layout/Header.tsx#10)

## components/Layout/Navigation.tsx

### Interfaces

- **NavigationProps** (interface) - [Line 5](components/Layout/Navigation.tsx#5)

### Methods

- **return** (method) - [Line 18](components/Layout/Navigation.tsx#18)
- **return** (method) - [Line 37](components/Layout/Navigation.tsx#37)

## components/Screens/BattleScreen.tsx

### Interfaces

- **BattleScreenProps** (interface) - [Line 17](components/Screens/BattleScreen.tsx#17)
- **Ability** (interface) - [Line 22](components/Screens/BattleScreen.tsx#22)

### Functions

- **handleKeyDown** (const function) - [Line 325](components/Screens/BattleScreen.tsx#325)
- **loop** (const function) - [Line 368](components/Screens/BattleScreen.tsx#368)
- **attackSpeedMultiplier** (const function) - [Line 404](components/Screens/BattleScreen.tsx#404)
- **dx** (const function) - [Line 423](components/Screens/BattleScreen.tsx#423)
- **dy** (const function) - [Line 424](components/Screens/BattleScreen.tsx#424)
- **parallaxOffset** (const function) - [Line 724](components/Screens/BattleScreen.tsx#724)
- **x** (const function) - [Line 725](components/Screens/BattleScreen.tsx#725)
- **a** (const function) - [Line 808](components/Screens/BattleScreen.tsx#808)
- **midR** (const function) - [Line 834](components/Screens/BattleScreen.tsx#834)
- **jitter** (const function) - [Line 835](components/Screens/BattleScreen.tsx#835)
- **fireAngle** (const function) - [Line 848](components/Screens/BattleScreen.tsx#848)
- **iceAngle** (const function) - [Line 862](components/Screens/BattleScreen.tsx#862)
- **voidAngle** (const function) - [Line 876](components/Screens/BattleScreen.tsx#876)
- **hue** (const function) - [Line 887](components/Screens/BattleScreen.tsx#887)
- **rainbowAngle** (const function) - [Line 888](components/Screens/BattleScreen.tsx#888)
- **a** (const function) - [Line 908](components/Screens/BattleScreen.tsx#908)
- **alpha** (const function) - [Line 985](components/Screens/BattleScreen.tsx#985)
- **jitterX** (const function) - [Line 1041](components/Screens/BattleScreen.tsx#1041)
- **jitterY** (const function) - [Line 1042](components/Screens/BattleScreen.tsx#1042)
- **hue** (const function) - [Line 1075](components/Screens/BattleScreen.tsx#1075)
- **angle** (const function) - [Line 1306](components/Screens/BattleScreen.tsx#1306)
- **angle** (const function) - [Line 1322](components/Screens/BattleScreen.tsx#1322)
- **angle** (const function) - [Line 1355](components/Screens/BattleScreen.tsx#1355)
- **angle** (const function) - [Line 1368](components/Screens/BattleScreen.tsx#1368)
- **angle** (const function) - [Line 1514](components/Screens/BattleScreen.tsx#1514)
- **yOffset** (const function) - [Line 1651](components/Screens/BattleScreen.tsx#1651)
- **handleResize** (const function) - [Line 1709](components/Screens/BattleScreen.tsx#1709)
- **resetGame** (const function) - [Line 1766](components/Screens/BattleScreen.tsx#1766)
- **renderAbilityButton** (const function) - [Line 1779](components/Screens/BattleScreen.tsx#1779)

### Methods

- **useEffect** (method) - [Line 144](components/Screens/BattleScreen.tsx#144)
- **startBattle** (method) - [Line 146](components/Screens/BattleScreen.tsx#146)
- **setBattleStarted** (method) - [Line 147](components/Screens/BattleScreen.tsx#147)
- **useEffect** (method) - [Line 152](components/Screens/BattleScreen.tsx#152)
- **useEffect** (method) - [Line 157](components/Screens/BattleScreen.tsx#157)
- **useEffect** (method) - [Line 162](components/Screens/BattleScreen.tsx#162)
- **advanceWave** (method) - [Line 164](components/Screens/BattleScreen.tsx#164)
- **useEffect** (method) - [Line 171](components/Screens/BattleScreen.tsx#171)
- **setAbilities** (method) - [Line 176](components/Screens/BattleScreen.tsx#176)
- **return** (method) - [Line 191](components/Screens/BattleScreen.tsx#191)
- **setScreenShake** (method) - [Line 250](components/Screens/BattleScreen.tsx#250)
- **setTimeout** (method) - [Line 251](components/Screens/BattleScreen.tsx#251)
- **triggerScreenShake** (method) - [Line 265](components/Screens/BattleScreen.tsx#265)
- **setAbilities** (method) - [Line 273](components/Screens/BattleScreen.tsx#273)
- **createExplosion** (method) - [Line 291](components/Screens/BattleScreen.tsx#291)
- **createDamageNumber** (method) - [Line 292](components/Screens/BattleScreen.tsx#292)
- **useEffect** (method) - [Line 324](components/Screens/BattleScreen.tsx#324)
- **activateAbility** (method) - [Line 330](components/Screens/BattleScreen.tsx#330)
- **activateAbility** (method) - [Line 333](components/Screens/BattleScreen.tsx#333)
- **activateAbility** (method) - [Line 336](components/Screens/BattleScreen.tsx#336)
- **return** (method) - [Line 342](components/Screens/BattleScreen.tsx#342)
- **useEffect** (method) - [Line 346](components/Screens/BattleScreen.tsx#346)
- **setHp** (method) - [Line 363](components/Screens/BattleScreen.tsx#363)
- **setGameOver** (method) - [Line 364](components/Screens/BattleScreen.tsx#364)
- **spawnEnemy** (method) - [Line 397](components/Screens/BattleScreen.tsx#397)
- **setHp** (method) - [Line 496](components/Screens/BattleScreen.tsx#496)
- **createExplosion** (method) - [Line 498](components/Screens/BattleScreen.tsx#498)
- **createDamageNumber** (method) - [Line 558](components/Screens/BattleScreen.tsx#558)
- **createExplosion** (method) - [Line 559](components/Screens/BattleScreen.tsx#559)
- **createExplosion** (method) - [Line 566](components/Screens/BattleScreen.tsx#566)
- **createDamageNumber** (method) - [Line 592](components/Screens/BattleScreen.tsx#592)
- **createExplosion** (method) - [Line 593](components/Screens/BattleScreen.tsx#593)
- **createExplosion** (method) - [Line 596](components/Screens/BattleScreen.tsx#596)
- **killEnemy** (method) - [Line 597](components/Screens/BattleScreen.tsx#597)
- **createExplosion** (method) - [Line 616](components/Screens/BattleScreen.tsx#616)
- **killEnemy** (method) - [Line 617](components/Screens/BattleScreen.tsx#617)
- **setGameOver** (method) - [Line 659](components/Screens/BattleScreen.tsx#659)
- **setTimeout** (method) - [Line 661](components/Screens/BattleScreen.tsx#661)
- **onExit** (method) - [Line 662](components/Screens/BattleScreen.tsx#662)
- **handleResize** (method) - [Line 1718](components/Screens/BattleScreen.tsx#1718)
- **return** (method) - [Line 1721](components/Screens/BattleScreen.tsx#1721)
- **cancelAnimationFrame** (method) - [Line 1723](components/Screens/BattleScreen.tsx#1723)
- **setTargetedEnemy** (method) - [Line 1740](components/Screens/BattleScreen.tsx#1740)
- **setTargetedEnemy** (method) - [Line 1746](components/Screens/BattleScreen.tsx#1746)
- **activateAbility** (method) - [Line 1757](components/Screens/BattleScreen.tsx#1757)
- **useTapGesture** (method) - [Line 1763](components/Screens/BattleScreen.tsx#1763)
- **useSwipeGesture** (method) - [Line 1764](components/Screens/BattleScreen.tsx#1764)
- **setHp** (method) - [Line 1767](components/Screens/BattleScreen.tsx#1767)
- **setGameOver** (method) - [Line 1768](components/Screens/BattleScreen.tsx#1768)
- **setPaused** (method) - [Line 1769](components/Screens/BattleScreen.tsx#1769)
- **startBattle** (method) - [Line 1770](components/Screens/BattleScreen.tsx#1770)
- **setTargetedEnemy** (method) - [Line 1771](components/Screens/BattleScreen.tsx#1771)
- **return** (method) - [Line 1785](components/Screens/BattleScreen.tsx#1785)
- **return** (method) - [Line 1817](components/Screens/BattleScreen.tsx#1817)
- **return** (method) - [Line 1846](components/Screens/BattleScreen.tsx#1846)

## components/Screens/BattleSummary.tsx

### Interfaces

- **BattleSummaryProps** (interface) - [Line 6](components/Screens/BattleSummary.tsx#6)

### Functions

- **handleCollect** (const function) - [Line 43](components/Screens/BattleSummary.tsx#43)
- **handleRetry** (const function) - [Line 51](components/Screens/BattleSummary.tsx#51)
- **handleGoHome** (const function) - [Line 56](components/Screens/BattleSummary.tsx#56)
- **StatCard** (const function) - [Line 214](components/Screens/BattleSummary.tsx#214)
- **DetailRow** (const function) - [Line 228](components/Screens/BattleSummary.tsx#228)

### Methods

- **useEffect** (method) - [Line 20](components/Screens/BattleSummary.tsx#20)
- **setAnimatedGold** (method) - [Line 31](components/Screens/BattleSummary.tsx#31)
- **setAnimatedGems** (method) - [Line 32](components/Screens/BattleSummary.tsx#32)
- **setAnimatedScore** (method) - [Line 33](components/Screens/BattleSummary.tsx#33)
- **clearInterval** (method) - [Line 36](components/Screens/BattleSummary.tsx#36)
- **return** (method) - [Line 40](components/Screens/BattleSummary.tsx#40)
- **collectRewards** (method) - [Line 45](components/Screens/BattleSummary.tsx#45)
- **endBattle** (method) - [Line 46](components/Screens/BattleSummary.tsx#46)
- **setCollected** (method) - [Line 47](components/Screens/BattleSummary.tsx#47)
- **handleCollect** (method) - [Line 52](components/Screens/BattleSummary.tsx#52)
- **setTimeout** (method) - [Line 53](components/Screens/BattleSummary.tsx#53)
- **handleCollect** (method) - [Line 57](components/Screens/BattleSummary.tsx#57)
- **setTimeout** (method) - [Line 58](components/Screens/BattleSummary.tsx#58)
- **return** (method) - [Line 69](components/Screens/BattleSummary.tsx#69)

## components/Screens/GuardianScreen.tsx

### Functions

- **handleEquipChip** (const function) - [Line 73](components/Screens/GuardianScreen.tsx#73)
- **handleUnequipChip** (const function) - [Line 77](components/Screens/GuardianScreen.tsx#77)
- **handleUpgradeChip** (const function) - [Line 81](components/Screens/GuardianScreen.tsx#81)
- **getChipInSlot** (const function) - [Line 86](components/Screens/GuardianScreen.tsx#86)
- **StatCard** (const function) - [Line 522](components/Screens/GuardianScreen.tsx#522)
- **BonusTag** (const function) - [Line 532](components/Screens/GuardianScreen.tsx#532)
- **ChipIcon** (const function) - [Line 550](components/Screens/GuardianScreen.tsx#550)
- **WeaponIcon** (const function) - [Line 560](components/Screens/GuardianScreen.tsx#560)

### Methods

- **dispatch** (method) - [Line 74](components/Screens/GuardianScreen.tsx#74)
- **dispatch** (method) - [Line 78](components/Screens/GuardianScreen.tsx#78)
- **dispatch** (method) - [Line 82](components/Screens/GuardianScreen.tsx#82)
- **return** (method) - [Line 92](components/Screens/GuardianScreen.tsx#92)
- **return** (method) - [Line 201](components/Screens/GuardianScreen.tsx#201)
- **dispatch** (method) - [Line 206](components/Screens/GuardianScreen.tsx#206)
- **dispatch** (method) - [Line 208](components/Screens/GuardianScreen.tsx#208)
- **return** (method) - [Line 252](components/Screens/GuardianScreen.tsx#252)
- **dispatch** (method) - [Line 257](components/Screens/GuardianScreen.tsx#257)
- **dispatch** (method) - [Line 259](components/Screens/GuardianScreen.tsx#259)
- **return** (method) - [Line 335](components/Screens/GuardianScreen.tsx#335)
- **return** (method) - [Line 379](components/Screens/GuardianScreen.tsx#379)
- **return** (method) - [Line 437](components/Screens/GuardianScreen.tsx#437)
- **return** (method) - [Line 468](components/Screens/GuardianScreen.tsx#468)
- **return** (method) - [Line 478](components/Screens/GuardianScreen.tsx#478)
- **Upgrade** (method) - [Line 500](components/Screens/GuardianScreen.tsx#500)
- **return** (method) - [Line 543](components/Screens/GuardianScreen.tsx#543)

## components/Screens/HomeScreen.tsx

### Interfaces

- **HomeScreenProps** (interface) - [Line 5](components/Screens/HomeScreen.tsx#5)

### Functions

- **IntelItem** (const function) - [Line 134](components/Screens/HomeScreen.tsx#134)
- **StatBrief** (const function) - [Line 141](components/Screens/HomeScreen.tsx#141)
- **OperationCard** (const function) - [Line 148](components/Screens/HomeScreen.tsx#148)

### Methods

- **return** (method) - [Line 10](components/Screens/HomeScreen.tsx#10)

## components/Screens/ShopScreen.tsx

### Functions

- **getOwnedBoostCount** (const function) - [Line 18](components/Screens/ShopScreen.tsx#18)
- **isOwned** (const function) - [Line 23](components/Screens/ShopScreen.tsx#23)
- **isEquippedWeapon** (const function) - [Line 24](components/Screens/ShopScreen.tsx#24)
- **isEquippedBase** (const function) - [Line 25](components/Screens/ShopScreen.tsx#25)
- **canAfford** (const function) - [Line 27](components/Screens/ShopScreen.tsx#27)
- **handlePurchase** (const function) - [Line 32](components/Screens/ShopScreen.tsx#32)
- **handleEquip** (const function) - [Line 47](components/Screens/ShopScreen.tsx#47)
- **handleActivateBoost** (const function) - [Line 58](components/Screens/ShopScreen.tsx#58)
- **isBoostActive** (const function) - [Line 64](components/Screens/ShopScreen.tsx#64)
- **renderItemCard** (const function) - [Line 86](components/Screens/ShopScreen.tsx#86)
- **renderDetailPanel** (const function) - [Line 196](components/Screens/ShopScreen.tsx#196)

### Methods

- **dispatch** (method) - [Line 36](components/Screens/ShopScreen.tsx#36)
- **dispatch** (method) - [Line 39](components/Screens/ShopScreen.tsx#39)
- **setPurchaseAnimation** (method) - [Line 42](components/Screens/ShopScreen.tsx#42)
- **setTimeout** (method) - [Line 43](components/Screens/ShopScreen.tsx#43)
- **dispatch** (method) - [Line 51](components/Screens/ShopScreen.tsx#51)
- **dispatch** (method) - [Line 53](components/Screens/ShopScreen.tsx#53)
- **dispatch** (method) - [Line 61](components/Screens/ShopScreen.tsx#61)
- **return** (method) - [Line 100](components/Screens/ShopScreen.tsx#100)
- **return** (method) - [Line 211](components/Screens/ShopScreen.tsx#211)
- **return** (method) - [Line 420](components/Screens/ShopScreen.tsx#420)

## components/Screens/SkillScreen.tsx

### Functions

- **getIcon** (const function) - [Line 17](components/Screens/SkillScreen.tsx#17)
- **getPosition** (const function) - [Line 41](components/Screens/SkillScreen.tsx#41)
- **left** (const function) - [Line 44](components/Screens/SkillScreen.tsx#44)

### Methods

- **return** (method) - [Line 50](components/Screens/SkillScreen.tsx#50)
- **return** (method) - [Line 90](components/Screens/SkillScreen.tsx#90)
- **return** (method) - [Line 110](components/Screens/SkillScreen.tsx#110)
- **return** (method) - [Line 190](components/Screens/SkillScreen.tsx#190)
- **upgradeSkill** (method) - [Line 215](components/Screens/SkillScreen.tsx#215)

## constants/chips.ts

### Functions

- **getChipById** (const function) - [Line 206](constants/chips.ts#206)
- **calculateChipBonus** (const function) - [Line 214](constants/chips.ts#214)
- **calculateUpgradeCost** (const function) - [Line 257](constants/chips.ts#257)
- **calculateTotalChipBonuses** (const function) - [Line 264](constants/chips.ts#264)
- **getChipRarityColor** (const function) - [Line 302](constants/chips.ts#302)
- **getChipRarityBorder** (const function) - [Line 314](constants/chips.ts#314)

## constants/enemies.ts

### Interfaces

- **EnemyDefinition** (interface) - [Line 11](constants/enemies.ts#11)

### Functions

- **getEnemyHp** (const function) - [Line 109](constants/enemies.ts#109)
- **getCollisionDamage** (const function) - [Line 121](constants/enemies.ts#121)
- **getEnemySpeed** (const function) - [Line 139](constants/enemies.ts#139)
- **getSpawnInterval** (const function) - [Line 153](constants/enemies.ts#153)
- **getEnemiesRequired** (const function) - [Line 166](constants/enemies.ts#166)
- **selectEnemyType** (const function) - [Line 174](constants/enemies.ts#174)
- **getEnemyDefinition** (const function) - [Line 200](constants/enemies.ts#200)

## constants/shopItems.ts

### Functions

- **getAllShopItems** (const function) - [Line 374](constants/shopItems.ts#374)
- **findShopItem** (const function) - [Line 381](constants/shopItems.ts#381)
- **getRarityColor** (const function) - [Line 390](constants/shopItems.ts#390)
- **getRarityBorder** (const function) - [Line 399](constants/shopItems.ts#399)

### Methods

- **return** (method) - [Line 382](constants/shopItems.ts#382)

## contexts/GameContext.tsx

### Interfaces

- **GameContextType** (interface) - [Line 612](contexts/GameContext.tsx#612)
- **GameProviderProps** (interface) - [Line 634](contexts/GameContext.tsx#634)

### Functions

- **gameReducer** (const function) - [Line 19](contexts/GameContext.tsx#19)
- **useGame** (const function) - [Line 733](contexts/GameContext.tsx#733)

### Methods

- **useEffect** (method) - [Line 646](contexts/GameContext.tsx#646)
- **saveGameState** (method) - [Line 648](contexts/GameContext.tsx#648)
- **return** (method) - [Line 651](contexts/GameContext.tsx#651)
- **dispatch** (method) - [Line 656](contexts/GameContext.tsx#656)
- **dispatch** (method) - [Line 660](contexts/GameContext.tsx#660)
- **dispatch** (method) - [Line 664](contexts/GameContext.tsx#664)
- **dispatch** (method) - [Line 668](contexts/GameContext.tsx#668)
- **dispatch** (method) - [Line 672](contexts/GameContext.tsx#672)
- **dispatch** (method) - [Line 683](contexts/GameContext.tsx#683)
- **dispatch** (method) - [Line 693](contexts/GameContext.tsx#693)
- **dispatch** (method) - [Line 699](contexts/GameContext.tsx#699)
- **dispatch** (method) - [Line 704](contexts/GameContext.tsx#704)
- **return** (method) - [Line 722](contexts/GameContext.tsx#722)

## hooks/useResponsive.ts

### Interfaces

- **ResponsiveState** (interface) - [Line 3](hooks/useResponsive.ts#3)
- **SwipeGesture** (interface) - [Line 160](hooks/useResponsive.ts#160)
- **TapEvent** (interface) - [Line 225](hooks/useResponsive.ts#225)

### Functions

- **getCSSVar** (const function) - [Line 36](hooks/useResponsive.ts#36)
- **useResponsive** (const function) - [Line 43](hooks/useResponsive.ts#43)
- **getInitialState** (function) - [Line 46](hooks/useResponsive.ts#46)
- **useSwipeGesture** (const function) - [Line 169](hooks/useResponsive.ts#169)
- **handleTouchStart** (const function) - [Line 181](hooks/useResponsive.ts#181)
- **handleTouchEnd** (const function) - [Line 186](hooks/useResponsive.ts#186)
- **useTapGesture** (const function) - [Line 232](hooks/useResponsive.ts#232)
- **handleTouchStart** (const function) - [Line 245](hooks/useResponsive.ts#245)
- **handleTouchEnd** (const function) - [Line 251](hooks/useResponsive.ts#251)

### Methods

- **setState** (method) - [Line 134](hooks/useResponsive.ts#134)
- **useEffect** (method) - [Line 137](hooks/useResponsive.ts#137)
- **setTimeout** (method) - [Line 144](hooks/useResponsive.ts#144)
- **updateState** (method) - [Line 148](hooks/useResponsive.ts#148)
- **return** (method) - [Line 150](hooks/useResponsive.ts#150)
- **useEffect** (method) - [Line 174](hooks/useResponsive.ts#174)
- **onSwipe** (method) - [Line 204](hooks/useResponsive.ts#204)
- **return** (method) - [Line 217](hooks/useResponsive.ts#217)
- **useEffect** (method) - [Line 237](hooks/useResponsive.ts#237)
- **onTap** (method) - [Line 261](hooks/useResponsive.ts#261)
- **return** (method) - [Line 273](hooks/useResponsive.ts#273)

## server.js

### Methods

- **next** (method) - [Line 21](server.js#21)

## types.ts

### Interfaces

- **WeaponDefinition** (interface) - [Line 27](types.ts#27)
- **Enemy** (interface) - [Line 104](types.ts#104)
- **Projectile** (interface) - [Line 124](types.ts#124)
- **PlayerStats** (interface) - [Line 146](types.ts#146)
- **Skill** (interface) - [Line 159](types.ts#159)
- **SkillNode** (interface) - [Line 173](types.ts#173)
- **ChipBonus** (interface) - [Line 194](types.ts#194)
- **Chip** (interface) - [Line 207](types.ts#207)
- **OwnedChip** (interface) - [Line 224](types.ts#224)
- **ChipState** (interface) - [Line 232](types.ts#232)
- **BattleRewards** (interface) - [Line 242](types.ts#242)
- **BattleState** (interface) - [Line 252](types.ts#252)
- **GameState** (interface) - [Line 263](types.ts#263)
- **ShopItem** (interface) - [Line 334](types.ts#334)
- **WeaponSkin** (interface) - [Line 345](types.ts#345)
- **BaseSkin** (interface) - [Line 355](types.ts#355)
- **BoostItem** (interface) - [Line 365](types.ts#365)
- **ActiveBoost** (interface) - [Line 384](types.ts#384)
- **ShopState** (interface) - [Line 391](types.ts#391)

### Types

- **SkillCategory** (type) - [Line 171](types.ts#171)
- **ChipType** (type) - [Line 191](types.ts#191)
- **ChipRarity** (type) - [Line 192](types.ts#192)
- **GameAction** (type) - [Line 296](types.ts#296)
- **ShopCategory** (type) - [Line 331](types.ts#331)
- **CurrencyType** (type) - [Line 332](types.ts#332)
- **BoostEffect** (type) - [Line 373](types.ts#373)

## utils/storage.ts

### Interfaces

- **StorageWrapper** (interface) - [Line 8](utils/storage.ts#8)

### Functions

- **createInitialShopState** (const function) - [Line 16](utils/storage.ts#16)
- **createInitialChipState** (const function) - [Line 27](utils/storage.ts#27)
- **createInitialGameState** (const function) - [Line 35](utils/storage.ts#35)
- **saveGameState** (const function) - [Line 72](utils/storage.ts#72)
- **loadGameState** (const function) - [Line 92](utils/storage.ts#92)
- **clearGameState** (const function) - [Line 115](utils/storage.ts#115)
- **hasSaveFile** (const function) - [Line 126](utils/storage.ts#126)
- **formatNumber** (const function) - [Line 137](utils/storage.ts#137)
- **getWaveConfig** (const function) - [Line 151](utils/storage.ts#151)

### Methods

- **return** (method) - [Line 139](utils/storage.ts#139)
- **return** (method) - [Line 142](utils/storage.ts#142)

---

## Flat Index (All Items by Type)

### Interfaces

- **Ability** - [components/Screens/BattleScreen.tsx:22](components/Screens/BattleScreen.tsx#L22)
- **ActiveBoost** - [types.ts:384](types.ts#L384)
- **BaseSkin** - [types.ts:355](types.ts#L355)
- **BattleRewards** - [types.ts:242](types.ts#L242)
- **BattleScreenProps** - [components/Screens/BattleScreen.tsx:17](components/Screens/BattleScreen.tsx#L17)
- **BattleState** - [types.ts:252](types.ts#L252)
- **BattleSummaryProps** - [components/Screens/BattleSummary.tsx:6](components/Screens/BattleSummary.tsx#L6)
- **BoostItem** - [types.ts:365](types.ts#L365)
- **BottomNavProps** - [components/Layout/BottomNav.tsx:5](components/Layout/BottomNav.tsx#L5)
- **Chip** - [types.ts:207](types.ts#L207)
- **ChipBonus** - [types.ts:194](types.ts#L194)
- **ChipState** - [types.ts:232](types.ts#L232)
- **Enemy** - [types.ts:104](types.ts#L104)
- **EnemyDefinition** - [constants/enemies.ts:11](constants/enemies.ts#L11)
- **GameContextType** - [contexts/GameContext.tsx:612](contexts/GameContext.tsx#L612)
- **GameProviderProps** - [contexts/GameContext.tsx:634](contexts/GameContext.tsx#L634)
- **GameState** - [types.ts:263](types.ts#L263)
- **HomeScreenProps** - [components/Screens/HomeScreen.tsx:5](components/Screens/HomeScreen.tsx#L5)
- **NavigationProps** - [components/Layout/Navigation.tsx:5](components/Layout/Navigation.tsx#L5)
- **OwnedChip** - [types.ts:224](types.ts#L224)
- **PlayerStats** - [types.ts:146](types.ts#L146)
- **Projectile** - [types.ts:124](types.ts#L124)
- **ResponsiveState** - [hooks/useResponsive.ts:3](hooks/useResponsive.ts#L3)
- **ShopItem** - [types.ts:334](types.ts#L334)
- **ShopState** - [types.ts:391](types.ts#L391)
- **Skill** - [types.ts:159](types.ts#L159)
- **SkillNode** - [types.ts:173](types.ts#L173)
- **StorageWrapper** - [utils/storage.ts:8](utils/storage.ts#L8)
- **SwipeGesture** - [hooks/useResponsive.ts:160](hooks/useResponsive.ts#L160)
- **TapEvent** - [hooks/useResponsive.ts:225](hooks/useResponsive.ts#L225)
- **WeaponDefinition** - [types.ts:27](types.ts#L27)
- **WeaponSkin** - [types.ts:345](types.ts#L345)

### Types

- **BoostEffect** - [types.ts:373](types.ts#L373)
- **ChipRarity** - [types.ts:192](types.ts#L192)
- **ChipType** - [types.ts:191](types.ts#L191)
- **CurrencyType** - [types.ts:332](types.ts#L332)
- **GameAction** - [types.ts:296](types.ts#L296)
- **ShopCategory** - [types.ts:331](types.ts#L331)
- **SkillCategory** - [types.ts:171](types.ts#L171)

### Functions

- **BonusTag** - [components/Screens/GuardianScreen.tsx:532](components/Screens/GuardianScreen.tsx#L532)
- **ChipIcon** - [components/Screens/GuardianScreen.tsx:550](components/Screens/GuardianScreen.tsx#L550)
- **DetailRow** - [components/Screens/BattleSummary.tsx:228](components/Screens/BattleSummary.tsx#L228)
- **IntelItem** - [components/Screens/HomeScreen.tsx:134](components/Screens/HomeScreen.tsx#L134)
- **OperationCard** - [components/Screens/HomeScreen.tsx:148](components/Screens/HomeScreen.tsx#L148)
- **ResourceItem** - [components/Layout/Header.tsx:52](components/Layout/Header.tsx#L52)
- **StatBrief** - [components/Screens/HomeScreen.tsx:141](components/Screens/HomeScreen.tsx#L141)
- **StatCard** - [components/Screens/GuardianScreen.tsx:522](components/Screens/GuardianScreen.tsx#L522)
- **StatCard** - [components/Screens/BattleSummary.tsx:214](components/Screens/BattleSummary.tsx#L214)
- **WeaponIcon** - [components/Screens/GuardianScreen.tsx:560](components/Screens/GuardianScreen.tsx#L560)
- **a** - [components/Screens/BattleScreen.tsx:808](components/Screens/BattleScreen.tsx#L808)
- **a** - [components/Screens/BattleScreen.tsx:908](components/Screens/BattleScreen.tsx#L908)
- **alpha** - [components/Screens/BattleScreen.tsx:985](components/Screens/BattleScreen.tsx#L985)
- **angle** - [components/Screens/BattleScreen.tsx:1306](components/Screens/BattleScreen.tsx#L1306)
- **angle** - [components/Screens/BattleScreen.tsx:1322](components/Screens/BattleScreen.tsx#L1322)
- **angle** - [components/Screens/BattleScreen.tsx:1355](components/Screens/BattleScreen.tsx#L1355)
- **angle** - [components/Screens/BattleScreen.tsx:1368](components/Screens/BattleScreen.tsx#L1368)
- **angle** - [components/Screens/BattleScreen.tsx:1514](components/Screens/BattleScreen.tsx#L1514)
- **attackSpeedMultiplier** - [components/Screens/BattleScreen.tsx:404](components/Screens/BattleScreen.tsx#L404)
- **calculateChipBonus** - [constants/chips.ts:214](constants/chips.ts#L214)
- **calculateTotalChipBonuses** - [constants/chips.ts:264](constants/chips.ts#L264)
- **calculateUpgradeCost** - [constants/chips.ts:257](constants/chips.ts#L257)
- **canAfford** - [components/Screens/ShopScreen.tsx:27](components/Screens/ShopScreen.tsx#L27)
- **clearGameState** - [utils/storage.ts:115](utils/storage.ts#L115)
- **createInitialChipState** - [utils/storage.ts:27](utils/storage.ts#L27)
- **createInitialGameState** - [utils/storage.ts:35](utils/storage.ts#L35)
- **createInitialShopState** - [utils/storage.ts:16](utils/storage.ts#L16)
- **dx** - [components/Screens/BattleScreen.tsx:423](components/Screens/BattleScreen.tsx#L423)
- **dy** - [components/Screens/BattleScreen.tsx:424](components/Screens/BattleScreen.tsx#L424)
- **findShopItem** - [constants/shopItems.ts:381](constants/shopItems.ts#L381)
- **fireAngle** - [components/Screens/BattleScreen.tsx:848](components/Screens/BattleScreen.tsx#L848)
- **formatNumber** - [utils/storage.ts:137](utils/storage.ts#L137)
- **gameReducer** - [contexts/GameContext.tsx:19](contexts/GameContext.tsx#L19)
- **getAllShopItems** - [constants/shopItems.ts:374](constants/shopItems.ts#L374)
- **getCSSVar** - [hooks/useResponsive.ts:36](hooks/useResponsive.ts#L36)
- **getChipById** - [constants/chips.ts:206](constants/chips.ts#L206)
- **getChipInSlot** - [components/Screens/GuardianScreen.tsx:86](components/Screens/GuardianScreen.tsx#L86)
- **getChipRarityBorder** - [constants/chips.ts:314](constants/chips.ts#L314)
- **getChipRarityColor** - [constants/chips.ts:302](constants/chips.ts#L302)
- **getCollisionDamage** - [constants/enemies.ts:121](constants/enemies.ts#L121)
- **getEnemiesRequired** - [constants/enemies.ts:166](constants/enemies.ts#L166)
- **getEnemyDefinition** - [constants/enemies.ts:200](constants/enemies.ts#L200)
- **getEnemyHp** - [constants/enemies.ts:109](constants/enemies.ts#L109)
- **getEnemySpeed** - [constants/enemies.ts:139](constants/enemies.ts#L139)
- **getIcon** - [components/Screens/SkillScreen.tsx:17](components/Screens/SkillScreen.tsx#L17)
- **getInitialState** - [hooks/useResponsive.ts:46](hooks/useResponsive.ts#L46)
- **getOwnedBoostCount** - [components/Screens/ShopScreen.tsx:18](components/Screens/ShopScreen.tsx#L18)
- **getPosition** - [components/Screens/SkillScreen.tsx:41](components/Screens/SkillScreen.tsx#L41)
- **getRarityBorder** - [constants/shopItems.ts:399](constants/shopItems.ts#L399)
- **getRarityColor** - [constants/shopItems.ts:390](constants/shopItems.ts#L390)
- **getSpawnInterval** - [constants/enemies.ts:153](constants/enemies.ts#L153)
- **getWaveConfig** - [utils/storage.ts:151](utils/storage.ts#L151)
- **handleActivateBoost** - [components/Screens/ShopScreen.tsx:58](components/Screens/ShopScreen.tsx#L58)
- **handleBattleExit** - [App.tsx:22](App.tsx#L22)
- **handleCollect** - [components/Screens/BattleSummary.tsx:43](components/Screens/BattleSummary.tsx#L43)
- **handleEquip** - [components/Screens/ShopScreen.tsx:47](components/Screens/ShopScreen.tsx#L47)
- **handleEquipChip** - [components/Screens/GuardianScreen.tsx:73](components/Screens/GuardianScreen.tsx#L73)
- **handleGoHome** - [components/Screens/BattleSummary.tsx:56](components/Screens/BattleSummary.tsx#L56)
- **handleKeyDown** - [components/Screens/BattleScreen.tsx:325](components/Screens/BattleScreen.tsx#L325)
- **handlePurchase** - [components/Screens/ShopScreen.tsx:32](components/Screens/ShopScreen.tsx#L32)
- **handleResize** - [components/Screens/BattleScreen.tsx:1709](components/Screens/BattleScreen.tsx#L1709)
- **handleRetry** - [components/Screens/BattleSummary.tsx:51](components/Screens/BattleSummary.tsx#L51)
- **handleSummaryClose** - [App.tsx:30](App.tsx#L30)
- **handleSummaryRetry** - [App.tsx:35](App.tsx#L35)
- **handleTouchEnd** - [hooks/useResponsive.ts:186](hooks/useResponsive.ts#L186)
- **handleTouchEnd** - [hooks/useResponsive.ts:251](hooks/useResponsive.ts#L251)
- **handleTouchStart** - [hooks/useResponsive.ts:181](hooks/useResponsive.ts#L181)
- **handleTouchStart** - [hooks/useResponsive.ts:245](hooks/useResponsive.ts#L245)
- **handleUnequipChip** - [components/Screens/GuardianScreen.tsx:77](components/Screens/GuardianScreen.tsx#L77)
- **handleUpgradeChip** - [components/Screens/GuardianScreen.tsx:81](components/Screens/GuardianScreen.tsx#L81)
- **hasSaveFile** - [utils/storage.ts:126](utils/storage.ts#L126)
- **hue** - [components/Screens/BattleScreen.tsx:887](components/Screens/BattleScreen.tsx#L887)
- **hue** - [components/Screens/BattleScreen.tsx:1075](components/Screens/BattleScreen.tsx#L1075)
- **iceAngle** - [components/Screens/BattleScreen.tsx:862](components/Screens/BattleScreen.tsx#L862)
- **isBoostActive** - [components/Screens/ShopScreen.tsx:64](components/Screens/ShopScreen.tsx#L64)
- **isEquippedBase** - [components/Screens/ShopScreen.tsx:25](components/Screens/ShopScreen.tsx#L25)
- **isEquippedWeapon** - [components/Screens/ShopScreen.tsx:24](components/Screens/ShopScreen.tsx#L24)
- **isOwned** - [components/Screens/ShopScreen.tsx:23](components/Screens/ShopScreen.tsx#L23)
- **jitter** - [components/Screens/BattleScreen.tsx:835](components/Screens/BattleScreen.tsx#L835)
- **jitterX** - [components/Screens/BattleScreen.tsx:1041](components/Screens/BattleScreen.tsx#L1041)
- **jitterY** - [components/Screens/BattleScreen.tsx:1042](components/Screens/BattleScreen.tsx#L1042)
- **left** - [components/Screens/SkillScreen.tsx:44](components/Screens/SkillScreen.tsx#L44)
- **loadGameState** - [utils/storage.ts:92](utils/storage.ts#L92)
- **loop** - [components/Screens/BattleScreen.tsx:368](components/Screens/BattleScreen.tsx#L368)
- **midR** - [components/Screens/BattleScreen.tsx:834](components/Screens/BattleScreen.tsx#L834)
- **navigateTo** - [App.tsx:18](App.tsx#L18)
- **parallaxOffset** - [components/Screens/BattleScreen.tsx:724](components/Screens/BattleScreen.tsx#L724)
- **rainbowAngle** - [components/Screens/BattleScreen.tsx:888](components/Screens/BattleScreen.tsx#L888)
- **renderAbilityButton** - [components/Screens/BattleScreen.tsx:1779](components/Screens/BattleScreen.tsx#L1779)
- **renderDetailPanel** - [components/Screens/ShopScreen.tsx:196](components/Screens/ShopScreen.tsx#L196)
- **renderItemCard** - [components/Screens/ShopScreen.tsx:86](components/Screens/ShopScreen.tsx#L86)
- **renderScreen** - [App.tsx:40](App.tsx#L40)
- **resetGame** - [components/Screens/BattleScreen.tsx:1766](components/Screens/BattleScreen.tsx#L1766)
- **saveGameState** - [utils/storage.ts:72](utils/storage.ts#L72)
- **selectEnemyType** - [constants/enemies.ts:174](constants/enemies.ts#L174)
- **useGame** - [contexts/GameContext.tsx:733](contexts/GameContext.tsx#L733)
- **useResponsive** - [hooks/useResponsive.ts:43](hooks/useResponsive.ts#L43)
- **useSwipeGesture** - [hooks/useResponsive.ts:169](hooks/useResponsive.ts#L169)
- **useTapGesture** - [hooks/useResponsive.ts:232](hooks/useResponsive.ts#L232)
- **voidAngle** - [components/Screens/BattleScreen.tsx:876](components/Screens/BattleScreen.tsx#L876)
- **x** - [components/Screens/BattleScreen.tsx:725](components/Screens/BattleScreen.tsx#L725)
- **yOffset** - [components/Screens/BattleScreen.tsx:1651](components/Screens/BattleScreen.tsx#L1651)

### Methods

- **Upgrade** - [components/Screens/GuardianScreen.tsx:500](components/Screens/GuardianScreen.tsx#L500)
- **activateAbility** - [components/Screens/BattleScreen.tsx:330](components/Screens/BattleScreen.tsx#L330)
- **activateAbility** - [components/Screens/BattleScreen.tsx:333](components/Screens/BattleScreen.tsx#L333)
- **activateAbility** - [components/Screens/BattleScreen.tsx:336](components/Screens/BattleScreen.tsx#L336)
- **activateAbility** - [components/Screens/BattleScreen.tsx:1757](components/Screens/BattleScreen.tsx#L1757)
- **advanceWave** - [components/Screens/BattleScreen.tsx:164](components/Screens/BattleScreen.tsx#L164)
- **cancelAnimationFrame** - [components/Screens/BattleScreen.tsx:1723](components/Screens/BattleScreen.tsx#L1723)
- **clearInterval** - [components/Screens/BattleSummary.tsx:36](components/Screens/BattleSummary.tsx#L36)
- **collectRewards** - [components/Screens/BattleSummary.tsx:45](components/Screens/BattleSummary.tsx#L45)
- **createDamageNumber** - [components/Screens/BattleScreen.tsx:292](components/Screens/BattleScreen.tsx#L292)
- **createDamageNumber** - [components/Screens/BattleScreen.tsx:558](components/Screens/BattleScreen.tsx#L558)
- **createDamageNumber** - [components/Screens/BattleScreen.tsx:592](components/Screens/BattleScreen.tsx#L592)
- **createExplosion** - [components/Screens/BattleScreen.tsx:291](components/Screens/BattleScreen.tsx#L291)
- **createExplosion** - [components/Screens/BattleScreen.tsx:498](components/Screens/BattleScreen.tsx#L498)
- **createExplosion** - [components/Screens/BattleScreen.tsx:559](components/Screens/BattleScreen.tsx#L559)
- **createExplosion** - [components/Screens/BattleScreen.tsx:566](components/Screens/BattleScreen.tsx#L566)
- **createExplosion** - [components/Screens/BattleScreen.tsx:593](components/Screens/BattleScreen.tsx#L593)
- **createExplosion** - [components/Screens/BattleScreen.tsx:596](components/Screens/BattleScreen.tsx#L596)
- **createExplosion** - [components/Screens/BattleScreen.tsx:616](components/Screens/BattleScreen.tsx#L616)
- **dispatch** - [contexts/GameContext.tsx:656](contexts/GameContext.tsx#L656)
- **dispatch** - [contexts/GameContext.tsx:660](contexts/GameContext.tsx#L660)
- **dispatch** - [contexts/GameContext.tsx:664](contexts/GameContext.tsx#L664)
- **dispatch** - [contexts/GameContext.tsx:668](contexts/GameContext.tsx#L668)
- **dispatch** - [contexts/GameContext.tsx:672](contexts/GameContext.tsx#L672)
- **dispatch** - [contexts/GameContext.tsx:683](contexts/GameContext.tsx#L683)
- **dispatch** - [contexts/GameContext.tsx:693](contexts/GameContext.tsx#L693)
- **dispatch** - [contexts/GameContext.tsx:699](contexts/GameContext.tsx#L699)
- **dispatch** - [contexts/GameContext.tsx:704](contexts/GameContext.tsx#L704)
- **dispatch** - [components/Screens/GuardianScreen.tsx:74](components/Screens/GuardianScreen.tsx#L74)
- **dispatch** - [components/Screens/GuardianScreen.tsx:78](components/Screens/GuardianScreen.tsx#L78)
- **dispatch** - [components/Screens/GuardianScreen.tsx:82](components/Screens/GuardianScreen.tsx#L82)
- **dispatch** - [components/Screens/GuardianScreen.tsx:206](components/Screens/GuardianScreen.tsx#L206)
- **dispatch** - [components/Screens/GuardianScreen.tsx:208](components/Screens/GuardianScreen.tsx#L208)
- **dispatch** - [components/Screens/GuardianScreen.tsx:257](components/Screens/GuardianScreen.tsx#L257)
- **dispatch** - [components/Screens/GuardianScreen.tsx:259](components/Screens/GuardianScreen.tsx#L259)
- **dispatch** - [components/Screens/ShopScreen.tsx:36](components/Screens/ShopScreen.tsx#L36)
- **dispatch** - [components/Screens/ShopScreen.tsx:39](components/Screens/ShopScreen.tsx#L39)
- **dispatch** - [components/Screens/ShopScreen.tsx:51](components/Screens/ShopScreen.tsx#L51)
- **dispatch** - [components/Screens/ShopScreen.tsx:53](components/Screens/ShopScreen.tsx#L53)
- **dispatch** - [components/Screens/ShopScreen.tsx:61](components/Screens/ShopScreen.tsx#L61)
- **endBattle** - [components/Screens/BattleSummary.tsx:46](components/Screens/BattleSummary.tsx#L46)
- **handleCollect** - [components/Screens/BattleSummary.tsx:52](components/Screens/BattleSummary.tsx#L52)
- **handleCollect** - [components/Screens/BattleSummary.tsx:57](components/Screens/BattleSummary.tsx#L57)
- **handleResize** - [components/Screens/BattleScreen.tsx:1718](components/Screens/BattleScreen.tsx#L1718)
- **killEnemy** - [components/Screens/BattleScreen.tsx:597](components/Screens/BattleScreen.tsx#L597)
- **killEnemy** - [components/Screens/BattleScreen.tsx:617](components/Screens/BattleScreen.tsx#L617)
- **next** - [server.js:21](server.js#L21)
- **onExit** - [components/Screens/BattleScreen.tsx:662](components/Screens/BattleScreen.tsx#L662)
- **onSwipe** - [hooks/useResponsive.ts:204](hooks/useResponsive.ts#L204)
- **onTap** - [hooks/useResponsive.ts:261](hooks/useResponsive.ts#L261)
- **return** - [App.tsx:57](App.tsx#L57)
- **return** - [App.tsx:90](App.tsx#L90)
- **return** - [contexts/GameContext.tsx:651](contexts/GameContext.tsx#L651)
- **return** - [contexts/GameContext.tsx:722](contexts/GameContext.tsx#L722)
- **return** - [components/Screens/HomeScreen.tsx:10](components/Screens/HomeScreen.tsx#L10)
- **return** - [components/Screens/GuardianScreen.tsx:92](components/Screens/GuardianScreen.tsx#L92)
- **return** - [components/Screens/GuardianScreen.tsx:201](components/Screens/GuardianScreen.tsx#L201)
- **return** - [components/Screens/GuardianScreen.tsx:252](components/Screens/GuardianScreen.tsx#L252)
- **return** - [components/Screens/GuardianScreen.tsx:335](components/Screens/GuardianScreen.tsx#L335)
- **return** - [components/Screens/GuardianScreen.tsx:379](components/Screens/GuardianScreen.tsx#L379)
- **return** - [components/Screens/GuardianScreen.tsx:437](components/Screens/GuardianScreen.tsx#L437)
- **return** - [components/Screens/GuardianScreen.tsx:468](components/Screens/GuardianScreen.tsx#L468)
- **return** - [components/Screens/GuardianScreen.tsx:478](components/Screens/GuardianScreen.tsx#L478)
- **return** - [components/Screens/GuardianScreen.tsx:543](components/Screens/GuardianScreen.tsx#L543)
- **return** - [components/Screens/ShopScreen.tsx:100](components/Screens/ShopScreen.tsx#L100)
- **return** - [components/Screens/ShopScreen.tsx:211](components/Screens/ShopScreen.tsx#L211)
- **return** - [components/Screens/ShopScreen.tsx:420](components/Screens/ShopScreen.tsx#L420)
- **return** - [components/Screens/SkillScreen.tsx:50](components/Screens/SkillScreen.tsx#L50)
- **return** - [components/Screens/SkillScreen.tsx:90](components/Screens/SkillScreen.tsx#L90)
- **return** - [components/Screens/SkillScreen.tsx:110](components/Screens/SkillScreen.tsx#L110)
- **return** - [components/Screens/SkillScreen.tsx:190](components/Screens/SkillScreen.tsx#L190)
- **return** - [components/Screens/BattleScreen.tsx:191](components/Screens/BattleScreen.tsx#L191)
- **return** - [components/Screens/BattleScreen.tsx:342](components/Screens/BattleScreen.tsx#L342)
- **return** - [components/Screens/BattleScreen.tsx:1721](components/Screens/BattleScreen.tsx#L1721)
- **return** - [components/Screens/BattleScreen.tsx:1785](components/Screens/BattleScreen.tsx#L1785)
- **return** - [components/Screens/BattleScreen.tsx:1817](components/Screens/BattleScreen.tsx#L1817)
- **return** - [components/Screens/BattleScreen.tsx:1846](components/Screens/BattleScreen.tsx#L1846)
- **return** - [components/Screens/BattleSummary.tsx:40](components/Screens/BattleSummary.tsx#L40)
- **return** - [components/Screens/BattleSummary.tsx:69](components/Screens/BattleSummary.tsx#L69)
- **return** - [components/Layout/Header.tsx:10](components/Layout/Header.tsx#L10)
- **return** - [components/Layout/Navigation.tsx:18](components/Layout/Navigation.tsx#L18)
- **return** - [components/Layout/Navigation.tsx:37](components/Layout/Navigation.tsx#L37)
- **return** - [components/Layout/BottomNav.tsx:19](components/Layout/BottomNav.tsx#L19)
- **return** - [components/Layout/BottomNav.tsx:41](components/Layout/BottomNav.tsx#L41)
- **return** - [components/Layout/BottomNav.tsx:66](components/Layout/BottomNav.tsx#L66)
- **return** - [utils/storage.ts:139](utils/storage.ts#L139)
- **return** - [utils/storage.ts:142](utils/storage.ts#L142)
- **return** - [constants/shopItems.ts:382](constants/shopItems.ts#L382)
- **return** - [hooks/useResponsive.ts:150](hooks/useResponsive.ts#L150)
- **return** - [hooks/useResponsive.ts:217](hooks/useResponsive.ts#L217)
- **return** - [hooks/useResponsive.ts:273](hooks/useResponsive.ts#L273)
- **saveGameState** - [contexts/GameContext.tsx:648](contexts/GameContext.tsx#L648)
- **setAbilities** - [components/Screens/BattleScreen.tsx:176](components/Screens/BattleScreen.tsx#L176)
- **setAbilities** - [components/Screens/BattleScreen.tsx:273](components/Screens/BattleScreen.tsx#L273)
- **setAnimatedGems** - [components/Screens/BattleSummary.tsx:32](components/Screens/BattleSummary.tsx#L32)
- **setAnimatedGold** - [components/Screens/BattleSummary.tsx:31](components/Screens/BattleSummary.tsx#L31)
- **setAnimatedScore** - [components/Screens/BattleSummary.tsx:33](components/Screens/BattleSummary.tsx#L33)
- **setBattleStarted** - [components/Screens/BattleScreen.tsx:147](components/Screens/BattleScreen.tsx#L147)
- **setCollected** - [components/Screens/BattleSummary.tsx:47](components/Screens/BattleSummary.tsx#L47)
- **setCurrentScreen** - [App.tsx:19](App.tsx#L19)
- **setCurrentScreen** - [App.tsx:26](App.tsx#L26)
- **setCurrentScreen** - [App.tsx:32](App.tsx#L32)
- **setCurrentScreen** - [App.tsx:37](App.tsx#L37)
- **setGameOver** - [components/Screens/BattleScreen.tsx:364](components/Screens/BattleScreen.tsx#L364)
- **setGameOver** - [components/Screens/BattleScreen.tsx:659](components/Screens/BattleScreen.tsx#L659)
- **setGameOver** - [components/Screens/BattleScreen.tsx:1768](components/Screens/BattleScreen.tsx#L1768)
- **setHp** - [components/Screens/BattleScreen.tsx:363](components/Screens/BattleScreen.tsx#L363)
- **setHp** - [components/Screens/BattleScreen.tsx:496](components/Screens/BattleScreen.tsx#L496)
- **setHp** - [components/Screens/BattleScreen.tsx:1767](components/Screens/BattleScreen.tsx#L1767)
- **setPaused** - [components/Screens/BattleScreen.tsx:1769](components/Screens/BattleScreen.tsx#L1769)
- **setPurchaseAnimation** - [components/Screens/ShopScreen.tsx:42](components/Screens/ShopScreen.tsx#L42)
- **setScreenShake** - [components/Screens/BattleScreen.tsx:250](components/Screens/BattleScreen.tsx#L250)
- **setShowBattleSummary** - [App.tsx:24](App.tsx#L24)
- **setShowBattleSummary** - [App.tsx:31](App.tsx#L31)
- **setShowBattleSummary** - [App.tsx:36](App.tsx#L36)
- **setState** - [hooks/useResponsive.ts:134](hooks/useResponsive.ts#L134)
- **setTargetedEnemy** - [components/Screens/BattleScreen.tsx:1740](components/Screens/BattleScreen.tsx#L1740)
- **setTargetedEnemy** - [components/Screens/BattleScreen.tsx:1746](components/Screens/BattleScreen.tsx#L1746)
- **setTargetedEnemy** - [components/Screens/BattleScreen.tsx:1771](components/Screens/BattleScreen.tsx#L1771)
- **setTimeout** - [components/Screens/ShopScreen.tsx:43](components/Screens/ShopScreen.tsx#L43)
- **setTimeout** - [components/Screens/BattleScreen.tsx:251](components/Screens/BattleScreen.tsx#L251)
- **setTimeout** - [components/Screens/BattleScreen.tsx:661](components/Screens/BattleScreen.tsx#L661)
- **setTimeout** - [components/Screens/BattleSummary.tsx:53](components/Screens/BattleSummary.tsx#L53)
- **setTimeout** - [components/Screens/BattleSummary.tsx:58](components/Screens/BattleSummary.tsx#L58)
- **setTimeout** - [hooks/useResponsive.ts:144](hooks/useResponsive.ts#L144)
- **spawnEnemy** - [components/Screens/BattleScreen.tsx:397](components/Screens/BattleScreen.tsx#L397)
- **startBattle** - [components/Screens/BattleScreen.tsx:146](components/Screens/BattleScreen.tsx#L146)
- **startBattle** - [components/Screens/BattleScreen.tsx:1770](components/Screens/BattleScreen.tsx#L1770)
- **triggerScreenShake** - [components/Screens/BattleScreen.tsx:265](components/Screens/BattleScreen.tsx#L265)
- **updateState** - [hooks/useResponsive.ts:148](hooks/useResponsive.ts#L148)
- **upgradeSkill** - [components/Screens/SkillScreen.tsx:215](components/Screens/SkillScreen.tsx#L215)
- **useEffect** - [contexts/GameContext.tsx:646](contexts/GameContext.tsx#L646)
- **useEffect** - [components/Screens/BattleScreen.tsx:144](components/Screens/BattleScreen.tsx#L144)
- **useEffect** - [components/Screens/BattleScreen.tsx:152](components/Screens/BattleScreen.tsx#L152)
- **useEffect** - [components/Screens/BattleScreen.tsx:157](components/Screens/BattleScreen.tsx#L157)
- **useEffect** - [components/Screens/BattleScreen.tsx:162](components/Screens/BattleScreen.tsx#L162)
- **useEffect** - [components/Screens/BattleScreen.tsx:171](components/Screens/BattleScreen.tsx#L171)
- **useEffect** - [components/Screens/BattleScreen.tsx:324](components/Screens/BattleScreen.tsx#L324)
- **useEffect** - [components/Screens/BattleScreen.tsx:346](components/Screens/BattleScreen.tsx#L346)
- **useEffect** - [components/Screens/BattleSummary.tsx:20](components/Screens/BattleSummary.tsx#L20)
- **useEffect** - [hooks/useResponsive.ts:137](hooks/useResponsive.ts#L137)
- **useEffect** - [hooks/useResponsive.ts:174](hooks/useResponsive.ts#L174)
- **useEffect** - [hooks/useResponsive.ts:237](hooks/useResponsive.ts#L237)
- **useSwipeGesture** - [components/Screens/BattleScreen.tsx:1764](components/Screens/BattleScreen.tsx#L1764)
- **useTapGesture** - [components/Screens/BattleScreen.tsx:1763](components/Screens/BattleScreen.tsx#L1763)

