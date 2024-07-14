"use client"

import { useWatchStore } from "@/store"
import { Button } from "../ui/button"
import React, { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

type SubProps = {
  episodeNumber: number
}

const Sub = (props: SubProps) => {
  const { episodeNumber } = props
  const router = useRouter()
  const searchParams = useSearchParams()

  const isDub = searchParams.get("dub")

  return (
    <div className="flex items-center gap-2">
      <div className="">
        <button
          onClick={() => router.replace(`?episode=${episodeNumber}`)}
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-md px-3 text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            isDub ? "bg-background/60 hover:bg-background/80" : "bg-primary"
          )}
        >
          Sub
        </button>
      </div>
      {/* <div className="">
        <Button
          onChange={() => handleChangeType("gogo")}
          size="sm"
          className="text-sm"
        >
          Gogo Server
        </Button>
      </div>
      <div className="">
        <Button
          onChange={() => handleChangeType("vidstreaming")}
          size="sm"
          className="text-sm"
        >
          Vidstreaming
        </Button>
      </div> */}
    </div>
  )
}

export default Sub
