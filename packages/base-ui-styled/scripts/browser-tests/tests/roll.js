/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The columns' selected rows, and whether they're centered.
 *
 * @param {Page} page
 * @returns {Promise<[string | null, string | undefined, boolean][]>}
 */
const columns = (page) =>
  page.evaluate(`[...${page.section}.querySelectorAll('[role=listbox]')].map((column) => {
    const selected = column.querySelector('[aria-selected=true]');
    const box = column.getBoundingClientRect();
    const row = selected.getBoundingClientRect();
    return [column.getAttribute('aria-label'), selected?.textContent, Math.abs(row.top + row.height / 2 - (box.top + box.height / 2)) < 1];
  })`);

/**
 * A column's selected row (see `columns`).
 *
 * @param {Page} page
 * @param {number} index
 */
const column = async (page, index) => {
  const all = await columns(page);
  return all[index];
};

/**
 * A column's center.
 *
 * @param {Page} page
 * @param {number} index
 * @returns {Promise<[number, number]>}
 */
const center = (page, index) =>
  page.evaluate(`(() => {
    const { height, width, x, y } = ${page.section}.querySelectorAll('[role=listbox]')[${index}].getBoundingClientRect();
    return [x + width / 2, y + height / 2];
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'roll: rows and band (Framework7, UIKit metrics), centered selection',
    run: async (page) => {
      await page.open('roll');
      const metrics = await page.evaluate(`(() => {
        const root = ${page.section}.querySelector('[role=listbox]').closest('[data-roll-part=column]').parentElement;
        const band = getComputedStyle(root, '::before');
        const row = ${page.section}.querySelector('[role=option]');
        return [root.getBoundingClientRect().height, band.height, band.top, band.borderRadius, row.getBoundingClientRect().height, getComputedStyle(row).fontSize];
      })()`);
      assert.deepEqual(metrics, [216, '34px', '91px', '8px', 34, '22px']);
      assert.deepEqual(await columns(page), [
        ['Hours', '9', true],
        ['Minutes', '41', true],
        ['Fruit', 'Cherry', true],
      ]);
    },
  },
  {
    name: 'roll: scrolling, dragging and pressing rows select them',
    run: async (page) => {
      await page.open('roll');
      const [x, y] = await center(page, 0);

      // The wheel: 3 rows on.
      await page.browser.send('Input.dispatchMouseEvent', {
        deltaX: 0,
        deltaY: 102,
        type: 'mouseWheel',
        x,
        y,
      });
      await sleep(900);
      assert.deepEqual(await column(page, 0), ['Hours', '12', true]);

      // Dragged with a mouse, slowly: 2 rows back.
      await page.mouse('mousePressed', x, y);
      for (let step = 1; step <= 17; step += 1) {
        await page.mouse('mouseMoved', x, y + step * 4);
        await sleep(40);
      }
      await sleep(200);
      await page.mouse('mouseReleased', x, y + 68);
      await sleep(900);
      assert.deepEqual(await column(page, 0), ['Hours', '10', true]);

      // A press on a row: it's scrolled to.
      await page.click([x, y - 34]);
      await sleep(900);
      assert.deepEqual(await column(page, 0), ['Hours', '9', true]);
      assert.match(
        await page.evaluate(
          `${page.section}.querySelector('config').textContent`,
        ),
        /hours: 12.*hours: 10.*hours: 9/su,
      );
    },
  },
  {
    name: 'roll: keys move the selection, past disabled rows',
    run: async (page) => {
      await page.open('roll');
      await page.evaluate(
        `${page.section}.querySelectorAll('[role=listbox]')[2].focus()`,
      );
      await page.key('ArrowDown');
      await sleep(900);
      assert.deepEqual(await column(page, 2), ['Fruit', 'Elderberry', true]);

      // Scrolled onto “Durian” (disabled), it moves on.
      const [x, y] = await center(page, 2);
      await page.browser.send('Input.dispatchMouseEvent', {
        deltaX: 0,
        deltaY: -34,
        type: 'mouseWheel',
        x,
        y,
      });
      await sleep(1200);
      const [, fruit, centered] = (await column(page, 2)) ?? [];
      assert.notEqual(fruit, 'Durian');
      assert.equal(centered, true);
    },
  },
  {
    name: 'roll: editable columns take typed numbers',
    run: async (page) => {
      await page.open('roll');
      // The selected row (pressed): a numeric text field in its place.
      await page.click(await center(page, 0));
      await sleep(300);
      assert.deepEqual(
        await page.evaluate(
          '[document.activeElement.tagName, document.activeElement.inputMode, document.activeElement.value]',
        ),
        ['INPUT', 'numeric', '9'],
      );
      await page.browser.send('Input.insertText', { text: '17' });
      await page.key('Enter');
      await sleep(900);

      // Typing a digit on a focused column, too (“07” matches 7).
      await page.evaluate(
        `${page.section}.querySelectorAll('[role=listbox]')[1].focus()`,
      );
      await page.key('0');
      await sleep(200);
      await page.browser.send('Input.insertText', { text: '7' });
      await page.key('Enter');
      await sleep(900);

      assert.deepEqual(
        [await column(page, 0), await column(page, 1)],
        [
          ['Hours', '17', true],
          ['Minutes', '07', true],
        ],
      );
    },
  },
];
