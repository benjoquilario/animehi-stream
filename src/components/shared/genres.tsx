import React from 'react';
import Genre from './genre';

const Genres  = ({genres}: {genres: string[]}) => {
  return genres?.map((genre: string) => (
    <div className="flex items-center gap-2" key={genre}>
      <Genre genre={genre} className="text-base" />
      <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block"></span>
    </div>
  ));
}

export default Genres 