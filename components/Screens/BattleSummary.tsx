import React, { useEffect, useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/storage';
import { Coins, Gem, Target, Zap, Award, TrendingUp, X, Skull, Crosshair, Swords, RefreshCw, Home, Flag } from 'lucide-react';

interface BattleSummaryProps {
  onClose: () => void;
  onRetry: () => void;
}

const BattleSummary: React.FC<BattleSummaryProps> = ({ onClose, onRetry }) => {
  const { state, collectRewards, endBattle } = useGame();
  const { pendingRewards } = state.battle;
  const [collected, setCollected] = useState(false);
  const [animatedGold, setAnimatedGold] = useState(0);
  const [animatedGems, setAnimatedGems] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate numbers counting up
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      setAnimatedGold(Math.floor(pendingRewards.goldEarned * eased));
      setAnimatedGems(Math.floor(pendingRewards.gemsEarned * eased));
      setAnimatedScore(Math.floor(pendingRewards.scoreEarned * eased));
      
      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [pendingRewards]);

  const handleCollect = () => {
    if (!collected) {
      collectRewards();
      endBattle(pendingRewards.wavesCompleted > 0);
      setCollected(true);
    }
  };

  const handleRetry = () => {
    handleCollect();
    setTimeout(onRetry, 300);
  };

  const handleGoHome = () => {
    handleCollect();
    setTimeout(onClose, 300);
  };

  // Calculate checkpoint info
  const currentWaveReached = state.battle.currentWave;
  const newCheckpoint = Math.floor(currentWaveReached / 10) * 10;
  const existingCheckpoint = state.battle.waveCheckpoint;
  const earnedNewCheckpoint = newCheckpoint > existingCheckpoint;

  const isVictory = pendingRewards.wavesCompleted >= 5; // Consider 5+ waves a victory

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={handleCollect} />
      
      {/* Modal */}
      <div className="relative bg-cyber-dark border border-white/10 rounded-3xl p-6 lg:p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button 
          onClick={handleCollect}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
            isVictory 
              ? 'bg-cyber-green/20 border border-cyber-green/50' 
              : 'bg-cyber-pink/20 border border-cyber-pink/50'
          }`}>
            {isVictory ? (
              <Award size={32} className="text-cyber-green" />
            ) : (
              <Skull size={32} className="text-cyber-pink" />
            )}
          </div>
          <h2 className="text-2xl lg:text-3xl font-orbitron font-black tracking-tight">
            {isVictory ? 'MISSION_COMPLETE' : 'SYSTEM_OFFLINE'}
          </h2>
          <p className="text-gray-500 text-sm font-rajdhani mt-1">
            Wave {state.battle.currentWave} | {pendingRewards.enemiesKilled} hostiles neutralized
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <StatCard 
            icon={<Coins size={18} />} 
            label="Gold Earned" 
            value={formatNumber(animatedGold)}
            color="text-cyber-yellow"
            bgColor="bg-cyber-yellow/10"
          />
          <StatCard 
            icon={<Gem size={18} />} 
            label="Gems Found" 
            value={formatNumber(animatedGems)}
            color="text-cyber-purple"
            bgColor="bg-cyber-purple/10"
          />
          <StatCard 
            icon={<Target size={18} />} 
            label="Score" 
            value={formatNumber(animatedScore)}
            color="text-cyber-blue"
            bgColor="bg-cyber-blue/10"
          />
          <StatCard 
            icon={<TrendingUp size={18} />} 
            label="Waves" 
            value={String(pendingRewards.wavesCompleted)}
            color="text-cyber-green"
            bgColor="bg-cyber-green/10"
          />
        </div>

        {/* Detailed Stats */}
        <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
          <h3 className="text-[10px] uppercase text-gray-500 font-orbitron tracking-widest mb-3">Combat Analysis</h3>
          <div className="space-y-2">
            <DetailRow 
              icon={<Skull size={12} />} 
              label="Enemies Eliminated" 
              value={pendingRewards.enemiesKilled.toString()} 
            />
            <DetailRow 
              icon={<Crosshair size={12} />} 
              label="Critical Hits" 
              value={pendingRewards.criticalHits.toString()} 
            />
            <DetailRow 
              icon={<Swords size={12} />} 
              label="Damage Dealt" 
              value={formatNumber(Math.floor(pendingRewards.damageDealt))} 
            />
            <DetailRow 
              icon={<Zap size={12} />} 
              label="Crit Rate" 
              value={pendingRewards.enemiesKilled > 0 
                ? `${Math.round((pendingRewards.criticalHits / pendingRewards.enemiesKilled) * 100)}%`
                : '0%'
              } 
            />
          </div>
        </div>

        {/* High Score Notice */}
        {pendingRewards.scoreEarned > state.highScore && state.highScore > 0 && (
          <div className="bg-cyber-yellow/10 border border-cyber-yellow/30 rounded-xl p-3 mb-6 text-center">
            <span className="text-cyber-yellow text-sm font-bold font-orbitron">🏆 NEW HIGH SCORE!</span>
          </div>
        )}

        {/* Collect Button */}
        {/* Checkpoint Info */}
        {earnedNewCheckpoint && (
          <div className="bg-cyber-green/10 border border-cyber-green/30 rounded-xl p-3 mb-4 text-center">
            <Flag className="inline mr-2 text-cyber-green" size={16} />
            <span className="text-cyber-green text-sm font-bold">NEW CHECKPOINT: WAVE {newCheckpoint}</span>
          </div>
        )}

        {/* Next run info */}
        <div className="text-center text-sm text-gray-400 mb-4">
          Next run starts from Wave {Math.max(newCheckpoint, 1)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 py-4 rounded-2xl font-orbitron font-black tracking-widest text-base
              transition-all active:scale-95 flex items-center justify-center gap-2
              bg-cyber-blue text-black hover:bg-cyber-blue/80 shadow-lg shadow-cyber-blue/20"
          >
            <RefreshCw size={18} />
            RETRY
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 py-4 rounded-2xl font-orbitron font-black tracking-widest text-base
              transition-all active:scale-95 flex items-center justify-center gap-2
              border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white"
          >
            <Home size={18} />
            HOME
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, bgColor }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) => (
  <div className={`${bgColor} rounded-xl p-4 border border-white/5`}>
    <div className={`${color} mb-2`}>{icon}</div>
    <div className="text-[10px] text-gray-500 uppercase font-orbitron tracking-wider">{label}</div>
    <div className={`text-xl font-bold font-mono ${color}`}>{value}</div>
  </div>
);

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between text-xs">
    <div className="flex items-center gap-2 text-gray-400">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-mono font-bold text-white">{value}</span>
  </div>
);

export default BattleSummary;
