// hooks/useAuth.tsx - APENAS ADICIONE ESTAS 2 COISAS
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Session, User } from '@supabase/supabase-js';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    session: Session | null;
    signIn: (email: string, password: string) => Promise<{
        data: { user: User | null; session: Session | null } | null;
        error: Error | null
    }>;  // ← 1. ADICIONE ESTA LINHA
    signOut: () => Promise<{ error: Error | null }>;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: string, session: Session | null) => {
                console.log('Auth event:', event); // Para debug
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // ← 2. ADICIONE ESTE MÉTODO (SÓ ISSO!)
    const signIn = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({
            email,
            password
        });
    };

    return {
        user,
        loading,
        session,
        signIn, // ← 3. ADICIONE AQUI
        signOut: () => supabase.auth.signOut()
    };
}