import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js';
import { 
  ArrowRight, Sparkles, Droplet, Leaf, X, ChevronRight, ChevronLeft,
  Check, Info, Sparkle, Heart, RefreshCw, Shield, HelpCircle,
  Compass, Zap, Award, Users, BookOpen, MessageSquare, Plus, Minus
} from 'lucide-react';

interface PontBrandPageProps {
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  chineseName: string;
  category: 'TONER' | 'REPAIR' | 'MOISTURIZING' | 'CLEANSER' | 'AMPOULE';
  volume: string;
  slogan: string;
  description: string;
  ingredients: string[];
  usage: string;
  skinType: string;
  imageUrl: string;
  accentColor: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'repair',
    name: 'WRINKLE REPAIR MOISTURIZING ESSENCE',
    chineseName: '去皱保湿修护精华',
    category: 'REPAIR',
    volume: '300ml',
    slogan: '高能淡纹抗皱，温和重塑弹嫩饱满肌底',
    description: '专为修护面部幼纹及干纹研发的黄金复配精华。融合多重活性修复肽与高浓度透明质酸，深层灌注水分，强韧皮肤屏障。让肌肤重现丝滑紧致与健康弹性。',
    ingredients: ['活性多肽复合物', '透明质酸钠', '神经酰胺', '积雪草提取物'],
    usage: '夜间洁面爽肤后，取3-4滴涂抹于面部，避开眼周，轻轻按摩至完全吸收。建议后续搭配乳霜锁水。',
    skinType: '适合娇嫩、角质层薄、易泛红及有细纹皱纹困扰的肌肤。',
    accentColor: 'from-[#FBC7B9] to-[#FCD9CF]',
    imageUrl: 'https://i.postimg.cc/13WRt0fC/qu-zhou-bao-shi-xiu-hu-jing-hua.png'
  },
  {
    id: 'toner',
    name: 'CAMELLIA INVIGORATING OXYGEN TONER',
    chineseName: '山茶花活氧爽肤水',
    category: 'TONER',
    volume: '300ml',
    slogan: '唤醒肌肤第一道水活屏障，注入鲜活角质能量',
    description: '富含高浓度红山茶花活能精萃与天然植物活氧因子。瞬间深层补水，净化角质，提升后续保养品的吸收力。其独特的微气泡载氧技术，使营养成分能够直达肌底，为暗沉疲惫的肌肤注入崭新活力。',
    ingredients: ['红山茶花提取物', '微量活氧因子', '烟酰胺 (维生素B3)', '透明质酸钠'],
    usage: '洁面后，取适量于掌心或化妆棉，避开眼周，由内向外均匀轻拍于面部及颈部直至吸收。',
    skinType: '适合所有肤质，尤其是缺水、暗沉及需要细致毛孔的肌肤。',
    imageUrl: 'https://i.postimg.cc/TPpdWyDH/shan-cha-hua-huo-yang-shuang-fu-shui.png',
    accentColor: 'from-[#F9B9A9] to-[#FBC7B9]'
  },
  {
    id: 'cleanser',
    name: 'AMINO ACID DEEP CLEANING CLEANSER',
    chineseName: '氨基酸深层清洁洗面奶',
    category: 'CLEANSER',
    volume: '150ml',
    slogan: '深层净透毛孔，洗出匀净通透水润感',
    description: '弱酸性温和洗护标杆。萃取天然氨基酸表面活性剂与温和复合酸，能轻松带走彩妆残留、多余皮脂及深层污垢，同时绝不破坏皮脂膜，洗后不紧绷、不假滑，让毛孔自由呼吸。',
    ingredients: ['天然氨基酸表面活性剂', '水杨酸修护微囊', '复配氨基酸', '库拉索芦荟叶汁'],
    usage: '湿润面部，取适量洁面乳于掌心，加水揉搓出细腻泡沫，在面部打圈按摩（T区重点打圈），最后用温水彻底冲洗干净。',
    skinType: '适合全肤质使用，包括极干性和脆弱性敏感肤质。',
    accentColor: 'from-[#F8AB98] to-[#F9B9A9]',
    imageUrl: 'https://i.postimg.cc/Qd6NtgHf/an-ji-suan-shen-ceng-qing-jie-xi-mian-nai.png'
  },
  {
    id: 'moisturizing',
    name: 'WRINKLE REPAIR RECONSTRUCT CREAM',
    chineseName: '淡化和改善皱纹面霜',
    category: 'MOISTURIZING',
    volume: '100ml',
    slogan: '抚平干纹细纹，重塑丰盈紧致面部轮廓',
    description: '滋润度与抗衰老的终极答案。专研“Fade & Improve Winkiss”修护复合物，直击胶原流失和干纹细纹。乳酪质地触肤即融，在肌肤表面形成长效保水网，显著提升面部轮廓，带来弹嫩、丰盈、紧致的奢华触感。',
    ingredients: ['专研Winkiss复合物', '水解胶原蛋白', '白池花籽油', '麦角硫因 (超强抗氧)'],
    usage: '早晚护肤最后一步，取黄豆大小置于指尖，温热乳化后轻按于双颊、额头及下巴，顺着肌肤纹理向上提拉按摩。',
    skinType: '适合熟龄肌、干燥脱皮及需要对抗松弛与细纹的肌肤。',
    accentColor: 'from-[#F69C87] to-[#F8AB98]',
    imageUrl: 'https://i.postimg.cc/Z5fYRPCj/dan-hua-he-gai-shan-zhou-wen-mian-shuang.png'
  },
  {
    id: 'licorice',
    name: 'LICORICE HERBAL RENEWING TONER',
    chineseName: '甘草植萃焕颜爽肤水',
    category: 'AMPOULE',
    volume: '150ml',
    slogan: '天然甘草精萃，温和舒缓焕亮，褪去暗沉疲态',
    description: '融合高浓度天然甘草酸二钾与多种修护植萃。专为暗沉、粗糙及敏感易泛红肌肤打造，提供二次净化与舒缓调理，由内而外提亮肤色，令肌肤重回匀净、细腻与健康透亮状态。',
    ingredients: ['甘草酸二钾', '积雪草提取物', '积雪苷', '烟酰胺', '透明质酸'],
    usage: '洁面后，取适量轻轻拍打于脸部至完全吸收，亦可使用化妆棉湿敷3-5分钟进行重点急救舒缓。',
    skinType: '适合暗沉无光、干燥、易敏感泛红及肤色不均的肌肤。',
    accentColor: 'from-[#F48D75] to-[#F69C87]',
    imageUrl: 'https://i.postimg.cc/sgnfXPvm/gan-cao-zhi-cui-huan-yan-shuang-fu-shui.png'
  }
];

const COSMETICS_OVERLAYS = [
  {
    id: 'moisturizing',
    name: 'PŌNT 臻颜修护精华霜',
    category: '【奢效面霜】',
    description: '深层抗皱，盈润紧致，重塑丰盈面部轮廓。',
    left: '14%',
    cardTop: '18%',
    dotTop: '55%'
  },
  {
    id: 'licorice',
    name: 'PŌNT 甘草植萃焕颜爽肤水',
    category: '【平衡调理】',
    description: '天然甘草精萃，温和舒缓焕亮，褪去暗沉疲态。',
    left: '31%',
    cardTop: '25%',
    dotTop: '66%'
  },
  {
    id: 'cleanser',
    name: 'PŌNT 氨基酸深层清洁乳',
    category: '【温和洁面】',
    description: '弱酸性温和洗护，深层净透，洗出匀净水润感。',
    left: '49%',
    cardTop: '12%',
    dotTop: '45%'
  },
  {
    id: 'repair',
    name: 'PŌNT 去皱保湿修护精华',
    category: '【修护精华】',
    description: '黄金复配多肽，高能淡纹抗皱，温和重塑饱满。',
    left: '68%',
    cardTop: '23%',
    dotTop: '60%'
  },
  {
    id: 'toner',
    name: 'PŌNT 山茶花活氧爽肤水',
    category: '【活氧爽肤】',
    description: '红山茶花活能，强韧第一道水活屏障。',
    left: '83%',
    cardTop: '16%',
    dotTop: '52%'
  }
];

