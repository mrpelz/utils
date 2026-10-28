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
    name: 'styles: a color scheme forced on an element overrides the preference within it',
    run: async (page) => {
      for (const [preference, forced, expected] of /** @type {const} */ ([
        ['light', 'dark', dark],
        ['dark', 'light', light],
      ])) {
        await page.open('segmented', preference);
        // (On the body, not the root: the root follows the preference.)
        await page.evaluate(
          `document.body.setAttribute('data-color-scheme', '${forced}')`,
        );
        await sleep(300);

        const { colorScheme, ...actual } = await page.evaluate(
          probe(page.section),
        );
        assert.deepEqual(
          actual,
          expected,
          `preference ${preference}, forced ${forced} on the body`,
        );
        assert.equal(colorScheme, 'light dark');
      }
    },
  },
  {
    name: 'styles: a demo’s color scheme setting forces it on its stage alone',
    run: async (page) => {
      // (Not raw: the frame, its stage, the setting from the URL.)
      await page.browser.send('Page.navigate', { url: 'about:blank' });
      await page.browser.send('Page.navigate', {
        url: `${page.url}all#id=%22segmented%22&settings=${encodeURIComponent(
          JSON.stringify({ colorScheme: 'dark' }),
        )}`,
      });
      const stage = JSON.stringify('.demo-stage');
      await page.waitFor(`Boolean(document.querySelector(${stage}))`);
      await sleep(300);

      assert.deepEqual(
        await page.evaluate(`(() => {
          const stage = document.querySelector('.demo-stage');
          return [
            stage.dataset.colorScheme,
            getComputedStyle(stage).backgroundColor,
            getComputedStyle(document.documentElement).backgroundColor,
          ];
        })()`),
        ['dark', 'rgb(10, 10, 10)', 'rgb(255, 255, 255)'],
      );
    },
  },
];
