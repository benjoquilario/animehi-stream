import { useDispatch } from '@/store/store';
import { setEpisodeId } from '@/store/watch/slice';
import { EpisodesType } from '@/src/../types/types';
import classNames from 'classnames';
import React from 'react';
import { EpisodeNumber } from './episode';
import Button from '../shared/button';

type EpisodesProps = {
  activeIndex?: number;
  episodes: EpisodesType[];
};

const Episodes = ({ activeIndex, episodes }: EpisodesProps): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <ul className="grid grid-cols-2 md:grid-cols-1">
      {episodes?.map(episode => (
        <li key={episode.id} className="odd:bg-[#0d0d0d] even:bg-[#111]">
          <Button
            onClick={() => dispatch(setEpisodeId(episode.id))}
            className={classNames(
              'flex flex-row justify-between items-center py-3 px-4 w-full text-left hover:bg-[#1b1919] transition',
              activeIndex === episode.number && '!bg-[#6A55FA]'
            )}
          >
            <EpisodeNumber episode={episode} />
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default React.memo(Episodes);
