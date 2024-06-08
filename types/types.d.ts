export interface TitleType {
  romaji: string
  english: string
  native: string
  userPreferred: string
}

interface ConsumetResponse<T> {
  currentPage: number
  hasNextPage: boolean
  results: T[]
}

interface Popular {
  id: string
  title: string
  image: string
  url: string
  genres: string[]
}

interface AnimeInfoResponse {
  id: string
  title: string
  url: string
  genres: string[]
  totalEpisodes: number
  image: string
  releaseDate: string
  description: string
  subOrDub: string
  type: string
  status: string
  otherName: string
  episodes: Episode[]
}

interface IAdvancedInfo {
  id: string
  malId: number
  title: {
    romaji: string
    english: string
    native: string
    userPreferred: string
  }
  status: string
  image: string
  imageHash: string
  cover: string
  coverHash: string
  popularity: number
  totalEpisodes: number
  currentEpisode: number | null
  countryOfOrigin: string
  description: string
  genres: string[]
  rating: number
  color: string
  type: string
  releaseDate: number
}

interface IAnilistInfo {
  id: string
  title: {
    romaji: string
    english: string
    native: string
  }
  malId: number
  trailer: {
    id: string
    site: string
    thumbnail: string
    thumbnailHash: string
  }
  synonyms: string[]
  isLicensed: boolean
  isAdult: boolean
  countryOfOrigin: string
  image: string
  imageHash: string
  cover: string
  coverHash: string
  description: string
  status: string
  releaseDate: number
  nextAiringEpisode: {
    airingTime: number
    timeUntilAiring: number
    episode: number
  }
  totalEpisodes: number
  currentEpisode: number
  rating: number
  duration: number
  genres: string[]
  studios: string[]
  season: string
  popularity: number
  type: string
  startDate: {
    year: number
    month: number
    day: number
  }
  endDate: {
    year: number | null
    month: number | null
    day: number | null
  }
  color: string
  recommendations: IRecommendationItem[]
  characters: ICharacter[]
  relations: IRelationItem[]
}

interface IRelationItem {
  id: number
  malId: number
  relationType: string
  title: {
    romaji: string
    english: string | null
    native: string
    userPreferred: string
  }
  status: string
  episodes: null
  image: string
  imageHash: string
  cover: string
  coverHash: string
  rating: number
  type: string
}

interface ICharacter {
  id: number
  role: string
  name: {
    first: string
    last: string
    full: string
    native: string
    userPreferred: string
  }
  image: string
  imageHash: string
  voiceActors: IVoiceActor[]
}

interface IVoiceActor {
  id: number
  language: string
  name: {
    first: string
    last: string
    full: string
    native: string
    userPreferred: string
  }
  image: string
  imageHash: string
}

interface IRecommendationItem {
  id: number
  malId: number
  title: {
    romaji: string
    english: string
    native: string
    userPreferred: string
  }
  status: string
  episodes: number
  image: string
  imageHash: string
  cover: string
  coverHash: string
  rating: number
  type: string
}

interface Episode {
  id: string
  number: number
  url: string
}

interface IEpisode {
  id: string
  title: string
  image: string
  imageHash: string
  number: number
  createdAt: string
  description: string | null
  url: string
}

interface Search {
  id: string
  malId: string | null
  title: {
    romaji: string
    english: string
    native: string
    userPreferred: string
  }
  status: string
  image: string
  imageHash: string
  cover: string | null
  coverHash: string
  popularity: number
  description: string
  rating: number | null
  genres: string[]
  color: string | null
  totalEpisodes: number
  currentEpisodeCount: number
  type: string
  releaseDate: number | null
}

interface SourcesResponse {
  headers?: {
    Referer: string
  }
  sources: Source[]
  download?: string
}

interface Source {
  url: string
  isM3U8: boolean
  quality: string
}

interface Bookmark {
  id: string
  image: string
  createdAt: Date
  animeId: string
  title: string
  userId: string
}

interface CommentsT<T> {
  animeId: string
  comment: string
  createdAt: Date
  episodeId: string
  isEdited: boolean
  isLiked: boolean
  id: string
  userId: string
  updatedAt: Date
  _count: {
    commentLike: number
  }
  user: T
}

interface Mappings {
  id: string
  providerId: string
  providerType: string
  similarity: number
}

interface Seasonal {
  id: string
  coverImage: string
  bannerImage: string
  title: {
    romaji: string
    english: string
    native: string
  }
  format: string
  totalEpisodes: number
  currentEpisode: number
  description: string
  mappings: Mappings[]
}

interface SeasonalResponse {
  trending: Seasonal[]
  popular: Seasonal[]
  top: Seasonal[]
  seasonal: Seasonal[]
}

interface CommentsResult<T> {
  comments: Array<CommentsT<T>>
  hasNextPage: boolean | null
  nextSkip: number | null
}

export interface EpisodesType {
  description: string
  id: string
  image: string
  number: number
  title: string
}

export interface IAnifyEpisodeResponse {
  providerId: string
  episodes: IAnifyEpisodes[]
}

export interface IAnifyEpisodes {
  id: string
  isFiller: string
  number: 1
  title: "Full"
  img: null
  hasDub: false
  description: null
  rating: null
  updatedAt: 0
}

export interface AnifyRecentEpisode {
  id: string
  coverImage: string
  status: string
  title: {
    native: string
    romaji: string
    english: string
  }
  currentEpisode: 5
  mappings: Mappings[]
  color: "#f1c9f1"
  averageRating: 7.44
}

export interface RecentEpisode {
  id: string
  episodeId: string
  episodeNumber: number
  image: string
  title: {
    romaji: string
    english: string
    native: string
  }
  episodeTitle: string
  malId: string
  imageHash: string
  url: string
  type: string
}

export interface IMetadata {
  id: string
  description: string
  hasDub: boolean
  img: string
  isFiller: boolean
  number: number
  title: string
  updatedAt: number
  rating: number
}

export interface AniSkip {
  statusCode: number
  results: AniSkipResult[]
}

export interface AniSkipResult {
  interval: {
    startTime: number
    endTime: number
  }
  skipType: string
}

export interface SourceType {
  sources: {
    url: string
    isM3U8: boolean
    quality: string
  }
}

export interface NameType {
  first: string
  last?: string | null
  full: string
  native: string
  userPreferred: string
}

export interface CharactersType {
  id: number
  image: string
  name: NameType
  role: string
  voiceActors: {
    id: number
    image: string
    language: string
    name: NameType
  }[]
}

export interface EnimeType {
  anilistId?: number
  averageScore?: number
  bannerImage?: string
  color: string
  coverImage?: string
  createdAt?: string
  currentEpisode?: number
  description?: string
  duration?: number
  format?: string
  genre?: string[]
  id?: string
  lastChecks?: { cl6k4ltr40058z4lub9nchbna: number }
  lastEpisodeUpdate?: string
  mappings?: { mal: number; anilist: number }
  next?: string
  popularity?: number
  season?: string
  seasonInt?: number
  slug?: string
  status?: string
  synonyms?: string[]
  title: TitleType
  updatedAt?: string
  year?: number
}
