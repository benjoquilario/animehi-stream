import type { AnimeInfoResponse, Episode } from "types/types"
import { Button } from "./ui/button"
import ButtonAction from "./button-action"
import { getCurrentUser } from "@/lib/current-user"
import BookmarkForm from "./bookmark-form"
import { Suspense } from "react"

type ServerProps = {
  episodes?: Episode[]
  episodeNumber: string
  animeResult: AnimeInfoResponse | null
  episodeId: string
  animeId: string
  anilistId: string
}

export default async function Server({
  episodes,
  animeResult,
  episodeId,
  animeId,
  episodeNumber,
  anilistId,
}: ServerProps) {
  const currentUser = await getCurrentUser()

  const checkBookmarkExist = currentUser?.bookMarks.some(
    (bookmark) =>
      bookmark.animeId === animeResult?.id && bookmark.userId === currentUser.id
  )

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <ButtonAction
          animeId={animeId}
          episodeId={episodeId}
          episodes={episodes}
          anilistId={anilistId}
        >
          <Suspense>
            <BookmarkForm
              userId={currentUser?.id}
              bookmarks={currentUser?.bookMarks}
              animeResult={animeResult}
              checkBookmarkExist={checkBookmarkExist}
              anilistId={anilistId}
            />
          </Suspense>
        </ButtonAction>
      </div>
      <div className="flex flex-col items-center gap-4 bg-[#111827] md:flex-row">
        <div className="w-full bg-secondary px-5 py-3 text-center text-sm md:w-80">
          You are watching
          <div className="font-semibold">Episode {episodeNumber}</div>
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
