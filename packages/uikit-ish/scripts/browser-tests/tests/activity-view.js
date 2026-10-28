/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'activity view: header, people (avatars, a group’s count) and actions (70px circles) in rows, its list; people and actions press',
    run: async (page) => {
      await page.open('activity-view', 'light', {
        state: [{ $rest: true, defaultOpen: true }],
      });
      await sleep(700);
      const parts = await page.evaluate(`(() => {
        const size = (element) => { const { height, width } = element.getBoundingClientRect(); return [width, height].map(Math.round); };
        const thumbnail = document.querySelector('[data-activity-view-part=header] > div');
        const people = [...document.querySelectorAll('[data-activity-view-part=people] > [role=listitem] > button')];
        const actions = [...document.querySelectorAll('[data-activity-view-part=actions] > [role=listitem] > button')];
        return {
          action: size(actions[0].querySelector('[data-activity-view-part=symbol]')),
          actions: actions.map((action) => action.textContent),
          count: people[2].textContent,
          person: [size(people[0]), size(people[0].querySelector('[data-avatar-part=root]'))],
          rows: [people, actions].map((row) => getComputedStyle(row[0].parentElement.parentElement).overflowX),
          thumbnail: [size(thumbnail), getComputedStyle(thumbnail).borderRadius],
          title: getComputedStyle(document.querySelector('[data-activity-view-part=header] > div + div > div')).fontSize,
        };
      })()`);
      assert.deepEqual(parts, {
        action: [70, 70],
        actions: [
          'Copy',
          'Add to Favorites',
          'Add to Reading List',
          'Add Bookmark',
        ],
        count: 'Gary and Fatima2 People',
        person: [parts.person[0], [70, 70]],
        rows: ['auto', 'auto'],
        thumbnail: [[64, 64], '16px'],
        title: '15px',
      });
      assert.equal(parts.person[0][0], 78, 'a person 78px wide');

      for (const label of ['Ashley Kamin', 'Copy']) {
        const center = await page.evaluate(`(() => {
          const button = [...document.querySelectorAll('[data-activity-view-part] > [role=listitem] > button')].find((element) => element.textContent.startsWith(${JSON.stringify(label)}));
          const { height, width, x, y } = button.getBoundingClientRect();
          return [x + width / 2, y + height / 2];
        })()`);
        await page.click(/** @type {[number, number]} */ (center));
      }
      await sleep(200);
      const log = await page.log();
      assert.match(log, /person: Ashley Kamin/u);
      assert.match(log, /action: Copy/u);
    },
  },
];
