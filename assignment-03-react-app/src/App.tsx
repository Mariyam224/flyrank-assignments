import { type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Header from './components/Header'
import AuthView from './pages/Auth/AuthView'
import FavouritesView from './pages/Favourites/FavouritesView'
import HomeView from './pages/Home/HomeView'
import { useHomeViewModel } from './pages/Home/useHomeViewModel'
import { useAuth } from './context/useAuth'
import { resolveRedirect } from './utils/redirect'
import './App.css'

interface RequireAuthProps {
  children: ReactNode
}

function RequireAuth({ children }: RequireAuthProps) {
  const { user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return <p className="auth-loading">Loading...</p>
  }

  if (!user) {
    const target = `${location.pathname}${location.search}`
    const search = new URLSearchParams({ redirect: target })
    return <Navigate to={`/auth?${search.toString()}`} replace />
  }

  return children
}

interface RedirectIfAuthedProps {
  children: ReactNode
}

function RedirectIfAuthed({ children }: RedirectIfAuthedProps) {
  const { user, authLoading } = useAuth()
  const [searchParams] = useSearchParams()

  if (authLoading) {
    return <p className="auth-loading">Loading...</p>
  }

  if (user) {
    return <Navigate to={resolveRedirect(searchParams.get('redirect'), '/')} replace />
  }

  return children
}

function App() {
  const homeViewModel = useHomeViewModel()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch {
      // The auth service already logs sign-out failures; stay on the current page.
    }
  }

  return (
    <>
      <Header
        query={homeViewModel.query}
        onQueryChange={homeViewModel.setQuery}
        onSearch={homeViewModel.handleSearch}
        onHome={homeViewModel.loadInitialMovies}
        isLoggedIn={user != null}
        onLogin={() => navigate('/auth')}
        onLogout={() => {
          void handleLogout()
        }}
      />
      <Routes>
        <Route path="/" element={<HomeView viewModel={homeViewModel} />} />
        <Route
          path="/auth"
          element={
            <RedirectIfAuthed>
              <AuthView />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/favourites"
          element={
            <RequireAuth>
              <FavouritesView />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  )
}

export default App

