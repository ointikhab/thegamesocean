'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type AuthCustomer = {
  id: number
  email: string
  firstName: string
  lastName?: string | null
}

type AuthContextValue = {
  customer: AuthCustomer | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (data: { email: string; password: string; firstName: string; lastName?: string }) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<AuthCustomer | null>(null)
  const [loading, setLoading] = useState(true)

  // Hydrate on mount — check if already logged in
  useEffect(() => {
    fetch('/api/customers/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setCustomer(data.user)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data?.errors?.[0]?.message ?? 'Invalid email or password.' }
      setCustomer(data.user)
      return {}
    } catch {
      return { error: 'Network error. Please try again.' }
    }
  }, [])

  const signup = useCallback(async (payload: { email: string; password: string; firstName: string; lastName?: string }) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) return { error: data?.errors?.[0]?.message ?? 'Registration failed. Try a different email.' }
      // Auto-login after signup
      const loginResult = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: payload.email, password: payload.password }),
      })
      const loginData = await loginResult.json()
      if (loginResult.ok) setCustomer(loginData.user)
      return {}
    } catch {
      return { error: 'Network error. Please try again.' }
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/customers/logout', { method: 'POST', credentials: 'include' })
    setCustomer(null)
  }, [])

  const value = useMemo(() => ({ customer, loading, login, signup, logout }), [customer, loading, login, signup, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
