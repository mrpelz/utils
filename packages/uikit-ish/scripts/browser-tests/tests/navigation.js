/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep, withTouch } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The navigation's pages: their roles and left edges (relative to it).
 *
 * @param {Page} page
 * @returns {Promise<[string, number][]>}
 */
const frames = (page) =>
  page.evaluate(`(() => {
    const root = document.querySelector('[data-navigation-part=root]').getBoundingClientRect();
    return [...document.querySelectorAll('[data-navigation-part=page]')].map((frame) => [frame.dataset.navigationRole, Math.round(frame.getBoundingClientRect().left - root.left)]);
  })()`);

/**
 * Clicks a row's title (by its text).
 *
 * @param {Page} page
 * @param {string} text
 */
// eslint-disable-next-line unicorn/no-unnecessary-parameters
const drillInto = async (page, text) => {
  /** @type {[number, number]} */
  const center = await page.evaluate(`(() => {
    const title = [...document.querySelectorAll('[data-navigation-role=current] [data-list-part=title]')].find((element) => element.textContent === ${JSON.stringify(text)});
    const { height, width, x, y } = title.getBoundingClientRect();
    return [x + width / 2, y + height / 2];
  })()`);
  await page.click(center);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'navigation: a pushed page slides in over the one under it, its header’s bar moving with it',
    run: async (page) => {
      await page.open('navigation');
      assert.deepEqual(await frames(page), [['current', 0]]);

      const sampled = page.sample(`(() => {
        const root = document.querySelector('[data-navigation-part=root]').getBoundingClientRect().left;
        const top = document.querySelector('[data-navigation-role=top]');
        const under = document.querySelector('[data-navigation-role=under]');
        if (!top || !under) return null;
        return {
          bar: Math.round(top.querySelector('[role=toolbar]').getBoundingClientRect().left - root),
          top: Math.round(top.getBoundingClientRect().left - root),
          under: Math.round(under.getBoundingClientRect().left - root),
        };
      })()`);
      await drillInto(page, 'General');
      /** @type {({ bar: number, top: number, under: number } | null)[]} */
      const samples = await sampled;
      const moving = samples.filter(
        /** @returns {sample is { bar: number, top: number, under: number }} */
        (sample) => sample !== null,
      );
      assert.ok(
        moving.some(({ top }) => top > 20),
        'sliding in, not jumping',
      );
      assert.ok(
        moving.some(({ under }) => under < -20),
        'the one under it moving back',
      );
      assert.ok(
        moving.every(({ bar, top }) => Math.abs(bar - top) <= 1),
        `the bar with its page: ${moving.map(({ bar, top }) => `${String(bar)}/${String(top)}`).join(', ')}`,
      );

      await sleep(500);
      assert.deepEqual(await frames(page), [
        ['hidden', 0],
        ['current', 0],
      ]);
      assert.match(await page.log(), /push: general/u);
    },
  },
  {
    name: 'navigation: the back button pops; swiped back far enough, it pops, otherwise not',
    run: async (page) => {
      await page.open('navigation');
      await drillInto(page, 'General');
      await sleep(500);

      // The back button.
      const back = await page.rect('[data-navigation-role=current] button');
      await page.click([back.x + back.width / 2, back.y + back.height / 2]);
      await sleep(600);
      assert.deepEqual(await frames(page), [['current', 0]]);

      await drillInto(page, 'General');
      await sleep(500);
      const root = await page.rect('[data-navigation-part=root]');
      const y = root.y + root.height / 2;
      /** @param {number} distance */
      const swipe = async (distance) => {
        await withTouch(page, async (touch) => {
          await touch('touchStart', root.x + 5, y);
          for (let step = 1; step <= 6; step += 1) {
            await touch('touchMove', root.x + 5 + (distance * step) / 6, y);
            await sleep(40);
          }
          await sleep(100);
          await touch('touchEnd');
        });
        await sleep(700);
      };

      // A little (and slowly): it settles back.
      await swipe(root.width * 0.2);
      assert.deepEqual(await frames(page), [
        ['hidden', 0],
        ['current', 0],
      ]);

      // Past half: popped (by the app, on `onBack`).
      await swipe(root.width * 0.7);
      assert.deepEqual(await frames(page), [['current', 0]]);
      const log = await page.log();
      assert.equal(log.split('pop').length - 1, 2, 'popped twice');
    },
  },
  {
    name: 'navigation: switching to another stack shows it at once',
    run: async (page) => {
      await page.open('navigation');
      await drillInto(page, 'General');
      await sleep(500);

      const sampled = page.sample(
        `document.querySelectorAll(${JSON.stringify('[data-navigation-role=top], [data-navigation-role=under]')}).length`,
        400,
      );
      const mail = await page.evaluate(`(() => {
        const { height, width, x, y } = [...document.querySelectorAll('[role=radio]')].find((item) => item.textContent.startsWith('Mail')).getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(mail);
      /** @type {number[]} */
      const moving = await sampled;
      assert.ok(
        moving.every((count) => count === 0),
        'no transition',
      );
      assert.deepEqual(await frames(page), [['current', 0]]);
    },
  },
];
