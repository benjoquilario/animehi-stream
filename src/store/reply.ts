import { create } from "zustand"

interface ISelectReply {
  content: string
  replyId: string
}

interface IInitialComment {
  selectedReply: {
    replyId: string
    content: string
  }
  replyId: string
  setReplyId: (replyId: string) => void
  clearSelectedReply: () => void
  setSelectedReply: (selectedReply: ISelectReply) => void
}

const useReplyCommentStore = create<IInitialComment>((set) => ({
  selectedReply: {
    replyId: "",
    content: "",
  },
  replyId: "",
  setReplyId: (replyId) => set({ replyId }),
  clearSelectedReply: () =>
    set({
      selectedReply: {
        replyId: "",
        content: "",
      },
      replyId: "",
    }),
  setSelectedReply: (selectedReply) => set({ selectedReply }),
}))

export default useReplyCommentStore
