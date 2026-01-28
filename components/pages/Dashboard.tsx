// components/pages/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar'; // <-- CORRETO: '../layout/Navbar'
import { useAuth } from '../../hooks/useAuth'; // <-- CORRETO: '../../hooks/useAuth'
import type { Theme } from '../../types'; // <-- CORRETO: '../../types'

const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();

    const dashboardTheme: Theme = {
        primary: '#ff9900',
        secondary: '#663300',
        glow: 'rgba(255, 153, 0, 0.5)',
        text: '#FFFFFF',
        bg: 'linear-gradient(180deg, #1a0000 0%, #000000 100%)'
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <Navbar theme={dashboardTheme} />

            <main className="container mx-auto px-4 py-12 pt-24">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                                <p className="text-gray-400">Bem-vindo de volta, {user?.email}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <img
                                    src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=random`}
                                    alt="Avatar"
                                    className="w-12 h-12 rounded-full border-2 border-yellow-500"
                                />
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
                                >
                                    Sair
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 rounded-xl border border-yellow-500/20">
                                <h3 className="text-lg font-semibold text-white mb-2">Meus Pedidos</h3>
                                <p className="text-gray-400 text-sm">Acompanhe seus pedidos</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-xl border border-blue-500/20">
                                <h3 className="text-lg font-semibold text-white mb-2">Configurações</h3>
                                <p className="text-gray-400 text-sm">Gerencie sua conta</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-xl border border-green-500/20">
                                <h3 className="text-lg font-semibold text-white mb-2">Suporte</h3>
                                <p className="text-gray-400 text-sm">Precisa de ajuda?</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                            >
                                ← Voltar para a loja
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;