export default function PontBrandPage({ onClose }: PontBrandPageProps) {
  // Navigation tabs or section index
  const [activeTab, setActiveTab] = useState<'PROTOCOL' | 'INGREDIENTS' | 'RESULTS' | 'CONSULTATION'>('PROTOCOL');
  
  // Immersive video cover section states
  const [isScrollLocked, setIsScrollLocked] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMainTitle, setShowMainTitle] = useState(true);
  const [showProductCategories, setShowProductCategories] = useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const targetTimeRef = React.useRef(0.1);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const progressTextRef = React.useRef<HTMLSpanElement>(null);

  // Interactive Step for the Hero Section
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Selected product detail drawer
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // States for interactive sub-sections
  const [starVolume, setStarVolume] = useState<'30ml' | '50ml' | '80ml'>('30ml');
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [activeIngredientIndex, setActiveIngredientIndex] = useState<number>(0);

  // Image auto-slider state for Product Lineup Showcase
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const [isSliderPaused, setIsSliderPaused] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(3);
  
  // Hero Auto-Play Showcase state
  const [isHeroPaused, setIsHeroPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === PRODUCTS.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isHeroPaused]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSliderPaused) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => {
        const maxIndex = PRODUCTS.length - visibleCount;
        if (prev >= maxIndex) {
          return 0; // wrap back
        }
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSliderPaused, visibleCount]);

  // Stats active highlight
  const [activeStat, setActiveStat] = useState<number>(0);

  // Consultation Quiz State
  const [quizStep, setQuizStep] = useState<number>(0); // 0 = intro, 1, 2, 3 = questions, 4 = result
  const [quizAnswers, setQuizAnswers] = useState({
    skinType: '',
    primaryConcern: '',
    environment: ''
  });
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  // Generate floating bubbles on client side
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate 18 elegant floating bubbles
    const newBubbles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage left
      y: Math.random() * 80 + 10, // percentage top
      size: Math.random() * 40 + 10, // size in px
      duration: Math.random() * 12 + 8, // float duration
      delay: Math.random() * 4
    }));
    setBubbles(newBubbles);
  }, []);

  // Smooth scroll helper
  const scrollToSection = (id: string, tab: 'PROTOCOL' | 'INGREDIENTS' | 'RESULTS' | 'CONSULTATION') => {
    setActiveTab(tab);
    
    if (isScrollLockedRef.current) {
      skipAnimation();
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Quiz diagnostic handler
  const handleAnswer = (question: 'skinType' | 'primaryConcern' | 'environment', val: string) => {
    const updated = { ...quizAnswers, [question]: val };
    setQuizAnswers(updated);
    
    if (question === 'skinType' && quizStep === 1) {
      setQuizStep(2);
    } else if (question === 'primaryConcern' && quizStep === 2) {
      setQuizStep(3);
    } else if (question === 'environment' && quizStep === 3) {
      // Calculate recommendation based on concern
      // default is Moisturizing Cream
      let match = PRODUCTS.find(p => p.id === 'moisturizing');
      
      if (val === 'urban' || updated.primaryConcern === 'dull') {
        match = PRODUCTS.find(p => p.id === 'toner') || match;
      } else if (updated.skinType === 'sensitive' || updated.primaryConcern === 'redness') {
        match = PRODUCTS.find(p => p.id === 'repair') || match;
      } else if (updated.primaryConcern === 'dry' || val === 'dry-air') {
        match = PRODUCTS.find(p => p.id === 'licorice') || match;
      } else if (updated.skinType === 'oily') {
        match = PRODUCTS.find(p => p.id === 'cleanser') || match;
      }
      
      setRecommendedProduct(match || PRODUCTS[2]);
      setQuizStep(4);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({ skinType: '', primaryConcern: '', environment: '' });
    setRecommendedProduct(null);
  };

  const isScrollLockedRef = React.useRef(isScrollLocked);
  isScrollLockedRef.current = isScrollLocked;

  const videoDurationRef = React.useRef(videoDuration);
  videoDurationRef.current = videoDuration;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      setIsScrolled(el.scrollTop > 50);
    };

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    // Smooth inertia wheel logic
    const handleWheel = (e: WheelEvent) => {
      const video = videoRef.current;
      if (!video) return;

      const locked = isScrollLockedRef.current;
      const duration = video.duration || videoDurationRef.current || 10;

      if (locked) {
        if (e.cancelable) {
          e.preventDefault();
        }

        // Keep paused for frame manual scrub control
        if (!video.paused) {
          video.pause();
        }

        // Adjust targetTimeRef.current with a balanced sensitivity
        const speedFactor = 0.0035;
        targetTimeRef.current += e.deltaY * speedFactor;

        // Clamp targeted video seek position
        if (targetTimeRef.current < 0.1) targetTimeRef.current = 0.1;
        if (targetTimeRef.current >= duration) {
          targetTimeRef.current = duration;
          isScrollLockedRef.current = false;
          setIsScrollLocked(false);
          setVideoEnded((prev) => prev ? prev : true);
        } else {
          isScrollLockedRef.current = true;
          setIsScrollLocked(true);
          setVideoEnded((prev) => prev ? false : prev);
        }
        setIsPlaying((prev) => prev ? prev : true);
      } else {
        // Scroll lock trigger from top scrolling up
        if (el.scrollTop <= 5 && e.deltaY < 0) {
          if (e.cancelable) {
            e.preventDefault();
          }
          isScrollLockedRef.current = true;
          setIsScrollLocked(true);
          setVideoEnded((prev) => prev ? false : prev);

          if (!video.paused) {
            video.pause();
          }

          const speedFactor = 0.0035;
          targetTimeRef.current += e.deltaY * speedFactor;
          if (targetTimeRef.current < 0.1) targetTimeRef.current = 0.1;
        }
      }
    };

    // Smooth inertia touch gesture support
    const handleTouchMove = (e: TouchEvent) => {
      const video = videoRef.current;
      if (!video) return;

      const locked = isScrollLockedRef.current;
      const duration = video.duration || videoDurationRef.current || 10;

      if (locked) {
        if (e.touches.length > 0) {
          if (e.cancelable) {
            e.preventDefault();
          }
          const currentY = e.touches[0].clientY;
          const deltaY = touchStartY - currentY;
          touchStartY = currentY;

          if (!video.paused) {
            video.pause();
          }

          const speedFactor = 0.006;
          targetTimeRef.current += deltaY * speedFactor;

          if (targetTimeRef.current < 0.1) targetTimeRef.current = 0.1;
          if (targetTimeRef.current >= duration) {
            targetTimeRef.current = duration;
            isScrollLockedRef.current = false;
            setIsScrollLocked(false);
            setVideoEnded((prev) => prev ? prev : true);
          } else {
            isScrollLockedRef.current = true;
            setIsScrollLocked(true);
            setVideoEnded((prev) => prev ? false : prev);
          }
          setIsPlaying((prev) => prev ? prev : true);
        }
      } else {
        if (el.scrollTop <= 5 && e.touches.length > 0) {
          const currentY = e.touches[0].clientY;
          const deltaY = touchStartY - currentY;
          if (deltaY < 0) {
            if (e.cancelable) {
              e.preventDefault();
            }
            isScrollLockedRef.current = true;
            setIsScrollLocked(true);
            setVideoEnded((prev) => prev ? false : prev);
            touchStartY = currentY;

            if (!video.paused) {
              video.pause();
            }

            const speedFactor = 0.006;
            targetTimeRef.current += deltaY * speedFactor;
            if (targetTimeRef.current < 0.1) targetTimeRef.current = 0.1;
          }
        }
      }
    };

    let lastMainTitleState = true;
    let lastProductCategoriesState = false;

    // Helper to update progress HUD directly in the DOM without triggering a React re-render
    const updateProgressHUD = (time: number) => {
      const duration = videoRef.current?.duration || videoDurationRef.current || 10;
      const pct = (time / duration) * 100;

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${Math.floor(pct)}%`;
        }
      }

      const nextMainTitleState = pct < 10;
      if (nextMainTitleState !== lastMainTitleState) {
        lastMainTitleState = nextMainTitleState;
        setShowMainTitle(nextMainTitleState);
      }

      const nextProductCategoriesState = pct >= 90;
      if (nextProductCategoriesState !== lastProductCategoriesState) {
        lastProductCategoriesState = nextProductCategoriesState;
        setShowProductCategories(nextProductCategoriesState);
      }
    };

    // Interpolation seek loop running at high performance (RAF)
    let animationFrameId: number;
    let lastSeekTime = 0;
    const SEEK_THROTTLE_MS = 50; // Throttle to max 20 seeks per second for perfectly smooth network rendering

    const smoothSeekLoop = () => {
      const video = videoRef.current;
      if (video) {
        const duration = video.duration || videoDurationRef.current || 10;
        if (targetTimeRef.current < 0.1) targetTimeRef.current = 0.1;
        if (targetTimeRef.current > duration) targetTimeRef.current = duration;

        const diff = targetTimeRef.current - video.currentTime;
        const now = performance.now();

        // If very close to target, snap immediately to prevent micro-jitter
        if (Math.abs(diff) < 0.01) {
          if (video.currentTime !== targetTimeRef.current) {
            video.currentTime = targetTimeRef.current;
            updateProgressHUD(targetTimeRef.current);
          }
        } else {
          // Throttled seeking to prevent browser decoder choke on network stream
          if (now - lastSeekTime > SEEK_THROTTLE_MS && !video.seeking) {
            // Apply a larger lerp coefficient (0.4) for crisp, responsive scroll tracking
            const nextTime = video.currentTime + diff * 0.40;
            video.currentTime = nextTime;
            updateProgressHUD(nextTime);
            lastSeekTime = now;
          }
        }
      }
      animationFrameId = requestAnimationFrame(smoothSeekLoop);
    };

    animationFrameId = requestAnimationFrame(smoothSeekLoop);

    el.addEventListener('scroll', handleScroll);
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Warm up video and initialize Hls.js for maximum performance, multi-browser support, and ultra-crisp resolution
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = "https://stream.mux.com/8okcG5P01Zic00ti3sGJxtGP3DJxhXe7CbF3ID93cYJeM.m3u8";
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,        // 将 TS 分片 demuxing 解包动作移至 Web Worker 线程
        lowLatencyMode: true,      // 极小延迟缓冲加载
        maxBufferLength: 45,       // 维持足够强劲的前缓冲
        maxMaxBufferLength: 60,
        backBufferLength: 90,      // 核心优化：保留 90 秒的历史回滚缓冲区！
        appendErrorMaxRetry: 5
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        // 核心性能与清晰度优化：为了彻底解决背景动画很模糊的问题，同时保证滚动寻帧的完美流畅，
        // 我们选择 1080p 作为在清晰度和解码性能上的最佳平衡。
        // 如果没有 1080p，则选择最接近 1080p 的最高分辨率级（如 720p），最高不超过 1080p 以免性能卡顿。
        let targetIndex = 0;
        let bestHeight = 0;
        
        data.levels.forEach((level, index) => {
          if (level.height) {
            if (level.height <= 1080 && level.height > bestHeight) {
              bestHeight = level.height;
              targetIndex = index;
            }
          }
        });

        if (bestHeight === 0 && data.levels.length > 0) {
          targetIndex = data.levels.length - 1;
        }

        hls!.currentLevel = targetIndex;
        
        // 默认显示第一帧，避免纯黑屏
        if (video.currentTime < 0.1) {
          video.currentTime = 0.1;
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // 针对 macOS / iOS Safari 等原生支持 HTTP Live Streaming 协议的设备
      video.src = hlsUrl;
      video.load();
      // 默认显示第一帧，避免纯黑屏
      if (video.currentTime < 0.1) {
        video.currentTime = 0.1;
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      if (videoRef.current.currentTime < 0.1) {
        videoRef.current.currentTime = 0.1;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Direct DOM update instead of setVideoProgress state to avoid triggering 60fps React re-renders
      const duration = videoRef.current.duration || videoDuration || 10;
      const pct = (videoRef.current.currentTime / duration) * 100;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${Math.floor(pct)}%`;
        }
      }
      
      setShowMainTitle(pct < 10);
      setShowProductCategories(pct >= 90);

      if (!videoDuration && videoRef.current.duration) {
        setVideoDuration(videoRef.current.duration);
      }
    }
  };

  const handleVideoEnded = () => {
    // Empty to prevent native browser onEnded events from overriding scroll locks during reverse scrolling
  };

  const skipAnimation = () => {
    isScrollLockedRef.current = false;
    setIsScrollLocked(false);
    setVideoEnded(true);
    setShowMainTitle(false);
    setShowProductCategories(false);
    if (videoRef.current) {
      const duration = videoRef.current.duration || videoDuration || 10;
      videoRef.current.pause();
      videoRef.current.currentTime = duration;
      targetTimeRef.current = duration;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `100%`;
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `100%`;
        }
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-[100] bg-gradient-to-b from-[#FAF8F5] via-[#FCFAF7] to-[#F5F2EE] text-[#33312E] ${isScrollLocked ? 'overflow-y-hidden' : 'overflow-y-auto'} font-sans antialiased select-none custom-scrollbar cursor-default`}
    >
      {/* Holographic & Premium design keyframes style */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.2; }
          50% { top: 100%; opacity: 0.9; }
        }
        @keyframes holoFlicker {
          0%, 100% { opacity: 0.96; filter: brightness(1) saturate(1.02); }
          50% { opacity: 1; filter: brightness(1.05) saturate(1.05); }
          25%, 75% { opacity: 0.92; filter: brightness(0.98); }
        }
        @keyframes wavePulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        .organic-glow-orb {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      
      {/* BACKGROUND FLOATING GLOSSY BUBBLES - Styled as Organic Water Droplets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full border border-white/50 bg-gradient-to-tr from-white/35 to-amber-100/10 backdrop-blur-[1px] shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.45),2px_2px_10px_rgba(180,140,110,0.06)]"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: bubble.size,
              height: bubble.size,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: 360,
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "easeInOut"
            }}
          />
        ))}
        {/* Soft atmospheric organic gradient blur lights */}
        <div className="absolute top-[20%] left-[60%] w-[45vw] h-[45vw] rounded-full bg-[#EAE2D8]/40 blur-[110px] -translate-x-1/2 -translate-y-1/2 organic-glow-orb" />
        <div className="absolute top-[60%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#F3ECE6]/35 blur-[130px] organic-glow-orb" />
      </div>

      {/* LUXURY TOP NAVIGATION BAR - Unified Deep Dark Theme to Match Cinematic Art Direction */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 md:px-12 flex justify-between items-center text-white backdrop-blur-md ${
        isScrolled 
          ? 'bg-black/90 border-b border-white/10 shadow-lg' 
          : 'bg-black/40 border-b border-white/5'
      }`}>
        {/* Left Side: Portfolio Navigation Back Link and PONT Wordmark Logo */}
        {isScrolled ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors mr-4 group uppercase tracking-widest font-mono"
            >
              <motion.span whileHover={{ x: -2 }} className="inline-block">←</motion.span>
              作品集
            </button>
            <div className="text-xl md:text-2xl font-light tracking-[0.25em] text-white font-sans cursor-pointer flex items-center" onClick={onClose}>
              P<span className="relative inline-block">O<span className="absolute -top-[1.5px] left-0 right-0 h-[1.5px] bg-white rounded-full" /></span>NT
            </div>
          </div>
        ) : (
          /* Left Links for cover page (from second picture) */
          <div className="flex items-center gap-6 text-xs font-semibold tracking-[0.18em] text-white/80">
            <button className="hover:text-white transition-colors">商城</button>
            <button className="hover:text-white transition-colors">品牌故事</button>
            <button className="hover:text-white transition-colors">护肤指南</button>
          </div>
        )}

        {/* Center Logo for cover page (when not scrolled) */}
        {!isScrolled && (
          <div className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-light tracking-[0.25em] text-white font-sans cursor-pointer flex items-center" onClick={onClose}>
            P<span className="relative inline-block">O<span className="absolute -top-[1.5px] left-0 right-0 h-[1.5px] bg-white rounded-full" /></span>NT
          </div>
        )}

        {/* Desktop Navbar for original pages (only shown when scrolled) - White/Light Typo for dark background */}
        {isScrolled && (
          <nav className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => scrollToSection('hero-section', 'PROTOCOL')}
              className={`text-xs font-semibold tracking-[0.18em] transition-all hover:text-white ${activeTab === 'PROTOCOL' ? 'text-white' : 'text-white/50'}`}
            >
              定制方案
            </button>
            <button 
              onClick={() => scrollToSection('ritual-section', 'INGREDIENTS')}
              className={`text-xs font-semibold tracking-[0.18em] transition-all hover:text-white ${activeTab === 'INGREDIENTS' ? 'text-white' : 'text-white/50'}`}
            >
              奢奢配方
            </button>
            <button 
              onClick={() => scrollToSection('results-section', 'RESULTS')}
              className={`text-xs font-semibold tracking-[0.18em] transition-all hover:text-white ${activeTab === 'RESULTS' ? 'text-white' : 'text-white/50'}`}
            >
              实证临床功效
            </button>
            <button 
              onClick={() => scrollToSection('consultation-section', 'CONSULTATION')}
              className={`text-xs font-semibold tracking-[0.18em] transition-all hover:text-white ${activeTab === 'CONSULTATION' ? 'text-white' : 'text-white/50'}`}
            >
              智能诊断
            </button>
          </nav>
        )}

        {/* Right Action buttons - Dark context buttons for both scroll states */}
        <div className="flex items-center gap-4">

          <button 
            onClick={() => scrollToSection('consultation-section', 'CONSULTATION')}
            className="rounded-full px-5 py-2 text-xs tracking-widest font-semibold transition-all duration-300 hover:scale-105 active:scale-95 bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md"
          >
            立即探索
          </button>
          
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full transition-all border hover:bg-white/10 text-white/80 hover:text-white border-white/20"
            title="关闭返回"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 w-full flex flex-col">
        
        {/* ========================================== */}
        {/* SECTION 1: HERO COVER SECTION             */}
        {/* ========================================== */}
        <section id="hero-section" className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
          {/* Background Mux Video Player */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover opacity-100"
              muted={isMuted}
              playsInline
              preload="auto"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              {...({ referrerPolicy: "no-referrer" } as any)}
            >
              Your browser does not support the video tag.
            </video>
            {/* Cinematic dark gradients to blend text beautifully */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/70 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>

          {/* COSMETICS OVERLAYS FOR >= 90% PROGRESS */}
          <AnimatePresence>
            {showProductCategories && (
              <>
                {/* Desktop layout */}
                <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-black/10 pointer-events-none"
                  />
                  {COSMETICS_OVERLAYS.map((item, idx) => (
                    <div key={item.id} className="absolute inset-0 pointer-events-none">
                      {/* Connector Line */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        style={{ 
                          left: item.left, 
                          top: item.cardTop, 
                          height: `calc(${item.dotTop} - ${item.cardTop})`,
                          transformOrigin: 'top'
                        }}
                        className="absolute w-[1px] border-l border-dashed border-white/30"
                      />

                      {/* Hotspot / Pulsing Dot */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: idx * 0.1 + 0.2 }}
                        style={{ left: item.left, top: item.dotTop }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5"
                      >
                        <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-ping opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E86D51]" />
                      </motion.div>

                      {/* Floating Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 80, 
                          damping: 15,
                          delay: idx * 0.12 
                        }}
                        style={{ left: item.left, top: item.cardTop }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                      >
                        <div className="bg-black/75 backdrop-blur-md border border-white/10 px-4 py-3.5 rounded-2xl w-[190px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-all duration-300 text-center relative group/card">
                          {/* Top indicator pin */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#E86D51]/80" />
                          
                          <span className="text-[9px] tracking-wider text-[#E86D51] font-semibold uppercase block mb-1">
                            {item.category}
                          </span>
                          <h4 className="text-white text-xs font-semibold tracking-wide mb-1 leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-white/60 text-[10px] leading-relaxed font-light">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>

                {/* Mobile layout */}
                <div className="absolute bottom-[100px] inset-x-0 z-20 px-6 md:hidden pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar pointer-events-auto snap-x"
                  >
                    {COSMETICS_OVERLAYS.map((item, idx) => (
                      <div 
                        key={item.id}
                        className="flex-shrink-0 w-[240px] bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl snap-center shadow-lg"
                      >
                        <span className="text-[10px] tracking-wider text-[#E86D51] font-semibold uppercase block mb-1">
                          {item.category}
                        </span>
                        <h4 className="text-white text-xs font-semibold tracking-wide mb-1">
                          {item.name}
                        </h4>
                        <p className="text-white/60 text-[10px] leading-relaxed font-light">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>

          {/* Core Content Layer */}
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 h-full flex flex-col justify-between py-28 relative z-10 pointer-events-none">
            {/* Top spacing */}
            <div />

            {/* Middle Section: Elegant Text Layout */}
            <AnimatePresence>
              {showMainTitle && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="flex flex-col space-y-6 md:space-y-8 max-w-2xl text-left"
                >
                  {/* Dynamic Pill Label from picture 2 */}
                  <div className="flex items-center gap-2 text-xs tracking-[0.25em] text-white/80 font-light">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      从肌肤
                    </span>
                    <span className="border border-white/30 px-3 py-0.5 rounded-full text-[10px] text-white/90 bg-white/5 font-medium">
                      到光采
                    </span>
                  </div>

                  {/* Majestic Unified Modern Main Header */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.25] tracking-wide font-sans drop-shadow-lg">
                    肌肤焕亮 <br />
                    <span className="font-sans font-light tracking-tight opacity-95">由此开始。</span>
                  </h1>

                  {/* Subheading */}
                  <p className="text-white/60 text-xs md:text-sm tracking-[0.4em] uppercase font-light leading-relaxed pl-1">
                    科学植萃 · 修护新生
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Section: Exploration Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full pt-8 border-t border-white/5 pointer-events-auto">
              {/* Left bottom: instruction HUD */}
              <div className="flex items-center gap-3">
                {isScrollLocked ? (
                  <div className="flex flex-col gap-1.5 items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] tracking-widest text-white/40 uppercase font-mono">ANIMATION_PROGRESS</span>
                      {!isPlaying && (
                        <>
                          <span className="text-white/20 text-[9px]">•</span>
                          <span className="text-[10px] tracking-wider text-white/70 animate-pulse flex items-center gap-1.5 font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-ping" />
                            滚动鼠标开始探索
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
                        <div 
                          ref={progressBarRef}
                          className="h-full bg-white transition-all duration-300"
                          style={{ width: `${videoDuration ? (targetTimeRef.current / videoDuration) * 100 : 0}%` }}
                        />
                      </div>
                      <span ref={progressTextRef} className="text-[10px] text-white/60 font-mono tracking-widest uppercase">
                        {Math.floor((videoDuration ? (targetTimeRef.current / videoDuration) * 100 : 0))}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => scrollToSection('ritual-section', 'INGREDIENTS')}
                    className="group flex items-center gap-2.5 bg-white text-black px-6 py-3 rounded-full text-xs font-semibold tracking-widest hover:bg-white/90 active:scale-95 transition-all duration-300"
                  >
                    探索产品系列
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              {/* Right bottom: Brand statement and action */}
              <div className="flex flex-col items-end text-right space-y-2.5">
                <p className="text-[10px] tracking-widest text-white/40 uppercase font-light">EXPLORE PÖNT HIGHLIGHTS</p>
                <p className="text-sm tracking-widest font-semibold text-white/90">探索 PÖNT 焕亮修护系列 · 开启细致护肤旅程</p>
                
                {/* Skip control and Downward arrow indicators */}
                <div className="flex items-center gap-4 mt-2">
                  {isScrollLocked && !videoEnded ? (
                    <button 
                      onClick={skipAnimation} 
                      className="text-[9px] tracking-widest text-white/50 hover:text-white transition-colors border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full font-mono flex items-center gap-1.5 uppercase transition-all duration-300"
                    >
                      跳过动画 SKIP INTRO
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        // Scroll past cover page smoothly to section 2
                        const el = document.getElementById('ritual-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2 text-xs text-white/80 hover:text-white tracking-widest animate-bounce group"
                    >
                      <span>向下探索</span>
                      <span className="w-6 h-6 rounded-full border border-white/20 group-hover:border-white/40 flex items-center justify-center text-xs transition-colors">↓</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sound control trigger bottom right floating */}
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 hover:border-white/25 text-white/80 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md"
              title={isMuted ? "开启声音" : "静音"}
            >
              {isMuted ? (
                /* Speaker Muted icon */
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V5.25z" />
                </svg>
              ) : (
                /* Speaker Sounding icon */
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              )}
            </button>
          </div>
        </section>

        {/* REST OF THE BRAND CONTENT - Wrapper to preserve spacing and alignment */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 space-y-24 md:space-y-36 w-full">

        {/* ========================================== */}
        {/* ORGANIMO ORGANIC WELLNESS & BIO-SCIENCE RIBBON */}
        {/* ========================================== */}
        <section className="py-8 border-y border-[#EBE6DF] bg-[#FAF8F5]/40 backdrop-blur-[2px] rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-8 text-center">
            <div className="space-y-1.5 group">
              <span className="block text-xs font-bold text-stone-800 tracking-widest uppercase group-hover:text-[#B44A32] transition-colors">100% Bio-Active</span>
              <span className="block text-[10px] text-stone-400 font-light">生物基纯净活性成分</span>
            </div>
            <div className="space-y-1.5 group border-l border-stone-200/60 max-md:border-l-0">
              <span className="block text-xs font-bold text-stone-800 tracking-widest uppercase group-hover:text-[#B44A32] transition-colors">ECOCERT Organic</span>
              <span className="block text-[10px] text-stone-400 font-light">欧盟 ECOCERT 天然有机标准</span>
            </div>
            <div className="space-y-1.5 group border-l border-stone-200/60">
              <span className="block text-xs font-bold text-stone-800 tracking-widest uppercase group-hover:text-[#B44A32] transition-colors">Vegan & Cruelty-Free</span>
              <span className="block text-[10px] text-stone-400 font-light">零残忍与百分百素食配方</span>
            </div>
            <div className="space-y-1.5 group border-l border-stone-200/60">
              <span className="block text-xs font-bold text-stone-800 tracking-widest uppercase group-hover:text-[#B44A32] transition-colors">Ecological Glass</span>
              <span className="block text-[10px] text-stone-400 font-light">可循环再降解环保玻璃瓶</span>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 2: PRODUCT LINEUP SHOWCASE        */}
        {/* ========================================== */}
        <section id="ritual-section" className="space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <span className="text-[11px] text-[#B44A32] uppercase tracking-[0.3em] font-bold block">PŌNT 奢宠抗皱仪式</span>
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-wide">
              御龄护肤 · <span className="font-sans italic font-normal text-[#B44A32]">重塑耀眼光彩</span>
            </h2>
            <div className="w-12 h-[1px] bg-[#B44A32] mx-auto mt-4" />
          </div>

          {/* Luxury Products Lineup Row with Dynamic Auto-Slider */}
          <div 
            className="relative px-4 md:px-12 py-4 group/slider overflow-visible"
            onMouseEnter={() => setIsSliderPaused(true)}
            onMouseLeave={() => setIsSliderPaused(false)}
          >
            {/* Left Slider Arrow */}
            <button 
              onClick={() => setSliderIndex((prev) => (prev === 0 ? PRODUCTS.length - visibleCount : prev - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 text-[#B44A32] border border-[#EBE6DF] shadow-[0_8px_20px_rgba(180,140,110,0.06)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#B44A32]/30"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
            </button>

            {/* Slider Viewport */}
            <div className="w-full overflow-hidden rounded-3xl py-2">
              <div 
                className="flex transition-transform duration-700 ease-[0.16,1,0.3,1]"
                style={{ 
                  transform: `translateX(-${sliderIndex * (100 / PRODUCTS.length)}%)`,
                  width: `${(PRODUCTS.length / visibleCount) * 100}%`
                }}
              >
                {PRODUCTS.map((product, idx) => (
                  <div 
                    key={product.id}
                    className="flex-shrink-0 px-3 cursor-pointer"
                    style={{ width: `${100 / PRODUCTS.length}%` }}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="group/card bg-white/95 backdrop-blur-md rounded-3xl border border-[#EBE6DF] hover:border-[#B44A32]/40 p-6 flex flex-col items-center justify-between shadow-[0_8px_30px_rgba(180,140,110,0.02)] hover:shadow-[0_15px_45px_rgba(180,140,110,0.06)] relative overflow-hidden h-full min-h-[460px]"
                    >
                      {/* Cosmetic liquid shine corner decoration */}
                      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${product.accentColor} opacity-5 rounded-bl-[100px] transition-all group-hover/card:scale-150 duration-500`} />
                      
                      {/* Card Header Info */}
                      <div className="w-full flex justify-between items-center z-10 mb-3">
                        <div className="w-6 h-6 rounded-full bg-[#FAF7F3] text-[#B44A32] flex items-center justify-center text-[10px] font-bold border border-[#E5DFD7] shadow-sm">
                          0{idx + 1}
                        </div>
                        <span className="text-[9px] font-bold text-stone-400 tracking-wider">STEP {idx + 1}</span>
                      </div>

                      {/* Product Image Stage */}
                      <div className="w-full aspect-[1.15] rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#F5F2EC] border border-[#EBE6DF] shadow-[inset_0_2px_8px_rgba(255,255,255,0.8)] flex items-center justify-center relative overflow-hidden p-0 group-hover/card:bg-gradient-to-b group-hover/card:from-[#FAF2EE] group-hover/card:to-[#F5ECE2] transition-colors duration-500">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover filter saturate-[1.04] transition-transform duration-500 scale-[1.22] group-hover/card:scale-[1.32]"
                        />
                      </div>

                      {/* Product Labels & Titles */}
                      <div className="w-full text-center space-y-2 mt-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-[10px] font-bold text-[#B44A32] tracking-widest uppercase truncate">
                            {product.id === 'licorice' ? '植萃焕颜水' :
                             product.category === 'TONER' ? '高能精粹水' : 
                             product.category === 'REPAIR' ? '修护精华液' : 
                             product.category === 'MOISTURIZING' ? '多效修护霜' : 
                             product.category === 'CLEANSER' ? '净化洁面乳' : '密集浓缩安瓶'}
                          </h3>
                          <h4 className="text-sm font-semibold text-stone-800 line-clamp-1 mt-1 group-hover/card:text-stone-950 transition-colors">{product.chineseName}</h4>
                          <span className="text-[9px] font-mono text-stone-400 block mt-0.5">{product.volume}</span>
                        </div>

                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-2 font-light leading-relaxed h-8">
                          {product.slogan}
                        </p>

                        {/* Interactive Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                          className="w-full mt-4 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#EBE6DF] hover:bg-[#FAF2EE] hover:border-[#E1D4C8] text-stone-700 hover:text-[#B44A32] text-[10px] font-semibold tracking-widest uppercase transition-all duration-300"
                        >
                          查看配方成分
                        </button>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Slider Arrow */}
            <button 
              onClick={() => setSliderIndex((prev) => (prev >= PRODUCTS.length - visibleCount ? 0 : prev + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 text-[#B44A32] border border-[#EBE6DF] shadow-[0_8px_20px_rgba(180,140,110,0.06)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#B44A32]/30"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
            </button>

            {/* Slider Dot Indicators */}
            <div className="flex justify-center items-center gap-2.5 mt-6">
              {Array.from({ length: PRODUCTS.length - visibleCount + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSliderIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${sliderIndex === idx ? 'bg-[#B44A32] w-6' : 'bg-[#B44A32]/20 hover:bg-[#B44A32]/50 w-2'}`}
                  title={`Slide to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </section>

        {/* ========================================== */}
        {/* SUB-SECTION 06: SCIENTIFIC FORMULA        */}
        {/* ========================================== */}
        <section id="formula-highlights-section" className="space-y-12 py-8 relative overflow-hidden">
          {/* Section Indicator on top-left, matching the 06 tag style */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F3] text-[#B44A32] flex items-center justify-center text-xs font-black border border-[#E5DFD7] shadow-sm">
              06
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#E5DFD7] to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left intro text & descriptions */}
            <div className="lg:col-span-4 space-y-6">
              <span className="text-[11px] text-[#B44A32] uppercase tracking-[0.2em] font-bold block">核心配方成分</span>
              <h2 className="text-3xl md:text-4xl font-light text-stone-900 leading-tight">
                科学精密复配 <br />
                <span className="font-sans italic font-normal text-[#B44A32]">灌注活性机能</span>
              </h2>
              <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-light">
                甄选多重高纯度天然植萃与现代生物医药科技活性。通过极简复配公式，在协同增效的同时给予面部温和屏障重构，让娇嫩肌重获莹润弹滑。
              </p>
              
              {/* Highlight statistics metrics */}
              <div className="pt-4 border-t border-[#EBE6DF] grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="block text-2xl font-serif text-[#B44A32]">99.6%</span>
                  <span className="block text-[10px] text-stone-400">生物源生态纯净度</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-2xl font-serif text-[#B44A32]">24H</span>
                  <span className="block text-[10px] text-stone-400">深层密集立体渗透</span>
                </div>
              </div>
            </div>

            {/* Middle Column: Interactive Botanical Science Dial Wheel */}
            <div className="lg:col-span-4 flex items-center justify-center py-6">
              <div className="relative w-full aspect-square max-w-[340px] md:max-w-[360px] rounded-full border border-stone-200/40 bg-stone-100/10 flex items-center justify-center p-4">
                {/* Rotating accent circle background */}
                <div className="absolute inset-2 rounded-full border border-dashed border-[#E5DFD7] opacity-60 animate-spin-slow" />
                
                {/* Connection lines from center to satellite nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100">
                  {[
                    { title: '山茶花', label: 'Camellia' },
                    { title: '玻尿酸', label: 'Hyaluronic' },
                    { title: '胜肽', label: 'Peptides' },
                    { title: '甘草根', label: 'Licorice' },
                    { title: '积雪草', label: 'Centella' }
                  ].map((_, idx) => {
                    const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
                    const x2 = 50 + 38 * Math.cos(angle);
                    const y2 = 50 + 38 * Math.sin(angle);
                    const isActive = activeIngredientIndex === idx;
                    return (
                      <line
                        key={idx}
                        x1="50"
                        y1="50"
                        x2={x2}
                        y2={y2}
                        stroke={isActive ? '#B44A32' : '#E5DFD7'}
                        strokeWidth={isActive ? '1.5' : '1'}
                        strokeDasharray={isActive ? 'none' : '2, 3'}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>

                {/* Central Nucleus Capsule Showcase */}
                <div className="relative w-36 h-36 rounded-full bg-white border border-[#E5DFD7] shadow-[0_12px_35px_rgba(180,140,110,0.08)] flex flex-col items-center justify-center p-3 text-center z-10">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F3] border border-[#E5DFD7] text-[#B44A32] flex items-center justify-center shadow-inner mb-1.5 animate-pulse">
                    {[
                      <Leaf className="w-5 h-5" key="camellia" />,
                      <Droplet className="w-5 h-5" key="hyaluronic" />,
                      <Sparkles className="w-5 h-5" key="peptides" />,
                      <Sparkle className="w-5 h-5" key="licorice" />,
                      <Shield className="w-5 h-5" key="centella" />
                    ][activeIngredientIndex]}
                  </div>
                  <span className="block text-[10px] font-bold text-[#B44A32] tracking-widest uppercase">
                    {[
                      'Camellia', 'Hyaluronic', 'Peptides', 'Licorice', 'Centella'
                    ][activeIngredientIndex]}
                  </span>
                  <span className="block text-[12px] text-stone-800 font-semibold mt-0.5">
                    {[
                      '山茶花精萃', '玻尿酸复合', '弹润六胜肽', '甘草根萃取', '积雪草修护'
                    ][activeIngredientIndex]}
                  </span>
                </div>

                {/* Outer interactive satellite nodes */}
                {[
                  { title: '山茶花', label: 'Camellia' },
                  { title: '玻尿酸', label: 'Hyaluronic' },
                  { title: '胜肽', label: 'Peptides' },
                  { title: '甘草根', label: 'Licorice' },
                  { title: '积雪草', label: 'Centella' }
                ].map((item, idx) => {
                  const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2; // Align 0 at top center
                  const x = 50 + 38 * Math.cos(angle); // percentage from center
                  const y = 50 + 38 * Math.sin(angle); // percentage from center
                  const isActive = activeIngredientIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      {/* Interactive satellite button */}
                      <button
                        onClick={() => setActiveIngredientIndex(idx)}
                        onMouseEnter={() => setActiveIngredientIndex(idx)}
                        className={`group/node flex flex-col items-center justify-center p-1.5 focus:outline-none`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                          isActive 
                            ? 'bg-[#B44A32] border-[#B44A32] text-white scale-110 shadow-[0_4px_12px_rgba(180,74,50,0.25)]' 
                            : 'bg-white border-[#E5DFD7] text-stone-600 hover:border-stone-400 hover:scale-105 shadow-sm'
                        }`}>
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        </div>
                        <span className={`block text-[9px] mt-1 font-medium px-1.5 py-0.5 rounded-md transition-all duration-500 ${
                          isActive 
                            ? 'bg-[#FAF2EE] text-[#B44A32] font-semibold' 
                            : 'bg-transparent text-stone-500 group-hover/node:text-stone-800'
                        }`}>
                          {item.title}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Lab Detail Display Card */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIngredientIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/95 backdrop-blur-md p-7 rounded-3xl border border-[#EBE6DF] shadow-[0_8px_30px_rgba(180,140,110,0.02)] space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-stone-400 tracking-[0.2em] block uppercase">
                        {[
                          'CAMELLIA EXTRACT',
                          'HYALURONIC COMPLEX',
                          'ACTIVE PEPTIDES',
                          'LICORICE ROOT',
                          'CENTELLA EXTRACT'
                        ][activeIngredientIndex]}
                      </span>
                      <h3 className="text-xl font-bold text-stone-900 mt-0.5">
                        {[
                          '山茶花抗氧精萃',
                          '立体玻尿酸复合物',
                          '胶原弹润六胜肽',
                          '高活甘草根提取物',
                          '积雪草密集修护因子'
                        ][activeIngredientIndex]}
                      </h3>
                    </div>
                    <span className="bg-[#FAF2EE] text-[#B44A32] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#FAF2EE]">
                      {[
                        '抗氧度 +94%',
                        '锁水度 +120%',
                        '紧致感 +88%',
                        '匀净度 +82%',
                        '自愈力 +96%'
                      ][activeIngredientIndex]}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed font-light">
                    {[
                      '甄选高品质天然红山茶花活能成分，富含抗氧化茶多酚与维生素，高效舒缓镇静，改善受损泛红，深层锁水保湿，让受损表皮屏障重获柔嫩光泽。',
                      '复配多种不同分子量的透明质酸钠，构建立体保水网。大分子地表锁水防干燥，小分子穿透真皮层注入丰沛水活能量，使干瘪粗糙肌肤瞬时充盈。',
                      '精心复配活性六胜肽与肌肽成分，直击胶原流失。激发深层纤维自愈与弹性胶原合成，显著抚平干纹、动态细纹，由内而外提拉紧实下垂面部轮廓。',
                      '含有高活性的光甘草定，被称为「美白黄金」，强效抑制酪氨酸酶活性，阻断黑色素沉积，舒缓微炎症，令肌肤呈现清透匀净的自然通透质感。',
                      '富含高纯度积雪草苷，是敏感肌的「自愈源泉」。高效促进表皮细胞新生与纤维连接，提供卓越的换季脱皮与红血丝密集修护，加速屏障愈合。'
                    ][activeIngredientIndex]}
                  </p>

                  <div className="pt-4 border-t border-[#EBE6DF] space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#FAF7F3] border border-[#E5DFD7] text-[#B44A32] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles size={11} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-bold text-stone-800">核心功效机制</span>
                        <span className="block text-[11px] text-stone-500 font-light">
                          {[
                            '舒缓发红，增强面部表皮屏障锁水能力，抵御外界氧化侵害。',
                            '立体补水保水，改善肌肤粗糙缺水，即刻润泽丰盈细胞。',
                            '平滑动态细纹与干纹，激发自身胶原合成，紧实下垂轮廓。',
                            '淡化色沉与黄气，改善面部暗沉不均，焕发通透净润。',
                            '改善泛红敏弱，加速脱皮受损修护，强效恢复自愈活力。'
                          ][activeIngredientIndex]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#FAF7F3] border border-[#E5DFD7] text-[#B44A32] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Leaf size={11} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-bold text-stone-800">尖端绿色萃取工艺</span>
                        <span className="block text-[11px] text-stone-500 font-light">
                          {[
                            '超声低温真空活性提取，百分百保留花瓣原始活性与营养分子。',
                            '高分子立体交联科技，形成纳米层级高透气保水隐形微膜。',
                            '高渗透活性脂质体包裹技术，直达基底层，释放多肽高活性能量。',
                            '专利物理吸附脱色，极高纯度富集光甘草定天然活性单体。',
                            '天然离心溶剂萃取，有效去除杂质，保留高纯度活性积雪草苷。'
                          ][activeIngredientIndex]}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* SUB-SECTION 07: SKINCARE ROUTINE          */}
        {/* ========================================== */}
        <section id="daily-ritual-steps-section" className="space-y-10 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F3] text-[#B44A32] flex items-center justify-center text-xs font-black border border-[#E5DFD7] shadow-sm">
              07
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#E5DFD7] to-transparent" />
          </div>

          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <span className="text-[11px] text-[#B44A32] uppercase tracking-[0.2em] font-bold block">护肤流程</span>
            <h2 className="text-3xl font-light text-stone-900 leading-tight">
              简单四步， <br className="sm:hidden" />
              <span className="font-sans italic font-normal text-[#B44A32]">开启每日护肤仪式</span>
            </h2>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed font-light">
              从温和清洁到密集抗皱修护，循序渐进锁住水分，打造更稳定、健康、有弹性的纯净奢美护肤体验。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 relative">
            {[
              {
                step: '01',
                title: '洁面',
                productName: '氨基酸温和清洁',
                tag: '深层温和净澈',
                desc: '温和带走油脂污垢与彩妆残留，不破坏油脂膜。',
                productObj: PRODUCTS[2],
                imageUrl: 'https://i.postimg.cc/KY1WRytr/Chat-GPT-Image-2026nian6yue30ri-11-44-52.png'
              },
              {
                step: '02',
                title: '爽肤',
                productName: '山茶花活氧爽肤水',
                tag: '第一步密集补水',
                desc: '微气泡活氧科技瞬间提亮暗沉，打通水活通道。',
                productObj: PRODUCTS[1],
                imageUrl: 'https://i.postimg.cc/13CTmzVB/Chat-GPT-Image-2026nian6yue30ri-11-44-55.png'
              },
              {
                step: '03',
                title: '修护',
                productName: '去皱保湿修护精华',
                tag: '密集活性肽抗衰',
                desc: '高浓度胜肽直击干纹细纹，提拉弹实面部轮廓。',
                productObj: PRODUCTS[0],
                imageUrl: 'https://i.postimg.cc/vm4Kcd5n/Chat-GPT-Image-2026nian6yue30ri-11-44-57.png'
              },
              {
                step: '04',
                title: '保湿',
                productName: '淡化和改善面霜',
                tag: '全天候锁水御龄',
                desc: '专研Winkiss脂质屏障网，牢牢锁住精华活性养分。',
                productObj: PRODUCTS[3],
                imageUrl: 'https://i.postimg.cc/PqC7Pk1w/Chat-GPT-Image-2026nian6yue30ri-11-44-59.png'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <motion.div
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedProduct(item.productObj)}
                  className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#EBE6DF] hover:border-[#B44A32]/40 p-5 flex flex-col justify-between items-center text-center shadow-[0_8px_30px_rgba(180,140,110,0.02)] transition-all duration-300 cursor-pointer relative overflow-hidden h-full min-h-[380px]"
                >
                  {/* Step tag */}
                  <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-[#FAF7F3] text-[#B44A32] flex items-center justify-center text-xs font-extrabold border border-white/80 shadow-sm">
                    {item.step}
                  </div>
                  
                  {/* Step Label right */}
                  <div className="absolute top-4 right-4 text-[9px] font-bold text-[#B44A32]/60 bg-[#FAF7F3]/60 px-2 py-0.5 rounded-full border border-[#E5DFD7]/40">
                    STEP {item.step}
                  </div>

                  {/* Stage for Product Image with zoom on hover and holographic sci-fi effects */}
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#F5F2EC] border border-[#EBE6DF] shadow-inner flex items-center justify-center relative overflow-hidden mt-6 group/stage">
                    {/* Background glow when hovered */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#B44A32]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    {/* The holographic emitter beam at the bottom (light cone/flare rising up) */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1/2 bg-gradient-to-t from-[#B44A32]/15 to-transparent blur-md rounded-t-full scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-out pointer-events-none" />

                    <img 
                      src={item.imageUrl} 
                      alt={item.productName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-bottom scale-100 filter saturate-[1.02] transition-all duration-700 ease-out group-hover:scale-[1.12] group-hover:rotate-[0.5deg] group-hover:[filter:saturate(1.05)_brightness(1.04)_drop-shadow(0_0_12px_rgba(180,74,50,0.2))]"
                      style={{ animation: 'holoFlicker 6s infinite alternate' }}
                    />

                    {/* Holographic Projection Scan Overlay (Sci-Fi Theme) */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      {/* Technical hud brackets in the corners */}
                      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#B44A32]/75" />
                      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#B44A32]/75" />
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#B44A32]/75" />
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#B44A32]/75" />

                      {/* Scanning vertical grid pattern */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(180,74,50,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(180,74,50,0.06)_1px,transparent_1px)] bg-[size:8px_8px] opacity-60 mix-blend-color-dodge" />
                      
                      {/* Horizontal scan line patterns */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(180,74,50,0.12)_50%,transparent_50%)] bg-[size:100%_4px] opacity-40" />

                      {/* Moving laser scanline with glow */}
                      <div 
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B44A32] to-transparent shadow-[0_0_8px_#B44A32,0_0_16px_rgba(180,74,50,0.6)] opacity-90"
                        style={{ animation: 'scan 3s linear infinite' }}
                      />

                      {/* Sci-Fi Status Overlay */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#B44A32]/30 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B44A32] animate-ping" />
                        <span className="text-[8px] font-mono font-bold text-[#B44A32] tracking-wider uppercase">
                          Holo-Projection
                        </span>
                      </div>

                      {/* Floating glowing circle radar / ring wave */}
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-[#B44A32]/30 opacity-0"
                        style={{ animation: 'wavePulse 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite' }}
                      />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="w-full mt-4 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#B44A32] uppercase tracking-wider">{item.title}</h3>
                      <h4 className="text-sm font-semibold text-stone-800 line-clamp-1">{item.productName}</h4>
                      <span className="inline-block text-[9px] font-bold text-stone-400 bg-[#FAF7F3] border border-[#E5DFD7] px-2 py-0.5 rounded-full mt-1">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed line-clamp-2 mt-2">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Right Arrow Connector (Only visible on large screen, except last element) */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-[-14px] z-20 w-7 h-7 rounded-full bg-[#FAF8F5] text-[#B44A32] border border-[#EBE6DF] items-center justify-center shadow-sm">
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* SUB-SECTION 08: REAL FEEDBACK TESTIMONIALS */}
        {/* ========================================== */}
        <section id="feedback-testimonials-section" className="space-y-10 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFF2EE] text-[#E86D51] flex items-center justify-center text-xs font-black border border-[#F4E2DC] shadow-sm">
              08
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#F4E2DC] to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Side: Stats Block */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-3">
                <span className="text-[11px] text-[#E86D51] uppercase tracking-[0.2em] font-bold block">真实反馈</span>
                <h2 className="text-3xl font-light text-slate-900 leading-tight">
                  看得见的改善， <br />
                  <span className="font-sans italic font-normal text-[#E86D51]">来自持续护理</span>
                </h2>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-light">
                  以科学温和的配方为基石，全方位修护角质层，让肌肤在每一次呼吸间呈现更透亮、水嫩、细腻与弹润的完美姿态。
                </p>
              </div>

              {/* Little custom progress list */}
              <div className="space-y-4">
                {[
                  { percent: '92%', label: '使用者证实肌肤水润度获得显著提升' },
                  { percent: '89%', label: '使用者证实肌肤毛孔与角质更加细腻' },
                  { percent: '85%', label: '使用者证实面部轮廓丰盈紧实且富有弹性' }
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-700">{stat.label}</span>
                      <span className="text-base font-black text-[#E86D51]">{stat.percent}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: stat.percent }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#FBC7B9] to-[#E86D51] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollToSection('results-section', 'RESULTS')}
                className="group inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#E86D51] hover:text-[#c4533a] transition-colors pt-2"
              >
                查看更多临床测试报告
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Side: Two speech-bubbles testimonials & Graphic Element */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Artistic blurred water/cell sphere graphic behind */}
              <div className="absolute right-0 bottom-[-20%] w-[240px] h-[240px] rounded-full bg-[#FAE5DF]/50 blur-[50px] pointer-events-none -z-10" />

              {/* Testimonial 1 */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/95 backdrop-blur-md rounded-[2rem] border border-[#F1DFD8] p-6 shadow-[0_8px_30px_rgba(232,109,81,0.02)] relative flex flex-col justify-between animate-fadeIn"
              >
                {/* Quote Icon decorative */}
                <div className="text-[64px] font-serif leading-none text-[#E86D51]/10 absolute top-2 left-4 pointer-events-none select-none">“</div>
                
                <div className="space-y-4 relative z-10 pt-4">
                  {/* Rating Stars */}
                  <div className="flex text-[#E86D51] gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Sparkles key={i} className="w-3.5 h-3.5 fill-[#E86D51]/20 text-[#E86D51]" />
                    ))}
                  </div>
                  
                  <p className="text-xs md:text-[13px] text-slate-700 font-light leading-relaxed">
                    “平时换季皮肤特别干、甚至发痒脱皮。自从试了PŌNT这一套山茶花爽肤水和修护精华，使用两周后，原本粗糙干燥的紧绷感就明显缓解了，而且非常清爽，完全不刺激不闷闭口，皮肤重现光泽感！”
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FFF2EE] to-[#FCD9CF] border border-white flex items-center justify-center text-xs font-bold text-[#E86D51] shadow-sm">
                      雨
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">小雨</h4>
                      <span className="text-[10px] text-slate-400 font-medium">混合肌 · 28岁</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                    已验证买家
                  </span>
                </div>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/95 backdrop-blur-md rounded-[2rem] border border-[#F1DFD8] p-6 shadow-[0_8px_30px_rgba(232,109,81,0.02)] relative flex flex-col justify-between animate-fadeIn"
              >
                {/* Quote Icon decorative */}
                <div className="text-[64px] font-serif leading-none text-[#E86D51]/10 absolute top-2 left-4 pointer-events-none select-none">“</div>
                
                <div className="space-y-4 relative z-10 pt-4">
                  {/* Rating Stars */}
                  <div className="flex text-[#E86D51] gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Sparkles key={i} className="w-3.5 h-3.5 fill-[#E86D51]/20 text-[#E86D51]" />
                    ))}
                  </div>
                  
                  <p className="text-xs md:text-[13px] text-slate-700 font-light leading-relaxed">
                    “作为一枚超级干皮，平时最怕抗衰护肤品厚重黏腻。这个面霜的质地轻盈如慕斯，触肤即融！适合作为每日的修护主力军。现在苹果肌和额头都有明显的充盈弹润感，小细纹基本看不出来了，绝对会无限回购！”
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FFF2EE] to-[#FCD9CF] border border-white flex items-center justify-center text-xs font-bold text-[#E86D51] shadow-sm">
                      琪
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">琪琪</h4>
                      <span className="text-[10px] text-slate-400 font-medium">干性肌 · 32岁</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                    已验证买家
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SUB-SECTION 09: CUSTOM SKINCARE EXCLUSIVE  */}
        {/* ========================================== */}
        <section id="exclusive-solution-section" className="space-y-10 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFF2EE] text-[#E86D51] flex items-center justify-center text-xs font-black border border-[#F4E2DC] shadow-sm">
              09
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#F4E2DC] to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Personalized Service Features */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-[11px] text-[#E86D51] uppercase tracking-[0.2em] font-bold block">专属方案</span>
                <h2 className="text-3xl font-light text-slate-900 leading-tight">
                  定制你的 <br />
                  <span className="font-sans italic font-normal text-[#E86D51]">专属护肤方案</span>
                </h2>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-light">
                  每个人的肌肤都是独一无二的。我们提供由AI支持的多维肌肤评测，并配有一对一专业顾问咨询服务，为您提供科学的产品搭配与调理建议。
                </p>
              </div>

              {/* Service list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: '了解肤质', desc: '科学多维测算，精确把握角质水分与油脂状态。', icon: <Users className="w-4 h-4 text-[#E86D51]" /> },
                  { title: '个性方案', desc: '根据年龄与肤质，智能定制晨晚间护理搭配。', icon: <BookOpen className="w-4 h-4 text-[#E86D51]" /> },
                  { title: '专家支持', desc: '专设美肤顾问一对一在线指导，随时解答护肤难题。', icon: <MessageSquare className="w-4 h-4 text-[#E86D51]" /> },
                  { title: '追踪改善', desc: '建立个人护肤档案，持续追踪胶原蛋白流失情况。', icon: <RefreshCw className="w-4 h-4 text-[#E86D51]" /> }
                ].map((svc, i) => (
                  <div key={i} className="p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-[#F1DFD8]/60 flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF2EE] flex-shrink-0 flex items-center justify-center border border-white">
                      {svc.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">{svc.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-light">{svc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Functional CTA */}
              <div className="flex gap-4">
                <button
                  onClick={() => scrollToSection('consultation-section', 'CONSULTATION')}
                  className="flex-1 py-3 px-6 rounded-2xl bg-[#E86D51] hover:bg-[#c4533a] text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-md shadow-[#E86D51]/10 flex items-center justify-center gap-1"
                >
                  开始智能肤质测验
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedProduct(PRODUCTS[0])}
                  className="py-3 px-6 rounded-2xl bg-white border border-[#F1DFD8] text-slate-700 hover:bg-[#FFF2EE] hover:text-[#E86D51] font-bold text-xs tracking-widest uppercase transition-all duration-300"
                >
                  立即挑选产品
                </button>
              </div>
            </div>

            {/* Right Column: Q&A Interactive Accordion */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                常见疑问解答 (PRODUCT & SKIN FAQ):
              </span>
              
              <div className="space-y-3.5">
                {[
                  {
                    q: '适合什么肤质?',
                    a: 'PŌNT系列化妆品精选山茶花精萃、多重活性肽及舒缓甘草酸二钾，采用安全低敏的天然配方。不含酒精、人造香料及强致敏性防腐剂，因此适合极度干性、油性、混合性、以及极易脆弱敏感泛红的肌肤，温和修护角质层。'
                  },
                  {
                    q: '如何搭配完整的护理流程?',
                    a: '为了让活性成分在细胞层级发挥最大协同保水及重塑效果，我们推荐科学四步曲：01 用氨基酸洗面奶温和洁肤 -> 02 用山茶花活氧爽肤水打开水活屏障 -> 03 涂抹去皱保湿修护精华淡化细纹 -> 04 抹上淡化面霜构筑长效滋润屏障网锁水。坚持晨晚护理。'
                  },
                  {
                    q: '多久能看到明显的肌肤改善?',
                    a: '经过50名测试者的临床医学反馈，大多数使用者在持续使用7天内即可感受到皮肤的水润饱满感与干燥脱屑明显改善；持续搭配使用14天以上，闭口及受损红血丝屏障基本恢复匀净；使用满28天（肌肤细胞天然更新周期），细纹与面部轮廓紧致提拉效果达到最佳。'
                  }
                ].map((item, idx) => {
                  const isOpen = activeAccordion === idx;
                  return (
                    <div 
                      key={idx}
                      className="bg-white/90 backdrop-blur-sm border border-[#F1DFD8] rounded-2xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setActiveAccordion(isOpen ? null : idx)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-xs md:text-sm text-slate-800 hover:text-[#E86D51] transition-colors focus:outline-none"
                      >
                        <span className="font-semibold flex items-center gap-3 text-left">
                          <span className="text-[#E86D51] font-mono text-[11px] font-black">Q{idx + 1}.</span>
                          {item.q}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-[#FFF2EE] flex items-center justify-center text-[#E86D51] flex-shrink-0">
                          {isOpen ? <Minus className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                          >
                            <div className="px-5 pb-5 pt-0 border-t border-slate-50 text-xs text-slate-500 font-light leading-relaxed">
                              <div className="bg-[#FFFDFD] p-4 rounded-xl border border-slate-100/60 shadow-inner">
                                {item.a}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 3: VISIBLE CLINICAL BENEFITS      */}
        {/* ========================================== */}
        <section id="results-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-[#F4E3DD] p-8 md:p-14 shadow-[0_15px_50px_rgba(232,109,81,0.03)] overflow-hidden relative">
          
          {/* Glass background spotlight */}
          <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FCE6DF]/40 blur-[80px] pointer-events-none" />

          {/* Left Columns - Content */}
          <div className="lg:col-span-6 space-y-8 relative z-10">
            <div className="space-y-3">
              <span className="text-[11px] text-[#E86D51] uppercase tracking-[0.2em] font-bold block">实证临床功效</span>
              <h2 className="text-3xl md:text-4xl font-light text-slate-900 leading-tight">
                卓越真实蜕变， <br />
                <span className="font-sans italic font-normal text-[#E86D51]">重焕耀眼自信</span>
              </h2>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-light max-w-md">
                由临床科研启发的先锋配方，致力于显著提升肌肤弹性、深层含水量及全面屏障自愈力。
              </p>
            </div>

            {/* Clinically Toggled Stats Grid */}
            <div className="space-y-5">
              {[
                { percent: '+92%', title: '受试者证实肌肤深层充盈保水*', details: '在为期4周的独立临床测试中，共50名受试女性每日两次使用山茶花活氧精粹水和密集修复安瓶。92%受试者证实其深层保水力获得飞跃式改善。' },
                { percent: '+89%', title: '受试者证实老化角质温和代谢，肌肤细腻光滑*', details: 'PHA剥脱果酸与神经酰胺的精妙复配。89%的受试者证实老化角质得到温和去角质修护，闭口泛红明显消退，角质屏障更加匀净光滑。' },
                { percent: '+85%', title: '受试者证实苹果肌饱满紧致，细纹得到显著减退*', details: '专研“Fade & Improve Winkiss”复合多肽对面部轮廓进行密集物理提拉。85%的测试者在测试结束后，感到苹果肌更显紧致丰盈、细纹褪去。' }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveStat(idx)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${activeStat === idx ? 'bg-white border-[#E86D51] shadow-md scale-[1.01]' : 'bg-transparent border-transparent hover:bg-white/40'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl md:text-4xl font-bold font-sans text-[#E86D51]">{stat.percent}</span>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">{stat.title}</span>
                      <span className="text-[10px] text-slate-400 block">独立临床评估测试数据</span>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {activeStat === idx && (
                      <motion.p
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 0.7, marginTop: 8 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="text-[11px] text-slate-700 leading-relaxed font-light border-t border-slate-100 pt-2"
                      >
                        {stat.details}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Results Button */}
            <button 
              onClick={() => scrollToSection('consultation-section', 'CONSULTATION')}
              className="group inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#E86D51] hover:text-[#c4533a] transition-colors"
            >
              在线肤质测验 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Columns - High-end Interactive Bubble Molecules */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center min-h-[350px] relative">
            {/* Interactive bubble generator container */}
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border border-pink-200/50 bg-[#FFF9F6]/50 shadow-[inset_0_0_50px_rgba(232,109,81,0.04)] relative overflow-hidden flex items-center justify-center cursor-pointer">
              
              {/* Dynamic Molecule Node Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-[#F7D5CD]/40 flex items-center justify-center"
              >
                {/* Node 1 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#F48D75] border border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white">H2O</div>
                {/* Node 2 */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#F48D75] border border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white">PHA</div>
              </motion.div>

              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute w-[50%] h-[50%] rounded-full border border-dashed border-[#F7D5CD]/60 flex items-center justify-center"
              >
                {/* Node 3 */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E86D51] border border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white">O2</div>
                {/* Node 4 */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E86D51] border border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white">BIO</div>
              </motion.div>

              {/* CORE CELL COLLAGEN SPHERE (Centered) */}
              <motion.div 
                animate={{ scale: [1, 1.08, 0.95, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#FFFDFD] via-[#FFEBE4] to-[#FFFFFF] border-2 border-white flex flex-col items-center justify-center shadow-[0_15px_40px_rgba(232,109,81,0.14)] z-10 text-center"
              >
                <div className="absolute inset-2 rounded-full border border-pink-200/40 bg-[#FFF]/10 backdrop-blur-[1px] shadow-[inset_1px_1px_4px_rgba(255,255,255,0.7)]" />
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase z-20">胶原蛋白</span>
                <span className="text-xl font-bold text-[#E86D51] z-20 mt-1">94.8%</span>
                <span className="text-[8px] text-slate-500 z-20 uppercase font-semibold">活性释放浓度</span>
              </motion.div>

              {/* Scientific grid coordinate markings */}
              <div className="absolute top-4 left-4 text-[9px] font-mono text-slate-300">STAGE_HYDRATION_MAP</div>
              <div className="absolute bottom-4 right-4 text-[9px] font-mono text-slate-300">PONT_SKIN_TECH v2.1</div>

            </div>
          </div>

        </section>

        {/* ========================================== */}
        {/* SECTION 4: SKINCARE CONSULTATION (QUIZ!)  */}
        {/* ========================================== */}
        <section id="consultation-section" className="bg-[#FFF4F0] border border-[#F4E3DD] rounded-[2.5rem] overflow-hidden shadow-[0_15px_45px_rgba(232,109,81,0.02)] grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Consultation Brand Intro Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#FEF2EE] to-[#FFF6F3] p-8 md:p-12 border-r border-[#F3E2DD] flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-[10px] text-[#E86D51] tracking-[0.25em] font-bold uppercase block">定制您的专属护肤公式</span>
              <h3 className="text-3xl font-light text-slate-900 leading-tight">
                智能肤质测验 <br />
                <span className="font-sans italic font-normal text-[#E86D51]">测验与配方推荐</span>
              </h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-light">
                只需30秒完成专业引导的肤质测验，即可精准诊断您的屏障健康度，并为您匹配最适合当前环境与护肤诉求的 PONT 专研配方。
              </p>
            </div>

            {/* Diagnostic Steps Grid Indicators */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-[#EEDAD3]">
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E86D51] shadow-sm"><Check size={14} /></div>
                <span className="text-[11px] text-slate-700 font-medium">深度理解肤质</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E86D51] shadow-sm"><Sparkles size={14} /></div>
                <span className="text-[11px] text-slate-700 font-medium">定制专属流程</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E86D51] shadow-sm"><Shield size={14} /></div>
                <span className="text-[11px] text-slate-700 font-medium">专家级配方支持</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E86D51] shadow-sm"><RefreshCw size={14} /></div>
                <span className="text-[11px] text-slate-700 font-medium">科学追踪改善</span>
              </div>
            </div>
          </div>

          {/* Right Quiz Form Column */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center min-h-[380px] bg-white/45">
            <AnimatePresence mode="wait">
              
              {/* QUIZ STEP 0: INTRO START */}
              {quizStep === 0 && (
                <motion.div 
                  key="quiz-intro"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-center lg:text-left"
                >
                  <h4 className="text-lg font-semibold text-slate-800">开始探索您的定制修护公式？</h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-md font-light mx-auto lg:mx-0">
                    我们的智能肤质评估考虑了您每日所处环境、角质屏障厚度及当前护肤核心痛点，帮助您匹配高能极光护肤方案。
                  </p>
                  <button
                    onClick={() => setQuizStep(1)}
                    className="px-8 py-3.5 rounded-full bg-slate-900 text-white text-xs tracking-widest font-semibold hover:bg-slate-800 transition-all duration-300"
                  >
                    开始测验 →
                  </button>
                </motion.div>
              )}

              {/* QUIZ STEP 1: SKIN TYPE */}
              {quizStep === 1 && (
                <motion.div 
                  key="quiz-step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">问题 01 / 03</span>
                    <span className="text-[10px] text-[#E86D51] font-bold tracking-wider uppercase">肌肤屏障状态</span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-800">您如何描述您肌肤当前的天然状态？</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: 'dry', label: '干燥紧绷 (Dry & Flaky)', desc: '经常感到水分流失，换季易脱皮' },
                      { val: 'oily', label: '油性泛光 (Oily & Active)', desc: '容易出油，毛孔明显，易长粉刺' },
                      { val: 'combination', label: '混合偏干/偏油 (Combination)', desc: 'T区较油，两颊偏干燥或中性' },
                      { val: 'sensitive', label: '脆弱敏感 (Sensitive & Thin)', desc: '角质层薄，遇到刺激容易泛红、发痒' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleAnswer('skinType', opt.val)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-[#E86D51] hover:bg-[#FFFDFD] text-left transition-all duration-300 group"
                      >
                        <span className="block text-xs font-semibold text-slate-800 group-hover:text-[#E86D51]">{opt.label}</span>
                        <span className="block text-[10px] text-slate-400 mt-1 font-light leading-snug">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* QUIZ STEP 2: PRIMARY CONCERN */}
              {quizStep === 2 && (
                <motion.div 
                  key="quiz-step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">问题 02 / 03</span>
                    <button onClick={() => setQuizStep(1)} className="text-[10px] text-slate-400 hover:text-slate-800 underline">← 返回上一步</button>
                  </div>
                  <h4 className="text-base font-semibold text-slate-800">您目前最希望通过日常护肤改善和解决的痛点是什么？</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: 'aging', label: '细纹与松弛 (Aging & Sagging)', desc: '开始出现细小皱纹，面部饱满度下降' },
                      { val: 'dry', label: '深度缺水 (Dehydration)', desc: '水分难以停留，皮肤暗哑、缺乏透亮感' },
                      { val: 'redness', label: '泛红与屏障受损 (Redness & Repair)', desc: '冷热交替泛红明显，换季刺痛干痒' },
                      { val: 'dull', label: '暗沉与粗糙 (Dull & Uneven)', desc: '熬夜作息不规律，气色疲惫无光泽' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleAnswer('primaryConcern', opt.val)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-[#E86D51] hover:bg-[#FFFDFD] text-left transition-all duration-300 group"
                      >
                        <span className="block text-xs font-semibold text-slate-800 group-hover:text-[#E86D51]">{opt.label}</span>
                        <span className="block text-[10px] text-slate-400 mt-1 font-light leading-snug">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* QUIZ STEP 3: ENVIRONMENT */}
              {quizStep === 3 && (
                <motion.div 
                  key="quiz-step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">问题 03 / 03</span>
                    <button onClick={() => setQuizStep(2)} className="text-[10px] text-slate-400 hover:text-slate-800 underline">← 返回上一步</button>
                  </div>
                  <h4 className="text-base font-semibold text-slate-800">您一天中大部分时间主要处于什么物理环境？</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: 'dry-air', label: '干燥空调房 (AC Dry Air)', desc: '写字楼恒温环境，水分蒸发快、静电紧绷明显' },
                      { val: 'humid', label: '闷热潮湿环境 (Humid & Hot)', desc: '户外闷热，容易出汗，油脂分泌旺盛' },
                      { val: 'cold-dry', label: '寒冷干燥气候 (Cold & Windy)', desc: '风寒较大，对角质屏障油脂补充要求极高' },
                      { val: 'urban', label: '城市通勤尾尘 (Urban Pollution)', desc: '每日通勤，接触城市微尘，需强抗氧与彻底净化' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleAnswer('environment', opt.val)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-[#E86D51] hover:bg-[#FFFDFD] text-left transition-all duration-300 group"
                      >
                        <span className="block text-xs font-semibold text-slate-800 group-hover:text-[#E86D51]">{opt.label}</span>
                        <span className="block text-[10px] text-slate-400 mt-1 font-light leading-snug">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* QUIZ STEP 4: RESULT */}
              {quizStep === 4 && recommendedProduct && (
                <motion.div 
                  key="quiz-result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6 text-center sm:text-left"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[10px] text-green-600 font-semibold tracking-wider font-mono">✔ 肤质智能诊断匹配完成</span>
                    <button onClick={resetQuiz} className="text-[10px] text-[#E86D51] hover:underline font-bold">重新测试</button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#FFF2EE]/50 p-6 rounded-2xl border border-[#F3E2DD]">
                    {/* Recommended Product Thumbnail */}
                    <div className="w-28 h-28 rounded-full bg-white border border-slate-100 flex items-center justify-center relative flex-shrink-0 overflow-hidden shadow-sm">
                      <div className="absolute top-1 right-1 bg-[#E86D51] text-white rounded-full text-[8px] font-bold w-6 h-6 flex items-center justify-center border border-white z-10">98%</div>
                      <img 
                        src={recommendedProduct.imageUrl} 
                        alt={recommendedProduct.name} 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover filter saturate-[1.05]" 
                      />
                    </div>
                    
                    <div className="space-y-1.5 flex-1 text-center sm:text-left">
                      <span className="text-[9px] bg-[#E86D51]/10 text-[#E86D51] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">您的专属定制御龄推荐</span>
                      <h5 className="text-sm font-bold text-slate-800">{recommendedProduct.chineseName}</h5>
                      <p className="text-[11px] text-slate-500 font-light leading-relaxed">{recommendedProduct.slogan}</p>
                      <span className="text-[9px] font-mono text-slate-400 block">完美匹配您的肤质状态及当前工作/生活物理环境。</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">定制配方推荐使用指南</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-light">{recommendedProduct.usage}</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(recommendedProduct);
                      }}
                      className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs tracking-widest font-semibold hover:bg-slate-800 transition-all shadow-sm"
                    >
                      查看临床核心配方
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </section>
      </div>

      </main>

      {/* ========================================== */}
      {/* BRAND FOOTER                              */}
      {/* ========================================== */}
      <footer className="bg-white border-t border-[#F5E6E1] relative z-10 py-16 px-6 md:px-12 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">
          
          {/* Logo column */}
          <div className="col-span-2 space-y-4">
            <div className="text-2xl font-light tracking-[0.25em] text-slate-900">
              P<span className="relative inline-block">O<span className="absolute -top-[1.5px] left-0 right-0 h-[1.5px] bg-slate-900 rounded-full" /></span>NT
            </div>
            <p className="text-slate-400 text-xs font-light leading-relaxed max-w-[200px]">
              致力于高端专研抗初老与皮肤屏障重建修护。融汇先锋医学护肤科技，奢享恒久莹润肤感。
            </p>
          </div>

          {/* Product Nav Column */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-slate-800 tracking-widest uppercase">臻品系列</h5>
            <ul className="space-y-2 text-xs font-light text-slate-500">
              {PRODUCTS.map(p => (
                <li key={p.id} className="hover:text-slate-800 transition-colors cursor-pointer" onClick={() => setSelectedProduct(p)}>
                  {p.chineseName}
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Column */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-slate-800 tracking-widest uppercase">关于品牌</h5>
            <ul className="space-y-2 text-xs font-light text-slate-500">
              <li className="hover:text-slate-800 transition-colors cursor-pointer">品牌故事</li>
              <li className="hover:text-slate-800 transition-colors cursor-pointer">科学理念</li>
              <li className="hover:text-slate-800 transition-colors cursor-pointer">奢珍活性配方</li>
              <li className="hover:text-slate-800 transition-colors cursor-pointer">可持续与绿色承诺</li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-slate-800 tracking-widest uppercase">尊享服务</h5>
            <ul className="space-y-2 text-xs font-light text-slate-500">
              <li className="hover:text-slate-800 transition-colors cursor-pointer" onClick={() => scrollToSection('consultation-section', 'CONSULTATION')}>智能肤质诊断</li>
              <li className="hover:text-slate-800 transition-colors cursor-pointer">常见问题</li>
              <li className="hover:text-slate-800 transition-colors cursor-pointer">安全配送与退换保障</li>
              <li className="hover:text-slate-800 transition-colors cursor-pointer">联系我们</li>
            </ul>
          </div>

          {/* Follow Us Socials Column */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-slate-800 tracking-widest uppercase">关注我们</h5>
            <div className="flex gap-4">
              {['微信', '小红书', '微博', '抖音'].map((soc) => (
                <span key={soc} className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs text-slate-400 hover:text-slate-800 hover:bg-[#FFF2EE] hover:border-[#E86D51]/30 transition-all cursor-pointer shadow-sm" title={soc}>
                  {soc[0]}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 block mt-2">© 2026 PŌNT. 保留所有权利。</span>
          </div>

        </div>
      </footer>

      {/* ========================================== */}
      {/* PRODUCT INGREDIENTS DRAWER / DETAIL MODAL  */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/45 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xl bg-white border border-[#E86D51]/15 rounded-3xl overflow-hidden shadow-2xl relative p-6 md:p-8 space-y-6 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-100 transition-all z-10"
              >
                <X size={16} />
              </button>

              <div className="flex gap-6 items-center border-b border-[#F7EAE5] pb-5">
                 {/* Visual Rectangular Showcase */}
                <div className="w-28 h-32 md:w-32 md:h-40 rounded-2xl bg-gradient-to-b from-[#FFFDFD] to-[#FAF6F4] border border-[#F2DDD7] flex items-center justify-center shadow-md overflow-hidden flex-shrink-0 p-0">
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.name} 
                    referrerPolicy="no-referrer" 
                    className="w-full h-full object-cover filter saturate-[1.08] transition-transform duration-300 scale-[1.22] hover:scale-[1.32]" 
                  />
                </div>
                
                <div>
                  <span className="inline-block bg-[#E86D51]/10 text-[#E86D51] font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {selectedProduct.category === 'TONER' ? '精粹水' : 
                     selectedProduct.category === 'REPAIR' ? '修护精华' : 
                     selectedProduct.category === 'MOISTURIZING' ? '多效修护霜' : 
                     selectedProduct.category === 'CLEANSER' ? '净化洁面' : '密集安瓶'}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-1">{selectedProduct.chineseName}</h4>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{selectedProduct.name}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">先锋医学配方机制</span>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{selectedProduct.description}</p>
              </div>

              {/* Core Ingredients Grid */}
              <div className="space-y-2.5">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">核心活性成分</span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.ingredients.map((ing, i) => (
                    <div key={i} className="flex gap-2 items-center bg-[#FFF2EE]/45 border border-[#F3E2DD] px-3 py-2 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E86D51]" />
                      <span className="text-xs text-slate-700 font-medium">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Instructions */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="block text-[9px] text-[#E86D51] font-bold uppercase tracking-widest">科学护肤手法说明</span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-light">{selectedProduct.usage}</p>
              </div>

              {/* Skin Types Match */}
              <div className="flex gap-2 items-center text-xs font-light text-slate-500">
                <Info size={14} className="text-[#E86D51]" />
                <span>{selectedProduct.skinType}</span>
              </div>

              {/* Closing Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-2.5 rounded-full bg-[#E86D51] text-white text-xs font-bold tracking-wider hover:bg-[#c4533a] transition-all"
                >
                  确认护肤程式
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
