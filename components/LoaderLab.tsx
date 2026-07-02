import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Play, Settings, Cpu, Database, Compass, Terminal, Sliders, Layers, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';
import ClassicLoader from './ui/loader';
import ModifiedClassicLoader from './ui/demo';

// Types for the loaders
enum LoaderStyle {
  CLASSIC = 'classic',
  MODIFIED = 'modified',
  QUANTUM = 'quantum',
  CYBER_MATRIX = 'cyber_matrix',
  HOLOGRAPHIC = 'holographic',
}

interface LoaderTheme {
  name: string;
  primary: string;
  secondary: string;
  shadow: string;
  text: string;
  glow: string;
}

const THEMES: LoaderTheme[] = [
  { name: 'Neon Cyan', primary: '#00f0ff', secondary: '#7000ff', shadow: 'rgba(0, 240, 255, 0.4)', text: 'text-[#00f0ff]', glow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]' },
  { name: 'Hyper Pink', primary: '#ff007f', secondary: '#00f0ff', shadow: 'rgba(255, 0, 127, 0.4)', text: 'text-[#ff007f]', glow: 'shadow-[0_0_20px_rgba(255,0,127,0.3)]' },
  { name: 'Quantum Amber', primary: '#ffaa00', secondary: '#ff0055', shadow: 'rgba(255, 170, 0, 0.4)', text: 'text-[#ffaa00]', glow: 'shadow-[0_0_20px_rgba(255,170,0,0.3)]' },
  { name: 'Emerald Grid', primary: '#00ffaa', secondary: '#00aaff', shadow: 'rgba(0, 255, 170, 0.4)', text: 'text-[#00ffaa]', glow: 'shadow-[0_0_20px_rgba(0,255,170,0.3)]' },
];

