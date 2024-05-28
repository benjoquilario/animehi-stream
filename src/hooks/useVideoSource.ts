import useSWR from "swr"

const useVideoSource = <T>(episodeId: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(
      `https://consumet-api-production-2bba.up.railway.app/anime/gogoanime/watch/${episodeId}`
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
