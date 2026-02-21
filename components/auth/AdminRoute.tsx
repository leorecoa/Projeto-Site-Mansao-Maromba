import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function AdminRoute() {
  const { isAdmin, isAuthenticated, loading, profileLoading, profileResolved, profileError } = useAuth();

  const isAuthorizing = loading || (isAuthenticated && (!profileResolved || profileLoading));

  if (isAuthorizing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="text-gray-300">Verificando permissoes...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Falha transitoria de perfil nao deve forcar logout imediato.
  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="max-w-md text-center bg-zinc-900 border border-white/10 rounded-xl p-6">
          <p className="text-red-400 font-semibold mb-2">Falha ao verificar permissoes</p>
          <p className="text-gray-400 text-sm mb-4">{profileError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
