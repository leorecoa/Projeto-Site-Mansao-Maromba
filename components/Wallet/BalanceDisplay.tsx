'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import './BalanceDisplay.css';

interface User {
    id: string;
    name: string;
    email: string;
    balance?: number;
}

interface BalanceDisplayProps {
    compact?: boolean;
    showRefresh?: boolean;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
    compact = false,
    showRefresh = false,
}) => {
    const user = useAppStore((state) => state.user) as User | null;
    const walletBalance = useAppStore((state) => state.walletBalance);
    const updateWalletBalance = useAppStore((state) => state.updateWalletBalance);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            // 🔁 simulação de chamada de API
            await new Promise((resolve) => setTimeout(resolve, 500));

            const newBalance = user.balance ?? Math.random() * 500 + 50;
            updateWalletBalance(Number(newBalance.toFixed(2)));
        } catch (err) {
            console.error(err);
            setError('Falha ao carregar saldo');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBalance();
        }
    }, [user]);

    // 🔒 usuário não logado
    if (!user) {
        if (compact) return null;

        return (
            <div className="balance-display not-logged">
                <span className="text-muted">Faça login para ver o saldo</span>
            </div>
        );
    }

    // ❌ erro
    if (error && !compact) {
        return (
            <div className="balance-display error">
                <span className="error-text">{error}</span>
                {showRefresh && (
                    <button onClick={fetchBalance} className="refresh-btn">
                        🔄
                    </button>
                )}
            </div>
        );
    }

    const safeBalance = Number(walletBalance ?? 0);

    return (
        <div className={`balance-display ${compact ? 'compact' : ''}`}>
            {!compact && <span className="balance-label">Saldo disponível:</span>}

            <div className="balance-content">
                {isLoading ? (
                    <div className="balance-loading">
                        <div className="spinner" />
                        {!compact && <span>Atualizando...</span>}
                    </div>
                ) : (
                    <>
                        <strong className="balance-amount">
                            R$ {safeBalance.toFixed(2)}
                        </strong>

                        {showRefresh && (
                            <button
                                onClick={fetchBalance}
                                className="refresh-btn"
                                disabled={isLoading}
                                aria-label="Atualizar saldo"
                            >
                                🔄
                            </button>
                        )}
                    </>
                )}
            </div>

            {!compact && (
                <div className="balance-user">
                    <small>{user.name}</small>
                </div>
            )}
        </div>
    );
};

export default BalanceDisplay;
