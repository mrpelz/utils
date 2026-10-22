/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The open popup, its arrow (if any), and a trigger (by its index), as
 * boxes (left, top, right, bottom).
 *
 * @param {Page} page
 * @param {number} index
 */
const boxes = (page, index) =>
  page.evaluate(`(() => {
    const box = (element) => { if (!element) return null; const { bottom, left, right, top } = element.getBoundingClientRect(); return [left, top, right, bottom].map(Math.round); };
    const popup = document.querySelector('[role=dialog]');
    return {
      arrow: box(popup.querySelector('[data-side]')),
      popup: box(popup),
      radius: getComputedStyle(popup).borderRadius,
      trigger: box(${page.section}.querySelectorAll('[aria-haspopup]')[${String(index)}]),
    };
  })()`);

/**
 * Clicks a trigger (by its index), and waits for its popup.
 *
 * @param {Page} page
 * @param {number} index
 */
const open = async (page, index) => {
  const center = await page.evaluate(`(() => {
    const { height, width, x, y } = ${page.section}.querySelectorAll('[aria-haspopup]')[${String(index)}].getBoundingClientRect();
    return [x + width / 2, y + height / 2];
  })()`);
  await page.click(/** @type {[number, number]} */ (center));
  await sleep(600);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'popover: below its trigger, its arrow pointing at its center 8px from it; without an arrow, 8px from it',
    run: async (page) => {
      await page.open('popover');
      await open(page, 0);
      const { arrow, popup, radius, trigger } = await boxes(page, 0);
      if (!arrow || !popup || !trigger) throw new Error('missing parts');
      assert.equal(radius, '13px');
      // The arrow: 56×13, its tip 8px below the trigger, at its center.
      assert.deepEqual(
        [arrow[2] - arrow[0], arrow[3] - arrow[1]],
        [56, 13],
        'its size',
      );
      assert.equal(arrow[1] - trigger[3], 8, 'its tip');
      assert.equal(arrow[3], popup[1], 'on the popup');
      assert.ok(
        Math.abs((arrow[0] + arrow[2]) / 2 - (trigger[0] + trigger[2]) / 2) <=
          1,
        'at the center',
      );
      assert.match(await page.log(), /open change: true/u);

      // Drawn by the popup's material, as one surface (its blur, fill and rim):
      // its outline with the wedge, at the arrow's center.
      const material = await page.evaluate(`(() => {
        const popup = document.querySelector('[role=dialog]');
        const arrow = popup.querySelector('[data-side]');
        const rim = getComputedStyle(popup.querySelector('[data-layer=rim]')).clipPath;
        return [getComputedStyle(popup, '::before').clipPath.includes('curve') && rim.includes('evenodd') && rim.includes('curve'), parseFloat(popup.style.getPropertyValue('--uikit-popover-nose')) === arrow.offsetLeft + arrow.offsetWidth / 2, getComputedStyle(arrow).backgroundColor];
      })()`);
      assert.deepEqual(material, [true, true, 'rgba(0, 0, 0, 0)']);

      // Without an arrow: the popup 8px below it.
      await page.key('Escape');
      await page.setState(2, { arrow: false });
      await open(page, 0);
      const plain = await boxes(page, 0);
      if (!plain.popup || !plain.trigger) throw new Error('missing parts');
      assert.equal(plain.arrow, null);
      assert.equal(plain.popup[1] - plain.trigger[3], 8);
    },
  },
  {
    name: 'popover: in a list row (align end), aligned with its trigger’s end',
    run: async (page) => {
      await page.open('popover', 'light', {
        state: [null, null, { arrow: false }],
      });
      await open(page, 1);
      const { popup, trigger } = await boxes(page, 1);
      if (!popup || !trigger) throw new Error('missing parts');
      assert.equal(popup[2], trigger[2]);
    },
  },
  {
    name: 'popover: its header 16px from its top (a 44px toolbar, 10px above the body); its title names it',
    run: async (page) => {
      await page.open('popover-overview');
      await open(page, 0);
      const header = await page.evaluate(`(() => {
        const popup = document.querySelector('[role=dialog]');
        const header = popup.querySelector('[data-popover-part=header]');
        const toolbar = header.querySelector('[data-toolbar-part=root]');
        const body = popup.querySelector('[data-popover-part=body]');
        const [p, h, t, b] = [popup, header, toolbar, body].map((element) => element.getBoundingClientRect());
        return {
          body: Math.round(b.top - t.bottom),
          name: document.getElementById(popup.getAttribute('aria-labelledby'))?.textContent,
          toolbar: [Math.round(t.top - p.top), Math.round(t.height)],
        };
      })()`);
      assert.deepEqual(header, {
        body: 10,
        name: 'Display',
        toolbar: [16, 44],
      });
    },
  },
  {
    name: 'popover: taller than its maximum height, its body scrolls below its header (the popup not overflowing)',
    run: async (page) => {
      await page.open('popover-composition-scrolling');
      await open(page, 0);
      const scroll = await page.evaluate(`(() => {
        const popup = document.querySelector('[role=dialog]');
        const body = popup.querySelector('[data-popover-part=body]');
        const [p, b] = [popup, body].map((element) => element.getBoundingClientRect());
        return [Math.round(p.height), Math.round(b.bottom - p.bottom), body.scrollHeight > body.clientHeight + 100];
      })()`);
      assert.deepEqual(scroll, [360, 0, true]);
    },
  },
  {
    name: 'popover: by a handle, triggers outside the root (their payloads its title) and an imperative open',
    run: async (page) => {
      await page.open('popover-parts-use-create-popover-handle');
      const title = () =>
        page.evaluate(
          `document.querySelector(${JSON.stringify('[role=dialog] [data-toolbar-part=title]')})?.textContent`,
        );
      await open(page, 1);
      assert.equal(await title(), 'Filter');
      assert.match(await page.log(), /open change: true \(trigger-press\)/u);
      await page.key('Escape');
      await sleep(400);
      await open(page, 0);
      assert.equal(await title(), 'Display');

      await page.open('popover-parts-create-handle');
      await page.evaluate(
        `[...${page.section}.querySelectorAll('button')].find((button) => button.textContent === 'Open Imperatively').click()`,
      );
      await sleep(600);
      const opened = await page.evaluate(`(() => {
        const popup = document.querySelector('[role=dialog]');
        const trigger = document.getElementById('popover-parts-display-trigger');
        if (!popup) return null;
        const p = popup.getBoundingClientRect(), t = trigger.getBoundingClientRect();
        return Math.abs((p.left + p.right) / 2 - (t.left + t.right) / 2) <= 1;
      })()`);
      assert.equal(opened, true, 'at its trigger');
      assert.match(
        await page.log(),
        /open change: true \(imperative-action\)/u,
      );
    },
  },
];
