"use client"

import { increment } from "@/app/actions"
import { publicUrl } from "@/lib/consumet"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

import React from "react"

export default function ViewCounter({
  animeId,
  trackView = true,
  className,
}: {
  animeId: string
  trackView?: boolean
  className?: string
}) {
  useEffect(() => {
    if (trackView) {
      increment(animeId)
    }
  }, [])

  return <div className={cn(className)}>ViewCounter</div>
}
