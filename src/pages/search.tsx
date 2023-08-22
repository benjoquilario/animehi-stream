import TitleName from "@/components/shared/title-name"
import { IAnimeInfo, IAnimeResult, ISearch, META } from "@consumet/extensions"
import React, { useEffect, useState } from "react"
import Pagination from "@/components/shared/pagination"
import DefaultLayout from "@/components/layouts/default"
import ResultsCard from "@/components/shared/results-card"

const Search = ({ query }: { query: string }) => {
  const anilist = new META.Anilist()
  const [results, setResults] = useState<ISearch<
    IAnimeResult | IAnimeInfo
  > | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    ;(async () => {
      const data: ISearch<IAnimeResult | IAnimeInfo> = await anilist.search(
        query,
        pageNumber,
        18
      )

      if (!query) return

      setResults(data)
      setIsLoading(false)
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, pageNumber])

  return (
    <DefaultLayout>
      <main className="mt-[104px] px-[3%]">
        <div className="flex grid-cols-1 flex-col space-y-6 md:grid md:gap-4">
          <div>
            <div className="mb-4 flex w-full justify-between">
              <TitleName title={`Search results : ${query}`} />
              <Pagination
                className="rounded-full p-1 text-[#ededed] transition hover:bg-background-900 md:p-2"
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
  )
}

Search.getInitialProps = ({ query }: { query: string }) => {
  return query
}

export default Search
