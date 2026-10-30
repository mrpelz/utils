/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { mapped, sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The selection circles of the opened demo: their size, border, fill and
 * which glyph shows (checkmark, dash, none).
 *
 * @param {Page} page
 * @returns {Promise<{ background: string, border: string, glyph: 'check' | 'dash' | null, size: number[] }[]>}
 */
const circles = (page) =>
  page.evaluate(`[...${page.section}.querySelectorAll('[data-checkbox-part=select-circle]')].map((circle) => {
    const style = getComputedStyle(circle);
    const { height, width } = circle.getBoundingClientRect();
    const shown = (glyph) => {
      const element = circle.querySelector('[data-glyph=' + glyph + ']');
      return Boolean(element) && getComputedStyle(element).display !== 'none';
    };
    return {
      background: style.backgroundColor,
      border: style.borderTopWidth + ' ' + style.borderTopColor,
      glyph: shown('check') ? 'check' : shown('dash') ? 'dash' : null,
      size: [width, height].map(Math.round),
    };
  })`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'checkbox: a 22px selection circle: unselected in a gray border, selected in the tint with a checkmark, mixed with a dash; clicking toggles it',
    run: async (page) => {
      await page.open('checkbox', 'light', {
        state: [{ $rest: true, onCheckedChange: mapped('[log change]') }],
      });
      const [unchecked] = await circles(page);
      assert.deepEqual(unchecked, {
        background: 'rgba(0, 0, 0, 0)',
        // systemGray3, 1.5px (snapped to device pixels: 1px at 1x).
        border: '1px rgb(199, 199, 204)',
        glyph: null,
        size: [22, 22],
      });

      const rect = await page.rect('[data-checkbox-part=select-circle]');
      await page.click([rect.x + rect.width / 2, rect.y + rect.height / 2]);
      await sleep(100);
      const [checked] = await circles(page);
      assert.equal(checked?.background, 'rgb(0, 136, 255)');
      assert.equal(checked?.glyph, 'check');
      assert.match(await page.log(), /checked change: true/u);

      // Its hit area is 44px (HIG): a click 20px from its center hits it.
      await page.click([
        rect.x + rect.width / 2 + 20,
        rect.y + rect.height / 2,
      ]);
      await sleep(100);
      const [toggled] = await circles(page);
      assert.equal(toggled?.glyph, null, 'hit area');

      await page.setState(0, { indeterminate: true });
      const [mixed] = await circles(page);
      assert.equal(mixed?.glyph, 'dash');
      assert.equal(mixed?.background, 'rgb(0, 136, 255)');
    },
  },
  {
    name: 'checkbox (radio): radios in a group select one at a time, as selection circles',
    run: async (page) => {
      await page.open('checkbox-radio', 'light', {
        state: [{ $rest: true, onValueChange: mapped('[log change]') }],
      });
      const initial = await circles(page);
      assert.deepEqual(
        initial.map(({ glyph }) => glyph),
        ['check', null, null],
      );

      const phone = await page.evaluate(`(() => {
        const { height, width, x, y } = ${page.section}.querySelectorAll('[data-checkbox-part=select-circle]')[1].getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(/** @type {[number, number]} */ (phone));
      await sleep(100);
      const selected = await circles(page);
      assert.deepEqual(
        selected.map(({ glyph }) => glyph),
        [null, 'check', null],
      );
      assert.match(await page.log(), /value change: phone/u);
    },
  },
];
