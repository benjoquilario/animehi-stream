import { animeInfo, watch } from "@/lib/consumet"
import Episodes from "@/components/episode/episodes"
import Sharethis from "@/components/sharethis"
import type { Metadata } from "next"
import { getSession } from "../../../../lib/session"
import Server from "@/components/server"
import { createViewCounter, createWatchlist, increment } from "@/app/actions"
import { Suspense } from "react"
import OPlayer from "@/components/player/oplayer/csr"
import Comments from "@/components/comments/comments"
import { AnimeInfoResponse, IAnilistInfo } from "types/types"
import BreadcrumbWatch from "@/components/breadcrumb-watch"
import { getCurrentUser } from "@/lib/current-user"
import VideoPlayer from "@/components/player/oplayer/ssr"

type Params = {
  params: {
    params: string[]
  }
}

export async function generateMetadata({
  params,
}: {
  params: {
    params: string[]
  }
}): Promise<Metadata | undefined> {
  const [animeId, anilistId, episodeNumber] = params.params

  const response = (await animeInfo(`${animeId}`)) as AnimeInfoResponse

  if (!response) {
    return
  }

  const title = response.title ?? response.otherName
  const description = response.description
  const imageUrl = response.image

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/watch/${animeId}/${anilistId}/${episodeNumber}`,
      images: [
        {
          url: `${imageUrl}`,
          width: 600,
          height: 400,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${imageUrl}`,
          width: 600,
          height: 400,
        },
      ],
    },
  }
}

export const dynamic = "force-dynamic"

export default async function Watch({ params: { params } }: Params) {
  const [animeId, anilistId, episodeNumber] = params as string[]
  const session = await getSession()

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/anime/info/${anilistId}`
  const response = await fetch(url)

  if (!response.ok) throw new Error("Error")

  const animeResponse = (await response.json()) as IAnilistInfo
  // const animeResponse = (await fetchAnimeData(`${anilistId}`)) as IAnilistInfo
  // const popularResponse = await popular()
  // const anifyInfoResponse = await anifyInfo(anilistId, animeResponse.id)
  const sourcesPromise = watch(`${animeId}-episode-${episodeNumber}`)

  await createViewCounter({
    animeId,
    title: animeResponse.title.english ?? animeResponse.title.romaji,
    image: animeResponse.image,
    latestEpisodeNumber: animeResponse.currentEpisode ?? 1,
    anilistId,
  })

  if (session) {
    await createWatchlist({
      animeId,
      episodeNumber,
      title: animeResponse.title.english ?? animeResponse.title.romaji,
      image: animeResponse.image,
      nextEpisode: "1",
      prevEpisode: "2",
      anilistId,
    })
  }

  await increment(animeId, animeResponse.currentEpisode)

  const currentUser = await getCurrentUser()

  return (
    <div className="mt-2 flex-1">
      <BreadcrumbWatch animeId={anilistId} animeTitle={animeId} />
      <VideoPlayer
        sourcesPromise={sourcesPromise}
        animeId={animeId}
        episodeId={`${animeId}-episode-${episodeNumber}`}
        episodeNumber={episodeNumber}
        poster={animeResponse.cover}
        anilistId={anilistId}
      />

      <Server
        episodeId={`${animeId}-episode-${episodeNumber}`}
        animeResult={animeResponse}
        animeId={animeId}
        anilistId={anilistId}
        episodeNumber={episodeNumber}
        currentUser={currentUser}
      />

      {/* <VideoPlayer animeId={animeId} episodeNumber={episodeNumber} /> */}
      {/* <Suspense>

      </Suspense> */}

      <Episodes
        animeId={anilistId}
        episodeId={`${animeId}-episode-${episodeNumber}`}
      />
      <Sharethis />
      <Comments
        animeId={animeId}
        episodeNumber={episodeNumber}
        anilistId={anilistId}
      />
    </div>
  )
}
