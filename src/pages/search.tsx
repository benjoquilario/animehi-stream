import TitleName from '@/components/shared/title-name';
import { IAnimeInfo, IAnimeResult, ISearch, META } from '@consumet/extensions';
import React, { useEffect, useState } from 'react';
import Thumbnail from '@/components/shared/thumbnail';
import { TitleType } from 'types/types';
import Pagination from '@/components/shared/pagination';
import DefaultLayout from '@/components/layouts/default';

const Search = ({ query }: { query: string }) => {
  const anilist = new META.Anilist();
  const [results, setResults] = useState<ISearch<
    IAnimeResult | IAnimeInfo
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    (async () => {
      const data: ISearch<IAnimeResult | IAnimeInfo> = await anilist.search(
        query,
        pageNumber,
        18
      );

      if (!query) return;

      setResults(data);
      setIsLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, pageNumber]);

  return (
    <DefaultLayout>
      <main className="mt-[104px] px-[4%] md:px-[6%]">
        <div className="flex flex-col space-y-6 md:grid grid-cols-1 md:gap-4">
          <div>
            <div className="flex justify-between w-full mb-4">
              <TitleName title={`Search results : ${query}`} />
              <Pagination
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                hasNextPage={results?.hasNextPage}
              />
            </div>
            <div
              // ref={rowRef}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative overflow-hidden"
            >
              {isLoading
                ? Array.from(Array(12), (_, i) => <RecentLoading key={i} />)
                : results?.results?.map((anime, index) => (
                    <Thumbnail
                      key={index}
                      id={anime?.id}
                      image={anime?.image || anime?.cover}
                      title={anime?.title as TitleType}
                      color={anime?.color as string}
                      description={anime?.description as string}
                      genres={anime?.genres as string[]}
                      format={anime?.type}
                      popularity={anime?.popularity as number}
                      banner={anime?.cover || anime?.image}
                      isRecent={false}
                    />
                  ))}
            </div>
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
};

const RecentLoading = () => (
  <div className="relatve flex flex-col animate-pulse">
    <div className="md:w-[144px] md:min-w-[153px] h-[210px] md:h-[221px] bg-[#141313] rounded-lg"></div>
    <div className="h-4 w-full bg-[#141313] rounded-lg mt-2"></div>
  </div>
);

Search.getInitialProps = ({ query }: { query: string }) => {
  return query;
};

export default Search;
