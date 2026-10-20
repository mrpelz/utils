/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

// Tokens and component styles that differ by color scheme: a root token, a
// glass context following the color scheme (segmented control) and a
// component's own dark value (its highlight).
const probe = (/** @type {string} */ section) => `(() => {
  const root = getComputedStyle(document.documentElement);
  // (Colors computed: the build's CSS may write them otherwise.)
  const color = (value) => { const probe = document.createElement('span'); probe.style.color = value; document.body.append(probe); const computed = getComputedStyle(probe).color; probe.remove(); return computed; };
  const group = ${section}.querySelector('[role=radiogroup]');
  const highlight = [...group.children].find((child) => getComputedStyle(child).backgroundColor === 'rgb(255, 255, 255)' || getComputedStyle(child).backgroundColor === 'rgb(108, 108, 113)');
  return {
    colorScheme: root.colorScheme,
    glass: color(getComputedStyle(group).getPropertyValue('--uikit-glass-content')),
    highlight: highlight ? getComputedStyle(highlight).backgroundColor : undefined,
    label: color(root.getPropertyValue('--color-ios-label')),
  };
})()`;

const light = {
  glass: 'rgb(64, 64, 64)',
  highlight: 'rgb(255, 255, 255)',
  label: 'rgb(0, 0, 0)',
};

const dark = {
  glass: 'rgb(191, 191, 191)',
  highlight: 'rgb(108, 108, 113)',
  label: 'rgb(255, 255, 255)',
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
      // (Stored as the demo frame's option stores it, see useLocalStorage;
      // removed after, as the storage outlasts the test.)
      const key = JSON.stringify('colorScheme');
      await page.evaluate(`(() => {
        localStorage.setItem(${key}, JSON.stringify('dark'));
        dispatchEvent(new CustomEvent('demo-local-storage', { detail: ${key} }));
      })()`);
      await sleep(300);

      try {
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
      } finally {
        await page.evaluate(`localStorage.removeItem(${key})`);
      }
    },
  },
];
