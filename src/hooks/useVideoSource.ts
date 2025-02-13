import { env } from "@/env.mjs"
import useSWR from "swr"

const useVideoSource = <T>(episodeId: string, provider: string = "zoro") => {
  const fetcher = async (episodeId: string) =>
    fetch(
      `${env.NEXT_PUBLIC_APP_URL}/api/anime/sources?episodeId=${episodeId}?provider=${provider}`
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
