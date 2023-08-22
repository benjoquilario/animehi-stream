import React from "react"
import Link from "next/link"
import { PlayIcon } from "@heroicons/react/outline"
import type { RecentType } from "types/types"

type WatchLinkProps = {
  isExist: boolean
  id: string
  color: string
  currentWatchEpisode: RecentType
  lastEpisode: string
}

const WatchLink = (props: WatchLinkProps): JSX.Element => {
  const { isExist, id, color, currentWatchEpisode, lastEpisode } = props
  return (
    <Link
      href={`/watch/${id}?episode=${
        isExist ? currentWatchEpisode?.episodeId : lastEpisode
      }`}
    >
      <a
        style={{
          backgroundColor: `${color || "#000000"}`,
        }}
        className={`flex items-center gap-x-1 rounded-md px-3 py-2 text-sm transition duration-300 hover:opacity-80 md:text-base`}
      >
        <div className="h-5 w-5 text-white">
          <PlayIcon />
        </div>
        <p className="text-xs md:text-sm">
          {isExist
            ? `Continue Watching Episode ${currentWatchEpisode?.episodeNumber}`
            : "Watch Now"}
        </p>
      </a>
    </Link>
  )
}

export default WatchLink
