/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Expression for the slider's first thumb element (the thumb input's parent).
 *
 * @param {Page} page
 */
const thumb = (page) =>
  `${page.section}.querySelector('input[type=range]').parentElement`;

/**
 * Focuses the slider's first thumb and presses a key.
 *
 * @param {Page} page
 * @param {string} key
 */
const press = async (page, key) => {
  await page.evaluate(
    `${page.section}.querySelector('input[type=range]').focus()`,
  );
  await page.key(key);
};

/**
 * Widths of the track and its fill (the track's first child).
 *
 * @param {Page} page
 * @returns {Promise<{ fill: number, track: number }>}
 */
const widths = (page) =>
  page.evaluate(`(() => {
    const track = ${thumb(page)}.parentElement;
    return {
      fill: track.firstElementChild.getBoundingClientRect().width,
      track: track.getBoundingClientRect().width,
    };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'slider: fill spans the track at min and max',
    run: async (page) => {
      await page.open('slider');

      await press(page, 'Home');
      const min = await widths(page);
      assert.ok(min.fill < 0.5, `fill at min: ${min.fill}`);

      await press(page, 'End');
      const max = await widths(page);
      assert.ok(
        Math.abs(max.fill - max.track) < 0.5,
        `fill ${max.fill} vs track ${max.track} at max`,
      );
    },
  },
  {
    name: 'slider: thumb rests flush with the track end after a drag',
    run: async (page) => {
      await page.open('slider');

      // Change the value while in the (scaled) dragging state, which is when
      // Base UI measures the thumb.
      await page.evaluate(`${thumb(page)}.setAttribute('data-dragging', '')`);
      await sleep(400);
      await press(page, 'End');
      await page.evaluate(`${thumb(page)}.removeAttribute('data-dragging')`);
      await sleep(400);
      await page.screenshot('slider-max');

      const edges = await page.evaluate(`(() => {
        const element = ${thumb(page)};
        return {
          thumb: element.getBoundingClientRect().right,
          track: element.parentElement.getBoundingClientRect().right,
        };
      })()`);
      assert.ok(
        Math.abs(edges.thumb - edges.track) < 1,
        `thumb right ${edges.thumb} vs track right ${edges.track}`,
      );
    },
  },
  {
    name: 'slider: vertical track fills its control',
    run: async (page) => {
      await page.open('slider');
      await page.setControl('orientation', 'vertical');

      const track = await page.evaluate(`(() => {
        const { height, width } = ${thumb(page)}.parentElement.getBoundingClientRect();
        return { height, width };
      })()`);
      assert.ok(track.height > 100, `vertical track height ${track.height}`);
      assert.equal(Math.round(track.width), 6);
    },
  },
];
