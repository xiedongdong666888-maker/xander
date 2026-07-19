import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useSpring, motion, useMotionValue, useTransform } from 'framer-motion';
import Hls from 'hls.js';

export interface HomeVideoBackgroundProps {
  active?: boolean;
}

export const HomeVideoBackground: React.FC<HomeVideoBackgroundProps> = ({ active = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();
  const [isLoaded, setIsLoaded] = useState(false);

  // Mouse interaction state with smooth spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 45, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const videoX = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const videoY = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 使用 Mux 官方可靠的 HLS (m3u8) 视频地址
    const hlsUrl = "https://stream.mux.com/HMV0001tXYi01y00ekHK3IBOb004MQempznuQxmSpPSAg6oI.m3u8";

    // 初始化基础视频状态
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.controls = false;
    
    let hls: Hls | null = null;
    
    // Tracking times for throttling & smooth responsive updates
    let targetTime = 0;
    let lerpedTime = 0;
    let lastSeekTime = 0;
    let isSeeking = false;
    let frameId: number | null = null;
    
    // Function to calculate and update our local target time based on scroll progress
    const updateTargetFromProgress = (progress: number) => {
      const duration = video.duration;
      if (!duration || isNaN(duration)) return;
      const maxScrupOffset = Math.min(8, duration);
      targetTime = progress * maxScrupOffset;
    };

    // Fast-responsive loop using requestAnimationFrame
    const tick = () => {
      const diff = targetTime - lerpedTime;
      
      if (Math.abs(diff) > 0.001) {
        if (Math.abs(diff) < 0.008) {
          lerpedTime = targetTime;
        } else {
          // Rapid lerping: 0.18 factor for extremely fast catch-up when scrolling,
          // but completely halts as soon as diff is tiny (no long trailing delays)
          lerpedTime += diff * 0.18;
        }

        const now = performance.now();
        // Throttle native seeks to at most once per 60ms AND only when video is not actively seeking.
        // This completely protects the hardware decoder from collapsing due to over-spamming.
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
        setIsLoaded(true);
        updateTargetFromProgress(scrollYProgress.get());
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      video.load();
    }

    // Direct subscription to scrollYProgress (WITHOUT Framer Motion's slow spring value)
    // This ensures that as soon as the user stops scrolling, the targetTime STOPS changing instantly!
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      updateTargetFromProgress(latest);
    });

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
      updateTargetFromProgress(scrollYProgress.get());
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleLoadedMetadata);
    video.addEventListener('canplaythrough', handleLoadedMetadata);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    // Start the smooth responsive requestAnimationFrame tick loop
    frameId = requestAnimationFrame(tick);

    // Audio context unlock and early interaction playback priming
    const primeVideoPlayback = () => {
      video.play().then(() => {
        video.pause();
        updateTargetFromProgress(scrollYProgress.get());
      }).catch((err) => {
        console.warn("媒体流在交互触发前已延迟启动:", err);
      });
      
      window.removeEventListener('click', primeVideoPlayback);
      window.removeEventListener('touchstart', primeVideoPlayback);
      window.removeEventListener('scroll', primeVideoPlayback);
    };

    window.addEventListener('click', primeVideoPlayback, { passive: true });
    window.addEventListener('touchstart', primeVideoPlayback, { passive: true });
    window.addEventListener('scroll', primeVideoPlayback, { passive: true });

    return () => {
      unsubscribe();
      if (frameId) cancelAnimationFrame(frameId);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleLoadedMetadata);
      video.removeEventListener('canplaythrough', handleLoadedMetadata);
      window.removeEventListener('click', primeVideoPlayback);
      window.removeEventListener('touchstart', primeVideoPlayback);
      window.removeEventListener('scroll', primeVideoPlayback);
      if (hls) {
        hls.destroy();
      }
    };
  }, [scrollYProgress]);

  return (
    <div 
      className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none bg-black transition-opacity duration-[1000ms] ease-in-out ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: -30 }}
    >
      <div className="absolute inset-0 bg-[#030014]/40 z-10 pointer-events-none" />
      <motion.video
        ref={videoRef}
        style={{ x: videoX, y: videoY, scale: 1.05 }}
        className="w-full h-full object-cover select-none pointer-events-none filter brightness-90 saturate-110 origin-center"
        playsInline
        muted
        loop={false}
        autoPlay={false}
        controls={false}
      />
    </div>
  );
};

export default HomeVideoBackground;
