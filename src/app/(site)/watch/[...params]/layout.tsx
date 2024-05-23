import React, { Suspense } from "react"
import MostView from "@/components/most-view"
import { Skeleton } from "@/components/ui/skeleton"

interface WatchLayoutProps {
  children: React.ReactNode
  params: string[]
}

const WatchLayout = ({ children, params }: WatchLayoutProps) => {
  return (
    <div className="w-full px-[2%] pt-3">
      <div className="relative flex w-full max-w-full flex-col">
        <div className="flex flex-col xl:flex-row xl:space-x-4">
          {children}
          <Suspense
            fallback={
              <div className="flex flex-col space-y-3">
                {Array.from(Array(10), (_, i) => (
                  <div key={i} className="flex space-x-2">
                    <Skeleton className="h-[75px] w-[60px]" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-[35px] w-[240px]" />
                      <Skeleton className="h-[30px] w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <MostView />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default WatchLayout
