import React, { SVGProps } from 'react';
import classNames from 'classnames';

type IconProps = {
  icon: React.FC<SVGProps<any>>;
  text: string;
  className?: string;
  iconClassName?: string;
};

const Icon = ({
  icon,
  text,
  className,
  iconClassName,
}: IconProps): JSX.Element => {
  const HeroIcon = icon;
  return (
    <div className={`flex items-center space-x-1 ${className || ''}`}>
      <HeroIcon className={classNames('h-4 w-4', iconClassName)} />
      <p className="text-xs sm:text-sm">{text}</p>
    </div>
  );
};

export default Icon;
