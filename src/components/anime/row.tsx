import { RecentResponseType } from '@/src/../types/types';
import { useRouter } from 'next/router';
import Thumbnail from './thumbnail';

// export interface RowProps {
//   animeList: RecentResponseType;
//   title: string;
//   isLoading: boolean;
// }

const Row = () => {
  const router = useRouter();

  return <div>Hello World!</div>;
};

export default Row;

/**
 * 
 * <div className="mb-4">
      <div className="flex items-center justify-between text-white mb-4">
        <h2 className="text-base md:text-[20px] uppercase font-semibold">
          {title}
        </h2>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => router.push(title)}
            className="p-1 md:p-2 text-[#ededed]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        // ref={rowRef}
        className="grid grid-cols-6 gap-2 relative ml-6 overflow-hidden"
      >
         {isLoading && <div>Loadding</div>}
        {animeList?.results?.slice(1, 13)?.map((anime, index) => (
          <Thumbnail animeList={anime} key={index} />
        ))}
      </div>
    </div>
 */
