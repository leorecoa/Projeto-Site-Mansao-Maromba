
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Zap, Crown } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface HeroProps {
  products: Product[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const Hero: React.FC<HeroProps> = ({ products, activeIndex, setActiveIndex }) => {
  const { addToCart } = useCart();
  const activeProduct = products[activeIndex];
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev' | null>(null);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerChange = (newIndex: number, direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    prevIndexRef.current = activeIndex;
    setIsTransitioning(true);
    setShowFlash(true);
    setTransitionDirection(direction);
    setActiveIndex(newIndex);
    
    setTimeout(() => setShowFlash(false), 600);
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionDirection(null);
    }, 1200);
  };

  const handleNext = () => triggerChange((activeIndex + 1) % products.length, 'next');
  const handlePrev = () => triggerChange((activeIndex - 1 + products.length) % products.length, 'prev');

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020202]">
      {/* Background Parallax Text */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none z-0 transition-transform duration-700 ease-out"
        style={{ transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0001})` }}
      >
        <h2 
          className="text-[25vw] font-black font-syncopate whitespace-nowrap"
          style={{ 
            color: activeProduct.theme.primary,
            transition: `transform 1.5s ease-out, filter 1.5s ease-out`,
            transform: `translateX(${isTransitioning ? (activeIndex % 2 === 0 ? '-15%' : '15%') : '0'})`,
            filter: `blur(${isTransitioning ? '10px' : '2px'})`
          }}
        >
          {activeProduct.name.split(' ')[1] || activeProduct.name}
        </h2>
      </div>

      {showFlash && (
        <div 
          className="absolute inset-0 z-[60] pointer-events-none flash-effect"
          style={{ 
            background: `radial-gradient(circle, ${activeProduct.theme.primary}44 0%, transparent 80%)`,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Neon Streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: `translateY(${scrollY * (-0.1 - (i * 0.05))}px)` }}>
            <div className="neon-streak" style={{ top: `${10 + i * 18}%`, left: '-20%', color: activeProduct.theme.primary, animationDelay: `${i * 0.3}s`, animationDuration: `${3 + i * 0.5}s`, height: `${2 + i}px`, filter: `blur(${i}px) brightness(1.5)` }} />
          </div>
        ))}
      </div>

      {/* Vortex Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${activeProduct.theme.primary}22 0%, transparent 75%)`,
          opacity: isTransitioning ? 0.7 : 0.3,
          transform: `scale(${isTransitioning ? 1.3 : 1.1}) translateY(${scrollY * -0.25}px) ${isTransitioning ? `rotateZ(${transitionDirection === 'next' ? '10deg' : '-10deg'})` : 'rotateZ(0deg)'}`,
          transition: `background 1.2s cubic-bezier(0.25, 1, 0.3, 1), opacity 1.2s cubic-bezier(0.25, 1, 0.3, 1), transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)`,
        }}
      />
      
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 relative">
        <div key={activeProduct.id} className="flex flex-col items-start gap-10 order-2 lg:order-1 text-reveal">
          <div className="px-6 py-2.5 rounded-full text-[12px] font-black tracking-[0.5em] uppercase border-2 flex items-center gap-3 backdrop-blur-2xl transition-all duration-[0.9s] animate-border-glow" style={{ borderColor: activeProduct.theme.primary, color: activeProduct.theme.primary, boxShadow: `0 0 40px ${activeProduct.theme.glow}`, transform: isTransitioning ? 'translateY(20px) scale(0.85)' : 'translateY(0) scale(1)' }}>
            <Crown size={18} fill={activeProduct.theme.primary} className="animate-pulse" />
            VIBE MANSÃO MAROMBA
          </div>
          
          <h1 className="text-6xl md:text-[9rem] font-syncopate font-bold leading-[0.8] tracking-tighter">
            {activeProduct.name.split(' ').map((word, i) => (
              <span key={i} className="block last:opacity-50 first:text-white last:italic last:text-[0.7em]" style={{ color: i === 0 ? 'white' : activeProduct.theme.primary, textShadow: `0 0 6px ${activeProduct.theme.primary}, 0 0 15px ${activeProduct.theme.glow}, -1px -1px 3px rgba(0,0,0,0.6), 1px 1px 3px rgba(0,0,0,0.6)`, transition: 'text-shadow 0.5s ease-out, color 0.5s ease-out' }}>{word}</span>
            ))}
          </h1>
          
          <p className="max-w-md text-2xl text-gray-400 font-medium leading-tight border-l-8 pl-10" style={{ borderColor: activeProduct.theme.primary }}>{activeProduct.description}</p>

          <div className="flex flex-wrap items-center gap-6 mt-6">
            <button 
              onClick={() => addToCart(activeProduct)}
              className="group relative px-10 py-5 md:px-14 md:py-7 rounded-3xl font-black text-black transition-all duration-[0.6s] transform hover:scale-110 active:scale-90 overflow-hidden animate-subtle-pulse-glow"
              style={{ backgroundColor: activeProduct.theme.primary, '--glow-color': activeProduct.theme.glow } as any}
            >
              <span className="relative z-10 text-xl tracking-tighter uppercase">Coloque no Carrinho</span>
              <div className="absolute inset-0 bg-white/40 -translate-x-full group-hover:translate-x-0 transition-transform duration-[0.7s] skew-x-[30deg]" />
            </button>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-white font-bold text-lg tracking-widest uppercase">
                <Zap size={24} className="text-yellow-400 fill-yellow-400 animate-bounce" />
                <span>Energia 100%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-[1.5s] ease-out" style={{ width: isTransitioning ? '0%' : '100%', backgroundColor: activeProduct.theme.primary }} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 flex justify-center items-center h-[550px] md:h-[850px] perspective-stage">
          <div className="relative w-full h-full flex items-center justify-center transform-gpu">
            {products.map((product, index) => {
              const isCenter = index === activeIndex;
              const isWasCenter = index === prevIndexRef.current && isTransitioning;
              const isNext = index === (activeIndex + 1) % products.length;
              const isPrev = index === (activeIndex - 1 + products.length) % products.length;

              let translateX = '0%'; let translateZ = '-800px'; let opacity = 0; let scale = 0.3; let rotateY = '0deg'; let zIndex = 0;

              if (isCenter) {
                translateZ = '400px'; opacity = 1; scale = isTransitioning ? 1.4 : 1.15; zIndex = 50;
              } else if (isNext) {
                translateX = '90%'; translateZ = '-200px'; opacity = 0.12; scale = 0.75; rotateY = '-45deg'; zIndex = 20;
              } else if (isPrev) {
                translateX = '-90%'; translateZ = '-200px'; opacity = 0.12; scale = 0.75; rotateY = '45deg'; zIndex = 20;
              }

              return (
                <div key={product.id} className={`absolute bottle-transition flex flex-col items-center ${isTransitioning ? 'motion-blur-effect' : ''} ${isWasCenter ? 'trail-blur' : ''}`} style={{ transform: `translateX(${translateX}) translateZ(${translateZ}) scale(${scale}) rotateY(${rotateY})`, opacity, zIndex, pointerEvents: isCenter ? 'auto' : 'none' }}>
                  <div className={`relative ${isCenter ? (showFlash ? 'animate-surge' : 'animate-float') : ''}`} style={{ color: product.theme.primary }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-[480px] md:h-[720px] object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,1)]" 
                      style={{ 
                        filter: isCenter 
                          ? `drop-shadow(0 0 30px ${product.theme.primary}44) contrast(1.4) brightness(1.2) saturate(1.5)` 
                          : 'grayscale(100%) blur(8px)' 
                      }} 
                    />
                    {isCenter && (
                      <>
                        <div className="absolute -inset-24 -z-10 pulse-glow-vogue rounded-full" style={{ backgroundColor: activeProduct.theme.primary, opacity: showFlash ? 0.6 : 0.4 }} />
                        <img src={product.image} alt="reflection" className="absolute top-[95%] left-0 w-full h-[60%] object-contain opacity-25 scale-y-[-1] blur-2xl translate-y-[-30px] pointer-events-none" />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 lg:px-0 z-[100] pointer-events-none">
             <button onClick={handlePrev} className="w-20 h-20 rounded-full glass-card flex items-center justify-center transition-all duration-300 group hover:scale-105 active:scale-95 pointer-events-auto border-none animate-nav-button-glow" style={{ '--btn-glow-color': activeProduct.theme.glow } as any}>
              <ChevronLeft size={44} className="group-hover:-translate-x-2 transition-transform text-white" />
            </button>
            <button onClick={handleNext} className="w-20 h-20 rounded-full glass-card flex items-center justify-center transition-all duration-300 group hover:scale-105 active:scale-95 pointer-events-auto border-none animate-nav-button-glow" style={{ '--btn-glow-color': activeProduct.theme.glow } as any}>
              <ChevronRight size={44} className="group-hover:translate-x-2 transition-transform text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 flex items-end gap-8 z-30">
        {products.map((_, i) => (
          <button key={i} onClick={() => triggerChange(i, i > activeIndex ? 'next' : 'prev')} className="group flex flex-col items-center gap-4 outline-none">
            <span className={`text-[14px] font-black transition-all duration-700 ${activeIndex === i ? 'opacity-100 -translate-y-2' : 'opacity-0 scale-50'}`} style={{ color: activeProduct.theme.primary, textShadow: `0 0 20px ${activeProduct.theme.primary}` }}>PREMIUM 0{i + 1}</span>
            <div className="transition-all duration-[0.8s] rounded-full" style={{ height: activeIndex === i ? '60px' : '4px', width: '6px', backgroundColor: activeIndex === i ? activeProduct.theme.primary : 'rgba(255,255,255,0.2)', boxShadow: activeIndex === i ? `0 0 35px ${activeProduct.theme.primary}` : 'none' }} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
