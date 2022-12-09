import React from 'react';
import Image from 'next/image';
import { stripHtml } from '@/utils/index';
import useShowMore from '@/hooks/useShowMore';

const WatchDetails = ({ animeList }: any) => {
  const [showMore, toggleShowText] = useShowMore();

  return (
    <div className="mt-3 ml-4">
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <div className="relative h-[130px] w-[100px] md:h-[250px] md:w-[200px]">
          <Image
            layout="fill"
            objectFit="cover"
            src={animeList?.image}
            alt={animeList?.title?.romaji}
            className="rounded-md"
          />
        </div>
        <div className="text-white">
          <h1 className="mb-2 text-md md:text-3xl font-semibold text-white">
            {animeList?.title?.english}
          </h1>
          <p className="leading-6 text-xs md:text-sm text-gray-300 font-extralight mt-2">
            {showMore
              ? stripHtml(animeList?.description)
              : stripHtml(animeList?.description?.substring(0, 415))}

            <button
              className="shadow-lg text-white text-xs p-1 transform transition duration-300 ease-out hover:scale-105"
              onClick={() => toggleShowText}
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
