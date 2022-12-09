import { useDispatch } from '@/store/store';
import { setEpisodeId } from '@/store/watch/slice';
import Link from 'next/link';
import React from 'react';
import { TEpisodes as EpisodeType } from '@/src/../types/types';
import classNames from 'classnames';
import { BsPlay } from 'react-icons/bs';

interface EpisodeProps {
  active?: boolean;
  onClick?: () => void;
  episode: EpisodeType;
  watchPage: boolean;
  animeId?: string;
}

interface EpisodeNumberProps {
  episode: EpisodeType;
  active?: boolean;
}

const EpisodeNumber: React.FC<EpisodeNumberProps> = ({ episode, active }) => (
  <>
    <div>
      <h2 className="text-white text-sm">Eps {episode?.number}</h2>
      <p className="text-xs capitalize line-clamp-text text-slate-300">
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

const Episode: React.FC<EpisodeProps> = ({
  active,
  onClick,
  episode,
  watchPage,
  animeId,
}) => {
  return watchPage ? (
    <button
      onClick={onClick}
      className={classNames(
        'flex flex-row justify-between items-center py-2 px-4 w-full text-left',
        active && 'bg-[#6A55FA]'
      )}
    >
      <EpisodeNumber active={active} episode={episode} />
    </button>
  ) : (
    <Link href={`/watch/${animeId}?episode=${episode?.id}`}>
      <a
        className={classNames(
          'flex flex-row justify-between items-center py-2 px-4 w-full text-left'
        )}
      >
        <EpisodeNumber active={active} episode={episode} />
      </a>
    </Link>
  );
};

export default Episode;
