import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Zap, Crown } from 'lucide-react';
import { Product, Theme } from '../../types';
import { useCart } from '@/app/context/CartContext';

interface HeroProps {
  products: Product[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const Hero: React.FC<HeroProps> = ({ products, activeIndex, setActiveIndex }) => {
  const { addToCart } = useCart();
  
  // Verificação segura para evitar erros se products estiver vazio
  if (products.length === 0) {
    return (
      <section className="relative min-h-screen w-full flex items-center justify-center bg-[#010101]">
        <p className="text-white">Nenhum produto disponível</p>
      </section>
    );
  }
  
  const activeProduct = products[activeIndex];
  
  // Fallback para theme se não existir
  const defaultTheme: Theme = {
    primary: '#facc15',
    secondary: '#111827',
    glow: 'rgba(250, 204, 21, 0.4)',
    text: '#FFFFFF',
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
  };
  
  const theme: Theme = activeProduct?.theme || defaultTheme;
  
  // Usar image_url do tipo Product
  const imageUrl = activeProduct?.image_url || '';
  
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
    if (isTransitioning || newIndex < 0 || newIndex >= products.length) return;
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
  const backgroundText = activeProduct?.name?.split(' ').pop()?.toUpperCase() || '';

  // Função helper para acessar propriedades de theme com fallback seguro
  const getThemeColor = (property: keyof Theme, fallback: string = '#ffffff') => {
    return theme?.[property] || fallback;
  };

  // Função para obter imagem do produto com fallback
  const getProductImage = (product: Product): string => {
    return product.image_url || '';
  };

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#010101]">
      
      {/* TEXTO DE FUNDO */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none z-0"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <h2 
          className="text-[12vw] font-black font-syncopate whitespace-nowrap leading-none tracking-[-0.08em] transition-all duration-1000 ease-out flex items-center justify-center h-full"
          style={{ 
            color: getThemeColor('primary'),
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
          background: `radial-gradient(circle at 50% 50%, ${getThemeColor('primary')}25 0%, transparent 70%)`,
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
              color: getThemeColor('primary'), 
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
          style={{ background: `radial-gradient(circle, ${getThemeColor('primary')}40 0%, transparent 80%)` }}
        />
      )}

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 relative">
        
        {/* CONTEÚDO TEXTUAL */}
        <div key={activeProduct?.id || 'default'} className="flex flex-col items-start gap-8 order-2 lg:order-1 text-reveal relative z-30 lg:-translate-x-24">
          <div 
            className="px-6 py-2.5 rounded-full text-[11px] font-black tracking-[0.5em] uppercase border-2 flex items-center gap-3 backdrop-blur-3xl transition-all duration-1000 animate-neon-pulse"
            style={{ 
              borderColor: `${getThemeColor('primary')}aa`, 
              color: getThemeColor('primary'),
              textShadow: `0 0 10px ${getThemeColor('primary')}, 0 0 20px ${getThemeColor('primary')}44`,
              boxShadow: `0 0 20px ${getThemeColor('primary')}44, inset 0 0 10px ${getThemeColor('primary')}22`,
              '--neon-color': getThemeColor('primary')
            } as React.CSSProperties}
          >
            <Crown size={16} fill={getThemeColor('primary')} className="animate-pulse" />
            VIBE MANSÃO MAROMBA
          </div>
          
          <h1 className="text-5xl md:text-[6.5rem] font-syncopate font-bold leading-[0.85] tracking-tighter transition-all duration-700">
            {activeProduct?.name?.split(' ').map((word, i) => (
              <span 
                key={i} 
                className="block first:text-white"
                style={{
                  color: i !== 0 ? getThemeColor('primary') : 'white',
                  textShadow: i !== 0 ? `0 0 45px ${getThemeColor('glow')}` : 'none',
                  filter: isTransitioning ? 'blur(4px)' : 'none',
                  transition: 'filter 0.5s ease-out'
                }}
              >
                {word}
              </span>
            )) || <span className="text-white">Produto</span>}
          </h1>
          
          <p className="max-w-md text-xl text-gray-400 font-medium leading-relaxed border-l-[6px] pl-10" style={{ borderColor: getThemeColor('primary') }}>
            {activeProduct?.description || 'Descrição do produto'}
          </p>

          <div className="flex flex-wrap items-center gap-10 mt-6">
            <button 
              onClick={() => activeProduct && addToCart(activeProduct)}
              disabled={!activeProduct}
              className="group relative px-14 py-7 rounded-3xl font-black text-black transition-all duration-500 transform hover:scale-110 active:scale-95 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: getThemeColor('primary') }}
            >
              <span className="relative z-10 text-xl tracking-tighter uppercase">
                {activeProduct ? 'GARANTIR COMBO' : 'PRODUTO INDISPONÍVEL'}
              </span>
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

              const productTheme = product.theme || theme;
              const productImage = getProductImage(product);

              return (
                <div 
                  key={product.id}
                  className={`absolute transition-all duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] transform-gpu ${isTransitioning ? 'motion-blur-effect' : ''}`}
                  style={{ 
                    transform: `translateX(${tx}) translateZ(${tz}) scale(${sc}) rotateY(${ry})`,
                    opacity: op,
                    zIndex: zi,
                    filter: isCenter ? `drop-shadow(0 0 60px ${productTheme.primary}40)` : 'blur(15px) grayscale(90%)'
                  }}
                >
                  {productImage ? (
                    <img 
                      src={productImage} 
                      alt={product.name}
                      className={`h-[480px] md:h-[700px] object-contain transition-all duration-700 ${isCenter ? 'animate-float cursor-pointer hover:scale-[1.04]' : ''}`}
                      style={{
                        filter: isCenter 
                          ? 'contrast(1.4) brightness(1.1) saturate(1.4) drop-shadow(0 20px 40px rgba(0,0,0,0.6))' 
                          : 'none'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=Produto+Mansão+Maromba';
                      }}
                    />
                  ) : (
                    <div className="h-[480px] md:h-[700px] w-[300px] bg-white/5 flex items-center justify-center rounded-xl">
                      <span className="text-gray-500">Imagem não disponível</span>
                    </div>
                  )}
                  {isCenter && productImage && (
                    <>
                      <div 
                        className="absolute inset-0 -z-10 pulse-glow-vogue rounded-full"
                        style={{ backgroundColor: productTheme.primary }}
                      />
                      <img 
                        src={productImage} 
                        alt="reflexo"
                        className="absolute top-[98%] left-0 w-full h-[50%] object-contain opacity-20 scale-y-[-1] blur-3xl pointer-events-none"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
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
                borderColor: `${getThemeColor('primary')}44`,
                boxShadow: `0 0 0px ${getThemeColor('primary')}00`,
                '--neon-color': getThemeColor('primary'),
              } as React.CSSProperties}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: getThemeColor('primary') }}
              />
              
              <ChevronLeft 
                size={40} 
                className="group-hover:-translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-10" 
                style={{ 
                  color: getThemeColor('primary'),
                  filter: `drop-shadow(0 0 8px ${getThemeColor('primary')}aa)`
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
                borderColor: `${getThemeColor('primary')}44`,
                boxShadow: `0 0 0px ${getThemeColor('primary')}00`,
                '--neon-color': getThemeColor('primary'),
              } as React.CSSProperties}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: getThemeColor('primary') }}
              />

