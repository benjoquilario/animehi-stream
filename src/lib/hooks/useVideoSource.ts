import { CONSUMET_URL, ENIME_URL } from '@/src/lib/constant';
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
      `${
        episodeId.includes('episode')
          ? `${CONSUMET_URL}/meta/anilist/watch/${episodeId}?provider=${provider}`
          : `${ENIME_URL}source/${episodeId}`
      }  `
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
