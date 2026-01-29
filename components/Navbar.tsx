import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Home,
  Package,
  MapPin,
  Info,
  Store
} from 'lucide-react';

import { Theme } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  theme: Theme;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, onOpenCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { id: 'hero', label: 'Home', icon: <Home size={16} />, href: '/#hero' },
    { id: 'products', label: 'Combos', icon: <Package size={16} />, href: '/#products' },
    { id: 'about', label: 'Sobre', icon: <Info size={16} />, href: '/#about' },
    { id: 'location', label: 'Local', icon: <MapPin size={16} />, href: '/#location' },
  ];

  const userMenuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={16} />,
      onClick: () => navigate('/dashboard')
    },
    {
      label: 'Meu Perfil',
      icon: <User size={16} />,
      onClick: () => navigate('/profile')
    },
    {
      label: 'Minha Loja',
      icon: <Store size={16} />,
      onClick: () => navigate('/')
    },
    {
      label: 'Sair',
      icon: <LogOut size={16} />,
      onClick: handleSignOut
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://i.imgur.com/2CMQ6GJ.png"
              alt="Mansão Maromba"
              className="w-10 h-10"
              style={{ filter: `drop-shadow(0 0 12px ${theme.glow})` }}
            />
            <div className="hidden sm:block">
              <h1 className="text-white font-bold tracking-tight">
                MANSÃO MAROMBA
              </h1>
              <p className="text-xs text-gray-400 tracking-widest">
                DEPÓSITO DIGITAL PRO
              </p>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-6">

            <div className="flex gap-6">
              {navLinks.map(link => (
                <a
                  key={link.id}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-yellow-400 transition"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full border"
              style={{ borderColor: `${theme.primary}40` }}
              aria-label="Carrinho"
            >
              <ShoppingCart className="text-yellow-400" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-black"
                  style={{ backgroundColor: theme.primary }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white"
                >
                  <User size={16} />
                  {user.email?.split('@')[0]}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                    {userMenuItems.map(item => (
                      <button
                        key={item.label}
                        onClick={() => {
                          item.onClick();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={onOpenCart} className="relative">
              <ShoppingCart className="text-yellow-400" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 text-xs rounded-full flex items-center justify-center text-black"
                  style={{ backgroundColor: theme.primary }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {user && (
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <User className="text-white" />
              </button>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
