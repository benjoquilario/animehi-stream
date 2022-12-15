import React from 'react';
import { BASE_URL } from '@/utils/config';
import useSWR from 'swr';
import { IAnimeInfo, IAnimeResult, ISearch } from '@consumet/extensions';

interface IUseMediaProps {
  type: string;
  page: number;
  perPage: number;
  season?: string;
  format: string;
  sort: string;
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
  const fetcher = async (
    type: string,
    page: number,
    perPage: number,
    season: string,
    format: string,
    sort: string,
    year: number
  ) =>
    fetch(
      `${BASE_URL}/meta/anilist/advanced-search?page=${page}&sort=${sort}&type=${type}&format=${format}&perPage=${perPage}${
        season ? `&season=${season}` : ''
      }${year ? `&year=${year}` : ''}`
    ).then(res => res.json());

  const { data, error } = useSWR<ISearch<IAnimeResult | IAnimeInfo>>(
    [type, page, perPage, season, format, sort, year],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    isLoading: !data && !error,
  };
};

export default useMedia;
