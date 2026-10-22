/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { mapped } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The demo's symbol: its box (and its glyph's), its glyph's color, and its
 * badge's place on it (from its end to the badge's start, from its top).
 *
 * @param {Page} page
 */
const symbol = (page) =>
  page.evaluate(`(() => {
    const root = ${page.section}.querySelector('[data-symbol]');
    const glyph = root.querySelector('svg').getBoundingClientRect();
    const box = root.getBoundingClientRect();
    const badge = root.querySelector('[data-badge]')?.getBoundingClientRect();
    return {
      badge: badge ? [Math.round(box.right - badge.left), Math.round(badge.top - box.top)] : null,
      color: getComputedStyle(root.querySelector('svg')).color,
      glyph: [glyph.width, glyph.height].map((value) => Math.round(value * 10) / 10),
      height: Math.round(box.height * 10) / 10,
      name: root.dataset.symbol,
    };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'symbol: an SF Symbol sized as the text’s glyph (its side bearings around it), in its color; a badge on it',
    run: async (page) => {
      await page.open('symbol');
      const regular = await symbol(page);
      assert.equal(regular.name, 'bell');
      assert.equal(regular.badge, null);
      // Its glyph's box is its own (17px: 0.1em of bearing on each side).
      assert.equal(regular.height, regular.glyph[1]);

      // Larger text, larger glyph (in proportion).
      await page.setState(1, { fontSize: '48px' });
      const large = await symbol(page);
      assert.ok(
        Math.abs(large.glyph[1] / regular.glyph[1] - 48 / 17) < 0.02,
        `${large.glyph[1]} / ${regular.glyph[1]}`,
      );

      await page.setState(1, {
        color: 'var(--color-ios-primary)',
        fontSize: '17px',
      });
      await page.setState(0, { children: mapped('[badge: 3]') });
      const badged = await symbol(page);
      assert.equal(badged.color, 'rgb(0, 136, 255)');
      // As on a button's symbol (see the badge's tests).
      assert.deepEqual(badged.badge, [5, -4]);
    },
  },
  {
    name: 'symbol: decorative (its glyph hidden), or an image named on its own',
    run: async (page) => {
      await page.open('symbol-composition-image');
      const named = await page.evaluate(`(() => {
        const symbol = ${page.section}.querySelector('.uikit-symbol');
        return [symbol.getAttribute('role'), symbol.getAttribute('aria-label'), symbol.querySelector('svg').getAttribute('aria-hidden')];
      })()`);
      assert.deepEqual(named, ['img', 'Not synced', 'true']);
    },
  },
];
