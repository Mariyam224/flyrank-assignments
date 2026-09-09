import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'

export interface AuthContextValue {
  // The currently signed-in Firebase user, or null when signed out.
  user: User | null
  // True while Firebase is restoring the session on startup.
  authLoading: boolean
  // Signs out the currently signed-in user.
  logout: () => Promise<void>
}

export interface AuthProviderProps {
  // The children rendered inside the auth provider.
  children: ReactNode
}