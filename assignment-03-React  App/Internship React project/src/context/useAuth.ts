// Convenience hook to consume the authentication context.

import { useContext } from 'react'
import { AuthContext } from './authContextValue'
import type { AuthContextValue } from '../types/auth'

/**
 * Returns the current authentication state ({@link AuthContextValue}).
 *
 * @throws If used outside of an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}