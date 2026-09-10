// The authentication context object.
// The provider component lives in AuthContext.tsx, the consumer hook in
// useAuth.ts, and the AuthContextValue type lives in ../types/auth.ts.

import { createContext } from 'react'
import type { AuthContextValue } from '../types/auth'

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)