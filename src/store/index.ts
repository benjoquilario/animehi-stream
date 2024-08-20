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
  selectedBackgroundImage: string
  vttUrl: string
  setUrl: (arg: string) => void
  sources: Source[]
  setSources: (
    args: Source[],
    selectedBackgroundImage: string,
    vttUrl: string
  ) => void
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
  resetUrl: () => void
}

export const useWatchStore = create<WatchInitialStore>((set) => ({
  url: "",
  setUrl: (url: string) => set(() => ({ url })),
  resetUrl: () => set(() => ({ url: "" })),
  isAutoNext: false,
  enableAutoNext: () => {
    set(() => ({ isAutoNext: true }))
  },
  disabledAutoNext: () => {
    set(() => ({ isAutoNext: false }))
  },
  sources: [
    {
      quality: "",
      isM3U8: true,
      url: "",
    },
  ],
  selectedBackgroundImage: "",
  vttUrl: "",
  resetSources: () =>
    set((state) => ({
      url: state.url,
      selectedBackgroundImage: state.selectedBackgroundImage,
      vttUrl: state.vttUrl,
    })),
  setSources: (
    sources: Source[],
    selectedBackgroundImage: string,
    vttUrl: string
  ) =>
    set((state) => {
      const currentSource = sources.find(
        (source) => source.quality === "default"
      )

      return { url: currentSource?.url, selectedBackgroundImage, vttUrl }
    }),
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
  persist<IAutoNext>(
    (set, get) => ({
      autoNext: false,
      setAutoNext: (autoNext: boolean) => set({ autoNext }),
    }),
    {
      name: "autoNext",
    }
  )
)

interface IAutoPlay {
  autoPlay: boolean
  setAutoPlay: (autoSkip: boolean) => void
}

export const useAutoPlay = create(
  persist<IAutoPlay>(
    (set, get) => ({
      autoPlay: false,
      setAutoPlay: (autoPlay: boolean) => set({ autoPlay }),
    }),
    {
      name: "autoPlay",
    }
  )
)

interface IAutoSkip {
  autoSkip: boolean
  setAutoSkip: (autoSkip: boolean) => void
}

export const useAutoSkip = create(
  persist<IAutoSkip>(
    (set, get) => ({
      autoSkip: false,
      setAutoSkip: (autoSkip: boolean) => set({ autoSkip }),
    }),
    {
      name: "autoSkip",
    }
  )
)
