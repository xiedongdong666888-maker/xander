import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js';
import { 
  ArrowRight, Sparkles, Droplet, Leaf, X, ChevronRight, ChevronLeft,
  Check, Info, Sparkle, Heart, RefreshCw, Shield, HelpCircle,
  Compass, Zap, Award, Users, BookOpen, MessageSquare, Plus, Minus,
  Play
} from 'lucide-react';
import { PontLoader } from '../ui/PontLoader';
import { FocusRail, type FocusRailItem } from '../ui/focus-rail';
import { ImageAutoSlider } from '../ui/image-auto-slider';

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

const DEMO_ITEMS: FocusRailItem[] = [
  {
    id: 1,
    title: "山茶花氨基酸洁面乳",
    description: "温和弱酸性洁颜，舒缓受损泛红屏障，洗后柔嫩透亮、不紧绷，唤醒肌肤纯净自愈力。",
    meta: "AMINO ACID • CLEANSER",
    imageSrc: "https://i.postimg.cc/B6frnB7D/1.png",
    href: "#cleanser",
  },
  {
    id: 2,
    title: "多肽高能赋活精华",
    description: "蕴含立体黄金多肽，精准淡化动态干纹细纹，层层饱满紧致，重塑面部立体流线轮廓。",
    meta: "ACTIVE PEPTIDE • ESSENCE",
    imageSrc: "https://i.postimg.cc/Hx1qk9vy/2.png",
    href: "#essence",
  },
  {
    id: 3,
    title: "极简奢护意境礼盒",
    description: "汲取大地沙色与温润几何线条灵感，倾呈经典密集护肤仪式，臻享奢美感官体验。",
    meta: "ELEGANT RITUAL • GIFT SET",
    imageSrc: "https://i.postimg.cc/zBYsGF2K/3.png",
    href: "#giftset",
  },
  {
    id: 4,
    title: "微分子精细调理水",
    description: "极速深层立体渗透，瞬时改善粗糙干燥缺水，建立肌肤透气储水网，尽显匀净水光感。",
    meta: "MICRO-MOLECULE • TONER",
    imageSrc: "https://i.postimg.cc/k4P0gvYW/4.png",
    href: "#toner",
  },
  {
    id: 5,
    title: "轻盈高透保水乳液",
    description: "清爽触肤即化，高效锁定面部活性机能，重构皮脂膜，构筑全天候强韧的水油平衡屏障。",
    meta: "BARRIER DEFENSE • LOTION",
    imageSrc: "https://i.postimg.cc/rmGv0R70/5.png",
    href: "#lotion",
  },
];

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
  
  // Custom luxury loader state matching picture 2
  const [isPontLoading, setIsPontLoading] = useState(true);
  
  // Immersive video cover section states
  const [isScrollLocked, setIsScrollLocked] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMainTitle, setShowMainTitle] = useState(true);
  const [showProductCategories, setShowProductCategories] = useState(false);
  const [showFiftyPercentMessage, setShowFiftyPercentMessage] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 850);
  };

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

  // Video expansion scroll progress and ref
  const [videoScrollProgress, setVideoScrollProgress] = useState(0);
  const videoScrollProgressRef = React.useRef(0);
  const beautyFilmTouchStartY = React.useRef(0);
  const beautyFilmSectionRef = React.useRef<HTMLDivElement>(null);
  const [beautyFilmPlaying, setBeautyFilmPlaying] = useState(true);
  const [beautyFilmMuted, setBeautyFilmMuted] = useState(true);
  const beautyFilmRef = React.useRef<HTMLVideoElement>(null);
  const mediaCardRef = React.useRef<HTMLDivElement>(null);

  const [beautyFilmCurrentTime, setBeautyFilmCurrentTime] = useState(0);
  const [beautyFilmDuration, setBeautyFilmDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [beautyFilmVolume, setBeautyFilmVolume] = useState(1);
  const [beautyFilmSpeed, setBeautyFilmSpeed] = useState(1);
  const [isHoveringMedia, setIsHoveringMedia] = useState(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState(true);
  const [isBeautyFilmLocked, setIsBeautyFilmLocked] = useState(false);

  // Resolution/Quality state for Beauty Film
  const [beautyFilmLevels, setBeautyFilmLevels] = useState<{ index: number; height: number; bitrate: number }[]>([]);
  const [beautyFilmQuality, setBeautyFilmQuality] = useState<number>(-1); // -1 = Auto
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const hlsInstanceRef = React.useRef<Hls | null>(null);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleChangeBeautyFilmQuality = (levelIndex: number) => {
    setBeautyFilmQuality(levelIndex);
    const hls = hlsInstanceRef.current;
    if (hls) {
      hls.currentLevel = levelIndex;
      hls.loadLevel = levelIndex;
    }
  };

  const getQualityName = () => {
    if (beautyFilmQuality === -1) return '自动';
    const lvl = beautyFilmLevels.find(l => l.index === beautyFilmQuality);
    if (!lvl) return '2K 超清'; // Default fallback indicating premium 2K
    if (lvl.height >= 1440) return '2K 极清';
    if (lvl.height >= 1080) return '1080P 超清';
    if (lvl.height >= 720) return '720P 高清';
    return `${lvl.height}P`;
  };

  // Close quality menu on global window click
  useEffect(() => {
    const handleGlobalClick = () => {
      setShowQualityMenu(false);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Initialize HLS for beauty film
  useEffect(() => {
    const video = beautyFilmRef.current;
    if (!video) return;

    const streamUrl = "https://stream.mux.com/BsS01SbPm1qJGXfSGOk00AOkeSmEAPm02qZ7rgpmzINfEI.m3u8";

    let hlsInstance: Hls | null = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native support (Safari, iOS)
      video.src = streamUrl;
    } else if (Hls.isSupported()) {
      // Hls.js support (Chrome, Firefox, etc.)
      hlsInstance = new Hls({
        autoStartLoad: false,
        maxMaxBufferLength: 30,
        maxBufferLength: 20,
        maxBufferSize: 100 * 1024 * 1024,
        abrEwmaDefaultEstimate: 150000000, // Force a very high starting bandwidth estimation (150Mbps) for instant 2K/HD quality
        capLevelToPlayerSize: false, // Ensure we don't limit quality based on player's initial small container size!
      });

      hlsInstanceRef.current = hlsInstance;

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (data.levels && data.levels.length > 0) {
          // Parse and store all available quality levels
          const levelsList = data.levels.map((level, idx) => ({
            index: idx,
            height: level.height || 0,
            bitrate: level.bandwidth || 0,
          })).sort((a, b) => b.height - a.height);
          setBeautyFilmLevels(levelsList);

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

          // Lock to the absolute highest 2K/1080p quality level by default to prioritize ultra-clarity!
          hlsInstance!.startLevel = targetIndex;
          hlsInstance!.currentLevel = targetIndex;
          hlsInstance!.loadLevel = targetIndex;
          setBeautyFilmQuality(targetIndex);

          hlsInstance!.startLoad();
        }
      });

      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, []);

  // Hook up event listeners for video current time and duration
  useEffect(() => {
    const video = beautyFilmRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setBeautyFilmCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setBeautyFilmDuration(video.duration || 0);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadedmetadata', handleDurationChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadedmetadata', handleDurationChange);
    };
  }, []);

  // Programmatic syncing of playing state
  useEffect(() => {
    const video = beautyFilmRef.current;
    if (!video) return;

    if (beautyFilmPlaying) {
      video.play().catch(err => {
        console.log("Play interrupted or blocked:", err);
      });
    } else {
      video.pause();
    }
  }, [beautyFilmPlaying]);

  // Programmatic syncing of muted state
  useEffect(() => {
    const video = beautyFilmRef.current;
    if (!video) return;
    video.muted = beautyFilmMuted;
  }, [beautyFilmMuted]);

  // Programmatic syncing of volume
  useEffect(() => {
    const video = beautyFilmRef.current;
    if (!video) return;
    video.volume = beautyFilmVolume;
    if (beautyFilmVolume > 0 && beautyFilmMuted) {
      setBeautyFilmMuted(false);
    } else if (beautyFilmVolume === 0 && !beautyFilmMuted) {
      setBeautyFilmMuted(true);
    }
  }, [beautyFilmVolume]);

  // Programmatic syncing of playback rate
  useEffect(() => {
    const video = beautyFilmRef.current;
    if (!video) return;
    video.playbackRate = beautyFilmSpeed;
  }, [beautyFilmSpeed]);

  const handleTogglePlayBeautyFilm = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextPlaying = !beautyFilmPlaying;
    setBeautyFilmPlaying(nextPlaying);
  };

  const handleToggleMuteBeautyFilm = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMute = !beautyFilmMuted;
    setBeautyFilmMuted(nextMute);
  };

  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = mediaCardRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === mediaCardRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Track user inactivity during fullscreen and auto-hide controls after 3 seconds
  useEffect(() => {
    if (!isFullscreen) {
      setIsFullscreenActive(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      setIsFullscreenActive(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsFullscreenActive(false);
      }, 3000);
    };

    // Initialize timer
    resetTimer();

    const container = mediaCardRef.current;
    if (container) {
      container.addEventListener('mousemove', resetTimer);
      container.addEventListener('click', resetTimer);
      container.addEventListener('touchstart', resetTimer);
    }

    return () => {
      clearTimeout(timeoutId);
      if (container) {
        container.removeEventListener('mousemove', resetTimer);
        container.removeEventListener('click', resetTimer);
        container.removeEventListener('touchstart', resetTimer);
      }
    };
  }, [isFullscreen]);

  // Autoplay or pause the beauty film based on expansion scroll progress
  useEffect(() => {
    if (videoScrollProgress >= 0.98) {
      setBeautyFilmPlaying(true);
    } else {
      setBeautyFilmPlaying(false);
    }
  }, [videoScrollProgress]);

  // Image auto-slider state for Product Lineup Showcase
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const [isSliderPaused, setIsSliderPaused] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(3);
  
  // Hero Auto-Play Showcase state
  const [isHeroPaused, setIsHeroPaused] = useState<boolean>(false);

  // Track window dimensions for perfect 16:9 responsive layout
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200, 
    height: typeof window !== 'undefined' ? window.innerHeight : 800 
  });

  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === PRODUCTS.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isHeroPaused]);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
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

  const isBeautyFilmLockedRef = React.useRef(isBeautyFilmLocked);
  isBeautyFilmLockedRef.current = isBeautyFilmLocked;

  // Sync state and ref helper
  const setBeautyFilmLocked = (val: boolean) => {
    isBeautyFilmLockedRef.current = val;
    setIsBeautyFilmLocked(val);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lastScrollTop = el.scrollTop;
    let lastEventTime = 0;

    const handleScroll = () => {
      lastEventTime = performance.now();
      const currentScroll = el.scrollTop;
      setIsScrolled(currentScroll > 50);
      setScrollTop(currentScroll);

      if (currentScroll > lastScrollTop + 1) {
        setBeautyFilmPlaying((playing) => {
          if (playing) return false;
          return playing;
        });
      }
      lastScrollTop = currentScroll;

      const beautyFilmSec = document.getElementById('beauty-film-section');
      if (beautyFilmSec && el) {
        const headerOffset = 80;
        const targetScroll = beautyFilmSec.offsetTop - headerOffset;
        const currentScroll = el.scrollTop;

        // Auto-calibration: snap progress when far away from the transition zone
        if (currentScroll < targetScroll - 150) {
          if (videoScrollProgressRef.current !== 0) {
            videoScrollProgressRef.current = 0;
            setVideoScrollProgress(0);
          }
        } else if (currentScroll > targetScroll + 150) {
          if (videoScrollProgressRef.current !== 1) {
            videoScrollProgressRef.current = 1;
            setVideoScrollProgress(1);
          }
        }
      }
    };

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        beautyFilmTouchStartY.current = e.touches[0].clientY;
      }
    };

    // Smooth inertia wheel logic
    const handleWheel = (e: WheelEvent) => {
      lastEventTime = performance.now();
      // 1. First, check beauty film section interaction
      const beautyFilmSec = document.getElementById('beauty-film-section');
      if (beautyFilmSec && !isScrollLockedRef.current) {
        const headerOffset = 80;
        const targetScroll = beautyFilmSec.offsetTop - headerOffset;
        const currentScroll = el.scrollTop;
        const progress = videoScrollProgressRef.current;
        const scrollingDown = e.deltaY > 0;

        let shouldLock = isBeautyFilmLockedRef.current;
        if (!shouldLock) {
          shouldLock = 
            (progress === 0 && scrollingDown && currentScroll >= targetScroll - 12) ||
            (progress === 1 && !scrollingDown && currentScroll <= targetScroll + 12);
        }

        if (shouldLock) {
          if (!isBeautyFilmLockedRef.current) {
            setBeautyFilmLocked(true);
            el.scrollTop = targetScroll;
          }
          if (e.cancelable) {
            e.preventDefault();
          }

          // Smoothly change expansion progress
          const speed = 0.0012; // smooth factor
          let nextProgress = progress + (scrollingDown ? speed : -speed) * Math.min(Math.abs(e.deltaY), 80);
          nextProgress = Math.min(Math.max(nextProgress, 0), 1);

          if (nextProgress === 0 || nextProgress === 1) {
            setBeautyFilmLocked(false);
          }

          videoScrollProgressRef.current = nextProgress;
          setVideoScrollProgress(nextProgress);
          return;
        }
      }

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
      lastEventTime = performance.now();
      // 1. First, check beauty film section interaction
      const beautyFilmSec = document.getElementById('beauty-film-section');
      if (beautyFilmSec && !isScrollLockedRef.current && e.touches.length > 0) {
        const headerOffset = 80;
        const targetScroll = beautyFilmSec.offsetTop - headerOffset;
        const currentScroll = el.scrollTop;
        const progress = videoScrollProgressRef.current;
        
        const currentY = e.touches[0].clientY;
        const deltaY = beautyFilmTouchStartY.current - currentY;
        beautyFilmTouchStartY.current = currentY; // Update current touch tracking

        const scrollingDown = deltaY > 0;

        let shouldLock = isBeautyFilmLockedRef.current;
        if (!shouldLock) {
          shouldLock = 
            (progress === 0 && scrollingDown && currentScroll >= targetScroll - 20) ||
            (progress === 1 && !scrollingDown && currentScroll <= targetScroll + 20);
        }

        if (shouldLock) {
          if (!isBeautyFilmLockedRef.current) {
            setBeautyFilmLocked(true);
            el.scrollTop = targetScroll;
          }
          if (e.cancelable) {
            e.preventDefault();
          }

          const speed = 0.0035; // Touch speed factor
          let nextProgress = progress + (scrollingDown ? speed : -speed) * Math.min(Math.abs(deltaY), 50);
          nextProgress = Math.min(Math.max(nextProgress, 0), 1);

          if (nextProgress === 0 || nextProgress === 1) {
            setBeautyFilmLocked(false);
          }

          videoScrollProgressRef.current = nextProgress;
          setVideoScrollProgress(nextProgress);
          return;
        }
      }

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
    let lastFiftyPercentState = false;

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

      const nextFiftyPercentState = pct >= 50 && pct < 60;
      if (nextFiftyPercentState !== lastFiftyPercentState) {
        lastFiftyPercentState = nextFiftyPercentState;
        setShowFiftyPercentMessage(nextFiftyPercentState);
      }

      const nextProductCategoriesState = pct >= 90;
      if (nextProductCategoriesState !== lastProductCategoriesState) {
        lastProductCategoriesState = nextProductCategoriesState;
        setShowProductCategories(nextProductCategoriesState);
      }
    };

    // Direct, ultra-responsive seek loop (RAF)
    let animationFrameId: number;
    let lastSeekTime = 0;
    const SEEK_THROTTLE_MS = 60; // Throttled during active scroll to protect CPU/decoder

    const smoothSeekLoop = () => {
      const video = videoRef.current;
      if (video) {
        const duration = video.duration || videoDurationRef.current || 10;
        if (targetTimeRef.current < 0.1) targetTimeRef.current = 0.1;
        if (targetTimeRef.current > duration) targetTimeRef.current = duration;

        const diff = targetTimeRef.current - video.currentTime;
        const now = performance.now();

        // If very close to target, snap immediately to prevent micro-jitter and unnecessary seeking
        if (Math.abs(diff) < 0.02) {
          if (video.currentTime !== targetTimeRef.current) {
            video.currentTime = targetTimeRef.current;
            updateProgressHUD(targetTimeRef.current);
          }
        } else {
          // Determine if the user is actively scrolling/touching
          const isScrollActive = (now - lastEventTime) < 150;

          if (isScrollActive) {
            // Throttled seeking during active scrolling to avoid choking the hardware decoder
            if (now - lastSeekTime > SEEK_THROTTLE_MS && !video.seeking) {
              video.currentTime = targetTimeRef.current;
              updateProgressHUD(targetTimeRef.current);
              lastSeekTime = now;
            }
          } else {
            // User stopped scrolling! Instantly seek directly to the final exact target time
            // as soon as the video is ready (not seeking), ensuring immediate 100% synchronization!
            if (!video.seeking) {
              video.currentTime = targetTimeRef.current;
              updateProgressHUD(targetTimeRef.current);
            }
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
        autoStartLoad: false,
        enableWorker: true,        // 将 TS 分片 demuxing 解包动作移至 Web Worker 线程
        lowLatencyMode: true,      // 极小延迟缓冲加载
        maxBufferLength: 45,       // 维持足够强劲的前缓冲
        maxMaxBufferLength: 60,
        backBufferLength: 90,      // 核心优化：保留 90 秒的历史回滚缓冲区！
        appendErrorMaxRetry: 5,
        abrEwmaDefaultEstimate: 50000000, // Force a very high starting bandwidth estimation (50Mbps) for instant HD quality
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
      setShowFiftyPercentMessage(pct >= 50 && pct < 60);
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
    setShowFiftyPercentMessage(false);
    setShowProductCategories(true);
    if (videoRef.current) {
      const duration = videoRef.current.duration || videoDuration || 10;
      const targetTime = Math.max(0.1, duration - 0.1);
      videoRef.current.pause();
      videoRef.current.currentTime = targetTime;
      targetTimeRef.current = targetTime;
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
    <>
      <AnimatePresence mode="wait">
        {isPontLoading && (
          <motion.div
            key="pont-loader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[1001]"
          >
            <PontLoader onComplete={() => setIsPontLoading(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        ref={containerRef}
        initial={{ scale: 1, opacity: 1, x: 0, y: 0, borderRadius: "0px", rotate: 0 }}
        animate={isExiting ? {
          scale: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.35 : 0.22,
          opacity: [1, 0.95, 0],
          x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : "-28vw",
          y: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : "8vh",
          borderRadius: "2.5rem",
          rotate: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : -3,
        } : {
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          borderRadius: "0px",
          rotate: 0,
        }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-[100] bg-gradient-to-b from-[#FAF8F5] via-[#FCFAF7] to-[#F5F2EE] text-[#33312E] ${(isScrollLocked || isBeautyFilmLocked || isPontLoading || isExiting) ? 'overflow-y-hidden' : 'overflow-y-auto'} font-sans antialiased select-none custom-scrollbar cursor-default origin-center shadow-[0_25px_60px_rgba(0,0,0,0.5)]`}
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
      
      {/* BACKGROUND MULTI-LAYER PARALLAX CLOUD & SCI-FI ENVIRONMENT */}
      {/* Layer 1: Deepest Atmospheric Layer (Ambient Glowing Orbs) - Moves very slowly */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        style={{ transform: `translateY(${scrollTop * 0.6}px)`, willChange: 'transform' }}
      >
        <div className="absolute top-[18%] left-[65%] w-[50vw] h-[50vw] rounded-full bg-[#EAE2D8]/35 blur-[115px] -translate-x-1/2 -translate-y-1/2 organic-glow-orb" />
        <div className="absolute top-[65%] left-[8%] w-[42vw] h-[42vw] rounded-full bg-[#F3ECE6]/30 blur-[130px] organic-glow-orb" />
      </div>

      {/* Layer 2: Skincare Droplet Layer (Floating Bubbles) - Moves at medium-slow speed */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        style={{ transform: `translateY(${scrollTop * 0.35}px)`, willChange: 'transform' }}
      >
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
      </div>

      {/* Layer 3: Cosmic Stardust & Coordinate Grid - Moves closer to real scroll speed */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        style={{ transform: `translateY(${scrollTop * 0.15}px)`, willChange: 'transform' }}
      >
        {/* Subtle high-tech sci-fi stardust coordinates layout */}
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Shimmering space particles matching the aesthetic of picture 2 */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = (i * 27) % 100;
          const y = (i * 31) % 90 + 5;
          const size = (i % 3) + 2.5; // size 2.5px to 4.5px
          return (
            <motion.div
              key={`stardust-${i}`}
              className="absolute rounded-full bg-white/45"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
              }}
              animate={{
                opacity: [0.25, 0.9, 0.25],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 5 + (i % 4) * 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          );
        })}
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
              onClick={handleClose}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors mr-4 group uppercase tracking-widest font-mono"
            >
              <motion.span whileHover={{ x: -2 }} className="inline-block">←</motion.span>
              作品集
            </button>
            <div className="text-xl md:text-2xl font-light tracking-[0.25em] text-white font-sans cursor-pointer flex items-center" onClick={handleClose}>
              P<span className="relative inline-block tracking-normal select-none" style={{ marginRight: '0.25em' }}><span className="relative inline-block">O<span className="absolute -top-[1.5px] left-0 right-0 h-[1.5px] bg-white rounded-full" /></span></span>NT
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
          <div className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-light tracking-[0.25em] text-white font-sans cursor-pointer flex items-center" onClick={handleClose}>
            P<span className="relative inline-block tracking-normal select-none" style={{ marginRight: '0.25em' }}><span className="relative inline-block">O<span className="absolute -top-[1.5px] left-0 right-0 h-[1.5px] bg-white rounded-full" /></span></span>NT
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
            onClick={handleClose}
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

          {/* Fifty Percent Video Progress Overlay */}
          <AnimatePresence>
            {showFiftyPercentMessage && (
              <motion.div
                key="fifty-percent-overlay"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.15 } },
                  exit: { opacity: 0, transition: { duration: 0.6, ease: "easeIn" } }
                }}
                className="absolute inset-0 z-30 flex flex-col justify-between p-8 md:p-20 pointer-events-none"
              >
                {/* Top spacer */}
                <div className="h-16" />

                {/* Center Content Block */}
                <div className="flex flex-col items-center text-center justify-center my-auto">
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
                      exit: { opacity: 0, y: -10, transition: { duration: 0.4 } }
                    }}
                    className="text-xs md:text-sm tracking-[0.4em] font-light text-white/90 uppercase mr-[-0.4em]"
                  >
                    氨基酸洁净 × 修护保湿
                  </motion.p>
                  
                  <motion.h2
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0, transition: { duration: 1.0, delay: 0.15, ease: "easeOut" } },
                      exit: { opacity: 0, y: -15, transition: { duration: 0.5 } }
                    }}
                    className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-[0.2em] leading-normal mt-6 select-none pl-6 mr-[-0.2em]"
                    style={{ fontFamily: "'Noto Serif SC', 'Playfair Display', Georgia, serif" }}
                  >
                    只为肌肤留下 <br />
                    <span className="block mt-2">纯净与焕亮</span>
                  </motion.h2>
                </div>

                {/* Bottom Left Content Block */}
                <div className="flex flex-col items-start text-left max-w-md pointer-events-auto mt-auto pb-28 md:pb-36">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } },
                      exit: { opacity: 0, x: -10, transition: { duration: 0.4 } }
                    }}
                    className="inline-block px-4 py-1.5 rounded-full border border-white/35 text-[10px] md:text-xs text-white/95 tracking-[0.25em] font-light bg-black/20 backdrop-blur-sm mb-4 uppercase mr-[-0.25em]"
                  >
                    焕亮修护
                  </motion.div>

                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: "easeOut" } },
                      exit: { opacity: 0, y: -5, transition: { duration: 0.4 } }
                    }}
                    className="text-[11px] md:text-xs text-white/80 font-light tracking-[0.2em] leading-relaxed"
                  >
                    PÖNT 以温和洁净与修护保湿配方，<br />
                    唤醒肌肤细腻光泽。
                  </motion.p>
                </div>
              </motion.div>
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
        <section id="ritual-section" className="scroll-mt-24 space-y-12">
          
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
      </div> {/* Close the first max-w-7xl container wrapper */}

      {/* ========================================== */}
      {/* INTERACTIVE BEAUTY FILM VIDEO EXPANSION SECTION */}
      {/* ========================================== */}
      <section 
        id="beauty-film-section" 
        ref={beautyFilmSectionRef}
        className="scroll-mt-24 relative w-full h-[75vh] min-h-[500px] md:h-[85vh] md:max-h-[720px] md:min-h-[580px] bg-transparent overflow-hidden md:max-w-[97vw] md:mx-auto flex flex-col items-center justify-center my-12 md:my-20"
      >
        {/* Dynamic 16:9 Black Box Background Container */}
        {(() => {
          const targetMaxW = windowDimensions.width < 768 ? (windowDimensions.width - 32) : Math.min(windowDimensions.width - 120, 1120);
          const targetMaxH = targetMaxW * 9 / 16;
          const initW = windowDimensions.width < 768 ? 200 : 340;
          const initH = windowDimensions.width < 768 ? 150 : 480;
          const videoW = initW + videoScrollProgress * (targetMaxW - initW);
          const videoH = initH + videoScrollProgress * (targetMaxH - initH);

          return (
            <>
              <div 
                className="absolute bg-stone-950 shadow-2xl overflow-hidden transition-all duration-200 pointer-events-none"
                style={{
                  width: `${targetMaxW}px`,
                  height: `${targetMaxH}px`,
                  borderRadius: windowDimensions.width < 768 ? '24px' : '32px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 5
                }}
              >
                {/* Parallax Dreamlike Background Image (Sunset over Water with Lotus) - Fixed 16:9 size to prevent scaling/stretching */}
                <div 
                  className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img 
                    src="https://i.postimg.cc/7ZTvmgMn/Chat-GPT-Image-2026nian7yue10ri-11-25-58.png"
                    alt="Dreamlike Background"
                    className="w-full h-full object-cover object-center filter brightness-95 saturate-[1.1]"
                    referrerPolicy="no-referrer"
                    style={{
                      transform: `translateY(${(videoScrollProgress - 0.5) * 40}px)`,
                      opacity: 1 - videoScrollProgress * 0.9,
                      transition: 'opacity 0.2s ease-out'
                    }}
                  />
                  {/* Ambient Water Reflection Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/60" />
                  <div className="absolute inset-0 bg-[#3d271e]/15 mix-blend-color-burn" />

                  {/* Glowing Sunset Sunray Light leak */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-orange-400/10 blur-[120px] pointer-events-none" />
                </div>

                {/* Glowing Translucent Bubble/Sparkle Layer - Locked to section bounds */}
                <div 
                  className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-white/20 bg-white/5 backdrop-blur-[1px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] animate-pulse"
                      style={{
                        width: `${25 + i * 15}px`,
                        height: `${25 + i * 15}px`,
                        bottom: `${10 + i * 15}%`,
                        left: `${15 + (i * 13) % 70}%`,
                        animationDelay: `${i * 1.2}s`,
                        animationDuration: `${4 + i * 2}s`,
                        opacity: (1 - videoScrollProgress * 1.3) * 0.4
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Top Brand Header (Picture 2 style) */}
              <div 
                className="absolute z-30 flex justify-between items-center pointer-events-none transition-all duration-300"
                style={{ 
                  opacity: Math.max(0, 1 - videoScrollProgress * 1.8),
                  width: `${targetMaxW - 64}px`,
                  left: '50%',
                  top: `calc(50% - ${targetMaxH / 2}px + 32px)`,
                  transform: 'translateX(-50%)'
                }}
              >
                {/* PŌNT Brand Logo */}
                <div className="flex items-center">
                  <span className="text-xl md:text-2xl font-light tracking-[0.25em] text-[#FCFAF7] font-sans">
                    P<span className="relative inline-block tracking-normal select-none" style={{ marginRight: '0.25em' }}><span className="relative inline-block">O<span className="absolute -top-[1px] left-0 right-0 h-[1.5px] bg-white rounded-full" /></span></span>NT
                  </span>
                </div>
                {/* Beauty Film Tag / Dropdown Selector */}
                <div>
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] font-semibold tracking-wider text-[#FCFAF7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    BEAUTY FILM
                    <span className="text-[8px] opacity-75">▼</span>
                  </div>
                </div>
              </div>

              {/* Slideway Headings Group */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
                style={{ zIndex: 25 }}
              >
                <div 
                  className="text-center space-y-2 md:space-y-4 px-4"
                  style={{
                    transform: `translateY(${(videoScrollProgress - 0.5) * -50}px)`
                  }}
                >
                  {/* "Immersive" heading sliding left */}
                  <h2 
                    className="text-4xl md:text-6xl lg:text-8xl font-serif font-light text-[#FCFAF7] tracking-wider filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-75 ease-out uppercase"
                    style={{
                      transform: `translateX(-${videoScrollProgress * 16}vw)`,
                      opacity: Math.max(0, 1 - videoScrollProgress * 1.8)
                    }}
                  >
                    Immersive
                  </h2>
                  {/* "Beauty Experience" heading sliding right */}
                  <h2 
                    className="text-4xl md:text-6xl lg:text-8xl font-serif font-light text-[#FCFAF7] tracking-wider filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-75 ease-out uppercase"
                    style={{
                      transform: `translateX(${videoScrollProgress * 16}vw)`,
                      opacity: Math.max(0, 1 - videoScrollProgress * 1.8)
                    }}
                  >
                    Beauty Experience
                  </h2>
                </div>
              </div>

              {/* Dynamic Expanding Central Card */}
              <div 
                ref={mediaCardRef}
                onMouseEnter={() => setIsHoveringMedia(true)}
                onMouseLeave={() => setIsHoveringMedia(false)}
                onClick={(e) => {
                  if (videoScrollProgress >= 0.8) {
                    handleTogglePlayBeautyFilm(e);
                  } else {
                    handleToggleMuteBeautyFilm(e);
                  }
                }}
                className={`group/mediacard relative flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-stone-900 border border-white/10 transition-all duration-200 ${
                  isFullscreen 
                    ? (isFullscreenActive ? 'cursor-default' : '!cursor-none') 
                    : 'cursor-pointer'
                }`}
                style={{
                  width: `${videoW}px`,
                  height: `${videoH}px`,
                  maxWidth: '100%',
                  maxHeight: '100vh',
                  borderRadius: isFullscreen ? '0px' : `${32 - videoScrollProgress * 8}px`,
                  zIndex: videoScrollProgress > 0.8 ? 20 : 15
                }}
              >
                {/* The Actual Skincare Water Splash Video (HLS Mux Stream) */}
                <video
                  ref={beautyFilmRef}
                  autoPlay
                  muted={beautyFilmMuted}
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover pointer-events-none"
                  style={{
                    scale: 1 + (1 - videoScrollProgress) * 0.12
              }}
            />

            {/* Bubble Mask Overlay inside Card */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
                opacity: 1 - videoScrollProgress
              }}
            />

            {/* Cosmetic Bottle Bubble Sphere Ring Decoration */}
            <div 
              className="absolute w-52 h-52 md:w-64 md:h-64 rounded-full border border-white/25 bg-gradient-to-tr from-white/5 to-white/15 backdrop-blur-[0.5px] pointer-events-none transition-all duration-300 shadow-[inset_0_4px_20px_rgba(255,255,255,0.25)] flex items-center justify-center"
              style={{
                opacity: Math.max(0, 1 - videoScrollProgress * 1.5),
                transform: `scale(${1 - videoScrollProgress * 0.2})`
              }}
            >
              {/* Inner bubble glow */}
              <div className="absolute inset-1 rounded-full border border-dashed border-white/15 animate-spin-slow" />
            </div>

            {/* Pulsing Translucent Play/Volume Button in Central Card */}
            {videoScrollProgress < 0.8 ? (
              <div 
                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-300"
                style={{ opacity: Math.max(0, 1 - videoScrollProgress * 1.3) }}
              >
                <div 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/15 border border-white/30 backdrop-blur-xl flex items-center justify-center text-white cursor-pointer shadow-2xl group-hover/mediacard:scale-110 active:scale-95 transition-all duration-300"
                >
                  {beautyFilmMuted ? (
                    /* Mute state shows custom Play icon + UNMUTE text */
                    <div className="flex flex-col items-center justify-center translate-y-0.5">
                      <svg className="w-6 h-6 md:w-7 md:h-7 fill-white translate-x-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="text-[8px] uppercase tracking-wider font-semibold text-white/80 mt-1 scale-90">UNMUTE</span>
                    </div>
                  ) : (
                    /* Active sound speaker */
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-6 h-6 md:w-7 md:h-7 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                      </svg>
                      <span className="text-[8px] uppercase tracking-wider font-semibold text-white/80 mt-1 scale-90">SOUND ON</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* When expanded and paused, show a large, gorgeous play button overlay */
              !beautyFilmPlaying && (
                <div 
                  className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-300 bg-black/45 backdrop-blur-[2px]"
                >
                  <div 
                    onClick={(e) => { e.stopPropagation(); handleTogglePlayBeautyFilm(e); }}
                    className="flex flex-col items-center justify-center gap-4 cursor-pointer pointer-events-auto group/playbtn"
                  >
                    {/* Glassmorphic Play Circle Container */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1A1A1A]/70 hover:bg-[#B44A32]/70 border border-white/20 hover:border-[#B44A32]/40 backdrop-blur-md flex items-center justify-center text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)] group-hover/playbtn:scale-110 active:scale-95 transition-all duration-300 relative">
                      {/* Interactive ring element */}
                      <div className="absolute inset-[-4px] rounded-full border border-white/5 group-hover/playbtn:border-[#B44A32]/30 group-hover/playbtn:scale-105 transition-all duration-300" />
                      
                      {/* Play Icon perfectly centered visually */}
                      <Play className="w-6 h-6 md:w-8 md:h-8 fill-white stroke-none pl-1 transition-transform duration-300 group-hover/playbtn:scale-105" />
                    </div>

                    {/* Luxurious, perfectly aligned label below */}
                    <span className="text-[10px] md:text-xs font-sans tracking-[0.35em] text-[#FCFAF7]/90 font-medium uppercase drop-shadow-md select-none group-hover/playbtn:text-white transition-colors duration-300">
                      CLICK TO PLAY
                    </span>
                  </div>
                </div>
              )
            )}

            {/* Immersive HUD volume level status overlay at bottom */}
            {videoScrollProgress > 0.8 && beautyFilmPlaying && (
              <div 
                className={`absolute left-6 md:left-10 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-all duration-500 ${
                  (isFullscreen ? isFullscreenActive : isHoveringMedia)
                    ? 'bottom-24 opacity-100 translate-y-0'
                    : 'bottom-6 opacity-0 translate-y-10'
                }`}
              >
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#B44A32] animate-pulse">SOUND SYSTEM ACTIVE</span>
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-[2.5px] rounded-full bg-white transition-all duration-300`} 
                      style={{ 
                        height: !beautyFilmMuted ? `${6 + idx * 4 + Math.sin(Date.now() / 150 + idx) * 4}px` : '3px'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Custom Interactive Glassmorphic Media Player Controls */}
            {videoScrollProgress >= 0.8 && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className={`absolute left-4 right-4 sm:left-6 sm:right-6 p-4 sm:p-6 bg-black/40 border border-white/10 backdrop-blur-3xl z-40 flex flex-col gap-4 rounded-2xl sm:rounded-3xl transition-all duration-500 select-none shadow-[0_24px_50px_rgba(0,0,0,0.7)] ${
                  (isFullscreen ? isFullscreenActive : isHoveringMedia)
                    ? 'bottom-4 sm:bottom-6 opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                    : 'bottom-0 opacity-0 translate-y-16 scale-95 pointer-events-none'
                }`}
              >
                <style dangerouslySetInnerHTML={{__html: `
                  .custom-media-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    outline: none;
                  }
                  .custom-media-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ffffff;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(255,255,255,0.9);
                    transition: transform 0.15s ease-in-out;
                  }
                  .custom-media-slider::-moz-range-thumb {
                    width: 8px;
                    height: 8px;
                    border: none;
                    border-radius: 50%;
                    background: #ffffff;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(255,255,255,0.9);
                    transition: transform 0.15s ease-in-out;
                  }
                  .custom-media-slider:hover::-webkit-slider-thumb {
                    transform: scale(1.6);
                  }
                  .custom-media-slider:hover::-moz-range-thumb {
                    transform: scale(1.6);
                  }
                `}} />

                {/* Row 1: Progress Bar & Time Display (matching picture top-level layout) */}
                <div className="flex items-center gap-4 w-full">
                  {/* Left Time Stamp */}
                  <span className="text-[11px] sm:text-xs font-sans font-medium text-white/90 select-none whitespace-nowrap min-w-[32px]">
                    {formatTime(beautyFilmCurrentTime)}
                  </span>

                  {/* Elegant Thin Timeline Input Slider */}
                  <input
                    type="range"
                    min="0"
                    max={beautyFilmDuration || 100}
                    value={beautyFilmCurrentTime}
                    onChange={(e) => {
                      const newTime = parseFloat(e.target.value);
                      const video = beautyFilmRef.current;
                      if (video) {
                        video.currentTime = newTime;
                        setBeautyFilmCurrentTime(newTime);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="custom-media-slider flex-1 h-[3px] rounded-lg cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-150 outline-none"
                    style={{
                      background: `linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) ${beautyFilmDuration ? (beautyFilmCurrentTime / beautyFilmDuration) * 100 : 0}%, rgba(255, 255, 255, 0.15) ${beautyFilmDuration ? (beautyFilmCurrentTime / beautyFilmDuration) * 100 : 0}%, rgba(255, 255, 255, 0.15) 100%)`
                    }}
                  />
                  
                  {/* Right Time Stamp */}
                  <span className="text-[11px] sm:text-xs font-sans font-medium text-white/90 select-none whitespace-nowrap min-w-[32px] text-right">
                    {formatTime(beautyFilmDuration)}
                  </span>
                </div>

                {/* Row 2: Play/Pause, Volume, and Speed Selector Buttons */}
                <div className="flex items-center justify-between w-full">
                  {/* Left Controls (Play and Volume) */}
                  <div className="flex items-center gap-6">
                    {/* Play/Pause Button */}
                    <button
                      onClick={(e) => handleTogglePlayBeautyFilm(e)}
                      className="text-white hover:scale-110 active:scale-95 transition-all p-1 outline-none"
                      title={beautyFilmPlaying ? "Pause" : "Play"}
                    >
                      {beautyFilmPlaying ? (
                        /* Simple stroke-only pause icon */
                        <svg className="w-5 h-5 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                          <line x1="6" y1="4" x2="6" y2="20" strokeLinecap="round" strokeLinejoin="round" />
                          <line x1="18" y1="4" x2="18" y2="20" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        /* Simple stroke-only play icon */
                        <svg className="w-5 h-5 fill-none stroke-white stroke-2 translate-x-0.5" viewBox="0 0 24 24">
                          <polygon points="5 3 19 12 5 21 5 3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    {/* Volume Speaker Button & Custom Volume Slider Slider */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={(e) => handleToggleMuteBeautyFilm(e)}
                        className="text-white hover:scale-105 active:scale-95 transition-all p-0.5 outline-none"
                        title={beautyFilmMuted ? "Unmute" : "Mute"}
                      >
                        {beautyFilmMuted ? (
                          <svg className="w-[18px] h-[18px] fill-none stroke-white/60 stroke-2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H2.25A.75.75 0 001.5 9.75v4.5c0 .414.336.75.75.75h2.25l2.75 2.25a.75.75 0 001.25-.53V5.53a.75.75 0 00-1.25-.53z" />
                          </svg>
                        ) : (
                          <svg className="w-[18px] h-[18px] fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                          </svg>
                        )}
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={beautyFilmMuted ? 0 : beautyFilmVolume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setBeautyFilmVolume(val);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="custom-media-slider w-16 sm:w-24 h-[3px] rounded-lg cursor-pointer bg-white/20 transition-all duration-150 outline-none"
                        style={{
                          background: `linear-gradient(to right, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) ${(beautyFilmMuted ? 0 : beautyFilmVolume) * 100}%, rgba(255, 255, 255, 0.15) ${(beautyFilmMuted ? 0 : beautyFilmVolume) * 100}%, rgba(255, 255, 255, 0.15) 100%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Controls (Speed Selector & Fullscreen) */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Playback speed options from 0.5x to 2x (matching picture precisely) */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {[0.5, 1, 1.5, 2].map((speedValue) => {
                        const isActive = beautyFilmSpeed === speedValue;
                        return (
                          <button
                            key={speedValue}
                            onClick={(e) => {
                              e.stopPropagation();
                              setBeautyFilmSpeed(speedValue);
                            }}
                            className={`text-xs font-sans tracking-wide font-medium select-none transition-all duration-200 outline-none px-2.5 py-1 rounded-lg ${
                              isActive 
                                ? 'bg-black/35 border border-white/10 text-white font-semibold shadow-inner' 
                                : 'text-white/60 hover:text-white/95 cursor-pointer'
                            }`}
                          >
                            {speedValue}x
                          </button>
                        );
                      })}
                    </div>

                    {/* Premium Resolution Switcher */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQualityMenu(!showQualityMenu);
                        }}
                        className="text-xs font-sans tracking-wide font-medium select-none transition-all duration-200 outline-none px-2.5 py-1 rounded-lg bg-[#B44A32]/10 border border-[#B44A32]/35 text-[#FCD9CF] hover:bg-[#B44A32]/25 hover:text-white cursor-pointer flex items-center gap-1.5"
                        title="视频清晰度"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {getQualityName()}
                      </button>

                      {showQualityMenu && (
                        <div 
                          className="absolute bottom-10 right-0 w-36 bg-[#121212]/95 border border-white/10 rounded-xl shadow-2xl p-1.5 z-[100] flex flex-col gap-1 backdrop-blur-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-[10px] text-white/40 font-sans font-semibold tracking-wider uppercase px-2 py-1 select-none">
                            选择分辨率
                          </div>
                          
                          {/* Force/Fixed options to choose from */}
                          {beautyFilmLevels.length > 0 ? (
                            beautyFilmLevels.map((level) => {
                              const isSelected = beautyFilmQuality === level.index;
                              let label = `${level.height}p`;
                              if (level.height >= 1440) label = '2K 极清';
                              else if (level.height >= 1080) label = '1080P 超清';
                              else if (level.height >= 720) label = '720P 高清';
                              
                              return (
                                <button
                                  key={level.index}
                                  onClick={() => {
                                    handleChangeBeautyFilmQuality(level.index);
                                    setShowQualityMenu(false);
                                  }}
                                  className={`w-full text-left text-xs font-sans px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                                    isSelected 
                                      ? 'bg-[#B44A32]/20 text-[#FCD9CF] font-medium' 
                                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                                  }`}
                                >
                                  <span>{label}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                </button>
                              );
                            })
                          ) : (
                            // Fallback standard options if Hls levels aren't loaded yet or on native iOS Safari
                            <>
                              <button
                                onClick={() => {
                                  handleChangeBeautyFilmQuality(-1);
                                  setShowQualityMenu(false);
                                }}
                                className={`w-full text-left text-xs font-sans px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                                  beautyFilmQuality === -1 
                                    ? 'bg-[#B44A32]/20 text-[#FCD9CF] font-medium' 
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <span>2K 极清 (默认)</span>
                                {beautyFilmQuality === -1 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                              </button>
                            </>
                          )}
                          
                          {beautyFilmLevels.length > 0 && (
                            <button
                              onClick={() => {
                                handleChangeBeautyFilmQuality(-1);
                                setShowQualityMenu(false);
                              }}
                              className={`w-full text-left text-xs font-sans px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all border-t border-white/5 mt-1 pt-1.5 ${
                                beautyFilmQuality === -1 
                                  ? 'bg-[#B44A32]/20 text-[#FCD9CF] font-medium' 
                                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span>自动 (自适应)</span>
                              {beautyFilmQuality === -1 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Fullscreen Toggle (retained feature with modern icon design) */}
                    <button
                      onClick={handleToggleFullscreen}
                      className="text-white hover:text-[#B44A32] hover:scale-110 active:scale-95 transition-all p-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 ml-1"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? (
                        <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3 3m12 6V4.5m0 4.5h4.5m-4.5 0l6-6M9 15v4.5M9 15H4.5m4.5 0l-6 6m12-6v4.5m0-4.5h4.5m-4.5 0l6 6" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Branding & Explorer Footer (Picture 2 style) */}
          <div 
            className="absolute z-30 flex justify-between items-end pointer-events-none transition-all duration-300 text-white/80"
            style={{ 
              opacity: Math.max(0, 1 - videoScrollProgress * 1.8),
              width: `${targetMaxW - (windowDimensions.width < 768 ? 48 : 96)}px`,
              left: '50%',
              top: `calc(50% + ${targetMaxH / 2}px - ${windowDimensions.width < 768 ? 24 : 32}px)`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {/* PŌNT COSMETICS label */}
            <div className="space-y-0.5">
              <span className="block text-[10px] font-bold tracking-[0.2em] text-[#B44A32] uppercase">PŌNT ATELIER</span>
              <span className="block text-xs font-light tracking-[0.1em] text-white/80">PREMIUM BEAUTY SHIFT</span>
            </div>
            
            {/* Scroll to Explore with chevron indicator */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[9px] font-mono tracking-[0.25em] text-white/60 animate-pulse uppercase">SCROLL TO EXPAND</span>
              <div className="w-7 h-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center animate-bounce">
                <svg className="w-3.5 h-3.5 stroke-white stroke-2" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
            </>
          );
        })()}
      </section>

        {/* Re-open the max-w-7xl container wrapper for the remaining sections */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 space-y-24 md:space-y-36 w-full">

        {/* ========================================== */}
        {/* SUB-SECTION 01: PACKAGING DESIGN          */}
        {/* ========================================== */}
        <section id="formula-highlights-section" className="space-y-12 py-8 relative overflow-hidden">
          {/* Section Indicator on top-left, matching the 01 tag style */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F3] text-[#B44A32] flex items-center justify-center text-xs font-black border border-[#E5DFD7] shadow-sm">
              01
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#E5DFD7] to-transparent" />
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[11px] text-[#B44A32] uppercase tracking-[0.2em] font-bold block">PACKAGING DESIGN</span>
              <h2 className="text-3xl md:text-4xl font-light text-stone-900 leading-tight">
                包装设计 <span className="font-sans italic font-normal text-[#B44A32]">极简至美</span>
              </h2>
            </div>

            <FocusRail 
              items={DEMO_ITEMS} 
              autoPlay={false} 
              loop={true} 
            />
          </div>
        </section>

        {/* ========================================== */}
        {/* SUB-SECTION 02: MERCHANDISE DESIGN        */}
        {/* ========================================== */}
        <section id="merchandise-design-section" className="space-y-12 py-8 relative overflow-hidden">
          {/* Section Indicator on top-left, matching the 02 tag style */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F3] text-[#B44A32] flex items-center justify-center text-xs font-black border border-[#E5DFD7] shadow-sm">
              02
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#E5DFD7] to-transparent" />
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[11px] text-[#B44A32] uppercase tracking-[0.2em] font-bold block">MERCHANDISE DESIGN</span>
              <h2 className="text-3xl md:text-4xl font-light text-stone-900 leading-tight">
                周边设计 <span className="font-sans italic font-normal text-[#B44A32]">美学延展</span>
              </h2>
            </div>

            <ImageAutoSlider />
          </div>
        </section>

        {/* ========================================== */}
        {/* SUB-SECTION 03: SKINCARE ROUTINE          */}
        {/* ========================================== */}
        <section id="daily-ritual-steps-section" className="space-y-10 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F3] text-[#B44A32] flex items-center justify-center text-xs font-black border border-[#E5DFD7] shadow-sm">
              03
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
        {/* SECTION 3: VISIBLE CLINICAL BENEFITS      */}
        {/* ========================================== */}
        <section id="results-section" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-[#F4E3DD] p-8 md:p-14 shadow-[0_15px_50px_rgba(232,109,81,0.03)] overflow-hidden relative">
          
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
        <section id="consultation-section" className="scroll-mt-24 bg-[#FFF4F0] border border-[#F4E3DD] rounded-[2.5rem] overflow-hidden shadow-[0_15px_45px_rgba(232,109,81,0.02)] grid grid-cols-1 lg:grid-cols-12">
          
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
            <div className="text-2xl font-light tracking-[0.25em] text-slate-900 flex items-center">
              P<span className="relative inline-block tracking-normal select-none" style={{ marginRight: '0.25em' }}><span className="relative inline-block">O<span className="absolute -top-[1.5px] left-0 right-0 h-[1.5px] bg-slate-900 rounded-full" /></span></span>NT
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

      {/* Cinematic Exit Card Overlay */}
      <AnimatePresence>
        {isExiting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="absolute inset-0 z-[200] flex flex-col justify-between p-8 md:p-12 bg-gradient-to-b from-[#FAF8F5] via-[#FCFAF7] to-[#F5F2EE] text-[#4A3E3D]"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Soft, luxurious reflections matching picture 2 */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_55%)] pointer-events-none" />
            
            <div /> {/* Top spacer */}

            {/* Middle PÖNT Brand Logo */}
            <div className="flex flex-col items-center justify-center my-auto">
              <h1 className="text-7xl md:text-9xl font-light tracking-[0.3em] text-[#9E826C] select-none pl-6 mr-[-0.3em] font-sans flex items-center">
                P<span className="relative inline-block tracking-normal" style={{ marginRight: '0.3em' }}><span className="relative inline-block">O<span className="absolute -top-[3px] md:-top-[5px] left-0 right-0 h-[2.5px] md:h-[4px] bg-[#9E826C] rounded-full" /></span></span>NT
              </h1>
            </div>

            {/* Bottom info replicating image 2 card */}
            <div className="flex flex-col items-start space-y-2 mt-auto text-left">
              <span className="text-sm font-semibold tracking-widest text-[#2997ff] uppercase">
                2022 // 商业设计
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wider text-[#4A3E3D]">
                PONT 化妆品品牌
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
    </>
  );
}
