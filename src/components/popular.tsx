import type { Popular } from "types/types"
import Column from "./column-card"

type PopularProps = {
  popularAnime?: Popular[]
}

export default function Popular({ popularAnime }: PopularProps) {
  return (
    <div className="w-80 pt-5">
      <div className="block w-full">
        <h3 className="mb-2 pr-4 text-2xl font-semibold">Trending Anime</h3>
        <div className="bg-background">
          <ul className="">
            {popularAnime?.map((data, index) => (
              <Column
                key={data.id}
                data={data}
                rank={index + 1}
                className="pl-14"
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
