import { animeInfo, popular, watch, publicUrl, anifyInfo } from "@/lib/consumet"
import Episodes from "@/components/episode/episodes"
import Details from "@/components/details"
import Sharethis from "@/components/sharethis"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSession } from "../../../../lib/session"
import Server from "@/components/server"
import { createViewCounter, createWatchlist, increment } from "@/app/actions"
import { Suspense } from "react"
import VideoPlayer from "@/components/player/oplayer/ssr"
import Popular from "@/components/popular"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Comments from "@/components/comments/comments"
import MostView from "@/components/most-view"

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
  const [animeId, episodeId] = params.params

  const response = await animeInfo(animeId)

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
      url: `${publicUrl}/watch/${animeId}/${episodeId}`,
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
  const [animeId, episodeNumber, anilistId] = params as string[]
  const session = await getSession()

  if (!animeId || !episodeNumber) notFound()

  const animeResponse = await animeInfo(animeId)
  // const popularResponse = await popular()
  const anifyInfoResponse = await anifyInfo(anilistId)

  if (!animeResponse) notFound()

  await createViewCounter({
    animeId,
    title: animeResponse.title ?? animeResponse.otherName,
    image: animeResponse.image,
    latestEpisodeNumber: animeResponse.episodes.length,
    anilistId,
  })

  const sourcesPromise = watch(`${animeId}-episode-${episodeNumber}`)

  const nextEpisode = (): string => {
    if (Number(episodeNumber) === animeResponse.episodes?.length)
      return episodeNumber

    const nextEpisodeNumber = animeResponse.episodes.findIndex(
      (episode) => episode.number === Number(episodeNumber)
    )

    return String(nextEpisodeNumber + 2)
  }

  const prevEpisode = (): string => {
    if (Number(episodeNumber) === 1) return episodeNumber

    const nextEpisodeNumber = animeResponse.episodes.findIndex(
      (episode) => episode.number === Number(episodeNumber)
    )

    return String(nextEpisodeNumber)
  }

  if (session) {
    await createWatchlist({
      animeId,
      episodeNumber,
      title: animeResponse.title ?? animeResponse.otherName,
      image: animeResponse.image,
      nextEpisode: nextEpisode(),
      prevEpisode: prevEpisode(),
      anilistId,
    })
  }

  await increment(animeId, animeResponse.episodes.length)

  return (
    <div className="w-full px-[2%]">
      <div className="relative flex w-full max-w-full flex-col">
        <div className="flex flex-col xl:flex-row xl:space-x-4">
          <div className="mt-5 flex-1">
            <Suspense
              fallback={
                <div className="mt-5 flex-1">
                  <AspectRatio
                    ratio={16 / 9}
                    className="flex items-center justify-center"
                  >
                    <div className="loader"></div>
                  </AspectRatio>
                </div>
              }
            >
              <VideoPlayer
                animeId={animeId}
                nextEpisode={nextEpisode()}
                prevEpisode={prevEpisode()}
                sourcesPromise={sourcesPromise}
                episodeId={`${animeId}-episode-${episodeNumber}`}
                episodeNumber={episodeNumber}
                poster={anifyInfoResponse.bannerImage}
              />
            </Suspense>
            {/* <VideoPlayer animeId={animeId} episodeNumber={episodeNumber} /> */}
            <Suspense>
              <Server
                episodeId={`${animeId}-episode-${episodeNumber}`}
                animeResult={animeResponse}
                episodes={animeResponse?.episodes}
                animeId={animeId}
                anilistId={anilistId}
                episodeNumber={episodeNumber}
              />
            </Suspense>
            {animeResponse ? (
              <>
                <Episodes
                  animeId={animeId}
                  fullEpisodes={animeResponse.episodes}
                  episodeId={`${animeId}-episode-${episodeNumber}`}
                  anilistId={anilistId}
                />
                <Details data={animeResponse} />
              </>
            ) : (
              <div>Loading Episodes</div>
            )}
            <Sharethis />

            <Comments
              animeId={animeId}
              episodeNumber={episodeNumber}
              anilistId={anilistId}
            />
          </div>
          <Suspense>
            <MostView />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
