import React from 'react';
import Storage from '@/src/lib/utils/storage';

const useSavedWatched = ({ ...args }) => {
  const storage = new Storage('watched');

  const localStorageData =
    typeof window !== 'undefined' && storage.create(args);

  return {
    data: localStorageData,
  };
};

export default useSavedWatched;
