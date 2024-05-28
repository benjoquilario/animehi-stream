import { animeApi } from "@/config/site"
import useSWR from "swr"

const useEpisodes = <T>(animeId: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(
      `https://consumet-api-production-2bba.up.railway.app/meta/anilist/episodes/${episodeId}?provider=gogoanime&dub=false`
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
