import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { 
  X, Sparkles, ChevronRight, ArrowUpRight, ArrowRight, ChevronDown,
  Compass, Box, Maximize2, Map, Layout, HelpCircle, Eye, EyeOff, 
  Check, MapPin, Minimize2, ZoomIn, Info, Play, RotateCcw, Palette,
  Sofa, Utensils, ChefHat, Bed, BookOpen, Bath
} from "lucide-react";
import ThreeDViewer from "../ui/ThreeDViewer";
import { CardStack } from "../ui/card-stack";

interface CommercialSpacePageProps {
  onClose: () => void;
}

const ROOM_ASSETS = {
  living: {
    id: "living" as const,
    name: "客厅",
    area: "45㎡",
    url: "/keting-bauhaus.png",
    fallbackUrl: "https://i.postimg.cc/1XDBgmM3/ke-ting-bao-hao-si.png",
    desc: "极致采光，现代简奢社交中心与家庭核心动线",
    x: 95, y: 100, angle: -45
  },
  dining: {
    id: "dining" as const,
    name: "餐厅",
    area: "22㎡",
    url: "/keting-yuanmu.png",
    fallbackUrl: "https://i.postimg.cc/Xq9LZjxX/ke-ting-yuan-mu.png",
    desc: "意式极简，质感温润的围合多功能就餐区",
    x: 215, y: 100, angle: 90
  },
  kitchen: {
    id: "kitchen" as const,
    name: "厨房",
    area: "14㎡",
    url: "https://i.postimg.cc/L6LTcVkz/chu-fang-bao-hao-si.png",
    fallbackUrl: "https://i.postimg.cc/L6LTcVkz/chu-fang-bao-hao-si.png",
    desc: "嵌入式高定厨电，科学黄金三角备餐动线",
    x: 320, y: 100, angle: 180
  },
  bedroom: {
    id: "bedroom" as const,
    name: "主卧",
    area: "28㎡",
    url: "https://i.postimg.cc/dV84M9FF/wo-shi-bao-hao-si.png",
    fallbackUrl: "https://i.postimg.cc/dV84M9FF/wo-shi-bao-hao-si.png",
    desc: "套房式独立规划，沉浸式静谧私享休憩空间",
    x: 95, y: 245, angle: 45
  },
  study: {
    id: "study" as const,
    name: "书房",
    area: "18㎡",
    url: "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg",
    fallbackUrl: "/keting-bauhaus.png",
    desc: "环抱式围合光影，艺术灵感与精神沉淀之所",
    x: 215, y: 245, angle: 0
  },
  bathroom: {
    id: "bathroom" as const,
    name: "卫生间",
    area: "16㎡",
    url: "/keting-xiandai.png",
    fallbackUrl: "https://i.postimg.cc/J0jxyrKn/ke-ting-xian-dai-feng-ge.png",
    desc: "干湿分区分离设计，微水泥奢华卫浴洗漱空间",
    x: 320, y: 245, angle: -135
  }
} as const;

export const LIVING_ROOM_STYLES = [
  {
    id: "bauhaus" as const,
    name: "包豪斯风格",
    tag: "Bauhaus",
    url: "/keting-bauhaus.png",
    fallbackUrl: "https://i.postimg.cc/1XDBgmM3/ke-ting-bao-hao-si.png",
    desc: "包豪斯经典线条，理性主义与艺术功能的完美结合"
  },
  {
    id: "yuanmu" as const,
    name: "原木风格",
    tag: "Natural Wood",
    url: "/keting-yuanmu.png",
    fallbackUrl: "https://i.postimg.cc/Xq9LZjxX/ke-ting-yuan-mu.png",
    desc: "自然原木沉静质感，温润包容的暖色调生活氛围"
  },
  {
    id: "xiandai" as const,
    name: "现代风格",
    tag: "Modern",
    url: "/keting-xiandai.png",
    fallbackUrl: "https://i.postimg.cc/J0jxyrKn/ke-ting-xian-dai-feng-ge.png",
    desc: "通透奢华现代极简，通高开阔视野与高定软装"
  }
] as const;

export const BEDROOM_STYLES = [
  {
    id: "bauhaus" as const,
    name: "包豪斯风格",
    tag: "Bauhaus",
    url: "https://i.postimg.cc/dV84M9FF/wo-shi-bao-hao-si.png",
    fallbackUrl: "https://i.postimg.cc/dV84M9FF/wo-shi-bao-hao-si.png",
    desc: "包豪斯经典线条与几何设计，理性复古氛围的主卧沉浸空间"
  },
  {
    id: "yuanmu" as const,
    name: "原木风格",
    tag: "Natural Wood",
    url: "https://i.postimg.cc/52wncmVn/wo-shi-yuan-mu.png",
    fallbackUrl: "https://i.postimg.cc/52wncmVn/wo-shi-yuan-mu.png",
    desc: "自然沉静原木温润质感，暖调包裹下的舒适静谧主卧"
  },
  {
    id: "xiandai" as const,
    name: "现代风格",
    tag: "Modern",
    url: "https://i.postimg.cc/9fC1cqXc/wo-shi-xian-dai.png",
    fallbackUrl: "https://i.postimg.cc/9fC1cqXc/wo-shi-xian-dai.png",
    desc: "现代极简静谧奢华，开阔视野与高定艺术软装相融合的主卧"
  }
] as const;

export const KITCHEN_STYLES = [
  {
    id: "bauhaus" as const,
    name: "包豪斯风格",
    tag: "Bauhaus",
    url: "https://i.postimg.cc/L6LTcVkz/chu-fang-bao-hao-si.png",
    fallbackUrl: "https://i.postimg.cc/L6LTcVkz/chu-fang-bao-hao-si.png",
    desc: "包豪斯经典工业极简美学，高效收纳与艺术线条相融合的精制厨房"
  },
  {
    id: "yuanmu" as const,
    name: "原木风格",
    tag: "Natural Wood",
    url: "https://i.postimg.cc/ZKpcGLP7/chu-fang-yuan-mu.png",
    fallbackUrl: "https://i.postimg.cc/ZKpcGLP7/chu-fang-yuan-mu.png",
    desc: "温润木纹与自然采光相衬，温暖治愈的烹饪美食空间"
  },
  {
    id: "xiandai" as const,
    name: "现代风格",
    tag: "Modern",
    url: "https://i.postimg.cc/BQHgrC5h/chu-fang-xian-dai.png",
    fallbackUrl: "https://i.postimg.cc/BQHgrC5h/chu-fang-xian-dai.png",
    desc: "高定质感与嵌入式厨电美学，现代化极简高效厨房"
  }
] as const;

