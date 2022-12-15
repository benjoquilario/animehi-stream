import useSWR from 'swr';

import { BASE_URL } from '@/utils/config';

const usePopular = () => {
  const url = `${BASE_URL}/meta/anilist/popular`;

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
