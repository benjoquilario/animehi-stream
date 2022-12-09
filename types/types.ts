export type AnimeResponseType = {
  currentPage: number;
  hasNextPage: boolean;
  results: TResults[];
};

export type RecentResponseType<T> = {
  currentPage?: number;
  hasNextPage?: boolean;
  totalPages?: number;
  totalResults?: number;
  results: T[];
};

export type SameType = {
  id: string;
  malId: number;
  title: TitleType;
  image: string;
  genres: string[];
  description: string;
  type: string;
  rating: number | null;
};

export type TitleType = {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
};

export type TResults = {
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  };
  status: string;
  cover: string;
  releaseDate: string;
  totalEpisodes: number;
  duration: number;
} & SameType;

export type RecentType = {
  color: string;
  episodeId: string;
  episodeTitle: string;
  episodeNumber: number;
} & SameType;

export type EpisodesType = {
  description: string;
  id: string;
  image: string;
  number: number;
  title: string;
};

export type NameType = {
  first: string;
  last: string | null;
  full: string;
  native: string;
  userPreferred: string;
};

export type TRecommendation = {
  cover: string;
  status: string;
  episodes: number;
} & SameType;

export type CharactersType = {
  id: number;
  image: string;
  name: NameType;
  role: string;
  voiceActors: {
    id: number;
    image: string;
    language: string;
    name: NameType;
  }[];
};

export type SourceType = {
  sources: {
    url: string;
    isM3U8: boolean;
    quality: string;
  };
};

export type VideosType = {
  headers: {
    Referer: string;
  };
  sources: SourceType[];
};

export type AnimeType = {
  characters: CharactersType[];
  color: string;
  countryOfOrigin: string;
  cover: string;
  description: string;
  duration: number;
  endDate: { year: number | null; month: number | null; day: number | null };
  episodes: EpisodesType[];
  genres: string[];
  hasDub: boolean;
  hasSub: boolean;
  id: string;
  image: string;
  isAdult: boolean;
  isLicensed: boolean;
  malId: number;
  nextAiringEpisode: {
    airingTime: number;
    timeUntilAiring: number;
    episode: number;
  };
  popularity: number;
  rating: number;
  recommendations: TRecommendation[];
  releaseDate: number;
  season: string;
  startDate: { year: number; month: number; day: number };
  status: string;
  studios: string[];
  subOrDub: string;
  synonyms: string[];
  title: TitleType;
  totalEpisodes: number;
  type: string;
};
