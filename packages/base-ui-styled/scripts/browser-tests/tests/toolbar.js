/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The bar's capsules and buttons, relative to the bar.
 *
 * @param {Page} page
 * @returns {Promise<{ bar: number[], buttons: number[][], groups: number[][] }>}
 */
const geometry = (page) =>
  page.evaluate(`(() => {
    const bar = ${page.section}.querySelector('[role=toolbar]');
    const box = bar.getBoundingClientRect();
    const style = getComputedStyle(bar);
    const rect = (element) => { const { height, left, width } = element.getBoundingClientRect(); return [Math.round(left - box.left), Math.round(width), Math.round(height)]; };
    return {
      bar: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].map(parseFloat),
      buttons: [...bar.querySelectorAll('[data-toolbar-part=button]')].map(rect),
      groups: [...bar.querySelectorAll('[role=group]')].map(rect),
    };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'toolbar: bottom capsules of 36px buttons, and glass buttons of their own, match Figma',
    run: async (page) => {
      await page.open('toolbar-symbols', 'light', {
        state: [{ symbols: 6 }],
      });
      const { bar, buttons, groups } = await geometry(page);

      // 4px 16px 36px; one capsule, 6 × 36px + 5 × 12px + 2 × 6px = 288px.
      assert.deepEqual(bar, [4, 16, 36, 16]);
      assert.deepEqual(
        groups.map(([, width, height]) => [width, height]),
        [[288, 48]],
      );
      const [[groupLeft = 0] = []] = groups;
      assert.deepEqual(
        buttons.map(([left = 0, width, height]) => [
          left - groupLeft,
          width,
          height,
        ]),
        [6, 54, 102, 150, 198, 246].map((left) => [left, 36, 36]),
      );

      // Glass buttons at both sides, 12px apart (Figma Type=Buttons).
      await page.open('toolbar');
      const sides = await geometry(page);
      assert.deepEqual(sides.groups, []);
      assert.deepEqual(
        sides.buttons.map(([, width, height]) => [width, height]),
        Array.from({ length: 6 }, () => [48, 48]),
      );
      const lefts = sides.buttons.map(([left]) => left);
      assert.deepEqual(lefts.slice(0, 3), [16, 76, 136]);
    },
  },
  {
    name: 'toolbar: a top bar’s title is centered in it, or at its start; 44px buttons',
    run: async (page) => {
      await page.open('toolbar-top', 'light', {
        state: [{ $rest: true, largeTitle: false, subtitle: 'Subtitle' }],
      });
      const title = () =>
        page.evaluate(`(() => {
          const bar = ${page.section}.querySelector('[role=toolbar]').getBoundingClientRect();
          const title = ${page.section}.querySelector('[data-toolbar-part=title]');
          const text = title.firstElementChild.getBoundingClientRect();
          const subtitle = getComputedStyle(title.querySelector('[data-toolbar-part=subtitle]'));
          return {
            center: Math.round(text.left + text.width / 2 - (bar.left + bar.width / 2)),
            fonts: [getComputedStyle(title).fontSize, subtitle.fontSize, subtitle.lineHeight],
            left: Math.round(text.left - bar.left),
          };
        })()`);

      const { buttons, groups } = await geometry(page);
      // Back and done of their own, a capsule of two between.
      assert.deepEqual(
        [...groups, ...buttons.filter(([, width]) => width === 44)].map(
          (box) => box[2],
        ),
        [44, 44, 44],
      );
      const centered = await title();
      // One button at the start, three at the end: centered all the same.
      assert.ok(Math.abs(centered.center) <= 1, `off by ${centered.center}`);
      assert.deepEqual(centered.fonts, ['15px', '12px', '14px']);

      // At the start: next to the back button (16 + 44 + 10).
      await page.setState(2, { alignStart: true });
      await sleep(200);
      const start = await title();
      assert.equal(start.left, 70);
    },
  },
  {
    name: 'toolbar: pressed, a glass button (or a capsule of several) turns into a lens; buttons click',
    run: async (page) => {
      /** @param {string} selector */
      const press = async (selector) => {
        const button = await page.rect('[data-toolbar-part=button]');
        const point = /** @type {[number, number]} */ ([
          button.x + button.width / 2,
          button.y + button.height / 2,
        ]);
        await page.mouse('mousePressed', ...point);
        await sleep(100);
        const pressed = await page.evaluate(
          `getComputedStyle(${page.section}.querySelector(${JSON.stringify(selector)})).getPropertyValue('--styled-glass-scale').trim()`,
        );
        await page.mouse('mouseReleased', ...point);
        await sleep(100);
        return pressed;
      };

      await page.open('toolbar');
      // A glass button's lens (see Button).
      const lens = await page.evaluate(
        `getComputedStyle(document.documentElement).getPropertyValue(${JSON.stringify('--glass-ios-lens-scale')}).trim()`,
      );
      assert.equal(await press('[data-toolbar-part=button]'), lens);
      assert.match(await page.log(), /button clicked/u);

      // A capsule of several: as much.
      await page.open('toolbar-symbols');
      assert.equal(await press('[role=group]'), lens);
    },
  },
  {
    name: 'toolbar: arrow keys move between its buttons',
    run: async (page) => {
      await page.open('toolbar');
      await page.evaluate(
        `${page.section}.querySelector('[data-toolbar-part=button]').focus()`,
      );
      await page.key('ArrowRight');
      await page.key('ArrowRight');
      assert.equal(
        await page.evaluate(
          'document.activeElement.getAttribute("aria-label")',
        ),
        'Action 3',
      );
    },
  },
  {
    name: 'page control: dots match Figma; a window of 8 dots, shrinking at the ends',
    run: async (page) => {
      await page.open('page-control');
      /** @returns {Promise<{ current: number, dots: number[], height: number, padding: string }>} */
      const state = () =>
        page.evaluate(`(() => {
          const control = ${page.section}.querySelector('[role=slider]');
          const dots = [...control.querySelectorAll('[data-size] > span')];
          return {
            current: dots.findIndex((dot) => dot.parentElement.hasAttribute('data-current')),
            dots: dots.map((dot) => Math.round(dot.getBoundingClientRect().width)),
            height: control.getBoundingClientRect().height,
            padding: getComputedStyle(control).paddingLeft,
          };
        })()`);

      assert.deepEqual(await state(), {
        current: 0,
        dots: [8, 8, 8, 8, 8],
        height: 48,
        padding: '24px',
      });

      // 12 pages: 8 dots, the last two shrunken (more after them).
      await page.setState(0, { count: 12 });
      await sleep(300);
      const many = await state();
      assert.deepEqual(many.dots, [8, 8, 8, 8, 8, 8, 6, 4]);

      // Pressed after the current dot: the next page; by keys, on.
      const control = await page.rect('[role=slider]');
      await page.click([
        control.x + control.width - 30,
        control.y + control.height / 2,
      ]);
      await sleep(300);
      const next = await state();
      assert.equal(next.current, 1);
      await page.evaluate(
        `${page.section}.querySelector('[role=slider]').focus()`,
      );
      for (let step = 0; step < 6; step += 1) await page.key('ArrowRight');
      await sleep(300);
      // Page 8 of 12: the window moved on, shrunken dots at both ends.
      const moved = await state();
      assert.deepEqual(moved.dots, [4, 6, 8, 8, 8, 8, 6, 4]);
      assert.equal(moved.current, 5);
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('[role=slider]').getAttribute('aria-valuetext')`,
        ),
        '8 of 12',
      );
      assert.match(await page.log(), /page change: 7/u);
    },
  },
  {
    name: 'toolbar (top): the bar sticks; the large title scrolls away under it, the bar’s title fading in',
    run: async (page) => {
      await page.open('toolbar-top');
      const scroller = `[...${page.section}.querySelectorAll('div')].find((element) => getComputedStyle(element).overflowY === 'auto')`;
      const state = () =>
        page.evaluate(`(() => {
          const scroller = ${scroller};
          const bar = scroller.querySelector('[role=toolbar]');
          const title = bar.querySelector('[data-toolbar-part=title]');
          const large = scroller.querySelector('[data-header-part=large-title]');
          return {
            bar: Math.round(bar.getBoundingClientRect().top - scroller.getBoundingClientRect().top),
            large: +getComputedStyle(large).opacity,
            title: +getComputedStyle(title).opacity,
          };
        })()`);
      const scrollTo = async (/** @type {number} */ top) => {
        await page.evaluate(`${scroller}.scrollTop = ${top}`);
        await sleep(200);
      };

      assert.deepEqual(await state(), { bar: 0, large: 1, title: 0 });
      await scrollTo(200);
      assert.deepEqual(await state(), { bar: 0, large: 0, title: 1 });
      await scrollTo(0);

      // Without a large title, the bar's title shows.
      await page.setState(0, { largeTitle: false });
      await sleep(200);
      assert.equal(
        await page.evaluate(
          `+getComputedStyle(${scroller}.querySelector('[data-toolbar-part=title]')).opacity`,
        ),
        1,
      );
    },
  },
];
