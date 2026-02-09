import React from 'react';
import { Theme } from '../../types';

interface AboutSectionProps {
  activeTheme: Theme;
}

const AboutSection: React.FC<AboutSectionProps> = ({ activeTheme }) => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-6xl font-syncopate font-bold mb-8">Sobre Nós</h2>
        <p className="text-xl text-gray-400 max-w-3xl">
          A Mansão Maromba é o depósito digital mais brabo de São Paulo. 
          Experiência premium, combos exclusivos e entrega veloz.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
