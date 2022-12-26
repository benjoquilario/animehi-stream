import { initialiseStore, useDispatch, useSelector } from '@/store/store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  setEpisodeId,
  setSources,
  setProviders,
  resetSources,
  setEpisodes,
  setTotalEpisodes,
} from '@/store/watch/slice';
import { setAnimeId } from '@/store/anime/slice';
import EpisodesButton from '@/components/watch/episodes-button';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { extractEpisode } from '@/utils/index';
import Episodes from '@/components/watch/episodes';
import progressBar, { LoadingVideo } from '@/components/shared/loading';
import { NextSeo } from 'next-seo';
import DetailLinks from '@/components/shared/detail-links';
import { IAnimeInfo, META } from '@consumet/extensions';
import { IAnimeResult } from '@consumet/extensions/dist/models/types';
import useEpisodes from '@/hooks/useEpisodes';
import useVideoSource from '@/hooks/useVideoSource';
import { EpisodesType } from '@/src/../types/types';
import DefaultLayout from '@/components/layouts/default';
import { setRecentlyWatching } from '@/store/recent/slice';

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

interface WatchAnimeProps {
  animeList: IAnimeInfo | IAnimeResult;
}

const WatchAnime: NextPage<WatchAnimeProps> = ({
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
  // const animeEpisode = JSON.parse(localStorage.getItem('watch') || '{}');

  const { data: episodes, isLoading: episodesLoading } = useEpisodes(animeId);

  const title = useMemo(
    () => animeList?.title?.english || animeList?.title?.romaji,
    [animeList?.title?.english, animeList?.title?.romaji]
  );

  const currentEpisode = useMemo(
    () => episodes?.find((episode: EpisodesType) => episode?.id === episodeId),
    [episodeId, episodes]
  );

  const currentEpisodeIndex = useMemo(
    () =>
      episodes?.findIndex((episode: EpisodesType) => episode?.id === episodeId),
    [episodes, episodeId]
  );

  const nextEpisode = useMemo(
    () => episodes?.[currentEpisodeIndex + 1],
    [currentEpisodeIndex, episodes]
  );

  const prevEpisode = useMemo(
    () => episodes?.[currentEpisodeIndex - 1],
    [currentEpisodeIndex, episodes]
  );

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
    if (episodesLoading) return;

    dispatch(setEpisodes(currentEpisode?.number));
  }, [dispatch, currentEpisode?.number, episodesLoading]);

  useEffect(() => {
    if (episodesLoading) return;

    dispatch(setTotalEpisodes(episodes?.length));
  }, [dispatch, episodesLoading, episodes]);

  const { data: videoSource, isLoading: videoLoading } = useVideoSource({
    episodeId,
    provider,
  });

  const sources = useMemo(
    () => (!videoSource?.sources?.length ? null : videoSource?.sources),
    [videoSource?.sources]
  );

  useEffect(() => {
    if (videoLoading) {
      dispatch(resetSources());
    }

    dispatch(setSources(sources));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, videoLoading]);

  return (
    <DefaultLayout footer={false}>
      <NextSeo
        title={`Watch ${title} Episode - ${extractEpisode(
          episodeId
        )} English Subbed on AnimeHi`}
        description={animeList?.description}
        openGraph={{
          images: [
            {
              type: 'large',
              url: `${animeList?.cover}`,
              alt: `Banner Image for ${title}`,
            },
            {
              type: 'small',
              url: `${animeList?.cover}`,
              alt: `Cover Image for ${title}`,
            },
          ],
        }}
      />

      <div className="min-h-[calc(100vh_-_52px)] md:min-h-[calc(100vh_-_67px)] 2xl:min-h-[calc(100vh_-_104px)] xl:min-h-[calc(100vh_-_84px)]  px-0 md:px-[3%] overflow-hidden">
        <div className="mt-[52px] md:mt-[67px] xl:mt-[84px] 2xl:mt-[104px]">
          <DetailLinks
            animeId={animeList?.id}
            animeTitle={title}
            episodeNumber={currentEpisode?.number || episodes?.length}
          />
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-5 gap-2 h-full w-full">
            {videoLoading ? (
              <LoadingVideo classname="h-7 h-7 md:h-12 md:w-12" />
            ) : (
              <VideoPlayer
                animeList={animeList}
                poster={currentEpisode?.image || animeList?.cover}
                className="col-span-full"
                title={title}
                episodeNumber={currentEpisode?.number || episodes?.length}
                nextEpisode={nextEpisode}
                prevEpisode={prevEpisode}
              />
            )}
            <div className="row-start-2 row-end-5 col-start-1 col-end-5 xl:col-start-1 xl:col-end-2	md:row-start-2 md:row-end-2 xl:row-start-1 xl:row-end-1 h-full pb-3">
              <div className="bg-[#100f0f] p-4 w-full text-white text-xs">
                List of episode :
              </div>

              <div className="flex flex-col bg-[#100f0f] md:bg-[#000000eb] overflow-auto h-[340px] md:h-[575px]">
                {episodesLoading && (
                  <LoadingVideo classname="h-5 h-5 md:h-8 md:w-8" />
                )}
                {episodes?.length > 25 ? (
                  <EpisodesButton
                    watchPage={true}
                    episodes={episodes}
                    activeIndex={currentEpisode?.number || episodes?.length}
                    episodesClassName="grid grid-cols-2 md:grid-cols-1"
                  />
                ) : (
                  <Episodes
                    activeIndex={currentEpisode?.number || episodes?.length}
                    episodes={episodes}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default WatchAnime;
