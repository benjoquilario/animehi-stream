import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import logo from '../../../public/animehi.svg';
import h from '../../../public/h.png';
import Image from '../shared/image';

const Header = () => {
  return (
    <header
      className={classNames(
        'absolute top-0 left-0 w-full z-20 h-[48px] md:h-[60px] 2xl:h-[80px] bg-[#0d0d0d] bg-gradient-to-b from-[#000000b3] to-[#00000000]'
      )}
    >
      <div
        className={classNames(
          'flex items-center gap-4 h-[48px] md:h-[60px] 2xl:h-[80px] px-[4%]  mx-auto max-w-screen-2xl'
        )}
      >
        <Link href="/">
          <a className={classNames('flex items-center text-white z-10')}>
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
        {/* <nav className="z-10">
          <div
            className={`-z-10 md:z-10 relative md:bg-transparent w-full h-full flex justify-center flex-col md:flex-row items-center gap-4`}
          >
            <ul className="flex gap-2 md:gap-3 text-center py-3 md:p-0 rounded">
              <li className="text-[12px] md:text-[14px] text-[#e5e5e5]">
                <Link href="/tv">
                  <a>Shows</a>
                </Link>
              </li>
              <li className="text-[12px] md:text-[14px] text-[#e5e5e5]">
                <Link href="/movies">
                  <a>Movies</a>
                </Link>
              </li>
              <li className="text-[12px] md:text-[14px] text-[#e5e5e5]">
                <Link href="/mylist">
                  <a>My List</a>
                </Link>
              </li>
            </ul>
          </div>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
