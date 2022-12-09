import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { base64SolidImage } from 'utils/image';
import { RecentType } from '@/src/../types/types';
import { PlayIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { episodesTitle } from '@/utils/index';
import { useDispatch } from '@/store/store';
import { IAnimeResult } from '@consumet/extensions';
import { TitleType } from '@/src/../types/types';

export interface IThumbnailProps {
  id: string;
  episodeNumber: number;
  image: string;
  title: TitleType;
}

const Thumbnail: React.FC<IThumbnailProps> = ({
  id,
  episodeNumber,
  image,
  title,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onHandleWatchNow = () => {
    router.push(
      `/watch/${id}?episode=${episodesTitle(
        title.romaji
      )}-episode-${episodeNumber}`
    );
  };

  return (
    <div className="relative flex flex-col">
      <div className="relative w-full min-w-full md:w-[150px] md:min-w-[150px] overflow-visible flex flex-wrap rounded-[6px] content-start mx-auto">
        <div className="relative overflow-hidden w-full rounded-[6px] h-[200px] md:h-[161px] ">
          <div className="relative w-full h-full hover:opacity-70 transition-opacity">
            <Image
              priority
              layout="fill"
              src={`${image}`}
              objectFit="cover"
              objectPosition="center"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                '#6A55FA'
              )}`}
              alt={`Anime - ${title.english || title.romaji}`}
            />
          </div>
        </div>
        <h2 className="bg-[#100f0f] text-sm w-full h-auto p-1 text-center text-white bg-top bg-repeat-x bg-[#111] shadow-2xl">
          <span className="line-clamp-text text-sm">
            {title.romaji || title.english}
          </span>
          <span className="line-clamp-text text-xs">
            Episode {episodeNumber}
          </span>
        </h2>

        <button
          onClick={onHandleWatchNow}
          className="center-element flex justify-center items-center w-[101%] h-[85%] opacity-0 hover:opacity-100 hover:bg-[#1111117a]"
        >
          <div className="h-11 w-11 text-[#6a55fa]">
            <PlayIcon />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Thumbnail;
