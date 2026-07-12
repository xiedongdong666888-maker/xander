import React from 'react';
import { Fingerprint, MapPin, Mail, Award, GraduationCap, Briefcase, Trophy, Scroll, Star } from 'lucide-react';
import { PageState } from '../../types';
import GlowingFooter from '../GlowingFooter';
import ThreeDShowcase from '../ThreeDShowcase';

interface AboutPageProps {
  onNavigate?: (page: PageState) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-28 md:pt-32 flex flex-col justify-between">
      <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto px-6 md:px-16 mb-24">
        {/* 1. Profile Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* Avatar Area */}
          <div className="lg:col-span-4 relative group mx-auto lg:mx-0 w-full max-w-md">
              <div className="absolute inset-0 bg-neon-cyan/20 blur-[80px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
              
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 relative z-10 shadow-2xl rotate-2 group-hover:rotate-0 transition-all duration-500 bg-gray-900">
                  <img 
                      src="https://i.postimg.cc/Xqzhcyb2/wei-xin-tu-pian-20260208184723-504-10.jpg" 
                      alt="Xie Dongdong" 
                      className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* ID Card Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent border-t border-white/5">
                      <div className="flex justify-between items-end">
                          <div>
                              <h2 className="text-3xl font-orbitron font-bold text-white mb-1">谢东东</h2>
                              <p className="text-neon-cyan font-rajdhani tracking-widest text-sm font-bold">XIE DONGDONG</p>
                          </div>
                          <Fingerprint className="text-white/20" size={40} />
                      </div>
                  </div>
              </div>
          </div>

          {/* Bio Info */}
          <div className="lg:col-span-8 space-y-10">
              <div className="animate-in slide-in-from-right-10 duration-700 fade-in">
                  <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white mb-6 leading-none">
                      数字虚空的 <span className="text-neon-purple block md:inline">构建者</span>
                  </h1>
                  
                  <div className="flex flex-wrap gap-3 text-xs md:text-sm font-orbitron font-bold uppercase tracking-wider text-gray-400 mb-8">
                      <span className="px-4 py-1.5 border border-neon-cyan/30 bg-neon-cyan/5 rounded-full text-neon-cyan">25 Y.O</span>
                      <span className="px-4 py-1.5 border border-white/10 rounded-full flex items-center gap-2">
                          <MapPin size={12} /> 安徽 / 山东
                      </span>
                      <span className="px-4 py-1.5 border border-white/10 rounded-full flex items-center gap-2">
                          <Mail size={12} /> 视觉传达设计
                      </span>
                  </div>

                  <div className="prose prose-invert max-w-none font-rajdhani text-xl text-gray-300 leading-relaxed border-l-2 border-white/10 pl-6">
                      <p className="mb-4">
                          本科毕业于<strong className="text-white">山东艺术学院</strong>，目前于<strong className="text-white">安徽建筑大学</strong>设计创意学院攻读硕士学位。
                      </p>
                      <p>
                         作为新生代设计师，我致力于探索传统文化与现代数字技术的边界。从严谨的品牌全案到实验性的 AIGC 影像创作，我的作品始终追求在“虚”与“实”之间建立情感链接。曾获多项国际与国家级设计大奖，包括华灿奖、ICIAD 视觉设计金奖等。
                      </p>
                  </div>
              </div>

              {/* Education Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="liquid-glass p-6 rounded-xl border-l-4 border-neon-cyan group interactive">
                      <div className="flex items-center justify-between mb-3">
                          <GraduationCap className="text-neon-cyan group-hover:scale-110 transition-transform" size={24} />
                          <span className="px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan text-[10px] font-orbitron tracking-widest">CURRENT</span>
                      </div>
                      <h3 className="text-xl font-bold text-white font-rajdhani">安徽建筑大学</h3>
                      <p className="text-gray-400 text-sm mt-1 font-orbitron">设计创意学院 / 硕士研究生</p>
                  </div>
                  <div className="liquid-glass p-6 rounded-xl border-l-4 border-neon-purple group interactive">
                       <div className="flex items-center justify-between mb-3">
                          <GraduationCap className="text-neon-purple group-hover:scale-110 transition-transform" size={24} />
                          <span className="px-2 py-0.5 rounded bg-neon-purple/10 text-neon-purple text-[10px] font-orbitron tracking-widest">2023</span>
                      </div>
                      <h3 className="text-xl font-bold text-white font-rajdhani">山东艺术学院</h3>
                      <p className="text-gray-400 text-sm mt-1 font-orbitron">视觉传达设计 / 学士</p>
                  </div>
              </div>
          </div>
        </div>

        {/* 3D Holographic Matrix Showcase Section */}
        <div className="w-full mb-24">
          <ThreeDShowcase />
        </div>

        {/* 2. Experience Timeline */}
        <div className="w-full mb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-4">
              <h3 className="text-3xl font-orbitron font-bold text-white mb-4 sticky top-24">
                  <span className="text-neon-cyan">#</span> 项目经历<br/>
                  <span className="text-base font-rajdhani text-gray-500 font-normal">TIMELINE & PROJECTS</span>
              </h3>
           </div>
           <div className="lg:col-span-8 space-y-4">
              <ExperienceCard date="2026.01" title="合肥梅山饭店装饰画设计" role="设计师" />
              <ExperienceCard date="2025.11" title="合肥百戏入皖粒子山水及动效设计" role="视觉/动效设计" />
              <ExperienceCard date="2023.09" title="山东省枣庄市山亭区第一书记展馆设计" role="展馆设计" />
              <ExperienceCard date="2023.03" title="全球艺术家青年共同体“艺术乡建”行动" role="行动团成员" />
           </div>
        </div>

