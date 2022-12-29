import React from 'react';
import Thumbnail from './thumbnail';
import TitleName from './title-name';
import { TitleType } from 'types/types';
import { IAnimeInfo } from '@consumet/extensions/dist/models/types';

type ResultsCardProps = {
  isLoading: boolean;
  title?: string;
  animeList?: IAnimeInfo[];
};

const ResultsCard = ({
  isLoading,
  title,
  animeList,
}: ResultsCardProps): JSX.Element => {
  return (
    <div>
      {title ? <TitleName title={title} /> : null}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative overflow-hidden">
        {isLoading
          ? Array.from(Array(12), (_, i) => <SkeletonLoading key={i} />)
          : animeList?.map((anime, index) => (
              <Thumbnail
                key={index}
                id={anime?.id}
                image={anime?.image || anime?.cover}
                title={anime?.title as TitleType}
                color={anime?.color as string}
                description={anime?.description as string}
                genres={anime?.genres as string[]}
                format={anime?.type}
                popularity={anime?.popularity as number}
                banner={anime?.cover || anime?.image}
                isRecent={false}
              />
            ))}
      </div>
    </div>
  );
};

const SkeletonLoading = () => (
  <div className="relatve flex flex-col animate-pulse">
    <div className="md:w-[144px] md:min-w-[153px] h-[210px] md:h-[235px] xl:w-[190px] xl:min-w-[190px] bg-[#141313] rounded-lg"></div>
    <div className="h-4 w-full bg-[#141313] rounded-lg mt-2"></div>
  </div>
);

export default React.memo(ResultsCard);
