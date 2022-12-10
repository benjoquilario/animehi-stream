import Image from 'next/image';
import { CharactersType } from '@/src/../types/types';

export interface CharactersProps {
  characters: CharactersType[];
}

const Characters: React.FC<CharactersProps> = ({ characters }) => (
  <div className="w-full h-full mt-4">
    <h3 className="text-white text-md mb-3">Characters & Voice Actors</h3>
    <ul className="relative grid grid-cols-fill-character lg:grid-cols-2 gap-1 w-full h-full">
      {characters.slice(0, 10)?.map((character, index) => {
        return (
          <li
            key={index}
            className="bg-[#100f0f] flex w-full h-[64px] rounded gap-4"
          >
            <div className="flex-1 grid grid-cols-[70px_auto] gap-3">
              <div className="relative">
                <Image
                  priority
                  layout="fill"
                  src={character?.image}
                  objectFit="cover"
                  alt={character?.name.full}
                />
              </div>

              <div className="flex justify-evenly flex-col">
                <h3 className="text-[9px] md:text-[11px] text-white opacity-90">
                  {character?.name.full}
                </h3>
                <p className="text-[8px] md:text-[10px] text-slate-300">
                  {character?.role}
                </p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-[auto_70px] gap-3 text-right">
              <div className="flex justify-evenly flex-col items-end">
                <h3 className="text-[9px] md:text-[11px] text-white opacity-90">
                  {character?.voiceActors[0]?.name.full}
                </h3>
                <p className="text-[8px] md:text-[10px] text-slate-300">
                  {character?.voiceActors[0]?.language}
                </p>
              </div>
              <div className="relative">
                <Image
                  priority
                  layout="fill"
                  src={character?.voiceActors[0]?.image}
                  objectFit="cover"
                  alt={character?.voiceActors[0]?.name.full}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

export default Characters;
