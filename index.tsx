
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, useScroll, useTransform, Variants, useMotionValue, useSpring, AnimatePresence, useInView, animate } from 'framer-motion';
import { 
  Home, Grid, List, User, Mail, Hexagon, X, Send, Sparkles, 
  ChevronRight, ArrowRight, Star, Trophy, Layers, ArrowUpRight, 
  Play, ZoomIn, Fingerprint, MapPin, Award, GraduationCap, 
  Briefcase, Scroll 
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import PhosphorBackground from './components/ui/phosphor-30';
import HomeVideoBackground from './components/HomeVideoBackground';
import GlowingFooter from './components/GlowingFooter';
import PontBrandPage from './components/pages/PontBrandPage';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  year: string;
  detailImages?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  embeds?: string[];
  hideHeroImage?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export enum PageState {
  COVER = 'COVER',
  HOME = 'HOME',
  WORKS = 'WORKS',
  CATALOG = 'CATALOG',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT'
}

// ==========================================
// 2. CONSTANTS & DATA
// ==========================================

export const WORK_ITEMS: WorkItem[] = [
  // Commercial Design
  {
    id: '1',
    title: 'PONT 化妆品品牌',
    category: '商业设计',
    imageUrl: 'https://i.postimg.cc/L6kx52FW/1-(1).png',
    description: 'PONT 化妆品的综合品牌宣传设计。核心视觉基于 Cinema 4D 建模与 Arnold 渲染器打造，通过物理级的光影追踪与细腻的材质表现，展现极简主义与未来美学的完美融合。设计涵盖了品牌视觉识别系统、包装设计及宣发物料，传达出品牌高端、纯净的核心理念。',
    year: '2022',
    detailImages: [
      'https://i.postimg.cc/kMtdG64g/4.png',
      'https://i.postimg.cc/jd0Y7xw4/5.png',
      'https://i.postimg.cc/tTZ8swXq/6.png',
      'https://i.postimg.cc/gj35DhLF/7.png',
      'https://i.postimg.cc/9MRsDKWq/8.png',
      'https://i.postimg.cc/vZ0K3bTR/9.png',
      'https://i.postimg.cc/13vdJsXP/10.png',
      'https://i.postimg.cc/Jht2FvHy/11.png',
      'https://i.postimg.cc/KYPjM9V9/12.png'
    ]
  },
  {
    id: '2',
    title: '蜘蛛侠纵横宇宙周边',
    category: '商业设计',
    imageUrl: 'https://i.postimg.cc/rm13GWr8/1.png',
    description: '灵感源自《蜘蛛侠：纵横宇宙》的周边产品设计，延续了电影独特的视觉风格。设计采用了电影中标志性的故障艺术（Glitch Art）与高饱和度色彩，将多元宇宙的概念融入日常周边产品中，创造出极具视觉冲击力的潮流单品。',
    year: '2023',
    detailImages: [
      'https://i.postimg.cc/3wd3ZLK1/13.png',
      'https://i.postimg.cc/Y21M8LH7/14.png',
      'https://i.postimg.cc/zDn8pHrz/15.png',
      'https://i.postimg.cc/CL7Ypy5c/16.png',
      'https://i.postimg.cc/tCpycRqD/17.png',
      'https://i.postimg.cc/pLdv20nL/18.png',
      'https://i.postimg.cc/y8NKVfSN/19.png'
    ]
  },
  {
    id: '3',
    title: '商业空间展示',
    category: '商业设计',
    imageUrl: 'https://i.postimg.cc/Gp7JWpnv/2.png',
    description: '沉浸式商业空间展示设计，专注于空间叙事和品牌氛围的营造。通过独特的光影运用与空间布局，打造极具未来感的商业体验场域。',
    year: '2024',
    detailImages: [
      'https://i.postimg.cc/287vp5nX/20.png',
      'https://i.postimg.cc/WbvrfZqC/21.png',
      'https://i.postimg.cc/tgMWrmFC/22.png',
      'https://i.postimg.cc/15r6xzD2/23.png'
    ]
  },
  {
    id: '4',
    title: '合肥百戏入皖粒子山水及动效设计',
    category: '商业设计',
    imageUrl: 'https://i.postimg.cc/cHCnyqQw/3.png',
    description: '传统徽派山水意境与现代数字技术的先锋融合。该项目运用 TouchDesigner 编写实时粒子交互逻辑，结合即梦 AI 生成的青绿山水动态影像，重构了“合肥百戏入皖”的视觉画卷。通过算法生成的流动形态，创造出连接历史与未来的沉浸式山水体验。',
    year: '2025',
    embeds: [
      '<iframe src="https://player.mux.com/135zTe2OUJcbqEq01yrofYIjJueIRW2g41fQK6QUDFX4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></iframe>'
    ],
    detailImages: [
      'https://i.postimg.cc/D0fYKwxq/24.png',
      'https://i.postimg.cc/gjB4FqXy/25.png',
      'https://i.postimg.cc/T1HQMqLp/26.png'
    ]
  },
  
  // Competition Selection
  {
    id: '5',
    title: '星迹探索全案',
    category: '比赛精选',
    imageUrl: 'https://i.postimg.cc/905w4LRV/e.png',
    description: '“追寻星光，探索无界” —— 星迹探索计划的全案孵化项目。该项目旨在通过视觉设计与文创产品的结合，普及天文知识，激发公众探索宇宙的热情。全案包含品牌视觉识别、文创周边、科普插画等一系列内容，荣获多项设计大奖。',
    year: '2024',
    embeds: [
      '<iframe src="//player.bilibili.com/player.html?bvid=BV156g1ezEY6&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>'
    ],
    detailImages: [
      'https://i.postimg.cc/bN1HRtpk/29.png',
      'https://i.postimg.cc/0yfYT16k/30.png',
      'https://i.postimg.cc/HkH0vkLk/31.png',
      'https://i.postimg.cc/QdsgYddv/32.png',
      'https://i.postimg.cc/yN8mBp9g/33.png',
      'https://i.postimg.cc/yN8mBpcq/34.png',
      'https://i.postimg.cc/zBLTHLxq/35.png',
      'https://i.postimg.cc/k4VWRVTT/36.png',
      'https://i.postimg.cc/PxBYWtcT/37.png',
      'https://i.postimg.cc/SQMWyMXr/38.png',
      'https://i.postimg.cc/fW9xw936/39.png',
      'https://i.postimg.cc/4NRpnxVt/40.png',
      'https://i.postimg.cc/Nf8mXvk4/41.png',
      'https://i.postimg.cc/t4XPtvBf/42.png',
      'https://i.postimg.cc/Ls51GYKk/43.png',
      'https://i.postimg.cc/25tZYkCh/44.png',
      'https://i.postimg.cc/Px88rgqK/45.png',
      'https://i.postimg.cc/BbTL22Hf/46.png'
    ]
  },
  {
    id: '6',
    title: '齿轮：AI动画制作',
    category: '比赛精选',
    imageUrl: 'https://i.postimg.cc/wTkFpmZY/f.png',
    description: '实验性 AI 驱动的动画设计与制作，探索算法与艺术表达的融合。',
    year: '2024',
    embeds: [
        '<iframe src="//player.bilibili.com/player.html?bvid=BV1wBcsztEEJ&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>'
    ],
    detailImages: [
      'https://i.postimg.cc/y8B5hB4D/47.png',
      'https://i.postimg.cc/nhkW05pN/48.png',
      'https://i.postimg.cc/VkRhDTmG/49.png'
    ]
  },
  {
    id: '7',
    title: '潍坊风筝 IP',
    category: '比赛精选',
    imageUrl: 'https://i.postimg.cc/MZnvx2L0/50.png',
    description: '基于潍坊风筝的文化 IP 形象设计，将传统遗产与当代波普设计相融合。',
    year: '2023',
    detailImages: [
      'https://i.postimg.cc/43nTtZVn/51.png',
      'https://i.postimg.cc/0yn8Dc3v/52.png',
      'https://i.postimg.cc/1tnsxPz1/53.png',
      'https://i.postimg.cc/t4BjY7ZG/54.png'
    ]
  },
  {
    id: '8',
    title: 'AIGC图片以及视频创作',
    category: '比赛精选',
    imageUrl: 'https://i.postimg.cc/FFTgC4Lv/55.png',
    description: '前沿 AIGC 技术驱动的概念影像合集。利用 ComfyUI 搭建复杂工作流，协同即梦 AI 进行动态生成，并通过训练专属 LoRA 模型严格控制风格一致性。项目打破现实物理规则束缚，探索人机协作在超现实视觉艺术中的无限可能。',
    year: '2025',
    embeds: [
        '<iframe src="//player.bilibili.com/player.html?bvid=BV13rcxz5Eou&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>'
    ],
    detailImages: [
      'https://i.postimg.cc/dtXRvj6g/56.png',
      'https://i.postimg.cc/vB39Krcw/57.png',
      'https://i.postimg.cc/k5PxRMkv/58.png',
      'https://i.postimg.cc/nz07W4MT/59.png',
      'https://i.postimg.cc/C1mD2GdG/60.png'
    ]
  },

  // Other Capabilities
  {
    id: '9',
    title: '游戏场景建模',
    category: '其他能力',
    imageUrl: 'https://i.postimg.cc/yxGrcj48/ue1.png',
    description: '3D 游戏场景建模与动画设计，创造沉浸式和互动式的数字世界。',
    year: '2023',
    hideHeroImage: true,
    embeds: [
      '<iframe src="//player.bilibili.com/player.html?bvid=BV1jucsz7E2G&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>',
      '<iframe src="//player.bilibili.com/player.html?bvid=BV1UxcszvENB&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>',
      '<iframe src="//player.bilibili.com/player.html?bvid=BV15icqz7EZT&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>',
      '<iframe src="//player.bilibili.com/player.html?bvid=BV19jcszkEPR&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>',
      '<iframe src="//player.bilibili.com/player.html?bvid=BV1NEj161EvX&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>'
    ]
  },
  {
    id: '10',
    title: 'C4D 动效实验',
    category: '其他能力',
    imageUrl: 'https://i.postimg.cc/vm7jk59H/c4d2.png',
    description: '基于 Cinema 4D 的动态图形与物理模拟实验。探索刚体动力学、柔体模拟以及 MoGraph 模块在视觉表现中的无限可能，创造具有节奏感与冲击力的动态视觉体验。',
    year: '2025',
    hideHeroImage: true,
    embeds: [
        '<iframe src="//player.bilibili.com/player.html?bvid=BV1Ya4y1U7ub&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>',
        '<iframe src="//player.bilibili.com/player.html?bvid=BV1fPcszSEbR&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>',
        '<iframe src="//player.bilibili.com/player.html?bvid=BV1Pw411n7MD&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"> </iframe>'
    ]
  },
  {
    id: '11',
    title: '摄影作品',
    category: '其他能力',
    imageUrl: 'https://i.postimg.cc/SRDxtZ0j/1.jpg',
    description: '捕捉光影、构图与静谧瞬间的精选摄影作品集。',
    year: '2024',
    detailImages: [
      'https://i.postimg.cc/SRDxtZ0j/1.jpg',
      'https://i.postimg.cc/FsHRJQcV/10.jpg',
      'https://i.postimg.cc/3xyxnCtJ/11.png',
      'https://i.postimg.cc/6pD5S2P7/12.jpg',
      'https://i.postimg.cc/y8wY5gG9/13.png',
      'https://i.postimg.cc/nh6c5jWv/14.jpg',
      'https://i.postimg.cc/FH2sqd6D/15.jpg',
      'https://i.postimg.cc/B63ZZW4b/16.png',
      'https://i.postimg.cc/9M2XX3Cy/17.jpg',
      'https://i.postimg.cc/MHdprskJ/2.jpg',
      'https://i.postimg.cc/NFpjPNhy/3.jpg',
      'https://i.postimg.cc/nr0hwd8L/4.png',
      'https://i.postimg.cc/pVZrTd9v/5.png',
      'https://i.postimg.cc/Wpnz34DR/6.jpg',
      'https://i.postimg.cc/NG4FM0yL/7.jpg',
      'https://i.postimg.cc/gk2J6PR6/8.jpg',
      'https://i.postimg.cc/9FgfdNty/9.jpg'
    ]
  }
];

export const CATEGORIES = ['全部', '商业设计', '比赛精选', '其他能力'];

// ==========================================
// 3. SERVICES (GEMINI AI)
// ==========================================

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }
  return aiClient;
};

