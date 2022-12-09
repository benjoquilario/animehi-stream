import useSWR from 'swr';
import { BASE_URL } from '@/utils/config';

const useEpisodes = (id: string) => {
  const fetcher = async (episodeId: string) =>
    fetch(`${BASE_URL}/meta/anilist/episodes/${episodeId}`).then(res =>
      res.json()
    );

  const { data, error } = useSWR(id, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    episodes: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useEpisodes;
