import React from 'react';
import { RecentType } from 'types/types';
import Link from 'next/link';
import Image from './image';
import { base64SolidImage } from '@/src/lib/utils/image';
import { PlayIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import Button from './button';
import { MdBookmarkRemove } from 'react-icons/md';

type WatchCardProps = {
  onClick?: () => void;
} & RecentType;

const WatchCard = (props: WatchCardProps) => {
  const { id, animeTitle, image, color, episodeNumber, episodeId, onClick } =
    props;

  return (
    <div className="col-span-1">
      <div className="relative">
        <div className="relative cursor-pointer rounded overflow-hidden">
          <div className="relative aspect-w-2 aspect-h-3">
            <div className="opacity-100">
              <Link href={`/anime/${id}`}>
                <a aria-label={`${animeTitle}`}>
                  <Image
                    layout="fill"
                    src={`${image}`}
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                      color as string
                    )}`}
                    className="rounded-lg"
                    alt={`Anime - ${animeTitle}`}
                    containerclassname="relative w-full h-full hover:opacity-70 transition-opacity"
                  />
                </a>
              </Link>
            </div>
            <Link href={`/watch/${id}?episode=${episodeId}`}>
              <a
                aria-label={`Play - ${animeTitle} episode ${episodeNumber}`}
                className="center-element flex justify-center items-center w-[101%] h-full opacity-0 hover:opacity-100 focus:opacity-100 hover:bg-[#1111117a] transition"
              >
                <div className="text-primary text-center flex flex-col items-center">
                  <PlayIcon className="h-11 w-11 md:h-16 md:w-16" />
                </div>
              </a>
            </Link>
          </div>
          <Button
            onClick={onClick}
            className="absolute top-1 right-1 z-50 text-white hover:text-primary transition"
          >
            <MdBookmarkRemove className="h-7 w-7" />
          </Button>
          <h4 className="text-sm md:text-base font-bold text-white text-left">
            Episode {episodeNumber}
          </h4>
          <Link href={`/anime/${id}`}>
            <a
              style={{
                color: `${color ? color : '#fff'}`,
              }}
              className={classNames(
                'line-clamp-2 w-full h-auto text-left text-sm md:text-base hover:text-white font-semibold'
              )}
            >
              {animeTitle as string}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WatchCard);
