import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Zap, Crown } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../store/useCart';

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
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerChange = (newIndex: number, moveDirection: 'next' | 'prev') => {
    if (isTransitioning) return;
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

  const backgroundText = activeProduct.name.split(' ').pop()?.toUpperCase() || '';

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#010101]">
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

      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center z-10 relative">
        <div className="flex flex-col items-start gap-4 sm:gap-8 order-2 lg:order-1 relative z-30 lg:-translate-x-24">
          <div
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[11px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase border-2 flex items-center gap-2 sm:gap-3 backdrop-blur-3xl transition-all duration-1000"
            style={{
              borderColor: `${activeProduct.theme.primary}aa`,
              color: activeProduct.theme.primary,
              boxShadow: `0 0 20px ${activeProduct.theme.primary}44`
            }}
          >
            <Crown size={14} className="sm:w-4 sm:h-4" fill={activeProduct.theme.primary} />
            VIBE MANSÃO MAROMBA
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[6.5rem] font-syncopate font-bold leading-[0.85] tracking-tighter">
            {activeProduct.name.split(' ').map((word, i) => (
              <span
                key={i}
                className="block"
                style={{
                  color: i !== 0 ? activeProduct.theme.primary : 'white',
                  transition: 'color 0.5s ease-out'
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p className="max-w-md text-base sm:text-xl text-gray-400 font-medium leading-relaxed border-l-[4px] sm:border-l-[6px] pl-6 sm:pl-10" style={{ borderColor: activeProduct.theme.primary }}>
            {activeProduct.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-10 mt-4 sm:mt-6 w-full">
            <button
              onClick={() => addToCart(activeProduct)}
              className="group relative px-8 sm:px-14 py-5 sm:py-7 rounded-2xl sm:rounded-3xl font-black text-black transition-all duration-500 transform hover:scale-110 active:scale-95 overflow-hidden shadow-2xl w-full sm:w-auto touch-manipulation"
              style={{ backgroundColor: activeProduct.theme.primary }}
            >
              <span className="relative z-10 text-base sm:text-xl tracking-tighter uppercase">GARANTIR COMBO</span>
            </button>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 flex justify-center items-center h-[400px] sm:h-[550px] md:h-[800px] perspective-stage lg:translate-x-24">
          <div className="relative w-full h-full flex items-center justify-center transform-gpu">
            {products.map((product, index) => {
              const isCenter = index === activeIndex;
              const isNext = index === (activeIndex + 1) % products.length;
              const isPrev = index === (activeIndex - 1 + products.length) % products.length;

              let tx = '0%'; let tz = '-800px'; let op = 0; let sc = 0.4; let ry = '0deg'; let zi = 0;

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
                  className="absolute transition-all duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] transform-gpu"
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
                    className={`h-[350px] sm:h-[480px] md:h-[700px] object-contain ${isCenter ? 'animate-float' : ''}`}
                  />
                  {isCenter && (
                    <div className="absolute inset-0 -z-10 pulse-glow-vogue rounded-full" style={{ backgroundColor: product.theme.primary }} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-4 lg:-mx-20 z-[100] pointer-events-none">
            <button onClick={handlePrev} className="w-14 h-14 sm:w-20 sm:h-20 rounded-full glass-card flex items-center justify-center pointer-events-auto transition-all hover:scale-110 active:scale-90 touch-manipulation" style={{ border: `2px solid ${activeProduct.theme.primary}44` }}>
              <ChevronLeft size={28} className="sm:w-10 sm:h-10" style={{ color: activeProduct.theme.primary }} />
            </button>
            <button onClick={handleNext} className="w-14 h-14 sm:w-20 sm:h-20 rounded-full glass-card flex items-center justify-center pointer-events-auto transition-all hover:scale-110 active:scale-90 touch-manipulation" style={{ border: `2px solid ${activeProduct.theme.primary}44` }}>
              <ChevronRight size={28} className="sm:w-10 sm:h-10" style={{ color: activeProduct.theme.primary }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
