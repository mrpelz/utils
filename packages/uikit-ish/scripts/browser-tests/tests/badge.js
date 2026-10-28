/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The demo's badges (on the button's and the tabs' symbols, inline): their
 * boxes relative to their symbols (their `Symbol`s: from the symbol's end to
 * the badge's start, from its top), styles, and the inline one's center from
 * its row's.
 *
 * @param {Page} page
 */
const badges = (page) =>
  page.evaluate(`(() => {
    const [button, favorites, , search, inline] = ${page.section}.querySelectorAll('[data-badge]');
    const relative = (badge, symbol) => {
      const box = badge.getBoundingClientRect();
      const of = symbol.getBoundingClientRect();
      return { end: Math.round(of.right - box.left), height: Math.round(box.height), top: Math.round(box.top - of.top), width: Math.round(box.width) };
    };
    const style = (element) => { const computed = getComputedStyle(element); return [computed.backgroundColor, computed.color, computed.fontSize, computed.lineHeight, computed.paddingInlineStart]; };
    const row = inline.closest('[data-list-part=row]').getBoundingClientRect();
    const dot = inline.getBoundingClientRect();
    return {
      button: relative(button, button.parentElement),
      favorites: relative(favorites, favorites.parentElement),
      inline: [getComputedStyle(inline).position, Math.round(dot.height), style(inline)],
      inlineCenter: Math.round(dot.top + dot.height / 2 - (row.top + row.height / 2)),
      search: relative(search, search.parentElement),
      style: style(button),
    };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'badge: on a symbol (as Framework7’s), the tabs’ alike; inline as Figma’s; a dot without content; tinted',
    run: async (page) => {
      await page.open('badge', 'light', {
        state: [{ $rest: true, children: 3 }],
      });
      const digit = await badges(page);
      // On a symbol: starting 5px before its end, 4px above it, 16px.
      assert.deepEqual(digit.button, {
        end: 5,
        height: 16,
        top: -4,
        width: 16,
      });
      assert.deepEqual(digit.favorites, {
        end: 5,
        height: 16,
        top: -4,
        width: 16,
      });
      // A symbol-only tab's too (its symbol centered, lower).
      assert.deepEqual(digit.search, digit.favorites, 'search');
      assert.deepEqual(digit.style, [
        'rgb(255, 56, 60)',
        'rgb(255, 255, 255)',
        '10px',
        '12px',
        '2px',
      ]);
      // Inline: Figma's (a circle for a digit).
      assert.deepEqual(digit.inline, [
        'static',
        24,
        ['rgb(255, 56, 60)', 'rgb(255, 255, 255)', '16px', '19px', '7px'],
      ]);

      // Longer: wider, growing outward.
      await page.setState(0, { children: 999 });
      const long = await badges(page);
      assert.equal(long.button.end, 5);
      assert.ok(long.button.width > 16, `${long.button.width}`);

      // Without content: a dot, centered on a symbol's corner, inline in
      // its row's center.
      await page.setState(0, { children: '$undefined' });
      const dot = await badges(page);
      assert.deepEqual(dot.button, { end: 5, height: 10, top: -5, width: 10 });
      assert.ok(Math.abs(dot.inlineCenter) <= 1, `${dot.inlineCenter}`);

      await page.setState(0, { tint: 'var(--color-ios-system-blue)' });
      const tinted = await badges(page);
      assert.equal(tinted.style[0], 'rgb(0, 136, 255)');

      // Its text color over the tint.
      await page.setState(0, { children: 3, textColor: '#000' });
      const dark = await badges(page);
      assert.equal(dark.style[1], 'rgb(0, 0, 0)');
    },
  },
  {
    name: 'badge: on a collapsed tab bar, on the remaining (active) tab’s symbol; on tabs collapsing away, fading with them',
    run: async (page) => {
      await page.open('badge', 'light', {
        state: [{ $rest: true, children: 3 }, { collapsed: true }],
      });
      await sleep(600);
      await sleep(400);
      const collapsed = await page.evaluate(`(() => {
        const [favorites, contacts, search] = ${page.section}.querySelectorAll('[role=tab] [data-badge]');
        const icon = favorites.parentElement.getBoundingClientRect();
        const box = favorites.getBoundingClientRect();
        return { contacts: Number(getComputedStyle(contacts).opacity), favorites: [Math.round(icon.right - box.left), Math.round(box.top - icon.top), Number(getComputedStyle(favorites).opacity)], search: Number(getComputedStyle(search).opacity) };
      })()`);
      // Contacts' and Search's (their tabs collapsing away) fade with them.
      assert.deepEqual(collapsed, {
        contacts: 0,
        favorites: [5, -4, 1],
        search: 0,
      });

      // Recents (unbadged) active: all the tabs' badges collapse away.
      await page.setState(1, { collapsed: false });
      await sleep(600);
      const recents = await page.rect('[role=tab]:nth-of-type(2)');
      await page.click([
        recents.x + recents.width / 2,
        recents.y + recents.height / 2,
      ]);
      await sleep(300);
      await page.setState(1, { collapsed: true });
      await sleep(1000);
      const shown = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=tab] [data-badge]')].map((badge) => [Number(getComputedStyle(badge).opacity), getComputedStyle(badge).visibility])`,
      );
      assert.deepEqual(shown, [
        [0, 'hidden'],
        [0, 'hidden'],
        [0, 'hidden'],
      ]);
    },
  },
  {
    name: 'badge: placed only by `placement` (on a symbol: smaller; on its parent’s corner; inline), never by its parent',
    run: async (page) => {
      /** @param {string} placement */
      const placed = async (placement) => {
        await page.open('badge-parts-badge', 'light', {
          state: [{ $rest: true, placement }],
        });
        return page.evaluate(`(() => {
          const badge = ${page.section}.querySelector('[data-badge]');
          const box = badge.getBoundingClientRect();
          const of = badge.parentElement.getBoundingClientRect();
          return [badge.dataset.badge, getComputedStyle(badge).position, Math.round(box.height), Math.round(of.right - box.left), Math.round(box.top - of.top)];
        })()`);
      };

      // In a `Symbol` all three: its own size and place, each.
      assert.deepEqual(await placed('symbol'), [
        'symbol',
        'absolute',
        16,
        5,
        -4,
      ]);
      assert.deepEqual(await placed('corner'), [
        'corner',
        'absolute',
        24,
        14,
        -6,
      ]);
      const inline = await placed('inline');
      assert.deepEqual(inline.slice(0, 3), ['inline', 'static', 24]);
    },
  },
  {
    name: 'badge: on an avatar’s corner, a dot inside it; in a toolbar button’s name',
    run: async (page) => {
      await page.open('badge-composition-avatar');
      const avatars = await page.evaluate(
        `[...${page.section}.querySelectorAll('[data-badge]')].map((badge) => { const box = badge.getBoundingClientRect(); const of = badge.parentElement.getBoundingClientRect(); return [Math.round(box.width), Math.round(of.right - box.right), Math.round(box.top - of.top)]; })`,
      );
      // A count overhanging the corner; a dot inside it, 2px from its edges.
      assert.deepEqual(avatars, [
        [24, -10, -6],
        [10, 2, 2],
      ]);

      await page.open('badge-composition-toolbar');
      const button = await page.evaluate(
        `(() => { const badge = ${page.section}.querySelector('[data-badge]'); return [badge.closest('button').getAttribute('aria-label'), Math.round(badge.getBoundingClientRect().height)]; })()`,
      );
      assert.deepEqual(button, ['Mail, 12 unread', 16]);
    },
  },
];
