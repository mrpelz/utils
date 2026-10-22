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
    name: 'contextual menu: opening, the trigger turns into its preview, lifted within its frame (its screen) for the menu to fit below',
    run: async (page) => {
      await page.open('contextual-menu');
      // The trigger near its frame's bottom.
      await page.evaluate(`(() => {
        const frame = ${page.section}.querySelector('.sheet-demo-phone').getBoundingClientRect();
        const wrapper = ${page.section}.querySelector('button').parentElement;
        wrapper.style.top = (frame.bottom - 40 - wrapper.getBoundingClientRect().bottom) + 'px';
      })()`);
      await sleep(200);
      const origin = await page.rect('button');
      await pressTrigger(page);

      const open = await page.evaluate(`(() => {
        const frame = ${page.section}.querySelector('.sheet-demo-phone').getBoundingClientRect();
        const preview = document.querySelector(${JSON.stringify('[data-contextual-menu-part=preview]')}).getBoundingClientRect();
        const menu = document.querySelector(${JSON.stringify('[role=menu]')}).getBoundingClientRect();
        return { frameBottom: frame.bottom, menuBottom: menu.bottom, menuTop: menu.top, previewBottom: preview.bottom, previewTop: preview.top };
      })()`);
      // The menu fits below the preview (8px apart, 8px from the frame's
      // bottom).
      assert.ok(
        Math.abs(open.menuBottom - (open.frameBottom - 8)) <= 1,
        JSON.stringify(open),
      );
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
          `document.querySelectorAll(${JSON.stringify('[data-contextual-menu-part=preview]')}).length`,
        ),
        0,
      );
    },
  },
  {
    name: 'contextual menu: the preview aligns as the menu does, and never leaves its frame (its screen)',
    run: async (page) => {
      await page.open('contextual-menu', 'light', {
        state: [null, null, null, null, { $rest: true, align: 'start' }],
      });
      const origin = await page.rect('button');
      await pressTrigger(page);
      const preview = () =>
        page.evaluate(`(() => {
          const frame = ${page.section}.querySelector('.sheet-demo-phone').getBoundingClientRect();
          const { bottom, left, right, top, width } = document.querySelector(${JSON.stringify('[data-contextual-menu-part=preview]')}).getBoundingClientRect();
          return { bottom, frameLeft: frame.left, frameRight: frame.right, frameTop: frame.top, left, right, top, width };
        })()`);
      // At the trigger's start, unless that would leave the frame (8px in).
      const aligned = await preview();
      assert.ok(
        Math.abs(
          aligned.left -
            Math.min(origin.x, aligned.frameRight - 8 - aligned.width),
        ) <= 1,
        JSON.stringify(aligned),
      );

      // The trigger partly above its frame: the preview comes down.
      await page.open('contextual-menu');
      await page.evaluate(`(() => {
        const frame = ${page.section}.querySelector('.sheet-demo-phone').getBoundingClientRect();
        const wrapper = ${page.section}.querySelector('button').parentElement;
        wrapper.style.translate = '0 ' + (frame.top - wrapper.getBoundingClientRect().top - 10) + 'px';
      })()`);
      await sleep(200);
      await page.evaluate(`${page.section}.querySelector('button').click()`);
      await sleep(800);
      const inside = await preview();
      assert.ok(inside.top >= inside.frameTop + 8 - 1, JSON.stringify(inside));
      assert.ok(
        inside.left >= inside.frameLeft + 8 - 1 &&
          inside.right <= inside.frameRight - 8 + 1,
        JSON.stringify(inside),
      );
    },
  },
  {
    name: 'contextual menu: too tall for its frame (its screen), the preview and the menu scroll together (opened with the menu in view; wheel input over the menu too)',
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
            const frame = ${page.section}.querySelector('.sheet-demo-phone').getBoundingClientRect();
            const preview = document.querySelector(${JSON.stringify('[data-contextual-menu-part=preview]')}).getBoundingClientRect();
            const menu = document.querySelector(${JSON.stringify('[role=menu]')}).getBoundingClientRect();
            const scroller = document.querySelector(${JSON.stringify('[data-contextual-menu-part=scroller]')});
            return { frameBottom: Math.round(frame.bottom), frameTop: Math.round(frame.top), menuBottom: Math.round(menu.bottom), menuTop: Math.round(menu.top), previewBottom: Math.round(preview.bottom), previewTop: Math.round(preview.top), scrollTop: scroller ? Math.round(scroller.scrollTop) : null };
          })()`);

        // Opened: the menu in its frame (8px from the bottom), the preview
        // 8px above it, partly out of the frame.
        const opened = await state();
        assert.ok(
          opened.scrollTop !== null && opened.scrollTop > 0,
          JSON.stringify(opened),
        );
        assert.equal(
          opened.menuBottom,
          opened.frameBottom - 8,
          JSON.stringify(opened),
        );
        assert.equal(opened.menuTop - opened.previewBottom, 8);
        assert.ok(opened.previewTop < opened.frameTop, JSON.stringify(opened));

        // Scrolled back: the preview in the frame (8px from its top), the
        // menu (still 8px below it) partly out of it.
        await page.evaluate(
          `document.querySelector(${JSON.stringify('[data-contextual-menu-part=scroller]')}).scrollTop = 0`,
        );
        await sleep(300);
        const back = await state();
        assert.equal(back.previewTop, back.frameTop + 8, JSON.stringify(back));
        assert.equal(back.menuTop - back.previewBottom, 8);
        assert.ok(back.menuBottom > back.frameBottom, JSON.stringify(back));

        // Wheel input over the menu scrolls them.
        const menu = await page.rect('[role=menu]');
        await page.browser.send('Input.dispatchMouseEvent', {
          deltaX: 0,
          deltaY: 100,
          type: 'mouseWheel',
          x: menu.x + menu.width / 2,
          y: Math.min(menu.y + 20, back.frameBottom - 10),
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
  {
    name: 'contextual menu: a handle opens it imperatively, lifting its trigger; its backdrop blurs only its frame',
    run: async (page) => {
      await page.open('contextual-menu-parts-create-handle');
      const button = await page.rect('button', 1);
      await page.click([
        button.x + button.width / 2,
        button.y + button.height / 2,
      ]);
      await sleep(800);
      const opened = await page.evaluate(`(() => {
        const frame = ${page.section}.querySelector('.sheet-demo-phone').getBoundingClientRect();
        const backdrop = document.querySelector('[data-contextual-menu-part=backdrop]').getBoundingClientRect();
        const trigger = document.querySelector('[data-contextual-menu-part=trigger]');
        return {
          backdrop: [backdrop.left - frame.left, backdrop.top - frame.top, backdrop.width - frame.width, backdrop.height - frame.height].map(Math.round),
          lifted: trigger.hasAttribute('data-lifted'),
          menu: Boolean(document.querySelector('[role=menu]')),
        };
      })()`);
      assert.deepEqual(opened, {
        backdrop: [0, 0, 0, 0],
        lifted: true,
        menu: true,
      });
    },
  },
];
