"use client"

import React from "react"
import Link from "next/link"
import NextImage from "@/components/ui/image"
import { FaClosedCaptioning } from "react-icons/fa"
import { Seasonal } from "types/types"
import { extractId } from "@/lib/utils"

type ColumnCardProps = {
  result: Seasonal
}

const ColumnCard = ({ result }: ColumnCardProps) => {
  return (
    <>
      <div>
        <Link
          href={`${extractId(result.mappings)}/${
            result.id
          }/${result.currentEpisode ?? 1}`}
          aria-label={result.title.english ?? result.title.romaji}
        >
          <NextImage
            containerclassname="relative w-[60px] h-[75px]"
            fill
            src={result.coverImage}
            alt={result.title.english || result.title.romaji}
            className="rounded-lg"
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>
      <div className="flex-1 px-1 md:px-3">
        <Link
          href={`${extractId(result.mappings)}/${
            result.id
          }/${result.currentEpisode}`}
        >
          <h3 className="mb-1 line-clamp-2 text-sm font-medium !leading-5 hover:text-primary md:text-[15px]">
            {result.title.english || result.title.romaji}
          </h3>
        </Link>

        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-1 rounded-lg bg-primary px-1 py-1 text-[10px] text-white md:px-2 md:text-xs">
              <FaClosedCaptioning /> {result.currentEpisode ?? 1}
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-secondary px-1 py-1 text-[10px] md:px-2 md:text-xs">
              {result.currentEpisode ?? 1}
            </div>
            <span className="mx-1 inline-block h-1 w-1 rounded-full bg-primary"></span>
            <div className="text-xs text-muted-foreground/70 md:text-sm">
              {result.format}
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </>
  )
}

export default ColumnCard
