import React, { SVGProps } from 'react';
import Link, { LinkProps } from 'next/link';

type NavLinksProps = {
  icon: React.FC<SVGProps<any>>;
  name: string;
  className?: string;
  iconClassName?: string;
} & LinkProps;

const NavLink = (props: NavLinksProps) => {
  const { icon, className, iconClassName, name, ...linkProps } = props;
  const Icon = icon;

  return (
    <li>
      <Link {...linkProps}>
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
