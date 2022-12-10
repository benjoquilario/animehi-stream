import { initialiseStore, useDispatch, useSelector } from '@/store/store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import React, { useEffect, useRef, Fragment, useState, useMemo } from 'react';
import {
  setEpisodeId,
  setSources,
  setProviders,
  resetSources,
  setEpisodes,
  setTotalEpisodes,
} from '@/store/watch/slice';
import { setAnimeId } from '@/store/anime/slice';
import { BASE_URL } from '@/utils/config';
import Header from '@/components/header/header';
import EpisodesButton from '@/components/watch/episodes-button';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { extractEpisode } from '@/utils/index';
import Episodes from '@/components/watch/episodes';
import progressBar, { LoadingVideo } from '@/components/shared/loading';
import { NextSeo } from 'next-seo';
import DetailLinks from '@/components/shared/detail-links';
import WatchDetails from '@/components/watch/details';
import { IAnimeInfo, META } from '@consumet/extensions';
import useEpisodes from '@/hooks/useEpisodes';
import { EpisodesType } from '@/src/../types/types';

const VideoPlayer = dynamic(() => import('@/components/watch/video'), {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps = async context => {
  const store = initialiseStore();
  const id = context.params?.id;
  let episode = context.query.episode;
  let provider = context.query.provider;

  episode = typeof episode === 'string' ? episode : episode?.join('');
  provider =
    typeof provider === 'string'
      ? provider.toLowerCase()
      : provider?.join('').toLowerCase();

  store.dispatch(setAnimeId(id));

  if (episode) {
    store.dispatch(setEpisodeId(episode));
  }

  if (provider) {
    store.dispatch(setProviders(provider));
  }

  const anilist = new META.Anilist();
  const data: IAnimeInfo = await anilist.fetchAnilistInfoById(id as string);

  if (!id || !data || !episode) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      animeList: JSON.parse(JSON.stringify(data)),
      initialReduxState: store.getState(),
    },
  };
};

const WatchAnime = ({
  animeList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  progressBar.finish();
  const router = useRouter();
  const dispatch = useDispatch();
  const routerRef = useRef(router);

  const [animeId, episodeId, provider] = useSelector(store => [
    store.anime.animeId,
    store.watch.episodeId,
    store.watch.provider,
  ]);

  const animeTitle = animeList?.title?.english || animeList?.title?.romaji;

  const fetcher = async (episodeId: string, provider: string) =>
    fetch(
      `${BASE_URL}/meta/anilist/watch/${episodeId}?provider=${provider}`
    ).then(res => res.json());

  const { data, error } = useSWR([episodeId, provider], fetcher, {
    revalidateOnFocus: false,
  });

  const { episodes, isLoading, isError } = useEpisodes(animeList.id);

  const currentEpisode = useMemo(
    () => episodes?.find((episode: EpisodesType) => episode?.id === episodeId),
    [episodeId, episodes]
  );

  const currentEpisodeIndex = useMemo(
    () =>
      episodes?.findIndex((episode: EpisodesType) => episode.id === episodeId),
    [episodes, episodeId]
  );

  const nextEpisode = useMemo(() => {
    if (!isLoading) return episodes[currentEpisodeIndex + 1];
  }, [currentEpisodeIndex, episodes, isLoading]);

  const prevEpisode = useMemo(() => {
    if (!isLoading) return episodes[currentEpisodeIndex - 1];
  }, [currentEpisodeIndex, episodes, isLoading]);

  // const nextEpisode = episodes[currentEpisodeIndex - 1];
  // const prevEpisode = episodes[currentEpisodeIndex - 1];

  useEffect(() => {
    routerRef.current.replace(
      {
        pathname: '/watch/[id]',
        query: { id: animeId, episode: episodeId, provider },
      },
      `/watch/${animeId}?episode=${episodeId}&provider=${provider}`,
      {
        shallow: true,
      }
    );
  }, [animeId, episodeId, provider]);

  useEffect(() => {
    if (isLoading) return;

    dispatch(setEpisodes(currentEpisode?.number));
  }, [dispatch, currentEpisode?.number, isLoading]);

  useEffect(() => {
    if (isLoading) return;

    dispatch(setTotalEpisodes(episodes?.length));
  }, [dispatch, isLoading, episodes]);

  useEffect(() => {
    if (!data && !error) {
      dispatch(resetSources());
    }

    dispatch(setSources(data?.sources));
  }, [dispatch, data, error]);

  return (
    <Fragment>
      <NextSeo
        title={`Watch ${animeTitle} Episode - ${extractEpisode(
          episodeId
        )} English Subbed on AnimeHi`}
        description={animeList?.description}
        openGraph={{
          images: [
            {
              type: 'large',
              url: `${animeList?.cover}`,
              alt: `Banner Image for ${animeTitle}`,
            },
            {
              type: 'small',
              url: `${animeList?.cover}`,
              alt: `Cover Image for ${animeTitle}`,
            },
          ],
        }}
      />

      <div className="min-h-screen overflow-x-hidden bg-[#000]">
        <Header />
        <div className="mt-[48px] md:mt-[64px] px-0 md:px-[4%]">
          <DetailLinks
            animeId={animeList?.id}
            animeTitle={animeTitle}
            episodeNumber={currentEpisode?.number}
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 h-full w-full">
            {!data && !error ? (
              <LoadingVideo classname="h-7 h-7 md:h-12 md:w-12" />
            ) : (
              <VideoPlayer
                poster={currentEpisode?.image || animeList?.cover}
                className="col-span-full"
                title={animeTitle}
                episodeNumber={currentEpisode?.number}
                nextEpisode={nextEpisode}
                prevEpisode={prevEpisode}
              />
            )}
            <div className="row-start-2 row-end-5 col-start-1 col-end-5 md:col-start-1 md:col-end-2	md:row-start-1 md:row-end-1 h-full">
              <div className="bg-[#100f0f] p-4 w-full text-white text-xs">
                List of episode :
              </div>

              <div className="flex flex-col bg-[#100f0f] md:bg-[#000000eb] overflow-auto pr-[10px] h-[340px] md:h-[545px]">
                {isLoading && (
                  <LoadingVideo classname="h-5 h-5 md:h-8 md:w-8" />
                )}
                {episodes?.length > 25 ? (
                  <EpisodesButton
                    watchPage={true}
                    episodes={episodes}
                    activeIndex={currentEpisode?.number}
                    episodesClassName="grid grid-cols-2 md:grid-cols-1"
                  />
                ) : (
                  <Episodes
                    activeIndex={currentEpisode?.number}
                    episodes={episodes}
                  />
                )}
              </div>
            </div>
            <div className="col-start-1 col-span-5">
              <WatchDetails animeList={animeList} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WatchAnime;
