// ============================================
// SUPABASE EDGE FUNCTION: Process Order
// Processa pedidos automaticamente (validação + estoque)
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessOrderRequest {
  order_id: string
  action: 'validate' | 'confirm' | 'ship' | 'deliver'
  tracking_code?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order_id, action, tracking_code }: ProcessOrderRequest = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Buscar pedido com itens
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price
        )
      `)
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    let result: any

    switch (action) {
      case 'validate':
        // Validar estoque dos produtos
        const productIds = order.order_items.map((item: any) => item.product_id)
        const { data: products } = await supabase
          .from('products')
          .select('id, name, available')
          .in('id', productIds)

        const unavailable = products?.filter(p => !p.available) || []
        
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

      case 'confirm':
        // Confirmar pedido
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

      case 'ship':
        // Marcar como enviado
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

      case 'deliver':
        // Marcar como entregue
        const { error: deliverError } = await supabase.rpc('update_order_status', {
          p_order_id: order_id,
          p_new_status: 'delivered',
          p_notes: 'Pedido entregue'
        })

        if (deliverError) throw deliverError

        result = { success: true, message: 'Pedido entregue' }
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Process order error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
