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

interface IEpisodesFallback {
  providerId: "shash" | "roro"
  episodes: {
    id: string
    title: string
    number: number
  }[]
}
