import type {
  AnifyRecentEpisode,
  AnimeInfoResponse,
  ConsumetResponse,
  Popular,
  RecentEpisode,
  Search,
  SeasonalResponse,
  SourcesResponse,
} from "types/types"
import { cache } from "react"

// import { ISearch,  } from "@consumet/extensions/dist/models/types"

// export const url = "https://api.consumet.org/anime/gogoanime"
// export const url2 = "https://consume-beige.vercel.app/anime/gogoanime"

export const publicUrl = process.env.NEXT_PUBLIC_APP_URL
export const animeApi = process.env.ANIME_API_URI

export async function recent() {
  const response = await fetch(`${publicUrl}/api/anime/recents`, {
    cache: "no-cache",
  })

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  return (await response.json()) as ConsumetResponse<RecentEpisode>
}

export const popular = cache(async function popular() {
  const response = await fetch(`${publicUrl}/api/anime/trending`)

  if (!response.ok) throw new Error("Failed to fetch top airing")

  return (await response.json()) as ConsumetResponse<Popular>
})

export const animeInfo = cache(async function animeInfo(animeId: string) {
  const response = await fetch(`${publicUrl}/api/anime/info/${animeId}`)

  if (!response.ok) throw new Error("Failed to fetch anime informations")

  return (await response.json()) as any
})

export async function watch(episodeId: string) {
  const response = await fetch(`${publicUrl}/api/watch/${episodeId}`, {
    cache: "no-cache",
  })

  if (!response.ok) throw new Error("Failed to fetch anime informations")

  return (await response.json()) as SourcesResponse
}

export const search = cache(async function search({
  query,
  page = 1,
}: {
  query: string
  page?: number
}) {
  const response = await fetch(`${animeApi}/anime/anify/${query}`)

  if (!response.ok) throw new Error("Failed to fetch search.")

  return (await response.json()) as ConsumetResponse<Search>
})

export async function seasonal() {
  const response = await fetch(`${publicUrl}/api/anime/seasonal`, {
    cache: "no-cache",
  })

  if (!response.ok) throw new Error("Failed to fetch seasonal.")

  return (await response.json()) as SeasonalResponse
}
