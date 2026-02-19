import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { mapAuthErrorMessage } from '../../utils/authErrors';

function sanitizeRedirectPath(input: string | null): string {
  if (!input) return '/';
  if (!input.startsWith('/') || input.startsWith('//')) return '/';
  return input;
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Processando login...');
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const code = searchParams.get('code');
    const redirectPath = sanitizeRedirectPath(searchParams.get('redirect'));

    if (!code) {
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true });
      return;
    }

    const exchangeCode = async () => {
      try {
        setStatus('Finalizando autenticacao...');

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setStatus(mapAuthErrorMessage(error));
          setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true }), 2500);
          return;
        }

        if (data?.session) {
          setStatus('Login concluido. Redirecionando...');
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 900);
          return;
        }

        setStatus('Nao foi possivel concluir o login.');
        setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true }), 2500);
      } catch (err) {
        setStatus(mapAuthErrorMessage(err));
        setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true }), 2500);
      }
    };

    exchangeCode();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-white text-xl mb-2">Finalizando login com Google</p>
        <p className="text-gray-400 text-sm">{status}</p>
      </div>
    </div>
  );
}
