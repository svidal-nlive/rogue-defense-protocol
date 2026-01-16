import React from 'react';
import { Screen } from '../../types';
import { ShoppingCart, User, Swords, Zap, Pentagon, Target } from 'lucide-react';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: Screen.SHOP, label: 'Shop', icon: ShoppingCart },
    { id: Screen.GUARDIAN, label: 'Guardian', icon: User },
    { id: Screen.HOME, label: 'Battle', icon: Swords, primary: true },
    { id: Screen.MISSIONS, label: 'Missions', icon: Target },
    { id: Screen.SKILLS, label: 'Skill', icon: Pentagon },
    { id: Screen.BATTLE, label: 'Sim', icon: Zap, hidden: true },
  ];

  return (
    <>
      {/* Container: 
          Portrait: h-20 w-full fixed bottom, or relative in flex stack. 
          Landscape: w-24 h-full border-r.
      */}
      <div className="
        w-full h-20 border-t border-white/10 bg-cyber-dark/95 backdrop-blur-md px-2 pb-2
        landscape:w-24 landscape:h-full landscape:border-t-0 landscape:border-r landscape:pt-6 landscape:pb-0 landscape:px-0 landscape:bg-black/90
        lg:w-24 lg:h-full lg:border-t-0 lg:border-r lg:pt-6 lg:pb-0 lg:px-0 lg:bg-black/90
        flex landscape:flex-col lg:flex-col items-center justify-around landscape:justify-start lg:justify-start landscape:space-y-8 lg:space-y-8
      ">
        {/* Logo area for Landscape only */}
        <div className="hidden landscape:flex lg:flex flex-col items-center mb-4">
           <div className="w-10 h-10 rounded bg-cyber-blue flex items-center justify-center font-bold text-black font-orbitron">RD</div>
        </div>

        {navItems.filter(item => !item.hidden).map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          
          if (item.primary) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative -top-6 landscape:top-0 lg:top-0 group"
              >
                <div className={`
                  w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center
                  bg-gradient-to-b from-cyber-blue to-blue-700
                  shadow-[0_0_20px_rgba(0,240,255,0.5)]
                  border-2 border-white/20
                  transition-transform duration-200 group-active:scale-95
                `}>
                  <Icon size={24} className="text-white drop-shadow-md md:w-7 md:h-7" />
                </div>
                <span className="
                  absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-cyber-blue font-orbitron tracking-widest
                  landscape:hidden lg:hidden
                ">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex flex-col items-center justify-center w-16
                transition-colors duration-200
                ${isActive ? 'text-cyber-blue' : 'text-gray-500 hover:text-gray-300'}
              `}
            >
              <Icon size={20} className={`md:w-6 md:h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : ''}`} />
              <span className={`text-[9px] mt-1 font-bold tracking-wide uppercase ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default BottomNav;