import type {
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

export const recent = cache(async function recent() {
  const response = await fetch(`${publicUrl}/api/anime/recents`)

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  return (await response.json()) as ConsumetResponse<RecentEpisode>
})

export const popular = cache(async function popular() {
  const response = await fetch(`${publicUrl}/api/anime/trending`)

  if (!response.ok) throw new Error("Failed to fetch top airing")

  return (await response.json()) as ConsumetResponse<Popular>
})

export const animeInfo = cache(async function animeInfo(animeId: string) {
  const response = await fetch(`${publicUrl}/api/anime/info/${animeId}`, {
    next: { revalidate: 5 * 60 },
  })

  if (!response.ok) throw new Error("Failed to fetch anime informations")

  return (await response.json()) as AnimeInfoResponse
})

export const anifyInfo = cache(async function anifyInfo(id: string) {
  const response = await fetch(
    `https://api.anify.tv/info/${id}?fields=[id,coverImage,relations,bannerImage]`
  )

  if (!response.ok) throw new Error("Failed to fetch anime informations")

  return (await response.json()) as any
})

export const watch = cache(async function watch(episodeId: string) {
  const response = await fetch(`${publicUrl}/api/watch/${episodeId}`)

  if (!response.ok) throw new Error("Failed to fetch anime informations")

  return (await response.json()) as SourcesResponse
})

export const search = cache(async function search({
  query,
  page = 1,
}: {
  query: string
  page?: number
}) {
  const response = await fetch(
    `${animeApi}/anime/gogoanime/${query}?page=${page}`
  )

  if (!response.ok) throw new Error("Failed to fetch search.")

  return (await response.json()) as ConsumetResponse<Search>
})

export const seasonal = cache(async function seasonal() {
  const response = await fetch(`${publicUrl}/api/anime/seasonal`)

  if (!response.ok) throw new Error("Failed to fetch seasonal.")

  return (await response.json()) as SeasonalResponse
})
