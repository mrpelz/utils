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
      await page.open('viewport', 'light', {
        state: [{ $rest: true, bottomBar: true }],
      });
      const bar = await page.evaluate(`(() => {
        const field = document.querySelector('[aria-label=Message]');
        let bar = field;
        while (getComputedStyle(bar).position !== 'fixed') bar = bar.parentElement;
        return Math.round(innerHeight - bar.getBoundingClientRect().bottom);
      })()`);
      assert.equal(bar, 0);
    },
  },
];
