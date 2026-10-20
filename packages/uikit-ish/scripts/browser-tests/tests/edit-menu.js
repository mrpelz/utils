/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep, withTouch } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

const popup = `document.querySelector(${JSON.stringify('[role=menu]')})`;

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
      overflowing: scroller.parentElement.hasAttribute('data-overflowing'),
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
        await page.open('edit-menu', 'light', {
          state: [{ $rest: true, open: true }],
        });
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
          assert.equal(
            scrolled.scrolled,
            scrolled.range,
            'scrolled to the end',
          );
          assert.equal(scrolled.moreEnd, 4, 'the “more” button stays');
          // No action scrolls beneath it: the scroller ends before it.
          assert.ok(
            await page.evaluate(`(() => {
              const scroller = ${popup}.querySelector('[data-menu-part=scroller]').getBoundingClientRect();
              const more = ${popup}.querySelector('[aria-haspopup=menu]').getBoundingClientRect();
              return scroller.right <= more.left + 0.5;
            })()`),
            'nothing beneath the “more” button',
          );
          assert.equal(await page.evaluate(highlighted), 'AutoFill');

          await touch('touchEnd');
          await sleep(500);
        });

        // Released on the last action, it's chosen (closing the menu,
        // reported as an item press).
        assert.match(await page.log(), /open change: false\/item-press/);
      } finally {
        await page.browser.send('Emulation.clearDeviceMetricsOverride');
      }
    },
  },
  {
    name: 'edit menu: with room, the capsule does not scroll',
    run: async (page) => {
      await page.open('edit-menu', 'light', {
        state: [{ $rest: true, open: true }],
      });
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
  {
    name: 'edit menu: only ends with more actions beyond are faded',
    run: async (page) => {
      await page.browser.send('Emulation.setDeviceMetricsOverride', {
        deviceScaleFactor: 1,
        height: 800,
        mobile: false,
        width: 320,
      });
      try {
        await page.open('edit-menu', 'light', {
          state: [{ $rest: true, open: true }],
        });
        await sleep(500);

        const fades = () =>
          page.evaluate(`(() => {
            const scroller = ${popup}.querySelector('[data-menu-part=scroller]');
            return ['data-before', 'data-after'].map((name) => scroller.parentElement.hasAttribute(name));
          })()`);
        assert.deepEqual(await fades(), [false, true], 'at the start');

        await page.evaluate(
          `${popup}.querySelector('[data-menu-part=scroller]').scrollLeft = 1e4`,
        );
        await sleep(200);
        assert.deepEqual(await fades(), [true, false], 'at the end');
      } finally {
        await page.browser.send('Emulation.clearDeviceMetricsOverride');
      }
    },
  },
  {
    name: 'edit menu: touching “more” opens its submenu, keeping the selection',
    run: async (page) => {
      await page.open('edit-menu');
      const { height, width, x, y } = await page.rect('p');
      await page.drag(
        [x + 10, y + height / 4],
        [x + width - 10, y + height / 2],
      );
      await sleep(1500);

      /** @type {[number, number]} */
      const more = await page.evaluate(`(() => {
        const { height, width, x, y } = ${popup}.querySelector('[aria-haspopup=menu]').getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.evaluate(
        `document.addEventListener(${JSON.stringify('touchstart')}, (event) => { window.touchKept = event.defaultPrevented; }, { once: true })`,
      );
      await withTouch(page, async (touch) => {
        await touch('touchStart', ...more);
        await sleep(100);
        await touch('touchEnd');
        await sleep(800);
      });

      const state = await page.evaluate(`({
        kept: window.touchKept,
        menus: document.querySelectorAll('[role=menu]').length,
        selected: String(document.getSelection()).length > 20,
      })`);
      assert.deepEqual(state, { kept: true, menus: 2, selected: true });
    },
  },
  {
    name: 'edit menu: clicking “more” keeps the selection; moving from its submenu back to an action keeps the menu',
    run: async (page) => {
      await page.open('edit-menu');
      const { height, width, x, y } = await page.rect('p');
      await page.drag([x + 10, y + 8], [x + width - 10, y + height / 2]);
      await sleep(1200);

      /** @param {string} selector */
      const center = (selector) =>
        /** @type {Promise<[number, number]>} */ (
          page.evaluate(`(() => {
            const { height, width, x, y } = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
            return [x + width / 2, y + height / 2];
          })()`)
        );
      /** @param {[number, number]} point (hovering: no button pressed) */
      const hover = ([pointX, pointY]) =>
        page.browser.send('Input.dispatchMouseEvent', {
          button: 'none',
          buttons: 0,
          type: 'mouseMoved',
          x: pointX,
          y: pointY,
        });
      const menus = () =>
        page.evaluate(
          `document.querySelectorAll(${JSON.stringify('[role=menu]')}).length`,
        );

      const more = await center('[data-edit-menu-part=more]');
      await hover(more);
      await page.click(more);
      await sleep(800);
      assert.equal(await menus(), 2, 'submenu open');
      const selection = await page.evaluate('String(document.getSelection())');
      assert.ok(selection.length > 20, 'selection kept');

      // Into the submenu (straight down from “more”), then back to an action.
      const action = await center('[data-edit-menu-part=item]');
      const submenuItem = await center(
        '[role=menu]:not(:has([data-edit-menu-part])) [role=menuitem]',
      );
      for (const point of [
        [more[0], submenuItem[1]],
        submenuItem,
        [submenuItem[0], action[1]],
        action,
      ]) {
        await hover(/** @type {[number, number]} */ (point));
        await sleep(150);
      }
      await sleep(800);
      assert.equal(await menus(), 1, 'the edit menu stays, its submenu closed');
    },
  },
  {
    name: 'edit menu: pressing outside closes it, also where the selection stays',
    run: async (page) => {
      await page.open('edit-menu');
      const menus = `document.querySelectorAll(${JSON.stringify('[role=menu]')}).length`;
      const [x, y, width, height] = await page.evaluate(`(() => {
        const text = ${page.section}.querySelector('p');
        text.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = text.getBoundingClientRect();
        return [x, y, width, height];
      })()`);

      await page.drag([x + 5, y + 8], [x + 120, y + 8], { duration: 300 });
      await sleep(800);
      assert.equal(await page.evaluate(menus), 1, 'open');

      // Where nothing can be selected (made so here: all but the text), the
      // selection stays as the press lands: the menu closes all the same.
      await page.evaluate(`(() => {
        document.documentElement.style.userSelect = 'none';
        ${page.section}.querySelector('p').style.userSelect = 'text';
      })()`);
      await page.click([x + width / 2, y + height + 60]);
      await sleep(600);
      assert.equal(await page.evaluate(menus), 0, 'closed');
      assert.notEqual(
        await page.evaluate('String(document.getSelection())'),
        '',
      );
    },
  },
];
