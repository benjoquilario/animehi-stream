import "server-only"

import { cache } from "react"
import { getSeason } from "./utils"
import { env } from "@/env.mjs"

const animeApi = env.ANIME_API_URI

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

async function fetchFromProxy(url: string) {
  try {
    const response = await fetch(url, { next: { revalidate: 21600 } })

    if (response.status !== 200) {
      const errorMessage = response.statusText || "Unknown server error"
      throw new Error(
        `Server error: ${
          response.statusText || response.status
        } ${errorMessage}`
      )
    }

    const data = await response.json()

    return data
  } catch (error) {
    throw error
  }
}

async function fetchList(
  type: string,
  page: number = 1,
  perPage: number = 16,
  options: FetchOptions = {}
) {
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
    url = `${animeApi}/meta/anilist/${type.toLowerCase()}`

    if (type === "TopRated") {
      options = {
        type: "ANIME",
        sort: ['["SCORE_DESC"]'],
      }
      url = `${animeApi}/meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`
    } else if (type === "PopularThisSeason") {
      options = {
        season: season,
        year: year.toString(),
        type: "ANIME",
        sort: ['["POPULARITY_DESC", "SCORE_DESC"]'],
      }
      url = `${animeApi}/meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&season=${options.season}&year=${options.year}&`
    } else if (type === "Upcoming") {
      options = {
        type: "ANIME",
        season: season,
        year: year.toString(),
        status: "NOT_YET_RELEASED",
        sort: ['["POPULARITY_DESC"]'],
      }
      url = `${animeApi}/meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`
    } else if (type === "TopAiring") {
      options = {
        type: "ANIME",
        season: season,
        year: year.toString(),
        status: "RELEASING",
        sort: ['["POPULARITY_DESC"]'],
      }
      url = `${animeApi}/meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`
    } else if (type === "MostPopular") {
      options = {
        type: "ANIME",
        sort: ['["POPULARITY_DESC","SCORE_DESC"]'],
        format: "TV",
      }
      url = `${animeApi}/meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&format=${options.format}&`
    } else if (type === "MostFavorite") {
      options = {
        type: "ANIME",
        sort: ['["FAVOURITES_DESC", "SCORE_DESC"]'],
        format: "TV",
      }
      url = `${animeApi}/meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&format=${options.format}&`
    }
  } else {
    url = `${animeApi}/meta/anilist/${type.toLowerCase()}`
  }

  return fetchFromProxy(`${url}?${params.toString()}`)
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
  if (!animeId)
    return {
      message: "Please provide animeId",
    }

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
