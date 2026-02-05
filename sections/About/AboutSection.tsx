import React from 'react';
import { Theme } from '../../types';
import { Crown, Trophy, Users } from 'lucide-react';

interface AboutSectionProps {
  activeTheme: Theme;
}

const AboutSection: React.FC<AboutSectionProps> = ({ activeTheme }) => {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest">
            <Crown size={14} style={{ color: activeTheme.primary }} />
            <span>Desde 2020</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-syncopate font-bold leading-tight">
            A CASA DOS <br />
            <span style={{ color: activeTheme.primary }}>CAMPEÕES</span>
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed">
            A Mansão Maromba não é apenas um depósito, é um estilo de vida.
            Nascemos da necessidade de trazer energia de qualidade para quem vive intensamente.
            Nossos kits são pensados para elevar o nível do seu rolê, treino ou resenha.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <Trophy size={32} className="mb-4" style={{ color: activeTheme.primary }} />
              <h4 className="font-bold text-xl mb-1">Qualidade</h4>
              <p className="text-sm text-gray-500">Produtos selecionados e originais.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <Users size={32} className="mb-4" style={{ color: activeTheme.primary }} />
              <h4 className="font-bold text-xl mb-1">Comunidade</h4>
              <p className="text-sm text-gray-500">Milhares de clientes satisfeitos.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 relative">
            {/* Placeholder para imagem institucional */}
            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
              <span className="text-zinc-700 font-syncopate font-bold text-2xl">MANSÃO MAROMBA</span>
            </div>
            <img
              src="https://i.imgur.com/2CMQ6GJ.png"
              alt="Mansão Maromba Lifestyle"
              className="absolute inset-0 w-full h-full object-cover opacity-50 hover:opacity-80 transition-opacity duration-700"
            />
          </div>

          {/* Decorative Glow */}
          <div
            className="absolute -inset-4 -z-10 blur-3xl opacity-30 rounded-full"
            style={{ backgroundColor: activeTheme.primary }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
