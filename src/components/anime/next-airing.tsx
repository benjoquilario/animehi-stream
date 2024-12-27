"use client"

import { useCountdown } from "@/hooks/useCountdown"
import React from "react"
import { IAnilistInfo } from "types/types"

interface NextAiringEpisodeProps {
  animeInfo?: IAnilistInfo
}

const NextAiringEpisode: React.FC<NextAiringEpisodeProps> = ({ animeInfo }) => {
  const nextEpisodeNumber =
    animeInfo?.status === "Ongoing" ? animeInfo?.nextAiringEpisode?.episode : ""
  const nextEpisodeAiringTime =
    animeInfo?.status === "Ongoing" && animeInfo?.nextAiringEpisode
      ? animeInfo?.nextAiringEpisode?.airingTime * 1000
      : null

  const countdown = useCountdown(nextEpisodeAiringTime)

  return animeInfo?.status === "Ongoing" ? (
    <span>
      The episode {nextEpisodeNumber} is predicted to arrive on{" "}
      <span className="font-semibold">({countdown})</span>
    </span>
  ) : (
    <></>
  )
}

export default NextAiringEpisode
