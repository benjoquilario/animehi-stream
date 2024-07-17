"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { AiOutlineSearch } from "react-icons/ai"
import { Input } from "../ui/input"
import type { IEpisode, IMetadata } from "types/types"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { FaSpinner } from "react-icons/fa"
import { FaCirclePlay } from "react-icons/fa6"
import {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
  useTransition,
} from "react"

type EpisodesProps = {
  episodeId?: string
  animeId: string
  episodeNumber?: number
  episodes?: IEpisode[]
  isLoading: boolean
  slug: string
}

export default function Episodes({
  episodeId,
  animeId,
  episodes,
  isLoading,
  episodeNumber,
  slug,
}: EpisodesProps) {
  const [query, setQuery] = useState("")
  const [interval, setInterval] = useState<[number, number]>([0, 99])
  const router = useRouter()

  const animeTitle = useMemo(
    () => episodes?.[0]?.id?.split?.("-episode-")[0] ?? slug,
    [episodes, slug]
  )

  const intervalOptions = useMemo(() => {
    if (!isLoading) {
      return episodes?.reduce<{ start: number; end: number }[]>(
        (options, _, index) => {
          if (index % 100 === 0) {
            const start = index
            const end = Math.min(index + 99, episodes?.length - 1)
            options.push({ start, end })
          }
          return options
        },
        []
      )
    }
  }, [episodes, isLoading])

  const handleIntervalChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const [start, end] = e.target.value.split("-").map(Number)
      setInterval([start, end])
    },
    []
  )

  const currentEpisode = useMemo(
    () => episodes?.find((episode: IEpisode) => episode?.id === episodeId),
    [episodes, episodeId]
  )

  const filteredEpisode = useMemo(() => {
    const searchQuery = query.toLowerCase()
    return episodes?.filter(
      (episode) => episode.number.toString() === searchQuery
    )
  }, [episodes, query])

  const displayedEpisodes = useMemo(() => {
    if (!isLoading && episodes) {
      if (!query) {
        return episodes?.slice(interval[0], interval[1] + 1)
      }
      return filteredEpisode
    }
  }, [episodes, interval, isLoading, query, filteredEpisode])

  return (
    <div className="mt-4">
      {isLoading ? (
        <div className="mt-4 flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="mb-2 flex items-center justify-between">
          <div className="w-full">
            <div className="mb-4 flex h-full justify-between">
              <select
                onChange={handleIntervalChange}
                value={`${interval[0]}-${interval[1]}`}
                className="rounded-md border-none bg-secondary px-3"
              >
                {intervalOptions?.map((option, i) => (
                  <option key={i} value={`${option.start}-${option.end}`}>
                    Episode {option.start + 1} - {option.end + 1}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Input
                  value={query}
                  placeholder="No. Episode"
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Link href={`/watch/${animeId}/${query}`}>
                  <button
                    className="absolute right-[5px] top-[6px] text-muted-foreground/80"
                    type="submit"
                  >
                    <AiOutlineSearch className="h-6 w-6" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="no-scrollbar max-h-96 w-full overflow-auto rounded-md">
              <div className="flex flex-col odd:bg-secondary/30 even:bg-background">
                {episodes?.length !== 0 ? (
                  displayedEpisodes?.map((episode, index) => (
                    <Link
                      href={`/watch?id=${animeId}&slug=${animeTitle}&ep=${episode.number}`}
                      key={episode.id}
                      className={cn(
                        "justify-start p-3 text-[14px] font-medium transition-all odd:bg-secondary/30 even:bg-background hover:bg-secondary active:scale-[.98]",
                        episodeNumber === index + 1
                          ? "!bg-primary !text-foreground hover:!bg-primary/80"
                          : "!odd:bg-secondary/30 even:bg-background"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{episode.number}</span>
                        <div className="line-clamp-1 italic text-muted-foreground/80 md:line-clamp-2">
                          {episode.title ?? `Episode ${episode.number}`}
                        </div>
                        {episodeNumber === index + 1 ? (
                          <span>
                            <FaCirclePlay />
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-3">No Episode Found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {isLoading ? (
        <div className="mt-4 flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="mb-2 flex items-center justify-between">
          <div className="w-full">
            <div className="mb-4 flex h-full justify-between">
              <select
                onChange={handleIntervalChange}
                value={`${interval[0]}-${interval[1]}`}
                className="rounded-md border-none bg-secondary px-3"
              >
                {intervalOptions?.map((option, i) => (
                  <option key={i} value={`${option.start}-${option.end}`}>
                    Episode {option.start + 1} - {option.end + 1}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Input
                  value={query}
                  placeholder="No. Episode"
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Link href={`/watch/${animeId}/${query}`}>
                  <button
                    className="absolute right-[5px] top-[6px] text-muted-foreground/80"
                    type="submit"
                  >
                    <AiOutlineSearch className="h-6 w-6" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="no-scrollbar max-h-96 w-full overflow-auto rounded-md">
              <div className="flex flex-col odd:bg-secondary/30 even:bg-background">
                {displayedEpisodes?.length !== 0 ? (
                  displayedEpisodes?.map((episode, index) =>
                    isWatch ? (
                      <Button
                        onClick={() => update?.(episode.id, episode.number, 0)}
                        key={episode.id}
                        className={cn(
                          "justify-start p-3 text-[14px] font-medium odd:bg-secondary/30 even:bg-background hover:bg-secondary",
                          currentEpisode?.number === episode.number
                            ? "!bg-primary text-white hover:!bg-primary/80"
                            : "!odd:bg-secondary/30 even:bg-background"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{episode.number}</span>
                          <div className="italic text-muted-foreground/80">
                            {episode.title ?? `Episode ${episode.number}`}
                          </div>
                        </div>
                      </Button>
                    ) : (
                      <Link
                        href={`/watch/${animeTitle}/${animeId}?episode=${episode.number}`}
                        key={episode.id}
                        className={cn(
                          "justify-start p-3 text-[14px] font-medium odd:bg-secondary/30 even:bg-background hover:bg-secondary",
                          currentEpisode?.number === episode.number
                            ? "!bg-primary text-white hover:!bg-primary/80"
                            : "!odd:bg-secondary/30 even:bg-background"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{episode.number}</span>
                          <div className="italic text-muted-foreground/80">
                            {episode.title ?? `Episode ${episode.number}`}
                          </div>
                        </div>
                      </Link>
                    )
                  )
                ) : (
                  <div className="p-3">No Episode Found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}
