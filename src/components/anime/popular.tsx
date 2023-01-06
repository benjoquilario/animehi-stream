import { TitleType } from '@/src/../types/types';
import {
  IAnimeInfo,
  IAnimeResult,
  ISearch,
} from '@consumet/extensions/dist/models/types';
import React from 'react';
import ColumnSection from '../shared/column-section';

export type PopularProps = {
  popularSeason?: ISearch<IAnimeResult | IAnimeInfo>;
  isLoading: boolean;
};

const Popular = (props: PopularProps): JSX.Element =>
  !props.isLoading ? (
    <div className="block w-full">
      <h2 className="mb-2 px-4 text-base md:text-[20px] uppercase font-semibold text-white">
        Most Popular Anime
      </h2>

      <div className="bg-background-700">
        <ul>
          {props.popularSeason?.results?.map(anime => (
            <ColumnSection
              data={anime}
              genres={anime.genres as string[]}
              key={anime.id}
            />
          ))}
          <li>
            <button className="bg-background-900 text-white w-full flex justify-center items-center py-3">
              View More
            </button>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <PopularLoading />
  );

const ColumnLoading = () => (
  <div className="animate-pulse h-[88px] w-full odd:bg-background-800 even:bg-background-900"></div>
);

const PopularLoading = () => {
  return (
    <div className="h-[824px] w-full flex flex-col">
      <div className="h-[30px] w-[200px] bg-background-900 rounded-lg mb-3"></div>
      {Array.from(Array(9), (_, i) => (
        <ColumnLoading key={i} />
      ))}
    </div>
  );
};

export default React.memo(Popular);
