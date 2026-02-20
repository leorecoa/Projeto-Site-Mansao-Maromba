import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  role: 'customer' | 'admin'
}

const PROFILE_TIMEOUT_MS = 10000
const AUTH_SAFETY_TIMEOUT_MS = 20000

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), timeoutMs)),
  ])
}

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, email, role')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let profileRequestToken = 0

    const loadProfile = async (userId: string) => {
      const requestToken = ++profileRequestToken

      try {
        const nextProfile = await withTimeout(
          fetchProfile(userId),
          PROFILE_TIMEOUT_MS,
          'Timeout ao carregar perfil'
        )

        if (!mounted || requestToken !== profileRequestToken) return
        setProfile(nextProfile)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar perfil'
        if (!mounted || requestToken !== profileRequestToken) return
        setProfile(null)
        setProfileError(message)
      } finally {
        if (mounted && requestToken === profileRequestToken) {
          setProfileLoading(false)
        }
      }
    }

    const syncFromSession = async (sessionUser: User | null) => {
      if (!mounted) return

      setUser(sessionUser)
      setProfileError(null)

      if (!sessionUser) {
        profileRequestToken += 1
        setProfile(null)
        setProfileLoading(false)
        setLoading(false)
        return
      }

      // Nao bloquear a autenticacao por consulta de perfil.
      setLoading(false)
      setProfileLoading(true)
      setProfile(null)
      void loadProfile(sessionUser.id)
    }

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await syncFromSession(session?.user ?? null)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao verificar sessao'
        if (mounted) {
          setProfileError(message)
          setLoading(false)
        }
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await syncFromSession(session?.user ?? null)
      if (mounted) setLoading(false)
    })

    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        setLoading(false)
      }
    }, AUTH_SAFETY_TIMEOUT_MS)

    return () => {
      mounted = false
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setProfileError(null)
  }

  return {
    user,
    profile,
    role: profile?.role || 'customer',
    isAdmin: profile?.role === 'admin',
    signOut,
    isAuthenticated: !!user,
    loading,
    profileLoading,
    profileError,
  }
}
