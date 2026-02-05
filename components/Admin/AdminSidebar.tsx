// c:\Users\Leorecoa\MM\Projeto-Site-Mansao-Maromba\components\admin\Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Produtos', href: '/admin/products' },
  { icon: ShoppingCart, label: 'Pedidos', href: '/admin/orders' },
  { icon: Users, label: 'Clientes', href: '/admin/customers' },
  { icon: Settings, label: 'Configurações', href: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 hidden md:flex flex-col z-40">
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-black">M</span>
        </div>
        <span className="font-syncopate font-bold text-white tracking-tighter">ADMIN</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-yellow-500 text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-black' : 'group-hover:text-yellow-500 transition-colors'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
