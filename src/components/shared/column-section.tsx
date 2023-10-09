import React from "react"
import Link from "next/link"
import Image from "./image"
import classNames from "classnames"
import { base64SolidImage } from "@/src/lib/utils/image"
import { TitleType } from "types/types"
import { IAnimeInfo, IAnimeResult } from "@consumet/extensions"
import { title } from "@/lib/helper"

type ColumnSectionProps = {
  data: IAnimeInfo | IAnimeResult
  isGenres?: boolean
  className?: string
  genres?: string[]
}

const ColumnSection = ({
  data,
  isGenres = true,
  className,
  genres,
}: ColumnSectionProps) => (
  <li
    className={classNames(
      "md:h-22 flex h-20 items-center px-4 py-2 odd:bg-background-800 even:bg-background-900",
      className
    )}
  >
    <div className="w-12 shrink-0">
      <Image
        containerclassname="relative h-[72px] w-[48px]"
        src={`${data.image}`}
        alt={`${title(data.title as TitleType)}`}
        layout="fill"
        objectFit="cover"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
          `${data.color}`
        )}`}
      />
    </div>
    <div className="self-start pl-2">
      <style jsx>{`
        .hover-text:hover {
          color: ${data.color ? data.color : "#6a55fa"};
        }
      `}</style>
      <Link href={`/anime/${data.id}`}>
        <a
          className={classNames(
            "hover-text line-clamp-1 text-base font-semibold text-white transition duration-300"
          )}
        >
          {title(data.title as TitleType)}
        </a>
      </Link>
      <div className="line-clamp-1 flex items-center space-x-2 text-sm text-slate-300">
        <span>{data.type}</span>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
        <span>{data.releaseDate}</span>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
        <span>{data.status}</span>
      </div>

      {isGenres ? (
        <div className="line-clamp-1 items-center space-x-2 text-sm text-slate-300">
          {genres?.map((genre) => (
            <React.Fragment key={genre}>
              <span>{genre}</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </div>
  </li>
)

export default React.memo(ColumnSection)
