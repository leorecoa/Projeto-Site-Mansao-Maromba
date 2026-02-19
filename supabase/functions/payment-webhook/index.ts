// ============================================
// SUPABASE EDGE FUNCTION: Payment Webhook
// Processa webhooks de pagamento (Stripe/Mercado Pago)
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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

interface PaymentWebhook {
  event: 'payment.success' | 'payment.failed' | 'payment.refunded'
  order_id: string
  payment_id: string
  amount: number
  payment_method: string
  metadata?: Record<string, any>
}

const encoder = new TextEncoder()

function normalizeHex(hex: string): string {
  return hex.trim().toLowerCase().replace(/^sha256=/, '')
}

function constantTimeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

async function signPayload(secret: string, payload: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(payload)
  )

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

serve(async (req) => {
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
    const signature = req.headers.get('x-webhook-signature')
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing webhook signature or secret' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const rawBody = await req.text()
    const expectedSignature = await signPayload(webhookSecret, rawBody)
    const providedSignature = normalizeHex(signature)

    if (!constantTimeEqualHex(providedSignature, expectedSignature)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid webhook signature' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const payload: PaymentWebhook = JSON.parse(rawBody)

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

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
