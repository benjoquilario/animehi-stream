import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IRecentState {
  page: number;
}

const initialState: IRecentState = {
  page: 1,
};

export const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    increasePage: state => {
      state.page = state.page + 1;
    },
    decreasePage: state => {
      if (state.page === 1) return;
      state.page -= 1;
    },
    setCurrentPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { increasePage, decreasePage, setCurrentPage } =
  recentSlice.actions;
export default recentSlice.reducer;