              <ChevronRight 
                size={40} 
                className="group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-10" 
                style={{ 
                  color: getThemeColor('primary'),
                  filter: `drop-shadow(0 0 8px ${getThemeColor('primary')}aa)`
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
            disabled={isTransitioning}
          >
            <div 
              className={`transition-all duration-1000 rounded-full ${activeIndex === i ? 'h-[70px] w-[6px]' : 'h-1.5 w-1.5 opacity-20 hover:opacity-100'}`}
              style={{ 
                backgroundColor: getThemeColor('primary'),
                boxShadow: activeIndex === i ? `0 0 30px ${getThemeColor('primary')}` : 'none'
              }}
            />
            <span className={`absolute -bottom-8 text-[10px] font-black tracking-tighter transition-all duration-700 ${activeIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              0{i + 1}
            </span>
          </button>
        ))}
      </div>

      <style>{`
        button.group:hover:not(:disabled) {
          box-shadow: 0 0 40px -10px var(--neon-color) !important;
          border-color: var(--neon-color) !important;
        }
        
        .neon-streak {
          position: absolute;
          left: 0;
          width: 200%;
          height: 2px;
          background: linear-gradient(90deg, transparent, currentColor, transparent);
          opacity: 0.3;
          animation: streak 6s linear infinite;
        }
        
        .flash-effect {
          animation: flash 0.8s ease-out;
        }
        
        @keyframes streak {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
        
        @keyframes flash {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .perspective-stage {
          perspective: 1200px;
        }
        
        .transform-gpu {
          transform-style: preserve-3d;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .pulse-glow-vogue {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        
        .motion-blur-effect {
          filter: blur(5px);
          transition: filter 1.1s ease-out;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.1; transform: scale(0.9); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        
        .animate-neon-pulse {
          animation: neonPulse 2s ease-in-out infinite;
        }
        
        @keyframes neonPulse {
          0%, 100% { 
            box-shadow: 0 0 20px var(--neon-color)44, inset 0 0 10px var(--neon-color)22;
            border-color: var(--neon-color)aa;
          }
          50% { 
            box-shadow: 0 0 40px var(--neon-color)77, inset 0 0 20px var(--neon-color)44;
            border-color: var(--neon-color);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;