import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Shield, RefreshCw, Zap, ArrowRight, ExternalLink, Globe, Layers, Cpu, Skull, Calendar, ChevronLeft, ChevronRight, Play, Quote } from 'lucide-react';

interface SpiderVersePageProps {
  onClose: () => void;
}

export default function SpiderVersePage({ onClose }: SpiderVersePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Audio setup (using synthetic OSC or a sci-fi glitch sound)
  const playGlitchSound = (freq = 150, type: OscillatorType = 'sawtooth', duration = 0.08) => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context blocked or not supported
    }
  };

  const [videoLoaded, setVideoLoaded] = useState(false);

  // Fallback to start loading even if iframe load event is delayed or fails
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Simulated high-fidelity cyberpunk loading progress over exactly 5 seconds (5000ms) once video is loaded
  useEffect(() => {
    if (!videoLoaded) return;

    const startTime = Date.now();
    const duration = 5000; // exactly 5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(Math.floor(pct));

      // Occasional gentle static clicks as progress grows
      if (Math.random() > 0.85) {
        playGlitchSound(80 + pct * 3, 'square', 0.06);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setProgress(100);
        playGlitchSound(440, 'triangle', 0.2); // Loaded notification chime
        setTimeout(() => {
          setIsLoading(false);
        }, 150); // Clean fast transition immediately after 5s
      }
    }, 40); // 40ms interval for butter-smooth progress tracking

    return () => clearInterval(interval);
  }, [videoLoaded, isMuted]);

  const handleClose = () => {
    setIsExiting(true);
    playGlitchSound(80, 'sawtooth', 0.4);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const images = [
    'https://i.postimg.cc/3wd3ZLK1/13.png',
    'https://i.postimg.cc/Y21M8LH7/14.png',
    'https://i.postimg.cc/zDn8pHrz/15.png',
    'https://i.postimg.cc/CL7Ypy5c/16.png',
    'https://i.postimg.cc/tCpycRqD/17.png',
    'https://i.postimg.cc/pLdv20nL/18.png',
    'https://i.postimg.cc/y8NKVfSN/19.png'
  ];

  const categories = [
    { name: '蜘蛛侠：纵横宇宙', tag: '故障美学' },
    { name: '数码故障包装', tag: '工业设计' },
    { name: '多元跨界维度', tag: '身份标志' },
    { name: '街头潮流胶囊', tag: '时尚潮牌' }
  ];

  return (
    <>
      {/* GLOBAL GLITCH STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;700&family=Space+Grotesk:wght@400;700&display=swap');
        
        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }
        .font-rajdhani {
          font-family: 'Rajdhani', sans-serif;
        }
        .font-space {
          font-family: 'Space Grotesk', sans-serif;
        }

        @keyframes glitch-anim {
          0% { clip-path: inset(40% 0 61% 0); transform: skew(0.3deg); }
          20% { clip-path: inset(92% 0 1% 0); transform: skew(-0.5deg); }
          40% { clip-path: inset(15% 0 80% 0); transform: skew(0.5deg); }
          60% { clip-path: inset(80% 0 5% 0); transform: skew(-0.3deg); }
          80% { clip-path: inset(3% 0 92% 0); transform: skew(0.8deg); }
          100% { clip-path: inset(40% 0 61% 0); transform: skew(0deg); }
        }
        .glitch-effect::before {
          content: attr(data-text);
          position: absolute;
          left: -2px;
          text-shadow: 2px 0 #ff0055;
          top: 0;
          color: white;
          background: black;
          overflow: hidden;
          clip: rect(0, 900px, 0, 0);
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }
        .glitch-effect::after {
          content: attr(data-text);
          position: absolute;
          left: 2px;
          text-shadow: -2px 0 #00f0ff;
          top: 0;
          color: white;
          background: black;
          overflow: hidden;
          clip: rect(0, 900px, 0, 0);
          animation: glitch-anim 3s infinite linear alternate-reverse;
        }
        .spider-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 0, 85, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.04) 1px, transparent 1px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #03010b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff0055;
          border-radius: 3px;
        }
      `}</style>

      {/* MAIN CONTAINER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isExiting ? {
          scale: 0.35,
          rotate: 3,
          opacity: 0,
          x: "28vw",
          y: "8vh",
          borderRadius: "2.5rem"
        } : {
          scale: 1,
          rotate: 0,
          opacity: 1,
          x: 0,
          y: 0,
          borderRadius: "0px"
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[120] bg-black text-white overflow-hidden font-sans antialiased select-none spider-grid origin-center shadow-[0_30px_70px_rgba(0,0,0,0.85)]"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* ======================================================== */
            /* 1. CYBERPUNK LOADING SCREEN (MATCHES SECOND IMAGE)        */
            /* ======================================================== */
            <motion.div
              key="loading-screen"
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.6, ease: "easeOut" } }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-between py-12 md:py-16 px-6 bg-black text-white overflow-hidden"
            >
              {/* Cinematic Full-screen Background Video (Mathematically Perfect Containment, No Cropping) */}
              <div className="absolute inset-0 z-0 w-full h-full bg-black flex items-center justify-center overflow-hidden pointer-events-none select-none">
                <div className="relative w-[min(100vw,177.77vh)] h-[min(56.25vw,100vh)]">
                  <iframe 
                    src="https://player.mux.com/AmOyIzP7aXwx0179QXy1FyyHgOQj61INtSahvyftWGic?autoplay=true&muted=true&loop=false&controls=false" 
                    onLoad={() => setVideoLoaded(true)}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen" 
                    style={{ border: 0, pointerEvents: 'none' }}
                  />
                </div>
              </div>

              {/* Neon Ambient Background Orbs */}
              <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-[30%] right-[20%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

              {/* Cyberpunk Hologram Elements on Edges */}
              <div className="absolute top-8 left-8 text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase hidden md:block">
                系统状态：稳定运行 // 蛛网核心已激活
              </div>
              
              {/* Sound Toggle */}
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  playGlitchSound(300, 'sine', 0.15);
                }}
                className="absolute top-8 right-8 z-50 p-2.5 rounded-full border border-white/10 hover:border-red-500 hover:text-red-500 transition-all bg-black/40 backdrop-blur"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />}
              </button>

              {/* Red Spider Web SVG Left */}
              <div className="absolute top-0 left-0 w-[400px] h-[400px] opacity-[0.12] text-red-500 pointer-events-none select-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M0,0 Q30,10 50,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <path d="M0,0 Q10,30 50,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <path d="M0,0 Q40,5 50,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <path d="M5,15 Q35,25 45,45" stroke="currentColor" strokeWidth="0.3" fill="none" />
                  <path d="M15,5 Q25,35 45,45" stroke="currentColor" strokeWidth="0.3" fill="none" />
                  <path d="M10,35 Q45,45 35,10" stroke="currentColor" strokeWidth="0.3" fill="none" />
                  <line x1="0" y1="0" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="0" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" />
                  <line x1="20" y1="0" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" />
                </svg>
              </div>

              {/* Blue Spider Web SVG Right */}
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.12] text-cyan-500 pointer-events-none select-none">
                <svg viewBox="0 0 100 100" className="w-full h-full rotate-180">
                  <path d="M0,0 Q30,10 50,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <path d="M0,0 Q10,30 50,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <path d="M0,0 Q40,5 50,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <path d="M5,15 Q35,25 45,45" stroke="currentColor" strokeWidth="0.3" fill="none" />
                  <path d="M15,5 Q25,35 45,45" stroke="currentColor" strokeWidth="0.3" fill="none" />
                  <line x1="0" y1="0" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="0" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" />
                  <line x1="20" y1="0" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" />
                </svg>
              </div>

              {/* 1. TOP: Header [ SPIDER-VERSE ] Box Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10 mt-4"
              >
                <div className="absolute inset-0 rounded bg-gradient-to-r from-red-600 to-cyan-500 blur-sm opacity-60 animate-pulse" />
                <div className="relative px-6 py-1.5 bg-black border border-white/20 text-[11px] md:text-xs tracking-[0.4em] text-white font-black font-mono uppercase rounded flex items-center gap-1.5 shadow-2xl">
                  <span className="text-red-500 font-bold">SPIDER</span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  <span className="text-cyan-400 font-bold">VERSE</span>
                </div>
              </motion.div>

              {/* 2. MIDDLE: Empty Spacer/Aesthetic Balance */}
              <div className="flex-1" />

              {/* 3. BOTTOM: Glitchy Loading Row (Exactly as requested) */}
              <div className="w-full max-w-2xl px-6 flex flex-col items-center gap-4 relative z-10 mb-4">
                {/* Simulated Segmented Progress Bar */}
                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative">
                  <motion.div 
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-600 via-purple-600 to-cyan-400"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                  
                  {/* Digital laser scanning light */}
                  <div 
                    className="absolute top-0 bottom-0 w-24 bg-white/60 blur-[4px] animate-pulse"
                    style={{ left: `${progress - 10}%` }}
                  />
                </div>

                <div className="flex items-center justify-between w-full font-mono text-[10px] md:text-xs text-white/50 tracking-widest uppercase">
                  <span>系统初始化 P2P</span>
                  
                  <span className="text-white flex items-center gap-1.5 font-bold">
                    <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
                    正在加载次元通道 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-cyan-400 font-mono font-black">{progress}%</span>
                  </span>

                  <span>节点_002_传送门</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ======================================================== */
            /* 2. FULL IMMERSIVE SPIDER-MAN DIVERSE DIMENSIONS PAGE     */
            /* ======================================================== */
            <motion.div
              key="showcase-content"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-10 flex flex-col h-full overflow-y-auto custom-scrollbar relative bg-[#03010b]"
            >
              {/* Sci-fi Cyber Grid Lines & Hot Pink Glows in background */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              <div className="absolute top-[10%] left-[25%] w-[450px] h-[450px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />
              <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-[150px] pointer-events-none" />

              {/* Header bar (Perfect Neon Eclipse Menu Style) */}
              <header className="sticky top-0 z-40 bg-[#03010b]/85 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
                {/* Left logo / node status */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-white/50 uppercase">NODE_002 // GLITCH_LAB</span>
                </div>
                
                {/* Center Navigation Links (Matching Neon Eclipse) */}
                <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono tracking-[0.2em] uppercase text-white/60">
                  <span className="cursor-pointer text-[#ff0055] font-bold border-b border-[#ff0055] pb-1 transition-all">主页</span>
                  <span 
                    onClick={() => {
                      document.getElementById('trailers-section')?.scrollIntoView({ behavior: 'smooth' });
                      playGlitchSound(200, 'sine', 0.05);
                    }} 
                    className="cursor-pointer hover:text-white transition-all hover:translate-y-[-1px]"
                  >
                    宣传视频
                  </span>
                  <span 
                    onClick={() => {
                      document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
                      playGlitchSound(220, 'sine', 0.05);
                    }} 
                    className="cursor-pointer hover:text-white transition-all hover:translate-y-[-1px]"
                  >
                    明星潮玩
                  </span>
                  <span 
                    onClick={() => {
                      document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' });
                      playGlitchSound(240, 'sine', 0.05);
                    }} 
                    className="cursor-pointer hover:text-white transition-all hover:translate-y-[-1px]"
                  >
                    数据概览
                  </span>
                  <span 
                    onClick={() => {
                      document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
                      playGlitchSound(260, 'sine', 0.05);
                    }} 
                    className="cursor-pointer hover:text-white transition-all hover:translate-y-[-1px]"
                  >
                    设计图库
                  </span>
                  <span 
                    onClick={() => {
                      document.getElementById('storyline-section')?.scrollIntoView({ behavior: 'smooth' });
                      playGlitchSound(280, 'sine', 0.05);
                    }} 
                    className="cursor-pointer hover:text-white transition-all hover:translate-y-[-1px]"
                  >
                    设计背书
                  </span>
                </nav>

                {/* Right side controls (Glowing Action Button) */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-white/70 hover:text-white transition-all"
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-red-500 animate-pulse" />}
                  </button>

                  <button
                    onClick={() => {
                      playGlitchSound(600, 'sine', 0.2);
                      alert("次元已锁定！周边企划已加入您的跨宇宙收藏夹。");
                    }}
                    className="hidden sm:flex px-4 py-1.5 rounded bg-gradient-to-r from-red-600 to-[#ff0055] text-[10px] font-bold font-mono tracking-widest text-white hover:brightness-110 hover:shadow-[0_0_15px_rgba(255,0,85,0.4)] transition-all uppercase items-center gap-1.5"
                  >
                    立即加入心愿单 🕷️
                  </button>

                  <button
                    onClick={handleClose}
                    className="group px-4 py-1.5 rounded border border-red-500/40 text-[10px] text-red-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all font-mono tracking-widest flex items-center gap-1.5 uppercase"
                  >
                    关闭传送门 <X size={12} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </header>

              {/* CONTENT BODY */}
              <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-24 pb-24">
                
                {/* ======================================================== */}
                {/* SECTION 1: HERO / TRAILERS SECTION                       */}
                {/* ======================================================== */ }
                <div id="trailers-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left scroll-mt-24">
                  
                  {/* Left Column: Trailing Text / Multiverse Stats */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-500/20 text-[10px] text-red-400 tracking-[0.2em] font-mono uppercase rounded">
                      <Zap size={10} className="animate-bounce" /> 商业周边设计 // #002
                    </div>

                    <h2 className="text-sm font-bold tracking-[0.25em] text-[#ff0055] uppercase font-orbitron">
                      宣传视频 / TRAILERS
                    </h2>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                      蜘蛛侠纵横宇宙 <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-fuchsia-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        多元潮玩周边
                      </span>
                    </h1>

                    <p className="text-slate-400 font-sans text-sm md:text-base leading-relaxed">
                      灵感源自索尼动画大作《蜘蛛侠：纵横宇宙》的衍生周边企划。我们将电影中最具颠覆性的“数码故障艺术（Glitch Art）”、美式复古波普（Pop Art）网点与饱和的极光幻彩（Polarized Hologram）完美融合，重构了日常时尚单品。打破次元壁垒，让多元宇宙的概念落实在每一寸材质与光影之间。
                    </p>

                    {/* Highly stylized Multiverse Score (Matching the 9.2/10 Score in reference image) */}
                    <div className="flex items-center gap-4 py-4 border-y border-white/5">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full border border-red-500/30 bg-red-950/15">
                        <span className="text-red-500 font-bold font-orbitron text-lg">★</span>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-orbitron text-white">9.9</span>
                          <span className="text-xs font-mono text-white/40">/ 10</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">
                          基于 3.5K 多元宇宙用户投票
                        </span>
                      </div>
                    </div>

                    {/* Sliding buttons (Matching reference arrow style) */}
                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        onClick={() => {
                          setActiveImageIdx(prev => (prev - 1 + images.length) % images.length);
                          playGlitchSound(180, 'sine', 0.06);
                        }}
                        className="w-10 h-10 rounded-full border border-white/10 hover:border-[#ff0055] hover:text-[#ff0055] flex items-center justify-center transition-all bg-black/40 hover:bg-black/60 group"
                      >
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                      </button>
                      <button 
                        onClick={() => {
                          setActiveImageIdx(prev => (prev + 1) % images.length);
                          playGlitchSound(220, 'sine', 0.06);
                        }}
                        className="w-10 h-10 rounded-full border border-white/10 hover:border-[#ff0055] hover:text-[#ff0055] flex items-center justify-center transition-all bg-black/40 hover:bg-black/60 group"
                      >
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                      <span className="text-xs font-mono text-slate-400 ml-4 tracking-widest">
                        滑动浏览更多潮流装备
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Immersive Media Player with glowing pink shadow */}
                  <div className="lg:col-span-7 relative">
                    {/* Glowing outer Neon Pink frame shadow */}
                    <div className="absolute inset-[-8px] bg-gradient-to-r from-red-600/25 via-[#ff0055]/20 to-cyan-500/25 rounded-2xl blur-2xl opacity-80 pointer-events-none" />
                    
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/15 bg-[#08080C] shadow-[0_0_50px_rgba(255,0,85,0.25)] group">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activeImageIdx}
                          src={images[activeImageIdx]}
                          alt="Spider-Man Product Detail"
                          initial={{ opacity: 0, scale: 1.04 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.45 }}
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>

                      {/* Screen Glitch overlay effect on image hover */}
                      <div className="absolute inset-0 bg-red-500/5 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      {/* Holographic Play HUD in the middle */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-100 group-hover:bg-black/35 transition-all">
                        <motion.button 
                          whileHover={{ scale: 1.15 }}
                          onClick={() => playGlitchSound(520, 'sawtooth', 0.25)}
                          className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-[#ff0055] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,0,85,0.7)] border border-white/20 relative group/play cursor-pointer"
                        >
                          <Play size={20} className="fill-current text-white ml-1" />
                          <div className="absolute inset-[-4px] rounded-full border border-[#ff0055] animate-ping opacity-45 pointer-events-none" />
                        </motion.button>
                      </div>

                      {/* Top & Bottom Overlay HUD */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 flex flex-col justify-between p-6 pointer-events-none">
                        <div className="flex justify-between items-start">
                          <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur border border-[#ff0055]/45 text-[9px] font-mono text-[#ff0055] uppercase tracking-[0.2em]">
                            珍藏物件_0{activeImageIdx + 1} // 活跃状态
                          </span>
                          <span className="text-[10px] font-mono text-white/50 tracking-widest">
                            坐标_X: {204 + activeImageIdx * 12} / Y: 801
                          </span>
                        </div>

                        <div className="text-left">
                          <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
                            {categories[activeImageIdx % categories.length].name}
                          </p>
                          <h3 className="text-xl font-bold tracking-wide text-white font-space">
                            {categories[activeImageIdx % categories.length].tag} 概念设计图
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Page indices indicator below image slider */}
                    <div className="flex justify-center items-center gap-2 mt-4">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveImageIdx(idx);
                            playGlitchSound(150 + idx * 40, 'sine', 0.05);
                          }}
                          className={`h-1.5 transition-all duration-300 rounded-full ${
                            activeImageIdx === idx ? 'w-10 bg-gradient-to-r from-red-500 via-fuchsia-500 to-cyan-400' : 'w-2 bg-white/10 hover:bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 2: FEATURED OPERATIVE / COLLECTIBLE             */}
                {/* ======================================================== */}
                <div id="featured-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left pt-12 border-t border-white/5 scroll-mt-24">
                  
                  {/* Left Column: Large Holographic Character / Next Item Preview */}
                  <div className="lg:col-span-5 relative">
                    <div className="absolute inset-[-5px] bg-cyan-500/10 rounded-2xl blur-lg pointer-events-none" />
                    
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#06040a] group">
                      <img 
                        src={images[(activeImageIdx + 1) % images.length]} 
                        alt="Next artifact preview" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90 group-hover:brightness-100"
                      />
                      {/* Scanline pattern overlay */}
                      <div className="absolute inset-0 bg-scanlines opacity-15 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                      
                      {/* Vertical digital glitch scanning bar */}
                      <div className="absolute left-0 right-0 h-[2px] bg-cyan-400/60 blur-[1px] shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-[bounce_4s_infinite] top-[30%]" />

                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">// 联动预览</span>
                        <h4 className="text-lg font-bold text-white font-orbitron">下一维度潮流珍藏</h4>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Detailed Operative profile card layout */}
                  <div className="lg:col-span-7 space-y-6">
                    <span className="text-xs font-mono text-red-500 uppercase tracking-[0.25em] font-bold block">
                      臻选潮玩收藏 // 明星潮玩
                    </span>

                    <h2 className="text-4xl md:text-5xl font-black font-orbitron uppercase text-white tracking-tight">
                      SPIDER-GLITCH-02
                    </h2>

                    <div className="text-sm font-mono text-[#ff0055] tracking-widest uppercase font-bold">
                      缔造于多元时空 · 生而打破界限
                    </div>

                    <p className="text-slate-400 font-sans text-sm md:text-base leading-relaxed">
                      该款纵横宇宙特别企划周边采用新一代碳合成高分子外壳，辅以主动式数码故障幻彩电镀涂层（Active Hologram Coated）。外观上大胆重现了电影中最具视觉张力的“重叠重影故障滤镜”，在极强日光下能自然折射出高饱和度的品红与青荧色谱。内置的多维度通信蛛网模块更是直接向经典美式波普致敬。
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          playGlitchSound(330, 'triangle', 0.15);
                          alert("正在初始化 AR 实景光影预览...");
                        }}
                        className="px-6 py-2.5 rounded border border-white/20 text-xs font-mono tracking-widest text-white hover:text-[#ff0055] hover:border-[#ff0055] hover:bg-[#ff0055]/5 transition-all uppercase"
                      >
                        查看核心档案
                      </button>
                    </div>

                    {/* Micro Hologram Slider Card Indicator (Reproduces 01 / 04 structure exactly as in image) */}
                    <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setActiveImageIdx(prev => (prev - 1 + images.length) % images.length);
                            playGlitchSound(120, 'sine', 0.05);
                          }}
                          className="text-white/40 hover:text-white transition-all p-1"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <div className="font-mono text-sm tracking-widest">
                          <span className="text-white font-bold">0{activeImageIdx + 1}</span>
                          <span className="text-white/30 mx-1">/</span>
                          <span className="text-white/40">0{images.length}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setActiveImageIdx(prev => (prev + 1) % images.length);
                            playGlitchSound(140, 'sine', 0.05);
                          }}
                          className="text-white/40 hover:text-white transition-all p-1"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      
                      <div className="text-[10px] font-mono text-slate-500 tracking-wider uppercase border-l border-white/10 pl-4">
                        多轴全景旋转系统 // 激活状态
                      </div>
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 3: THE WORLD AT A GLANCE (STUNNING BENTO CARDS)  */}
                {/* ======================================================== */}
                <div id="stats-section" className="space-y-10 pt-12 border-t border-white/5 scroll-mt-24">
                  <div className="text-center space-y-2">
                    <p className="text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase">// 数据流矩阵</p>
                    <h2 className="text-2xl md:text-3xl font-black font-orbitron tracking-widest uppercase text-white">
                      多元宇宙一览
                    </h2>
                  </div>

                  {/* 4 Neon Bordered Cards Matching the Bento Grid style exactly */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                    
                    {/* Card 1: 12+ Earths */}
                    <div className="relative rounded-xl border border-[#00f0ff]/20 bg-gradient-to-b from-[#03010b] to-[#0a0715] p-6 hover:border-[#00f0ff] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-500 group overflow-hidden">
                      {/* Corner glow brackets */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00f0ff]" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00f0ff]" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00f0ff]" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00f0ff]" />
                      
                      <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Layers size={24} />
                      </div>
                      <div className="text-4xl font-black text-white font-orbitron tracking-tight mb-1">
                        12+
                      </div>
                      <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase mb-3">
                        平行时空维度
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed font-sans">
                        跨越不同地球代号的平行时空，提取各维度最具代表性的朋克与数码极光美学，构建统一的产品视觉节点。
                      </p>
                    </div>

                    {/* Card 2: 240+ Factions */}
                    <div className="relative rounded-xl border border-[#ff0055]/20 bg-gradient-to-b from-[#03010b] to-[#15070f] p-6 hover:border-[#ff0055] hover:shadow-[0_0_20px_rgba(255,0,85,0.15)] transition-all duration-500 group overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff0055]" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff0055]" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff0055]" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff0055]" />

                      <div className="text-[#ff0055] mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Skull size={24} />
                      </div>
                      <div className="text-4xl font-black text-white font-orbitron tracking-tight mb-1">
                        240+
                      </div>
                      <div className="text-[10px] font-mono font-bold tracking-widest text-[#ff0055] uppercase mb-3">
                        蜘蛛联盟精英成员
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed font-sans">
                        蜘蛛联盟专属数据库实时同步。不仅是一套静态周边，更是跨次元科技极客和潮流收藏家的精神共鸣。
                      </p>
                    </div>

                    {/* Card 3: 50+ Gear */}
                    <div className="relative rounded-xl border border-yellow-500/20 bg-gradient-to-b from-[#03010b] to-[#151107] p-6 hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] transition-all duration-500 group overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-yellow-500" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-yellow-500" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-yellow-500" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-yellow-500" />

                      <div className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Cpu size={24} />
                      </div>
                      <div className="text-4xl font-black text-white font-orbitron tracking-tight mb-1">
                        50+
                      </div>
                      <div className="text-[10px] font-mono font-bold tracking-widest text-yellow-500 uppercase mb-3">
                        定制潮玩艺术品
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed font-sans">
                        精心打磨的实体潮流周边与极富张力的3D模型库。全系列支持高帧率多轴动态交互，科技感深度拉满。
                      </p>
                    </div>

                    {/* Card 4: Possibilities */}
                    <div className="relative rounded-xl border border-purple-500/20 bg-gradient-to-b from-[#03010b] to-[#110715] p-6 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-500 group overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-purple-500" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-500" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-purple-500" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-500" />

                      <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Globe size={24} />
                      </div>
                      <div className="text-4xl font-black text-white font-orbitron tracking-tight mb-1">
                        ∞
                      </div>
                      <div className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase mb-3">
                        多元命运事件
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed font-sans">
                        打破宿命式的命运闭环。由您亲手定制的周边搭配，每一次组合都是对传统框架和单调秩序的华丽解构。
                      </p>
                    </div>

                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 4: STORYLINE PANORAMA BANNER (MATCHING REFERENCE)*/}
                {/* ======================================================== */}
                <div id="storyline-section" className="relative rounded-2xl overflow-hidden border border-red-500/20 bg-gradient-to-r from-red-950/20 via-purple-950/15 to-[#03010b] p-8 md:p-12 text-left scroll-mt-24 shadow-2xl">
                  {/* Decorative faint background grid */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none" />
                  
                  {/* Neon light source overlay */}
                  <div className="absolute top-0 bottom-0 right-0 w-1/3 bg-gradient-to-l from-red-600/10 to-transparent blur-[60px]" />

                  <div className="max-w-3xl space-y-4 relative z-10">
                    <h4 className="text-[10px] md:text-xs font-mono text-[#ff0055] uppercase tracking-[0.3em] font-bold">
                      // 设计背景：置身多元宇宙，命运本是一场幻象
                    </h4>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight font-orbitron text-white leading-tight uppercase">
                      打破一维桎梏，赋予产品流动的数字故障美学
                    </h2>
                    <p className="text-slate-300 font-sans text-sm md:text-base leading-relaxed">
                      本案深度拆解了《蜘蛛侠：纵横宇宙》的视觉灵魂：将迈尔斯标志性的美式漫画黑白色调、蛛网裂纹与格温的幻彩水粉、朋克剪贴画风相互交织。传统的周边往往止步于印刷标准的Logo，而我们将这些视觉解构在材质、包装与数字HUD界面中。通过极富张力的产品渲染与微缩立体建模，呈现出仿佛下一秒就会闪烁传送穿梭在时空裂隙中的奇诡美感。
                    </p>
                    
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          playGlitchSound(360, 'sawtooth', 0.1);
                          alert("正在接入索尼蜘蛛侠艺术档案库...");
                        }}
                        className="px-6 py-2 rounded bg-transparent border border-red-500/40 hover:border-red-500 hover:bg-red-500/5 text-xs font-mono tracking-widest text-red-400 hover:text-white transition-all uppercase"
                      >
                        了解详情 / READ THE LORE
                      </button>
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 5: GALLERY SHOWCASE & GRID                      */}
                {/* ======================================================== */}
                <div id="gallery-section" className="space-y-8 pt-12 border-t border-white/5 scroll-mt-24 text-left">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-4 gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-widest uppercase font-orbitron text-white">
                        三维图库 <span className="text-red-500">// 3D 渲染图</span>
                      </h2>
                      <p className="text-xs font-mono text-white/40 uppercase mt-1">
                        多元宇宙高分辨率概念潮玩周边三维设计图。
                      </p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 tracking-wider">
                      作品总数: {images.length} // 系统安全
                    </span>
                  </div>

                  {/* 3D artifacts grid with neon borders on hover */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.6, delay: idx * 0.08 }}
                        onClick={() => {
                          setActiveImageIdx(idx);
                          playGlitchSound(200 + idx * 40, 'triangle', 0.08);
                          // Scroll smooth back to top slider if user clicks a grid image
                          document.getElementById('trailers-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`relative group overflow-hidden rounded-xl border border-white/10 bg-[#08080C] aspect-[4/3] cursor-pointer shadow-lg transition-all duration-300 ${
                          activeImageIdx === idx ? 'border-[#ff0055] shadow-[0_0_15px_rgba(255,0,85,0.25)]' : 'hover:border-red-500/40'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Spider-Man artifact ${idx}`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110"
                        />
                        {/* Shading overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#03010b]/95 via-transparent to-transparent opacity-85 group-hover:opacity-60 transition-opacity duration-300" />
                        
                        {/* Interactive info HUD */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <div className="text-left">
                            <span className="text-[9px] font-mono text-red-400/90 tracking-widest uppercase block mb-0.5">
                              稀有珍藏 #{idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white tracking-wider font-space">
                              {categories[idx % categories.length].tag} // 概念设计
                            </span>
                          </div>
                          
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#ff0055] group-hover:text-white flex items-center justify-center text-white/60 transition-all">
                            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Dot sliders indicators below gallery */}
                  <div className="flex justify-center items-center gap-1.5 pt-4">
                    {[0, 1, 2, 3].map((v) => (
                      <span key={v} className={`w-1.5 h-1.5 rounded-full ${v === 0 ? 'bg-[#ff0055]' : 'bg-white/20'}`} />
                    ))}
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 6: QUOTES & TESTIMONIALS SLIDER (MATCHING IMAGE) */}
                {/* ======================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 border-t border-white/5 text-left">
                  
                  {/* Left Quote */}
                  <div className="lg:col-span-5 p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 relative">
                    <Quote size={28} className="text-[#ff0055] opacity-25" />
                    <p className="text-slate-300 text-xs md:text-sm italic leading-relaxed font-sans">
                      “全系列周边的包装故障电镀艺术感太强了，重叠在阳光下折射出极光粉和青色色谱。拿在手里简直感觉像拿到了从次元裂缝掉出来的装备一样，非常有分量与质感！”
                    </p>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">— SPIDER-FAN // EARTH-65</span>
                  </div>

                  {/* Centered Glowing Web Mandala Logo */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 bg-red-600/20 rounded-full blur-md animate-pulse" />
                      <svg className="w-12 h-12 text-[#ff0055] animate-[spin_10s_infinite_linear]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2v20M2 12h20M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" />
                        <circle cx="12" cy="12" r="5" />
                      </svg>
                    </div>
                  </div>

                  {/* Right Quote */}
                  <div className="lg:col-span-5 p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 relative">
                    <Quote size={28} className="text-[#ff0055] opacity-25" />
                    <p className="text-slate-300 text-xs md:text-sm italic leading-relaxed font-sans">
                      “完美的数码故障、波普网格与高饱和极光的融合！索尼纵横宇宙本案的衍生周边绝对是本年度在三维极简主义与潮流科幻美学上最为亮眼的设计，无可挑剔。”
                    </p>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">— CG WORLD REVIEW // EARTH-1610</span>
                  </div>

                </div>

                {/* ======================================================== */}
                {/* SECTION 7: COMING LAUNCH FOOTER BAR (MATCHING IMAGE)   */}
                {/* ======================================================== */}
                <div className="w-full rounded-xl border border-white/10 bg-black/60 backdrop-blur px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#ff0055]" />
                  
                  {/* Left Side: Release Info */}
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded bg-[#ff0055]/10 border border-[#ff0055]/30 flex items-center justify-center text-[#ff0055]">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">即将在 1610 号地球同步发布</span>
                      <span className="text-sm md:text-base font-black font-orbitron text-white tracking-widest uppercase">冬季部署发售 // 2026 年 12 月</span>
                    </div>
                  </div>

                  {/* Middle Side: Supported Client Names (Clean spacing tags) */}
                  <div className="hidden lg:flex items-center gap-6 font-mono text-[9px] text-slate-500 tracking-widest">
                    <span>蛛网系统</span>
                    <span>核心枢纽</span>
                    <span>索尼IP</span>
                    <span>故障实验室</span>
                  </div>

                  {/* Right Side: Glowing pink Wishlist button */}
                  <div>
                    <button
                      onClick={() => {
                        playGlitchSound(440, 'sine', 0.2);
                        alert("恭喜！您已成功向联盟总部预约全系列周边名额。");
                      }}
                      className="px-6 py-2.5 rounded bg-transparent border border-[#ff0055] text-xs font-bold font-mono tracking-widest text-white hover:bg-[#ff0055] hover:shadow-[0_0_20px_rgba(255,0,85,0.5)] transition-all uppercase"
                    >
                      加入蛛网心愿单 🕷️
                    </button>
                  </div>
                </div>

              </div>

              {/* High contrast clean Footer (Matching Reference) */}
              <footer className="py-12 border-t border-white/5 bg-[#020108] text-center space-y-4">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Footer Left: Brand */}
                  <div className="text-lg font-bold font-orbitron tracking-[0.2em] text-[#ff0055]">
                    SPIDER<span className="text-white">VERSE</span>
                  </div>
                  {/* Footer Middle: Monospace Links */}
                  <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono text-slate-500 tracking-wider">
                    <span>设计背景</span>
                    <span>联盟派系</span>
                    <span>时空战区</span>
                    <span>隐私政策</span>
                    <span>使用条款</span>
                  </div>
                  {/* Footer Right: Copy */}
                  <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
                    © 2026 蜘蛛侠：纵横宇宙创意实验室 // 所有时空安全保护已锁定
                  </div>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