export type LivingStyleKey = typeof LIVING_ROOM_STYLES[number]["id"];
export type BedroomStyleKey = typeof BEDROOM_STYLES[number]["id"];
export type KitchenStyleKey = typeof KITCHEN_STYLES[number]["id"];

type RoomKey = keyof typeof ROOM_ASSETS;

export default function CommercialSpacePage({ onClose }: CommercialSpacePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRoom, setActiveRoom] = useState<RoomKey>("living");
  const [livingRoomStyle, setLivingRoomStyle] = useState<LivingStyleKey>("bauhaus");
  const [bedroomStyle, setBedroomStyle] = useState<BedroomStyleKey>("bauhaus");
  const [kitchenStyle, setKitchenStyle] = useState<KitchenStyleKey>("bauhaus");
  const [isFullscreenVR, setIsFullscreenVR] = useState<boolean>(false);
  const [isFloorPlanOpen, setIsFloorPlanOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<"hero" | "projects" | "vr">("hero");

  const getActiveRoomImage = () => {
    if (activeRoom === "living") {
      const styleObj = LIVING_ROOM_STYLES.find((s) => s.id === livingRoomStyle);
      return styleObj ? styleObj.url : ROOM_ASSETS.living.url;
    }
    if (activeRoom === "bedroom") {
      const styleObj = BEDROOM_STYLES.find((s) => s.id === bedroomStyle);
      return styleObj ? styleObj.url : ROOM_ASSETS.bedroom.url;
    }
    if (activeRoom === "kitchen") {
      const styleObj = KITCHEN_STYLES.find((s) => s.id === kitchenStyle);
      return styleObj ? styleObj.url : ROOM_ASSETS.kitchen.url;
    }
    return ROOM_ASSETS[activeRoom].url;
  };

  const getActiveRoomFallbackImage = () => {
    if (activeRoom === "living") {
      const styleObj = LIVING_ROOM_STYLES.find((s) => s.id === livingRoomStyle);
      return styleObj ? styleObj.fallbackUrl : ROOM_ASSETS.living.fallbackUrl;
    }
    if (activeRoom === "bedroom") {
      const styleObj = BEDROOM_STYLES.find((s) => s.id === bedroomStyle);
      return styleObj ? styleObj.fallbackUrl : ROOM_ASSETS.bedroom.fallbackUrl;
    }
    if (activeRoom === "kitchen") {
      const styleObj = KITCHEN_STYLES.find((s) => s.id === kitchenStyle);
      return styleObj ? styleObj.fallbackUrl : ROOM_ASSETS.kitchen.fallbackUrl;
    }
    return ROOM_ASSETS[activeRoom].fallbackUrl;
  };

  const getActiveRoomDesc = () => {
    if (activeRoom === "living") {
      const styleObj = LIVING_ROOM_STYLES.find((s) => s.id === livingRoomStyle);
      return styleObj ? styleObj.desc : ROOM_ASSETS.living.desc;
    }
    if (activeRoom === "bedroom") {
      const styleObj = BEDROOM_STYLES.find((s) => s.id === bedroomStyle);
      return styleObj ? styleObj.desc : ROOM_ASSETS.bedroom.desc;
    }
    if (activeRoom === "kitchen") {
      const styleObj = KITCHEN_STYLES.find((s) => s.id === kitchenStyle);
      return styleObj ? styleObj.desc : ROOM_ASSETS.kitchen.desc;
    }
    return ROOM_ASSETS[activeRoom].desc;
  };

  const getStyleNameForRoom = () => {
    if (activeRoom === "living") {
      const styleObj = LIVING_ROOM_STYLES.find((s) => s.id === livingRoomStyle);
      return styleObj ? styleObj.name : "包豪斯风格";
    }
    if (activeRoom === "bedroom") {
      const styleObj = BEDROOM_STYLES.find((s) => s.id === bedroomStyle);
      return styleObj ? styleObj.name : "包豪斯风格";
    }
    if (activeRoom === "kitchen") {
      const styleObj = KITCHEN_STYLES.find((s) => s.id === kitchenStyle);
      return styleObj ? styleObj.name : "包豪斯风格";
    }
    return "";
  };

  const getStylesForActiveRoom = () => {
    if (activeRoom === "living") return LIVING_ROOM_STYLES;
    if (activeRoom === "bedroom") return BEDROOM_STYLES;
    if (activeRoom === "kitchen") return KITCHEN_STYLES;
    return [];
  };

  const getActiveStyleId = () => {
    if (activeRoom === "living") return livingRoomStyle;
    if (activeRoom === "bedroom") return bedroomStyle;
    if (activeRoom === "kitchen") return kitchenStyle;
    return "";
  };

  const setActiveStyleId = (styleId: string) => {
    if (activeRoom === "living") setLivingRoomStyle(styleId as LivingStyleKey);
    if (activeRoom === "bedroom") setBedroomStyle(styleId as BedroomStyleKey);
    if (activeRoom === "kitchen") setKitchenStyle(styleId as KitchenStyleKey);
  };

  const scrollToSection = (id: string) => {
    const container = containerRef.current;
    if (container) {
      const el = container.querySelector(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const height = container.clientHeight;
    if (height > 0) {
      const index = Math.round(scrollTop / height);
      if (index === 0 && activeSection !== "hero") {
        setActiveSection("hero");
      } else if (index === 1 && activeSection !== "projects") {
        setActiveSection("projects");
      } else if (index >= 2 && activeSection !== "vr") {
        setActiveSection("vr");
      }
    }
  };

  const projects = [
    {
      id: "1",
      title: "极简私宅",
      area: "128㎡",
      type: "住宅空间",
      tag: "住宅空间",
      year: "2024",
      imageSrc: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
      description: "极致简练的现代生活空间，注重天然光影与通透平面的呼应。"
    },
    {
      id: "2",
      title: "包豪斯之家",
      area: "143㎡",
      type: "住宅空间",
      tag: "住宅空间",
      year: "2024",
      imageSrc: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      description: "包豪斯经典理性线条与几何美学，实用与高雅艺术相结合。"
    },
    {
      id: "3",
      title: "光影艺术馆",
      area: "260㎡",
      type: "商业空间",
      tag: "商业空间",
      year: "2023",
      imageSrc: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
      description: "光影交织的艺术展陈与沉浸式沉淀空间，打造震撼视觉体验。"
    },
    {
      id: "4",
      title: "山景别墅",
      area: "380㎡",
      type: "住宅空间",
      tag: "住宅空间",
      year: "2023",
      imageSrc: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      description: "依山而建的观景大宅，开阔全景落地窗与自然山色融为一体。"
    },
    {
      id: "5",
      title: "原木美学私宅",
      area: "195㎡",
      type: "住宅空间",
      tag: "住宅空间",
      year: "2024",
      imageSrc: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      description: "温润原木与清雅暖色调相结合，营造静谧舒适的居家气场。"
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-5 bg-[#f0f0f0] overflow-hidden select-none"
      style={{ fontFamily: '"Helvetica Regular", sans-serif' }}
    >
      {/* Dynamic Font Loader Scoped Style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face {
            font-family: "Helvetica Regular";
            src: url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.eot");
            src: url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.eot?#iefix")format("embedded-opentype"),
            url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.woff2")format("woff2"),
            url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.woff")format("woff"),
            url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.ttf")format("truetype"),
            url("https://db.onlinewebfonts.com/t/a64ff11d2c24584c767f6257e880dc65.svg#Helvetica Regular")format("svg");
        }
      ` }} />

      {/* Static Container Wrapper with rounded corners and absolute positioning container */}
      <div className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden bg-[#EFECE5]">
        
        {/* ==================== PINNED ADAPTIVE HEADER NAVIGATION ==================== */}
        <nav className="absolute top-0 left-0 right-0 z-[120] flex items-center justify-between py-6 px-6 md:px-10 w-full select-none pointer-events-auto">
          {/* Left Side Logo */}
          <div className="flex-1 hidden md:block">
            <span 
              className={`font-regular tracking-tighter text-xl cursor-pointer transition-colors duration-300 ${
                activeSection === "hero" 
                  ? "text-white/80 hover:text-white" 
                  : "text-[#2D2D2D] hover:opacity-70"
              }`}
              onClick={() => scrollToSection('#hero-section')}
            >
              RIVR PORTFOLIO
            </span>
          </div>

          {/* Center Menu: Unified menu consistent with the projects page */}
          <ul className={`hidden md:flex items-center gap-8 font-normal text-sm transition-all duration-300 ${
            activeSection === "hero" ? "text-white/90" : "text-[#2D2D2D]"
          }`}>
            <li 
              className={`cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group ${
                activeSection === "hero" ? "text-white/85 hover:text-white" : "text-[#2D2D2D]/80"
              } ${activeSection === "projects" ? "text-[#1E1E1E] font-medium" : ""}`} 
              onClick={() => scrollToSection('#projects-section')}
            >
              精选项目 <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${activeSection === "hero" ? "text-white/60" : "text-[#2D2D2D]/60"}`} />
            </li>
            <li 
              className={`cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group ${
                activeSection === "hero" ? "text-white/85 hover:text-white" : "text-[#2D2D2D]/80"
              } ${activeSection === "vr" ? "text-[#1E1E1E] font-medium" : ""}`} 
              onClick={() => scrollToSection('#vr-section')}
            >
              3D VR看房 <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${activeSection === "hero" ? "text-white/60" : "text-[#2D2D2D]/60"}`} />
            </li>
            <li className={`cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group cursor-not-allowed ${
              activeSection === "hero" ? "text-white/40" : "text-[#2D2D2D]/40"
            }`}>
              改造前后
            </li>
            <li className={`cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group cursor-not-allowed ${
              activeSection === "hero" ? "text-white/40" : "text-[#2D2D2D]/40"
            }`}>
              设计细节
            </li>
          </ul>

          {/* Mobile Logo */}
          <div className="md:hidden">
            <span 
              className={`font-regular tracking-tighter text-xl cursor-pointer transition-colors duration-300 ${
                activeSection === "hero" ? "text-white" : "text-[#2D2D2D]"
              }`} 
              onClick={() => scrollToSection('#hero-section')}
            >
              作品集
            </span>
          </div>

          {/* Right Action Button & Exit Control */}
          <div className="flex-1 flex justify-end items-center gap-3 md:gap-4 transition-all duration-300">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className={`flex items-center rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 transition-colors duration-300 group ${
                activeSection === "hero"
                  ? "bg-white/20 backdrop-blur-md text-white border border-white/20 hover:bg-white/35"
                  : "bg-[#1E1E1E] text-white hover:bg-[#2e2e2e]"
              }`}
            >
              <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xs md:text-sm font-normal">预约咨询</span>
            </motion.button>

            <button 
              onClick={onClose}
              className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                activeSection === "hero"
                  ? "bg-white/20 hover:bg-white/45 border-white/20 text-white"
                  : "bg-[#E3DDD1] hover:bg-[#D7CEBE] text-[#2D2D2D]/80 border-white/20"
              }`}
              title="返回作品集"
            >
              <X size={18} />
            </button>
          </div>
        </nav>

        {/* Scrollable Container: Fully responsive scroll snapping */}
        <section 
          ref={containerRef}
          onScroll={handleScroll}
          className="relative w-full h-full overflow-y-auto scroll-smooth snap-y snap-mandatory flex flex-col shadow-none group [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
        
        {/* ==================== PAGE 1: HERO SECTION ==================== */}
        <div 
          id="hero-section" 
          className="relative w-full h-full min-h-full flex flex-col justify-between pb-12 shrink-0 snap-start overflow-hidden"
        >
          {/* CloudFront Video Background */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
            referrerPolicy="no-referrer"
          >
            <source 
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4" 
              type="video/mp4" 
            />
          </video>

          {/* Overlay on top of video for depth */}
          <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />

          {/* Header Navigation Spacer (Invisible for layout spacing) */}
          <div className="relative z-20 flex items-center justify-between py-6 px-6 md:px-10 w-full opacity-0 pointer-events-none select-none">
            <div className="flex-1"><span className="text-xl">RIVR PORTFOLIO</span></div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
          </div>

          {/* Central Hero Text Section */}
          <div className="relative z-10 w-full flex flex-col items-center pt-8 px-6 text-center max-w-4xl mx-auto my-auto">
            
            {/* Fluid Staking Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/15 mx-auto mb-3 w-fit"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-[14px] font-normal text-white">室内设计作品集</span>
            </motion.div>

            {/* Animated Big Heading */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-[#f0f0f0] mb-4 tracking-tight leading-[1.05] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            >
              商业空间设计作品集
            </motion.h1>

            {/* Animated Description Paragraph */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-[#f0f0f0]/90 leading-relaxed max-w-xl font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] mx-auto"
            >
              展示住宅与商业空间项目，结合 3D VR 交互看房、改造前后对比与设计细节，让作品更直观呈现。
            </motion.p>
          </div>

          {/* Interactive Scroll Down Indicator */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 text-white/60 cursor-pointer hover:text-white transition-colors" onClick={() => scrollToSection('#projects-section')}>
            <span className="text-[11px] font-normal tracking-widest uppercase">向下翻页</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Bottom Left Active Projects Card */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 ml-6 md:ml-10 p-3 md:p-4 lg:p-5 rounded-[1.2rem] md:rounded-[1.5rem] lg:rounded-[2.2rem] bg-white/20 backdrop-blur-md flex flex-col gap-2 lg:gap-3 min-w-[140px] md:min-w-[150px] lg:min-w-[180px] w-fit border border-white/10"
          >
            <div className="flex flex-col text-left">
              <span className="text-2xl md:text-3xl font-normal text-white tracking-tight">28</span>
              <span className="text-[10px] md:text-[12px] font-normal text-white/70 uppercase tracking-wider">精选项目</span>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('#projects-section')}
              className="flex items-center bg-white rounded-full pl-1.5 pr-5 py-1.5 gap-2 hover:bg-white/90 transition-colors self-start group shadow-sm"
            >
              <div className="bg-black/10 p-1 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-black" />
              </div>
              <span className="text-[14px] font-normal text-black">查看作品</span>
            </motion.button>
          </motion.div>

          {/* Bottom Right Corner cut-out design with responsive curves */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => scrollToSection('#projects-section')}
            className="absolute bottom-0 right-0 p-3 pt-5 pl-8 sm:p-4 sm:pt-6 sm:pl-10 md:p-6 md:pt-8 md:pl-14 bg-[#EFECE5] rounded-tl-[1.5rem] sm:rounded-tl-[2rem] md:rounded-tl-[3.5rem] flex items-center gap-3 sm:gap-4 md:gap-6 cursor-pointer hover:bg-[#eae5db] transition-colors"
          >
            {/* Top intersection mask curve */}
            <div className="absolute -top-[1.5rem] sm:-top-[2rem] md:-top-[3.5rem] right-0 w-[1.5rem] sm:w-[2rem] md:w-[3.5rem] h-[1.5rem] sm:h-[2rem] md:h-[3.5rem] pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#EFECE5"/>
              </svg>
            </div>

            {/* Left intersection mask curve */}
            <div className="absolute bottom-0 -left-[1.5rem] sm:-left-[2rem] md:-left-[3.5rem] w-[1.5rem] sm:w-[2rem] md:w-[3.5rem] h-[1.5rem] sm:h-[2rem] md:h-[3.5rem] pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="#EFECE5"/>
              </svg>
            </div>

            {/* Documentation Icon Circle */}
            <div className="bg-black/5 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-black/10">
              <ArrowUpRight className="w-5 h-5 text-black/70" />
            </div>

            {/* Documentation Info text */}
            <div className="flex flex-col text-left">
              <span className="text-[16px] md:text-[20px] font-normal text-black/90 leading-tight">作品集导览</span>
              <div className="flex items-center gap-1 text-black/50 hover:text-black/70 transition-colors mt-0.5">
                <span className="text-[12px] md:text-[15px] font-normal">浏览全部</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ==================== PAGE 2: FEATURED PROJECTS ==================== */}
        <div 
          id="projects-section" 
          className="relative w-full h-full min-h-full flex flex-col justify-between pb-12 shrink-0 snap-start bg-[#EFECE5] overflow-hidden"
        >
          {/* Luxury Architectural Curve Glow and lines in background */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none overflow-hidden z-0">
            {/* Clean white circular architectural curve */}
            <div className="absolute top-[-25%] -right-[35%] w-[130%] aspect-square rounded-full border-[1.5px] border-white/60 bg-gradient-to-b from-transparent via-white/5 to-transparent blur-[1px] opacity-85" />
            {/* Glowing ambient background circle */}
            <div className="absolute top-[-25%] -right-[35%] w-[130%] aspect-square rounded-full bg-gradient-to-bl from-amber-100/10 via-white/15 to-transparent blur-3xl pointer-events-none" />
          </div>

          {/* Header Navigation Spacer (Invisible for layout spacing) */}
          <div className="relative z-20 flex items-center justify-between py-6 px-6 md:px-10 w-full opacity-0 pointer-events-none select-none">
            <div className="flex-1"><span className="text-xl">RIVR PORTFOLIO</span></div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
          </div>

          {/* Title Header Section */}
          <div className="relative z-10 flex flex-col text-left px-6 md:px-12 w-full max-w-[1400px] mt-2 md:mt-4">
            <h2 className="text-3xl md:text-[42px] lg:text-[48px] font-normal text-[#2D2D2D] tracking-tight mb-2">精选项目</h2>
            <div className="flex flex-col text-xs md:text-sm text-[#2D2D2D]/60 font-normal space-y-0.5">
              <p>空间 x 设计 x 生活</p>
              <p>探索更多高品质住宅与商业空间设计</p>
            </div>
          </div>

          {/* 3D Fan Card Stack Projects Row */}
          <div className="relative z-10 w-full px-4 md:px-12 mt-4 md:mt-6 mb-2 flex items-center justify-center">
            <div className="w-full max-w-5xl mx-auto">
              <CardStack
                items={projects}
                initialIndex={1}
                cardWidth={460}
                cardHeight={340}
                overlap={0.46}
                spreadDeg={34}
                autoAdvance={true}
                intervalMs={3200}
                pauseOnHover={true}
                showDots={true}
                renderCard={(item, { active }) => (
                  <div className="relative h-full w-full group/card overflow-hidden bg-[#2D2D2D] rounded-2xl shadow-2xl border border-white/20">
                    {/* Background image */}
                    <img 
                      src={item.imageSrc} 
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10 pointer-events-none" />

                    {/* Card Details */}
                    <div className="absolute inset-0 z-20 p-6 md:p-8 flex flex-col justify-end text-left text-white">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                          {item.title}
                        </h3>
                        <span className="text-xs font-semibold bg-white/25 backdrop-blur-md px-3.5 py-1 rounded-full text-white border border-white/20">
                          {item.tag}
                        </span>
                      </div>

                      <p className="text-xs text-white/75 line-clamp-2 leading-relaxed font-light mb-3">
                        {item.description}
                      </p>

                      <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs md:text-sm text-white/80 font-medium">
                        <span>{item.area} · {item.type}</span>
                        <span className="text-white/60">{item.year}</span>
                      </div>

                      {/* Interactive Arrow */}
                      <div className="absolute bottom-6 right-6 bg-white hover:bg-amber-100 text-[#2D2D2D] w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer">
                        <ArrowRight className="w-5 h-5 text-black" />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Bottom Layout Row */}
          <div className="relative z-10 flex items-end justify-between px-6 md:px-12 w-full max-w-[1400px] mt-6 md:mt-2 mx-auto">
            {/* Completed projects stats (Bottom Left) */}
            <div className="flex flex-col text-left">
              <span className="text-4xl md:text-5xl font-normal text-[#2D2D2D] tracking-tight leading-none mb-1">12</span>
              <span className="text-xs md:text-sm font-normal text-[#2D2D2D]/50 tracking-wider uppercase">完成项目</span>
            </div>

            {/* Link directly to 3D VR House page */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('#vr-section')}
              className="flex items-center bg-[#1E1E1E] hover:bg-[#2d2d2d] text-white rounded-full pl-6 pr-2 py-1.5 md:py-2 gap-4 transition-all shadow-sm"
            >
              <span className="text-xs md:text-sm font-normal">进入 3D VR 看房</span>
              <div className="bg-white/20 p-2 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* ==================== PAGE 3: 3D VR HOUSE TOUR (EXACT MATCH FOR IMAGE) ==================== */}
        <div 
          id="vr-section" 
          className="relative w-full h-full min-h-full flex flex-col justify-between pb-8 shrink-0 snap-start bg-[#F4EFEB] overflow-hidden"
        >
          {/* Header Navigation Spacer (Invisible for layout spacing) */}
          <div className="relative z-20 flex items-center justify-between py-6 px-6 md:px-10 w-full opacity-0 pointer-events-none select-none">
            <div className="flex-1"><span className="text-xl">RIVR PORTFOLIO</span></div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
          </div>

          {/* Main Content Layout Container */}
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 flex-1 flex flex-col justify-between my-auto">
            
            {/* Upper Content Area: Two elegant side-by-side columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-grow py-4 my-auto">
              
              {/* Left Side: Copy, Features List */}
              <div className="lg:col-span-5 flex flex-col justify-center text-left py-2 h-full">
                
                {/* Core Titles */}
                <div className="mb-6 md:mb-8">
                  <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#2D2D2D] tracking-tight mb-4 leading-tight">
                    3D VR 看房
                  </h2>
                  <h3 className="text-[#2D2D2D]/80 text-lg md:text-xl font-medium tracking-wide mb-2">
                    沉浸式体验每一个空间细节
                  </h3>
                  <p className="text-[#2D2D2D]/50 text-sm md:text-base font-normal tracking-wide">
                    720° 全景漫游，真实还原设计效果
                  </p>
                </div>

                {/* 2x2 Features Grid (Matching Image 1) */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  
                  {/* Feature 1 */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-black/[0.03] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                      <Compass className="w-4 h-4 text-[#2D2D2D]" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-[#2D2D2D] text-xs font-bold tracking-wide truncate">720° 全景漫游</span>
                      <span className="text-[#2D2D2D]/50 text-[11px] mt-0.5 truncate">自由探索每个空间</span>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-black/[0.03] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                      <Box className="w-4 h-4 text-[#2D2D2D]" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-[#2D2D2D] text-xs font-bold tracking-wide truncate">高清渲染</span>
                      <span className="text-[#2D2D2D]/50 text-[11px] mt-0.5 truncate">还原真实材质与光影</span>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-black/[0.03] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                      <Maximize2 className="w-4 h-4 text-[#2D2D2D]" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-[#2D2D2D] text-xs font-bold tracking-wide truncate">空间测量</span>
                      <span className="text-[#2D2D2D]/50 text-[11px] mt-0.5 truncate">实时查看一目了然</span>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-black/[0.03] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                      <Layout className="w-4 h-4 text-[#2D2D2D]" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-[#2D2D2D] text-xs font-bold tracking-wide truncate">户型导览</span>
                      <span className="text-[#2D2D2D]/50 text-[11px] mt-0.5 truncate">快速了解不同区域</span>
                    </div>
                  </div>

                </div>

                {/* Room Design Styles Selector Card (Living Room, Bedroom, Kitchen) */}
                {(activeRoom === "living" || activeRoom === "bedroom" || activeRoom === "kitchen") && (
                  <div className="p-4 rounded-2xl bg-white shadow-sm border border-black/[0.04] text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#2D2D2D] text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        {ROOM_ASSETS[activeRoom].name}设计风格切换
                      </span>
                      <span className="text-[10px] font-medium text-[#2D2D2D]/60 bg-black/5 px-2.5 py-0.5 rounded-full">
                        3 款主题风格
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {getStylesForActiveRoom().map((style) => {
                        const isSelected = getActiveStyleId() === style.id;
                        return (
                          <button
                            key={style.id}
                            onClick={() => setActiveStyleId(style.id)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-[#2D2D2D] text-white shadow-sm font-bold"
                                : "bg-white text-[#2D2D2D]/80 border border-black/10 hover:bg-black/5"
                            }`}
                          >
                            <span>{style.name}</span>
                            {isSelected && (
                              <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-[#2D2D2D]/60 mt-3 font-normal leading-relaxed">
                      {getActiveRoomDesc()}
                    </p>
                  </div>
                )}

              </div>

              {/* Right Side: Clean Rounded Rectangular VR Viewer Card (Matching Image 1) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center w-full">
                
                {/* Rounded Rectangle VR Frame with White Border */}
                <div className="relative w-full max-w-[860px] aspect-[1.55] rounded-[32px] overflow-hidden border-[6px] border-white shadow-2xl bg-[#EAE5DB]">
                  
                  {/* Embedded Three.js 3D Viewer */}
                  <ThreeDViewer 
                    imageSrc={getActiveRoomImage()} 
                    fallbackSrc={getActiveRoomFallbackImage()}
                    isAutoRotate={!isFullscreenVR}
                    showHint={false}
                    className="w-full h-full"
                  />

                  {/* Top-Left Badge Label: Room name & area */}
                  <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-2 border border-white/10 z-10 pointer-events-none">
                    <Sofa className="w-3.5 h-3.5 text-white/90" />
                    <span>{ROOM_ASSETS[activeRoom].name}</span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/80">{ROOM_ASSETS[activeRoom].area}</span>
                  </div>

                  {/* Top-Right Badge Label: Current style */}
                  {(activeRoom === "living" || activeRoom === "bedroom" || activeRoom === "kitchen") && (
                    <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5 border border-white/10 z-10 pointer-events-none">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{ROOM_ASSETS[activeRoom].name}风格：{getStyleNameForRoom()}</span>
                    </div>
                  )}

                  {/* Center Floating Start Roaming Circle Overlay (Matching Image 1) */}
                  <div 
                    onClick={() => setIsFullscreenVR(true)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-40 h-40 md:w-44 md:h-44 rounded-full bg-[#2B2825]/85 backdrop-blur-md border border-white/20 shadow-2xl cursor-pointer hover:scale-105 transition-all group z-10 select-none text-white"
                  >
                    <div className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center mb-1 group-hover:border-white transition-colors">
                      <Compass className="w-4 h-4 text-white/90 group-hover:rotate-45 transition-transform duration-500" />
                    </div>
                    <span className="text-white/60 text-[10px] font-mono tracking-widest block">360°</span>
                    <span className="text-white text-base font-bold tracking-wider block my-0.5">开始漫游</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/60 group-hover:translate-x-0.5 transition-transform" />
                  </div>

                </div>

              </div>

            </div>

            {/* Bottom Row Layout: Metric on left, Segmented Room Control with Icons in center, Trigger floorplan on right */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-4 pt-3 border-t border-black/[0.03]">
              
              {/* Bottom Left: Metric Capsule */}
              <div className="bg-white rounded-full px-6 py-3 shadow-sm border border-black/[0.04] flex items-center gap-3 shrink-0">
                <span className="text-[#2D2D2D] text-2xl font-bold tracking-tight leading-none">
                  143m²
                </span>
                <div className="h-4 w-[1px] bg-[#2D2D2D]/15" />
                <span className="text-[#2D2D2D]/50 text-xs font-semibold tracking-wider">
                  项目面积
                </span>
              </div>

              {/* Bottom Center: Segmented Room Selection Pill with Icons (Matching Image 1) */}
              <div className="bg-white rounded-full p-1.5 border border-black/[0.04] shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar">
                {(Object.keys(ROOM_ASSETS) as RoomKey[]).map((key) => {
                  const isRoomActive = activeRoom === key;
                  const iconsMap: Record<RoomKey, React.ReactNode> = {
                    living: <Sofa className="w-3.5 h-3.5" />,
                    dining: <Utensils className="w-3.5 h-3.5" />,
                    kitchen: <ChefHat className="w-3.5 h-3.5" />,
                    bedroom: <Bed className="w-3.5 h-3.5" />,
                    study: <BookOpen className="w-3.5 h-3.5" />,
                    bathroom: <Bath className="w-3.5 h-3.5" />,
                  };
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveRoom(key)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isRoomActive
                          ? "bg-[#2D2D2D] text-white shadow-sm font-bold"
                          : "text-[#2D2D2D]/70 hover:text-[#2D2D2D] hover:bg-black/5"
                      }`}
                    >
                      {iconsMap[key]}
                      <span>{ROOM_ASSETS[key].name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Right: Floor Plan Button */}
              <button
                onClick={() => setIsFloorPlanOpen(true)}
                className="bg-white hover:bg-gray-50 text-[#2D2D2D] border border-black/[0.04] shadow-sm rounded-full pl-6 pr-5 py-3 flex items-center gap-2 text-xs md:text-sm font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <span>查看平面图</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </button>

            </div>

          </div>

          {/* Navigation Dot Indicator and Scroll Up */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#2D2D2D]/40 cursor-pointer hover:text-[#2D2D2D] transition-colors" onClick={() => scrollToSection('#projects-section')}>
            <ChevronDown className="w-4 h-4 rotate-180" />
            <span className="text-[10px] font-bold tracking-widest uppercase">向上返回精选项目</span>
          </div>

          {/* ==================== 2D FLOOR PLAN INTERACTIVE MODAL OVERLAY ==================== */}
          {isFloorPlanOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[250] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#F4EFEB] max-w-lg w-full rounded-[2rem] p-6 md:p-8 shadow-2xl border border-white relative text-[#2D2D2D]"
              >
                <button 
                  onClick={() => setIsFloorPlanOpen(false)}
                  className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#2D2D2D] transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="mb-6 text-left">
                  <h3 className="text-2xl font-bold tracking-tight text-[#2D2D2D]">143m² 空间户型平面图</h3>
                  <p className="text-xs md:text-sm text-[#2D2D2D]/60 mt-1">点击不同空间区域，即可实现 3D VR 场景瞬移</p>
                </div>

                {/* SVG Blueprint Draw */}
                <div className="relative w-full bg-white/50 rounded-2xl p-4 border border-black/[0.03] flex items-center justify-center shadow-inner">
                  <svg viewBox="0 0 400 350" className="w-full h-auto max-h-[260px] select-none">
                    <defs>
                      <pattern id="modal-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(45,45,45,0.03)" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#modal-grid)" />

                    {/* Outer Structural Walls */}
                    <rect x="30" y="30" width="340" height="290" rx="12" fill="none" stroke="#2D2D2D" strokeWidth="3.5" />

                    {/* Interior partitions */}
                    <line x1="30" y1="180" x2="370" y2="180" stroke="#2D2D2D" strokeWidth="2.5" />
                    <line x1="160" y1="30" x2="160" y2="320" stroke="#2D2D2D" strokeWidth="2.5" />
                    <line x1="270" y1="30" x2="270" y2="180" stroke="#2D2D2D" strokeWidth="2" />
                    <line x1="270" y1="180" x2="270" y2="320" stroke="#2D2D2D" strokeWidth="2" />

                    {/* Room buttons as SVG Interactive elements */}
                    {/* 客厅 (Top Left Room) */}
                    <g 
                      className="cursor-pointer group/room" 
                      onClick={() => {
                        setActiveRoom("living");
                        setIsFloorPlanOpen(false);
                      }}
                    >
                      <rect x="35" y="35" width="120" height="140" fill={activeRoom === "living" ? "rgba(45,45,45,0.04)" : "transparent"} className="transition-all hover:fill-black/5" />
                      <text x="95" y="95" textAnchor="middle" className={`text-xs font-bold transition-all ${activeRoom === "living" ? "fill-[#2D2D2D]" : "fill-[#2D2D2D]/60"}`}>客厅</text>
                      <text x="95" y="112" textAnchor="middle" className="text-[10px] fill-[#2D2D2D]/40">45m²</text>
                    </g>

                    {/* 餐厅 (Top Center Room) */}
                    <g 
                      className="cursor-pointer group/room" 
                      onClick={() => {
                        setActiveRoom("dining");
                        setIsFloorPlanOpen(false);
                      }}
                    >
                      <rect x="165" y="35" width="100" height="140" fill={activeRoom === "dining" ? "rgba(45,45,45,0.04)" : "transparent"} className="transition-all hover:fill-black/5" />
                      <text x="215" y="95" textAnchor="middle" className={`text-xs font-bold transition-all ${activeRoom === "dining" ? "fill-[#2D2D2D]" : "fill-[#2D2D2D]/60"}`}>餐厅</text>
                      <text x="215" y="112" textAnchor="middle" className="text-[10px] fill-[#2D2D2D]/40">22m²</text>
                    </g>

                    {/* 厨房 (Top Right Room) */}
                    <g 
                      className="cursor-pointer group/room" 
                      onClick={() => {
                        setActiveRoom("kitchen");
                        setIsFloorPlanOpen(false);
                      }}
                    >
                      <rect x="275" y="35" width="90" height="140" fill={activeRoom === "kitchen" ? "rgba(45,45,45,0.04)" : "transparent"} className="transition-all hover:fill-black/5" />
                      <text x="320" y="95" textAnchor="middle" className={`text-xs font-bold transition-all ${activeRoom === "kitchen" ? "fill-[#2D2D2D]" : "fill-[#2D2D2D]/60"}`}>厨房</text>
                      <text x="320" y="112" textAnchor="middle" className="text-[10px] fill-[#2D2D2D]/40">14m²</text>
                    </g>

                    {/* 主卧 (Bottom Left Room) */}
                    <g 
                      className="cursor-pointer group/room" 
                      onClick={() => {
                        setActiveRoom("bedroom");
                        setIsFloorPlanOpen(false);
                      }}
                    >
                      <rect x="35" y="185" width="120" height="130" fill={activeRoom === "bedroom" ? "rgba(45,45,45,0.04)" : "transparent"} className="transition-all hover:fill-black/5" />
                      <text x="95" y="240" textAnchor="middle" className={`text-xs font-bold transition-all ${activeRoom === "bedroom" ? "fill-[#2D2D2D]" : "fill-[#2D2D2D]/60"}`}>主卧</text>
                      <text x="95" y="258" textAnchor="middle" className="text-[10px] fill-[#2D2D2D]/40">28m²</text>
                    </g>

                    {/* 书房 (Bottom Center Room) */}
                    <g 
                      className="cursor-pointer group/room" 
                      onClick={() => {
                        setActiveRoom("study");
                        setIsFloorPlanOpen(false);
                      }}
                    >
                      <rect x="165" y="185" width="100" height="130" fill={activeRoom === "study" ? "rgba(45,45,45,0.04)" : "transparent"} className="transition-all hover:fill-black/5" />
                      <text x="215" y="240" textAnchor="middle" className={`text-xs font-bold transition-all ${activeRoom === "study" ? "fill-[#2D2D2D]" : "fill-[#2D2D2D]/60"}`}>书房</text>
                      <text x="215" y="258" textAnchor="middle" className="text-[10px] fill-[#2D2D2D]/40">18m²</text>
                    </g>

                    {/* 卫生间 (Bottom Right Room) */}
                    <g 
                      className="cursor-pointer group/room" 
                      onClick={() => {
                        setActiveRoom("bathroom");
                        setIsFloorPlanOpen(false);
                      }}
                    >
                      <rect x="275" y="185" width="90" height="130" fill={activeRoom === "bathroom" ? "rgba(45,45,45,0.04)" : "transparent"} className="transition-all hover:fill-black/5" />
                      <text x="320" y="240" textAnchor="middle" className={`text-xs font-bold transition-all ${activeRoom === "bathroom" ? "fill-[#2D2D2D]" : "fill-[#2D2D2D]/60"}`}>卫生间</text>
                      <text x="320" y="258" textAnchor="middle" className="text-[10px] fill-[#2D2D2D]/40">16m²</text>
                    </g>

                    {/* Door Swings */}
                    <path d="M 125,180 A 35,35 0 0,0 160,145" fill="none" stroke="#2D2D2D" strokeWidth="1.5" />
                    <line x1="160" y1="180" x2="160" y2="145" stroke="#2D2D2D" strokeWidth="1.5" />

                    <path d="M 235,180 A 35,35 0 0,0 270,145" fill="none" stroke="#2D2D2D" strokeWidth="1.5" />
                    <line x1="270" y1="180" x2="270" y2="145" stroke="#2D2D2D" strokeWidth="1.5" />

                    {/* Glowing active position pin with pulsing concentric circle */}
                    <g transform={`translate(${ROOM_ASSETS[activeRoom].x}, ${ROOM_ASSETS[activeRoom].y})`}>
                      <circle r="12" fill="rgba(45,45,45,0.1)" className="animate-ping" />
                      <circle r="5" fill="#2D2D2D" className="shadow-lg" />
                      <path 
                        d="M -15,-15 L 0,-40 L 15,-15 Z" 
                        fill="rgba(45,45,45,0.15)" 
                        stroke="#2D2D2D" 
                        strokeWidth="1"
                        style={{ transform: `rotate(${ROOM_ASSETS[activeRoom].angle}deg)` }}
                        className="origin-center transition-all duration-700"
                      />
                    </g>
                  </svg>
                </div>
                
                {/* Close modal */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsFloorPlanOpen(false)}
                    className="bg-[#2D2D2D] text-white rounded-full px-6 py-2.5 text-xs md:text-sm font-medium hover:bg-black transition-colors cursor-pointer"
                  >
                    确认返回
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* ==================== FULLSCREEN IMMERSIVE VR ROAMING OVERLAY ==================== */}
          {isFullscreenVR && (
            <div className="fixed inset-0 z-[300] bg-black flex flex-col justify-between overflow-hidden select-none">
              
              {/* Immersive Background Sphere */}
              <div className="absolute inset-0 w-full h-full">
                <ThreeDViewer 
                  imageSrc={getActiveRoomImage()} 
                  fallbackSrc={getActiveRoomFallbackImage()}
                  isAutoRotate={false}
                  showHint={false}
                  className="w-full h-full"
                />
              </div>

              {/* Top Bar HUD Control */}
              <div className="relative z-20 w-full px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-b from-black/85 via-black/50 to-transparent pointer-events-none">
                
                {/* Current room info */}
                <div className="text-left text-white max-w-sm md:max-w-md pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase">720° Immersive VR Tour</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-xl md:text-2xl font-extrabold mt-1.5 tracking-tight flex items-center gap-2">
                    <span>{ROOM_ASSETS[activeRoom].name}</span>
                    {(activeRoom === "living" || activeRoom === "bedroom" || activeRoom === "kitchen") && (
                      <span className="text-amber-300 text-sm font-semibold bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-300/30">
                        {getStyleNameForRoom()}
                      </span>
                    )}
                    <span className="text-white/50 text-sm font-light">({ROOM_ASSETS[activeRoom].area})</span>
                  </h4>
                  <p className="text-white/70 text-xs mt-1 font-normal leading-relaxed line-clamp-2">
                    {getActiveRoomDesc()}
                  </p>
                </div>

                {/* Top Center Style Switcher Pill when in Living Room, Bedroom, or Kitchen */}
                {(activeRoom === "living" || activeRoom === "bedroom" || activeRoom === "kitchen") && (
                  <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-xl p-1.5 rounded-full border border-white/20 pointer-events-auto shadow-2xl mx-auto md:mx-0">
                    <span className="text-white/70 text-xs px-2.5 font-semibold hidden sm:flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      风格:
                    </span>
                    {getStylesForActiveRoom().map((style) => {
                      const isSelected = getActiveStyleId() === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => setActiveStyleId(style.id)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white text-black shadow-lg font-bold scale-105"
                              : "text-white/70 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {style.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Exit Immersive Mode button */}
                <button 
                  onClick={() => setIsFullscreenVR(false)}
                  className="pointer-events-auto absolute top-6 right-6 md:static flex items-center justify-center gap-2 bg-white/10 hover:bg-white/25 border border-white/20 text-white rounded-full pl-3 pr-4 py-2 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
                  title="退出漫游模式"
                >
                  <Minimize2 size={15} />
                  <span className="text-xs font-medium tracking-wider">退出漫游</span>
                </button>
              </div>

              {/* Bottom Controllers: Segments Bar + Floor Plan floating control */}
              <div className="relative z-20 w-full px-6 md:px-10 py-5 flex flex-col items-center gap-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm">
                
                <div className="w-full flex flex-col md:flex-row items-center gap-4 justify-between">
                  {/* HUD Instructions */}
                  <div className="text-white/50 text-xs tracking-widest uppercase hidden lg:block text-left">
                    360° 拖拽画面全景漫游 • 点击右侧按钮查看平面图
                  </div>

                  {/* Room Selector Segments Bar */}
                  <div className="flex items-center bg-black/60 backdrop-blur-xl px-2 py-1.5 rounded-full border border-white/15 shadow-2xl max-w-fit pointer-events-auto overflow-x-auto no-scrollbar">
                    {(Object.keys(ROOM_ASSETS) as RoomKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => setActiveRoom(key)}
                        className={`px-3.5 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                          activeRoom === key
                            ? "bg-white text-black shadow-lg font-bold"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {ROOM_ASSETS[key].name}
                      </button>
                    ))}
                  </div>

                  {/* Mini floor plan radar overlay or quick toggle */}
                  <button
                    onClick={() => setIsFloorPlanOpen(true)}
                    className="bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md shadow-xl rounded-full px-5 py-2 flex items-center gap-2 text-xs md:text-sm font-semibold transition-all cursor-pointer pointer-events-auto"
                  >
                    <Map className="w-4 h-4 text-white" />
                    <span>切换空间平面图</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </section>
      </div>
    </div>
  );
}

