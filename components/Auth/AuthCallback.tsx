import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession(); // pega a sessão atual
      if (error) {
        console.error('Erro no callback do Google:', error.message);
        navigate('/login');
        return;
      }

      if (!data.session) {
        // Se não houver sessão, volta para login
        navigate('/login');
        return;
      }

      // Sessão válida, redireciona para dashboard
      navigate('/dashboard');
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      Processando login...
    </div>
  );
};

export default AuthCallback;
