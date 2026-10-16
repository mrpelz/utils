/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The open sheet (its panel, its actions' boxes), and its trigger's box.
 *
 * @param {Page} page
 */
const sheet = (page) =>
  page.evaluate(`(() => {
    const box = (element) => { const { height, left, top, width } = element.getBoundingClientRect(); return [left, top, width, height].map(Math.round); };
    const popup = document.querySelector('[role=dialog]');
    if (!popup) return null;
    return {
      actions: [...popup.querySelectorAll('[data-alert-part=action]')].map(box),
      panel: [box(popup), getComputedStyle(popup).borderRadius],
      viewport: [innerWidth, innerHeight],
    };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'action sheet: an alert’s panel at the viewport’s center, its actions stacked; an action, or a press outside, closes it',
    run: async (page) => {
      await page.open('action-sheet');
      /** Opens it by its trigger. */
      const show = async () => {
        const trigger = await page.rect('[aria-haspopup]');
        await page.click([
          trigger.x + trigger.width / 2,
          trigger.y + trigger.height / 2,
        ]);
        await sleep(600);
      };
      await show();
      const open = await sheet(page);
      if (!open) throw new Error('not open');
      const [[left, top, width, height], radius] = open.panel;
      assert.deepEqual([width, radius], [300, '34px']);
      // Centered.
      assert.ok(Math.abs(left + width / 2 - open.viewport[0] / 2) <= 1);
      assert.ok(Math.abs(top + height / 2 - open.viewport[1] / 2) <= 1);
      // Stacked, 10px apart, 48px high, the panel's width (14px in).
      const [first, second] = open.actions;
      if (!first || !second) throw new Error('missing actions');
      assert.equal(open.actions.length, 4);
      assert.equal(second[1] - (first[1] + first[3]), 10);
      assert.deepEqual([first[2], first[3]], [272, 48]);

      await page.click([second[0] + second[2] / 2, second[1] + second[3] / 2]);
      await sleep(500);
      assert.equal(await sheet(page), null, 'closed');
      assert.match(await page.log(), /action: Action 2/u);

      // A press outside it.
      await show();
      await page.click([5, open.viewport[1] - 5]);
      await sleep(500);
      assert.equal(await sheet(page), null, 'dismissed');
    },
  },
];
