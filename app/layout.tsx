// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { AppProvider } from '@/app/context/AppContext';
import { CartProvider } from '@/app/context/CartContext';

export const metadata = {
  title: 'Mansão Maromba',
  description: 'A casa dos monstros.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider attribute="class">
          <AppProvider>
            <CartProvider>{children}</CartProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
