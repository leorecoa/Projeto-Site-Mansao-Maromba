import Link from 'next/link';

export default function AdminProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <aside className="w-64 bg-zinc-900 p-6">
        <h2 className="text-yellow-500 font-bold mb-6">Admin</h2>
        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/products">Produtos</Link>
          <Link href="/admin/orders">Pedidos</Link>
          <Link href="/admin/customers">Clientes</Link>
        </nav>
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
