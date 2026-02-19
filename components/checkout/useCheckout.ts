import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { useCartStore } from '@/store/useCart'
import { useAuth } from '@/hooks/useAuth'
import type { CheckoutFormData } from '@/types/checkout'
import { createRequestId, trackEvent } from '@/utils/observability'
import { logError } from '@/utils/logger'

interface CreateOrderResponse {
  success: boolean
  order_id: string
}

export function useCheckout() {
  const navigate = useNavigate()

  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)
  const isHydrated = useCartStore((state) => state.isHydrated)
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processCheckout = useCallback(
    async (data: CheckoutFormData) => {
      const requestId = createRequestId('checkout')

      if (cart.length === 0) {
        setError('Seu carrinho esta vazio.')
        trackEvent('checkout_validation_failed', {
          request_id: requestId,
          reason: 'empty_cart',
        })
        return
      }

      setLoading(true)
      setError(null)
      trackEvent('checkout_started', {
        request_id: requestId,
        user_id: user?.id ?? 'guest',
        item_count: cart.length,
        cart_total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      })

      try {
        const itemsPayload = cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        }))

        const fullAddress = `${data.shipping.street}, ${data.shipping.number} - ${data.shipping.neighborhood}`

        const { data: response, error: rpcError } =
          await supabase.rpc('create_order', {
            p_user_id: user?.id ?? null,
            p_customer_name: data.customer.fullName,
            p_customer_email: data.customer.email,
            p_customer_phone: data.customer.phone,
            p_customer_city: data.shipping.city,
            p_customer_zipcode: data.shipping.zip,
            p_customer_address: fullAddress,
            p_shipping_address: data.shipping,
            p_items: itemsPayload,
          })

        if (rpcError) throw rpcError

        const result = response as CreateOrderResponse | null
        if (!result?.success) {
          throw new Error('Erro desconhecido ao criar pedido.')
        }

        trackEvent('checkout_order_created', {
          request_id: requestId,
          order_id: result.order_id,
        })

        clearCart()
        navigate('/checkout/success', { state: { orderId: result.order_id } })
      } catch (err: unknown) {
        let message = 'Ocorreu um erro desconhecido ao processar seu pedido.'

        if (err instanceof Error) {
          message = err.message
        } else if (typeof err === 'object' && err !== null && 'message' in err) {
          message = String((err as { message: unknown }).message)
        }

        logError('useCheckout.processCheckout', { requestId, err })
        trackEvent('checkout_failed', {
          request_id: requestId,
          user_id: user?.id ?? 'guest',
          error_message: message,
        })

        setError(message)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } finally {
        setLoading(false)
      }
    },
    [cart, clearCart, navigate, user]
  )

  return {
    processCheckout,
    loading,
    error,
    cart,
    cartTotal: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    isCartLoading: !isHydrated,
  }
}
