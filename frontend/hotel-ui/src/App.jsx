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

function Footer() {
  const location = useLocation()
  const isAuth = location.pathname === '/login' || location.pathname === '/register'
  if (isAuth) return null

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #060e1a 0%, #0A1628 100%)',
      borderTop: '1px solid rgba(201,168,76,0.2)',
      padding: '60px 60px 30px',
      marginTop: 'auto'
    }}>
      {/* Top divider line */}
      <div style={{
        width: '60px', height: '2px',
        background: 'linear-gradient(90deg, #C9A84C, #E8C96A)',
        marginBottom: '48px'
      }} />

      {/* Footer grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '40px',
        marginBottom: '48px'
      }}>

        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ color: '#C9A84C', fontSize: '20px' }}>✦</span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              color: '#fff', fontSize: '20px', fontWeight: '600', letterSpacing: '1px'
            }}>The Grand Hotel</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.8, maxWidth: '260px', margin: '0 0 24px' }}>
            Experience unparalleled luxury and comfort. Where every stay becomes an unforgettable memory in the heart of the city.
          </p>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {['f', 'in', 'tw', 'ig'].map(s => (
              <div key={s} style={{
                width: '36px', height: '36px',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(201,168,76,0.7)',
                fontSize: '11px', fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.color = 'rgba(201,168,76,0.7)'; e.currentTarget.style.background = 'transparent' }}
              >{s}</div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{
            color: '#C9A84C', fontSize: '11px', fontWeight: '600',
            letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '20px', fontFamily: "'Inter', sans-serif"
          }}>Quick Links</h4>
          {[
            { label: 'Browse Rooms', to: '/rooms' },
            { label: 'My Reservations', to: '/reservations' },
            { label: 'Sign In', to: '/login' },
            { label: 'Register', to: '/register' },
          ].map(({ label, to }) => (
            <div key={label} style={{ marginBottom: '12px' }}>
              <Link to={to} style={{
                color: 'rgba(255,255,255,0.5)', fontSize: '14px',
                textDecoration: 'none', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = '#C9A84C'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
              >→ {label}</Link>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div>
          <h4 style={{
            color: '#C9A84C', fontSize: '11px', fontWeight: '600',
            letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '20px', fontFamily: "'Inter', sans-serif"
          }}>Amenities</h4>
          {['Free Wi-Fi', 'Swimming Pool', 'Spa & Wellness', 'Fine Dining', 'Concierge', '24/7 Room Service'].map(a => (
            <div key={a} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '12px' }}>
              ✓ {a}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{
            color: '#C9A84C', fontSize: '11px', fontWeight: '600',
            letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '20px', fontFamily: "'Inter', sans-serif"
          }}>Contact Us</h4>
          {[
            { icon: '📍', text: '123 Luxury Avenue\nCity Center, 00100' },
            { icon: '📞', text: '+1 (800) 123-4567' },
            { icon: '✉️', text: 'concierge@grandhotel.com' },
            { icon: '🕐', text: 'Check-in: 3:00 PM\nCheck-out: 11:00 AM' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', marginTop: '1px' }}>{icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: 0 }}>
          © 2025 The Grand Hotel. All rights reserved. Built with WSO2 API Manager & Identity Server.
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
            <span key={t} style={{
              color: 'rgba(255,255,255,0.3)', fontSize: '12px', cursor: 'pointer', transition: 'color 0.2s'
            }}
              onMouseEnter={e => e.target.style.color = '#C9A84C'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >{t}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/login"        element={<Login />} />
            <Route path="/register"     element={<Register />} />
            <Route path="/rooms"        element={<PrivateRoute><Rooms /></PrivateRoute>} />
            <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
            <Route path="/invoice/:id"  element={<PrivateRoute><Invoice /></PrivateRoute>} />
            <Route path="/"             element={<Navigate to="/rooms" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
