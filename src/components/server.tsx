"use client"

import type { AnimeInfoResponse, Episode, IAnilistInfo } from "types/types"
import { Button } from "./ui/button"
import ButtonAction from "./button-action"
import BookmarkForm from "./bookmark-form"
import { FaClosedCaptioning } from "react-icons/fa6"
import { FaMicrophone } from "react-icons/fa"
import { FaDownload } from "react-icons/fa"
import { useEffect, useMemo, useState } from "react"
import Sub from "@/components/watch/subtitle"
import Dub from "./watch/dub"
import NextAiringEpisode from "./anime/next-airing"
import { useAutoSkip, useAutoPlay, useAutoNext } from "@/store"
import { useStore } from "zustand"
import ClientOnly from "./ui/client-only"
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md"
import { FaCheck } from "react-icons/fa6"
import { IoCloseSharp, IoAlertCircleOutline } from "react-icons/io5"

type ServerProps = {
  animeResult?: IAnilistInfo
  animeId: string
  anilistId: string
  currentUser: any
  lastEpisode: number
  download: string
  children: React.ReactNode
}

export default function Server({
  animeResult,
  animeId,
  anilistId,
  currentUser,
  lastEpisode,
  download,
  children,
}: ServerProps) {
  const [isRemove, setIsRemove] = useState(false)
  const checkBookmarkExist = useMemo(
    () =>
      currentUser?.bookMarks.some(
        (bookmark: any) =>
          bookmark.anilistId === animeResult?.id &&
          bookmark.userId === currentUser.id
      ),
    [currentUser, animeResult]
  )

  const isAutoSkip = useStore(useAutoSkip, (store: any) => store.autoSkip)
  const isAutoPlay = useStore(useAutoPlay, (store: any) => store.autoPlay)
  const isAutoNext = useStore(useAutoNext, (store: any) => store.autoNext)

  const changeAutoSkip = function () {
    useAutoSkip.setState({ autoSkip: isAutoSkip ? false : true })
  }

  const changeAutoPlay = function () {
    useAutoPlay.setState({ autoPlay: isAutoPlay ? false : true })
  }
  const changeAutoNext = function () {
    useAutoNext.setState({ autoNext: isAutoNext ? false : true })
  }

  console.log(isAutoSkip)

  // const setEmbeddedUrl = useWatchStore((store) => store.setEmbeddedUrl)
  // const [isLoading, setIsLoading] = useState(true)

  // console.log(sourceType)

  // useEffect(() => {
  //   let isMounted = false

  //   async function fetchEmbeddedUrls() {
  //     if (!episodeId) {
  //       console.log("Error")
  //       setIsLoading(false)
  //       return
  //     }
  //     setIsLoading(true)
  //     try {
  //       const response = await fetch(
  //         `${process.env.ANIME_API_URI}/meta/anilist/servers/${episodeId}?provider=gogoanime`
  //       )

  //       if (!response.ok) throw new Error("Failed to fetch servers")

  //       const data = (await response.json()) as { name: string; url: string }[]

  //       if (isMounted && data.length > 0) {
  //         const vidstreamingUrl =
  //           data.find((d) => d.name === "vidstreaming") || data[0]

  //         const gogoServer = data.find((d) => d.name == "Gogo server")
  //         if (sourceType === "vidstreaming") {
  //           setEmbeddedUrl(vidstreamingUrl?.url)
  //         } else if (sourceType === "gogo") {
  //           setEmbeddedUrl(gogoServer?.url)
  //         }
  //       }
  //     } catch (error) {
  //       console.log("Error Again")
  //     } finally {
  //       if (isMounted) setIsLoading(false)
  //     }
  //   }

  //   fetchEmbeddedUrls()

  //   return () => {
  //     isMounted = false
  //   }
  // }, [episodeId, setEmbeddedUrl, sourceType])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] md:text-xs">
          <div className="">
            <button
              className="flex items-center gap-1 text-foreground/80 hover:scale-95 hover:text-foreground  active:scale-105"
              onClick={changeAutoSkip}
            >
              <ClientOnly>
                {isAutoSkip ? (
                  <FaCheck aria-hidden className="text-primary" size={15} />
                ) : (
                  <MdCheckBoxOutlineBlank
                    aria-hidden
                    className="text-primary"
                    size={15}
                  />
                )}
              </ClientOnly>
              <span className="text-foreground"> Auto Skip</span>
            </button>
          </div>
          <div className="">
            <button
              className="flex items-center gap-1 text-foreground/80 hover:scale-95 hover:text-foreground  active:scale-105"
              onClick={changeAutoNext}
            >
              <ClientOnly>
                {isAutoNext ? (
                  <FaCheck aria-hidden className="text-primary" size={15} />
                ) : (
                  <MdCheckBoxOutlineBlank
                    aria-hidden
                    className="text-primary"
                    size={15}
                  />
                )}
              </ClientOnly>
              <span className="text-foreground"> Auto Next</span>
            </button>
          </div>
          <div className="">
            <button
              className="flex items-center gap-1 text-foreground/80 hover:scale-95 hover:text-foreground  active:scale-105"
              onClick={changeAutoPlay}
            >
              <ClientOnly>
                {isAutoPlay ? (
                  <FaCheck aria-hidden className="text-primary" size={15} />
                ) : (
                  <MdCheckBoxOutlineBlank
                    aria-hidden
                    className="text-primary"
                    size={15}
                  />
                )}
              </ClientOnly>
              <span className="text-foreground"> Auto Play</span>
            </button>
          </div>
        </div>
        <div className="flex items-center">
          {children}
          <BookmarkForm
            animeId={animeId}
            userId={currentUser?.id}
            bookmarks={currentUser?.bookMarks}
            animeResult={animeResult}
            checkBookmarkExist={checkBookmarkExist}
            anilistId={anilistId}
          />
        </div>
      </div>
      {isRemove ? null : (
        <div className="flex items-center justify-between rounded-md bg-destructive p-2 text-xs md:text-sm">
          <div className="flex items-center gap-1">
            <IoAlertCircleOutline />{" "}
            <span>
              If the player isn&apos;t working, refresh the page. If the problem
              persists, please report it.
            </span>
          </div>
          <button onClick={() => setIsRemove(true)}>
            <IoCloseSharp />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 items-center gap-2 overflow-hidden rounded-md md:grid-cols-[1fr_380px] md:flex-row">
        <div className="flex h-full w-full flex-col justify-center gap-3 rounded-md bg-secondary/20 px-5 py-3 text-left text-sm">
          <div className="flex items-center gap-1">
            You are watching
            <span className="font-semibold">Episode {lastEpisode}</span>
            <a href={download} target="_blank">
              <FaDownload />
            </a>
          </div>
          <span>If current server doesnt work please try other servers.</span>
          <NextAiringEpisode animeInfo={animeResult} />
        </div>
        <div className="flex h-full flex-col items-start justify-center gap-2 rounded-md bg-secondary/20 p-3 pl-4">
          <div className="flex items-center gap-2">
            <span>
              <FaClosedCaptioning />
            </span>
            <Sub episodeNumber={lastEpisode} />
            <Button
              variant="ghost"
              className="bg-background/60 hover:bg-background/80"
            >
              Vidstreaming
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span>
              <FaMicrophone />
            </span>
            <Dub episodeNumber={lastEpisode} />
            <Button
              variant="ghost"
              className="bg-background/60 hover:bg-background/80"
            >
              Vidstreaming
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
