import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { WORK_ITEMS } from '../../constants';
import { PageState, WorkItem } from '../../types';
import GlowingFooter from '../GlowingFooter';

// Sub-component for individual parallax work card in HomePage Vertical Timeline
interface TimelineCardProps {
  work: WorkItem;
  onClick: () => void;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ work, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative aspect-[16/10] w-full rounded-2xl overflow-hidden liquid-glass border border-white/10 interactive cursor-none shadow-xl transition-all duration-500 hover:shadow-neon-cyan/20 hover:scale-[1.01]"
    >
      <img 
        src={work.imageUrl} 
        alt={work.title} 
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
      
      {/* Decorative cybernetic UI corners */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-neon-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-neon-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-neon-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-neon-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Gloss reflection overlay */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
        <div className="max-w-[80%]">
          <span className="text-neon-cyan text-xs font-orbitron tracking-widest uppercase mb-1.5 block">
            {work.year} // {work.category}
          </span>
          <h3 className="text-xl md:text-2xl font-bold font-orbitron text-white leading-tight">
            {work.title}
          </h3>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white scale-90 group-hover:scale-100 group-hover:bg-neon-cyan group-hover:border-neon-cyan group-hover:text-black transition-all duration-300">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </motion.div>
  );
};

interface HomePageProps {
  onNavigate: (page: PageState) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, -60]);
  const heroBgY = useTransform(scrollY, [0, 500], [0, 120]);

  const [activeFilter, setActiveFilter] = useState<'全部' | '商业设计' | '比赛精选' | '其他能力'>('全部');
  const [selectedPreview, setSelectedPreview] = useState<WorkItem | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Determine categories to render on the timeline
  const categoriesToRender = activeFilter === '全部'
    ? ['商业设计', '比赛精选', '其他能力'] as const
    : [activeFilter] as const;

  // Flattened array of active works to easily calculate globally alternating positions
  const activeWorksList = WORK_ITEMS.filter(w => activeFilter === '全部' || w.category === activeFilter);

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineContainerRef,
    offset: ["start center", "end center"]
  });

  const timelineProgHeight = useSpring(timelineProgress, { stiffness: 90, damping: 25 });

  const scrollToTimeline = () => {
    timelineContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* 2.1 HERO HEADER SECTION */}
      <section className="h-screen flex flex-col justify-between pt-24 pb-8 md:pb-12 px-6 md:px-16 lg:px-24 relative overflow-hidden select-none">
        {/* Soft elegant neon depth background blur */}
        <motion.div 
          style={{ y: heroBgY }}
          className="absolute right-[-10%] top-[15%] w-[450px] h-[450px] md:w-[650px] md:h-[650px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-900/5 to-transparent blur-[110px] md:blur-[140px] mix-blend-screen pointer-events-none -z-10 animate-pulse"
        />

        {/* Left-Aligned Celestial Headline Group */}
        <motion.div 
          style={{ opacity, y: heroTextY }} 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
          className="relative z-10 flex flex-col justify-center items-start text-left my-auto max-w-2xl md:ml-4 lg:ml-8 translate-y-6 md:translate-y-12"
        >
          {/* Decorative Line Accent */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full border border-neon-cyan/80 flex-shrink-0"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/50 absolute animate-ping"></span>
            </div>
            <div className="w-12 h-[1px] bg-gradient-to-r from-neon-cyan/60 to-transparent"></div>
            <span className="text-[10px] md:text-xs text-neon-cyan/90 tracking-[0.2em] font-orbitron font-medium uppercase">
              THE EDGE OF KNOWING
            </span>
          </div>

          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.08em] text-white mb-6 leading-[1.5]" 
            style={{ fontFamily: "'Plus Jakarta Sans', 'Microsoft YaHei', sans-serif" }}
          >
            踏入数字与时空的 <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-cyan-400 drop-shadow-[0_0_20px_rgba(41,151,255,0.25)]">
              星轨边界
            </span>
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-400/90 font-sans tracking-[0.18em] max-w-lg mb-8 leading-relaxed">
            探索宇宙星河与智能创新的融合艺术，<br className="hidden sm:inline" />
            每一次滚动，都在进入由 AIGC 与沉浸式设计构筑的数字维度。
          </p>

          <button 
            onClick={scrollToTimeline}
            className="group px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500/80 to-indigo-600/85 text-white text-xs md:text-sm font-medium tracking-[0.15em] flex items-center gap-2.5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-none interactive shadow-[0_4px_20px_rgba(6,182,212,0.2)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.4)]"
          >
            开始探索 <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
        
        {/* Bottom Editorial Info Split */}
        <motion.div 
          style={{ opacity }}
          className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12 relative z-10"
        >
          {/* Bottom Left: Display Typography Accent */}
          <div className="flex-1 max-w-2xl text-left flex items-start gap-4 md:-ml-4 lg:-ml-8">
            <div className="relative flex-shrink-0 w-6 h-6 rounded-full border border-neon-cyan/30 flex items-center justify-center mt-1">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-ping absolute" />
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan relative z-10 shadow-[0_0_8px_rgba(41,151,255,0.8)]" />
            </div>
            <div className="space-y-1">
              <h3 
                className="text-sm sm:text-base md:text-lg lg:text-[19px] font-light text-white/95 leading-relaxed tracking-wide" 
                style={{ fontFamily: "'Plus Jakarta Sans', 'Microsoft YaHei', sans-serif" }}
              >
                每一步皆在重构时空轨迹， <br />
                那是来自数字宇宙的 <span className="text-neon-cyan font-medium select-text selection:bg-neon-cyan/20">智能脉冲信号。</span>
              </h3>
            </div>
          </div>

          {/* Bottom Right: Description */}
          <div className="w-full md:w-80 lg:w-[400px] text-left flex-shrink-0 border-l border-white/20 pl-4 md:pl-5">
            <p className="text-xs text-gray-400/90 font-sans leading-relaxed tracking-wider">
              通过编年史时间轴，回溯在商业品牌设计、AIGC 影像技术迭代与沉浸式交互层面的艺术求索之路。以数据为星光，指引创意走向无限边界。
            </p>
          </div>
        </motion.div>
      </section>

      {/* 2.2 TIMELINE BODY */}
      <div className="px-6 md:px-24 pb-48 relative" ref={timelineContainerRef}>
        
        {/* Timeline Header Navigation & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 relative z-10"
        >
          <div>
            <span className="text-neon-cyan font-orbitron text-xs tracking-widest uppercase mb-1.5 block">
              Time Helix Navigator
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-orbitron">项目时间轨迹</h2>
          </div>

          {/* Futuristic Custom Category Switching */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            {(['全部', '商业设计', '比赛精选', '其他能力'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs font-bold font-orbitron rounded-lg transition-all duration-300 cursor-none interactive ${
                  activeFilter === filter 
                    ? 'bg-neon-cyan text-black shadow-[0_0_15px_rgba(41,151,255,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {filter === '全部' ? 'ALL WORKS' : filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Vertical Timeline Paths */}
        <div className="relative">
          
          {/* Static Timeline Axis Line */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-white/10 z-0" />
          
          {/* Glowing Animated Active Scroll-height Progression overlay */}
          <motion.div 
            style={{ scaleY: timelineProgHeight, originY: 0 }}
            className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-neon-cyan via-neon-purple to-cyan-500 shadow-[0_0_12px_rgba(41,151,255,0.7)] z-0 rounded-full"
          />

          {/* Timeline Nodes / Milestones Grid */}
          <div className="space-y-32 relative z-10">
            {categoriesToRender.map((categoryName) => {
              const categoryWorks = WORK_ITEMS.filter(w => w.category === categoryName);
              if (categoryWorks.length === 0) return null;

              return (
                <div key={categoryName} className="space-y-20">
                  {/* Category Section Header Divider */}
                  <div className="flex items-center gap-6 pl-16 md:pl-0 md:justify-center relative py-6">
                    <div className="absolute left-6 md:hidden top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                      <div className={`w-8 h-8 rounded-full border-2 bg-black flex items-center justify-center shadow-lg transition-all ${
                        categoryName === '商业设计' ? 'border-neon-cyan shadow-neon-cyan/20' :
                        categoryName === '比赛精选' ? 'border-neon-purple shadow-neon-purple/20' :
                        'border-white/45 shadow-white/10'
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full animate-ping ${
                          categoryName === '商业设计' ? 'bg-neon-cyan' :
                          categoryName === '比赛精选' ? 'bg-neon-purple' :
                          'bg-white'
                        }`} />
                      </div>
                    </div>
                    <div className="md:text-center z-10 bg-[#030014]/80 px-8 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl relative">
                      <span className="text-[9px] font-orbitron tracking-[0.4em] text-gray-500 block uppercase mb-1">Portfolio Chapter</span>
                      <h3 className="text-lg md:text-xl font-black font-orbitron text-white tracking-widest">{categoryName}</h3>
                    </div>
                  </div>

                  {/* Items for this specific category */}
                  <div className="space-y-24">
                    {categoryWorks.map((work) => {
                      const globalIdx = activeWorksList.findIndex(w => w.id === work.id);
                      const isEven = globalIdx % 2 === 0;
                      
                      return (
                        <div 
                          key={work.id}
                          className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center pl-16 md:pl-0"
                        >
                          {/* Central Node Dot Element */}
                          <div className="absolute left-6 md:left-1/2 top-1.5 md:top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                            <motion.div 
                              whileHover={{ scale: 1.3 }}
                              onClick={() => setSelectedPreview(work)}
                              className={`w-6 h-6 rounded-full bg-[#030014] border-2 flex items-center justify-center cursor-none shadow-[0_0_12px_rgba(41,151,255,0.4)] transition-all ${
                                work.category === '商业设计' ? 'border-neon-cyan shadow-neon-cyan/40' :
                                work.category === '比赛精选' ? 'border-neon-purple shadow-neon-purple/40' :
                                'border-white/50 shadow-white/20'
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full animate-pulse ${
                                work.category === '商业设计' ? 'bg-neon-cyan' :
                                work.category === '比赛精选' ? 'bg-neon-purple' :
                                'bg-white'
                              }`} />
                            </motion.div>
                          </div>

                          {/* Even items: image card on the left, typography on the right */}
                          {/* Odd items: image card on the right, typography on the left */}
                          <div className={`w-full ${isEven ? 'order-1 md:order-1' : 'order-1 md:order-2'}`}>
                            <TimelineCard work={work} onClick={() => setSelectedPreview(work)} />
                          </div>

                          {/* Content details side panel */}
                          <motion.div 
                            initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-8%" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            className={`w-full text-left relative z-10 flex flex-col justify-center py-6 
                              ${isEven ? 'order-2 md:order-2 md:pl-6' : 'order-2 md:order-1 md:items-end md:text-right md:pr-6'}`}
                          >
                            {/* Big transparent outline year background marker */}
                            <div className={`absolute -top-12 md:top-1/2 md:-translate-y-1/2 select-none pointer-events-none font-orbitron font-black text-6xl md:text-9xl text-white/[0.03] z-0 tracking-tighter
                              ${isEven ? 'left-0' : 'left-0 md:left-auto md:right-0'}`}
                            >
                              {work.year}
                            </div>

                            <div className="z-10 text-left md:contents">
                              <div className={`flex flex-wrap gap-2.5 mb-3 items-center ${isEven ? 'justify-start' : 'justify-start md:justify-end'}`}>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-orbitron tracking-widest uppercase border 
                                  ${work.category === '商业设计' ? 'bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan' :
                                    work.category === '比赛精选' ? 'bg-neon-purple/5 border-neon-purple/20 text-neon-purple' :
                                    'bg-white/5 border-white/20 text-white'}`}
                                >
                                  {work.category}
                                </span>
                                <span className="font-mono text-xs text-gray-500">#{work.id.padStart(3, '0')}</span>
                              </div>
                              
                              <h3 
                                onClick={() => setSelectedPreview(work)}
                                className="text-2xl font-bold font-orbitron text-white hover:text-neon-cyan transition-colors cursor-none interactive leading-tight mb-4 inline-block"
                              >
                                {work.title}
                              </h3>
                              
                              <p className={`text-gray-400 font-rajdhani text-lg leading-relaxed max-w-lg mb-6 
                                ${isEven ? 'text-left' : 'text-left md:text-right md:ml-auto'}`}
                              >
                                {work.description}
                              </p>

                              <div className={`flex gap-4 items-center ${isEven ? 'justify-start' : 'justify-start md:justify-end'}`}>
                                <button 
                                  onClick={() => setSelectedPreview(work)}
                                  className="group/btn relative px-5 py-2.5 bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 text-xs text-white hover:text-neon-cyan font-orbitron flex items-center gap-2 tracking-widest transition-all duration-300 cursor-none interactive rounded-lg"
                                >
                                  <span>查看详情 / RETRIEVE DETAILS</span>
                                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 2.3 INTERACTIVE MODAL DETAIL PREVIEW COMPONENT */}
      <AnimatePresence>
        {selectedPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 overflow-y-auto cursor-none py-12 px-6 md:px-24 flex justify-center"
          >
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl rounded-3xl bg-[#030014]/40 border border-white/10 p-6 md:p-12 shadow-2xl h-fit overflow-visible my-auto"
            >
              
              {/* Back button */}
              <button 
                onClick={() => setSelectedPreview(null)}
                className="absolute top-6 right-6 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-neon-cyan hover:text-black hover:border-neon-cyan text-white transition-all duration-300 cursor-none interactive z-30 shadow-lg"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Meta details */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full border border-neon-cyan/30 text-neon-cyan text-[10px] font-orbitron tracking-widest uppercase bg-neon-cyan/5">
                      {selectedPreview.category}
                    </span>
                    <span className="font-mono text-xs text-gray-500">#{selectedPreview.id.padStart(3, '0')}</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black font-orbitron text-white leading-tight mb-8">
                    {selectedPreview.title}
                  </h2>
                  
                  <p className="text-gray-400 font-rajdhani text-lg leading-relaxed mb-8">
                    {selectedPreview.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                    <div>
                      <span className="block text-gray-500 text-[10px] font-orbitron uppercase mb-1 tracking-widest">Time Line Track</span>
                      <span className="font-orbitron font-bold text-lg text-white">{selectedPreview.year}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-[10px] font-orbitron uppercase mb-1 tracking-widest">Aesthetic Tag</span>
                      <span className="font-rajdhani text-lg text-neon-cyan font-bold">{selectedPreview.category}</span>
                    </div>
                  </div>
                </div>

                {/* Media panel (Hero, embeds, details) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Embed Code check */}
                  {selectedPreview.embeds && selectedPreview.embeds.map((embedCode, idx) => (
                    <div key={idx} className="w-full relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]" dangerouslySetInnerHTML={{ __html: embedCode }} />
                  ))}

                  {/* Standard Video fallback check */}
                  {(selectedPreview.videoUrls || (selectedPreview.videoUrl ? [selectedPreview.videoUrl] : [])).map((url, idx) => (
                    <div key={idx} className="w-full relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]">
                      <video 
                        src={url} 
                        controls 
                        playsInline
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-4 left-4 text-[10px] font-orbitron text-neon-cyan bg-black/80 px-2 py-1 rounded backdrop-blur border border-neon-cyan/20">
                        MOTION GRAPHIC RECORD
                      </div>
                    </div>
                  ))}

                  {/* Cover fallback check if no videos present */}
                  {!selectedPreview.embeds && !selectedPreview.videoUrl && !selectedPreview.videoUrls && (
                    <div 
                      onClick={() => setZoomedImage(selectedPreview.imageUrl)}
                      className="w-full aspect-video rounded-2xl overflow-hidden cursor-zoom-in border border-white/10 relative group"
                    >
                      <img 
                        src={selectedPreview.imageUrl} 
                        alt={selectedPreview.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors" />
                    </div>
                  )}

                  {/* Sub-galleries scroll */}
                  {selectedPreview.detailImages && selectedPreview.detailImages.length > 0 && (
                    <div>
                      <span className="block text-gray-400 font-orbitron text-xs tracking-widest mb-4">GALLERY ARTIFACTS ({selectedPreview.detailImages.length})</span>
                      <div className={selectedPreview.id === '11' ? "grid grid-cols-3 gap-3" : "grid grid-cols-2 gap-3"}>
                        {selectedPreview.detailImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setZoomedImage(img)}
                            className={`relative group overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] cursor-zoom-in aspect-video ${selectedPreview.id === '11' ? 'aspect-square' : ''}`}
                          >
                            <img 
                              src={img} 
                              alt={`Detail ${idx + 1}`} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" 
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2.4 DETAIL ZOOM / FULLSCREEN LAYER IMMERSIVE OVERLAY */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 bg-black/98 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button className="absolute top-6 right-6 p-4 rounded-full bg-white/5 border border-white/10 text-white cursor-none interactive">
              <X size={20} />
            </button>
            <motion.img 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 30 }}
              src={zoomedImage} 
              alt="Zoomed" 
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;
