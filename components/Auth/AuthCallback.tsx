import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!isMounted) return

      if (error) {
        console.error('[AuthCallback]', error.message)
        navigate('/login', { replace: true })
        return
      }

      if (data.session) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }

    handleAuth()

    return () => {
      isMounted = false
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Autenticando…
    </div>
  )
}

export default AuthCallback
