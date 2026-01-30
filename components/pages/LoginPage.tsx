import React, { useState } from 'react'
import Navbar from '../layout/Navbar'
import type { Theme } from '../../types'
import { Mail, Loader } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { signInWithGoogle, signIn, user } = useAuth()
    const location = useLocation()

    const testEmail = import.meta.env.VITE_TEST_EMAIL || 'teste@mansaomaromba.com'
    const testPassword = import.meta.env.VITE_TEST_PASSWORD || 'teste123456'

    // Página de origem ou fallback
    const from = '/'

    const fromState = location.state?.from?.state

    if (user) {
        return <Navigate to={from} state={fromState} replace />
    }

    const handleGoogleLogin = async (): Promise<void> => {
        setIsLoading(true)
        setErrorMessage(null)

        try {
            await signInWithGoogle()
        } catch (err: unknown) {
            setErrorMessage(
                err instanceof Error
                    ? err.message
                    : 'Erro inesperado ao entrar com Google.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleTestLogin = async (): Promise<void> => {
        setIsLoading(true)
        setErrorMessage(null)

        try {
            const { error } = await signIn(testEmail, testPassword)

            if (error) {
                setErrorMessage('Credenciais inválidas. Verifique e tente novamente.')
            }
        } catch (err: unknown) {
            setErrorMessage(
                err instanceof Error
                    ? err.message
                    : 'Erro inesperado ao efetuar login.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const loginTheme: Theme = {
        primary: '#facc15',
        secondary: '#1f2937',
        glow: 'rgba(250, 204, 21, 0.4)',
        text: '#FFFFFF',
        bg: 'linear-gradient(180deg, #111827 0%, #000000 100%)',
    }

    return (
        <div className="min-h-screen text-white" style={{ background: loginTheme.bg }}>
            <Navbar theme={loginTheme} />

            <main className="flex items-center justify-center pt-32 sm:pt-40 px-4">
                <section className="w-full max-w-md p-8 space-y-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 text-center">
                    <h1 className="text-4xl font-bold font-syncopate">
                        Acessar Painel
                    </h1>
                    <p className="text-gray-400">
                        Autentique-se para acessar sua conta
                    </p>

                    {errorMessage && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-left">
                            {errorMessage}
                        </div>
                    )}

                    {/* Google */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? (
                            <Loader className="animate-spin h-5 w-5" />
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {isLoading ? 'Processando…' : 'Entrar com Google'}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 text-gray-400">Ou teste com</span>
                        </div>
                    </div>

                    {/* Teste */}
                    <button
                        onClick={handleTestLogin}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <Mail size={20} />
                        Login de Teste
                    </button>
                </section>
            </main>
        </div>
    )
}

export default LoginPage
