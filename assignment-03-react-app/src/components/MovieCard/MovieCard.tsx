import type { Movie } from '../../types/omdb'
import './MovieCard.css'

interface MovieCardProps {
  movie: Movie
  isFavourite?: boolean
  onAdd?: (movie: Movie) => void
  onRemove?: (movie: Movie) => void
}

function MovieCard({ movie, isFavourite = false, onAdd, onRemove }: MovieCardProps) {
  return (
    <li className="movie-list-item">
      {movie.Poster !== 'N/A' ? (
        <img
          src={movie.Poster}
          alt={`${movie.Title} poster`}
          className="movie-poster"
        />
      ) : (
        <div className="movie-poster movie-poster-placeholder">No poster</div>
      )}
      <h2 className="movie-title">{movie.Title}</h2>
      <p className="movie-meta">{movie.Year}</p>
      <p className="movie-meta">{movie.Type}</p>
      {isFavourite ? (
        <button
          type="button"
          className="movie-favourite-button movie-favourite-button-remove"
          onClick={() => onRemove?.(movie)}
        >
          Remove
        </button>
      ) : (
        <button
          type="button"
          className="movie-favourite-button"
          onClick={() => onAdd?.(movie)}
        >
          Favourite
        </button>
      )}
    </li>
  )
}

export default MovieCard