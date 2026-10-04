/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The calendar's state: its title, the selected and focusable days.
 *
 * @param {Page} page
 * @returns {Promise<{ focusable: string | undefined, selected: string | undefined, title: string }>}
 */
const calendar = (page) =>
  page.evaluate(`(() => {
    const days = [...document.querySelectorAll('[aria-pressed]')];
    return {
      focusable: days.find((day) => day.tabIndex === 0)?.textContent,
      selected: days.find((day) => day.getAttribute('aria-pressed') === 'true')?.textContent,
      title: document.querySelector('[role=group]').parentElement.querySelector('h2').textContent,
    };
  })()`);

/**
 * Clicks a day of the shown month.
 *
 * @param {Page} page
 * @param {string} day
 */
const clickDay = async (page, day) => {
  const point = await page.evaluate(`(() => {
    const day = [...document.querySelectorAll('[aria-pressed]')].find((element) => element.textContent === ${JSON.stringify(day)});
    const { height, width, x, y } = day.getBoundingClientRect();
    return [x + width / 2, y + height / 2];
  })()`);
  await page.click(point);
  await sleep(200);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'date picker: the inline calendar matches Figma',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');

      const measured = await page.evaluate(`(() => {
        const title = document.querySelector('[role=group]').parentElement.querySelector('h2');
        const header = title.parentElement.getBoundingClientRect();
        const weekdays = document.querySelector('abbr').parentElement;
        const days = [...document.querySelectorAll('[aria-pressed]')];
        const [first] = days;
        const below = days.find((day) => day.textContent === String(Number(first.textContent) + 7));
        const selected = days.find((day) => day.getAttribute('aria-pressed') === 'true');
        const style = (element) => getComputedStyle(element);
        return {
          day: [first.getBoundingClientRect().width, first.getBoundingClientRect().height, style(first).fontSize],
          header: header.height,
          rowGap: Math.round(below.getBoundingClientRect().top - first.getBoundingClientRect().bottom),
          selected: [selected.textContent, style(selected).fontSize, style(selected).color],
          title: [title.textContent, style(title).fontSize],
          weekdays: [weekdays.getBoundingClientRect().height, style(weekdays).fontSize, style(weekdays).textTransform, weekdays.firstElementChild.textContent],
        };
      })()`);
      assert.deepEqual(measured, {
        day: [44, 44, '20px'],
        header: 40,
        rowGap: 7,
        selected: ['20', '24px', 'rgb(0, 136, 255)'],
        title: ['April 2025', '17px'],
        weekdays: [20, '13px', 'uppercase', 'Sun'],
      });
    },
  },
  {
    name: 'date picker: selects days, shows other months, moves by keyboard',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');

      await clickDay(page, '23');
      assert.deepEqual(await calendar(page), {
        focusable: '23',
        selected: '23',
        title: 'April 2025',
      });
      assert.match(
        await page.evaluate(
          `${page.section}.querySelector('config').textContent`,
        ),
        /value change: 4\/23\/2025, 9:41:00 AM/u,
      );

      // Keyboard: a day on, a week on, a month on (into May).
      await page.evaluate(
        'document.querySelector(\'[aria-pressed][tabindex="0"]\').focus()',
      );
      await page.key('ArrowRight');
      await page.key('ArrowDown');
      const moved = await calendar(page);
      assert.deepEqual([moved.focusable, moved.title], ['1', 'May 2025']);
      await page.key('PageUp');
      const back = await calendar(page);
      assert.equal(back.title, 'April 2025');

      // The arrows show other months.
      const next = await page.rect('[aria-label="Next month"]');
      await page.click([next.x + next.width / 2, next.y + next.height / 2]);
      await sleep(200);
      const { title } = await calendar(page);
      assert.equal(title, 'May 2025');
    },
  },
  {
    name: 'date picker: compact, the date opens the calendar in a popover',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('locale', 'en-US');
      const button = await page.rect('button');
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('button').textContent`,
        ),
        'Apr 20, 2025',
      );

      await page.click([
        button.x + button.width / 2,
        button.y + button.height / 2,
      ]);
      await sleep(600);
      const popup = await page.evaluate(`(() => {
        const popup = document.querySelector('[role=dialog]');
        const box = popup.getBoundingClientRect();
        return [Math.round(box.top - ${button.y + button.height}), getComputedStyle(popup).borderRadius];
      })()`);
      assert.deepEqual(popup, [8, '13px']);

      await clickDay(page, '22');
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('button').textContent`,
        ),
        'Apr 22, 2025',
      );
    },
  },
  {
    name: 'date picker: the week starts by the locale; limits disable days and months',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'de-DE');
      const first = await page.evaluate(
        `document.querySelector(${JSON.stringify('abbr')}).title`,
      );
      assert.equal(first, 'Montag');

      await page.setMappedControl('min', '[April 10, 2025]');
      const limits = await page.evaluate(`(() => {
        const days = [...document.querySelectorAll('[aria-pressed]')];
        return [days.find((day) => day.textContent === '9').disabled, days.find((day) => day.textContent === '10').disabled, document.querySelector('[aria-label="Previous month"]').disabled];
      })()`);
      assert.deepEqual(limits, [true, false, true]);
    },
  },
  {
    name: 'date picker: an inline calendar in a list row has its own insets',
    run: async (page) => {
      await page.open('list-form');
      const insets = await page.evaluate(`(() => {
        const calendar = document.querySelector('[data-date-picker-part=calendar]');
        const row = calendar.parentElement.getBoundingClientRect();
        const title = calendar.querySelector('h2').getBoundingClientRect();
        return [Math.round(title.left - row.left), Math.round(calendar.getBoundingClientRect().top - row.top)];
      })()`);
      assert.deepEqual(insets, [16, 0]);
    },
  },
];
