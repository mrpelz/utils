/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

const PRIMARY = 'tab-bar';
const SECONDARY = 'tab-bar-secondary';

/**
 * Centers of the current section's tabs.
 *
 * @param {Page} page
 * @returns {Promise<[number, number][]>}
 */
const tabCenters = (page) =>
  page.evaluate(`[...${page.section}.querySelectorAll('[role=tab]')].map((tab) => {
    const { height, width, x, y } = tab.getBoundingClientRect();
    return [x + width / 2, y + height / 2];
  })`);

/**
 * Selection fill opacity and left position per group, per animation frame.
 *
 * @param {Page} page
 * @param {() => Promise<void>} action
 * @returns {Promise<{ left: number, opacity: number }[][]>}
 */
const sampleSelections = async (page, action) => {
  const sampling =
    page.sample(`[...${page.section}.querySelectorAll('[role=tablist] > div')].map((group) => {
    const indicator = group.querySelector('[role=presentation]');
    return {
      left: Math.round(parseFloat(getComputedStyle(indicator).left)),
      opacity: +getComputedStyle(indicator, '::before').opacity,
    };
  })`);
  await action();
  return sampling;
};

/** @param {number[]} values */
const isMonotonic = (values, direction = 1) =>
  values.every(
    (value, index) =>
      index === 0 ||
      (value - (values[index - 1] ?? value)) * direction >= -0.01,
  );

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'tab bar: tab widths match Figma in a 402px wide bar',
    run: async (page) => {
      /** @type {[string, number, number[], number[]][]} */
      const cases = [
        [PRIMARY, 2, [194], [102, 102]],
        [PRIMARY, 3, [286], [102, 102, 102]],
        [PRIMARY, 4, [338], [90, 90, 90, 90]],
        [PRIMARY, 5, [338], [72, 72, 72, 72, 72]],
        [SECONDARY, 2, [194, 54], [102, 102, 54]],
        [SECONDARY, 3, [268, 54], [96, 96, 96, 54]],
        [SECONDARY, 4, [268, 54], [72.5, 72.5, 72.5, 72.5, 54]],
      ];

      for (const [id, tabs, groups, widths] of cases) {
        await page.open(id);
        await page.setControl('tabs', tabs);
        await page.evaluate(
          `${page.section}.querySelector('[role=tablist]').style.width = '402px'`,
        );
        await sleep(300);

        const measured = await page.evaluate(`(() => {
          const list = ${page.section}.querySelector('[role=tablist]');
          const round = (value) => Math.round(value * 10) / 10;
          return {
            groups: [...list.children].filter((child) => child.querySelector('[role=tab]')).map((group) => round(group.getBoundingClientRect().width)),
            widths: [...list.querySelectorAll('[role=tab]')].map((tab) => round(tab.getBoundingClientRect().width)),
          };
        })()`);

        assert.deepEqual(measured, { groups, widths }, `${id}, ${tabs} tabs`);
      }
    },
  },
  {
    name: 'tab bar: lens is placed at the tab size and follows the pointer',
    run: async (page) => {
      await page.open(SECONDARY);
      const [first, second] = await tabCenters(page);
      if (!first || !second) throw new Error('missing tabs');

      const { width } = await page.rect('[role=tab]', 1);
      await page.mouse('mousePressed', ...second);
      const widths = await page.sample(
        `parseFloat(getComputedStyle(${page.section}.querySelector('[role=tablist]').lastElementChild).width)`,
        100,
      );
      await page.mouse('mouseReleased', ...second);
      await sleep(500);

      assert.ok(
        widths.every((lensWidth) => Math.abs(lensWidth - width) < 0.5),
        `lens widths ${widths.join(', ')} should all be ${width}`,
      );

      /** @type {number[]} */
      const offsets = [];
      await page.drag(first, second, {
        onStep: async (x) => {
          offsets.push(
            await page.evaluate(`(() => {
              const lens = ${page.section}.querySelector('[role=tablist]').lastElementChild.getBoundingClientRect();
              return lens.x + lens.width / 2 - ${x};
            })()`),
          );
        },
      });

      assert.ok(
        offsets.every((offset) => Math.abs(offset) <= 1),
        `lens center - pointer: ${offsets.map((offset) => Math.round(offset)).join(', ')}`,
      );
    },
  },
  {
    name: 'tab bar: selection slides within a group',
    run: async (page) => {
      await page.open(PRIMARY);
      const [, second] = await tabCenters(page);
      if (!second) throw new Error('missing tabs');

      const samples = await sampleSelections(page, () => page.click(second));
      const lefts = samples.map(([primary]) => primary?.left ?? 0);

      assert.ok(isMonotonic(lefts), `lefts ${lefts.join(', ')}`);
      assert.ok((lefts.at(-1) ?? 0) > (lefts[0] ?? 0), 'selection moved');
    },
  },
  {
    name: 'tab bar: selection fades in place between groups',
    run: async (page) => {
      await page.open(SECONDARY);
      const centers = await tabCenters(page);
      const [first, , third] = centers;
      const secondary = centers.at(-1);
      if (!first || !third || !secondary) throw new Error('missing tabs');

      await page.click(third);
      await sleep(500);
      await page.click(secondary);
      await sleep(500);

      const samples = await sampleSelections(page, () => page.click(first));
      const primary = samples.map(([group]) => group);
      const other = samples.map(([, group]) => group);
      const settledLeft = primary.at(-1)?.left;

      assert.ok(
        primary.every(
          (group) => group?.opacity === 0 || group?.left === settledLeft,
        ),
        `primary selection moved while visible: ${JSON.stringify(primary)}`,
      );
      assert.ok(
        isMonotonic(primary.map((group) => group?.opacity ?? 0)),
        'primary selection fades in',
      );
      assert.ok(
        isMonotonic(
          other.map((group) => group?.opacity ?? 0),
          -1,
        ),
        'secondary selection fades out',
      );
    },
  },
  {
    name: 'tab bar: dragging the lens across groups activates the target',
    run: async (page) => {
      await page.open(SECONDARY);
      await page.stripes();
      const centers = await tabCenters(page);
      const first = centers[0];
      const last = centers.at(-1);
      if (!first || !last) throw new Error('missing tabs');

      await page.drag(first, last, {
        duration: 800,
        onStep: async (_x, _y, step) => {
          if (step === 6) await page.screenshot('tab-bar-lens-between-groups');
        },
        steps: 10,
      });
      await sleep(500);

      const active = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=tab]')].map((tab) => tab.hasAttribute('data-active'))`,
      );
      assert.equal(active.at(-1), true, `active tabs: ${active.join(', ')}`);
    },
  },
];
