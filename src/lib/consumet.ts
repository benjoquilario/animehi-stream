import type {
  AnimeInfoResponse,
  ConsumetResponse,
  Popular,
  RecentEpisode,
  SourcesResponse,
} from "types/types"

export const url = "https://api.consumet.org/anime/gogoanime"

const publicUrl = process.env.NEXT_PUBLIC_APP_URL

export async function recent() {
  const response = await fetch(`${publicUrl}/api/anime/recents`, {
    cache: "no-cache",
  })

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  return (await response.json()) as ConsumetResponse<RecentEpisode>
}

export async function popular() {
  const response = await fetch(`${publicUrl}/api/anime/trending`, {
    cache: "no-cache",
  })

  if (!response.ok) throw new Error("Failed to fetch top airing")

  return (await response.json()) as ConsumetResponse<Popular>
}

export async function animeInfo(animeId: string) {
  const response = await fetch(`${publicUrl}/api/anime/info/${animeId}`, {
    cache: "no-cache",
  })

  if (!response.ok) throw new Error("Failed to fetch anime informations")

  return (await response.json()) as AnimeInfoResponse
}

export async function watch(episodeId: string) {
  const response = await fetch(`${publicUrl}/api/watch/${episodeId}`, {
    cache: "no-cache",
  })

  if (!response.ok) throw new Error("Failed to fetch anime informations")

  return (await response.json()) as SourcesResponse
}
