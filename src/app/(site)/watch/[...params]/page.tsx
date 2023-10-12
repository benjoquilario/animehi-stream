import { animeInfo, popular, watch } from "@/lib/consumet"
import Popular from "@/components/popular"
import { OPlayer } from "@/components/player/oplayer"
import Episodes from "@/components/episode/episodes"
import Details from "@/components/details"
import Sharethis from "@/components/sharethis"
import { mediaInfoQuery } from "@/lib/graphql"

type Params = {
  params: {
    params: string[]
  }
}

export default async function Watch({ params: { params } }: Params) {
  const [animeId, episodeId, episodeNumber] = params as string[]

  const [animeSettled, popularSettled] = await Promise.allSettled([
    animeInfo(animeId),
    popular(),
  ])

  const popularAnime =
    popularSettled.status === "fulfilled" ? popularSettled.value : null
  const animeResponse =
    animeSettled.status === "fulfilled" ? animeSettled.value : null

  const sourcesPromise = watch(episodeId)

  return (
    <div className="w-full px-[2%]">
      <div className="relative flex w-full max-w-full flex-col">
        <div className="flex flex-col md:space-x-4 xl:flex-row">
          <div className="mt-5 flex-1">
            <OPlayer
              animeId={animeId}
              sourcesPromise={sourcesPromise}
              episodeNumber={episodeNumber}
              episodeId={episodeId}
              episodes={animeResponse?.episodes}
            />
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
