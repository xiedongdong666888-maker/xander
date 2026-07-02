import React from 'react';
import { Home, Grid, List, User, Mail, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageState } from '../types';

interface NavigationProps {
  currentPage: PageState;
  onNavigate: (page: PageState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: PageState.HOME, icon: <Hexagon size={14} />, label: '探索' },
    { id: PageState.CATALOG, icon: <Home size={14} />, label: '技术' },
    { id: PageState.WORKS, icon: <Grid size={14} />, label: '作品' },
    { id: PageState.ABOUT, icon: <List size={14} />, label: '关于我们' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-16 lg:px-24 py-3 md:py-3.5 pointer-events-auto bg-black/40 backdrop-blur-md border-b border-white/5">
      {/* Brand Logo (Left) */}
      <div 
        onClick={() => onNavigate(PageState.COVER)}
        className="text-white font-orbitron font-medium text-xs md:text-sm tracking-[0.3em] cursor-pointer hover:text-neon-cyan transition-colors duration-300"
      >
        A S T R A L Y N X
      </div>

      {/* Central Capsule Navigation Bar */}
      <div className="flex items-center gap-0.5 md:gap-1 bg-black/50 backdrop-blur-md border border-white/10 px-1.5 md:px-2 py-1 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative flex items-center gap-1 px-2.5 md:px-3 py-1 rounded-full transition-all duration-300 cursor-pointer overflow-visible ${
                isActive 
                  ? 'text-neon-cyan' 
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'} flex items-center gap-1`}>
                {item.icon}
                <span className="text-[11px] md:text-xs tracking-widest font-medium font-sans">
                  {item.label}
                </span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-lamp"
                  className="absolute inset-0 w-full bg-neon-cyan/5 rounded-full border border-neon-cyan/25 -z-10 shadow-[0_0_12px_rgba(41,151,255,0.12)]"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Tubelight Top Lamp Element */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-neon-cyan rounded-t-full shadow-[0_0_8px_rgba(41,151,255,0.8)]">
                    <div className="absolute w-10 h-4 bg-neon-cyan/20 rounded-full blur-md -top-1.5 -left-2" />
                    <div className="absolute w-6 h-4 bg-neon-cyan/20 rounded-full blur-sm -top-1" />
                    <div className="absolute w-3 h-3 bg-neon-cyan/20 rounded-full blur-xs top-0 left-1.5" />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}

        {/* User Icon Button (Inside Capsule) */}
        <button
          onClick={() => onNavigate(PageState.ABOUT)}
          className={`group flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 cursor-pointer ${
            currentPage === PageState.ABOUT 
              ? 'bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan shadow-[0_0_12px_rgba(41,151,255,0.12)]' 
              : 'text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          <User size={14} className="group-hover:scale-105 transition-transform duration-300" />
        </button>
      </div>

      {/* Mail Icon (Right) */}
      <button
        onClick={() => onNavigate(PageState.CONTACT)}
        className={`group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 cursor-pointer ${
          currentPage === PageState.CONTACT 
            ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(41,151,255,0.6)]' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Mail size={18} className="group-hover:scale-105 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default Navigation;
