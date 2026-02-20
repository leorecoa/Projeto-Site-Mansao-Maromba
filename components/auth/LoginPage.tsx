import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Sparkles } from 'lucide-react';
import { useToast as useToastStore } from '../../store/useToast';
import { mapAuthErrorMessage } from '../../utils/authErrors';

function sanitizeRedirectPath(input: string | null): string {
  if (!input) return '/';
  if (!input.startsWith('/') || input.startsWith('//')) return '/';
  return input;
}

const OAUTH_REDIRECT_STORAGE_KEY = 'post_login_redirect_path';
const LOGIN_PALETTE = ['#facc15', '#ef4444', '#22d3ee', '#ec4899'];

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);
  const { addToast } = useToastStore();
  const redirectPath = sanitizeRedirectPath(searchParams.get('redirect'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) throw error;

        if (data.session) {
          addToast('Cadastro e login concluidos com sucesso.', 'success');
          navigate(redirectPath, { replace: true });
          return;
        }

        addToast('Cadastro realizado. Verifique seu email para confirmar a conta.', 'success');
        setIsSignUp(false);
        setPassword('');
        setLoading(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(mapAuthErrorMessage(err));
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      // Persist redirect target to avoid query-string mismatches in OAuth redirect URL allowlist.
      sessionStorage.setItem(OAUTH_REDIRECT_STORAGE_KEY, redirectPath);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

      if (error) throw error;
    } catch (err) {
      setError(mapAuthErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <style>{`
        @keyframes loginGradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes loginFloat {
          0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate3d(0, -22px, 0) scale(1.08); opacity: 0.6; }
          100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.35; }
        }
      `}</style>

      <div
        className="absolute inset-0 opacity-35"
        style={{
          background: `linear-gradient(120deg, ${LOGIN_PALETTE[0]}22, ${LOGIN_PALETTE[1]}1a, ${LOGIN_PALETTE[2]}1a, ${LOGIN_PALETTE[3]}1a)`,
          backgroundSize: '220% 220%',
          animation: 'loginGradientFlow 14s ease infinite',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08)_0%,transparent_55%)]" />

      <div
        className="absolute top-[-8rem] left-[8%] w-72 h-72 rounded-full blur-3xl"
        style={{ backgroundColor: `${LOGIN_PALETTE[1]}33`, animation: 'loginFloat 7s ease-in-out infinite' }}
      />
      <div
        className="absolute top-[8%] right-[10%] w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: `${LOGIN_PALETTE[2]}33`, animation: 'loginFloat 9s ease-in-out infinite', animationDelay: '0.8s' }}
      />
      <div
        className="absolute bottom-[-7rem] left-[26%] w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${LOGIN_PALETTE[3]}22`, animation: 'loginFloat 10s ease-in-out infinite', animationDelay: '1.4s' }}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="https://i.imgur.com/2CMQ6GJ.png"
              alt="Mansao Maromba Logo"
              className="w-20 h-20 object-cover mx-auto mb-4 shadow-lg shadow-yellow-400/20"
              style={{ borderRadius: '1rem' }}
            />
            <h1 className="text-4xl font-bold font-syncopate bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mb-2">
              Mansao Maromba
            </h1>
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              {isSignUp ? 'Criar sua conta' : 'Bem-vindo de volta'}
            </p>
          </div>

          <div className="relative glass-card rounded-2xl p-8 border border-yellow-400/20 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,rgba(250,204,21,0.1),rgba(34,211,238,0.05),rgba(236,72,153,0.08))]" />
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all"
                  placeholder="........"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40"
              >
                {loading ? 'Carregando...' : isSignUp ? 'Cadastrar' : 'Entrar'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="text-gray-500 text-sm font-medium">ou</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-white/10 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar com Google
            </button>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-yellow-400 hover:text-yellow-300 font-medium text-sm transition-colors"
              >
                {isSignUp ? 'Ja tem conta? Entrar' : 'Nao tem conta? Cadastre-se'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
