/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The open sheet (its panel, its actions' boxes), its trigger's box (if
 * any), and its screen's (its container).
 *
 * @param {Page} page
 */
const sheet = (page) =>
  page.evaluate(`(() => {
    const box = (element) => { if (!element) return null; const { height, left, top, width } = element.getBoundingClientRect(); return [left, top, width, height].map(Math.round); };
    const popup = document.querySelector('[role=dialog]');
    if (!popup) return null;
    return {
      actions: [...popup.querySelectorAll('[data-action-sheet-part=action]')].map(box),
      backdrop: box(document.querySelector('[data-action-sheet-part=backdrop]')),
      panel: [box(popup), getComputedStyle(popup).borderRadius],
      screen: box(document.querySelector('.sheet-demo-phone')),
      trigger: box(document.querySelector('[aria-haspopup]')),
    };
  })()`);

/**
 * Opens it by its trigger.
 *
 * @param {Page} page
 */
const show = async (page) => {
  const trigger = await page.rect('[aria-haspopup]');
  await page.click([
    trigger.x + trigger.width / 2,
    trigger.y + trigger.height / 2,
  ]);
  await sleep(700);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'action sheet: an alert’s panel 8px below its trigger, centered on it, its actions stacked; an action, or a press outside, closes it',
    run: async (page) => {
      await page.open('action-sheet-overview');
      await show(page);
      const open = await sheet(page);
      if (!open?.trigger || !open.screen || !open.backdrop) {
        throw new Error('not open');
      }
      const [[left, top, width], radius] = open.panel;
      assert.deepEqual([width, radius], [300, '34px']);
      const [triggerLeft, triggerTop, triggerWidth, triggerHeight] =
        open.trigger;
      assert.equal(top - (triggerTop + triggerHeight), 8, 'below it');
      assert.ok(
        Math.abs(left + width / 2 - (triggerLeft + triggerWidth / 2)) <= 1,
        'centered on it',
      );
      assert.deepEqual(open.backdrop, open.screen, 'its backdrop fills it');
      // Stacked, 10px apart, 48px high, the panel's width (14px in).
      const [first, second] = open.actions;
      if (!first || !second) throw new Error('missing actions');
      assert.equal(second[1] - (first[1] + first[3]), 10);
      assert.deepEqual([first[2], first[3]], [272, 48]);

      await page.click([second[0] + second[2] / 2, second[1] + second[3] / 2]);
      await sleep(500);
      assert.equal(await sheet(page), null, 'closed');
      assert.match(await page.log(), /action: remove from album/u);

      // A press outside it.
      await show(page);
      await page.click([open.screen[0] + 5, open.screen[1] + 60]);
      await sleep(500);
      assert.equal(await sheet(page), null, 'dismissed');
      assert.match(await page.log(), /open change: false \(outside-press\)/u);
    },
  },
  {
    name: 'action sheet: opened without a trigger, at its container’s bottom, above its safe area',
    run: async (page) => {
      await page.open('action-sheet-composition-app');
      await page.evaluate(`${page.section}.querySelector('button').click()`);
      await sleep(700);
      const open = await sheet(page);
      if (!open?.screen) throw new Error('not open');
      const [left, top, width, height] = open.panel[0];
      const [screenLeft, , screenWidth] = open.screen;
      const screenBottom = open.screen[1] + open.screen[3];
      const inset = await page.evaluate(
        `parseFloat(getComputedStyle(document.querySelector(${JSON.stringify('.sheet-demo-phone')})).getPropertyValue(${JSON.stringify('--uikit-safe-area-inset-bottom')}))`,
      );
      assert.equal(screenBottom - (top + height), inset + 8);
      assert.ok(
        Math.abs(left + width / 2 - (screenLeft + screenWidth / 2)) <= 1,
        'centered',
      );
    },
  },
];
