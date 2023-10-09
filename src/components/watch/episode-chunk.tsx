import classNames from "classnames"
import React from "react"
import { BsChevronDown } from "react-icons/bs"
import { EpisodesType } from "@/src/../types/types"
import Disclosure from "@/components/watch/disclosure"
import Episode from "@/components/watch/episode"
import { useDispatch } from "@/store/store"
import { setEpisodeId } from "@/store/watch/slice"

type EpisodeChunkButtonProps = {
  title: string
}

const EpisodeChunkButton = ({ title }: EpisodeChunkButtonProps) => {
  return (
    <div className="flex w-full items-center justify-between px-4 py-2 md:px-0">
      <p className="text-xs text-white">Episode {title}</p>

      <BsChevronDown className="h-4 w-4 text-white" />
    </div>
  )
}

type EpisodeChunkProps = {
  episodes: EpisodesType[]
  title: string
  className?: string
  buttonClassName?: string
  activeName?: number
  open?: boolean
  watchPage: boolean
  animeId?: string
}

const EpisodeChunk = ({
  episodes,
  title,
  className,
  buttonClassName,
  activeName,
  open,
  watchPage,
  animeId,
}: EpisodeChunkProps): JSX.Element => {
  const dispatch = useDispatch()

  const onHandleChangeEpisode = (episodeId: string) => {
    dispatch(setEpisodeId(episodeId))
  }

  return (
    <Disclosure
      className={classNames(className)}
      buttonClassName={classNames("w-full rounded-md", buttonClassName)}
      button={<EpisodeChunkButton title={title} />}
      defaultOpen={open}
      panelClassName={classNames("flex flex-col")}
    >
      {episodes.map((episode) => (
        <Episode
          animeId={animeId}
          watchPage={watchPage}
          episode={episode}
          key={episode.id}
          active={activeName === episode.number}
          onClick={() => onHandleChangeEpisode(episode?.id)}
        />
      ))}
    </Disclosure>
  )
}

export default React.memo(EpisodeChunk)
