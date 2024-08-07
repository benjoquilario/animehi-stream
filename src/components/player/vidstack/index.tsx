"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
import { IAnilistInfo } from "types/types"
import Episodes from "@/components/episode/episodes"
import { useRouter, useSearchParams } from "next/navigation"
import Server from "@/components/server"
import ButtonAction from "@/components/button-action"
import { useWatchStore } from "@/store"
import RelationWatch from "@/components/watch/relation"
import Comments from "@/components/comments/comments"
import type { IEpisode } from "types/types"
import { Badge } from "@/components/ui/badge"
import { LuMessageSquare } from "react-icons/lu"
// import { Spinner } from "@vidstack/react"
// import dynamic from "next/dynamic"
import VidstackPlayer from "./player"
import { fetchAnimeEpisodes, fetchAnimeEpisodesFallback } from "@/lib/cache"
import ClientOnly from "@/components/ui/client-only"
// import { AspectRatio } from "@/components/ui/aspect-ratio"

type VideoPlayerProps = {
  animeResponse: IAnilistInfo
  anilistId: string
  currentUser: any
}

const VideoPlayer = (props: VideoPlayerProps) => {
  const { animeResponse, anilistId, currentUser } = props

  const searchParams = useSearchParams()
  const isDub = searchParams.get("dub")
  const ep = searchParams.get("ep")
  const episodeNumber = Number(ep) || 1
  const download = useWatchStore((store) => store.download)
  // const [isLoading, setIsLoading] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(false)
  const [selectedBackgroundImage, setSelectedBackgroundImage] =
    useState<string>("")
  const [isEpisodeChanging, setIsEpisodeChanging] = useState(false)
  const [episodesList, setEpisodesLists] = useState<IEpisode[]>()
  const [episodesNavigation, setEpisodeNavigation] = useState<IEpisode | null>(
    null
  )

  const router = useRouter()

  useEffect(() => {
    const updateBackgroundImage = () => {
      const episodeImage = episodesNavigation?.image
      const bannerImage = animeResponse?.cover || animeResponse?.image
      if (episodeImage && episodeImage !== animeResponse.image) {
        const img = new Image()
        img.onload = () => {
          if (img.width > 500) {
            setSelectedBackgroundImage(episodeImage)
          } else {
            setSelectedBackgroundImage(bannerImage)
          }
        }
        img.onerror = () => {
          setSelectedBackgroundImage(bannerImage)
        }
        img.src = episodeImage
      } else {
        setSelectedBackgroundImage(bannerImage)
      }
    }
    if (animeResponse && episodesNavigation) {
      updateBackgroundImage()
    }
  }, [animeResponse, episodesNavigation])

  const handleEpisodeSelect = useCallback(
    async (selectedEpisode: IEpisode) => {
      // await new Promise((resolve) => setTimeout(resolve, 100))
      const params = new URLSearchParams(searchParams.toString())
      params.set("ep", `${selectedEpisode.number}`)
      window.history.pushState(null, "", `?${params.toString()}`)
    },
    [searchParams]
  )

  useEffect(() => {
    let isMounted = true
    const fetchData = async function () {
      setIsPending(true)

      if (!anilistId) return
      try {
        let results: IEpisode[]
        const data = (await fetchAnimeEpisodes(anilistId)) as IEpisode[]

        if (isMounted && data) {
          if (data.length !== 0) {
            setEpisodesLists(data)
          } else {
            const data = (await fetchAnimeEpisodesFallback(
              anilistId
            )) as IEpisodesFallback[]

            const eps = data.find((ep) => ep.providerId === "shash")

            const transformEpisodes = eps?.episodes.map((ep) => {
              return {
                id: ep.id,
                title: `Episode ${ep.number}`,
                description: "",
                number: ep.number,
                image: selectedBackgroundImage,
                createdAt: "",
                imageHash: "",
                url: "",
              }
            })

            setEpisodesLists(transformEpisodes)
          }
        }
      } catch (error) {
        console.error("Error")
        setError(true)
      } finally {
        setIsPending(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anilistId, episodeNumber])

  useEffect(() => {
    if (episodesList) {
      const currentEpisode = episodesList.find(
        (ep) => ep.number === episodeNumber
      )

      if (currentEpisode) {
        setEpisodeNavigation({
          id: currentEpisode.id,
          title: currentEpisode.title,
          description: currentEpisode.description || "",
          number: currentEpisode.number,
          image: currentEpisode.image,
          createdAt: "",
          imageHash: "",
          url: "",
        })
      }
    }
  }, [episodeNumber, episodesList])

  useEffect(() => {
    const mediaSession = navigator.mediaSession
    if (!mediaSession) return

    const poster = episodesNavigation?.image || animeResponse?.cover
    const title = episodesNavigation?.title || animeResponse?.title?.romaji

    const artwork = poster
      ? [{ src: poster, sizes: "512x512", type: "image/jpeg" }]
      : undefined

    mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: `AnimeHi ${
        title === animeResponse?.title?.romaji
          ? "- Episode " + episodeNumber
          : `- ${animeResponse?.title?.romaji || animeResponse?.title?.english}`
      }`,
      artwork,
    })
  }, [episodesNavigation, animeResponse, episodeNumber])

  const latestEpisodeNumber = useMemo(
    () =>
      episodesList?.length !== 0
        ? episodesList?.length ??
          animeResponse.currentEpisode ??
          animeResponse.nextAiringEpisode.episode - 1
        : 1,
    [animeResponse, episodesList]
  )

  return (
    <ClientOnly>
      {isPending ? (
        <div className="flex animate-pulse">
          <div className="relative h-0 w-full rounded-md bg-primary/10 pt-[56%]"></div>
        </div>
      ) : !error ? (
        episodesNavigation && (
          <VidstackPlayer
            malId={`${animeResponse.malId}`}
            episodeId={episodesNavigation.id}
            animeResponse={animeResponse}
            episodeNumber={episodesNavigation.number}
            latestEpisodeNumber={latestEpisodeNumber}
            anilistId={anilistId}
            banner={selectedBackgroundImage}
            currentEpisode={episodesNavigation}
            title={`${animeResponse.title.english ?? animeResponse.title.romaji} / Episode ${episodeNumber}`}
          />
        )
      ) : (
        <div>Please try again</div>
      )}

      <Server
        download={download ?? ""}
        animeResult={animeResponse}
        animeId={anilistId}
        anilistId={anilistId}
        currentUser={currentUser}
        lastEpisode={episodesNavigation?.number!}
      >
        <ButtonAction
          isLoading={isPending}
          latestEpisodeNumber={latestEpisodeNumber}
          anilistId={anilistId}
          lastEpisode={episodesNavigation?.number!}
          animeTitle={anilistId}
        />
      </Server>

      <Episodes
        episodes={episodesList}
        isLoading={isPending}
        animeId={anilistId}
        episodeNumber={episodesNavigation?.number!}
        onEpisodeSelect={(epNum: number) => {
          if (episodesList) {
            const episode = episodesList?.find((e) => e.number === epNum)
            if (episode) {
              handleEpisodeSelect(episode)
            }
          }
        }}
      />

      <RelationWatch relations={animeResponse.relations} />
      <div className="mt-4">
        <h3 className="flex w-full items-center pt-2.5 text-left text-sm font-semibold md:text-base">
          <div className="mr-2 h-6 w-2 rounded-md bg-primary md:h-8"></div>
          Comments
          <Badge className="ml-2">Beta</Badge>
        </h3>
        <div className="mt-2 w-full rounded-sm bg-destructive px-2 py-5 text-center text-sm md:text-base">
          Respect others. Be nice. No spam. No hate speech.
        </div>

        <div className="my-4 flex items-center gap-2 text-xs md:text-sm">
          <LuMessageSquare />

          <span>Comments EP {episodeNumber}</span>
        </div>
      </div>

      {!isPending && episodesNavigation ? (
        <Comments
          anilistId={anilistId}
          episodeNumber={`${episodesNavigation.number}`}
          animeTitle={animeResponse.title.english ?? animeResponse.title.romaji}
        />
      ) : (
        <></>
      )}

      {/* <Sharethis /> */}
    </ClientOnly>
  )
}

export default VideoPlayer
