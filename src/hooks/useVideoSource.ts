import { BASE_URL } from '@/utils/config';
import useSWRImmutable from 'swr';

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

  const { data, error } = useSWRImmutable([episodeId, provider], fetcher);

  return {
    sources: data?.sources,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useVideoSource;
