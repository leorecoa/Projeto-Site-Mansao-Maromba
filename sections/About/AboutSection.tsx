
import React from 'react';
import { Theme } from '../../types';

interface AboutSectionProps {
  activeTheme: Theme;
}

const AboutSection: React.FC<AboutSectionProps> = ({ activeTheme }) => {
  return (
    <section id="about" className="py-24 px-6 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
          <img src="https://picsum.photos/800/600?random=10" alt="Vibe" className="w-full h-[500px] object-cover" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: activeTheme.primary }}>Institucional</span>
          <h2 className="text-5xl md:text-7xl font-syncopate font-bold mb-8 leading-tight">MUITO MAIS QUE UM DEPÓSITO.</h2>
          <p className="text-gray-400 text-lg mb-8">Nascemos da necessidade de oferecer algo além do básico. Nossos combos são pensados para elevar o nível da sua noite.</p>
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
