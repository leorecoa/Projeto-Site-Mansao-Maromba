import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Loader2 } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/store/useToast';
import { logError } from '@/utils/logger';

interface ReviewFormData {
  rating: number;
  comment: string;
  customer_name: string;
}

interface Props {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const { user } = useAuth();
  const { createReview } = useReviews(productId);
  const { addToast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 5,
      customer_name: user?.user_metadata?.full_name || '',
    },
  });

  const currentRating = watch('rating');

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await createReview.mutateAsync({
        product_id: productId,
        ...data,
      });
      reset();
      addToast('Avaliacao enviada com sucesso!', 'success');
      if (onSuccess) onSuccess();
    } catch (error) {
      logError('ReviewForm.onSubmit', error);
      addToast('Nao foi possivel enviar sua avaliacao.', 'error');
    }
  };

  if (!user) {
    return (
      <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 text-center">
        <p className="text-gray-400">Faca login para avaliar este produto.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-zinc-900 p-6 rounded-lg border border-white/10 space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">Avaliar Produto</h3>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Sua Nota</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setValue('rating', star)}
            >
              <Star
                className={`w-6 h-6 ${star <= (hoverRating || currentRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Seu Comentario</label>
        <textarea
          {...register('comment', {
            required: 'Comentario e obrigatorio',
            minLength: { value: 10, message: 'Minimo de 10 caracteres' },
          })}
          className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors h-24 resize-none"
          placeholder="Conte o que achou do produto..."
        />
        {errors.comment && (
          <span className="text-xs text-red-500 mt-1">{errors.comment.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar Avaliacao'}
      </button>
    </form>
  );
}
