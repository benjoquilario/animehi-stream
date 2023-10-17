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
}

export const useWatchStore = create<WatchInitialStore>((set) => ({
  url: "",
  setUrl: (arg: string) => set({ url: arg }),
  sources: undefined,
  setSources: (arg: Source[] | undefined) => set({ sources: arg }),
}))
