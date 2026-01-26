
import React from 'react';
import { MapPin, Phone, Instagram, Clock, Navigation } from 'lucide-react';
import { Theme } from '../../types';

interface MapSectionProps {
  activeTheme: Theme;
}

const MapSection: React.FC<MapSectionProps> = ({ activeTheme }) => {
  return (
    <section id="location" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <h2 className="text-4xl font-syncopate font-bold mb-6">ESTAMOS NA PISTA.</h2>
          <div className="space-y-4">
            <div className="flex gap-4"><MapPin style={{ color: activeTheme.primary }} /><span>R. Augusta, 506 – SP</span></div>
            <div className="flex gap-4"><Phone style={{ color: activeTheme.primary }} /><a href="tel:11998516263">(11) 99851-6263</a></div>
            <div className="flex gap-4"><Instagram style={{ color: activeTheme.primary }} /><span>@mansaomaromba</span></div>
          </div>
          <button className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2" style={{ backgroundColor: activeTheme.primary, color: '#000' }}>
            <Navigation size={20} /> TRAÇAR ROTA
          </button>
        </div>
        <div className="lg:col-span-8 h-[500px] rounded-3xl overflow-hidden glass-card p-2 border border-white/5">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.40871900115!2d-46.649667!3d-23.553761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59ad45353591%3A0xe54790089f2e308b!2sR.%20Augusta%2C%20506!5e0!3m2!1spt-BR!2sbr!4v1715891234567" width="100%" height="100%" style={{ border: 0, filter: 'invert(90%)' }}></iframe>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
