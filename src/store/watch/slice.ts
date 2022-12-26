import { createSlice, current, Draft, PayloadAction } from '@reduxjs/toolkit';
import { TitleType } from '@/src/../types/types';
import { CORS_PROXY } from '@/utils/config';
import { IAnimeResult, IVideo } from '@consumet/extensions/dist/models/types';

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
  server: string;
}

const initialState: IInitialState = {
  episode: 1,
  totalEpisodes: 1,
  episodeId: '',
  sources: [],
  currentSource: '',
  videoLink: '',
  provider: 'gogoanime',
  server: 'server 1',
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
    setServer: (state: Draft<IInitialState>, action: PayloadAction<string>) => {
      state.server = action.payload;
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
        state.sources = action.payload;
        state.videoLink = `${
          sources.find(el => el.quality === 'default')?.url ||
          sources.find(el => el.quality === 'backup')?.url
        }`;
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
  setServer,
} = watchSlice.actions;
export default watchSlice.reducer;
