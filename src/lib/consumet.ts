import "server-only"

import { cache } from "react"
import { redis } from "./redis"
import { getSeason } from "./utils"
import { env } from "@/env.mjs"

const animeApi = env.ANIME_API_URI
const publicUrl = env.NEXT_PUBLIC_APP_URL

export async function popularThisSeason() {
  const currentSeason = getSeason()
  const url = `${process.env.ANIME_API_URI}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=5&season=${currentSeason.season}&format=TV&year=${currentSeason.year}&sort=["POPULARITY_DESC","SCORE_DESC"]`

  const response = await fetch(url)

  if (!response.ok) {
    return {
      results: [],
      ok: false,
      message: "Trending Anime Not Found",
    }
  }

  const data = await response.json()
  return {
    results: data.results,
    ok: true,
    message: "Success",
  }
}

export async function popularAnime() {
  const url = `${animeApi}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=5&format=TV&sort=["POPULARITY_DESC","SCORE_DESC"]`

  const cachedResponse = await redis.get("popular")

  if (cachedResponse) {
    return {
      results: cachedResponse,
      ok: true,
      message: "Success",
    }
  }

  const response = await fetch(url)

  if (!response.ok) {
    return {
      results: [],
      ok: false,
      message: "Trending Anime Not Found",
    }
  }

  const data = await response.json()
  return {
    results: data.results,
    ok: true,
    message: "Success",
  }
}

export async function mostfavoriteAnime() {
  const cachedResponse = await redis.get("favorite")

  if (cachedResponse) {
    return {
      results: cachedResponse,
      ok: true,
      message: "Success",
    }
  }

  const url = `${env.ANIME_API_URI}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=5&format=TV&sort=["FAVOURITES_DESC", "SCORE_DESC"]`

  const response = await fetch(url)
  if (!response.ok) {
    return {
      results: [],
      ok: false,
      message: "Trending Anime Not Found",
    }
  }

  const data = await response.json()
  return {
    results: data.results,
    ok: true,
    message: "Success",
  }
}

export async function topAiring() {
  const currentSeason = getSeason()
  const url = `${animeApi}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=5&season=${currentSeason.season}&year=${currentSeason.year}&format=TV&sort=["SCORE_DESC"]`

  const response = await fetch(url)

  if (!response.ok) {
    const cachedResponse = await redis.get("popular")

    if (cachedResponse) {
      return {
        results: cachedResponse,
        ok: true,
        message: "Success",
      }
    }

    return {
      results: [],
      ok: false,
      message: "Trending Anime Not Found",
    }
  }

  const data = await response.json()

  return {
    results: data.results,
    ok: true,
    message: "Success",
  }
}

export async function trendingAnime() {
  const currentSeason = getSeason()
  const url = `${animeApi}/meta/anilist/advanced-search?type=ANIME&page=1&perPage=10&season=${currentSeason.season}&format=TV&sort=["TRENDING_DESC","SCORE_DESC"]`

  const response = await fetch(url)

  if (!response.ok) {
    const cachedResponse = await redis.get("trending")

    if (cachedResponse) {
      return {
        results: cachedResponse,
        ok: true,
        message: "Success",
      }
    }

    return {
      results: [],
      ok: false,
      message: "Trending Anime Not Found",
    }
  }

  const data = await response.json()
  return {
    results: data.results,
    ok: true,
    message: "Success",
  }
}

export async function watch(episodeId: string) {
  const response = await fetch(
    `${env.NEXT_PUBLIC_ANIME_API_URL}/meta/anilist/watch/${episodeId}`
  )

  if (!response.ok) throw new Error("Failed to fetch watch.")

  const data = await response.json()

  return data
}

export const animeInfo = cache(async function (
  animeId: string,
  provider = "gogoanime"
) {
  if (!animeId) throw new Error("Please provide a anime Id")

  const params = new URLSearchParams({ provider })
  const response = await fetch(
    `${animeApi}/meta/anilist/data/${animeId}?${params.toString()}`
  )

  if (!response.ok) {
    return { message: "Failed to fetch" }
  }

  const data = await response.json()

  return data
})

const LIMIT = 20
