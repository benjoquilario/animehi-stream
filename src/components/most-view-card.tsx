"use client"

import React from "react"
import type { ViewCounter } from "@prisma/client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "./ui/image"
import { AiFillEye } from "react-icons/ai"

type MostViewCardProps = {
  data: ViewCounter
  className?: string
  rank: number
}

export default function MostViewCard({
  data,
  className,
  rank,
}: MostViewCardProps) {
  return (
    <li
      className={cn("md:h-22 relative mb-2 flex h-20 items-center", className)}
    >
      <Link
        className="relative flex w-full pl-2 pr-4 transition hover:bg-secondary"
        href={`/watch/${data.animeId}/1`}
      >
        <div className="w-[54px] shrink-0">
          <Image
            containerClassName="relative h-[76px] w-[56px] rounded-sm"
            src={data.image}
            alt={data.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="self-start pl-2">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground/80">#{rank}</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
            <span className="text-xs text-muted-foreground/80">TV</span>
          </div>
          <h3
            className={cn(
              "line-clamp-2 text-base font-semibold leading-5 transition duration-300 hover:text-primary"
            )}
          >
            {data.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground/70">
            <AiFillEye />
            <span>{data.view}</span>
          </div>
        </div>
      </Link>
    </li>
  )
}
