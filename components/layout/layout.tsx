import Link from 'next/link';

export default function MinhaContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-account-layout">
      <header className="account-header">
        <h1>Minha Conta</h1>
        <p>Gerencie suas informações e preferências</p>
      </header>

      <div className="account-content-container">
        <aside className="account-sidebar">
          <nav>
            <ul>
              <li><Link href="/minha-conta">Visão Geral</Link></li>
              <li><Link href="/minha-conta/pedidos">Meus Pedidos</Link></li>
              <li><Link href="/minha-conta/carteira">Carteira</Link></li>
              <li><Link href="/minha-conta/enderecos">Endereços</Link></li>
              <li><Link href="/minha-conta/seguranca">Segurança</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="account-main-content">
          {children} {/* 👈 substitui o Outlet */}
        </main>
      </div>
    </div>
  );
}
