import { mostView } from "@/lib/metrics"
import React from "react"
import MostViewCard from "./most-view-card"

export default async function MostView() {
  const mostViewAnime = await mostView()

  return (
    <div className="w-full pt-5 xl:w-80 xl:pt-0">
      <div className="block w-full">
        <h3 className="mb-2 flex pr-4 text-2xl font-semibold">
          <div className="mr-2 h-8 w-2 rounded-md bg-primary"></div>
          Most Views
        </h3>
        <div className="bg-background/8">
          <ul className="">
            {mostViewAnime.map((mostView, index) => (
              <li
                key={mostView?.id}
                className="relative flex items-center justify-between border-b py-4"
              >
                <MostViewCard result={mostView} rank={index + 1} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
