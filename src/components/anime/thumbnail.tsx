import React, { useEffect, useMemo, useState } from 'react';
// import Image from 'next/image';
import Link from 'next/link';
import { base64SolidImage } from '@/utils/image';
import { RecentType } from '@/src/../types/types';
import { PlayIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { episodesTitle } from '@/utils/index';
import { useDispatch } from '@/store/store';
import { IAnimeResult } from '@consumet/extensions';
import { TitleType } from '@/src/../types/types';
import Image from '@/components/shared/image';
import useEpisodes from '@/hooks/useEpisodes';

export interface IThumbnailProps {
  id: string;
  episodeNumber: number;
  image: string;
  title: TitleType;
  episodeId: string;
}

const Thumbnail: React.FC<IThumbnailProps> = ({
  id,
  episodeNumber,
  image,
  title,
  episodeId,
}) => (
  <div className="relative flex flex-col">
    <div className="relative w-full min-w-full md:w-[185px] md:min-w-[185px] overflow-visible flex flex-wrap rounded-[6px] content-start mx-auto">
      <div className="relative overflow-hidden w-full rounded-[6px] h-[205px] md:h-[215px] ">
        <div className="absolute top-0 left-0 font-bold p-1 text-[10px] rounded-br z-20 bg-white text-black">
          HD
        </div>
        <Image
          layout="fill"
          src={`${image}`}
          objectFit="cover"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
            '#6a55fa'
          )}`}
          alt={`Anime - ${title.english || title.romaji}`}
          containerclassname="relative w-full h-full hover:opacity-70 transition-opacity"
        />
        <div className="absolute bottom-0 left-0 z-20 flex justify-between w-full">
          <span className="bg-[#6a55fa] text-white rounded-tr-md p-1 text-sm font-bold">
            Ep {episodeNumber}
          </span>
          <span className="bg-[#ffc107] text-white rounded-tr p-1 text-sm font-bold rounded-tl-md	">
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
      <a className="text-slate-300 w-full h-auto p-1 text-center text-sm hover:text-white">
        {title.english || title.romaji}
      </a>
    </Link>
  </div>
);

export default React.memo(Thumbnail);
