import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/services/supabase';
import { checkoutSchema, type CheckoutFormData } from '@/types/checkout';
import { CreditCard, MapPin, User } from 'lucide-react';
import { CustomerForm } from '@/components/checkout/CustomerForm';
import ShippingForm from '@/components/checkout/ShippingForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { formatCurrency } from '@/utils/format';
import { logError } from '@/utils/logger';

const STEPS = [
  { id: 1, title: 'Identificação', icon: User },
  { id: 2, title: 'Entrega', icon: MapPin },
  { id: 3, title: 'Pagamento', icon: CreditCard },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem('checkout_step');
    return saved ? parseInt(saved) : 1;
  });
  const [orderId, setOrderId] = useState<string | null>(() => {
    return sessionStorage.getItem('checkout_order_id');
  });
  const { cart, cartTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  // Persiste step e orderId
  useEffect(() => {
    sessionStorage.setItem('checkout_step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    if (orderId) {
      sessionStorage.setItem('checkout_order_id', orderId);
    } else {
      sessionStorage.removeItem('checkout_order_id');
    }
  }, [orderId]);

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      customer: {
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
      },
    },
  });

  const { trigger } = methods;

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger('customer');
    } else if (currentStep === 2) {
      isValid = await trigger('shipping');
      if (isValid) {
        await createOrder();
        return; // createOrder avança o passo se der certo
      }
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const createOrder = async () => {
    try {
      const formData = methods.getValues();

      // 1. Criar/Atualizar Cliente
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .upsert(
          {
            auth_user_id: user?.id,
            full_name: formData.customer.fullName,
            email: formData.customer.email,
            phone: formData.customer.phone,
            // cpf: formData.customer.cpf, // Adicionar ao schema do banco se necessário
            address_zip: formData.shipping.zip,
            address_street: formData.shipping.street,
            address_number: formData.shipping.number,
            address_neighborhood: formData.shipping.neighborhood,
            address_city: formData.shipping.city,
            address_state: formData.shipping.state,
          },
          { onConflict: 'auth_user_id' }
        )
        .select()
        .single();

      if (customerError) throw customerError;

      // 2. Criar Pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          customer_id: customer.id,
          total_amount: cartTotal,
          status: 'pending',
          shipping_address_snapshot: formData.shipping,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Criar Itens do Pedido
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderId(order.id);
      setCurrentStep(3);
      clearCart();
    } catch (error) {
      logError('CheckoutPage.createOrder', error);
      showError('Não foi possível processar o pedido. Tente novamente.');
    }
  };

  const handlePaymentSuccess = () => {
    // Limpa sessionStorage
    sessionStorage.removeItem('checkout_step');
    sessionStorage.removeItem('checkout_order_id');
    // Redireciona para a página de sucesso passando o ID do pedido no state
    navigate('/checkout/success', { state: { orderId } });
  };

  if (cart.length === 0 && !orderId) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12 px-4 flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
        <button onClick={() => navigate('/')} className="text-yellow-400 hover:underline">
          Voltar para a loja
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 sm:pt-24 pb-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Stepper */}
        <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto pb-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div
                className={`flex flex-col items-center ${currentStep >= step.id ? 'text-yellow-400' : 'text-gray-600'}`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 mb-2 ${currentStep >= step.id ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-600'}`}
                >
                  <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">{step.title}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-10 sm:w-16 h-0.5 mx-2 sm:mx-4 ${currentStep > step.id ? 'bg-yellow-400' : 'bg-gray-700'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FormProvider {...methods}>
              {currentStep === 1 && (
                <>
                  <CustomerForm />
                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 bg-yellow-400 text-black font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors"
                  >
                    Ir para Entrega
                  </button>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <ShippingForm />
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:w-1/3 bg-zinc-800 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="w-full sm:w-2/3 bg-yellow-400 text-black font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors"
                    >
                      Ir para Pagamento
                    </button>
                  </div>
                </>
              )}
            </FormProvider>

            {currentStep === 3 && orderId && (
              <PaymentForm orderId={orderId} onSuccess={handlePaymentSuccess} />
            )}
          </div>

          {/* Resumo do Pedido (Sidebar) */}
          <div className="bg-zinc-900 p-4 sm:p-6 rounded-xl border border-white/10 h-fit">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-5 sm:mb-6">
              Resumo do Pedido
            </h3>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium line-clamp-2">{item.name}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {item.quantity}x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-white font-bold text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Frete</span>
                <span>Grátis</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10 mt-2">
                <span>Total</span>
                <span className="text-yellow-400">{formatCurrency(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
