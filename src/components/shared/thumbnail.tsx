import React, { useCallback } from 'react';
import Link from 'next/link';
import { Options } from '@popperjs/core';
import { base64SolidImage } from '@/utils/image';
import { PlayIcon } from '@heroicons/react/outline';
import { TitleType } from '@/src/../types/types';
import Image from '@/components/shared/image';
import classNames from 'classnames';
import Popup from './popup';
import { stripHtml } from '@/utils/index';
import Genre from './genre';
import Icon from './icon';
import { FaThumbsUp, FaPlay } from 'react-icons/fa';
import { AiFillClockCircle } from 'react-icons/ai';
import { useDispatch } from '@/store/store';
import { useRouter } from 'next/router';
import { setRecentlyWatching } from '@/store/recent/slice';

export type ThumbnailProps = {
  id: string | number;
  episodeNumber?: number;
  image?: string;
  title: TitleType;
  episodeId?: string;
  color: string;
  isRecent: boolean;
  description?: string;
  format?: string;
  genres?: string[];
  duration?: number;
  popularity?: number;
  banner?: string;
};

const popupOptions: Partial<Options> = {
  strategy: 'absolute',

  modifiers: [
    {
      name: 'sameWidth',
      enabled: true,
      fn: ({ state }) => {
        state.styles.popper.height = `${state.rects.reference.height}px`;
        state.styles.popper.width = `${state.rects.reference.width * 3}px`;
      },
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      effect({ state }) {
        const { width, height } =
          state.elements.reference.getBoundingClientRect();
        state.elements.popper.style.width = `${width * 3}px`;
        state.elements.popper.style.height = `${height}px`;
      },
    },
  ],
};

const Thumbnail = ({
  id,
  episodeNumber,
  image,
  title,
  episodeId,
  color,
  isRecent,
  description,
  genres,
  format,
  duration,
  popularity,
  banner,
}: ThumbnailProps): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Popup
      reference={
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

              <div className="relative aspect-w-2 aspect-h-3">
                <div className="opacity-100">
                  <Link href={`/anime/${id}`}>
                    <a aria-label={title?.english || title?.romaji}>
                      <Image
                        layout="fill"
                        src={`${image}`}
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                          color
                        )}`}
                        className="rounded-lg"
                        alt={`Anime - ${title?.english || title?.romaji}`}
                        containerclassname="relative w-full h-full hover:opacity-70 transition-opacity"
                      />
                    </a>
                  </Link>
                </div>
                {isRecent ? (
                  <Link href={`/watch/${id}?episode=${episodeId}-enime`}>
                    <a
                      aria-label={`Play - ${
                        title?.english || title?.romaji
                      } episode ${episodeNumber}`}
                      className="center-element flex justify-center items-center w-[101%] h-full opacity-0 hover:opacity-100 focus:opacity-100 hover:bg-[#1111117a] transition"
                    >
                      <div className="h-11 w-11 text-[#6a55fa]">
                        <PlayIcon />
                      </div>
                    </a>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          <Link href={`/anime/${id}`}>
            <a
              style={{ color: `${color ? color : '#fff'}` }}
              className={classNames(
                'line-clamp-2 w-full h-auto p-1 text-left text-base hover:text-white font-semibold'
              )}
            >
              {title?.english || title?.romaji}
            </a>
          </Link>
        </div>
      }
      options={popupOptions}
      offset={[0, 8]}
    >
      <Image
        layout="fill"
        src={`${banner}`}
        objectFit="cover"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(color)}`}
        className=""
        alt={`Anime - ${title?.english || title?.romaji}`}
        containerclassname="relative w-full h-full transition-opacity"
      />
      <div className="absolute inset-0 bg-black opacity-60 z-100"></div>
      <div className="absolute inset-0 text-white p-4 flex justify-center flex-col">
        <h2 className="text-2xl">{title?.english || title?.romaji}</h2>
        <p className="line-clamp-4 text-sm">
          {stripHtml(description as string)}
        </p>
        <div className="hidden mr-2 md:flex flex-wrap gap-2 mt-2">
          {genres?.map((genre: string) => (
            <div className="flex items-center gap-2" key={genre}>
              <Genre genre={genre} className="text-base" />
              <span className="w-1.5 h-1.5 bg-[#6a55fa] rounded-full inline-block"></span>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Icon icon={FaPlay} text={`${format}`} />
          <Icon icon={AiFillClockCircle} text={`${duration || 24} Min/Ep`} />
          <Icon icon={FaThumbsUp} text={`${popularity}`} />
        </div>
      </div>
    </Popup>
  );
};

export default React.memo(Thumbnail) as typeof Thumbnail;
