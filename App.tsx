
import React, { useState, useEffect } from 'react';
import { PageState } from './types';
import StarField from './components/StarField';
import Navigation from './components/Navigation';
import ChatBot from './components/ChatBot';
import CustomCursor from './components/CustomCursor';
import CosmicBackground from './components/CosmicBackground';
import PhosphorBackground from './components/ui/phosphor-30';
import HomeVideoBackground from './components/HomeVideoBackground';
import FuturisticPageTransition from './components/ui/FuturisticPageTransition';

// Pages
import CoverPage from './components/pages/CoverPage';
import HomePage from './components/pages/HomePage';
import WorksPage from './components/pages/WorksPage';
import CatalogPage from './components/pages/CatalogPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>(PageState.COVER);
  
  // Transition loading states
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [pendingPage, setPendingPage] = useState<PageState | null>(null);

  // High-tech page transition logic with requestAnimationFrame
  const handleNavigate = (page: PageState) => {
    if (page === currentPage) return;
    setPendingPage(page);
    setIsTransitioning(true);
    setProgress(0);
  };

  useEffect(() => {
    if (!isTransitioning || pendingPage === null) return;

    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 1200; // 1.2s optimal loading experience for satisfying sci-fi details

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Cybernetic organic non-linear loading speed
      let visualProgress = rawProgress;
      if (rawProgress < 0.3) {
        // High-speed start (sync sequence init)
        visualProgress = Math.pow(rawProgress / 0.3, 1.2) * 0.35;
      } else if (rawProgress < 0.7) {
        // Slow down in the middle to emulate computing/synthesizing formulas
        const t = (rawProgress - 0.3) / 0.4;
        visualProgress = 0.35 + (1 - Math.pow(1 - t, 2.5)) * 0.45;
      } else {
        // Quick complete step
        const t = (rawProgress - 0.7) / 0.3;
        visualProgress = 0.80 + t * 0.20;
      }

      const currentPercent = Math.floor(visualProgress * 100);
      setProgress(currentPercent);

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // Complete loading: switch page state
        setCurrentPage(pendingPage);
        setTimeout(() => {
          setIsTransitioning(false);
          setPendingPage(null);
        }, 250);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isTransitioning, pendingPage]);

  const renderPage = () => {
    switch (currentPage) {
      case PageState.COVER:
        return <CoverPage onEnter={() => handleNavigate(PageState.HOME)} />;
      case PageState.HOME:
        return <HomePage onNavigate={handleNavigate} />;
      case PageState.WORKS:
        return <WorksPage onNavigate={handleNavigate} />;
      case PageState.CATALOG:
        return <CatalogPage onNavigate={handleNavigate} />;
      case PageState.ABOUT:
        return <AboutPage onNavigate={handleNavigate} />;
      case PageState.CONTACT:
        return <ContactPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="text-white min-h-screen relative font-sans bg-black/0">
      {/* Dynamic Backgrounds */}
      {currentPage === PageState.COVER ? (
        <PhosphorBackground />
      ) : currentPage === PageState.HOME ? (
        <HomeVideoBackground />
      ) : (
        <>
          <CosmicBackground />
          <StarField />
        </>
      )}
      <CustomCursor />
      
      {/* Navigation (Hidden on Cover) */}
      {currentPage !== PageState.COVER && (
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* Futuristic Linear Page Transition Overlay */}
      <FuturisticPageTransition 
        isTransitioning={isTransitioning} 
        progress={progress} 
        pendingPage={pendingPage} 
      />

      {/* Main Content Area */}
      <main className="transition-all duration-700 ease-out">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {renderPage()}
        </div>
      </main>

      {/* AI Assistant */}
      <ChatBot currentPage={currentPage} />
    </div>
  );
};

export default App;
