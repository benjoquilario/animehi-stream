import React, { Suspense } from "react"
import MostView from "@/components/most-view"

interface WatchLayoutProps {
  children: React.ReactNode
}

const WatchLayout = ({ children }: WatchLayoutProps) => {
  return (
    <div className="w-full px-[2%] pt-5">
      <div className="relative flex w-full max-w-full flex-col">
        <div className="flex flex-col xl:flex-row xl:space-x-4">
          {children}
          <Suspense>
            <MostView />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default WatchLayout
