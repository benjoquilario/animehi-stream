import React, { useEffect, useMemo } from 'react';
import progressBar from '@/components/shared/loading';
import { TYPE, FORMAT, SORT } from '@/src/lib/constant';
import RecentRelease from '@/components/anime/recentRelease';
import Popular from '@/components/anime/popular';
import { getSeason } from '../lib/utils';
import { useDispatch } from '@/store/store';
import { resetStates } from '@/store/watch/slice';
import Row from '@/components/anime/row';
import useMedia from '@/hooks/useMedia';
import Genres from '@/components/anime/genres';
import AiringScheduling from '@/components/anime/airing-schedule';
import DefaultLayout from '@/components/layouts/default';
import ClientOnly from '@/components/shared/client-only';
import ContinueWatching from '@/components/anime/continue-watching';
import Banner from '@/components/anime/banner';

const HomePage = () => {
  progressBar.finish();
  const dispatch = useDispatch();
  const currentSeason = useMemo(getSeason, []);

  const { data: trendingAnime, isLoading: trendingAnimeLoading } = useMedia({
    type: TYPE.ANIME,
    page: 1,
    perPage: 12,
    season: currentSeason.season,
    format: FORMAT.TV,
    sort: SORT.TRENDING_DESC,
  });

  const { data: popularThisSeason, isLoading: popularSeasonLoading } = useMedia(
    {
      type: TYPE.ANIME,
      page: 1,
      perPage: 5,
      season: currentSeason.season,
      format: FORMAT.TV,
      sort: SORT.POPULARITY_DESC,
      year: currentSeason.year,
    }
  );

  const { data: popularAnime, isLoading: popularAnimeLoading } = useMedia({
    type: TYPE.ANIME,
    page: 1,
    perPage: 10,
    format: FORMAT.TV,
    sort: SORT.POPULARITY_DESC,
  });

  const { data: favouritesThisSeason, isLoading: favouritesSeasonLoading } =
    useMedia({
      type: TYPE.ANIME,
      page: 1,
      perPage: 5,
      format: FORMAT.TV,
      sort: SORT.FAVORITES_SEASON,
      season: currentSeason.season,
      year: currentSeason.year,
    });

  const { data: favouritesAnime, isLoading: favouritesAnimeLoading } = useMedia(
    {
      type: TYPE.ANIME,
      page: 1,
      perPage: 5,
      format: FORMAT.TV,
      sort: SORT.FAVORITES_SEASON,
    }
  );

  useEffect(() => {
    dispatch(resetStates());
  }, [dispatch]);

  return (
    <ClientOnly>
      <DefaultLayout>
        <div className="w-full h-full bg-center bg-top overflow-hidden bg-cover px-0 md:px-[3%]">
          <Banner animeList={trendingAnime} isLoading={trendingAnimeLoading} />
        </div>
        <main className="mt-[40px] px-[3%]">
          <div className="flex flex-col space-y-6 md:grid lg:grid-cols-1 xl:grid-cols-[1fr_310px] 2xl:grid-cols-[1fr_340px] md:gap-4">
            <div className="space-y-6 w-full overflow-hidden">
              <ContinueWatching />
              <RecentRelease />
              <div className="flex flex-col md:flex-row gap-2">
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
                popularSeason={popularAnime}
              />
              <Genres />
            </div>
          </div>
        </main>
      </DefaultLayout>
    </ClientOnly>
  );
};

export default HomePage;
