import { env } from "@/env.mjs"
import useSWR from "swr"

const useVideoSource = <T>(
  episodeId: string,
  provider: string = "gogoanime"
) => {
  const fetcher = async (episodeId: string) =>
    fetch(
      `${env.NEXT_PUBLIC_ANIME_API_URL}/meta/anilist/watch/${episodeId}?provider=${provider}`
    ).then((res) => res.json())

  const { data, error, isLoading } = useSWR([episodeId], fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data,
    isLoading,
    isError: error,
  }
}

export default useVideoSource
