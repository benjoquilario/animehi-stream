import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { TitleType } from '@/src/../types/types';
import { CORS_PROXY } from '@/utils/config';
import { IVideo } from '@consumet/extensions/dist/models/types';

export interface WatchState {
  title: TitleType;
  image: string;
  episodeId: string;
  id: string;
  episodeNumber: number;
}

export interface IInitialState {
  episode: number;
  episodeId: string;
  totalEpisodes: number;
  sources: IVideo[];
  currentSource: string;
  videoLink?: string;
  provider: string;
  watchList: WatchState[];
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
};

export const watchSlice = createSlice({
  name: 'watch',
  initialState,
  reducers: {
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
    recentwatch: (
      state: Draft<IInitialState>,
      action: PayloadAction<WatchState>
    ) => {
      const item = action.payload;
      const existEpisode = state.watchList?.find(x => x.id === item.id);

      if (existEpisode) {
        state.watchList = state.watchList?.map(watch =>
          watch.id === existEpisode.id ? item : watch
        );
      } else {
      	state.watchList = [...state.watchList, item];
      }
    },
  },
});

export const {
  incrementEpisode,
  decrementEpisode,
  setEpisodes,
  setEpisodeId,
  setSources,
  resetSources,
  setProviders,
  setTotalEpisodes,
  resetStates,
  recentwatch,
} = watchSlice.actions;
export default watchSlice.reducer;
