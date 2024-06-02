import useSWR from "swr"
import { env } from "@/env.mjs"

const useMetadata = <T>(animeId: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(`https://api.anify.tv/content-metadata/${episodeId}`).then((res) =>
      res.json()
    )

  const { data, error } = useSWR<T>([animeId], fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default useMetadata
