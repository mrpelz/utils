/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

// Tokens and component styles that differ by color scheme: a root token, a
// glass context following the color scheme (segmented control) and a
// component's own dark value (its highlight).
const probe = (/** @type {string} */ section) => `(() => {
  const root = getComputedStyle(document.documentElement);
  const group = ${section}.querySelector('[role=radiogroup]');
  const highlight = [...group.children].find((child) => getComputedStyle(child).backgroundColor === 'rgb(255, 255, 255)' || getComputedStyle(child).backgroundColor === 'rgb(108, 108, 113)');
  return {
    colorScheme: root.colorScheme,
    glass: getComputedStyle(group).getPropertyValue('--styled-glass-content').trim(),
    highlight: highlight ? getComputedStyle(highlight).backgroundColor : undefined,
    label: root.getPropertyValue('--color-ios-label').trim(),
  };
})()`;

const light = {
  glass: '#404040',
  highlight: 'rgb(255, 255, 255)',
  label: 'rgb(0 0 0)',
};

const dark = {
  glass: '#bfbfbf',
  highlight: 'rgb(108, 108, 113)',
  label: 'rgb(255 255 255)',
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'styles: the forced color scheme overrides the preference',
    run: async (page) => {
      for (const [preference, forced, expected] of /** @type {const} */ ([
        ['light', undefined, light],
        ['dark', undefined, dark],
        ['light', 'dark', dark],
        ['dark', 'light', light],
        ['dark', 'dark', dark],
      ])) {
        await page.open('segmented', preference);
        if (forced) {
          await page.evaluate(
            `document.documentElement.setAttribute('data-color-scheme', '${forced}')`,
          );
          await sleep(300);
        }

        const { colorScheme, ...actual } = await page.evaluate(
          probe(page.section),
        );
        assert.deepEqual(
          actual,
          expected,
          `preference ${preference}, forced ${String(forced)}`,
        );
        if (forced) assert.equal(colorScheme, forced);
      }
    },
  },
  {
    name: 'styles: the demo option forces the color scheme',
    run: async (page) => {
      await page.open('segmented');
      const option = `&colorScheme=${encodeURIComponent(JSON.stringify('dark'))}`;
      await page.evaluate(`location.hash += ${JSON.stringify(option)}`);
      await sleep(300);

      assert.equal(
        await page.evaluate('document.documentElement.dataset.colorScheme'),
        'dark',
      );
      assert.deepEqual(
        await page.evaluate(
          'getComputedStyle(document.documentElement).backgroundColor',
        ),
        'rgb(10, 10, 10)',
      );
    },
  },
];
