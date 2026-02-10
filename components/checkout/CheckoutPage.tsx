import React, { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { useOrders } from '../../hooks/useOrders'
import { useAuth } from '../../hooks/useAuth'
import { ShoppingBag, CreditCard, Truck, CheckCircle, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const { createOrder, isCreating } = useOrders()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    payment: 'pix',
    notes: ''
  })

  if (!user) {
    window.location.href = '/login'
    return null
  }

  if (cart.length === 0) {
    window.location.href = '/'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: `${formData.address}, ${formData.city} - ${formData.state}, ${formData.zip}`,
        payment_method: formData.payment,
        notes: formData.notes,
        total_amount: cartTotal,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_image: item.image,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        }))
      }

      await createOrder(orderData)
      clearCart()
      setStep(4)
    } catch (error: any) {
      alert('Erro ao criar pedido: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-syncopate text-yellow-400 mb-8 text-center">
          Finalizar Pedido
        </h1>

        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex items-center ${s < 4 ? 'flex-1' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-yellow-400 text-black' : 'bg-white/10 text-gray-500'
              }`}>
                {s === 4 && step === 4 ? <CheckCircle size={24} /> : s}
              </div>
              {s < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step > s ? 'bg-yellow-400' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {step === 4 ? (
          <div className="glass-card p-12 rounded-2xl text-center border border-yellow-400/20">
            <CheckCircle size={80} className="text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Pedido Realizado!</h2>
            <p className="text-gray-400 mb-8">
              Seu pedido foi confirmado e está sendo processado.
              <br />
              Você receberá um email com os detalhes.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/orders'}
                className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500"
              >
                Ver Meus Pedidos
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="text-yellow-400" size={24} />
                  <h2 className="text-2xl font-bold">Resumo do Pedido</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-400">Quantidade: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-yellow-400">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-yellow-400">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full mt-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500"
                >
                  Continuar
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="text-yellow-400" size={24} />
                  <h2 className="text-2xl font-bold">Dados de Entrega</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="CEP"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Endereço"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="md:col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Estado"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg"
                    required
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="text-yellow-400" size={24} />
                  <h2 className="text-2xl font-bold">Pagamento</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                    <input
                      type="radio"
                      name="payment"
                      value="pix"
                      checked={formData.payment === 'pix'}
                      onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">PIX (Aprovação instantânea)</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={formData.payment === 'card'}
                      onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">Cartão de Crédito</span>
                  </label>
                </div>

                <textarea
                  placeholder="Observações (opcional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg mb-6"
                  rows={3}
                />

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Finalizar Pedido'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
