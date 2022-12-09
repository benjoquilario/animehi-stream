import classNames from 'classnames';
import React from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { TEpisodes as EpisodeType } from '@/src/../types/types';
import Disclosure from '@/components/watch/disclosure';
import Episode from '@/components/watch/episode';
import { useDispatch } from '@/store/store';
import { setEpisodeId } from '@/store/watch/slice';

interface EpisodeChunkButtonProps {
  title: string;
}

const EpisodeChunkButton: React.FC<EpisodeChunkButtonProps> = props => {
  return (
    <div className="w-full flex items-center justify-between py-2 px-4 md:px-0">
      <p className="text-white text-sm">Episode {props.title}</p>

      <BsChevronDown className="w-4 h-4 text-white" />
    </div>
  );
};

interface EpisodeChunkProps {
  episodes: EpisodeType[];
  title: string;
  className?: string;
  buttonClassName?: string;
  activeName?: number;
  open?: boolean;
  watchPage: boolean;
  animeId?: string;
}

const EpisodeChunk: React.FC<EpisodeChunkProps> = ({
  episodes,
  title,
  className,
  buttonClassName,
  activeName,
  open,
  watchPage,
  animeId,
}) => {
  const dispatch = useDispatch();

  const onHandleChangeEpisode = (episodeId: string) => {
    dispatch(setEpisodeId(episodeId));
  };

  return (
    <Disclosure
      className={classNames(className)}
      buttonClassName={classNames('w-full rounded-md', buttonClassName)}
      button={<EpisodeChunkButton title={title} />}
      defaultOpen={open}
      panelClassName={classNames('flex flex-col')}
    >
      {episodes.map((episode, index) => (
        <Episode
          animeId={animeId}
          watchPage={watchPage}
          episode={episode}
          key={index}
          active={activeName === episode.number}
          onClick={() => onHandleChangeEpisode(episode?.id)}
        />
      ))}
    </Disclosure>
  );
};

export default EpisodeChunk;
