import Link from 'next/link';
import React from 'react';
import { EpisodesType } from '@/src/../types/types';
import classNames from 'classnames';

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

export const EpisodeNumber = ({
  episode,
  active,
}: EpisodeNumberProps): JSX.Element => (
  <>
    <div className="flex gap-2">
      <h2 className="text-white text-xs">{episode?.number}</h2>
      <p className="text-xs capitalize line-clamp-2 text-slate-300">
        {episode?.title ? episode?.title : `Episode ${episode?.number}`}
      </p>
    </div>
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
        'flex flex-row justify-between items-center p-3 w-full text-left odd:bg-[#0d0d0d] even:bg-[#111] hover:bg-[#1b1919] transition',
        active && '!bg-[#6A55FA]'
      )}
    >
      <EpisodeNumber active={active} episode={episode} />
    </button>
  ) : (
    <Link href={`/watch/${animeId}?episode=${episode?.id}`}>
      <a className="flex flex-row justify-between items-center py-2 px-3 odd:bg-[#0d0d0d] even:bg-[#111] w-full text-left hover:bg-[#1b1919] transition">
        <EpisodeNumber active={active} episode={episode} />
      </a>
    </Link>
  );

export default React.memo(Episode);
