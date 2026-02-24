import { Star } from 'lucide-react';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId: _productId }: ReviewListProps) {
  const reviews: Review[] = [];

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma avaliação ainda. Seja o primeiro a avaliar!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">{review.user_name}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }
                />
              ))}
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
          <span className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString('pt-BR')}
          </span>
        </div>
      ))}
    </div>
  );
}
