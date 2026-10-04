/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

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
      title: document.querySelector('[data-date-picker-part=calendar] h2').textContent,
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

/** @param {number[]} values */
const isDecreasing = (values) =>
  values.every(
    (value, index) => index === 0 || value <= (values[index - 1] ?? value),
  );

/** @param {number[]} values */
const isIncreasing = (values) =>
  values.every(
    (value, index) => index === 0 || value >= (values[index - 1] ?? value),
  );

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'date picker: the inline calendar matches Figma',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');

      const measured = await page.evaluate(`(() => {
        const title = document.querySelector('[data-date-picker-part=calendar] h2');
        const header = title.parentElement.getBoundingClientRect();
        const weekdays = document.querySelector('abbr').parentElement;
        const days = [...document.querySelectorAll('[aria-pressed]')];
        const [first] = days;
        const below = days.find((day) => day.textContent === String(Number(first.textContent) + 7));
        const selected = days.find((day) => day.getAttribute('aria-pressed') === 'true');
        const style = (element) => getComputedStyle(element);
        return {
          day: [getComputedStyle(first, '::before').width, first.getBoundingClientRect().height, style(first).fontSize],
          header: header.height,
          rowGap: Math.round(below.getBoundingClientRect().top - first.getBoundingClientRect().bottom),
          selected: [selected.textContent, style(selected).fontSize, style(selected).color],
          title: [title.textContent, style(title).fontSize],
          weekdays: [weekdays.getBoundingClientRect().height, style(weekdays).fontSize, style(weekdays).textTransform, weekdays.firstElementChild.textContent],
        };
      })()`);
      assert.deepEqual(measured, {
        day: ['44px', 44, '20px'],
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
        `document.querySelector(${JSON.stringify('[aria-pressed][tabindex="0"]')}).focus()`,
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
    name: 'date picker: in a list, pickers open in expandable rows below, with their own insets',
    run: async (page) => {
      await page.open('list-form');
      /** @returns {Promise<{ date: [number, string], time: [number, string] }>} */
      const rows = () =>
        page.evaluate(`(() => {
          const [calendar, roll] = [${JSON.stringify('[data-date-picker-part=calendar]')}, ${JSON.stringify('[role=listbox]')}].map((selector) => document.querySelector(selector).closest('li'));
          return {
            date: [Math.round(calendar.getBoundingClientRect().height), String(calendar.inert)],
            time: [Math.round(roll.getBoundingClientRect().height), String(roll.inert)],
          };
        })()`);
      assert.deepEqual(await rows(), { date: [0, 'true'], time: [0, 'true'] });

      // The date's button: the calendar opens below, its title 16px in.
      const date = await page.evaluate(`(() => {
        const button = document.querySelector(${JSON.stringify('[data-date-picker-part=calendar]')}).closest('li').previousElementSibling.querySelector('button');
        button.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = button.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(date);
      await sleep(600);
      const opened = await rows();
      assert.ok(opened.date[0] > 300, `calendar row ${opened.date[0]}`);
      assert.equal(opened.time[0], 0);
      const insets = await page.evaluate(`(() => {
        const calendar = document.querySelector(${JSON.stringify('[data-date-picker-part=calendar]')});
        const row = calendar.parentElement.getBoundingClientRect();
        const title = calendar.querySelector('h2').getBoundingClientRect();
        return [Math.round(title.left - row.left), Math.round(calendar.getBoundingClientRect().top - row.top)];
      })()`);
      assert.deepEqual(insets, [16, 0]);

      // The time's: the roll instead.
      const time = await page.evaluate(`(() => {
        const { height, width, x, y } = document.querySelector(${JSON.stringify('[aria-label=Time][aria-expanded]')}).getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(time);
      await sleep(600);
      const swapped = await rows();
      assert.equal(swapped.date[0], 0);
      assert.ok(swapped.time[0] >= 216, `roll row ${swapped.time[0]}`);
    },
  },
  {
    name: 'date picker: the title opens a month and year roll',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');

      const title = await page.rect('h2 button');
      await page.click([title.x + title.width / 2, title.y + title.height / 2]);
      await sleep(300);
      const open = await page.evaluate(`(() => {
        const columns = [...document.querySelectorAll('[role=listbox]')];
        return {
          columns: columns.map((column) => [column.getAttribute('aria-label'), column.querySelector('[aria-selected=true]').textContent]),
          days: getComputedStyle(document.querySelector('[role=group]')).visibility,
          expanded: document.querySelector('h2 button').getAttribute('aria-expanded'),
        };
      })()`);
      assert.deepEqual(open, {
        columns: [
          ['Month', 'April'],
          ['Year', '2025'],
        ],
        days: 'hidden',
        expanded: 'true',
      });

      // Two months on (by keyboard), and a typed year.
      await page.evaluate(
        `document.querySelector(${JSON.stringify('[role=listbox]')}).focus()`,
      );
      await page.key('ArrowDown');
      await sleep(100);
      await page.key('ArrowDown');
      await sleep(800);
      const year = await page.evaluate(`(() => {
        const { height, width, x, y } = document.querySelectorAll('[role=listbox]')[1].getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(year);
      await sleep(200);
      await page.browser.send('Input.insertText', { text: '2027' });
      await page.key('Enter');
      await sleep(800);
      assert.equal(
        await page.evaluate(
          `document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] h2')}).textContent`,
        ),
        'June 2027',
      );

      // Closed: the days of that month.
      await page.click([title.x + title.width / 2, title.y + title.height / 2]);
      await sleep(300);
      assert.equal(
        await page.evaluate(
          `[document.querySelectorAll(${JSON.stringify('[role=listbox]')}).length, getComputedStyle(document.querySelector(${JSON.stringify('[role=group]')})).visibility].join()`,
        ),
        '0,visible',
      );
    },
  },
  {
    name: 'date picker: the time is a roll (in place, and in a popover)',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('mode', 'dateAndTime');
      await page.setControl('locale', 'en-US');

      const button = await page.rect('[aria-label=Time]');
      await page.click([
        button.x + button.width / 2,
        button.y + button.height / 2,
      ]);
      await sleep(300);
      const columns = await page.evaluate(
        `[...document.querySelectorAll(${JSON.stringify('[role=listbox]')})].map((column) => [column.getAttribute(${JSON.stringify('aria-label')}), column.querySelector(${JSON.stringify('[aria-selected=true]')}).textContent])`,
      );
      assert.deepEqual(columns, [
        ['Hours', '9'],
        ['Minutes', '41'],
        ['AM/PM', 'AM'],
      ]);

      await page.evaluate(
        `document.querySelectorAll(${JSON.stringify('[role=listbox]')})[2].focus()`,
      );
      await page.key('ArrowDown');
      await sleep(800);
      assert.equal(
        await page.evaluate(
          `document.querySelector(${JSON.stringify('[aria-label=Time]')}).textContent`,
        ),
        '9:41 PM',
      );
      assert.match(
        await page.evaluate(
          `${page.section}.querySelector('config').textContent`,
        ),
        /value change: 4\/20\/2025, 9:41:00 PM/u,
      );

      // Compact: the time's button opens the roll in a popover; 24 hours in
      // German, the buttons equally high.
      await page.setControl('pickerStyle', 'compact');
      await page.setControl('locale', 'de-DE');
      const heights = await page.evaluate(
        `[...${page.section}.querySelectorAll('stage button')].map((button) => button.getBoundingClientRect().height)`,
      );
      assert.deepEqual(heights, [34, 34]);
      const time = await page.rect('[aria-label=Time]');
      await page.click([time.x + time.width / 2, time.y + time.height / 2]);
      await sleep(600);
      const popover = await page.evaluate(
        `[...document.querySelectorAll(${JSON.stringify('[role=dialog] [role=listbox]')})].map((column) => [column.getAttribute(${JSON.stringify('aria-label')}), column.querySelector(${JSON.stringify('[aria-selected=true]')}).textContent])`,
      );
      assert.deepEqual(popover, [
        ['Hours', '09'],
        ['Minutes', '41'],
      ]);

      // One popover: the calendar's, its days hidden behind the roll; the
      // date's button shows its days.
      const shown = () =>
        page.evaluate(
          `[document.querySelectorAll(${JSON.stringify('[role=dialog]')}).length, getComputedStyle(document.querySelector(${JSON.stringify('[role=dialog] [role=group]')})).visibility]`,
        );
      assert.deepEqual(await shown(), [1, 'hidden']);
      const date = await page.rect('stage button');
      await page.click([date.x + date.width / 2, date.y + date.height / 2]);
      await sleep(700);
      assert.deepEqual(await shown(), [1, 'visible']);
    },
  },
  {
    name: 'date picker: ranges, and capsule buttons',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('range', true);
      await page.setControl('locale', 'en-US');
      await page.setControl('buttonShape', 'capsule');

      const button = await page.rect('stage button');
      assert.deepEqual(
        await page.evaluate(
          `(() => { const button = ${page.section}.querySelector('stage button'); return [button.textContent, getComputedStyle(button).borderRadius]; })()`,
        ),
        ['Apr 20 – 24, 2025', '1000px'],
      );

      await page.click([
        button.x + button.width / 2,
        button.y + button.height / 2,
      ]);
      await sleep(600);

      /** @returns {Promise<string[]>} */
      const places = () =>
        page.evaluate(
          `[...document.querySelectorAll(${JSON.stringify('[data-range]')})].map((day) => day.textContent + ${JSON.stringify(':')} + day.dataset.range)`,
        );
      assert.deepEqual(await places(), [
        '20:start',
        '21:middle',
        '22:middle',
        '23:middle',
        '24:end',
      ]);

      // A new range: its start, then its end (here: before it).
      await clickDay(page, '15');
      assert.deepEqual(await places(), ['15:single']);
      await clickDay(page, '12');
      assert.deepEqual(await places(), [
        '12:start',
        '13:middle',
        '14:middle',
        '15:end',
      ]);
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('stage button').textContent`,
        ),
        'Apr 12 – 15, 2025',
      );
    },
  },
  {
    name: 'date picker: the first weekday, highlighted weekdays and days, the hour cycle',
    run: async (page) => {
      await page.open('date-and-time-picker');
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');
      await page.setControl('firstDayOfWeek', 1);
      await page.setMappedControl('highlightedWeekdays', '[weekend: 0, 6]');
      await page.setMappedControl('highlighted', '[the 3rd, 14th, 25th]');
      await page.setControl('hourCycle', 'h23');

      const state = await page.evaluate(`(() => {
        const days = [...document.querySelectorAll('[aria-pressed]')];
        const day = (text) => days.find((element) => element.textContent === text);
        const abbrs = [...document.querySelectorAll('abbr')];
        return {
          dots: days.filter((element) => getComputedStyle(element, '::after').content !== 'none').map((element) => element.textContent),
          first: abbrs[0].textContent,
          time: document.querySelector('[aria-label=Time]').textContent,
          weekend: [abbrs.at(-1).textContent, getComputedStyle(abbrs.at(-1)).color, getComputedStyle(day('5')).color, getComputedStyle(day('7')).color],
        };
      })()`);
      assert.deepEqual(state, {
        dots: ['3', '14', '25'],
        first: 'Mon',
        time: '09:41',
        weekend: [
          'Sun',
          'rgba(60, 60, 67, 0.6)',
          'rgba(60, 60, 67, 0.6)',
          'rgb(0, 0, 0)',
        ],
      });
    },
  },
  {
    name: 'date picker: a range is dragged into existence',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('range', true);
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');

      /** @param {string} text */
      const center = (text) =>
        page.evaluate(`(() => {
          const day = [...document.querySelectorAll('[aria-pressed]')].find((element) => element.textContent === ${JSON.stringify(text)});
          const { height, width, x, y } = day.getBoundingClientRect();
          return [x + width / 2, y + height / 2];
        })()`);
      const from = await center('8');
      const to = await center('17');
      await page.drag(from, to, { duration: 400 });
      await sleep(300);
      const places = await page.evaluate(
        `[...document.querySelectorAll(${JSON.stringify('[data-range]')})].map((day) => day.textContent + ${JSON.stringify(':')} + day.dataset.range)`,
      );
      assert.deepEqual(places, [
        '8:start',
        ...['9', '10', '11', '12', '13', '14', '15', '16'].map(
          (day) => `${day}:middle`,
        ),
        '17:end',
      ]);
      assert.match(
        await page.evaluate(
          `${page.section}.querySelector('config').textContent`,
        ),
        /value change: 4\/8\/2025 – 4\/17\/2025/u,
      );
    },
  },
  {
    name: 'date picker: the year roll keeps its years; a month of more weeks grows smoothly',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');

      // March 2025 has 6 weeks, April 5: the days' height transitions.
      const previous = await page.rect('[aria-label="Previous month"]');
      const heights = page.sample(
        `document.querySelector(${JSON.stringify('[role=group]')}).getBoundingClientRect().height`,
      );
      await page.click([
        previous.x + previous.width / 2,
        previous.y + previous.height / 2,
      ]);
      /** @type {number[]} */
      const sampled = await heights;
      const unique = [...new Set(sampled.map((value) => Math.round(value)))];
      assert.ok(unique.length > 3, `heights ${unique.join(', ')}`);
      assert.ok(isIncreasing(unique), `heights ${unique.join(', ')}`);

      const title = await page.rect('h2 button');
      await page.click([title.x + 10, title.y + title.height / 2]);
      await sleep(400);
      const years = () =>
        page.evaluate(
          `(() => { const items = document.querySelectorAll(${JSON.stringify('[role=listbox]')})[1].querySelectorAll(${JSON.stringify('[role=option]')}); return [items[0].textContent, items.length]; })()`,
        );
      const before = await years();
      await page.evaluate(
        `document.querySelectorAll(${JSON.stringify('[role=listbox]')})[1].focus()`,
      );
      for (let step = 0; step < 3; step += 1) {
        await page.key('ArrowDown');
        await sleep(500);
      }
      assert.deepEqual(await years(), before);
      assert.equal(
        await page.evaluate(
          `document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] h2')}).textContent`,
        ),
        'March 2028',
      );
    },
  },
  {
    name: 'date picker: a range dragged below the days goes on into the next month',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('range', true);
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');

      /** @type {[number, number]} */
      const from = await page.evaluate(`(() => {
        const day = [...document.querySelectorAll('[aria-pressed]')].find((element) => element.textContent === '20');
        const { height, width, x, y } = day.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      const below = await page.evaluate(`(() => {
        const { bottom, left, width } = document.querySelector('[role=group]').getBoundingClientRect();
        return [left + width / 2, bottom + 30];
      })()`);
      await page.mouse('mousePressed', ...from);
      for (let step = 1; step <= 6; step += 1) {
        await page.mouse(
          'mouseMoved',
          from[0] + ((below[0] - from[0]) * step) / 6,
          from[1] + ((below[1] - from[1]) * step) / 6,
        );
        await sleep(40);
      }
      await sleep(900);
      const title = await page.evaluate(
        `document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] h2')}).textContent`,
      );
      assert.equal(title, 'May 2025');

      /** @type {[number, number]} */
      const to = await page.evaluate(`(() => {
        const day = [...document.querySelectorAll('[aria-pressed]')].find((element) => element.textContent === '5');
        const { height, width, x, y } = day.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.mouse('mouseMoved', ...to);
      await sleep(100);
      await page.mouse('mouseReleased', ...to);
      await sleep(300);
      assert.match(
        await page.evaluate(
          `${page.section}.querySelector('config').textContent`,
        ),
        /value change: 4\/20\/2025 – 5\/5\/2025/u,
      );
    },
  },
  {
    name: 'date picker: in a wide row, the month and year columns sit together',
    run: async (page) => {
      await page.open('list-form');
      const button = await page.evaluate(`(() => {
        const button = document.querySelector(${JSON.stringify('[data-date-picker-part=calendar]')}).closest('li').previousElementSibling.querySelector('button');
        button.scrollIntoView({ block: 'start' });
        const { height, width, x, y } = button.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(button);
      await sleep(600);
      const title = await page.evaluate(`(() => {
        const button = document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] h2 button')});
        const { height, width, x, y } = button.getBoundingClientRect();
        return [x + 10, y + height / 2];
      })()`);
      await page.click(title);
      await sleep(400);
      const gap = await page.evaluate(`(() => {
        const [month, year] = [...document.querySelectorAll(${JSON.stringify('[role=listbox]')})].map((column) => column.querySelector(${JSON.stringify('[aria-selected=true] > span')}).getBoundingClientRect());
        return Math.round(year.left - month.right);
      })()`);
      assert.ok(gap > 0 && gap < 40, `gap ${gap}`);
    },
  },
  {
    name: 'date picker: months slide in from the side they are on',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');
      const next = await page.rect('[aria-label="Next month"]');
      const sampling = page.sample(
        `(() => { const days = document.querySelector(${JSON.stringify('[role=group]')}); return [new DOMMatrix(getComputedStyle(days).transform).e, document.querySelectorAll(${JSON.stringify('[role=group] ~ *, [inert] [aria-pressed]')}).length > 0]; })()`,
        500,
      );
      await page.click([next.x + next.width / 2, next.y + next.height / 2]);
      /** @type {[number, boolean][]} */
      const samples = await sampling;
      const shifts = samples.map(([shift]) => Math.round(shift));
      assert.ok(
        shifts.some((shift) => shift > 50),
        `in from the end: ${shifts.join(', ')}`,
      );
      assert.ok(
        isDecreasing(shifts.filter((shift) => shift > 0)),
        shifts.join(', '),
      );
      assert.ok(
        samples.some(([, leaving]) => leaving),
        'the previous month slides out',
      );
      assert.equal(shifts.at(-1), 0);
    },
  },
  {
    name: 'date picker: dragged straight down off the last week, or past the last day, the range goes on',
    run: async (page) => {
      await page.open('date-picker');
      await page.setControl('range', true);
      await page.setControl('pickerStyle', 'inline');
      await page.setControl('locale', 'en-US');

      /** @param {string} text @returns {Promise<[number, number]>} */
      const center = (text) =>
        page.evaluate(`(() => {
          const day = [...document.querySelectorAll(${JSON.stringify('[aria-pressed]:not([inert] *)')})].find((element) => element.textContent === ${JSON.stringify(text)});
          const { height, width, x, y } = day.getBoundingClientRect();
          return [x + width / 2, y + height / 2];
        })()`);
      const title = () =>
        page.evaluate(
          `document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] h2')}).textContent`,
        );

      // From the 29th straight down (no other day crossed).
      const from = await center('29');
      await page.mouse('mousePressed', ...from);
      for (let step = 1; step <= 5; step += 1) {
        await page.mouse('mouseMoved', from[0], from[1] + step * 16);
        await sleep(40);
      }
      await sleep(900);
      assert.equal(await title(), 'May 2025');
      await page.mouse('mouseReleased', from[0], from[1] + 80);
      await sleep(400);
      assert.match(
        await page.evaluate(
          `${page.section}.querySelector('config').textContent`,
        ),
        /value change: 4\/29\/2025 – 5\/1\/2025/u,
      );

      // In June, from the 29th past the 30th (onto the blank cell after it).
      const next = await page.rect('[aria-label="Next month"]');
      await page.click([next.x + next.width / 2, next.y + next.height / 2]);
      await sleep(500);
      const start = await center('29');
      const blank = await page.evaluate(`(() => {
        const { height, width, x, y } = document.querySelector(${JSON.stringify('[role=group] [data-blank=after]')}).getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.mouse('mousePressed', ...start);
      for (let step = 1; step <= 6; step += 1) {
        await page.mouse(
          'mouseMoved',
          start[0] + ((blank[0] - start[0]) * step) / 6,
          start[1] + ((blank[1] - start[1]) * step) / 6,
        );
        await sleep(40);
      }
      await sleep(900);
      assert.equal(await title(), 'July 2025');
      await page.mouse('mouseReleased', ...blank);
      await sleep(400);
    },
  },
  {
    name: 'date picker: ranges are a control of the date demo only',
    run: async (page) => {
      for (const [id, count] of /** @type {const} */ ([
        ['date-picker', 1],
        ['date-and-time-picker', 0],
        ['time-picker', 0],
      ])) {
        await page.open(id);
        assert.equal(
          await page.evaluate(
            `${page.section}.querySelectorAll(${JSON.stringify('config input[name=range]')}).length`,
          ),
          count,
          id,
        );
      }
    },
  },
];
