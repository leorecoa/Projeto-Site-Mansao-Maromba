import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  role: 'customer' | 'admin'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isInitialized = false

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isInitialized) return
      
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('id, email, role')
          .eq('id', session.user.id)
          .maybeSingle()
        
        if (data) setProfile(data)
      } else {
        setProfile(null)
      }
      
      if (event === 'SIGNED_IN' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    })
    
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data } = await supabase
            .from('user_profiles')
            .select('id, email, role')
            .eq('id', session.user.id)
            .maybeSingle()
          
          if (data) setProfile(data)
        }
      } catch (err) {
        console.error('[useAuth] Erro:', err)
      } finally {
        isInitialized = true
        setLoading(false)
      }
    }

    initAuth()

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return {
    user,
    profile,
    role: profile?.role || 'customer',
    isAdmin: profile?.role === 'admin',
    signOut,
    isAuthenticated: !!user,
    loading,
  }
}