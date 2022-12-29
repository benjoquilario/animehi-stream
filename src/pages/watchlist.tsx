import React, { useEffect, useState } from 'react';
import Storage from '@/src/lib/utils/storage';
import DefaultLayout from '@/components/layouts/default';
import { NextSeo } from 'next-seo';
import Section from '@/components/shared/section';
import TitleName from '@/components/shared/title-name';
import WatchCard from '@/components/shared/watch-card';
import { TitleType } from 'types/types';
import { IAnimeInfo } from '@consumet/extensions/dist/models/types';
import Button from '@/components/shared/button';
import { BsFillTrashFill } from 'react-icons/bs';

const Watchlist = () => {
  const [watchList, setWatchList] = useState<IAnimeInfo[] | []>([]);
  const storage = new Storage('watchedList');

  useEffect(() => {
    const list =
      typeof window !== 'undefined' && storage.find<IAnimeInfo>().reverse();
    setWatchList(list as IAnimeInfo[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteWatchList = () => {
    setWatchList([]);
    return typeof window !== 'undefined' && storage.clear();
  };

  const removeItem = (animeId?: string) => {
    const storage = new Storage('watchedList');

    typeof window !== 'undefined' && storage.remove({ id: animeId });
    const list =
      typeof window !== 'undefined' && storage.find<IAnimeInfo>().reverse();

    setWatchList(list as IAnimeInfo[]);
  };

  return (
    <DefaultLayout>
      <NextSeo
        title="AnimeHi - WatchList"
        description="Watch anime shows, tv, movies for free without ads in your mobile, tablet or pc"
      />
      <Section>
        <main className="mt-[104px] px-[3%]">
          <div className="flex flex-col space-y-6 md:grid grid-cols-1 md:gap-4">
            <div>
              <div className="flex justify-between w-full mb-4">
                <TitleName title="Watchlist" />
                <Button
                  onClick={deleteWatchList}
                  className="p-1 md:p-2 text-[#ededed] hover:bg-background-900 rounded-full transition"
                  aria-label="previous page"
                >
                  <BsFillTrashFill className="h-6 w-6" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative overflow-hidden">
                {watchList?.map(list => (
                  <WatchCard
                    onClick={() => removeItem(list.id)}
                    key={list.id}
                    animeId={list.id}
                    title={list.title as string}
                    image={list.image}
                    color={list.color}
                    episodeNumber={list.episodeNumber as number}
                    episodeId={list.episodeId as string}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </Section>
    </DefaultLayout>
  );
};

export default Watchlist;
