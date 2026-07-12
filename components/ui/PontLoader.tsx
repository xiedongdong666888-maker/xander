import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PontLoaderProps {
  onComplete: () => void;
}

export const PontLoader: React.FC<PontLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [sparkles, setSparkles] = useState<{ id: number; left: number; top: number; size: number; delay: number; duration: number }[]>([]);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  // Generate elegant luxury golden sparkles/shimmers
  useEffect(() => {
    const list = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      top: Math.random() * 40 + 40, // hover near the middle/bottom wave area
      size: Math.random() * 3 + 1, // 1px to 4px
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 3 // 3s to 7s
    }));
    setSparkles(list);
  }, []);

  // Smooth luxury progress curve (non-linear for sophisticated feel)
  useEffect(() => {
    const duration = 3800; // 3.8 seconds luxury reveal

    const updateProgress = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const ratio = Math.min(elapsed / duration, 1);

      // Cyber-organic luxury speed curve: starts fast, slows down during 40-70% for "formulas blending", completes elegantly
      let visualProgress = ratio;
      if (ratio < 0.3) {
        visualProgress = Math.pow(ratio / 0.3, 1.3) * 0.40; // up to 40%
      } else if (ratio < 0.75) {
        const t = (ratio - 0.3) / 0.45;
        visualProgress = 0.40 + (1 - Math.pow(1 - t, 2)) * 0.42; // up to 82%
      } else {
        const t = (ratio - 0.75) / 0.25;
        visualProgress = 0.82 + t * 0.18; // up to 100%
      }

      const percent = Math.floor(visualProgress * 100);
      setProgress(percent);

      if (ratio < 1) {
        requestRef.current = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setIsLoaded(true);
        setTimeout(() => {
          onComplete();
        }, 1800); // short elegant pause at 100% to show checkmark drawing & ripple burst
      }
    };

    requestRef.current = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(requestRef.current);
  }, [onComplete]);

  // SVG Circular progress configurations
  const radius = 54;
  const strokeWidth = 1.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[1000] bg-[#030200] overflow-hidden flex flex-col justify-between items-center py-16 select-none cursor-none">
      
      {/* Luxury styles for cinematic lighting, custom animations, and wave layers */}
      <style>{`
        @keyframes shineSpotlight {
          0%, 100% { opacity: 0.8; transform: translate(-50%, 0) scale(1); }
          50% { opacity: 0.95; transform: translate(-50%, 0) scale(1.03); }
        }
        @keyframes floatSparkle {
          0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 0; }
          30% { opacity: 0.8; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-160px) scale(1) rotate(180deg); opacity: 0; }
        }
        @keyframes liquidWave1 {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25%) translateY(4px); }
          100% { transform: translateX(-50%) translateY(0); }
        }
        @keyframes liquidWave2 {
          0% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-25%) translateY(-6px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes liquidWave3 {
          0% { transform: translateX(-10%) translateY(0); }
          50% { transform: translateX(-35%) translateY(5px); }
          100% { transform: translateX(-60%) translateY(0); }
        }
        .luxury-spotlight {
          background: radial-gradient(ellipse at 50% 0%, rgba(255, 230, 160, 0.18) 0%, rgba(212, 175, 55, 0.05) 45%, transparent 75%);
          animation: shineSpotlight 8s ease-in-out infinite;
        }
        .luxury-text-gradient {
          background: linear-gradient(135deg, #ffe0a5 0%, #d4af37 50%, #96742a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .luxury-gold-border {
          stroke: url(#goldGradient);
        }
      `}</style>

      {/* 1. TOP SPOTLIGHT LIGHT BEAM */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180%] md:w-[120%] h-[75vh] pointer-events-none z-0 luxury-spotlight" />
      
      {/* Subtle narrow luxury center god-ray */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] md:w-[140px] h-[55vh] bg-gradient-to-b from-yellow-100/10 via-amber-200/5 to-transparent pointer-events-none z-0 filter blur-[40px] opacity-70" />

      {/* 2. SPARKLING GOLD SHIMMERS */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {sparkles.map((spark) => (
          <div
            key={spark.id}
            className="absolute rounded-full bg-gradient-to-tr from-yellow-200 to-amber-400 shadow-[0_0_8px_rgba(255,220,150,0.8)]"
            style={{
              left: `${spark.left}%`,
              top: `${spark.top}%`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              animation: `floatSparkle ${spark.duration}s cubic-bezier(0.25, 1, 0.5, 1) infinite`,
              animationDelay: `${spark.delay}s`
            }}
          />
        ))}
      </div>

      {/* 3. CENTER BRAND LOGO & CIRCULAR LOADING COMPONENT (Cohesive close grouping) */}
      <div className="flex flex-col items-center gap-10 z-20 my-auto">
        {/* HEADER BRAND LOGO & SLOGAN AREA */}
        <div className="flex flex-col items-center text-center">
          {/* PŌNT Wordmark */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-light tracking-[0.35em] font-sans flex items-center relative select-none mr-[-0.35em]"
          >
            <span className="luxury-text-gradient">P</span>
            <span className="relative inline-block tracking-normal select-none" style={{ marginRight: '0.35em' }}>
              <span className="relative inline-block luxury-text-gradient">
                O
                <span className="absolute -top-[2px] left-[8%] right-[8%] h-[1.5px] bg-gradient-to-r from-yellow-100 to-amber-300 rounded-full shadow-[0_0_3px_rgba(255,224,165,0.8)]" />
              </span>
            </span>
            <span className="luxury-text-gradient">NT</span>
          </motion.div>

          {/* Reveal slogan */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[9px] md:text-[10px] tracking-[0.45em] text-amber-200/70 font-light uppercase mt-3.5 mr-[-0.45em]"
          >
            REVEAL YOUR RADIANCE
          </motion.p>
        </div>

        {/* 4. CIRCULAR LOADING COMPONENT */}
        <motion.div 
          className="relative flex items-center justify-center"
          animate={{ scale: isLoaded ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          {/* Radial shockwave on complete */}
          <AnimatePresence>
            {isLoaded && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 2.3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="absolute w-32 h-32 rounded-full border border-[#d4af37]/40 pointer-events-none z-0"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
                  className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-[#ffe0a5]/20 to-[#d4af37]/5 pointer-events-none filter blur-md z-0"
                />
                {/* Secondary golden particle bursts */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                  className="absolute inset-0 pointer-events-none z-10"
                >
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 360) / 12;
                    const radians = (angle * Math.PI) / 180;
                    const xDist = Math.cos(radians) * 55;
                    const yDist = Math.sin(radians) * 55;
                    return (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 0.1, opacity: 1 }}
                        animate={{ x: xDist, y: yDist, scale: 1.2, opacity: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut", delay: 0.05 }}
                        className="absolute w-1 h-1 rounded-full bg-gradient-to-tr from-yellow-200 to-amber-400 shadow-[0_0_5px_rgba(255,220,150,0.9)]"
                        style={{
                          left: '50%',
                          top: '50%',
                          marginLeft: '-2px',
                          marginTop: '-2px'
                        }}
                      />
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <svg className="w-32 h-32 transform -rotate-90 relative z-10">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe0a5" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#96742a" />
              </linearGradient>
              <linearGradient id="goldTrackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(212,175,55,0.03)" />
                <stop offset="100%" stopColor="rgba(150,116,42,0.05)" />
              </linearGradient>
            </defs>
            
            {/* Subtle Outer Track Glow Ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={isLoaded ? "rgba(212,175,55,0.2)" : "rgba(212,175,55,0.08)"}
              strokeWidth="1"
              fill="transparent"
              className="transition-colors duration-500"
            />

            {/* Core Track Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="url(#goldTrackGradient)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Interactive Golden Progress Circle */}
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              className="luxury-gold-border"
              strokeWidth={strokeWidth}
              animate={{ strokeWidth: isLoaded ? 2.5 : strokeWidth }}
              fill="transparent"
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              transition={{ ease: "easeOut" }}
            />
          </svg>

          {/* Floating HUD: Morphing from progress percent text to drawing gold checkmark */}
          <div className="absolute flex flex-col items-center justify-center z-20">
            <AnimatePresence mode="wait">
              {!isLoaded ? (
                <motion.div
                  key="percentage-hud"
                  exit={{ opacity: 0, scale: 0.7, y: -4 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col items-center justify-center"
                >
                  <motion.div 
                    key={progress}
                    initial={{ opacity: 0.6, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl font-light font-sans text-amber-100 tracking-tighter"
                  >
                    {progress}
                  </motion.div>
                  <span className="text-[8px] font-mono tracking-widest text-amber-200/50 uppercase mt-0.5">%</span>
                </motion.div>
              ) : (
                <motion.div
                  key="complete-hud"
                  initial={{ opacity: 0, scale: 0.5, rotate: -25 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.05 }}
                  className="flex flex-col items-center justify-center"
                >
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="filter drop-shadow-[0_0_8px_rgba(255,224,165,0.7)]"
                  >
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.75, ease: "easeOut", delay: 0.25 }}
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* 5. BOTTOM BRAND SLOGAN (Clean, luxury absolute dark) */}
      <div className="w-full flex flex-col items-center z-20 relative">
        {/* Slogan */}
        <p className="text-[8px] md:text-[9px] tracking-[0.38em] text-amber-200/40 uppercase font-light text-center px-6 max-w-lg leading-relaxed mr-[-0.38em]">
          THE SCIENCE OF SKIN · THE ART OF BEAUTY
        </p>
      </div>

    </div>
  );
};
