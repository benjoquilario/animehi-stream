export interface TitleType {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
}

export interface EpisodesType {
  description: string;
  id: string;
  image: string;
  number: number;
  title: string;
}

export interface NextAiringEpisode {
  airingTime: number;
  timeUntilAiring: number;
  episode: number;
}

export interface RecentType {
  id?: string;
  episodeId?: string;
  episodeNumber?: number;
  image?: string;
  animeTitle?: string | TitleType;
  color?: string;
}

export interface AniSkip {
  statusCode: number;
  results?: AniSkipResult[];
}

export interface AniSkipResult {
  interval: {
    startTime: number;
    endTime: number;
  };
  type: string;
}

export interface SourceType {
  sources: {
    url: string;
    isM3U8: boolean;
    quality: string;
  };
}

export interface NameType {
  first: string;
  last?: string | null;
  full: string;
  native: string;
  userPreferred: string;
}

export interface CharactersType {
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
}

export interface EnimeType {
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
}

export interface EnimeSource {
  id: string;
  url: string;
  referer: string;
  priority: number;
  browser: boolean;
  website: string;
}
