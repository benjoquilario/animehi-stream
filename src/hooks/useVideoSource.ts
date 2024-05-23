import useSWR from "swr"

const useVideoSource = <T>(episodeId: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(
      `https://consume-beige.vercel.app/anime/gogoanime/watch/${episodeId}`
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
