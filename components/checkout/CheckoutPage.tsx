import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from './useCheckout';
import { useAuth } from '@/hooks/useAuth';
import CustomerForm from './CustomerForm';
import ShippingForm from './ShippingForm';
import OrderSummary from './OrderSummary';
import CheckoutSteps from './CheckoutSteps';
import { ArrowLeft, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { checkoutSchema, type CheckoutFormData } from '@/types/checkout';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { processCheckout, loading, error, cart, cartTotal, isCartLoading } = useCheckout();

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer: {
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: '',
        cpf: ''
      },
      shipping: {
        zip: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: ''
      }
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    processCheckout(data);
  };

  if (isCartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
          <p className="text-gray-400">Carregando carrinho...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-white/10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-400 mb-8">Adicione itens ao seu carrinho para prosseguir com o checkout.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all"
          >
            Voltar para a Loja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="text-yellow-400" />
          </button>
          <h1 className="text-3xl font-bold text-white">Finalizar Compra</h1>
        </div>

        {/* Steps Indicator */}
        <CheckoutSteps currentStep="identification" />

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
            {/* Forms Column */}
            <div className="lg:col-span-2">
              <CustomerForm disabled={loading} />

              <ShippingForm disabled={loading} />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-4 bg-yellow-400 text-black font-bold text-lg rounded-xl hover:bg-yellow-300 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-lg shadow-yellow-400/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processando Pedido...
                  </>
                ) : (
                  'Confirmar e Ir para Pagamento'
                )}
              </button>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-1">
              <OrderSummary items={cart} total={cartTotal} />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}