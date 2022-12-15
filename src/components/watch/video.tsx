import React from 'react';
import VideoPlayer from './video-player';
import classNames from 'classnames';
import { AiFillDatabase } from 'react-icons/ai';
import { useDispatch, useSelector } from '@/store/store';
import { setProviders, setEpisodeId } from '@/store/watch/slice';
import { useRouter } from 'next/router';
import { extractEpisode } from '@/utils/index';
import { EpisodesType } from '@/src/../types/types';
import { TbPlayerTrackNext, TbPlayerTrackPrev } from 'react-icons/tb';

type VideoProps = {
  poster: string;
  title: string;
  className: string;
  episodeNumber: number;
  nextEpisode: EpisodesType;
  prevEpisode: EpisodesType;
};

const Video = ({
  poster,
  title,
  className,
  episodeNumber,
  nextEpisode,
  prevEpisode,
}: VideoProps): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [provider, totalEpisodes] = useSelector(store => [
    store.watch.provider,
    store.watch.totalEpisodes,
  ]);
  // const  = useSelector(store => );

  // const handleChangeProvider = (event: any) => {
  //   const text = event.target.innerText;
  //   const currentNumber = extractEpisode(router.query.episode as string);
  //   const currentEpisode = episodes.find(ep => ep.number === currentNumber);
  //   dispatch(setEpisodeId(currentEpisode.id));
  //   dispatch(setProviders(text.toLowerCase()));

  //   console.log(currentEpisode);
  // };

  return (
    <div
      className={classNames(
        'flex flex-col col-start-1 col-end-6 md:col-start-2 md:col-end-6 w-full h-[394px] md:h-[550px] min-h-[394px] md:min-h-[550px]',
        className
      )}
    >
      <div className="h-full md:h-[80%]">
        <VideoPlayer poster={poster} title={title} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] bg-[#000] pt-5 px-3 gap-3">
        <div className="bg-[#100f0f] py-2 px-6">
          <div className="text-center text-white text-xs my-2">
            <p>You are watching</p>
            <p className="text-[#6A55FA] mb-2">
              {title} Episode {episodeNumber}
            </p>
            <p>Switch to alternate provider or click episode</p>
            <p>again in case of error.</p>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-start w-full">
          <div className="flex items-center text-white gap-2">
            <AiFillDatabase className="text-white h-4 h-4" />
            <h4 className="uppercase text-sm font-semibold">providers:</h4>
            <button
              disabled={provider === 'gogoanime' ? true : false}
              // onClick={handleChangeProvider}
              className="bg-[#6A55FA] p-2 text-xs rounded-md uppercase font-semibold"
            >
              gogoanime
            </button>
          </div>
          <div>
            <div className="flex gap-2">
              {episodeNumber !== 1 ? (
                <button
                  onClick={() => dispatch(setEpisodeId(prevEpisode?.id))}
                  className="text-white text-xs hover:text-[#6a55fa] transition"
                >
                  <TbPlayerTrackPrev className="h-7 w-7" />
                </button>
              ) : null}
              {episodeNumber !== totalEpisodes ? (
                <button
                  onClick={() => dispatch(setEpisodeId(nextEpisode?.id))}
                  className="text-white text-xs hover:text-[#6a55fa] transition"
                >
                  <TbPlayerTrackNext className="h-7 w-7" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Video);
