import { useEffect, useMemo } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Header from '@/components/header/header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper';
import Banner from '@/components/anime/banner';
import { InferGetServerSidePropsType, NextPage } from 'next';
import progressBar from '@/components/shared/loading';
import {
  IAnimeInfo,
  IAnimeResult,
  ISearch,
} from '@consumet/extensions/dist/models/types';
import { META, ANIME } from '@consumet/extensions';
import {
  GOGO_PROVIDER,
  ZORO_PROVIDER,
  TYPE,
  FORMAT,
  SORT,
} from '@/utils/config';
import RecentRelease from '@/components/anime/recentRelease';
import { TitleType } from '@/src/../types/types';
import Popular from '@/components/anime/popular';
import { getSeason } from '../utils';
import { useDispatch } from '@/store/store';
import { resetStates } from '@/store/watch/slice';
import Row from '@/components/anime/row';
import useMedia from '@/hooks/useMedia';
import { encodedURI } from '../utils';
import Genres from '@/components/anime/genres';
import { LoadingBanner } from '@/components/shared/loading';
import ClientOnly from '@/components/shared/client-only';
import AiringScheduling from '@/components/anime/airing-schedule';

export type IRecentResults = {
  episodeNumber: number;
  image: string;
  title: TitleType;
  color: string;
  episodeId: string;
} & IAnimeResult;

const HomePage = () => {
  progressBar.finish();
  const dispatch = useDispatch();
  const currentSeason = useMemo(getSeason, []);

  const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
    type: TYPE.ANIME,
    page: 1,
    perPage: 12,
    season: currentSeason.season,
    format: FORMAT.TV,
    sort: encodedURI(SORT.TRENDING_DESC),
  });

  const { data: popularThisSeason, isLoading: popularSeasonLoading } = useMedia(
    {
      type: TYPE.ANIME,
      page: 1,
      perPage: 5,
      season: currentSeason.season,
      format: FORMAT.TV,
      sort: encodedURI(SORT.POPULARITY_DESC),
      year: currentSeason.year,
    }
  );

  const { data: popularAnime, isLoading: popularAnimeLoading } = useMedia({
    type: TYPE.ANIME,
    page: 1,
    perPage: 9,
    format: FORMAT.TV,
    sort: encodedURI(SORT.POPULARITY_DESC),
  });

  const { data: favouritesThisSeason, isLoading: favouritesSeasonLoading } =
    useMedia({
      type: TYPE.ANIME,
      page: 1,
      perPage: 5,
      format: FORMAT.TV,
      sort: encodedURI(SORT.FAVORITES_SEASON),
      season: currentSeason.season,
      year: currentSeason.year,
    });

  const { data: favouritesAnime, isLoading: favouritesAnimeLoading } = useMedia(
    {
      type: TYPE.ANIME,
      page: 1,
      perPage: 5,
      format: FORMAT.TV,
      sort: encodedURI(SORT.FAVORITES_SEASON),
    }
  );

  useEffect(() => {
    dispatch(resetStates());
  }, [dispatch]);

  return (
    <ClientOnly>
      <div className="min-h-screen overflow-x-hidden bg-[#000] w-full mx-auto max-w-screen-2xl">
        <Header />
        <div className="w-full h-full bg-center bg-top overflow-hidden bg-cover px-0 md:px-[4%]">
          {!trendingLoading ? (
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
              {trendingAnime?.results?.map((anime: IAnimeInfo, idx: number) => (
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
          <div className="grid lg:grid-cols-1 xl:grid-cols-[1fr_310px] 2xl:grid-cols-[1fr_340px] gap-4">
            <div>
              <RecentRelease title="Recent Updated" />
              <div className="mt-2 flex flex-col md:flex-row gap-2">
                <Row
                  season={currentSeason.season}
                  animeList={popularThisSeason}
                  title="Popular this season"
                  isLoading={popularSeasonLoading}
                />
                <Row
                  season={currentSeason.season}
                  animeList={favouritesThisSeason}
                  title="Favorite this season"
                  isLoading={favouritesSeasonLoading}
                />
                <Row
                  season={currentSeason.season}
                  animeList={favouritesAnime}
                  title="All time favorite"
                  isLoading={favouritesAnimeLoading}
                />
              </div>
              <AiringScheduling />
            </div>

            <div className="overflow-hidden">
              <Popular
                isLoading={popularAnimeLoading}
                popularSeason={popularAnime?.results}
              />
              <Genres />
            </div>
          </div>
          {/* <Row title="Popular" anime={popular} isLoading={false} /> */}
        </main>
      </div>
    </ClientOnly>
  );
};

export default HomePage;
