import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import Header from '@/components/header/header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import Banner from '@/components/anime/banner';
import { InferGetServerSidePropsType } from 'next';
import progressBar from '@/components/shared/loading';
import { IAnimeInfo, IAnimeResult, ISearch, META } from '@consumet/extensions';
import { GOGO_PROVIDER } from '@/utils/config';
import RecentRelease from '@/components/anime/recentRelease';
import { TitleType } from '@/src/../types/types';

export interface IRecentResults extends IAnimeResult {
  episodeNumber: number;
  image: string;
  title: TitleType;
}

export const getServerSideProps = async () => {
  const anilist = new META.Anilist();

  const page = 1;
  const trending: ISearch<IAnimeInfo> = await anilist.fetchTrendingAnime();
  const recentRelease: ISearch<IAnimeResult> =
    await anilist.fetchRecentEpisodes(GOGO_PROVIDER, page, 24);

  if (!trending && !recentRelease) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      trending: JSON.parse(JSON.stringify(trending)),
      recentRelease: JSON.parse(JSON.stringify(recentRelease)),
    },
  };
};

const HomePage = ({
  trending,
  recentRelease,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  progressBar.finish();
  console.log(recentRelease);
  console.log(trending);
  const { results: trendingResults }: ISearch<IAnimeInfo> = trending;
  const { results: recentReleaseResults }: ISearch<IRecentResults> =
    recentRelease;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#000]">
      <Header />
      <div className="w-full h-full bg-center bg-top overflow-hidden bg-cover">
        <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
          {trendingResults?.map((animeList, idx) => (
            <SwiperSlide key={idx}>
              <Banner
                cover={animeList.cover}
                title={animeList.title as TitleType}
                description={animeList.description}
                genres={animeList.genres}
                id={animeList.id}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <main className="mt-[40px] px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
          <RecentRelease
            title="Recent Release"
            animeList={recentReleaseResults}
            isLoading={recentReleaseResults?.length <= 0}
          />
          <div className="overflow-hidden bg-[#0d0d0d]"></div>
        </div>
        {/* <Row title="Popular" anime={popular} isLoading={false} /> */}
      </main>
    </div>
  );
};

export default HomePage;
