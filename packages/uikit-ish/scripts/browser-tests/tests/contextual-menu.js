/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Clicks the demo's (first) button.
 *
 * @param {Page} page
 */
const pressTrigger = async (page) => {
  const trigger = await page.rect('button');
  await page.click([
    trigger.x + trigger.width / 2,
    trigger.y + trigger.height / 2,
  ]);
  await sleep(800);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'contextual menu: opening, the trigger turns into its preview, lifted for the menu to fit below',
    run: async (page) => {
      await page.open('contextual-menu');
      // The trigger near the viewport's bottom.
      await page.evaluate(`(() => {
        const wrapper = ${page.section}.querySelector('button').parentElement;
        wrapper.style.marginTop = (innerHeight - 40 - wrapper.getBoundingClientRect().top) + 'px';
      })()`);
      await sleep(200);
      const origin = await page.rect('button');
      await pressTrigger(page);

      const open = await page.evaluate(`(() => {
        const preview = document.querySelector(${JSON.stringify('[aria-label=Photo]')}).getBoundingClientRect();
        const menu = document.querySelector(${JSON.stringify('[role=menu]')}).getBoundingClientRect();
        return { menuBottom: menu.bottom, menuTop: menu.top, previewBottom: preview.bottom, previewTop: preview.top, viewport: innerHeight };
      })()`);
      // The menu fits below the preview (8px apart, 8px from the bottom).
      assert.ok(open.menuBottom <= open.viewport - 8 + 1, JSON.stringify(open));
      assert.ok(Math.abs(open.menuTop - open.previewBottom - 8) <= 1);
      // Lifted from the trigger's place.
      assert.ok(open.previewTop < origin.y - 1, JSON.stringify(open));

      // Closed, the trigger settles back.
      await page.key('Escape');
      await sleep(600);
      const settled = await page.rect('button');
      assert.equal(Math.round(settled.y), Math.round(origin.y));
      assert.equal(
        await page.evaluate(
          `document.querySelectorAll(${JSON.stringify('[aria-label=Photo]')}).length`,
        ),
        0,
      );
    },
  },
  {
    name: 'contextual menu: the preview aligns as the menu does, and never leaves the viewport',
    run: async (page) => {
      await page.open('contextual-menu', 'light', {
        state: [null, null, null, null, { $rest: true, align: 'start' }],
      });
      // Room around it (raw, it's at the page's start).
      await page.evaluate(
        `document.body.style.padding = ${JSON.stringify('48px')}`,
      );
      const origin = await page.rect('button');
      await pressTrigger(page);
      const preview = () =>
        page.evaluate(`(() => {
          const { bottom, left, right, top } = document.querySelector(${JSON.stringify('[aria-label=Photo]')}).parentElement.getBoundingClientRect();
          return { bottom, left, right, top, height: innerHeight, width: innerWidth };
        })()`);
      const aligned = await preview();
      assert.ok(
        Math.abs(aligned.left - origin.x) <= 1,
        JSON.stringify(aligned),
      );
      // The trigger partly above the viewport: the preview comes down.
      await page.open('contextual-menu');
      await page.evaluate(`(() => {
        const wrapper = ${page.section}.querySelector('button').parentElement;
        wrapper.style.translate = '0 ' + (-wrapper.getBoundingClientRect().top - 10) + 'px';
      })()`);
      await sleep(200);
      // (Not pressed: the demo's header covers it.)
      await page.evaluate(`${page.section}.querySelector('button').click()`);
      await sleep(800);
      const inside = await preview();
      assert.ok(inside.top >= 8 - 1, JSON.stringify(inside));
      assert.ok(inside.left >= 8 - 1 && inside.right <= inside.width - 8 + 1);
    },
  },
  {
    name: 'contextual menu: too tall for the viewport, the preview and the menu scroll together (opened with the menu in view; wheel input over the menu too)',
    run: async (page) => {
      await page.browser.send('Emulation.setDeviceMetricsOverride', {
        deviceScaleFactor: 1,
        height: 360,
        mobile: false,
        width: 1400,
      });
      try {
        await page.open('contextual-menu');
        await pressTrigger(page);
        const state = () =>
          page.evaluate(`(() => {
            const preview = document.querySelector(${JSON.stringify('[aria-label=Photo]')}).getBoundingClientRect();
            const menu = document.querySelector(${JSON.stringify('[role=menu]')}).getBoundingClientRect();
            const scroller = document.querySelector(${JSON.stringify('[data-contextual-menu-part=scroller]')});
            return { menuBottom: Math.round(menu.bottom), menuTop: Math.round(menu.top), previewBottom: Math.round(preview.bottom), previewTop: Math.round(preview.top), scrollTop: scroller ? Math.round(scroller.scrollTop) : null };
          })()`);

        // Opened: the menu in view (8px from the bottom), the preview 8px
        // above it, partly out of the viewport.
        const opened = await state();
        assert.ok(
          opened.scrollTop !== null && opened.scrollTop > 0,
          JSON.stringify(opened),
        );
        assert.equal(opened.menuBottom, 360 - 8, JSON.stringify(opened));
        assert.equal(opened.menuTop - opened.previewBottom, 8);
        assert.ok(opened.previewTop < 0, JSON.stringify(opened));

        // Scrolled back: the preview in view (8px from the top), the menu
        // (still 8px below it) partly out of it.
        await page.evaluate(
          `document.querySelector(${JSON.stringify('[data-contextual-menu-part=scroller]')}).scrollTop = 0`,
        );
        await sleep(300);
        const back = await state();
        assert.equal(back.previewTop, 8, JSON.stringify(back));
        assert.equal(back.menuTop - back.previewBottom, 8);
        assert.ok(back.menuBottom > 360, JSON.stringify(back));

        // Wheel input over the menu scrolls them.
        const menu = await page.rect('[role=menu]');
        await page.browser.send('Input.dispatchMouseEvent', {
          deltaX: 0,
          deltaY: 100,
          type: 'mouseWheel',
          x: menu.x + menu.width / 2,
          y: Math.min(menu.y + 20, 350),
        });
        await sleep(400);
        const wheeled = await state();
        assert.ok(
          wheeled.scrollTop !== null && wheeled.scrollTop > 0,
          JSON.stringify(wheeled),
        );
        assert.equal(wheeled.menuTop - wheeled.previewBottom, 8);
      } finally {
        await page.browser.send('Emulation.clearDeviceMetricsOverride');
      }
    },
  },
];
