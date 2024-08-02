"use client"

import EpisodeCard from "./episode-card"
import Section from "./section"
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { useState, useEffect } from "react"
import { fetchRecentEpisodes } from "@/lib/cache"

export default function RecentEpisodes() {
  const [pageNumber, setPageNumber] = useState(1)
  const [state, setState] = useState({
    recentsAnime: [] as IRecents[],
    loading: {
      recents: true,
    },
    error: null as string | null,
  })

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        setState((prevState) => ({ ...prevState, error: null }))
        const recents = await fetchRecentEpisodes(pageNumber, 20)

        if (isMounted && recents) {
          setState((prevState) => ({
            ...prevState,
            recentsAnime: recents,
          }))
        }
      } catch (fetchError) {
        setState((prevState) => ({
          ...prevState,
          error: "An unexpected error occurred",
        }))
      } finally {
        setState((prevState) => ({
          ...prevState,
          loading: {
            recents: false,
          },
        }))
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [pageNumber])

  if (state.error) {
    return (
      <Section sectionName="recent">
        <div>
          <h3 className="flex w-full pb-6 pt-2.5 text-left text-[15px] font-semibold md:text-2xl">
            <div className="mr-2 h-6 w-2 rounded-md bg-primary md:h-8"></div>
            Recently Updated
          </h3>
        </div>
        <div>Failed to fetch Recently updated</div>
      </Section>
    )
  }

  return (
    <Section sectionName="recent">
      <div className="flex items-center justify-between">
        <h3 className="flex w-full pb-6 pt-2.5 text-left text-[15px] font-semibold md:text-2xl">
          <div className="mr-2 h-6 w-2 rounded-md bg-primary md:h-8"></div>
          Recently Updated
        </h3>
        <div className="flex items-center gap-3">
          {pageNumber !== 1 ? (
            <Button
              variant="ghost"
              onClick={() => setPageNumber(pageNumber - 1)}
              aria-label="previous page"
              size="icon"
            >
              <AiOutlineArrowLeft className="h-4 w-4" />
            </Button>
          ) : null}

          <Button
            variant="ghost"
            onClick={() => setPageNumber(pageNumber + 1)}
            aria-label="next page"
            size="icon"
          >
            <AiOutlineArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ul className="relative grid grid-cols-3 gap-3 overflow-hidden md:grid-cols-4 lg:grid-cols-5">
        {state.loading.recents
          ? Array.from(Array(20), (_, i) => (
              <div className="flex flex-col gap-2" key={i + 1}>
                <Skeleton className="h-[150px] w-[112px] md:h-[260px] md:w-[185px]" />
                <Skeleton className="h-[30px] w-[112px] md:w-[185px]" />
              </div>
            ))
          : state.recentsAnime?.map((result) => (
              <li
                key={result.id}
                className="col-span-1 overflow-hidden rounded-md"
              >
                <EpisodeCard animeResult={result} />
              </li>
            ))}
      </ul>
    </Section>
  )
}
