import React from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"

const LoadingWatch = () => {
  return (
    <div className="mt-5 flex-1">
      <AspectRatio ratio={16 / 9} className="flex items-center justify-center">
        <div className="loader"></div>
      </AspectRatio>
    </div>
  )
}

export default LoadingWatch
