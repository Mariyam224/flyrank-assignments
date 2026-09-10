// Global authentication provider.
// Provides the current Firebase user, an authLoading flag that is true while
// Firebase restores the session, and a logout action.

import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { logoutUser, subscribeToAuthChanges } from '../services/authService'
import { AuthContext } from './authContextValue'
import type { AuthProviderProps } from '../types/auth'

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })

    return unsubscribe
  }, [])

  async function logout() {
    await logoutUser()
  }

  return <AuthContext.Provider value={{ user, authLoading, logout }}>{children}</AuthContext.Provider>
}