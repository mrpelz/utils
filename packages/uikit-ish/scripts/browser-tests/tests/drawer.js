/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The open drawer's distances to the window's sides (closed: none).
 *
 * @param {Page} page
 * @returns {Promise<[number, number] | null>}
 */
const box = (page) =>
  page.evaluate(`(() => {
    const popup = document.querySelector('[data-drawer-part=popup]');
    if (!popup || popup.hasAttribute('data-closed')) return null;
    const { left, right } = popup.getBoundingClientRect();
    return [Math.round(left), Math.round(innerWidth - right)];
  })()`);

/**
 * Clicks an element's center.
 *
 * @param {Page} page
 * @param {string} selector
 */
const press = async (page, selector) => {
  const { height, width, x, y } = await page.rect(selector);
  await page.click([x + width / 2, y + height / 2]);
  await sleep(500);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'drawer: swiped in from its edge (either side), closed by a tap outside it; its trigger opens it, its close closes it',
    run: async (page) => {
      for (const side of ['inline-start', 'inline-end']) {
        await page.open('drawer-overview', 'light', {
          state: [{ $rest: true, side }],
        });
        assert.equal(await box(page), null, `${side} closed`);

        // Swiped in from its edge (its swipe area).
        const edge = await page.rect('[data-drawer-part=swipe-area]');
        const y = edge.y + edge.height / 2;
        const x = edge.x + edge.width / 2;
        const toward = side === 'inline-start' ? 1 : -1;
        await page.mouse('mousePressed', x, y);
        for (let step = 1; step <= 6; step += 1) {
          await page.mouse('mouseMoved', x + toward * step * 40, y);
          await sleep(30);
        }
        await page.mouse('mouseReleased', x + toward * 240, y);
        await sleep(600);
        const opened = await box(page);
        assert.equal(
          opened?.[side === 'inline-start' ? 0 : 1],
          0,
          `${side} open: ${JSON.stringify(opened)}`,
        );
        assert.match(await page.log(), /open: true/u);

        // A tap outside it (on the other side) closes it.
        const width = await page.evaluate('innerWidth');
        await page.click([side === 'inline-start' ? width - 20 : 20, y]);
        await sleep(600);
        assert.equal(await box(page), null, `${side} closed by a tap`);

        // Its trigger opens it, its close closes it.
        await press(page, '[aria-label=Contacts]');
        assert.notEqual(await box(page), null, `${side} opened`);
        await press(page, '[data-drawer-part=popup] button');
        assert.equal(await box(page), null, `${side} closed by its close`);
      }
    },
  },
];
