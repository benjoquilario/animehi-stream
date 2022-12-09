import React, { useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/shared/icon';
import Genre from '@/components/shared/genre';
import progressBar from '@/components/shared/loading';
import { PlayIcon } from '@heroicons/react/solid';
import { stripHtml } from '@/utils/index';
import { TitleType } from '@/src/../types/types';
import useDevice from '@/hooks/useDevice';

export interface IBannerProps {
  cover?: string;
  title?: TitleType;
  description?: string;
  genres?: string[];
  id?: string;
}

const Banner: React.FC<IBannerProps> = ({
  cover,
  title,
  description,
  genres,
  id,
}) => {
  useEffect(() => {
    if (!cover) progressBar.finish();
  }, [cover]);

  return (
    <div className="relative w-full h-[386px] md:h-[420px] min-h-[386px] md:min-h-[420px]">
      <div className="relative flex items-center w-full h-full shrink-0">
        <span className="banner-linear absolute top-0 left-0 w-full h-[101%] z-[20]"></span>
        <div className="absolute left-0 pl-[4%] p-[1rem] z-[20] w-[60%] md:w-[45%] bottom-[15%]">
          <h1 className="text-gray-300 text-xl font-bold line-clamp-1 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
            {title?.english || title?.romaji}
          </h1>
          <p className="leading-6 text-xs md:text-sm webkit-box line-clamp-1 text-gray-300 font-extralight mt-2">
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

          <div className="flex items-center">
            <Link href={`/anime/${id}`}>
              <a className="mt-4 py-2 px-4 bg-[#6a55fa] text-gray-200 rounded-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#6a55fa] hover:scale-105 transition-all ease-in-out rounded-md">
                <Icon icon={PlayIcon} text={`Read More`} />
              </a>
            </Link>
          </div>
        </div>

        <div className="absolute right-0 md:right-[4%] grow z-[2] md:z-40 h-full md:h-[290px] w-full md:w-[50%]">
          <div
            style={{ backgroundImage: `url("${cover}")` }}
            className="relative overflow-hidden bg-no-repeat	bg-center	w-full h-full bg-cover rounded-md mt-4"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
