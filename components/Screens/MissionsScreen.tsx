import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { 
  Mission, 
  MissionCategory, 
  MissionReward, 
  MissionObjective 
} from '../../types';
import { 
  getMissionCategoryName, 
  getMissionCategoryColor,
  shouldRefreshDailyMissions,
  shouldRefreshWeeklyMissions
} from '../../constants/missions';
import { getChipById, getChipRarityColor } from '../../constants/chips';
import { formatNumber } from '../../utils/storage';
import { 
  Target, 
  Sword, 
  Shield, 
  Sparkles, 
  Compass, 
  Calendar, 
  CalendarDays,
  Trophy,
  ChevronRight,
  Check,
  Lock,
  Coins,
  Gem,
  Cpu,
  Gift,
  Clock,
  X,
  RefreshCw
} from 'lucide-react';

type TabCategory = 'ALL' | 'TUTORIAL' | 'COMBAT' | 'SURVIVAL' | 'MASTERY' | 'EXPLORATION' | 'DAILY' | 'WEEKLY';

const MissionsScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [activeTab, setActiveTab] = useState<TabCategory>('ALL');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // Sync mission progress on mount and when stats change
  useEffect(() => {
    dispatch({ type: 'SYNC_MISSION_PROGRESS' });
  }, [
    dispatch,
    state.missionState.totalEnemiesKilled,
    state.missionState.totalBossesKilled,
    state.missionState.totalWavesCompleted,
    state.missionState.highestWaveReached
  ]);

  // Check and refresh daily/weekly missions if needed
  useEffect(() => {
    if (shouldRefreshDailyMissions(state.missionState.dailyMissionsRefreshedAt)) {
      dispatch({ type: 'REFRESH_DAILY_MISSIONS' });
    }
    if (shouldRefreshWeeklyMissions(state.missionState.weeklyMissionsRefreshedAt)) {
      dispatch({ type: 'REFRESH_WEEKLY_MISSIONS' });
    }
  }, [dispatch, state.missionState.dailyMissionsRefreshedAt, state.missionState.weeklyMissionsRefreshedAt]);

  // Combine all missions for display
  const allMissions = useMemo(() => {
    return [
      ...state.missionState.activeMissions,
      ...state.missionState.dailyMissions,
      ...state.missionState.weeklyMissions
    ];
  }, [state.missionState.activeMissions, state.missionState.dailyMissions, state.missionState.weeklyMissions]);

  // Filter missions by tab
  const filteredMissions = useMemo(() => {
    if (activeTab === 'ALL') return allMissions;
    if (activeTab === 'DAILY') return state.missionState.dailyMissions;
    if (activeTab === 'WEEKLY') return state.missionState.weeklyMissions;
    return state.missionState.activeMissions.filter(m => m.category === activeTab);
  }, [allMissions, activeTab, state.missionState]);

  // Sort missions: completed first, then in-progress, then available
  const sortedMissions = useMemo(() => {
    return [...filteredMissions].sort((a, b) => {
      const statusOrder = { 'COMPLETED': 0, 'IN_PROGRESS': 1, 'AVAILABLE': 2, 'LOCKED': 3, 'CLAIMED': 4 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [filteredMissions]);

  const getCategoryIcon = (category: MissionCategory) => {
    switch (category) {
      case 'TUTORIAL': return <Target size={14} />;
      case 'COMBAT': return <Sword size={14} />;
      case 'SURVIVAL': return <Shield size={14} />;
      case 'MASTERY': return <Sparkles size={14} />;
      case 'EXPLORATION': return <Compass size={14} />;
      case 'DAILY': return <Calendar size={14} />;
      case 'WEEKLY': return <CalendarDays size={14} />;
      case 'MILESTONE': return <Trophy size={14} />;
      default: return <Target size={14} />;
    }
  };

  const getRewardIcon = (reward: MissionReward) => {
    switch (reward.type) {
      case 'GOLD': return <Coins size={14} className="text-cyber-yellow" />;
      case 'GEMS': return <Gem size={14} className="text-cyber-pink" />;
      case 'CHIP': return <Cpu size={14} className="text-cyber-blue" />;
      case 'CHIP_SLOT': return <Gift size={14} className="text-cyber-green" />;
      case 'WEAPON': return <Sword size={14} className="text-cyber-orange" />;
      case 'SKIN': return <Sparkles size={14} className="text-purple-400" />;
      default: return <Gift size={14} />;
    }
  };

  const getRewardText = (reward: MissionReward): string => {
    switch (reward.type) {
      case 'GOLD': return `${formatNumber(reward.amount || 0)} Gold`;
      case 'GEMS': return `${reward.amount} Gems`;
      case 'CHIP': 
        if (reward.id) {
          const chip = getChipById(reward.id);
          return chip ? chip.name : 'Unknown Chip';
        }
        return `${reward.rarity || 'Random'} Chip`;
      case 'CHIP_SLOT': return '+1 Chip Slot';
      case 'WEAPON': return 'Weapon';
      case 'SKIN': return 'Skin';
      case 'BOOST': return 'Boost';
      default: return 'Reward';
    }
  };

  const getObjectiveProgress = (obj: MissionObjective): number => {
    return Math.min((obj.current / obj.target) * 100, 100);
  };

  const handleClaimReward = (missionId: string) => {
    dispatch({ type: 'CLAIM_MISSION_REWARD', payload: { missionId } });
    setSelectedMission(null);
  };

  const getTimeRemaining = (expiresAt?: number): string => {
    if (!expiresAt) return '';
    const now = Date.now();
    const diff = expiresAt - now;
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Stats summary
  const completedCount = state.missionState.completedMissions.length;
  const inProgressCount = allMissions.filter(m => m.status === 'IN_PROGRESS').length;
  const availableCount = allMissions.filter(m => m.status === 'AVAILABLE').length;
  const readyToClaimCount = allMissions.filter(m => m.status === 'COMPLETED').length;

  const tabs: { id: TabCategory; label: string; icon?: React.ReactNode }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'DAILY', label: 'Daily', icon: <Calendar size={12} /> },
    { id: 'WEEKLY', label: 'Weekly', icon: <CalendarDays size={12} /> },
    { id: 'TUTORIAL', label: 'Tutorial' },
    { id: 'COMBAT', label: 'Combat' },
    { id: 'SURVIVAL', label: 'Survival' },
    { id: 'MASTERY', label: 'Mastery' },
    { id: 'EXPLORATION', label: 'Explore' },
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-cyber-black relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 pb-24 lg:pb-8 min-h-0">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-8 shrink-0 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-orbitron font-black tracking-tighter">MISSIONS</h1>
            <p className="text-xs text-gray-500 uppercase tracking-[0.4em]">Objective Database</p>
          </div>
          
          {/* Stats Summary */}
          <div className="flex gap-3 lg:gap-4">
            <StatBadge label="Completed" value={completedCount} color="text-cyber-green" />
            <StatBadge label="In Progress" value={inProgressCount} color="text-cyber-yellow" />
            {readyToClaimCount > 0 && (
              <StatBadge label="Claim!" value={readyToClaimCount} color="text-cyber-pink" pulse />
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 lg:mb-6 shrink-0 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-lg text-[10px] lg:text-xs font-bold font-orbitron uppercase whitespace-nowrap transition-all
                ${activeTab === tab.id 
                  ? 'bg-white text-black shadow-lg shadow-white/10' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Missions List */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
          {sortedMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Target size={48} className="mb-4 opacity-30" />
              <p className="text-sm">No missions available</p>
              <p className="text-xs mt-1">Check back after progressing further</p>
            </div>
          ) : (
            sortedMissions.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClick={() => setSelectedMission(mission)}
                getCategoryIcon={getCategoryIcon}
                getTimeRemaining={getTimeRemaining}
              />
            ))
          )}
        </div>
      </div>

      {/* Mission Details Sidebar / Bottom Sheet */}
      <div className={`
        bg-cyber-panel border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col
        fixed lg:relative
        transition-transform duration-300 ease-in-out
        ${selectedMission ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        
        /* Mobile Positioning */
        left-0 right-0 bottom-20 z-40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)]
        max-h-[70vh]
        
        /* Desktop Positioning */
        lg:h-full lg:w-[400px] lg:rounded-none lg:bottom-0 lg:shadow-none lg:max-h-none
      `}>
        {selectedMission ? (
          <MissionDetails
            mission={selectedMission}
            onClose={() => setSelectedMission(null)}
            onClaim={handleClaimReward}
            getCategoryIcon={getCategoryIcon}
            getRewardIcon={getRewardIcon}
            getRewardText={getRewardText}
            getObjectiveProgress={getObjectiveProgress}
            getTimeRemaining={getTimeRemaining}
          />
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <Target size={48} className="mb-4 opacity-30" />
            <p className="text-sm text-center">Select a mission to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

interface StatBadgeProps {
  label: string;
  value: number;
  color: string;
  pulse?: boolean;
}

const StatBadge: React.FC<StatBadgeProps> = ({ label, value, color, pulse }) => (
  <div className={`bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center ${pulse ? 'animate-pulse' : ''}`}>
    <div className={`text-lg lg:text-xl font-bold font-orbitron ${color}`}>{value}</div>
    <div className="text-[9px] text-gray-500 uppercase tracking-wider">{label}</div>
  </div>
);

interface MissionCardProps {
  mission: Mission;
  onClick: () => void;
  getCategoryIcon: (category: MissionCategory) => React.ReactNode;
  getTimeRemaining: (expiresAt?: number) => string;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onClick, getCategoryIcon, getTimeRemaining }) => {
  const isCompleted = mission.status === 'COMPLETED';
  const isClaimed = mission.status === 'CLAIMED';
  const isLocked = mission.status === 'LOCKED';
  const categoryColor = getMissionCategoryColor(mission.category);
  
  // Calculate overall progress
  const totalProgress = mission.objectives.reduce((sum, obj) => sum + obj.current, 0);
  const totalTarget = mission.objectives.reduce((sum, obj) => sum + obj.target, 0);
  const progressPercent = Math.min((totalProgress / totalTarget) * 100, 100);

  const timeRemaining = getTimeRemaining(mission.expiresAt);

  return (
    <button
      onClick={onClick}
      disabled={isClaimed}
      className={`
        w-full p-4 rounded-xl border transition-all text-left group relative overflow-hidden
        ${isCompleted 
          ? 'bg-cyber-green/10 border-cyber-green/30 hover:border-cyber-green/50' 
          : isClaimed
            ? 'bg-white/5 border-white/5 opacity-50 cursor-default'
            : isLocked
              ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'
              : 'bg-white/5 border-white/10 hover:border-white/20'
        }
      `}
    >
      {/* Category indicator line */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: categoryColor }}
      />
      
      <div className="flex items-start gap-3 pl-2">
        {/* Icon */}
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
        >
          {isCompleted ? <Check size={18} /> : isLocked ? <Lock size={18} /> : getCategoryIcon(mission.category)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`text-sm font-bold truncate ${isClaimed ? 'text-gray-500' : 'text-white'}`}>
              {mission.name}
            </h3>
            {timeRemaining && (
              <div className="flex items-center gap-1 text-[9px] text-gray-400 whitespace-nowrap">
                <Clock size={10} />
                {timeRemaining}
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-500 line-clamp-1 mb-2">{mission.description}</p>
          
          {/* Progress bar */}
          {!isClaimed && !isLocked && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundColor: isCompleted ? '#00FF88' : categoryColor
                  }}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                {Math.floor(progressPercent)}%
              </span>
            </div>
          )}
        </div>
        
        {/* Arrow / Status */}
        <div className="shrink-0">
          {isCompleted ? (
            <div className="bg-cyber-green text-black px-2 py-1 rounded text-[9px] font-bold">CLAIM</div>
          ) : isClaimed ? (
            <Check size={16} className="text-gray-500" />
          ) : (
            <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
          )}
        </div>
      </div>
    </button>
  );
};

interface MissionDetailsProps {
  mission: Mission;
  onClose: () => void;
  onClaim: (missionId: string) => void;
  getCategoryIcon: (category: MissionCategory) => React.ReactNode;
  getRewardIcon: (reward: MissionReward) => React.ReactNode;
  getRewardText: (reward: MissionReward) => string;
  getObjectiveProgress: (obj: MissionObjective) => number;
  getTimeRemaining: (expiresAt?: number) => string;
}

const MissionDetails: React.FC<MissionDetailsProps> = ({
  mission,
  onClose,
  onClaim,
  getCategoryIcon,
  getRewardIcon,
  getRewardText,
  getObjectiveProgress,
  getTimeRemaining
}) => {
  const categoryColor = getMissionCategoryColor(mission.category);
  const isCompleted = mission.status === 'COMPLETED';
  const timeRemaining = getTimeRemaining(mission.expiresAt);

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-6 lg:p-8">
      {/* Mobile Drag Handle / Close */}
      <div className="lg:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" onClick={onClose} />
      
      {/* Close button (desktop) */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
          >
            {getCategoryIcon(mission.category)}
          </div>
          <div>
            <div 
              className="text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{ color: categoryColor }}
            >
              {getMissionCategoryName(mission.category)}
            </div>
            <h2 className="text-xl lg:text-2xl font-orbitron font-bold text-white">{mission.name}</h2>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm leading-relaxed">{mission.description}</p>
        
        {timeRemaining && (
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <Clock size={14} />
            <span>Expires in {timeRemaining}</span>
          </div>
        )}
      </div>

      {/* Objectives */}
      <div className="mb-6 lg:mb-8">
        <h3 className="text-xs font-orbitron font-bold text-gray-500 mb-4 uppercase tracking-widest">Objectives</h3>
        <div className="space-y-3">
          {mission.objectives.map(obj => {
            const progress = getObjectiveProgress(obj);
            const isComplete = obj.current >= obj.target;
            
            return (
              <div key={obj.id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">{obj.description}</span>
                  {isComplete && <Check size={14} className="text-cyber-green" />}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: isComplete ? '#00FF88' : categoryColor
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    {formatNumber(obj.current)} / {formatNumber(obj.target)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards */}
      <div className="mb-6 lg:mb-8">
        <h3 className="text-xs font-orbitron font-bold text-gray-500 mb-4 uppercase tracking-widest">Rewards</h3>
        <div className="grid grid-cols-2 gap-2">
          {mission.rewards.map((reward, idx) => (
            <div 
              key={idx}
              className="bg-white/5 rounded-lg p-3 border border-white/5 flex items-center gap-2"
            >
              {getRewardIcon(reward)}
              <span className="text-sm text-white">{getRewardText(reward)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Button */}
      <div className="mt-auto">
        {isCompleted ? (
          <button
            onClick={() => onClaim(mission.id)}
            className="w-full h-14 bg-cyber-green text-black rounded-xl font-orbitron font-bold tracking-widest hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
          >
            <Gift size={20} />
            CLAIM REWARDS
          </button>
        ) : (
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {mission.status === 'IN_PROGRESS' ? 'Mission in progress...' : 'Complete objectives to claim'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionsScreen;
