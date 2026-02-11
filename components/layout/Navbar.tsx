import React, { useEffect, useState } from 'react';
import { ShoppingCart, LogOut, User, Package } from 'lucide-react';
import { Theme } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '../../hooks/useNavigation';

interface NavbarProps {
  theme: Theme;
}

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center transition-all duration-500 glass-card safe-area-top">
      <div className="flex items-center gap-2">
        <img 
          src="https://i.imgur.com/2CMQ6GJ.png" 
          alt="Mansão Maromba Logo" 
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-all duration-300"
          style={{ filter: `contrast(1.2) brightness(1.1) saturate(1.3) drop-shadow(0 0 10px ${theme.glow})` }}
        />
        <span className="font-syncopate font-bold text-sm sm:text-lg tracking-tighter hidden sm:block">
          MANSÃO MAROMBA
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-8">
        <div className="hidden md:flex gap-6 font-semibold uppercase text-xs tracking-widest">
          <button onClick={() => window.location.hash = 'hero'} className="hover:opacity-70 transition-opacity">Home</button>
          <button onClick={() => window.location.hash = 'products'} className="hover:opacity-70 transition-opacity">Combos</button>
          <button onClick={() => window.location.hash = 'about'} className="hover:opacity-70 transition-opacity">Sobre</button>
          <button onClick={() => window.location.hash = 'location'} className="hover:opacity-70 transition-opacity">Local</button>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          aria-label="Carrinho"
          className="relative p-2 rounded-full transition-transform hover:scale-110 active:scale-95 touch-manipulation"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.primary}` }}
        >
          <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
          {cartCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: theme.primary }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {!loading && user && (
          <>
            <button
              onClick={() => navigate('/orders')}
              className="p-2 rounded-full transition-transform hover:scale-110 active:scale-95 hover:bg-blue-500/20 border border-blue-400/20 touch-manipulation"
              title="Meus Pedidos"
              aria-label="Meus Pedidos"
            >
              <Package size={18} className="text-blue-400 sm:w-5 sm:h-5" />
            </button>
            <span className="hidden lg:flex items-center gap-2 text-xs sm:text-sm text-gray-400 bg-white/5 px-2 sm:px-3 py-1.5 rounded-full border border-white/10 max-w-[120px] truncate">
              <User size={14} />
              <span className="truncate">{user.email}</span>
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full transition-transform hover:scale-110 active:scale-95 hover:bg-red-500/20 border border-red-400/20 touch-manipulation"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut size={18} className="text-red-400 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
