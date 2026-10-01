/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Expression for a row: the `index`th item of the `group`th group.
 *
 * @param {number} group
 * @param {number} index
 */
const row = (group, index) =>
  `document.querySelectorAll('[data-list-part=group]')[${group}].children[${index}]`;

/**
 * Scrolls a row into view and returns its viewport rectangle.
 *
 * @param {Page} page
 * @param {number} group
 * @param {number} index
 * @returns {Promise<{ height: number, width: number, x: number, y: number }>}
 */
const rowRect = (page, group, index) =>
  page.evaluate(`(() => {
    const element = ${row(group, index)};
    element.scrollIntoView({ block: 'center' });
    const { height, width, x, y } = element.getBoundingClientRect();
    return { height, width, x, y };
  })()`);

/**
 * Swipes a row horizontally by `distance` px (negative: to the left).
 *
 * @param {Page} page
 * @param {number} group
 * @param {number} index
 * @param {number} distance
 */
const swipe = async (page, group, index, distance) => {
  const { height, width, x, y } = await rowRect(page, group, index);
  const from = /** @type {[number, number]} */ ([
    distance < 0 ? x + width - 80 : x + 80,
    y + height / 2,
  ]);
  await page.drag(from, [from[0] + distance, from[1]], { duration: 600 });
  await sleep(500);
};

/**
 * Swipe state of a row: its `data-swipe`, offset and action scales.
 *
 * @param {Page} page
 * @param {number} group
 * @param {number} index
 * @returns {Promise<{ actions: number[], offset: number, swipe: string | undefined, width: number }>}
 */
const swipeState = (page, group, index) =>
  page.evaluate(`(() => {
    const element = ${row(group, index)};
    const actions = element.querySelector('[data-list-part=swipe-actions]:not([hidden])');
    const opened = [...element.querySelectorAll('[data-list-part=swipe-actions]')].find((container) => container.getBoundingClientRect().width && [...container.children].some((button) => getComputedStyle(button).transform !== 'matrix(0, 0, 0, 0, 0, 0)'));
    return {
      actions: opened ? [...opened.children].map((button) => new DOMMatrix(getComputedStyle(button).transform).a) : [],
      offset: new DOMMatrix(getComputedStyle(element).transform).e,
      swipe: element.dataset.swipe,
      width: (opened ?? actions).getBoundingClientRect().width,
    };
  })()`);

/**
 * The side a row's swipe actions are open on.
 *
 * @param {Page} page
 * @param {number} group
 * @param {number} index
 */
const swipeSide = async (page, group, index) => {
  const state = await swipeState(page, group, index);
  return state.swipe;
};

