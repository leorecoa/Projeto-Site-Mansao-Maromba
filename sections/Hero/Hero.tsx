
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Zap, Crown } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext'; // Importa useCart

interface HeroProps {
  products: Product[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  // onAddToCart: (product: Product) => void; // Removido
}

const Hero: React.FC<HeroProps> = ({ products, activeIndex, setActiveIndex }) => {
  const { addToCart } = useCart(); // Usa o hook useCart
  const activeProduct = products[activeIndex];
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerChange = (newIndex: number, moveDirection: 'next' | 'prev') => {
    if (isTransitioning) return;
    prevIndexRef.current = activeIndex;
    setIsTransitioning(true);
    setShowFlash(true);
    setDirection(moveDirection);
    setActiveIndex(newIndex);
    
    setTimeout(() => setShowFlash(false), 800);
    setTimeout(() => {
      setIsTransitioning(false);
      setDirection(null);
    }, 1100); 
  };

  const handleNext = () => triggerChange((activeIndex + 1) % products.length, 'next');
  const handlePrev = () => triggerChange((activeIndex - 1 + products.length) % products.length, 'prev');

  // Pega apenas a palavra principal (ex: "Tigrinho") para o fundo
  const backgroundText = activeProduct.name.split(' ').pop()?.toUpperCase() || '';

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#010101]">
      
      {/* TEXTO DE FUNDO: Escala refinada para 12vw para máxima concisão e centralização */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none z-0"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <h2 
          className="text-[12vw] font-black font-syncopate whitespace-nowrap leading-none tracking-[-0.08em] transition-all duration-1000 ease-out flex items-center justify-center h-full"
          style={{ 
            color: activeProduct.theme.primary,
            filter: isTransitioning ? 'blur(30px)' : 'blur(4px)',
            transform: `scale(${isTransitioning ? 1.05 : 1}) translateX(${isTransitioning ? (direction === 'next' ? '-2%' : '2%') : '0'})`
          }}
        >
          {backgroundText}
        </h2>
      </div>

      {/* AMBIENTE: Brilho de Cor */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1200"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${activeProduct.theme.primary}25 0%, transparent 70%)`,
          opacity: isTransitioning ? 0.9 : 0.45
        }}
      />

      {/* NEON STREAKS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="neon-streak" 
            style={{ 
              top: `${15 + i * 14}%`, 
              color: activeProduct.theme.primary, 
              animationDelay: `${i * 0.7}s`,
              transform: `translateY(${scrollY * (-0.03 * (i + 1))}px)`
            }} 
          />
        ))}
      </div>

      {/* IMPACTO FLASH */}
      {showFlash && (
        <div 
          className="absolute inset-0 z-[60] pointer-events-none flash-effect"
          style={{ background: `radial-gradient(circle, ${activeProduct.theme.primary}40 0%, transparent 80%)` }}
        />
      )}

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 relative">
        
        {/* CONTEÚDO TEXTUAL */}
        <div key={activeProduct.id} className="flex flex-col items-start gap-8 order-2 lg:order-1 text-reveal relative z-30 lg:-translate-x-24">
          <div 
            className="px-6 py-2.5 rounded-full text-[11px] font-black tracking-[0.5em] uppercase border-2 flex items-center gap-3 backdrop-blur-3xl transition-all duration-1000 animate-neon-pulse"
            style={{ 
              borderColor: `${activeProduct.theme.primary}aa`, 
              color: activeProduct.theme.primary,
              textShadow: `0 0 10px ${activeProduct.theme.primary}, 0 0 20px ${activeProduct.theme.primary}44`,
              boxShadow: `0 0 20px ${activeProduct.theme.primary}44, inset 0 0 10px ${activeProduct.theme.primary}22`,
              '--neon-color': activeProduct.theme.primary,
              '--neon-color-alpha': `${activeProduct.theme.primary}33`
            } as React.CSSProperties}
          >
            <Crown size={16} fill={activeProduct.theme.primary} className="animate-pulse" />
            VIBE MANSÃO MAROMBA
          </div>
          
          <h1 className="text-5xl md:text-[6.5rem] font-syncopate font-bold leading-[0.85] tracking-tighter transition-all duration-700">
            {activeProduct.name.split(' ').map((word, i) => (
              <span 
                key={i} 
                className="block first:text-white"
                style={{
                  color: i !== 0 ? activeProduct.theme.primary : 'white',
                  textShadow: i !== 0 ? `0 0 45px ${activeProduct.theme.glow}` : 'none',
                  filter: isTransitioning ? 'blur(4px)' : 'none',
                  transition: 'filter 0.5s ease-out'
                }}
              >
                {word}
              </span>
            ))}
          </h1>
          
          <p className="max-w-md text-xl text-gray-400 font-medium leading-relaxed border-l-[6px] pl-10" style={{ borderColor: activeProduct.theme.primary }}>
            {activeProduct.description}
          </p>

          <div className="flex flex-wrap items-center gap-10 mt-6">
            <button 
              onClick={() => addToCart(activeProduct)}
              className="group relative px-14 py-7 rounded-3xl font-black text-black transition-all duration-500 transform hover:scale-110 active:scale-95 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]"
              style={{ backgroundColor: activeProduct.theme.primary }}
            >
              <span className="relative z-10 text-xl tracking-tighter uppercase">GARANTIR COMBO</span>
              <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-0 transition-transform duration-600 skew-x-[25deg]" />
            </button>
            
            <div className="flex items-center gap-5 text-white/70 font-bold uppercase text-[10px] tracking-[0.3em]">
              <div className="w-14 h-14 rounded-2xl border border-white/5 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                <Zap size={24} className="text-yellow-400 fill-yellow-400 animate-bounce" />
              </div>
              <span className="leading-tight">Entrega<br/>Relâmpago</span>
            </div>
          </div>
        </div>

        {/* VISUAL 3D: O Desfile */}
        <div className="relative order-1 lg:order-2 flex justify-center items-center h-[550px] md:h-[800px] perspective-stage lg:translate-x-24">
          <div className="relative w-full h-full flex items-center justify-center transform-gpu">
            {products.map((product, index) => {
              const isCenter = index === activeIndex;
              const isNext = index === (activeIndex + 1) % products.length;
              const isPrev = index === (activeIndex - 1 + products.length) % products.length;

              let tx = '0%';
              let tz = '-800px';
              let op = 0;
              let sc = 0.4;
              let ry = '0deg';
              let zi = 0;

              if (isCenter) {
                tx = '0%'; tz = '350px'; op = 1; sc = isTransitioning ? 1.2 : 1.1; zi = 50;
              } else if (isNext) {
                tx = '85%'; tz = '-400px'; op = 0.25; sc = 0.6; ry = '-50deg'; zi = 10;
              } else if (isPrev) {
                tx = '-45%'; tz = '-600px'; op = 0.15; sc = 0.5; ry = '50deg'; zi = 10;
              }

              return (
                <div 
                  key={product.id}
                  className={`absolute transition-all duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] transform-gpu ${isTransitioning ? 'motion-blur-effect' : ''}`}
                  style={{ 
                    transform: `translateX(${tx}) translateZ(${tz}) scale(${sc}) rotateY(${ry})`,
                    opacity: op,
                    zIndex: zi,
                    filter: isCenter ? `drop-shadow(0 0 60px ${product.theme.primary}40)` : 'blur(15px) grayscale(90%)'
                  }}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className={`h-[480px] md:h-[700px] object-contain transition-all duration-700 ${isCenter ? 'animate-float cursor-pointer hover:scale-[1.04]' : ''}`}
                    style={{
                      filter: isCenter 
                        ? 'contrast(1.4) brightness(1.1) saturate(1.4) drop-shadow(0 20px 40px rgba(0,0,0,0.6))' 
                        : 'none'
                    }}
                  />
                  {isCenter && (
                    <>
                      <div 
                        className="absolute inset-0 -z-10 pulse-glow-vogue rounded-full"
                        style={{ backgroundColor: product.theme.primary }}
                      />
                      <img 
                        src={product.image} 
                        alt="reflexo"
                        className="absolute top-[98%] left-0 w-full h-[50%] object-contain opacity-20 scale-y-[-1] blur-3xl pointer-events-none"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* CONTROLES: Botões Refinados */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 lg:-mx-20 z-[100] pointer-events-none">
             <button 
              onClick={handlePrev}
              className="w-20 h-20 rounded-full glass-card flex items-center justify-center group hover:scale-110 active:scale-90 pointer-events-auto transition-all duration-500 border-2 overflow-hidden"
              style={{
                borderColor: `${activeProduct.theme.primary}44`,
                boxShadow: `0 0 0px ${activeProduct.theme.primary}00`,
                '--neon-color': activeProduct.theme.primary,
              } as React.CSSProperties}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: activeProduct.theme.primary }}
              />
              
              <ChevronLeft 
                size={40} 
                className="group-hover:-translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-10" 
                style={{ 
                  color: activeProduct.theme.primary,
                  filter: `drop-shadow(0 0 8px ${activeProduct.theme.primary}aa)`
                }}
              />

              <div 
                className="absolute inset-1 rounded-full border border-white/5 group-hover:border-white/20 transition-colors pointer-events-none"
              />
            </button>

            <button 
              onClick={handleNext}
              className="w-20 h-20 rounded-full glass-card flex items-center justify-center group hover:scale-110 active:scale-90 pointer-events-auto transition-all duration-500 border-2 overflow-hidden"
              style={{
                borderColor: `${activeProduct.theme.primary}44`,
                boxShadow: `0 0 0px ${activeProduct.theme.primary}00`,
                '--neon-color': activeProduct.theme.primary,
              } as React.CSSProperties}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: activeProduct.theme.primary }}
              />

              <ChevronRight 
                size={40} 
                className="group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-10" 
                style={{ 
                  color: activeProduct.theme.primary,
                  filter: `drop-shadow(0 0 8px ${activeProduct.theme.primary}aa)`
                }}
              />

              <div 
                className="absolute inset-1 rounded-full border border-white/5 group-hover:border-white/20 transition-colors pointer-events-none"
              />
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER PROGRESS */}
      <div className="absolute bottom-16 flex gap-10 z-20">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => triggerChange(i, i > activeIndex ? 'next' : 'prev')}
            className="relative flex flex-col items-center group cursor-pointer"
          >
            <div 
              className={`transition-all duration-1000 rounded-full ${activeIndex === i ? 'h-[70px] w-[6px]' : 'h-1.5 w-1.5 opacity-20 hover:opacity-100'}`}
              style={{ 
                backgroundColor: activeProduct.theme.primary,
                boxShadow: activeIndex === i ? `0 0 30px ${activeProduct.theme.primary}` : 'none'
              }}
            />
            <span className={`absolute -bottom-8 text-[10px] font-black tracking-tighter transition-all duration-700 ${activeIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              0{i + 1}
            </span>
          </button>
        ))}
      </div>

      <style>{`
        button.group:hover {
          box-shadow: 0 0 40px -10px var(--neon-color) !important;
          border-color: var(--neon-color) !important;
        }
      `}</style>
    </section>
  );
};

export default Hero;
