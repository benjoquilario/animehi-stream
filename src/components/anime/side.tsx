import React from 'react';
import SideContent from '@/components/shared/side-content';
import { IAnimeInfo } from '@consumet/extensions/dist/models/types';
import { TitleType } from 'types/types';
import { title } from '@/lib/helper';

type SideProps = {
  data: IAnimeInfo;
};

const Side = ({ data }: SideProps): JSX.Element => {
  return (
    <React.Fragment>
      <SideContent
        classes="text-xs mb-3"
        title="Romaji"
        info={title(data.title as TitleType)}
      />
      <SideContent
        classes="text-xs mb-3"
        title="English"
        info={title(data.title as TitleType)}
      />
      <SideContent classes="text-xs mb-3" title="Status" info={data.status} />
      <SideContent classes="text-xs mb-3" title="Type" info={data.type} />
      <SideContent
        classes="text-xs mb-3"
        title="Genres"
        info={
          <div className="flex flex-col">
            {data.genres?.map(genre => (
              <span key={genre}>{genre}</span>
            ))}
          </div>
        }
      />
      <SideContent
        classes="text-xs mb-3"
        title="Studios"
        info={data.studios?.map(studio => (
          <span key={studio}>{studio}</span>
        ))}
      />
      <SideContent
        classes="text-xs mb-3"
        title="Release Date"
        info={data.releaseDate}
      />
      <SideContent
        classes="text-xs mb-3"
        title="Total Episodes"
        info={data.totalEpisodes}
      />
      <SideContent classes="text-xs mb-3" title="Rating" info={data.rating} />
      <SideContent
        classes="text-xs mb-3"
        title="Country"
        info={data.countryOfOrigin}
      />
      <SideContent classes="text-xs mb-3" title="Season" info={data.season} />
      {data.synonyms ? (
        <SideContent
          classes="text-xs mb-3"
          title="Synonyms"
          info={data.synonyms?.map((synonym: string, index: number) => (
            <span key={index}>{synonym}</span>
          ))}
        />
      ) : null}
    </React.Fragment>
  );
};

export default React.memo(Side);
