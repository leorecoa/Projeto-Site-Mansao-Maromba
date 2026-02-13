import React, { useState } from 'react'
import { supabase } from '../../services/supabase'
import { useCart } from '../../hooks/useCart'
import { useOrders } from '../../hooks/useOrders'
import { useAuth } from '../../hooks/useAuth'
import { useNavigation } from '../../hooks/useNavigation'
import { ShoppingBag, CreditCard, Truck, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'
import { checkoutSchema } from '../../lib/validations'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const { createOrder, isCreating } = useOrders()
  const { navigate } = useNavigation()
  const [step, setStep] = useState(1)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
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
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const validateStep = (currentStep: number) => {
    setErrors({})

    if (currentStep === 2) {
      // Mapear formData para o formato do Schema (Zod)
      // Senior Touch: Sanitizar dados (ex: remover formatação de telefone) antes de validar
      const stepData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone.replace(/\D/g, ''), // Remove ( ) -
        customer_address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip
      }

      // Validar apenas os campos desta etapa
      const stepSchema = checkoutSchema.pick({
        customer_name: true,
        customer_email: true,
        customer_phone: true,
        customer_address: true,
        city: true,
        state: true,
        zip: true
      })

      const result = stepSchema.safeParse(stepData)

      if (!result.success) {
        const newErrors: Record<string, string> = {}
        result.error.issues.forEach(issue => {
          // Mapear chaves do schema de volta para chaves do formData para exibir na UI
          const fieldMap: Record<string, string> = {
            customer_name: 'name',
            customer_email: 'email',
            customer_phone: 'phone',
            customer_address: 'address'
          }
          const key = String(issue.path[0])
          newErrors[fieldMap[key] || key] = issue.message
        })
        setErrors(newErrors)
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validar estoque antes de criar o pedido
      const { data: productsCheck, error: stockError } = await supabase
        .from('products')
        .select('id, name, stock_quantity')
        .in('id', cart.map(item => item.id))

      if (stockError) throw stockError

      for (const item of cart) {
        const product = productsCheck?.find(p => p.id === item.id)
        if (!product) throw new Error(`Produto ${item.name} não encontrado.`)

        if ((product.stock_quantity || 0) < item.quantity) {
          throw new Error(`Estoque insuficiente para ${item.name}. Disponível: ${product.stock_quantity || 0}`)
        }
      }

      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_city: formData.city,
        customer_zipcode: formData.zip,
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

      const newOrder = await createOrder(orderData)
      clearCart()
      setCreatedOrderId(newOrder?.id)
      setStep(4)
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : (error as { message?: string })?.message || 'Erro desconhecido'

      // Traduzir erro de constraint do banco para mensagem amigável
      if (message.includes('products_stock_quantity_check')) {
        alert('Desculpe, um ou mais itens do seu carrinho acabaram de esgotar.')
      } else {
        alert('Erro ao criar pedido: ' + message)
      }
    }
  }

  const handleContinue = (nextStep: number) => {
    if (step === 2 && nextStep > 2) {
      if (validateStep(2)) setStep(nextStep)
    } else {
      setStep(nextStep)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-yellow-400" />
          </button>
          <h1 className="text-4xl font-bold font-syncopate text-yellow-400">
            Finalizar Pedido
          </h1>
        </div>

        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex items-center ${s < 4 ? 'flex-1' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-yellow-400 text-black' : 'bg-white/10 text-gray-500'
                }`}>
                {s === 4 && step === 4 ? <CheckCircle size={24} /> : s}
              </div>
              {s < 4 && (
                <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-yellow-400' : 'bg-white/10'
                  }`} />
              )}
            </div>
          ))}
        </div>

        {step === 4 ? (
          <div className="glass-card p-12 rounded-2xl text-center border border-yellow-400/20">
            <CheckCircle size={80} className="text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Pedido Realizado!</h2>
            {createdOrderId && (
              <div className="mb-6 p-4 bg-white/5 rounded-lg inline-block border border-white/10">
                <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Número do Pedido</p>
                <p className="text-2xl text-yellow-400 font-mono font-bold tracking-widest">
                  #{createdOrderId.slice(0, 8).toUpperCase()}
                </p>
              </div>
            )}
            <p className="text-gray-400 mb-8">
              Seu pedido foi confirmado e está sendo processado.
              <br />
              Você receberá um email com os detalhes.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500"
              >
                Ver Meus Pedidos
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
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
                  onClick={() => handleContinue(2)}
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
                  <div>
                    <input
                      id="customer_name"
                      name="customer_name"
                      autoComplete="name"
                      aria-label="Nome completo"
                      type="text"
                      placeholder="Nome completo"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      id="customer_email"
                      name="customer_email"
                      autoComplete="email"
                      aria-label="Email"
                      type="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                  </div>
                  <div>
                    <input
                      id="customer_phone"
                      name="customer_phone"
                      autoComplete="tel"
                      aria-label="Telefone"
                      type="tel"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      placeholder="Telefone (apenas números)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.phone && <p id="phone-error" className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <input
                      id="customer_zipcode"
                      name="customer_zipcode"
                      autoComplete="postal-code"
                      aria-label="CEP"
                      type="text"
                      aria-invalid={!!errors.zip}
                      aria-describedby={errors.zip ? "zip-error" : undefined}
                      placeholder="CEP (12345-678)"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg ${errors.zip ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.zip && <p id="zip-error" className="text-red-500 text-xs mt-1 ml-1">{errors.zip}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <input
                      id="customer_address"
                      name="customer_address"
                      autoComplete="street-address"
                      aria-label="Endereço completo"
                      type="text"
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? "address-error" : undefined}
                      placeholder="Endereço completo"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg ${errors.address ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.address && <p id="address-error" className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                  </div>
                  <div>
                    <input
                      id="customer_city"
                      name="customer_city"
                      autoComplete="address-level2"
                      aria-label="Cidade"
                      type="text"
                      aria-invalid={!!errors.city}
                      aria-describedby={errors.city ? "city-error" : undefined}
                      placeholder="Cidade"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg ${errors.city ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.city && <p id="city-error" className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>}
                  </div>
                  <div>
                    <input
                      id="customer_state"
                      name="customer_state"
                      autoComplete="address-level1"
                      aria-label="Estado"
                      type="text"
                      aria-invalid={!!errors.state}
                      aria-describedby={errors.state ? "state-error" : undefined}
                      placeholder="Estado (UF)"
                      maxLength={2}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg ${errors.state ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {errors.state && <p id="state-error" className="text-red-500 text-xs mt-1 ml-1">{errors.state}</p>}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => handleContinue(1)}
                    className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContinue(3)}
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
                      id="payment_pix"
                      type="radio"
                      name="payment_method"
                      value="pix"
                      checked={formData.payment === 'pix'}
                      onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">PIX (Aprovação instantânea)</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                    <input
                      id="payment_card"
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment === 'card'}
                      onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">Cartão de Crédito</span>
                  </label>
                </div>

                <textarea
                  id="order_notes"
                  name="order_notes"
                  aria-label="Observações"
                  placeholder="Observações (opcional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg mb-6"
                  rows={3}
                />

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleContinue(2)}
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
