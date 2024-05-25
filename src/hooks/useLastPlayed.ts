import { useParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

const LOCAL_STORAGE_KEY_LAST_PLAYED_INFO = "@player/"

type LastPlayedInfo = {
  id: string
  duration: number
  episode: number
  time: number
}

export default function useLastPlayed(id: string) {
  const params = useParams()
  const lastPlayedInfo = useMemo<LastPlayedInfo>(() => {
    const episodeNumber = params.params[2]
    const defaultLastPlayedInfo: LastPlayedInfo = {
      id,
      duration: 0,
      episode: +episodeNumber,
      time: 0,
    }

    return episodeNumber
      ? defaultLastPlayedInfo
      : JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_KEY_LAST_PLAYED_INFO + id) ||
            "null"
        ) || defaultLastPlayedInfo
  }, [id, params])

  const [lastEpisode, setLastEpisode] = useState(lastPlayedInfo.episode)
  const [lastDuration, setLastDuration] = useState(lastPlayedInfo.duration)

  const set = useCallback(
    (info: LastPlayedInfo) => {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_LAST_PLAYED_INFO + id,
        JSON.stringify(info)
      )
    },
    [id]
  )

  const _setLastEpisode = useCallback(
    (episode: number) => {
      if (episode == lastEpisode) return
      setLastEpisode(episode)
      setLastDuration(0)
      set({ id, episode, duration: 0, time: Date.now() })
    },
    [lastEpisode, id, set]
  )

  const _setLastDuration = (duration: number) => {
    set({ id, episode: lastEpisode, duration, time: Date.now() })
  }

  return [
    { lastEpisode, setLastEpisode: _setLastEpisode },
    { lastDuration: lastDuration, setLastDuration: _setLastDuration },
  ] as const
}