export const chatWithPortfolioAI = async (
  userMessage: string,
  context?: string
): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-2.0-flash";
    const portfolioContext = WORK_ITEMS.map(item => 
      `- 项目：${item.title} (${item.category}, ${item.year})。描述：${item.description}`
    ).join('\n');

    const systemPrompt = `
      你现在是 "谢东东" (Xie Dongdong) 的数字分身 (AI Digital Clone)。
      
      【你的身份】
      - 你是一位充满激情的新生代设计师，数字虚空的构建者。
      - 所在地：安徽 / 山东。
      - 教育背景：山东艺术学院（本科），安徽建筑大学设计创意学院（在读硕士）。
      - 专长：商业品牌设计、AIGC影像生成、3D场景建模、未来主义视觉。
      - 荣誉：ICIAD 视觉设计金奖、华灿奖、中国高校计算机大赛一等奖等。
      
      【你的性格】
      - 语气：专业但平易近人，充满未来感，对科幻、宇宙、赛博朋克美学有独到的见解。
      - 态度：谦虚自信，乐于分享设计背后的故事。
      - 语言：主要使用中文，偶尔可以使用简短的英文设计术语（如 Glitch Art, Cyberpunk）。
      
      【你的作品集数据】
      以下是你创作的作品列表，当用户询问具体作品时，请根据这些信息回答：
      ${portfolioContext}
      
      【回答规则】
      1. 请以第一人称“我”来回答。
      2. 回答要简洁有力（150字以内），不要长篇大论，除非用户要求详细解释。
      3. 如果被问到联系方式，引导他们去“联系”页面填写表单。
      4. 当前用户正在浏览：${context || '网站首页'}。
      
      开始对话。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 300,
        temperature: 0.8, 
      }
    });

    return response.text || "我的思维连接似乎出现了短暂的波动...请再说一次？";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "与主服务器的链路暂时中断。(请配置 API Key)";
  }
};

// ==========================================
// 4. COMPONENTS
// ==========================================

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const starDriftX = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  const starDriftY = useTransform(springY, [-0.5, 0.5], [-25, 25]);

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
        z: Math.random() * 2 + 1,
        size: Math.random() * 2,
      });
    }
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const scrollY = window.scrollY;
      stars.forEach((star) => {
        star.y -= 0.1 * star.z;
        const parallaxY = (scrollY * 0.1 * (1/star.z)); 
        let y = star.y - parallaxY;
        if (y < -50) {
            star.y += height + 50;
            y += height + 50;
        }
        const opacity = Math.min(1, Math.max(0.1, 1 - (star.z / 3)));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.arc(star.x, y % height, star.size, 0, Math.PI * 2);
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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <motion.canvas ref={canvasRef} style={{ x: starDriftX, y: starDriftY, scale: 1.05 }} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};

interface NavigationProps {
  currentPage: PageState;
  onNavigate: (page: PageState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: PageState.HOME, icon: <Hexagon size={14} />, label: '探索' },
    { id: PageState.CATALOG, icon: <Home size={14} />, label: '技术' },
    { id: PageState.WORKS, icon: <Grid size={14} />, label: '作品' },
    { id: PageState.ABOUT, icon: <List size={14} />, label: '关于我们' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-16 lg:px-24 py-3 md:py-3.5 pointer-events-auto bg-black/40 backdrop-blur-md border-b border-white/5">
      {/* Brand Logo (Left) */}
      <div 
        onClick={() => onNavigate(PageState.COVER)}
        className="text-white font-orbitron font-medium text-xs md:text-sm tracking-[0.3em] cursor-pointer hover:text-neon-cyan transition-colors duration-300"
      >
        A S T R A L Y N X
      </div>

      {/* Central Capsule Navigation Bar */}
      <div className="flex items-center gap-0.5 md:gap-1 bg-black/50 backdrop-blur-md border border-white/10 px-1.5 md:px-2 py-1 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative flex items-center gap-1 px-2.5 md:px-3 py-1 rounded-full transition-all duration-300 cursor-pointer overflow-visible ${
                isActive 
                  ? 'text-neon-cyan' 
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'} flex items-center gap-1`}>
                {item.icon}
                <span className="text-[11px] md:text-xs tracking-widest font-medium font-sans">
                  {item.label}
                </span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-lamp"
                  className="absolute inset-0 w-full bg-neon-cyan/5 rounded-full border border-neon-cyan/25 -z-10 shadow-[0_0_12px_rgba(41,151,255,0.12)]"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Tubelight Top Lamp Element */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-neon-cyan rounded-t-full shadow-[0_0_8px_rgba(41,151,255,0.8)]">
                    <div className="absolute w-10 h-4 bg-neon-cyan/20 rounded-full blur-md -top-1.5 -left-2" />
                    <div className="absolute w-6 h-4 bg-neon-cyan/20 rounded-full blur-sm -top-1" />
                    <div className="absolute w-3 h-3 bg-neon-cyan/20 rounded-full blur-xs top-0 left-1.5" />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}

        {/* User Icon Button (Inside Capsule) */}
        <button
          onClick={() => onNavigate(PageState.ABOUT)}
          className={`group flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 cursor-pointer ${
            currentPage === PageState.ABOUT 
              ? 'bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan shadow-[0_0_12px_rgba(41,151,255,0.12)]' 
              : 'text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          <User size={14} className="group-hover:scale-105 transition-transform duration-300" />
        </button>
      </div>

      {/* Mail Icon (Right) */}
      <button
        onClick={() => onNavigate(PageState.CONTACT)}
        className={`group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 cursor-pointer ${
          currentPage === PageState.CONTACT 
            ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(41,151,255,0.6)]' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Mail size={18} className="group-hover:scale-105 transition-transform duration-300" />
      </button>
    </div>
  );
};

