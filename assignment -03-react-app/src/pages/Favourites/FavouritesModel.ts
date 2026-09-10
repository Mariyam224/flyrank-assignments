import { addFavourite, getFavourites, removeFavourite } from '../../services/firebaseService'
import type { Movie } from '../../types/omdb'

export interface FavouritesModel {
  // Favourites-specific data and business logic live here.
}

/**
 * Loads all favourite movies for the given user.
 *
 * @param userId The id of the signed-in user whose favourites to load.
 * @returns The list of favourite movies, or an empty array if there are none.
 * @throws If userId is missing or reading from Firebase fails.
 */
export async function loadFavourites(userId: string): Promise<Movie[]> {
  return getFavourites(userId)
}

/**
 * Saves a movie as a favourite for the given user, keyed by its imdbID.
 * Adding a movie that is already a favourite replaces it in place.
 *
 * @param userId The id of the signed-in user the movie belongs to.
 * @param movie The movie to save.
 * @throws If userId is missing, the movie has no imdbID, or the write fails.
 */
export async function saveFavourite(userId: string, movie: Movie): Promise<void> {
  return addFavourite(userId, movie)
}

/**
 * Removes the favourite movie with the given imdbID for the given user.
 * Removing a movie that is not a favourite is a no-op.
 *
 * @param userId The id of the signed-in user the movie belongs to.
 * @param imdbID The unique identifier of the movie to remove.
 * @throws If userId is missing, imdbID is empty, or the removal fails.
 */
export async function deleteFavourite(userId: string, imdbID: string): Promise<void> {
  return removeFavourite(userId, imdbID)
}