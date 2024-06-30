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

  const isDub = searchParams.get("dub")

  const router = useRouter()
  return (
    <div className="flex items-center gap-2">
      <div className="">
        <button
          onClick={() => router.replace(`?episode=${episodeNumber}&dub=true`)}
          className={cn(
            "text-xs inline-flex items-center justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3",
            isDub ? "bg-primary" : "bg-background/20 "
          )}
        >
          Dub
        </button>
      </div>
    </div>
  )
}

export default Dub
