import React from 'react';
import { PageState } from '../types';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

interface GlowingFooterProps {
  onNavigate?: (page: PageState) => void;
}

const GlowingFooter: React.FC<GlowingFooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (page: PageState) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full border-t border-white/5 bg-black/45 backdrop-blur-xl pt-20 pb-12 overflow-hidden mt-24">
      {/* 1. Futuristic Glowing Top Border & Light Leak Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[120px] bg-gradient-to-b from-neon-cyan/12 via-neon-purple/3 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[150px] h-[150px] bg-neon-purple/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[150px] h-[150px] bg-neon-cyan/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-20">
        
        {/* Brand Terminal */}
        <div className="lg:col-span-2 space-y-4">
          <div 
            onClick={() => handleLinkClick(PageState.COVER)}
            className="text-white font-orbitron font-black text-xl tracking-[0.4em] cursor-pointer hover:text-neon-cyan transition-colors duration-300"
          >
            A S T R A L Y N X
          </div>
          <p className="text-gray-400 font-rajdhani text-sm leading-relaxed max-w-sm">
            基于星轨协议的多维数字艺术与超感技术底座。解构物理边界，编码虚实共生的数字宇宙。
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan/80">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
              主量子链路: 就绪 (SECURE CONNECTED)
            </div>
            <div className="text-[10px] font-mono text-gray-500">
              ENCRYPTED PORT // LOCALHOST:3000
            </div>
          </div>
        </div>

        {/* Column 1: Dimension Explore */}
        <div className="space-y-4">
          <h4 className="text-xs font-orbitron font-bold text-white tracking-widest uppercase border-b border-white/10 pb-2">
            维度探索
          </h4>
          <ul className="space-y-2.5 text-xs font-sans">
            <li>
              <button 
                onClick={() => handleLinkClick(PageState.HOME)} 
                className="text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <span>探索大厅 // HUB</span>
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleLinkClick(PageState.CATALOG)} 
                className="text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <span>技术索引 // TECH</span>
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleLinkClick(PageState.WORKS)} 
                className="text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <span>模块作品 // WORKS</span>
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleLinkClick(PageState.ABOUT)} 
                className="text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <span>关于我们 // BIO</span>
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Tech Resonance */}
        <div className="space-y-4">
          <h4 className="text-xs font-orbitron font-bold text-white tracking-widest uppercase border-b border-white/10 pb-2">
            技术栈
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
            <li className="hover:text-neon-purple transition-colors">React 18 + Vite 6</li>
            <li className="hover:text-neon-purple transition-colors">Framer Motion 12</li>
            <li className="hover:text-neon-purple transition-colors">Tailwind v4 Engine</li>
            <li className="hover:text-neon-purple transition-colors">Gemini Cognitive API</li>
          </ul>
        </div>

        {/* Column 3: Sector Coordinates */}
        <div className="space-y-4">
          <h4 className="text-xs font-orbitron font-bold text-white tracking-widest uppercase border-b border-white/10 pb-2">
            星区坐标
          </h4>
          <div className="font-mono text-[11px] text-gray-500 space-y-1.5">
            <div>SECTOR: LANIAP-928</div>
            <div>GRID: 4882-X2</div>
            <div>ORBIT: 22.4 AU</div>
            <div>STATUS: STABLE</div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-20">
        <div className="text-[10px] font-mono text-gray-500 tracking-wider">
          © 2125 ASTRALYNX / ALEX NOVA. 保留所有量子态。
        </div>

        {/* Back To Top Button */}
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 rounded-full text-xs text-gray-400 hover:text-neon-cyan font-orbitron tracking-widest transition-all cursor-pointer"
        >
          <span>回到顶层 / COGNITIVE RETRACT</span>
          <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};

export default GlowingFooter;
