import React, { useState } from 'react';
import { Screen } from './types';
import { GameProvider, useGame } from './contexts/GameContext';
import Navigation from './components/Layout/Navigation';
import Header from './components/Layout/Header';
import HomeScreen from './components/Screens/HomeScreen';
import GuardianScreen from './components/Screens/GuardianScreen';
import SkillScreen from './components/Screens/SkillScreen';
import ShopScreen from './components/Screens/ShopScreen';
import BattleScreen from './components/Screens/BattleScreen';
import BattleSummary from './components/Screens/BattleSummary';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [showBattleSummary, setShowBattleSummary] = useState(false);
  const { state } = useGame();

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleBattleExit = (completed: boolean) => {
    if (completed || state.battle.pendingRewards.enemiesKilled > 0) {
      setShowBattleSummary(true);
    } else {
      setCurrentScreen(Screen.HOME);
    }
  };

  const handleSummaryClose = () => {
    setShowBattleSummary(false);
    setCurrentScreen(Screen.HOME);
  };

  const handleSummaryRetry = () => {
    setShowBattleSummary(false);
    setCurrentScreen(Screen.BATTLE);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <HomeScreen onNavigate={navigateTo} />;
      case Screen.GUARDIAN:
        return <GuardianScreen />;
      case Screen.SKILLS:
        return <SkillScreen />;
      case Screen.SHOP:
        return <ShopScreen />;
      case Screen.BATTLE:
        return <BattleScreen onExit={handleBattleExit} />;
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="h-dvh w-screen bg-cyber-black text-white relative overflow-hidden flex flex-col lg:flex-row">
      {/* Visual Overlays */}
      <div className="scanlines pointer-events-none fixed inset-0 z-[9998]"></div>
      <div className="vignette pointer-events-none fixed inset-0 z-[9999]"></div>

      {/* Battle Summary Modal */}
      {showBattleSummary && (
        <BattleSummary onClose={handleSummaryClose} onRetry={handleSummaryRetry} />
      )}

      {/* Persistent Navigation (Sidebar on Desktop, Bottom on Mobile) */}
      {currentScreen !== Screen.BATTLE && (
        <Navigation currentScreen={currentScreen} onNavigate={navigateTo} />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
        {/* Global Header (Persistent Telemetry) */}
        {currentScreen !== Screen.BATTLE && (
          <Header />
        )}

        {/* Dynamic Content Area */}
        <main className={`flex-1 relative overflow-hidden ${currentScreen !== Screen.BATTLE ? 'mt-16 lg:mt-0' : ''}`}>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;