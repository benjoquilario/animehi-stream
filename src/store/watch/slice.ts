import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { CORS_PROXY } from '@/src/lib/constant';
import { IAnimeResult, IVideo } from '@consumet/extensions/dist/models/types';
import { EnimeSource } from 'types/types';

export interface WatchState {
  animeList: IAnimeResult;
}

export interface IInitialState {
  episode: number;
  episodeId: string;
  totalEpisodes: number;
  sources: IVideo[];
  enimeSource: EnimeSource;
  currentSource: string;
  videoLink?: string;
  provider: string;
  server: string;
  dub: boolean;
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
  dub: false,
  enimeSource: {
    id: '',
    url: '',
    referer: '',
    priority: 1,
    browser: true,
    website: 'https://gogoanime.ar',
  },
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
        state.videoLink = `${CORS_PROXY}${
          sources.find(el => el.quality === 'default')?.url ||
          sources.find(el => el.quality === 'backup')?.url
        }`;
      }
    },
    toggleDub: (
      state: Draft<IInitialState>,
      action: PayloadAction<boolean>
    ) => {
      state.dub = action.payload;
    },
    setEnimeSouces: (
      state: Draft<IInitialState>,
      action: PayloadAction<EnimeSource>
    ) => {
      const enimeSources = action.payload;
      if (!enimeSources) {
        state.enimeSource = initialState.enimeSource;
      } else {
        state.enimeSource = enimeSources;
        state.videoLink = state.enimeSource.url;
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
  setEnimeSouces,
  toggleDub,
} = watchSlice.actions;
export default watchSlice.reducer;
