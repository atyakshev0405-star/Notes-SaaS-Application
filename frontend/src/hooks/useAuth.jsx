import { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verify token and get user info
      axios.get('/auth/me').then(res => {
        setUser(res.data)
      }).catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        delete axios.defaults.headers.common['Authorization']
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password })
    const { access_token, refresh_token } = res.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    
    // Get user info
    const userRes = await axios.get('/auth/me')
    setUser(userRes.data)
  }

  const logout = async () => {
    try {
      await axios.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const register = async (email, password) => {
    const res = await axios.post('/auth/register', { email, password })
    const { access_token, refresh_token } = res.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    
    // Get user info
    const userRes = await axios.get('/auth/me')
    setUser(userRes.data)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
