import { createSlice, current, Draft, PayloadAction } from '@reduxjs/toolkit';
import { TitleType } from '@/src/../types/types';
import { CORS_PROXY } from '@/utils/config';
import { IAnimeResult, IVideo } from '@consumet/extensions/dist/models/types';
import { setFromStorage } from '@/utils/index';

export interface WatchState {
  animeList: IAnimeResult;
}

export interface IInitialState {
  episode: number;
  episodeId: string;
  totalEpisodes: number;
  sources: IVideo[];
  currentSource: string;
  videoLink?: string;
  provider: string;
  watchList: IAnimeResult[];
  recentWatch: any[];
}

const initialState: IInitialState = {
  episode: 1,
  totalEpisodes: 1,
  episodeId: '',
  sources: [],
  currentSource: '',
  videoLink: '',
  provider: 'gogoanime',
  watchList: [],
  recentWatch: [],
};

export const watchSlice = createSlice({
  name: 'watch',
  initialState,
  reducers: {
    setEpisodes: (state: Draft<IInitialState>, action) => {
      state.episode = action.payload;
    },
    setTotalEpisodes: (
      state: Draft<IInitialState>,
      action: PayloadAction<number>
    ) => {
      state.totalEpisodes = action.payload;
    },
    setEpisodeId: (
      state: Draft<IInitialState>,
      action: PayloadAction<string>
    ) => {
      state.episodeId = action.payload;
    },
    setProviders: (
      state: Draft<IInitialState>,
      action: PayloadAction<string>
    ) => {
      state.provider = action.payload;
    },
    setSources: (
      state: Draft<IInitialState>,
      action: PayloadAction<IVideo[]>
    ) => {
      const sources = action.payload;
      if (!sources) {
        state.sources = initialState.sources;
      } else {
        state.sources = sources.filter(el => el.quality !== 'default');
        state.videoLink = `${CORS_PROXY}${state.sources[0].url}`;
      }
    },
    resetSources: (state: Draft<IInitialState>) => {
      state.sources = initialState.sources;
      state.videoLink = initialState.videoLink;
    },
    resetStates: (state: Draft<IInitialState>) => {
      state.episode = initialState.episode;
      state.totalEpisodes = initialState.totalEpisodes;
      state.episodeId = initialState.episodeId;
      state.sources = initialState.sources;
      state.currentSource = initialState.currentSource;
      state.videoLink = initialState.videoLink;
      state.provider = initialState.provider;
    },
    setWatchList: (
      state: Draft<IInitialState>,
      action: PayloadAction<IAnimeResult>
    ) => {
      const existAnime = state.watchList.find(x => x.id === action.payload.id);

      if (existAnime) state.watchList.filter(x => x.id !== action.payload.id);
      else state.watchList = [...state.watchList, action.payload];

      setFromStorage('watchList', JSON.stringify(state.watchList));
    },
    setRecentlyWatching: (
      state: Draft<IInitialState>,
      action: PayloadAction<IAnimeResult>
    ) => {
      const item = action.payload;
      const isEpisodeExist = state.recentWatch.find(x => x.id === item.id);

      if (isEpisodeExist)
        state.recentWatch.map(recent =>
          recent.id === item.id ? item : recent
        );
      else state.recentWatch = [...state.recentWatch, item];

      setFromStorage('recentWatch', JSON.stringify(state.recentWatch));
    },
  },
});

export const {
  setEpisodes,
  setEpisodeId,
  setSources,
  resetSources,
  setProviders,
  setTotalEpisodes,
  resetStates,
  setWatchList,
  setRecentlyWatching,
} = watchSlice.actions;
export default watchSlice.reducer;
