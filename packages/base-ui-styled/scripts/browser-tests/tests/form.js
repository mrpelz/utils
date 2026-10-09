/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Types into a field (by name), replacing its value.
 *
 * @param {Page} page
 * @param {string} name
 * @param {string} text
 */
const type = async (page, name, text) => {
  await page.evaluate(
    `document.querySelector(${JSON.stringify(`input[name=${name}]`)}).focus()`,
  );
  await page.browser.send('Input.insertText', { text });
  await sleep(50);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'form: fieldsets are list sections, their legends headers; it submits valid values only',
    run: async (page) => {
      await page.open('form');
      const layout = await page.evaluate(`(() => {
        const fieldset = document.querySelector('fieldset');
        const style = getComputedStyle(fieldset);
        return {
          border: style.borderTopWidth,
          header: fieldset.querySelector('[data-list-part=header]')?.textContent,
          section: fieldset.dataset.listPart,
        };
      })()`);
      assert.deepEqual(layout, {
        border: '0px',
        header: 'Contact',
        section: 'section',
      });

      const submit = async () => {
        await page.evaluate(
          `document.querySelector(${JSON.stringify('button[type=submit]')}).click()`,
        );
        await sleep(200);
      };

      // Invalid: not submitted (name missing, email malformed).
      await type(page, 'email', 'kate');
      await submit();
      assert.doesNotMatch(await page.log(), /submitted/u, 'invalid');

      await type(page, 'name', 'Kate Bell');
      await type(page, 'email', '@example.com');
      await submit();
      const log = await page.log();
      assert.match(log, /submitted: .*"name":"Kate Bell"/u);
      assert.match(log, /"email":"kate@example.com"/u);
      assert.match(log, /"appearance":"automatic"/u);
    },
  },
  {
    name: 'form: a mixed checkbox shows a dash; a disabled fieldset disables its fields',
    run: async (page) => {
      await page.open('form', 'light', {
        state: [
          null,
          { $rest: true, disabled: true },
          null,
          null,
          { $rest: true, indeterminate: true },
        ],
      });
      await sleep(200);
      const state = await page.evaluate(`(() => {
        const checkbox = document.querySelector('[role=checkbox]');
        const glyphs = [...checkbox.querySelectorAll('svg')].map((svg) => getComputedStyle(svg).display);
        return {
          disabled: document.querySelector('input[name=name]').disabled,
          glyphs,
          mixed: checkbox.getAttribute('aria-checked'),
        };
      })()`);
      assert.deepEqual(state, {
        disabled: true,
        glyphs: ['none', 'block'],
        mixed: 'mixed',
      });
    },
  },
];
