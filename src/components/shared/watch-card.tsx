import React from "react"
import { RecentType } from "types/types"
import Link from "next/link"
import Image from "./image"
import { base64SolidImage } from "@/src/lib/utils/image"
import { PlayIcon } from "@heroicons/react/outline"
import classNames from "classnames"
import Button from "./button"
import { MdBookmarkRemove } from "react-icons/md"

type WatchCardProps = {
  onClick?: () => void
} & RecentType

const WatchCard = (props: WatchCardProps) => {
  const { id, animeTitle, image, color, episodeNumber, episodeId, onClick } =
    props

  return (
    <div className="col-span-1">
      <div className="relative">
        <div className="relative cursor-pointer overflow-hidden rounded">
          <div className="aspect-h-3 aspect-w-2 relative">
            <div className="opacity-100">
              <Link href={`/anime/${id}`}>
                <a aria-label={`${animeTitle}`}>
                  <Image
                    layout="fill"
                    src={`${image}`}
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                      color as string
                    )}`}
                    className="rounded-lg"
                    alt={`Anime - ${animeTitle}`}
                    containerclassname="relative w-full h-full hover:opacity-70 transition-opacity"
                  />
                </a>
              </Link>
            </div>
            <Link href={`/watch/${id}?episode=${episodeId}`}>
              <a
                aria-label={`Play - ${animeTitle} episode ${episodeNumber}`}
                className="center-element flex h-full w-[101%] items-center justify-center opacity-0 transition hover:bg-[#1111117a] hover:opacity-100 focus:opacity-100"
              >
                <div className="flex flex-col items-center text-center text-primary">
                  <PlayIcon className="h-11 w-11 md:h-16 md:w-16" />
                </div>
              </a>
            </Link>
          </div>
          <Button
            onClick={onClick}
            className="absolute right-1 top-1 z-50 text-white transition hover:text-primary"
          >
            <MdBookmarkRemove className="h-7 w-7" />
          </Button>
          <h4 className="text-left text-sm font-bold text-white md:text-base">
            Episode {episodeNumber}
          </h4>
          <Link href={`/anime/${id}`}>
            <a
              style={{
                color: `${color ? color : "#fff"}`,
              }}
              className={classNames(
                "line-clamp-2 h-auto w-full text-left text-sm font-semibold hover:text-white md:text-base"
              )}
            >
              {animeTitle as string}
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default React.memo(WatchCard)
