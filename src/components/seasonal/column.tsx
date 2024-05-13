"use client"

import React from "react"
import ColumnCard from "./column-card"
import { Seasonal } from "types/types"

type ColumnProps = {
  results?: Seasonal[]
  seasonalTitle: string
}

const Column = ({ results, seasonalTitle }: ColumnProps) => {
  return (
    <div className="w-full">
      <div className="min-h-[300px] w-full">
        <div className="relative mb-4 flex font-semibold xl:text-lg">
          <div className="mr-2 h-6 w-1 rounded-md bg-primary md:w-2"></div>
          {seasonalTitle}
        </div>
        <div className="bg-transparent">
          <ul>
            {results?.slice(0, 5)?.map((result) => (
              <li
                key={result?.id}
                className="relative flex items-center justify-between border-b py-4"
              >
                <ColumnCard result={result} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Column
