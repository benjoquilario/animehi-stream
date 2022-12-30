import useSWR from 'swr';
import Thumbnail from '@/components/shared/thumbnail';
import React, { useState, useEffect } from 'react';
import { EnimeType } from '@/src/../types/types';
import Pagination from '../shared/pagination';
import TitleName from '../shared/title-name';

interface RecentResults {
  sources: {
    id: string;
    priority: number;
    subtitle: boolean;
    url: string;
    website: string;
  }[];
  anime: EnimeType;
}

const RecentRelease = (): JSX.Element => {
  const [recent, setRecent] = useState<RecentResults[] | []>([]);
  const [pageNumber, setPageNumber] = useState(1);

  const fetcher = async (page: number) =>
    fetch(`https://api.enime.moe/recent?page=${page}&perPage=12`).then(res =>
      res.json()
    );

  const { data, error } = useSWR([pageNumber], fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (!data && !error) return;

    setRecent(data?.data);
  }, [pageNumber, error, data]);

  return (
    <div>
      <div className="flex items-center justify-between text-white">
        <TitleName title="Latest Releases" />
        <Pagination
          className="p-1 md:p-2 text-[#ededed] hover:bg-background-900 rounded-full transition"
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </div>
      <div
        // ref={rowRef}
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 relative overflow-hidden"
      >
        {!data && !error
          ? Array.from(Array(12), (_, i) => <RecentLoading key={i} />)
          : recent?.map(({ anime, sources }, index) => (
              <Thumbnail
                key={index}
                episodeNumber={anime.currentEpisode}
                data={anime}
                isRecent={true}
                image={anime.coverImage || anime.bannerImage}
                episodeId={sources?.[0]?.id}
                genres={anime.genre}
              />
            ))}
      </div>
    </div>
  );
};

const RecentLoading = () => (
  <div className="relatve flex flex-col animate-pulse">
    <div className="md:w-[187px] md:min-w-[187px] lg:w-[155px] lg:min-w-[155px] 2xl:w-[180px] 2xl:min-w-[180px] h-[160px] min-h-[160px] md:h-[210px] md:min-h-[221px] bg-[#141313] rounded-lg"></div>
    <div className="h-4 w-full bg-[#141313] rounded-lg mt-2"></div>
  </div>
);

export default React.memo(RecentRelease);
