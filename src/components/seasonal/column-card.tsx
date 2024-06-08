"use client"

import React from "react"
import Link from "next/link"
import NextImage from "@/components/ui/image"
import { FaClosedCaptioning } from "react-icons/fa"
import { IAdvancedInfo, Seasonal } from "types/types"
import { transformedTitle } from "@/lib/utils"

type ColumnCardProps = {
  result: IAdvancedInfo
}

const ColumnCard = ({ result }: ColumnCardProps) => {
  const title = transformedTitle(result.title.romaji)

  return (
    <>
      <div>
        <Link
          href={`/anime/${title}/${result.id}`}
          aria-label={result.title.english ?? result.title.romaji}
        >
          <NextImage
            containerclassname="relative w-[60px] h-[75px]"
            fill
            src={result.image}
            alt={result.title.english || result.title.romaji}
            className="rounded-lg"
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>
      <div className="flex-1 px-1 md:px-3">
        <Link href={`/anime/${title}/${result.id}`}>
          <h3 className="mb-1 line-clamp-2 text-sm font-medium !leading-5 hover:text-primary md:text-[15px]">
            {result.title.english || result.title.romaji}
          </h3>
        </Link>

        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-1 rounded-lg bg-primary p-1 text-[10px] text-white md:px-2 md:text-xs">
              <FaClosedCaptioning /> {result.currentEpisode ?? 1}
            </div>
            <span className="mx-1 inline-block h-1 w-1 rounded-full bg-primary"></span>
            <div className="text-xs text-muted-foreground/70 md:text-sm">
              {result.status}
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </>
  )
}

export default React.memo(ColumnCard)
