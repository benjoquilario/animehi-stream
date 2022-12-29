/*import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { useSelector } from '@/store/store';
// import { SourceType } from '@/store/watch/slice';
import progressBar from '@/components/shared/loading';
import { IVideo } from '@consumet/extensions/dist/models/types';

type VideoPlayerProps = {
  option?: any;
  getInstance?: (...args: any) => void;
  poster: string;
  title: string;
};

const VideoPlayer = ({
  option,
  getInstance,
  poster,
  title,
}: VideoPlayerProps) => {
  progressBar.finish();
  const artRef = useRef<HTMLDivElement | null>(null);
  const [videoLink, provider] = useSelector(store => [
    store.watch.videoLink,
    store.watch.provider,
  ]);
  const sources = useSelector(store => store.watch.sources);

  const handleQuality = () => {
    return sources?.map((source: IVideo) => {
      if (source.quality === '720p')
        return {
          default: true,
          url: source.url,
          html: source.quality,
        };
      else if (source.quality)
        return {
          url: source.url,
          html: source.quality,
        };
      else
        return {
          url: source.url,
          html: 'Adaptive',
        };
    });
  };

  useEffect(() => {
    console.log('Render useEffect-video-player');
    const art = new Artplayer({
      ...option,
      container: artRef.current,
      url: videoLink,
      poster: poster,
      customType: {
        m3u8: function (video: HTMLMediaElement, url: string) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else {
            art.notice.show = 'Hls is not supported';
          }
        },
      },
      quality: handleQuality(),
      title: title,
      autoSize: false,
      autoOrientation: false,
      volume: 0.5,
      isLive: false,
      muted: false,
      autoplay: true,
      pip: true,
      autoMini: true,
      screenshot: false,
      setting: true,
      loop: false,
      flip: false,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: false,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: '#6a55fa',
      lang: navigator.language.toLowerCase(),
      whitelist: ['*'],
      moreVideoAttr: {
        crossOrigin: 'anonymous',
      },
      thumbnails: {
        url: '',
        number: 60,
        column: 10,
      },
      icons: {
        loading:
          '<img class="animate-spin text-white h-12 h-12" src="/loading.svg">',
        setting: '<img class="h-6 h-6" src="/setting.svg">',
        volume: '<img class="h-6 h-6" src="/volume.svg">',
      },
    });

    if (getInstance && typeof getInstance === 'function') {
      getInstance(art);
    }

    art.on('aspectRatio', (...args) => {
      art.storage.set('aspectRatio', args[0]);
    });

    art.on('playbackRate', (...args) => {
      art.storage.set('playBackRate', args[0]);
    });

    art.on('ready', () => {
      art.aspectRatio = art.storage.get('aspectRatio');
      art.playbackRate = art.storage.get('playBackRate');
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoLink]);

  return (
    <div
      className="relative flex justify-center items-center w-full h-full"
      ref={artRef}
    ></div>
  );
};

export default React.memo(VideoPlayer);
*/

const ArtPlyr = () => {
  return <div>Plyr</div>;
};

export default ArtPlyr;
