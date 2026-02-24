import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ErrorPage({
  title = 'Algo deu errado',
  message = 'Desculpe, encontramos um erro inesperado. Tente novamente.',
  actionLabel = 'Recarregar pagina',
  onAction,
}: ErrorPageProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900/20 rounded-full mb-6 border border-red-500/30">
          <AlertOctagon className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">{message}</p>
        <button
          onClick={handleAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
