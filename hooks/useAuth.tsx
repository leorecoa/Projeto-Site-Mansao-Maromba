// hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Session, User } from '@supabase/supabase-js';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    session: Session | null;
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
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return {
        user,
        loading,
        session,
        signOut: () => supabase.auth.signOut()
    };
}