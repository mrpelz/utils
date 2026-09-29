/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'segmented: labels fit when sized to content',
    run: async (page) => {
      await page.open('segmented');

      const labels = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=radio] > span')].map((label) => ({ client: label.clientWidth, scroll: label.scrollWidth }))`,
      );
      assert.ok(
        labels.every(
          (
            /** @type {{ client: number, scroll: number }} */ {
              client,
              scroll,
            },
          ) => scroll <= client,
        ),
        `truncated labels: ${JSON.stringify(labels)}`,
      );
    },
  },
  {
    name: 'segmented: separators are hidden next to the selection only',
    run: async (page) => {
      await page.open('segmented');
      await page.setControl('count', 4);

      const second = await page.rect('[role=radio]', 1);
      await page.click([
        second.x + second.width / 2,
        second.y + second.height / 2,
      ]);
      await sleep(400);
      await page.screenshot('segmented-second-selected');

      // Separators are drawn at the start of every item but the first.
      const visible = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=radio]')].slice(1).map((item) => { const style = getComputedStyle(item, '::before'); return style.visibility === 'visible' && Number(style.opacity) > 0; })`,
      );
      assert.deepEqual(visible, [false, false, true]);
    },
  },
  {
    name: 'segmented: geometry matches Figma',
    run: async (page) => {
      await page.open('segmented');
      await page.setControl('count', 5);
      await sleep(400);

      const geometry = await page.evaluate(`(() => {
        const root = ${page.section}.querySelector('[role=radiogroup]');
        const checked = root.querySelector('[role=radio][data-checked]').getBoundingClientRect();
        const highlight = root.querySelector(':scope > div').getBoundingClientRect();
        return {
          item: checked.height,
          outsetEnd: Math.round((highlight.right - checked.right) * 100) / 100,
          outsetStart: Math.round((checked.left - highlight.left) * 100) / 100,
          pill: highlight.height,
          track: root.getBoundingClientRect().height,
        };
      })()`);
      assert.deepEqual(geometry, {
        item: 28,
        outsetEnd: 4,
        outsetStart: 4,
        pill: 28,
        track: 36,
      });
    },
  },
  {
    name: 'segmented: width does not change with the selection',
    run: async (page) => {
      await page.open('segmented');
      await page.setControl('count', 5);

      /** @type {number[]} */
      const widths = [];
      for (let index = 0; index < 5; index += 1) {
        const item = await page.rect('[role=radio]', index);
        await page.click([item.x + item.width / 2, item.y + item.height / 2]);
        await sleep(300);
        const root = await page.rect('[role=radiogroup]');
        widths.push(root.width);
      }
      assert.ok(
        widths.every((width) => width === widths[0]),
        `widths per selected item: ${widths.join(', ')}`,
      );
    },
  },
  {
    name: 'segmented: dragging the lens checks the item under the pointer',
    run: async (page) => {
      await page.open('segmented');
      await page.setControl('count', 5);

      const first = await page.rect('[role=radio]', 0);
      const fourth = await page.rect('[role=radio]', 3);
      const y = first.y + first.height / 2;

      /** @type {{ highlight: string, lens: string }[]} */
      const opacities = [];
      await page.drag(
        [first.x + first.width / 2, y],
        [fourth.x + fourth.width / 2, y],
        {
          duration: 600,
          onStep: async (_x, _y, step) => {
            if (step !== 10) return;
            await sleep(350);
            opacities.push(
              await page.evaluate(`(() => {
                const root = ${page.section}.querySelector('[role=radiogroup]');
                return {
                  highlight: getComputedStyle(root.querySelector(':scope > div')).opacity,
                  lens: getComputedStyle(root.lastElementChild).opacity,
                };
              })()`),
            );
          },
        },
      );
      await sleep(400);
      await page.screenshot('segmented-dragged');

      assert.deepEqual(opacities, [{ highlight: '0', lens: '1' }]);

      const checked = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=radio]')].findIndex((item) => item.hasAttribute('data-checked'))`,
      );
      assert.equal(checked, 3);
    },
  },
  {
    name: 'segmented: arrow keys still move the selection',
    run: async (page) => {
      await page.open('segmented');
      await page.setControl('count', 3);

      await page.evaluate(
        `${page.section}.querySelector('[role=radio][data-checked]').focus()`,
      );
      await page.key('ArrowRight');

      const checked = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=radio]')].findIndex((item) => item.hasAttribute('data-checked'))`,
      );
      assert.equal(checked, 1);
    },
  },
];
