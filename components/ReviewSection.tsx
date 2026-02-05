import React, { useState } from 'react';

// Tipos
export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  productId?: string;
  verifiedPurchase?: boolean;
}

interface ReviewSectionProps {
  reviews?: Review[];
  productId?: string;
  averageRating?: number;
  totalReviews?: number;
  showHeader?: boolean;
  allowAddReview?: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews: initialReviews,
  productId,
  averageRating = 4.5,
  totalReviews = 0,
  showHeader = true,
  allowAddReview = true,
}) => {
  // Dados mockados se não fornecer
  const defaultReviews: Review[] = [
    {
      id: '1',
      userName: 'João Silva',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
      rating: 5,
      date: '2024-01-15',
      comment: 'Produto excelente! Chegou antes do prazo e a qualidade superou minhas expectativas. Recomendo muito!',
      verifiedPurchase: true,
    },
    {
      id: '2',
      userName: 'Maria Santos',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      rating: 4,
      date: '2024-01-10',
      comment: 'Muito bom, mas a embalagem poderia ser melhor. O produto em si é de ótima qualidade.',
      verifiedPurchase: true,
    },
    {
      id: '3',
      userName: 'Carlos Oliveira',
      rating: 5,
      date: '2024-01-05',
      comment: 'Simplesmente perfeito! Já é meu segundo pedido e continuo muito satisfeito.',
      verifiedPurchase: true,
    },
    {
      id: '4',
      userName: 'Ana Costa',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      rating: 3,
      date: '2024-01-01',
      comment: 'Produto bom, mas o prazo de entrega poderia ser mais rápido.',
      verifiedPurchase: false,
    },
  ];

  const [reviews, setReviews] = useState<Review[]>(initialReviews || defaultReviews);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    userName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Renderizar estrelas
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Calcular média se não fornecida
  const calculatedAverage = averageRating || 
    (reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0);
  
  const calculatedTotal = totalReviews || reviews.length;

  // Distribuição de avaliações
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.round(r.rating) === rating).length,
    percentage: (reviews.filter((r) => Math.round(r.rating) === rating).length / reviews.length) * 100,
  }));

  // Adicionar nova avaliação
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.comment.trim() || !newReview.userName.trim()) {
      alert('Por favor, preencha seu nome e comentário');
      return;
    }

    setIsSubmitting(true);

    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newReviewObj: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment,
      productId,
      verifiedPurchase: false,
    };

    setReviews([newReviewObj, ...reviews]);
    setNewReview({ rating: 5, comment: '', userName: '' });
    setIsSubmitting(false);
  };

  return (
    <section 
      className="review-section py-12 px-4 max-w-6xl mx-auto"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}
    >
      {showHeader && (
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Avaliações dos Clientes</h2>
          <p className="text-gray-600 text-lg">
            Veja o que nossos clientes estão dizendo sobre nossos produtos
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumo das avaliações */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {calculatedAverage.toFixed(1)}
            </div>
            <div className="mb-2">{renderStars(calculatedAverage)}</div>
            <p className="text-gray-600">Baseado em {calculatedTotal} avaliações</p>
          </div>

          {/* Distribuição das avaliações */}
          <div className="space-y-4">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center">
                <div className="flex items-center w-24">
                  <span className="text-gray-700 w-8">{rating} estrelas</span>
                  <div className="ml-2 flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className="ml-4 text-gray-600 text-sm w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de avaliações */}
        <div className="lg:col-span-2">
          {allowAddReview && (
            <div className="mb-8 bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Deixe sua avaliação</h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Seu nome</label>
                  <input
                    type="text"
                    value={newReview.userName}
                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite seu nome"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Avaliação</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`text-3xl transition-transform hover:scale-110 ${
                          star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-4 text-gray-700">
                      {newReview.rating} estrelas
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Seu comentário</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Compartilhe sua experiência com o produto..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
              </form>
            </div>
          )}

          {/* Lista de avaliações existentes */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">
              Avaliações ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <p className="text-gray-500 text-lg">
                  Nenhuma avaliação ainda. Seja o primeiro a avaliar!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                        {review.userAvatar ? (
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${review.userName}&background=random`;
                            }}
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center text-white font-bold"
                            style={{
                              backgroundColor: `hsl(${review.userName.charCodeAt(0) * 10}, 70%, 50%)`
                            }}
                          >
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{review.userName}</h4>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-gray-500 text-sm">
                            {review.date}
                          </span>
                          {review.verifiedPurchase && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              ✓ Compra verificada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  
                  {review.productId && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Esta avaliação foi útil? ({Math.floor(Math.random() * 50)})
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Paginação (simplificada) */}
          {reviews.length > 5 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Anterior
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Próximo
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;