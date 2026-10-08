/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { mapped, sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Expression for the slider's first thumb element (the thumb input's parent).
 *
 * @param {Page} page
 */
const thumb = (page) =>
  `${page.section}.querySelector('input[type=range]').parentElement`;

/**
 * Focuses the slider's first thumb and presses a key.
 *
 * @param {Page} page
 * @param {string} key
 */
const press = async (page, key) => {
  await page.evaluate(
    `${page.section}.querySelector('input[type=range]').focus()`,
  );
  await page.key(key);
};

/**
 * Widths of the track and its fill (the track's first child).
 *
 * @param {Page} page
 * @returns {Promise<{ fill: number, track: number }>}
 */
const widths = (page) =>
  page.evaluate(`(() => {
    const track = ${thumb(page)}.parentElement;
    return {
      fill: track.firstElementChild.getBoundingClientRect().width,
      track: track.getBoundingClientRect().width,
    };
  })()`);

/**
 * Clicks the min symbol, then the max symbol, and returns the thumbs' values
 * after each.
 *
 * @param {Page} page
 * @returns {Promise<{ afterMax: string[], afterMin: string[] }>}
 */
const clickSymbols = async (page) => {
  const values = () =>
    page.evaluate(
      `[...${page.section}.querySelectorAll('input[type=range]')].map((input) => input.value)`,
    );
  const symbol = async (/** @type {'first' | 'last'} */ which) => {
    const { height, width, x, y } = await page.evaluate(`(() => {
      const symbols = [...${page.section}.querySelectorAll('[data-orientation] > span')].filter((element) => element.textContent === 'A');
      const { height, width, x, y } = symbols.${which === 'first' ? 'at(0)' : 'at(-1)'}.getBoundingClientRect();
      return { height, width, x, y };
    })()`);
    return /** @type {[number, number]} */ ([x + width / 2, y + height / 2]);
  };

  await page.click(await symbol('first'));
  await sleep(300);
  const afterMin = await values();

  await page.click(await symbol('last'));
  await sleep(300);
  const afterMax = await values();

  return { afterMax, afterMin };
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'slider: keyboard focus rings the knob, a pointer does not',
    run: async (page) => {
      await page.open('slider');
      const ring = () =>
        page.evaluate(`(() => {
          const style = getComputedStyle(${thumb(page)}, '::after');
          return [style.outlineStyle, style.outlineWidth, style.outlineOffset];
        })()`);

      await press(page, 'ArrowRight');
      assert.deepEqual(await ring(), ['solid', '2px', '2px']);

      const { height, width, x, y } = await page.evaluate(`(() => {
        ${page.section}.querySelector('input[type=range]').blur();
        const { height, width, x, y } = ${thumb(page)}.getBoundingClientRect();
        return { height, width, x, y };
      })()`);
      await page.click([x + width / 2, y + height / 2]);
      await sleep(400);
      const [style] = await ring();
      assert.equal(style, 'none');
    },
  },
  {
    name: 'slider: fill spans the track at min and max',
    run: async (page) => {
      await page.open('slider');

      await press(page, 'Home');
      const min = await widths(page);
      assert.ok(min.fill < 0.5, `fill at min: ${min.fill}`);

      await press(page, 'End');
      const max = await widths(page);
      assert.ok(
        Math.abs(max.fill - max.track) < 0.5,
        `fill ${max.fill} vs track ${max.track} at max`,
      );
    },
  },
  {
    name: 'slider: thumb rests flush with the track end after a drag',
    run: async (page) => {
      await page.open('slider');

      // Change the value while in the (scaled) dragging state, which is when
      // Base UI measures the thumb.
      await page.evaluate(`${thumb(page)}.setAttribute('data-dragging', '')`);
      await sleep(400);
      await press(page, 'End');
      await page.evaluate(`${thumb(page)}.removeAttribute('data-dragging')`);
      await sleep(400);
      await page.screenshot('slider-max');

      const edges = await page.evaluate(`(() => {
        const element = ${thumb(page)};
        return {
          thumb: element.getBoundingClientRect().right,
          track: element.parentElement.getBoundingClientRect().right,
        };
      })()`);
      assert.ok(
        Math.abs(edges.thumb - edges.track) < 1,
        `thumb right ${edges.thumb} vs track right ${edges.track}`,
      );
    },
  },
  {
    name: 'slider: vertical track fills its control',
    run: async (page) => {
      await page.open('slider', 'light', {
        state: [null, { $rest: true, orientation: 'vertical' }],
      });

      const track = await page.evaluate(`(() => {
        const { height, width } = ${thumb(page)}.parentElement.getBoundingClientRect();
        return { height, width };
      })()`);
      assert.ok(track.height > 100, `vertical track height ${track.height}`);
      assert.equal(Math.round(track.width), 6);
    },
  },
  {
    name: 'slider: clicking the symbols moves the thumb to the ends',
    run: async (page) => {
      await page.open('slider', 'light', {
        state: [{ $rest: true, maxSymbol: 'A', minSymbol: 'A' }],
      });

      assert.deepEqual(await clickSymbols(page), {
        afterMax: ['100'],
        afterMin: ['0'],
      });
    },
  },
  {
    name: 'slider: clicking the symbols moves a range to the ends',
    run: async (page) => {
      await page.open('slider', 'light', {
        state: [
          { $rest: true, maxSymbol: 'A', minSymbol: 'A', thumbs: 2 },
          { $rest: true, defaultValue: mapped('[25, 75]') },
        ],
      });

      assert.deepEqual(await clickSymbols(page), {
        afterMax: ['0', '100'],
        afterMin: ['0', '75'],
      });
    },
  },
  {
    name: 'slider: a symbol onClick replaces moving the thumb',
    run: async (page) => {
      await page.open('slider', 'light', {
        state: [{ $rest: true, maxSymbol: 'A', minSymbol: 'A' }],
      });
      // Only the min symbol gets an `onClick` (the first such control).
      await page.setState(10, { onClick: mapped('[log click]') });

      assert.deepEqual(await clickSymbols(page), {
        afterMax: ['100'],
        afterMin: ['50'],
      });
    },
  },
  {
    name: 'slider: the value keeps its width while it changes',
    run: async (page) => {
      /** @type {[string, () => Promise<void>][]} */
      const cases = [
        ['single', () => Promise.resolve()],
        [
          'range',
          async () => {
            await page.setState(0, { thumbs: 2 });
            await page.setState(1, { defaultValue: mapped('[25, 75]') });
          },
        ],
        [
          'currency',
          () =>
            page.setState(1, {
              format: mapped('[{ style: currency, currency: EUR }]'),
            }),
        ],
      ];

      for (const [name, setup] of cases) {
        await page.open('slider', 'light', {
          state: [{ $rest: true, value: true }],
        });
        await setup();

        const value = () =>
          page.evaluate(`(() => {
            const output = ${page.section}.querySelector('output');
            return { text: output.firstElementChild.textContent, width: output.getBoundingClientRect().width };
          })()`);

        /** @type {number[]} */
        const valueWidths = [];
        /** @type {string[]} */
        const texts = [];
        for (const key of [undefined, 'Home', 'ArrowRight', 'End']) {
          if (key) await press(page, key);
          const { text, width } = await value();
          texts.push(text);
          valueWidths.push(width);
        }

        await page.screenshot(`slider-value-${name}`);

        assert.equal(
          new Set(texts).size,
          4,
          `${name}: values ${texts.join(', ')}`,
        );
        assert.ok(
          valueWidths.every((width) => width === valueWidths[0]),
          `${name}: widths ${valueWidths.join(', ')} for ${texts.join(', ')}`,
        );
      }
    },
  },
];
