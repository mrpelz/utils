/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { mapped, sleep } from '../lib.js';

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
    name: 'switch: on/off labels sit beside the knob, each on its side',
    run: async (page) => {
      await page.open('switch', 'light', {
        state: [{ $rest: true, onOffLabels: true }],
      });

      const labels = await page.evaluate(`(() => {
        const root = ${page.section}.querySelector('[role=switch]');
        const box = root.getBoundingClientRect();
        const [on, off] = [...root.querySelectorAll('[aria-hidden=true]')].map((label) => {
          const style = getComputedStyle(label, '::before');
          const rect = label.getBoundingClientRect();
          return [style.width, style.height, Math.round((rect.left + rect.width / 2 - box.left) * 2) / 2];
        });
        return { off, on };
      })()`);
      // Centered in the track beside the knob (64 - 39 - 2px wide).
      assert.deepEqual(labels, {
        off: ['9px', '9px', 52.5],
        on: ['1px', '9px', 11.5],
      });

      // Hidden while pressed (the knob a lens).
      const { height, width, x, y } = await page.rect('[role=switch]');
      await page.mouse('mousePressed', x + width / 2, y + height / 2);
      await sleep(500);
      const pressed = await page.evaluate(
        `[...${page.section}.querySelectorAll('[data-switch-part=label]')].map((label) => getComputedStyle(label).opacity)`,
      );
      await page.mouse('mouseReleased', x + width / 2, y + height / 2);
      assert.deepEqual(pressed, ['0', '0']);
    },
  },
  {
    name: 'switch: indeterminate, the knob sits in the middle, the input is indeterminate',
    run: async (page) => {
      await page.open('switch', 'light', {
        state: [{ $rest: true, indeterminate: true }],
      });
      await sleep(500);

      const state = await page.evaluate(`(() => {
        const root = ${page.section}.querySelector('[role=switch]');
        const box = root.getBoundingClientRect();
        const knob = root.firstElementChild.getBoundingClientRect();
        return {
          center: Math.round(knob.left + knob.width / 2 - (box.left + box.width / 2)),
          input: ${page.section}.querySelector('input[type=checkbox]').indeterminate,
        };
      })()`);
      assert.deepEqual(state, { center: 0, input: true });

      // Neither label while neither on nor off.
      await page.setState(0, { onOffLabels: true });
      assert.deepEqual(
        await page.evaluate(
          `[...${page.section}.querySelectorAll('[data-switch-part=label]')].map((label) => getComputedStyle(label).opacity)`,
        ),
        ['0', '0'],
      );
    },
  },
  {
    name: 'switch: demo: indeterminate for two seconds after a change',
    run: async (page) => {
      const { off } = await setup(page);
      await page.setState(0, {
        onCheckedChange: mapped('[indeterminate for 2s]'),
      });

      /** @returns {Promise<number>} the knob's center, from the track's */
      const knob = () =>
        page.evaluate(`(() => {
          const root = ${page.section}.querySelector('[role=switch]');
          const box = root.getBoundingClientRect();
          const rect = root.firstElementChild.getBoundingClientRect();
          return Math.round(rect.left + rect.width / 2 - (box.left + box.width / 2));
        })()`);

      await page.click(off);
      await sleep(800);
      assert.equal(await knob(), 0, 'in the middle');
      await sleep(2000);
      assert.equal(await knob(), 11, 'on');
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('[role=switch]').getAttribute('aria-checked')`,
        ),
        'true',
      );
    },
  },
  {
    name: 'switch: tint replaces the on color, also of the pressed glow',
    run: async (page) => {
      await page.open('switch', 'light', {
        state: [{ $rest: true, defaultChecked: true }],
      });
      const colors = () =>
        page.evaluate(`(() => {
          const root = ${page.section}.querySelector('[role=switch]');
          return [getComputedStyle(root, '::before').backgroundColor, getComputedStyle(root.firstElementChild, '::before').boxShadow];
        })()`);

      const [track, glow] = await colors();
      assert.equal(track, 'rgb(52, 199, 89)');
      await page.setState(0, { tint: '#000' });
      const [tinted, tintedGlow] = await colors();
      assert.equal(tinted, 'rgb(0, 0, 0)');
      assert.notEqual(tintedGlow, glow, 'the glow follows');
    },
  },
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
              `getComputedStyle(${page.section}.querySelector('[role=switch]')).getPropertyValue('--uikit-switch-pressed').trim()`,
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
