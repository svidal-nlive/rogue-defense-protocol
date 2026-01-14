import React from 'react';
import { Screen } from '../../types';
import { ShoppingCart, User, Swords, Zap, Pentagon, LayoutGrid } from 'lucide-react';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: Screen.HOME, label: 'Control', icon: LayoutGrid },
    { id: Screen.GUARDIAN, label: 'Construct', icon: User },
    { id: Screen.SKILLS, label: 'Neural', icon: Pentagon },
    { id: Screen.SHOP, label: 'Supply', icon: ShoppingCart },
  ];

  return (
    <nav className="
      z-[10000]
      /* Mobile: Fixed Bottom */
      fixed bottom-0 left-0 right-0 h-20 bg-cyber-dark/80 backdrop-blur-xl border-t border-white/10 px-4 flex items-center justify-around
      /* Desktop: Fixed Sidebar */
      lg:relative lg:h-full lg:w-24 lg:flex-col lg:border-t-0 lg:border-r lg:bg-cyber-dark/40 lg:justify-start lg:pt-8 lg:px-0 lg:space-y-8
    ">
      {/* Desktop Logo */}
      <div className="hidden lg:flex items-center justify-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-cyber-blue to-blue-800 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          <Zap size={24} className="text-white fill-current" />
        </div>
      </div>

      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              flex flex-col items-center justify-center transition-all duration-300 group
              lg:w-full lg:py-2
              ${isActive ? 'text-cyber-blue' : 'text-gray-500 hover:text-gray-300'}
            `}
          >
            <div className={`
              p-2 rounded-lg transition-all duration-300
              ${isActive ? 'bg-cyber-blue/10' : 'group-hover:bg-white/5'}
            `}>
              <Icon size={isActive ? 24 : 22} className={`${isActive ? 'drop-shadow-[0_0_8px_#00F0FF]' : ''}`} />
            </div>
            <span className={`
              text-[10px] font-bold font-orbitron tracking-tighter mt-1 uppercase transition-opacity
              ${isActive ? 'opacity-100' : 'opacity-60'}
            `}>
              {item.label}
            </span>
            {/* Active Indicator Line (Desktop Only) */}
            <div className={`
              hidden lg:block absolute left-0 w-1 h-8 bg-cyber-blue transition-all duration-300 rounded-r-full
              ${isActive ? 'opacity-100' : 'opacity-0 scale-y-0'}
            `} />
          </button>
        );
      })}

      {/* Floating Battle Button (Mobile Only) */}
      <button
        onClick={() => onNavigate(Screen.BATTLE)}
        className="
          lg:hidden -translate-y-8 w-16 h-16 rounded-full bg-gradient-to-b from-cyber-pink to-red-800 flex items-center justify-center shadow-2xl border-4 border-cyber-black active:scale-90 transition-transform
        "
      >
        <Swords size={28} className="text-white" />
      </button>
      
      {/* Desktop Battle Button (At Bottom) */}
      <div className="hidden lg:flex flex-1 items-end pb-8">
        <button
          onClick={() => onNavigate(Screen.BATTLE)}
          className="w-16 h-16 rounded-2xl bg-cyber-pink/10 border border-cyber-pink/50 text-cyber-pink flex items-center justify-center hover:bg-cyber-pink hover:text-black transition-all group"
        >
          <Swords size={28} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;