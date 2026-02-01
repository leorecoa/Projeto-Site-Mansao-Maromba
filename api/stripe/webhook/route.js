import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
    let event

    try {
        // event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
        // Simulação: Apenas para desenvolvimento, remover em produção
        event = { type: 'payment_intent.succeeded', data: { object: { metadata: { transactionId: 'simulated_id' }, amount: 5000 } } }

    } catch (err) {
        console.error(`Webhook Error: ${err.message}`)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`)

        const transactionId = 'simulated_id' // Remover em produção
        const amount = paymentIntent.amount / 100 // Converter centavos para reais

        try {
            const { data: existingTransaction, error: transactionFetchError } = await supabase
                .from('wallet_transactions')
                .select('wallet_id')
                .eq('id', transactionId)
                .single()

            if (transactionFetchError || !existingTransaction) {
                console.error('Transação não encontrada:', transactionFetchError)
                return NextResponse.json({ received: true }, { status: 200 })
            }

            const walletId = existingTransaction.wallet_id

            await supabase.from('wallet_transactions').update({
                status: 'COMPLETED',
                stripe_payment_intent_id: paymentIntent.id // Descomentar em produção
            }).eq('id', transactionId)

            await supabase.rpc('increment_wallet_balance', {
                amount_to_add: amount,
                target_wallet_id: walletId
            })

            console.log(`Saldo da carteira ${walletId} atualizado com R$ ${amount}`)

        } catch (dbError) {
            console.error('Erro ao atualizar DB no webhook:', dbError)
            return NextResponse.json({ error: 'Erro ao processar webhook no DB.' }, { status: 500 })
        }
    } else {
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
}