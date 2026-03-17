import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userApi } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await userApi.post('/api/auth/login', form)
      login({ ...res.data, username: form.username })
      navigate('/rooms')
    } catch {
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h4 className="mb-4 text-center">Login</h4>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  className="form-control"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  className="form-control"
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button className="btn btn-primary w-100 mt-2">Login</button>
            </form>
            <p className="mt-3 text-center text-muted small">
              No account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
