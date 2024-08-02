"use client"

import React, { useEffect, useState, useCallback } from "react"
import { IAnilistInfo } from "types/types"
import Episodes from "@/components/episode/episodes"
import { useSearchParams } from "next/navigation"
import Server from "@/components/server"
import ButtonAction from "@/components/button-action"
import { useWatchStore } from "@/store"
import RelationWatch from "@/components/watch/relation"
import Comments from "@/components/comments/comments"
import type { IEpisode } from "types/types"
import { Badge } from "@/components/ui/badge"
import { LuMessageSquare } from "react-icons/lu"
import { Spinner } from "@vidstack/react"
import dynamic from "next/dynamic"
import VidstackPlayer from "./player"
import { fetchAnimeEpisodes, fetchAnimeEpisodesFallback } from "@/lib/cache"

type VideoPlayerProps = {
  animeId: string
  animeResponse: IAnilistInfo
  anilistId: string
  currentUser: any
  ep: string
}

const VideoPlayer = (props: VideoPlayerProps) => {
  const { animeId, animeResponse, anilistId, currentUser, ep } = props

  const searchParams = useSearchParams()
  const isDub = searchParams.get("dub")
  const episodeNumber = Number(ep) || 1
  const download = useWatchStore((store) => store.download)
  // const [isLoading, setIsLoading] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(false)
  const [selectedBackgroundImage, setSelectedBackgroundImage] =
    useState<string>("")

  const [episodesList, setEpisodesLists] = useState<IEpisode[]>()
  const [episodesNavigation, setEpisodeNavigation] = useState<{
    id: string
    title: string
    description: string
    number: number
    image: string
  } | null>({
    id: "",
    title: "",
    description: "",
    number: 1,
    image: "",
  })

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
            results = data
            setEpisodesLists(data)

            const currentEpisode = data.find(
              (ep) => ep.number === episodeNumber
            )

            if (currentEpisode) {
              setEpisodeNavigation({
                id: currentEpisode.id,
                title: currentEpisode.title,
                description: currentEpisode.description || "",
                number: currentEpisode.number,
                image: currentEpisode.image,
              })
            }
          } else {
            const data = await fetchAnimeEpisodesFallback(anilistId)

            const transformEpisode: IEpisode[] = data.data.episodesList.map(
              (episode: {
                episodeId: number
                id: string
                number: number
                title: string
              }) => {
                return {
                  id: episode.episodeId,
                  title: `Episode ${episode.number}`,
                  image: null,
                  imageHash: "hash",
                  number: episode.number,
                  createdAt: null,
                  description: null,
                  url: "",
                }
              }
            )

            setEpisodesLists(transformEpisode)

            const currentEpisode = data.data.episodesList.find(
              (ep: {
                episodeId: number
                id: string
                number: number
                title: string
              }) => ep.number === episodeNumber
            )

            if (currentEpisode) {
              setEpisodeNavigation({
                id: currentEpisode.id,
                title: `Episode ${currentEpisode.number}`,
                description: currentEpisode.description ?? "",
                number: currentEpisode.number,
                image: currentEpisode.image ?? "",
              })
            }
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
    return () => {
      setEpisodeNavigation(null)
    }
  }, [anilistId, episodeNumber])

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

  return (
    <>
      {isPending ? (
        <div className="flex animate-pulse">
          <div className="relative h-0 w-full rounded-md bg-primary/10 pt-[56%]"></div>
        </div>
      ) : !error ? (
        episodesNavigation ? (
          <VidstackPlayer
            malId={`${animeResponse.malId}`}
            episodeId={episodesNavigation.id}
            animeId={animeId}
            animeResponse={animeResponse}
            episodeNumber={episodesNavigation.number}
            latestEpisodeNumber={10}
            anilistId={anilistId}
            banner={selectedBackgroundImage}
            currentEpisode={episodesNavigation}
            title={`${animeResponse.title.english ?? animeResponse.title.romaji} / Episode ${episodeNumber}`}
          />
        ) : (
          <div className="flex-center relative aspect-video h-full w-full">
            <SpinLoader />
          </div>
        )
      ) : (
        <div>Please try again</div>
      )}

      <Server
        download={download ?? ""}
        animeResult={animeResponse}
        animeId={animeId}
        anilistId={anilistId}
        currentUser={currentUser}
        lastEpisode={episodesNavigation?.number!}
      >
        <ButtonAction
          isLoading={isPending}
          latestEpisodeNumber={10}
          anilistId={anilistId}
          lastEpisode={episodesNavigation?.number!}
          animeTitle={animeId}
        />
      </Server>

      <Episodes
        slug={animeId}
        episodes={episodesList}
        isLoading={isPending}
        animeId={anilistId}
        episodeNumber={episodesNavigation?.number!}
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
          animeId={animeId}
          episodeNumber={`${episodesNavigation.number}`}
        />
      ) : (
        <></>
      )}

      {/* <Sharethis /> */}
    </>
  )
}

function SpinLoader() {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex h-full w-full items-center justify-center">
      <Spinner.Root className="animate-spin text-white opacity-100" size={84}>
        <Spinner.Track className="opacity-25" width={8} />
        <Spinner.TrackFill className="opacity-75" width={8} />
      </Spinner.Root>
    </div>
  )
}

export default VideoPlayer
