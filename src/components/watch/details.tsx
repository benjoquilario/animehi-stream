import { useState } from 'react';
import { stripHtml } from '@/src/lib/utils/index';
import Image from '@/components/shared/image';
import { IAnimeInfo, IAnimeResult } from '@consumet/extensions';
import { TitleType } from 'types/types';

type WatchDetailsProps = {
  image: string;
  title: TitleType;
  description: string;
};

const WatchDetails = ({ image, title, description }: WatchDetailsProps) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <div className="col-span-full mt-3 ml-4 ">
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <Image
          layout="fill"
          objectFit="cover"
          src={`${image}`}
          alt={title?.romaji}
          className="rounded-md"
          containerclassname="relative h-[130px] w-[100px] md:h-[250px] md:w-[200px]"
        />
        <div className="text-white">
          <h1 className="mb-2 text-md md:text-3xl font-semibold text-white">
            {title?.english}
          </h1>
          <p className="leading-6 text-xs md:text-sm text-slate-300 font-extralight mt-2">
            {showMore
              ? stripHtml(description)
              : stripHtml(description?.substring(0, 415))}

            <button
              className="shadow-lg text-white text-xs p-1 transform transition duration-300 ease-out hover:scale-105"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? 'Show less' : 'Show more'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WatchDetails;
