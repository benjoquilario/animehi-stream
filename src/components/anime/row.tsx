import ColumnSection from '@/components/shared/column-section';
import { IAnimeInfo, IAnimeResult, ISearch } from '@consumet/extensions';
import React from 'react';
import TitleName from '@/components/shared/title-name';

export type RowProps = {
  animeList?: ISearch<IAnimeResult | IAnimeInfo>;
  title: string;
  isLoading: boolean;
  season?: string;
};

const Row = (props: RowProps): JSX.Element =>
  !props.isLoading ? (
    <div className="w-full">
      <div className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex-1 bg-background-800 pt-4 w-full">
          <TitleName classNames="ml-4" title={props.title} />
          <ul className="w-full">
            {props.animeList?.results?.map(anime => (
              <ColumnSection
                key={anime.id}
                data={anime}
                genres={anime.genres as string[]}
              />
            ))}
            <li>
              <button className="bg-[#111] text-white w-full flex justify-center items-center py-3">
                View More
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <RowLoading />
  );

const ColumnLoading = () => (
  <div className="animate-pulse h-[88px] w-full odd:bg-[#0d0d0d] even:bg-[#111]"></div>
);

const RowLoading = () => {
  return (
    <div className="h-[520px] w-full flex flex-col">
      <div className="h-[30px] w-[200px] bg-[#111] rounded-lg mb-3"></div>
      {Array.from(Array(5), (_, i) => (
        <ColumnLoading key={i} />
      ))}
    </div>
  );
};

export default React.memo(Row);
