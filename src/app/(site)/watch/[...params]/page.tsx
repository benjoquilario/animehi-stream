import { animeInfo, popular, watch, publicUrl } from "@/lib/consumet"
import Popular from "@/components/popular"
import { OPlayer } from "@/components/player/oplayer"
import Episodes from "@/components/episode/episodes"
import Details from "@/components/details"
import Sharethis from "@/components/sharethis"
import type { Metadata } from "next"
import ArtPlayerComponent from "@/components/player/art-player"
import { notFound } from "next/navigation"
import { getSession } from "../../../../lib/session"
import db from "@/lib/db"
import Server from "@/components/server"

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

export default async function Watch({ params: { params } }: Params) {
  const [animeId, episodeId, episodeNumber] = params as string[]
  const session = await getSession()

  if (!animeId || !episodeId || !episodeNumber) notFound()

  const [animeSettled, popularSettled] = await Promise.allSettled([
    animeInfo(animeId),
    popular(),
  ])

  const popularAnime =
    popularSettled.status === "fulfilled" ? popularSettled.value : null
  const animeResponse =
    animeSettled.status === "fulfilled" ? animeSettled.value : null

  if (!popularAnime || !animeResponse) notFound()

  const sourcesPromise = watch(episodeId)

  if (session) {
    try {
      const isEpisodeIdExist = await db.watchlist.findFirst({
        where: {
          episodeId,
        },
      })

      if (isEpisodeIdExist) throw new Error("Episode Already Exist")

      if (animeResponse) {
        await db.watchlist.create({
          data: {
            episodeId,
            episodeNumber: Number(episodeNumber),
            image: animeResponse.image,
            title: animeResponse.title,
            animeId,
            userId: session.user.id,
          },
        })
      }
    } catch (error) {
      console.log("Error", error)
    }
  }

  return (
    <div className="w-full px-[2%]">
      <div className="relative flex w-full max-w-full flex-col">
        <div className="flex flex-col md:space-x-4 xl:flex-row">
          <div className="mt-5 flex-1">
            <OPlayer
              animeResult={animeResponse}
              animeId={animeId}
              sourcesPromise={sourcesPromise}
              episodeNumber={episodeNumber}
              episodeId={episodeId}
              episodes={animeResponse?.episodes}
              image={animeResponse?.image}
            >
              <Server
                episodeId={episodeId}
                animeResult={animeResponse}
                episodes={animeResponse?.episodes}
                animeId={animeId}
              />
            </OPlayer>
            {animeResponse ? (
              <>
                <Episodes
                  animeId={animeId}
                  fullEpisodes={animeResponse.episodes}
                  episodeId={episodeId}
                />
                <Details data={animeResponse} />
              </>
            ) : (
              <div>Loading Episodes</div>
            )}
            <Sharethis />
          </div>

          <Popular popularAnime={popularAnime?.results} />
        </div>
      </div>
    </div>
  )
}
