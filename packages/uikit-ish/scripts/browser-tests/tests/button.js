/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { mapped, rightClick, sleep, withTouch } from '../lib.js';

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'button: heights match the spec per size and variant',
    run: async (page) => {
      await page.open('button');

      /** @type {[string | undefined, string | undefined, number][]} */
      const cases = [
        ['bordered', 'small', 28],
        ['bordered', 'medium', 34],
        ['bordered', 'large', 50],
        ['glass', undefined, 48],
      ];

      for (const [variant, size, height] of cases) {
        await page.setState(1, { variant });
        await page.setState(1, { size });
        await page.screenshot(`button-${variant}-${size ?? 'default'}`);

        const rect = await page.rect('button');
        assert.equal(rect.height, height, `${variant} ${size} height`);
      }
    },
  },
  {
    name: 'button: circle shape is square with a symbol only',
    run: async (page) => {
      // Verbatim content (without `$rest`): a symbol, no label.
      await page.open('button', 'light', {
        state: [{ symbol: '★' }, { $rest: true, shape: 'circle' }],
      });

      /** @type {[string | undefined, string | undefined, number][]} */
      const cases = [
        ['bordered', 'small', 28],
        ['bordered', 'medium', 34],
        ['bordered', 'large', 50],
        ['glass-prominent', undefined, 48],
      ];

      for (const [variant, size, side] of cases) {
        await page.setState(1, { variant });
        await page.setState(1, { size });
        await page.screenshot(`button-circle-${variant}-${size ?? 'default'}`);

        const { height, width } = await page.rect('button');
        assert.deepEqual(
          { height, width },
          { height: side, width: side },
          `${variant} ${size}`,
        );
      }
    },
  },
  {
    name: 'button: small buttons have a 44px hit region',
    run: async (page) => {
      await page.open('button', 'light', {
        state: [null, { $rest: true, size: 'small' }],
      });
      // Room around it (raw, it's at the page's top).
      await page.evaluate(
        `document.body.style.padding = ${JSON.stringify('48px')}`,
      );

      const { height, width, x, y } = await page.rect('button');
      const hits = await page.evaluate(`(() => {
        const button = ${page.section}.querySelector('button');
        const hit = (px, py) => button.contains(document.elementFromPoint(px, py));
        const cx = ${x + width / 2};
        const cy = ${y + height / 2};
        return {
          inside: [hit(cx, cy - 21), hit(cx, cy + 21)],
          outside: [hit(cx, cy - 23), hit(cx, cy + 23)],
        };
      })()`);
      assert.deepEqual(hits, {
        inside: [true, true],
        outside: [false, false],
      });
    },
  },
  {
    name: 'button: fill grows it to the available width, its content centered',
    run: async (page) => {
      await page.open('button', 'light', {
        state: [null, { $rest: true, variant: 'bordered' }],
      });
      /** @returns {Promise<[number, number, number]>} */
      const measure = () =>
        page.evaluate(`(() => {
          const button = ${page.section}.querySelector('button');
          const box = button.getBoundingClientRect();
          const parent = button.parentElement.getBoundingClientRect();
          const label = button.lastElementChild.getBoundingClientRect();
          return [Math.round(box.width), Math.round(parent.width - box.width), Math.round(label.left + label.width / 2 - (box.left + box.width / 2))];
        })()`);
      const [hugging] = await measure();
      // In the page's width (raw, its parent).
      await page.setState(1, { fill: true });
      const [width, rest, offset] = await measure();
      assert.ok(width > hugging + 200, `${hugging}px → ${width}px`);
      assert.deepEqual([rest, offset], [0, 0]);
    },
  },
  {
    name: 'button: a right click, or a touch held, is a secondary click (its click not following)',
    run: async (page) => {
      await page.open('button', 'light', {
        state: [
          null,
          {
            $rest: true,
            onSecondaryClick: mapped('[log secondary click]'),
          },
        ],
      });
      const { height, width, x, y } = await page.rect('button');
      /** @type {[number, number]} */
      const center = [x + width / 2, y + height / 2];
      const count = async (/** @type {string} */ text) => {
        const log = await page.log();
        return log.split(text).length - 1;
      };

      await rightClick(page, center);
      await sleep(100);
      assert.equal(await count('secondary click'), 1, 'right click');
      assert.equal(await count('clicked'), 0);

      await withTouch(page, async (touch) => {
        await touch('touchStart', ...center);
        await sleep(700);
        await touch('touchEnd');
      });
      await sleep(200);
      assert.equal(await count('secondary click'), 2, 'held');
      assert.equal(await count('clicked'), 0, 'no click after');

      // A tap: a click.
      await withTouch(page, async (touch) => {
        await touch('touchStart', ...center);
        await sleep(100);
        await touch('touchEnd');
      });
      await sleep(200);
      assert.equal(await count('secondary click'), 2, 'tapped');
      assert.equal(await count('clicked'), 1);
    },
  },
  {
    name: 'button: its text color over its variant’s (a prominent one’s tint)',
    run: async (page) => {
      for (const variant of ['bordered-prominent', 'glass-prominent']) {
        await page.open('button', 'light', {
          state: [null, { $rest: true, textColor: '#000', variant }],
        });
        const color = await page.evaluate(
          `getComputedStyle(${page.section}.querySelector('button [data-button-part=label]')).color`,
        );
        assert.equal(color, 'rgb(0, 0, 0)', variant);
      }
    },
  },
];
