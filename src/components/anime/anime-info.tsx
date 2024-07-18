"use client"

import { Button } from "@/components/ui/button"
import NextImage from "@/components/ui/image"
import styles from "@/components/banner.module.css"
import { base64SolidImage, chunk, cn, stripHtml } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IAnilistInfo, ICharacter, type IEpisode } from "types/types"
import useEpisodes from "@/hooks/useEpisodes"
import { BsFillPlayFill } from "react-icons/bs"
import { useEffect, useMemo, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Episodes from "@/components/episode/episodes"
import Relations from "@/components/anime/relations"
import { Skeleton } from "@/components/ui/skeleton"
import { FaSpinner } from "react-icons/fa"
import Recommendations from "@/components/anime/recommendations"
import { env } from "@/env.mjs"
import useAnimeInfo from "@/hooks/useAnimeInfo"

export default function Anime({
  animeId,
  slug,
}: {
  animeId: string
  slug: string
}) {
  const { data: episodes, isLoading, isError } = useEpisodes(animeId)

  const { data: animeInfo, isLoading: loading } =
    useAnimeInfo<IAnilistInfo>(animeId)

  const router = useRouter()

  const animeTitle = useMemo(
    () => episodes?.[0]?.id.split?.("-episode-")[0] ?? slug,
    [episodes, slug]
  )

  return (
    <div className="overflow-hidden">
      <div className="relative z-0 h-[200px] w-full md:h-[400px]">
        <NextImage
          src={`${animeInfo?.cover ?? ""}`}
          alt={animeInfo?.title.english ?? animeInfo?.title.romaji ?? ""}
          fill
          style={{ objectFit: "cover" }}
          classnamecontainer="relative w-full h-full"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,$${base64SolidImage(animeInfo?.color ?? "")}`}
        />
        <div
          className={cn("absolute left-0 top-0 h-full w-full", styles.overlay)}
        ></div>
      </div>
      <div className="bg-background-700 grid grid-cols-1 justify-items-center gap-[20px] px-[4%] pb-7 md:grid-cols-[228px_1fr] md:gap-[18px]">
        <div className="h-auto w-[155px] min-w-[155px] md:w-full md:min-w-full">
          {loading ? (
            <Skeleton className="mt-[-88px] block h-[196px] w-full min-w-full md:mt-[-69px] md:h-[300px]" />
          ) : (
            <div className="mt-[-88px] block h-[196px] w-full min-w-full md:mt-[-69px] md:h-[300px]">
              <NextImage
                classnamecontainer="relative w-full min-w-full h-full"
                className="rounded-lg"
                style={{ objectFit: "cover" }}
                fill
                src={animeInfo?.image ?? ""}
                alt={animeInfo?.title.english ?? animeInfo?.title.romaji ?? ""}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,$${base64SolidImage(animeInfo?.color ?? "")}`}
              />
            </div>
          )}
        </div>
        <div className="z-10 flex w-full flex-col items-center gap-2 pt-4 md:items-start">
          {loading ? (
            <div className="flex flex-col items-center gap-2 pt-2 md:items-start">
              <Skeleton className="h-[22px] w-[70px]" />
              <Skeleton className="h-[36px] w-[200px]" />
              <Skeleton className="h-[24px] w-[154px]" />
            </div>
          ) : (
            <>
              <span className="text-sm text-muted-foreground/70">
                {animeInfo?.season} {animeInfo?.startDate.year}
              </span>
              <h1 className="text-2xl font-semibold md:text-3xl">
                {animeInfo?.title.english ?? animeInfo?.title.romaji}
              </h1>
              <h4 className="text-sm text-muted-foreground/80">
                {animeInfo?.title.romaji}
              </h4>
              <div className="flex items-center gap-4">
                <span>{animeInfo?.rating}%</span>
                <span>{animeInfo?.type}</span>
                <span>{animeInfo?.status}</span>
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
            <Button
              disabled={isLoading}
              variant="shine"
              onClick={() =>
                router.push(
                  `/watch/${animeTitle}/${animeId}?episode=${episodes?.length !== 0 ? episodes?.[episodes.length - 1]?.number : 1}`
                )
              }
            >
              <BsFillPlayFill className="h-6 w-6" />
              Watch Now
            </Button>
            <Button variant="outline">Add to List</Button>
          </div>
        </div>
      </div>
      <div className="px-[4%]">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="characters">Characters</TabsTrigger>
            <TabsTrigger value="relations">Relations</TabsTrigger>
          </TabsList>
          {loading ? (
            <div className="mt-4 flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Loading...
            </div>
          ) : (
            <>
              <TabsContent value="overview">
                <div className="mt-4">
                  <div>
                    <SectionTitle title="Overview" />
                    <p className="text-xs italic text-muted-foreground/80 md:text-sm">
                      {stripHtml(animeInfo?.description)}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {animeInfo?.genres.map((genre) => (
                        <span
                          key={genre}
                          className="rounded-sm border border-primary/90 p-2 text-xs uppercase"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 justify-between gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <InfoItem title="Type" value={animeInfo?.type} />
                    <InfoItem
                      title="Origin"
                      value={animeInfo?.countryOfOrigin}
                    />
                    <InfoItem title="Adult" value={`${animeInfo?.isAdult}`} />
                    <InfoItem
                      title="Licensed"
                      value={`${animeInfo?.isLicensed}`}
                    />
                    <InfoItem title="status" value={animeInfo?.status} />
                    <InfoItem
                      title="Release Date"
                      value={`${animeInfo?.releaseDate}`}
                    />
                    <InfoItem title="Rating" value={`${animeInfo?.rating}`} />
                    <InfoItem
                      title="Duration"
                      value={`${animeInfo?.duration}`}
                    />
                    <InfoItem
                      title="studios"
                      value={`${animeInfo?.studios.join(",")}`}
                    />
                    <InfoItem title="Season" value={animeInfo?.season} />
                    <InfoItem
                      title="Popularity"
                      value={`${animeInfo?.popularity}`}
                    />
                    <InfoItem
                      title="Date"
                      value={`${animeInfo?.startDate.month}/${animeInfo?.startDate.day}/${animeInfo?.startDate.year}`}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="characters">
                <div className="mt-4">
                  <SectionTitle title="Characters & Voice Actors" />
                  <div className="no-scrollbar grid max-h-96 grid-cols-1 gap-2 overflow-auto md:grid-cols-3">
                    {animeInfo?.characters.map((character) => (
                      <CharactersItem
                        key={character.id}
                        character={character}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="relations">
                <div className="mt-4">
                  <h2 className="mb-2 text-2xl font-medium">Relations</h2>

                  <Relations
                    relations={animeInfo?.relations ?? []}
                    animeId={animeId}
                  />
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      <div className="px-[4%]">
        <div className="mt-14">
          <SectionTitle title="Episodes" />

          {isError || episodes?.length === 0 ? (
            <div className="mt-4">
              <div>No Episode found</div>
            </div>
          ) : (
            <Episodes
              episodes={episodes}
              isLoading={isLoading}
              animeId={animeId}
              slug={slug}
              isWatching={false}
            />
          )}
        </div>
      </div>
      <div className="px-[4%]">
        <div className="mt-14">
          <SectionTitle title="Recommended for you" />

          {loading ? (
            <div className="grid grid-cols-3 gap-2 md:grid-cols-7">
              {Array.from(Array(7), (_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-[150px] w-[108px] md:h-[240px] md:w-[170px]" />
                  <Skeleton className="h-[40px] w-[108px] md:w-[170px]" />
                </div>
              ))}
            </div>
          ) : (
            <Recommendations recommendations={animeInfo?.recommendations} />
          )}
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="mb-2 flex pr-4 text-[15px] font-semibold md:text-2xl">
      <div className="mr-2 h-6 w-2 rounded-md bg-primary md:h-8"></div>
      {title}
    </h3>
  )
}

function InfoItem({ title, value }: { title?: string; value?: string }) {
  return (
    <div className="flex justify-between text-xs md:text-sm">
      <span className="font-medium capitalize">{title}</span>
      <span>{value}</span>
    </div>
  )
}

type CharactersItemProps = {
  character: ICharacter
}

function CharactersItem({ character }: CharactersItemProps) {
  return (
    <div className="overflow-hidden rounded-md bg-secondary/80 p-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <NextImage
            classnamecontainer="w-12 h-12 relative rounded-full"
            src={character.image ?? "/placeholder.png"}
            alt={
              character.name.userPreferred ??
              `${character.name.first} ${character.name.last}` ??
              character.name.full
            }
            fill
            className="rounded-full"
            style={{ objectFit: "cover" }}
          />
          <div className="flex flex-col gap-2">
            <h4 className="text-sm md:text-base">
              {character.name.userPreferred ??
                `${character.name.first} ${character.name.last}` ??
                character.name.full}
            </h4>
            <span className="text-sm text-muted-foreground/80">
              {character.role}
            </span>
          </div>
        </div>
        <div>
          <div className="flex flex-row-reverse gap-2">
            <NextImage
              classnamecontainer="w-12 h-12 relative rounded-full"
              src={
                character.voiceActors.length !== 0
                  ? character.voiceActors?.[0].image ??
                    "./placeholder.png" ??
                    ""
                  : "/placeholder.png"
              }
              alt={
                character.voiceActors.length !== 0
                  ? character.voiceActors?.[0].name.userPreferred ??
                    `${character.voiceActors?.[0].name.first} ${character.voiceActors?.[0].name.last}` ??
                    character.voiceActors?.[0].name.full ??
                    "No Name"
                  : ""
              }
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
            <div className="flex flex-col items-end gap-2">
              <h4 className="text-sm md:text-base">
                {character.voiceActors.length !== 0
                  ? character.voiceActors?.[0].name.userPreferred ??
                    `${character.voiceActors?.[0].name.first} ${character.voiceActors?.[0].name.last}` ??
                    character.voiceActors?.[0].name.full ??
                    "No Name"
                  : "No Name"}
              </h4>
              <span className="sr-only text-sm text-muted-foreground/80">
                char
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
