import React from "react"
import Column from "./column"
import { Seasonal, SeasonalResponse } from "types/types"
import Section from "../section"

type SeasonalProps = {
  seasonalResults: SeasonalResponse | null
}

export default function Seasonal({ seasonalResults }: SeasonalProps) {
  return (
    <Section sectionName="seasonal" className="my-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Column seasonalTitle="Trending" results={seasonalResults?.trending} />
        <Column seasonalTitle="Popular" results={seasonalResults?.popular} />
        <Column seasonalTitle="Top Airing" results={seasonalResults?.top} />
        <Column seasonalTitle="Season" results={seasonalResults?.seasonal} />
      </div>
    </Section>
  )
}
