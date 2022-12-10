import { TitleType } from '@/src/../types/types';
import { IAnimeResult } from '@consumet/extensions/dist/models/types';
import PopularItem from './popular-items';
import React from 'react';

export interface PopularProps {
  animeList?: IAnimeResult[];
}

const Popular: React.FC<PopularProps> = ({ animeList }) => {
  return (
    <div className="block h-full w-full">
      <div className="mb-6">
        <h2 className="text-base md:text-[20px] uppercase font-semibold text-white">
          Popular Anime
        </h2>
      </div>
      <div className="bg-[#111] py-4">
        <ul>
          <li className="text-white text-center">Most Popular</li>
        </ul>
      </div>
      <div className="bg-[#0d0d0d]">
        <ul>
          {animeList?.map((anime, index) => (
            <PopularItem
              rank={index + 1}
              image={anime.image}
              title={anime.title as TitleType}
              type={anime.type}
              releaseDate={anime.releaseDate}
              status={anime.status}
              key={index}
              animeId={anime.id}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(Popular);