export const LoaderLab: React.FC = () => {
  const [activeStyle, setActiveStyle] = useState<LoaderStyle>(LoaderStyle.QUANTUM);
  const [activeTheme, setActiveTheme] = useState<LoaderTheme>(THEMES[0]);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [simulatedProgress, setSimulatedProgress] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'LOADER WORKSPACE OPERATIONAL',
    'AWAITING TRIGGER TO SIMULATE COMPILER...'
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Handle simulation simulation
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulatedProgress(0);
    setTerminalLogs([
      'INITIATING SEQUENCE SHIFT...',
      'ALLOCATING GPU CORES FOR VECTOR COMPRESSION...',
      'CONNECTING TO ENCRYPTED NODES...'
    ]);

    let current = 0;
    const interval = setInterval(() => {
      // Dynamic increment dependent on speed multiplier
      const step = Math.floor(Math.random() * 8) + 2;
      current = Math.min(current + step, 100);
      setSimulatedProgress(current);

      // Log updates at certain percentages
      if (current > 15 && current < 30 && !terminalLogs.includes('NODE 01: HANDSHAKE SUCCESSFUL')) {
        setTerminalLogs(prev => [...prev, 'NODE 01: HANDSHAKE SUCCESSFUL [200 OK]', 'COMPILING FRAGMENT BUFFER...']);
      } else if (current > 45 && current < 60 && !terminalLogs.includes('SYNTHESIZING MATRIX COEFFICIENTS...')) {
        setTerminalLogs(prev => [...prev, 'SYNTHESIZING MATRIX COEFFICIENTS...', 'APPLYING CHRONO PHYSICS WRAPPER...']);
      } else if (current > 75 && current < 90 && !terminalLogs.includes('INTEGRATING COMPONENT SECTOR-7...')) {
        setTerminalLogs(prev => [...prev, 'INTEGRATING COMPONENT SECTOR-7...', 'VERIFYING STABILIZER INTEGRITY...']);
      }

      if (current >= 100) {
        clearInterval(interval);
        setIsSimulating(false);
        setTerminalLogs(prev => [...prev, 'TRANSMISSION COMPLETE.', 'SYSTEM STATE: READY.']);
      }
    }, 150 / speedMultiplier);
  };

  const getStyleLabel = (style: LoaderStyle) => {
    switch (style) {
      case LoaderStyle.CLASSIC: return '经典加载器 (Classic)';
      case LoaderStyle.MODIFIED: return '极简双弧 (Modified Classic)';
      case LoaderStyle.QUANTUM: return '量子核心反应堆 (Quantum Reactor)';
      case LoaderStyle.CYBER_MATRIX: return '数据矩阵霓虹雨 (Cyber Matrix)';
      case LoaderStyle.HOLOGRAPHIC: return '全息多维 HUD 环 (Holographic HUD)';
    }
  };

  return (
    <div className="w-full bg-[#04020f]/80 rounded-3xl p-6 md:p-10 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] text-white font-sans overflow-hidden relative">
      {/* Background glow grids */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Lab Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="font-orbitron text-xs text-neon-cyan tracking-widest uppercase font-bold">Loader Lab V1.2</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-orbitron tracking-wide bg-gradient-to-r from-white via-gray-300 to-neon-cyan bg-clip-text text-transparent">
            交互式加载动效实验室
          </h2>
          <p className="text-gray-400 font-rajdhani text-sm mt-1 max-w-2xl">
            专为前沿数字化界面打造的交互载入特效。您可以实时微调运转速率、色域配色，在左侧直接交互预览核心光影算法。
          </p>
        </div>

        <button
          onClick={startSimulation}
          disabled={isSimulating}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-bold font-orbitron tracking-wider text-xs transition-all duration-300 interactive
            ${isSimulating 
              ? 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed' 
              : 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
            }
          `}
        >
          <Play size={14} className={isSimulating ? 'animate-spin' : ''} />
          {isSimulating ? `模拟编译中 (${simulatedProgress}%)` : '启动编译模拟'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: LIVE ACTION PREVIEW WINDOW */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="w-full aspect-[4/3] bg-black/60 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center p-8 shadow-inner">
            
            {/* Tech Corner brackets inside window */}
            <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/20" />
            <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/20" />
            <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/20" />
            <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/20" />

            {/* Screen static grid */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Simulated HUD label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-orbitron text-gray-400 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              LIVE_RENDER_VIEW_01
            </div>

            {/* Active Loader Render Area */}
            <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStyle}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex flex-col items-center justify-center"
                >
                  {/* Render loaders based on style */}
                  {activeStyle === LoaderStyle.CLASSIC && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-8 bg-white/5 rounded-2xl border border-white/5 shadow-lg relative group">
                        {/* Classic Loader with customized primary color using inline override */}
                        <div 
                          className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-t-transparent"
                          style={{ 
                            borderColor: `${activeTheme.primary}20`, 
                            borderTopColor: activeTheme.primary,
                            animationDuration: `${1 / speedMultiplier}s` 
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-500">Standard Circle Spinner</span>
                    </div>
                  )}

                  {activeStyle === LoaderStyle.MODIFIED && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-8 bg-white/5 rounded-2xl border border-white/5 shadow-lg">
                        {/* Modified Classic Loader */}
                        <div 
                          className="h-12 w-12 animate-spin rounded-full border-2 border-t-2 border-b-2"
                          style={{ 
                            borderColor: 'transparent',
                            borderTopColor: activeTheme.primary,
                            borderBottomColor: activeTheme.primary,
                            animationDuration: `${1 / speedMultiplier}s` 
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-500">Minimal Double-Arc Loop</span>
                    </div>
                  )}

                  {activeStyle === LoaderStyle.QUANTUM && (
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      {/* Magnetic Orbit Ring 1 */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 6 / speedMultiplier, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border border-dashed border-white/10"
                      />

                      {/* Magnetic Orbit Ring 2 */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 4 / speedMultiplier, ease: 'linear' }}
                        className="absolute inset-4 rounded-full border border-white/5"
                      />

                      {/* Quantum charging outer ring */}
                      <svg className="absolute inset-2 w-40 h-40 transform -rotate-95">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="transparent"
                          stroke={activeTheme.primary}
                          strokeWidth="2.5"
                          strokeDasharray="440"
                          strokeDashoffset={440 - (440 * (isSimulating ? simulatedProgress : 68)) / 100}
                          className="transition-all duration-300"
                          style={{ filter: `drop-shadow(0 0 8px ${activeTheme.primary})` }}
                        />
                      </svg>

                      {/* Core Glowing Reactor Particle */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.15, 1],
                          boxShadow: [`0 0 20px ${activeTheme.shadow}`, `0 0 45px ${activeTheme.primary}`, `0 0 20px ${activeTheme.shadow}`]
                        }}
                        transition={{ repeat: Infinity, duration: 2 / speedMultiplier, ease: 'easeInOut' }}
                        className="w-16 h-16 rounded-full flex flex-col items-center justify-center border text-center z-10"
                        style={{ backgroundColor: `${activeTheme.primary}08`, borderColor: activeTheme.primary }}
                      >
                        <Cpu 
                          className="w-6 h-6" 
                          style={{ color: activeTheme.primary }} 
                        />
                      </motion.div>

                      {/* Satellite orbiting point */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2.2 / speedMultiplier, ease: 'linear' }}
                        className="absolute inset-2"
                      >
                        <div 
                          className="w-3 h-3 rounded-full absolute top-0 left-1/2 -translate-x-1/2"
                          style={{ backgroundColor: activeTheme.primary, boxShadow: `0 0 10px ${activeTheme.primary}` }}
                        />
                      </motion.div>
                    </div>
                  )}

                  {activeStyle === LoaderStyle.CYBER_MATRIX && (
                    <div className="flex flex-col items-center gap-6 w-72">
                      <div className="w-full bg-black/80 rounded-xl p-4 border border-white/10 font-mono text-[11px] text-green-400 min-h-[120px] relative overflow-hidden flex flex-col justify-between">
                        {/* Decryption status indicator */}
                        <div className="flex justify-between border-b border-white/10 pb-1.5 mb-1.5">
                          <span className="text-[9px] text-gray-500 uppercase font-bold font-orbitron">DECRYPT_STREAM</span>
                          <span className="animate-pulse font-bold" style={{ color: activeTheme.primary }}>● SECURE_LINK</span>
                        </div>
                        
                        {/* Matrix falling code simulation blocks */}
                        <div className="space-y-1 my-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">SESSION_SEED:</span>
                            <span className="text-white">0x8F9A27D...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">CIPHER_CYCLES:</span>
                            <motion.span 
                              animate={{ opacity: [1, 0.4, 1] }} 
                              transition={{ duration: 1, repeat: Infinity }}
                              className="font-bold"
                              style={{ color: activeTheme.primary }}
                            >
                              {(1024 * speedMultiplier * (isSimulating ? simulatedProgress : 35)).toFixed(0)} Hz
                            </motion.span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">AUTH_PERCENT:</span>
                            <span className="text-white font-bold">{isSimulating ? simulatedProgress : 68}%</span>
                          </div>
                        </div>

                        {/* Animated loading matrix cells */}
                        <div className="flex gap-1.5 pt-2 border-t border-white/10">
                          {Array.from({ length: 12 }).map((_, idx) => {
                            const isCellActive = (isSimulating ? simulatedProgress : 68) > (idx * 8.3);
                            return (
                              <motion.div
                                key={idx}
                                className="h-2.5 flex-1 rounded-sm transition-all duration-300"
                                style={{ 
                                  backgroundColor: isCellActive ? activeTheme.primary : 'rgba(255,255,255,0.05)',
                                  boxShadow: isCellActive ? `0 0 6px ${activeTheme.primary}` : 'none'
                                }}
                                animate={isCellActive ? { 
                                  opacity: [1, 0.5, 1] 
                                } : {}}
                                transition={{ repeat: Infinity, duration: 1 + idx * 0.1, ease: 'linear' }}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-500">Binary compilation block grid</span>
                    </div>
                  )}

                  {activeStyle === LoaderStyle.HOLOGRAPHIC && (
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      {/* Outer detailed tech ticker */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 12 / speedMultiplier, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border border-white/5 flex items-center justify-center"
                      >
                        {/* Small tick markers inside the ring */}
                        <div className="absolute inset-2 rounded-full border border-dashed border-white/20" />
                        <div className="absolute top-0 w-1 h-3 bg-neon-cyan/80" />
                        <div className="absolute bottom-0 w-1 h-3 bg-neon-cyan/80" />
                      </motion.div>

                      {/* Opposing direction rotating middle arc */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 5 / speedMultiplier, ease: 'linear' }}
                        className="absolute inset-6 rounded-full border-2 border-transparent"
                        style={{ borderTopColor: activeTheme.primary, borderBottomColor: activeTheme.primary }}
                      />

                      {/* Glowing center dynamic sphere */}
                      <div className="absolute inset-12 rounded-full bg-black/60 border border-white/10 flex flex-col items-center justify-center p-2 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] relative overflow-hidden group">
                        
                        {/* Circular progress bar inside */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle
                            cx="47"
                            cy="47"
                            r="36"
                            fill="transparent"
                            stroke={activeTheme.secondary}
                            strokeWidth="1.5"
                            strokeDasharray="226"
                            strokeDashoffset={226 - (226 * (isSimulating ? simulatedProgress : 68)) / 100}
                            className="transition-all duration-300"
                          />
                        </svg>

                        <Compass className="w-5 h-5 text-gray-400 mb-0.5 animate-pulse" />
                        <span className="font-orbitron text-xs font-bold leading-none" style={{ color: activeTheme.primary }}>
                          {isSimulating ? simulatedProgress : 68}%
                        </span>
                        <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">SECTOR_X</span>
                      </div>

                      {/* Pulse circle expander animation */}
                      <motion.div
                        animate={{ scale: [0.75, 1.35, 0.75], opacity: [0.1, 0.4, 0.1] }}
                        transition={{ repeat: Infinity, duration: 3 / speedMultiplier, ease: 'easeInOut' }}
                        className="absolute inset-10 rounded-full border"
                        style={{ borderColor: activeTheme.primary }}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom HUD bar showing current stats */}
            <div className="w-full flex justify-between items-center text-[10px] font-mono text-gray-500 border-t border-white/10 pt-4 mt-auto">
              <div className="flex gap-4">
                <span>STYLE: <span className="text-white font-bold">{activeStyle.toUpperCase()}</span></span>
                <span>SPEED: <span className="text-neon-cyan font-bold">x{speedMultiplier.toFixed(1)}</span></span>
              </div>
              <span>CORES: 32_OCTA</span>
            </div>
          </div>

          {/* Interactive controls comparative grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Customizer Panel 1: Knobs & Theme Select */}
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 relative">
              <div className="flex items-center gap-2 mb-4">
                <Sliders size={14} className="text-neon-cyan" />
                <h4 className="text-xs font-orbitron font-bold tracking-widest text-gray-300 uppercase">基础物理微调 / PHY_TUNING</h4>
              </div>

              {/* Speed Slider */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">运转速率 (Speed Mult)</span>
                  <span className="text-neon-cyan font-bold">{speedMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={speedMultiplier}
                  onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-neon-cyan cursor-pointer bg-white/10 h-1 rounded-lg"
                />
                <div className="flex justify-between text-[9px] text-gray-600 font-mono">
                  <span>0.2x (静谧)</span>
                  <span>1.0x (标准)</span>
                  <span>3.0x (超频)</span>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-gray-400 block">主题配色 (Color Spectrum)</span>
                <div className="grid grid-cols-4 gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => setActiveTheme(theme)}
                      className={`h-8 rounded-lg border flex items-center justify-center transition-all duration-300 interactive
                        ${activeTheme.name === theme.name 
                          ? 'bg-white/10 border-white/30 text-white shadow-md scale-105' 
                          : 'bg-black/20 border-white/5 text-gray-500 hover:text-white hover:border-white/15'
                        }
                      `}
                    >
                      <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: theme.primary }} />
                      <span className="text-[9px] font-bold font-rajdhani hidden sm:inline">{theme.name.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customizer Panel 2: Classic vs Modified Classic Comparison */}
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} className="text-neon-cyan" />
                <h4 className="text-xs font-orbitron font-bold tracking-widest text-gray-300 uppercase">基础加载器对比 / CLASSIC_CMP</h4>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal mb-4 font-rajdhani">
                下面是按你要求的两个标准加载器（ClassicLoader 与 ModifiedClassicLoader）排版渲染。点击下方按钮可在上方的主预览窗口直接测试其平滑度和阻尼感：
              </p>

              <div className="flex gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                <div 
                  className="flex-1 flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all"
                  onClick={() => setActiveStyle(LoaderStyle.CLASSIC)}
                >
                  <ClassicLoader />
                  <span className="text-[9px] font-mono text-gray-400 font-bold mt-1">Classic</span>
                </div>

                <div className="w-[1px] bg-white/10" />

                <div 
                  className="flex-1 flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all"
                  onClick={() => setActiveStyle(LoaderStyle.MODIFIED)}
                >
                  <ModifiedClassicLoader />
                  <span className="text-[9px] font-mono text-gray-400 font-bold mt-1">Modified</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: LAB SIDEBAR / LOG DETAILS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Style Selector List */}
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <Sparkles size={14} className="text-neon-cyan animate-pulse" />
              <h4 className="text-xs font-orbitron font-bold tracking-widest text-gray-300 uppercase">动画风格列表 / STYLE_DECK</h4>
            </div>

            <div className="space-y-2.5">
              {Object.values(LoaderStyle).map((style) => (
                <button
                  key={style}
                  onClick={() => setActiveStyle(style)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all duration-300 interactive
                    ${activeStyle === style 
                      ? 'bg-neon-cyan/5 border-neon-cyan/40 text-white shadow-[0_0_15px_rgba(0,240,255,0.06)] scale-[1.02]' 
                      : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/15 hover:text-white'
                    }
                  `}
                >
                  {/* Leading icon for style */}
                  <div className={`p-1.5 rounded-lg border transition-colors ${activeStyle === style ? 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                    {style === LoaderStyle.CLASSIC && <RefreshCw size={13} />}
                    {style === LoaderStyle.MODIFIED && <Cpu size={13} />}
                    {style === LoaderStyle.QUANTUM && <Database size={13} />}
                    {style === LoaderStyle.CYBER_MATRIX && <Terminal size={13} />}
                    {style === LoaderStyle.HOLOGRAPHIC && <Compass size={13} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-bold font-orbitron tracking-wider">{getStyleLabel(style)}</span>
                    <span className="block text-[10px] text-gray-500 font-rajdhani mt-0.5 truncate">
                      {style === LoaderStyle.CLASSIC && '最经典质朴的单色旋转圆形进度组件'}
                      {style === LoaderStyle.MODIFIED && '在经典款上做加法，上下双环对称线性旋转'}
                      {style === LoaderStyle.QUANTUM && '基于 Canvas 环形与 CPU 核心脉冲，带物理粒子环绕'}
                      {style === LoaderStyle.CYBER_MATRIX && '二进制数字雨变体，以代码解码与表格矩阵流的形式递进'}
                      {style === LoaderStyle.HOLOGRAPHIC && '高科全息星盘多重叠套，反向旋转，并配备高精密微度量器'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scrolling Sci-Fi Terminal Output */}
          <div className="p-5 bg-black/90 rounded-2xl border border-white/10 font-mono text-[10px] text-gray-300 flex-1 flex flex-col justify-between min-h-[180px] shadow-2xl relative">
            <div className="absolute top-2 right-4 flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>

            <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 mb-3 text-gray-500 text-[9px] uppercase font-bold tracking-widest">
              <Terminal size={11} className="text-neon-cyan" />
              <span>实时系统编译日志 / SYSTEM_COMPILER_LOGGER</span>
            </div>

            {/* Log Stream */}
            <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[140px] custom-scrollbar mb-4 pr-1 text-[9px]">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className={`${log.startsWith('NODE') ? 'text-neon-cyan' : log.startsWith('COMPILING') ? 'text-neon-purple' : 'text-gray-300'}`}>
                    &gt; {log}
                  </span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick status bar */}
            <div className="flex justify-between items-center border-t border-white/10 pt-2 text-[9px] text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" /> STABLE
              </span>
              <span>BUFFER_OK: 100%</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoaderLab;
