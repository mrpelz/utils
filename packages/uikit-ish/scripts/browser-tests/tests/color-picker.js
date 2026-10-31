/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep, withTouch } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Clicks an element (by a selector) at its center.
 *
 * @param {Page} page
 * @param {string} selector
 */
const press = async (page, selector) => {
  const { height, width, x, y } = await page.rect(selector);
  await page.click([x + width / 2, y + height / 2]);
  await sleep(200);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'color picker: a grid swatch picks the color (its well shows it); opacity by its field; saved colors; the spectrum by keys',
    run: async (page) => {
      await page.open('color-picker', 'light', {
        state: [{ container: 'popover', defaultOpen: true }],
      });
      await sleep(600);

      // A swatch (the grid's 6th row's 1st).
      await press(page, '[role=group][aria-label=Grid] [aria-label="#00A1D8"]');
      assert.match(await page.log(), /value change: #00A1D8/u);
      const state = await page.evaluate(`(() => ({
        pressed: document.querySelector('[aria-label=Grid] [aria-pressed=true]')?.getAttribute('aria-label'),
        well: getComputedStyle(${page.section}.querySelector('[aria-label=Color]')).getPropertyValue('--uikit-color-picker-well-color').trim(),
      }))()`);
      assert.deepEqual(state, { pressed: '#00A1D8', well: '#00A1D8' });

      // Opacity: 50% (as an alpha channel).
      await press(page, '[aria-label="Opacity percentage"]');
      // (Typed: as an input event would set it.)
      await page.evaluate(`(() => {
        const input = document.querySelector(${JSON.stringify('[aria-label="Opacity percentage"]')});
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '50');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()`);
      await page.key('Enter');
      await sleep(200);
      assert.match(await page.log(), /value change: #00A1D880/u);

      // Saved: the color added.
      await press(page, '[aria-label="Add color"]');
      assert.match(await page.log(), /saved colors \(add\): .*#00A1D880/u);

      // The spectrum: by arrow keys; its popover not moving (its views as
      // high as each other).
      const popupBox = () =>
        page.evaluate(`(() => {
          const { height, left, top, width } = document.querySelector('[role=dialog]').getBoundingClientRect();
          return [left, top, width, height].map(Math.round);
        })()`);
      const gridBox = await popupBox();
      const spectrum = await page.evaluate(`(() => {
        const item = [...document.querySelectorAll('[aria-label=Mode] > *')].find((element) => element.textContent.startsWith('Spectrum'));
        const { height, width, x, y } = item.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(/** @type {[number, number]} */ (spectrum));
      await sleep(300);
      assert.deepEqual(await popupBox(), gridBox, 'not moved');
      await page.evaluate(
        `document.querySelector(${JSON.stringify('[aria-label=Spectrum]')}).focus()`,
      );
      const before = await page.evaluate(
        `document.querySelector(${JSON.stringify('[aria-label=Spectrum]')}).getAttribute('aria-valuetext')`,
      );
      await page.key('ArrowRight');
      await sleep(100);
      const after = await page.evaluate(
        `document.querySelector(${JSON.stringify('[aria-label=Spectrum]')}).getAttribute('aria-valuetext')`,
      );
      assert.notEqual(after, before);
    },
  },
  {
    name: 'color picker: the opacity knob shows at once; saved colors in pages, deleted by their menu',
    run: async (page) => {
      await page.open('color-picker', 'light', {
        state: [
          { container: 'popover', defaultOpen: true },
          null,
          null,
          null,
          null,
          { $rest: true, defaultSavedColors: '$[14 colors: 2 pages]' },
        ],
      });
      await sleep(700);

      // The knob: shown, at the end (100%).
      const knob = await page.evaluate(`(() => {
        const thumb = document.querySelector('[aria-label=Opacity] input, input[aria-label=Opacity]')?.parentElement;
        const style = getComputedStyle(thumb);
        // (Its control: its track's parent.)
        const control = thumb.parentElement.parentElement.getBoundingClientRect();
        return [style.visibility, Math.round(control.right - thumb.getBoundingClientRect().right)];
      })()`);
      assert.deepEqual(knob, ['visible', 2]);

      /** The shown page's saved colors. */
      const shown = () =>
        page.evaluate(
          `[...document.querySelectorAll(${JSON.stringify('[aria-label="Saved colors"] > :not([inert]) > button:not([data-add])')})].map((button) => button.getAttribute('aria-label'))`,
        );
      const first = await shown();
      assert.equal(first.length, 10);
      await page.evaluate(
        'document.querySelector(\'[aria-label="Saved colors"] + [role=slider]\').focus()',
      );
      await page.key('ArrowRight');
      await sleep(200);
      assert.deepEqual(await shown(), [
        '#FF9500',
        '#00C7BE',
        '#A2845E',
        '#30B0C7',
      ]);

      // A secondary click: its menu, deleting it.
      const swatch = await page.rect('[aria-label="#00C7BE"]');
      await page.browser.send('Input.dispatchMouseEvent', {
        button: 'right',
        clickCount: 1,
        type: 'mousePressed',
        x: swatch.x + swatch.width / 2,
        y: swatch.y + swatch.height / 2,
      });
      await page.browser.send('Input.dispatchMouseEvent', {
        button: 'right',
        clickCount: 1,
        type: 'mouseReleased',
        x: swatch.x + swatch.width / 2,
        y: swatch.y + swatch.height / 2,
      });
      await sleep(600);
      const item = await page.evaluate(`(() => {
        const element = [...document.querySelectorAll('[role=menuitem]')].find((candidate) => candidate.textContent === 'Delete');
        const { height, width, x, y } = element.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(/** @type {[number, number]} */ (item));
      await sleep(400);
      assert.deepEqual(await shown(), ['#FF9500', '#A2845E', '#30B0C7']);
      assert.match(await page.log(), /saved colors \(delete\): (?!.*#00C7BE)/u);
    },
  },
  {
    name: 'color picker: saved colors’ pages swiped, its page control following',
    run: async (page) => {
      await page.open('color-picker', 'light', {
        state: [
          { container: 'popover', defaultOpen: true },
          null,
          null,
          null,
          null,
          { $rest: true, defaultSavedColors: '$[14 colors: 2 pages]' },
        ],
      });
      await sleep(700);
      const current = () =>
        page.evaluate(
          `document.querySelector(${JSON.stringify('[aria-label="Saved colors"] + [role=slider]')}).getAttribute('aria-valuenow')`,
        );
      assert.equal(await current(), '1');

      // Swiped (by touch) to the second page.
      const pages = await page.rect('[aria-label="Saved colors"]');
      const y = pages.y + pages.height / 2;
      await withTouch(page, async (touch) => {
        await touch('touchStart', pages.x + pages.width - 20, y);
        for (let step = 1; step <= 10; step += 1) {
          await touch('touchMove', pages.x + pages.width - 20 - step * 25, y);
          await sleep(16);
        }
        await touch('touchEnd');
      });
      await sleep(800);
      assert.equal(await current(), '2');
      const scrolled = await page.evaluate(`(() => {
        const pages = document.querySelector('[aria-label="Saved colors"]');
        return pages.scrollLeft === pages.clientWidth;
      })()`);
      assert.ok(scrolled, 'snapped to it');
    },
  },
  {
    name: 'color picker: its sliders mixing from the color; the add button only for a color not saved yet',
    run: async (page) => {
      await page.open('color-picker', 'light', {
        state: [
          { container: 'popover', defaultOpen: true },
          null,
          { $rest: true, defaultMode: 'rgb' },
        ],
      });
      await sleep(700);
      // Each from the color (#AF52DE) with its channel at 0 to it at 255.
      const ends = await page.evaluate(
        `[...document.querySelectorAll(${JSON.stringify('[data-color-picker-view] [data-color-picker-part=channel-control]')})].map((control) => getComputedStyle(control, '::before').backgroundImage.match(/rgb[(][^)]*[)]/gu))`,
      );
      assert.deepEqual(ends, [
        ['rgb(0, 82, 222)', 'rgb(255, 82, 222)'],
        ['rgb(175, 0, 222)', 'rgb(175, 255, 222)'],
        ['rgb(175, 82, 0)', 'rgb(175, 82, 255)'],
      ]);

      // A saved color: no add button; another: one.
      const adds = () =>
        page.evaluate(
          `document.querySelectorAll(${JSON.stringify('[aria-label="Add color"]')}).length`,
        );
      await page.evaluate(
        `document.querySelector(${JSON.stringify('[aria-label="Saved colors"] > :not([inert]) > button:not([data-add])')}).click()`,
      );
      await sleep(300);
      assert.equal(await adds(), 0, 'saved');
      await page.evaluate(
        `document.querySelector(${JSON.stringify('[data-color-picker-view] input[type=range]')}).focus()`,
      );
      await page.key('ArrowRight');
      await sleep(300);
      assert.equal(await adds(), 1, 'not saved');
    },
  },
  {
    name: 'color picker: changes tell why (a grid swatch: grid); controlled, it shows the app’s color only',
    run: async (page) => {
      await page.open('color-picker-parts-root');
      await page.evaluate(
        `${page.section}.querySelectorAll('[data-color-picker-part=grid] button')[20].click()`,
      );
      await sleep(200);
      assert.match(await page.log(), /value change: #[\dA-F]{6} \(grid\)/u);

      await page.setState(0, { value: '#34C759' });
      await sleep(300);
      await page.evaluate(
        `${page.section}.querySelectorAll('[data-color-picker-part=grid] button')[30].click()`,
      );
      await sleep(200);
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('[data-color-picker-part=grid] [aria-pressed=true]')?.getAttribute('aria-label') ?? null`,
        ),
        null,
        'none of the grid’s: the app’s green stays',
      );
    },
  },
  {
    name: 'color picker: app-held saved colors are shared, their changes telling why (add)',
    run: async (page) => {
      await page.open('color-picker-composition-saved');
      await page.evaluate(
        `${page.section}.querySelector('[data-color-picker-part=saved-pages] button[data-add]').click()`,
      );
      await sleep(300);
      assert.deepEqual(
        await page.evaluate(
          `[...${page.section}.querySelectorAll('[data-color-picker-part=saved-pages]')].map((pages) => pages.querySelectorAll('button:not([data-add])').length)`,
        ),
        [4, 4],
      );
      assert.match(await page.log(), /saved \(add, first picker\)/u);
    },
  },
];
