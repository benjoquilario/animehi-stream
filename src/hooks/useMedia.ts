import React, { useState, useEffect } from 'react';
import { BASE_URL } from '@/utils/config';
import { META } from '@consumet/extensions';
import useSWR from 'swr';
import { IAnimeInfo, IAnimeResult, ISearch } from '@consumet/extensions';

interface IUseMediaProps {
  type: string;
  page: number;
  perPage: number;
  season?: string;
  format: string;
  sort: string[];
  year?: number;
}

const useMedia = ({
  type,
  page,
  perPage,
  season,
  format,
  sort,
  year,
}: IUseMediaProps) => {
  const anilist = new META.Anilist();
  const [animeList, setAnimeList] = useState<
    ISearch<IAnimeResult | IAnimeInfo> | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // prettier-ignore
  useEffect(() => {
    (async () => {
      const data: ISearch<IAnimeResult | IAnimeInfo> =
        await anilist.advancedSearch(
          undefined,
          type,
          page,
          perPage,
          format,
          sort,
          undefined,
          undefined,
          year,
          undefined,
          season
        );

      setAnimeList(data);
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    data: animeList,
    isLoading,
  };
};

export default useMedia;
