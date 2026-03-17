import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userApi } from '../api.js'

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await userApi.post('/api/auth/register', form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch {
      setError('Registration failed. Username may already exist.')
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h4 className="mb-4 text-center">Create Account</h4>
            {success && <div className="alert alert-success py-2">Registered! Redirecting to login...</div>}
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
              <button className="btn btn-success w-100 mt-2">Register</button>
            </form>
            <p className="mt-3 text-center text-muted small">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
