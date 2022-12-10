import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { useSelector } from '@/store/store';
import { SourceType } from '@/store/watch/slice';
import progressBar from '../shared/loading';
import { CORS_PROXY } from '@/utils/config';

const VideoPlayer = ({ option, getInstance, poster, title }: any) => {
  progressBar.finish();
  const artRef = useRef<HTMLDivElement | null>(null);
  const videoLink = useSelector(store => store.watch.videoLink);
  const sources = useSelector(store => store.watch.sources);
  const provider = useSelector(store => store.watch.provider);

  const handleQuality = () => {
    return sources?.map((source: SourceType) => {
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
            art.notice.show = 'Does not support playback of m3u8';
          }
        },
      },
      title: title,
      quality: handleQuality(),
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
      flip: true,
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
    });

    if (getInstance && typeof getInstance === 'function') {
      getInstance(art);
    }

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
