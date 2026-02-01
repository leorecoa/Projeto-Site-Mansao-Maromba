import Link from 'next/link'

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar" style={{ background: 'var(--color-secondary)', color: 'var(--color-text)' }}>
      <nav>
        <ul>
          <li><Link href="/admin/dashboard">Dashboard</Link></li>
          <li><Link href="/admin/products">Produtos</Link></li>
          <li><Link href="/admin/orders">Pedidos</Link></li>
          <li><Link href="/admin/customers">Clientes</Link></li>
          {/* Adicionar mais links conforme necessário */}
        </ul>
      </nav>
    </aside>
  )
}

export default AdminSidebar