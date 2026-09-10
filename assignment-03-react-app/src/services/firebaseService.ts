// Firebase configuration for the application.
// Initializes the Firebase app from environment variables and exposes the
// Authentication, Cloud Firestore, and Realtime Database instances used by
// the rest of the application.
//
// Favourite movies are stored in the Realtime Database under each signed-in
// user's profile using the `users/{userId}/favourites/{imdbID}` structure, so
// every user has their own favourite list and each movie is stored exactly
// once, keyed by its unique imdbID.

import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getDatabase, ref, set, remove, get, type Database } from 'firebase/database'
import type { Movie } from '../types/omdb'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app: FirebaseApp = initializeApp(firebaseConfig)

// Firebase Authentication instance, used for sign-in flows later.
export const auth: Auth = getAuth(app)

// Cloud Firestore instance, used for storing application data.
export const db: Firestore = getFirestore(app)

// Realtime Database instance used by the rest of the application.
export const database: Database = getDatabase(app)

const USERS_PATH = 'users'

/**
 * Guards against favourite operations called without a signed-in user's id.
 *
 * @param userId The id of the signed-in user, or an empty string when missing.
 * @param action A description of the operation, used in the error message.
 * @throws If userId is missing.
 */
function requireUserId(userId: string, action: string): void {
  if (!userId) {
    throw new Error(`Cannot ${action}: a signed-in user is required.`)
  }
}

/** Returns a DatabaseReference to the favourites node of the given user. */
function userFavouritesRef(userId: string) {
  return ref(database, `${USERS_PATH}/${userId}/favourites`)
}

/** Returns a DatabaseReference to a specific favourite movie of the given user. */
function favouriteRef(userId: string, imdbID: string) {
  return ref(database, `${USERS_PATH}/${userId}/favourites/${imdbID}`)
}

/**
 * Saves a movie as a favourite for the given user, keyed by its imdbID.
 * Adding a movie that is already a favourite replaces it in place.
 *
 * @param userId The id of the signed-in user the movie belongs to.
 * @param movie The movie to save.
 * @throws If userId is missing, the movie has no imdbID, or the write fails.
 */
export async function addFavourite(userId: string, movie: Movie): Promise<void> {
  requireUserId(userId, 'add a favourite')

  if (!movie.imdbID) {
    throw new Error('Cannot add a favourite: the movie has no imdbID.')
  }

  try {
    await set(favouriteRef(userId, movie.imdbID), movie)
  } catch (error) {
    console.error('[firebaseService] addFavourite failed:', error)
    throw new Error(`Could not add "${movie.Title}" to favourites.`)
  }
}

/**
 * Removes the favourite movie with the given imdbID for the given user.
 * Removing a movie that is not a favourite is a no-op.
 *
 * @param userId The id of the signed-in user the movie belongs to.
 * @param imdbID The unique identifier of the movie to remove.
 * @throws If userId is missing, imdbID is empty, or the removal fails.
 */
export async function removeFavourite(userId: string, imdbID: string): Promise<void> {
  requireUserId(userId, 'remove a favourite')

  if (!imdbID) {
    throw new Error('Cannot remove a favourite: imdbID is required.')
  }

  try {
    await remove(favouriteRef(userId, imdbID))
  } catch (error) {
    console.error('[firebaseService] removeFavourite failed:', error)
    throw new Error(`Could not remove the favourite with imdbID "${imdbID}".`)
  }
}

/**
 * Loads all favourite movies for the given user from Firebase.
 *
 * @param userId The id of the signed-in user whose favourites to load.
 * @returns The list of favourite movies, or an empty array if there are none.
 * @throws If userId is missing or reading from Firebase fails.
 */
export async function getFavourites(userId: string): Promise<Movie[]> {
  requireUserId(userId, 'load favourites')

  try {
    const snapshot = await get(userFavouritesRef(userId))

    if (!snapshot.exists()) {
      return []
    }

    const favourites = snapshot.val() as Record<string, Movie>
    return Object.values(favourites)
  } catch (error) {
    console.error('[firebaseService] getFavourites failed:', error)
    throw new Error('Could not load the favourite movies.')
  }
}