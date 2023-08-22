import React from "react"
import { genreList } from "@/lib/constant"

const Genres = () => {
  return (
    <div className="mt-3 hidden w-full xl:block">
      <div className="bg-background-700 p-2">
        <h2 className="text-base font-semibold uppercase text-white md:text-[20px]">
          Genres
        </h2>
        <ul className="grid grid-cols-3 gap-1">
          {genreList.map((genre) => (
            <li className="p-1 text-sm text-white" key={genre}>
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default React.memo(Genres)
