
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PageState } from '../../types';

interface CoverPageProps {
  onEnter: () => void;
}

const CoverPage: React.FC<CoverPageProps> = ({ onEnter }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative z-10">
      {/* Decorative Circles */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-neon-cyan/20 rounded-full animate-[spin_60s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-neon-purple/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      
      <div className="text-center space-y-6 p-8 relative w-full max-w-5xl">
        <h2 className="text-neon-cyan tracking-[0.5em] text-sm md:text-base font-orbitron animate-pulse">
          谢东东 // 作品集
        </h2>
        
        <h1 className="text-5xl md:text-8xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          星 云
        </h1>
        
        <p className="font-rajdhani text-xl md:text-2xl text-gray-400 tracking-widest uppercase">
          数字艺术 <span className="text-neon-purple mx-2">•</span> 设计 <span className="text-neon-purple mx-2">•</span> 幻想
        </p>

        <div className="mt-12">
          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-neon-cyan text-neon-cyan font-orbitron font-bold tracking-wider hover:bg-neon-cyan hover:text-black transition-all duration-300"
          >
            <span>点击进入</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            <div className="absolute -inset-1 bg-neon-cyan/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-gray-600 font-rajdhani">建立于 2025 // 第七区</p>
      </div>
    </div>
  );
};

export default CoverPage;
