import { Link } from 'react-router-dom'
import { supabase } from '../../supabase'
import GoogleLoginButton from '../Auth/GoogleLoginButton'

const LoginPage = () => {
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })

        if (error) {
            console.error(error)
            alert(error.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 max-w-md w-full border border-white/20">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <div className="text-2xl font-bold text-white">
                            Mansão<span className="text-yellow-400">Maromba</span>
                        </div>
                    </Link>

                    <h1 className="text-3xl font-bold text-white mb-2">
                        Entre na sua conta
                    </h1>
                    <p className="text-gray-300">
                        Acesse seus pedidos e benefícios exclusivos
                    </p>
                </div>

                <div className="space-y-4">
                    <GoogleLoginButton onClick={handleGoogleLogin} />

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-gray-400">
                                Ou continue com email
                            </span>
                        </div>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
                        >
                            Entrar
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            Novo por aqui?{' '}
                            <span className="text-yellow-400 font-medium">
                                Use o Google para criar sua conta
                            </span>
                        </p>
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            to="/"
                            className="text-gray-400 hover:text-white text-sm"
                        >
                            ← Voltar para a loja
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
