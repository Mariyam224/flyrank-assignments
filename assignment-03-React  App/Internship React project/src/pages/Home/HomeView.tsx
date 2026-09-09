import type { HomeViewModel } from './useHomeViewModel'
import MovieCard from '../../components/MovieCard/MovieCard'
import './HomeView.css'

interface HomeViewProps {
  viewModel: HomeViewModel
}

function HomeView({ viewModel }: HomeViewProps) {
  const { movies, loading, error, handleFavouriteClick } = viewModel

  return (
    <section className="home">
      {loading && <p className="home-status">Loading movies...</p>}

      {error && (
        <p className="home-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && movies.length === 0 && (
        <p className="home-empty">No movies found yet.</p>
      )}

      <ul className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onAdd={handleFavouriteClick} />
        ))}
      </ul>
    </section>
  )
}

export default HomeView