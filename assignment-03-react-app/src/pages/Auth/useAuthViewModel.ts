import { useState } from 'react'
import { login, register } from './AuthModel'

export function useAuthViewModel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleMode() {
    setMode((current) => (current === 'login' ? 'register' : 'login'))
    setError(null)
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }

      setPassword('')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong while authenticating.',
      )
    } finally {
      setLoading(false)
    }
  }

  return { email, setEmail, password, setPassword, mode, toggleMode, loading, error, handleSubmit }
}

export type AuthViewModel = ReturnType<typeof useAuthViewModel>