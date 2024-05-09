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
          href={`${extractId(result.mappings)}/${result.currentEpisode}/${
            result.id
          }`}
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
      <div className="flex-1 px-3">
        <h3 className="mb-1 line-clamp-2 text-sm md:text-base">
          {result.title.english || result.title.romaji}
        </h3>
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-xs">
              <FaClosedCaptioning /> {result.currentEpisode ?? 1}
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs">
              {result.currentEpisode ?? 1}
            </div>
            <span className="mx-1 inline-block h-1 w-1 rounded-full bg-primary"></span>
            <div className="text-sm text-muted-foreground/70">
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
