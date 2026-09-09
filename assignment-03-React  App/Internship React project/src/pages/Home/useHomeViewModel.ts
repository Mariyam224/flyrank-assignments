import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMovies, initialMovies } from './HomeModel'
import { saveFavourite } from '../Favourites/FavouritesModel'
import { useAuth } from '../../context/useAuth'
import type { Movie } from '../../types/omdb'

export function useHomeViewModel() {
  const navigate = useNavigate()
  const { user, authLoading } = useAuth()
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadInitialMovies() {
    setLoading(true)
    setError(null)

    try {
      const results = await initialMovies()
      setMovies(results)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong while loading movies.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadInitialMovies()
  }, [])

  const handleSearch = async () => {
    navigate('/')
    setLoading(true)
    setError(null)

    try {
      const results = await getMovies(query)
      setMovies(results)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong while searching for movies.',
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleFavouriteClick(movie: Movie) {
    if (authLoading) {
      return
    }

    if (!user) {
      navigate('/favourites')
      return
    }

    try {
      await saveFavourite(user.uid, movie)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong while adding the movie to favourites.',
      )
    }
  }

  return { query, setQuery, movies, loading, error, handleSearch, loadInitialMovies, handleFavouriteClick }
}

export type HomeViewModel = ReturnType<typeof useHomeViewModel>