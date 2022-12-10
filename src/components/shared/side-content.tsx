import React, { type ReactNode } from 'react';

export interface ISideContentProps {
  classes: string;
  title: string;
  info?: string | number | boolean | ReactNode;
}

const SideContent: React.FC<ISideContentProps> = ({ classes, title, info }) => {
  return (
    <li className={`${classes}`}>
      <div className="text-white">{title}</div>
      <div className="text-slate-300 italic text-[12px]">{info}</div>
    </li>
  );
};

export default SideContent;
