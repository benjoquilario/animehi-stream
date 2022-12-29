import React, { useEffect } from 'react';
import classNames from 'classnames';
import { AiFillDatabase } from 'react-icons/ai';
import { useDispatch, useSelector } from '@/store/store';
import { setEpisodeId, setServer } from '@/store/watch/slice';
import { EpisodesType, RecentType } from '@/src/../types/types';
import { TbPlayerTrackNext, TbPlayerTrackPrev } from 'react-icons/tb';
import Button from '../shared/button';
import Storage from '@/src/lib/utils/storage';
import OPlayer from '@/components/player/op-player';

type VideoProps = {
  malId: number;
  poster: string;
  episodeId: string;
  image: string;
  title: string;
  className: string;
  color: string;
  episodeNumber: number;
  nextEpisode: EpisodesType;
  prevEpisode: EpisodesType;
};

const Video = (props: VideoProps): JSX.Element => {
  const {
    malId,
    poster,
    episodeId,
    image,
    title,
    color,
    className,
    episodeNumber,
    nextEpisode,
    prevEpisode,
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
      storage.findOne<RecentType>({ animeId: animeId });

    if (list)
      typeof window !== 'undefined' &&
        storage.update(list, {
          animeId,
          title,
          episodeNumber,
          image,
          episodeId,
          color,
        });
    else
      typeof window !== 'undefined' &&
        storage.create({
          animeId,
          title,
          episodeNumber,
          image,
          episodeId,
          color,
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, episodeId]);

  return (
    <div
      className={classNames(
        'flex flex-col col-start-1 col-end-6 md:col-start-1 xl:col-start-2 md:col-end-6 w-full',
        className
      )}
    >
      <div className="h-full">
        <OPlayer episodeNumber={episodeNumber} malId={malId} poster={poster} />
        {/* {server === 'server 1' ? <PlyrComponent /> : null} */}
        {/* {server === 'server 2' ? (
          <VideoPlayer poster={poster} title={title} />
        ) : null} */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] bg-[#000] pt-5 px-3 gap-3">
        <div className="bg-[#100f0f] py-2 px-6">
          <div className="text-center text-white text-xs my-2">
            <p>You are watching</p>
            <Button type="button" className="text-[#6A55FA] mb-2 bg-none">
              {title} Episode {episodeNumber}
            </Button>
            <p>
              Click <b>Episode</b> again or Switch to alternate
            </p>
            <p>provider in case of error.</p>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-start w-full">
          <div className="flex items-center text-white gap-2">
            <AiFillDatabase className="text-white h-4 h-4" />
            <h4 className="uppercase text-xs md:text-sm font-semibold">
              providers:
            </h4>
            <Button
              disabled={server === 'server 1' ? true : false}
              // onClick={handleChangeProvider}
              onClick={() => dispatch(setServer('server 1'))}
              className="bg-[#6A55FA] p-2 text-xs rounded-md uppercase font-semibold"
            >
              server 1
            </Button>
            {/* <button
              disabled={server === 'server 2' ? true : false}
              onClick={() => dispatch(setServer('server 2'))}
              className="bg-[#6A55FA] p-2 text-xs rounded-md uppercase font-semibold"
            >
              server 2
            </button> */}
          </div>
          <div>
            <div className="flex gap-2">
              {episodeNumber !== 1 ? (
                <Button
                  onClick={() => dispatch(setEpisodeId(prevEpisode?.id))}
                  className="text-white text-xs hover:text-[#6a55fa] transition"
                >
                  <TbPlayerTrackPrev className="h-5 w-5 md:h-7 md:w-7" />
                </Button>
              ) : null}
              {episodeNumber !== totalEpisodes ? (
                <Button
                  onClick={() => dispatch(setEpisodeId(nextEpisode?.id))}
                  className="text-white text-xs hover:text-[#6a55fa] transition"
                >
                  <TbPlayerTrackNext className="h-5 w-5 md:h-7 md:w-7" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Video);