        {/* 3. Awards & Scholarships */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-8">
              <h3 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                  <Trophy className="text-yellow-500" /> 获奖荣誉
              </h3>
              <div className="grid gap-3">
                  <AwardItem 
                      title="米兰国际艺术设计奖「视野无界·向新而生」艺术传媒设计大赛" 
                      award="全国一等奖" 
                      work="石上汉风" 
                      color="text-yellow-400 border-yellow-400/30 bg-yellow-400/10" 
                  />
                  <AwardItem 
                      title="2025 ICIAD 视觉设计奖" 
                      award="金奖" 
                      work="星迹探索" 
                      color="text-yellow-400 border-yellow-400/30 bg-yellow-400/10" 
                  />
                  <AwardItem 
                      title="中国高校计算机大赛移动应用创新赛 (华东赛区)" 
                      award="一等奖" 
                      work="星迹探索" 
                      color="text-yellow-400 border-yellow-400/30 bg-yellow-400/10" 
                  />
                  <AwardItem 
                      title="第九届“两岸新锐设计竞赛·华灿奖” (总赛)" 
                      award="三等奖" 
                      work="星迹探索" 
                      color="text-blue-400 border-blue-400/30 bg-blue-400/10" 
                  />
                  <AwardItem 
                      title="第九届“两岸新锐设计竞赛·华灿奖” (山东赛区)" 
                      award="一等奖" 
                      work="星迹探索" 
                      color="text-yellow-400 border-yellow-400/30 bg-yellow-400/10" 
                  />
                  <AwardItem 
                      title="2025 ICIAD 视觉设计奖" 
                      award="铜奖" 
                      work="Food Journey" 
                      color="text-orange-400 border-orange-400/30 bg-orange-400/10" 
                  />
                  <AwardItem 
                      title="第二届“国韵新生”国际创意设计大赛" 
                      award="银奖" 
                      work="齿轮" 
                      color="text-gray-300 border-gray-300/30 bg-gray-300/10" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <SmallAward title="第三届聚星杯天文文创大赛" award="科普文创奖" work="星迹探索" />
                      <SmallAward title="第四届思政短视频大赛" award="三等奖" work="红色足迹" />
                      <SmallAward title="第二届“国韵新生”创意大赛" award="优秀奖" work="鸳鸾IP" />
                      <SmallAward title="第十七届蓝桥杯全国大学生软件 and 信息技术大赛" award="安徽赛区二等奖" work="夜游" />
                      <SmallAward title="第九届“华灿奖”山东赛区" award="二等奖" work="齿轮一" />
                      <SmallAward title="米兰国际艺术设计奖(省赛)" award="三等奖" work="南阳画像石" />
                  </div>
              </div>
           </div>

           {/* Scholarships Column */}
           <div className="space-y-8">
              <h3 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                  <Scroll className="text-neon-purple" /> 奖学金
              </h3>
              <div className="liquid-glass rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Star size={100} className="text-neon-purple" />
                  </div>
                  <div className="space-y-6 font-rajdhani text-lg relative z-10">
                      <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-2.5"></div>
                          <p className="text-white">山东艺术学院 <span className="text-neon-cyan font-bold">励志奖学金</span></p>
                      </div>
                      <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-neon-purple mt-2.5"></div>
                          <p className="text-white">山东艺术学院 <span className="text-neon-purple font-bold">校级二等奖学金</span></p>
                      </div>
                      <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2.5"></div>
                          <p className="text-gray-300">山东艺术学院 <span className="text-white">校级三等奖学金</span></p>
                      </div>
                      <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2.5"></div>
                          <p className="text-gray-300">山东艺术学院 <span className="text-white">校级单项奖学金</span></p>
                      </div>
                      <div className="flex items-start gap-3 pt-4 border-t border-white/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-white mt-2.5"></div>
                          <p className="text-white">安徽建筑大学 <span className="font-bold">校级三等奖学金</span></p>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

// Helper Components
const ExperienceCard = ({ date, title, role }: any) => (
    <div className="group flex items-center gap-6 p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-neon-cyan/50 interactive">
        <div className="w-24 font-orbitron text-neon-cyan text-sm font-bold tracking-widest">{date}</div>
        <div className="w-[1px] h-10 bg-white/10 group-hover:bg-neon-cyan transition-colors"></div>
        <div className="flex-1">
            <h4 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors font-rajdhani">{title}</h4>
            <p className="text-gray-400 text-sm font-rajdhani mt-0.5">{role}</p>
        </div>
    </div>
);

const AwardItem = ({ title, award, work, color }: any) => (
    <div className="relative overflow-hidden p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all group bg-black/40">
        <div className="flex justify-between items-center relative z-10">
            <div>
                <h4 className="font-bold text-gray-200 text-sm md:text-base font-rajdhani group-hover:text-white transition-colors">{title}</h4>
                <p className="text-xs text-gray-500 mt-1 font-orbitron tracking-wider flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-500"></span> {work}
                </p>
            </div>
            <div className={`font-orbitron font-bold border ${color} px-3 py-1.5 rounded text-xs tracking-wider shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                {award}
            </div>
        </div>
    </div>
);

const SmallAward = ({ title, award, work }: any) => (
     <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex flex-col justify-between">
         <span className="text-xs text-gray-500 font-orbitron mb-1 block">{work}</span>
         <div className="flex justify-between items-end">
             <span className="text-gray-300 font-rajdhani text-sm font-bold truncate pr-2">{title}</span>
             <span className="text-neon-cyan text-xs font-bold whitespace-nowrap">{award}</span>
         </div>
     </div>
);

export default AboutPage;
