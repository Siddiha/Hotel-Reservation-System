import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import Rooms        from './pages/Rooms.jsx'
import Reservations from './pages/Reservations.jsx'
import Invoice      from './pages/Invoice.jsx'
import Login        from './pages/Login.jsx'
import Register     from './pages/Register.jsx'

function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const username  = localStorage.getItem('username')
  const role      = localStorage.getItem('role')

  const logout = () => {
    ;['token', 'role', 'userId', 'username'].forEach(k => localStorage.removeItem(k))
    navigate('/login')
  }

  const isAuth = location.pathname === '/login' || location.pathname === '/register'
  if (isAuth) return null

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0A1628 0%, #112240 100%)',
      borderBottom: '1px solid rgba(201,168,76,0.3)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)'
    }}>
      <Link to="/rooms" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#C9A84C', fontSize: '22px' }}>✦</span>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          color: '#fff',
          fontSize: '20px',
          fontWeight: '600',
          letterSpacing: '1px'
        }}>The Grand Hotel</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {username ? (
          <>
            <NavLink to="/rooms" current={location.pathname}>Rooms</NavLink>
            <NavLink to="/reservations" current={location.pathname}>My Reservations</NavLink>
            <div style={{
              margin: '0 12px',
              padding: '6px 14px',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '20px',
              color: '#C9A84C',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              {username} · {role}
            </div>
            <button onClick={logout} style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '7px 18px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.target.style.borderColor = '#C9A84C'; e.target.style.color = '#C9A84C' }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; e.target.style.color = '#fff' }}
            >Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" current={location.pathname}>Login</NavLink>
            <NavLink to="/register" current={location.pathname}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

function NavLink({ to, children, current }) {
  const active = current === to
  return (
    <Link to={to} style={{
      color: active ? '#C9A84C' : 'rgba(255,255,255,0.8)',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      padding: '8px 14px',
      borderRadius: '6px',
      background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
      transition: 'all 0.2s',
      letterSpacing: '0.3px'
    }}>{children}</Link>
  )
}

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/rooms"        element={<PrivateRoute><Rooms /></PrivateRoute>} />
        <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
        <Route path="/invoice/:id"  element={<PrivateRoute><Invoice /></PrivateRoute>} />
        <Route path="/"             element={<Navigate to="/rooms" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
