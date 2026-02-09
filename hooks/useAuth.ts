import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Processa hash fragment do OAuth (Google redirect)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    
    if (accessToken) {
      console.log('OAuth callback detectado, processando token...')
    }

    // Verifica sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('getSession resultado:', session ? 'Sessão encontrada' : 'Sem sessão', session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuta mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('onAuthStateChange:', event, session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Limpa hash da URL após processar OAuth
      if (event === 'SIGNED_IN' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    console.log('Fazendo logout...')
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    user,
    signOut,
    isAuthenticated: !!user,
    loading,
  }
}