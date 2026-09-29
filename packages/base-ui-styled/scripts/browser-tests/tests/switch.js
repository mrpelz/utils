/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Opens the switch demo and returns helpers around its switch.
 *
 * @param {Page} page
 */
const setup = async (page) => {
  await page.open('switch');

  const { height, width, x, y } = await page.rect('[role=switch]');
  const centerY = y + height / 2;
  /** Knob center when off / on (2px inset, 39px knob). */
  const off = /** @type {[number, number]} */ ([x + 21.5, centerY]);
  const on = /** @type {[number, number]} */ ([x + width - 21.5, centerY]);

  await page.evaluate(`(() => {
    window.__switchChanges = 0;
    new MutationObserver(() => { window.__switchChanges += 1; }).observe(
      ${page.section}.querySelector('[role=switch]'),
      { attributeFilter: ['aria-checked'] },
    );
  })()`);

  /** @returns {Promise<{ changes: number, checked: boolean }>} */
  const state = async () => {
    const result = await page.evaluate(`({
      changes: window.__switchChanges,
      checked: ${page.section}.querySelector('[role=switch]').getAttribute('aria-checked') === 'true',
    })`);
    await page.evaluate('window.__switchChanges = 0');
    return result;
  };

  return { off, on, state };
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'switch: a tap toggles once',
    run: async (page) => {
      const { off, state } = await setup(page);

      await page.click(off);
      await sleep(400);
      assert.deepEqual(await state(), { changes: 1, checked: true });
    },
  },
  {
    name: 'switch: dragging across the middle flips once, knob follows',
    run: async (page) => {
      const { off, on, state } = await setup(page);

      /** @type {number[]} */
      const offsets = [];
      /** @type {string[]} */
      const pressed = [];

      await page.drag(off, on, {
        duration: 800,
        onStep: async (x, _y, step) => {
          offsets.push(
            await page.evaluate(`(() => {
              const knob = ${page.section}.querySelector('[role=switch]').firstElementChild.getBoundingClientRect();
              return knob.x + knob.width / 2 - ${x};
            })()`),
          );
          pressed.push(
            await page.evaluate(
              `getComputedStyle(${page.section}.querySelector('[role=switch]')).getPropertyValue('--styled-switch-pressed').trim()`,
            ),
          );
          if (step === 7) await page.screenshot('switch-dragging');
        },
      });
      await sleep(400);

      assert.deepEqual(await state(), { changes: 1, checked: true });
      assert.ok(
        offsets.every((offset) => Math.abs(offset) <= 1),
        `knob center - pointer: ${offsets.map((offset) => Math.round(offset)).join(', ')}`,
      );
      assert.ok(
        pressed.every((value) => value === '1'),
        `pressed (lens) during the drag: ${pressed.join(', ')}`,
      );
    },
  },
  {
    name: 'switch: a slow drag short of the middle changes nothing',
    run: async (page) => {
      const { off, state } = await setup(page);

      await page.drag(off, [off[0] + 6, off[1]], { duration: 600, steps: 2 });
      await sleep(400);
      assert.deepEqual(await state(), { changes: 0, checked: false });
    },
  },
  {
    name: 'switch: a quick flick towards the other side toggles',
    run: async (page) => {
      const { off, state } = await setup(page);

      await page.drag(off, [off[0] + 6, off[1]], { duration: 60, steps: 1 });
      await sleep(400);
      assert.deepEqual(await state(), { changes: 1, checked: true });
    },
  },
];
