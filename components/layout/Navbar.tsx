
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Theme } from '../../types';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  theme: Theme;
}

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-500 glass-card">
      <div className="flex items-center gap-2">
        <img 
          src="https://i.imgur.com/2CMQ6GJ.png" 
          alt="Mansão Maromba Logo" 
          className="w-12 h-12 object-contain transition-all duration-300"
          style={{ 
            filter: `contrast(1.2) brightness(1.1) saturate(1.3) drop-shadow(0 0 10px ${theme.glow})` 
          }}
        />
        <span className="font-syncopate font-bold text-lg tracking-tighter hidden md:block">
          MANSÃO MAROMBA
        </span>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-6 font-semibold uppercase text-xs tracking-widest">
          <a href="#hero" className="hover:opacity-70 transition-opacity">Home</a>
          <a href="#products" className="hover:opacity-70 transition-opacity">Combos</a>
          <a href="#about" className="hover:opacity-70 transition-opacity">Sobre</a>
          <a href="#location" className="hover:opacity-70 transition-opacity">Local</a>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 rounded-full transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.primary}` }}
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: theme.primary }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
