"use client"

import React, { useMemo, useEffect, useState } from "react"
import { IAnilistInfo } from "types/types"
import VidstackPlayer from "./player"
import Episodes from "@/components/episode/episodes"
import { useSearchParams } from "next/navigation"
import useEpisodes from "@/hooks/useEpisodes"
import Server from "@/components/server"
import ButtonAction from "@/components/button-action"
import { useWatchStore } from "@/store"
import RelationWatch from "@/components/watch/relation"
import Comments from "@/components/comments/comments"
import { env } from "@/env.mjs"
import type { SourcesResponse, AniSkip, AniSkipResult } from "types/types"

type VideoPlayerProps = {
  animeId: string
  animeResponse: IAnilistInfo
  anilistId: string
  currentUser: any
}

const VideoPlayer = (props: VideoPlayerProps) => {
  const { animeId, animeResponse, anilistId, currentUser } = props

  const searchParams = useSearchParams()
  const isDub = searchParams.get("dub")
  const ep = searchParams.get("ep")
  const episodeNumber = Number(ep)
  const {
    data: episodes,
    isLoading: isPending,
    isError,
  } = useEpisodes(anilistId)
  const episodeId = useMemo(
    () => `${animeId}-${isDub ? "dub-" : ""}episode-${episodeNumber}`,
    [animeId, episodeNumber, isDub]
  )
  const [isLoading, setIsLoading] = useState(false)
  const download = useWatchStore((store) => store.download)
  const [src, setSrc] = useState<string>("")
  const setDownload = useWatchStore((store) => store.setDownload)
  const [vttGenerated, setVttGenerated] = useState<boolean>(false)
  const [textTracks, setTextTracks] = useState<ITracks[]>([])

  console.log(episodeId)

  console.log(isDub)

  const [vttUrl, setVttUrl] = useState<string>("")
  const [error, setError] = useState(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [skipTimes, setSkipTimes] = useState<AniSkipResult[]>([])
  const [totalDuration, setTotalDuration] = useState<number>(0)

  const currentEpisode = useMemo(
    () => episodes?.find((episode) => episode.number === episodeNumber),
    [episodes, episodeNumber]
  )

  const latestEpisodeNumber = useMemo(
    () =>
      episodes?.length !== 0
        ? episodes?.length ??
          animeResponse.currentEpisode ??
          animeResponse.nextAiringEpisode.episode - 1
        : 1,
    [animeResponse, episodes]
  )

  async function fetchAndSetAnimeSource() {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_ANIME_API_URL}/anime/gogoanime/watch/${episodeId}`
      )

      if (!response.ok) throw Error

      const data = (await response.json()) as SourcesResponse

      const backupSource = data.sources.find(
        (source) => source.quality === "default"
      )

      if (backupSource) {
        setSrc(`${env.NEXT_PUBLIC_PROXY_URI}=${backupSource.url}`)
        setDownload(data.download)
      } else {
        console.error("Backup source not found")
      }
    } catch (error) {
      console.error("Failed to fetch anime streaming links", error)
      const response = await fetch(
        `${env.NEXT_PUBLIC_PROXY_URI}=https://aniwatch-4cxa.vercel.app/anime/info/${anilistId}`
      )

      const data = await response.json()
      console.log(data)

      const { episodesList } = data.data

      const source = episodesList.find(
        (episode: {
          episodeId: number
          id: string
          number: number
          title: string
        }) => episode.number === episodeNumber
      )

      const fetchDataSources = await fetch(
        `${env.NEXT_PUBLIC_PROXY_URI}=https://aniwatch-one.vercel.app/anime/episode-srcs?id=${source.id}`
      )

      const videoSource = await fetchDataSources.json()

      setSrc(`${videoSource.sources[0].url}`)
      setTextTracks(videoSource.tracks)
      setDownload("")
    }
  }

  useEffect(() => {
    fetchAndSetAnimeSource()

    fetchAndSetAnimeSource()
    fetchAndProcessSkipTimes()
    return () => {
      if (vttUrl) URL.revokeObjectURL(vttUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeId, episodeNumber, animeResponse, isDub])

  function generateWebVTTFromSkipTimes(
    skipTimes: AniSkip,
    totalDuration: number
  ): string {
    let vttString = "WEBVTT\n\n"
    let previousEndTime = 0

    const sortedSkipTimes = skipTimes.results.sort(
      (a, b) => a.interval.startTime - b.interval.startTime
    )

    sortedSkipTimes.forEach((skipTime, index) => {
      const { startTime, endTime } = skipTime.interval
      const skipType =
        skipTime.skipType.toUpperCase() === "OP" ? "Opening" : "Outro"

      if (previousEndTime < startTime) {
        vttString += `${formatTime(previousEndTime)} --> ${formatTime(startTime)}\n`
        vttString += `${animeResponse.title.english ?? animeResponse.title.romaji} / Episode ${episodeNumber}\n\n`
      }

      vttString += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`
      vttString += `${skipType}\n\n`
      previousEndTime = endTime

      if (index === sortedSkipTimes.length - 1 && endTime < totalDuration) {
        vttString += `${formatTime(endTime)} --> ${formatTime(totalDuration)}\n`
        vttString += `${animeResponse.title.english ?? animeResponse.title.romaji} / Episode ${episodeNumber}\n\n`
      }
    })

    return vttString
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  async function fetchAndProcessSkipTimes() {
    if (animeResponse.malId && episodeId) {
      try {
        if (!animeResponse.malId) return

        const response = await fetch(
          `https://api.aniskip.com/v2/skip-times/${animeResponse.malId}/${episodeNumber}?types=op&types=recap&types=mixed-op&types=ed&types=mixed-ed&episodeLength`
        )

        if (!response.ok) return

        const data = (await response.json()) as AniSkip
        const filteredSkipTimes = data.results.filter(
          ({ skipType }) => skipType === "op" || skipType === "ed"
        )
        if (!vttGenerated) {
          const vttContent = generateWebVTTFromSkipTimes(
            { results: filteredSkipTimes },
            totalDuration
          )
          const blob = new Blob([vttContent], { type: "text/vtt" })
          const vttBlobUrl = URL.createObjectURL(blob)
          setVttUrl(vttBlobUrl)
          setSkipTimes(filteredSkipTimes)
          setVttGenerated(true)
        }
      } catch (error) {
        console.error("Failed to fetch skip times", error)
      }
    }
  }

  return (
    <>
      {isPending ? (
        <div className="flex animate-pulse">
          <div className="relative h-0 w-full rounded-md bg-primary/10 pt-[56%]"></div>
        </div>
      ) : !error ? (
        <VidstackPlayer
          episodeId={episodeId}
          animeId={animeId}
          animeResponse={animeResponse}
          episodeNumber={episodeNumber}
          currentEpisode={currentEpisode}
          latestEpisodeNumber={latestEpisodeNumber}
          anilistId={anilistId}
          src={src}
          vttUrl={vttUrl}
          setTotalDuration={setTotalDuration}
          skipTimes={skipTimes}
          currentTime={currentTime}
          textTracks={textTracks}
        />
      ) : (
        <div>Please try again</div>
      )}

      <Server
        download={download ?? ""}
        animeResult={animeResponse}
        animeId={animeId}
        anilistId={anilistId}
        currentUser={currentUser}
        lastEpisode={episodeNumber}
      >
        <ButtonAction
          isLoading={isPending}
          latestEpisodeNumber={latestEpisodeNumber}
          anilistId={anilistId}
          lastEpisode={episodeNumber}
          animeTitle={animeId}
        />
      </Server>

      <Episodes
        episodes={episodes}
        isLoading={isPending}
        animeId={anilistId}
        episodeId={episodeId}
        episodeNumber={Number(episodeNumber)}
      />

      <RelationWatch relations={animeResponse.relations} />
      {/* <Sharethis /> */}
      <Comments
        anilistId={anilistId}
        animeId={animeId}
        episodeNumber={`${episodeNumber}`}
      />
    </>
  )
}

export default VideoPlayer
