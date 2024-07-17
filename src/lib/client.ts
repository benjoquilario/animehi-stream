import { env } from "@/env.mjs"

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
