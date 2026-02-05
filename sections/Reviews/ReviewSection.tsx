// c:/Users/Leorecoa/MM/Projeto-Site-Mansao-Maromba/sections/Reviews/ReviewSection.tsx
import React from 'react';
import { Theme } from '../../types';
import { Star, Quote } from 'lucide-react';

interface ReviewSectionProps {
  activeTheme: Theme;
  reviews?: any[]; // Pode ser tipado melhor futuramente
}

const MOCK_REVIEWS = [
  { id: 1, name: 'Toguro', role: 'CEO', text: 'O brabo tem nome. Qualidade indiscutível.', rating: 5 },
  { id: 2, name: 'Cliente VIP', role: 'Membro', text: 'Entrega rápida e o kit chegou gelado. Recomendo demais!', rating: 5 },
  { id: 3, name: 'Ana Fit', role: 'Atleta', text: 'A energia que faltava pro meu treino. O Combo Tigrinho é surreal.', rating: 4 },
];

const ReviewSection: React.FC<ReviewSectionProps> = ({ activeTheme, reviews = MOCK_REVIEWS }) => {
  return (
    <section className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-syncopate font-bold mb-4">QUEM COMPRA <span style={{ color: activeTheme.primary }}>APROVA</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="p-8 rounded-3xl bg-black border border-white/10 relative">
              <Quote size={40} className="absolute top-6 right-6 opacity-10" style={{ color: activeTheme.primary }} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < review.rating ? activeTheme.primary : 'none'} 
                    color={i < review.rating ? activeTheme.primary : '#333'} 
                  />
                ))}
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">"{review.text}"</p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{review.name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
