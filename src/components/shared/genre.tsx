import React from 'react';
import Link from 'next/link';

type GenreProps = {
  genre: string;
};

const Genre = ({ genre }: GenreProps): JSX.Element => (
  <Link href={`/genre/${genre}`} passHref>
    <a className="text-uppercase transform rounded p-[2px] text-[12px] text-white transition duration-300 ease-out hover:scale-105">
      {genre}
    </a>
  </Link>
);

export default Genre;
