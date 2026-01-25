
import React from 'react';
import { Theme } from '../../types';
import { Instagram, MapPin, Phone, MessageCircle } from 'lucide-react';

interface FooterProps {
  activeTheme: Theme;
}

const Footer: React.FC<FooterProps> = ({ activeTheme }) => {
  return (
    <footer className="pt-24 pb-12 px-6 bg-black border-t border-white/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img 
                src="https://i.imgur.com/2CMQ6GJ.png" 
                alt="Mansão Maromba Logo" 
                className="w-12 h-12 object-contain transition-all duration-300"
                style={{ 
                  filter: `contrast(1.2) brightness(1.1) saturate(1.3) drop-shadow(0 0 10px ${activeTheme.glow})` 
                }}
              />
              <span className="font-syncopate font-bold text-xl tracking-tighter">
                MANSÃO MAROMBA
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              O depósito digital mais brabo de São Paulo. Experiência premium, combos exclusivos e entrega veloz.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors" style={{ color: activeTheme.primary }}>
                <Instagram size={20} />
              </a>
              <a href="#" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors" style={{ color: activeTheme.primary }}>
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-syncopate font-bold mb-6 text-sm tracking-widest uppercase">Explore</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Combos</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#location" className="hover:text-white transition-colors">Localização</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-syncopate font-bold mb-6 text-sm tracking-widest uppercase">Contato</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: activeTheme.primary }} />
                <span>R. Augusta, 506, São Paulo</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0" style={{ color: activeTheme.primary }} />
                <a href="tel:11998516263" className="hover:text-white transition-colors">(11) 99851-6263</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-syncopate font-bold mb-6 text-sm tracking-widest uppercase">Horários</h4>
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-bold">Segunda à Sábado</p>
              <p className="text-lg font-bold mb-4">10h00 às 22h00</p>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-bold">Domingo</p>
              <p className="text-lg font-bold">Fechado</p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">
            © 2024 MANSÃO MAROMBA DISTRIBUIDORA. TODOS OS DIREITOS RESERVADOS.
          </p>
          <div className="flex gap-8 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-gray-400">Termos</a>
            <a href="#" className="hover:text-gray-400">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
