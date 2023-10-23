import useSWR from "swr"
import { url } from "@/lib/consumet"

const useVideoSource = ({ episodeId }: { episodeId?: string }) => {
  const fetcher = async (episodeId: string) =>
    fetch(`${url}/watch/${episodeId}`).then((res) => res.json())

  const { data, error } = useSWR([episodeId], fetcher, {
    revalidateOnFocus: false,
  })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default useVideoSource
