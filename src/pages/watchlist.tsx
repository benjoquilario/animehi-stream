import React, { useMemo } from 'react';
import Storage from '@/src/lib/utils/storage';
import DefaultLayout from '@/components/layouts/default';
import { NextSeo } from 'next-seo';
import Section from '@/components/shared/section';

const Watchlist = () => {
  const watchList = useMemo(() => {
    const storage = new Storage('watchedList');

    const list = typeof window !== 'undefined' && storage.find();
    return list;
  }, []);

  return (
    <DefaultLayout>
      <NextSeo
        title="AnimeHi - WatchList"
        description="Watch anime shows, tv, movies for free without ads in your mobile, tablet or pc"
      />
      {/* <Section></Section> */}
    </DefaultLayout>
  );
};

export default Watchlist;
