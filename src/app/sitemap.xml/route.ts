import { topAiring, trendingAnime } from "@/lib/consumet"
import { env } from "@/env.mjs"
import {
  ConsumetResponse as TConsumetResponse,
  RecentEpisode as TRecentEpisode,
} from "types/types"
import { transformedTitle } from "@/lib/utils"

const url = `https://animehi-stream.vercel.app`

async function generateSiteMap() {
  const routes = {
    url: `https://animehi-stream.vercel.app`,
    lastModified: new Date().toISOString(),
    changeFreq: "daily",
    priority: 1.0,
  }

  const fetchPopularAnime = await trendingAnime()
  const topAnime = await topAiring()
  const responseRecentEpisode = await fetch(
    `${env.NEXT_PUBLIC_ANIME_API_URL}/meta/anilist/recent-episodes?page=1&perPage=20`
  )
  const data =
    (await responseRecentEpisode.json()) as TConsumetResponse<TRecentEpisode>

  const [popular, recent, top] = await Promise.all([
    fetchPopularAnime,
    data,
    topAnime,
  ])

  const animeMap = [
    ...recent.results.map((anime) => ({
      url: `${url}/anime/${transformedTitle(anime.title.english ?? anime.title.romaji)}/${anime.id}`,
      lastModified: new Date().toISOString(),
      changeFreq: "weekly",
      priority: 0.9,
    })),
    ...popular.results.map((anime: any) => ({
      url: `${url}/anime/${transformedTitle(anime.title.english ?? anime.title.romaji)}/${anime.id}`,
      lastModified: new Date().toISOString(),
      changeFreq: "weekly",
      priority: 0.9,
    })),
    ...top.results.map((anime: any) => ({
      url: `${url}/anime/${transformedTitle(anime.title.english ?? anime.title.romaji)}/${anime.id}`,
      lastModified: new Date().toISOString(),
      changeFreq: "weekly",
      priority: 0.9,
    })),
  ]

  const URLs = [...new Set([routes, ...animeMap])]

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${URLs.map(({ url, lastModified, changeFreq, priority }) => {
       return `
       <url>
          <loc>${url}</loc>
          <changefreq>${changeFreq}</changefreq>
          <priority>${priority}</priority>
          <lastmod>${lastModified}</lastmod>
       </url>
     `
     }).join("")}
   </urlset>`
}

export const dynamic = "force-dynamic"

export const GET = async () => {
  const sitemap = await generateSiteMap()

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
