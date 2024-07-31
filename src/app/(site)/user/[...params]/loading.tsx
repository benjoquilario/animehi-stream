import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <div className="relative flex flex-col px-[2%]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="mt-16 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-md" />
            <Skeleton className="h-[33px] w-[144px] rounded-md" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-28 w-full rounded-md" />
          <Skeleton className="h-56 w-full rounded-md" />
        </div>
        <div className="mt-4 flex flex-col gap-3 md:mt-32">
          <Skeleton className="h-9 w-40 rounded-md" />
          <Skeleton className="h-72 w-full rounded-md" />
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default Loading
