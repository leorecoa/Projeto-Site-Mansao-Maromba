// components/pages/Profile.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth'; // <-- CORRETO: '../../hooks/useAuth'
import Navbar from '../layout/Navbar'; // <-- CORRETO: '../layout/Navbar'
import type { ProductTheme } from '../../types'; // <-- CORRETO: '../../types'

const Profile: React.FC = () => {
    const { user } = useAuth();

    const profileTheme: ProductTheme = {
        primary: '#9b59b6',
        secondary: '#2c003e',
        glow: 'rgba(155, 89, 182, 0.5)',
        text: '#FFFFFF',
        bg: 'linear-gradient(180deg, #1a0000 0%, #000000 100%)'
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <Navbar theme={profileTheme} />

            <main className="container mx-auto px-4 py-12 pt-24">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                        <h1 className="text-3xl font-bold text-white mb-8">Meu Perfil</h1>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=random`}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-full border-2 border-purple-500"
                                />
                                <div>
                                    <h2 className="text-xl font-semibold text-white">{user?.email}</h2>
                                    <p className="text-gray-400">Membro desde {new Date(user?.created_at || '').toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <h3 className="text-gray-400 text-sm mb-1">Email</h3>
                                    <p className="text-white">{user?.email}</p>
                                </div>

                                <div className="bg-white/5 p-4 rounded-lg">
                                    <h3 className="text-gray-400 text-sm mb-1">ID do Usuário</h3>
                                    <p className="text-white text-sm font-mono truncate">{user?.id}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-4">Configurações</h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                        <span className="text-white">Alterar email</span>
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                        <span className="text-white">Alterar senha</span>
                                    </button>
                                    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                        <span className="text-white">Notificações</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;