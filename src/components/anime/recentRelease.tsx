import useSWR from 'swr';
import Thumbnail from '@/components/shared/thumbnail';
import React, { useState, useEffect } from 'react';
import { EnimeType } from '@/src/../types/types';
import Pagination from '@/components/shared/pagination';
import TitleName from '@/components/shared/title-name';
import { ENIME_URL } from '@/lib/constant';

interface RecentResults {
  sources: {
    id: string;
    priority: number;
    subtitle: boolean;
    url: string;
    website: string;
  }[];
  createdAt: string;
  number: number;
  title: string;
  description: string;
  anime: EnimeType;
  image: string;
}

const RecentRelease = (): JSX.Element => {
  const [recent, setRecent] = useState<RecentResults[] | []>([]);
  const [pageNumber, setPageNumber] = useState(1);

  const fetcher = async (page: number) =>
    fetch(`${ENIME_URL}recent?page=${page}&perPage=12&language=JP`).then(res =>
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
          : recent?.map(
              ({
                anime,
                sources,
                number,
                description,
                image,
                title,
                createdAt,
              }) => (
                <Thumbnail
                  key={sources?.[0]?.id}
                  episodeNumber={number}
                  description={description}
                  data={anime}
                  isRecent={true}
                  image={anime.coverImage || anime.bannerImage}
                  episodePoster={
                    (image && `https://images.weserv.nl/?url=${image}`) ||
                    anime.bannerImage ||
                    anime.coverImage
                  }
                  episodeTitle={title}
                  episodeId={sources?.[0]?.id}
                  genres={anime.genre}
                  createdAt={createdAt}
                />
              )
            )}
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
