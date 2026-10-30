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
  {
    name: 'slider: its label and value placed at the start, end, above (its own line: the label at its start, the value at its end), or the value in tooltips on the thumbs',
    run: async (page) => {
      /** The label's, value's and control's boxes (left, top, right). */
      const boxes = () =>
        page.evaluate(`(() => {
          const control = ${page.section}.querySelector('input[type=range]').closest('[data-orientation]').parentElement.parentElement;
          const root = control.parentElement;
          const box = (element) => { const { left, right, top } = element.getBoundingClientRect(); return [left, top, right].map(Math.round); };
          return { control: box(control), label: box(root.querySelector('[data-slider-placement], div:first-child')), root: box(root), value: box(root.querySelector('output')) };
        })()`);

      await page.open('slider', 'light', {
        state: [
          { $rest: true, label: 'Volume', value: true },
          null,
          { placement: 'block-start' },
          { $rest: true, placement: 'block-start' },
        ],
      });
      const above = await boxes();
      assert.ok(above.control[1] > above.label[1], 'below the label');
      assert.equal(above.label[1], above.value[1], 'one line');
      assert.equal(above.label[0], above.root[0], 'the label at its start');
      assert.equal(above.value[2], above.root[2], 'the value at its end');

      await page.setState(2, { placement: 'inline-end' });
      await page.setState(3, { placement: 'inline-start' });
      const sides = await boxes();
      assert.equal(sides.value[0], sides.root[0], 'the value first');
      assert.equal(sides.label[2], sides.root[2], 'the label last');
      assert.equal(sides.value[1] < sides.control[1] + 28, true, 'one row');

      // In tooltips: each thumb's own value, 8px above it, centered.
      await page.open('slider', 'light', {
        state: [
          { $rest: true, thumbs: 2, value: true },
          { $rest: true, defaultValue: mapped('[25, 75]') },
          null,
          { $rest: true, placement: 'tooltip' },
        ],
      });
      await sleep(300);
      const bubbles =
        await page.evaluate(`[...${page.section}.querySelectorAll('input[type=range]')].map((input) => {
        const thumb = input.parentElement.getBoundingClientRect();
        const bubble = input.parentElement.querySelector('span[aria-hidden]');
        const box = bubble.getBoundingClientRect();
        return [bubble.textContent, Math.round(thumb.top - box.bottom), Math.round(box.left + box.width / 2 - (thumb.left + thumb.width / 2)), input.getAttribute('aria-valuenow')];
      })`);
      assert.equal(bubbles.length, 2);
      for (const [text, gap, offset, value] of bubbles) {
        assert.deepEqual([text, gap, Math.abs(offset) <= 1], [value, 8, true]);
      }
    },
  },
  {
    name: 'slider: its tint fills it',
    run: async (page) => {
      await page.open('slider', 'light', {
        state: [null, { $rest: true, tint: 'var(--color-ui-system-orange)' }],
      });
      const fill = await page.evaluate(`(() => {
        const track = ${page.section}.querySelector('input[type=range]').closest('[data-orientation]').parentElement;
        return getComputedStyle(track.firstElementChild).backgroundColor;
      })()`);
      assert.equal(fill, 'rgb(255, 141, 40)');
    },
  },
  {
    name: 'slider: ticks mark the values between its ends, where the fill ends at them (edge and center alignment)',
    run: async (page) => {
      for (const thumbAlignment of ['edge', 'center']) {
        for (const value of [20, 80]) {
          await page.open('slider', 'light', {
            state: [
              { $rest: true, ticks: 6 },
              { $rest: true, defaultValue: value, step: 20, thumbAlignment },
            ],
          });
          await sleep(300);
          const { fill, ticks } = await page.evaluate(`(() => {
            const input = ${page.section}.querySelector('input[type=range]');
            const center = (element) => { const { left, width } = element.getBoundingClientRect(); return Math.round(left + width / 2); };
            const track = input.parentElement.parentElement;
            return { fill: Math.round(track.firstElementChild.getBoundingClientRect().right), ticks: [...track.querySelectorAll('[aria-hidden=true] > span')].map(center) };
          })()`);
          // 6 values (0 to 100 by 20): the 4 between the ends.
          assert.equal(ticks.length, 4, thumbAlignment);
          assert.ok(
            ticks.includes(fill),
            `${thumbAlignment} ${String(value)}: ${String(fill)} in ${ticks.join(', ')}`,
          );
        }
      }
    },
  },
  {
    name: 'slider: a momentary tooltip shows its value while hovered or focused by keyboard, not while it stays focused after a drag',
    run: async (page) => {
      await page.open('slider', 'light', {
        state: [
          { $rest: true, value: true },
          null,
          null,
          { $rest: true, placement: 'momentary-tooltip' },
        ],
      });
      await sleep(300);
      const shown = () =>
        page.evaluate(
          `Number(getComputedStyle(${page.section}.querySelector('input[type=range]').parentElement.querySelector('span[aria-hidden]')).opacity)`,
        );
      // (Away: below it.)
      await page.mouse('mouseMoved', 1, 700);
      await sleep(300);
      assert.equal(await shown(), 0, 'at rest');
      const knob = await page.rect('input[type=range]');
      await page.mouse('mouseMoved', knob.x - 60, knob.y + knob.height / 2);
      await sleep(300);
      assert.equal(await shown(), 1, 'hovered');

      // Dragged (it stays focused), then away.
      await page.mouse(
        'mousePressed',
        knob.x + knob.width / 2,
        knob.y + knob.height / 2,
      );
      await page.mouse(
        'mouseMoved',
        knob.x + knob.width / 2 + 20,
        knob.y + knob.height / 2,
      );
      await page.mouse(
        'mouseReleased',
        knob.x + knob.width / 2 + 20,
        knob.y + knob.height / 2,
      );
      await page.mouse('mouseMoved', 1, 700);
      await sleep(300);
      assert.equal(await shown(), 0, 'away, after a drag');

      await press(page, 'ArrowRight');
      await sleep(300);
      assert.equal(await shown(), 1, 'focused by keyboard');
    },
  },
];
