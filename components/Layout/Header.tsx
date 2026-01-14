import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/storage';
import { Coins, Gem, Zap, User } from 'lucide-react';

const Header: React.FC = () => {
  const { state } = useGame();
  const { stats } = state;

  return (
    <header className="
      fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-[9997]
      lg:relative lg:bg-transparent lg:border-b-0 lg:pt-6 lg:h-auto
    ">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border border-cyber-blue/30 bg-cyber-panel flex items-center justify-center">
            <User size={20} className="text-cyber-blue" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyber-blue text-black font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-cyber-black">
            {stats.level}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="text-[10px] text-gray-500 uppercase font-orbitron tracking-widest">Protocol Instance</div>
          <div className="text-sm font-bold text-white">MK-IX.AEGIS.SYSTEM</div>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-4">
            <ResourceItem icon={<Coins size={14} />} value={formatNumber(stats.gold)} color="text-cyber-yellow" />
            <ResourceItem icon={<Gem size={14} />} value={formatNumber(stats.gems)} color="text-cyber-purple" />
          </div>
          <div className="mt-1 w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden hidden md:block border border-white/5">
            <div className="h-full bg-cyber-blue shadow-[0_0_10px_#00F0FF]" style={{ width: `${(stats.energy / stats.maxEnergy) * 100}%` }}></div>
          </div>
        </div>
        
        <div className="h-8 w-px bg-white/10 hidden md:block"></div>

        <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
          <Zap size={14} className="text-cyber-blue" />
          <span className="text-xs font-bold font-mono">{stats.energy}/{stats.maxEnergy}</span>
        </div>
      </div>
    </header>
  );
};

const ResourceItem = ({ icon, value, color }: { icon: React.ReactNode, value: string, color: string }) => (
  <div className="flex items-center space-x-1.5">
    <span className={color}>{icon}</span>
    <span className="text-xs font-bold font-rajdhani">{value}</span>
  </div>
);

export default Header;