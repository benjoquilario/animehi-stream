import React, { SVGProps } from 'react';

type IconProps = {
  icon: React.FC<SVGProps<any>>;
  text: string;
  className?: string;
};

const Icon = ({ icon, text, className }: IconProps): JSX.Element => {
  const HeroIcon = icon;
  return (
    <div className={`flex items-center space-x-1 ${className || ''}`}>
      <HeroIcon className="h-4 w-4" />
      <p className="text-xs sm:text-sm">{text}</p>
    </div>
  );
};

export default Icon;
