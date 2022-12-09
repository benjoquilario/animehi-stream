import React from 'react';
import Link from 'next/link';

export interface GenreProps {
  genre: string;
}

const Genre: React.FC<GenreProps> = ({ genre }) => {
  return (
    <Link href={`/genre/${genre}`} passHref>
      <a className="text-uppercase transform rounded p-[2px] text-[12px] text-white transition duration-300 ease-out hover:scale-105">
        {genre}
      </a>
    </Link>
  );
};

export default Genre;
