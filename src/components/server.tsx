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
import NextAiringEpisode from "./anime/next-airing"

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
  const checkBookmarkExist = useMemo(
    () =>
      currentUser?.bookMarks.some(
        (bookmark: any) =>
          bookmark.anilistId === animeResult?.id &&
          bookmark.userId === currentUser.id
      ),
    [currentUser, animeResult]
  )

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
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          Auto Next <button className="text-primary">Off</button>
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
      <div className="grid grid-cols-1 items-center gap-2 overflow-hidden rounded-md md:grid-cols-[1fr_380px] md:flex-row">
        <div className="flex w-full flex-col gap-1 rounded-md bg-secondary px-5 py-3 text-left text-sm">
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
        <div className="flex h-full flex-col items-start justify-center gap-2 rounded-md bg-secondary p-3 pl-4">
          <div className="flex items-center gap-2">
            <span>
              <FaClosedCaptioning />
            </span>
            <Sub />
          </div>
          {/* <div className="flex items-center gap-2">
            <span>
              <FaMicrophone />
            </span>
            <Sub />
          </div> */}
        </div>
      </div>
      {/* <div className="mt-3 bg-[#111827] p-2 text-sm">
        The next episode is predicted to arrive on 2023/10/17 15:50GMT (6 days,
        10 hours, 7 minutes, 11 seconds)
      </div> */}
    </div>
  )
}
