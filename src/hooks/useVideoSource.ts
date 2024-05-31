import useSWR from "swr"
import { env } from "@/env.mjs"

const useVideoSource = <T>(episodeId: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(
      `${env.NEXT_PUBLIC_ANIME_API_URL}/anime/gogoanime/watch/${episodeId}`
    ).then((res) => res.json())

  const { data, error } = useSWR<T>([episodeId], fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default useVideoSource
