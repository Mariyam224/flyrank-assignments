import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

interface HeaderProps {
  query: string
  onQueryChange: (value: string) => void
  onSearch: () => void
  onHome: () => void
  isLoggedIn: boolean
  onLogin: () => void
  onLogout: () => void
}

function Header({ query, onQueryChange, onSearch, onHome, isLoggedIn, onLogin, onLogout }: HeaderProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch()
  }

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link" onClick={() => onHome()}>
          Home
        </Link>
        <Link to="/favourites" className="nav-link">
          Favourites
        </Link>
      </nav>
      <div className="header-actions">
        <form className="search" role="search" onSubmit={handleSubmit}>
          <input
            type="search"
            className="search-input"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search"
            aria-label="Search"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        {isLoggedIn ? (
          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button type="button" className="login-button" onClick={onLogin}>
            Login
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
