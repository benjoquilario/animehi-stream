import { TitleType } from '@/src/../types/types';
import {
  IAnimeInfo,
  IAnimeResult,
} from '@consumet/extensions/dist/models/types';
import React from 'react';
import ColumnSection from '../shared/column-section';

export type PopularProps = {
  popularSeason?: IAnimeResult[] | IAnimeInfo[];
  isLoading: boolean;
};

const Popular = ({ popularSeason, isLoading }: PopularProps): JSX.Element =>
  !isLoading ? (
    <div className="block w-full">
      <h2 className="mb-2 px-4 text-base md:text-[20px] uppercase font-semibold text-white">
        Most Popular Anime
      </h2>

      <div className="bg-[#100f0f]">
        <ul>
          {popularSeason?.map((anime, index) => (
            <ColumnSection
              image={anime.image}
              title={anime.title as TitleType}
              type={anime.type}
              releaseDate={anime.releaseDate}
              status={anime.status}
              key={index}
              animeId={anime.id}
              genres={anime.genres as string[]}
              color={anime.color as string}
            />
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <PopularLoading />
  );

const ColumnLoading = () => (
  <div className="animate-pulse h-[88px] w-full odd:bg-[#0d0d0d] even:bg-[#111]"></div>
);

const PopularLoading = () => {
  return (
    <div className="h-[824px] w-full flex flex-col">
      <div className="h-[30px] w-[200px] bg-[#111] rounded-lg mb-3"></div>
      {Array.from(Array(9), (_, i) => (
        <ColumnLoading key={i} />
      ))}
    </div>
  );
};

export default React.memo(Popular);
