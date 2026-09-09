import { searchMovies } from '../../services/omdbMovieService'
import type { Movie } from '../../types/omdb'

const SEED_KEYWORDS = [
  'Batman',
  'Avengers',
  'Harry Potter',
  'Star Wars',
  'Spider-Man',
  'Marvel',
  'Disney',
  'Matrix',
  'Lord of the Rings',
  'Fast',
  'Mission Impossible',
  'Pixar',
  'Horror',
  'Comedy',
  'Action',
] as const

const INITIAL_MOVIE_COUNT = 20
const BATCH_SIZE = 4

export interface HomeModel {
  // Home-specific data and business logic will be added here later.
}

/**
 * Searches for movies using the given query.
 *
 * - Trims surrounding whitespace from the query
 * - Validates that the cleaned query is at least one character long
 * - Delegates the OMDb API call to `searchMovies`
 *
 * @param query The raw search text.
 * @returns The list of movies matching the query.
 * @throws If the cleaned query is empty.
 */
export async function getMovies(query: string): Promise<Movie[]> {
  const cleanedQuery = query.trim()

  if (cleanedQuery.length < 1) {
    throw new Error('Search query must contain at least one character.')
  }

  return searchMovies(cleanedQuery)
}

function removeDuplicates(movies: Movie[]): Movie[] {
  const seenImdbIds = new Set<string>()
  const unique: Movie[] = []

  for (const movie of movies) {
    if (seenImdbIds.has(movie.imdbID)) {
      continue
    }
    seenImdbIds.add(movie.imdbID)
    unique.push(movie)
  }

  return unique
}

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const current = shuffled[i]
    shuffled[i] = shuffled[randomIndex]
    shuffled[randomIndex] = current
  }

  return shuffled
}

/**
 * Fetches a random selection of movies to show when the Home screen opens.
 *
 * - Picks search keywords at random from a predefined seed list
 * - Fetches them in parallel with Promise.all so every launch differs
 * - Merges all results, removes duplicates by imdbID, shuffles them,
 *   and returns exactly 20 unique movies
 */
export async function initialMovies(): Promise<Movie[]> {
  const keywordPool = shuffle(SEED_KEYWORDS)
  let uniqueMovies: Movie[] = []

  while (uniqueMovies.length < INITIAL_MOVIE_COUNT && keywordPool.length > 0) {
    const batch = keywordPool.splice(0, BATCH_SIZE)

    const batchResults = await Promise.all(
      batch.map((keyword) => searchMovies(keyword)),
    )

    const merged = [...uniqueMovies, ...batchResults.flat()]
    uniqueMovies = removeDuplicates(merged)
  }

  return shuffle(uniqueMovies).slice(0, INITIAL_MOVIE_COUNT)
}