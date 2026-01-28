import React from 'react'
import { supabase } from '../../supabase'
import Navbar from '../layout/Navbar'
import type { Theme } from '../../types'
import { LogIn } from 'lucide-react'

const LoginPage: React.FC = () => {
    const handleGoogleLogin = async (): Promise<void> => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                throw error
            }
        } catch (err: unknown) {
            /**
             * Supabase pode lançar erros que não são instâncias diretas de Error.
             * Tratamos explicitamente para manter type-safety e previsibilidade.
             */
            if (err instanceof Error) {
                console.error('[Auth][Google]', err.message)
                alert(err.message)
            } else {
                console.error('[Auth][Google] Erro desconhecido', err)
                alert('Falha inesperada ao iniciar login com Google.')
            }
        }
    }

    /**
     * Tema isolado da página de login.
     * Reutiliza o mesmo contrato visual do resto da aplicação.
     */
    const loginTheme: Theme = {
        primary: '#facc15',
        secondary: '#1f2937',
        glow: 'rgba(250, 204, 21, 0.4)',
        text: '#FFFFFF',
        bg: 'linear-gradient(180deg, #111827 0%, #000000 100%)',
    }

    return (
        <div
            className="min-h-screen text-white"
            style={{ background: loginTheme.bg }}
        >
            <Navbar theme={loginTheme} />

            <main className="flex items-center justify-center pt-32 sm:pt-40 px-4">
                <section className="w-full max-w-md p-8 space-y-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 text-center">
                    <h1 className="text-4xl font-bold font-syncopate">
                        Acessar Painel
                    </h1>

                    <p className="text-gray-400">
                        Autentique-se com sua conta Google para continuar.
                    </p>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="
              w-full inline-flex items-center justify-center gap-3
              px-4 py-3 font-semibold text-black
              bg-yellow-400 rounded-lg
              hover:bg-yellow-300 transition-colors duration-300
              focus:outline-none focus:ring-2
              focus:ring-yellow-400 focus:ring-offset-2
              focus:ring-offset-gray-900
            "
                    >
                        <LogIn size={20} />
                        Entrar com Google
                    </button>
                </section>
            </main>
        </div>
    )
}

export default LoginPage
