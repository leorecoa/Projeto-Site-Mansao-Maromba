import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user
        setUser(currentUser || null)
        
        if (currentUser) {
          // Buscar a role do usuário na tabela `customers`
          const { data: customerData, error } = await supabase
            .from('customers')
            .select('user_role')
            .eq('auth_user_id', currentUser.id)
            .single()
          
          if (error) {
            console.error('Erro ao buscar role do usuário:', error)
            setUserRole(null)
          } else {
            setUserRole(customerData?.user_role || 'customer')
          }
        } else {
          setUserRole(null)
        }
      }
    )
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const isAdmin = userRole === 'admin'

  return { user, userRole, isAdmin }
}