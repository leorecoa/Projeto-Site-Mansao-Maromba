// app/minha-conta/pedidos/page.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../stores/useAppStore';

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useAppStore((state) => state.user);

    useEffect(() => {
        // Simular carregamento de pedidos
        const loadOrders = async () => {
            setLoading(true);

            // Dados mockados
            const mockOrders: Order[] = [
                {
                    id: 'ORD-001',
                    date: '2024-01-15',
                    total: 249.90,
                    status: 'Entregue',
                    items: [
                        { name: 'Whey Protein 1kg', quantity: 1, price: 89.90 },
                        { name: 'Creatina 300g', quantity: 2, price: 80.00 }
                    ]
                },
                {
                    id: 'ORD-002',
                    date: '2024-01-10',
                    total: 129.50,
                    status: 'Enviado',
                    items: [
                        { name: 'BCAA 200g', quantity: 1, price: 49.50 },
                        { name: 'Glutamina 250g', quantity: 1, price: 80.00 }
                    ]
                },
                {
                    id: 'ORD-003',
                    date: '2024-01-05',
                    total: 320.00,
                    status: 'Processando',
                    items: [
                        { name: 'Pré-Treino 300g', quantity: 1, price: 120.00 },
                        { name: 'Barra Proteica 60g', quantity: 5, price: 40.00 }
                    ]
                }
            ];

            await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
            setOrders(mockOrders);
            setLoading(false);
        };

        loadOrders();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Carregando seus pedidos...</p>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <header className="page-header">
                <h1>Meus Pedidos</h1>
                <p>Acompanhe todos os seus pedidos realizados</p>
            </header>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <div className="empty-icon">📦</div>
                    <h2>Nenhum pedido encontrado</h2>
                    <p>Você ainda não realizou nenhum pedido na Mansão Maromba</p>
                    <Link to="/" className="btn-primary">
                        Ver Produtos
                    </Link>
                </div>
            ) : (
                <div className="orders-container">
                    <div className="orders-summary">
                        <div className="summary-card">
                            <h3>Total de Pedidos</h3>
                            <p className="summary-number">{orders.length}</p>
                        </div>
                        <div className="summary-card">
                            <h3>Valor Total</h3>
                            <p className="summary-number">
                                R$ {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id-status">
                                        <h3>Pedido #{order.id}</h3>
                                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="order-date-total">
                                        <span className="order-date">
                                            {new Date(order.date).toLocaleDateString('pt-BR')}
                                        </span>
                                        <span className="order-total">
                                            R$ {order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-items">
                                    <h4>Itens do Pedido:</h4>
                                    <ul>
                                        {order.items.map((item, index) => (
                                            <li key={index} className="order-item">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-quantity">x{item.quantity}</span>
                                                <span className="item-price">
                                                    R$ {(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="order-actions">
                                    <Link to={`/minha-conta/pedidos/${order.id}`} className="btn-outline">
                                        Ver Detalhes
                                    </Link>
                                    {order.status === 'Entregue' && (
                                        <button className="btn-outline">
                                            Devolver Produto
                                        </button>
                                    )}
                                    {order.status === 'Enviado' && (
                                        <button className="btn-outline">
                                            Rastrear Pedido
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="page-help">
                <h3>Precisa de ajuda?</h3>
                <p>
                    Em caso de dúvidas sobre seus pedidos, entre em contato com nosso suporte:
                    <br />
                    📞 (11) 99999-9999 | ✉️ suporte@mansaomaromba.com
                </p>
            </div>
        </div>
    );
};

export default MyOrdersPage;