# Project Table of Contents

*Generated on 2026-01-16 05:14:16*

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
- [components/Screens/MissionsScreen.tsx](#components-screens-missionsscreen.tsx)
- [components/Screens/ShopScreen.tsx](#components-screens-shopscreen.tsx)
- [components/Screens/SkillScreen.tsx](#components-screens-skillscreen.tsx)
- [constants/achievements.ts](#constants-achievements.ts)
- [constants/chips.ts](#constants-chips.ts)
- [constants/enemies.ts](#constants-enemies.ts)
- [constants/missions.ts](#constants-missions.ts)
- [constants/shopItems.ts](#constants-shopitems.ts)
- [contexts/GameContext.tsx](#contexts-gamecontext.tsx)
- [hooks/useResponsive.ts](#hooks-useresponsive.ts)
- [server.js](#server.js)
- [tests/example.spec.ts](#tests-example.spec.ts)
- [types.ts](#types.ts)
- [utils/storage.ts](#utils-storage.ts)

---

## App.tsx

### Functions

- **navigateTo** (const function) - [Line 19](App.tsx#19)
- **handleBattleExit** (const function) - [Line 23](App.tsx#23)
- **handleSummaryClose** (const function) - [Line 31](App.tsx#31)
- **handleSummaryRetry** (const function) - [Line 36](App.tsx#36)
- **renderScreen** (const function) - [Line 41](App.tsx#41)

### Methods

- **setCurrentScreen** (method) - [Line 20](App.tsx#20)
- **setShowBattleSummary** (method) - [Line 25](App.tsx#25)
- **setCurrentScreen** (method) - [Line 27](App.tsx#27)
- **setShowBattleSummary** (method) - [Line 32](App.tsx#32)
- **setCurrentScreen** (method) - [Line 33](App.tsx#33)
- **setShowBattleSummary** (method) - [Line 37](App.tsx#37)
- **setCurrentScreen** (method) - [Line 38](App.tsx#38)
- **return** (method) - [Line 60](App.tsx#60)
- **return** (method) - [Line 93](App.tsx#93)

## components/Layout/BottomNav.tsx

### Interfaces

- **BottomNavProps** (interface) - [Line 5](components/Layout/BottomNav.tsx#5)

### Methods

- **return** (method) - [Line 20](components/Layout/BottomNav.tsx#20)
- **return** (method) - [Line 42](components/Layout/BottomNav.tsx#42)
- **return** (method) - [Line 67](components/Layout/BottomNav.tsx#67)

## components/Layout/Header.tsx

### Functions

- **ResourceItem** (const function) - [Line 52](components/Layout/Header.tsx#52)

### Methods

- **return** (method) - [Line 10](components/Layout/Header.tsx#10)

## components/Layout/Navigation.tsx

### Interfaces

- **NavigationProps** (interface) - [Line 5](components/Layout/Navigation.tsx#5)

### Methods

- **return** (method) - [Line 19](components/Layout/Navigation.tsx#19)
- **return** (method) - [Line 38](components/Layout/Navigation.tsx#38)

## components/Screens/BattleScreen.tsx

### Interfaces

- **BattleScreenProps** (interface) - [Line 17](components/Screens/BattleScreen.tsx#17)
- **Ability** (interface) - [Line 22](components/Screens/BattleScreen.tsx#22)

### Functions

- **handleKeyDown** (const function) - [Line 337](components/Screens/BattleScreen.tsx#337)
- **loop** (const function) - [Line 387](components/Screens/BattleScreen.tsx#387)
- **attackSpeedMultiplier** (const function) - [Line 424](components/Screens/BattleScreen.tsx#424)
- **dx** (const function) - [Line 443](components/Screens/BattleScreen.tsx#443)
- **dy** (const function) - [Line 444](components/Screens/BattleScreen.tsx#444)
- **parallaxOffset** (const function) - [Line 746](components/Screens/BattleScreen.tsx#746)
- **x** (const function) - [Line 747](components/Screens/BattleScreen.tsx#747)
- **a** (const function) - [Line 830](components/Screens/BattleScreen.tsx#830)
- **midR** (const function) - [Line 856](components/Screens/BattleScreen.tsx#856)
- **jitter** (const function) - [Line 857](components/Screens/BattleScreen.tsx#857)
- **fireAngle** (const function) - [Line 870](components/Screens/BattleScreen.tsx#870)
- **iceAngle** (const function) - [Line 884](components/Screens/BattleScreen.tsx#884)
- **voidAngle** (const function) - [Line 898](components/Screens/BattleScreen.tsx#898)
- **hue** (const function) - [Line 909](components/Screens/BattleScreen.tsx#909)
- **rainbowAngle** (const function) - [Line 910](components/Screens/BattleScreen.tsx#910)
- **a** (const function) - [Line 930](components/Screens/BattleScreen.tsx#930)
- **alpha** (const function) - [Line 1007](components/Screens/BattleScreen.tsx#1007)
- **jitterX** (const function) - [Line 1063](components/Screens/BattleScreen.tsx#1063)
- **jitterY** (const function) - [Line 1064](components/Screens/BattleScreen.tsx#1064)
- **hue** (const function) - [Line 1097](components/Screens/BattleScreen.tsx#1097)
- **angle** (const function) - [Line 1328](components/Screens/BattleScreen.tsx#1328)
- **angle** (const function) - [Line 1344](components/Screens/BattleScreen.tsx#1344)
- **angle** (const function) - [Line 1377](components/Screens/BattleScreen.tsx#1377)
- **angle** (const function) - [Line 1390](components/Screens/BattleScreen.tsx#1390)
- **angle** (const function) - [Line 1536](components/Screens/BattleScreen.tsx#1536)
- **yOffset** (const function) - [Line 1673](components/Screens/BattleScreen.tsx#1673)
- **handleResize** (const function) - [Line 1731](components/Screens/BattleScreen.tsx#1731)
- **resetGame** (const function) - [Line 1788](components/Screens/BattleScreen.tsx#1788)
- **renderAbilityButton** (const function) - [Line 1804](components/Screens/BattleScreen.tsx#1804)

### Methods

- **useEffect** (method) - [Line 150](components/Screens/BattleScreen.tsx#150)
- **startBattle** (method) - [Line 152](components/Screens/BattleScreen.tsx#152)
- **setBattleStarted** (method) - [Line 153](components/Screens/BattleScreen.tsx#153)
- **useEffect** (method) - [Line 158](components/Screens/BattleScreen.tsx#158)
- **useEffect** (method) - [Line 163](components/Screens/BattleScreen.tsx#163)
- **useEffect** (method) - [Line 168](components/Screens/BattleScreen.tsx#168)
- **useEffect** (method) - [Line 173](components/Screens/BattleScreen.tsx#173)
- **advanceWave** (method) - [Line 176](components/Screens/BattleScreen.tsx#176)
- **useEffect** (method) - [Line 183](components/Screens/BattleScreen.tsx#183)
- **setAbilities** (method) - [Line 188](components/Screens/BattleScreen.tsx#188)
- **return** (method) - [Line 203](components/Screens/BattleScreen.tsx#203)
- **setScreenShake** (method) - [Line 262](components/Screens/BattleScreen.tsx#262)
- **setTimeout** (method) - [Line 263](components/Screens/BattleScreen.tsx#263)
- **triggerScreenShake** (method) - [Line 277](components/Screens/BattleScreen.tsx#277)
- **setAbilities** (method) - [Line 285](components/Screens/BattleScreen.tsx#285)
- **createExplosion** (method) - [Line 303](components/Screens/BattleScreen.tsx#303)
- **createDamageNumber** (method) - [Line 304](components/Screens/BattleScreen.tsx#304)
- **useEffect** (method) - [Line 336](components/Screens/BattleScreen.tsx#336)
- **activateAbility** (method) - [Line 342](components/Screens/BattleScreen.tsx#342)
- **activateAbility** (method) - [Line 345](components/Screens/BattleScreen.tsx#345)
- **activateAbility** (method) - [Line 348](components/Screens/BattleScreen.tsx#348)
- **return** (method) - [Line 354](components/Screens/BattleScreen.tsx#354)
- **useEffect** (method) - [Line 358](components/Screens/BattleScreen.tsx#358)
- **setHp** (method) - [Line 372](components/Screens/BattleScreen.tsx#372)
- **setGameOver** (method) - [Line 373](components/Screens/BattleScreen.tsx#373)
- **useEffect** (method) - [Line 378](components/Screens/BattleScreen.tsx#378)
- **spawnEnemy** (method) - [Line 417](components/Screens/BattleScreen.tsx#417)
- **setHp** (method) - [Line 516](components/Screens/BattleScreen.tsx#516)
- **createExplosion** (method) - [Line 518](components/Screens/BattleScreen.tsx#518)
- **createDamageNumber** (method) - [Line 578](components/Screens/BattleScreen.tsx#578)
- **createExplosion** (method) - [Line 579](components/Screens/BattleScreen.tsx#579)
- **createExplosion** (method) - [Line 586](components/Screens/BattleScreen.tsx#586)
- **createDamageNumber** (method) - [Line 612](components/Screens/BattleScreen.tsx#612)
- **createExplosion** (method) - [Line 613](components/Screens/BattleScreen.tsx#613)
- **createExplosion** (method) - [Line 616](components/Screens/BattleScreen.tsx#616)
- **killEnemy** (method) - [Line 617](components/Screens/BattleScreen.tsx#617)
- **createExplosion** (method) - [Line 636](components/Screens/BattleScreen.tsx#636)
- **killEnemy** (method) - [Line 637](components/Screens/BattleScreen.tsx#637)
- **setGameOver** (method) - [Line 681](components/Screens/BattleScreen.tsx#681)
- **setTimeout** (method) - [Line 683](components/Screens/BattleScreen.tsx#683)
- **onExit** (method) - [Line 684](components/Screens/BattleScreen.tsx#684)
- **handleResize** (method) - [Line 1740](components/Screens/BattleScreen.tsx#1740)
- **return** (method) - [Line 1743](components/Screens/BattleScreen.tsx#1743)
- **cancelAnimationFrame** (method) - [Line 1745](components/Screens/BattleScreen.tsx#1745)
- **setTargetedEnemy** (method) - [Line 1762](components/Screens/BattleScreen.tsx#1762)
- **setTargetedEnemy** (method) - [Line 1768](components/Screens/BattleScreen.tsx#1768)
- **activateAbility** (method) - [Line 1779](components/Screens/BattleScreen.tsx#1779)
- **useTapGesture** (method) - [Line 1785](components/Screens/BattleScreen.tsx#1785)
- **useSwipeGesture** (method) - [Line 1786](components/Screens/BattleScreen.tsx#1786)
- **setHp** (method) - [Line 1791](components/Screens/BattleScreen.tsx#1791)
- **setGameOver** (method) - [Line 1792](components/Screens/BattleScreen.tsx#1792)
- **setPaused** (method) - [Line 1793](components/Screens/BattleScreen.tsx#1793)
- **startBattle** (method) - [Line 1794](components/Screens/BattleScreen.tsx#1794)
- **setTargetedEnemy** (method) - [Line 1795](components/Screens/BattleScreen.tsx#1795)
- **return** (method) - [Line 1810](components/Screens/BattleScreen.tsx#1810)
- **return** (method) - [Line 1842](components/Screens/BattleScreen.tsx#1842)
- **return** (method) - [Line 1871](components/Screens/BattleScreen.tsx#1871)

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

## components/Screens/MissionsScreen.tsx

### Interfaces

- **StatBadgeProps** (interface) - [Line 279](components/Screens/MissionsScreen.tsx#279)
- **MissionCardProps** (interface) - [Line 293](components/Screens/MissionsScreen.tsx#293)
- **MissionDetailsProps** (interface) - [Line 394](components/Screens/MissionsScreen.tsx#394)

### Types

- **TabCategory** (type) - [Line 38](components/Screens/MissionsScreen.tsx#38)

### Functions

- **getCategoryIcon** (const function) - [Line 91](components/Screens/MissionsScreen.tsx#91)
- **getRewardIcon** (const function) - [Line 105](components/Screens/MissionsScreen.tsx#105)
- **getRewardText** (const function) - [Line 117](components/Screens/MissionsScreen.tsx#117)
- **getObjectiveProgress** (const function) - [Line 135](components/Screens/MissionsScreen.tsx#135)
- **handleClaimReward** (const function) - [Line 139](components/Screens/MissionsScreen.tsx#139)
- **getTimeRemaining** (const function) - [Line 144](components/Screens/MissionsScreen.tsx#144)

### Methods

- **useEffect** (method) - [Line 46](components/Screens/MissionsScreen.tsx#46)
- **dispatch** (method) - [Line 47](components/Screens/MissionsScreen.tsx#47)
- **useEffect** (method) - [Line 57](components/Screens/MissionsScreen.tsx#57)
- **dispatch** (method) - [Line 59](components/Screens/MissionsScreen.tsx#59)
- **dispatch** (method) - [Line 62](components/Screens/MissionsScreen.tsx#62)
- **dispatch** (method) - [Line 140](components/Screens/MissionsScreen.tsx#140)
- **setSelectedMission** (method) - [Line 141](components/Screens/MissionsScreen.tsx#141)
- **return** (method) - [Line 177](components/Screens/MissionsScreen.tsx#177)
- **return** (method) - [Line 313](components/Screens/MissionsScreen.tsx#313)
- **return** (method) - [Line 419](components/Screens/MissionsScreen.tsx#419)
- **return** (method) - [Line 470](components/Screens/MissionsScreen.tsx#470)

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

## constants/achievements.ts

### Functions

- **getAchievementById** (const function) - [Line 191](constants/achievements.ts#191)
- **checkAchievementTierReached** (const function) - [Line 195](constants/achievements.ts#195)
- **getNextTier** (const function) - [Line 211](constants/achievements.ts#211)
- **getTierColor** (const function) - [Line 226](constants/achievements.ts#226)
- **initializeAchievements** (const function) - [Line 236](constants/achievements.ts#236)

## constants/chips.ts

### Functions

- **getChipById** (const function) - [Line 710](constants/chips.ts#710)
- **calculateChipBonus** (const function) - [Line 719](constants/chips.ts#719)
- **calculateUpgradeCost** (const function) - [Line 824](constants/chips.ts#824)
- **calculateTotalChipBonuses** (const function) - [Line 832](constants/chips.ts#832)
- **getChipRarityColor** (const function) - [Line 922](constants/chips.ts#922)
- **getChipRarityBorder** (const function) - [Line 934](constants/chips.ts#934)

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

## constants/missions.ts

### Interfaces

- **MissionTrackingStats** (interface) - [Line 834](constants/missions.ts#834)

### Functions

- **getMissionById** (const function) - [Line 723](constants/missions.ts#723)
- **getMissionCategoryName** (const function) - [Line 727](constants/missions.ts#727)
- **getMissionCategoryColor** (const function) - [Line 741](constants/missions.ts#741)
- **getAvailableMissions** (const function) - [Line 755](constants/missions.ts#755)
- **generateDailyMissions** (const function) - [Line 782](constants/missions.ts#782)
- **generateWeeklyMissions** (const function) - [Line 795](constants/missions.ts#795)
- **shouldRefreshDailyMissions** (const function) - [Line 808](constants/missions.ts#808)
- **shouldRefreshWeeklyMissions** (const function) - [Line 817](constants/missions.ts#817)
- **calculateObjectiveProgress** (const function) - [Line 858](constants/missions.ts#858)
- **syncMissionProgress** (const function) - [Line 908](constants/missions.ts#908)

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

- **GameContextType** (interface) - [Line 1195](contexts/GameContext.tsx#1195)
- **GameProviderProps** (interface) - [Line 1217](contexts/GameContext.tsx#1217)

### Functions

- **gameReducer** (const function) - [Line 33](contexts/GameContext.tsx#33)
- **updateMissionStatus** (const function) - [Line 940](contexts/GameContext.tsx#940)
- **useGame** (const function) - [Line 1316](contexts/GameContext.tsx#1316)

### Methods

- **useEffect** (method) - [Line 1229](contexts/GameContext.tsx#1229)
- **saveGameState** (method) - [Line 1231](contexts/GameContext.tsx#1231)
- **return** (method) - [Line 1234](contexts/GameContext.tsx#1234)
- **dispatch** (method) - [Line 1239](contexts/GameContext.tsx#1239)
- **dispatch** (method) - [Line 1243](contexts/GameContext.tsx#1243)
- **dispatch** (method) - [Line 1247](contexts/GameContext.tsx#1247)
- **dispatch** (method) - [Line 1251](contexts/GameContext.tsx#1251)
- **dispatch** (method) - [Line 1255](contexts/GameContext.tsx#1255)
- **dispatch** (method) - [Line 1266](contexts/GameContext.tsx#1266)
- **dispatch** (method) - [Line 1276](contexts/GameContext.tsx#1276)
- **dispatch** (method) - [Line 1282](contexts/GameContext.tsx#1282)
- **dispatch** (method) - [Line 1287](contexts/GameContext.tsx#1287)
- **return** (method) - [Line 1305](contexts/GameContext.tsx#1305)

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

## tests/example.spec.ts

### Methods

- **test** (method) - [Line 3](tests/example.spec.ts#3)
- **test** (method) - [Line 10](tests/example.spec.ts#10)

## types.ts

### Interfaces

- **WeaponDefinition** (interface) - [Line 28](types.ts#28)
- **Enemy** (interface) - [Line 105](types.ts#105)
- **Projectile** (interface) - [Line 125](types.ts#125)
- **PlayerStats** (interface) - [Line 147](types.ts#147)
- **Skill** (interface) - [Line 160](types.ts#160)
- **SkillNode** (interface) - [Line 174](types.ts#174)
- **ChipBonus** (interface) - [Line 195](types.ts#195)
- **Chip** (interface) - [Line 235](types.ts#235)
- **OwnedChip** (interface) - [Line 252](types.ts#252)
- **ChipState** (interface) - [Line 260](types.ts#260)
- **BattleRewards** (interface) - [Line 272](types.ts#272)
- **BattleState** (interface) - [Line 282](types.ts#282)
- **GameState** (interface) - [Line 293](types.ts#293)
- **ShopItem** (interface) - [Line 381](types.ts#381)
- **WeaponSkin** (interface) - [Line 392](types.ts#392)
- **BaseSkin** (interface) - [Line 402](types.ts#402)
- **BoostItem** (interface) - [Line 412](types.ts#412)
- **ActiveBoost** (interface) - [Line 431](types.ts#431)
- **ShopState** (interface) - [Line 438](types.ts#438)
- **MissionObjective** (interface) - [Line 479](types.ts#479)
- **MissionReward** (interface) - [Line 491](types.ts#491)
- **Mission** (interface) - [Line 498](types.ts#498)
- **MissionState** (interface) - [Line 512](types.ts#512)
- **AchievementProgress** (interface) - [Line 556](types.ts#556)
- **Achievement** (interface) - [Line 563](types.ts#563)
- **AchievementState** (interface) - [Line 577](types.ts#577)
- **ChipSlot** (interface) - [Line 586](types.ts#586)

### Types

- **SkillCategory** (type) - [Line 172](types.ts#172)
- **ChipType** (type) - [Line 192](types.ts#192)
- **ChipRarity** (type) - [Line 193](types.ts#193)
- **GameAction** (type) - [Line 330](types.ts#330)
- **ShopCategory** (type) - [Line 378](types.ts#378)
- **CurrencyType** (type) - [Line 379](types.ts#379)
- **BoostEffect** (type) - [Line 420](types.ts#420)
- **MissionCategory** (type) - [Line 450](types.ts#450)
- **MissionStatus** (type) - [Line 460](types.ts#460)
- **ObjectiveType** (type) - [Line 462](types.ts#462)
- **AchievementCategory** (type) - [Line 547](types.ts#547)
- **AchievementTier** (type) - [Line 554](types.ts#554)

## utils/storage.ts

### Interfaces

- **StorageWrapper** (interface) - [Line 9](utils/storage.ts#9)

### Functions

- **createInitialShopState** (const function) - [Line 17](utils/storage.ts#17)
- **createInitialChipState** (const function) - [Line 28](utils/storage.ts#28)
- **createInitialMissionState** (const function) - [Line 41](utils/storage.ts#41)
- **createInitialAchievementState** (const function) - [Line 80](utils/storage.ts#80)
- **createInitialGameState** (const function) - [Line 88](utils/storage.ts#88)
- **saveGameState** (const function) - [Line 127](utils/storage.ts#127)
- **loadGameState** (const function) - [Line 147](utils/storage.ts#147)
- **clearGameState** (const function) - [Line 170](utils/storage.ts#170)
- **hasSaveFile** (const function) - [Line 181](utils/storage.ts#181)
- **formatNumber** (const function) - [Line 192](utils/storage.ts#192)
- **getWaveConfig** (const function) - [Line 206](utils/storage.ts#206)

### Methods

- **return** (method) - [Line 194](utils/storage.ts#194)
- **return** (method) - [Line 197](utils/storage.ts#197)

---

## Flat Index (All Items by Type)

### Interfaces

- **Ability** - [components/Screens/BattleScreen.tsx:22](components/Screens/BattleScreen.tsx#L22)
- **Achievement** - [types.ts:563](types.ts#L563)
- **AchievementProgress** - [types.ts:556](types.ts#L556)
- **AchievementState** - [types.ts:577](types.ts#L577)
- **ActiveBoost** - [types.ts:431](types.ts#L431)
- **BaseSkin** - [types.ts:402](types.ts#L402)
- **BattleRewards** - [types.ts:272](types.ts#L272)
- **BattleScreenProps** - [components/Screens/BattleScreen.tsx:17](components/Screens/BattleScreen.tsx#L17)
- **BattleState** - [types.ts:282](types.ts#L282)
- **BattleSummaryProps** - [components/Screens/BattleSummary.tsx:6](components/Screens/BattleSummary.tsx#L6)
- **BoostItem** - [types.ts:412](types.ts#L412)
- **BottomNavProps** - [components/Layout/BottomNav.tsx:5](components/Layout/BottomNav.tsx#L5)
- **Chip** - [types.ts:235](types.ts#L235)
- **ChipBonus** - [types.ts:195](types.ts#L195)
- **ChipSlot** - [types.ts:586](types.ts#L586)
- **ChipState** - [types.ts:260](types.ts#L260)
- **Enemy** - [types.ts:105](types.ts#L105)
- **EnemyDefinition** - [constants/enemies.ts:11](constants/enemies.ts#L11)
- **GameContextType** - [contexts/GameContext.tsx:1195](contexts/GameContext.tsx#L1195)
- **GameProviderProps** - [contexts/GameContext.tsx:1217](contexts/GameContext.tsx#L1217)
- **GameState** - [types.ts:293](types.ts#L293)
- **HomeScreenProps** - [components/Screens/HomeScreen.tsx:5](components/Screens/HomeScreen.tsx#L5)
- **Mission** - [types.ts:498](types.ts#L498)
- **MissionCardProps** - [components/Screens/MissionsScreen.tsx:293](components/Screens/MissionsScreen.tsx#L293)
- **MissionDetailsProps** - [components/Screens/MissionsScreen.tsx:394](components/Screens/MissionsScreen.tsx#L394)
- **MissionObjective** - [types.ts:479](types.ts#L479)
- **MissionReward** - [types.ts:491](types.ts#L491)
- **MissionState** - [types.ts:512](types.ts#L512)
- **MissionTrackingStats** - [constants/missions.ts:834](constants/missions.ts#L834)
- **NavigationProps** - [components/Layout/Navigation.tsx:5](components/Layout/Navigation.tsx#L5)
- **OwnedChip** - [types.ts:252](types.ts#L252)
- **PlayerStats** - [types.ts:147](types.ts#L147)
- **Projectile** - [types.ts:125](types.ts#L125)
- **ResponsiveState** - [hooks/useResponsive.ts:3](hooks/useResponsive.ts#L3)
- **ShopItem** - [types.ts:381](types.ts#L381)
- **ShopState** - [types.ts:438](types.ts#L438)
- **Skill** - [types.ts:160](types.ts#L160)
- **SkillNode** - [types.ts:174](types.ts#L174)
- **StatBadgeProps** - [components/Screens/MissionsScreen.tsx:279](components/Screens/MissionsScreen.tsx#L279)
- **StorageWrapper** - [utils/storage.ts:9](utils/storage.ts#L9)
- **SwipeGesture** - [hooks/useResponsive.ts:160](hooks/useResponsive.ts#L160)
- **TapEvent** - [hooks/useResponsive.ts:225](hooks/useResponsive.ts#L225)
- **WeaponDefinition** - [types.ts:28](types.ts#L28)
- **WeaponSkin** - [types.ts:392](types.ts#L392)

### Types

- **AchievementCategory** - [types.ts:547](types.ts#L547)
- **AchievementTier** - [types.ts:554](types.ts#L554)
- **BoostEffect** - [types.ts:420](types.ts#L420)
- **ChipRarity** - [types.ts:193](types.ts#L193)
- **ChipType** - [types.ts:192](types.ts#L192)
- **CurrencyType** - [types.ts:379](types.ts#L379)
- **GameAction** - [types.ts:330](types.ts#L330)
- **MissionCategory** - [types.ts:450](types.ts#L450)
- **MissionStatus** - [types.ts:460](types.ts#L460)
- **ObjectiveType** - [types.ts:462](types.ts#L462)
- **ShopCategory** - [types.ts:378](types.ts#L378)
- **SkillCategory** - [types.ts:172](types.ts#L172)
- **TabCategory** - [components/Screens/MissionsScreen.tsx:38](components/Screens/MissionsScreen.tsx#L38)

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
- **a** - [components/Screens/BattleScreen.tsx:830](components/Screens/BattleScreen.tsx#L830)
- **a** - [components/Screens/BattleScreen.tsx:930](components/Screens/BattleScreen.tsx#L930)
- **alpha** - [components/Screens/BattleScreen.tsx:1007](components/Screens/BattleScreen.tsx#L1007)
- **angle** - [components/Screens/BattleScreen.tsx:1328](components/Screens/BattleScreen.tsx#L1328)
- **angle** - [components/Screens/BattleScreen.tsx:1344](components/Screens/BattleScreen.tsx#L1344)
- **angle** - [components/Screens/BattleScreen.tsx:1377](components/Screens/BattleScreen.tsx#L1377)
- **angle** - [components/Screens/BattleScreen.tsx:1390](components/Screens/BattleScreen.tsx#L1390)
- **angle** - [components/Screens/BattleScreen.tsx:1536](components/Screens/BattleScreen.tsx#L1536)
- **attackSpeedMultiplier** - [components/Screens/BattleScreen.tsx:424](components/Screens/BattleScreen.tsx#L424)
- **calculateChipBonus** - [constants/chips.ts:719](constants/chips.ts#L719)
- **calculateObjectiveProgress** - [constants/missions.ts:858](constants/missions.ts#L858)
- **calculateTotalChipBonuses** - [constants/chips.ts:832](constants/chips.ts#L832)
- **calculateUpgradeCost** - [constants/chips.ts:824](constants/chips.ts#L824)
- **canAfford** - [components/Screens/ShopScreen.tsx:27](components/Screens/ShopScreen.tsx#L27)
- **checkAchievementTierReached** - [constants/achievements.ts:195](constants/achievements.ts#L195)
- **clearGameState** - [utils/storage.ts:170](utils/storage.ts#L170)
- **createInitialAchievementState** - [utils/storage.ts:80](utils/storage.ts#L80)
- **createInitialChipState** - [utils/storage.ts:28](utils/storage.ts#L28)
- **createInitialGameState** - [utils/storage.ts:88](utils/storage.ts#L88)
- **createInitialMissionState** - [utils/storage.ts:41](utils/storage.ts#L41)
- **createInitialShopState** - [utils/storage.ts:17](utils/storage.ts#L17)
- **dx** - [components/Screens/BattleScreen.tsx:443](components/Screens/BattleScreen.tsx#L443)
- **dy** - [components/Screens/BattleScreen.tsx:444](components/Screens/BattleScreen.tsx#L444)
- **findShopItem** - [constants/shopItems.ts:381](constants/shopItems.ts#L381)
- **fireAngle** - [components/Screens/BattleScreen.tsx:870](components/Screens/BattleScreen.tsx#L870)
- **formatNumber** - [utils/storage.ts:192](utils/storage.ts#L192)
- **gameReducer** - [contexts/GameContext.tsx:33](contexts/GameContext.tsx#L33)
- **generateDailyMissions** - [constants/missions.ts:782](constants/missions.ts#L782)
- **generateWeeklyMissions** - [constants/missions.ts:795](constants/missions.ts#L795)
- **getAchievementById** - [constants/achievements.ts:191](constants/achievements.ts#L191)
- **getAllShopItems** - [constants/shopItems.ts:374](constants/shopItems.ts#L374)
- **getAvailableMissions** - [constants/missions.ts:755](constants/missions.ts#L755)
- **getCSSVar** - [hooks/useResponsive.ts:36](hooks/useResponsive.ts#L36)
- **getCategoryIcon** - [components/Screens/MissionsScreen.tsx:91](components/Screens/MissionsScreen.tsx#L91)
- **getChipById** - [constants/chips.ts:710](constants/chips.ts#L710)
- **getChipInSlot** - [components/Screens/GuardianScreen.tsx:86](components/Screens/GuardianScreen.tsx#L86)
- **getChipRarityBorder** - [constants/chips.ts:934](constants/chips.ts#L934)
- **getChipRarityColor** - [constants/chips.ts:922](constants/chips.ts#L922)
- **getCollisionDamage** - [constants/enemies.ts:121](constants/enemies.ts#L121)
- **getEnemiesRequired** - [constants/enemies.ts:166](constants/enemies.ts#L166)
- **getEnemyDefinition** - [constants/enemies.ts:200](constants/enemies.ts#L200)
- **getEnemyHp** - [constants/enemies.ts:109](constants/enemies.ts#L109)
- **getEnemySpeed** - [constants/enemies.ts:139](constants/enemies.ts#L139)
- **getIcon** - [components/Screens/SkillScreen.tsx:17](components/Screens/SkillScreen.tsx#L17)
- **getInitialState** - [hooks/useResponsive.ts:46](hooks/useResponsive.ts#L46)
- **getMissionById** - [constants/missions.ts:723](constants/missions.ts#L723)
- **getMissionCategoryColor** - [constants/missions.ts:741](constants/missions.ts#L741)
- **getMissionCategoryName** - [constants/missions.ts:727](constants/missions.ts#L727)
- **getNextTier** - [constants/achievements.ts:211](constants/achievements.ts#L211)
- **getObjectiveProgress** - [components/Screens/MissionsScreen.tsx:135](components/Screens/MissionsScreen.tsx#L135)
- **getOwnedBoostCount** - [components/Screens/ShopScreen.tsx:18](components/Screens/ShopScreen.tsx#L18)
- **getPosition** - [components/Screens/SkillScreen.tsx:41](components/Screens/SkillScreen.tsx#L41)
- **getRarityBorder** - [constants/shopItems.ts:399](constants/shopItems.ts#L399)
- **getRarityColor** - [constants/shopItems.ts:390](constants/shopItems.ts#L390)
- **getRewardIcon** - [components/Screens/MissionsScreen.tsx:105](components/Screens/MissionsScreen.tsx#L105)
- **getRewardText** - [components/Screens/MissionsScreen.tsx:117](components/Screens/MissionsScreen.tsx#L117)
- **getSpawnInterval** - [constants/enemies.ts:153](constants/enemies.ts#L153)
- **getTierColor** - [constants/achievements.ts:226](constants/achievements.ts#L226)
- **getTimeRemaining** - [components/Screens/MissionsScreen.tsx:144](components/Screens/MissionsScreen.tsx#L144)
- **getWaveConfig** - [utils/storage.ts:206](utils/storage.ts#L206)
- **handleActivateBoost** - [components/Screens/ShopScreen.tsx:58](components/Screens/ShopScreen.tsx#L58)
- **handleBattleExit** - [App.tsx:23](App.tsx#L23)
- **handleClaimReward** - [components/Screens/MissionsScreen.tsx:139](components/Screens/MissionsScreen.tsx#L139)
- **handleCollect** - [components/Screens/BattleSummary.tsx:43](components/Screens/BattleSummary.tsx#L43)
- **handleEquip** - [components/Screens/ShopScreen.tsx:47](components/Screens/ShopScreen.tsx#L47)
- **handleEquipChip** - [components/Screens/GuardianScreen.tsx:73](components/Screens/GuardianScreen.tsx#L73)
- **handleGoHome** - [components/Screens/BattleSummary.tsx:56](components/Screens/BattleSummary.tsx#L56)
- **handleKeyDown** - [components/Screens/BattleScreen.tsx:337](components/Screens/BattleScreen.tsx#L337)
- **handlePurchase** - [components/Screens/ShopScreen.tsx:32](components/Screens/ShopScreen.tsx#L32)
- **handleResize** - [components/Screens/BattleScreen.tsx:1731](components/Screens/BattleScreen.tsx#L1731)
- **handleRetry** - [components/Screens/BattleSummary.tsx:51](components/Screens/BattleSummary.tsx#L51)
- **handleSummaryClose** - [App.tsx:31](App.tsx#L31)
- **handleSummaryRetry** - [App.tsx:36](App.tsx#L36)
- **handleTouchEnd** - [hooks/useResponsive.ts:186](hooks/useResponsive.ts#L186)
- **handleTouchEnd** - [hooks/useResponsive.ts:251](hooks/useResponsive.ts#L251)
- **handleTouchStart** - [hooks/useResponsive.ts:181](hooks/useResponsive.ts#L181)
- **handleTouchStart** - [hooks/useResponsive.ts:245](hooks/useResponsive.ts#L245)
- **handleUnequipChip** - [components/Screens/GuardianScreen.tsx:77](components/Screens/GuardianScreen.tsx#L77)
- **handleUpgradeChip** - [components/Screens/GuardianScreen.tsx:81](components/Screens/GuardianScreen.tsx#L81)
- **hasSaveFile** - [utils/storage.ts:181](utils/storage.ts#L181)
- **hue** - [components/Screens/BattleScreen.tsx:909](components/Screens/BattleScreen.tsx#L909)
- **hue** - [components/Screens/BattleScreen.tsx:1097](components/Screens/BattleScreen.tsx#L1097)
- **iceAngle** - [components/Screens/BattleScreen.tsx:884](components/Screens/BattleScreen.tsx#L884)
- **initializeAchievements** - [constants/achievements.ts:236](constants/achievements.ts#L236)
- **isBoostActive** - [components/Screens/ShopScreen.tsx:64](components/Screens/ShopScreen.tsx#L64)
- **isEquippedBase** - [components/Screens/ShopScreen.tsx:25](components/Screens/ShopScreen.tsx#L25)
- **isEquippedWeapon** - [components/Screens/ShopScreen.tsx:24](components/Screens/ShopScreen.tsx#L24)
- **isOwned** - [components/Screens/ShopScreen.tsx:23](components/Screens/ShopScreen.tsx#L23)
- **jitter** - [components/Screens/BattleScreen.tsx:857](components/Screens/BattleScreen.tsx#L857)
- **jitterX** - [components/Screens/BattleScreen.tsx:1063](components/Screens/BattleScreen.tsx#L1063)
- **jitterY** - [components/Screens/BattleScreen.tsx:1064](components/Screens/BattleScreen.tsx#L1064)
- **left** - [components/Screens/SkillScreen.tsx:44](components/Screens/SkillScreen.tsx#L44)
- **loadGameState** - [utils/storage.ts:147](utils/storage.ts#L147)
- **loop** - [components/Screens/BattleScreen.tsx:387](components/Screens/BattleScreen.tsx#L387)
- **midR** - [components/Screens/BattleScreen.tsx:856](components/Screens/BattleScreen.tsx#L856)
- **navigateTo** - [App.tsx:19](App.tsx#L19)
- **parallaxOffset** - [components/Screens/BattleScreen.tsx:746](components/Screens/BattleScreen.tsx#L746)
- **rainbowAngle** - [components/Screens/BattleScreen.tsx:910](components/Screens/BattleScreen.tsx#L910)
- **renderAbilityButton** - [components/Screens/BattleScreen.tsx:1804](components/Screens/BattleScreen.tsx#L1804)
- **renderDetailPanel** - [components/Screens/ShopScreen.tsx:196](components/Screens/ShopScreen.tsx#L196)
- **renderItemCard** - [components/Screens/ShopScreen.tsx:86](components/Screens/ShopScreen.tsx#L86)
- **renderScreen** - [App.tsx:41](App.tsx#L41)
- **resetGame** - [components/Screens/BattleScreen.tsx:1788](components/Screens/BattleScreen.tsx#L1788)
- **saveGameState** - [utils/storage.ts:127](utils/storage.ts#L127)
- **selectEnemyType** - [constants/enemies.ts:174](constants/enemies.ts#L174)
- **shouldRefreshDailyMissions** - [constants/missions.ts:808](constants/missions.ts#L808)
- **shouldRefreshWeeklyMissions** - [constants/missions.ts:817](constants/missions.ts#L817)
- **syncMissionProgress** - [constants/missions.ts:908](constants/missions.ts#L908)
- **updateMissionStatus** - [contexts/GameContext.tsx:940](contexts/GameContext.tsx#L940)
- **useGame** - [contexts/GameContext.tsx:1316](contexts/GameContext.tsx#L1316)
- **useResponsive** - [hooks/useResponsive.ts:43](hooks/useResponsive.ts#L43)
- **useSwipeGesture** - [hooks/useResponsive.ts:169](hooks/useResponsive.ts#L169)
- **useTapGesture** - [hooks/useResponsive.ts:232](hooks/useResponsive.ts#L232)
- **voidAngle** - [components/Screens/BattleScreen.tsx:898](components/Screens/BattleScreen.tsx#L898)
- **x** - [components/Screens/BattleScreen.tsx:747](components/Screens/BattleScreen.tsx#L747)
- **yOffset** - [components/Screens/BattleScreen.tsx:1673](components/Screens/BattleScreen.tsx#L1673)

### Methods

- **Upgrade** - [components/Screens/GuardianScreen.tsx:500](components/Screens/GuardianScreen.tsx#L500)
- **activateAbility** - [components/Screens/BattleScreen.tsx:342](components/Screens/BattleScreen.tsx#L342)
- **activateAbility** - [components/Screens/BattleScreen.tsx:345](components/Screens/BattleScreen.tsx#L345)
- **activateAbility** - [components/Screens/BattleScreen.tsx:348](components/Screens/BattleScreen.tsx#L348)
- **activateAbility** - [components/Screens/BattleScreen.tsx:1779](components/Screens/BattleScreen.tsx#L1779)
- **advanceWave** - [components/Screens/BattleScreen.tsx:176](components/Screens/BattleScreen.tsx#L176)
- **cancelAnimationFrame** - [components/Screens/BattleScreen.tsx:1745](components/Screens/BattleScreen.tsx#L1745)
- **clearInterval** - [components/Screens/BattleSummary.tsx:36](components/Screens/BattleSummary.tsx#L36)
- **collectRewards** - [components/Screens/BattleSummary.tsx:45](components/Screens/BattleSummary.tsx#L45)
- **createDamageNumber** - [components/Screens/BattleScreen.tsx:304](components/Screens/BattleScreen.tsx#L304)
- **createDamageNumber** - [components/Screens/BattleScreen.tsx:578](components/Screens/BattleScreen.tsx#L578)
- **createDamageNumber** - [components/Screens/BattleScreen.tsx:612](components/Screens/BattleScreen.tsx#L612)
- **createExplosion** - [components/Screens/BattleScreen.tsx:303](components/Screens/BattleScreen.tsx#L303)
- **createExplosion** - [components/Screens/BattleScreen.tsx:518](components/Screens/BattleScreen.tsx#L518)
- **createExplosion** - [components/Screens/BattleScreen.tsx:579](components/Screens/BattleScreen.tsx#L579)
- **createExplosion** - [components/Screens/BattleScreen.tsx:586](components/Screens/BattleScreen.tsx#L586)
- **createExplosion** - [components/Screens/BattleScreen.tsx:613](components/Screens/BattleScreen.tsx#L613)
- **createExplosion** - [components/Screens/BattleScreen.tsx:616](components/Screens/BattleScreen.tsx#L616)
- **createExplosion** - [components/Screens/BattleScreen.tsx:636](components/Screens/BattleScreen.tsx#L636)
- **dispatch** - [contexts/GameContext.tsx:1239](contexts/GameContext.tsx#L1239)
- **dispatch** - [contexts/GameContext.tsx:1243](contexts/GameContext.tsx#L1243)
- **dispatch** - [contexts/GameContext.tsx:1247](contexts/GameContext.tsx#L1247)
- **dispatch** - [contexts/GameContext.tsx:1251](contexts/GameContext.tsx#L1251)
- **dispatch** - [contexts/GameContext.tsx:1255](contexts/GameContext.tsx#L1255)
- **dispatch** - [contexts/GameContext.tsx:1266](contexts/GameContext.tsx#L1266)
- **dispatch** - [contexts/GameContext.tsx:1276](contexts/GameContext.tsx#L1276)
- **dispatch** - [contexts/GameContext.tsx:1282](contexts/GameContext.tsx#L1282)
- **dispatch** - [contexts/GameContext.tsx:1287](contexts/GameContext.tsx#L1287)
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
- **dispatch** - [components/Screens/MissionsScreen.tsx:47](components/Screens/MissionsScreen.tsx#L47)
- **dispatch** - [components/Screens/MissionsScreen.tsx:59](components/Screens/MissionsScreen.tsx#L59)
- **dispatch** - [components/Screens/MissionsScreen.tsx:62](components/Screens/MissionsScreen.tsx#L62)
- **dispatch** - [components/Screens/MissionsScreen.tsx:140](components/Screens/MissionsScreen.tsx#L140)
- **endBattle** - [components/Screens/BattleSummary.tsx:46](components/Screens/BattleSummary.tsx#L46)
- **handleCollect** - [components/Screens/BattleSummary.tsx:52](components/Screens/BattleSummary.tsx#L52)
- **handleCollect** - [components/Screens/BattleSummary.tsx:57](components/Screens/BattleSummary.tsx#L57)
- **handleResize** - [components/Screens/BattleScreen.tsx:1740](components/Screens/BattleScreen.tsx#L1740)
- **killEnemy** - [components/Screens/BattleScreen.tsx:617](components/Screens/BattleScreen.tsx#L617)
- **killEnemy** - [components/Screens/BattleScreen.tsx:637](components/Screens/BattleScreen.tsx#L637)
- **next** - [server.js:21](server.js#L21)
- **onExit** - [components/Screens/BattleScreen.tsx:684](components/Screens/BattleScreen.tsx#L684)
- **onSwipe** - [hooks/useResponsive.ts:204](hooks/useResponsive.ts#L204)
- **onTap** - [hooks/useResponsive.ts:261](hooks/useResponsive.ts#L261)
- **return** - [App.tsx:60](App.tsx#L60)
- **return** - [App.tsx:93](App.tsx#L93)
- **return** - [contexts/GameContext.tsx:1234](contexts/GameContext.tsx#L1234)
- **return** - [contexts/GameContext.tsx:1305](contexts/GameContext.tsx#L1305)
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
- **return** - [components/Screens/BattleScreen.tsx:203](components/Screens/BattleScreen.tsx#L203)
- **return** - [components/Screens/BattleScreen.tsx:354](components/Screens/BattleScreen.tsx#L354)
- **return** - [components/Screens/BattleScreen.tsx:1743](components/Screens/BattleScreen.tsx#L1743)
- **return** - [components/Screens/BattleScreen.tsx:1810](components/Screens/BattleScreen.tsx#L1810)
- **return** - [components/Screens/BattleScreen.tsx:1842](components/Screens/BattleScreen.tsx#L1842)
- **return** - [components/Screens/BattleScreen.tsx:1871](components/Screens/BattleScreen.tsx#L1871)
- **return** - [components/Screens/MissionsScreen.tsx:177](components/Screens/MissionsScreen.tsx#L177)
- **return** - [components/Screens/MissionsScreen.tsx:313](components/Screens/MissionsScreen.tsx#L313)
- **return** - [components/Screens/MissionsScreen.tsx:419](components/Screens/MissionsScreen.tsx#L419)
- **return** - [components/Screens/MissionsScreen.tsx:470](components/Screens/MissionsScreen.tsx#L470)
- **return** - [components/Screens/BattleSummary.tsx:40](components/Screens/BattleSummary.tsx#L40)
- **return** - [components/Screens/BattleSummary.tsx:69](components/Screens/BattleSummary.tsx#L69)
- **return** - [components/Layout/Header.tsx:10](components/Layout/Header.tsx#L10)
- **return** - [components/Layout/Navigation.tsx:19](components/Layout/Navigation.tsx#L19)
- **return** - [components/Layout/Navigation.tsx:38](components/Layout/Navigation.tsx#L38)
- **return** - [components/Layout/BottomNav.tsx:20](components/Layout/BottomNav.tsx#L20)
- **return** - [components/Layout/BottomNav.tsx:42](components/Layout/BottomNav.tsx#L42)
- **return** - [components/Layout/BottomNav.tsx:67](components/Layout/BottomNav.tsx#L67)
- **return** - [utils/storage.ts:194](utils/storage.ts#L194)
- **return** - [utils/storage.ts:197](utils/storage.ts#L197)
- **return** - [constants/shopItems.ts:382](constants/shopItems.ts#L382)
- **return** - [hooks/useResponsive.ts:150](hooks/useResponsive.ts#L150)
- **return** - [hooks/useResponsive.ts:217](hooks/useResponsive.ts#L217)
- **return** - [hooks/useResponsive.ts:273](hooks/useResponsive.ts#L273)
- **saveGameState** - [contexts/GameContext.tsx:1231](contexts/GameContext.tsx#L1231)
- **setAbilities** - [components/Screens/BattleScreen.tsx:188](components/Screens/BattleScreen.tsx#L188)
- **setAbilities** - [components/Screens/BattleScreen.tsx:285](components/Screens/BattleScreen.tsx#L285)
- **setAnimatedGems** - [components/Screens/BattleSummary.tsx:32](components/Screens/BattleSummary.tsx#L32)
- **setAnimatedGold** - [components/Screens/BattleSummary.tsx:31](components/Screens/BattleSummary.tsx#L31)
- **setAnimatedScore** - [components/Screens/BattleSummary.tsx:33](components/Screens/BattleSummary.tsx#L33)
- **setBattleStarted** - [components/Screens/BattleScreen.tsx:153](components/Screens/BattleScreen.tsx#L153)
- **setCollected** - [components/Screens/BattleSummary.tsx:47](components/Screens/BattleSummary.tsx#L47)
- **setCurrentScreen** - [App.tsx:20](App.tsx#L20)
- **setCurrentScreen** - [App.tsx:27](App.tsx#L27)
- **setCurrentScreen** - [App.tsx:33](App.tsx#L33)
- **setCurrentScreen** - [App.tsx:38](App.tsx#L38)
- **setGameOver** - [components/Screens/BattleScreen.tsx:373](components/Screens/BattleScreen.tsx#L373)
- **setGameOver** - [components/Screens/BattleScreen.tsx:681](components/Screens/BattleScreen.tsx#L681)
- **setGameOver** - [components/Screens/BattleScreen.tsx:1792](components/Screens/BattleScreen.tsx#L1792)
- **setHp** - [components/Screens/BattleScreen.tsx:372](components/Screens/BattleScreen.tsx#L372)
- **setHp** - [components/Screens/BattleScreen.tsx:516](components/Screens/BattleScreen.tsx#L516)
- **setHp** - [components/Screens/BattleScreen.tsx:1791](components/Screens/BattleScreen.tsx#L1791)
- **setPaused** - [components/Screens/BattleScreen.tsx:1793](components/Screens/BattleScreen.tsx#L1793)
- **setPurchaseAnimation** - [components/Screens/ShopScreen.tsx:42](components/Screens/ShopScreen.tsx#L42)
- **setScreenShake** - [components/Screens/BattleScreen.tsx:262](components/Screens/BattleScreen.tsx#L262)
- **setSelectedMission** - [components/Screens/MissionsScreen.tsx:141](components/Screens/MissionsScreen.tsx#L141)
- **setShowBattleSummary** - [App.tsx:25](App.tsx#L25)
- **setShowBattleSummary** - [App.tsx:32](App.tsx#L32)
- **setShowBattleSummary** - [App.tsx:37](App.tsx#L37)
- **setState** - [hooks/useResponsive.ts:134](hooks/useResponsive.ts#L134)
- **setTargetedEnemy** - [components/Screens/BattleScreen.tsx:1762](components/Screens/BattleScreen.tsx#L1762)
- **setTargetedEnemy** - [components/Screens/BattleScreen.tsx:1768](components/Screens/BattleScreen.tsx#L1768)
- **setTargetedEnemy** - [components/Screens/BattleScreen.tsx:1795](components/Screens/BattleScreen.tsx#L1795)
- **setTimeout** - [components/Screens/ShopScreen.tsx:43](components/Screens/ShopScreen.tsx#L43)
- **setTimeout** - [components/Screens/BattleScreen.tsx:263](components/Screens/BattleScreen.tsx#L263)
- **setTimeout** - [components/Screens/BattleScreen.tsx:683](components/Screens/BattleScreen.tsx#L683)
- **setTimeout** - [components/Screens/BattleSummary.tsx:53](components/Screens/BattleSummary.tsx#L53)
- **setTimeout** - [components/Screens/BattleSummary.tsx:58](components/Screens/BattleSummary.tsx#L58)
- **setTimeout** - [hooks/useResponsive.ts:144](hooks/useResponsive.ts#L144)
- **spawnEnemy** - [components/Screens/BattleScreen.tsx:417](components/Screens/BattleScreen.tsx#L417)
- **startBattle** - [components/Screens/BattleScreen.tsx:152](components/Screens/BattleScreen.tsx#L152)
- **startBattle** - [components/Screens/BattleScreen.tsx:1794](components/Screens/BattleScreen.tsx#L1794)
- **test** - [tests/example.spec.ts:3](tests/example.spec.ts#L3)
- **test** - [tests/example.spec.ts:10](tests/example.spec.ts#L10)
- **triggerScreenShake** - [components/Screens/BattleScreen.tsx:277](components/Screens/BattleScreen.tsx#L277)
- **updateState** - [hooks/useResponsive.ts:148](hooks/useResponsive.ts#L148)
- **upgradeSkill** - [components/Screens/SkillScreen.tsx:215](components/Screens/SkillScreen.tsx#L215)
- **useEffect** - [contexts/GameContext.tsx:1229](contexts/GameContext.tsx#L1229)
- **useEffect** - [components/Screens/BattleScreen.tsx:150](components/Screens/BattleScreen.tsx#L150)
- **useEffect** - [components/Screens/BattleScreen.tsx:158](components/Screens/BattleScreen.tsx#L158)
- **useEffect** - [components/Screens/BattleScreen.tsx:163](components/Screens/BattleScreen.tsx#L163)
- **useEffect** - [components/Screens/BattleScreen.tsx:168](components/Screens/BattleScreen.tsx#L168)
- **useEffect** - [components/Screens/BattleScreen.tsx:173](components/Screens/BattleScreen.tsx#L173)
- **useEffect** - [components/Screens/BattleScreen.tsx:183](components/Screens/BattleScreen.tsx#L183)
- **useEffect** - [components/Screens/BattleScreen.tsx:336](components/Screens/BattleScreen.tsx#L336)
- **useEffect** - [components/Screens/BattleScreen.tsx:358](components/Screens/BattleScreen.tsx#L358)
- **useEffect** - [components/Screens/BattleScreen.tsx:378](components/Screens/BattleScreen.tsx#L378)
- **useEffect** - [components/Screens/MissionsScreen.tsx:46](components/Screens/MissionsScreen.tsx#L46)
- **useEffect** - [components/Screens/MissionsScreen.tsx:57](components/Screens/MissionsScreen.tsx#L57)
- **useEffect** - [components/Screens/BattleSummary.tsx:20](components/Screens/BattleSummary.tsx#L20)
- **useEffect** - [hooks/useResponsive.ts:137](hooks/useResponsive.ts#L137)
- **useEffect** - [hooks/useResponsive.ts:174](hooks/useResponsive.ts#L174)
- **useEffect** - [hooks/useResponsive.ts:237](hooks/useResponsive.ts#L237)
- **useSwipeGesture** - [components/Screens/BattleScreen.tsx:1786](components/Screens/BattleScreen.tsx#L1786)
- **useTapGesture** - [components/Screens/BattleScreen.tsx:1785](components/Screens/BattleScreen.tsx#L1785)

