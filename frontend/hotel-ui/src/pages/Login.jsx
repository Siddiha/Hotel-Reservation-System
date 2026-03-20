import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userApi } from '../api'

export default function Login() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await userApi.post('/api/auth/login', form)
      localStorage.setItem('token',    data.token)
      localStorage.setItem('role',     data.role)
      localStorage.setItem('userId',   String(data.userId))
      localStorage.setItem('username', form.username)
      navigate('/rooms')
    } catch (err) {
      setError(err.response?.status === 401 ? 'Invalid username or password.' : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0A1628 0%, #112240 60%, #1a3a5c 100%)'
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ color: '#C9A84C', fontSize: '48px', marginBottom: '16px' }}>✦</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: '48px',
            fontWeight: '700',
            lineHeight: 1.2,
            marginBottom: '20px'
          }}>The Grand<br /><em>Hotel</em></h1>
          <div style={{
            width: '60px', height: '2px',
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            margin: '0 auto 24px'
          }} />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.7, maxWidth: '320px' }}>
            Experience unparalleled luxury and comfort in the heart of the city. Where every stay becomes an unforgettable memory.
          </p>
          <div style={{ display: 'flex', gap: '32px', marginTop: '48px', justifyContent: 'center' }}>
            {[['500+', 'Rooms'], ['98%', 'Satisfaction'], ['24/7', 'Service']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#C9A84C', fontSize: '24px', fontWeight: '700', fontFamily: "'Playfair Display', serif" }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        width: '460px',
        background: '#F8F5F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 50px'
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '32px',
          color: '#0A1628',
          marginBottom: '8px'
        }}>Welcome Back</h2>
        <p style={{ color: '#7a8599', marginBottom: '36px', fontSize: '15px' }}>
          Sign in to manage your reservations
        </p>

        {error && (
          <div style={{
            background: '#fff0f0', border: '1px solid #ffcccc',
            borderLeft: '4px solid #e74c3c',
            borderRadius: '8px', padding: '12px 16px',
            color: '#c0392b', fontSize: '14px', marginBottom: '20px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0A1628', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Username
            </label>
            <input
              style={inputStyle}
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="Enter your username"
              required
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#0A1628', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              type="password"
              style={inputStyle}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" disabled={loading} style={btnStyle(loading)}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#7a8599' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: '600' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '13px 16px',
  border: '1.5px solid #e0dbd0',
  borderRadius: '8px', fontSize: '15px',
  background: '#fff', color: '#0A1628',
  outline: 'none', transition: 'border-color 0.2s',
  fontFamily: "'Inter', sans-serif"
}

const btnStyle = (loading) => ({
  width: '100%', padding: '14px',
  background: loading ? '#a08030' : 'linear-gradient(135deg, #C9A84C, #E8C96A)',
  border: 'none', borderRadius: '8px',
  color: '#0A1628', fontSize: '15px', fontWeight: '700',
  cursor: loading ? 'not-allowed' : 'pointer',
  letterSpacing: '0.5px', textTransform: 'uppercase',
  boxShadow: '0 4px 15px rgba(201,168,76,0.4)',
  transition: 'all 0.2s'
})
