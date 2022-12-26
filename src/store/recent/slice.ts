import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { IAnimeResult } from '@consumet/extensions/dist/models/types';
import { TitleType } from 'types/types';

const getRecentWatchedFromStorage = () => {
  if (typeof window === 'undefined') return;

  // @ts-ignore
  return JSON.parse(localStorage.getItem('recent'));
};

export interface IRecentState {
  watchList: IAnimeResult[];
  recentWatch: any[];
}

export interface IRecent {
  title: TitleType;
  episodeNumber: number;
  image: string;
  id: string;
}

const initialState: IRecentState = {
  watchList: [],
  recentWatch: getRecentWatchedFromStorage() || [],
};

export const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    setWatchList: (
      state: Draft<IRecentState>,
      action: PayloadAction<IAnimeResult>
    ) => {
      const existAnime = state.watchList.find(x => x.id === action.payload.id);

      if (existAnime) state.watchList.filter(x => x.id !== action.payload.id);
      else state.watchList = [...state.watchList, action.payload];
    },
    setRecentlyWatching: (
      state: Draft<IRecentState>,
      action: PayloadAction<any>
    ) => {
      const item = action.payload;
      state.recentWatch = [...state.recentWatch, item];
      localStorage.setItem('recent', JSON.stringify(state.recentWatch));
    },
  },
});

export const { setWatchList, setRecentlyWatching } = recentSlice.actions;
export default recentSlice.reducer;
