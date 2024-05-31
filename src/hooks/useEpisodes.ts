import useSWR from "swr"
import { env } from "@/env.mjs"

const useEpisodes = <T>(animeId: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(
      `${env.NEXT_PUBLIC_ANIME_API_URL}/meta/anilist/episodes/${episodeId}?provider=anify&dub=false`
    ).then((res) => res.json())

  const { data, error } = useSWR<T>([animeId], fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default useEpisodes
