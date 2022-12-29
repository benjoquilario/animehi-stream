import React, { useMemo } from 'react';
import Storage from '@/src/lib/utils/storage';
import Link from 'next/link';
import Image from '@/components/shared/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { RecentType } from 'types/types';
import { base64SolidImage } from '@/src/lib/utils/image';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper';
import { PlayIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import TitleName from '../shared/title-name';

const breakpoints = {
  1280: {
    slidesPerView: 6,
  },
  1024: {
    slidesPerView: 6,
  },
  768: {
    slidesPerView: 4,
  },
  640: {
    slidesPerView: 3,
  },
  0: {
    slidesPerView: 3,
  },
};

const ContinueWatching = () => {
  const recentlyWatching = useMemo(() => {
    const storage = new Storage('recentWatched');

    const list =
      typeof window !== 'undefined' && storage.find<RecentType>().reverse();
    return list as RecentType[];
  }, []);

  return (
    <div className="relative">
      <TitleName title="Continue Watching" />
      <Swiper
        breakpoints={breakpoints}
        spaceBetween={10}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        {recentlyWatching?.map(recently => (
          <SwiperSlide key={recently.animeId}>
            <div className="col-span-1">
              <div className="relative">
                <div className="relative cursor-pointer rounded overflow-hidden">
                  <div className="relative aspect-w-2 aspect-h-3">
                    <div className="opacity-100">
                      <Link href={`/anime/${recently?.animeId}`}>
                        <a aria-label={recently?.title || recently?.title}>
                          <Image
                            layout="fill"
                            src={`${recently?.image}`}
                            objectFit="cover"
                            placeholder="blur"
                            blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                              recently?.color
                            )}`}
                            className="rounded-lg"
                            alt={`Anime - ${
                              recently?.title || recently?.title
                            }`}
                            containerclassname="relative w-full h-full hover:opacity-70 transition-opacity"
                          />
                        </a>
                      </Link>
                    </div>
                    <Link
                      href={`/watch/${recently.animeId}?episode=${recently.episodeId}`}
                    >
                      <a
                        aria-label={`Play - ${
                          recently.title || recently.title
                        } episode ${recently.episodeNumber}`}
                        className="center-element flex justify-center items-center w-[101%] h-full opacity-0 hover:opacity-100 focus:opacity-100 hover:bg-[#1111117a] transition"
                      >
                        <div className="text-primary text-center flex flex-col items-center">
                          <PlayIcon className="h-11 w-11 md:h-16 md:w-16" />
                        </div>
                      </a>
                    </Link>
                  </div>
                  <h4 className="text-sm md:text-base font-bold text-white text-left">
                    Episode {recently.episodeNumber}
                  </h4>
                  <Link href={`/anime/${recently.animeId}`}>
                    <a
                      style={{
                        color: `${recently.color ? recently.color : '#fff'}`,
                      }}
                      className={classNames(
                        'line-clamp-2 w-full h-auto text-left text-sm md:text-base hover:text-white font-semibold'
                      )}
                    >
                      {recently.title || recently.title}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default React.memo(ContinueWatching);
