/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The opened demo's page control's current page (from 1).
 *
 * @param {Page} page
 * @returns {Promise<number>}
 */
const current = (page) =>
  page.evaluate(
    `Number(${page.section}.querySelector('[role=slider]').getAttribute('aria-valuenow'))`,
  );

/**
 * A point on the page control: `offset` px from its start or end, centered.
 *
 * @param {Page} page
 * @param {'start' | 'end'} side
 * @param {number} offset
 * @returns {Promise<[number, number]>}
 */
const at = async (page, side, offset) => {
  const { height, width, x, y } = await page.rect('[role=slider]');
  return [side === 'start' ? x + offset : x + width - offset, y + height / 2];
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'page control: a press beside the current dot steps a page (track-press); keys step, Home and End jump (keyboard)',
    run: async (page) => {
      await page.open('page-control-parts-page-control');

      await page.click(await at(page, 'end', 30));
      await sleep(200);
      assert.equal(await current(page), 2, 'pressed after');
      assert.match(await page.log(), /page change: 1 \(track-press\)/u);

      await page.click(await at(page, 'start', 30));
      await sleep(200);
      assert.equal(await current(page), 1, 'pressed before');

      await page.evaluate(
        `${page.section}.querySelector('[role=slider]').focus()`,
      );
      await page.key('ArrowRight');
      await sleep(100);
      assert.equal(await current(page), 2, 'arrow');
      assert.match(await page.log(), /page change: 1 \(keyboard\)/u);
      await page.key('End');
      await sleep(100);
      assert.equal(await current(page), 5, 'End');
      await page.key('Home');
      await sleep(100);
      assert.equal(await current(page), 1, 'Home');
    },
  },
  {
    name: 'page control: dragged across, it scrubs a page per dot passed (drag); its click doesn’t step again',
    run: async (page) => {
      await page.open('page-control-parts-page-control');
      const from = await at(page, 'start', 28);
      // Three dots on (16px each: a dot and its gap).
      await page.drag(from, [from[0] + 48, from[1]], { duration: 300 });
      await sleep(200);
      assert.equal(await current(page), 4);
      const log = await page.log();
      assert.match(log, /\(drag\)/u);
      assert.doesNotMatch(log, /track-press/u);
    },
  },
  {
    name: 'page control: controlled, it shows the app’s page only; disabled, it ignores presses and keys',
    run: async (page) => {
      await page.open('page-control-parts-page-control', 'light', {
        state: [{ $rest: true, value: 1 }],
      });
      assert.equal(await current(page), 2);
      await page.click(await at(page, 'end', 30));
      await sleep(200);
      // Asked to go on (the app doesn't), it stays.
      assert.match(await page.log(), /page change: 2 \(track-press\)/u);
      assert.equal(await current(page), 2, 'controlled');

      await page.setState(0, { disabled: true, value: undefined });
      await sleep(200);
      const before = await page.log();
      await page.click(await at(page, 'end', 30));
      await page.evaluate(
        `${page.section}.querySelector('[role=slider]').focus()`,
      );
      await page.key('ArrowRight');
      await sleep(200);
      assert.equal(await page.log(), before, 'no change while disabled');
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('[role=slider]').tabIndex`,
        ),
        -1,
      );
    },
  },
  {
    name: 'page control: over paged content, the dots scroll the pages, and follow their scroll',
    run: async (page) => {
      await page.open('page-control-composition-paged');
      const pages = `${page.section}.querySelector('.page-control-demo-pages')`;

      await page.click(await at(page, 'end', 4));
      await sleep(800);
      assert.equal(
        await page.evaluate(
          `Math.round(${pages}.scrollLeft / ${pages}.clientWidth)`,
        ),
        1,
        'scrolled to the next page',
      );

      await page.evaluate(
        `${pages}.scrollTo({ behavior: 'instant', left: ${pages}.clientWidth * 3 })`,
      );
      await sleep(300);
      assert.equal(await current(page), 4, 'the dots follow');
    },
  },
];
