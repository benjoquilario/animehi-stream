import { useDispatch } from '@/store/store';
import { setEpisodeId } from '@/store/watch/slice';
import Link from 'next/link';
import React from 'react';
import { EpisodesType } from '@/src/../types/types';
import classNames from 'classnames';
import { BsPlay } from 'react-icons/bs';

type EpisodeProps = {
  active?: boolean;
  onClick?: () => void;
  episode: EpisodesType;
  watchPage: boolean;
  animeId?: string;
};

type EpisodeNumberProps = {
  episode: EpisodesType;
  active?: boolean;
};

const EpisodeNumber = ({
  episode,
  active,
}: EpisodeNumberProps): JSX.Element => (
  <>
    <div>
      <h2 className="text-white text-sm">Eps {episode?.number}</h2>
      <p className="hidden md:block text-xs capitalize line-clamp-text text-slate-300">
        {episode?.title}
      </p>
    </div>
    <span>
      <BsPlay
        className={classNames(
          'h-6 w-6',
          active ? 'text-white' : 'text-[#6A55FA]'
        )}
        height="35"
        width="35"
      />
    </span>
  </>
);

const Episode = ({
  active,
  onClick,
  episode,
  watchPage,
  animeId,
}: EpisodeProps): JSX.Element =>
  watchPage ? (
    <button
      onClick={onClick}
      className={classNames(
        'ml-1 flex flex-row justify-between items-center py-2 px-4 w-full text-left hover:bg-[#100f0f] transition',
        active && 'bg-[#6A55FA]'
      )}
    >
      <EpisodeNumber active={active} episode={episode} />
    </button>
  ) : (
    <Link href={`/watch/${animeId}?episode=${episode?.id}`}>
      <a className="flex flex-row justify-between items-center py-2 px-4 w-full text-left hover:bg-[#100f0f] transition">
        <EpisodeNumber active={active} episode={episode} />
      </a>
    </Link>
  );

export default Episode;