/** Hides the first header's 44px button, to measure the header alone. */
const hideHeaderButton = `document.querySelector(${JSON.stringify('[data-list-part=header] [data-list-part=accessory]')}).style.display = 'none'`;

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'list: rows match Figma',
    run: async (page) => {
      await page.open('list');

      const rows = await page.evaluate(`(() => {
        const measure = (element) => {
          const box = element.getBoundingClientRect();
          const part = (name) => element.querySelector('[data-list-part=' + name + ']')?.getBoundingClientRect();
          const separator = getComputedStyle(element, '::before');
          const title = part('title') ?? part('button');
          return {
            height: box.height,
            image: part('image')?.width,
            imageGap: part('image') ? Math.round(title.left - part('image').right) : undefined,
            separator: separator.display === 'none' ? null : [Math.round(title.left - box.left), Math.round(box.right - (title.left + parseFloat(separator.width)))],
            titleInset: Math.round((part('image') ?? title).left - box.left),
            trailingInset: Math.round(box.right - [...element.children].filter((child) => child.tagName !== 'INPUT').at(-1).getBoundingClientRect().right),
          };
        };
        const group = document.querySelector('[data-list-part=group]');
        return [...group.children].map(measure);
      })()`);

      // Airplane Mode (first: no separator), Wi-Fi, Notifications (tall).
      assert.deepEqual(rows.slice(0, 3), [
        {
          height: 52,
          image: 30,
          imageGap: 8,
          separator: null,
          titleInset: 16,
          trailingInset: 16,
        },
        {
          height: 52,
          image: 30,
          imageGap: 8,
          separator: [54, 16],
          titleInset: 16,
          trailingInset: 16,
        },
        {
          height: 68,
          image: 30,
          imageGap: 8,
          separator: [54, 16],
          titleInset: 16,
          trailingInset: 16,
        },
      ]);

      // Figma “Contents - Trailing”: Detail, Drill-in 16px apart.
      const gap = await page.evaluate(`(() => {
        const item = ${row(0, 1)};
        const detail = item.querySelector('[data-list-part=detail]').getBoundingClientRect();
        const drillIn = item.querySelector('[data-list-part=drill-in]').getBoundingClientRect();
        return [Math.round(drillIn.left - detail.right), drillIn.width];
      })()`);
      assert.deepEqual(gap, [16, 8]);
    },
  },
  {
    name: 'list: titles center, glyphs match Figma, header button aligns',
    run: async (page) => {
      await page.open('list');

      const result = await page.evaluate(`(() => {
        const group = document.querySelector('[data-list-part=group]');
        const center = (element) => { const { bottom, top } = element.getBoundingClientRect(); return (top + bottom) / 2; };
        const paths = (element) => [...element.querySelectorAll('path')].map((path) => path.getBoundingClientRect());
        const airplane = group.children[0];
        const check = paths(group.children[4].querySelector('[data-list-part=checkmark]'))[0];
        const button = paths(document.querySelector('[data-list-part=header] [data-list-part=accessory]'));
        const drillIn = paths(group.children[1].querySelector('[data-list-part=drill-in]'))[0];
        return {
          // Path geometry plus the 2px stroke (Figma ink: 15.2 x 14.5).
          check: [Math.round((check.width + 2) * 10) / 10, Math.round((check.height + 2) * 10) / 10],
          headerButton: Math.round(Math.max(...button.map((box) => box.right)) - drillIn.right),
          title: Math.round(center(airplane.querySelector('[data-list-part=title]')) - center(airplane)),
        };
      })()`);
      assert.deepEqual(result, {
        check: [15.2, 14.5],
        headerButton: 0,
        title: 0,
      });
    },
  },
  {
    name: 'list: pop-up menu selection is unblended over its glass',
    run: async (page) => {
      await page.open('list');

      const trigger = await page.evaluate(`(() => {
        const button = document.querySelector('[data-list-part=pop-up]');
        button.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = button.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(trigger);
      await sleep(500);

      const item = await page.evaluate(`(() => {
        const { height, width, x, y } = document.querySelectorAll('[role=menuitemradio]')[1].getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.mouse('mouseMoved', item[0], item[1]);
      await sleep(300);

      // The glass (a backdrop filter) isolates blend modes: a blended
      // selection would turn nearly opaque.
      const selection = await page.evaluate(`(() => {
        const style = getComputedStyle(document.querySelector('[role=menuitemradio][data-highlighted]'), '::before');
        return [style.backgroundColor, style.mixBlendMode, style.opacity];
      })()`);
      assert.deepEqual(selection, ['rgba(0, 0, 0, 0.07)', 'normal', '1']);
    },
  },
  {
    name: 'list: headers and footers match Figma',
    run: async (page) => {
      await page.open('list');

      /** @param {string} prominence */
      const header = async (prominence) => {
        await page.setControl('prominence', prominence);
        return page.evaluate(`(() => {
          const header = document.querySelector('[data-list-part=header]');
          const title = header.querySelector('[data-list-part=title]');
          const row = document.querySelector('[data-list-part=item] [data-list-part=title]');
          const style = getComputedStyle(title);
          return [header.getBoundingClientRect().height, style.fontSize, style.lineHeight, Math.round(title.getBoundingClientRect().left - document.querySelector('[data-list-part=group]').getBoundingClientRect().left)];
        })()`);
      };

      // The first header has a 44px button; measure without it.
      await page.evaluate(hideHeaderButton);

      assert.deepEqual(await header('nested'), [42, '17px', '22px', 16]);
      await page.evaluate(hideHeaderButton);
      assert.deepEqual(await header('prominent'), [40, '20px', '25px', 16]);
      await page.evaluate(hideHeaderButton);
      assert.deepEqual(await header('extraProminent'), [
        46,
        '22px',
        '28px',
        16,
      ]);

      const footer = await page.evaluate(`(() => {
        const footer = document.querySelector('[data-list-part=footer]');
        const style = getComputedStyle(footer);
        return [style.paddingTop, style.paddingBottom, style.fontSize, style.lineHeight, Math.round(footer.getBoundingClientRect().left + parseFloat(style.paddingLeft) - document.querySelector('[data-list-part=group]').getBoundingClientRect().left)];
      })()`);
      assert.deepEqual(footer, ['8px', '6px', '13px', '18px', 16]);
    },
  },
  {
    name: 'list: list buttons in the tint, red and gray',
    run: async (page) => {
      await page.open('list');

      const colors = await page.evaluate(
        `[...document.querySelectorAll(${JSON.stringify('[data-list-part=button]')})].map((button) => getComputedStyle(button).color)`,
      );
      assert.deepEqual(colors, [
        'rgb(0, 136, 255)',
        'rgb(255, 56, 60)',
        'rgb(174, 174, 178)',
      ]);
    },
  },
  {
    name: 'list: pressed rows highlight and hide their separators',
    run: async (page) => {
      await page.open('list');

      const { height, width, x, y } = await rowRect(page, 0, 1);
      await page.mouse('mousePressed', x + width / 2, y + height / 2);
      await sleep(400);

      const pressed = await page.evaluate(`[
        getComputedStyle(${row(0, 1)}).backgroundColor,
        getComputedStyle(${row(0, 1)}, '::before').opacity,
        getComputedStyle(${row(0, 2)}, '::before').opacity,
        getComputedStyle(${row(0, 3)}, '::before').opacity,
      ]`);
      await page.mouse('mouseReleased', x + width / 2, y + height / 2);

      assert.deepEqual(pressed, ['rgb(209, 209, 214)', '0', '0', '1']);
    },
  },
  {
    name: 'list: actions are text buttons aligned with the trailing parts',
    run: async (page) => {
      await page.open('list');

      const action = await page.evaluate(`(() => {
        const item = ${row(0, 5)};
        const action = item.querySelector('[data-list-part=action]');
        const text = document.createRange();
        text.selectNodeContents(action);
        const style = getComputedStyle(action);
        return [action.tagName, item.getBoundingClientRect().height, style.fontSize, style.paddingRight, Math.round(item.getBoundingClientRect().right - text.getBoundingClientRect().right)];
      })()`);
      assert.deepEqual(action, ['BUTTON', 52, '17px', '0px', 16]);
    },
  },
  {
    name: 'list: overswiping triggers the outermost action',
    run: async (page) => {
      await page.open('list');

      const { height, x, y } = await rowRect(page, 1, 0);
      const from = /** @type {[number, number]} */ ([x + 80, y + height / 2]);

      await page.mouse('mousePressed', ...from);
      for (let step = 1; step <= 12; step += 1) {
        await page.mouse('mouseMoved', from[0] + step * 40, from[1]);
        await sleep(30);
      }
      await sleep(300);

      // The outermost (leading: first) action covers the others; the row
      // slides on past the actions, which stay at the edge.
      const stretched = await page.evaluate(`(() => {
        const item = ${row(1, 0)};
        const actions = item.querySelector('[data-list-part=swipe-actions]');
        const [outermost, next] = actions.children;
        const box = actions.getBoundingClientRect();
        return [Math.round(outermost.getBoundingClientRect().width - (box.width - 26)), outermost.getBoundingClientRect().right > next.getBoundingClientRect().right, 'overswipe' in outermost.dataset, Math.round(box.left - item.parentElement.getBoundingClientRect().left), item.getBoundingClientRect().left > box.right];
      })()`);
      assert.deepEqual(stretched, [0, true, true, 0, true]);

      await page.mouse('mouseReleased', from[0] + 480, from[1]);
      await sleep(500);

      const log = await page.evaluate(
        `${page.section}.querySelector('config').textContent`,
      );
      assert.match(log, /swipe action clicked/);
      assert.equal(await swipeSide(page, 1, 0), undefined);

      // Without overswipe (trailing), the actions just open.
      await swipe(page, 1, 0, -400);
      assert.equal(await swipeSide(page, 1, 0), 'trailing');
      assert.doesNotMatch(
        await page.evaluate(
          `${page.section}.querySelector('config').textContent`,
        ),
        /Done clicked/,
      );
    },
  },
  {
    name: 'list: swipe actions open, match Figma and close',
    run: async (page) => {
      await page.open('list');

      // Tall row, trailing: circles 50px with labels, 10px from the row and
      // each other, 16px from the edge.
      await swipe(page, 1, 1, -300);
      const tall = await swipeState(page, 1, 1);
      assert.equal(tall.swipe, 'trailing');
      assert.deepEqual(tall.actions, [1, 1, 1]);
      assert.equal(tall.width, 10 + 50 * 3 + 10 * 2 + 16);
      assert.equal(tall.offset, -tall.width);

      const geometry = await page.evaluate(`(() => {
        const item = ${row(1, 1)};
        const box = item.getBoundingClientRect();
        const buttons = [...item.querySelectorAll('[data-list-part=swipe-action]')].slice(3);
        const label = buttons[0].querySelector('[data-list-part=swipe-action-label]');
        return {
          circleTop: Math.round(buttons[0].getBoundingClientRect().top - box.top),
          label: getComputedStyle(label).display,
          radius: getComputedStyle(item).borderTopLeftRadius,
          separators: [getComputedStyle(item, '::before').opacity],
        };
      })()`);
      assert.deepEqual(geometry, {
        circleTop: 0,
        label: 'block',
        radius: '100px',
        separators: ['0'],
      });

      // Regular row, leading: 52px circles without labels; the other row
      // closes (one open at a time).
      await swipe(page, 1, 0, 300);
      const regular = await swipeState(page, 1, 0);
      assert.equal(regular.swipe, 'leading');
      assert.equal(regular.width, 16 + 52 * 3 + 10 * 2 + 10);
      assert.equal(regular.offset, regular.width);
      assert.equal(await swipeSide(page, 1, 1), undefined);

      // A short swipe back closes it; so does a tap elsewhere.
      await swipe(page, 1, 0, -60);
      assert.equal(await swipeSide(page, 1, 0), undefined);

      await swipe(page, 1, 0, 300);
      const { height, width, x, y } = await rowRect(page, 0, 0);
      await page.click([x + width / 2, y + height / 2]);
      await sleep(500);
      assert.equal(await swipeSide(page, 1, 0), undefined);
    },
  },
  {
    name: 'list: swiping a row does not click it',
    run: async (page) => {
      await page.open('list');
      await page.evaluate(
        `window.clicks = 0; ${row(1, 0)}.querySelector('[data-list-part=title]').addEventListener('click', () => { window.clicks += 1; })`,
      );

      await swipe(page, 1, 0, -300);
      const { height, width, x, y } = await rowRect(page, 1, 0);
      // The open row closes on a tap, without clicking.
      await page.click([x + width / 2, y + height / 2]);
      await sleep(500);
      await page.click([x + width / 2, y + height / 2]);
      await sleep(300);

      assert.equal(await page.evaluate('window.clicks'), 1);
    },
  },
  {
    name: 'list: edit controls match Figma; delete opens the swipe actions',
    run: async (page) => {
      await page.open('list');

      await page.setControl('editing', 'select');
      const checkbox = await page.evaluate(`(() => {
        const item = ${row(0, 1)};
        const edit = item.querySelector('[data-list-part=edit]').getBoundingClientRect();
        const image = item.querySelector('[data-list-part=image]').getBoundingClientRect();
        return [edit.width, Math.round(edit.left - item.getBoundingClientRect().left), Math.round(image.left - edit.right)];
      })()`);
      assert.deepEqual(checkbox, [22, 18, 17]);

      await page.setControl('editing', 'delete');
      const { height, width, x, y } = await page.evaluate(`(() => {
        const button = ${row(1, 0)}.querySelector('[data-list-part=edit]');
        button.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = button.getBoundingClientRect();
        return { height, width, x, y };
      })()`);
      await page.click([x + width / 2, y + height / 2]);
      await sleep(500);
      assert.equal(await swipeSide(page, 1, 0), 'trailing');
    },
  },
  {
    name: 'list: index list section titles and index',
    run: async (page) => {
      await page.open('list-index');

      const header = await page.evaluate(`(() => {
        const header = document.querySelector('[data-list-part=header]');
        const style = getComputedStyle(header);
        return [header.getBoundingClientRect().height, style.position, getComputedStyle(header.querySelector('[data-list-part=title]')).fontSize];
      })()`);
      assert.deepEqual(header, [22, 'sticky', '17px']);

      /** @returns {Promise<[number, number, number]>} */
      const index = () =>
        page.evaluate(`(() => {
          const [first, second] = document.querySelectorAll('[data-list-part=index-item]');
          const a = first.getBoundingClientRect();
          return [document.querySelector('[data-list-part=index]').getBoundingClientRect().width, a.height, Math.round(second.getBoundingClientRect().top - a.bottom)];
        })()`);
      assert.deepEqual(await index(), [16, 16, 0]);

      await page.setControl('size', 'regular');
      assert.deepEqual(await index(), [30, 16, 9]);

      // Scrubbing from A to J jumps to J's section.
      const [first, target] = await page.evaluate(`(() => {
        const items = [...document.querySelectorAll('[data-list-part=index-item]')];
        const center = (item) => { const { height, width, x, y } = item.getBoundingClientRect(); return [x + width / 2, y + height / 2]; };
        return [center(items[0]), center(items.find((item) => item.textContent === 'J'))];
      })()`);
      await page.drag(first, target, { duration: 400 });
      await sleep(500);

      const top = await page.evaluate(`(() => {
        const stage = ${page.section}.querySelector('stage').getBoundingClientRect();
        const section = document.querySelector('[data-letter="J"]');
        return Math.round(section.getBoundingClientRect().top - stage.top);
      })()`);
      assert.equal(top, 0);
      await page.screenshot('list-index');
    },
  },
  {
    name: 'list: screenshots',
    run: async (page) => {
      for (const scheme of /** @type {const} */ (['light', 'dark'])) {
        await page.open('list', scheme);
        await page.screenshot(`list-${scheme}`);
      }
    },
  },
];
