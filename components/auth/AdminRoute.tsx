import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';

export function AdminRoute() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [checkingRole, setCheckingRole] = useState<boolean>(true);

    useEffect(() => {
        async function checkAdminRole() {
            if (user) {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (!error && data && data.role === 'admin') {
                    setIsAdmin(true);
                }
            }
            setCheckingRole(false);
        }

        if (!authLoading) checkAdminRole();
    }, [user, authLoading]);

    if (authLoading || checkingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Verificando permissões...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}