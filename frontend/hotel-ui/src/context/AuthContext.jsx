import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

/**
 * Persists auth state in localStorage so it survives a page refresh.
 * Stored keys: token, role, userId, username
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    return {
      token,
      role:     localStorage.getItem('role'),
      userId:   localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
    }
  })

  /** Called after a successful /api/auth/login response */
  const login = ({ token, role, userId, username }) => {
    localStorage.setItem('token',    token)
    localStorage.setItem('role',     role)
    localStorage.setItem('userId',   userId)
    localStorage.setItem('username', username)
    setUser({ token, role, userId, username })
  }

  const logout = () => {
    ;['token', 'role', 'userId', 'username'].forEach(k => localStorage.removeItem(k))
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
