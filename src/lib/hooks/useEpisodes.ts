import useSWR from 'swr';
import { CONSUMET_URL } from '@/src/lib/constant';

const useEpisodes = (id: string, dub: boolean) => {
  const fetcher = async (episodeId: string, dub: boolean) =>
    fetch(`${CONSUMET_URL}/meta/anilist/episodes/${episodeId}?dub=${dub}`).then(
      res => res.json()
    );

  const { data, error } = useSWR([id, dub], fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useEpisodes;
