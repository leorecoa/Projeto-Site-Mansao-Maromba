import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase'; // <-- MUDOU AQUI

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          console.log('Usuário logado:', session.user);
          navigate('/dashboard');
        } else {
          setError('Falha na autenticação');
        }
      } catch (error) {
        console.error('Erro no callback:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Processando login...</div>
          <p className="text-gray-400 mt-2">Aguarde enquanto conectamos sua conta</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/10">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Erro no login</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
            >
              Voltar para login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;