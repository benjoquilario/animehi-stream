import { Source, SourcesResponse } from "types/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthInitialState {
  isAuthOpen: boolean
  setIsAuthOpen: (isAuthOpen: boolean) => void
  isLogin: boolean
  setIsLogin: (isLogin: boolean) => void
}

export const useAuthStore = create<AuthInitialState>((set) => ({
  isAuthOpen: false,
  setIsAuthOpen: (isAuthOpen: boolean) => set({ isAuthOpen }),
  isLogin: false,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
}))

interface WatchInitialStore {
  url: string
  setUrl: (arg: string) => void
  sources: Source[] | undefined
  setSources: (args: Source[] | undefined) => void
  isAutoNext: boolean
  enableAutoNext: () => void
  disabledAutoNext: () => void
  resetSources: () => void
  download: string
  setDownload: (download?: string) => void
  sourceType: string
  setSourceType: (sourceType: string) => void
  embeddedUrl: string
  setEmbeddedUrl: (embeddedUrl?: string) => void
  lastEpisode: number
  setLastEpisode: (episode: number) => void
}

export const useWatchStore = create<WatchInitialStore>((set) => ({
  url: "https://example.com/404",
  setUrl: (arg: string) => set(() => ({ url: arg })),
  isAutoNext: false,
  enableAutoNext: () => {
    set(() => ({ isAutoNext: true }))
  },
  disabledAutoNext: () => {
    set(() => ({ isAutoNext: false }))
  },
  sources: undefined,
  resetSources: () => set({ sources: [] }),
  setSources: (arg: Source[] | undefined) => set({ sources: arg }),
  download: "",
  setDownload: (download?: string) => set({ download }),
  sourceType: "default",
  setSourceType: (sourceType: string) => set({ sourceType }),
  embeddedUrl: "",
  lastEpisode: 1,
  setLastEpisode: (episode: number) => ({ episode }),
  setEmbeddedUrl: (embeddedUrl?: string) => set({ embeddedUrl }),
}))

interface IAutoNext {
  autoNext: boolean
  setAutoNext: (autoNext: boolean) => void
}

export const useAutoNext = create(
  persist(
    (set, get) => ({
      autoNext: false,
      setAutoNext: (autoNext: boolean) => set({ autoNext }),
    }),
    {
      name: "autoNext",
    }
  )
)

export const useAutoPlay = create(
  persist(
    (set, get) => ({
      autoPlay: false,
      setAutoPlay: (autoPlay: boolean) => set({ autoPlay }),
    }),
    {
      name: "autoPlay",
    }
  )
)

export const useAutoSkip = create(
  persist(
    (set, get) => ({
      autoSkip: false,
      setAutoSkip: (autoSkip: boolean) => set({ autoSkip }),
    }),
    {
      name: "autoSkip",
    }
  )
)
