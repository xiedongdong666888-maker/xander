import React, { useEffect, useRef } from 'react';

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number; y: number; z: number; size: number }[] = [];
    const numStars = 150;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 1, // Depth factor
        size: Math.random() * 2,
      });
    }

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) - 0.5;
      targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Clear with slight transparency for trail effect if desired, but here we want clean
      ctx.clearRect(0, 0, width, height);

      // Smoothly lerp mouse values for buttery smooth movement
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Scroll offset for parallax
      const scrollY = window.scrollY;

      stars.forEach((star) => {
        // Basic movement
        star.y -= 0.1 * star.z;

        // Parallax offset Y based on scroll
        const parallaxY = (scrollY * 0.1 * (1/star.z)); 

        // Mouse parallax offset based on depth (z factor)
        const mouseParallaxX = mouseX * 45 * (1 / star.z);
        const mouseParallaxY = mouseY * 45 * (1 / star.z);

        const x = star.x - mouseParallaxX;
        let y = star.y - parallaxY - mouseParallaxY;

        // Wrap around logic needs to account for parallax shift visual
        // For simplicity in this loop, we just draw based on calculated position
        // and let the natural loop handle infinite scroll feels.
        
        if (y < -50) {
            star.y += height + 50;
            y += height + 50;
        }

        const opacity = Math.min(1, Math.max(0.1, 1 - (star.z / 3)));
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.arc((x + width) % width, (y + height) % height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default StarField;