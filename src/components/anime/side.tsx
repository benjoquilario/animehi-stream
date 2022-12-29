import React from 'react';
import SideContent from '@/components/shared/side-content';

import { TitleType } from 'types/types';

type SideProps = {
  title: TitleType;
  status: string;
  type: string;
  genres: string[];
  studios: string[];
  releaseDate: number;
  totalEpisodes: number;
  rating: number;
  countryOfOrigin: string;
  season: string;
  synonyms: string[];
};

const Side = ({
  title,
  status,
  type,
  genres,
  studios,
  releaseDate,
  totalEpisodes,
  rating,
  countryOfOrigin,
  season,
  synonyms,
}: SideProps): JSX.Element => {
  return (
    <React.Fragment>
      <SideContent classes="text-xs mb-3" title="Romaji" info={title?.romaji} />
      <SideContent
        classes="text-xs mb-3"
        title="English"
        info={title?.english}
      />
      <SideContent classes="text-xs mb-3" title="Status" info={status} />
      <SideContent classes="text-xs mb-3" title="Type" info={type} />
      <SideContent
        classes="text-xs mb-3"
        title="Genres"
        info={
          <div className="flex flex-col">
            {genres.map((genre: string, index: number) => (
              <span key={index}>{genre}</span>
            ))}
          </div>
        }
      />
      <SideContent
        classes="text-xs mb-3"
        title="Studios"
        info={studios?.map((studio: string, index: number) => (
          <span key={index}>{studio}</span>
        ))}
      />
      <SideContent
        classes="text-xs mb-3"
        title="Release Date"
        info={releaseDate}
      />
      <SideContent
        classes="text-xs mb-3"
        title="Total Episodes"
        info={totalEpisodes}
      />
      <SideContent classes="text-xs mb-3" title="Rating" info={rating} />
      <SideContent
        classes="text-xs mb-3"
        title="Country"
        info={countryOfOrigin}
      />
      <SideContent classes="text-xs mb-3" title="Season" info={season} />
      {synonyms ? (
        <SideContent
          classes="text-xs mb-3"
          title="Synonyms"
          info={synonyms?.map((synonym: string, index: number) => (
            <span key={index}>{synonym}</span>
          ))}
        />
      ) : null}
    </React.Fragment>
  );
};

export default React.memo(Side);
