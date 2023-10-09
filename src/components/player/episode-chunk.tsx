"use client"

import type { Episode } from "types/types"
import Disclosure from "./disclosure"
import Link from "next/link"
import { buttonVariants } from "../ui/button"

type EpisodeChunkProps = {
  episodes: Episode[]
  animeId: string
  open: boolean
}

export default function EpisodeChunk({
  episodes,
  animeId,
  open,
}: EpisodeChunkProps) {
  return (
    <>
      <Disclosure open={open}>
        {episodes.map((episode) => (
          <Link
            href={`/watch/${animeId}/${episode.id}`}
            key={episode.id}
            className={buttonVariants({ variant: "secondary" })}
          >
            {episode.number}
          </Link>
        ))}
      </Disclosure>
    </>
  )
}
