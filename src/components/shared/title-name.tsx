import React from 'react';

const TitleName = ({ title }: { title: string }): JSX.Element => {
  return (
    <h2 className="mb-2 text-white text-base md:text-[20px] uppercase font-semibold">
      {title}
    </h2>
  );
};

export default TitleName;
