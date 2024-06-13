import { env } from "@/env.mjs"
import { useQuery } from "@tanstack/react-query"

const useAnimeInfo = <T>(animeId: string) => {
  const fetcher = async (animeId: string) =>
    fetch(`${env.NEXT_PUBLIC_APP_URL}/api/anime/info/${animeId}`).then((res) =>
      res.json()
    )

  const { data, error, isLoading } = useQuery<T>({
    queryKey: [animeId],
    queryFn: () => fetcher(animeId),
  })

  return {
    data,
    isLoading,
    isError: error,
  }
}

export default useAnimeInfo
