import { useEffect, useMemo } from 'react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Header from '@/components/header/header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper';
import Banner from '@/components/anime/banner';
import progressBar from '@/components/shared/loading';
import {
  IAnimeInfo,
  IAnimeResult,
  ISearch,
} from '@consumet/extensions/dist/models/types';
import { TYPE, FORMAT, SORT } from '@/utils/config';
import RecentRelease from '@/components/anime/recentRelease';
import { TitleType } from '@/src/../types/types';
import Popular from '@/components/anime/popular';
import { getSeason } from '../utils';
import { useDispatch } from '@/store/store';
import { resetStates } from '@/store/watch/slice';
import Row from '@/components/anime/row';
import getMedia from '@/hooks/useMedia';
import Genres from '@/components/anime/genres';
import { LoadingBanner } from '@/components/shared/loading';
import AiringScheduling from '@/components/anime/airing-schedule';
import { InferGetServerSidePropsType } from 'next';

export interface IRecentResults extends IAnimeResult {
  episodeNumber: number;
  image: string;
  title: TitleType;
  color: string;
  episodeId: string;
}

export const getServerSideProps = async () => {
  const currentSeason = getSeason();

  try {
    const { data: trendingAnime } = await getMedia({
      type: TYPE.ANIME,
      page: 1,
      perPage: 12,
      season: currentSeason.season,
      format: FORMAT.TV,
      sort: SORT.TRENDING_DESC,
    });

    const { data: popularThisSeason } = await getMedia({
      type: TYPE.ANIME,
      page: 1,
      perPage: 5,
      season: currentSeason.season,
      format: FORMAT.TV,
      sort: SORT.POPULARITY_DESC,
      year: currentSeason.year,
    });

    const { data: popularAnime } = await getMedia({
      type: TYPE.ANIME,
      page: 1,
      perPage: 10,
      format: FORMAT.TV,
      sort: SORT.POPULARITY_DESC,
    });

    const { data: favouritesThisSeason } = await getMedia({
      type: TYPE.ANIME,
      page: 1,
      perPage: 5,
      format: FORMAT.TV,
      sort: SORT.FAVORITES_SEASON,
      season: currentSeason.season,
      year: currentSeason.year,
    });

    const { data: favouritesAnime } = await getMedia({
      type: TYPE.ANIME,
      page: 1,
      perPage: 5,
      format: FORMAT.TV,
      sort: SORT.FAVORITES_SEASON,
    });

    return {
      props: {
        trendingAnime,
        popularAnime,
        popularThisSeason,
        favouritesThisSeason,
        favouritesAnime,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

const HomePage = ({
  trendingAnime,
  popularAnime,
  popularThisSeason,
  favouritesThisSeason,
  favouritesAnime,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  progressBar.finish();
  const dispatch = useDispatch();
  const currentSeason = useMemo(getSeason, []);

  const { results: trendingResults }: ISearch<IAnimeInfo> = trendingAnime;

  useEffect(() => {
    dispatch(resetStates());
  }, [dispatch]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#000] w-full mx-auto max-w-screen-2xl">
      <Header />
      <div className="w-full h-full bg-center bg-top overflow-hidden bg-cover px-0 md:px-[4%]">
        {trendingAnime ? (
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {trendingResults?.map((anime, idx) => (
              <SwiperSlide key={idx}>
                <Banner
                  cover={anime.cover}
                  title={anime.title as TitleType}
                  description={anime.description}
                  genres={anime.genres}
                  image={anime.image}
                  id={anime.id}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <LoadingBanner />
        )}
      </div>

      <main className="mt-[40px] px-[4%]">
        <div className="flex flex-col space-y-6 md:grid lg:grid-cols-1 xl:grid-cols-[1fr_310px] 2xl:grid-cols-[1fr_340px] md:gap-4">
          <div className="space-y-6">
            <RecentRelease title="Recent Updated" />
            <div className="flex flex-col md:flex-row gap-2">
              <Row
                season={currentSeason.season}
                animeList={popularThisSeason}
                title="Popular this season"
                isLoading={!popularThisSeason}
              />
              <Row
                season={currentSeason.season}
                animeList={favouritesThisSeason}
                title="Favorite this season"
                isLoading={!favouritesThisSeason}
              />
              <Row
                season={currentSeason.season}
                animeList={favouritesAnime}
                title="All time favorite"
                isLoading={!favouritesAnime}
              />
            </div>
            <AiringScheduling />
          </div>
          <div className="overflow-hidden">
            <Popular isLoading={!popularAnime} popularSeason={popularAnime} />
            <Genres />
          </div>
        </div>
        {/* <Row title="Popular" anime={popular} isLoading={false} /> */}
      </main>
    </div>
  );
};

export default HomePage;
