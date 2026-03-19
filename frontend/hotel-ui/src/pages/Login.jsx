import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { userApi } from '../api'

export default function Login() {
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await userApi.post('/api/auth/login', form)
      // Store token + user info from user-service response
      localStorage.setItem('token',    data.token)
      localStorage.setItem('role',     data.role)
      localStorage.setItem('userId',   data.userId)
      localStorage.setItem('username', form.username)
      navigate('/rooms')
    } catch (err) {
      setError(err.response?.status === 401 ? 'Invalid username or password.' : 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h4 className="text-center mb-4">Hotel Login</h4>
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
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
            <p className="text-center mt-3 mb-0 small">
              No account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
