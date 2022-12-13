import React, { Fragment, useState, useMemo } from 'react';
import { NextSeo } from 'next-seo';
import { META } from '@consumet/extensions';
import Link from 'next/link';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { IAnimeInfo } from '@consumet/extensions/dist/models';
import Header from '@/components/header/header';
import progressBar from '@/components/shared/loading';
import { base64SolidImage } from '@/utils/image';
import Genre from '@/components/shared/genre';
import { stripHtml } from '@/utils/index';
import classNames from 'classnames';
import InfoItem from '@/components/shared/info-item';
import EpisodesButton from '@/components/watch/episodes-button';
import Characters from '@/components/anime/characters';
import { PlayIcon } from '@heroicons/react/outline';
import SideContent from '@/components/shared/side-content';
import useEpisodes from '@/hooks/useEpisodes';
import Image from '@/components/shared/image';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params!.id;

  const anilist = new META.Anilist();

  const data: IAnimeInfo = await anilist.fetchAnilistInfoById(id as string);

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      animeList: JSON.parse(JSON.stringify(data)),
    },
  };
};

const Anime = ({
  animeList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  const { episodes, isLoading, isError } = useEpisodes(animeList?.id);

  const lastEpisodes = useMemo(() => {
    if (!isLoading) {
      return episodes[episodes?.length - 1].id;
    }
  }, [episodes, isLoading]);

  return (
    <Fragment>
      <NextSeo
        title={`${
          animeList?.title.romaji || animeList.title.english
        } | AnimeHI`}
        description={animeList?.description}
        openGraph={{
          images: [
            {
              type: 'large',
              url: `${animeList?.cover}`,
              alt: `Banner Image for ${
                animeList?.title?.english || animeList?.title?.romaji
              }`,
            },
            {
              type: 'small',
              url: `${animeList?.cover}`,
              alt: `Cover Image for ${
                animeList?.title?.english || animeList?.title?.romaji
              }`,
            },
          ],
        }}
      />
      <div className="min-h-screen bg-[#000]">
        <div className="overflow-hidden">
          <Header />
          <div className="relative z-0 w-full h-[200px] md:h-[400px]">
            <Image
              src={animeList?.cover ?? undefined}
              alt={animeList?.title?.romaji}
              layout="fill"
              placeholder="blur"
              onLoadingComplete={progressBar.finish}
              blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                animeList?.color as string
              )}`}
              // className="blur-sm w-full h-full"
              objectFit="cover"
              containerclassname="relative w-full h-full"
            />

            <div className="absolute top-0 left-0 bg-banner-shadow h-full w-full"></div>
          </div>
          <div className="bg-[#100f0f] px-[12px] md:px-[40px] grid grid-cols-1 justify-items-center gap-[70px] md:grid-cols-[228px_1fr] md:gap-[18px] pb-7">
            <div className="min-w-[170px] w-[170px] h-auto">
              <div className="min-w-[170px] w-[170px] h-[216px] block mt-[-88px] md:mt-[-69px] md:min-w-[200px] md:w-[200px] md:h-[300px]">
                <Image
                  containerclassname="relative w-full min-w-full h-full"
                  className="rounded-lg"
                  objectFit="cover"
                  layout="fill"
                  onLoadingComplete={progressBar.finish}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${base64SolidImage(
                    animeList?.color as string
                  )}`}
                  src={animeList?.image}
                  alt={animeList?.title?.english || animeList?.title?.romaji}
                />
              </div>
            </div>
            <div className="grid auto-rows-min text-white py-4 w-full z-10 mt-[-69px]">
              <div className="flex items-center flex-wrap gap-2 mb-7">
                <Link href={`/watch/${animeList.id}?episode=${lastEpisodes}`}>
                  <a>
                    <button
                      type="button"
                      style={{
                        backgroundColor: `${animeList?.color || '#000'}`,
                      }}
                      className={`transition duration-300 text-base flex items-center space-x-2 px-3 py-2 rounded-md gap-x-1 hover:opacity-80`}
                    >
                      <div className="h-5 w-5 text-white">
                        <PlayIcon />
                      </div>
                      <p className="text-sm">Watch Now</p>
                    </button>
                  </a>
                </Link>
              </div>
              <h1
                style={{ color: `${animeList?.color}` }}
                className="mb-2 text-2xl md:text-3xl font-semibold"
              >
                {animeList?.title.english}
              </h1>
              <div className="mr-2 flex flex-wrap gap-2 mt-2">
                {animeList?.genres.map((genre: string) => (
                  <div className="flex items-center gap-2" key={genre}>
                    <Genre genre={genre} />
                    <span
                      style={{
                        backgroundColor: `${animeList?.color || '#000'}`,
                      }}
                      className={`w-1.5 h-1.5 rounded-full inline-block`}
                    ></span>
                  </div>
                ))}
              </div>
              <p className="leading-6 text-xs md:text-sm line-clamp-1 text-gray-400 font-extralight mt-2">
                {showMore
                  ? stripHtml(animeList?.description)
                  : stripHtml(animeList?.description.substring(0, 415))}

                <button
                  className="shadow-lg text-white text-xs p-1 transform transition duration-300 ease-out hover:scale-105"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? 'Show less' : 'Show more'}
                </button>
              </p>
              <div className="hidden md:flex flex-row gap-x-8 overflow-x-auto md:gap-x-16 [&>*]:shrink-0 mt-4">
                <InfoItem
                  title="Country"
                  info={`${animeList?.countryOfOrigin}`}
                />
                <InfoItem
                  title="Total episodes"
                  info={`${animeList?.totalEpisodes}`}
                />
                <InfoItem
                  title="Duration"
                  info={`${animeList?.duration} minutes`}
                />
                <InfoItem title="Status" info={`${animeList?.status}`} />
              </div>
            </div>
          </div>
          <div className="px-[12px] md:px-[40px] grid grid-cols-none md:grid-cols-[238px_auto] md:mt-[20px] md:gap-[18px]">
            <div className="block">
              <div className="bg-[#100f0f] my-2 p-3 rounded">
                <p className="text-slate-300 text-xs">Score: 9.12</p>
              </div>
              <div className="bg-[#100f0f] my-2 p-3 rounded">
                <p className="text-slate-300 text-xs">Popularity: 707</p>
              </div>
              <div className="bg-[#100f0f] my-2 p-3 rounded">
                <ul className="grid grid-cols-2  w-full md:grid-cols-1">
                  <SideContent
                    classes="text-xs mb-3"
                    title="Romaji"
                    info={animeList?.title?.romaji}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="English"
                    info={animeList?.title?.english}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="Status"
                    info={animeList?.status}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="Type"
                    info={animeList?.type}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="Genres"
                    info={animeList?.genres.map(
                      (genre: string, index: number) => (
                        <span key={index}>{genre}</span>
                      )
                    )}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="Studios"
                    info={animeList?.studios?.map(
                      (studio: string, index: number) => (
                        <span key={index}>{studio}</span>
                      )
                    )}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="Release Date"
                    info={animeList?.releaseDate}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="Total Episodes"
                    info={animeList?.totalEpisodes}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="Rating"
                    info={animeList?.rating}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="Country"
                    info={animeList?.ountryOfOrigin}
                  />
                  <SideContent
                    classes="text-xs mb-3"
                    title="Season"
                    info={animeList?.season}
                  />
                  {animeList?.synonyms ? (
                    <SideContent
                      classes="text-xs mb-3"
                      title="Synonyms"
                      info={animeList?.synonyms?.map(
                        (synonym: string, index: number) => (
                          <span key={index}>{synonym}</span>
                        )
                      )}
                    />
                  ) : null}
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-start">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <div className="w-full">
                  <h3 className="text-white text-md mb-3">Episodes</h3>
                  <EpisodesButton
                    episodesClassName={classNames(
                      'grid items-start gap-3 bg-[#100f0f] p-2',
                      episodes?.length > 50
                        ? 'grid-cols-2 md:grid-cols-5'
                        : 'grid-cols-1'
                    )}
                    episodes={episodes}
                    watchPage={false}
                    animeId={animeList?.id}
                  />
                </div>
              )}
              <Characters
                color={animeList?.color}
                characters={animeList?.characters}
              />
              <div className="min-h-full">Recommendation</div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Anime;
