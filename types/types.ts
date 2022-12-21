export type TitleType = {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
};

export type EpisodesType = {
  description: string;
  id: string;
  image: string;
  number: number;
  title: string;
};

export type SourceType = {
  sources: {
    url: string;
    isM3U8: boolean;
    quality: string;
  };
};

export type NameType = {
  first: string;
  last?: string | null;
  full: string;
  native: string;
  userPreferred: string;
};

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

export type EnimeType = {
  anilistId?: number;
  averageScore?: number;
  bannerImage?: string;
  color: string;
  coverImage?: string;
  createdAt?: string;
  currentEpisode?: number;
  description?: string;
  duration?: number;
  format?: string;
  genre?: string[];
  id?: string;
  lastChecks?: { cl6k4ltr40058z4lub9nchbna: number };
  lastEpisodeUpdate?: string;
  mappings?: { mal: number; anilist: number };
  next?: string;
  popularity?: number;
  season?: string;
  seasonInt?: number;
  slug?: string;
  status?: string;
  synonyms?: string[];
  title: TitleType;
  updatedAt?: string;
  year?: number;
};
