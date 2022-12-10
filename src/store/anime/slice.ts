import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAnimeState {
  recentRelease: any[];
  page: number;
  animeId: string;
}

const initialState: IAnimeState = {
  recentRelease: [],
  page: 1,
  animeId: '',
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
    setAnimeId: (state, action) => {
      state.animeId = action.payload;
    },
  },
});

export const { increasePage, decreasePage, setAnimeId } = animeSlice.actions;
export default animeSlice.reducer;
