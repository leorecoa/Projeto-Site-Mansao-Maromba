import React, { useState } from 'react';
import { User, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import ProfileForm from '@/components/account/ProfileForm';
import MyOrders from '@/components/account/MyOrders';

type Tab = 'profile' | 'orders';

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const { signOut } = useAuth();
    const { navigate } = useNavigation();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black pt-20 sm:pt-24 pb-12 px-3 sm:px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Minha Conta</h1>
                    <button
                        onClick={handleLogout}
                        data-testid="logout-button"
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4 mb-8 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'profile' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Meus Dados
                        {activeTab === 'profile' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'orders' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Meus Pedidos
                        {activeTab === 'orders' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400" />
                        )}
                    </button>
                </div>

                <div className="animate-fade-in">
                    {activeTab === 'profile' ? <ProfileForm /> : <MyOrders />}
                </div>
            </div>
        </div>
    );
}
