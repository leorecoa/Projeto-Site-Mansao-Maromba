import AdminSidebar from '@/components/Admin/AdminSidebar'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({ children }) {
  const { isAdmin, user, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login') // Redireciona para login se não estiver autenticado
    } else if (user && !isAdmin) {
      router.push('/') // Redireciona para home se não for admin
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return <div>Carregando ou acesso negado...</div> // Ou um spinner de carregamento
  }

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  )
}