import type { FormEvent } from 'react'
import { useAuthViewModel } from './useAuthViewModel'
import './AuthView.css'

function AuthView() {
  const { email, setEmail, password, setPassword, mode, toggleMode, loading, error, handleSubmit } =
    useAuthViewModel()

  const isLoginMode = mode === 'login'
  const title = isLoginMode ? 'Login' : 'Create Account'

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void handleSubmit()
  }

  return (
    <section className="auth">
      <form className="auth-form" onSubmit={onSubmit}>
        <h1 className="auth-title">{title}</h1>

        <label className="auth-label" htmlFor="auth-email">
          Email
        </label>
        <input
          id="auth-email"
          type="email"
          className="auth-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <label className="auth-label" htmlFor="auth-password">
          Password
        </label>
        <input
          id="auth-password"
          type="password"
          className="auth-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 6 characters"
          autoComplete={isLoginMode ? 'current-password' : 'new-password'}
          required
        />

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Please wait...' : isLoginMode ? 'Login' : 'Create Account'}
        </button>

        <button type="button" className="auth-toggle" onClick={toggleMode}>
          {isLoginMode ? "Don't have an account? Create one" : 'Already have an account? Login'}
        </button>
      </form>
    </section>
  )
}

export default AuthView