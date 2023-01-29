import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { AiFillDatabase } from 'react-icons/ai';
import { useDispatch, useSelector } from '@/store/store';
import { setEpisodeId, setServer } from '@/store/watch/slice';
import {
  EpisodesType,
  RecentType,
  NextAiringEpisode,
} from '@/src/../types/types';
import { TbPlayerTrackNext, TbPlayerTrackPrev } from 'react-icons/tb';
import Button from '@/components/shared/button';
import Storage from '@/src/lib/utils/storage';
import OPlayer from '@/components/player/op-player';
import { LoadingVideo } from '@/components/shared/loading';
import { IAnimeInfo } from '@consumet/extensions/dist/models/types';
import dayjs from '@/lib/utils/time';

type VideoProps = {
  data: IAnimeInfo;
  id: string;
  color: string;
  image: string;
  nextAiringEpisode: NextAiringEpisode;
  animeTitle: string;
  poster: string;
  episodeId: string;
  className: string;
  episodeNumber: number;
  nextEpisode: EpisodesType;
  prevEpisode: EpisodesType;
  isLoading: boolean;
};

const Video = (props: VideoProps): JSX.Element => {
  const {
    data,
    id,
    color,
    image,
    nextAiringEpisode,
    poster,
    episodeId,
    className,
    episodeNumber,
    nextEpisode,
    prevEpisode,
    isLoading,
    animeTitle,
  } = props;

  const dispatch = useDispatch();
  const [animeId, server, totalEpisodes] = useSelector(store => [
    store.anime.animeId,
    store.watch.server,
    store.watch.totalEpisodes,
  ]);

  useEffect(() => {
    const storage = new Storage('recentWatched');
    if (storage.has({ episodeId })) return;

    const list =
      typeof window !== 'undefined' &&
      storage.findOne<RecentType>({ id: animeId });

    if (list) {
      typeof window !== 'undefined' &&
        storage.update(list, {
          animeTitle,
          color,
          image,
          episodeNumber,
          episodeId,
          id,
        });
    } else {
      typeof window !== 'undefined' &&
        storage.create({
          animeTitle,
          color,
          image,
          episodeNumber,
          episodeId,
          id,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, episodeId]);

  const nextAiringScheduleTime = useMemo(() => {
    if (!nextAiringEpisode?.airingTime) return;

    return dayjs.unix(nextAiringEpisode?.airingTime).fromNow();
  }, [nextAiringEpisode?.airingTime]);

  return (
    <div
      className={classNames(
        'flex flex-col col-start-1 col-end-6 md:col-start-1 xl:col-start-2 md:col-end-6 w-full',
        className
      )}
    >
      <OPlayer
        episodeNumber={episodeNumber}
        malId={data?.malId as number}
        poster={poster}
      />

      {!isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] bg-black pt-5 px-3 gap-3">
          <div className="bg-background-700 py-2 px-6">
            <div className="text-center text-white text-xs my-2">
              <p>You are watching</p>
              <Button type="button" className="text-primary mb-2 bg-none">
                {`${animeTitle} Episode ${episodeNumber}`}
              </Button>
              <p>
                Click <b>Episode</b> again or Switch to alternate
              </p>
              <p>provider in case of error.</p>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-start w-full">
            <div className="flex flex-col items-start text-white gap-2">
              <div className="flex items-center text-white gap-2">
                <AiFillDatabase className="text-white h-4" />
                <h4 className="uppercase text-xs md:text-sm font-semibold">
                  providers:
                </h4>
                <Button
                  disabled={server === 'server 1' ? true : false}
                  // onClick={handleChangeProvider}
                  onClick={() => dispatch(setServer('server 1'))}
                  className="bg-primary p-2 text-xs rounded-md uppercase font-semibold"
                >
                  server 1
                </Button>
              </div>
              {nextAiringEpisode && (
                <div className="text-sm text-primary flex flex-col">
                  <span className="font-semibold">Next Episode</span>
                  <span>
                    Episode {nextAiringEpisode?.episode}: (
                    {nextAiringScheduleTime})
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="flex gap-2">
                {episodeNumber !== 1 ? (
                  <Button
                    onClick={() => dispatch(setEpisodeId(prevEpisode?.id))}
                    className="text-white text-xs hover:text-primary transition"
                  >
                    <TbPlayerTrackPrev className="h-5 w-5 md:h-7 md:w-7" />
                  </Button>
                ) : null}
                {episodeNumber !== totalEpisodes ? (
                  <Button
                    onClick={() => dispatch(setEpisodeId(nextEpisode?.id))}
                    className="text-white text-xs hover:text-primary transition"
                  >
                    <TbPlayerTrackNext className="h-5 w-5 md:h-7 md:w-7" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingVideo classname="w-10 h-10 md:h-12 md:w-12" />
      )}
    </div>
  );
};

export default React.memo(Video);
