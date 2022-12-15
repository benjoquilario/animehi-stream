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
  episodeNumber: number;
  image: string;
  title: TitleType;
  episodeId: string;
  color: string;
};

const Thumbnail = ({
  id,
  episodeNumber,
  image,
  title,
  episodeId,
  color,
}: ThumbnailProps): JSX.Element => (
  <div className="relative flex flex-col">
    <div className="relative w-full min-w-full md:w-[174px] md:min-w-[174px] overflow-visible flex flex-wrap rounded-[6px] content-start mx-auto">
      <div className="relative overflow-hidden w-full rounded-[6px] h-[205px] md:h-[220px] ">
        <div className="absolute top-0 left-0 font-bold p-1 text-[10px] rounded-br z-20 bg-white text-black">
          HD
        </div>
        <Image
          layout="fill"
          src={`${image}`}
          objectFit="cover"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(color)}`}
          alt={`Anime - ${title.english || title.romaji}`}
          containerclassname="relative w-full h-full hover:opacity-70 transition-opacity"
        />
        <div className="absolute bottom-0 left-0 z-20 flex justify-between w-full">
          <span className="bg-[#6a55fa] text-white rounded-tr-md p-1 text-xs md:text-sm font-semibold md:font-bold">
            Ep {episodeNumber}
          </span>
          <span className="bg-[#ffc107] text-white rounded-tr p-1 text-xs md:text-sm font-semibold md:font-bold rounded-tl-md	">
            SUB
          </span>
        </div>
      </div>

      <Link href={`/watch/${id}?episode=${episodeId}`}>
        <a className="center-element flex justify-center items-center w-[101%] h-full opacity-0 hover:opacity-100 hover:bg-[#1111117a] transition">
          <div className="h-11 w-11 text-[#6a55fa]">
            <PlayIcon />
          </div>
        </a>
      </Link>
    </div>
    <Link href={`/anime/${id}`}>
      <a
        style={{ color: `${color}` }}
        className={classNames(
          'w-full h-auto p-1 text-left text-md hover:text-white font-semibold'
        )}
      >
        {title.english || title.romaji}
      </a>
    </Link>
  </div>
);

export default React.memo(Thumbnail);
