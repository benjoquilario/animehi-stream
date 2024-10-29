"use client"

import { IRecommendationItem } from "types/types"
import NextImage from "@/components/ui/image"
import Link from "next/link"
import { transformedTitle } from "@/lib/utils"

interface RecommendationsProps {
  recommendations?: IRecommendationItem[]
}

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
}) => {
  return (
    <ul className="relative grid grid-cols-3 gap-3 overflow-hidden md:grid-cols-5 lg:grid-cols-7">
      {recommendations?.map((recommendation) => (
        <li
          key={recommendation.id}
          className="col-span-1 overflow-hidden rounded-md"
        >
          <RecommendationItem recommendation={recommendation} />
        </li>
      ))}
    </ul>
  )
}

type RecommendationItemProps = {
  recommendation: IRecommendationItem
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({
  recommendation,
}) => {
  const title = transformedTitle(recommendation.title.romaji)

  return (
    <>
      <div className="relative mb-2 w-full overflow-hidden rounded-md pb-[140%]">
        <div className="absolute h-full w-full">
          <NextImage
            classnamecontainer="relative"
            style={{ objectFit: "cover" }}
            src={recommendation.image}
            alt={recommendation.title.english ?? recommendation.title.romaji}
            width={180}
            height={200}
            className="relative h-full w-full"
          />
        </div>
        <Link
          href={`/anime/${title}/${recommendation.id}`}
          aria-label={`${recommendation.id}`}
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 text-primary opacity-0 transition-opacity hover:opacity-100"
        >
          <div className="absolute bottom-0 z-30 h-1/4 w-full bg-gradient-to-t from-background/80 from-25% to-transparent transition-all duration-300 ease-out group-hover:to-background/40"></div>
        </Link>
      </div>
      <div>
        <h3
          title={recommendation.title.english ?? recommendation.title.romaji}
          className="line-clamp-2 text-center text-xs font-medium leading-5 md:text-sm"
        >
          {recommendation.title.english ?? recommendation.title.romaji}
        </h3>
      </div>
    </>
  )
}

export default Recommendations
