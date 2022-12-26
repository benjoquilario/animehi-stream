import { configureStore } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from 'react-redux';
import animeReducer from '@/store/anime/slice';
import watchReducer from '@/store/watch/slice';
import recentReducer from '@/store/recent/slice';

export const createStore = (preloadedState?: { [x: string]: any }) =>
  configureStore({
    reducer: {
      anime: animeReducer,
      watch: watchReducer,
      recent: recentReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      }),
    preloadedState,
  });

let prevStore: Store | undefined;
export const initialiseStore = (preloadedState?: { [x: string]: any }) => {
  let newStore = prevStore ?? createStore(preloadedState);

  if (preloadedState && prevStore) {
    newStore = createStore({ ...prevStore.getState(), ...preloadedState });
    prevStore = undefined;
  }

  if (typeof window === 'undefined') return newStore;

  if (!prevStore) prevStore = newStore;

  return newStore;
};

export const useStore = (preloadedState?: { [x: string]: any }) =>
  useMemo(() => initialiseStore(preloadedState), [preloadedState]);

export type Store = ReturnType<typeof createStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];

export const useDispatch = () => useDispatchBase<AppDispatch>();

export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector);
