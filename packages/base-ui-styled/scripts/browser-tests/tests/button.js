/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'button: heights match Figma per size and variant',
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
        await page.setControl('variant', variant);
        await page.setControl('size', size);
        await page.screenshot(`button-${variant}-${size ?? 'default'}`);

        const rect = await page.rect('stage button');
        assert.equal(rect.height, height, `${variant} ${size} height`);
      }
    },
  },
  {
    name: 'button: circle shape is square with a symbol only',
    run: async (page) => {
      await page.open('button');
      await page.setControl('symbol', '★');
      await page.setControl('label', undefined);
      await page.setControl('shape', 'circle');

      /** @type {[string | undefined, string | undefined, number][]} */
      const cases = [
        ['bordered', 'small', 28],
        ['bordered', 'medium', 34],
        ['bordered', 'large', 50],
        ['glass-prominent', undefined, 48],
      ];

      for (const [variant, size, side] of cases) {
        await page.setControl('variant', variant);
        await page.setControl('size', size);
        await page.screenshot(`button-circle-${variant}-${size ?? 'default'}`);

        const { height, width } = await page.rect('stage button');
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
      await page.open('button');
      await page.setControl('size', 'small');

      const { height, width, x, y } = await page.rect('stage button');
      const hits = await page.evaluate(`(() => {
        const button = ${page.section}.querySelector('stage button');
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
];
