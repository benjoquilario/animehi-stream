"use client"

import NextImage from "@/components/ui/image"
import type { IRelationItem } from "types/types"
import { useMemo } from "react"
import Link from "next/link"
import { transformedTitle } from "@/lib/utils"

type RelationsProps = {
  relations: IRelationItem[]
  animeId: string
}

export const RELATION_TYPE = {
  ADAPTATION: "ADAPTATION",
  SIDE_STORY: "SIDE_STORY",
  SUMMARY: "SUMMARY",
  CHARACTER: "CHARACTER",
  OTHER: "OTHER",
  ALTERNATIVE: "ALTERNATIVE",
  PREQUEL: "PREQUEL",
  SEQUEL: "SEQUEL",
}

export default function Relations({ relations, animeId }: RelationsProps) {
  const alternative = useMemo(() => {
    const type = "ALTERNATIVE"
    return relations.filter((relation) => relation.relationType === type)
  }, [relations])

  const adaptation = useMemo(
    () =>
      relations.filter((relation) => relation.relationType === "ADAPTATION"),
    [relations]
  )

  const sideStory = useMemo(
    () =>
      relations.filter((relation) => relation.relationType === "SIDE_STORY"),
    [relations]
  )

  const character = useMemo(
    () =>
      relations.filter(
        (relation) => relation.relationType === RELATION_TYPE.CHARACTER
      ),
    [relations]
  )
  const other = useMemo(
    () =>
      relations.filter(
        (relation) => relation.relationType === RELATION_TYPE.OTHER
      ),
    [relations]
  )

  const sequel = useMemo(
    () =>
      relations.filter(
        (relation) => relation.relationType === RELATION_TYPE.SEQUEL
      ),
    [relations]
  )

  const prequel = useMemo(
    () =>
      relations.filter(
        (relation) => relation.relationType === RELATION_TYPE.PREQUEL
      ),
    [relations]
  )

  const summary = useMemo(
    () =>
      relations.filter(
        (relation) => relation.relationType === RELATION_TYPE.SUMMARY
      ),
    [relations]
  )

  return (
    <div className="no-scrollbar flex max-h-[450px] flex-col overflow-auto">
      <RelationWithType
        relationType={RELATION_TYPE.PREQUEL}
        relations={prequel}
      />
      <RelationWithType
        relationType={RELATION_TYPE.SEQUEL}
        relations={sequel}
      />
      <RelationWithType
        relationType={RELATION_TYPE.ADAPTATION}
        relations={adaptation}
      />
      <RelationWithType
        relationType={RELATION_TYPE.ALTERNATIVE}
        relations={alternative}
      />
      <RelationWithType
        relationType={RELATION_TYPE.SIDE_STORY}
        relations={sideStory}
      />
      <RelationWithType
        relationType={RELATION_TYPE.SUMMARY}
        relations={summary}
      />
      <RelationWithType
        relationType={RELATION_TYPE.CHARACTER}
        relations={character}
      />

      <RelationWithType relationType={RELATION_TYPE.OTHER} relations={other} />
    </div>
  )
}

type RelationWithTypeProps = {
  relationType: string
  relations: IRelationItem[]
}

function RelationWithType(props: RelationWithTypeProps) {
  const { relationType, relations } = props

  return relations.length !== 0 ? (
    <div className="mb-3 flex flex-col gap-3">
      <div className="mb-2">
        <h3 className="font-semibold underline underline-offset-8">
          {relationType}
        </h3>
      </div>

      {relations.map((relation) => (
        <div
          key={relation.id}
          className="grid w-full grid-cols-[64px_1fr] items-center gap-2 overflow-hidden rounded-md bg-secondary/90 hover:bg-secondary md:w-1/2 md:grid-cols-[80px_1fr]"
        >
          <NextImage
            src={relation.image}
            alt={
              relation.title.english ??
              relation.title.romaji ??
              relation.title.userPreferred
            }
            fill
            className="rounded-md"
            style={{ objectFit: "cover" }}
            containerclassname="relative h-20 w-16 md:h-24 md:w-20"
          />

          <div className="mt-2 flex flex-col self-start">
            <span className="font-semibold uppercase text-primary">
              {relation.relationType}
            </span>
            {relationType === RELATION_TYPE.PREQUEL || RELATION_TYPE.SEQUEL ? (
              <Link
                href={`/anime/${transformedTitle(relation.title.romaji)}/${relation.id}`}
              >
                <h5 className="line-clamp-2 text-sm font-semibold md:text-base">
                  {relation.title.english ??
                    relation.title.romaji ??
                    relation.title.userPreferred}
                </h5>
              </Link>
            ) : (
              <h5 className="line-clamp-2 text-sm font-semibold md:text-base">
                {relation.title.english ??
                  relation.title.romaji ??
                  relation.title.userPreferred}
              </h5>
            )}

            <div className="mt-3 flex gap-1 text-xs text-muted-foreground/60">
              <span>{relation.type}</span>
              <span>{relation.status}</span>
              <span>{relation.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : null
}
