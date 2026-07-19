import React from 'react';
import { PageState } from '../../types';
import GlowingFooter from '../GlowingFooter';
import { BlurFade } from '../ui/blur-fade';

interface ContactPageProps {
  onNavigate?: (page: PageState) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between pt-28 md:pt-32">
      <div className="flex-1 flex items-center justify-center px-6 text-center w-full max-w-[1400px] mx-auto mb-16">
        <div className="max-w-lg w-full liquid-glass py-8 px-6 md:px-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan" />
          
          <BlurFade delay={0.05} duration={0.6}>
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 text-white">传输结束</h2>
          </BlurFade>
          
          <BlurFade delay={0.15} duration={0.6}>
            <p className="text-gray-400 font-rajdhani text-sm md:text-base mb-6 max-w-md mx-auto">
              感谢访问档案。如果您希望启动协作协议或获取特定数据资产，请在下方建立连接。
            </p>
          </BlurFade>

          <BlurFade delay={0.25} duration={0.6}>
            <form className="space-y-4 text-left max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
                <div className="group">
                    <label className="block text-[10px] font-orbitron text-gray-500 mb-1 tracking-widest group-focus-within:text-neon-cyan transition-colors">识别码 (姓名)</label>
                    <input type="text" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-neon-cyan/50 focus:bg-black/50 focus:outline-none transition-all" placeholder="您的姓名" />
                </div>
                <div className="group">
                    <label className="block text-[10px] font-orbitron text-gray-500 mb-1 tracking-widest group-focus-within:text-neon-cyan transition-colors">频率 (邮箱)</label>
                    <input type="email" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-neon-cyan/50 focus:bg-black/50 focus:outline-none transition-all" placeholder="email@sector.com" />
                </div>
                <div className="group">
                    <label className="block text-[10px] font-orbitron text-gray-500 mb-1 tracking-widest group-focus-within:text-neon-cyan transition-colors">数据包 (内容)</label>
                    <textarea rows={3} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-neon-cyan/50 focus:bg-black/50 focus:outline-none transition-all" placeholder="留言内容..." />
                </div>
                <button type="submit" className="w-full bg-neon-cyan text-black text-sm font-bold font-orbitron py-3 rounded-xl hover:bg-white hover:scale-[1.02] transition-all shadow-lg shadow-neon-cyan/20">
                    发送传输
                </button>
            </form>
          </BlurFade>

          <BlurFade delay={0.35} duration={0.6} className="mt-8 pt-4 border-t border-white/5 text-[10px] text-gray-600 font-mono">
            系统状态：正常 <br/>
            © 2026 谢东东. 版权所有.
          </BlurFade>
        </div>
      </div>
      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default ContactPage;
