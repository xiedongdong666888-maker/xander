
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CosmicBackground: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // 1. Dynamic Background Color Interpolation
  // Map scroll progress to a rich color palette:
  // 0% (Top): Deep Indigo (Main Theme)
  // 33% (Commercial): Deep Teal/Cyan (Matching Commercial vibe)
  // 66% (Competition): Deep Magenta/Purple (Matching Creative vibe)
  // 100% (Bottom): Void Black
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    ['#030014', '#001219', '#1a051d', '#000000']
  );

  // 2. Parallax & Opacity Transforms for Blobs
  // Move blobs at different speeds to create depth
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  
  // Fade blobs in/out depending on the section color
  // Cyan blob fades out when moving to Purple section
  const opacityCyan = useTransform(scrollYProgress, [0, 0.4, 0.7], [0.6, 0.8, 0.2]);
  // Purple blob becomes dominant in the lower sections
  const opacityPurple = useTransform(scrollYProgress, [0.2, 0.6, 1], [0.2, 0.7, 0.4]);

  return (
    <motion.div 
      style={{ backgroundColor }}
      className="fixed inset-0 overflow-hidden pointer-events-none -z-20 transition-colors duration-700 ease-out"
    >
      {/* 
        High-End Cinematic Background System
        Features: Scroll-driven color shifts, Parallax Nebula, Depth Blurring
      */}

      {/* 1. Ambient Top Light (Simulating a distant star cluster) */}
      <motion.div 
        className="absolute -top-[10%] left-0 right-0 h-[60vh] bg-gradient-to-b from-indigo-900/30 via-transparent to-transparent blur-[100px] opacity-60" 
      />

      {/* 2. Primary Nebula (Cyan/Teal) - Top Left */}
      <motion.div style={{ y: y1, opacity: opacityCyan }} className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[5%] -left-[10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-r from-teal-900/40 to-neon-cyan/20 blur-[130px] mix-blend-screen animate-nebula-float" />
      </motion.div>

      {/* 3. Secondary Nebula (Purple/Magenta) - Bottom Right */}
      <motion.div style={{ y: y2, opacity: opacityPurple }} className="absolute top-0 left-0 w-full h-full">
        <div className="absolute bottom-[0%] -right-[10%] w-[75vw] h-[75vw] rounded-full bg-gradient-to-l from-purple-900/40 to-fuchsia-900/20 blur-[140px] mix-blend-screen animate-nebula-float-delayed" />
      </motion.div>

      {/* 4. Center Depth Light (Subtle Indigo) - Breathing Pulse */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-plus-lighter" />

      {/* 5. Floating Detail Orbs (for texture) */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[30%] left-[20%] w-[30vw] h-[30vw] bg-blue-600/10 rounded-full blur-[100px] mix-blend-overlay" 
      />
      
      {/* 6. Cinematic Vignette & Grain Integration */}
      {/* Darken edges to focus attention on content */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* Color Uniformity Overlay */}
      <div className="absolute inset-0 bg-indigo-950/10 mix-blend-overlay" />
    </motion.div>
  );
};

export default CosmicBackground;
