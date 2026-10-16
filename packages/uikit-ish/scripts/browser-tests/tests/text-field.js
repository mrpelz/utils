/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Expression for the `index`th field row's element.
 *
 * @param {number} index
 */
const field = (index) =>
  `document.querySelectorAll(${JSON.stringify('[data-text-field-part=root]')})[${index}]`;

/**
 * The center of a part of the `index`th field.
 *
 * @param {Page} page
 * @param {number} index
 * @param {string} name
 * @returns {Promise<[number, number]>}
 */
const center = (page, index, name) =>
  page.evaluate(`(() => {
    const element = ${field(index)}.querySelector(${JSON.stringify(`[data-text-field-part=${name}]`)});
    element.scrollIntoView({ block: 'center' });
    const { height, width, x, y } = element.getBoundingClientRect();
    return [x + width / 2, y + height / 2];
  })()`);

/**
 * Types text into the focused element.
 *
 * @param {Page} page
 * @param {string} text
 */
const type = async (page, text) => {
  await page.browser.send('Input.insertText', { text });
  await sleep(200);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'text field: in a list row, the label is the title, the control fills the row (its value at the end)',
    run: async (page) => {
      await page.open('list-form');
      // Not editing: the control reaches the row's end (no clear button).
      const end = await page.evaluate(`(() => {
        const row = ${field(0)};
        const control = row.querySelector('[data-text-field-part=control]');
        return [Math.round(row.getBoundingClientRect().right - control.getBoundingClientRect().right), getComputedStyle(control).textAlign];
      })()`);
      assert.deepEqual(end, [16, 'end']);

      // Editing: the clear button after it.
      await page.click(await center(page, 0, 'control'));
      await sleep(100);
      const geometry = await page.evaluate(`(() => {
        const row = ${field(0)};
        const box = row.getBoundingClientRect();
        const part = (name) => row.querySelector('[data-text-field-part=' + name + ']');
        const label = part('label').getBoundingClientRect();
        const control = part('control').getBoundingClientRect();
        const clear = part('clear').getBoundingClientRect();
        return {
          clear: Math.round(clear.left - control.right),
          control: Math.round(control.left - label.right),
          fonts: [getComputedStyle(part('label')).fontSize, getComputedStyle(part('control')).fontSize],
          height: box.height,
          label: Math.round(label.left - box.left),
          trailing: Math.round(box.right - clear.right),
        };
      })()`);
      assert.deepEqual(geometry, {
        clear: 8,
        control: 16,
        fonts: ['17px', '17px'],
        height: 52,
        label: 16,
        trailing: 16,
      });

      // Without a label, the control starts at the rows' text.
      const company = await page.evaluate(`(() => {
        const row = ${field(2)};
        return Math.round(row.querySelector('[data-text-field-part=control]').getBoundingClientRect().left - row.getBoundingClientRect().left);
      })()`);
      assert.equal(company, 16);
    },
  },
  {
    name: 'text field: the clear button shows while focused and filled, and empties the field',
    run: async (page) => {
      await page.open('list-form');
      // (In a list row, it takes no room while hidden.)
      const clear = `getComputedStyle(${field(2)}.querySelector('[data-text-field-part=clear]')).display === 'none' ? 'hidden' : 'visible'`;
      assert.equal(await page.evaluate(clear), 'hidden');

      await page.click(await center(page, 2, 'control'));
      await type(page, 'Acme');
      assert.equal(await page.evaluate(clear), 'visible');

      await page.click(await center(page, 2, 'clear'));
      await sleep(200);
      const state = await page.evaluate(`(() => {
        const control = ${field(2)}.querySelector('[data-text-field-part=control]');
        return [control.value, document.activeElement === control];
      })()`);
      assert.deepEqual(state, ['', true]);
      assert.equal(await page.evaluate(clear), 'hidden');
    },
  },
  {
    name: 'text field: an invalid email shows its error once left, in red',
    run: async (page) => {
      await page.open('list-form');
      await page.click(await center(page, 1, 'control'));
      await type(page, 'not-an-email');
      await page.click(await center(page, 0, 'label'));
      await sleep(300);

      const state = await page.evaluate(`(() => {
        const row = ${field(1)};
        const error = row.querySelector('[data-text-field-part=error]');
        return {
          color: getComputedStyle(row.querySelector('[data-text-field-part=control]')).color,
          error: error?.textContent ?? null,
          errorColor: error && getComputedStyle(error).color,
        };
      })()`);
      assert.deepEqual(state, {
        color: 'rgb(255, 56, 60)',
        error: 'Not an email address.',
        errorColor: 'rgb(255, 56, 60)',
      });
    },
  },
  {
    name: 'text field: in the demo row, the messages are below the control',
    run: async (page) => {
      await page.open('text-field');
      /** @type {[string, number][]} */
      const order = await page.evaluate(`(() => {
        const root = ${page.section}.querySelector('[data-text-field-part=root]');
        return [...root.children].filter((child) => getComputedStyle(child).display !== 'none' && child.getBoundingClientRect().height > 0).map((child) => [child.dataset.fieldPart, Math.round(child.getBoundingClientRect().top - root.getBoundingClientRect().top)]);
      })()`);
      const tops = order.map(([, top]) => top);
      assert.deepEqual(
        tops,
        tops.toSorted((a, b) => a - b),
        JSON.stringify(order),
      );
    },
  },
];
