import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { searchMovies } from './services/omdbMovieService'

// TEMPORARY debug check: runs a search on startup to verify the OMDb service works.
if (import.meta.env.DEV) {
  searchMovies('batman')
    .then((movies) => {
      console.log('[debug] searchMovies succeeded, result count:', movies.length, movies)
    })
    .catch((error: unknown) => {
      console.error('[debug] searchMovies failed:', error instanceof Error ? error.message : error)
    })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
