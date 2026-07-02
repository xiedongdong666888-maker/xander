import React from 'react';
import { WORK_ITEMS } from '../../constants';
import { PageState } from '../../types';
import GlowingFooter from '../GlowingFooter';

interface CatalogPageProps {
  onNavigate?: (page: PageState) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-28 md:pt-32 flex flex-col justify-between">
      <div className="px-6 md:px-24 max-w-6xl mx-auto w-full mb-16">
        <h1 className="text-4xl font-orbitron font-bold mb-12 border-b border-neon-cyan/30 pb-4 inline-block">
          主索引
        </h1>

        <div className="glass-panel rounded-lg overflow-hidden border border-white/5 bg-black/20 backdrop-blur-md">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-xs font-orbitron text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">编号</div>
            <div className="col-span-5 md:col-span-4">标题</div>
            <div className="col-span-3 md:col-span-3">类别</div>
            <div className="col-span-3 md:col-span-2 text-right">日期</div>
            <div className="hidden md:block col-span-2 text-right">状态</div>
          </div>

          {WORK_ITEMS.map((item, index) => (
            <div 
              key={item.id}
              className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800/50 hover:bg-neon-cyan/5 transition-colors items-center font-rajdhani text-lg group"
            >
              <div className="col-span-1 text-neon-purple font-mono text-sm opacity-70">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="col-span-5 md:col-span-4 font-bold text-white group-hover:text-neon-cyan transition-colors truncate">
                {item.title}
              </div>
              <div className="col-span-3 md:col-span-3 text-gray-400 text-sm md:text-base">
                {item.category}
              </div>
              <div className="col-span-3 md:col-span-2 text-right text-gray-500 font-mono text-sm">
                {item.year}
              </div>
              <div className="hidden md:block col-span-2 text-right">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  已归档
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default CatalogPage;
