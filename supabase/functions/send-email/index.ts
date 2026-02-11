// ============================================
// SUPABASE EDGE FUNCTION: Send Email
// Envia notificações por email (Resend/SendGrid)
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'order_confirmed' | 'order_shipped' | 'payment_failed' | 'payment_refunded'
  order_id: string
  payment_id?: string
}

const emailTemplates = {
  order_confirmed: (order: any) => ({
    subject: `✅ Pedido #${order.id.slice(0, 8)} Confirmado - Mansão Maromba`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #EAB308;">🎉 Pedido Confirmado!</h1>
        <p>Olá <strong>${order.customer_name}</strong>,</p>
        <p>Seu pedido foi confirmado e está sendo preparado para envio.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Detalhes do Pedido</h3>
          <p><strong>Número:</strong> #${order.id.slice(0, 8)}</p>
          <p><strong>Total:</strong> R$ ${order.total_amount.toFixed(2)}</p>
          <p><strong>Status:</strong> Confirmado</p>
        </div>

        <p>Você receberá um email quando seu pedido for enviado.</p>
        <p>Obrigado por comprar na Mansão Maromba! 🏋️‍♂️</p>
      </div>
    `
  }),

  order_shipped: (order: any) => ({
    subject: `📦 Pedido #${order.id.slice(0, 8)} Enviado - Mansão Maromba`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #EAB308;">📦 Pedido Enviado!</h1>
        <p>Olá <strong>${order.customer_name}</strong>,</p>
        <p>Seu pedido foi enviado e está a caminho!</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Informações de Rastreio</h3>
          <p><strong>Código:</strong> ${order.tracking_code || 'Em breve'}</p>
          <p><strong>Previsão:</strong> 5-7 dias úteis</p>
        </div>

        <p>Acompanhe seu pedido em tempo real no nosso site.</p>
        <p>Obrigado por comprar na Mansão Maromba! 🏋️‍♂️</p>
      </div>
    `
  }),

  payment_failed: (order: any) => ({
    subject: `❌ Falha no Pagamento - Pedido #${order.id.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #EF4444;">❌ Falha no Pagamento</h1>
        <p>Olá <strong>${order.customer_name}</strong>,</p>
        <p>Infelizmente não conseguimos processar seu pagamento.</p>
        
        <div style="background: #fee; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Pedido:</strong> #${order.id.slice(0, 8)}</p>
          <p><strong>Valor:</strong> R$ ${order.total_amount.toFixed(2)}</p>
        </div>

        <p>Por favor, tente novamente ou entre em contato conosco.</p>
        <p>Equipe Mansão Maromba</p>
      </div>
    `
  }),

  payment_refunded: (order: any) => ({
    subject: `💰 Reembolso Processado - Pedido #${order.id.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">💰 Reembolso Processado</h1>
        <p>Olá <strong>${order.customer_name}</strong>,</p>
        <p>Seu reembolso foi processado com sucesso.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Valor:</strong> R$ ${order.total_amount.toFixed(2)}</p>
          <p><strong>Prazo:</strong> 5-10 dias úteis</p>
        </div>

        <p>O valor será creditado na mesma forma de pagamento utilizada.</p>
        <p>Equipe Mansão Maromba</p>
      </div>
    `
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, order_id }: EmailRequest = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Buscar dados do pedido
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (error || !order) {
      throw new Error('Order not found')
    }

    // Gerar email
    const template = emailTemplates[type](order)

    // Enviar via Resend (ou SendGrid)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Mansão Maromba <noreply@mansaomaromba.com>',
          to: order.customer_email,
          subject: template.subject,
          html: template.html
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Email error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
