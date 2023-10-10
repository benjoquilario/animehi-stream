import { animeInfo, popular, watch } from "@/lib/consumet"
import Popular from "@/components/popular"
import { Watch as VideoPlayer } from "@/components/player/watch"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Episodes from "@/components/player/episodes"
import Server from "@/components/server"

type Params = {
  params: {
    params: string[]
  }
}

export default async function Watch({ params: { params } }: Params) {
  const [animeId, episodeId] = params as string[]

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
            <AspectRatio ratio={16 / 9}>
              <VideoPlayer animeId={animeId} sourcesPromise={sourcesPromise} />
            </AspectRatio>
            <Server />
            {animeResponse ? (
              <Episodes
                animeId={animeId}
                fullEpisodes={animeResponse.episodes}
                episodeId={episodeId}
              />
            ) : (
              <div>Loading Episodes</div>
            )}
          </div>

          <Popular popularAnime={popularAnime?.results} />
        </div>
      </div>
    </div>
  )
}
