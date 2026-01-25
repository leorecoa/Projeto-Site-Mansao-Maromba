
import React from 'react';
import { Star } from 'lucide-react';
import { Review, Theme } from '../../types';

interface ReviewSectionProps {
  reviews: Review[];
  activeTheme: Theme;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, activeTheme }) => {
  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-syncopate font-bold">RECONHECIMENTO.</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-xl font-bold">3,6 Estrelas <span className="text-gray-500 font-normal text-sm">(17 avaliações)</span></span>
            </div>
          </div>
          <div className="h-[2px] flex-grow mx-12 bg-white/5 hidden md:block" />
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="min-w-[300px] md:min-w-[400px] snap-center glass-card p-8 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < review.rating ? activeTheme.primary : "none"} 
                      stroke={i < review.rating ? activeTheme.primary : "gray"}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-bold uppercase">{review.date}</span>
              </div>
              
              <p className="text-lg italic text-white/80 mb-8 leading-relaxed">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold">
                  {review.user[0]}
                </div>
                <div>
                  <h4 className="font-bold">{review.user}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Cliente Verificado</p>
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
