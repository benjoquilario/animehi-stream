import React from 'react';
// import Image from 'next/image';
import Link from 'next/link';
// import { Options } from '@popperjs/core';
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

interface CardProps {
  // data: Media;
  className?: string;
  containerEndSlot?: React.ReactNode;
  imageEndSlot?: React.ReactNode;
  redirectUrl?: string;
}

const Thumbnail = ({
  id,
  episodeNumber,
  image,
  title,
  episodeId,
  color,
  isRecent,
}: ThumbnailProps): JSX.Element => {
  return (
    <div className="col-span-1">
      <div className="relative">
        <div className="relative cursor-pointer rounded overflow-hidden">
          {isRecent ? (
            <div className="absolute top-0 left-0 font-bold p-1 text-[10px] rounded-br z-20 bg-white text-black">
              HD
            </div>
          ) : null}
          {isRecent ? (
            <div className="absolute bottom-0 left-0 z-20 flex justify-between w-full shadow-lg">
              <span className="bg-red-800 text-white rounded-tr-md p-1 text-xs font-semibold md:font-bold">
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
};

export default React.memo(Thumbnail);
