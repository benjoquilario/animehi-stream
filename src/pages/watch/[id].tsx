import { initialiseStore, useDispatch, useSelector } from '@/store/store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import React, { useEffect, useRef } from 'react';
import { setEpisodeId, setSources, resetSources } from '@/store/watch/slice';
import { setAnime } from '@/store/anime/slice';
import { BASE_URL } from '@/utils/config';
import Header from '@/components/header/header';
import EpisodesButton from '@/components/watch/episodes-button';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import api from '@/utils/request';
import { extractEpisode } from '@/utils/index';
import Episodes from '@/components/watch/episodes';
import progressBar from '@/components/shared/loading';
import { NextSeo } from 'next-seo';
import DetailLinks from '@/components/shared/detail-links';

const VideoPlayer = dynamic(() => import('@/components/watch/video'), {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps = async context => {
  const store = initialiseStore();
  const id = context.params?.id;
  let episode = context.query.episode;

  episode = typeof episode === 'string' ? episode : episode?.join('');
  store.dispatch(setAnime(id));

  if (episode) {
    store.dispatch(setEpisodeId(episode));
  }

  const animeList = await api.animeInfo(id as string);

  if (!id || !animeList || !episode) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      animeList,
      initialReduxState: store.getState(),
    },
  };
};

const WatchAnime = ({
  animeList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  progressBar.finish();
  const router = useRouter();
  const [anime, episodeId, provider] = useSelector(store => [
    store.anime.anime,
    store.watch.episodeId,
    store.watch.provider,
  ]);
  const episodeNumber = extractEpisode(episodeId);
  const animeTitle = animeList?.title?.english || animeList?.title?.romaji;

  const fetcher = async (episodeId: string, provider: string) =>
    fetch(
      `${BASE_URL}/meta/anilist/watch/${episodeId}?provider=${provider}`
    ).then(res => res.json());

  const { data, error } = useSWR([episodeId, provider], fetcher, {
    revalidateOnFocus: false,
  });

  const dispatch = useDispatch();
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current.replace(
      {
        pathname: '/watch/[id]',
        query: { id: anime, episode: episodeId },
      },
      `/watch/${anime}?episode=${episodeId}`,
      {
        shallow: true,
      }
    );
  }, [anime, episodeId]);

  useEffect(() => {
    if (!data && !error) return;

    dispatch(setSources(data?.sources));
  }, [dispatch, data, error]);

  console.log(extractEpisode(episodeId));

  return (
    <>
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

        <div className="mt-[48px] md:mt-[60px] px-0 md:px-[4%]">
          <DetailLinks
            animeId={animeList?.id}
            animeTitle={animeTitle}
            episodeNumber={episodeNumber as number}
          />
          <div className="grid grid-cols-5 gap-2 h-full w-full">
            <VideoPlayer
              poster={
                animeList?.episodes[(episodeNumber as number) - 1]?.image ||
                animeList?.cover
              }
              className="col-span-full"
              title={animeTitle}
            />
            <div className="h-full md:w-[12.5rem] lg:w-[14rem] md:min-w-[12.5rem] lg:min-w-[14rem]">
              <div className="text-center text-white text-xs my-2">
                <p>You are watching</p>
                <p className="text-[#6A55FA]">
                  {animeTitle} Episode {episodeNumber}
                </p>
              </div>
              <div className="flex flex-col bg-[#100f0f] md:bg-[#000000eb] overflow-auto pr-[10px] h-[340px] md:h-[500px]">
                {animeList?.episodes.length > 25 ? (
                  <EpisodesButton
                    watchPage={true}
                    episodes={animeList?.episodes}
                    activeIndex={episodeNumber}
                  />
                ) : (
                  <Episodes
                    activeIndex={episodeNumber}
                    episodes={animeList?.episodes}
                  />
                )}
              </div>
            </div>

            <div className="col-start-2 col-span-4"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchAnime;
