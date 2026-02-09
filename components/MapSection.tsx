
import React from 'react';
import { MapPin, Phone, Instagram, Clock, Navigation } from 'lucide-react';
import { Theme } from '../types';

interface MapSectionProps {
  activeTheme: Theme;
}

const MapSection: React.FC<MapSectionProps> = ({ activeTheme }) => {
  return (
    <section id="location" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] mb-4 block" style={{ color: activeTheme.primary }}>Onde estamos</span>
              <h2 className="text-4xl font-syncopate font-bold mb-6">ESTAMOS NA PISTA.</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-white/5 h-fit" style={{ color: activeTheme.primary }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1 uppercase tracking-wider">Endereço</h4>
                  <p className="text-gray-400">R. Augusta, 506 – Consolação, São Paulo – SP, 01304-001</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-white/5 h-fit" style={{ color: activeTheme.primary }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1 uppercase tracking-wider">Telefone</h4>
                  <a href="tel:11998516263" className="text-gray-400 hover:text-white transition-colors">(11) 99851-6263</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-white/5 h-fit" style={{ color: activeTheme.primary }}>
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1 uppercase tracking-wider">Funcionamento</h4>
                  <p className="text-gray-400">Status: <span className="text-red-500 font-bold">Fechado</span> · Abre às 10:00</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-white/5 h-fit" style={{ color: activeTheme.primary }}>
                  <Instagram size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1 uppercase tracking-wider">Social</h4>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">@mansaomaromba</a>
                </div>
              </div>
            </div>

            <button 
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-80"
              style={{ backgroundColor: activeTheme.primary, color: '#000' }}
            >
              <Navigation size={20} fill="#000" />
              Traçar Rota (Plus Code C8XX+CM)
            </button>
          </div>

          <div className="lg:col-span-8 h-[500px] rounded-3xl overflow-hidden glass-card p-2 border border-white/5">
             <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.40871900115!2d-46.64966772467007!3d-23.553761078805726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59ad45353591%3A0xe54790089f2e308b!2sR.%20Augusta%2C%20506%20-%20Consola%C3%A7%C3%A3o%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001304-001!5e0!3m2!1spt-BR!2sbr!4v1715891234567!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MapSection;
