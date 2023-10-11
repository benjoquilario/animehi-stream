"use client"
import { Button } from "./ui/button"
import { AiFillForward, AiFillBackward } from "react-icons/ai"

type ServerProps = {
  nextEpisode: () => void
  prevEpisode: () => void
  isPrevEpisode: boolean
  isNextEpisode: boolean
  currentEpisodeIndex?: number
}

export default function Server({
  nextEpisode,
  prevEpisode,
  isNextEpisode,
  isPrevEpisode,
  currentEpisodeIndex,
}: ServerProps) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          Auto Next <span className="text-primary">Off</span>
        </div>
        <div className="flex items-center">
          <Button
            onClick={prevEpisode}
            disabled={isPrevEpisode}
            className="flex h-3 items-center gap-2 bg-background px-2 text-sm hover:bg-background"
          >
            <AiFillBackward className="h-5 w-5" />
            Prev episode
          </Button>
          <Button
            onClick={nextEpisode}
            disabled={isNextEpisode}
            className="flex h-3 items-center gap-2 bg-background px-2 text-sm hover:bg-background"
          >
            Next episode
            <AiFillForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 bg-[#111827] md:flex-row">
        <div className="bg-secondary px-5 py-3 text-center text-sm">
          You are watching
          <div className="font-semibold">Episode {currentEpisodeIndex}</div>
          If current server doesnt work please try other servers beside
        </div>
        <div className="flex-1 ">
          <div className="">
            <Button size="sm" className="text-sm">
              Server 1
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3 bg-[#111827] p-2 text-sm">
        The next episode is predicted to arrive on 2023/10/17 15:50GMT (6 days,
        10 hours, 7 minutes, 11 seconds)
      </div>
    </div>
  )
}
