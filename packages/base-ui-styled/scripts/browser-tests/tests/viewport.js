/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The demo's metrics, by their terms.
 *
 * @param {Page} page
 * @returns {Promise<Record<string, string>>}
 */
const metrics = (page) =>
  page.evaluate(
    `Object.fromEntries([...${page.section}.querySelectorAll('dt')].map((term) => [term.textContent, term.nextElementSibling.textContent]))`,
  );

/**
 * One of the demo's metrics.
 *
 * @param {Page} page
 * @param {string} term
 */
const metric = async (page, term) => {
  const all = await metrics(page);
  return all[term];
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'viewport: the visual viewport, as custom properties',
    run: async (page) => {
      await page.open('viewport');
      const [properties, size] = await page.evaluate(`(() => {
        const style = document.documentElement.style;
        return [['height', 'width', 'top', 'keyboard-inset'].map((name) => style.getPropertyValue('--styled-viewport-' + name)), [innerWidth, innerHeight]];
      })()`);
      assert.deepEqual(properties, [
        `${size[1]}px`,
        `${size[0]}px`,
        '0px',
        '0px',
      ]);
      assert.equal(await metric(page, 'Keyboard'), '0px');
    },
  },
  {
    name: 'viewport: scroll tracking turns past a threshold',
    run: async (page) => {
      await page.open('viewport');
      // Something to scroll (raw, the page is as high as the demo).
      await page.evaluate(
        `document.body.style.minHeight = ${JSON.stringify('300vh')}`,
      );
      const scrollBy = async (/** @type {number} */ distance) => {
        await page.evaluate(`window.scrollBy(0, ${distance})`);
        await sleep(150);
      };

      await scrollBy(200);
      assert.equal(await metric(page, 'Scrolling'), 'down');
      // Jitter (under 8px) doesn't turn it.
      await scrollBy(-5);
      assert.equal(await metric(page, 'Scrolling'), 'down');
      await scrollBy(-20);
      assert.equal(await metric(page, 'Scrolling'), 'up');
      assert.match(
        await page.log(),
        /scrolling down at \d+px.*scrolling up at \d+px/su,
      );
    },
  },
  {
    name: 'viewport: bars at the visual viewport',
    run: async (page) => {
      await page.open('viewport-bar');
      const bar = await page.evaluate(`(() => {
        const field = document.querySelector('[aria-label=Message]');
        let bar = field;
        while (getComputedStyle(bar).position !== 'fixed') bar = bar.parentElement;
        return Math.round(innerHeight - bar.getBoundingClientRect().bottom);
      })()`);
      assert.equal(bar, 0);
    },
  },
  {
    name: 'viewport: anchors at each edge, the content layer; the keyboard pushes (or covers) them',
    run: async (page) => {
      const shown = { $rest: true, shown: true };
      await page.open('viewport-anchors', 'light', {
        state: [shown, shown, shown, shown, shown],
      });
      /** @returns {Promise<{ bottom: number[], layer: number[], leading: number[], top: number[], trailing: number[] }>} */
      const boxes = () =>
        page.evaluate(`(() => {
          const box = (element) => { const { bottom, left, right, top } = element.getBoundingClientRect(); return [left, top, innerWidth - right, innerHeight - bottom].map(Math.round); };
          const sample = (text) => box([...document.querySelectorAll('div')].find((element) => element.textContent === text && getComputedStyle(element.parentElement).position === 'fixed').parentElement);
          const layer = [...document.querySelectorAll('div')].find((element) => getComputedStyle(element).position === 'fixed' && getComputedStyle(element).overflowY === 'auto');
          return { bottom: sample('Bottom'), layer: box(layer), leading: sample('Leading'), top: sample('Top'), trailing: sample('Trailing') };
        })()`);

      // [left, top, right, bottom] distances to the viewport's edges.
      const at = await boxes();
      assert.deepEqual(at.top.slice(0, 3), [0, 0, 0], 'top');
      assert.deepEqual([at.bottom[0], at.bottom[2], at.bottom[3]], [0, 0, 0]);
      assert.deepEqual(
        [at.leading[0], at.leading[1], at.leading[3]],
        [0, 0, 0],
      );
      assert.deepEqual(
        [at.trailing[1], at.trailing[2], at.trailing[3]],
        [0, 0, 0],
      );
      assert.deepEqual(at.layer, [0, 0, 0, 0], 'layer');

      // A keyboard (as the provider sets it): above it, the bottom bar, the
      // sides and the (resized) layer.
      await page.evaluate(
        `document.documentElement.style.setProperty(${JSON.stringify('--styled-viewport-keyboard-inset')}, '300px')`,
      );
      await sleep(100);
      const keyboard = await boxes();
      assert.equal(keyboard.bottom[3], 300, 'pushed');
      assert.equal(keyboard.leading[3], 300, 'sides');
      assert.equal(keyboard.layer[3], 300, 'resized');

      await page.setState(1, { keyboard: 'cover' });
      await page.setState(4, { keyboard: 'overlay' });
      await sleep(100);
      const covered = await boxes();
      assert.equal(covered.bottom[3], 0, 'covered');
      assert.equal(covered.layer[3], 0, 'overlaid');

      // Right to left: leading is the right.
      await page.evaluate(
        `document.documentElement.dir = ${JSON.stringify('rtl')}`,
      );
      await sleep(100);
      const rtl = await boxes();
      assert.equal(rtl.leading[2], 0, 'leading at the right');
      assert.equal(rtl.trailing[0], 0, 'trailing at the left');
    },
  },
];
