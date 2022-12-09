import { useDispatch } from '@/store/store';
import { setEpisodeId } from '@/store/watch/slice';
import { TEpisodes as EpisodeType } from '@/src/../types/types';
import classNames from 'classnames';
import React from 'react';
import { BsPlay } from 'react-icons/bs';

export interface EpisodesProps {
  activeIndex?: number;
  episodes: EpisodeType[];
}

const Episodes: React.FC<EpisodesProps> = ({ activeIndex, episodes }) => {
  const dispatch = useDispatch();

  return (
    <ul>
      {episodes?.map((episode, index) => (
        <li key={index}>
          <button
            onClick={() => dispatch(setEpisodeId(episode.id))}
            className={classNames(
              'flex flex-row justify-between items-center py-2 px-4 w-full text-left hover:bg-[#100f0f] transition',
              activeIndex === episode.number && 'bg-[#6A55FA]'
            )}
          >
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
                  activeIndex === episode.number
                    ? 'text-white'
                    : 'text-[#6A55FA]'
                )}
                height="35"
                width="35"
              />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Episodes;
