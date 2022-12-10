import Image from 'next/image';
import Link from 'next/link';
import { TitleType } from '@/src/../types/types';
import classNames from 'classnames';
import { colorNumber } from '@/utils/color';
import { base64SolidImage } from '@/utils/image';

interface PopularItemProps {
  rank: number;
  image?: string;
  title: TitleType;
  type?: string;
  releaseDate?: string | number;
  status?: string;
  animeId?: string;
}

const PopularItem: React.FC<PopularItemProps> = ({
  rank,
  image,
  title,
  type,
  releaseDate,
  status,
  animeId,
}) => {
  return (
    <li className="relative overflow-unset p-[1px]">
      <Link href={`/anime/${animeId}`}>
        <a className="flex gap-2 pl-4 py-2 pr-3 hover:bg-[#000] transition">
          <div
            style={{ borderColor: colorNumber(rank) }}
            className={classNames(
              'text-white text-2xl font-bold mr-5 border-b-2 border-solid'
            )}
          >
            {rank}
          </div>
          <div className="relative h-[52px] w-[43px]">
            <Image
              src={image || ''}
              priority
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                '#6A55FA'
              )}`}
              alt={`Anime - ${title.english || title.romaji}`}
            />
          </div>
          <div>
            <h3 className="text-white text-[14px]">
              {title.english || title.romaji}
            </h3>
            <div className="text-white text-slate-300 text-xs flex gap-1 items-center">
              <span>{type}</span>
              <span className="w-1.5 h-1.5 bg-[#6a55fa] rounded-full inline-block"></span>
              <span>{releaseDate}</span>
              <span className="w-1.5 h-1.5 bg-[#6a55fa] rounded-full inline-block"></span>
              <span>{status}</span>
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
};

export default PopularItem;
