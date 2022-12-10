import { chunk } from '@/utils/index';
import { EpisodesType } from '@/src/../types/types';
import EpisodeChunk from './episode-chunk';

interface EpisodesButtonProps {
  episodes: EpisodesType[];
  activeIndex?: number;
  episodesClassName?: string;
  watchPage: boolean;
  animeId?: string;
}

const Episodes: React.FC<EpisodesButtonProps> = ({
  episodes,
  activeIndex,
  episodesClassName,
  watchPage,
  animeId,
}) => (
  <ul className={episodesClassName}>
    {chunk<EpisodesType>(episodes, 50).map((episode, index) => {
      const firstEpisode = episode[0];
      const lastEpisode = episode[episode.length - 1];

      const isOpen = episode.some(
        episode => episode.number - 1 === activeIndex
      );

      return (
        <li className="mt-1" key={index}>
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

export default Episodes;
