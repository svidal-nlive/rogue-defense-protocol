import React, { useState, useMemo } from 'react';
import { SkillCategory, SkillNode } from '../../types';
import { Flame, Crosshair, Zap, Target, Shield, Activity, Coins, Battery, Cpu, Lock, ChevronUp, X } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/storage';

const SkillScreen: React.FC = () => {
  const { state, upgradeSkill } = useGame();
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('OFFENSE');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  
  // Use skills from GameContext state (persisted)
  const skills = state.skillNodes;

  const activeSkills = useMemo(() => skills.filter(s => s.category === activeCategory), [skills, activeCategory]);

  const getIcon = (name: string, size = 20) => {
    const props = { size };
    switch (name) {
      case 'flame': return <Flame {...props} />;
      case 'crosshair': return <Crosshair {...props} />;
      case 'zap': return <Zap {...props} />;
      case 'target': return <Target {...props} />;
      case 'shield': return <Shield {...props} />;
      case 'activity': return <Activity {...props} />;
      case 'coins': return <Coins {...props} />;
      case 'battery': return <Battery {...props} />;
      case 'cpu': return <Cpu {...props} />;
      default: return <Zap {...props} />;
    }
  };

  const selectedSkill = skills.find(s => s.id === selectedSkillId);

  // Use fixed px positioning to avoid overlap on small screens
  // Tree area needs to be scrollable
  const ROW_HEIGHT = 120;
  const COL_WIDTH_PERCENT = 33.33;
  const TOP_OFFSET = 60;
  
  const getPosition = (row: number, col: number) => {
      const top = TOP_OFFSET + (row * ROW_HEIGHT);
      // Columns: 0->16.5%, 1->50%, 2->83.5% centered
      const left = (col * COL_WIDTH_PERCENT) + (COL_WIDTH_PERCENT / 2);
      return { top, left: `${left}%` };
  };

  const TREE_HEIGHT = 600; // Fixed height for the drawing area

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-cyber-black relative">
      {/* Tree Visualization Area */}
      <div className="flex-1 flex flex-col p-4 lg:p-10 relative pb-24 lg:pb-10 min-h-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-12 shrink-0 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-orbitron font-black tracking-tighter">NEURAL_PATH</h1>
            <p className="text-xs text-gray-500 uppercase tracking-[0.4em]">Genetic Upgrade Architecture</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl lg:rounded-2xl border border-white/10 self-start lg:self-auto overflow-x-auto max-w-full">
            {(['OFFENSE', 'DEFENSE', 'UTILITY'] as SkillCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedSkillId(null); }}
                className={`
                  px-4 lg:px-6 py-2 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-bold font-orbitron uppercase transition-all whitespace-nowrap
                  ${activeCategory === cat ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-500 hover:text-white'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tree Container (Scrollable) */}
        <div className="flex-1 relative bg-white/[0.02] rounded-[2rem] lg:rounded-[3rem] border border-white/5 backdrop-blur-3xl overflow-y-auto overflow-x-hidden shadow-inner no-scrollbar">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" style={{ height: TREE_HEIGHT }}></div>
          
          {/* SVG Lines Layer */}
          <svg className="absolute top-0 left-0 w-full pointer-events-none z-0" style={{ height: TREE_HEIGHT }}>
            {activeSkills.map(skill => {
              if (!skill.parentId) return null;
              const parent = activeSkills.find(s => s.id === skill.parentId);
              if (!parent) return null;
              const pPos = getPosition(parent.position.row, parent.position.col);
              const cPos = getPosition(skill.position.row, skill.position.col);
              const isUnlocked = skill.currentLevel > 0;
              
              return (
                <line 
                  key={`line-${skill.id}`}
                  x1={pPos.left} y1={pPos.top} x2={cPos.left} y2={cPos.top} 
                  stroke={isUnlocked ? "#00F0FF" : "#ffffff10"}
                  strokeWidth={isUnlocked ? "3" : "1"}
                  strokeDasharray={isUnlocked ? "" : "5,5"}
                  className="transition-all duration-700"
                />
              );
            })}
          </svg>

          {/* Nodes Layer */}
          <div className="relative w-full z-10" style={{ height: TREE_HEIGHT }}>
            {activeSkills.map(skill => {
              const pos = getPosition(skill.position.row, skill.position.col);
              const isUnlocked = skill.currentLevel > 0;
              const isSelected = selectedSkillId === skill.id;

              return (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`
                    absolute w-12 h-12 lg:w-14 lg:h-14 -ml-6 -mt-6 lg:-ml-7 lg:-mt-7 rounded-xl lg:rounded-2xl border-2 flex items-center justify-center transition-all duration-300
                    ${isUnlocked ? 'bg-cyber-panel border-cyber-blue shadow-[0_0_20px_rgba(0,240,255,0.2)]' : 'bg-cyber-dark border-white/10 text-gray-700 opacity-60'}
                    ${isSelected ? 'ring-4 lg:ring-8 ring-white/10 border-white scale-110 z-20' : 'hover:scale-105 z-10'}
                  `}
                  style={{ left: pos.left, top: pos.top }}
                >
                  {isUnlocked ? getIcon(skill.icon, isSelected ? 24 : 20) : <Lock size={16} />}
                  {isUnlocked && (
                    <div className="absolute -bottom-2 -right-2 w-5 h-5 lg:w-6 lg:h-6 bg-white text-black border-2 border-cyber-black rounded-lg flex items-center justify-center text-[9px] lg:text-[10px] font-bold">
                      {skill.currentLevel}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Spacer for bottom sheet clearance */}
          <div className="h-40 lg:h-0"></div>
        </div>
      </div>

      {/* Details Sidebar (Desktop) / Bottom Sheet (Mobile) */}
      <div className={`
        bg-cyber-panel border-t lg:border-t-0 lg:border-l border-white/10 p-6 lg:p-8 flex flex-col
        fixed lg:relative
        transition-transform duration-300 ease-in-out
        ${selectedSkillId ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
        
        /* Mobile Positioning */
        left-0 right-0 bottom-20 z-40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)]
        h-auto max-h-[60vh]
        
        /* Desktop Positioning */
        lg:h-full lg:w-[400px] lg:rounded-none lg:bottom-0 lg:shadow-none lg:max-h-none
      `}>
        {/* Mobile Drag Handle / Close */}
        <div className="lg:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" onClick={() => setSelectedSkillId(null)}></div>
        
        {selectedSkill ? (
          <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
             <div className="absolute top-4 right-4 lg:hidden">
                 <button onClick={() => setSelectedSkillId(null)} className="p-2 text-gray-500"><X size={20} /></button>
             </div>

            <div className="mb-6 lg:mb-8">
              <div className="flex items-start gap-4 mb-4 lg:mb-6">
                <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0`}>
                    {getIcon(selectedSkill.icon, 28)}
                </div>
                <div>
                    <h3 className="text-xl lg:text-2xl font-orbitron font-bold leading-tight mb-1">{selectedSkill.name}</h3>
                    <p className="text-xs text-gray-500 font-rajdhani uppercase tracking-widest">Level {selectedSkill.currentLevel} / {selectedSkill.maxLevel}</p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-4 lg:mb-8">
                  <p className="text-gray-300 text-xs lg:text-sm leading-relaxed">{selectedSkill.description}</p>
              </div>
            </div>

            <div className="mt-auto space-y-3 lg:space-y-4">
              {(() => {
                // Use actual cost formula from skill definition
                const upgradeCost = Math.floor(selectedSkill.baseCost * Math.pow(selectedSkill.costMultiplier, selectedSkill.currentLevel));
                const canAfford = state.stats.gold >= upgradeCost;
                const isMaxed = selectedSkill.currentLevel >= selectedSkill.maxLevel;
                
                // Check if parent is unlocked (prerequisite)
                let parentLocked = false;
                if (selectedSkill.parentId) {
                  const parent = skills.find(s => s.id === selectedSkill.parentId);
                  parentLocked = !parent || parent.currentLevel === 0;
                }
                
                return (
                  <>
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs text-gray-500 font-orbitron">Upgrade Cost</span>
                      <div className={`flex items-center space-x-2 ${canAfford && !parentLocked ? 'text-cyber-yellow' : 'text-red-500'}`}>
                        <Coins size={14} />
                        <span className="font-bold font-mono">{isMaxed ? 'MAX' : formatNumber(upgradeCost)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-2 text-xs">
                      <span className="text-gray-500">Your Gold</span>
                      <span className="text-cyber-yellow font-mono">{formatNumber(state.stats.gold)}</span>
                    </div>
                    
                    {parentLocked && !isMaxed && (
                      <div className="flex items-center gap-2 px-2 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <Lock size={12} className="text-red-500" />
                        <span className="text-[10px] text-red-400">Unlock parent node first</span>
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        if (!isMaxed && canAfford && !parentLocked) {
                          upgradeSkill(selectedSkill.id);
                        }
                      }}
                      disabled={isMaxed || !canAfford || parentLocked}
                      className={`
                        w-full py-4 lg:py-5 font-orbitron font-black tracking-widest rounded-xl lg:rounded-2xl transition-all active:scale-95 shadow-xl
                        ${isMaxed 
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                          : (canAfford && !parentLocked)
                            ? 'bg-white text-black hover:bg-cyber-blue' 
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {isMaxed ? 'MAXED' : parentLocked ? 'LOCKED' : canAfford ? 'UPGRADE_NODE' : 'INSUFFICIENT_FUNDS'}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex h-full flex-col items-center justify-center text-center opacity-30 px-10">
            <Cpu size={48} className="mb-4" />
            <p className="text-xs font-orbitron tracking-widest uppercase">Interact with neural nodes to view specifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillScreen;