import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Spring configuration for smooth "physical" delay
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    const colors = [
      'rgba(41, 151, 255, ',  // Cyan
      'rgba(191, 90, 242, ',  // Purple
      'rgba(232, 109, 81, ',  // Soft Orange/Red
      'rgba(255, 255, 255, ', // White
    ];

    const createParticles = (x: number, y: number) => {
      // Spawn 1-2 particles per move to keep it subtle and elegant
      const count = Math.random() < 0.4 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.0 + 0.2;
        const size = Math.random() * 2.2 + 0.8; // 0.8px to 3px
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size,
          color,
          alpha: Math.random() * 0.6 + 0.4,
          decay: Math.random() * 0.015 + 0.008, // Slow fade out (1-2s)
          twinkleSpeed: Math.random() * 0.08 + 0.04,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the cursor (32px width / 2)
      cursorY.set(e.clientY - 16);
      createParticles(e.clientX, e.clientY);
    };

    const handleMouseClick = (e: MouseEvent) => {
      // Burst 12-16 sparkling star dust particles on click for a magical touch
      const count = Math.floor(Math.random() * 5) + 12;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.2;
        const size = Math.random() * 2.5 + 1.0;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size,
          color,
          alpha: 1.0,
          decay: Math.random() * 0.025 + 0.015,
          twinkleSpeed: Math.random() * 0.15 + 0.08,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('interactive') ||
        target.closest('.interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseClick);

    let animationFrameId: number;
    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.twinklePhase += p.twinkleSpeed;

        const twinkle = Math.sin(p.twinklePhase) * 0.25;
        const currentAlpha = Math.max(0, Math.min(1, p.alpha + twinkle));

        if (currentAlpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        const particleSize = Math.max(0.1, p.size * currentAlpha);
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        
        ctx.shadowBlur = p.size * 2.5;
        ctx.shadowColor = p.color.includes('255, 255, 255') ? 'rgba(255, 255, 255, 0.6)' : `${p.color}0.6)`;
        
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(renderParticles);
    };

    renderParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* High-performance canvas layer for trailing stellar particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Main Cursor Dot - Follows directly */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX, // No spring for the dot, instant feedback
          y: cursorY,
          translateX: 14, // Adjust to center inside the ring
          translateY: 14,
        }}
      />
      
      {/* Outer Ring - Follows with Spring Physics */}
      <motion.div
        className="fixed top-0 left-0 border border-white/40 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          height: 32,
          width: 32,
        }}
        animate={{
          scale: isHovered ? 2.5 : 1,
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Optional: Text label inside cursor when hovered */}
        <motion.span 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[4px] font-orbitron text-white uppercase tracking-widest opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
        >
            OPEN
        </motion.span>
      </motion.div>
    </>
  );
};

export default CustomCursor;