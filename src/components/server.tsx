import { Button } from "./ui/button"

import type { AnimeInfoResponse, Episode } from "types/types"
import Bookmark from "./bookmark"
import { memo } from "react"
import ButtonAction from "./button-action"
import { getCurrentUser } from "@/lib/current-user"
import BookmarkForm from "./bookmark-form"

type ServerProps = {
  episodes?: Episode[]

  animeResult: AnimeInfoResponse | null
  episodeId: string
  animeId: string
}

export default async function Server({
  episodes,
  animeResult,
  episodeId,
  animeId,
}: ServerProps) {
  const currentUser = await getCurrentUser()

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          Auto Next <span className="text-primary">Off</span>
        </div>
        <div className="flex items-center">
          <ButtonAction
            animeId={animeId}
            episodeId={episodeId}
            episodes={episodes}
          >
            <Bookmark animeResult={animeResult}>
              <BookmarkForm animeResult={animeResult} />
            </Bookmark>
          </ButtonAction>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 bg-[#111827] md:flex-row">
        <div className="w-full bg-secondary px-5 py-3 text-center text-sm md:w-80">
          You are watching
          <div className="font-semibold">Episode 2</div>
          If current server doesnt work please try other servers beside
        </div>
        <div className="flex-1 pb-2 md:pb-0">
          <div className="">
            <Button size="sm" className="text-sm">
              Server 1
            </Button>
          </div>
        </div>
      </div>
      {/* <div className="mt-3 bg-[#111827] p-2 text-sm">
        The next episode is predicted to arrive on 2023/10/17 15:50GMT (6 days,
        10 hours, 7 minutes, 11 seconds)
      </div> */}
    </div>
  )
}
