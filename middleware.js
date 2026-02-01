import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Verificar se o usuário é admin
  const { data: customer, error } = await supabase
    .from('customers')
    .select('user_role')
    .eq('auth_user_id', user.id)
    .single()

  if (error) {
    console.error('Erro ao buscar role do usuário no middleware:', error)
    return NextResponse.redirect(new URL('/error', req.url))
  }
  
  if (customer?.user_role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  return res
}

export const config = {
  matcher: '/admin/:path*',
}