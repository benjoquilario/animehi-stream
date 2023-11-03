"use client"

import type { Popular } from "types/types"
import Column from "./column-card"
import Section from "./section"

type PopularProps = {
  popularResults?: Popular[]
}

export default function Popular({ popularResults }: PopularProps) {
  return (
    <Section sectionName="popular" className="w-full pt-5 md:w-80">
      <div className="block w-full">
        <h2 className="mb-2 pr-4 text-2xl font-semibold text-primary">
          Most Popular
        </h2>
        <div className="bg-background/80">
          <ul className="">
            {popularResults?.map((data, index) => (
              <Column
                key={data.id}
                data={data}
                rank={index + 1}
                className="pl-2"
              />
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
