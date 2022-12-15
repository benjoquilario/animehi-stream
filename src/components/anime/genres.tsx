import React from 'react';
import { genreList } from '@/utils/config';

const Genres = () => {
  return (
    <div className="mt-3 w-full hidden xl:block">
      <div className="bg-[#100f0f] p-2">
        <h2 className="text-white text-base md:text-[20px] uppercase font-semibold">
          Genres
        </h2>
        <ul className="grid grid-cols-3 gap-1">
          {genreList.map((genre, index) => (
            <li className="text-sm p-1 text-white" key={index}>
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(Genres);
