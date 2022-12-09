import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

const Header = () => {
  return (
    <header
      className={classNames(
        'absolute top-0 left-0 w-full z-20 h-[48px] md:h-[60px] bg-[#0d0d0d]'
      )}
    >
      <div
        className={classNames(
          'flex items-center gap-4 h-[48px] md:h-[60px] px-[4%] bg-gradient-to-b from-[#000000b3] to-[#00000000]'
        )}
      >
        <Link href="/">
          <a className={classNames('flex items-center gap-2 text-white z-10')}>
            <svg
              width="25"
              height="25"
              viewBox="0 0 155 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M64.3429 85.8474H91.4313L60.6034 2.22174L97.834 2.61204L153.981 149.382H114.087L101.774 114.906H54L64.3429 85.8474Z"
                fill="#6A55FA"
                stroke="#6A55FA"
                strokeWidth="0.985034"
              />
              <path
                d="M1 148.5L59.5 2L77.5 50.5L41.5 148.5H1Z"
                fill="#2A2264"
                stroke="#2A2264"
              />
              <path
                d="M77 50.6756L59.4865 3L57.0541 9.8108L75.0541 56.9999L77 50.6756Z"
                fill="#151132"
                stroke="#151132"
                strokeWidth="0.972972"
              />
            </svg>
            <span className="text-sm md:text-[20px] font-semibold uppercase">
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
