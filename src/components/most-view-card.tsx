"use client"

import React, { memo } from "react"
import type { ViewCounter } from "@prisma/client"
import NextImage from "./ui/image"
import { FaClosedCaptioning } from "react-icons/fa"

interface MostViewCardProps {
  result: ViewCounter
}

const MostViewCard: React.FC<MostViewCardProps> = ({ result }) => (
  <>
    <div>
      <NextImage
        classnamecontainer="relative w-[60px] h-[75px]"
        fill
        src={result.image}
        alt={result.title}
        className="rounded-lg"
        style={{ objectFit: "cover" }}
      />
    </div>
    <div className="flex-1 px-3">
      <div className="inline-block">
        <h3 className="mb-1 line-clamp-2 text-[12px] font-medium !leading-5 group-hover:text-primary md:text-[14px]">
          {result.title}
        </h3>
      </div>

      <div className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-1 rounded-lg bg-primary p-1 text-xs text-white md:px-2">
            <FaClosedCaptioning /> {result.latestEpisodeNumber ?? 1}
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-1 text-xs md:px-2">
            {result.latestEpisodeNumber ?? 1}
          </div>
          <span className="mx-1 inline-block h-1 w-1 rounded-full bg-primary"></span>
          <div className="text-xs text-muted-foreground/70 md:text-sm">TV</div>
        </div>
      </div>
    </div>
  </>
)

export default memo(MostViewCard)
