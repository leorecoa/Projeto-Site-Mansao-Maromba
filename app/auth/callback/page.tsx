import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabase';



const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate('/minha-conta', { replace: true });
      } else {
        navigate('/login?error=auth_failed', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div>
        <h1>Processando autenticação...</h1>
        <p>Você será redirecionado.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
