import { BASE_URL } from '@/utils/config';
import useSWR from 'swr';

const useVideoSource = ({
  episodeId,
  provider,
}: {
  episodeId?: string;
  provider?: string;
}) => {
  const fetcher = async (episodeId: string, provider: string) =>
    fetch(
      `${BASE_URL}/meta/anilist/watch/${episodeId}?provider=${provider}`
    ).then(res => res.json());

  const { data, error } = useSWR([episodeId, provider], fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useVideoSource;
