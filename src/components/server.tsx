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
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

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

  const autoSkip = useStore(useAutoSkip, (store) => store.autoSkip)
  const autoPlay = useStore(useAutoPlay, (store) => store.autoPlay)
  const autoNext = useStore(useAutoNext, (store) => store.autoNext)

  const changeAutoSkip = function () {
    useAutoSkip.setState({ autoSkip: autoSkip ? false : true })
  }

  const changeAutoPlay = function () {
    useAutoPlay.setState({ autoPlay: autoPlay ? false : true })
  }

  const changeAutoNext = function () {
    useAutoNext.setState({ autoNext: autoNext ? false : true })
  }

  const searchParams = useSearchParams()

  const handleSelectProvider = function (
    name: string,
    value: string,
    provider: string
  ) {
    const params = new URLSearchParams(searchParams.toString())
    // params.set("ep", `${lastEpisode}`)
    params.set(name, value)
    params.set("provider", provider)
    window.history.pushState(null, "", `?${params.toString()}`)
  }

  const provider = searchParams.get("provider")
  const type = searchParams.get("type")

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
                {autoSkip ? (
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
                {autoNext ? (
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
                {autoPlay ? (
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
            animeId={anilistId}
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
            <button
              onClick={() => handleSelectProvider("type", "sub", "zoro")}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                provider === "zoro" && type === "sub"
                  ? "bg-primary"
                  : "bg-background/60 hover:bg-background/80"
              )}
            >
              Zoro
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span>
              <FaMicrophone />
            </span>
            <Dub episodeNumber={lastEpisode} />
            <button
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                provider === "zoro" && type === "dub"
                  ? "bg-primary"
                  : "bg-background/60 hover:bg-background/80"
              )}
              onClick={() => handleSelectProvider("type", "dub", "zoro")}
            >
              Zoro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
