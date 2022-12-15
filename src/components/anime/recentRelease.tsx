import useSWR from 'swr';
import Thumbnail from './thumbnail';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';
import { IRecentResults } from '@/pages/index';
import { BASE_URL } from '@/utils/config';
import React, { useState, useEffect } from 'react';

export type RecentReleaseProps = {
  title: string;
};

const RecentRelease = ({ title }: RecentReleaseProps): JSX.Element => {
  const [recent, setRecent] = useState<IRecentResults[] | []>([]);
  const [pageNumber, setPageNumber] = useState(1);

  const fetcher = async (page: number) =>
    fetch(
      `${BASE_URL}/meta/anilist/recent-episodes?page=${page}&perPage=10`
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
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative overflow-hidden"
      >
        {!data && !error
          ? Array.from(Array(10), (_, i) => <RecentLoading key={i} />)
          : recent?.map((anime, index) => (
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

const RecentLoading = () => (
  <div className="relatve flex flex-col animate-pulse">
    <div className="md:w-[174px] md:min-w-[174px] h-[205px] md:h-[220px] bg-[#141313] rounded-lg"></div>
    <div className="h-4 w-full bg-[#141313] rounded-lg mt-2"></div>
  </div>
);

export default React.memo(RecentRelease);
