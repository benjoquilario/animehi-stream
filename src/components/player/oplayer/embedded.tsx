"use client"

import React from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"

type EmbedPlayerProps = {
  src: string
}

const EmbedPlayer = ({ src }: EmbedPlayerProps) => {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe src={src}></iframe>
    </AspectRatio>
  )
}

export default EmbedPlayer
