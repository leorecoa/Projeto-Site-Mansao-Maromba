
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Zap, Star, ShieldCheck, Crown } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  products: Product[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onAddToCart: (product: Product) => void;
}

const Hero: React.FC<HeroProps> = ({ products, activeIndex, setActiveIndex, onAddToCart }) => {
  const activeProduct = products[activeIndex];
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerChange = (newIndex: number) => {
    if (isTransitioning) return;
    prevIndexRef.current = activeIndex;
    setIsTransitioning(true);
    setShowFlash(true);
    setActiveIndex(newIndex);
    
    // Snappy reset for the flash impact
    setTimeout(() => {
      setShowFlash(false);
    }, 600);

    // End transition slightly earlier for a crisper feel
    setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  };

  const handleNext = () => triggerChange((activeIndex + 1) % products.length);
  const handlePrev = () => triggerChange((activeIndex - 1 + products.length) % products.length);

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020202]">
      
      {/* LAYER 1: Background Parallax Text (Moves slowest) */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none z-0 transition-transform duration-700 ease-out"
        style={{ transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0001})` }}
      >
        <h2 
          className="text-[35vw] font-black font-syncopate whitespace-nowrap"
          style={{ 
            color: activeProduct.theme.primary,
            transition: `transform 1.5s ease-out, filter 1.5s ease-out`, /* Otimizado */
            transform: `translateX(${isTransitioning ? (activeIndex % 2 === 0 ? '-15%' : '15%') : '0'})`,
            filter: `blur(${isTransitioning ? '10px' : '2px'})`
          }}
        >
          {activeProduct.name.split(' ')[1] || activeProduct.name}
        </h2>
      </div>

      {/* DYNAMIC NEON FLASH LAYERS */}
      {showFlash && (
        <div 
          className="absolute inset-0 z-[60] pointer-events-none flash-effect"
          style={{ 
            background: `radial-gradient(circle, ${activeProduct.theme.primary}44 0%, transparent 80%)`,
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* LAYER 2: Background Neon Streaks (Moving at varied speeds for depth) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{ transform: `translateY(${scrollY * (-0.1 - (i * 0.05))}px)` }}
          >
            <div 
              className="neon-streak" 
              style={{ 
                top: `${10 + i * 18}%`, 
                left: '-20%', 
                color: activeProduct.theme.primary, 
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + i * 0.5}s`,
                height: `${2 + i}px`,
                filter: `blur(${i}px) brightness(1.5)`
              }} 
            />
          </div>
        ))}
      </div>

      {/* LAYER 3: Atmosphere / Fog (Moves faster up) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${activeProduct.theme.primary}22 0%, transparent 75%)`,
          opacity: isTransitioning ? 0.7 : 0.3,
          transform: `scale(${isTransitioning ? 1.3 : 1.1}) translateY(${scrollY * -0.25}px)`,
          transition: `background 1.2s ease-in-out, opacity 1.2s ease-in-out, transform 1.2s ease-in-out`, /* Otimizado */
        }}
      />
      
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 relative">
        
        {/* Text Content */}
        <div key={activeProduct.id} className="flex flex-col items-start gap-10 order-2 lg:order-1 text-reveal">
          <div 
            className="px-6 py-2.5 rounded-full text-[12px] font-black tracking-[0.5em] uppercase border-2 flex items-center gap-3 backdrop-blur-2xl transition-all duration-[0.9s] animate-border-glow"
            style={{ 
              borderColor: activeProduct.theme.primary, 
              color: activeProduct.theme.primary, 
              boxShadow: `0 0 40px ${activeProduct.theme.glow}`,
              transform: isTransitioning ? 'translateY(20px) scale(0.85)' : 'translateY(0) scale(1)'
            }}
          >
            <Crown size={18} fill={activeProduct.theme.primary} className="animate-pulse" />
            VIBE MANSÃO MAROMBA
          </div>
          
          <h1 className="text-6xl md:text-[9rem] font-syncopate font-bold leading-[0.8] tracking-tighter"> {/* Removido transition-all */}
            {activeProduct.name.split(' ').map((word, i) => (
              <span key={i} className="block last:opacity-50 first:text-white last:italic last:text-[0.7em]">
                {word}
              </span>
            ))}
          </h1>
          
          <p className="max-w-md text-2xl text-gray-400 font-medium leading-tight border-l-8 pl-10" style={{ borderColor: activeProduct.theme.primary }}> {/* Removido transition-all */}
            {activeProduct.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6"> {/* Ajuste o gap para 6px ou o que for adequado */}
            <button 
              onClick={() => onAddToCart(activeProduct)}
              className="group relative px-10 py-5 md:px-14 md:py-7 rounded-3xl font-black text-black transition-all duration-[0.6s] transform hover:scale-110 active:scale-90 overflow-hidden animate-subtle-pulse-glow animate-surge"
              style={{ 
                backgroundColor: activeProduct.theme.primary, 
                '--glow-color': activeProduct.theme.glow, // Passa a cor do brilho para a animação
              } as React.CSSProperties} // Adiciona asserção de tipo
            >
              <span className="relative z-10 text-xl tracking-tighter">COLOQUE NO CARRINHO</span>
              <div className="absolute inset-0 bg-white/40 -translate-x-full group-hover:translate-x-0 transition-transform duration-[0.7s] skew-x-[30deg]" />
            </button>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-white font-bold text-lg tracking-widest uppercase">
                <Zap size={24} className="text-yellow-400 fill-yellow-400 animate-bounce" />
                <span>Energia 100%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-[1.5s] ease-out" 
                  style={{ width: isTransitioning ? '0%' : '100%', backgroundColor: activeProduct.theme.primary }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desfile Parade Visual */}
        <div className="relative order-1 lg:order-2 flex justify-center items-center h-[550px] md:h-[850px] perspective-stage">
          
          {/* Spotlight Beam */}
          <div 
            className="absolute top-[-10%] w-[120%] h-[120%] opacity-20 pointer-events-none transition-all duration-[1.1s] ease-in-out"
            style={{ 
              background: `conic-gradient(from 180deg at 50% 0%, transparent, ${activeProduct.theme.primary}, transparent)`,
              filter: `blur(${isTransitioning ? '80px' : '40px'})`,
              transform: `rotate(${isTransitioning ? (activeIndex % 2 === 0 ? '5deg' : '-5deg') : '0deg'}) scale(${isTransitioning ? 1.2 : 1})`,
            }}
          />

          {/* Bottles Parade */}
          <div className="relative w-full h-full flex items-center justify-center transform-gpu">
            {products.map((product, index) => {
              const isCenter = index === activeIndex;
              const isWasCenter = index === prevIndexRef.current && isTransitioning;
              const isNext = index === (activeIndex + 1) % products.length;
              const isPrev = index === (activeIndex - 1 + products.length) % products.length;

              let translateX = '0%';
              let translateZ = '-800px';
              let opacity = 0;
              let scale = 0.3;
              let rotateY = '0deg';
              let zIndex = 0;
              let filter = 'blur(40px) grayscale(100%)';

              if (isCenter) {
                translateX = '0%';
                translateZ = '400px';
                opacity = 1;
                scale = isTransitioning ? 1.4 : 1.15; // Ajuste na escala da garrafa ativa
                zIndex = 50;
                // Aumentando contraste, brilho e saturação para maior nitidez e clareza
                filter = isTransitioning ? `blur(2px) brightness(1.6)` : `drop-shadow(0 0 30px ${product.theme.primary}44) contrast(1.4) brightness(1.2) saturate(1.5)`;
              } else if (isNext || (activeIndex === products.length - 1 && index === 0)) {
                translateX = '90%';
                translateZ = '-300px'; // Ajuste na profundidade
                opacity = 0.2;
                scale = 0.65; // Ajuste na escala da garrafa lateral
                rotateY = '-45deg';
                zIndex = 20;
              } else if (isPrev || (activeIndex === 0 && index === products.length - 1)) {
                translateX = '-90%';
                translateZ = '-300px'; // Ajuste na profundidade
                opacity = 0.2;
                scale = 0.65; // Ajuste na escala da garrafa lateral
                rotateY = '45deg';
                zIndex = 20;
              }

              return (
                <div 
                  key={product.id}
                  className={`absolute bottle-transition flex flex-col items-center 
                    ${isTransitioning ? 'motion-blur-effect' : ''} 
                    ${isWasCenter ? 'trail-blur' : ''}
                  `}
                  style={{ 
                    transform: `translateX(${translateX}) translateZ(${translateZ}) scale(${scale}) rotateY(${rotateY})`,
                    opacity,
                    zIndex,
                    filter: !isCenter ? filter : undefined, // Aplica filtro aqui para as garrafas laterais
                    pointerEvents: isCenter ? 'auto' : 'none',
                    transitionDelay: isCenter ? '0.02s' : '0s'
                  }}
                >
                  <div className={`relative ${isCenter ? (showFlash ? 'animate-surge' : 'animate-float') : ''}`} style={{ color: product.theme.primary }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-[480px] md:h-[720px] object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,1)] transition-transform duration-700"
                      style={{ 
                        filter: isCenter 
                          ? `drop-shadow(0 0 30px ${product.theme.primary}44) contrast(1.4) brightness(1.2) saturate(1.5)` // Filtro aprimorado para garrafa ativa
                          : 'none' 
                      }}
                    />
                    
                    {isCenter && (
                      <>
                        {/* Elite Glow Layers */}
                        <div 
                          className="absolute -inset-24 -z-10 pulse-glow-vogue rounded-full"
                          style={{ backgroundColor: activeProduct.theme.primary, opacity: showFlash ? 0.6 : 0.4 }}
                        />
                        <div 
                          className="absolute -inset-12 -z-10 blur-[40px] opacity-50 rounded-full border-4 animate-pulse"
                          style={{ borderColor: activeProduct.theme.primary }}
                        />
                        
                        {/* Cinematic Reflection */}
                        <img 
                          src={product.image} 
                          alt="reflection"
                          className="absolute top-[95%] left-0 w-full h-[60%] object-contain opacity-25 scale-y-[-1] blur-2xl translate-y-[-30px] pointer-events-none"
                        />
                      </>
                    )}

                    {/* Rastro Neon Sutil na Garrafa que SAI */}
                    {isWasCenter && (
                      <div 
                        className="absolute inset-0 -z-10 blur-3xl opacity-40 rounded-full transition-opacity duration-500"
                        style={{ backgroundColor: product.theme.primary }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 lg:px-0 z-[100] pointer-events-none">
             <button 
              onClick={handlePrev}
              className="w-20 h-20 rounded-full glass-card flex items-center justify-center transition-[background-color,box-shadow,transform] duration-300 ease-out group hover:scale-105 active:scale-95 pointer-events-auto border-none animate-nav-button-glow"
              style={{
                '--btn-glow-color': activeProduct.theme.glow,
              } as React.CSSProperties}
            >
              <ChevronLeft size={44} className="group-hover:-translate-x-2 transition-transform duration-300 ease-out text-white" />
            </button>
            <button 
              onClick={handleNext}
              className="w-20 h-20 rounded-full glass-card flex items-center justify-center transition-[background-color,box-shadow,transform] duration-300 ease-out group hover:scale-105 active:scale-95 pointer-events-auto border-none animate-nav-button-glow"
              style={{
                '--btn-glow-color': activeProduct.theme.glow,
              } as React.CSSProperties}
            >
              <ChevronRight size={44} className="group-hover:translate-x-2 transition-transform duration-300 ease-out text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Ticks */}
      <div className="absolute bottom-16 flex items-end gap-8 z-30">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => triggerChange(i)}
            className="group flex flex-col items-center gap-4 outline-none"
          >
            <span 
              className={`text-[14px] font-black transition-all duration-700 ${activeIndex === i ? 'opacity-100 -translate-y-2' : 'opacity-0 scale-50'}`} 
              style={{ color: activeProduct.theme.primary, textShadow: `0 0 20px ${activeProduct.theme.primary}` }}
            >
              PREMIUM 0{i + 1}
            </span>
            <div
              className="transition-all duration-[0.8s] rounded-full" /* Removido 'transition-all' */
              style={{ 
                height: activeIndex === i ? '60px' : '4px',
                width: '6px',
                backgroundColor: activeIndex === i ? activeProduct.theme.primary : 'rgba(255,255,255,0.2)',
                boxShadow: activeIndex === i ? `0 0 35px ${activeProduct.theme.primary}` : 'none',
                transform: activeIndex === i ? 'scaleX(1.5)' : 'scaleX(1)',
                transition: `height 0.8s, width 0.8s, background-color 0.8s, box-shadow 0.8s, transform 0.8s`, /* Otimizado */
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;