import { chunk } from '@/src/lib/utils/index';
import { EpisodesType } from '@/src/../types/types';
import EpisodeChunk from './episode-chunk';
import React from 'react';

type EpisodesButtonProps = {
  episodes: EpisodesType[];
  activeIndex?: number;
  episodesClassName?: string;
  watchPage: boolean;
  animeId?: string;
};

const Episodes = ({
  episodes,
  activeIndex,
  episodesClassName,
  watchPage,
  animeId,
}: EpisodesButtonProps): JSX.Element => (
  <ul className={episodesClassName}>
    {chunk<EpisodesType>(episodes, 50).map((episode, index) => {
      const firstEpisode = episode[0];
      const lastEpisode = episode[episode.length - 1];

      const isOpen = episode.some(
        episode => episode.number - 1 === activeIndex
      );

      return (
        <li
          className="odd:bg-[#0d0d0d] even:bg-[#111] hover:bg-[#1b1919]"
          key={index}
        >
          <EpisodeChunk
            buttonClassName="episode-buttons bg-background-darker"
            title={`${firstEpisode.number} - ${lastEpisode.number}`}
            episodes={episode}
            activeName={activeIndex}
            open={!!isOpen}
            watchPage={watchPage}
            animeId={animeId}
            className="transition"
          />
        </li>
      );
    })}
  </ul>
);

export default React.memo(Episodes);
