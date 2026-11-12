/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { rightClick, sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Opens the demo's (first) button's menu: a secondary click (its
 * `openOn` by default).
 *
 * @param {Page} page
 */
const pressTrigger = async (page) => {
  const trigger = await page.rect('button');
  await rightClick(page, [
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
      await page.open('contextual-menu', 'light', { isFramed: true });
      // The trigger near its frame's bottom.
      await page.evaluate(`(() => {
        const frame = ${page.section}.querySelector('.demo-phone').getBoundingClientRect();
        const wrapper = ${page.section}.querySelector('button').parentElement;
        wrapper.style.top = (frame.bottom - 40 - wrapper.getBoundingClientRect().bottom) + 'px';
      })()`);
      await sleep(200);
      const origin = await page.rect('button');
      await pressTrigger(page);

      const open = await page.evaluate(`(() => {
        const frame = ${page.section}.querySelector('.demo-phone').getBoundingClientRect();
        const preview = document.querySelector(${JSON.stringify('[data-contextual-menu-part=preview]')}).getBoundingClientRect();
        const menu = document.querySelector(${JSON.stringify('[role=menu]')}).getBoundingClientRect();
        const inset = parseFloat(getComputedStyle(${page.section}.querySelector('.demo-phone')).getPropertyValue('--uikit-safe-area-inset-bottom')) || 0;
        return { frameBottom: frame.bottom - inset, menuBottom: menu.bottom, menuTop: menu.top, previewBottom: preview.bottom, previewTop: preview.top };
      })()`);
      // The menu fits below the preview (8px apart, 8px from the frame's
      // bottom, above its safe area).
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
        isFramed: true,
        state: [null, null, null, null, { $rest: true, align: 'start' }],
      });
      const origin = await page.rect('button');
      await pressTrigger(page);
      const preview = () =>
        page.evaluate(`(() => {
          const frame = ${page.section}.querySelector('.demo-phone').getBoundingClientRect();
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
      await page.open('contextual-menu', 'light', { isFramed: true });
      await page.evaluate(`(() => {
        const frame = ${page.section}.querySelector('.demo-phone').getBoundingClientRect();
        const wrapper = ${page.section}.querySelector('button').parentElement;
        wrapper.style.translate = '0 ' + (frame.top - wrapper.getBoundingClientRect().top - 10) + 'px';
      })()`);
      await sleep(200);
      await pressTrigger(page);
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
    name: 'contextual menu: too tall for its frame (its screen), the menu takes the room below the preview and scrolls (wheel input too), the preview in place',
    run: async (page) => {
      await page.browser.send('Emulation.setDeviceMetricsOverride', {
        deviceScaleFactor: 1,
        height: 360,
        mobile: false,
        width: 1400,
      });
      try {
        await page.open('contextual-menu', 'light', { isFramed: true });
        await pressTrigger(page);
        // (The frame's room: within its safe areas, and the window, the
        // frame taller than it here.)
        const state = () =>
          page.evaluate(`(() => {
            const phone = ${page.section}.querySelector('.demo-phone');
            const frame = phone.getBoundingClientRect();
            const inset = (edge) => parseFloat(getComputedStyle(phone).getPropertyValue('--uikit-safe-area-inset-' + edge)) || 0;
            const preview = document.querySelector(${JSON.stringify('[data-contextual-menu-part=preview]')}).getBoundingClientRect();
            const popup = document.querySelector(${JSON.stringify('[role=menu]')});
            const menu = popup.getBoundingClientRect();
            return { bottom: Math.round(Math.min(frame.bottom, innerHeight) - inset('bottom')), menuBottom: Math.round(menu.bottom), menuTop: Math.round(menu.top), overflow: popup.scrollHeight - popup.clientHeight, previewBottom: Math.round(preview.bottom), previewTop: Math.round(preview.top), scrollTop: Math.round(popup.scrollTop), top: Math.round(frame.top + inset('top')) };
          })()`);

        // Opened: the preview 8px into the frame, the menu 8px below it,
        // to 8px from the frame's bottom, scrolling.
        const opened = await state();
        assert.ok(
          Math.abs(opened.previewTop - (opened.top + 8)) <= 1,
          JSON.stringify(opened),
        );
        assert.equal(opened.menuTop - opened.previewBottom, 8);
        assert.ok(
          Math.abs(opened.menuBottom - (opened.bottom - 8)) <= 1,
          JSON.stringify(opened),
        );
        assert.ok(opened.overflow > 0, JSON.stringify(opened));

        // Wheel input over the menu scrolls it, the preview in place.
        const menu = await page.rect('[role=menu]');
        await page.browser.send('Input.dispatchMouseEvent', {
          deltaX: 0,
          deltaY: 100,
          type: 'mouseWheel',
          x: menu.x + menu.width / 2,
          y: menu.y + 20,
        });
        await sleep(400);
        const wheeled = await state();
        assert.ok(wheeled.scrollTop > 0, JSON.stringify(wheeled));
        assert.equal(wheeled.previewTop, opened.previewTop);
        assert.equal(wheeled.menuTop - wheeled.previewBottom, 8);
      } finally {
        await page.browser.send('Emulation.clearDeviceMetricsOverride');
      }
    },
  },
  {
    name: 'contextual menu: a handle opens it imperatively, lifting its trigger; its backdrop blurs only its frame',
    run: async (page) => {
      await page.open('contextual-menu-parts-create-handle', 'light', {
        isFramed: true,
      });
      const button = await page.rect('button', 1);
      await page.click([
        button.x + button.width / 2,
        button.y + button.height / 2,
      ]);
      await sleep(800);
      const opened = await page.evaluate(`(() => {
        const frame = ${page.section}.querySelector('.demo-phone').getBoundingClientRect();
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
