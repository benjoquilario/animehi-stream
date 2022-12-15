import React, { useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/shared/icon';
import Genre from '@/components/shared/genre';
import progressBar from '@/components/shared/loading';
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/solid';
import { TitleType } from '@/src/../types/types';
import { episodesTitle, stripHtml } from '@/utils/index';

export type IBannerProps = {
  cover?: string;
  title?: TitleType;
  description?: string;
  genres?: string[];
  id?: string;
  image?: string;
};

const Banner: React.FC<IBannerProps> = ({
  cover,
  title,
  description,
  genres,
  id,
  image,
}) => (
  <div className="relative w-full h-[396px] md:h-[430px] min-h-[396px] md:min-h-[430px] 2xl:h-[620px] 2xl:min-h-[620px]">
    <div className="relative flex items-center w-full h-full shrink-0">
      <span className="banner-linear absolute top-0 left-0 w-full h-[101%] z-[20]"></span>
      <div className="absolute pl-[4%] md:pl-0 pr-[1rem] left-0 z-[20] w-[80%] md:w-[45%] bottom-[15%]">
        <h1 className="text-white text-xl font-bold line-clamp-2 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
          {title?.english || title?.romaji}
        </h1>

        <p className="leading-6 text-sm md:text-base line-clamp-2 text-slate-300 font-extralight mt-2">
          {stripHtml(description || '')}
        </p>
        <div className="hidden mr-2 md:flex flex-wrap gap-2 mt-2">
          {genres!.map((genre: string) => (
            <div className="flex items-center gap-2" key={genre}>
              <Genre genre={genre} />
              <span className="w-1.5 h-1.5 bg-[#6a55fa] rounded-full inline-block"></span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/watch/${id}?episode=${episodesTitle(
              title?.romaji as string
            )}episode-1`}
          >
            <a className="mt-4 py-2 px-4 bg-[#6a55fa] text-gray-200 rounded-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#6a55fa] hover:scale-105 transition-all ease-in-out rounded-md">
              <Icon icon={PlayIcon} text={`Watch Now`} />
            </a>
          </Link>
          <Link href={`/anime/${id}`}>
            <a className="mt-4 py-2 px-4 bg-[#6e6f74] text-gray-200 rounded-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#6a55fa] hover:scale-105 transition-all ease-in-out rounded-md">
              <Icon icon={InformationCircleIcon} text={`Read More`} />
            </a>
          </Link>
        </div>
      </div>

      <div className="absolute right-0 grow z-[2] md:z-40 h-full md:h-[290px] w-full md:w-[50%]">
        <div
          style={{ backgroundImage: `url("${cover || image}")` }}
          className="relative overflow-hidden bg-no-repeat	bg-center	w-full h-full bg-cover rounded-md mt-4"
        ></div>
      </div>
    </div>
  </div>
);

export default React.memo(Banner);
