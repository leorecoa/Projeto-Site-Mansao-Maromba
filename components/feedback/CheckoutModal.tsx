
import React, { useState } from 'react';
import { X, CheckCircle, Loader2, CreditCard, User, Mail, Phone, MapPin } from 'lucide-react';
import { Theme, CartItem } from '../../types';
import { ordersService } from '../../services/supabase';
import { formatCurrency } from '../../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: Theme;
  cart: CartItem[];
  total: number;
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  activeTheme, 
  cart, 
  total,
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'credit_card'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await ordersService.createOrder(formData, cart, total);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', address: '', city: '', zip: '', paymentMethod: 'credit_card' });
      }, 3000);
    } catch (err) {
      alert('Erro ao processar seu pedido. Verifique os dados ou tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl glass-card rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10">
        
        {/* LADO ESQUERDO: Resumo do Pedido */}
        <div className="w-full md:w-5/12 p-8 bg-white/[0.02] border-r border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-syncopate font-bold mb-8">RESUMO</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="h-8 object-contain" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-500">{item.quantity}x {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total à pagar</p>
            <p className="text-4xl font-syncopate font-bold" style={{ color: activeTheme.primary }}>
              {formatCurrency(total)}
            </p>
          </div>
        </div>

        {/* LADO DIREITO: Formulário */}
        <div className="w-full md:w-7/12 p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>

          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-pulse">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: activeTheme.primary }}>
                <CheckCircle size={40} color="#000" />
              </div>
              <h2 className="text-2xl font-syncopate font-bold mb-2">SUCESSO!</h2>
              <p className="text-gray-400">Seu pedido foi registrado no banco de dados e está sendo processado.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-syncopate font-bold mb-6">CHECKOUT</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-4 text-gray-500" />
                  <input 
                    type="text" required placeholder="Nome Completo" 
                    className={`${inputClasses} pl-12`} 
                    style={{ '--tw-ring-color': activeTheme.primary } as any}
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-4 text-gray-500" />
                    <input 
                      type="email" required placeholder="Seu E-mail" 
                      className={`${inputClasses} pl-12`}
                      style={{ '--tw-ring-color': activeTheme.primary } as any}
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-4 text-gray-500" />
                    <input 
                      type="tel" required placeholder="WhatsApp" 
                      className={`${inputClasses} pl-12`}
                      style={{ '--tw-ring-color': activeTheme.primary } as any}
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-4 text-gray-500" />
                  <input 
                    type="text" required placeholder="Endereço de Entrega" 
                    className={`${inputClasses} pl-12`}
                    style={{ '--tw-ring-color': activeTheme.primary } as any}
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" required placeholder="Cidade" 
                    className={inputClasses}
                    style={{ '--tw-ring-color': activeTheme.primary } as any}
                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                  <input 
                    type="text" required placeholder="CEP" 
                    className={inputClasses}
                    style={{ '--tw-ring-color': activeTheme.primary } as any}
                    value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-40">Forma de Pagamento</p>
                <div className="flex gap-4">
                  {['credit_card', 'pix'].map(method => (
                    <button
                      key={method} type="button"
                      onClick={() => setFormData({...formData, paymentMethod: method})}
                      className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase transition-all ${formData.paymentMethod === method ? 'border-white bg-white/10' : 'border-white/5 opacity-40'}`}
                      style={{ borderColor: formData.paymentMethod === method ? activeTheme.primary : '' }}
                    >
                      {method.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-5 rounded-2xl font-black text-black mt-6 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: activeTheme.primary, boxShadow: `0 10px 40px ${activeTheme.glow}` }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                {isSubmitting ? 'PROCESSANDO...' : 'FINALIZAR AGORA'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
