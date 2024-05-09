"use client"

import { cn } from "@/lib/utils"
import NextImage from "./ui/image"
import { AnimeInfoResponse } from "types/types"

type DetailsProps = {
  data: AnimeInfoResponse
}

const Details = ({ data }: DetailsProps) => {
  return (
    <div className="mb-3 mt-4 w-full">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-44">
          <NextImage
            containerclassname="relative h-64 w-44 w-full rounded-md"
            className="rounded-md"
            fill
            style={{ objectFit: "cover" }}
            src={data.image}
            alt={data.title}
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h1 className="text-2xl">{data.title}</h1>
          {data.otherName ? (
            <h2 className="text-xs italic text-muted-foreground/70">
              {data.otherName || ""}
            </h2>
          ) : null}

          <div className="flex justify-between">
            <div className="flex flex-col gap-3">
              <Detail
                title="Status"
                value={data.status}
                className="uppercase"
              />

              <Detail title="Release Date" value={data.releaseDate} />
              <Detail title="Total Episodes" value={`${data.totalEpisodes}`} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {data.genres.map((genre) => (
          <span
            key={genre}
            className="rounded-sm border border-primary/90 p-2 text-xs uppercase"
          >
            {genre}
          </span>
        ))}
      </div>
      <div className="mt-4 bg-[#111827] p-4">
        <p className="text-sm text-muted-foreground/90">{data.description}</p>
      </div>
    </div>
  )
}

type DetailProps = {
  title: string
  value: string
  className?: string
}

const Detail = ({ title, value, className }: DetailProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground/80">{title}</span>
      <span className={cn("mt-1", className)}>{value}</span>
    </div>
  )
}

export default Details
