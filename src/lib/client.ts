import { env } from "@/env.mjs"
import { META } from "@consumet/extensions"

interface FetchOptions {
  type?: string
  season?: string
  format?: string
  sort?: string[]
  genres?: string[]
  id?: string
  year?: string
  status?: string
}

const animeApi = env.NEXT_PUBLIC_ANIME_API_URL

export async function fetchAdvanceSearch(
  searchQuery: string = "",
  page: number = 1,
  perPage: number = 20,
  options: FetchOptions = {}
) {
  const queryParams = new URLSearchParams({
    ...(searchQuery && { query: searchQuery }),
    page: page.toString(),
    perPage: perPage.toString(),
    type: options.type ?? "ANIME",
    ...(options.season && { season: options.season }),
    ...(options.format && { format: options.format }),
    ...(options.id && { id: options.id }),
    ...(options.year && { year: options.year }),
    ...(options.status && { status: options.status }),
    ...(options.sort && { sort: JSON.stringify(options.sort) }),
  })

  if (options.genres && options.genres.length > 0) {
    // Correctly encode genres as a JSON array
    queryParams.set("genres", JSON.stringify(options.genres.map((g) => g)))
  }

  const url = `${env.NEXT_PUBLIC_ANIME_API_URL}/meta/anilist/advanced-search?${queryParams.toString()}`
  const response = await fetch(url)

  const data = response.json()

  return data
}

async function fetchFromProxy(url: string, cache: any, cacheKey: string) {
  try {
    const cachedResponse = cache.get(cacheKey)
    if (cachedResponse) {
      return cachedResponse // Return the cached response if available
    }

    const response = await fetch(url)

    if (response.status !== 200) {
      const errorMessage = response.statusText || "Unknown server error"
      throw new Error(
        `Server error: ${
          response.statusText || response.status
        } ${errorMessage}`
      )
    }

    const data = await response.json()

    cache.set(cacheKey, data)
    return data
  } catch (error) {
    throw error
  }
}

import { createCache, generateCacheKey } from "./cache"
import { create } from "domain"

const animeEpisodesCache = createCache("EpisodesV2")
const recentEpisodesCache = createCache("RecentEpisodes")
export async function fetchRecentEpisodes(page = 1, perPage = 18) {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  })

  const url = `${env.NEXT_PUBLIC_APP_URL}/api/anime/recents`

  const cacheKey = generateCacheKey("recentsEpisoedes", page.toString())

  return fetchFromProxy(
    `${url}?${params.toString()}`,
    recentEpisodesCache,
    cacheKey
  )
}

export async function fetchAnimeEpisodesV2(
  animeId: string,
  dub: boolean = false
) {
  const anilist = new META.Anilist()

  const cache = createCache("EpisodesV2")

  const cacheKey = generateCacheKey("animeEpisodes", animeId, dub.toString())

  const cachedResponse = cache.get(cacheKey)
  if (cachedResponse) {
    return cachedResponse // Return the cached response if available
  }

  const data = await anilist.fetchEpisodesListById(animeId, dub as boolean)

  cache.set(cacheKey, data)
  return data
}
