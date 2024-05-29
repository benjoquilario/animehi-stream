import "server-only"

import { cache } from "react"
import { redis } from "./redis"
import { getSeason } from "./utils"

const animeApi = process.env.ANIME_API_URI
const publicUrl = process.env.NEXT_PUBLIC_APP_URL

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

export const animeInfo = cache(async function (animeId: string) {
  if (!animeId) throw new Error("Please provide a anime Id")

  const response = await fetch(`${publicUrl}/api/anime/info/${animeId}`)

  if (!response.ok) {
    return { message: "Failed to fetch" }
  }

  const data = await response.json()

  return data
})
