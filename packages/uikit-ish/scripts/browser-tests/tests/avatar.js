/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { mapped, sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The demo's avatar (or group): its size, image or initials, its badge's
 * place, and its people's boxes (relative to it).
 *
 * @param {Page} page
 */
const avatar = (page) =>
  page.evaluate(`(() => {
    const root = ${page.section}.querySelector('[data-avatar-part=root], [role=group]');
    const box = root.getBoundingClientRect();
    const relative = (element) => { const { height, left, top } = element.getBoundingClientRect(); return [left - box.left, top - box.top, height].map(Math.round); };
    const image = root.querySelector(':scope > img');
    const fallback = root.querySelector(':scope > [data-avatar-part=fallback]');
    const badge = root.querySelector(':scope > [data-badge]');
    return {
      badge: badge ? relative(badge).slice(0, 2) : null,
      fallback: fallback?.textContent ?? null,
      image: image ? image.complete && image.naturalWidth > 0 : false,
      people: [...root.querySelectorAll(':scope > [data-avatar-part=root]')].map(relative),
      size: [box.width, box.height].map(Math.round),
    };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'avatar: a photo (70px), or the person’s initials (no or a broken image); badged on its corner',
    run: async (page) => {
      await page.open('avatar', 'light', {
        state: [{ $rest: true, badge: true }],
      });
      await sleep(400);
      const photo = await avatar(page);
      assert.deepEqual(
        [photo.size, photo.image, photo.fallback],
        [[70, 70], true, null],
      );
      // On its top end corner (14px before its end, 6px above it).
      assert.deepEqual(photo.badge, [56, -6]);

      for (const src of ['$undefined', mapped('[broken: initials]')]) {
        await page.open('avatar', 'light', {
          state: [{ $rest: true }, null, { src }],
        });
        await sleep(400);
        const initials = await avatar(page);
        assert.deepEqual(
          [initials.image, initials.fallback],
          [false, 'AK'],
          src,
        );
      }

      await page.open('avatar', 'light', {
        state: [{ $rest: true }, { $rest: true, size: 100 }],
      });
      await sleep(300);
      const large = await avatar(page);
      assert.deepEqual(large.size, [100, 100]);
    },
  },
  {
    name: 'avatar: several people in one circle (the first 37px, 9px in; the second 22px; a third)',
    run: async (page) => {
      await page.open('avatar', 'light', {
        state: [{ $rest: true, people: 2 }],
      });
      await sleep(400);
      const two = await avatar(page);
      assert.deepEqual(two.size, [70, 70]);
      assert.deepEqual(two.people, [
        [9, 9, 37],
        [38, 38, 22],
      ]);

      await page.setState(0, { people: 3 });
      await sleep(300);
      const three = await avatar(page);
      assert.equal(three.people.length, 3);
      assert.equal(three.people[2]?.[2], 18);
    },
  },
  {
    name: 'avatar: its image marked as its part, named by alt; a group named, sizing its people',
    run: async (page) => {
      await page.open('avatar-parts-group');
      const group = await page.evaluate(`(() => {
        const group = ${page.section}.querySelector('[data-avatar-part=group]');
        const images = [...group.querySelectorAll('[data-avatar-part=image]')].map((image) => image.getAttribute('alt'));
        const sizes = [...group.querySelectorAll('[data-avatar-part=root]')].map((root) => Math.round(root.getBoundingClientRect().width));
        return { images, label: group.getAttribute('aria-label'), role: group.getAttribute('role'), sizes };
      })()`);
      // 53%, 31% and 26% of 70px.
      assert.deepEqual(group, {
        images: ['Anna Hall', 'Kate Brown'],
        label: 'Weekend Trip',
        role: 'group',
        sizes: [37, 22, 18],
      });
    },
  },
];
