import React from 'react';

type SideContentProps = {
  classes: string;
  title: string;
  info?: string | number | boolean | React.ReactNode;
};

const SideContent = (props: SideContentProps): JSX.Element => (
  <li className={`${props.classes}`}>
    <div className="text-white text-base">{props.title}</div>
    <div className="text-slate-300 italic text-sm">{props.info}</div>
  </li>
);

export default SideContent;
