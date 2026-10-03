/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep, withTouch } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

const popup = `document.querySelector('[role=menu]')`;

/**
 * The capsule's geometry: its width, whether its actions overflow (and
 * scroll), and where the “more” button is.
 *
 * @param {Page} page
 */
const capsule = (page) =>
  page.evaluate(`(() => {
    const popup = ${popup};
    const scroller = popup.querySelector('[data-menu-part=scroller]');
    const more = popup.querySelector('[aria-haspopup=menu]').getBoundingClientRect();
    const box = popup.getBoundingClientRect();
    return {
      moreEnd: Math.round(box.right - more.right),
      overflowing: scroller.hasAttribute('data-overflowing'),
      right: box.right,
      scrolled: Math.round(scroller.scrollLeft),
      range: Math.round(scroller.scrollWidth - scroller.clientWidth),
      width: box.width,
    };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'edit menu: never wider than its boundary, the actions scroll by touch drags',
    run: async (page) => {
      await page.browser.send('Emulation.setDeviceMetricsOverride', {
        deviceScaleFactor: 1,
        height: 800,
        mobile: false,
        width: 320,
      });
      try {
        await page.open('edit-menu');
        await page.setControl('open', true);
        // At this width, the demo's controls cover the stage.
        await page.evaluate(
          `${page.section}.querySelector('config').style.visibility = 'hidden'`,
        );
        await sleep(500);

        const before = await capsule(page);
        assert.ok(before.width <= 320, `width ${before.width}`);
        assert.ok(before.right <= 320, `right ${before.right}`);
        assert.equal(before.overflowing, true);
        assert.equal(before.moreEnd, 4);

        // Touching an action highlights it; dragging to the end (short of
        // the “more” button) scrolls the actions under the finger, the
        // “more” button staying in place.
        /** @type {[number, number]} */
        const first = await page.evaluate(`(() => {
          const { height, width, x, y } = ${popup}.querySelector('[role=menuitem]').getBoundingClientRect();
          return [x + width / 2, y + height / 2];
        })()`);
        const end = await page.evaluate(
          `${popup}.querySelector('[aria-haspopup=menu]').getBoundingClientRect().left - 12`,
        );
        const highlighted = `${popup}.querySelector('[role=menuitem][data-highlighted]')?.textContent`;

        await withTouch(page, async (touch) => {
          await touch('touchStart', ...first);
          await sleep(100);
          assert.equal(await page.evaluate(highlighted), 'Cut');

          for (let step = 1; step <= 8; step += 1) {
            await touch(
              'touchMove',
              first[0] + ((end - first[0]) * step) / 8,
              first[1],
            );
            await sleep(30);
          }
          await sleep(1500);

          const scrolled = await capsule(page);
          assert.equal(scrolled.scrolled, scrolled.range, 'scrolled to the end');
          assert.equal(scrolled.moreEnd, 4, 'the “more” button stays');
          assert.equal(await page.evaluate(highlighted), 'AutoFill');

          await touch('touchEnd');
          await sleep(500);
        });

        // Released on the last action, it's chosen (closing the menu,
        // reported as an item press).
        assert.match(
          await page.evaluate(
            `${page.section}.querySelector('config').textContent`,
          ),
          /open change: false\/item-press/,
        );
      } finally {
        await page.browser.send('Emulation.clearDeviceMetricsOverride');
      }
    },
  },
  {
    name: 'edit menu: with room, the capsule does not scroll',
    run: async (page) => {
      await page.open('edit-menu');
      await page.setControl('open', true);
      await sleep(500);

      const state = await capsule(page);
      assert.equal(state.overflowing, false);
      assert.equal(state.moreEnd, 4);
      assert.equal(
        await page.evaluate(
          `getComputedStyle(${popup}.querySelector('[data-menu-part=scroller]')).overflowX`,
        ),
        'visible',
      );
    },
  },
];
