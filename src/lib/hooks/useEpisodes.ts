import useSWR from 'swr';
import { CONSUMET_URL } from '@/src/lib/constant';

const useEpisodes = (id: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(`${CONSUMET_URL}/meta/anilist/episodes/${episodeId}`).then(res =>
      res.json()
    );

  const { data, error } = useSWR(id, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useEpisodes;
