import { useEffect } from 'react';
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
import { GOGO_PROVIDER, ZORO_PROVIDER } from '@/utils/config';
import RecentRelease from '@/components/anime/recentRelease';
import { TitleType } from '@/src/../types/types';
import Popular from '@/components/anime/popular';
import { parseData } from '../utils';
import { useDispatch } from '@/store/store';
import { resetStates } from '@/store/watch/slice';

export interface IRecentResults extends IAnimeResult {
  episodeNumber: number;
  image: string;
  title: TitleType;
  color: string;
  episodeId: string;
}

export const getServerSideProps = async () => {
  const anilist = new META.Anilist();

  const page = 1;
  const trending: ISearch<IAnimeInfo> = await anilist.fetchTrendingAnime(
    page,
    10
  );

  const popular: ISearch<IAnimeResult> = await anilist.fetchPopularAnime();
  if (!trending && !popular) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      trending: parseData(trending),
      popular: parseData(popular),
    },
  };
};

const HomePage = ({
  trending,
  popular,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  progressBar.finish();
  const dispatch = useDispatch();

  const { results: trendingResults }: ISearch<IAnimeInfo> = trending;
  const { results: popularResults }: ISearch<IAnimeInfo> = popular;

  useEffect(() => {
    dispatch(resetStates());
  }, [dispatch]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#000]">
      <Header />
      <div className="w-full h-full bg-center bg-top overflow-hidden bg-cover">
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
                id={anime.id}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <main className="mt-[40px] px-4 md:px-8">
        <div className="grid lg:grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
          <RecentRelease title="Recent Updated" />
          <div className="overflow-hidden">
            <Popular animeList={popularResults} />
          </div>
        </div>
        {/* <Row title="Popular" anime={popular} isLoading={false} /> */}
      </main>
    </div>
  );
};

export default HomePage;
