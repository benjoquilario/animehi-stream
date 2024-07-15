interface IReplyComment<T> {
  id: string
  isEdited: boolean
  content: string
  user: T
  userId: string
  createdAt: Date
  updatedAt: Date
  isLiked: boolean
  _count: {
    replyLike: number
  }
}

interface IRepliesPage<T> {
  replies: T
  hasNextPage: boolean
  nextSkip: number
}

interface Option {
  value: string
  label: string
}

interface DiscoverFilters {
  seasons: "WINTER" | "SPRING" | "SUMMER" | "FALL"
  format: "TV" | "TV_SHORT" | "OVA" | "ONA" | "MOVIE" | "SPECIAL" | "MUSIC"
  status: "RELEASING" | "NOT_YET_RELEASED" | "FINISHED" | "CANCELLED"
  sort:
    | "POPULARITY_DESC"
    | "TRENDING_DESC"
    | "SCORE_DESC"
    | "FAVOURITES_DESC"
    | "EPISODES_DESC"
    | "ID_DESC"
    | "UPDATED_AT_DESC"
    | "START_DATE_DESC"
    | "END_DATE_DESC"
    | "TITLE_ROMAJI_DESC"
    | "TITLE_ENGLISH_DESC"
    | "TITLE_NATIVE_DESC"
}

interface ITracks {
  default: boolean
  file: string
  kind: string
  label: string
}

interface IRecents {
  bannerImage: string
  coverImage: string
  currentEpisode: number
  genres: string[]
  id: string
  status: string
  title: {
    native: string
    romaji: string
    english: string
  }
  totalEpisodes: number
  year: number
}
