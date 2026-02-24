// VERSAO OTIMIZADA PARA PRODUCAO
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';
import { logError } from '../utils/logger';

interface UserProfile {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (!isMounted) return;

        setUser(session?.user ?? null);

        if (session?.user) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('id, email, role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!isMounted) return;

          if (error) {
            logError('useAuth.PRODUCTION.loadProfile', error);
            setError('Erro ao carregar perfil do usuario');
          } else if (data) {
            setProfile(data);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        logError('useAuth.PRODUCTION.getSession', err);
        setError('Erro ao verificar autenticacao');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('id, email, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (isMounted && data) {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }

      if (event === 'SIGNED_IN' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setError(null);
    } catch (err) {
      logError('useAuth.PRODUCTION.signOut', err);
      setError('Erro ao fazer logout');
    }
  };

  return {
    user,
    profile,
    role: profile?.role || 'customer',
    isAdmin: profile?.role === 'admin',
    signOut,
    isAuthenticated: !!user,
    loading,
    error,
  };
}
