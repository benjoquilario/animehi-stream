import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

type GenreProps = {
  genre: string;
  className?: string;
};

const Genre = ({ genre, className }: GenreProps): JSX.Element => (
  <Link href={`/genre/${genre}`} passHref>
    <a
      className={classNames(
        'text-uppercase transform rounded p-[2px] text-[12px] text-white transition duration-300 ease-out hover:scale-105',
        className
      )}
    >
      {genre}
    </a>
  </Link>
);

export default Genre;
