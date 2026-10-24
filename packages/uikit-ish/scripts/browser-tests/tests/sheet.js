/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The open sheet's box (left, top, right, bottom from its screen's edges:
 * the demo's phone or tablet, or the viewport's) and corners, or null.
 *
 * @param {Page} page
 */
const sheet = (page) =>
  page.evaluate(`(() => {
    const popup = document.querySelector('[data-detent]');
    if (!popup) return null;
    const screen = popup.closest('.demo-phone, .demo-tablet');
    const frame = screen ? screen.getBoundingClientRect() : { bottom: innerHeight, left: 0, right: innerWidth, top: 0 };
    const { bottom, left, right, top } = popup.getBoundingClientRect();
    return { box: [left - frame.left, top - frame.top, frame.right - right, frame.bottom - bottom].map(Math.round), radius: getComputedStyle(popup).borderRadius, width: Math.round(right - left) };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'sheet: large (iPhone: from 10px below the top), medium (6px in, its content’s height), a form sheet in a regular width',
    run: async (page) => {
      // (In the demo's phone: compact.)
      await page.open('sheet', 'light', {
        state: [{ $rest: true, defaultOpen: true }],
      });
      await sleep(600);
      assert.deepEqual(await sheet(page), {
        box: [0, 72, 0, 0],
        radius: '38px 38px 0px 0px',
        width: 402,
      });

      await page.open('sheet', 'light', {
        state: [{ defaultOpen: true }, { detent: 'medium' }],
      });
      await sleep(600);
      const medium = await sheet(page);
      if (!medium) throw new Error('not open');
      assert.deepEqual(
        [medium.box[0], medium.box[2], medium.box[3], medium.radius],
        [6, 6, 6, '34px'],
        'to the screen’s edge, over the home indicator',
      );
      // Its content's height: shorter than its maximum (64px short of the
      // screen, its top then 64px less its bottom's 6px down).
      assert.ok(medium.box[1] > 64 - 6, 'its content’s height');

      // A regular width (a tablet's screen): a form sheet, centered.
      await page.open('sheet-composition-form-sheet');
      await page.evaluate(`${page.section}.querySelector('button').click()`);
      await sleep(800);
      const form = await sheet(page);
      if (!form) throw new Error('not open');
      assert.equal(form.radius, '38px');
      assert.ok(Math.abs(form.box[0] - form.box[2]) <= 1, 'centered');
      assert.ok(Math.abs(form.box[1] - form.box[3]) <= 1, 'centered');
      assert.ok(form.width <= 936);
    },
  },
  {
    name: 'sheet: dragged down by its header, a little: it springs back; far enough: dismissed',
    run: async (page) => {
      await page.open('sheet', 'light', {
        state: [{ $rest: true, defaultOpen: true }],
      });
      await sleep(600);
      const header = await page.rect('[data-sheet-part=header]');
      const x = header.x + header.width / 2;
      const y = header.y + 6;
      /** @param {number} distance */
      const drag = async (distance) => {
        await page.mouse('mousePressed', x, y);
        for (let step = 1; step <= 10; step += 1) {
          await page.mouse('mouseMoved', x, y + (distance * step) / 10);
          await sleep(40);
        }
        await sleep(150);
        await page.mouse('mouseReleased', x, y + distance);
        await sleep(600);
      };

      const before = await sheet(page);
      await drag(60);
      assert.deepEqual(await sheet(page), before, 'sprung back');

      await drag(500);
      assert.equal(await sheet(page), null, 'dismissed');
      assert.match(await page.log(), /open change: false/u);
    },
  },
];
