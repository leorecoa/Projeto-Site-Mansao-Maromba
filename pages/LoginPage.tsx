
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import type { Theme } from '../types'; // Ajustado o caminho para types
import { Mail, Loader, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { signInWithGoogle, signIn, user, loading: authLoading } = useAuth();
    const location = useLocation();

    // Credenciais de teste (fallback)
    const testEmail = 'teste@mansaomaromba.com';
    const testPassword = 'teste123456';

    const from = location.state?.from?.pathname || "/";

    if (authLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader className="animate-spin text-yellow-400" size={40} />
        </div>;
    }

    if (user) {
        return <Navigate to={from} replace />;
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setErrorMessage(err.message || 'Erro ao conectar com Google.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestLogin = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const { error } = await signIn(testEmail, testPassword);
            if (error) setErrorMessage('Credenciais inválidas para o modo teste.');
        } catch (err: any) {
            setErrorMessage(err.message || 'Erro inesperado.');
        } finally {
            setIsLoading(false);
        }
    };

    const loginTheme: Theme = {
        primary: '#facc15',
        secondary: '#111827',
        glow: 'rgba(250, 204, 21, 0.4)',
        text: '#FFFFFF',
        bg: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: loginTheme.bg }}>
            <Navbar theme={loginTheme} />
            
            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decorativo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/10 blur-[120px] rounded-full pointer-events-none" />
                
                <section className="w-full max-w-md glass-card p-10 rounded-[2.5rem] relative z-10 text-center text-reveal shadow-[0_0_80px_rgba(0,0,0,1)]"
                    style={{
                        borderColor: `${loginTheme.primary}40`,
                        boxShadow: `0 0 0px ${loginTheme.primary}00, 0 0 80px rgba(0,0,0,1)` // Mantém sombra preta para profundidade
                    }}
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/30">
                            <ShieldCheck size={40} className="text-yellow-400" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-syncopate font-bold mb-2 tracking-tighter">ACESSO VIP</h1>
                    <p className="text-gray-500 text-sm mb-8 uppercase tracking-widest font-bold">Portal do Depósito Digital</p>

                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold animate-pulse">
                            {errorMessage}
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full group relative flex items-center justify-center gap-4 px-6 py-4 font-black text-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 overflow-hidden"
                            style={{ 
                                backgroundColor: loginTheme.primary, 
                                boxShadow: `0 10px 30px ${loginTheme.glow}` 
                            }}
                        >
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                            {isLoading ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" className="relative z-10">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            <span className="relative z-10 uppercase tracking-tighter text-sm">Entrar com Google</span>
                        </button>

                        <div className="flex items-center gap-4 py-2">
                            <div className="flex-grow h-[1px] bg-white/10" />
                            <span className="text-[10px] text-gray-600 font-black tracking-[0.3em] uppercase">Ou</span>
                            <div className="flex-grow h-[1px] bg-white/10" />
                        </div>

                        <button
                            onClick={handleTestLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 font-bold text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
                        >
                            <Mail size={18} className="text-gray-400" />
                            Acesso de Teste
                        </button>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2 text-gray-600">
                        <Zap size={14} className="text-yellow-400/50" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Segurança Mansão Maromba</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LoginPage;
