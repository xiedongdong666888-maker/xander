import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowRight, Play, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORK_ITEMS, CATEGORIES } from '../../constants';
import { WorkItem, PageState } from '../../types';
import GlowingFooter from '../GlowingFooter';
import LoaderLab from '../LoaderLab';
import { BlurFade } from '../ui/blur-fade';
import PhotographyPage from './PhotographyPage';

interface WorksPageProps {
  onNavigate?: (page: PageState) => void;
}

const WorksPage: React.FC<WorksPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [transitionState, setTransitionState] = useState<'idle' | 'entering' | 'active' | 'exiting'>('idle');
  const [clickedRect, setClickedRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const handleSelectWork = (work: WorkItem) => {
    if (transitionState !== 'idle') return;
    const imgEl = document.getElementById(`card-img-works-${work.id}`);
    if (imgEl) {
      const rect = imgEl.getBoundingClientRect();
      setClickedRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
      setTransitionState('entering');
    } else {
      setTransitionState('active');
    }
    setSelectedWork(work);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseWork = () => {
    if (transitionState !== 'active') return;
    if (selectedWork) {
      const imgEl = document.getElementById(`card-img-works-${selectedWork.id}`);
      if (imgEl) {
        const rect = imgEl.getBoundingClientRect();
        setClickedRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
    }
    setTransitionState('exiting');
  };

  useEffect(() => {
    if (transitionState === 'entering' && selectedWork) {
      const timer = setTimeout(() => {
        const targetEl = document.getElementById(`detail-media-works-${selectedWork.id}`);
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
        } else {
          setTransitionState('active');
        }
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [transitionState, selectedWork]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseWork();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transitionState, selectedWork]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const detailStaggerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
      }
    }),
    exit: {
      opacity: 0,
      x: 15,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    }
  };

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const filteredWorks = selectedCategory === '全部'
    ? WORK_ITEMS
    : WORK_ITEMS.filter(w => w.category === selectedCategory);

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-20 px-8 md:px-16 lg:px-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div>
          <BlurFade delay={0.05} duration={0.6}>
            <h1 className="text-5xl md:text-6xl font-orbitron font-bold mb-4">作品集类别</h1>
          </BlurFade>
          <BlurFade delay={0.15} duration={0.6}>
            <p className="text-gray-400 font-rajdhani max-w-md text-lg">
              精选项目集合，按类别分类。点击卡片查看详细数据。
            </p>
          </BlurFade>
        </div>
        
        <BlurFade delay={0.25} duration={0.6} className="flex flex-wrap gap-3 bg-white/5 p-1.5 rounded-full backdrop-blur-md border border-white/10 liquid-glass">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 text-sm font-rajdhani font-semibold rounded-full transition-all duration-300 interactive
                ${selectedCategory === cat 
                  ? 'bg-white text-black shadow-lg scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'}
              `}
            >
              {cat}
            </button>
          ))}
        </BlurFade>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorks.map((work) => (
          <div 
            key={work.id}
            onClick={() => handleSelectWork(work)}
            className="liquid-glass rounded-3xl p-3 cursor-pointer group flex flex-col interactive transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(41,151,255,0.15)] hover:border-white/30"
          >
            <div className="aspect-square rounded-2xl overflow-hidden relative mb-4 bg-gray-900">
              <img 
                id={`card-img-works-${work.id}`}
                src={work.imageUrl} 
                alt={work.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110" 
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              
              {/* Overlay Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0 border border-white/20">
                {(work.videoUrl || (work.videoUrls && work.videoUrls.length > 0)) ? <Play size={18} fill="currentColor" /> : <ArrowUpRight size={18} />}
              </div>
            </div>
            
            <div className="px-2 pb-2 mt-auto">
              <div className="flex flex-col">
                 <BlurFade inView delay={0.05}>
                   <h3 className="text-xl font-bold font-rajdhani text-white mb-1 transition-all duration-500 group-hover:text-neon-cyan group-hover:-translate-y-0.5">
                      {work.title}
                   </h3>
                 </BlurFade>
                 <BlurFade inView delay={0.1} className="flex justify-between items-center transform translate-y-2 opacity-60 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <p className="text-sm text-gray-500 font-rajdhani group-hover:text-gray-300 transition-colors">{work.category}</p>
                    <span className="text-xs text-gray-600 font-orbitron group-hover:text-white transition-colors">{work.year}</span>
                 </BlurFade>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* High-End Editorial Modal Layout */}
      <AnimatePresence>
        {selectedWork && (
          selectedWork.id === '11' ? (
            <PhotographyPage onClose={() => {
              setSelectedWork(null);
              setTransitionState('idle');
              document.body.style.overflow = '';
            }} />
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
            animate={{ 
              opacity: transitionState === 'exiting' ? 0 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: transitionState === 'exiting' ? 0 : 1,
              }}
              transition={{ duration: 0.5 }}
              className="w-full md:max-w-7xl h-full md:h-[90vh] bg-[#050508] md:rounded-[2rem] border-0 md:border border-white/10 relative flex flex-col md:flex-row overflow-hidden shadow-2xl"
            >
              
              {/* Close Button - Floating */}
              <button 
                onClick={handleCloseWork}
                className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/10 interactive group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Left Panel: Info */}
              <div className="w-full md:w-[35%] lg:w-[30%] h-auto md:h-full bg-[#050508] border-b md:border-b-0 md:border-r border-white/10 p-8 md:p-12 flex flex-col overflow-y-auto relative z-20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-purple-500 to-transparent opacity-50"></div>
                
                <div className="mb-auto">
                  <motion.div 
                    custom={0}
                    initial="hidden"
                    animate={transitionState === 'active' ? 'visible' : 'hidden'}
                    variants={detailStaggerVariants}
                    className="flex items-center gap-3 mb-8"
                  >
                   <span className="px-3 py-1 rounded-full border border-neon-cyan/30 text-neon-cyan text-[10px] font-orbitron tracking-widest uppercase bg-neon-cyan/5">
                      {selectedWork.category}
                   </span>
                   <span className="h-[1px] flex-1 bg-white/10"></span>
                  </motion.div>

                  <motion.h2 
                    custom={1}
                    initial="hidden"
                    animate={transitionState === 'active' ? 'visible' : 'hidden'}
                    variants={detailStaggerVariants}
                    className="text-4xl md:text-5xl lg:text-6xl font-black font-orbitron text-white leading-tight mb-8 drop-shadow-lg"
                  >
                    {selectedWork.title}
                  </motion.h2>

                  <motion.p 
                    custom={2}
                    initial="hidden"
                    animate={transitionState === 'active' ? 'visible' : 'hidden'}
                    variants={detailStaggerVariants}
                    className="text-gray-400 font-rajdhani text-lg leading-relaxed mb-8"
                  >
                    {selectedWork.description}
                  </motion.p>
                  
                  {/* Metadata Grid */}
                  <motion.div 
                    custom={3}
                    initial="hidden"
                    animate={transitionState === 'active' ? 'visible' : 'hidden'}
                    variants={detailStaggerVariants}
                    className="grid grid-cols-2 gap-y-6 gap-x-4 py-8 border-t border-white/10"
                  >
                      <div>
                          <span className="block text-gray-600 text-[10px] font-orbitron uppercase mb-1 tracking-widest">YEAR</span>
                          <span className="font-rajdhani text-lg text-white">{selectedWork.year}</span>
                      </div>
                      <div>
                          <span className="block text-gray-600 text-[10px] font-orbitron uppercase mb-1 tracking-widest">ID</span>
                          <span className="font-rajdhani text-lg text-white">#{selectedWork.id.padStart(3, '0')}</span>
                      </div>
                      <div>
                          <span className="block text-gray-600 text-[10px] font-orbitron uppercase mb-1 tracking-widest">CLIENT</span>
                          <span className="font-rajdhani text-lg text-white">PONT Inc.</span>
                      </div>
                      <div>
                          <span className="block text-gray-600 text-[10px] font-orbitron uppercase mb-1 tracking-widest">ROLE</span>
                          <span className="font-rajdhani text-lg text-white">Art Direction</span>
                      </div>
                  </motion.div>
                </div>
              </div>

              <div className="mt-8 pt-8 md:pt-0 hidden md:block">
                 <button className="text-sm font-orbitron text-gray-500 hover:text-white flex items-center gap-2 transition-colors interactive">
                    NEXT PROJECT <ArrowRight size={14} />
                 </button>
              </div>
            </div>

            {/* Right Panel: Visual Stream */}
            <div className="w-full md:w-[65%] lg:w-[70%] h-full bg-[#08080A] overflow-y-auto custom-scrollbar relative">
               {selectedWork.id === '12' ? (
                 <div className="p-4 md:p-8">
                   <LoaderLab />
                 </div>
               ) : (
                 <>
                   <div 
                      id={`detail-media-works-${selectedWork.id}`} style={{ opacity: transitionState === 'active' ? 1 : 0 }} className="w-full relative group cursor-zoom-in overflow-hidden"
                      onClick={() => setZoomedImage(selectedWork.imageUrl)}
                   >
                      <img 
                        src={selectedWork.imageUrl} 
                        alt="Cover" 
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent opacity-40 pointer-events-none"></div>
                      
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-xs font-orbitron text-white pointer-events-none">
                         <ZoomIn size={12} /> EXPAND
                      </div>
                   </div>

                   <div className="p-4 md:p-8 space-y-4 md:space-y-8">
                      {selectedWork.embeds && selectedWork.embeds.map((embedCode, idx) => (
                         <div key={`embed-${idx}`} className="relative group rounded-xl overflow-hidden border border-neon-cyan/30 shadow-[0_0_30px_rgba(41,151,255,0.15)] bg-black mb-6 last:mb-0">
                            <div className="aspect-video w-full relative">
                                <div className="w-full h-full absolute inset-0" dangerouslySetInnerHTML={{ __html: embedCode }} />
                            </div>
                            <div className="absolute top-4 left-4 text-[10px] font-orbitron text-neon-cyan bg-black/80 px-2 py-1 rounded backdrop-blur border border-neon-cyan/20">EMBED_DATA 0{idx + 1}</div>
                         </div>
                      ))}

                      {(selectedWork.videoUrls || (selectedWork.videoUrl ? [selectedWork.videoUrl] : [])).map((url, idx) => (
                         <div key={idx} className="relative group rounded-xl overflow-hidden border border-neon-cyan/30 shadow-[0_0_30px_rgba(41,151,255,0.15)] bg-black mb-6 last:mb-0">
                            <video 
                               src={url} 
                               controls 
                               className="w-full h-auto"
                               poster="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIi8+PC9zdmc+"
                               {...({ referrerPolicy: "no-referrer" } as any)}
                            >
                               Your browser does not support the video tag.
                            </video>
                            <div className="absolute top-4 left-4 text-[10px] font-orbitron text-neon-cyan bg-black/80 px-2 py-1 rounded backdrop-blur border border-neon-cyan/20">
                                MOTION_GRAPHIC_DATA { (selectedWork.videoUrls && selectedWork.videoUrls.length > 1) ? `0${idx + 1}` : '' }
                            </div>
                         </div>
                      ))}

                      {selectedWork.detailImages && selectedWork.detailImages.map((img, idx) => (
                         <div 
                           key={idx} 
                           className="relative group overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0A] cursor-zoom-in"
                           onClick={() => setZoomedImage(img)}
                         >
                            <img 
                                src={img} 
                                alt={`Detail ${idx}`}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                                loading="lazy"
                            />
                            <div className="absolute top-4 left-4 text-[10px] font-orbitron text-white/30 bg-black/50 px-2 py-1 rounded backdrop-blur">
                                IMG_0{idx + 1}
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none flex items-center justify-center">
                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" size={32} />
                            </div>
                         </div>
                      ))}
                      
                      {(!selectedWork.detailImages || selectedWork.detailImages.length === 0) && !selectedWork.videoUrl && !selectedWork.videoUrls && !selectedWork.embeds && (
                         <div className="h-64 flex items-center justify-center border border-white/5 rounded-xl border-dashed">
                            <span className="text-gray-600 font-orbitron text-xs tracking-widest">END OF TRANSMISSION</span>
                         </div>
                      )}

                      <div className="pt-16 pb-8 flex justify-center opacity-50">
                          <div className="w-2 h-2 rounded-full bg-white mb-2 animate-bounce"></div>
                      </div>
                   </div>
                 </>
               )}
            </div>
            </div>
          </div>
        </div>
      )}

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setZoomedImage(null)}
        >
           <button 
             className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 group"
             onClick={() => setZoomedImage(null)}
           >
              <X size={24} className="group-hover:scale-110 transition-transform" />
           </button>
           
           <img 
              src={zoomedImage} 
              alt="Zoomed View" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-300 border border-white/5"
              onClick={(e) => e.stopPropagation()}
           />
           
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-xs font-orbitron tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              CLICK OUTSIDE TO CLOSE
           </div>
        </div>
      )}

      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

export default WorksPage;
