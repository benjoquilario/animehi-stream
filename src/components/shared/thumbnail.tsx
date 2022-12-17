import React from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import { base64SolidImage } from '@/utils/image';
import { PlayIcon } from '@heroicons/react/outline';
import { TitleType } from '@/src/../types/types';
import Image from '@/components/shared/image';
import classNames from 'classnames';

export type ThumbnailProps = {
  id: string;
  episodeNumber?: number;
  image?: string;
  title: TitleType;
  episodeId?: string;
  color: string;
  isRecent: boolean;
};

const Thumbnail = ({
  id,
  episodeNumber,
  image,
  title,
  episodeId,
  color,
  isRecent,
}: ThumbnailProps): JSX.Element => (
  <div className="col-span-1">
    <div className="relative">
      <div className="relative cursor-pointer">
        {isRecent ? (
          <div className="absolute top-0 left-0 font-bold p-1 text-[10px] rounded-br z-20 bg-white text-black">
            HD
          </div>
        ) : null}
        {isRecent ? (
          <div className="absolute bottom-0 left-0 z-20 flex justify-between w-full">
            <span className="bg-[#6a55fa] text-white rounded-tr-md p-1 text-xs font-semibold md:font-bold">
              Ep {episodeNumber}
            </span>
            <span className="bg-[#ffc107] text-white rounded-tr p-1 text-xs font-semibold md:font-bold rounded-tl-md	">
              SUB
            </span>
          </div>
        ) : null}
        <Link href={`/anime/${id}`}>
          <a>
            <div className="relative aspect-w-2 aspect-h-3">
              <div className="opacity-100">
                <Image
                  layout="fill"
                  src={`${image}`}
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                    color
                  )}`}
                  className="rounded-lg"
                  alt={`Anime - ${title.english || title.romaji}`}
                  containerclassname="relative w-full h-full hover:opacity-70 transition-opacity"
                />
              </div>
              {isRecent ? (
                <Link href={`/watch/${id}?episode=${episodeId}`}>
                  <a className="center-element flex justify-center items-center w-[101%] h-full opacity-0 hover:opacity-100 focus:opacity-100 hover:bg-[#1111117a] transition">
                    <div className="h-11 w-11 text-[#6a55fa]">
                      <PlayIcon />
                    </div>
                  </a>
                </Link>
              ) : null}
            </div>
          </a>
        </Link>
      </div>
    </div>

    <Link href={`/anime/${id}`}>
      <a
        style={{ color: `${color ? color : '#fff'}` }}
        className={classNames(
          'line-clamp-2 w-full h-auto p-1 text-left text-base hover:text-white font-semibold'
        )}
      >
        {title.english || title.romaji}
      </a>
    </Link>
  </div>
);

export default React.memo(Thumbnail);
/**
 *  <div className="relative w-full min-w-full md:w-[174px] md:min-w-[174px] overflow-visible flex flex-wrap rounded-[6px] content-start mx-auto">
      <div className="relative overflow-hidden w-full rounded-[6px] h-[205px] md:h-[220px] ">
        {isRecent ? (
          <div className="absolute top-0 left-0 font-bold p-1 text-[10px] rounded-br z-20 bg-white text-black">
            HD
          </div>
        ) : null}

        {isRecent ? (
          <div className="absolute bottom-0 left-0 z-20 flex justify-between w-full">
            <span className="bg-[#6a55fa] text-white rounded-tr-md p-1 text-xs md:text-sm font-semibold md:font-bold">
              Ep {episodeNumber}
            </span>
            <span className="bg-[#ffc107] text-white rounded-tr p-1 text-xs md:text-sm font-semibold md:font-bold rounded-tl-md	">
              SUB
            </span>
          </div>
        ) : null}
      </div>
      {isRecent ? (
        <Link href={`/watch/${id}?episode=${episodeId}`}>
          <a className="center-element flex justify-center items-center w-[101%] h-full opacity-0 hover:opacity-100 focus:opacity-100 hover:bg-[#1111117a] transition">
            <div className="h-11 w-11 text-[#6a55fa]">
              <PlayIcon />
            </div>
          </a>
        </Link>
      ) : null}
    </div>
 */
