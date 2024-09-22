"use client"

import React, { useCallback, useEffect, useState, useRef, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import SelectFilter from "@/components/browse/select"
import {
  formatOptions,
  seasonOptions,
  sortOptions,
  statusOptions,
  yearOptions,
} from "@/config/site"
import { transformedTitle } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { IAdvancedInfo } from "types/types"
import { InView } from "react-intersection-observer"
import NextImage from "@/components/ui/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchAdvanceSearch } from "@/lib/client"

import { useDebounce } from "@/hooks/useDebounce"

const Browse = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  // const currentSeason = getSeason()
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // const genresParam = searchParams.get("genres")
  // const initialGenres = genresParam
  //   ? genresParam.split(",").map((value) => ({ value, label: value }))
  //   : []

  const filters = {
    query: searchParams.get("query") || "",
    seasons: searchParams.get("season") || "",
    format: searchParams.get("format") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || `POPULARITY_DESC`,
    year: searchParams.get("year") || "",
  }

  const updateSearchParams = ({
    title,
    value,
  }: {
    title: string
    value: string
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === undefined) {
      params.delete(title)
    } else {
      params.set(title, value)
    }

    const url = `${pathname}?${params.toString()}`
    router.push(url, { scroll: false })
  }

  const [animeData, setAnimeData] = useState<IAdvancedInfo[]>([])
  const [hasNextPage, setHasNextPage] = useState(false)
  const delayTimeout = useRef<number | null>(null)
  const debouncedQuery = useDebounce(filters.query, 300)

  const fetchInitialAdvanceSearch = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchAdvanceSearch(debouncedQuery, page, 20, {
        status: filters.status,
        year: filters.year,
        format: filters.format,
        season: filters.seasons,
        sort: [filters.sort],
      })
      setAnimeData(page === 1 ? data.results : [...animeData, ...data.results])
      setHasNextPage(data.hasNextPage)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.format,
    filters.seasons,
    filters.sort,
    filters.status,
    filters.year,
    page,
    debouncedQuery,
  ])

  console.log(page)

  useEffect(() => {
    if (delayTimeout.current !== null) clearTimeout(delayTimeout.current)

    delayTimeout.current = window.setTimeout(() => {
      fetchInitialAdvanceSearch()
    }, 100)

    return () => {
      if (delayTimeout.current !== null) clearTimeout(delayTimeout.current)
    }
  }, [fetchInitialAdvanceSearch])

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  return (
    <div className="mt-3 px-[2%]">
      <div className="grid grid-cols-4 gap-2">
        <Input
          onChange={(event) =>
            updateSearchParams({ title: "query", value: event.target.value })
          }
          placeholder="Search..."
          className="col-span-4 md:col-span-1"
        />
        <SelectFilter
          value={filters.year}
          onChange={(event) =>
            updateSearchParams({ title: "year", value: event })
          }
          className="col-span-4 md:col-span-1"
          label="Years"
          options={yearOptions}
        />
        <SelectFilter
          value={filters.seasons}
          onChange={(event) =>
            updateSearchParams({ title: "season", value: event })
          }
          className="col-span-2 md:col-span-1"
          label="Seasons"
          options={seasonOptions}
        />
        <SelectFilter
          value={filters.format}
          onChange={(event) =>
            updateSearchParams({ title: "format", value: event })
          }
          className="col-span-2 md:col-span-1"
          label="Format"
          options={formatOptions}
        />
        <SelectFilter
          value={filters.status}
          onChange={(event) =>
            updateSearchParams({ title: "status", value: event })
          }
          className="col-span-2 md:col-span-1"
          label="Status"
          options={statusOptions}
        />
        <SelectFilter
          value={filters.sort}
          onChange={(event) =>
            updateSearchParams({ title: "sort", value: event })
          }
          className="col-span-2 md:col-span-1"
          label="Sort"
          options={sortOptions}
        />
        {/* <MultiSelector
          values={filters.genres.map((g) => g)}
          onValuesChange={(event) =>
            updateSearchParams({
              title: "genres",
              value: event.map((g) => g).join(","),
            })
          }
          loop={false}
          className="w-full"
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput placeholder="Genres" />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {genreOptions.map((genre) => (
                <MultiSelectorItem key={genre.value} value={genre.value}>
                  {genre.value}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector> */}
      </div>
      <ul className="relative mt-4 grid grid-cols-3 gap-3 overflow-hidden md:grid-cols-5 lg:grid-cols-7">
        {(isLoading && page === 1) ||
        (isLoading && page === 1 && animeData.length === 0)
          ? Array.from(Array(12), (_, i) => (
              <li
                className="col-span-1 flex flex-col gap-2 overflow-hidden rounded-md"
                key={i + 1}
              >
                <Skeleton className="h-[150px] w-[112px] md:h-[260px] md:w-[185px]" />
                <Skeleton className="h-[30px] w-[112px] md:w-[185px]" />
              </li>
            ))
          : animeData?.map((anime) => (
              <li className="col-span-1 overflow-hidden rounded-md">
                <div className="relative mb-2 w-full overflow-hidden rounded-md pb-[140%]">
                  <div className="absolute h-full w-full">
                    <NextImage
                      classnamecontainer="relative"
                      style={{ objectFit: "cover" }}
                      src={anime.image}
                      alt={anime.title.english ?? anime.title.romaji}
                      width={180}
                      height={200}
                      className="relative h-full w-full"
                    />
                  </div>
                  <Link
                    href={`/anime/${transformedTitle(anime.title.romaji)}/${anime.id}`}
                    aria-label={`${anime.id}`}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 text-primary opacity-0 transition-opacity hover:opacity-100"
                  >
                    <div className="absolute bottom-0 z-30 h-1/4 w-full bg-gradient-to-t from-background/80 from-25% to-transparent transition-all duration-300 ease-out group-hover:to-background/40"></div>
                  </Link>
                </div>
                <div>
                  <h3
                    title={anime.title.english ?? anime.title.romaji}
                    className="line-clamp-2 text-center text-xs font-medium leading-5 md:text-sm"
                  >
                    {anime.title.english ?? anime.title.romaji}
                  </h3>
                </div>
              </li>
            ))}
      </ul>

      <InView
        fallbackInView
        onChange={(InView) => {
          if (InView && hasNextPage && !isLoading) {
            handleLoadMore()
          }
        }}
      >
        {({ ref }) => (
          <div
            ref={ref}
            className="col-span-1 mt-4 w-full overflow-hidden rounded-md"
          >
            {isLoading && (
              <div className="relative mt-4 grid grid-cols-3 gap-4 overflow-hidden md:grid-cols-5 lg:grid-cols-7">
                {Array.from(Array(12), (_, i) => (
                  <div className="flex flex-col gap-2" key={i + 1}>
                    <Skeleton className="h-[150px] w-[112px] md:h-[260px] md:w-[175px]" />
                    <Skeleton className="h-[25px] w-[112px] md:w-[175px]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </InView>
    </div>
  )
}

export default Browse
