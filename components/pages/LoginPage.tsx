// pages/auth/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'SIGNED_IN') {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/login', { replace: true });
            }
        });
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="mt-4 text-gray-300">Processando login...</p>
            </div>
        </div>
    );
}