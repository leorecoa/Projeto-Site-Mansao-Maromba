// VERSÃO OTIMIZADA PARA PRODUÇÃO
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

interface UserProfile {
  id: string
  email: string
  role: 'customer' | 'admin'
}

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    // Inicialização
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        if (!isMounted) return
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Carrega perfil com retry
          const { data, error } = await supabase
            .from('user_profiles')
            .select('id, email, role')
            .eq('id', session.user.id)
            .maybeSingle()
          
          if (!isMounted) return
          
          if (error) {
            console.error('Erro ao carregar perfil:', error)
            setError('Erro ao carregar perfil do usuário')
          } else if (data) {
            setProfile(data)
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Erro na autenticação:', err)
        setError('Erro ao verificar autenticação')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    // Listener de mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return
      
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Recarrega perfil quando faz login
        const { data } = await supabase
          .from('user_profiles')
          .select('id, email, role')
          .eq('id', session.user.id)
          .maybeSingle()
        
        if (isMounted && data) {
          setProfile(data)
        }
      } else {
        setProfile(null)
      }
      
      // Limpa hash OAuth
      if (event === 'SIGNED_IN' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setError(null)
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
      setError('Erro ao fazer logout')
    }
  }

  return {
    user,
    profile,
    role: profile?.role || 'customer',
    isAdmin: profile?.role === 'admin',
    signOut,
    isAuthenticated: !!user,
    loading,
    error, // Novo: expõe erros para UI
  }
}
