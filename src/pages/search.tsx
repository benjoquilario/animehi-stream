import TitleName from '@/components/shared/title-name';
import { IAnimeInfo, IAnimeResult, ISearch, META } from '@consumet/extensions';
import React, { useEffect, useState } from 'react';
import Pagination from '@/components/shared/pagination';
import DefaultLayout from '@/components/layouts/default';
import ResultsCard from '@/components/shared/results-card';

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
      <main className="mt-[104px] px-[3%]">
        <div className="flex flex-col space-y-6 md:grid grid-cols-1 md:gap-4">
          <div>
            <div className="flex justify-between w-full mb-4">
              <TitleName title={`Search results : ${query}`} />
              <Pagination
                className="p-1 md:p-2 text-[#ededed] hover:bg-background-900 rounded-full transition"
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                hasNextPage={results?.hasNextPage}
              />
            </div>
            <ResultsCard isLoading={isLoading} animeList={results?.results} />
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
};

Search.getInitialProps = ({ query }: { query: string }) => {
  return query;
};

export default Search;
