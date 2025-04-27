import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface User {
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
      username,
      password,
      grant_type: 'password'
    }))
    const token = response.data.access_token
    localStorage.setItem('token', token)
    await fetchUser(token)
  }

  const register = async (username: string, email: string, password: string) => {
    await axios.post(`${API_URL}/register`, { username, email, password })
    await login(username, password)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const fetchUser = async (token: string) => {
    try {
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(userResponse.data)
    } catch (err) {
      console.error('Failed to fetch user', err)
      logout()
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser(token)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
