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
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const syncFromSession = async (sessionUser: User | null) => {
      if (!mounted) return

      setUser(sessionUser)
      setProfileError(null)

      if (!sessionUser) {
        setProfile(null)
        return
      }

      try {
        const nextProfile = await withTimeout(
          fetchProfile(sessionUser.id),
          PROFILE_TIMEOUT_MS,
          'Timeout ao carregar perfil'
        )

        if (mounted) setProfile(nextProfile)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar perfil'
        if (mounted) {
          setProfile(null)
          setProfileError(message)
        }
      }
    }

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await syncFromSession(session?.user ?? null)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao verificar sessao'
        if (mounted) {
          setProfileError(message)
        }
      } finally {
        if (mounted) setLoading(false)
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
    profileError,
  }
}
