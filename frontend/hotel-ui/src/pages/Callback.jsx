import { useEffect } from 'react'
import { useAuthContext } from '@asgardeo/auth-react'
import { useNavigate } from 'react-router-dom'

export default function Callback() {
  const { signIn, state } = useAuthContext()
  const navigate = useNavigate()

  // Exchange the auth code for tokens (called once on mount)
  useEffect(() => {
    signIn().catch(console.error)
  }, [])

  // Navigate once authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/rooms', { replace: true })
    }
  }, [state.isAuthenticated])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A1628 0%, #112240 100%)'
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ color: '#C9A84C', fontSize: '36px', marginBottom: '16px' }}>✦</div>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>Signing you in...</p>
      </div>
    </div>
  )
}
