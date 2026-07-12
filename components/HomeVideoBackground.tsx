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

  // 优化 Spring 弹性系数，使其既有足够的惯性丝滑感，也有敏捷的动态反馈
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 32,
    restDelta: 0.0005
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 使用 Mux 官方可靠的 HLS (m3u8) 视频地址（静态 MP4 文件由于 Mux 未激活 static renditions 会报 404）
    const hlsUrl = "https://stream.mux.com/HMV0001tXYi01y00ekHK3IBOb004MQempznuQxmSpPSAg6oI.m3u8";

    // 初始化基础视频状态
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.controls = false;
    
    let hls: Hls | null = null;
    let isSeeking = false;
    let pendingSeekTime: number | null = null;
    let targetTime = 0;

    // 核心锁控制器：保证在同一个时刻，浏览器内只有一个寻帧指令在执行
    // 彻底避免多个 seek 同时发起导致解码器管线崩溃，消灭“闪回”与“重叠跳跃”
    const performSeek = (time: number) => {
      if (!video.duration || isNaN(video.duration)) return;

      // 允许极其微小的误差抑制，避免微小抖动频繁触发 seeks 消耗性能
      const diff = Math.abs(video.currentTime - time);
      if (diff < 0.015) return;

      if (isSeeking || video.seeking) {
        pendingSeekTime = time;
        return;
      }

      isSeeking = true;
      video.currentTime = time;
    };

    // 寻帧完成事件：如果期间有暂存的最新滑动位置，立刻触发最新的 seek 从而保持最新位置，杜绝延迟死锁
    const handleSeeked = () => {
      isSeeking = false;
      if (pendingSeekTime !== null) {
        const nextTime = pendingSeekTime;
        pendingSeekTime = null;
        performSeek(nextTime);
      }
    };

    video.addEventListener('seeked', handleSeeked);

    // 计算映射：精确绑定 0% - 100% 滚动到 0s - 8s 的视频区间
    const updateTargetTime = (progress: number) => {
      const duration = video.duration;
      if (!duration || isNaN(duration)) return;
      
      // 用户要求：0% 映射到 0秒，50% 映射到 4秒，100% 映射到 8秒 
      // 这里的视频最大截断时长设为 8 秒（如果实际视频不足 8 秒，则自适应为实际时长）
      const maxScrupOffset = Math.min(8, duration);
      const calculatedTime = progress * maxScrupOffset;
      performSeek(calculatedTime);
    };

    // 初始化 Hls.js 以支持 Chrome, Firefox 等平台极致的滑动寻帧性能
    if (Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: false,
        enableWorker: true,        // 将 TS 分片 demuxing 解包动作移至 Web Worker 线程，杜绝阻碍主渲染线程
        lowLatencyMode: true,      // 极小延迟缓冲加载
        maxBufferLength: 45,       // 维持足够强劲的前缓冲
        maxMaxBufferLength: 60,
        backBufferLength: 90,      // 核心优化：保留 90 秒的历史回滚缓冲区！防止用户滚回上面时重新拉网，一律用内存高速缓存
        appendErrorMaxRetry: 5
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        // Find the absolute highest quality level dynamically
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
        updateTargetTime(smoothProgress.get());
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // 针对 macOS / iOS Safari 等原生支持 HTTP Live Streaming 协议的设备
      video.src = hlsUrl;
      video.load();
    }

    // 订阅 Framer Motion 滚动 Spring 数值，并驱动更新
    const unsubscribe = smoothProgress.on("change", (latest) => {
      updateTargetTime(latest);
    });

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
      updateTargetTime(smoothProgress.get());
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleLoadedMetadata);
    video.addEventListener('canplaythrough', handleLoadedMetadata);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    // 用户动作提前触碰唤醒，解锁 iOS Safari 及部分移动浏览器的媒体线程硬核静音保护
    const primeVideoPlayback = () => {
      video.play().then(() => {
        video.pause();
        updateTargetTime(smoothProgress.get());
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
  }, [smoothProgress]);

  // 修改 `-z-25` 的非法 Tailwind 类名为 inline styles z-index: -20，并置于 cosmic-background/starfield 之下
  return (
    <div 
      className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none bg-black transition-opacity duration-[1000ms] ease-in-out ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: -30 }} // 设立坚实的底层深渊背景 z-index
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
