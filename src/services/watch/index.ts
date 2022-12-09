import { apiSlice } from '../api';

const watchApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getWatchEpisode: builder.query({
      query: arg => {
        const { episodeId, provider } = arg;
        return {
          url: `/meta/anilist/watch/${episodeId}?provider${provider}`,
        };
      },
    }),
  }),
});

export const { useGetWatchEpisodeQuery } = watchApi;
