import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"

const useVideoSource = <T>(episodeId: string) => {
  const { data, error, isLoading } = useQuery<T>({
    queryKey: [episodeId],
    queryFn: async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_ANIME_API_URL}/meta/anilist/watch/${episodeId}`
      )

      const data = await response.json()

      return data
    },
  })

  return {
    data,
    isLoading,
    isError: error,
  }
}

export default useVideoSource
