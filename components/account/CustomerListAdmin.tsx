import React, { useState } from 'react';
import {
    Search,
    Filter,
    Mail,
    Phone,
    MoreVertical,
    Users
} from 'lucide-react';

type CustomerStatus = 'Active' | 'Blocked' | 'Inactive';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: CustomerStatus;
    totalSpent: number;
    lastOrderDate: string;
    avatar: string;
}

const MOCK_CUSTOMERS: Customer[] = [
    {
        id: '1',
        name: 'Carlos Silva',
        email: 'carlos.silva@email.com',
        phone: '(11) 99999-1234',
        status: 'Active',
        totalSpent: 1250.00,
        lastOrderDate: '2023-10-20',
        avatar: 'CS'
    },
    {
        id: '2',
        name: 'Ana Souza',
        email: 'ana.souza@email.com',
        phone: '(21) 98888-5678',
        status: 'Active',
        totalSpent: 450.50,
        lastOrderDate: '2023-10-15',
        avatar: 'AS'
    },
    {
        id: '3',
        name: 'Roberto Oliveira',
        email: 'roberto.o@email.com',
        phone: '(31) 97777-4321',
        status: 'Inactive',
        totalSpent: 0.00,
        lastOrderDate: '-',
        avatar: 'RO'
    },
    {
        id: '4',
        name: 'Fernanda Lima',
        email: 'fernanda.lima@email.com',
        phone: '(41) 96666-8765',
        status: 'Blocked',
        totalSpent: 89.90,
        lastOrderDate: '2023-09-10',
        avatar: 'FL'
    },
    {
        id: '5',
        name: 'João Pedro',
        email: 'joao.pedro@email.com',
        phone: '(11) 95555-0987',
        status: 'Active',
        totalSpent: 2300.00,
        lastOrderDate: '2023-10-24',
        avatar: 'JP'
    }
];

export default function CustomerListAdmin() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // Filter Logic
    const filteredCustomers = MOCK_CUSTOMERS.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
                    <p className="text-sm text-gray-500">Gerencie sua base de clientes</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Exportar
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative">
                        <select
                            className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Todos Status</option>
                            <option value="Active">Ativo</option>
                            <option value="Inactive">Inativo</option>
                            <option value="Blocked">Bloqueado</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <Filter className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gasto</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Último Pedido</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                {customer.avatar}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                <div className="text-xs text-gray-500">ID: #{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                customer.status === 'Blocked' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {customer.status === 'Active' ? 'Ativo' : customer.status === 'Blocked' ? 'Bloqueado' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">R$ {customer.totalSpent.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{customer.lastOrderDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-indigo-600 transition-colors"><MoreVertical className="h-5 w-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
                            <p className="mt-1 text-sm text-gray-500">Tente ajustar seus filtros ou busca.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}