/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep, withTouch } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The open tooltip (its box and style), and its trigger's box.
 *
 * @param {Page} page
 */
const tooltip = (page) =>
  page.evaluate(`(() => {
    const box = (element) => { const { height, left, top, width } = element.getBoundingClientRect(); return [left, top, width, height].map(Math.round); };
    // (Not its positioner, of role presentation.)
    const popup = document.querySelector('[data-side][data-open]:not([role])');
    const trigger = box(${page.section}.querySelector('button'));
    if (!popup) return { trigger };
    const style = getComputedStyle(popup);
    return { popup: box(popup), style: [style.padding, style.borderRadius, style.fontSize], trigger };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'tooltip: on hover, a glass capsule above its trigger, 8px away; held open; not on touch',
    run: async (page) => {
      // (Its default delay: 300ms.)
      await page.open('tooltip');
      const button = await page.rect('button');
      const center = /** @type {[number, number]} */ ([
        button.x + button.width / 2,
        button.y + button.height / 2,
      ]);

      // Not on touch.
      await withTouch(page, async (touch) => {
        await touch('touchStart', ...center);
        await sleep(50);
        await touch('touchEnd');
      });
      await sleep(400);
      const touched = await tooltip(page);
      assert.equal(touched.popup, undefined, 'not on touch');

      // Onto it.
      await page.mouse('mouseMoved', 1, 1);
      await page.mouse('mouseMoved', ...center);
      // (After its delay, scaled in.)
      await sleep(900);
      const { popup, style, trigger } = await tooltip(page);
      if (!popup) throw new Error('not open');
      assert.deepEqual(style, ['6px 12px', '16px', '15px']);
      assert.equal(popup[3], 32, 'one line');
      assert.equal(trigger[1] - (popup[1] + popup[3]), 8, '8px above');
      // Centered on it, or (as here, the trigger at the viewport's edge) 8px
      // from that.
      assert.ok(
        Math.abs(popup[0] + popup[2] / 2 - (trigger[0] + trigger[2] / 2)) <=
          1 || popup[0] === 8,
        `centered: ${popup.join(', ')} / ${trigger.join(', ')}`,
      );

      // Held open, without hovering.
      await page.open('tooltip', 'light', { state: [{ open: true }] });
      await sleep(400);
      const held = await tooltip(page);
      assert.ok(held.popup, 'held open');
    },
  },
];
