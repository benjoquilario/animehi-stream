import { NextSeo } from 'next-seo';
import { META } from '@consumet/extensions';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import progressBar, { EpisodeLoading } from '@/components/shared/loading';
import { base64SolidImage } from '@/src/lib/utils/image';
import Genre from '@/components/shared/genre';
import { stripHtml, parseData } from '@/src/lib/utils/index';
import classNames from 'classnames';
import InfoItem from '@/components/shared/info-item';
import EpisodesButton from '@/components/watch/episodes-button';
import Characters from '@/components/anime/characters';
import useEpisodes from '@/hooks/useEpisodes';
import Image from '@/components/shared/image';
import TitleName from '@/components/shared/title-name';
import { RecentType } from 'types/types';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layouts/default';
import Button from '@/components/shared/button';
import Storage from '@/src/lib/utils/storage';
import Side from '@/components/anime/side';
import ResultsCard from '@/components/shared/results-card';
import WatchLink from '@/components/shared/watch-link';
import ClientOnly from '@/components/shared/client-only';
import React, { useState, useMemo, useCallback } from 'react';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let id = params!.id;

  const anilist = new META.Anilist();
  id = typeof id === 'string' ? id : id?.join('');

  const data = await anilist.fetchAnilistInfoById(id as string);

  if (!data)
    return {
      notFound: true,
    };
  else
    return {
      props: {
        animeList: parseData(data),
      },
    };
};

const Anime = ({
  animeList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const recentWatched = new Storage('recentWatched');
  const watchList = new Storage('watchedList');
  const [showMore, setShowMore] = useState<boolean>(false);
  const { data: episodes, isLoading, isError } = useEpisodes(animeList?.id);

  const handleWatchedList = useCallback(() => {
    const storage = new Storage('watchedList');

    if (storage.has({ id: animeList?.id })) return;

    typeof window !== 'undefined' &&
      storage.create({
        id: animeList?.id,
        title: animeList?.title?.romaji || animeList?.title?.english,
        image: animeList?.image,
        color: animeList?.color,
        description: animeList?.description,
        type: animeList?.type,
        duration: animeList?.popularity,
        genres: animeList?.genres,
      });

    return router.push('/watchlist');
  }, [animeList, router]);

  const existedWatched =
    typeof window !== 'undefined' && watchList.findOne({ id: animeList?.id });

  const currentWatchEpisode =
    typeof window !== 'undefined' &&
    recentWatched.findOne<RecentType>({ animeId: animeList?.id });

  const existedEpisode =
    typeof window !== 'undefined' &&
    recentWatched.has({ animeId: animeList?.id });

  // console.log(existedWatched);

  // const existedStored = useMemo(
  //   () => watchListStore?.find(x => x.id === animeList.id),
  //   [watchListStore, animeList]
  // );

  // console.log(existedStored);

  const lastEpisodes = useMemo(
    () => !isLoading && episodes?.[episodes?.length - 1]?.id,
    [episodes, isLoading]
  );

  return (
    <DefaultLayout>
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

      <div className="overflow-hidden">
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
            objectFit="cover"
            containerclassname="relative w-full h-full"
          />

          <div className="absolute top-0 left-0 bg-banner-shadow h-full w-full"></div>
        </div>
        <div className="bg-background-700 px-[4%] grid grid-cols-1 justify-items-center gap-[70px] md:grid-cols-[228px_1fr] md:gap-[18px] pb-7">
          <div className="min-w-[155px] w-[155px] md:w-full md:min-w-full h-auto">
            <div className="min-w-full w-full h-[196px] block mt-[-88px] md:mt-[-69px] md:h-[300px]">
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
          <div className="grid text-white py-4 w-full z-10 mt-[-69px]">
            <div className="flex items-center gap-2 mb-7">
              <ClientOnly>
                <WatchLink
                  isExist={existedEpisode}
                  id={animeList?.id}
                  color={animeList?.color}
                  currentWatchEpisode={currentWatchEpisode as RecentType}
                  lastEpisode={lastEpisodes}
                />
              </ClientOnly>
              <Button
                disabled={existedWatched ? true : false}
                onClick={handleWatchedList}
                style={{
                  backgroundColor: `${animeList?.color || '#000'}`,
                }}
                className="text-xs md:text-sm transition duration-300 flex items-center px-3 py-2 rounded-md gap-x-1 hover:opacity-80"
                type="button"
              >
                <ClientOnly>
                  {existedWatched ? 'Watching' : 'Add to WatchList'}
                </ClientOnly>
              </Button>
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
            <p className="leading-6 text-sm md:text-base text-slate-300 font-extralight mt-2">
              {showMore
                ? stripHtml(animeList?.description)
                : stripHtml(animeList?.description?.substring(0, 485))}
              <Button
                type="button"
                className="shadow-lg text-white text-xs p-1 transform transition duration-300 ease-out hover:scale-105"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show less' : 'Show more'}
              </Button>
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
        <div className="px-[4%] grid grid-cols-none md:grid-cols-[238px_auto] md:mt-[20px] md:gap-[18px]">
          <div className="block">
            <div className="bg-background-700 my-2 p-3 rounded">
              <p className="text-white text-base">
                Score:{' '}
                <span className="text-slate-300 italic text-sm">
                  {animeList?.rating}
                </span>
              </p>
            </div>
            <div className="bg-background-700 my-2 p-3 rounded">
              <p className="text-white text-base">
                Popularity:{' '}
                <span className="text-slate-300 italic text-sm">
                  {animeList?.popularity}
                </span>
              </p>
            </div>
            <div className="bg-background-700 my-2 p-3 rounded">
              <ul className="grid grid-cols-2  w-full md:grid-cols-1">
                <Side data={animeList} />
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 space-y-6">
            {isError ? <div>Error</div> : null}
            {isLoading ? (
              <EpisodeLoading />
            ) : (
              <div className="w-full">
                <TitleName title="Episodes" />
                <EpisodesButton
                  episodesClassName={classNames(
                    'grid items-start bg-background-700',
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
            <div className="w-full mt-4">
              <TitleName title="Characters & Voice Actors" />
              <Characters
                color={animeList?.color}
                characters={animeList?.characters}
              />
            </div>
            <ResultsCard
              isLoading={!animeList}
              title="Relations"
              animeList={animeList?.relations}
            />
            <ResultsCard
              isLoading={!animeList}
              title="Recommendations"
              animeList={animeList?.recommendations}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Anime;
