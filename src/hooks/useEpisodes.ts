import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"
import { IAnifyEpisodeResponse, IEpisode } from "types/types"

const useEpisodes = (animeId: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["episodes", animeId],
    queryFn: async () => {
      let results: IEpisode[]

      const response = await fetch(
        `${env.NEXT_PUBLIC_ANIME_API_URL}/meta/anilist/episodes/${animeId}?provider=gogoanime&dub=false`
      )
      const data = (await response.json()) as IEpisode[]

      if (data.length !== 0) {
        results = data
      } else {
        const response = await fetch(
          `${env.NEXT_PUBLIC_PROXY_URI}=${env.NEXT_PUBLIC_ANIME_API_URL_V3}/anime/info/${animeId}`
        )

        const data = await response.json()

        const { episodesList } = data.data

        const transformEpisode: IEpisode[] = episodesList.map(
          (episode: {
            episodeId: number
            id: string
            number: number
            title: string
          }) => {
            return {
              id: episode.episodeId,
              title: `Episode ${episode.number}`,
              image: null,
              imageHash: "hash",
              number: episode.number,
              createdAt: null,
              description: null,
              url: "",
            }
          }
        )

        console.log(transformEpisode)
        results = transformEpisode
      }

      return results
    },
  })

  return {
    data,
    isLoading,
    isError: error,
  }
}

export default useEpisodes
