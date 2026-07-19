import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, Volume2, VolumeX, Shield, RefreshCw, Zap, ArrowRight, ExternalLink, Globe, Layers, Cpu, Skull, Calendar, ChevronLeft, ChevronRight, Play, Quote, Pause, SkipForward, Maximize, Download, ShoppingCart, Target, Eye } from 'lucide-react';
import Hls from 'hls.js';

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

interface SpiderVersePageProps {
  onClose: () => void;
}

export default function SpiderVersePage({ onClose }: SpiderVersePageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedThumbIdx, setSelectedThumbIdx] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const [videoBgLoaded, setVideoBgLoaded] = useState(false);

  // Hook up useScroll with container and target refs
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: heroSectionRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 0.95], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.7, 0.95], [0, 0, -45]);

  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Coordinated "Font Disappearing Animation" scroll transforms
  // As soon as the user starts scrolling, the letters/words disperse, blur, and fade out smoothly.
  const topPartY = useTransform(scrollYProgress, [0, 0.26], [0, -50], { clamp: true });
  const topPartOpacity = useTransform(scrollYProgress, [0, 0.26], [1, 0], { clamp: true });
  const topPartBlurRaw = useTransform(scrollYProgress, [0, 0.26], [0, 12], { clamp: true });
  const topPartBlur = useTransform(topPartBlurRaw, v => `blur(${v}px)`);

  const headingScale = useTransform(scrollYProgress, [0, 0.26], [1, 1.15], { clamp: true });
  const headingOpacity = useTransform(scrollYProgress, [0, 0.26], [1, 0], { clamp: true });
  const headingBlurRaw = useTransform(scrollYProgress, [0, 0.26], [0, 20], { clamp: true });
  const headingBlur = useTransform(headingBlurRaw, v => `blur(${v}px)`);
  const headingLetterSpacingRaw = useTransform(scrollYProgress, [0, 0.26], [0, 0.45], { clamp: true });
  const headingLetterSpacing = useTransform(headingLetterSpacingRaw, v => `${v}em`);
  const headingSkewX = useTransform(scrollYProgress, [0, 0.05, 0.1, 0.15, 0.26], [0, -6, 6, -3, 0], { clamp: true });

  const descOpacity = useTransform(scrollYProgress, [0, 0.26], [1, 0], { clamp: true });
  const descY = useTransform(scrollYProgress, [0, 0.26], [0, -30], { clamp: true });
  const descBlurRaw = useTransform(scrollYProgress, [0, 0.26], [0, 10], { clamp: true });
  const descBlur = useTransform(descBlurRaw, v => `blur(${v}px)`);

  const bottomBtnY = useTransform(scrollYProgress, [0, 0.26], [0, 50], { clamp: true });
  const bottomBtnOpacity = useTransform(scrollYProgress, [0, 0.26], [1, 0], { clamp: true });
  const bottomBtnBlurRaw = useTransform(scrollYProgress, [0, 0.26], [0, 8], { clamp: true });
  const bottomBtnBlur = useTransform(bottomBtnBlurRaw, v => `blur(${v}px)`);

  // Background fade and blur scroll transforms starting from 88%
  const bgOpacity = useTransform(scrollYProgress, [0, 0.88, 1.0], [1, 1, 0.25], { clamp: true });
  const bgBlurRaw = useTransform(scrollYProgress, [0, 0.88, 1.0], [0, 0, 12], { clamp: true });
  const bgBlur = useTransform(bgBlurRaw, v => `blur(${v}px)`);

  // Dynamic Scroll-Bound Video Playback Progress Effect
  useEffect(() => {
    if (isLoading) return;
    const video = backgroundVideoRef.current;
    if (!video) return;

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.controls = false;
    
    let hls: Hls | null = null;
    const hlsUrl = "https://stream.mux.com/VBvJ101q1LxGIZWJ2D7aYLZWuWKr4ueXQuNn2y88idwI.m3u8";
    
    let targetTime = 0;
    let lerpedTime = 0;
    let lastSeekTime = 0;
    let isSeeking = false;
    let frameId: number | null = null;
    
    const updateTargetFromProgress = (progressVal: number) => {
      const duration = video.duration || 10;
      targetTime = progressVal * duration;
    };

    const tick = () => {
      const diff = targetTime - lerpedTime;
      
      if (Math.abs(diff) > 0.001) {
        if (Math.abs(diff) < 0.008) {
          lerpedTime = targetTime;
        } else {
          lerpedTime += diff * 0.18;
        }

        const now = performance.now();
        if (!isSeeking && !video.seeking && (now - lastSeekTime > 60)) {
          isSeeking = true;
          video.currentTime = lerpedTime;
          lastSeekTime = now;
        }
      }

      frameId = requestAnimationFrame(tick);
    };

    const handleSeeked = () => {
      isSeeking = false;
    };

    video.addEventListener('seeked', handleSeeked);

    // Initialize Hls.js
    if (Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: false,
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 45,
        maxMaxBufferLength: 60,
        backBufferLength: 90,
        appendErrorMaxRetry: 5
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        let targetIndex = 0;
        let maxHeight = 0;
        let maxBandwidth = 0;
        data.levels.forEach((level, index) => {
          if (level.height && level.height > maxHeight) {
            maxHeight = level.height;
            targetIndex = index;
            maxBandwidth = level.bandwidth;
          } else if (level.height === maxHeight && level.bandwidth > maxBandwidth) {
            targetIndex = index;
            maxBandwidth = level.bandwidth;
          }
        });

        hls!.startLevel = targetIndex;
        hls!.currentLevel = targetIndex;
        hls!.loadLevel = targetIndex;
        hls!.startLoad();
        setVideoBgLoaded(true);
        updateTargetFromProgress(scrollYProgress.get());
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.load();
    }

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      updateTargetFromProgress(latest);
    });

    const handleLoadedMetadata = () => {
      setVideoBgLoaded(true);
      updateTargetFromProgress(scrollYProgress.get());
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleLoadedMetadata);
    video.addEventListener('canplaythrough', handleLoadedMetadata);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    frameId = requestAnimationFrame(tick);

    // Priming video playback to allow seamless seek scrub on touch/click
    const primeVideoPlayback = () => {
      video.play().then(() => {
        video.pause();
        updateTargetFromProgress(scrollYProgress.get());
      }).catch((err) => {
        console.warn("Media playback delayed:", err);
      });
      window.removeEventListener('click', primeVideoPlayback);
      window.removeEventListener('touchstart', primeVideoPlayback);
    };

    window.addEventListener('click', primeVideoPlayback, { passive: true });
    window.addEventListener('touchstart', primeVideoPlayback, { passive: true });

    return () => {
      unsubscribe();
      if (frameId) cancelAnimationFrame(frameId);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleLoadedMetadata);
      video.removeEventListener('canplaythrough', handleLoadedMetadata);
      window.removeEventListener('click', primeVideoPlayback);
      window.removeEventListener('touchstart', primeVideoPlayback);
      if (hls) {
        hls.destroy();
      }
    };
  }, [isLoading, scrollYProgress]);

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
          {isLoading && (
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
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* 2. FULL IMMERSIVE SPIDER-MAN DIVERSE DIMENSIONS PAGE     */}
        {/* ======================================================== */}
        <motion.div
          key="showcase-content"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isLoading ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          ref={scrollContainerRef}
          className={`absolute inset-0 z-10 flex flex-col h-full overflow-y-auto custom-scrollbar relative bg-[#03010b] ${isLoading ? 'pointer-events-none opacity-0 invisible' : 'opacity-100'}`}
        >
              {/* Cinematic Background Video - No dark overlay */}
              <motion.div 
                style={{ opacity: bgOpacity, filter: bgBlur }}
                className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
              >
                <video
                  ref={backgroundVideoRef}
                  className="w-full h-full object-cover select-none pointer-events-none origin-center transition-opacity duration-700"
                  playsInline
                  muted
                  loop={false}
                  autoPlay={false}
                  controls={false}
                />
              </motion.div>

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
                      document.getElementById('shoe-section')?.scrollIntoView({ behavior: 'smooth' });
                      playGlitchSound(230, 'sine', 0.05);
                    }} 
                    className="cursor-pointer hover:text-white transition-all hover:translate-y-[-1px]"
                  >
                    周边战靴
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
              <div className="flex-1 w-full relative z-10 flex flex-col">
                
                {/* Section 1: Hero Video-Scrubbing Wrapper */}
                <div ref={heroSectionRef} className="relative h-[833vh] w-full">
                  {/* Sticky screen container */}
                  <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
                    
                    {/* Hero contents container (floated over the video) */}
                    <motion.div 
                      style={{ opacity: heroOpacity, y: heroY }}
                      className={`w-full max-w-[1536px] mx-auto px-6 md:px-12 py-12 flex flex-col justify-center h-full transition-all duration-300 ${
                        scrollPercent >= 26 ? "pointer-events-none opacity-0 select-none invisible" : "opacity-100"
                      }`}
                    >
                      {/* ======================================================== */}
                      {/* SECTION 1: HERO / TEXT-ONLY LAYOUT (AURELIA INSPIRED)   */}
                      {/* ======================================================== */}
                      <div id="trailers-section" className="w-full flex flex-col justify-between py-8 md:py-16 min-h-[65vh] text-left">
                        {/* Top Row: Meta tag & Description */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 w-full">
                          {/* Left area kept intentionally spacious for modern layout */}
                          <div className="flex-1" />
                          
                          <motion.div 
                            style={{ y: descY, opacity: descOpacity, filter: descBlur }}
                            className="max-w-md md:text-right space-y-3"
                          >
                            <p className="text-sm md:text-base leading-relaxed tracking-wide text-slate-300">
                              我们精心打造跨越维度的视觉体验，在多元宇宙的交界处连接灵感。从数码故障美学（Glitch Art）到先锋街头潮流包装——每一个细节皆具匠心，每一处设计皆有立意。
                            </p>
                            <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
                              SPIDER-MAN: ACROSS THE SPIDER-VERSE
                            </div>
                          </motion.div>
                        </div>

                        {/* Spacer or visual separator line */}
                        <motion.div 
                          style={{ opacity: topPartOpacity }}
                          className="w-full h-[1px] bg-gradient-to-r from-white/10 via-white/5 to-transparent my-8" 
                        />

                        {/* Bottom Row: Main Title & Action Button */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-12 w-full">
                          <div className="space-y-6">
                            <motion.h1 
                              style={{ 
                                scale: headingScale, 
                                opacity: headingOpacity, 
                                filter: headingBlur, 
                                letterSpacing: headingLetterSpacing, 
                                skewX: headingSkewX 
                              }}
                              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight uppercase font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70"
                            >
                              蜘蛛侠纵横宇宙 <br />
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-fuchsia-500 to-cyan-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                                多元潮玩周边
                              </span>
                            </motion.h1>
                            <motion.div 
                              style={{ opacity: headingOpacity, filter: headingBlur }}
                              className="flex items-center gap-3"
                            >
                              <span className="h-[1px] w-8 bg-red-500"></span>
                              <span className="text-[10px] md:text-xs font-mono text-slate-400 tracking-widest uppercase">
                                主设计师 & 艺术总监 / DESIGNER & ART DIRECTOR
                              </span>
                            </motion.div>
                          </div>

                          <motion.div 
                            style={{ y: bottomBtnY, opacity: bottomBtnOpacity, filter: bottomBtnBlur }}
                            className="w-full md:w-auto"
                          >
                            <button
                              onClick={() => {
                                document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
                                playGlitchSound(300, 'sine', 0.1);
                              }}
                              className="group w-full md:w-auto justify-center px-8 py-4 rounded border border-white/20 text-xs font-mono tracking-widest text-white hover:text-[#ff0055] hover:border-[#ff0055] hover:bg-[#ff0055]/5 transition-all uppercase flex items-center gap-4 bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,85,0.05)] hover:shadow-[0_0_30px_rgba(255,0,85,0.15)] cursor-pointer"
                            >
                              探索衍生作品 / EXPLORE WORK
                              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                            </button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* SCI-FI ANIMATION TIMELINE / PROGRESS BAR */}
                    <div className="absolute bottom-12 left-0 right-0 w-full z-30 select-none pointer-events-none">
                      <div className="max-w-[1536px] mx-auto px-6 md:px-12 w-full flex flex-col gap-2">
                        {/* Meta tags and labels */}
                        <div className="flex justify-between items-end font-mono text-[10px] text-slate-400">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="tracking-widest uppercase text-white/80">
                              动画时空扫描 / DIMENSIONAL PLAYBACK SCROLL-BAR
                            </span>
                          </div>
                          <div className="tracking-wider">
                            当前稳定系数 // 进度: <span className="text-red-500 font-bold font-orbitron">{scrollPercent}%</span>
                          </div>
                        </div>

                        {/* Track Bar with Glow */}
                        <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          {/* Active segment with glowing neon colors */}
                          <motion.div 
                            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                            className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 via-fuchsia-500 to-cyan-400 rounded-full"
                          />
                        </div>

                        {/* Secondary telemetry info */}
                        <div className="flex justify-between items-center font-mono text-[9px] text-slate-500">
                          <span>FEED_SOURCE: MUX_STREAMING</span>
                          <span className="uppercase text-slate-500/80">滑动鼠标探索多元时空轨迹 / SCROLL TO PLAY TIMELINE</span>
                          <span>STABILITY_INDEX // 0.9998</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

            {/* Subsequent Sections Wrapper - Scrolls up naturally on top of background video */}
            <div className="w-full max-w-[1536px] mx-auto px-6 md:px-12 py-10 flex flex-col gap-12 pb-20 relative z-20">

                <motion.div 
                  id="featured-section" 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 lg:items-stretch items-start text-left pt-10 pb-12 min-h-[50vh] border-t border-white/5 scroll-mt-24"
                >
                  
                  {/* Left Column: Custom Interactive HLS Video Player */}
                  <div className="lg:col-span-8 relative w-full flex flex-col h-full">
                    <HeadphoneVideoPlayer 
                      isGlobalMuted={isMuted} 
                      playGlitchSound={playGlitchSound} 
                    />
                  </div>

                  {/* Right Column: Detailed Product Profile & Gallery */}
                  <div className="lg:col-span-4 space-y-8 flex flex-col justify-between h-full">
                    <div className="space-y-6">
                      <span className="text-base md:text-lg font-mono text-red-500 uppercase tracking-[0.3em] font-bold block">
                        产品视频
                      </span>

                      <h2 className="text-6xl md:text-7xl lg:text-8xl font-black font-orbitron uppercase text-white tracking-tight leading-none">
                        蜘蛛侠X1
                      </h2>

                      <div className="text-lg md:text-xl font-mono text-[#ff0055] tracking-widest uppercase font-bold">
                        沉浸体验，制胜每一刻
                      </div>

                      <div className="w-full h-[1px] bg-white/10 my-6" />

                      {/* Features Bullet List matching reference */}
                      <div className="space-y-6 text-left">
                        <div className="space-y-2">
                          <h4 className="text-lg md:text-xl font-bold text-white font-sans uppercase tracking-widest">虚拟7.1环绕声</h4>
                          <p className="text-sm md:text-base text-slate-400 font-mono tracking-widest uppercase">精准定位，听声辨位</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-lg md:text-xl font-bold text-white font-sans uppercase tracking-widest">低延迟无线</h4>
                          <p className="text-sm md:text-base text-slate-400 font-mono tracking-widest uppercase">疾速连接，畅快对战</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-lg md:text-xl font-bold text-white font-sans uppercase tracking-widest">长效续航</h4>
                          <p className="text-sm md:text-base text-slate-400 font-mono tracking-widest uppercase">持久陪伴，无惧挑战</p>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Button with Shopping Cart Icon */}
                    <button
                      onClick={() => {
                        playGlitchSound(520, 'triangle', 0.25);
                        setShowPurchaseModal(true);
                      }}
                      className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-sm md:text-base font-bold font-mono tracking-widest text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-[1.02] active:scale-95 transition-all uppercase flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                    >
                      <ShoppingCart size={18} />
                      购买商品
                    </button>

                    {/* Product Details Display (3 1:1 images) */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">// 产品细节展示</span>
                        <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">DETAILS</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          "https://i.postimg.cc/T3hPyMhS/Chat-GPT-Image-2026nian7yue12ri-19-52-59-(2).png",
                          "https://i.postimg.cc/3xWwy5Ws/Chat-GPT-Image-2026nian7yue12ri-19-52-59-(3).png",
                          "https://i.postimg.cc/DwmzWk8V/Chat-GPT-Image-2026nian7yue12ri-21-57-34-(3).png"
                        ].map((url, idx) => (
                          <div 
                            key={idx} 
                            className="aspect-square w-full rounded-lg overflow-hidden border border-white/10 hover:border-red-500/50 bg-black/40 relative group cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                          >
                            <img 
                              src={url} 
                              alt={`Headphone Detail ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                              <span className="text-[9px] font-mono text-white tracking-widest uppercase">0{idx + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ======================================================== */}
                {/* SECTION 2.5: SHOE PERIPHERAL SHOWCASE (曜蛛战靴 X1)      */}
                {/* ======================================================== */}
                <motion.div 
                  id="shoe-section" 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 lg:items-stretch items-start text-left pt-24 pb-12 min-h-[50vh] border-t border-white/5 scroll-mt-24"
                >
                  {/* Left Column: Shoe Interactive Video Player */}
                  <div className="lg:col-span-8 relative w-full flex flex-col h-full">
                    <ShoeVideoPlayer 
                      isGlobalMuted={isMuted} 
                      playGlitchSound={playGlitchSound} 
                    />
                  </div>

                  {/* Right Column: Detailed Shoe Profile & Details Grid (Matching reference 2 perfectly) */}
                  <div className="lg:col-span-4 space-y-8 flex flex-col h-full justify-between">
                    <div className="space-y-6">
                      <span className="text-base md:text-lg font-mono text-red-500 uppercase tracking-[0.3em] font-bold block">
                        产品视频
                      </span>

                      <h2 className="text-5xl md:text-6xl lg:text-7xl font-black font-orbitron uppercase text-white tracking-tight leading-none">
                        曜蛛战靴 <span className="text-red-500">X1</span>
                      </h2>

                      <div className="text-lg md:text-xl font-mono text-cyan-400 tracking-widest uppercase font-bold">
                        凌厉爆发，点亮每一次起跳
                      </div>

                      <div className="w-full h-[1px] bg-white/10 my-6" />

                      {/* 3 Cyber Feature Bullet Points matching reference image */}
                      <div className="space-y-6 text-left">
                        {/* Bullet 1 */}
                        <div className="flex items-center gap-5 group cursor-pointer">
                          <div className="p-3.5 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)] group-hover:bg-red-500 group-hover:text-black transition-all duration-300">
                            <Target size={22} />
                          </div>
                          <div>
                            <h4 className="text-base md:text-lg font-bold text-white uppercase tracking-widest">轻量缓震</h4>
                            <p className="text-xs md:text-sm text-slate-400 tracking-wider">落地回弹，步步有力</p>
                          </div>
                        </div>

                        {/* Bullet 2 */}
                        <div className="flex items-center gap-5 group cursor-pointer">
                          <div className="p-3.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.2)] group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                            <Shield size={22} />
                          </div>
                          <div>
                            <h4 className="text-base md:text-lg font-bold text-white uppercase tracking-widest">动态包裹</h4>
                            <p className="text-xs md:text-sm text-slate-400 tracking-wider">贴合支撑，稳住突破</p>
                          </div>
                        </div>

                        {/* Bullet 3 */}
                        <div className="flex items-center gap-5 group cursor-pointer">
                          <div className="p-3.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/5 text-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.2)] group-hover:bg-fuchsia-500 group-hover:text-black transition-all duration-300">
                            <Eye size={22} />
                          </div>
                          <div>
                            <h4 className="text-base md:text-lg font-bold text-white uppercase tracking-widest">夜光外底</h4>
                            <p className="text-xs md:text-sm text-slate-400 tracking-wider">霓虹流光，锋芒尽显</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Button with Shopping Cart Icon */}
                    <button
                      onClick={() => {
                        playGlitchSound(520, 'triangle', 0.25);
                        setShowPurchaseModal(true);
                      }}
                      className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-sm md:text-base font-bold font-mono tracking-widest text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-[1.02] active:scale-95 transition-all uppercase flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                    >
                      <ShoppingCart size={18} />
                      购买商品
                    </button>

                    {/* Product Details Subsection */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-mono text-slate-400 tracking-wider uppercase">// 产品细节展示</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {/* Detail 1 */}
                        <div className="group cursor-pointer">
                          <div className="aspect-square rounded-lg overflow-hidden border border-white/10 group-hover:border-red-500 transition-all duration-300">
                            <img 
                              src="https://i.postimg.cc/zXD0spPC/Chat-GPT-Image-2026nian7yue12ri-22-27-41-(1).png" 
                              alt="动态光效" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <span className="text-[10px] text-center block mt-1 font-sans text-slate-400 group-hover:text-white transition-colors">
                            动态光效
                          </span>
                        </div>

                        {/* Detail 2 */}
                        <div className="group cursor-pointer">
                          <div className="aspect-square rounded-lg overflow-hidden border border-white/10 group-hover:border-cyan-500 transition-all duration-300">
                            <img 
                              src="https://i.postimg.cc/ZKYVGjDP/Chat-GPT-Image-2026nian7yue12ri-22-27-41-(2).png" 
                              alt="后跟支撑" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <span className="text-[10px] text-center block mt-1 font-sans text-slate-400 group-hover:text-white transition-colors">
                            后跟支撑
                          </span>
                        </div>

                        {/* Detail 3 */}
                        <div className="group cursor-pointer">
                          <div className="aspect-square rounded-lg overflow-hidden border border-white/10 group-hover:border-fuchsia-500 transition-all duration-300">
                            <img 
                              src="https://i.postimg.cc/xTjtwgFy/Chat-GPT-Image-2026nian7yue12ri-22-27-41-(3).png" 
                              alt="夜光大底" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <span className="text-[10px] text-center block mt-1 font-sans text-slate-400 group-hover:text-white transition-colors">
                            夜光大底
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ======================================================== */}
                {/* SECTION 3: THE WORLD AT A GLANCE (STUNNING BENTO CARDS)  */}
                {/* ======================================================== */}
                <motion.div 
                  id="stats-section" 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-10 pt-24 border-t border-white/5 scroll-mt-24"
                >
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
                </motion.div>

                {/* ======================================================== */}
                {/* SECTION 4: STORYLINE PANORAMA BANNER (MATCHING REFERENCE)*/}
                {/* ======================================================== */}
                <motion.div 
                  id="storyline-section" 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-2xl overflow-hidden border border-red-500/20 bg-gradient-to-r from-red-950/20 via-purple-950/15 to-[#03010b] p-8 md:p-12 text-left scroll-mt-24 shadow-2xl"
                >
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
                </motion.div>

                {/* ======================================================== */}
                {/* SECTION 5: GALLERY SHOWCASE & GRID                      */}
                {/* ======================================================== */}
                <motion.div 
                  id="gallery-section" 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8 pt-24 border-t border-white/5 scroll-mt-24 text-left"
                >
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
                </motion.div>

                {/* ======================================================== */}
                {/* SECTION 6: QUOTES & TESTIMONIALS SLIDER (MATCHING IMAGE) */}
                {/* ======================================================== */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 border-t border-white/5 text-left"
                >
                  
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

                </motion.div>

                {/* ======================================================== */}
                {/* SECTION 7: COMING LAUNCH FOOTER BAR (MATCHING IMAGE)   */}
                {/* ======================================================== */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full rounded-xl border border-white/10 bg-black/60 backdrop-blur px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
                >
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
                </motion.div>

              </div>
            </div>

              {/* High contrast clean Footer (Matching Reference) */}
              <footer className="py-12 border-t border-white/5 bg-[#020108] text-center space-y-4">
                <div className="max-w-[1536px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
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

              {/* ======================================================== */}
              {/* CYBERPUNK PURCHASE PROTOCOL POPUP                        */}
              {/* ======================================================== */}
              <AnimatePresence>
                {showPurchaseModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 20, rotate: -1 }}
                      animate={{ scale: 1, y: 0, rotate: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="max-w-md w-full bg-[#080512] border-2 border-red-500/50 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.3)] text-left"
                    >
                      {/* Neon Top Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-fuchsia-500 to-cyan-500" />
                      
                      {/* Corner details */}
                      <div className="absolute top-2 right-2 text-red-500/30 font-mono text-[9px] uppercase tracking-widest select-none">
                        SECURE_TRANSACTION_PROTOCOL_002
                      </div>

                      <div className="space-y-6">
                        {/* Icon + Title */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 animate-pulse">
                            <ShoppingCart size={22} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold font-orbitron uppercase text-white tracking-wider">
                              次元协议已建立
                            </h3>
                            <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                              TRANSACTION ACQUIRED // SUCCESS
                            </p>
                          </div>
                        </div>

                        <div className="w-full h-[1px] bg-white/10" />

                        {/* Order Specifications */}
                        <div className="space-y-2 font-mono text-xs text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">产品型号:</span>
                            <span className="text-white font-bold">曜蛛战靴 X1</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">部署节点:</span>
                            <span className="text-white">NODE_002_GLITCH_LAB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">目标宿主:</span>
                            <span className="text-red-400 font-bold">xiedongdong666888@gmail.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">发货时空:</span>
                            <span className="text-cyan-400">EARTH-1610 (多元宇宙特快)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">状态编码:</span>
                            <span className="text-green-400 animate-pulse">✓ 正在打包传送中...</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed font-sans text-center">
                          感谢向蜘蛛联盟总部预定限量版周边。我们已为您开通次元速递。
                        </p>

                        <button
                          onClick={() => {
                            playGlitchSound(200, 'sine', 0.05);
                            setShowPurchaseModal(false);
                          }}
                          className="w-full py-2.5 rounded-xl bg-white text-black font-bold font-mono tracking-widest hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all uppercase text-center text-xs cursor-pointer"
                        >
                          确认并关闭通道
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
      </motion.div>
    </>
  );
}

interface HeadphoneVideoPlayerProps {
  isGlobalMuted: boolean;
  playGlitchSound: (freq?: number, type?: OscillatorType, duration?: number) => void;
}

function HeadphoneVideoPlayer({ isGlobalMuted, playGlitchSound }: HeadphoneVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = isGlobalMuted;
        setIsMuted(isGlobalMuted);
      }
    }
  }, [isGlobalMuted, isFullscreen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleFullscreenChange = () => {
      const activeFs = 
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement;
      
      const isFs = activeFs === video;
      setIsFullscreen(isFs);
      if (isFs) {
        video.muted = false;
        setIsMuted(false);
      } else {
        video.muted = true;
        setIsMuted(true);
      }
    };

    const handleWebkitBeginFullscreen = () => {
      setIsFullscreen(true);
      video.muted = false;
      setIsMuted(false);
    };

    const handleWebkitEndFullscreen = () => {
      setIsFullscreen(false);
      video.muted = true;
      setIsMuted(true);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    video.addEventListener('webkitbeginfullscreen', handleWebkitBeginFullscreen);
    video.addEventListener('webkitendfullscreen', handleWebkitEndFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      if (video) {
        video.removeEventListener('webkitbeginfullscreen', handleWebkitBeginFullscreen);
        video.removeEventListener('webkitendfullscreen', handleWebkitEndFullscreen);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const hlsUrl = "https://stream.mux.com/mW9legAEU6K004SkghXwJe801b2p3sfQ3DqGBvG01rxacI.m3u8";

    if (Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: true,
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
    }

    const handleTimeUpdate = () => {
      if (video.duration) {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      playGlitchSound(120, 'sine', 0.05);
    } else {
      video.play().catch(e => console.log(e));
      playGlitchSound(200, 'sine', 0.05);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    playGlitchSound(220, 'triangle', 0.05);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
    playGlitchSound(150, 'sine', 0.03);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    playGlitchSound(350, 'sine', 0.1);
    
    if (video.requestFullscreen) {
      video.requestFullscreen().then(() => {
        video.muted = false;
        setIsMuted(false);
        video.play().catch(e => console.log(e));
      }).catch(e => console.log(e));
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
      video.muted = false;
      setIsMuted(false);
      video.play().catch(e => console.log(e));
    } else if ((video as any).webkitEnterFullscreen) {
      (video as any).webkitEnterFullscreen();
      video.muted = false;
      setIsMuted(false);
      video.play().catch(e => console.log(e));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative w-full h-full min-h-[350px] lg:min-h-0 aspect-[16/10] lg:aspect-auto bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,0,85,0.15)] group"
    >
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-red-600/25 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-blue-600/15 to-transparent blur-3xl pointer-events-none" />
      
      <video
        ref={videoRef}
        id="headphone-video-player-element"
        className="w-full h-full object-cover cursor-pointer select-none pointer-events-auto"
        onClick={handlePlayPause}
        autoPlay
        muted={isMuted}
        loop
        playsInline
      />
      
      {/* Centered play UI overlay to trigger full-screen playback */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFullscreen();
            const video = videoRef.current;
            if (video) {
              video.play().catch(e => console.log(e));
            }
          }}
          className="pointer-events-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600/90 text-white hover:bg-red-500 flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(255,0,85,0.6)] cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group/btn"
        >
          <Play size={24} fill="currentColor" className="ml-1 text-white group-hover/btn:scale-110 transition-transform duration-300" />
        </button>
      </div>
      


      <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/95 via-black/85 to-transparent z-20 flex flex-col gap-3">
        
        <div 
          className="w-full h-1 bg-white/20 hover:h-1.5 rounded-full cursor-pointer transition-all duration-200 relative group/seek"
          onClick={handleSeek}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 w-3.5 h-3.5 bg-white border-2 border-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/seek:opacity-100 transition-opacity duration-150"
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePlayPause}
              className="text-white hover:text-red-500 transition-colors cursor-pointer animate-pulse"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            </button>
            
            <button 
              onClick={() => playGlitchSound(240, 'sine', 0.05)}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <SkipForward size={16} />
            </button>

            <span className="font-mono text-xs text-white/70 tracking-wider">
              {formatTime(currentTime)} <span className="text-white/30 mx-1">/</span> {formatTime(duration || 88)}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-white/80">
            <span 
              onClick={() => playGlitchSound(300, 'sine', 0.05)}
              className="px-2 py-0.5 rounded border border-white/20 text-[10px] tracking-widest text-white/70 hover:border-white transition-colors cursor-pointer"
            >
              1080P
            </span>

            <button 
              onClick={handleMuteToggle}
              className="text-white hover:text-red-500 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <button 
              onClick={handleFullscreen}
              className="text-white hover:text-red-500 transition-colors cursor-pointer"
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShoeVideoPlayerProps {
  isGlobalMuted: boolean;
  playGlitchSound: (freq?: number, type?: OscillatorType, duration?: number) => void;
}

function ShoeVideoPlayer({ isGlobalMuted, playGlitchSound }: ShoeVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = isGlobalMuted;
        setIsMuted(isGlobalMuted);
      }
    }
  }, [isGlobalMuted, isFullscreen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleFullscreenChange = () => {
      const activeFs = 
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement;
      
      const isFs = activeFs === video;
      setIsFullscreen(isFs);
      if (isFs) {
        video.muted = false;
        setIsMuted(false);
      } else {
        video.muted = true;
        setIsMuted(true);
      }
    };

    const handleWebkitBeginFullscreen = () => {
      setIsFullscreen(true);
      video.muted = false;
      setIsMuted(false);
    };

    const handleWebkitEndFullscreen = () => {
      setIsFullscreen(false);
      video.muted = true;
      setIsMuted(true);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    video.addEventListener('webkitbeginfullscreen', handleWebkitBeginFullscreen);
    video.addEventListener('webkitendfullscreen', handleWebkitEndFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      if (video) {
        video.removeEventListener('webkitbeginfullscreen', handleWebkitBeginFullscreen);
        video.removeEventListener('webkitendfullscreen', handleWebkitEndFullscreen);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const hlsUrl = "https://stream.mux.com/mJBFAsPzT00tWmj6CLEJUAY021YhjFFKWmD9My02zqVmVw.m3u8";

    if (Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: true,
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
    }

    const handleTimeUpdate = () => {
      if (video.duration) {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      if (video) {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('durationchange', handleDurationChange);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      }
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      playGlitchSound(120, 'sine', 0.05);
    } else {
      video.play().catch(e => console.log(e));
      playGlitchSound(200, 'sine', 0.05);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    playGlitchSound(220, 'triangle', 0.05);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
    playGlitchSound(150, 'sine', 0.03);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    playGlitchSound(350, 'sine', 0.1);
    
    if (video.requestFullscreen) {
      video.requestFullscreen().then(() => {
        video.muted = false;
        setIsMuted(false);
        video.play().catch(e => console.log(e));
      }).catch(e => console.log(e));
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
      video.muted = false;
      setIsMuted(false);
      video.play().catch(e => console.log(e));
    } else if ((video as any).webkitEnterFullscreen) {
      (video as any).webkitEnterFullscreen();
      video.muted = false;
      setIsMuted(false);
      video.play().catch(e => console.log(e));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative w-full h-full min-h-[350px] lg:min-h-0 aspect-[16/10] lg:aspect-auto bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,0,85,0.15)] group"
    >
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-red-600/25 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-blue-600/15 to-transparent blur-3xl pointer-events-none" />
      
      <video
        ref={videoRef}
        id="shoe-video-player-element"
        className="w-full h-full object-cover cursor-pointer select-none pointer-events-auto"
        onClick={handlePlayPause}
        autoPlay
        muted={isMuted}
        loop
        playsInline
      />
      
      {/* Centered play UI overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFullscreen();
            const video = videoRef.current;
            if (video) {
              video.play().catch(e => console.log(e));
            }
          }}
          className="pointer-events-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600/90 text-white hover:bg-red-500 flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(255,0,85,0.6)] cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group/btn z-10"
        >
          <Play size={24} fill="currentColor" className="ml-1 text-white group-hover/btn:scale-110 transition-transform duration-300" />
        </button>
      </div>

      <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/95 via-black/85 to-transparent z-20 flex flex-col gap-3">
        
        <div 
          className="w-full h-1 bg-white/20 hover:h-1.5 rounded-full cursor-pointer transition-all duration-200 relative group/seek"
          onClick={handleSeek}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 w-3.5 h-3.5 bg-white border-2 border-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/seek:opacity-100 transition-opacity duration-150"
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePlayPause}
              className="text-white hover:text-red-500 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            </button>
            
            <button 
              onClick={() => playGlitchSound(240, 'sine', 0.05)}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <SkipForward size={16} />
            </button>

            <span className="font-mono text-xs text-white/70 tracking-wider">
              {formatTime(currentTime)} <span className="text-white/30 mx-1">/</span> {formatTime(duration || 88)}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-white/80">
            <span 
              onClick={() => playGlitchSound(300, 'sine', 0.05)}
              className="px-2 py-0.5 rounded border border-white/20 text-[10px] tracking-widest text-white/70 hover:border-white transition-colors cursor-pointer"
            >
              1080P
            </span>

            <button 
              onClick={handleMuteToggle}
              className="text-white hover:text-red-500 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <button 
              onClick={handleFullscreen}
              className="text-white hover:text-red-500 transition-colors cursor-pointer"
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
