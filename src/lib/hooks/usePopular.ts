import useSWR from 'swr';

import { CONSUMET_URL } from '@/src/lib/constant';

const usePopular = () => {
  const url = `${CONSUMET_URL}/meta/anilist/popular`;

  const fetcher = async () => fetch(url).then(res => res.json());
  const { data, error } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data,
    isLoading: !error && !data,
  };
};

export default usePopular;
