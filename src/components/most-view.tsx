import { mostView } from "@/lib/metrics"
import React from "react"
import Section from "./section"
import MostViewCard from "./most-view-card"

export default async function MostView() {
  const mostViewAnime = await mostView()

  return (
    <div className="w-full pt-5 md:w-80">
      <div className="block w-full">
        <h3 className="mb-2 border-l-2 border-primary pr-4 text-2xl font-semibold">
          Most Views
        </h3>
        <div className="bg-background">
          <ul className="">
            {mostViewAnime.map((mostView, index) => (
              <MostViewCard data={mostView} rank={index + 1} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
