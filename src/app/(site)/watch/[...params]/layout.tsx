import React from "react"
import Popular from "@/components/popular"
import { popular } from "@/lib/consumet"

type WatchLayoutProps = {
  children: React.ReactNode
}

export default async function WatchLayout({ children }: WatchLayoutProps) {
  const popularResponse = await popular()

  return (
    <div className="w-full px-[2%]">
      <div className="relative flex w-full max-w-full flex-col">
        <div className="flex flex-col md:space-x-4 xl:flex-row">
          {children}
          <Popular popularResults={popularResponse.results} />
        </div>
      </div>
    </div>
  )
}
