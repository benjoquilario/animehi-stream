"use client"

import { useWatchStore } from "@/store"
import { Button } from "../ui/button"
import React, { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

type DubProps = {
  episodeNumber: number
}

const Dub = (props: DubProps) => {
  const { episodeNumber } = props
  const searchParams = useSearchParams()

  const handleSelectType = function (
    name: string,
    value: string,
    provider: string
  ) {
    const params = new URLSearchParams(searchParams.toString())
    // params.set("ep", `${lastEpisode}`)
    params.set("provider", provider)
    params.set(name, value)
    window.history.pushState(null, "", `?${params.toString()}`)
  }

  const type = searchParams.get("type")
  const provider = searchParams.get("provider")

  return (
    <div className="flex items-center gap-2">
      <div className="">
        <button
          onClick={() => handleSelectType("type", "dub", "gogoanime")}
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            provider === "gogoanime" && type === "dub"
              ? "bg-primary"
              : "bg-background/60 hover:bg-background"
          )}
        >
          Dub
        </button>
      </div>
    </div>
  )
}

export default Dub
