import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAnimeState {
  recentRelease: any[];
  page: number;
  anime: number;
}

const initialState: IAnimeState = {
  recentRelease: [],
  page: 1,
  anime: 1,
};

export const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    increasePage: state => {
      state.page += 1;
    },
    decreasePage: state => {
      if (state.page === 1) return;
      state.page -= 1;
    },
    setAnime: (state, action) => {
      state.anime = action.payload;
    },
  },
});

export const { increasePage, decreasePage, setAnime } = animeSlice.actions;
export default animeSlice.reducer;
