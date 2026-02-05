// c:/Users/Leorecoa/MM/Projeto-Site-Mansao-Maromba/sections/Map/MapSection.tsx
import React from 'react';
import { Theme } from '../../types';
import { MapPin, Navigation, Clock } from 'lucide-react';

interface MapSectionProps {
  activeTheme: Theme;
}

const MapSection: React.FC<MapSectionProps> = ({ activeTheme }) => {
  return (
    <section id="location" className="py-24 px-6 relative">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 rounded-[3rem] overflow-hidden bg-white/5 border border-white/10">

        {/* Info */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl font-syncopate font-bold mb-8">
            LOCALIZAÇÃO <br />
            <span style={{ color: activeTheme.primary }}>PRIVILEGIADA</span>
          </h2>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-black border border-white/10 shrink-0">
                <MapPin size={24} style={{ color: activeTheme.primary }} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2">Onde Estamos</h4>
                <p className="text-gray-400">Rua Augusta, 506<br />Consolação, São Paulo - SP</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-black border border-white/10 shrink-0">
                <Clock size={24} style={{ color: activeTheme.primary }} />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2">Horário de Funcionamento</h4>
                <p className="text-gray-400">Segunda a Sábado: 10h às 22h<br />Domingo: Fechado</p>
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-flex items-center gap-3 font-bold hover:opacity-80 transition-opacity"
            style={{ color: activeTheme.primary }}
          >
            <Navigation size={18} />
            TRAÇAR ROTA NO MAPA
          </a>
        </div>

        {/* Map Placeholder */}
        <div className="relative min-h-[400px] bg-zinc-900">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.565814762966!2d-46.65287242382088!3d-23.54810966109978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce58363f427571%3A0x4658a562b31955!2sR.%20Augusta%2C%20506%20-%20Consola%C3%A7%C3%A3o%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001304-000!5e0!3m2!1spt-BR!2sbr!4v1708540000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
