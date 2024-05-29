import type {
  AnifyRecentEpisode,
  AnimeInfoResponse as TAnimeInfoResponse,
  ConsumetResponse,
  Popular,
  RecentEpisode,
  Search,
  SeasonalResponse,
  SourcesResponse,
  IAnilistInfo,
} from "types/types"
import { cache } from "react"
import { redis } from "./redis"
import "server-only"
import { getSeason } from "./utils"

const publicUrl = process.env.NEXT_PUBLIC_APP_URL
const animeApi = process.env.ANIME_API_URI
const anifyUrl = "https://ahttps://api.anify.tv"

export async function popularThisSeason() {
  const currentSeason = getSeason()
  const url = `${process.env.ANIME_API_URI}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=5&season=${currentSeason.season}&format=TV&year=${currentSeason.year}&sort=["POPULARITY_DESC","SCORE_DESC"]`

  const response = await fetch(url)
  const data = await response.json()

  return data
}

export async function popularAnime() {
  const url = `${animeApi}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=5&format=TV&sort=["POPULARITY_DESC","SCORE_DESC"]`

  const response = await fetch(url)

  const data = await response.json()
  return data
}

export async function mostfavoriteAnime() {
  const currentSeason = getSeason()
  console.log(currentSeason.season)
  const url = `${process.env.ANIME_API_URI}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=5&season=${currentSeason.season}&format=TV&sort=["FAVOURITES_DESC", "SCORE_DESC"]`

  const response = await fetch(url)

  const data = await response.json()
  return data
}

export async function topAiring() {
  const currentSeason = getSeason()
  const url = `${animeApi}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=5&season=${currentSeason.season}&year=${currentSeason.year}&format=TV&sort=["SCORE_DESC"]`

  const response = await fetch(url)

  const data = await response.json()
  return data
}

export async function trendingAnime() {
  const currentSeason = getSeason()
  const url = `${animeApi}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=10&season=${currentSeason.season}&format=TV&sort=["TRENDING_DESC","SCORE_DESC"]`

  const response = await fetch(url)

  const data = await response.json()
  return data
}

export async function recent() {
  const redisVal = "recents"
  const url = `${animeApi}/meta/anilist/recent-episodes`
  let cachedVal

  cachedVal = await redis.get(redisVal)

  if (cachedVal) {
    return cachedVal
  }

  const response = await fetch(url, { cache: "no-cache" })

  if (!response.ok) throw new Error("Fetch Failed")

  const data = await response.json()

  if (data) {
    const stringifyResult = JSON.stringify(data)

    await redis.setex(redisVal, 60 * 60 * 3, stringifyResult)
  }

  return data as ConsumetResponse<RecentEpisode>
}

export const popular = cache(async function popular() {
  const response = await fetch(`${publicUrl}/api/anime/trending`)

  if (!response.ok) throw new Error("Failed to fetch top airing")

  return (await response.json()) as ConsumetResponse<Popular>
})

export const animeInfo = cache(async function (animeId: string) {
  let cachedResponse

  cachedResponse = await redis.get(`anime:${animeId}`)

  if (cachedResponse) {
    console.log("anime info hits")
    return cachedResponse
  }

  const response = await fetch(`${animeApi}/meta/anilist/data/${animeId}`)

  if (!response.ok) throw new Error("Error")

  const animeResponse = (await response.json()) as IAnilistInfo

  const stringifyResult = JSON.stringify(animeResponse)
  await redis.setex(`anime:${animeId}`, 60 * 60 * 3, stringifyResult)

  return animeResponse as IAnilistInfo
})

export async function watch(episodeId: string) {
  const response = await fetch(`${animeApi}/anime/gogoanime/watch/${episodeId}`)

  if (!response.ok) throw new Error("Failed to fetch anime informations")

  return (await response.json()) as SourcesResponse
}

export const fetchSearch = cache(async function search(query: string) {
  const response = await fetch(`${animeApi}/anime/anify/${query}`)

  if (!response.ok) throw new Error("Failed to fetch search.")

  return (await response.json()) as ConsumetResponse<Search>
})

export const seasonal = cache(async function seasonal() {
  const url = `https://api.anify.tv/seasonal/anime?fields=[id,%20mappings,%20title,%20coverImage,%20bannerImage,%20description,%20currentEpisode, %20totalEpisodes, %20format]`
  const redisVal = "seasonal"

  let cachedVal

  cachedVal = await redis.get(redisVal)

  if (cachedVal) {
    return cachedVal
  }

  const response = await fetch(url)

  if (!response.ok) throw new Error("Fetch Failed")

  const data = await response.json()

  if (data) {
    const stringifyResult = JSON.stringify(data)

    await redis.setex(redisVal, 60 * 60 * 6, stringifyResult)
  }

  return data as SeasonalResponse
})

export async function fetchMedia() {}

export async function fetchAnimeData(animeId: string) {
  const url = `${publicUrl}/anime/info/${animeId}`
  const response = await fetch(url, { cache: "no-cache" })

  if (!response.ok) throw new Error("Error")

  const data = await response.json()

  return data
}

export async function fetchAnimeEpisodes(animeId: string) {
  const url = `${publicUrl}/anime/episodes/${animeId}`
  const response = await fetch(url, { cache: "no-cache" })

  if (!response.ok) throw new Error("Error")
  const data = await response.json()

  return data
}
