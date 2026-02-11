// ============================================
// SUPABASE EDGE FUNCTION: Payment Webhook
// Processa webhooks de pagamento (Stripe/Mercado Pago)
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentWebhook {
  event: 'payment.success' | 'payment.failed' | 'payment.refunded'
  order_id: string
  payment_id: string
  amount: number
  payment_method: string
  metadata?: Record<string, any>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('x-webhook-signature')
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET')
    
    if (!signature || !webhookSecret) {
      throw new Error('Missing webhook signature or secret')
    }

    const payload: PaymentWebhook = await req.json()
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    let newStatus: string
    let notes: string

    switch (payload.event) {
      case 'payment.success':
        newStatus = 'confirmed'
        notes = `Pagamento confirmado. ID: ${payload.payment_id}`
        
        await supabase.rpc('update_order_status', {
          p_order_id: payload.order_id,
          p_new_status: newStatus,
          p_notes: notes
        })

        await supabase.functions.invoke('send-email', {
          body: {
            type: 'order_confirmed',
            order_id: payload.order_id,
            payment_id: payload.payment_id
          }
        })
        break

      case 'payment.failed':
        await supabase.rpc('cancel_order', {
          p_order_id: payload.order_id,
          p_reason: `Pagamento falhou. ID: ${payload.payment_id}`
        })

        await supabase.functions.invoke('send-email', {
          body: { type: 'payment_failed', order_id: payload.order_id }
        })
        break

      case 'payment.refunded':
        await supabase.rpc('cancel_order', {
          p_order_id: payload.order_id,
          p_reason: `Pagamento reembolsado. ID: ${payload.payment_id}`
        })

        await supabase.functions.invoke('send-email', {
          body: { type: 'payment_refunded', order_id: payload.order_id }
        })
        break

      default:
        throw new Error(`Unknown event: ${payload.event}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
