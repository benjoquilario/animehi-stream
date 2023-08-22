import Link from "next/link"
import React from "react"
import { EpisodesType } from "@/src/../types/types"
import classNames from "classnames"

type EpisodeProps = {
  active?: boolean
  onClick?: () => void
  episode: EpisodesType
  watchPage: boolean
  animeId?: string
}

type EpisodeNumberProps = {
  episode: EpisodesType
  active?: boolean
}

export const EpisodeNumber = ({
  episode,
  active,
}: EpisodeNumberProps): JSX.Element => (
  <>
    <div className="flex gap-2">
      <h2 className="text-xs text-white">{episode?.number}</h2>
      <p className="line-clamp-2 text-xs capitalize text-slate-300">
        {episode?.title ? episode?.title : `Episode ${episode?.number}`}
      </p>
    </div>
  </>
)

const Episode = ({
  active,
  onClick,
  episode,
  watchPage,
  animeId,
}: EpisodeProps): JSX.Element =>
  watchPage ? (
    <button
      onClick={onClick}
      className={classNames(
        "flex w-full flex-row items-center justify-between p-3 text-left transition odd:bg-[#0d0d0d] even:bg-[#111] hover:bg-[#1b1919]",
        active && "!bg-[#6A55FA]"
      )}
    >
      <EpisodeNumber active={active} episode={episode} />
    </button>
  ) : (
    <Link href={`/watch/${animeId}?episode=${episode?.id}`}>
      <a className="flex w-full flex-row items-center justify-between px-3 py-2 text-left transition odd:bg-[#0d0d0d] even:bg-[#111] hover:bg-[#1b1919]">
        <EpisodeNumber active={active} episode={episode} />
      </a>
    </Link>
  )

export default React.memo(Episode)
