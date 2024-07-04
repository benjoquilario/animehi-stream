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
