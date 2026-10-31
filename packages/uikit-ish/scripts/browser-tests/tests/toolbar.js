/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep, withTouch } from '../lib.js';

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
    name: 'toolbar: bottom capsules of 36px buttons, and glass buttons of their own, match the spec',
    run: async (page) => {
      await page.open('toolbar-symbols', 'light', {
        state: [{ symbols: 6 }],
      });
      const { bar, buttons, groups } = await geometry(page);

      // 4px 16px 2px (the home indicator's 34px below: its anchor's); one
      // capsule, 6 × 36px + 5 × 12px + 2 × 6px = 288px.
      assert.deepEqual(bar, [4, 16, 2, 16]);
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

      // Glass buttons at both sides, 12px apart.
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
    name: 'toolbar: pressed, a glass button turns into a lens (a capsule of several as the tab bar groups); buttons click',
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
          `getComputedStyle(${page.section}.querySelector(${JSON.stringify(selector)})).getPropertyValue('--uikit-glass-scale').trim()`,
        );
        await page.mouse('mouseReleased', ...point);
        await sleep(100);
        return pressed;
      };

      await page.open('toolbar');
      // A glass button's lens (see Button).
      const lens = await page.evaluate(
        `getComputedStyle(document.documentElement).getPropertyValue(${JSON.stringify('--glass-ui-lens-scale')}).trim()`,
      );
      assert.equal(await press('[data-toolbar-part=button]'), lens);
      assert.match(await page.log(), /button clicked/u);

      // A capsule of several: less (1.05, as the tab bar's groups).
      await page.open('toolbar-symbols');
      assert.equal(await press('[role=group]'), '1.05');
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
    name: 'toolbar: a group’s tint tints its capsule (its content white)',
    run: async (page) => {
      await page.open('toolbar-symbols');
      /** The group's tint layers (if tinted), its tint, its content color. */
      const group = () =>
        page.evaluate(`(() => {
          const group = ${page.section}.querySelector('[role=toolbar] [role=group]');
          const tinted = [...group.children].some((layer) => layer.childElementCount === 4);
          const style = getComputedStyle(group);
          // (Colors computed: the build's CSS may write them otherwise.)
          const color = (value) => { const probe = document.createElement('span'); probe.style.color = value; document.body.append(probe); const computed = getComputedStyle(probe).color; probe.remove(); return computed; };
          return [tinted, color(style.getPropertyValue('--uikit-glass-tint')), getComputedStyle(group.querySelector('button')).color];
        })()`);
      const [plain] = await group();
      assert.equal(plain, false);
      await page.setState(2, { tint: 'var(--color-ui-system-orange)' });
      await sleep(200);
      assert.deepEqual(await group(), [
        true,
        // (System orange.)
        'rgb(255, 141, 40)',
        'rgb(255, 255, 255)',
      ]);
      // Its glass' rim in its tint too, not the toolbar's (blue).
      const rim = String(
        await page.evaluate(
          `getComputedStyle(${page.section}.querySelector('[role=toolbar] [role=group]')).getPropertyValue('--uikit-glass-shadow-tinted')`,
        ),
      );
      const blue = /0,? 145,? 255/u;
      assert.equal(blue.test(rim), false, rim);
      // (In either notation: the build's CSS may write it in hex.)
      assert.match(rim, /255,? 141,? 40|#ff8d28/iu);

      // Its content's color over the tint.
      await page.setState(2, { textColor: '#000' });
      await sleep(200);
      const dark = await group();
      assert.equal(dark[2], 'rgb(0, 0, 0)');
    },
  },
  {
    name: 'page control: dots match the spec; a window of 8 dots, shrinking at the ends',
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
    name: 'page control: plain, it matches the spec “Page Controls” (light and dark)',
    run: async (page) => {
      for (const [scheme, label, other] of /** @type {const} */ ([
        ['light', 'rgb(0, 0, 0)', 'color(srgb 0 0 0 / 0.3)'],
        ['dark', 'rgb(255, 255, 255)', 'color(srgb 1 1 1 / 0.3)'],
      ])) {
        await page.open('page-control', scheme, {
          state: [{ $rest: true, count: 2, variant: 'plain' }],
        });
        const plain = await page.evaluate(`(() => {
          const control = ${page.section}.querySelector('[role=slider]');
          const { height, width } = control.getBoundingClientRect();
          const dots = [...control.querySelectorAll('[data-size] > span')].map((dot) => getComputedStyle(dot).backgroundColor);
          return { dots, glass: control.querySelectorAll(':scope > :not([data-size])').length, size: [width, height] };
        })()`);
        // 48×24 (2 dots), the current dot's color, the other's at 30%.
        assert.deepEqual(
          plain,
          {
            dots: [label, other],
            glass: 0,
            size: [48, 24],
          },
          scheme,
        );
      }
    },
  },
  {
    name: 'page control: a momentary tooltip shows the current page while hovered, pressed or focused by keyboard',
    run: async (page) => {
      await page.open('page-control', 'light', {
        state: [{ $rest: true, count: 8, momentaryTooltip: true }],
      });
      const shown = () =>
        page.evaluate(`(() => {
          const tooltip = ${page.section}.querySelector('[data-page-control-part=tooltip]');
          return [Number(getComputedStyle(tooltip).opacity), tooltip.textContent];
        })()`);
      await page.mouse('mouseMoved', 1, 700);
      await sleep(300);
      assert.deepEqual(await shown(), [0, '1 of 8'], 'at rest');

      const control = await page.rect('[role=slider]');
      const center = /** @type {const} */ ([
        control.x + control.width / 2,
        control.y + control.height / 2,
      ]);
      await page.mouse('mouseMoved', center[0], center[1]);
      await sleep(300);
      assert.deepEqual(await shown(), [1, '1 of 8'], 'hovered');

      // Pressed by touch (no hover).
      await page.mouse('mouseMoved', 1, 700);
      await withTouch(page, async (touch) => {
        await touch('touchStart', center[0], center[1]);
        await sleep(300);
        const [pressed] = await shown();
        assert.equal(pressed, 1, 'pressed');
        await touch('touchEnd');
      });
      await page.mouse('mouseMoved', 1, 700);
      await page.evaluate('document.activeElement.blur()');
      await sleep(300);
      const [released] = await shown();
      assert.equal(released, 0, 'released');

      await page.evaluate(
        `${page.section}.querySelector('[role=slider]').focus()`,
      );
      await page.key('ArrowRight');
      await sleep(300);
      // (The tap went to the next page.)
      assert.deepEqual(await shown(), [1, '3 of 8'], 'focused by keyboard');
    },
  },
  {
    name: 'toolbar: a top bar’s title is centered in it, or at its start; 44px buttons',
    run: async (page) => {
      await page.open('header-title');
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
      assert.deepEqual(centered.fonts, ['17px', '12px', '14px']);

      // At the start: next to the back button (16 + 44 + 10).
      await page.setState(1, { alignStart: true });
      await sleep(200);
      const start = await title();
      assert.equal(start.left, 70);
    },
  },
  {
    name: 'header: the bar sticks; the large title scrolls away under it, the bar’s title fading in',
    run: async (page) => {
      await page.open('header');
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
      await page.open('header-title');
      await sleep(200);
      assert.equal(
        await page.evaluate(
          `+getComputedStyle(${scroller}.querySelector('[data-toolbar-part=title]')).opacity`,
        ),
        1,
      );
    },
  },
  {
    name: 'toolbar: buttons are Buttons (tint; of their own, any variant), in a capsule, too',
    run: async (page) => {
      const tint = 'rgb(255, 0, 0)';
      /** The first button's color, background, and height. */
      const first = () =>
        page.evaluate(`(() => {
          const button = ${page.section}.querySelector('[data-toolbar-part=button]');
          const style = getComputedStyle(button);
          return [style.color, style.backgroundColor, button.getBoundingClientRect().height];
        })()`);

      await page.open('toolbar-symbols', 'light', {
        state: [null, null, null, { $rest: true, tint }],
      });
      const [grouped] = await first();
      assert.equal(grouped, tint, 'in a capsule');

      // A classic variant, in a capsule: its own fill.
      await page.setState(3, { tint, variant: 'bordered-prominent' });
      await sleep(100);
      const [, filled] = await first();
      assert.equal(filled, tint, 'filled in a capsule');

      await page.open('toolbar', 'light', {
        state: [
          null,
          { $rest: true, size: 'small', tint, variant: 'bordered-prominent' },
        ],
      });
      const [, background, height] = await first();
      assert.equal(background, tint, 'of its own');
      assert.equal(height, 28, 'small');
    },
  },
  {
    name: 'header: an accessory scrolls with the large title, then sticks below the bar',
    run: async (page) => {
      await page.open('header-composition-control');
      /** The accessory's top and the bar's bottom, from the screen's top. */
      const edges = () =>
        page.evaluate(`(() => {
          const screen = ${page.section}.querySelector('.demo-phone').getBoundingClientRect();
          const bar = ${page.section}.querySelector('[data-header-part=bar]').getBoundingClientRect();
          const accessory = ${page.section}.querySelector('[data-header-part=accessory]').getBoundingClientRect();
          return { accessory: Math.round(accessory.top - screen.top), bar: Math.round(bar.bottom - screen.top) };
        })()`);

      const before = await edges();
      assert.ok(before.accessory > before.bar + 40, 'below the large title');

      await page.evaluate(
        `${page.section}.querySelector('.uikit-page-root').scrollTop = 600`,
      );
      await sleep(300);
      const after = await edges();
      // The bar 54px below the status bar (62px), the accessory below it.
      assert.deepEqual(after, { accessory: 116, bar: 116 });
    },
  },
];
