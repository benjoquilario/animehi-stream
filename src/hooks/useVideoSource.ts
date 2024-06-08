import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"

const useVideoSource = <T>(episodeId: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(
      `${env.NEXT_PUBLIC_ANIME_API_URL}/anime/gogoanime/watch/${episodeId}`
    ).then((res) => res.json())

  const { data, error, isLoading } = useQuery<T>({
    queryKey: [episodeId],
    queryFn: () => fetcher(episodeId),
  })

  return {
    data,
    isLoading,
    isError: error,
  }
}

export default useVideoSource
