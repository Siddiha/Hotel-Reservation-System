import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Rooms from './pages/Rooms.jsx'
import Reservations from './pages/Reservations.jsx'
import Invoice from './pages/Invoice.jsx'

function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <span className="navbar-brand fw-bold">Hotel System</span>
      {user ? (
        <div className="d-flex ms-auto gap-3 align-items-center">
          <Link className="nav-link text-white" to="/rooms">Rooms</Link>
          <Link className="nav-link text-white" to="/reservations">My Reservations</Link>
          <span className="text-secondary small">Logged in as <strong className="text-light">{user.username}</strong> ({user.role})</span>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
        </div>
      ) : (
        <div className="d-flex ms-auto gap-2">
          <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
          <Link className="btn btn-light btn-sm" to="/register">Register</Link>
        </div>
      )}
    </nav>
  )
}

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/rooms" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
            <Route path="/reservations" element={<PrivateRoute><Reservations /></PrivateRoute>} />
            <Route path="/invoice/:id" element={<PrivateRoute><Invoice /></PrivateRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
