import React from 'react';
import { Screen } from '../../types';
import { Play, Activity, ShieldAlert, Terminal, ChevronRight } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-cyber-black lg:bg-transparent">
      {/* Content Container with Safe Area Padding for Mobile Nav */}
      <div className="h-full max-w-7xl mx-auto w-full p-4 pb-32 lg:p-10 lg:pb-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 lg:content-center">
        
        {/* Left Column: Tactical Intel (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xs font-orbitron font-bold text-gray-500 mb-4 tracking-widest uppercase">System Intel</h3>
            <div className="space-y-4">
              <IntelItem label="Sector Stability" value="92.4%" color="text-cyber-blue" />
              <IntelItem label="Rogue Activity" value="Moderate" color="text-cyber-yellow" />
              <IntelItem label="Core Integrity" value="Nominal" color="text-cyber-green" />
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="text-[10px] text-gray-500 mb-2 uppercase">Recent Logs</div>
              <div className="space-y-2 font-mono text-[9px] text-gray-400">
                <p>&gt; Entity Alpha neutralized</p>
                <p>&gt; Neural link optimized</p>
                <p>&gt; Patch 0.4.5 applied</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-cyber-blue/20 to-transparent border border-cyber-blue/20 rounded-2xl p-6">
            <h3 className="text-xs font-orbitron font-bold text-cyber-blue mb-2 tracking-widest uppercase">Special Event</h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">Void incursions detected in Sector 7. Double rewards active for 14h.</p>
            <button className="text-[10px] font-bold text-white flex items-center hover:translate-x-1 transition-transform">
              ACCESS EVENT <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Center Column: Deployment Zone */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center lg:justify-start">
          <div className="w-full max-w-lg space-y-4 lg:space-y-8">
            <div className="text-center space-y-1 lg:space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-orbitron font-black text-white tracking-tighter">NEON DEFENSE</h1>
              <p className="text-gray-500 font-rajdhani text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em]">Hybrid Strategy Protocol</p>
            </div>

            {/* Campaign Card - Optimized for Mobile */}
            <div className="relative group w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue via-cyber-pink to-cyber-yellow rounded-2xl lg:rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-cyber-panel border border-white/10 rounded-2xl lg:rounded-[2rem] overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] shadow-2xl flex flex-col">
                {/* Visuals */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-cyber-black/50 to-transparent"></div>
                
                {/* Animated Graphic Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                     <div className="w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 border border-cyber-blue/30 rounded-full animate-spin [animation-duration:10s]"></div>
                     <div className="absolute w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 border border-cyber-pink/30 rotate-45"></div>
                </div>

                <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 right-3 sm:right-4 lg:right-6 flex justify-between items-start z-10">
                    <div className="bg-black/60 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/10 text-[9px] sm:text-[10px] font-bold font-orbitron text-cyber-blue">
                        SECTOR 04
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-[8px] sm:text-[9px] font-bold text-gray-400 font-orbitron tracking-widest">THREAT</div>
                        <div className="text-[10px] sm:text-xs font-bold text-cyber-pink">EXTREME</div>
                    </div>
                </div>

                <div className="mt-auto p-4 sm:p-5 lg:p-8 space-y-3 lg:space-y-4 z-20 relative">
                  <div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-cyber-blue font-orbitron mb-0.5 lg:mb-1 tracking-widest">ACTIVE MISSION</div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-orbitron text-white leading-none mb-0.5 lg:mb-1">VOID GATEWAY</h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs line-clamp-2">Geometric anomalies detected. Intercept and neutralize immediately.</p>
                  </div>
                  
                  <button 
                    onClick={() => onNavigate(Screen.BATTLE)}
                    className="w-full h-12 sm:h-14 lg:h-16 bg-white text-black rounded-xl font-orbitron font-black text-sm sm:text-base tracking-widest hover:bg-cyber-blue transition-all active:scale-95 flex items-center justify-center space-x-2 sm:space-x-3 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <Play fill="black" size={18} />
                    <span>DEPLOY</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              <StatBrief label="Global Rank" value="#1,248" />
              <StatBrief label="Win Rate" value="78%" />
              <StatBrief label="Power" value="4.2k" />
            </div>

             {/* Mobile-Only Actions List */}
            <div className="lg:hidden flex flex-col space-y-2 sm:space-y-3">
                <h3 className="text-[10px] sm:text-xs font-orbitron font-bold text-gray-500 px-1 tracking-widest uppercase">Daily Ops</h3>
                <OperationCard icon={<Activity size={16} />} title="Patrol Simulation" desc="Collect idle rewards" status="Ready" />
                <OperationCard icon={<ShieldAlert size={16} />} title="Boss Raid" desc="High-tier Loot" status="Locked" locked />
            </div>
          </div>
        </div>

        {/* Right Column: Operations (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col space-y-4">
          <h3 className="text-xs font-orbitron font-bold text-gray-500 px-2 tracking-widest uppercase">Daily Ops</h3>
          <OperationCard icon={<Activity size={20} />} title="Patrol Simulation" desc="Idle rewards collection" status="Ready" />
          <OperationCard icon={<ShieldAlert size={20} />} title="Boss Raid" desc="High-tier Neural Chips" status="Locked" locked />
          <OperationCard icon={<Terminal size={20} />} title="Bounty Hunt" desc="Daily currency bonus" status="5h Rem" />
          
          <div className="mt-auto p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="text-xs font-bold text-white mb-2 font-orbitron">Construct Status</div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500 uppercase">Durability</span>
                <span className="text-cyber-green">100%</span>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyber-green w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntelItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-gray-500 font-rajdhani">{label}</span>
    <span className={`font-bold font-mono ${color}`}>{value}</span>
  </div>
);

const StatBrief = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-white/5 border border-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center backdrop-blur-sm">
    <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 uppercase tracking-tighter mb-0.5 sm:mb-1">{label}</div>
    <div className="text-xs sm:text-sm font-bold font-orbitron">{value}</div>
  </div>
);

const OperationCard = ({ icon, title, desc, status, locked }: { icon: any, title: string, desc: string, status: string, locked?: boolean }) => (
  <button className={`
    w-full flex items-center p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border transition-all text-left group
    ${locked ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed' : 'bg-white/5 border-white/10 hover:border-cyber-blue/50'}
  `}>
    <div className={`
      w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mr-2.5 sm:mr-3 lg:mr-4 transition-colors shrink-0
      ${locked ? 'bg-gray-800 text-gray-600' : 'bg-white/10 text-white group-hover:bg-cyber-blue group-hover:text-black'}
    `}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[11px] sm:text-xs lg:text-sm font-bold text-white truncate">{title}</div>
      <div className="text-[9px] sm:text-[10px] text-gray-500 truncate">{desc}</div>
    </div>
    <div className={`text-[8px] sm:text-[9px] lg:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-black/40 whitespace-nowrap ${status === 'Ready' ? 'text-cyber-green' : 'text-gray-500'}`}>
      {status}
    </div>
  </button>
);

export default HomeScreen;