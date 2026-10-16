/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The bar's track and fill, and its value for assistive technology.
 *
 * @param {Page} page
 */
const bar = (page) =>
  page.evaluate(`(() => {
    const root = ${page.section}.querySelector('[role=progressbar]');
    // (After it, Base UI's visually hidden text.)
    const track = root.querySelector(':scope > div');
    const fill = track.firstElementChild;
    const style = getComputedStyle(track);
    return {
      fill: [Math.round(fill.getBoundingClientRect().width), getComputedStyle(fill).backgroundColor],
      track: [Math.round(track.getBoundingClientRect().width), track.getBoundingClientRect().height, style.borderRadius, style.backgroundColor],
      value: root.getAttribute('aria-valuenow'),
    };
  })()`);

/**
 * The activity indicator's spinner and spokes.
 *
 * @param {Page} page
 */
const spinner = (page) =>
  page.evaluate(`(() => {
    const [, root] = ${page.section}.querySelectorAll('[role=progressbar]');
    const spinner = root.querySelector('[aria-hidden]');
    const spokes = [...spinner.children];
    return {
      gap: getComputedStyle(root).columnGap,
      indeterminate: root.hasAttribute('data-indeterminate') && !root.hasAttribute('aria-valuenow'),
      opacities: spokes.map((spoke) => Number(getComputedStyle(spoke).opacity)),
      size: [spinner.offsetWidth, spinner.offsetHeight],
      spoke: [spokes[0].offsetWidth, spokes[0].offsetHeight, getComputedStyle(spokes[0]).backgroundColor],
      spinning: spinner.getAnimations().some((animation) => animation.playState === 'running'),
    };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'progress: a bar matches Figma (track, fill, a dot at 0%), light and dark',
    run: async (page) => {
      for (const [scheme, track, fill] of /** @type {const} */ ([
        ['light', 'rgba(120, 120, 120, 0.2)', 'rgb(0, 136, 255)'],
        ['dark', 'rgba(120, 120, 128, 0.36)', 'rgb(0, 145, 255)'],
      ])) {
        await page.open('progress', scheme);
        await sleep(300);
        const { fill: filled, track: tracked, value } = await bar(page);
        // Filling its container (here: the page), 40% filled.
        assert.equal(filled[0], Math.round(tracked[0] * 0.4), scheme);
        assert.deepEqual(
          [filled[1], tracked.slice(1), value],
          [fill, [6, '3px', track], '40'],
          scheme,
        );
      }

      // At least 280px long.
      await page.evaluate(
        `${page.section}.querySelector('[role=progressbar]').parentElement.style.width = '100px'`,
      );
      const short = await bar(page);
      assert.equal(short.track[0], 280, 'its minimum');

      await page.setState(0, { value: 0 });
      await sleep(300);
      const empty = await bar(page);
      assert.equal(empty.fill[0], 6, 'a dot at 0%');
      await page.setState(0, { value: 100 });
      await sleep(300);
      const full = await bar(page);
      assert.equal(full.fill[0], full.track[0]);
    },
  },
  {
    name: 'progress: an activity indicator matches Figma (regular, small), spinning, indeterminate',
    run: async (page) => {
      await page.open('progress');
      const regular = await spinner(page);
      assert.deepEqual(regular, {
        gap: '8px',
        indeterminate: true,
        // From the top, clockwise.
        opacities: [1, 0.15, 0.27, 0.39, 0.51, 0.63, 0.75, 0.87],
        size: [30, 30],
        spinning: true,
        spoke: [4, 10, 'rgba(60, 60, 67, 0.6)'],
      });

      await page.setState(2, { size: 'small' });
      const small = await spinner(page);
      assert.deepEqual(
        [small.size, small.spoke.slice(0, 2), small.gap],
        [[22, 22], [3, 7], '4px'],
      );

      // Its speed, and stopped.
      await page.setState(2, { animating: false, duration: 2 });
      const timing = await page.evaluate(`(() => {
        const [, root] = ${page.section}.querySelectorAll('[role=progressbar]');
        const style = getComputedStyle(root.querySelector('[aria-hidden]'));
        return [style.animationDuration, style.animationPlayState];
      })()`);
      assert.deepEqual(timing, ['2s', 'paused']);
    },
  },
  {
    name: 'progress: an activity indicator spins a spoke at a time, smoothly, or fades its spokes in place, in turn',
    run: async (page) => {
      await page.open('progress');
      const motion = () =>
        page.evaluate(`(() => {
          const [, root] = ${page.section}.querySelectorAll('[role=progressbar]');
          const spinner = root.querySelector('[aria-hidden]');
          const spokes = [...spinner.children];
          return {
            spinner: spinner.getAnimations().length > 0 ? getComputedStyle(spinner).animationTimingFunction : 'none',
            spokes: spokes.filter((spoke) => spoke.getAnimations().length > 0).length,
          };
        })()`);
      assert.deepEqual(await motion(), { spinner: 'steps(8)', spokes: 0 });

      await page.setState(2, { movement: 'rotate' });
      assert.deepEqual(await motion(), { spinner: 'linear', spokes: 0 });

      await page.setState(2, { movement: 'fade' });
      assert.deepEqual(await motion(), { spinner: 'none', spokes: 8 });
      // Each spoke as far into its fade as its opacity: the brightest at the
      // top, fainter counterclockwise.
      await page.setState(2, { animating: false });
      const opacities = /** @type {number[]} */ (
        await page.evaluate(`(() => {
        const [, root] = ${page.section}.querySelectorAll('[role=progressbar]');
        return [...root.querySelector('[aria-hidden]').children].map((spoke) => Number(getComputedStyle(spoke).opacity));
      })()`)
      );
      const [top = 1, ...rest] = opacities;
      assert.ok(
        rest.every((opacity) => opacity < top),
        opacities.join(', '),
      );
      assert.ok(
        rest.every(
          (opacity, index) => index === 0 || opacity > (rest[index - 1] ?? 1),
        ),
        opacities.join(', '),
      );
    },
  },
  {
    name: 'progress: a bar’s label and value above (by default), below, before or after its track, or the value in a tooltip at the fill’s end',
    run: async (page) => {
      /** The label's, value's, track's and fill's boxes (left, top, right, bottom). */
      const boxes = () =>
        page.evaluate(`(() => {
          const root = ${page.section}.querySelector('[role=progressbar]');
          const box = (element) => { const { bottom, left, right, top } = element.getBoundingClientRect(); return [left, top, right, bottom].map(Math.round); };
          const track = root.querySelector(':scope > div');
          return { fill: box(track.firstElementChild), label: box(root.querySelector('[data-progress-placement]')), root: box(root), track: box(track), value: box(root.querySelectorAll('[data-progress-placement]')[1]) };
        })()`);
      const content = { label: 'Downloading', showValue: true };

      await page.open('progress', 'light', { state: [null, content] });
      const above = await boxes();
      assert.ok(above.label[3] <= above.track[1], 'above');
      assert.equal(above.label[1], above.value[1], 'one line');
      assert.equal(above.value[2], above.root[2], 'the value at its end');

      await page.open('progress', 'light', {
        state: [
          null,
          content,
          null,
          { placement: 'inline-start' },
          { placement: 'inline-end' },
        ],
      });
      const sides = await boxes();
      assert.equal(sides.label[0], sides.root[0], 'the label first');
      assert.equal(sides.value[2], sides.root[2], 'the value last');
      assert.ok(
        sides.track[0] > sides.label[2] && sides.track[2] < sides.value[0],
      );

      await page.open('progress', 'light', {
        state: [
          null,
          content,
          null,
          { placement: 'block-end' },
          { placement: 'tooltip' },
        ],
      });
      await sleep(300);
      const tooltip = await boxes();
      assert.ok(tooltip.label[1] >= tooltip.track[3], 'below');
      // Centered on the fill's end, 8px above the track.
      assert.ok(
        Math.abs((tooltip.value[0] + tooltip.value[2]) / 2 - tooltip.fill[2]) <=
          1,
        `${tooltip.value.join(', ')} / ${tooltip.fill.join(', ')}`,
      );
      assert.equal(tooltip.track[1] - tooltip.value[3], 8);
    },
  },
  {
    name: 'progress: a momentary tooltip shows the value while the bar is hovered or focused by keyboard (it is focusable then)',
    run: async (page) => {
      await page.open('progress', 'light', {
        state: [
          null,
          { label: 'Downloading', showValue: true },
          null,
          null,
          { placement: 'momentary-tooltip' },
        ],
      });
      await sleep(300);
      const shown = () =>
        page.evaluate(
          `Number(getComputedStyle(${page.section}.querySelector('[data-progress-placement=momentary-tooltip]')).opacity)`,
        );
      await page.mouse('mouseMoved', 1, 600);
      await sleep(300);
      assert.equal(await shown(), 0, 'at rest');
      const root = await page.rect('[role=progressbar]');
      await page.mouse('mouseMoved', root.x + 40, root.y + root.height / 2);
      await sleep(300);
      assert.equal(await shown(), 1, 'hovered');

      await page.mouse('mouseMoved', 1, 600);
      await page.evaluate(
        `${page.section}.querySelector('[role=progressbar]').focus()`,
      );
      await page.key('Shift');
      await sleep(300);
      assert.equal(await shown(), 1, 'focused by keyboard');
    },
  },
];