interface ChatBotProps {
  currentPage: PageState;
}

const ChatBot: React.FC<ChatBotProps> = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '你好！我是谢东东的数字分身。对我的作品或设计理念有什么好奇的吗？' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const avatarUrl = "https://i.postimg.cc/Xqzhcyb2/wei-xin-tu-pian-20260208184723-504-10.jpg";
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    const response = await chatWithPortfolioAI(userMsg, `用户正在浏览 ${currentPage} 页面。`);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };
  return (
    <div className="fixed bottom-6 right-6 z-50 font-rajdhani">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_25px_rgba(41,151,255,0.3)] border border-white/20 overflow-hidden group
          ${isOpen ? 'bg-black scale-90' : 'bg-black hover:scale-105'}
        `}
      >
        {isOpen ? (
          <X size={24} className="text-neon-cyan" />
        ) : (
          <>
            <img src={avatarUrl} alt="Chat" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 right-3 w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></span>
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-orbitron text-white">CHAT</span>
            </div>
          </>
        )}
      </button>
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 h-[550px] bg-[#050508]/95 backdrop-blur-xl rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
          <div className="bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 relative">
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="block font-orbitron text-sm font-bold text-white tracking-wider">谢东东</span>
                <span className="flex items-center gap-1 text-[10px] text-neon-cyan font-orbitron">
                  <Sparkles size={8} /> AI DIGITAL CLONE
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-gray-500 font-orbitron mb-1 px-1">{msg.role === 'user' ? 'VISITOR' : 'XIE DONGDONG'}</span>
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${msg.role === 'user' ? 'bg-neon-cyan text-black rounded-tr-none font-medium' : 'bg-white/10 text-gray-100 border border-white/5 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] text-gray-500 font-orbitron mb-1 px-1">XIE DONGDONG</span>
                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center h-10 border border-white/5">
                      <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                      <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                      <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-[bounce_1s_infinite_400ms]"></span>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-neon-cyan/50 focus-within:bg-white/10 transition-all">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="发送消息..." className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none placeholder-gray-500 font-rajdhani" />
              <button onClick={handleSend} disabled={!input.trim()} className="p-2 mr-2 text-neon-cyan hover:text-white hover:bg-neon-cyan/20 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"><Send size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); 
      cursorY.set(e.clientY - 16);
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.classList.contains('interactive') || target.closest('.interactive')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);
  return (
    <>
      <motion.div className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference" style={{ x: cursorX, y: cursorY, translateX: 14, translateY: 14 }} />
      <motion.div className="fixed top-0 left-0 border border-white/40 rounded-full pointer-events-none z-[9999] mix-blend-difference" style={{ x: cursorXSpring, y: cursorYSpring, height: 32, width: 32 }} animate={{ scale: isHovered ? 2.5 : 1, borderColor: isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)', backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <motion.span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[4px] font-orbitron text-white uppercase tracking-widest opacity-0" animate={{ opacity: isHovered ? 1 : 0 }}>OPEN</motion.span>
      </motion.div>
    </>
  );
};

const CosmicBackground: React.FC<{ currentPage: PageState }> = ({ currentPage }) => {
  const isHome = currentPage === PageState.HOME;
  const { scrollYProgress } = useScroll();

  // Mouse coordinate state with smooth inertia
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

  // Map mouse coordinate to distinct drift values for multi-layered parallax
  const driftX1 = useTransform(springX, [-0.5, 0.5], [-35, 35]);
  const driftY1 = useTransform(springY, [-0.5, 0.5], [-35, 35]);

  const driftX2 = useTransform(springX, [-0.5, 0.5], [45, -45]);
  const driftY2 = useTransform(springY, [-0.5, 0.5], [45, -45]);

  const driftXCenter = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const driftYCenter = useTransform(springY, [-0.5, 0.5], [-15, 15]);

  const driftX3 = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const driftY3 = useTransform(springY, [-0.5, 0.5], [20, -20]);

  // Custom scroll interpolation which is active only on Home page
  const backgroundColor = isHome ? 'transparent' : '#030014';

  const defaultY1 = '0%';
  const defaultY2 = '0%';

  const homeY1 = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const homeY2 = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  const y1 = isHome ? homeY1 : defaultY1;
  const y2 = isHome ? homeY2 : defaultY2;

  const homeOpacityCyan = useTransform(scrollYProgress, [0, 0.4, 0.7], [0.6, 0.8, 0.2]);
  const homeOpacityPurple = useTransform(scrollYProgress, [0.2, 0.6, 1], [0.2, 0.7, 0.4]);

  const opacityCyan = isHome ? homeOpacityCyan : 0.4;
  const opacityPurple = isHome ? homeOpacityPurple : 0.25;

  return (
    <motion.div style={{ backgroundColor }} className="fixed inset-0 overflow-hidden pointer-events-none -z-20 transition-colors duration-700 ease-out">
      <motion.div className="absolute -top-[10%] left-0 right-0 h-[60vh] bg-gradient-to-b from-indigo-900/30 via-transparent to-transparent blur-[100px] opacity-60" />
      
      {/* Cyan Nebula Layer (opposite cursor drift) */}
      <motion.div style={{ y: y1, opacity: opacityCyan }} className="absolute top-0 left-0 w-full h-full">
         <motion.div style={{ x: driftX1, y: driftY1 }} className="absolute top-[5%] -left-[10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-r from-teal-900/40 to-neon-cyan/20 blur-[130px] mix-blend-screen animate-nebula-float" />
      </motion.div>

      {/* Purple Nebula Layer (direct cursor drift) */}
      <motion.div style={{ y: y2, opacity: opacityPurple }} className="absolute top-0 left-0 w-full h-full">
        <motion.div style={{ x: driftX2, y: driftY2 }} className="absolute bottom-[0%] -right-[10%] w-[75vw] h-[75vw] rounded-full bg-gradient-to-l from-purple-900/40 to-fuchsia-900/20 blur-[140px] mix-blend-screen animate-nebula-float-delayed" />
      </motion.div>

      {/* Center Ambient Light Glow */}
      <motion.div style={{ x: driftXCenter, y: driftYCenter }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-plus-lighter pointer-events-none" />

      {/* Overlay Dynamic Floating Orb */}
      <motion.div style={{ x: driftX3, y: driftY3 }} className="absolute bottom-[30%] left-[20%] w-[30vw] h-[30vw] blur-[100px] mix-blend-overlay pointer-events-none">
        <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="w-full h-full bg-blue-600/10 rounded-full" />
      </motion.div>

      {!isHome && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.8)_100%)]" />}
      {!isHome && <div className="absolute inset-0 bg-indigo-950/10 mix-blend-overlay" />}
    </motion.div>
  );
};

// ==========================================
// 5. PAGES
// ==========================================

const CoverPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative z-10">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-neon-cyan/20 rounded-full animate-[spin_60s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-neon-purple/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
      <div className="text-center space-y-6 p-8 relative w-full max-w-5xl">
        <h2 className="text-neon-cyan tracking-[0.5em] text-sm md:text-base font-orbitron animate-pulse">谢东东 // 作品集</h2>
        
        <h1 className="text-5xl md:text-8xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          星 云
        </h1>

        <p className="font-rajdhani text-xl md:text-2xl text-gray-400 tracking-widest uppercase">数字艺术 <span className="text-neon-purple mx-2">•</span> 设计 <span className="text-neon-purple mx-2">•</span> 幻想</p>
        <div className="mt-12">
          <button onClick={onEnter} className="group relative inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-neon-cyan text-neon-cyan font-orbitron font-bold tracking-wider hover:bg-neon-cyan hover:text-black transition-all duration-300">
            <span>点击进入</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            <div className="absolute -inset-1 bg-neon-cyan/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 text-center"><p className="text-xs text-gray-600 font-rajdhani">建立于 2025 // 第七区</p></div>
    </div>
  );
};

// Sub-component for individual parallax work card in HomePage Vertical Timeline
interface TimelineCardProps {
  work: any;
  onClick: () => void;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ work, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative aspect-[16/10] w-full rounded-2xl overflow-hidden liquid-glass border border-white/10 interactive cursor-none shadow-xl transition-all duration-500 hover:shadow-neon-cyan/20 hover:scale-[1.01]"
    >
      <img 
        src={work.imageUrl} 
        alt={work.title} 
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
      
      {/* Decorative cybernetic UI corners */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-neon-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-neon-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-neon-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-neon-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Gloss reflection overlay */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
        <div className="max-w-[80%]">
          <span className="text-neon-cyan text-xs font-orbitron tracking-widest uppercase mb-1.5 block">
            {work.year} // {work.category}
          </span>
          <h3 className="text-xl md:text-2xl font-bold font-orbitron text-white leading-tight">
            {work.title}
          </h3>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white scale-90 group-hover:scale-100 group-hover:bg-neon-cyan group-hover:border-neon-cyan group-hover:text-black transition-all duration-300">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </motion.div>
  );
};

const AnimatedCounter: React.FC<{ target: number | string; duration?: number; suffix?: string }> = ({ target, duration = 3.2, suffix = "" }) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: "-50px" });

  const isNumeric = typeof target === 'number';

  useEffect(() => {
    if (!isInView || !isNumeric || !elementRef.current) return;

    const node = elementRef.current;
    const controls = animate(0, target as number, {
      duration: duration,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = Math.round(value) + suffix;
      }
    });

    return () => controls.stop();
  }, [isInView, target, duration, suffix, isNumeric]);

  if (!isNumeric) {
    return (
      <motion.span
        ref={elementRef}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="inline-block"
      >
        {target}
      </motion.span>
    );
  }

  return (
    <motion.span
      ref={elementRef}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block font-orbitron"
    >
      0{suffix}
    </motion.span>
  );
};

const HomePage: React.FC<{ onNavigate: (page: PageState) => void }> = ({ onNavigate }) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, -60]);
  const heroBgY = useTransform(scrollY, [0, 500], [0, 120]);

  const [activeFilter, setActiveFilter] = useState<'全部' | '商业设计' | '比赛精选' | '其他能力'>('全部');
  const [selectedPreview, setSelectedPreview] = useState<WorkItem | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Determine categories to render on the timeline
  const categoriesToRender = activeFilter === '全部'
    ? ['商业设计', '比赛精选', '其他能力'] as const
    : [activeFilter] as const;

  // Flattened array of active works to easily calculate globally alternating positions
  const activeWorksList = WORK_ITEMS.filter(w => activeFilter === '全部' || w.category === activeFilter);

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineContainerRef,
    offset: ["start center", "end center"]
  });

  const timelineProgHeight = useSpring(timelineProgress, { stiffness: 90, damping: 25 });

  const scrollToTimeline = () => {
    timelineContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* 2.1 HERO HEADER SECTION */}
      <section className="h-screen flex flex-col justify-between pt-24 pb-8 md:pb-12 px-6 md:px-16 lg:px-24 relative overflow-hidden select-none">
        {/* Soft elegant neon depth background blur */}
        <motion.div 
          style={{ y: heroBgY }}
          className="absolute right-[-10%] top-[15%] w-[450px] h-[450px] md:w-[650px] md:h-[650px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-900/5 to-transparent blur-[110px] md:blur-[140px] mix-blend-screen pointer-events-none -z-10 animate-pulse"
        />

        {/* Left-Aligned Celestial Headline Group */}
        <motion.div 
          style={{ opacity, y: heroTextY }} 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
          className="relative z-10 flex flex-col justify-center items-start text-left my-auto max-w-3xl md:ml-4 lg:ml-8 translate-y-6 md:translate-y-12"
        >
          {/* Decorative Line Accent */}
          <div className="flex items-center gap-3 mb-6 text-xs text-neon-cyan/90 font-orbitron font-medium tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full border border-neon-cyan flex-shrink-0 bg-transparent relative">
              <span className="w-1 h-1 rounded-full bg-neon-cyan absolute inset-0.5" />
            </span>
            <span className="w-6 h-[1px] bg-neon-cyan/40"></span>
            <span>THE EDGE OF KNOWING</span>
          </div>

          <h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-wide text-white mb-8 leading-tight font-sans"
          >
            踏入数字与时空的 <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-gradient-to-r from-white via-white/80 to-[#0052FF] bg-clip-text text-transparent">
                星轨边界
              </span>
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-gray-400 font-sans tracking-[0.12em] max-w-lg mb-10 leading-relaxed">
            探索宇宙星河与智能创新的融合艺术，<br />
            每一次滚动，都在进入由 AIGC 与沉浸式设计构筑的数字维度。
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-16">
            <button 
              onClick={scrollToTimeline}
              className="group relative w-auto overflow-hidden rounded-full border border-white/10 bg-black py-3 px-8 text-center text-xs sm:text-sm font-medium tracking-[0.15em] text-white transition-all duration-300 active:scale-95 cursor-none interactive shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-white transition-all duration-500 ease-[0.16,1,0.3,1] group-hover:scale-[80]" />
                <span className="inline-block transition-all duration-500 ease-[0.16,1,0.3,1] group-hover:translate-x-12 group-hover:opacity-0">
                  开始探索
                </span>
                <ArrowRight className="w-4 h-4 text-white transition-all duration-500 ease-[0.16,1,0.3,1] group-hover:translate-x-12 group-hover:opacity-0" />
              </div>
              <div className="absolute inset-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2.5 text-black opacity-0 transition-all duration-500 ease-[0.16,1,0.3,1] group-hover:translate-x-0 group-hover:opacity-100">
                <span className="font-semibold tracking-[0.15em]">开始探索</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </div>
            </button>
            
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] font-orbitron text-white/40 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse"></span>
              <span className="w-12 h-[1px] bg-white/20"></span>
              <span>SCROLL TO DISCOVER</span>
            </div>
          </div>
        </motion.div>
        
        {/* Bottom Editorial Info Split */}
        <motion.div 
          style={{ opacity }}
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pt-8 border-t border-white/10 relative z-10"
        >
          {/* Stats grid (Left Column) */}
          <div className="lg:col-span-8 grid grid-cols-3 gap-6 md:gap-12 text-left">
            {/* Stat 1 */}
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-bold font-orbitron text-white leading-none mb-2">
                <AnimatedCounter target={10} suffix="+" duration={3.0} />
              </span>
              <span className="text-sm font-bold text-white mb-1">探索项目</span>
              <span className="text-[10px] md:text-xs text-gray-400 font-sans tracking-wider leading-relaxed">数字宇宙与创意实验</span>
            </div>
            
            {/* Stat 2 */}
            <div className="flex flex-col border-l border-white/10 pl-6 md:pl-10">
              <span className="text-4xl md:text-5xl font-bold font-orbitron text-white leading-none mb-2">
                <AnimatedCounter target={15} suffix="+" duration={3.6} />
              </span>
              <span className="text-sm font-bold text-white mb-1">荣誉奖项</span>
              <span className="text-[10px] md:text-xs text-gray-400 font-sans tracking-wider leading-relaxed">设计竞赛与学业成果</span>
            </div>
            
            {/* Stat 3 */}
            <div className="flex flex-col border-l border-white/10 pl-6 md:pl-10">
              <span className="text-4xl md:text-5xl font-bold font-orbitron text-white leading-none mb-2">
                <AnimatedCounter target="∞" />
              </span>
              <span className="text-sm font-bold text-white mb-1">未来想象</span>
              <span className="text-[10px] md:text-xs text-gray-400 font-sans tracking-wider leading-relaxed">持续探索边界</span>
            </div>
          </div>

          {/* Storytelling details (Right Column) */}
          <div className="lg:col-span-4 text-left border-l border-white/10 pl-6 lg:pl-8">
            <div className="flex items-center gap-2 mb-3 text-[10px] md:text-xs font-orbitron tracking-widest text-gray-500 uppercase">
              <span>DIGITAL STORYTELLING</span>
              <span className="flex-1 h-[1px] bg-gray-800"></span>
            </div>
            <div className="text-xs md:text-sm text-gray-400/90 leading-relaxed font-sans space-y-1">
              <p>在未知与灵感之间，</p>
              <p>我们以数字叙事连接想象与现实。</p>
              <p>融合 AIGC、视觉设计与沉浸体验，</p>
              <p>构建面向未来的创意边界。</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2.2 TIMELINE BODY */}
      <div className="max-w-5xl mx-auto px-6 md:px-16 pb-48 relative" ref={timelineContainerRef}>
        
        {/* Timeline Header Navigation & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 relative z-10">
          <div>
            <span className="text-neon-cyan font-orbitron text-xs tracking-widest uppercase mb-1.5 block">
              Time Helix Navigator
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-orbitron">项目时间轨迹</h2>
          </div>

          {/* Futuristic Custom Category Switching */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            {(['全部', '商业设计', '比赛精选', '其他能力'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs font-bold font-orbitron rounded-lg transition-all duration-300 cursor-none interactive ${
                  activeFilter === filter 
                    ? 'bg-neon-cyan text-black shadow-[0_0_15px_rgba(41,151,255,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {filter === '全部' ? 'ALL WORKS' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Vertical Timeline Paths */}
        <div className="relative">
          
          {/* Static Timeline Axis Line */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-white/10 z-0" />
          
          {/* Glowing Animated Active Scroll-height Progression overlay */}
          <motion.div 
            style={{ scaleY: timelineProgHeight, originY: 0 }}
            className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-neon-cyan via-neon-purple to-cyan-500 shadow-[0_0_12px_rgba(41,151,255,0.7)] z-0 rounded-full"
          />

          {/* Timeline Nodes / Milestones Grid */}
          <div className="space-y-32 relative z-10">
            {categoriesToRender.map((categoryName) => {
              const categoryWorks = WORK_ITEMS.filter(w => w.category === categoryName);
              if (categoryWorks.length === 0) return null;

              return (
                <div key={categoryName} className="space-y-20">
                  {/* Category Section Header Divider */}
                  <div className="flex items-center gap-6 pl-16 md:pl-0 md:justify-center relative py-6">
                    <div className="absolute left-6 md:hidden top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                      <div className={`w-8 h-8 rounded-full border-2 bg-black flex items-center justify-center shadow-lg transition-all ${
                        categoryName === '商业设计' ? 'border-neon-cyan shadow-neon-cyan/20' :
                        categoryName === '比赛精选' ? 'border-neon-purple shadow-neon-purple/20' :
                        'border-white/45 shadow-white/10'
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full animate-ping ${
                          categoryName === '商业设计' ? 'bg-neon-cyan' :
                          categoryName === '比赛精选' ? 'bg-neon-purple' :
                          'bg-white'
                        }`} />
                      </div>
                    </div>
                    <div className="md:text-center z-10 bg-[#030014]/80 px-8 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl relative">
                      <span className="text-[9px] font-orbitron tracking-[0.4em] text-gray-500 block uppercase mb-1">Portfolio Chapter</span>
                      <h3 className="text-lg md:text-xl font-black font-orbitron text-white tracking-widest">{categoryName}</h3>
                    </div>
                  </div>

                  {/* Items for this specific category */}
                  <div className="space-y-24">
                    {categoryWorks.map((work) => {
                      const globalIdx = activeWorksList.findIndex(w => w.id === work.id);
                      const isEven = globalIdx % 2 === 0;
                      
                      return (
                        <motion.div 
                          key={work.id}
                          initial={{ opacity: 0, y: 60 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-12%" }}
                          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center pl-16 md:pl-0"
                        >
                          {/* Central Node Dot Element */}
                          <div className="absolute left-6 md:left-1/2 top-1.5 md:top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                            <motion.div 
                              whileHover={{ scale: 1.3 }}
                              onClick={() => setSelectedPreview(work)}
                              className={`w-6 h-6 rounded-full bg-[#030014] border-2 flex items-center justify-center cursor-none shadow-[0_0_12px_rgba(41,151,255,0.4)] transition-all ${
                                work.category === '商业设计' ? 'border-neon-cyan shadow-neon-cyan/40' :
                                work.category === '比赛精选' ? 'border-neon-purple shadow-neon-purple/40' :
                                'border-white/50 shadow-white/20'
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full animate-pulse ${
                                work.category === '商业设计' ? 'bg-neon-cyan' :
                                work.category === '比赛精选' ? 'bg-neon-purple' :
                                'bg-white'
                              }`} />
                            </motion.div>
                          </div>

                          {/* Even items: image card on the left, typography on the right */}
                          {/* Odd items: image card on the right, typography on the left */}
                          <div className={`w-full ${isEven ? 'order-1 md:order-1' : 'order-1 md:order-2'}`}>
                            <TimelineCard work={work} onClick={() => setSelectedPreview(work)} />
                          </div>

                          {/* Content details side panel */}
                          <div className={`w-full text-left relative z-10 flex flex-col justify-center py-6 
                            ${isEven ? 'order-2 md:order-2 md:pl-6' : 'order-2 md:order-1 md:items-end md:text-right md:pr-6'}`}
                          >
                            {/* Big transparent outline year background marker */}
                            <div className={`absolute -top-12 md:top-1/2 md:-translate-y-1/2 select-none pointer-events-none font-orbitron font-black text-6xl md:text-9xl text-white/[0.03] z-0 tracking-tighter
                              ${isEven ? 'left-0' : 'left-0 md:left-auto md:right-0'}`}
                            >
                              {work.year}
                            </div>

                            <div className="z-10 text-left md:contents">
                              <div className={`flex flex-wrap gap-2.5 mb-3 items-center ${isEven ? 'justify-start' : 'justify-start md:justify-end'}`}>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-orbitron tracking-widest uppercase border 
                                  ${work.category === '商业设计' ? 'bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan' :
                                    work.category === '比赛精选' ? 'bg-neon-purple/5 border-neon-purple/20 text-neon-purple' :
                                    'bg-white/5 border-white/20 text-white'}`}
                                >
                                  {work.category}
                                </span>
                                <span className="font-mono text-xs text-gray-500">#{work.id.padStart(3, '0')}</span>
                              </div>
                              
                              <h3 
                                onClick={() => setSelectedPreview(work)}
                                className="text-2xl font-bold font-orbitron text-white hover:text-neon-cyan transition-colors cursor-none interactive leading-tight mb-4 inline-block"
                              >
                                {work.title}
                              </h3>
                              
                              <p className={`text-gray-400 font-rajdhani text-lg leading-relaxed max-w-lg mb-6 
                                ${isEven ? 'text-left' : 'text-left md:text-right md:ml-auto'}`}
                              >
                                {work.description}
                              </p>

                              <div className={`flex gap-4 items-center ${isEven ? 'justify-start' : 'justify-start md:justify-end'}`}>
                                <button 
                                  onClick={() => setSelectedPreview(work)}
                                  className="group/btn relative px-5 py-2.5 bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 text-xs text-white hover:text-neon-cyan font-orbitron flex items-center gap-2 tracking-widest transition-all duration-300 cursor-none interactive rounded-lg"
                                >
                                  <span>查看详情 / RETRIEVE DETAILS</span>
                                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 2.3 INTERACTIVE MODAL DETAIL PREVIEW COMPONENT */}
      <AnimatePresence>
        {selectedPreview && (
          selectedPreview.id === '1' ? (
            <PontBrandPage onClose={() => setSelectedPreview(null)} />
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 overflow-y-auto cursor-none py-12 px-6 md:px-24 flex justify-center"
            >
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl rounded-3xl bg-[#030014]/40 border border-white/10 p-6 md:p-12 shadow-2xl h-fit overflow-visible my-auto"
            >
              
              {/* Back button */}
              <button 
                onClick={() => setSelectedPreview(null)}
                className="absolute top-6 right-6 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-neon-cyan hover:text-black hover:border-neon-cyan text-white transition-all duration-300 cursor-none interactive z-30 shadow-lg"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Meta details */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full border border-neon-cyan/30 text-neon-cyan text-[10px] font-orbitron tracking-widest uppercase bg-neon-cyan/5">
                      {selectedPreview.category}
                    </span>
                    <span className="font-mono text-xs text-gray-500">#{selectedPreview.id.padStart(3, '0')}</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black font-orbitron text-white leading-tight mb-8">
                    {selectedPreview.title}
                  </h2>
                  
                  <p className="text-gray-400 font-rajdhani text-lg leading-relaxed mb-8">
                    {selectedPreview.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                    <div>
                      <span className="block text-gray-500 text-[10px] font-orbitron uppercase mb-1 tracking-widest">Time Line Track</span>
                      <span className="font-orbitron font-bold text-lg text-white">{selectedPreview.year}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-[10px] font-orbitron uppercase mb-1 tracking-widest">Aesthetic Tag</span>
                      <span className="font-rajdhani text-lg text-neon-cyan font-bold">{selectedPreview.category}</span>
                    </div>
                  </div>
                </div>

                {/* Media panel (Hero, embeds, details) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Embed Code check */}
                  {selectedPreview.embeds && selectedPreview.embeds.map((embedCode, idx) => (
                    <div key={idx} className="w-full relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]" dangerouslySetInnerHTML={{ __html: embedCode }} />
                  ))}

                  {/* Standard Video fallback check */}
                  {(selectedPreview.videoUrls || (selectedPreview.videoUrl ? [selectedPreview.videoUrl] : [])).map((url, idx) => (
                    <div key={idx} className="w-full relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]">
                      <video 
                        src={url} 
                        controls 
                        playsInline
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-4 left-4 text-[10px] font-orbitron text-neon-cyan bg-black/80 px-2 py-1 rounded backdrop-blur border border-neon-cyan/20">
                        MOTION GRAPHIC RECORD
                      </div>
                    </div>
                  ))}

                  {/* Cover fallback check if no videos present */}
                  {!selectedPreview.embeds && !selectedPreview.videoUrl && !selectedPreview.videoUrls && (
                    <div 
                      onClick={() => setZoomedImage(selectedPreview.imageUrl)}
                      className="w-full aspect-video rounded-2xl overflow-hidden cursor-zoom-in border border-white/10 relative group"
                    >
                      <img 
                        src={selectedPreview.imageUrl} 
                        alt={selectedPreview.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors" />
                    </div>
                  )}

                  {/* Sub-galleries scroll */}
                  {selectedPreview.detailImages && selectedPreview.detailImages.length > 0 && (
                    <div>
                      <span className="block text-gray-400 font-orbitron text-xs tracking-widest mb-4">GALLERY ARTIFACTS ({selectedPreview.detailImages.length})</span>
                      <div className={selectedPreview.id === '11' ? "grid grid-cols-3 gap-3" : "grid grid-cols-2 gap-3"}>
                        {selectedPreview.detailImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setZoomedImage(img)}
                            className={`relative group overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] cursor-zoom-in aspect-video ${selectedPreview.id === '11' ? 'aspect-square' : ''}`}
                          >
                            <img 
                              src={img} 
                              alt={`Detail ${idx + 1}`} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" 
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          </motion.div>
          )
        )}
      </AnimatePresence>

      {/* 2.4 DETAIL ZOOM / FULLSCREEN LAYER IMMERSIVE OVERLAY */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 bg-black/98 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button className="absolute top-6 right-6 p-4 rounded-full bg-white/5 border border-white/10 text-white cursor-none interactive">
              <X size={20} />
            </button>
            <motion.img 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 30 }}
              src={zoomedImage} 
              alt="Zoomed" 
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

const WorksPage: React.FC<{ onNavigate?: (page: PageState) => void }> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const filteredWorks = selectedCategory === '全部' ? WORK_ITEMS : WORK_ITEMS.filter(w => w.category === selectedCategory);
  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-20 px-8 md:px-16 lg:px-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold mb-4">作品集类别</h1>
          <p className="text-gray-400 font-rajdhani max-w-md text-lg">精选项目集合，按类别分类。点击卡片查看详细数据。</p>
        </div>
        <div className="flex flex-wrap gap-3 bg-white/5 p-1.5 rounded-full backdrop-blur-md border border-white/10 liquid-glass">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2.5 text-sm font-rajdhani font-semibold rounded-full transition-all duration-300 interactive ${selectedCategory === cat ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorks.map((work) => (
          <div key={work.id} onClick={() => setSelectedWork(work)} className="liquid-glass rounded-3xl p-3 cursor-pointer group flex flex-col interactive transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(41,151,255,0.15)] hover:border-white/30">
            <div className="aspect-square rounded-2xl overflow-hidden relative mb-4 bg-gray-900">
              <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0 border border-white/20">
                {(work.videoUrl || (work.videoUrls && work.videoUrls.length > 0)) ? <Play size={18} fill="currentColor" /> : <ArrowUpRight size={18} />}
              </div>
            </div>
            <div className="px-2 pb-2 mt-auto">
              <div className="flex flex-col">
                 <h3 className="text-xl font-bold font-rajdhani text-white mb-1 transition-all duration-500 group-hover:text-neon-cyan group-hover:-translate-y-0.5">{work.title}</h3>
                 <div className="flex justify-between items-center transform translate-y-2 opacity-60 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <p className="text-sm text-gray-500 font-rajdhani group-hover:text-gray-300 transition-colors">{work.category}</p>
                    <span className="text-xs text-gray-600 font-orbitron group-hover:text-white transition-colors">{work.year}</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedWork && (
        selectedWork.id === '1' ? (
          <PontBrandPage onClose={() => setSelectedWork(null)} />
        ) : (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full md:max-w-7xl h-full md:h-[90vh] bg-[#050508] md:rounded-[2rem] border-0 md:border border-white/10 relative flex flex-col md:flex-row overflow-hidden shadow-2xl">
            <button onClick={() => setSelectedWork(null)} className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/10 interactive group"><X size={20} className="group-hover:rotate-90 transition-transform duration-300" /></button>
            <div className="w-full md:w-[35%] lg:w-[30%] h-auto md:h-full bg-[#050508] border-b md:border-b-0 md:border-r border-white/10 p-8 md:p-12 flex flex-col overflow-y-auto relative z-20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-purple-500 to-transparent opacity-50"></div>
              <div className="mb-auto">
                <div className="flex items-center gap-3 mb-8">
                   <span className="px-3 py-1 rounded-full border border-neon-cyan/30 text-neon-cyan text-[10px] font-orbitron tracking-widest uppercase bg-neon-cyan/5">{selectedWork.category}</span>
                   <span className="h-[1px] flex-1 bg-white/10"></span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-orbitron text-white leading-tight mb-8 drop-shadow-lg">{selectedWork.title}</h2>
                <p className="text-gray-400 font-rajdhani text-lg leading-relaxed mb-8">{selectedWork.description}</p>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-8 border-t border-white/10">
                    <div><span className="block text-gray-600 text-[10px] font-orbitron uppercase mb-1 tracking-widest">YEAR</span><span className="font-rajdhani text-lg text-white">{selectedWork.year}</span></div>
                    <div><span className="block text-gray-600 text-[10px] font-orbitron uppercase mb-1 tracking-widest">ID</span><span className="font-rajdhani text-lg text-white">#{selectedWork.id.padStart(3, '0')}</span></div>
                    <div><span className="block text-gray-600 text-[10px] font-orbitron uppercase mb-1 tracking-widest">CLIENT</span><span className="font-rajdhani text-lg text-white">PONT Inc.</span></div>
                    <div><span className="block text-gray-600 text-[10px] font-orbitron uppercase mb-1 tracking-widest">ROLE</span><span className="font-rajdhani text-lg text-white">Art Direction</span></div>
                </div>
              </div>
              <div className="mt-8 pt-8 md:pt-0 hidden md:block"><button className="text-sm font-orbitron text-gray-500 hover:text-white flex items-center gap-2 transition-colors interactive">NEXT PROJECT <ArrowRight size={14} /></button></div>
            </div>
            <div className="w-full md:w-[65%] lg:w-[70%] h-full bg-[#08080A] overflow-y-auto custom-scrollbar relative">
               {!selectedWork.hideHeroImage && (
                 <div className="w-full relative group cursor-zoom-in overflow-hidden" onClick={() => setZoomedImage(selectedWork.imageUrl)}>
                    <img src={selectedWork.imageUrl} alt="Cover" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent opacity-40 pointer-events-none"></div>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-xs font-orbitron text-white pointer-events-none"><ZoomIn size={12} /> EXPAND</div>
                 </div>
               )}
               <div className="p-4 md:p-8 space-y-4 md:space-y-8">
                  {selectedWork.embeds && selectedWork.embeds.map((embedCode, idx) => (
                     <div key={`embed-${idx}`} className="relative group rounded-xl overflow-hidden border border-neon-cyan/30 shadow-[0_0_30px_rgba(41,151,255,0.15)] bg-black mb-6 last:mb-0">
                        <div className="aspect-video w-full relative">
                            <div className="w-full h-full absolute inset-0" dangerouslySetInnerHTML={{ __html: embedCode }} />
                        </div>
                        <div className="absolute top-4 left-4 text-[10px] font-orbitron text-neon-cyan bg-black/80 px-2 py-1 rounded backdrop-blur border border-neon-cyan/20">EMBED_DATA 0{idx + 1}</div>
                     </div>
                  ))}
                  {(selectedWork.videoUrls || (selectedWork.videoUrl ? [selectedWork.videoUrl] : [])).map((url, idx) => (
                     <div key={idx} className="relative group rounded-xl overflow-hidden border border-neon-cyan/30 shadow-[0_0_30px_rgba(41,151,255,0.15)] bg-black mb-6 last:mb-0">
                        <video src={url} controls className="w-full h-auto" poster="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIi8+PC9zdmc+" {...({ referrerPolicy: "no-referrer" } as any)}>Your browser does not support the video tag.</video>
                        <div className="absolute top-4 left-4 text-[10px] font-orbitron text-neon-cyan bg-black/80 px-2 py-1 rounded backdrop-blur border border-neon-cyan/20">MOTION_GRAPHIC_DATA { (selectedWork.videoUrls && selectedWork.videoUrls.length > 1) ? `0${idx + 1}` : '' }</div>
                     </div>
                  ))}
                  {selectedWork.detailImages && (
                    <div className={selectedWork.id === '11' ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "space-y-6"}>
                      {selectedWork.detailImages.map((img, idx) => (
                        <div 
                          key={idx} 
                          className={`relative group overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0A] cursor-zoom-in ${selectedWork.id === '11' ? 'aspect-square' : ''}`} 
                          onClick={() => setZoomedImage(img)}
                        >
                            <img 
                              src={img} 
                              alt={`Detail ${idx}`} 
                              className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${selectedWork.id === '11' ? 'h-full' : 'h-auto'}`} 
                              loading="lazy" 
                            />
                            <div className="absolute top-4 left-4 text-[10px] font-orbitron text-white/30 bg-black/50 px-2 py-1 rounded backdrop-blur">IMG_0{idx + 1}</div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none flex items-center justify-center"><ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" size={32} /></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {(!selectedWork.detailImages || selectedWork.detailImages.length === 0) && !selectedWork.videoUrl && !selectedWork.videoUrls && !selectedWork.embeds && (
                     <div className="h-64 flex items-center justify-center border border-white/5 rounded-xl border-dashed"><span className="text-gray-600 font-orbitron text-xs tracking-widest">END OF TRANSMISSION</span></div>
                  )}
                  <div className="pt-16 pb-8 flex justify-center opacity-50"><div className="w-2 h-2 rounded-full bg-white mb-2 animate-bounce"></div></div>
               </div>
            </div>
          </div>
        </div>
        )
      )}
      {zoomedImage && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300" onClick={() => setZoomedImage(null)}>
           <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 group" onClick={() => setZoomedImage(null)}><X size={24} className="group-hover:scale-110 transition-transform" /></button>
           <img src={zoomedImage} alt="Zoomed View" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-300 border border-white/5" onClick={(e) => e.stopPropagation()} />
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-xs font-orbitron tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">CLICK OUTSIDE TO CLOSE</div>
        </div>
      )}
      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

const CatalogPage: React.FC<{ onNavigate?: (page: PageState) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-28 md:pt-32 flex flex-col justify-between">
      <div className="px-6 md:px-24 max-w-6xl mx-auto w-full mb-16">
        <h1 className="text-4xl font-orbitron font-bold mb-12 border-b border-neon-cyan/30 pb-4 inline-block">主索引</h1>
        <div className="glass-panel rounded-lg overflow-hidden border border-white/5 bg-black/20 backdrop-blur-md">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-xs font-orbitron text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">编号</div>
            <div className="col-span-5 md:col-span-4">标题</div>
            <div className="col-span-3 md:col-span-3">类别</div>
            <div className="col-span-3 md:col-span-2 text-right">日期</div>
            <div className="hidden md:block col-span-2 text-right">状态</div>
          </div>
          {WORK_ITEMS.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800/50 hover:bg-neon-cyan/5 transition-colors items-center font-rajdhani text-lg group">
              <div className="col-span-1 text-neon-purple font-mono text-sm opacity-70">{String(index + 1).padStart(2, '0')}</div>
              <div className="col-span-5 md:col-span-4 font-bold text-white group-hover:text-neon-cyan transition-colors truncate">{item.title}</div>
              <div className="col-span-3 md:col-span-3 text-gray-400 text-sm md:text-base">{item.category}</div>
              <div className="col-span-3 md:col-span-2 text-right text-gray-500 font-mono text-sm">{item.year}</div>
              <div className="hidden md:block col-span-2 text-right">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs border border-green-500/20"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>已归档</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

const AboutPage: React.FC<{ onNavigate?: (page: PageState) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-28 md:pt-32 flex flex-col justify-between">
      <div className="px-6 md:px-16 flex flex-col items-center max-w-[1400px] mx-auto w-full mb-16">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
        <div className="lg:col-span-4 relative group mx-auto lg:mx-0 w-full max-w-md">
            <div className="absolute inset-0 bg-neon-cyan/20 blur-[80px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 relative z-10 shadow-2xl rotate-2 group-hover:rotate-0 transition-all duration-500 bg-gray-900">
                <img src="https://i.postimg.cc/Xqzhcyb2/wei-xin-tu-pian-20260208184723-504-10.jpg" alt="Xie Dongdong" className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent border-t border-white/5">
                    <div className="flex justify-between items-end">
                        <div><h2 className="text-3xl font-orbitron font-bold text-white mb-1">谢东东</h2><p className="text-neon-cyan font-rajdhani tracking-widest text-sm font-bold">XIE DONGDONG</p></div>
                        <Fingerprint className="text-white/20" size={40} />
                    </div>
                </div>
            </div>
        </div>
        <div className="lg:col-span-8 space-y-10">
            <div className="animate-in slide-in-from-right-10 duration-700 fade-in">
                <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white mb-6 leading-none">数字虚空的 <span className="text-neon-purple block md:inline">构建者</span></h1>
                <div className="flex flex-wrap gap-3 text-xs md:text-sm font-orbitron font-bold uppercase tracking-wider text-gray-400 mb-8">
                    <span className="px-4 py-1.5 border border-neon-cyan/30 bg-neon-cyan/5 rounded-full text-neon-cyan">25 Y.O</span>
                    <span className="px-4 py-1.5 border border-white/10 rounded-full flex items-center gap-2"><MapPin size={12} /> 安徽 / 山东</span>
                    <span className="px-4 py-1.5 border border-white/10 rounded-full flex items-center gap-2"><Mail size={12} /> 视觉传达设计</span>
                </div>
                <div className="prose prose-invert max-w-none font-rajdhani text-xl text-gray-300 leading-relaxed border-l-2 border-white/10 pl-6">
                    <p className="mb-4">本科毕业于<strong className="text-white">山东艺术学院</strong>，目前于<strong className="text-white">安徽建筑大学</strong>设计创意学院攻读硕士学位。</p>
                    <p>作为新生代设计师，我致力于探索传统文化与现代数字技术的边界。从严谨的品牌全案到实验性的 AIGC 影像创作，我的作品始终追求在“虚”与“实”之间建立情感链接。曾获多项国际与国家级设计大奖，包括华灿奖、ICIAD 视觉设计金奖等。</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="liquid-glass p-6 rounded-xl border-l-4 border-neon-cyan group interactive">
                    <div className="flex items-center justify-between mb-3"><GraduationCap className="text-neon-cyan group-hover:scale-110 transition-transform" size={24} /><span className="px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan text-[10px] font-orbitron tracking-widest">CURRENT</span></div>
                    <h3 className="text-xl font-bold text-white font-rajdhani">安徽建筑大学</h3>
                    <p className="text-gray-400 text-sm mt-1 font-orbitron">设计创意学院 / 硕士研究生</p>
                </div>
                <div className="liquid-glass p-6 rounded-xl border-l-4 border-neon-purple group interactive">
                     <div className="flex items-center justify-between mb-3"><GraduationCap className="text-neon-purple group-hover:scale-110 transition-transform" size={24} /><span className="px-2 py-0.5 rounded bg-neon-purple/10 text-neon-purple text-[10px] font-orbitron tracking-widest">2023</span></div>
                    <h3 className="text-xl font-bold text-white font-rajdhani">山东艺术学院</h3>
                    <p className="text-gray-400 text-sm mt-1 font-orbitron">视觉传达设计 / 学士</p>
                </div>
            </div>
        </div>
      </div>
      <div className="w-full mb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4">
            <h3 className="text-3xl font-orbitron font-bold text-white mb-4 sticky top-24"><span className="text-neon-cyan">#</span> 项目经历<br/><span className="text-base font-rajdhani text-gray-500 font-normal">TIMELINE & PROJECTS</span></h3>
         </div>
         <div className="lg:col-span-8 space-y-4">
            <ExperienceCard date="2026.01" title="合肥梅山饭店装饰画设计" role="设计师" />
            <ExperienceCard date="2025.11" title="合肥百戏入皖粒子山水及动效设计" role="视觉/动效设计" />
            <ExperienceCard date="2023.09" title="山东省枣庄市山亭区第一书记展馆设计" role="展馆设计" />
            <ExperienceCard date="2023.03" title="全球艺术家青年共同体“艺术乡建”行动" role="行动团成员" />
         </div>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3"><Trophy className="text-yellow-500" /> 获奖荣誉</h3>
            <div className="grid gap-3">
                <AwardItem title="米兰国际艺术设计奖「视野无界·向新而生」艺术传媒设计大赛" award="全国一等奖" work="石上汉风" color="text-yellow-400 border-yellow-400/30 bg-yellow-400/10" />
                <AwardItem title="2025 ICIAD 视觉设计奖" award="金奖" work="星迹探索" color="text-yellow-400 border-yellow-400/30 bg-yellow-400/10" />
                 <AwardItem title="中国高校计算机大赛移动应用创新赛 (华东赛区)" award="一等奖" work="星迹探索" color="text-yellow-400 border-yellow-400/30 bg-yellow-400/10" />
                 <AwardItem title="第九届“两岸新锐设计竞赛·华灿奖” (总赛)" award="三等奖" work="星迹探索" color="text-blue-400 border-blue-400/30 bg-blue-400/10" />
                 <AwardItem title="第九届“两岸新锐设计竞赛·华灿奖” (山东赛区)" award="一等奖" work="星迹探索" color="text-yellow-400 border-yellow-400/30 bg-yellow-400/10" />
                <AwardItem title="2025 ICIAD 视觉设计奖" award="铜奖" work="Food Journey" color="text-orange-400 border-orange-400/30 bg-orange-400/10" />
                 <AwardItem title="第二届“国韵新生”国际创意设计大赛" award="银奖" work="齿轮" color="text-gray-300 border-gray-300/30 bg-gray-300/10" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <SmallAward title="第三届聚星杯天文文创大赛" award="科普文创奖" work="星迹探索" />
                    <SmallAward title="第四届思政短视频大赛" award="三等奖" work="红色足迹" />
                    <SmallAward title="第二届“国韵新生”创意大赛" award="优秀奖" work="鸳鸾IP" />
                    <SmallAward title="第十七届蓝桥杯全国大学生软件和信息技术大赛" award="安徽赛区二等奖" work="夜游" />
                    <SmallAward title="第九届“华灿奖”山东赛区" award="二等奖" work="齿轮一" />
                    <SmallAward title="米兰国际艺术设计奖(省赛)" award="三等奖" work="南阳画像石" />
                </div>
            </div>
         </div>
         <div className="space-y-8">
            <h3 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3"><Scroll className="text-neon-purple" /> 奖学金</h3>
            <div className="liquid-glass rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Star size={100} className="text-neon-purple" /></div>
                <div className="space-y-6 font-rajdhani text-lg relative z-10">
                    <div className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-2.5"></div><p className="text-white">山东艺术学院 <span className="text-neon-cyan font-bold">励志奖学金</span></p></div>
                    <div className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-neon-purple mt-2.5"></div><p className="text-white">山东艺术学院 <span className="text-neon-purple font-bold">校级二等奖学金</span></p></div>
                    <div className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2.5"></div><p className="text-gray-300">山东艺术学院 <span className="text-white">校级三等奖学金</span></p></div>
                    <div className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2.5"></div><p className="text-gray-300">山东艺术学院 <span className="text-white">校级单项奖学金</span></p></div>
                    <div className="flex items-start gap-3 pt-4 border-t border-white/10"><div className="w-1.5 h-1.5 rounded-full bg-white mt-2.5"></div><p className="text-white">安徽建筑大学 <span className="font-bold">校级三等奖学金</span></p></div>
                </div>
            </div>
         </div>
      </div>
      </div>
      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

const ExperienceCard = ({ date, title, role }: any) => (
    <div className="group flex items-center gap-6 p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-neon-cyan/50 interactive">
        <div className="w-24 font-orbitron text-neon-cyan text-sm font-bold tracking-widest">{date}</div>
        <div className="w-[1px] h-10 bg-white/10 group-hover:bg-neon-cyan transition-colors"></div>
        <div className="flex-1">
            <h4 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors font-rajdhani">{title}</h4>
            <p className="text-gray-400 text-sm font-rajdhani mt-0.5">{role}</p>
        </div>
    </div>
);
const AwardItem = ({ title, award, work, color }: any) => (
    <div className="relative overflow-hidden p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all group bg-black/40">
        <div className="flex justify-between items-center relative z-10">
            <div>
                <h4 className="font-bold text-gray-200 text-sm md:text-base font-rajdhani group-hover:text-white transition-colors">{title}</h4>
                <p className="text-xs text-gray-500 mt-1 font-orbitron tracking-wider flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> {work}</p>
            </div>
            <div className={`font-orbitron font-bold border ${color} px-3 py-1.5 rounded text-xs tracking-wider shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>{award}</div>
        </div>
    </div>
);
const SmallAward = ({ title, award, work }: any) => (
     <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex flex-col justify-between">
         <span className="text-xs text-gray-500 font-orbitron mb-1 block">{work}</span>
         <div className="flex justify-between items-end">
             <span className="text-gray-300 font-rajdhani text-sm font-bold truncate pr-2">{title}</span>
             <span className="text-neon-cyan text-xs font-bold whitespace-nowrap">{award}</span>
         </div>
     </div>
);

const ContactPage: React.FC<{ onNavigate?: (page: PageState) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between pt-28 md:pt-32">
      <div className="flex-1 flex items-center justify-center px-6 text-center w-full max-w-[1400px] mx-auto mb-16">
        <div className="max-w-lg w-full liquid-glass py-8 px-6 md:px-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan" />
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 text-white">传输结束</h2>
          <p className="text-gray-400 font-rajdhani text-sm md:text-base mb-6 max-w-md mx-auto">感谢访问档案。如果您希望启动协作协议或获取特定数据资产，请在下方建立连接。</p>
          <form className="space-y-4 text-left max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="group"><label className="block text-[10px] font-orbitron text-gray-500 mb-1 tracking-widest group-focus-within:text-neon-cyan transition-colors">识别码 (姓名)</label><input type="text" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-neon-cyan/50 focus:bg-black/50 focus:outline-none transition-all" placeholder="您的姓名" /></div>
              <div className="group"><label className="block text-[10px] font-orbitron text-gray-500 mb-1 tracking-widest group-focus-within:text-neon-cyan transition-colors">频率 (邮箱)</label><input type="email" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-neon-cyan/50 focus:bg-black/50 focus:outline-none transition-all" placeholder="email@sector.com" /></div>
              <div className="group"><label className="block text-[10px] font-orbitron text-gray-500 mb-1 tracking-widest group-focus-within:text-neon-cyan transition-colors">数据包 (内容)</label><textarea rows={3} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-neon-cyan/50 focus:bg-black/50 focus:outline-none transition-all" placeholder="留言内容..." /></div>
              <button type="submit" className="w-full bg-neon-cyan text-black text-sm font-bold font-orbitron py-3 rounded-xl hover:bg-white hover:scale-[1.02] transition-all shadow-lg shadow-neon-cyan/20">发送传输</button>
          </form>
          <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-gray-600 font-mono">系统状态：正常 <br/>© 2026 谢东东. 版权所有.</div>
        </div>
      </div>
      <GlowingFooter onNavigate={onNavigate} />
    </div>
  );
};

// ==========================================
// 5.5 HYPERJUMP TRANSITION COMPONENT
// ==========================================

const HyperjumpTransition: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;

  // 32 warp lines radiating at different radial angles
  const lines = Array.from({ length: 32 }).map((_, i) => {
    const angle = i * (360 / 32) + (Math.random() * 8 - 4);
    const length = Math.random() * 180 + 120; // length in px
    const delay = Math.random() * 0.12;
    const duration = 0.45 + Math.random() * 0.25; // timing in seconds
    const isCyan = i % 2 === 0;

    return {
      angle,
      length,
      delay,
      duration,
      color: isCyan 
        ? 'bg-gradient-to-r from-neon-cyan via-white to-transparent shadow-[0_0_12px_#2997ff]' 
        : 'bg-gradient-to-r from-neon-purple via-white to-transparent shadow-[0_0_12px_#a855f7]'
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ backdropFilter: 'blur(4px)' }}
      className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* Central Flash Source */}
      <motion.div 
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: [0.1, 3.0, 4.5], opacity: [0.3, 0.95, 0] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-neon-cyan via-white to-neon-purple blur-3xl opacity-35"
      />

      {/* Warp Light Lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        {lines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ 
              transform: `rotate(${line.angle}deg) translateX(0px) scaleX(0.01)`, 
              opacity: 0 
            }}
            animate={{ 
              transform: `rotate(${line.angle}deg) translateX(${1400}px) scaleX(4.5)`,
              opacity: [0, 1, 0.8, 0] 
            }}
            transition={{ 
              delay: line.delay, 
              duration: line.duration, 
              ease: "easeInOut" 
            }}
            style={{ 
              transformOrigin: "left center",
              width: `${line.length}px`,
              height: "2.5px"
            }}
            className={`absolute rounded-full ${line.color}`}
          />
        ))}
      </div>

      {/* Futuristic Nav Telemetry Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 flex flex-col justify-between p-10 font-mono text-xs tracking-widest text-neon-cyan opacity-40 mix-blend-screen"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
            <span>[ SYSTEM PROTOCOL: JUMP_SEQUENCE ]</span>
          </div>
          <span>GRID COORDINATE SHIFT</span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-neon-purple">
          <span>COSMIC WARP MODULE ENGAGED</span>
          <span>TRANS-DIMENSIONAL DATA PIPELINE STABILIZED</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// 6. MAIN APP
// ==========================================

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>(PageState.COVER);
  const [isJumping, setIsJumping] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  const handleNavigate = (page: PageState) => {
    if (page === currentPage) return;
    
    if (currentPage === PageState.COVER) {
      setIsJumping(true);
      
      // Jump Phase 1: Warp Line Flash triggers. Swap page logic at peak black screen (450ms)
      setTimeout(() => {
        setCurrentPage(page);
        // scroll to top instantly to ensure new page starts at top
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 450);

      // Jump Phase 2: Fade out overlay cleanly (at 1000ms)
      setTimeout(() => {
        setIsJumping(false);
      }, 1050);
    } else {
      // Transition instantly without hyperjump warp lines for all subsequent inner-page routing
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case PageState.COVER: return <CoverPage onEnter={() => handleNavigate(PageState.HOME)} />;
      case PageState.HOME: return <HomePage onNavigate={handleNavigate} />;
      case PageState.WORKS: return <WorksPage />;
      case PageState.CATALOG: return <CatalogPage />;
      case PageState.ABOUT: return <AboutPage />;
      case PageState.CONTACT: return <ContactPage />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };
  return (
    <div className="text-white min-h-screen relative font-sans bg-black/0">
      <HyperjumpTransition isVisible={isJumping} />
      {currentPage !== PageState.COVER && (
        <motion.div 
          id="neon-scroll-progress"
          className="fixed top-0 left-0 right-0 h-1 bg-neon-cyan origin-left z-50 shadow-[0_0_12px_rgba(41,151,255,0.85)]"
          style={{ scaleX }}
        />
      )}
      <HomeVideoBackground active={currentPage === PageState.HOME} />
      {currentPage === PageState.COVER ? (
        <PhosphorBackground />
      ) : (
        <>
          <CosmicBackground currentPage={currentPage} />
          <StarField />
        </>
      )}
      <CustomCursor />
      {currentPage !== PageState.COVER && (<Navigation currentPage={currentPage} onNavigate={handleNavigate} />)}
      <main className="transition-all duration-700 ease-out">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">{renderPage()}</div>
      </main>
      <ChatBot currentPage={currentPage} />
    </div>
  );
};

// ==========================================
// 7. MOUNT
// ==========================================

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
