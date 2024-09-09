"use client"

import { IRelationItem } from "types/types"
import { RELATION_TYPE } from "@/components/anime/relations"
import Link from "next/link"
import { transformedTitle } from "@/lib/utils"

const RelationWatch = ({ relations }: { relations: IRelationItem[] }) => {
  const sequels = relations.filter(
    (relation) => relation.relationType === RELATION_TYPE.SEQUEL
  )

  const prequels = relations.filter(
    (relation) => relation.relationType === RELATION_TYPE.PREQUEL
  )

  if (sequels.length === 0 && prequels.length === 0) return <></>

  return (
    <div className="my-4 rounded-md px-[2%] lg:px-0">
      <div className="text-sm uppercase md:text-lg">seasons</div>

      <div className="mt-4 flex flex-col flex-wrap justify-center gap-2 bg-secondary p-4 md:flex-row">
        {prequels.map((prequel) => (
          <Relation key={prequel.id} relation={prequel} />
        ))}

        {sequels.map((sequel) => (
          <Relation key={sequel.id} relation={sequel} />
        ))}
      </div>
    </div>
  )
}

const Relation = ({ relation }: { relation: IRelationItem }) => (
  <Link
    className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-md bg-cover bg-center bg-no-repeat p-3 text-center transition-all hover:scale-105 md:h-28 md:w-[26rem]"
    href={`/anime/${transformedTitle(relation.title.romaji)}/${relation.id}`}
    style={{ backgroundImage: `url(${relation.cover})` }}
  >
    <span className="absolute inset-0 z-10 bg-black/60"></span>
    {/* <Image
      containerclassname="h-[3rem] w-[7rem]"
      fill
      style={{ objectFit: "cover" }}
      src={`${relation.cover ?? relation.image}`}
      alt={relation.title.english ?? relation.title.romaji}
    /> */}
    <div className="relative z-20 flex flex-col gap-0.5">
      <div>{relation.relationType}</div>
      <div>{relation.title.english ?? relation.title.romaji}</div>
    </div>
  </Link>
)

export default RelationWatch
