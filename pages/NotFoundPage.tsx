import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900 rounded-full mb-6 border border-white/10">
          <AlertTriangle className="w-10 h-10 text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Página não encontrada</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Ops! Parece que você tentou acessar uma página que não existe ou foi movida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors"
        >
          <Home className="w-5 h-5" />
          Voltar para o Início
        </button>
      </div>
    </div>
  );
}
