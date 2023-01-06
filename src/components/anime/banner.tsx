import React from 'react';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper';
import Icon from '@/components/shared/icon';
import Genre from '@/components/shared/genre';
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/solid';
import { TitleType } from '@/src/../types/types';
import { episodesTitle, stripHtml } from '@/src/lib/utils/index';
import {
  IAnimeInfo,
  IAnimeResult,
  ISearch,
} from '@consumet/extensions/dist/models/types';
import { title } from '@/lib/helper';
import { LoadingBanner } from '../shared/loading';

export interface BannerResult extends IAnimeResult {
  title: TitleType;
  genres: string[];
}

export type BannerProps = {
  animeList?: ISearch<IAnimeInfo | IAnimeResult>;
  isLoading: boolean;
};

const Banner = ({ animeList, isLoading }: BannerProps): JSX.Element =>
  !isLoading ? (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {animeList?.results?.map(anime => (
        <SwiperSlide key={anime.id}>
          <div className="relative w-full h-[326px] md:h-[450px] min-h-[326px] md:min-h-[450px] 2xl:h-[620px] 2xl:min-h-[620px]">
            <div className="relative flex items-center w-full h-full shrink-0">
              <span className="banner-linear absolute top-0 left-0 w-full h-[101%] z-[20]"></span>
              <div className="absolute pl-[4%] md:pl-0 pr-[1rem] left-0 z-[20] w-[80%] md:w-[40%] bottom-[15%]">
                <h1 className="text-white text-xl font-bold line-clamp-2 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
                  {title(anime.title as TitleType)}
                </h1>

                <p className="leading-6 text-sm md:text-base line-clamp-2 text-slate-300 font-extralight mt-2">
                  {stripHtml(`${anime?.description}`)}
                </p>
                <div className="hidden mr-2 md:flex flex-wrap gap-2 mt-2">
                  {/* @ts-ignore */}
                  {anime?.genres?.map((genre: string) => (
                    <div className="flex items-center gap-2" key={genre}>
                      <Genre genre={genre} />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block"></span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/watch/${anime?.id}?episode=${episodesTitle(
                      /* @ts-ignore */
                      anime?.title?.romaji as string
                    )}-episode-1`}
                  >
                    <a className="mt-4 py-2 px-4 bg-primary text-gray-200 rounded-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary hover:scale-105 transition-all ease-in-out rounded-md">
                      <Icon icon={PlayIcon} text={`Play Now`} />
                    </a>
                  </Link>
                  <Link href={`/anime/${anime?.id}`}>
                    <a className="mt-4 py-2 px-4 bg-[#6e6f74] text-gray-200 rounded-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary hover:scale-105 transition-all ease-in-out rounded-md">
                      <Icon icon={InformationCircleIcon} text={`Read More`} />
                    </a>
                  </Link>
                </div>
              </div>

              <div className="absolute right-0 grow z-[2] md:z-40 h-full md:h-[320px] w-full md:w-[60%]">
                <div
                  style={{
                    backgroundImage: `url("${anime?.cover || anime?.image}")`,
                  }}
                  className="relative overflow-hidden bg-no-repeat	bg-center	w-full h-full bg-cover rounded-md mt-6"
                ></div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    <LoadingBanner />
  );

export default React.memo(Banner);
