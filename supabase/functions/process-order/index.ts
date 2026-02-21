// ============================================
// SUPABASE EDGE FUNCTION: Process Order
// Processa pedidos automaticamente (validação + estoque)
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

function buildCorsHeaders(origin: string | null): HeadersInit {
  const allowOrigin = origin && (allowedOrigins.length === 0 || allowedOrigins.includes(origin))
    ? origin
    : (allowedOrigins[0] ?? 'null')

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

interface ProcessOrderRequest {
  order_id: string
  action: 'validate' | 'confirm' | 'ship' | 'deliver'
  tracking_code?: string
}

interface OrderItem {
  id: string
  product_id: string
  quantity: number | string
  unit_price: number | string
}

interface ProcessOrderData {
  id: string
  order_items: OrderItem[]
}

interface ProductStockData {
  id: string
  name: string
  is_active: boolean
  stock_quantity: number | string
}

const createRequestId = () => `po_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`

function logEvent(level: 'info' | 'error', event: string, payload: Record<string, unknown>) {
  const base = { ts: new Date().toISOString(), level, event, ...payload }
  if (level === 'error') {
    console.error(JSON.stringify(base))
  } else {
    console.log(JSON.stringify(base))
  }
}

function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization') ?? ''
  const [scheme, token] = authHeader.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null
  }
  return token
}

serve(async (req) => {
  const requestId = createRequestId()
  const origin = req.headers.get('origin')
  const corsHeaders = buildCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )
  }

  try {
    const token = getBearerToken(req)
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing bearer token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { order_id, action, tracking_code }: ProcessOrderRequest = await req.json()
    logEvent('info', 'process_order_request', { request_id: requestId, order_id, action })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: authData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid auth token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', authData.user.id)
      .maybeSingle()

    if (profileError) {
      throw profileError
    }

    if (profile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Buscar pedido com itens
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          unit_price
        )
      `)
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    let result: Record<string, unknown>

    switch (action) {
      case 'validate': {
        const typedOrder = order as unknown as ProcessOrderData
        const productIds = typedOrder.order_items.map((item) => item.product_id)
        const { data: products } = await supabase
          .from('products')
          .select('id, name, is_active, stock_quantity')
          .in('id', productIds)

        const qtyByProduct = new Map<string, number>()
        for (const item of typedOrder.order_items) {
          qtyByProduct.set(item.product_id, Number(item.quantity))
        }

        const typedProducts = (products ?? []) as unknown as ProductStockData[]
        const unavailable = typedProducts.filter((product) => {
          const requested = qtyByProduct.get(product.id) ?? 0
          return !product.is_active || Number(product.stock_quantity) < requested
        })
        
        if (unavailable.length > 0) {
          result = {
            valid: false,
            message: 'Produtos indisponíveis',
            unavailable_products: unavailable
          }
        } else {
          result = {
            valid: true,
            message: 'Pedido válido'
          }
        }
        break
      }

      case 'confirm': {
        const { error: confirmError } = await supabase.rpc('update_order_status', {
          p_order_id: order_id,
          p_new_status: 'confirmed',
          p_notes: 'Pedido confirmado automaticamente'
        })

        if (confirmError) throw confirmError

        // Enviar email
        await supabase.functions.invoke('send-email', {
          body: { type: 'order_confirmed', order_id }
        })

        result = { success: true, message: 'Pedido confirmado' }
        break
      }

      case 'ship': {
        if (!tracking_code) {
          throw new Error('Tracking code required')
        }

        const { error: shipError } = await supabase.rpc('update_order_status', {
          p_order_id: order_id,
          p_new_status: 'shipped',
          p_tracking_code: tracking_code,
          p_notes: 'Pedido enviado'
        })

        if (shipError) throw shipError

        // Enviar email
        await supabase.functions.invoke('send-email', {
          body: { type: 'order_shipped', order_id }
        })

        result = { success: true, message: 'Pedido enviado' }
        break
      }

      case 'deliver': {
        const { error: deliverError } = await supabase.rpc('update_order_status', {
          p_order_id: order_id,
          p_new_status: 'delivered',
          p_notes: 'Pedido entregue'
        })

        if (deliverError) throw deliverError

        result = { success: true, message: 'Pedido entregue' }
        break
      }

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    logEvent('error', 'process_order_error', { request_id: requestId, message })
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
