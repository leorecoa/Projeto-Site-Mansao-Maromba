import { Link } from 'react-router-dom';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">🧪 Teste de Navegação</h1>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400">Rotas Públicas:</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/" className="p-4 bg-zinc-800 rounded hover:bg-zinc-700">
            → Home (/)
          </Link>
          <Link to="/login" className="p-4 bg-zinc-800 rounded hover:bg-zinc-700">
            → Login (/login)
          </Link>
          <Link to="/search" className="p-4 bg-zinc-800 rounded hover:bg-zinc-700">
            → Busca (/search)
          </Link>
          <Link to="/terms" className="p-4 bg-zinc-800 rounded hover:bg-zinc-700">
            → Termos (/terms)
          </Link>
          <Link to="/privacy" className="p-4 bg-zinc-800 rounded hover:bg-zinc-700">
            → Privacidade (/privacy)
          </Link>
          <Link to="/faq" className="p-4 bg-zinc-800 rounded hover:bg-zinc-700">
            → FAQ (/faq)
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-yellow-400 mt-8">Rotas Protegidas:</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/checkout" className="p-4 bg-red-900 rounded hover:bg-red-800">
            🔒 Checkout (/checkout)
          </Link>
          <Link to="/minha-conta" className="p-4 bg-red-900 rounded hover:bg-red-800">
            🔒 Minha Conta (/minha-conta)
          </Link>
          <Link to="/admin" className="p-4 bg-red-900 rounded hover:bg-red-800">
            🔒 Admin (/admin)
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-900 rounded">
          <p className="text-sm">
            ✅ Se você consegue clicar e mudar de página = Navegação OK
            <br />❌ Se nada acontece = Problema no React Router
          </p>
        </div>
      </div>
    </div>
  );
}
