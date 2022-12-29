//github.com/shiyiya/oplayer/issues/41

import { $ } from '@oplayer/core';

/**
 *
 * @param options [op end time, ed start time]
 * @returns PlayerPlugin
 */

const skipOpEd = () => ({
  name: 'skip-op-ed-plugin',
  // @ts-ignore
  apply: player => {
    const pos = $.css(`
      display: none;
      position: absolute;
      bottom: 4em;
      right: 0px;
      margin-right: 1.5em;
      z-index: 1;`);

    const area = $.css(`
      color: #fff;
      background: rgba(28 ,28 ,28 , 0.9);
      padding: 0.5em 1.5em;
      border-radius: 4px;
      font-size: 1.5em;
      cursor: pointer;`);

    const $dom = $.create(`div.${pos}`, {}, `<div class=${area}>Skip</div>`);
    // @ts-expect-error
    let durations = [];

    $dom.onclick = function () {
      // @ts-ignore
      let [opDuration, edDuration] = durations;

      if (
        opDuration?.length &&
        player.currentTime >= opDuration[0] &&
        player.currentTime <= opDuration[1]
      ) {
        player.seek(opDuration[1]);
      }

      if (
        edDuration?.length &&
        player.currentTime >= edDuration[0] &&
        player.currentTime <= edDuration[1]
      ) {
        player.seek(edDuration[1]);
      }
    };

    player.on(['timeupdate', 'seeked'], () => {
      // @ts-ignore
      let [opDuration, edDuration] = durations;

      let timeInRange = false;
      if (
        (opDuration?.length &&
          player.currentTime >= opDuration[0] &&
          player.currentTime <= opDuration[1]) ||
        (edDuration?.length &&
          player.currentTime >= edDuration[0] &&
          player.currentTime <= edDuration[1])
      )
        timeInRange = true;

      if (!timeInRange) $dom.style.display = 'none';
      else $dom.style.display = 'block';
    });

    // @ts-ignore
    player.on('opedchange', ({ payload }) => {
      durations = payload;
    });

    player.on('videosourcechange', () => {
      durations = [];
    });

    $.render($dom, player.$root);
  },
});

export default skipOpEd;
