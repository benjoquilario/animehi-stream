import { useWatchStore } from "@/store"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

const LOCAL_STORAGE_KEY_LAST_PLAYED_INFO = "@player/"

type LastPlayedInfo = {
  id: string
  duration: number
  episode: number
  time: number
}

export default function useLastPlayed(id: string) {
  const episode = useSearchParams()
  const lastPlayedInfo = useMemo<LastPlayedInfo>(() => {
    // const episode = new URLSearchParams(window.location.search)
    const defaultLastPlayedInfo: LastPlayedInfo = {
      id,
      duration: 0,
      episode: episode.has("episode") ? +episode.get("episode")! : 1,
      time: 0,
    }

    return episode.has("episode")
      ? defaultLastPlayedInfo
      : JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_KEY_LAST_PLAYED_INFO + id) ||
            "null"
        ) || defaultLastPlayedInfo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode])

  const [lastEpisode, setLastEpisode] = useState(lastPlayedInfo.episode)
  // const [lastDuration, setLastDuration] = useState(lastPlayedInfo.duration)

  const set = useCallback((info: LastPlayedInfo) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_LAST_PLAYED_INFO + id,
      JSON.stringify(info)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = useCallback(
    (id: any, episode: number, duration: number) => {
      const same = episode == lastEpisode
      set({ id, episode, duration, time: Date.now() })
      if (!same) setLastEpisode(episode)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastEpisode]
  )

  return [lastEpisode, lastPlayedInfo.duration, update] as const
}
