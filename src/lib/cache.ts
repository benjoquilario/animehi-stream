"use client"

// crdits: https://github.com/Miruro-no-kuon/Miruro/blob/main/src/hooks/useApi.ts
import axios from "axios"
import { env } from "@/env.mjs"
import { getNextSeason, getSeason } from "./utils"
// Utility function to ensure URL ends with a slash
function ensureUrlEndsWithSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`
}

// Adjusting environment variables to ensure they end with a slash
const BASE_URL = ensureUrlEndsWithSlash(env.NEXT_PUBLIC_ANIME_API_URL)
const SKIP_TIMES = ensureUrlEndsWithSlash(env.NEXT_PUBLIC_SKIP_TIMES)
let PROXY_URL = env.NEXT_PUBLIC_PROXY_URI // Default to an empty string if no proxy URL is provided
// Check if the proxy URL is provided and ensure it ends with a slash
if (PROXY_URL) {
  PROXY_URL = ensureUrlEndsWithSlash(env.NEXT_PUBLIC_PROXY_URI as string)
}

const API_KEY = "secret key"

// Axios instance
const axiosInstance = axios.create({
  baseURL: PROXY_URL || undefined,
  timeout: 10000,
  headers: {
    "X-API-Key": API_KEY,
    "access-control-allow-headers": "x-atx, Content-Type",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-origin": "*",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
  },
})

// Error handling function
// Function to handle errors and throw appropriately
function handleError(error: any, context: string) {
  let errorMessage = "An error occurred"

  // Handling CORS errors (Note: This is a simplification. Real CORS errors are hard to catch in JS)
  if (error.message && error.message.includes("Access-Control-Allow-Origin")) {
    errorMessage = "A CORS error occurred"
  }

  switch (context) {
    case "data":
      errorMessage = "Error fetching data"
      break
    case "anime episodes":
      errorMessage = "Error fetching anime episodes"
      break
    // Extend with other cases as needed
  }

  if (error.response) {
    // Extend with more nuanced handling based on HTTP status codes
    const status = error.response.status
    if (status >= 500) {
      errorMessage += ": Server error"
    } else if (status >= 400) {
      errorMessage += ": Client error"
    }
    // Include server-provided error message if available
    errorMessage += `: ${error.response.data.message || "Unknown error"}`
  } else if (error.message) {
    errorMessage += `: ${error.message}`
  }

  console.error(`${errorMessage}`, error)
  throw new Error(errorMessage)
}

function generateCacheKey(...args: string[]) {
  return args.join("-")
}

interface CacheItem {
  value: any
  timestamp: number
}

function createOptimizedSessionStorageCache(
  maxSize: number,
  maxAge: number,
  cacheKey: string
) {
  let cache: any
  let keys: any

  if (typeof window !== "undefined") {
    cache = new Map<string, CacheItem>(
      JSON.parse(sessionStorage.getItem(cacheKey) || "[]")
    )

    keys = new Set<string>(cache.keys())
  }

  function isItemExpired(item: CacheItem) {
    return Date.now() - item.timestamp > maxAge
  }

  function updateSessionStorage() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify(Array.from(cache.entries()))
      )
    }
  }

  return {
    get(key: string) {
      if (cache.has(key)) {
        const item = cache.get(key)
        if (!isItemExpired(item!)) {
          keys.delete(key)
          keys.add(key)
          return item!.value
        }
        cache.delete(key)
        keys.delete(key)
      }
      return undefined
    },
    set(key: string, value: any) {
      if (cache.size >= maxSize) {
        const oldestKey = keys.values().next().value
        cache.delete(oldestKey!)
        keys.delete(oldestKey!)
      }
      keys.add(key)
      cache.set(key, { value, timestamp: Date.now() })
      updateSessionStorage()
    },
  }
}

// Constants for cache configuration
// Cache size and max age constants
const CACHE_SIZE = 20
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Factory function for cache creation
// Function to create cache with given cache key
function createCache(cacheKey: string) {
  return createOptimizedSessionStorageCache(CACHE_SIZE, CACHE_MAX_AGE, cacheKey)
}

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

const advancedSearchCache = createCache("Advanced Search")
const animeDataCache = createCache("Data")
const animeInfoCache = createCache("Info")
const animeEpisodesCache = createCache("Episodes")
const animeInfoFallbackCache = createCache("InfoFallback")
const fetchAnimeEmbeddedEpisodesCache = createCache("Video Embedded Sources")
const videoSourcesCache = createCache("Video Sources")

async function fetchFromProxy(url: string, cache: any, cacheKey: string) {
  try {
    const cachedResponse = cache.get(cacheKey)
    if (cachedResponse) {
      return cachedResponse // Return the cached response if available
    }

    const requestConfig = PROXY_URL ? { params: { url } } : {}

    const response = await axios.get(url)

    if (
      response.status !== 200 ||
      (response.data.statusCode && response.data.statusCode >= 400)
    ) {
      const errorMessage = response.data.message || "Unknown server error"
      throw new Error(
        `Server error: ${
          response.data.statusCode || response.status
        } ${errorMessage}`
      )
    }

    cache.set(cacheKey, response.data)

    return response.data
  } catch (error) {
    handleError(error, "data")
    throw error
  }
}

export async function fetchAnimeInfo(
  animeId: string,
  provider: string = "gogoanime"
) {
  const params = new URLSearchParams({ provider })
  const url = `${BASE_URL}meta/anilist/info/${animeId}?${params.toString()}`
  const cacheKey = generateCacheKey("animeInfo", animeId, provider)

  return fetchFromProxy(url, animeInfoCache, cacheKey)
}

export async function fetchAnimeData(
  animeId: string,
  provider: string = "gogoanime"
) {
  const params = new URLSearchParams({ provider })
  const url = `${BASE_URL}meta/anilist/data/${animeId}?${params.toString()}`
  const cacheKey = generateCacheKey("animeData", animeId, provider)

  return fetchFromProxy(url, animeDataCache, cacheKey)
}

export async function fetchAnimeInfoFallback(animeId: string) {
  const url = `${env.NEXT_PUBLIC_PROXY_URI}?url=${env.NEXT_PUBLIC_ANIME_API_URL_V3}/anime/info/${animeId}`
  const cacheKey = generateCacheKey("animeInfoFallback", animeId)

  return fetchFromProxy(url, animeInfoFallbackCache, cacheKey)
}

async function fetchList(
  type: string,
  page: number = 1,
  perPage: number = 16,
  options: FetchOptions = {}
) {
  let cacheKey: string
  let url: string
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  })
  const { year, season } = getSeason()

  if (
    [
      "TopRated",
      "Trending",
      "PopularThisSeason",
      "TopAiring",
      "Upcoming",
      "MostPopular",
      "MostFavorite",
    ].includes(type)
  ) {
    cacheKey = generateCacheKey(
      `${type}Anime`,
      page.toString(),
      perPage.toString()
    )
    url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`

    if (type === "TopRated") {
      options = {
        type: "ANIME",
        sort: ['["SCORE_DESC"]'],
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`
    } else if (type === "PopularThisSeason") {
      options = {
        season: season,
        year: year.toString(),
        type: "ANIME",
        sort: ['["POPULARITY_DESC", "SCORE_DESC"]'],
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&season=${options.season}&year=${options.year}&`
    } else if (type === "Upcoming") {
      options = {
        type: "ANIME",
        season: season,
        year: year.toString(),
        status: "NOT_YET_RELEASED",
        sort: ['["POPULARITY_DESC"]'],
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`
    } else if (type === "TopAiring") {
      options = {
        type: "ANIME",
        season: season,
        year: year.toString(),
        status: "RELEASING",
        sort: ['["POPULARITY_DESC"]'],
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`
    } else if (type === "MostPopular") {
      options = {
        type: "ANIME",
        sort: ['["POPULARITY_DESC","SCORE_DESC"]'],
        format: "TV",
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&format=${options.format}&`
    } else if (type === "MostFavorite") {
      options = {
        type: "ANIME",
        sort: ['["FAVOURITES_DESC", "SCORE_DESC"]'],
        format: "TV",
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&format=${options.format}&`
    }
  } else {
    cacheKey = generateCacheKey(
      `${type}Anime`,
      page.toString(),
      perPage.toString()
    )
    url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`
  }

  const specificCache = createCache(`${type}`)
  return fetchFromProxy(`${url}?${params.toString()}`, specificCache, cacheKey)
}

export const fetchTopAnime = (page: number, perPage: number) =>
  fetchList("TopRated", page, perPage)
export const fetchTrendingAnime = (page: number, perPage: number) =>
  fetchList("Trending", page, perPage)
export const fetchPopularAnime = (page: number, perPage: number) =>
  fetchList("PopularThisSeason", page, perPage)
export const fetchMostPopularAnime = (page: number, perPage: number) =>
  fetchList("MostPopular", page, perPage)
export const fetchMostFavoriteAnime = (page: number, perPage: number) =>
  fetchList("MostFavorite", page, perPage)
export const fetchTopAiringAnime = (page: number, perPage: number) =>
  fetchList("TopAiring", page, perPage)
export const fetchUpcomingSeasons = (page: number, perPage: number) =>
  fetchList("Upcoming", page, perPage)

export async function fetchAnimeEpisodes(
  animeId: string,
  provider: string = "gogoanime",
  dub: boolean = false
) {
  const params = new URLSearchParams({ provider, dub: dub ? "true" : "falase" })
  const url = `${BASE_URL}meta/anilist/episodes/${animeId}?${params.toString()}`
  const cacheKey = generateCacheKey(
    "animeEpisodes",
    animeId,
    provider,
    dub ? "dub" : "sub"
  )

  return fetchFromProxy(url, animeEpisodesCache, cacheKey)
}

export async function fetchAnimeEpisodesV2(
  animeId: string,
  dub: boolean = false
) {
  const params = new URLSearchParams({ dub: dub ? "true" : "false" })
  const url = `/api/anime/episodes/${animeId}?${params.toString()}`
  const cacheKey = generateCacheKey(
    "animeEpisodesV2",
    animeId,
    dub ? "dub" : "sub"
  )

  return fetchFromProxy(url, animeEpisodesCache, cacheKey)
}

export async function fetchAnimeEmbeddedEpisodes(episodeId: string) {
  const url = `${BASE_URL}meta/anilist/servers/${episodeId}`
  const cacheKey = generateCacheKey("animeEmbeddedServers", episodeId)

  return fetchFromProxy(url, fetchAnimeEmbeddedEpisodesCache, cacheKey)
}

export async function fetchAnimeStreamingLinks(episodeId: string) {
  const url = `${BASE_URL}meta/anilist/watch/${episodeId}`
  const cacheKey = generateCacheKey("animeStreamingLinks", episodeId)

  return fetchFromProxy(url, videoSourcesCache, cacheKey)
}

interface FetchSkipTimesParams {
  malId: string
  episodeNumber: string
  episodeLength?: string
}

export async function fetchSkipTimes({
  malId,
  episodeNumber,
  episodeLength = "0",
}: FetchSkipTimesParams) {
  const types = ["ed", "mixed-ed", "mixed-op", "op", "recap"]
  const url = new URL(`${SKIP_TIMES}v2/skip-times/${malId}/${episodeNumber}`)
  url.searchParams.append("episodeLength", episodeLength.toString())
  types.forEach((type) => url.searchParams.append("types[]", type))

  const cacheKey = generateCacheKey(
    "skipTimes",
    malId,
    episodeNumber,
    episodeLength || ""
  )

  return fetchFromProxy(url.toString(), createCache("SkipTimes"), cacheKey)
}

export async function fetchRecentEpisodes(
  page: number = 1,
  perPage: number = 18
) {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  })

  const url = `${env.NEXT_PUBLIC_APP_URL}/api/anime/recents?${params.toString()}`
  const cacheKey = generateCacheKey(
    "recentEpisodes",
    page.toString(),
    perPage.toString()
  )

  return fetchFromProxy(url, createCache("RecentEpisodes"), cacheKey)
}
