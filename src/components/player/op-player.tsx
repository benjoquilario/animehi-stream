import React, { useRef, useEffect } from 'react';
import Player from '@oplayer/core';
import ui from '@oplayer/ui';
import hls from '@oplayer/hls';
import { Highlight } from '@oplayer/ui/dist/types';
import { useSelector } from '@/store/store';
import { AniSkip } from 'types/types';
import skipOpEd from '@/lib/player/plugin';

type PlayerProps = {
  poster: string;
  episodeNumber: number;
  malId?: number;
};

const OPlayer = (props: PlayerProps) => {
  const { poster, episodeNumber, malId } = props;
  const videoLink = useSelector(store => store.watch.videoLink);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const playerRef = useRef<Player>();
  const imagePoster = !poster
    ? undefined
    : `https://images.weserv.nl/?url=${poster}`;

  useEffect(() => {
    if (playerRef.current) return;
    playerRef.current = Player.make(
      playerContainerRef.current as HTMLDivElement,
      {
        autoplay: true,
      }
    )
      .use([
        skipOpEd(),
        ui({
          theme: { primaryColor: '#6a55fa' },
          pictureInPicture: true,
          subtitle: {
            source: [],
            fontSize: 30,
          },
          icons: {
            loadingIndicator:
              '<img class="animate-spin text-white h-12" src="/loading.svg">',
          },
        }),
        hls({ matcher: () => true }),
      ])
      .create();
  }, []);

  useEffect(() => {
    if (videoLink) {
      playerRef?.current
        ?.changeSource({
          src: videoLink,
          ...(imagePoster && {
            poster: imagePoster,
          }),
        })
        .then(() => {
          (async () => {
            if (!malId) return;

            const res = await fetch(
              `https://api.aniskip.com/v2/skip-times/${malId}/${episodeNumber}?types=op&types=recap&types=mixed-op&types=ed&types=mixed-ed&episodeLength=0`
            );

            let data = await res.json();
            data = data as AniSkip;

            const highlights: Highlight[] = [];
            let opDuration = [],
              edDuration = [];

            if (data.statusCode === 200) {
              for (let result of data.results) {
                if (result.skipType === 'op' || result.skipType === 'ed') {
                  const { startTime, endTime } = result.interval;

                  if (startTime) {
                    highlights.push({
                      time: startTime,
                      text: result.skipType === 'op' ? 'OP' : 'ED',
                    });
                    if (result.skipType === 'op') opDuration.push(startTime);
                    else edDuration.push(startTime);
                  }

                  if (endTime) {
                    highlights.push({
                      time: endTime,
                      text: result.skipType === 'op' ? 'OP' : 'ED',
                    });
                    if (result.skipType === 'op') opDuration.push(endTime);
                    else edDuration.push(endTime);
                  }
                }
              }
            }
            playerRef.current?.emit('opedchange', [opDuration, edDuration]);
            playerRef.current?.plugins.ui.highlight(highlights);
          })();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoLink]);

  return (
    <div className="relative w-full aspect-video">
      <div className="w-full h-full p-0 m-0" ref={playerContainerRef} />
    </div>
  );
};

export default React.memo(OPlayer);
