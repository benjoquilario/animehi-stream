import React, { useState, useEffect, useRef, useMemo } from 'react';
import { META } from '@consumet/extensions';
import { IAnimeResult } from '@consumet/extensions/dist/models/types';
import Link from 'next/link';
import classNames from 'classnames';
import logo from '../../../public/animehi.svg';
import h from '../../../public/h.png';
import Image from '../shared/image';
import { FaRandom } from 'react-icons/fa';
import {
  AiOutlineFileSearch,
  AiFillHome,
  AiOutlineSearch,
  AiOutlineArrowRight,
} from 'react-icons/ai';
import { BsList } from 'react-icons/bs';
import NavLink from '../shared/nav-links';
import Button from '../shared/button';
import Input from '../shared/input';
import { debounce } from 'lodash';
import ColumnSection from '../shared/column-section';
import { TitleType } from 'types/types';
import { isMobile } from 'react-device-detect';
import useClickOutside from '@/hooks/useClickOutside';

const LINKS = [
  {
    href: '/',
    name: 'Home',
    icon: AiFillHome,
    className: 'flex gap-1 items-center hover:text-white transition text-sm',
  },
  {
    href: '/',
    name: 'Random',
    icon: FaRandom,
    className: 'flex gap-1 items-center hover:text-white transition text-sm',
  },
  {
    href: '/watchlist',
    name: 'Watch List',
    icon: BsList,
    className: 'flex gap-1 items-center hover:text-white transition text-sm',
  },
];

const Header = () => {
  const anilist = new META.Anilist();
  const [isFixed, setIsFixed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [searchResults, setSearchResults] = useState<IAnimeResult[] | []>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const doc = document.documentElement;

    let currScroll: number;
    let prevScroll = window.scrollY || doc.scrollTop;
    let currDirection = 0;
    let prevDirection = 0;

    let threshold = 200;
    let toggle: boolean;

    const toggleHeader = () => {
      if (currDirection === 2 && currScroll > threshold) setIsFixed(true);
      else if (currDirection === 1) setIsFixed(false);
      else toggle = false;

      return toggle;
    };

    const checkScroll = () => {
      currScroll = window.scrollY || doc.scrollTop;

      if (currScroll > prevScroll) currDirection = 2;
      else currDirection = 1;

      if (currDirection !== prevDirection) toggle = toggleHeader();
      if (toggle) prevDirection = currDirection;

      prevScroll = currScroll;
    };

    window.addEventListener('scroll', checkScroll);

    return () => window.removeEventListener('scroll', checkScroll);
  });

  useEffect(() => {
    searchRef?.current?.focus();
  }, [isSearchOpen]);

  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      const search = await anilist.search(query, 1, 6);

      if (!query) return;

      setResultsOpen(true);
      setSearchResults(search.results);
    }, 350)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    debouncedSearch(event.target.value);
    setQuery(event.target.value);
  };

  useClickOutside(ref, () => setResultsOpen(false));

  return (
    <header
      className={classNames(
        'fixed left-0 w-full z-50 h-[52px] md:h-[67px] 2xl:h-[80px] bg-background-800 bg-gradient-to-b from-[#000000b3] to-[#00000000] transition-all',
        isFixed ? 'top-[-56px]' : 'top-0'
      )}
    >
      <div className="flex items-center gap-4 h-[52px] md:h-[67px] 2xl:h-[80px] px-[3%] w-full mx-auto max-w-screen-2xl">
        <Link href="/">
          <a className="flex items-center text-white z-10">
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
        <div
          className={classNames(
            'absolute top-[52px] left-0 md:relative md:top-0 w-full xl:block',
            isSearchOpen ? 'block' : 'hidden'
          )}
        >
          <div
            ref={ref}
            className="relative w-full bg-background-900 p-2 rounded-none md:rounded-lg"
          >
            <form>
              <div className="grid grid-cols-[34px_1fr] items-center">
                <Link href={`/search?query=${query}`}>
                  <a>
                    <Button
                      type="submit"
                      className="text-slate-300 flex justify-center items-center"
                      aria-label="submit anime search"
                    >
                      <AiOutlineSearch className="h-6 w-6" />
                    </Button>
                  </a>
                </Link>

                <Input
                  type="search"
                  ref={searchRef}
                  placeholder="Search anime..."
                  className="w-full"
                  onChange={handleInputChange}
                  label="Search Anime"
                  labelClassName="sr-only"
                  aria-label="search anime"
                />
              </div>
            </form>

            {resultsOpen && !isMobile ? (
              <div className="absolute top-[40px] left-0 w-full rounded-lg">
                <ul className="w-full">
                  {searchResults?.map(result => (
                    <ColumnSection
                      key={result.id}
                      animeId={result.id}
                      image={result.image}
                      type={result.type}
                      status={result.status}
                      releaseDate={result.releaseDate}
                      title={result.title as TitleType}
                      color={result.color as string}
                      isGenres={false}
                      className="h-20"
                    />
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <nav className="w-5/6 hidden md:block">
          <div>
            <ul className="text-slate-300 flex gap-4">
              {LINKS.map((link, index) => (
                <NavLink
                  key={index}
                  href={link.href}
                  name={link.name}
                  icon={link.icon}
                  className={link.className}
                />
              ))}
            </ul>
          </div>
        </nav>
        <div className="w-full md:w-1/6 flex justify-end">
          <div>
            <ul className="text-white flex gap-2 items-center text-sm md:text-base">
              <li className="block md:hidden">
                <Button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-slate-300 flex justify items-center"
                  aria-label="open search"
                >
                  <AiOutlineSearch className="h-6 w-6" />
                </Button>
              </li>
              <li>
                <Button
                  type="button"
                  className="flex items-center justify-center bg-[#6a55fa] h-8 md:h-9 w-20 rounded-md"
                  aria-label="click to sign in"
                >
                  <span>Sign in</span>
                  <span>
                    <AiOutlineArrowRight />
                  </span>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
