import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Popular } from "types/types"
import NextImage from "./ui/image"

type ColumnProps = {
  className?: string
  data: Popular
  rank: number
}

export default function Column({ className, data, rank }: ColumnProps) {
  return (
    <li
      className={cn("md:h-22 relative mb-2 flex h-20 items-center", className)}
    >
      <Link
        className="relative flex w-full pr-4 transition hover:bg-secondary"
        href={`/watch/${data.id}/1`}
      >
        <div className="w-[54px] shrink-0">
          <NextImage
            classnamecontainer="relative h-[76px] w-[56px] rounded-sm"
            src={data.image}
            alt={data.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="mt-2 self-start pl-2">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground/80">#{rank}</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
            <span className="text-xs text-muted-foreground/80">TV</span>
          </div>
          <h3
            title={data.title}
            className={cn(
              "line-clamp-2 text-base font-semibold leading-5 transition duration-300 hover:text-primary"
            )}
          >
            {data.title}
          </h3>
        </div>
      </Link>
    </li>
  )
}
