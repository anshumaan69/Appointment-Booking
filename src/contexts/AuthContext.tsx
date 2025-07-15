"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

// What user data looks like
interface User {
  name: string
  email: string
}

// What our context provides
interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Create the context (like a box to store data)
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// The provider component (wraps your app and provides the data)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  // Simple check: if we have a user, they're logged in
  const isLoggedIn = user !== null

  // Login function - call your API and set user data
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (data.success && data.user) {
        setUser(data.user)  // Save user data
        return true         // Login successful
      } else {
        return false        // Login failed
      }
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  // Register function - call your API to create new user
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        return true         // Registration successful
      } else {
        return false        // Registration failed
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  // Logout function - clear user data and call API
  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API failed:', error)
    }
    setUser(null)  // Clear user data regardless
  }

  // Check if user is already logged in when app starts
  const checkIfLoggedIn = async () => {
    try {
      const response = await fetch('/api/me')
      const data = await response.json()
      
      if (data.success && data.user) {
        setUser(data.user)  // User is logged in
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  // Run checkIfLoggedIn when app starts
  useEffect(() => {
    checkIfLoggedIn()
  }, [])

  // Package everything together
  const value = {
    user,
    isLoggedIn,
    login,
    register,
    logout
  }

  // Provide the data to all child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use the auth data in components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
