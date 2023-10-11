import React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Popular } from "types/types"

type ColumnProps = {
  className?: string
  data: Popular
  rank: number
}

export default function Column({ className, data, rank }: ColumnProps) {
  return (
    <li
      className={cn(
        "md:h-22 relative flex h-20 items-center py-2 pr-4",
        className
      )}
    >
      <div className="absolute left-0 flex h-[38px] w-[38px] cursor-default items-center justify-center rounded border-2 border-l-primary text-center transition">
        <span className="text-lg">{rank}</span>
      </div>

      <div className="w-12 shrink-0">
        <div className="relative h-[72px] w-[48px] rounded-sm">
          <Image
            sizes="(max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw"
            src={data.image}
            alt={data.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <div className="self-start pl-2">
        <Link
          className={cn(
            "line-clamp-2 text-base font-semibold transition duration-300 hover:text-primary"
          )}
          href={`/watch/${data.id}/${data.id}-episode-1`}
        >
          {data.title}
        </Link>

        <div className="line-clamp-1 items-center space-x-2 text-sm text-slate-300">
          {data.genres?.map((genre) => (
            <React.Fragment key={genre}>
              <span>{genre}</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </li>
  )
}
