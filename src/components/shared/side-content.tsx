import React, { type ReactNode } from 'react';

type SideContentProps = {
  classes: string;
  title: string;
  info?: string | number | boolean | ReactNode;
};

const SideContent = ({
  classes,
  title,
  info,
}: SideContentProps): JSX.Element => (
  <li className={`${classes}`}>
    <div className="text-white text-base">{title}</div>
    <div className="text-slate-300 italic text-sm">{info}</div>
  </li>
);

export default SideContent;
