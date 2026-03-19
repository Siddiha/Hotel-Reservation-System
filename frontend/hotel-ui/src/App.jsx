import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Rooms        from './pages/Rooms.jsx'
import Reservations from './pages/Reservations.jsx'
import Invoice      from './pages/Invoice.jsx'
import Login        from './pages/Login.jsx'
import Register     from './pages/Register.jsx'

function Navbar() {
  const navigate   = useNavigate()
  const username   = localStorage.getItem('username')
  const role       = localStorage.getItem('role')

  const logout = () => {
    ;['token', 'role', 'userId', 'username'].forEach(k => localStorage.removeItem(k))
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <span className="navbar-brand fw-bold">Hotel Reservation System</span>
      <div className="d-flex ms-auto gap-3 align-items-center">
        {username ? (
          <>
            <Link className="nav-link text-white" to="/rooms">Rooms</Link>
            <Link className="nav-link text-white" to="/reservations">My Reservations</Link>
            <span className="text-secondary small">{username} ({role})</span>
            <button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="nav-link text-white" to="/login">Login</Link>
            <Link className="nav-link text-white" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

// Redirect to /login if no token
function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rooms"    element={<PrivateRoute><Rooms /></PrivateRoute>} />
          <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
          <Route path="/invoice/:id"  element={<PrivateRoute><Invoice /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/rooms" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
