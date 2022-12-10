import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { TResults, TitleType } from '@/src/../types/types';
import { CORS_PROXY } from '@/utils/config';

export interface WatchState {
  title: TitleType;
  image: string;
  episodes: number;
}

export interface SourceType {
  url: string;
  isM3U8: boolean;
  quality: string;
}

export interface IInitialState {
  episode: number;
  episodeId: string;
  totalEpisodes: number;
  currentData: string;
  sources: SourceType[];
  prevWatchId: number;
  currentSource: string;
  videoLink: string;
  provider: string;
  watchList: WatchState[];
}

const initialState: IInitialState = {
  episode: 1,
  totalEpisodes: 1,
  episodeId: '',
  sources: [
    {
      url: 'https://example.com/404/',
      quality: '720p',
      isM3U8: true,
    },
  ],
  currentData: '',
  currentSource: '',
  prevWatchId: 1,
  videoLink: '',
  provider: 'gogoanime',
  watchList: [],
};

export const watchSlice = createSlice({
  name: 'watch',
  initialState,
  reducers: {
    setPrevWatch: (state, action) => {
      state.prevWatchId = action.payload;
    },
    incrementEpisode: (state: Draft<IInitialState>) => {
      state.episode += 1;
    },
    decrementEpisode: (state: Draft<IInitialState>) => {
      if (!(state.episode <= 1)) state.episode -= 1;
    },
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
      action: PayloadAction<SourceType[]>
    ) => {
      if (!action.payload || action.payload.length === 0) {
        state.sources = initialState.sources;
      } else {
        state.sources = action.payload;
        state.videoLink = `${CORS_PROXY}${state.sources[1]?.url}`;
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
      state.currentData = initialState.currentData;
      state.currentSource = initialState.currentSource;
      state.prevWatchId = initialState.prevWatchId;
      state.videoLink = initialState.videoLink;
      state.provider = initialState.provider;
      state.watchList = initialState.watchList;
    },
  },
});

export const {
  setPrevWatch,
  incrementEpisode,
  decrementEpisode,
  setEpisodes,
  setEpisodeId,
  setSources,
  resetSources,
  setProviders,
  setTotalEpisodes,
  resetStates,
} = watchSlice.actions;
export default watchSlice.reducer;
