import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Play, ZoomIn, ArrowRight, Grid, Eye, Compass, Image, Layers, Sparkles } from 'lucide-react';

interface PhotographyPageProps {
  onClose: () => void;
}

interface PhotoItem {
  url: string;
  category: string;
  title: string;
  location: string;
  camera: string;
}

export default function PhotographyPage({ onClose }: PhotographyPageProps) {
  // 1. STATE & REF MANAGEMENTS
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>('全部');

  // Cooldown / Transition guard for video switcher
  const handleVideoSwitch = (index: number) => {
    if (index === activeVideo || isTransitioning) return;
    setIsTransitioning(true);
    setActiveVideo(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // 1000ms cooldown matching crossfade transition duration
  };

  // Original list of 17 photos, meticulously preserved and classified
  const photos: PhotoItem[] = [
    {
      url: 'https://i.postimg.cc/SRDxtZ0j/1.jpg',
      category: '城市人文',
      title: '城市霓虹折射',
      location: '都市街区',
      camera: 'Sony A7R4 // 50mm f/1.2'
    },
    {
      url: 'https://i.postimg.cc/FsHRJQcV/10.jpg',
      category: '自然风光',
      title: '迷雾山路',
      location: '高山之脊',
      camera: 'Sony A7R4 // 24-70mm GM'
    },
    {
      url: 'https://i.postimg.cc/3xyxnCtJ/11.png',
      category: '静物微光',
      title: '温馨居所角落',
      location: '室内静物',
      camera: 'Fujifilm X-T5 // 35mm f/1.4'
    },
    {
      url: 'https://i.postimg.cc/6pD5S2P7/12.jpg',
      category: '赛博夜幕',
      title: '高耸入云之塔',
      location: '夜间地标',
      camera: 'Sony A7R4 // 16-35mm GM'
    },
    {
      url: 'https://i.postimg.cc/y8wY5gG9/13.png',
      category: '自然风光',
      title: '晨曦红光地平线',
      location: '山巅俯瞰',
      camera: 'Sony A7R4 // 70-200mm GM'
    },
    {
      url: 'https://i.postimg.cc/nh6c5jWv/14.jpg',
      category: '城市人文',
      title: '极简空间几何',
      location: '现代艺术馆',
      camera: 'Fujifilm X-T5 // 18mm f/2'
    },
    {
      url: 'https://i.postimg.cc/FH2sqd6D/15.jpg',
      category: '自然风光',
      title: '蔚蓝天际古树',
      location: '旷野大地',
      camera: 'Sony A7R4 // 24mm f/1.4'
    },
    {
      url: 'https://i.postimg.cc/B63ZZW4b/16.png',
      category: '静物微光',
      title: '温柔眼神',
      location: '室内宠物',
      camera: 'Fujifilm X-T5 // 56mm f/1.2'
    },
    {
      url: 'https://i.postimg.cc/9M2XX3Cy/17.jpg',
      category: '自然风光',
      title: '森林微观叶脉',
      location: '深林探秘',
      camera: 'Sony A7R4 // 90mm Macro'
    },
    {
      url: 'https://i.postimg.cc/MHdprskJ/2.jpg',
      category: '自然风光',
      title: '火烧晚霞港湾',
      location: '海岸公路',
      camera: 'Sony A7R4 // 24-70mm GM'
    },
    {
      url: 'https://i.postimg.cc/NFpjPNhy/3.jpg',
      category: '城市人文',
      title: '传统中式屋脊',
      location: '徽派水乡古镇',
      camera: 'Fujifilm X-T5 // 33mm f/1.4'
    },
    {
      url: 'https://i.postimg.cc/nr0hwd8L/4.png',
      category: '赛博夜幕',
      title: '科幻时空回廊',
      location: '地下建筑',
      camera: 'Sony A7R4 // 12-24mm G'
    },
    {
      url: 'https://i.postimg.cc/pVZrTd9v/5.png',
      category: '静物微光',
      title: '流光炫彩球体',
      location: '交互装置',
      camera: 'Sony A7R4 // 50mm f/1.2'
    },
    {
      url: 'https://i.postimg.cc/Wpnz34DR/6.jpg',
      category: '自然风光',
      title: '幽蓝冰川雪原',
      location: '北国秘境',
      camera: 'Sony A7R4 // 24-70mm GM'
    },
    {
      url: 'https://i.postimg.cc/NG4FM0yL/7.jpg',
      category: '城市人文',
      title: '艺术几何台阶',
      location: '博览中心',
      camera: 'Fujifilm X-T5 // 16mm f/1.4'
    },
    {
      url: 'https://i.postimg.cc/gk2J6PR6/8.jpg',
      category: '自然风光',
      title: '风暴积云公路',
      location: '西部荒野',
      camera: 'Sony A7R4 // 16-35mm GM'
    },
    {
      url: 'https://i.postimg.cc/9FgfdNty/9.jpg',
      category: '赛博夜幕',
      title: '雨夜地面倒影',
      location: '赛博霓虹街区',
      camera: 'Sony A7R4 // 50mm f/1.2'
    }
  ];

  // Video data specification
  const videos = [
    {
      url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4',
      label: '黄金时刻 // Golden Hour'
    },
    {
      url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4',
      label: '镜水微澜 // Still Water'
    },
    {
      url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4',
      label: '林间幽邃 // Deep Woods' // Triggers Dark Mode (Index 2)
    },
    {
      url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4',
      label: '破晓曦光 // Quiet Dawn'
    }
  ];

  const photoCategories = ['全部', '城市人文', '自然风光', '静物微光', '赛博夜幕'];

  const filteredPhotos = selectedPhotoCategory === '全部'
    ? photos
    : photos.filter(p => p.category === selectedPhotoCategory);

  // Apply typography and overflow blocking to body during mounts
  useEffect(() => {
    const originalFont = document.body.style.fontFamily;
    const originalOverflow = document.body.style.overflow;
    
    document.body.style.fontFamily = "'Instrument Serif', serif";
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.fontFamily = originalFont;
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Determine if active video triggers Dark Mode theme
  const isDarkModeActive = activeVideo === 2; // Deep Woods trigger
  const themeTransitionClass = 'transition-colors duration-700 ease-in-out';

  // Lyrical content for each video background
  const videoThemes = [
    {
      badge: "万余人于此捕捉落日温存",
      title: (
        <>
          黄金漫步 <br />
          <span className="italic font-light">定格斜阳余晖</span>
        </>
      ),
      desc: "当日落余光轻抚波涛，冷暖色温在镜头前完美交融，留下一抹温柔与宁静。"
    },
    {
      badge: "在无风镜面里，感知对称平衡",
      title: (
        <>
          镜水微澜 <br />
          <span className="italic font-light">探寻极简对称</span>
        </>
      ),
      desc: "凝望止水，在完美的倒影中倾听，感受虚实相生的极致镜头语言。"
    },
    {
      badge: "漫步空灵林间，体悟生命律动",
      title: (
        <>
          林间幽邃 <br />
          <span className="italic font-light">触碰自然呼吸</span>
        </>
      ),
      desc: "步入洒下微光与晨雾的古林，让快门声与林中静谧达成完美共鸣。"
    },
    {
      badge: "曦光微绽，用镜头礼赞万物苏醒",
      title: (
        <>
          破晓曦光 <br />
          <span className="italic font-light">裁切静谧晨色</span>
        </>
      ),
      desc: "玫瑰色天空与晨雾相互纠缠，在纯净镜头下，定格光线破茧的瞬间。"
    }
  ];

  // Specific high-end styles tailored to the tone of each background video
  const currentTheme = [
    {
      textColor: 'text-[#FFFDF0]',
      subtextColor: 'text-[#FFFDF0]/80',
      badgeColor: 'text-amber-200/90 border-amber-500/30 bg-amber-950/20',
      inputBorder: 'border-amber-500/20',
      btnBg: 'bg-amber-100 hover:bg-amber-50 text-amber-950',
      badgeIconColor: 'text-amber-400'
    },
    {
      textColor: 'text-[#F0FDF4]',
      subtextColor: 'text-[#F0FDF4]/80',
      badgeColor: 'text-emerald-200/90 border-emerald-500/30 bg-emerald-950/20',
      inputBorder: 'border-emerald-500/20',
      btnBg: 'bg-emerald-100 hover:bg-emerald-50 text-emerald-950',
      badgeIconColor: 'text-emerald-400'
    },
    {
      textColor: 'text-[#182C41]',
      subtextColor: 'text-[#182C41]/85',
      badgeColor: 'text-[#182C41]/90 border-[#182C41]/30 bg-[#182C41]/5',
      inputBorder: 'border-[#182C41]/30',
      btnBg: 'bg-[#182C41] hover:bg-[#182C41]/90 text-white',
      badgeIconColor: 'text-emerald-700'
    },
    {
      textColor: 'text-[#FFF5F5]',
      subtextColor: 'text-[#FFF5F5]/80',
      badgeColor: 'text-rose-200/90 border-rose-500/30 bg-rose-950/20',
      inputBorder: 'border-rose-500/20',
      btnBg: 'bg-rose-100 hover:bg-rose-50 text-rose-950',
      badgeIconColor: 'text-rose-400'
    }
  ][activeVideo] || {
    textColor: 'text-white',
    subtextColor: 'text-white/70',
    badgeColor: 'text-white/80 border-white/10 bg-white/5',
    inputBorder: 'border-white/10',
    btnBg: 'bg-white hover:bg-white/90 text-black',
    badgeIconColor: 'text-amber-400'
  };

  const textColorClass = currentTheme.textColor;
  const badgeColorClass = currentTheme.badgeColor;
  const subtextColorClass = currentTheme.subtextColor;

  // Smooth scroll helper to photo section
  const handleScrollToGallery = () => {
    document.getElementById('photography-gallery-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black text-white overflow-y-auto overflow-x-hidden selection:bg-white selection:text-black custom-scrollbar">
      {/* 2. CUSTOM CSS STYLES FOR ANIMATIONS AND COMPONENT GLASS EFFECTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.45);
        }

        @keyframes train-bob {
          0%, 100% { transform: translateY(0) scale(1.03); }
          50% { transform: translateY(-6px) scale(1.03); }
        }
        
        .animate-train-bob {
          animation: train-bob 3s ease-in-out infinite;
        }

        .liquid-glass {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1.2px solid rgba(255, 255, 255, 0.12);
          box-shadow: 
            inset 0 1px 1px 0 rgba(255, 255, 255, 0.15),
            0 8px 32px 0 rgba(0, 0, 0, 0.3);
          position: relative;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .liquid-glass:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.22);
          box-shadow: 
            inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.25),
            0 12px 40px 0 rgba(0, 0, 0, 0.4);
        }
        
        .font-instrument-serif {
          font-family: 'Instrument Serif', serif;
        }
        
        .font-system-ui {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
      `}</style>

      {/* ==========================================
          3. HERO VIEWPORT (100vh SECTION CONTAINER)
          ========================================== */}
      <section id="lumora-hero" className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-between">
        
        {/* BACKGROUND VIDEO LAYERS */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {videos.map((video, idx) => (
            <video
              key={idx}
              src={video.url}
              autoPlay
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                activeVideo === idx ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ mixBlendMode: 'screen' }}
              {...({ referrerPolicy: "no-referrer" } as any)}
            />
          ))}
        </div>

        {/* TRANSPARENT PNG OVERLAY */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-[1] animate-train-bob bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png')",
            transform: 'scale(1.03)',
            mixBlendMode: 'normal'
          }}
        />

        {/* RADIAL GRADIENT VIGNETTE & LIGHT CONTRAST GLOWS */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-[1] bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.5)_100%)]" />

        {/* ==========================================
            4. NAVIGATION (TOP BAR)
            ========================================== */}
        <header className="relative w-full z-10 px-6 sm:px-12 py-6 flex items-center justify-between font-system-ui select-none">
          
          {/* Logo Name */}
          <div 
            onClick={onClose}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <span className="text-white font-instrument-serif italic text-2xl sm:text-3xl tracking-wide group-hover:opacity-80 transition-opacity">
              Lumora
            </span>
            <span className="text-xs text-white/40 tracking-[0.2em] font-light uppercase border-l border-white/20 pl-2.5 hidden sm:inline-block">
              Photologue
            </span>
          </div>

          {/* Desktop Nav Pills */}
          <div className="hidden md:flex items-center gap-4 liquid-glass rounded-full px-2 py-1 shadow-2xl">
            <div className="flex items-center text-white/90 text-sm gap-8 font-light px-4 py-2">
              <span onClick={handleScrollToGallery} className="cursor-pointer hover:text-white transition-colors">光影画廊</span>
              <span onClick={handleScrollToGallery} className="cursor-pointer hover:text-white transition-colors">镜头参数</span>
              <span onClick={handleScrollToGallery} className="cursor-pointer hover:text-white transition-colors">创作理念</span>
              <span onClick={handleScrollToGallery} className="cursor-pointer hover:text-white transition-colors">灵感共鸣</span>
            </div>
            <button 
              onClick={handleScrollToGallery}
              className="bg-white text-black hover:bg-white/90 transition-all duration-300 font-medium px-6 py-2.5 rounded-full text-sm tracking-wide"
            >
              浏览作品
            </button>
          </div>

          {/* Close & Hamburger Container */}
          <div className="flex items-center gap-3">
            {/* Elegant Floating Close Button */}
            <button 
              onClick={onClose}
              className="liquid-glass text-white/80 hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2"
            >
              <X size={14} />
              <span>关闭 / CLOSE</span>
            </button>

            {/* Mobile Nav Hamburger */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-white liquid-glass"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: isMenuOpen ? 90 : 0, scale: isMenuOpen ? 0.75 : 1, opacity: isMenuOpen ? 0 : 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute"
                >
                  <Menu size={20} />
                </motion.div>
                <motion.div 
                  initial={{ rotate: -90, scale: 0.75, opacity: 0 }}
                  animate={{ rotate: isMenuOpen ? 0 : -90, scale: isMenuOpen ? 1 : 0.75, opacity: isMenuOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute"
                >
                  <X size={20} />
                </motion.div>
              </div>
            </button>
          </div>
        </header>

        {/* ==========================================
            5. MOBILE NAVIGATION OVERLAY PANEL
            ========================================== */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center font-system-ui"
            >
              <div className="flex flex-col items-center justify-center space-y-8 select-none text-center">
                {['光影画廊', '镜头参数', '创作理念', '灵感共鸣'].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleScrollToGallery();
                    }}
                    className="text-white text-3xl font-light tracking-wide cursor-pointer hover:text-white/70 transition-all"
                  >
                    {item}
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="pt-8"
                >
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleScrollToGallery();
                    }}
                    className="bg-white text-black font-semibold text-lg px-8 py-3.5 rounded-full shadow-lg active:scale-95 transition-transform"
                  >
                    浏览作品
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==========================================
            6. HERO CONTENT (CENTERED WORK CONTENT)
            ========================================== */}
        <div className="relative w-full z-10 px-6 sm:px-12 flex-1 flex flex-col justify-center items-center text-center select-none font-system-ui transform -translate-y-6 md:-translate-y-12">
          
          {/* Badge */}
          <div 
            className={`px-4 py-1.5 rounded-full text-xs tracking-widest font-light uppercase inline-flex items-center gap-2 mb-6 sm:mb-8 liquid-glass ${badgeColorClass} ${themeTransitionClass}`}
          >
            <Sparkles size={12} className={currentTheme.badgeIconColor} />
            <span>{videoThemes[activeVideo]?.badge || '捕捉光影画卷'}</span>
          </div>

          {/* Heading with line break */}
          <h1 
            className={`text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.1] max-w-4xl font-instrument-serif ${textColorClass} ${themeTransitionClass}`}
          >
            {videoThemes[activeVideo]?.title}
          </h1>

          {/* Subtext description */}
          <p 
            className={`text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mt-6 sm:mt-8 font-light ${subtextColorClass} ${themeTransitionClass}`}
          >
            {videoThemes[activeVideo]?.desc}
          </p>

        </div>

        {/* Video Switcher positioned nicely at the bottom below the window frame */}
        <div className="relative w-full z-10 px-6 sm:px-12 pb-6 sm:pb-10 flex items-center justify-center flex-wrap gap-x-6 sm:gap-x-10 gap-y-4">
          {videos.map((vid, idx) => {
            const isActive = activeVideo === idx;
            const activeColorClass = [
              'text-amber-400 border-amber-400/80 font-medium',
              'text-emerald-400 border-emerald-400/80 font-medium',
              'text-sky-300 border-sky-300/80 font-medium',
              'text-rose-400 border-rose-400/80 font-medium'
            ][idx] || 'text-white border-white font-medium';

            return (
              <button
                key={idx}
                onClick={() => handleVideoSwitch(idx)}
                className={`text-xs sm:text-sm tracking-[0.2em] uppercase font-light pb-1 border-b transition-all duration-300 ${
                  isActive
                    ? activeColorClass
                    : 'text-white/40 border-transparent hover:text-white/80 hover:border-white/20'
                }`}
              >
                {vid.label}
              </button>
            );
          })}
        </div>

      </section>

      {/* ==========================================
          8. DETAILED PHOTOGRAPHY GALLERY & CATEGORIES
          ========================================== */}
      <section 
        id="photography-gallery-section" 
        className="relative w-full min-h-screen bg-[#030014] text-white pt-24 sm:pt-32 pb-32 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-white/10 z-10"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-white/5">
            <div className="space-y-4">
              <span className="text-xs text-neon-cyan tracking-[0.3em] font-medium uppercase font-system-ui flex items-center gap-2">
                <Compass size={14} className="animate-spin-slow" />
                CAPTURE THE TRANSITORY LIGHT
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-instrument-serif italic">
                摄影作品分册 / PHOTOGRAPHY ARCHIVE
              </h2>
              <p className="text-gray-400 font-system-ui max-w-xl text-sm leading-relaxed font-light">
                捕捉大自然的呼吸、都市建筑错综的霓虹以及日常静物中的那一抹温存。精选17幅创作，透过我们的视觉模型和镜头艺术展现，带你进入沉浸式时空美学。
              </p>
            </div>

            {/* Category selection bar */}
            <div className="flex flex-wrap gap-2.5 bg-white/5 p-1.5 rounded-full border border-white/10 liquid-glass font-system-ui">
              {photoCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPhotoCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    selectedPhotoCategory === cat
                      ? 'bg-white text-black shadow-lg scale-105 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry-style Photography Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  key={photo.url}
                  onClick={() => setZoomedImage(photo.url)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 cursor-zoom-in aspect-[3/4]"
                >
                  {/* Photo content */}
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Aesthetic Shadow Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Hover Information Layer */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between font-system-ui">
                    <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-3 py-1 rounded-full border border-white/20 text-white text-[10px] tracking-widest uppercase bg-black/40 backdrop-blur-sm">
                        {photo.category}
                      </span>
                      <span className="text-[10px] font-mono text-white/50">
                        {photo.camera.split('//')[0]}
                      </span>
                    </div>

                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[10px] text-neon-cyan tracking-widest uppercase mb-1 font-mono">{photo.location}</p>
                      <h3 className="text-xl sm:text-2xl font-bold font-instrument-serif text-white tracking-wide italic mb-2">
                        {photo.title}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-white/60 pt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                        <span>{photo.camera}</span>
                        <Eye size={12} className="text-neon-cyan" />
                      </div>
                    </div>
                  </div>

                  {/* Expanding magnifier button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ==========================================
          9. HIGH-END IMAGE ZOOM MODAL LAYER
          ========================================== */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center p-4 cursor-zoom-out select-none"
          >
            {/* Elegant Floating Close Button */}
            <button 
              onClick={() => setZoomedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Main Img Container */}
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={zoomedImage}
              alt="Immersive Photography Detail"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Hint overlay */}
            <div className="absolute bottom-6 font-system-ui text-white/40 text-xs tracking-[0.2em] uppercase bg-black/50 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-sm">
              Click anywhere outside to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
