import type { Movie, OmdbSearchResponse } from '../types/omdb'

const API_URL = 'https://www.omdbapi.com/'

export async function searchMovies(query: string): Promise<Movie[]> {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY
  console.log('[omdbMovieService] searchMovies called with query:', query)

  if (!apiKey) {
    console.error('[omdbMovieService] Missing VITE_OMDB_API_KEY')
    throw new Error('The OMDb API key is missing. Set VITE_OMDB_API_KEY in your .env file.')
  }

  const params = new URLSearchParams({ apikey: apiKey, s: query })
  const url = `${API_URL}?${params}`
  console.log(
    '[omdbMovieService] Request URL (key masked):',
    `${API_URL}?apikey=***&s=${encodeURIComponent(query)}`,
  )

  let response: Response
  try {
    response = await fetch(url)
  } catch (error) {
    console.error('[omdbMovieService] Network error reaching OMDb API:', error)
    throw new Error('Could not reach the OMDb API. Check your internet connection.')
  }

  console.log('[omdbMovieService] HTTP status:', response.status, response.statusText)

  if (!response.ok) {
    console.error('[omdbMovieService] Non-OK HTTP status:', response.status)
    throw new Error(`The OMDb request failed with status ${response.status}.`)
  }

  const data = (await response.json()) as OmdbSearchResponse
  console.log('[omdbMovieService] Raw OMDb response:', data)

  if (data.Response === 'False') {
    console.error('[omdbMovieService] OMDb responded False:', data.Error)
    throw new Error(data.Error ?? 'The OMDb API returned no results.')
  }

  console.log('[omdbMovieService] Movies found:', data.Search?.length ?? 0)
  return data.Search ?? []
}