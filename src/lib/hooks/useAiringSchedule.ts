import useSWR from 'swr';
import { CONSUMET_URL } from '@/src/lib/constant';
import { IAnimeResult, ISearch } from '@consumet/extensions/dist/models/types';
import { TitleType } from 'types/types';

interface AiringResults extends IAnimeResult {
  title: TitleType;
}

const useAiringSchedule = () => {
  const url = `${CONSUMET_URL}/meta/anilist/airing-schedule`;

  const fetcher = async () => fetch(url).then(res => res.json());
  const { data, error } = useSWR<ISearch<AiringResults>>(url, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data: data?.results,
    isLoading: !error && !data,
  };
};

export default useAiringSchedule;
