import useSWR from 'swr';
import Thumbnail from './thumbnail';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';
import { IRecentResults } from '@/pages/index';
import { BASE_URL } from '@/utils/config';
import React, { useState, useEffect } from 'react';

export interface IRecentReleaseProps {
  title: string;
}

const RecentRelease: React.FC<IRecentReleaseProps> = ({ title }) => {
  const [recent, setRecent] = useState<IRecentResults[] | []>([]);
  const [pageNumber, setPageNumber] = useState(1);

  const fetcher = async (page: number) =>
    fetch(
      `${BASE_URL}/meta/anilist/recent-episodes?page=${page}&perPage=15`
    ).then(res => res.json());

  const { data, error } = useSWR([pageNumber], fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!data && !error) return;

    setRecent(data.results);
  }, [data, error, pageNumber]);

  return (
    <div>
      <div className="flex items-center justify-between text-white mb-4">
        <h2 className="text-base md:text-[20px] uppercase font-semibold">
          {title}
        </h2>
        <div className="flex gap-3 items-center">
          {pageNumber !== 1 ? (
            <button
              onClick={() => setPageNumber(pageNumber - 1)}
              className="p-1 md:p-2 text-[#ededed] hover:bg-[#111] rounded-full transition"
            >
              <AiOutlineArrowLeft className="h-6 w-6" />
            </button>
          ) : null}

          <button
            onClick={() => setPageNumber(pageNumber + 1)}
            className="p-1 md:p-2 text-[#ededed] hover:bg-[#111] rounded-full transition"
          >
            <AiOutlineArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div
        // ref={rowRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative overflow-hidden"
      >
        {recent?.map((anime, index) => (
          <Thumbnail
            key={index}
            id={anime?.id}
            episodeNumber={anime?.episodeNumber}
            image={anime?.image}
            title={anime?.title}
            episodeId={anime?.episodeId}
            color={anime?.color}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(RecentRelease);
