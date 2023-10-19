import { Source, SourcesResponse } from "types/types"
import { create } from "zustand"

interface AuthInitialState {
  isAuthOpen: boolean
  setIsAuthOpen: (arg: boolean) => void
}

export const useAuthStore = create<AuthInitialState>((set) => ({
  isAuthOpen: false,
  setIsAuthOpen: (arg: boolean) => set({ isAuthOpen: arg }),
}))

interface WatchInitialStore {
  url: string
  setUrl: (arg: string) => void
  sources: Source[] | undefined
  setSources: (args: Source[] | undefined) => void
  isAutoNext: boolean
  enableAutoNext: () => void
  disabledAutoNext: () => void
}

export const useWatchStore = create<WatchInitialStore>((set) => ({
  url: "",
  setUrl: (arg: string) => set({ url: arg }),
  isAutoNext: false,
  enableAutoNext: () => {
    set(() => ({ isAutoNext: true }))
  },
  disabledAutoNext: () => {
    set(() => ({ isAutoNext: false }))
  },
  sources: undefined,
  setSources: (arg: Source[] | undefined) => set({ sources: arg }),
}))
