import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { amount } = await req.json()

    if (amount < 10) {
      return NextResponse.json({ error: 'Valor mínimo de depósito é R$ 10.' }, { status: 400 })
    }

    const user = (await supabase.auth.getUser()).data.user

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    // 1. Criar transação PENDING na wallet_transactions
    const { data: walletData, error: walletError } = await supabase
      .from('user_wallet')
      .select('id')
      .eq('customer_id', user.id)
      .single()

    if (walletError || !walletData) {
      console.error('Erro ao buscar carteira do usuário:', walletError)
      return NextResponse.json({ error: 'Carteira do usuário não encontrada.' }, { status: 500 })
    }

    const walletId = walletData.id

    const { data: transaction, error: transactionError } = await supabase
      .from('wallet_transactions')
      .insert({
        wallet_id: walletId,
        type: 'DEPOSIT',
        amount: amount,
        description: 'Depósito via Stripe (pendente)',
        status: 'PENDING',
        // stripe_payment_intent_id: '' // Será preenchido após a criação do Payment Intent
      })
      .select()
      .single()

    if (transactionError) {
      console.error('Erro ao criar transação pendente:', transactionError)
      return NextResponse.json({ error: 'Erro ao iniciar depósito.' }, { status: 500 })
    }

    // 2. Criar Payment Intent no Stripe (descomentar quando tiver chaves)
    // const paymentIntent = await stripe.paymentIntIntents.create({
    //   amount: amount * 100, // Stripe usa centavos
    //   currency: 'brl',
    //   metadata: { transactionId: transaction.id, userId: user.id },
    // })

    // 3. Atualizar transação com o ID do Payment Intent
    // await supabase.from('wallet_transactions').update({
    //   stripe_payment_intent_id: paymentIntent.id
    // }).eq('id', transaction.id)

    return NextResponse.json({ 
      clientSecret: 'sk_test_simulado', // Substituir por paymentIntent.client_secret
      transactionId: transaction.id 
    }, { status: 200 })

  } catch (error) {
    console.error('Erro na API create-deposit-intent:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}