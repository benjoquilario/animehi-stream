import { useState } from "react"
import { stripHtml } from "@/src/lib/utils/index"
import Image from "@/components/shared/image"
import type { TitleType } from "types/types"

type WatchDetailsProps = {
  image: string
  title: TitleType
  description: string
}

const WatchDetails = ({ image, title, description }: WatchDetailsProps) => {
  const [showMore, setShowMore] = useState<boolean>(false)

  return (
    <div className="col-span-full ml-4 mt-3 ">
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <Image
          layout="fill"
          objectFit="cover"
          src={`${image}`}
          alt={title?.romaji}
          className="rounded-md"
          containerclassname="relative h-[130px] w-[100px] md:h-[250px] md:w-[200px]"
        />
        <div className="text-white">
          <h1 className="text-md mb-2 font-semibold text-white md:text-3xl">
            {title?.english}
          </h1>
          <p className="mt-2 text-xs font-extralight leading-6 text-slate-300 md:text-sm">
            {showMore
              ? stripHtml(description)
              : stripHtml(description?.substring(0, 415))}

            <button
              className="transform p-1 text-xs text-white shadow-lg transition duration-300 ease-out hover:scale-105"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show less" : "Show more"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default WatchDetails
