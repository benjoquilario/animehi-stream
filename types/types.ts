export type IAnimeResponse = {
  currentPage: number;
  hasNextPage: boolean;
  results: TResults[];
};

export type TRecentResponse = {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalResults: number;
  results: TRecentResults[];
};

export type TSameTypes = {
  id: string;
  malId: number;
  title: Title;
  image: string;
  genres: string[];
  description: string;
  type: string;
  rating: number | null;
};

export type Title = {
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
} & TSameTypes;

export type TRecentResults = {
  color: string;
  episodeId: string;
  episodeTitle: string;
  episodeNumber: number;
} & TSameTypes;

export type TEpisodes = {
  description: string;
  id: string;
  image: string;
  number: number;
  title: string;
};

export type TName = {
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
} & TSameTypes;

export type TCharacters = {
  id: number;
  image: string;
  name: TName;
  role: string;
  voiceActors: {
    id: number;
    image: string;
    language: string;
    name: TName;
  };
};

export type TAnimeInfo = {
  characters: TCharacters[];
  color: string;
  countryOfOrigin: string;
  cover: string;
  description: string;
  duration: number;
  endDate: { year: number | null; month: number | null; day: number | null };
  episodes: TEpisodes[];
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
  title: Title;
  totalEpisodes: number;
  type: string;
};
