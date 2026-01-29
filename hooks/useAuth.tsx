import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Session, User } from '@supabase/supabase-js';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    session: Session | null;
    signIn: (email: string, password: string) => Promise<{
        data: {
            user: User | null;
            session: Session | null;
        } | null;
        error: Error | null;
    }>;
    signOut: () => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<void>;
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

    const signIn = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({
            email,
            password
        });
    };

    const signInWithGoogle = async (): Promise<void> => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                throw error
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('[Auth][Google]', err.message)
                alert('Google Login: ' + err.message)
            } else {
                console.error('[Auth][Google] Erro desconhecido', err)
                alert('Falha inesperada ao iniciar login com Google.')
            }
        }
    }

    return {
        user,
        loading,
        session,
        signIn,
        signOut: () => supabase.auth.signOut(),
        signInWithGoogle,
    };
}