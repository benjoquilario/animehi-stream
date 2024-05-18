import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const LoadingSite = () => {
  return (
    <>
      <div
        className={cn(
          "relative h-[350px] w-full animate-pulse bg-background px-[2%] md:h-[500px]"
        )}
      >
        <div className="absolute bottom-[50px] top-[auto] z-[100] w-full max-w-[800px] space-y-3 md:bottom-[109px]">
          <Skeleton className="h-[28px] w-[344px] md:h-[52px] md:w-[512px]" />
          <Skeleton className="h-[42px] w-[344px] md:h-[58px] md:w-[512px]" />
          <div className="flex items-center space-x-3">
            <Skeleton className="h-[40px] w-[114px]" />
            <Skeleton className="h-[40px] w-[114px]" />
          </div>
        </div>
      </div>
      <div className="mt-4 px-[2%]">
        <div className="mb-3 space-y-3">
          <Skeleton className="h-[40px] w-[114px]" />
          <Skeleton className="h-[40px] w-[114px]" />
        </div>
        <div className="flex flex-col items-center space-x-3 md:flex-row">
          <Skeleton className="h-[180px] w-[320px]" />
        </div>
      </div>
      <div className="mt-4 px-[2%]">
        <div className="grid grid-cols-2 gap-2 md:gap-4 xl:grid-cols-4">
          <SeasonalSkeleton />
          <SeasonalSkeleton />
          <SeasonalSkeleton />
          <SeasonalSkeleton />
        </div>
      </div>
      <div className="mt-4 px-[2%]">
        <div className="flex flex-col md:space-x-4 xl:flex-row">
          <div className="relative grid grid-cols-3 gap-3 overflow-hidden md:grid-cols-4 lg:grid-cols-5">
            {Array.from(Array(10), (_, i) => (
              <div className="flex flex-col gap-2" key={i + 1}>
                <Skeleton className="h-[150px] w-[112px] md:h-[260px] md:w-[185px]" />
                <Skeleton className="md:w-[185px h-[40px] w-[112px]" />
              </div>
            ))}
          </div>
          <div className="w-full pt-5 xl:w-80 xl:pt-0">
            <SeasonalSkeleton />
          </div>
        </div>
      </div>
    </>
  )
}

export function SeasonalSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
    </div>
  )
}

export function SeasonalCardSkeleton() {
  return (
    <div className="flex space-x-2">
      <Skeleton className="h-[75px] w-[60px]" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[35px] w-[108px] md:w-[210px]" />
        <Skeleton className="h-[30px] md:w-[180px]" />
      </div>
    </div>
  )
}
export default LoadingSite
