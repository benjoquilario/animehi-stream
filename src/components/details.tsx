"use client"

import Image from "next/image"
import { AnimeInfoResponse } from "types/types"

type DetailsProps = {
  data: AnimeInfoResponse
}

const Details = ({ data }: DetailsProps) => {
  return (
    <div className="mb-3 mt-4 w-full">
      <div className="flex gap-4">
        <div className="w-40">
          <div className="relative h-56 w-full rounded-md">
            <Image
              className="rounded-md"
              width={250}
              height={400}
              src={data.image}
              alt={data.title}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h1 className="text-2xl">{data.title}</h1>
          {data.otherName ? (
            <h2 className="text-xs italic text-muted-foreground/70">
              {data.otherName || ""}
            </h2>
          ) : null}

          <p className="text-sm text-muted-foreground/90">{data.description}</p>
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground/90">
              <div>
                <span>Type: {data.type}</span>
              </div>
              <div>
                <span>Status: {data.status}</span>
              </div>
              <div>
                <span>Sub Or Dub: {data.subOrDub}</span>
              </div>
              <div>
                <span>
                  Genres:{" "}
                  {data.genres.map((genre) => (
                    <span key={genre} className="text-primary">
                      {genre},
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground/90">
              <div>
                <span>Release Data: {data.releaseDate}</span>
              </div>
              <div>
                <span>Total Episodes: {data.totalEpisodes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
