/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The open alert's panel and parts.
 *
 * @param {Page} page
 */
const alert = (page) =>
  page.evaluate(`(() => {
    const popup = document.querySelector('[role=alertdialog]');
    if (!popup) return null;
    const style = getComputedStyle(popup);
    const actions = [...popup.querySelectorAll('[data-alert-part=action]')].map((action) => {
      const { height, left, top, width } = action.getBoundingClientRect();
      const actionStyle = getComputedStyle(action);
      return { box: [left, top, width, height].map(Math.round), colors: [actionStyle.color, actionStyle.backgroundColor] };
    });
    return {
      actions,
      fields: [...popup.querySelectorAll('[data-alert-part=field]')].map((field) => field.getBoundingClientRect().height),
      panel: [popup.getBoundingClientRect().width, style.padding, style.borderRadius],
    };
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'alert: matches Figma (panel, fields, buttons side by side or stacked); its buttons close it',
    run: async (page) => {
      await page.open('alert', 'light', {
        state: [{ defaultOpen: true }, { actions: 'two', fields: true }],
      });
      await sleep(500);
      const two = await alert(page);
      if (!two) throw new Error('not open');
      assert.deepEqual(two.panel, [300, '14px', '34px']);
      assert.deepEqual(two.fields, [52, 52]);
      const [cancel, ok] = two.actions;
      if (!cancel || !ok) throw new Error('missing buttons');
      // Side by side, 16px apart, 48px high; OK white on blue.
      assert.equal(cancel.box[1], ok.box[1], 'side by side');
      assert.equal(ok.box[0] - (cancel.box[0] + cancel.box[2]), 16);
      assert.deepEqual([cancel.box[3], ok.box[3]], [48, 48]);
      assert.deepEqual(ok.colors, ['rgb(255, 255, 255)', 'rgb(0, 136, 255)']);

      // Three: stacked, 10px apart; destructive in red.
      await page.setState(1, { actions: 'three', fields: false });
      await sleep(300);
      const three = await alert(page);
      if (!three) throw new Error('not open');
      const [primary, destructive] = three.actions;
      if (!primary || !destructive) throw new Error('missing buttons');
      assert.equal(destructive.box[1] - (primary.box[1] + primary.box[3]), 10);
      assert.equal(primary.box[2], 272, 'full width');
      assert.equal(destructive.colors[0], 'rgb(255, 56, 60)');

      // A button closes it.
      await page.click([
        destructive.box[0] + destructive.box[2] / 2,
        destructive.box[1] + destructive.box[3] / 2,
      ]);
      await sleep(500);
      assert.equal(await alert(page), null, 'closed');
      assert.match(await page.log(), /action: destructive/u);
    },
  },
];
