'use client'
import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/minha-conta')
      } else {
        router.push('/auth/login?error=auth_failed')
      }
    }
    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="auth-callback-container">
      <h1>Processando autenticação...</h1>
      <p>Você será redirecionado em breve.</p>
    </div>
  )
}