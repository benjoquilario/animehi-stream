import React from 'react';
import Link from 'next/link';
import Image from './image';
import Genre from './genre';
import classNames from 'classnames';
import { base64SolidImage } from '@/utils/image';
import { TitleType } from 'types/types';

type ColumnSectionProps = {
  animeId?: string;
  image?: string;
  title: TitleType;
  type?: string;
  genres?: string[];
  status?: string;
  releaseDate?: string;
  color: string;
};

const ColumnSection = ({
  animeId,
  image,
  title,
  type,
  genres,
  status,
  releaseDate,
  color,
}: ColumnSectionProps) => {
  return (
    <li className="flex h-22 items-center py-2 px-4 odd:bg-[#0d0d0d] even:bg-[#111]">
      <div className="w-12 shrink-0">
        <Link href={`/anime/${animeId}`}>
          <a className="">
            <Image
              containerclassname="relative h-[72px] w-[48px]"
              src={`${image}`}
              alt={`${title.english || title.romaji}`}
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                color as string
              )}`}
            />
          </a>
        </Link>
      </div>
      <div className="pl-2 self-start">
        <Link href={`/anime/${animeId}`}>
          <a
            className={classNames(
              'text-base font-semibold text-white transition duration-300 line-clamp-1',
              `hover:[${color}]`
            )}
          >
            {title.english || title.romaji}
          </a>
        </Link>
        <div className="flex line-clamp-1 items-center space-x-2 text-sm text-slate-300">
          <span>{type}</span>
          <span className="w-1.5 h-1.5 bg-[#6a55fa] rounded-full inline-block"></span>
          <span>{releaseDate}</span>
          <span className="w-1.5 h-1.5 bg-[#6a55fa] rounded-full inline-block"></span>
          <span>{status}</span>
        </div>
        <div className="line-clamp-1 items-center space-x-2 text-sm text-slate-300">
          {genres?.map((genre: string) => (
            <>
              <span>{genre}</span>
              <span className="w-1.5 h-1.5 bg-[#6a55fa] rounded-full inline-block"></span>
            </>
          ))}
        </div>
      </div>
    </li>
  );
};

export default React.memo(ColumnSection);
