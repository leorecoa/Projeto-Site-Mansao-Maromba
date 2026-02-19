import React from 'react';

interface Props {
  status: string;
}

export default function OrderStatusBadge({ status }: Props) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case 'confirmed':
        return { label: 'Confirmado', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'processing':
        return { label: 'Processando', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'shipped':
        return { label: 'Enviado', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
      case 'delivered':
        return { label: 'Entregue', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
      case 'cancelled':
        return { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
      default:
        return { label: status, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      {config.label}
    </span>
  );
}
