import Link from "next/link"
// import Image from "next/image"
import type { RecentEpisode } from "types/types"
import { BsFillPlayFill } from "react-icons/bs"

type EpisodeCardProps = {
  animeResult: RecentEpisode
}

export default function EpisodeCard({ animeResult }: EpisodeCardProps) {
  return (
    <>
      <div className="relative mb-2 w-full overflow-hidden rounded-md pb-[140%]">
        <div className="absolute left-0 top-0 rounded text-xs font-semibold">
          HD
        </div>
        <div className="absolute bottom-0 left-0 z-20 flex w-full justify-between shadow-lg">
          <div className="rounded-tr-md bg-red-800 p-1 text-xs font-semibold md:font-bold">
            Ep {animeResult.episodeNumber}
          </div>
          <div className="rounded-tl-md rounded-tr bg-[#ffc107] p-1 text-xs font-semibold md:font-bold">
            SUB
          </div>
        </div>
        <div className="absolute h-full w-full">
          <div className="relative h-full w-full">
            <img
              style={{ objectFit: "cover" }}
              src={animeResult.image}
              alt={animeResult.title}
              width={180}
              height={200}
            />
          </div>
        </div>
        <Link
          href={`/watch/${animeResult.id}/${animeResult.episodeId}/${animeResult.episodeNumber}`}
          aria-label={animeResult.episodeId}
          className="absolute inset-0 flex items-center justify-center bg-black/60 text-primary opacity-0 transition-opacity hover:opacity-100"
          // href={`/watch/${data.anime.anilistId}/${data.anime.slug}/${data.number}`}
          // aria-label={`Play - ${
          //   data.anime.title.english || data.anime.title.romaji
          // } - Episode ${data.number}`}
        >
          <BsFillPlayFill className="h-12 w-12" />
        </Link>
      </div>
      <div>
        <h3 className="line-clamp-2 text-center text-xs font-semibold leading-5 md:text-sm">
          {animeResult.title}
        </h3>
      </div>
    </>
  )
}
