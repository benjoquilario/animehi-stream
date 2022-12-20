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
