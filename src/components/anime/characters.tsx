import { CharactersType } from "@/src/../types/types"
import React from "react"
import Image from "@/components/shared/image"
import { base64SolidImage } from "@/src/lib/utils/image"
import placeholder from "/public/placeholder.png"

export type CharactersProps = {
  characters: CharactersType[]
  color: string
}

const Characters = (props: CharactersProps): JSX.Element => (
  <div>
    <div className="relative grid h-full w-full grid-cols-fill-character gap-2 lg:grid-cols-2">
      {props.characters.slice(0, 10)?.map((character) => {
        return (
          <div
            key={character.id}
            className="flex h-[68px] w-full gap-4 rounded bg-background-700"
          >
            <div className="grid flex-1 grid-cols-[70px_auto] gap-3">
              <Image
                layout="fill"
                src={character?.image || placeholder}
                objectFit="cover"
                alt={character?.name.full}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                  props.color
                )}`}
                containerclassname="relative"
              />
              <div className="flex flex-col justify-evenly">
                <h3 className="text-xs text-white opacity-90 md:text-sm">
                  {character?.name.full}
                </h3>
                <p className="text-[8px] text-slate-300 md:text-[10px]">
                  {character?.role}
                </p>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-[auto_70px] gap-3 text-right">
              <div className="flex flex-col items-end justify-evenly">
                <h3 className="text-xs text-white opacity-90 md:text-sm">
                  {character?.voiceActors[0]?.name.full}
                </h3>
                <p className="text-[8px] text-slate-300 md:text-[10px]">
                  {character?.voiceActors[0]?.language}
                </p>
              </div>
              <Image
                layout="fill"
                src={character?.voiceActors[0]?.image || placeholder}
                objectFit="cover"
                alt={character?.voiceActors[0]?.name.full}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                  props.color
                )}`}
                containerclassname="relative"
              />
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

export default React.memo(Characters)
