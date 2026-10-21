/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { mapped, sleep } from '../lib.js';

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

/**
 * Days of the month, as their texts.
 *
 * @param {number} from
 * @param {number} to
 */
const days = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, index) => String(from + index));

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
      await page.open('date-picker', 'light', {
        state: [{ $rest: true, locale: 'en-US', pickerStyle: 'inline' }],
      });

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
      await page.open('date-picker', 'light', {
        state: [{ $rest: true, locale: 'en-US', pickerStyle: 'inline' }],
      });

      await clickDay(page, '23');
      assert.deepEqual(await calendar(page), {
        focusable: '23',
        selected: '23',
        title: 'April 2025',
      });
      assert.match(await page.log(), /value change: 4\/23\/2025, 9:41:00 AM/u);

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
      await page.open('date-picker', 'light', {
        state: [{ $rest: true, locale: 'en-US' }],
      });
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
      await page.open('date-picker', 'light', {
        state: [{ $rest: true, locale: 'de-DE', pickerStyle: 'inline' }],
      });
      const first = await page.evaluate(
        `document.querySelector(${JSON.stringify('abbr')}).title`,
      );
      assert.equal(first, 'Montag');

      await page.setState(0, { min: mapped('[April 10, 2025]') });
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
      await page.open('date-picker', 'light', {
        state: [{ $rest: true, locale: 'en-US', pickerStyle: 'inline' }],
      });

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
      await page.open('date-picker', 'light', {
        state: [
          {
            $rest: true,
            locale: 'en-US',
            mode: 'dateAndTime',
            pickerStyle: 'inline',
          },
        ],
      });

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
      assert.match(await page.log(), /value change: 4\/20\/2025, 9:41:00 PM/u);

      // Compact: the time's button opens the roll in a popover; 24 hours in
      // German, the buttons equally high.
      await page.setState(0, { pickerStyle: 'compact' });
      await page.setState(0, { locale: 'de-DE' });
      const heights = await page.evaluate(
        `[...${page.section}.querySelectorAll('button')].filter((button) => !button.closest('[role=dialog]')).map((button) => button.getBoundingClientRect().height)`,
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
      const date = await page.rect('button');
      await page.click([date.x + date.width / 2, date.y + date.height / 2]);
      await sleep(700);
      assert.deepEqual(await shown(), [1, 'visible']);
    },
  },
  {
    name: 'date picker: ranges, and capsule buttons',
    run: async (page) => {
      await page.open('date-picker-range', 'light', {
        state: [{ $rest: true, buttonShape: 'capsule', locale: 'en-US' }],
      });

      const button = await page.rect('button');
      assert.deepEqual(
        await page.evaluate(
          `(() => { const button = ${page.section}.querySelector('button'); return [button.textContent, getComputedStyle(button).borderRadius]; })()`,
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
          `${page.section}.querySelector('button').textContent`,
        ),
        'Apr 12 – 15, 2025',
      );
    },
  },
  {
    name: 'date picker: the first weekday, highlighted weekdays and days, the hour cycle',
    run: async (page) => {
      await page.open('date-and-time-picker', 'light', {
        state: [
          {
            $rest: true,
            firstDayOfWeek: 1,
            highlighted: mapped('[the 3rd, 14th, 25th: dots]'),
            highlightedWeekdays: mapped('[weekend: 0, 6]'),
            hourCycle: 'h23',
            locale: 'en-US',
            pickerStyle: 'inline',
          },
        ],
      });

      const state = await page.evaluate(`(() => {
        const days = [...document.querySelectorAll('[aria-pressed]')];
        const day = (text) => days.find((element) => element.textContent === text);
        const abbrs = [...document.querySelectorAll('abbr')];
        return {
          dots: days.filter((element) => element.querySelector(${JSON.stringify('[data-date-picker-part=dots]')})).map((element) => element.textContent),
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
      await page.open('date-picker-range', 'light', {
        state: [{ $rest: true, locale: 'en-US', pickerStyle: 'inline' }],
      });

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
      assert.match(await page.log(), /value change: 4\/8\/2025 – 4\/17\/2025/u);
    },
  },
  {
    name: 'date picker: the year roll keeps its years; a month of more weeks grows smoothly',
    run: async (page) => {
      await page.open('date-picker', 'light', {
        state: [{ $rest: true, locale: 'en-US', pickerStyle: 'inline' }],
      });

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
      await page.open('date-picker-range', 'light', {
        state: [{ $rest: true, locale: 'en-US', pickerStyle: 'inline' }],
      });

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
      assert.match(await page.log(), /value change: 4\/20\/2025 – 5\/5\/2025/u);
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
      await page.open('date-picker', 'light', {
        state: [{ $rest: true, locale: 'en-US', pickerStyle: 'inline' }],
      });
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
      await page.open('date-picker-range', 'light', {
        state: [{ $rest: true, locale: 'en-US', pickerStyle: 'inline' }],
      });

      /** @param {string} text @returns {Promise<[number, number]>} */
      // eslint-disable-next-line unicorn/no-unnecessary-parameters
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
      assert.match(await page.log(), /value change: 4\/29\/2025 – 5\/1\/2025/u);

      // In June, from the 29th past the 30th (onto the blank cell after it).
      const next = await page.rect('[aria-label="Next month"]');
      await page.click([next.x + next.width / 2, next.y + next.height / 2]);
      await sleep(500);
      const start = await center('29');
      /** @type {[number, number]} */
      const blank = await page.evaluate(`(() => {
        const { height, width, x, y } = document.querySelector(${JSON.stringify('[role=group] [data-outside=after]')}).getBoundingClientRect();
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
    name: 'date picker: adjacent months’ days, grayed out; over-dragged to the side, a range goes on',
    run: async (page) => {
      await page.open('date-picker-range', 'light', {
        state: [
          {
            $rest: true,
            locale: 'en-US',
            pickerStyle: 'inline',
            showAdjacentMonths: true,
          },
        ],
      });

      // April 2025: March 30 and 31 before, May 1 to 3 after.
      const adjacent = await page.evaluate(`(() => {
        const days = [...document.querySelectorAll(${JSON.stringify('[role=group] [data-outside]')})];
        return [days.map((day) => day.textContent).join(), getComputedStyle(days[0]).color];
      })()`);
      assert.deepEqual(adjacent, ['30,31,1,2,3', 'rgba(60, 60, 67, 0.3)']);

      // On to May (its last week full): from the 31st beyond the days' end.
      const next = await page.rect('[aria-label="Next month"]');
      await page.click([next.x + next.width / 2, next.y + next.height / 2]);
      await sleep(500);
      /** @type {[[number, number], number]} */
      const [from, right] = await page.evaluate(`(() => {
        const day = [...document.querySelectorAll(${JSON.stringify('[role=group] [aria-pressed]:not([data-outside])')})].find((element) => element.textContent === '31');
        const { height, width, x, y } = day.getBoundingClientRect();
        return [[x + width / 2, y + height / 2], document.querySelector(${JSON.stringify('[role=group]')}).getBoundingClientRect().right];
      })()`);
      await page.mouse('mousePressed', ...from);
      for (let step = 1; step <= 5; step += 1) {
        await page.mouse(
          'mouseMoved',
          from[0] + ((right + 30 - from[0]) * step) / 5,
          from[1],
        );
        await sleep(40);
      }
      await sleep(900);
      await page.mouse('mouseReleased', right + 30, from[1]);
      await sleep(400);
      assert.equal(
        await page.evaluate(
          `document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] h2')}).textContent`,
        ),
        'June 2025',
      );
      assert.match(await page.log(), /value change: 5\/31\/2025 – 6\/1\/2025/u);
    },
  },
  {
    name: 'date picker: capsules by default; highlights as dots, text or circles, tinted',
    run: async (page) => {
      await page.open('date-picker', 'light', {
        state: [{ $rest: true, locale: 'en-US' }],
      });
      assert.equal(
        await page.evaluate(
          `getComputedStyle(${page.section}.querySelector('button')).borderRadius`,
        ),
        '1000px',
      );

      await page.setState(0, { pickerStyle: 'inline' });
      await page.setState(0, {
        highlighted: mapped(
          '[3rd: red dot, 14th: orange text, 25th: green circle]',
        ),
      });
      const styles = await page.evaluate(`(() => {
        const day = (text) => [...document.querySelectorAll('[aria-pressed]')].find((element) => element.textContent === text);
        return [
          getComputedStyle(day('3').querySelector(${JSON.stringify('[data-date-picker-part=dots] > *')})).backgroundColor,
          getComputedStyle(day('14')).color,
          getComputedStyle(day('25'), '::before').backgroundColor,
        ];
      })()`);
      assert.deepEqual(styles, [
        'rgb(255, 56, 60)',
        'rgb(255, 141, 40)',
        'color(srgb 0.203922 0.780392 0.34902 / 0.2)',
      ]);
    },
  },
  {
    name: 'date picker: pressing another month’s day shows its month, unselected',
    run: async (page) => {
      await page.open('date-picker', 'light', {
        state: [
          {
            $rest: true,
            locale: 'en-US',
            pickerStyle: 'inline',
            showAdjacentMonths: true,
          },
        ],
      });
      const may = await page.evaluate(`(() => {
        const day = document.querySelector(${JSON.stringify('[role=group] [data-outside=after]')});
        const { height, width, x, y } = day.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(may);
      await sleep(500);
      assert.deepEqual(
        await page.evaluate(
          `[document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] h2')}).textContent, [...document.querySelectorAll(${JSON.stringify('[role=group] [aria-pressed=true]')})].map((day) => day.textContent)]`,
        ),
        ['May 2025', []],
      );
      assert.doesNotMatch(await page.log(), /value change/u);
    },
  },
  {
    name: 'date picker: date and time open one popover at both buttons; the time row can be left out (footer)',
    run: async (page) => {
      await page.open('date-picker-footer', 'light', {
        state: [null, { $rest: true, locale: 'en-US' }],
      });
      /** @param {string} selector */
      const openBy = async (selector) => {
        const button = await page.rect(selector);
        await page.click([
          button.x + button.width / 2,
          button.y + button.height / 2,
        ]);
        await sleep(600);
        return page.evaluate(`(() => {
          const popup = document.querySelector(${JSON.stringify('[role=dialog]')});
          const { left, top } = popup.getBoundingClientRect();
          return [Math.round(left), Math.round(top), [...popup.querySelectorAll(${JSON.stringify('[aria-label=Time]')})].length];
        })()`);
      };

      const byDate = await openBy('button');
      await page.key('Escape');
      await sleep(400);
      const byTime = await openBy('[aria-label=Time]');
      assert.deepEqual(byTime.slice(0, 2), byDate.slice(0, 2));
      assert.equal(byDate[2], 1, 'the time row');
      await page.key('Escape');
      await sleep(400);

      await page.setState(0, { footer: 'none' });
      const opened = await openBy('button');
      const rows = opened.at(2);
      assert.equal(rows, 0, 'no time row');
      await page.key('Escape');
      await sleep(400);
      await openBy('[aria-label=Time]');
      assert.deepEqual(
        await page.evaluate(
          `[...document.querySelectorAll(${JSON.stringify('[role=dialog] [role=listbox]')})].map((column) => column.getAttribute('aria-label'))`,
        ),
        ['Hours', 'Minutes', 'AM/PM'],
      );
    },
  },
  {
    name: 'date picker: several highlights on a day; none (nor weekdays’) on adjacent months’ days',
    run: async (page) => {
      await page.open('date-picker', 'light', {
        state: [
          {
            $rest: true,
            highlighted: mapped(
              '[several: 14th three dots, 22nd dots, text and a circle]',
            ),
            highlightedWeekdays: mapped('[weekend: 0, 6]'),
            locale: 'en-US',
            pickerStyle: 'inline',
            showAdjacentMonths: true,
          },
        ],
      });
      const state = await page.evaluate(`(() => {
        const day = (text) => [...document.querySelectorAll(${JSON.stringify('[role=group] [aria-pressed]:not([data-outside])')})].find((element) => element.textContent === text);
        const dots = (element) => [...element.querySelectorAll(${JSON.stringify('[data-date-picker-part=dots] > *')})].map((dot) => getComputedStyle(dot).backgroundColor);
        return {
          adjacent: document.querySelectorAll(${JSON.stringify('[data-outside] [data-date-picker-part=dots], [data-outside][data-highlight-text], [data-outside][data-highlight-circle], [data-outside][data-weekday-highlighted]')}).length,
          fourteenth: dots(day('14')),
          twentySecond: [dots(day('22')).length, getComputedStyle(day('22')).color, getComputedStyle(day('22'), '::before').backgroundColor],
        };
      })()`);
      assert.deepEqual(state, {
        adjacent: 0,
        fourteenth: [
          'rgb(255, 56, 60)',
          'rgb(0, 136, 255)',
          'rgb(52, 199, 89)',
        ],
        twentySecond: [
          2,
          'rgb(203, 48, 224)',
          'color(srgb 0 0.764706 0.815686 / 0.2)',
        ],
      });
    },
  },
  {
    name: 'date picker: disabled days (by function, or limits) are grayed out, over weekday highlights, under highlights',
    run: async (page) => {
      await page.open('date-picker', 'light', {
        state: [
          {
            $rest: true,
            highlighted: mapped(
              '[3rd: red dot, 14th: orange text, 25th: green circle]',
            ),
            highlightedWeekdays: mapped('[weekend: 0, 6]'),
            isDateDisabled: mapped('[weekends]'),
            locale: 'en-US',
            min: mapped('[April 10, 2025]'),
            pickerStyle: 'inline',
          },
        ],
      });

      const state = await page.evaluate(`(() => {
        const day = (text) => [...document.querySelectorAll(${JSON.stringify('[role=group] [aria-pressed]')})].find((element) => element.textContent === text);
        const style = (text) => [day(text).disabled, getComputedStyle(day(text)).color];
        return { limit: style('9'), weekday: style('12'), weekend: style('5'), highlighted: style('14'), open: style('11') };
      })()`);
      assert.deepEqual(state, {
        highlighted: [false, 'rgb(255, 141, 40)'],
        limit: [true, 'rgba(60, 60, 67, 0.3)'],
        open: [false, 'rgb(0, 0, 0)'],
        weekday: [true, 'rgba(60, 60, 67, 0.3)'],
        weekend: [true, 'rgba(60, 60, 67, 0.3)'],
      });

      // Moved by keyboard past disabled days: from Friday the 11th to
      // Monday the 14th.
      await page.evaluate(
        `[...document.querySelectorAll(${JSON.stringify('[role=group] [aria-pressed]')})].find((element) => element.textContent === '11').focus()`,
      );
      await page.key('ArrowRight');
      assert.equal(
        await page.evaluate('document.activeElement.textContent'),
        '14',
      );
    },
  },
  {
    name: 'date picker: footers composed: buttons jumping to dates from the selection',
    run: async (page) => {
      await page.open('date-picker-footer', 'light', {
        state: [
          { $rest: true, footer: 'timeRowAndJumps' },
          { $rest: true, locale: 'en-US', pickerStyle: 'inline' },
        ],
      });
      const press = async (/** @type {string} */ text) => {
        const point = await page.evaluate(`(() => {
          const button = [...document.querySelectorAll(${JSON.stringify('[data-date-picker-part=calendar] button')})].find((element) => element.textContent === ${JSON.stringify(text)});
          const { height, width, x, y } = button.getBoundingClientRect();
          return [x + width / 2, y + height / 2];
        })()`);
        await page.click(point);
        await sleep(500);
      };
      const state = () =>
        page.evaluate(
          `[document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] h2')}).textContent, document.querySelector(${JSON.stringify('[role=group] [aria-pressed=true]')})?.textContent]`,
        );

      // The Time row, and the jumps below it.
      assert.equal(
        await page.evaluate(
          `document.querySelectorAll(${JSON.stringify('[data-date-picker-part=calendar] [aria-label=Time]')}).length`,
        ),
        1,
      );
      await press('In a week');
      assert.deepEqual(await state(), ['April 2025', '27']);
      await press('Next month');
      assert.deepEqual(await state(), ['May 2025', '1']);
      assert.match(await page.log(), /value change: 5\/1\/2025, 9:41:00 AM/u);

      // “Now”: today, at the current time (the others keep the time).
      await press('Now');
      const [time, expected] = await page.evaluate(
        `[document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] [aria-label=Time]')}).textContent, new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date())]`,
      );
      assert.equal(time, expected);
      const [, day] = await state();
      assert.equal(day, String(new Date().getDate()));
    },
  },
  {
    name: 'date picker: ranges don’t cross disabled days, nor ranges isRangeDisabled rejects (again in other months)',
    run: async (page) => {
      await page.open('date-picker-range', 'light', {
        state: [
          {
            $rest: true,
            isDateDisabled: mapped('[the 15th to 18th]'),
            locale: 'en-US',
            pickerStyle: 'inline',
          },
        ],
      });
      /** @returns {Promise<string[]>} */
      const disabled = () =>
        page.evaluate(
          `[...document.querySelectorAll(${JSON.stringify('[role=group] [aria-pressed]')})].filter((day) => day.disabled).map((day) => day.textContent)`,
        );

      // A complete range: only disabled days are.
      assert.deepEqual(await disabled(), days(15, 18));

      // Its start picked: nothing beyond the disabled days.
      await clickDay(page, '12');
      assert.deepEqual(await disabled(), days(15, 30));
      await clickDay(page, '13');
      assert.deepEqual(
        await page.evaluate(
          `[...document.querySelectorAll(${JSON.stringify('[data-range]')})].map((day) => day.textContent + ${JSON.stringify(':')} + day.dataset.range)`,
        ),
        ['12:start', '13:end'],
      );

      // At most a week, either way (remounted: the example range again).
      await page.setState(0, {
        isRangeDisabled: mapped('[longer than a week]'),
      });
      await sleep(300);
      await clickDay(page, '22');
      assert.deepEqual(await disabled(), [...days(1, 18), ...days(29, 30)]);

      // Not across months: called again for the next month's days.
      await page.setState(0, { isRangeDisabled: mapped('[across months]') });
      await sleep(300);
      await clickDay(page, '22');
      assert.deepEqual(await disabled(), days(1, 18));
      const next = await page.rect('[aria-label="Next month"]');
      await page.click([next.x + next.width / 2, next.y + next.height / 2]);
      await sleep(600);
      assert.deepEqual(await disabled(), days(1, 31));
    },
  },
  {
    name: 'date picker: date and time: the time’s buttons are active while the time shows',
    run: async (page) => {
      await page.open('date-and-time-picker', 'light', {
        state: [{ $rest: true, locale: 'en-US' }],
      });
      // In the stage, or (the popover's) the document.
      /** @param {string} selector */
      const press = async (selector) => {
        const point = await page.evaluate(`(() => {
          const button = ${page.section}.querySelector(${JSON.stringify(selector)}) ?? document.querySelector(${JSON.stringify(selector)});
          const { height, width, x, y } = button.getBoundingClientRect();
          return [x + width / 2, y + height / 2];
        })()`);
        await page.click(point);
        await sleep(600);
      };
      // The date's and time's buttons, and the time row's: expanded, tinted.
      const state = () =>
        page.evaluate(`(() => {
          const buttons = [
            ...[...${page.section}.querySelectorAll('button')].filter((button) => !button.closest('[role=dialog]')),
            document.querySelector(${JSON.stringify('[role=dialog] [aria-label=Time]')}),
          ];
          return buttons.map((button) => button.getAttribute('aria-expanded') + ' ' + getComputedStyle(button).color);
        })()`);
      const [tint, plain] = await page.evaluate(`(() => {
        const probe = document.createElement('span');
        document.body.append(probe);
        probe.style.color = 'var(--color-ios-primary)';
        const tint = getComputedStyle(probe).color;
        probe.style.color = 'var(--color-ios-label)';
        const plain = getComputedStyle(probe).color;
        probe.remove();
        return [tint, plain];
      })()`);

      await press('button');
      assert.deepEqual(await state(), [
        `true ${tint}`,
        `false ${plain}`,
        `false ${plain}`,
      ]);
      // The time shown from the row: both of the time's buttons.
      await press('[role=dialog] [aria-label=Time]');
      assert.deepEqual(await state(), [
        `false ${plain}`,
        `true ${tint}`,
        `true ${tint}`,
      ]);
      await page.key('Escape');
      await sleep(400);

      // Opened at the time; hidden from the row: the date's.
      await press('[aria-label=Time]');
      assert.deepEqual(await state(), [
        `false ${plain}`,
        `true ${tint}`,
        `true ${tint}`,
      ]);
      await press('[role=dialog] [aria-label=Time]');
      assert.deepEqual(await state(), [
        `true ${tint}`,
        `false ${plain}`,
        `false ${plain}`,
      ]);
    },
  },
  {
    name: 'date picker: footer messages of range rules: what can be picked, an error while the end is missing',
    run: async (page) => {
      await page.open('date-picker-range', 'light', {
        state: [
          {
            $rest: true,
            isRangeDisabled: mapped('[at least three days]'),
            locale: 'en-US',
            pickerStyle: 'inline',
          },
        ],
      });
      const message = () =>
        page.evaluate(`(() => {
          const message = document.querySelector(${JSON.stringify('[data-date-picker-part=calendar] p')});
          return [message.textContent, message.getAttribute('role')];
        })()`);
      /** @returns {Promise<string[]>} */
      const disabled = () =>
        page.evaluate(
          `[...document.querySelectorAll(${JSON.stringify('[role=group] [aria-pressed]')})].filter((day) => day.disabled).map((day) => day.textContent)`,
        );

      // The example range: complete, the rule's information.
      assert.deepEqual(await message(), ['Stay at least two nights.', null]);

      // Its start picked: the end missing, an error; the next day can't end
      // it.
      await clickDay(page, '10');
      assert.deepEqual(await message(), [
        'Select a stay spanning at least two nights.',
        'alert',
      ]);
      assert.deepEqual(await disabled(), ['9', '10', '11']);
      await clickDay(page, '12');
      assert.deepEqual(await message(), ['Stay at least two nights.', null]);
    },
  },
  {
    name: 'date picker: changes tell why: opened by its button (trigger-press), a day pressed (day-press)',
    run: async (page) => {
      await page.open('date-picker-parts-root');
      await page.evaluate(
        `${page.section}.querySelector('[data-date-picker-part=collapsed-button]').click()`,
      );
      await sleep(600);
      await page.evaluate(
        `[...document.querySelectorAll(${JSON.stringify('[data-date-picker-part=popup] button[data-date]')})].find((day) => day.textContent.trim() === ${JSON.stringify('22')}).click()`,
      );
      await sleep(300);
      const log = await page.log();
      assert.match(log, /open change: date \(trigger-press\)/u);
      assert.match(log, /value change: .*\(day-press\)/u);
    },
  },
  {
    name: 'date picker: a range’s rules disable the days it can’t end on; the footer tells what’s missing',
    run: async (page) => {
      await page.open('date-picker-composition-range');
      /** @param {string} text */
      const dayButton = (text) =>
        `[...${page.section}.querySelectorAll('button[data-date]')].find((day) => day.textContent.trim() === ${JSON.stringify(text)})`;
      await page.evaluate(`${dayButton('10')}.click()`);
      await sleep(300);
      const disabled = await Array.fromAsync(['11', '12', '17', '18'], (text) =>
        page.evaluate(`${dayButton(text)}.disabled`),
      );
      assert.deepEqual(
        disabled,
        [true, false, false, true],
        'two to seven nights',
      );
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('[data-date-picker-part=message]').dataset.variant`,
        ),
        'error',
      );
      await page.evaluate(`${dayButton('14')}.click()`);
      await sleep(300);
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('[data-date-picker-part=message]').dataset.variant`,
        ),
        'info',
      );
    },
  },
  {
    name: 'date picker: in a form (a hidden field control), its date is submitted by name, as an ISO date',
    run: async (page) => {
      await page.open('date-picker-composition-form');
      await page.evaluate(
        `${page.section}.querySelector('[data-date-picker-part=collapsed-button]').click()`,
      );
      await sleep(600);
      const iso = await page.evaluate(
        `(() => { const day = [...document.querySelectorAll(${JSON.stringify('[data-date-picker-part=popup] button[data-date]')})].find((button) => !button.disabled); day.click(); return new Date(Number(day.dataset.date)).toLocaleDateString(${JSON.stringify('sv-SE')}); })()`,
      );
      await sleep(300);
      await page.evaluate(
        `${page.section}.querySelector('button[type=submit]').click()`,
      );
      await sleep(300);
      assert.match(
        await page.log(),
        new RegExp(String.raw`submitted: \{"birthday":"${String(iso)}"\}`, 'u'),
      );
    },
  },
];
