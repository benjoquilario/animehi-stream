import {
  IAnimeResponse,
  TAnimeInfo,
  TRecentResponse,
} from '@/src/../types/types';
import { apiSlice } from 'services/api';

export const animeApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPopular: builder.query<IAnimeResponse, number>({
      query: (page = 1) => `/meta/anilist/popular?page=${page}`,
    }),
    getTrending: builder.query<IAnimeResponse, number>({
      query: (page = 1) => `/meta/anilist/trending?page=${page}`,
    }),
    getRecentRelease: builder.query<TRecentResponse, number | void>({
      query: (page = 1) => `/meta/anilist/recent-episodes?page=${page}`,
    }),
    getAnimeInfoId: builder.query<TAnimeInfo, string | void>({
      query: id => `/meta/anilist/info/${id}`,
    }),
  }),
});

export const {
  useGetPopularQuery,
  useGetTrendingQuery,
  useGetRecentReleaseQuery,
  useGetAnimeInfoIdQuery,
} = animeApi;
