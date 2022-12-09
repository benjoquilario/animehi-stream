import React from 'react';

export interface IInfoItemProps {
  title: string;
  info: string;
}

const InfoItem: React.FC<IInfoItemProps> = ({ title, info }) => {
  return (
    <div className="text-gray-400">
      <p className="font-semibold">{title}</p>
      <p className="whitespace-pre-line flex flex-row md:flex-col gap-2">
        {info}
      </p>
    </div>
  );
};

export default InfoItem;
