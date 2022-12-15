import React from 'react';

type InfoItemProps = {
  title: string;
  info: string;
};

const InfoItem = ({ title, info }: InfoItemProps): JSX.Element => (
  <div className="text-gray-400">
    <p className="font-semibold">{title}</p>
    <p className="whitespace-pre-line flex flex-row md:flex-col gap-2">
      {info}
    </p>
  </div>
);

export default InfoItem;
