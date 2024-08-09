import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"
import useSWR from "swr"

const useVideoSource = <T>(episodeId: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(
      `${env.NEXT_PUBLIC_ANIME_API_URL}/meta/anilist/watch/${episodeId}`
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
