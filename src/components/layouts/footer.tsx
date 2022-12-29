import React from 'react';
import Image from '../shared/image';
import Link from 'next/link';
import logo from '../../../public/animehi.svg';
import h from '../../../public/h.png';
import { AiFillGithub } from 'react-icons/ai';
import { BiWorld } from 'react-icons/bi';
import { BsFacebook, BsTwitter } from 'react-icons/bs';

const LINKS = [
  {
    title: 'github',
    Icon: AiFillGithub,
    href: 'https://github.com/benjoquilario',
  },
  {
    title: 'my portfolio',
    Icon: BiWorld,
    href: 'https://benjoquilario.me/',
  },
  {
    title: 'facebook',
    Icon: BsFacebook,
    href: 'https://www.facebook.com/Benjo.Add07',
  },
  {
    title: 'twitter',
    Icon: BsTwitter,
    href: 'https://twitter.com/iam_benjo',
  },
];

const Footer = () => {
  return (
    <footer className="mt-20 px-[4%] py-8">
      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-center items-center gap-4 text-center">
          <Link href="/">
            <a className="flex items-center justify-center text-white ">
              <div className="flex">
                <Image
                  containerclassname="relative h-[20px] w-[20px] md:h-[24px] md:w-[24px]"
                  layout="fill"
                  src={logo}
                  alt="animehi"
                  priority
                />
                <Image
                  priority
                  containerclassname="relative h-[20px] w-[20px] md:h-[25px] md:w-[28px]"
                  layout="fill"
                  src={h}
                  alt="animehi"
                />
              </div>
              <span className="text-sm md:text-[20px] 2xl:[30px] font-semibold uppercase">
                AnimeHi
              </span>
            </a>
          </Link>
          <div className="flex gap-2">
            {LINKS.map(link => (
              <ContactItem
                key={link.title}
                title={link.title}
                Icon={link.Icon}
                href={link.href}
              />
            ))}
          </div>
          <p className="max-w-[850px] w-full text-slate-300 text-sm">
            ANIMEHI is not affiliated with or endorsed by any of the anime
            studios behind the creation of the anime presented on this site.
            This website is only an user interface presenting/linking various
            self-hosted files across the internet by other third-party providers
            for easy access.
          </p>
          <p className="text-slate-300 text-sm">
            © ANIMEHI 2022 | Built with Consumet and Enime API
          </p>
        </div>
      </div>
    </footer>
  );
};

interface ContactItemProps {
  Icon: React.ComponentType<any>;
  href: string;
  title: string;
}

const ContactItem = ({ Icon, href, title }: ContactItemProps): JSX.Element => (
  <a href={href} target="_blank" rel="noreferrer" aria-label={`go to ${title}`}>
    <Icon className="w-6 h-6 hover:text-[#6a55fa] text-white" />
  </a>
);

export default Footer;
