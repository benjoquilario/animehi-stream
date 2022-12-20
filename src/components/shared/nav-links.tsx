import React, { SVGProps } from 'react';
import Link from 'next/link';

type NavLinksProps = {
  icon: React.FC<SVGProps<any>>;
  name: string;
  className?: string;
  iconClassName?: string;
};

const NavLink = ({ icon, name, className, iconClassName }: NavLinksProps) => {
  const Icon = icon;

  return (
    <li>
      <Link href={`/`}>
        <a className={className}>
          <span>
            <Icon className={iconClassName} />
          </span>
          <span>{name}</span>
        </a>
      </Link>
    </li>
  );
};

export default NavLink;
