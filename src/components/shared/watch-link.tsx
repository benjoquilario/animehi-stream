import React from 'react';
import Link from 'next/link';
import { PlayIcon } from '@heroicons/react/outline';
import { RecentType } from 'types/types';

type WatchLinkProps = {
  isExist: boolean;
  id: string;
  color: string;
  currentWatchEpisode: RecentType;
  lastEpisode: string;
};

const WatchLink = (props: WatchLinkProps): JSX.Element => {
  const { isExist, id, color, currentWatchEpisode, lastEpisode } = props;
  return (
    <Link
      href={`/watch/${id}?episode=${
        isExist ? currentWatchEpisode?.episodeId : lastEpisode
      }`}
    >
      <a
        style={{
          backgroundColor: `${color || '#000000'}`,
        }}
        className={`transition duration-300 text-sm md:text-base flex items-center px-3 py-2 rounded-md gap-x-1 hover:opacity-80`}
      >
        <div className="h-5 w-5 text-white">
          <PlayIcon />
        </div>
        <p className="text-xs md:text-sm">
          {isExist
            ? `Continue Watching Episode ${currentWatchEpisode?.episodeNumber}`
            : 'Watch Now'}
        </p>
      </a>
    </Link>
  );
};

export default WatchLink;
