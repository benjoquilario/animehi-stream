import getJSON from './api';
const BASE_URL = 'https://api.consumet.org';

const api = {
  popularAnime: (page: string | number): Promise<any> => {
    return getJSON(`${BASE_URL}/meta/anilist/popular`);
  },
  trendingAnime: (): Promise<any> => {
    return getJSON(`${BASE_URL}/meta/anilist/trending?perPage=12`);
  },
  recentRelease: (page: string | number): Promise<any> => {
    return getJSON(
      `${BASE_URL}/meta/anilist/recent-episodes?page=${page}&perPage=25`
    );
  },
  animeInfo: (
    id: string | number,
    provider: string = 'gogoanime'
  ): Promise<any> => {
    return getJSON(`${BASE_URL}/meta/anilist/info/${id}?provider=${provider}`);
  },
  streamAnime: (id: string | number): Promise<any> => {
    return getJSON(`${BASE_URL}/meta/anilist/watch/${id}`);
  },
};

export default api;
