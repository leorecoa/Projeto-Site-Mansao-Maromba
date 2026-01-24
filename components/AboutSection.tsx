
import React from 'react';
import { Theme } from '../types';

interface AboutSectionProps {
  activeTheme: Theme;
}

const AboutSection: React.FC<AboutSectionProps> = ({ activeTheme }) => {
  return (
    <section id="about" className="py-24 px-6 bg-[#050505] relative overflow-hidden">
      {/* Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-black opacity-[0.02] whitespace-nowrap select-none pointer-events-none font-syncopate">
        MAROMBA MANSAO MAROMBA MANSAO
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="relative group">
          <div className="rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            <img 
              src="https://picsum.photos/800/600?random=10" 
              alt="Nightlife vibe" 
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div 
            className="absolute -bottom-6 -right-6 glass-card p-8 rounded-2xl max-w-[250px]"
            style={{ borderLeft: `4px solid ${activeTheme.primary}` }}
          >
            <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">
              Direto do coração de São Paulo para o seu copo.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] mb-4 block" style={{ color: activeTheme.primary }}>Institucional</span>
            <h2 className="text-5xl md:text-7xl font-syncopate font-bold leading-tight">MUITO MAIS QUE UM DEPÓSITO.</h2>
          </div>
          
          <div className="space-y-6 text-gray-400 text-lg">
            <p>
              A <strong className="text-white">Mansão Maromba</strong> é um depósito digital de bebidas focado em combos exclusivos, energia máxima e experiência diferenciada. 
            </p>
            <p>
              Nascemos da necessidade de oferecer algo além do básico. Nossos combos são pensados para elevar o nível da sua noite, com ingredientes premium e visual marcante.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-2xl">
              <span className="text-3xl font-bold block mb-1">24/7</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">Pronto pro Rolê</span>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <span className="text-3xl font-bold block mb-1">TOP 1</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">Combos SP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
