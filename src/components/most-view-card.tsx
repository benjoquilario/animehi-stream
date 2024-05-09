"use client"

import React from "react"
import type { ViewCounter } from "@prisma/client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import NextImage from "./ui/image"
import { AiFillEye } from "react-icons/ai"
import { FaClosedCaptioning } from "react-icons/fa"

type MostViewCardProps = {
  result: ViewCounter
  className?: string
  rank: number
}

export default function MostViewCard({
  result,
  className,
  rank,
}: MostViewCardProps) {
  return (
    <>
      <div>
        <Link
          href={`/watch/${result.animeId}/${result.latestEpisodeNumber}/${result.anilistId}`}
        >
          <NextImage
            containerclassname="relative w-[60px] h-[75px]"
            fill
            src={result.image}
            alt={result.title}
            className="rounded-lg"
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>
      <div className="flex-1 px-3">
        <h3 className="mb-1 line-clamp-2">{result.title}</h3>
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-xs">
              <FaClosedCaptioning /> {result.latestEpisodeNumber ?? 1}
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs">
              {result.latestEpisodeNumber ?? 1}
            </div>
            <span className="mx-1 inline-block h-1 w-1 rounded-full bg-primary"></span>
            <div className="text-sm text-muted-foreground/70">TV</div>
          </div>
        </div>
      </div>
    </>
  )
}
