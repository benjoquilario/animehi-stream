import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { initialiseStore, useDispatch, useSelector } from '@/store/store';
import {
  setEpisodeId,
  setSources,
  setProviders,
  resetSources,
  setEpisodes,
  setTotalEpisodes,
  setEnimeSouces,
} from '@/store/watch/slice';
import { setAnimeId } from '@/store/anime/slice';
import EpisodesButton from '@/components/watch/episodes-button';
import { extractEpisode, parseData } from '@/src/lib/utils/index';
import Episodes from '@/components/watch/episodes';
import progressBar, { LoadingVideo } from '@/components/shared/loading';
import { NextSeo } from 'next-seo';
import DetailLinks from '@/components/shared/detail-links';
import { IAnimeInfo, META } from '@consumet/extensions';
import { IAnimeResult } from '@consumet/extensions/dist/models/types';
import useEpisodes from '@/hooks/useEpisodes';
import { title } from '@/lib/helper';
import useVideoSource from '@/hooks/useVideoSource';
import { EpisodesType } from '@/src/../types/types';
import DefaultLayout from '@/components/layouts/default';
import Section from '@/components/shared/section';
import React, { useEffect, useRef, useMemo } from 'react';
import DubButton from '@/components/shared/dub-button';

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

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      animeList: parseData(data),
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
  const dub = useSelector(store => store.watch.dub);
  const [animeId, episodeId, provider] = useSelector(store => [
    store.anime.animeId,
    store.watch.episodeId,
    store.watch.provider,
  ]);
  const { data: episodes, isLoading: episodesLoading } = useEpisodes(
    animeId,
    dub
  );

  console.log(episodes, dub);

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

    if (episodeId.includes('episode')) dispatch(setSources(sources));
    else dispatch(setEnimeSouces(videoSource));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, videoLoading]);

  return (
    <DefaultLayout footer={false}>
      <NextSeo
        title={`Watch ${title(animeList?.title)} Episode - ${
          currentEpisode?.number ||
          animeList?.nextAiringEpisode?.episode - 1 ||
          animeList?.totalEpisodes
        } English Subbed on AnimeHi`}
        description={animeList?.description}
        openGraph={{
          images: [
            {
              type: 'large',
              url: `${animeList?.cover}`,
              alt: `Banner Image for ${title(animeList?.title)}`,
            },
            {
              type: 'small',
              url: `${animeList?.cover}`,
              alt: `Cover Image for ${title(animeList?.title)}`,
            },
          ],
        }}
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-5 gap-2 h-full w-full">
          <VideoPlayer
            data={animeList}
            id={animeList?.id}
            color={animeList?.color}
            title={title(animeList.title)}
            image={animeList?.image || animeList?.cover}
            animeTitle={title(animeList?.title)}
            nextAiringEpisode={animeList?.nextAiringEpisode}
            episodeId={episodeId}
            poster={currentEpisode?.image}
            className="col-span-full"
            episodeNumber={
              currentEpisode?.number ||
              animeList?.nextAiringEpisode?.episode - 1 ||
              animeList?.totalEpisodes
            }
            nextEpisode={nextEpisode}
            prevEpisode={prevEpisode}
            isLoading={videoLoading}
          />
          <div className="row-start-2 row-end-5 col-start-1 col-end-5 xl:col-start-1 xl:col-end-2	md:row-start-2 md:row-end-2 xl:row-start-1 xl:row-end-1 h-full pb-3">
            <DetailLinks
              animeId={animeList?.id}
              animeTitle={title(animeList?.title)}
              episodeNumber={
                currentEpisode?.number ||
                animeList?.nextAiringEpisode?.episode - 1 ||
                animeList?.totalEpisodes
              }
            />
            <div className="bg-background-700 p-4 w-full text-white text-xs">
              <span>List of episode :</span>
              <DubButton dub={dub} />
            </div>
            <div className="flex flex-col bg-background-700 md:bg-[#000000eb] overflow-auto min-h-full h-full md:min-h-[617px] md:h-[617px]">
              {episodesLoading && <LoadingVideo classname="h-8 w-8" />}
              {episodes?.length > 25 ? (
                <EpisodesButton
                  watchPage={true}
                  episodes={episodes}
                  activeIndex={
                    currentEpisode?.number ||
                    animeList?.nextAiringEpisode?.episode - 1 ||
                    animeList?.totalEpisodes
                  }
                  episodesClassName="grid grid-cols-2 md:grid-cols-1"
                />
              ) : (
                <Episodes
                  activeIndex={
                    currentEpisode?.number ||
                    animeList?.nextAiringEpisode?.episode - 1 ||
                    animeList?.totalEpisodes
                  }
                  episodes={episodes}
                />
              )}
            </div>
          </div>
        </div>
      </Section>
    </DefaultLayout>
  );
};

export default WatchAnime;
