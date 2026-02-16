import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Package } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Theme } from '../../types';

interface NavbarProps {
  theme?: Theme;
}

export default function Navbar({ theme }: NavbarProps) {
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const primaryColor = theme?.primary || '#FACC15';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer flex items-center gap-3"
            onClick={() => navigate('/')}
          >
            <img
              src="https://i.imgur.com/2CMQ6GJ.png"
              alt="Mansão Maromba"
              className="h-10 w-10 rounded-lg"
            />
            <span className="font-syncopate font-bold text-white tracking-wider hidden sm:block">
              MANSÃO <span style={{ color: primaryColor }}>MAROMBA</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest"
            >
              Home
            </button>

            {user && (
              <button
                onClick={() => navigate('/orders')}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest flex items-center gap-2"
              >
                <Package size={16} />
                Meus Pedidos
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ backgroundColor: primaryColor }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-gray-400">Olá,</p>
                  <p className="text-sm font-bold text-white max-w-[100px] truncate">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Marombeiro'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 rounded-full font-bold text-black transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                ENTRAR
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-300 hover:text-white"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ backgroundColor: primaryColor }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button
              onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg"
            >
              HOME
            </button>

            {user && (
              <button
                onClick={() => { navigate('/orders'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg flex items-center gap-2"
              >
                <Package size={18} />
                MEUS PEDIDOS
              </button>
            )}

            {user ? (
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
              >
                <LogOut size={18} />
                SAIR
              </button>
            ) : (
              <button
                onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                className="block w-full text-center px-4 py-3 mt-4 rounded-lg font-bold text-black"
                style={{ backgroundColor: primaryColor }}
              >
                ENTRAR
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
