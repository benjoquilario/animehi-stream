import React, { useMemo } from "react"
import dayjs from "@/src/lib/utils/time"
import TitleName from "../shared/title-name"
import useAiringSchedule from "@/hooks/useAiringSchedule"
import Link from "next/link"
import { episodesTitle } from "@/src/lib/utils/index"

const AiringScheduling = () => {
  const { data: animeAired, isLoading } = useAiringSchedule()

  const getDate = useMemo(() => {
    const date = new Date()
    const now = dayjs(date).format("LLLL")
    return now
  }, [])

  return !isLoading ? (
    <div>
      <div className="flex flex-col items-start md:flex-row md:items-center md:space-x-3">
        <TitleName classNames="md:mb-0" title="Estimated Schedule" />
        <span className="rounded-lg bg-primary px-2 text-white">{getDate}</span>
      </div>
      <div className="mt-4 h-[330px] overflow-auto">
        {animeAired?.map((anime, index) => (
          <div
            key={index}
            className="p-4 odd:bg-background-800 even:bg-background-900"
          >
            <div className="flex w-full justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">
                  {dayjs(anime.airingAt as number).format("LTS")}
                </span>

                <Link href={`/anime/${anime.id}`}>
                  <a className="text-sm transition hover:text-primary md:text-base">
                    {anime.title.english || anime.title.romaji}
                  </a>
                </Link>
              </div>
              <div>
                <Link
                  href={`/watch/${anime.id}?episode=${episodesTitle(
                    anime.title.romaji
                  )}-episode-${anime.episode}`}
                >
                  <a className="flex h-[35px] w-[90px] items-center justify-center rounded bg-black text-sm transition hover:bg-primary md:w-[115px]">
                    {`Episode ${anime.episode}`}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default React.memo(AiringScheduling)
