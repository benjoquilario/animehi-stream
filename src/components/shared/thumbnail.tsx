import React, { useMemo } from "react"
import Link from "next/link"
import { Options } from "@popperjs/core"
import { base64SolidImage } from "@/src/lib/utils/image"
import { PlayIcon } from "@heroicons/react/outline"
import { EnimeType, TitleType } from "@/src/../types/types"
import Image from "@/components/shared/image"
import classNames from "classnames"
import Popup from "./popup"
import { stripHtml } from "@/src/lib/utils/index"
import Genre from "./genre"
import Icon from "./icon"
import { FaThumbsUp, FaPlay } from "react-icons/fa"
import { AiFillClockCircle } from "react-icons/ai"
import { BsEmojiSmile } from "react-icons/bs"
import { IAnimeInfo } from "@consumet/extensions/dist/models/types"
import { title } from "@/lib/helper"
import dayjs from "@/lib/utils/time"

export type ThumbnailProps = {
  data: IAnimeInfo | EnimeType
  isRecent: boolean
  episodeNumber?: number
  episodeId?: string
  episodePoster?: string
  image?: string
  genres?: string[]
  description?: string
  episodeTitle?: string
  createdAt?: string
}

const popupOptions: Partial<Options> = {
  strategy: "absolute",

  modifiers: [
    {
      name: "sameWidth",
      enabled: true,
      fn: ({ state }) => {
        state.styles.popper.height = `${state.rects.reference.height}px`
        state.styles.popper.width = `${state.rects.reference.width * 3}px`
      },
      phase: "beforeWrite",
      requires: ["computeStyles"],
      effect({ state }) {
        const { width, height } =
          state.elements.reference.getBoundingClientRect()
        state.elements.popper.style.width = `${width * 3}px`
        state.elements.popper.style.height = `${height}px`
      },
    },
  ],
}

const Thumbnail = (props: ThumbnailProps): JSX.Element => {
  const {
    data,
    isRecent,
    episodeId,
    episodeNumber,
    episodePoster,
    image,
    genres,
    description,
    episodeTitle,
    createdAt,
  } = props

  const episodeDate = useMemo(() => dayjs(createdAt).fromNow(), [createdAt])

  return (
    <Popup
      reference={
        <div className="col-span-1">
          <div className="relative">
            <div className="relative cursor-pointer overflow-hidden rounded">
              {isRecent ? (
                <div className="absolute left-0 top-0 z-20 rounded-br bg-white p-1 text-[10px] font-bold text-black">
                  HD
                </div>
              ) : null}
              {isRecent ? (
                <div className="absolute bottom-0 left-0 z-20 flex w-full justify-between shadow-lg">
                  <span className="rounded-tr-md bg-red-800 p-1 text-xs font-semibold text-white md:font-bold">
                    Ep {episodeNumber}
                  </span>
                  <span className="rounded-tl-md rounded-tr bg-[#ffc107] p-1 text-xs font-semibold text-white md:font-bold	">
                    SUB
                  </span>
                </div>
              ) : null}

              <div className="aspect-h-3 aspect-w-2 relative">
                <div className="opacity-100">
                  <Link href={`/anime/${data.id}`}>
                    <a aria-label={title(data.title as TitleType)}>
                      <Image
                        layout="fill"
                        src={`${image}`}
                        objectFit="cover"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                          `${data.color}`
                        )}`}
                        className="rounded-lg"
                        alt={`Anime - ${title(data.title as TitleType)}`}
                        containerclassname="relative w-full h-full hover:opacity-70 transition-opacity"
                      />
                    </a>
                  </Link>
                </div>
                {isRecent ? (
                  <Link
                    href={`/watch/${
                      data.anilistId || data.id
                    }?episode=${episodeId}`}
                  >
                    <a
                      aria-label={`Play - ${title(
                        data.title as TitleType
                      )} episode ${episodeNumber}`}
                      className="center-element flex h-full w-[101%] items-center justify-center opacity-0 transition hover:bg-[#1111117a] hover:opacity-100 focus:opacity-100"
                    >
                      <div className="h-11 w-11 text-primary">
                        <PlayIcon />
                      </div>
                    </a>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          <Link href={`/anime/${data.anilistId}`}>
            <a
              style={{ color: `${data.color ? data.color : "#fff"}` }}
              className={classNames(
                "line-clamp-2 h-auto w-full p-1 text-left text-sm font-semibold hover:text-white md:text-base"
              )}
            >
              {title(data.title as TitleType)}
            </a>
          </Link>
        </div>
      }
      options={popupOptions}
      offset={[0, 8]}
    >
      <Image
        layout="fill"
        src={`${episodePoster || image}`}
        objectFit="cover"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
          `${data.color}`
        )}`}
        className=""
        alt={`Episode - ${episodeTitle || title(data.title as TitleType)}`}
        containerclassname="relative w-full h-full transition-opacity"
      />
      <div className="z-100 absolute inset-0 bg-black opacity-60"></div>
      <div className="absolute inset-0 flex flex-col justify-center p-4 text-white">
        {isRecent ? (
          <h2 className="text-2xl">
            Episode {episodeNumber} :
            {episodeTitle || title(data.title as TitleType)}
          </h2>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">{data.status}</h2>
            <div className="flex items-center text-primary">
              <BsEmojiSmile className="h-8 w-8" />
              <span className="ml-2 text-lg font-semibold text-white">
                {/* @ts-ignore */}
                {data.rating}%
              </span>
            </div>
          </div>
        )}

        {createdAt && <span className="-mt-1 text-sm">{episodeDate}</span>}
        {isRecent && (
          <p className="line-clamp-4 text-sm">
            {stripHtml(
              `${description ? description : "No Episode Description"}`
            ) || stripHtml(`${data.description}` || "No Description")}
          </p>
        )}
        {!isRecent && (
          <div className="flex items-center gap-2">
            {/* @ts-ignore */}
            <span>{data.type} Shows</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
            {/* @ts-ignore */}
            <span>{data.episodes} Episodes</span>
          </div>
        )}
        <div className="mr-2 mt-2 hidden flex-wrap gap-2 md:flex">
          {genres?.map((genre) => (
            <div className="flex items-center gap-2" key={genre}>
              <Genre genre={genre} className="text-base" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
            </div>
          ))}
        </div>
        {isRecent ? (
          <div className="flex space-x-2">
            <Icon icon={FaPlay} text={`${data.format}`} />
            <Icon
              icon={AiFillClockCircle}
              text={`${data.duration || 24} Min/Ep`}
            />
            <Icon icon={FaThumbsUp} text={`${data.popularity}`} />
          </div>
        ) : (
          <div className="flex flex-col text-base">
            {/* @ts-ignore */}
            <span>- {data.title.english}</span>
            {/* @ts-ignore */}
            <span>- {data.title.romaji}</span>
            {/* @ts-ignore */}
            <span>- {data.title.native}</span>
            {/* @ts-ignore */}
            <span>- {data.title.userPreferred}</span>
          </div>
        )}
      </div>
    </Popup>
  )
}

export default React.memo(Thumbnail) as typeof Thumbnail
