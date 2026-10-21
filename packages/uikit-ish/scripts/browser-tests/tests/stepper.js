/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/** @param {Page} page */
const output = (page) =>
  page.evaluate(`${page.section}.querySelector('output').textContent`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'stepper: matches Figma',
    run: async (page) => {
      for (const scheme of /** @type {const} */ (['light', 'dark'])) {
        await page.open('stepper', scheme);
        const measured = await page.evaluate(`(() => {
          const group = ${page.section}.querySelector('[role=group]');
          const box = group.getBoundingClientRect();
          const [decrement, increment] = group.querySelectorAll('button');
          const separator = getComputedStyle(group, '::after');
          const symbol = increment.querySelector('svg').getBoundingClientRect();
          return {
            box: [box.width, box.height],
            halves: [decrement, increment].map((half) => half.getBoundingClientRect().width),
            radii: [getComputedStyle(decrement).borderTopLeftRadius, getComputedStyle(decrement).borderTopRightRadius],
            separator: [separator.width, separator.height, separator.top, separator.backgroundColor],
            fill: getComputedStyle(decrement).backgroundColor,
            symbol: [symbol.width, Math.round(symbol.left + symbol.width / 2 - increment.getBoundingClientRect().left)],
          };
        })()`);
        assert.deepEqual(
          measured,
          {
            box: [92, 32],
            fill:
              scheme === 'light'
                ? 'rgba(116, 116, 128, 0.08)'
                : 'rgba(118, 118, 128, 0.18)',
            halves: [46, 46],
            radii: ['100px', '0px'],
            separator: [
              '1px',
              '24px',
              '4px',
              scheme === 'light'
                ? 'rgba(60, 60, 67, 0.3)'
                : 'rgba(235, 235, 245, 0.3)',
            ],
            symbol: [14, 23],
          },
          scheme,
        );
        await page.screenshot(`stepper-${scheme}`);
      }
    },
  },
  {
    name: 'stepper: steps, disables at its limits, and steps by keyboard',
    run: async (page) => {
      await page.open('stepper');
      const [decrement, increment] = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=group] button')].map((button) => { const { height, width, x, y } = button.getBoundingClientRect(); return [x + width / 2, y + height / 2]; })`,
      );
      if (!decrement || !increment) throw new Error('missing buttons');

      await page.click(increment);
      await sleep(200);
      assert.equal(await output(page), '6');
      // Pressed: no focus ring (its input is focused, but not by keyboard).
      assert.equal(
        await page.evaluate(
          `getComputedStyle(${page.section}.querySelector('[role=group]')).outlineStyle`,
        ),
        'none',
      );

      await page.setState(0, { defaultValue: 0 });
      await sleep(300);
      const disabled = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=group] button')].map((button) => [button.disabled, getComputedStyle(button).color])`,
      );
      assert.deepEqual(disabled, [
        [true, 'rgba(60, 60, 67, 0.3)'],
        [false, 'rgb(0, 0, 0)'],
      ]);

      // Its hidden input takes focus (ringing the capsule); arrows step.
      await page.evaluate(
        `${page.section}.querySelector('[role=group] input').focus()`,
      );
      await page.key('ArrowUp');
      assert.equal(await output(page), '1');
      assert.equal(
        await page.evaluate(
          `getComputedStyle(${page.section}.querySelector('[role=group]')).outlineStyle`,
        ),
        'solid',
      );
    },
  },
  {
    name: 'stepper: its value shown by the app and its input’s text share a format; Home and End go to its limits',
    run: async (page) => {
      await page.open('stepper-composition-value');
      const input = `${page.section}.querySelector('[data-stepper-part=input]')`;
      const shown = () =>
        page.evaluate(
          `[${page.section}.querySelector('output').textContent, ${input}.value]`,
        );
      assert.deepEqual(await shown(), ['100%', '100%']);

      await page.evaluate(
        `${page.section}.querySelectorAll('[role=group] button')[1].click()`,
      );
      await sleep(200);
      assert.deepEqual(await shown(), ['125%', '125%'], 'a step of 0.25');

      await page.evaluate(`${input}.focus()`);
      await page.key('End');
      await sleep(100);
      assert.deepEqual(await shown(), ['200%', '200%'], 'End: max');
      await page.key('Home');
      await sleep(100);
      assert.deepEqual(await shown(), ['50%', '50%'], 'Home: min');
    },
  },
  {
    name: 'stepper: in a form, in Base UI’s field, its value is submitted by name',
    run: async (page) => {
      await page.open('stepper-composition-form');
      await page.evaluate(
        `${page.section}.querySelectorAll('[role=group] button')[1].click()`,
      );
      await sleep(200);
      await page.evaluate(
        `${page.section}.querySelector('button[type=submit]').click()`,
      );
      await sleep(300);
      assert.match(await page.log(), /submitted: \{"quantity":2\}/u);
    },
  },
  {
    name: 'stepper: its halves are out of the tab order (its input is the stop)',
    run: async (page) => {
      await page.open('stepper-parts-root');
      assert.deepEqual(
        await page.evaluate(
          `[...${page.section}.querySelectorAll('[role=group] button')].map((button) => button.tabIndex)`,
        ),
        [-1, -1],
      );
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('[data-stepper-part=input]').getAttribute('aria-label')`,
        ),
        'Quantity',
      );
    },
  },
];
