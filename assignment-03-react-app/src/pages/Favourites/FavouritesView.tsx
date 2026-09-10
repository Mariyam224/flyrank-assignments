import { useFavouritesViewModel } from './useFavouritesViewModel'
import MovieCard from '../../components/MovieCard/MovieCard'
import './FavouritesView.css'

function FavouritesView() {
  const { favourites, loading, error, removeMovie } = useFavouritesViewModel()

  return (
    <section className="favourites">
      {loading && <p className="favourites-status">Loading favourites...</p>}

      {error && (
        <p className="favourites-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && favourites.length === 0 && (
        <p className="favourites-empty">You don't have any favourite movies yet.</p>
      )}

      <ul className="movie-list">
        {favourites.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavourite
            onRemove={() => removeMovie(movie.imdbID)}
          />
        ))}
      </ul>
    </section>
  )
}

export default FavouritesView