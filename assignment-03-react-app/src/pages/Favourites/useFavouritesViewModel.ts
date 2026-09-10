import { useCallback, useEffect, useState } from 'react'
import { deleteFavourite, loadFavourites } from './FavouritesModel'
import { useAuth } from '../../context/useAuth'
import type { Movie } from '../../types/omdb'

export function useFavouritesViewModel() {
  const { user } = useAuth()
  const [favourites, setFavourites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMovies = useCallback(async () => {
    if (!user) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await loadFavourites(user.uid)
      setFavourites(results)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong while loading favourite movies.',
      )
    } finally {
      setLoading(false)
    }
  }, [user])

  async function removeMovie(imdbID: string) {
    if (!user) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await deleteFavourite(user.uid, imdbID)
      setFavourites((current) => current.filter((movie) => movie.imdbID !== imdbID))
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong while removing the movie.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMovies()
  }, [loadMovies])

  return { favourites, loading, error, loadMovies, removeMovie }
}

export type FavouritesViewModel = ReturnType<typeof useFavouritesViewModel>