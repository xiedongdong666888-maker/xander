import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageState } from '../../types';
import { Loader2, Terminal, Shield, Cpu, RefreshCw, Radio } from 'lucide-react';

interface FuturisticPageTransitionProps {
  isTransitioning: boolean;
  progress: number;
  pendingPage: PageState | null;
}

const FuturisticPageTransition: React.FC<FuturisticPageTransitionProps> = ({
  isTransitioning,
  progress,
  pendingPage,
}) => {
  const [terminalLog, setTerminalLog] = useState<string>('INITIATING SYSTEM HANDSHAKE...');
  const [activeStage, setActiveStage] = useState<number>(0);

  // High-tech sci-fi status messages customized based on the target page
  const getPageMessage = (page: PageState | null): string[] => {
    switch (page) {
      case PageState.HOME:
        return [
          'ESTABLISHING LINK TO COGNITIVE CORE...',
          'CALIBRATING NEBULA ALIGNMENT MATRIX...',
          'RENDERING INTERACTIVE BRAND PORTAL...',
          'SYSTEM READY - DIRECTING TO EXPLORE'
        ];
      case PageState.CATALOG:
        return [
          'DECRYPTING PŌNT FORMULA DATABASES...',
          'ANALYZING ACTIVE PEPTIDE RECEPTORS...',
          'OPTIMIZING COLLAGEN MOLECULAR STRUCTURES...',
          'SYNTHESIS COMPLETE - OPENING CATALOG'
        ];
      case PageState.WORKS:
        return [
          'ACCESSING ARCHIVAL DESIGN STORAGE...',
          'RETRIEVING HIGH-FIDELITY VECTOR DATA...',
          'COMPILING CREATIVE SHOWCASE MODULES...',
          'INDEXING WORKS - DISPLAY ONLINE'
        ];
      case PageState.ABOUT:
        return [
          'SYNCHRONIZING PROFILE RECORD ENTRIES...',
          'FETCHING CREATOR BIOGRAPHY LOGS...',
          'INITIALIZING SECTOR-7 BRAND SUMMARY...',
          'BIOMETRICS VERIFIED - RESUME ONLINE'
        ];
      case PageState.CONTACT:
        return [
          'BOOTING SECURE COMMS FREQUENCY TRANSCEIVER...',
          'VERIFYING ANTENNA GRID WAVEFORMS...',
          'OPENING ENCRYPTED INPUT PORTS...',
          'COMMS PIPELINE ESTABLISHED'
        ];
      case PageState.COVER:
        return [
          'TERMINATING DEEP DRIFT INTERFACE...',
          'RETRACTING COGNITIVE SENSORY ARRAYS...',
          'PURGING CACHED VECTORS...',
          'WELCOME BACK TO SECTOR COLD START'
        ];
      default:
        return [
          'CONNECTING TO SYSTEM BUS...',
          'RUNNING HARDWARE DIAGNOSTICS...',
          'ALLOCATING FRAME BUFFER CHUNKS...',
          'TRANSITION SEQUENCE ENGAGED'
        ];
    }
  };

  const messages = getPageMessage(pendingPage);

  // Map progress to terminal log entries and stages
  useEffect(() => {
    if (!isTransitioning) {
      setActiveStage(0);
      setTerminalLog('INITIATING SYSTEM HANDSHAKE...');
      return;
    }

    if (progress < 25) {
      setTerminalLog(messages[0] || 'CONNECTING...');
      setActiveStage(1);
    } else if (progress < 55) {
      setTerminalLog(messages[1] || 'CALIBRATING...');
      setActiveStage(2);
    } else if (progress < 80) {
      setTerminalLog(messages[2] || 'SYNTHESIZING...');
      setActiveStage(3);
    } else {
      setTerminalLog(messages[3] || 'COMPLETING SEQUENCE...');
      setActiveStage(4);
    }
  }, [progress, isTransitioning, pendingPage]);

  // Format percentage with leading zeros (e.g. 042% or 100%)
  const formatPercent = (val: number): string => {
    if (val >= 100) return '100%';
    if (val < 10) return `00${val}%`;
    return `0${val}%`;
  };

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div id="page-loader-overlay" className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-auto overflow-hidden">
          {/* Futuristic subtle matrix grid & blur background */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#030014]/85 backdrop-blur-[12px]"
          >
            {/* Ambient circular cyan/purple glowing nebulas */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/15 blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-purple/15 blur-[120px] animate-pulse-slow-reverse" />
            
            {/* Tech Scan Line Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-1/2 w-full animate-[bounce_8s_ease-in-out_infinite] pointer-events-none border-y border-white/[0.01]" />
          </motion.div>

          {/* Core Linear Progress Bar pinned to very top of the browser viewport */}
          <div className="fixed top-0 left-0 w-full h-[4px] bg-white/5 z-[110] overflow-hidden">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan shadow-[0_0_12px_rgba(41,151,255,0.8),_0_0_24px_rgba(191,90,242,0.6)] relative"
            >
              {/* Sweeping bright head flare on the bar */}
              <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-white blur-sm transform translate-x-1" />
            </motion.div>
          </div>

          {/* Central Holographic Sci-Fi HUD Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="relative w-11/12 max-w-[500px] border border-white/10 bg-[#07051a]/70 backdrop-blur-md p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),_inset_0_0_24px_rgba(41,151,255,0.05)] overflow-hidden z-10"
          >
            {/* Tech Corner Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan/40 rounded-tl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan/40 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan/40 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan/40 rounded-br" />

            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-ping" />
                  <span className="font-orbitron text-[11px] font-bold text-neon-cyan tracking-widest uppercase">
                    SYS PORTAL ACTIVE
                  </span>
                </div>
                <span className="font-rajdhani text-[10px] text-gray-500 font-bold tracking-widest">
                  SECTOR_07_CORE
                </span>
              </div>

              {/* Huge digital percentage indicator and rotating spinner */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-rajdhani text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">
                    TRANSMISSION PROGRESS
                  </div>
                  <div className="font-orbitron text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-neon-cyan tracking-wider">
                    {formatPercent(progress)}
                  </div>
                </div>
                
                {/* Custom glowing reactor-style loader */}
                <div className="relative flex items-center justify-center w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-neon-cyan/30"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-1 rounded-full border border-neon-purple"
                  />
                  <div className="z-10">
                    <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />
                  </div>
                </div>
              </div>

              {/* Progress bar inside HUD card */}
              <div className="w-full bg-white/5 h-[6px] rounded-full overflow-hidden p-[1px] border border-white/5">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                />
              </div>

              {/* Scrolling Terminal Output Log */}
              <div className="bg-black/50 border border-white/5 p-3 rounded-lg flex items-start gap-2.5 min-h-[56px] relative overflow-hidden">
                {/* Horizontal scanning light beam inside terminal */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-cyan/20 animate-pulse" />
                <Terminal className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0 animate-pulse" />
                <div className="flex-1 font-mono text-[10px] leading-relaxed text-gray-300">
                  <div className="text-gray-500 font-semibold mb-0.5">root@astralynx:~$ load_portal</div>
                  <span className="text-neon-cyan/90 font-medium animate-[pulse_1.5s_infinite]">
                    &gt; {terminalLog}
                  </span>
                </div>
              </div>

              {/* Interactive micro-indicators list */}
              <div className="grid grid-cols-5 gap-2 pt-2 border-t border-white/5 text-center font-rajdhani font-bold text-[9px] tracking-wider">
                <div className="flex flex-col items-center gap-1">
                  <Cpu className={`w-3.5 h-3.5 transition-colors duration-300 ${activeStage >= 1 ? 'text-neon-cyan animate-pulse' : 'text-gray-600'}`} />
                  <span className={activeStage >= 1 ? 'text-white' : 'text-gray-600'}>CONNECT</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className={`w-3.5 h-3.5 transition-colors duration-300 ${activeStage >= 2 ? 'text-neon-purple animate-pulse' : 'text-gray-600'}`} />
                  <span className={activeStage >= 2 ? 'text-white' : 'text-gray-600'}>AUTH</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Radio className={`w-3.5 h-3.5 transition-colors duration-300 ${activeStage >= 3 ? 'text-neon-cyan animate-pulse' : 'text-gray-600'}`} />
                  <span className={activeStage >= 3 ? 'text-white' : 'text-gray-600'}>SYNC</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className={`w-3.5 h-3.5 transition-colors duration-300 ${activeStage >= 4 ? 'text-neon-purple animate-pulse' : 'text-gray-600'}`} />
                  <span className={activeStage >= 4 ? 'text-white' : 'text-gray-600'}>COMPILING</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${progress >= 100 ? 'bg-green-400 shadow-[0_0_8px_#4ade80] animate-ping' : 'bg-gray-700'}`} />
                  <span className={progress >= 100 ? 'text-green-400' : 'text-gray-600'}>READY</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FuturisticPageTransition;
