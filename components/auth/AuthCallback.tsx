import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { mapAuthErrorMessage } from '../../utils/authErrors';

function sanitizeRedirectPath(input: string | null): string {
  if (!input) return '/';
  if (!input.startsWith('/') || input.startsWith('//')) return '/';
  return input;
}

const OAUTH_REDIRECT_STORAGE_KEY = 'post_login_redirect_path';
const SESSION_POLL_ATTEMPTS = 6;
const SESSION_POLL_INTERVAL_MS = 300;
const SUCCESS_REDIRECT_DELAY_MS = 120;

function getStoredRedirectPath(): string | null {
  try {
    return sessionStorage.getItem(OAUTH_REDIRECT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function clearStoredRedirectPath() {
  try {
    sessionStorage.removeItem(OAUTH_REDIRECT_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Entrando...');
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const code = searchParams.get('code');
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const hashAccessToken = hashParams.get('access_token');
    const hashRefreshToken = hashParams.get('refresh_token');
    const oauthError = searchParams.get('error_description') || searchParams.get('error');
    const redirectPath = sanitizeRedirectPath(
      searchParams.get('redirect') || getStoredRedirectPath()
    );

    const exchangeCode = async () => {
      try {
        if (oauthError) {
          const readableError = (() => {
            try {
              return decodeURIComponent(oauthError.replace(/\+/g, ' '));
            } catch {
              return oauthError;
            }
          })();
          setStatus(readableError);
          setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true }), 2500);
          return;
        }

        setStatus('Finalizando autenticacao...');

        // If session is already available, continue gracefully.
        const { data: initialSessionData } = await supabase.auth.getSession();
        if (initialSessionData?.session) {
          clearStoredRedirectPath();
          setStatus('Login concluido. Redirecionando...');
          setTimeout(() => navigate(redirectPath, { replace: true }), SUCCESS_REDIRECT_DELAY_MS);
          return;
        }

        // Fallback for implicit hash tokens (some provider/browser combinations).
        if (hashAccessToken && hashRefreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: hashAccessToken,
            refresh_token: hashRefreshToken,
          });

          if (sessionError) {
            setStatus(mapAuthErrorMessage(sessionError));
            setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true }), 2500);
            return;
          }
        }

        if (!code) {
          // Avoid false-negative failures while auth client finalizes OAuth URL parsing.
          for (let attempt = 0; attempt < SESSION_POLL_ATTEMPTS; attempt += 1) {
            const { data: polledSessionData } = await supabase.auth.getSession();
            if (polledSessionData?.session) {
              clearStoredRedirectPath();
              setStatus('Login concluido. Redirecionando...');
              setTimeout(() => navigate(redirectPath, { replace: true }), SUCCESS_REDIRECT_DELAY_MS);
              return;
            }

            await new Promise((resolve) => setTimeout(resolve, SESSION_POLL_INTERVAL_MS));
          }

          setStatus('Nao foi possivel concluir o login. Tente novamente.');
          setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true }), 2500);
          return;
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setStatus(mapAuthErrorMessage(error));
          setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true }), 2500);
          return;
        }

        if (data?.session) {
          clearStoredRedirectPath();
          setStatus('Login concluido. Redirecionando...');
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, SUCCESS_REDIRECT_DELAY_MS);
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
      <div className="text-center max-w-sm px-4">
        <img
          src="https://i.imgur.com/2CMQ6GJ.png"
          alt="Mansao Maromba"
          className="w-14 h-14 object-cover mx-auto mb-4"
        />
        <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-300 text-sm">{status}</p>
      </div>
    </div>
  );
}
