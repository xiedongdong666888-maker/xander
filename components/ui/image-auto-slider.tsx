import React from 'react';

export const ImageAutoSlider = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const layer1Ref = React.useRef<HTMLDivElement>(null);
  const layer2Ref1 = React.useRef<HTMLDivElement>(null);
  const layer2Ref2 = React.useRef<HTMLDivElement>(null);
  const layer3Ref = React.useRef<HTMLDivElement>(null);

  const mouseRef = React.useRef({ x: 0, y: 0 });
  const lerpedRef = React.useRef({ x: 0, y: 0 });
  const animationFrameId = React.useRef<number | null>(null);

  // Images for the infinite scroll
  const images = [
    "https://i.postimg.cc/x8h1QdJp/bao-zhuang-he.png",
    "https://i.postimg.cc/VvpkwNr7/bao-zhuang-dai.png",
    "https://i.postimg.cc/wMZjzBRg/zhou-bian.png",
    "https://i.postimg.cc/1X23SznY/fan-bu-dai.png",
    "https://i.postimg.cc/x8h1QdJw/shou-na-dai.png",
    "https://i.postimg.cc/GtVmRpTn/shui-bei.png",
    "https://i.postimg.cc/j2mSTjwF/bi-ji-ben.png",
    "https://i.postimg.cc/8c9zGCJ9/jing-zi.png"
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  React.useEffect(() => {
    const updateParallax = () => {
      // Linear interpolation (lerp): current + (target - current) * ease
      // Using 0.08 for smooth, natural lag-free delay
      lerpedRef.current.x += (mouseRef.current.x - lerpedRef.current.x) * 0.08;
      lerpedRef.current.y += (mouseRef.current.y - lerpedRef.current.y) * 0.08;

      const x = lerpedRef.current.x;
      const y = lerpedRef.current.y;

      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `translate3d(${x * -16}px, ${y * -16}px, 0)`;
      }
      if (layer2Ref1.current) {
        layer2Ref1.current.style.transform = `translate3d(${x * -35}px, ${y * -35}px, 0)`;
      }
      if (layer2Ref2.current) {
        layer2Ref2.current.style.transform = `translate3d(${x * 40}px, ${y * 40}px, 0)`;
      }
      if (layer3Ref.current) {
        layer3Ref.current.style.transform = `translate3d(${x * 12}px, ${y * 12}px, 0)`;
      }

      animationFrameId.current = requestAnimationFrame(updateParallax);
    };

    animationFrameId.current = requestAnimationFrame(updateParallax);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    
    mouseRef.current = { x, y };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: 0, y: 0 };
  };

  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 30s linear infinite;
        }

        .image-item {
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease;
        }

        .image-item:hover {
          transform: scale(1.06) translateY(-4px);
          filter: brightness(1.05);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.15);
        }

        .parallax-layer {
          will-change: transform;
          /* Removed transition property as it causes lag/stutter when updating live with requestAnimationFrame */
        }
      `}</style>
      
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full relative overflow-hidden flex items-center justify-center py-8 rounded-3xl bg-gradient-to-b from-[#FAF8F5]/40 to-transparent border border-[#FAF8F5]/10"
        style={{
          perspective: '1000px',
        }}
      >
        {/* PARALLAX LAYER 1: Subtle ambient grid pattern background */}
        <div 
          ref={layer1Ref}
          className="parallax-layer absolute inset-0 bg-[radial-gradient(#E8E2D9_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-50 pointer-events-none"
        />

        {/* PARALLAX LAYER 2: High-performance radial-gradient glowing orbs (bypassing heavy filter: blur) */}
        <div 
          ref={layer2Ref1}
          className="parallax-layer absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none mix-blend-multiply bg-[radial-gradient(circle,rgba(180,74,50,0.06)_0%,transparent_70%)]"
        />
        <div 
          ref={layer2Ref2}
          className="parallax-layer absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[350px] pointer-events-none mix-blend-multiply bg-[radial-gradient(circle,rgba(255,224,165,0.12)_0%,transparent_70%)]"
        />

        {/* Left and Right ambient smooth edge fades (Standard cross-browser gradients) */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-20 pointer-events-none" />

        {/* PARALLAX LAYER 3: Scrolling images container moving slightly in front */}
        <div 
          ref={layer3Ref}
          className="parallax-layer relative z-10 w-full flex items-center justify-center"
        >
          <div className="w-full max-w-7xl overflow-hidden">
            <div className="infinite-scroll flex gap-8 w-max px-8">
              {duplicatedImages.map((image, index) => (
                <div
                  key={index}
                  className="image-item flex-shrink-0 w-44 aspect-[3/4] md:w-72 rounded-3xl overflow-hidden shadow-md border border-stone-200/30 bg-white"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Component = ImageAutoSlider;
