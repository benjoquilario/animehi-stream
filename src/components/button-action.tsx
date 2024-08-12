"use client"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { AiFillForward, AiFillBackward } from "react-icons/ai"

type ButtonActionProps = {
  anilistId: string
  lastEpisode: number
  latestEpisodeNumber: number
  isLoading: boolean
  animeTitle: string
  provider: string
}

const ButtonAction = ({
  anilistId,
  latestEpisodeNumber,
  isLoading,
  lastEpisode,
  animeTitle,
  provider,
}: ButtonActionProps) => {
  const router = useRouter()

  return (
    <>
      <Button
        onClick={() =>
          router.push(
            `/watch/${anilistId}?ep=${lastEpisode - 1}&provider=${provider}`
          )
        }
        size="sm"
        disabled={lastEpisode === 1 || isLoading}
        aria-label="previous episode"
        className="flex items-center gap-1 bg-background p-1 text-sm text-foreground transition-all hover:bg-background active:scale-[.98]"
      >
        <AiFillBackward className="h-5 w-5" aria-hidden />
        <span className="hidden md:block">Prev episode</span>
      </Button>
      <Button
        onClick={() => {
          router.push(
            `/watch/${anilistId}?ep=${lastEpisode + 1}&provider=${provider}`
          )
        }}
        size="sm"
        disabled={lastEpisode === latestEpisodeNumber || isLoading}
        aria-label="next episode"
        className="flex items-center gap-1 bg-background p-1 text-sm text-foreground transition-all hover:bg-background active:scale-[.98]"
      >
        <span className="hidden md:block">Next episode</span>
        <AiFillForward className="h-5 w-5" aria-hidden />
      </Button>
    </>
  )
}

export default ButtonAction
