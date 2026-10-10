/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { mapped, rightClick, sleep, withTouch } from '../lib.js';

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
 * Expression for a row's content (in its swipe track): its grid, and its
 * separator.
 *
 * @param {number} group
 * @param {number} index
 */
const rowContent = (group, index) =>
  `${row(group, index)}.querySelector('[data-list-part=row]')`;

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
 * Waits for `condition` (e.g. an overswipe, which moves the row across the
 * whole row first), at most `timeout` ms.
 *
 * @param {() => Promise<boolean>} condition
 * @param {number} [timeout]
 */
const until = async (condition, timeout = 3000) => {
  const end = Date.now() + timeout;
  while (!(await condition()) && Date.now() < end) await sleep(50);
};

/**
 * Whether the demo logged `text`.
 *
 * @param {Page} page
 * @param {string} text
 */
const logged = async (page, text) => {
  const log = await page.log();
  return log.includes(text);
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
      // Scrolled in its track: where its content is.
      offset: Math.round(element.querySelector('[data-list-part=row]').getBoundingClientRect().left - element.getBoundingClientRect().left),
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
    name: 'list: touch swipes open the swipe actions (touch captures the title)',
    run: async (page) => {
      await page.open('list-swipe');
      const { height, width, x, y } = await rowRect(page, 0, 0);

      await withTouch(page, async (touch) => {
        const start = x + width - 80;
        await touch('touchStart', start, y + height / 2);
        for (let step = 1; step <= 10; step += 1) {
          await touch('touchMove', start - step * 16, y + height / 2);
          await sleep(30);
        }
        await touch('touchEnd');
        await sleep(500);
      });

      assert.equal(await swipeSide(page, 0, 0), 'trailing');
    },
  },
  {
    name: 'list: diagonal touch swipes open the swipe actions instead of scrolling',
    run: async (page) => {
      await page.open('list-swipe');
      const { height, width, x, y } = await rowRect(page, 0, 0);
      const scrollY = 'document.scrollingElement.scrollTop';
      const before = await page.evaluate(scrollY);

      await withTouch(page, async (touch) => {
        const start = x + width - 80;
        await touch('touchStart', start, y + height / 2);
        for (let step = 1; step <= 10; step += 1) {
          await touch(
            'touchMove',
            start - step * 16,
            y + height / 2 - step * 6,
          );
          await sleep(30);
        }
        await touch('touchEnd');
        await sleep(500);
      });

      assert.equal(await swipeSide(page, 0, 0), 'trailing');
      assert.equal(await page.evaluate(scrollY), before, 'not scrolled');
    },
  },
  {
    name: 'list: dragging by touch from the pop-up chooses the item released on',
    run: async (page) => {
      await page.open('list');
      /** @type {[number, number]} */
      const trigger = await page.evaluate(`(() => {
        const button = document.querySelector('[aria-haspopup=menu]');
        button.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = button.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);

      await withTouch(page, async (touch) => {
        await touch('touchStart', ...trigger);
        for (let step = 1; step <= 4; step += 1) {
          await touch('touchMove', trigger[0], trigger[1] + step * 4);
          await sleep(30);
        }
        await sleep(500);

        /** @type {[number, number]} */
        const item = await page.evaluate(`(() => {
          const { height, width, x, y } = document.querySelectorAll('[role=menuitemradio]')[2].getBoundingClientRect();
          return [x + width / 2, y + height / 2];
        })()`);
        for (let step = 1; step <= 8; step += 1) {
          await touch(
            'touchMove',
            trigger[0] + ((item[0] - trigger[0]) * step) / 8,
            trigger[1] + 16 + ((item[1] - trigger[1] - 16) * step) / 8,
          );
          await sleep(30);
        }
        await touch('touchEnd');
        await sleep(500);
      });

      const result = await page.evaluate(
        `[document.querySelector(${JSON.stringify('[aria-haspopup=menu]')}).textContent, document.querySelectorAll(${JSON.stringify('[role=menu]')}).length]`,
      );
      assert.deepEqual(result, ['Never', 0]);
    },
  },
  {
    name: 'list: touching the pop-up opens its menu on touch down, a tap keeps it open',
    run: async (page) => {
      await page.open('list');
      /** @type {[number, number]} */
      const trigger = await page.evaluate(`(() => {
        const button = document.querySelector('[aria-haspopup=menu]');
        button.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = button.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      const menus = `document.querySelectorAll(${JSON.stringify('[role=menu]')}).length`;

      await withTouch(page, async (touch) => {
        await touch('touchStart', ...trigger);
        await sleep(400);
        assert.equal(await page.evaluate(menus), 1, 'open on touch down');

        await touch('touchEnd');
        await sleep(400);
        assert.equal(await page.evaluate(menus), 1, 'open after the tap');
      });
    },
  },
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
            separator: separator.display === 'none' || separator.opacity === '0' ? null : [Math.round(title.left - box.left), Math.round(box.right - (title.left + parseFloat(separator.width)))],
            titleInset: Math.round((part('image') ?? title).left - box.left),
            trailingInset: Math.round(box.right - [...element.children].filter((child) => child.tagName !== 'INPUT').at(-1).getBoundingClientRect().right),
          };
        };
        const group = document.querySelector('[data-list-part=group]');
        return [...group.children].slice(0, 3).map((item) => measure(item.querySelector('[data-list-part=row]')));
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
        // (SF Symbols: their paths' geometry, drawn through a mask.)
        const paths = (element) => [...element.querySelectorAll('path')].filter((path) => !path.closest('mask') || path.parentElement.tagName === 'mask').map((path) => { if (!path.closest('mask')) return path.getBoundingClientRect(); const { height, width, x, y } = path.getBBox(); const { a, d, e, f } = path.ownerSVGElement.getScreenCTM(); return new DOMRect(a * x + e, d * y + f, a * width, d * height); });
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
        const button = document.querySelector('[aria-haspopup=menu]');
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
      // selection would turn nearly opaque. (The popup's moving selection,
      // on the highlighted item.)
      const selection = await page.evaluate(`(() => {
        const style = getComputedStyle(document.querySelector('[role=menu] [data-moving-highlight]'));
        return [style.backgroundColor, style.mixBlendMode, style.opacity];
      })()`);
      assert.deepEqual(selection, ['rgba(0, 0, 0, 0.07)', 'normal', '1']);
    },
  },
  {
    name: 'list: headers and footers match Figma',
    run: async (page) => {
      await page.open('list-parts');

      /** @param {string} prominence */
      const header = async (prominence) => {
        await page.setState(3, { prominence });
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
        getComputedStyle(${rowContent(0, 1)}, '::before').opacity,
        getComputedStyle(${rowContent(0, 2)}, '::before').opacity,
        getComputedStyle(${rowContent(0, 3)}, '::before').opacity,
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
    name: 'list: a segmented control is a trailing part, centered, 16px from the edge',
    run: async (page) => {
      await page.open('list');
      const state = () =>
        page.evaluate(`(() => {
          const item = ${row(0, 6)};
          const box = item.getBoundingClientRect();
          const control = item.querySelector('[role=radiogroup]').getBoundingClientRect();
          return {
            center: Math.round(control.top + control.height / 2 - (box.top + box.height / 2)),
            height: box.height,
            inset: Math.round(box.right - control.right),
            value: item.querySelector('[role=radio][aria-checked=true]').getAttribute('value') ?? item.querySelector('[role=radio][aria-checked=true]').textContent.charAt(0),
          };
        })()`);
      // 36px high, it fits the row (8px from its edges).
      assert.deepEqual(await state(), {
        center: 0,
        height: 52,
        inset: 16,
        value: 'M',
      });

      const large = await page.evaluate(`(() => {
        const { height, width, x, y } = [...${row(0, 6)}.querySelectorAll('[role=radio]')].at(-1).getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(large);
      await sleep(400);
      const { value } = await state();
      assert.equal(value, 'L');
    },
  },
  {
    name: 'list: a stepper is a trailing part, its value a detail',
    run: async (page) => {
      await page.open('list');
      const state = () =>
        page.evaluate(`(() => {
          const item = ${row(0, 7)};
          const box = item.getBoundingClientRect();
          const group = item.querySelector('[role=group]').getBoundingClientRect();
          const detail = item.querySelector('[data-list-part=detail]');
          return {
            center: Math.round(group.top + group.height / 2 - (box.top + box.height / 2)),
            gap: Math.round(group.left - detail.getBoundingClientRect().right),
            height: box.height,
            inset: Math.round(box.right - group.right),
            value: detail.textContent,
          };
        })()`);
      assert.deepEqual(await state(), {
        center: 0,
        gap: 16,
        height: 52,
        inset: 16,
        value: '1',
      });

      const increment = await page.evaluate(`(() => {
        const { height, width, x, y } = ${row(0, 7)}.querySelectorAll('[role=group] button')[1].getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(increment);
      await sleep(300);
      const { value } = await state();
      assert.equal(value, '2');
    },
  },
  {
    name: 'list: a row of a single control (a slider) spans its content',
    run: async (page) => {
      await page.open('list');
      const geometry = await page.evaluate(`(() => {
        const item = ${rowContent(0, 8)};
        const box = item.getBoundingClientRect();
        const slider = item.firstElementChild.getBoundingClientRect();
        return [Math.round(slider.left - box.left), Math.round(box.right - slider.right), Math.round(slider.top + slider.height / 2 - (box.top + box.height / 2))];
      })()`);
      assert.deepEqual(geometry, [16, 16, 0]);
    },
  },
  {
    name: 'list: overswiping triggers the outermost action',
    run: async (page) => {
      await page.open('list-swipe');

      const { height, x, y } = await rowRect(page, 0, 0);
      const from = /** @type {[number, number]} */ ([x + 80, y + height / 2]);

      // The symbol's offset from the circle's center, whether armed, the
      // label's opacity.
      const symbolState = () =>
        page.evaluate(`(() => {
          const outermost = ${row(0, 0)}.querySelector('[data-list-part=swipe-action]');
          const circle = outermost.firstElementChild.getBoundingClientRect();
          const symbol = outermost.querySelector('[data-list-part=swipe-action-symbol] > *').getBoundingClientRect();
          return {
            armed: outermost.hasAttribute('data-armed'),
            label: getComputedStyle(outermost.lastElementChild).opacity,
            shift: Math.round(symbol.left + symbol.width / 2 - (circle.left + circle.width / 2)),
          };
        })()`);

      // Past the actions (178px), not armed yet (5 × 54 + 26 + 8px).
      await page.mouse('mousePressed', ...from);
      for (let step = 1; step <= 5; step += 1) {
        await page.mouse('mouseMoved', from[0] + step * 40, from[1]);
        await sleep(30);
      }
      await sleep(300);
      assert.deepEqual(await symbolState(), {
        armed: false,
        label: '1',
        shift: 0,
      });

      // Armed (past 304px), not yet pushing the others out (past twice
      // that, less the actions: 430px).
      for (let step = 6; step <= 10; step += 1) {
        await page.mouse('mouseMoved', from[0] + step * 40, from[1]);
        await sleep(30);
      }
      await sleep(300);

      // The outermost (leading: first) action's circle fills the space from
      // the edge (16px) up to the others (10px), which follow the row (10px
      // from it); armed, its symbol at the row's end (centered in its own
      // size: 22px from it).
      const stretched = await page.evaluate(String.raw`(() => {
        const item = ${row(0, 0)};
        const actions = item.querySelector('[data-list-part=swipe-actions]');
        const [outermost, next, last] = actions.children;
        const box = actions.getBoundingClientRect();
        const circle = outermost.firstElementChild.getBoundingClientRect();
        const symbol = outermost.querySelector('[data-list-part=swipe-action-symbol] > *').getBoundingClientRect();
        const rowLeft = item.querySelector('[data-list-part=row]').getBoundingClientRect().left;
        return {
          armed: outermost.hasAttribute('data-armed'),
          atRow: Math.round(circle.right - (symbol.left + symbol.width / 2)),
          edge: Math.round(circle.left - box.left),
          next: Math.round(next.getBoundingClientRect().left - circle.right),
          others: [next, last].map((button) => [...button.children, button.querySelector('[data-list-part=swipe-action-symbol]')].map((part) => { const style = getComputedStyle(part); const filtered = /opacity\(([\d.]+)\)/u.exec(style.filter); return String(Math.round(Number(style.opacity) * Number(filtered?.[1] ?? 1) * 100) / 100); })),
          row: Math.round(rowLeft - last.getBoundingClientRect().right),
        };
      })()`);
      assert.deepEqual(stretched, {
        armed: true,
        atRow: 22,
        edge: 16,
        next: 10,
        // Faded while overswiping (iOS, measured: 36%).
        others: [
          ['1', '0.36', '0.36'],
          ['1', '0.36', '0.36'],
        ],
        row: 10,
      });

      // Moved back, disarmed: centered again, with the label.
      await page.mouse('mouseMoved', from[0] + 200, from[1]);
      await sleep(300);
      assert.deepEqual(await symbolState(), {
        armed: false,
        label: '1',
        shift: 0,
      });
      await page.mouse('mouseMoved', from[0] + 480, from[1]);
      await sleep(300);

      await page.mouse('mouseReleased', from[0] + 480, from[1]);
      // Across the whole row, then triggered and closed.
      await sleep(200);
      const moving = await swipeState(page, 0, 0);
      assert.ok(moving.offset > 480, 'moving across the row');
      await until(async () => (await swipeSide(page, 0, 0)) === undefined);

      const log = await page.log();
      assert.match(log, /swipe action clicked/);
      assert.equal(await swipeSide(page, 0, 0), undefined);

      // Trailing, too: the outermost (last) action.
      await swipe(page, 0, 0, -400);
      await until(() => logged(page, 'Done clicked'));
      assert.match(await page.log(), /Done clicked/);

      // Without overswipe, the actions just open.
      await page.setState(1, { overswipe: false });
      await swipe(page, 0, 0, 400);
      assert.equal(await swipeSide(page, 0, 0), 'leading');
    },
  },
  {
    name: 'list: a single action arms overswiping only past 5 actions',
    run: async (page) => {
      await page.open('list-edit');
      const titles = () =>
        page.evaluate(
          `[...${row(0, 0)}.parentElement.children].map((item) => item.querySelector(${JSON.stringify('[data-list-part=title]')}).textContent)`,
        );

      // Past the Delete action (70px), not past 5 actions: it opens.
      await swipe(page, 0, 0, -150);
      assert.equal(await swipeSide(page, 0, 0), 'trailing');
      const { length } = await titles();
      assert.equal(length, 5);

      // Past 5 actions (5 × 54 + 26 + 8px): deleted.
      await swipe(page, 0, 1, -420);
      await until(async () => {
        const left = await titles();
        return left.length === 4;
      });
      assert.deepEqual(await titles(), ['Mercury', 'Earth', 'Mars', 'Jupiter']);
    },
  },
  {
    name: 'list: in narrow rows, overswiping arms at half the row, but one action past the actions',
    run: async (page) => {
      await page.open('list-edit');
      // A phone's width.
      await page.evaluate(
        `document.body.style.width = ${JSON.stringify('390px')}`,
      );
      await sleep(100);
      const rowWidth = await page.evaluate(
        `${row(0, 0)}.getBoundingClientRect().width`,
      );
      assert.ok(rowWidth < 400, `row ${rowWidth}px`);
      const count = () =>
        page.evaluate(`${row(0, 0)}.parentElement.children.length`);

      // Past the Delete action and one more, not half the row: it opens.
      await swipe(page, 0, 0, -Math.round(rowWidth / 2) + 30);
      assert.equal(await swipeSide(page, 0, 0), 'trailing');
      assert.equal(await count(), 5);

      // Past half the row (not 304px): deleted.
      await swipe(page, 0, 1, -Math.round(rowWidth / 2) - 30);
      await until(async () => (await count()) === 4);
      assert.equal(await count(), 4);
    },
  },
  {
    name: 'list: scrolled sideways (trackpad), rows swipe, settling open or closed; vertical scrolls stay the page’s',
    run: async (page) => {
      await page.open('list-swipe');
      const { height, width, x, y } = await rowRect(page, 0, 1);
      const at = { x: x + width / 2, y: y + height / 2 };
      /** @param {number} deltaX @param {number} [deltaY] */
      const scroll = async (deltaX, deltaY = 0, times = 6) => {
        for (let step = 0; step < times; step += 1) {
          await page.browser.send('Input.dispatchMouseEvent', {
            deltaX,
            deltaY,
            type: 'mouseWheel',
            ...at,
          });
          await sleep(16);
        }
        await sleep(600);
      };

      // Scrolled right (fingers moving left): the trailing actions open.
      await scroll(30);
      const opened = await swipeState(page, 0, 1);
      assert.equal(opened.swipe, 'trailing');
      assert.equal(opened.offset, -opened.width);

      // Back: closed.
      await scroll(-30);
      assert.equal(await swipeSide(page, 0, 1), undefined);

      // A little: snaps back closed.
      await scroll(10, 0, 2);
      assert.equal(await swipeSide(page, 0, 1), undefined);

      // Vertically: not swiped.
      await scroll(4, 40);
      assert.equal(await swipeSide(page, 0, 1), undefined);
    },
  },
  {
    name: 'list: closing a row by scrolling past closed does not open its other side',
    run: async (page) => {
      await page.open('list-swipe');
      const { height, width, x, y } = await rowRect(page, 0, 1);
      const at = { x: x + width / 2, y: y + height / 2 };
      /** @param {number} deltaX @param {number} times */
      const scroll = async (deltaX, times) => {
        for (let step = 0; step < times; step += 1) {
          await page.browser.send('Input.dispatchMouseEvent', {
            deltaX,
            deltaY: 0,
            type: 'mouseWheel',
            ...at,
          });
          await sleep(16);
        }
        await sleep(700);
      };

      await scroll(30, 6);
      assert.equal(await swipeSide(page, 0, 1), 'trailing');
      // Far back (past the leading actions' half): closed only.
      await scroll(-60, 6);
      assert.equal(await swipeSide(page, 0, 1), undefined, 'scrolled');

      // Dragged, too.
      await swipe(page, 0, 1, -150);
      assert.equal(await swipeSide(page, 0, 1), 'trailing');
      await swipe(page, 0, 1, 400);
      assert.equal(await swipeSide(page, 0, 1), undefined, 'dragged');

      // From closed, it opens.
      await swipe(page, 0, 1, 150);
      assert.equal(await swipeSide(page, 0, 1), 'leading');
    },
  },
  {
    name: 'list: scrolled sideways, a row stops open; scrolled on past the arming distance, it overswipes once at rest, closing',
    run: async (page) => {
      await page.open('list-swipe');
      const { height, width, x, y } = await rowRect(page, 0, 0);
      // (Synthetic wheel events have no phases: the browser doesn't latch
      // them to the row once the pointer leaves it, as with a trackpad, and
      // snaps between them: one event far enough.)
      const at = { x: x + width - 10, y: y + height / 2 };
      /** @param {number} deltaX @param {number} times */
      const scroll = async (deltaX, times) => {
        for (let step = 0; step < times; step += 1) {
          await page.browser.send('Input.dispatchMouseEvent', {
            deltaX,
            deltaY: 0,
            type: 'mouseWheel',
            ...at,
          });
          await sleep(16);
        }
        await sleep(700);
      };

      // Scrolled (not swiped), a row stops open first: far as it goes.
      await scroll(60, 16);
      assert.equal(await swipeSide(page, 0, 0), 'trailing', 'open');
      assert.doesNotMatch(await page.log(), /clicked/u, 'not at once');

      // Scrolled on from open: overswiped, then closed.
      await scroll(300, 1);
      await until(() => logged(page, 'Done clicked'));
      assert.match(await page.log(), /Done clicked/u);
      await until(async () => (await swipeSide(page, 0, 0)) === undefined);
      assert.equal(await swipeSide(page, 0, 0), undefined, 'closed');
    },
  },
  {
    name: 'list: rows arm overswiping at the same distance, in tall rows, too',
    run: async (page) => {
      await page.open('list-swipe');
      // Tall row: armed past 304px all the same.
      const { height, width, x, y } = await rowRect(page, 0, 1);
      const from = /** @type {[number, number]} */ ([
        x + width - 40,
        y + height / 2,
      ]);
      const armed = () =>
        page.evaluate(
          `${row(0, 1)}.querySelectorAll('[data-list-part=swipe-actions]')[1].lastElementChild.hasAttribute('data-armed')`,
        );

      await page.mouse('mousePressed', ...from);
      for (let step = 1; step <= 7; step += 1) {
        await page.mouse('mouseMoved', from[0] - step * 40, from[1]);
        await sleep(30);
      }
      assert.equal(await armed(), false, '280px');
      await page.mouse('mouseMoved', from[0] - 330, from[1]);
      await sleep(100);
      assert.equal(await armed(), true, '330px');
      // Held armed: nothing triggers until released.
      await sleep(600);
      assert.doesNotMatch(await page.log(), /clicked/u, 'held');
      await page.mouse('mouseMoved', from[0] - 200, from[1]);
      await sleep(100);
      await page.mouse('mouseReleased', from[0] - 200, from[1]);
      await sleep(500);
    },
  },
  {
    name: 'list: an overswipe handler replaces triggering the outermost action',
    run: async (page) => {
      await page.open('list-swipe', 'light', {
        state: [null, { $rest: true, onOverswipe: mapped('[log overswipe]') }],
      });

      const { height, x, y } = await rowRect(page, 0, 0);
      const from = /** @type {[number, number]} */ ([x + 80, y + height / 2]);
      await page.mouse('mousePressed', ...from);
      for (let step = 1; step <= 12; step += 1) {
        await page.mouse('mouseMoved', from[0] + step * 40, from[1]);
        await sleep(30);
      }
      await sleep(300);
      await page.mouse('mouseReleased', from[0] + 480, from[1]);
      await until(async () => (await swipeSide(page, 0, 0)) === undefined);

      const log = await page.log();
      assert.match(log, /overswiped/);
      assert.doesNotMatch(log, /swipe action clicked/);
      assert.equal(await swipeSide(page, 0, 0), undefined, 'closed');
    },
  },
  {
    name: 'list: swipe actions take no room in a list sized by its content',
    run: async (page) => {
      await page.open('list-swipe');
      const width = () =>
        page.evaluate(
          `document.querySelector(${JSON.stringify('[data-list-part=group]')}).getBoundingClientRect().width`,
        );
      await page.evaluate(
        `document.body.style.cssText = ${JSON.stringify('width: max-content; margin: 0')}`,
      );
      await sleep(300);
      const swipeable = await width();
      // The same rows without their actions.
      await page.evaluate(
        `document.querySelectorAll(${JSON.stringify('[data-list-part=swipe-actions]')}).forEach((actions) => actions.remove())`,
      );
      await page.evaluate(
        `document.querySelectorAll(${JSON.stringify('[data-swipeable]')}).forEach((item) => item.style.cssText = '')`,
      );
      await sleep(300);
      assert.equal(swipeable, await width());
    },
  },
  {
    name: 'list: swipe actions open, match Figma and close',
    run: async (page) => {
      await page.open('list-swipe');

      // Tall row, trailing: 44px circles without labels, 10px from the row
      // and each other, 16px from the edge.
      await swipe(page, 0, 1, -200);
      const tall = await swipeState(page, 0, 1);
      assert.equal(tall.swipe, 'trailing');
      assert.deepEqual(tall.actions, [1, 1, 1]);
      assert.equal(tall.width, 10 + 44 * 3 + 10 * 2 + 16);
      assert.equal(tall.offset, -tall.width);

      // Multi-line row (labels): circles 44px, 4px above 13px labels,
      // centered in the row.
      await swipe(page, 0, 2, -200);
      const geometry = await page.evaluate(`(() => {
        const item = ${row(0, 2)};
        const box = item.getBoundingClientRect();
        const button = [...item.querySelectorAll('[data-list-part=swipe-action]')].at(-1);
        const shape = button.firstElementChild.getBoundingClientRect();
        const label = button.querySelector('[data-list-part=swipe-action-label]').getBoundingClientRect();
        return {
          // Gray only behind the row's content, its actions on the row's
          // background (its group's).
          backgrounds: [getComputedStyle(item).backgroundColor, getComputedStyle(item.querySelector('[data-list-part=row]')).backgroundColor],
          centered: Math.round(box.top + box.height / 2 - (shape.top + label.bottom) / 2),
          label: label.height,
          labelGap: Math.round(label.top - shape.bottom),
          radius: getComputedStyle(item.querySelector('[data-list-part=row]')).borderTopLeftRadius,
          separators: [getComputedStyle(item.querySelector('[data-list-part=row]'), '::before').opacity],
          shape: [shape.width, shape.height],
        };
      })()`);
      assert.deepEqual(geometry, {
        backgrounds: ['rgba(0, 0, 0, 0)', 'rgb(229, 229, 234)'],
        centered: 0,
        label: 16,
        labelGap: 4,
        radius: '34px',
        separators: ['0'],
        shape: [44, 44],
      });

      // Regular row, leading: 44px circles without labels, 4px from the
      // row's edges; the other row closes (one open at a time).
      await swipe(page, 0, 0, 170);
      const regular = await swipeState(page, 0, 0);
      assert.equal(regular.swipe, 'leading');
      assert.equal(regular.width, 16 + 44 * 3 + 10 * 2 + 10);
      assert.equal(
        await page.evaluate(
          `Math.round(${row(0, 0)}.querySelector('[data-list-part=swipe-action]').getBoundingClientRect().top - ${row(0, 0)}.getBoundingClientRect().top)`,
        ),
        4,
      );
      assert.equal(regular.offset, regular.width);
      assert.equal(await swipeSide(page, 0, 2), undefined);

      // Swiped back past half its actions, it closes; so does a tap
      // elsewhere.
      await swipe(page, 0, 0, -100);
      assert.equal(await swipeSide(page, 0, 0), undefined);

      await swipe(page, 0, 0, 170);
      const { height, width, x, y } = await rowRect(page, 0, 1);
      await page.click([x + width / 2, y + height / 2]);
      await sleep(500);
      assert.equal(await swipeSide(page, 0, 0), undefined);
    },
  },
  {
    name: 'list: swiping a row does not click it',
    run: async (page) => {
      await page.open('list-swipe');
      await page.evaluate(
        `window.clicks = 0; ${row(0, 0)}.querySelector('[data-list-part=title]').addEventListener('click', () => { window.clicks += 1; })`,
      );

      await swipe(page, 0, 0, -170);
      const { height, width, x, y } = await rowRect(page, 0, 0);
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
      await page.open('list-edit', 'light', {
        state: [{ $rest: true, prefix: 'multiple' }],
      });
      const checkbox = await page.evaluate(`(() => {
        const item = ${row(0, 1)};
        const edit = item.querySelector('[data-list-part=edit]').getBoundingClientRect();
        const title = item.querySelector('[data-list-part=title]').getBoundingClientRect();
        return [edit.width, Math.round(edit.left - item.getBoundingClientRect().left), Math.round(title.left - edit.right)];
      })()`);
      assert.deepEqual(checkbox, [22, 18, 17]);

      await page.setState(0, { prefix: 'delete' });
      const { height, width, x, y } = await page.evaluate(`(() => {
        const button = ${row(0, 0)}.querySelector('[data-list-part=edit]');
        button.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = button.getBoundingClientRect();
        return { height, width, x, y };
      })()`);
      await page.click([x + width / 2, y + height / 2]);
      await sleep(500);
      assert.equal(await swipeSide(page, 0, 0), 'trailing');
    },
  },
  {
    name: 'list: selection prefixes are independent of reordering',
    run: async (page) => {
      await page.open('list-edit');

      /** @returns {Promise<{ checked: (string | null)[], grabbers: number }>} */
      const state = () =>
        page.evaluate(`(() => {
          const group = document.querySelector('[data-list-part=group]');
          return {
            checked: [...group.querySelectorAll('[data-list-part=edit]')].map((edit) => edit.getAttribute('aria-checked')),
            grabbers: group.querySelectorAll('[data-list-part=grabber]').length,
          };
        })()`);

      /** @param {number} index */
      const choose = async (index) => {
        const rect = await page.evaluate(`(() => {
          const { height, width, x, y } = ${row(0, index)}.querySelector('[data-list-part=edit]').getBoundingClientRect();
          return [x + width / 2, y + height / 2];
        })()`);
        await page.click(rect);
        await sleep(300);
      };

      // Single (radios in a radio group): one at a time.
      await page.setState(0, { prefix: 'single' });
      await choose(2);
      await choose(3);
      assert.deepEqual(await state(), {
        checked: ['false', 'false', 'false', 'true', 'false'],
        grabbers: 5,
      });

      // Multiple (checkboxes), without grabbers.
      await page.setState(0, { prefix: 'multiple' });
      await page.setState(0, { reorder: false });
      await choose(0);
      await choose(2);
      assert.deepEqual(await state(), {
        checked: ['true', 'false', 'true', 'false', 'false'],
        grabbers: 0,
      });
    },
  },
  {
    name: 'list: dragging a grabber reorders the rows; arrow keys move a row',
    run: async (page) => {
      await page.open('list-edit');

      /** @returns {Promise<{ offsets: string[], titles: string[] }>} */
      const state = () =>
        page.evaluate(`(() => {
          const items = [...document.querySelector('[data-list-part=group]').children];
          return {
            offsets: items.map((item) => item.style.transform),
            titles: items.map((item) => item.querySelector('[data-list-part=title]').textContent),
          };
        })()`);
      const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'];

      /** @type {[number, number]} */
      const grabber = await page.evaluate(`(() => {
        const element = ${row(0, 0)}.querySelector('[data-list-part=grabber]');
        element.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = element.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      const { height } = await rowRect(page, 0, 0);

      // A short drag: back in place.
      await page.drag(grabber, [grabber[0], grabber[1] + height / 4], {
        duration: 300,
      });
      await sleep(900);
      assert.deepEqual(await state(), {
        offsets: ['', '', '', '', ''],
        titles: planets,
      });

      // While dragging the first row down past the second's middle, the
      // corners and separators follow the order on screen.
      await page.mouse('mousePressed', ...grabber);
      for (let step = 1; step <= 6; step += 1) {
        await page.mouse(
          'mouseMoved',
          grabber[0],
          grabber[1] + height * 0.2 * step,
        );
        await sleep(40);
      }
      await sleep(400);
      const dragging = await page.evaluate(`(() => {
        const items = [...document.querySelector('[data-list-part=group]').children];
        return items.slice(0, 3).map((item) => { const separator = getComputedStyle(item.querySelector('[data-list-part=row]'), '::before'); return [getComputedStyle(item).borderTopLeftRadius, separator.display === 'none' || separator.opacity === '0']; });
      })()`);
      // Mercury (lifted, second), Venus (first), Earth (below Mercury).
      assert.deepEqual(dragging, [
        ['0px', true],
        ['24px', true],
        ['0px', true],
      ]);
      await page.mouse('mouseReleased', grabber[0], grabber[1] + height * 1.2);
      await sleep(900);
      assert.deepEqual(await state(), {
        offsets: ['', '', '', '', ''],
        titles: ['Venus', 'Mercury', 'Earth', 'Mars', 'Jupiter'],
      });
      assert.match(await page.log(), /reorder: 0 → 1/);

      // Arrow keys on a focused grabber.
      await page.evaluate(
        `${row(0, 1)}.querySelector('[data-list-part=grabber]').focus()`,
      );
      await page.key('ArrowUp');
      await sleep(300);
      const { titles } = await state();
      assert.deepEqual(titles, planets);

      // Dragged past the group's end, the first row reaches the last place
      // (rounded at the bottom while held there).
      await page.mouse('mousePressed', ...grabber);
      for (let step = 1; step <= 10; step += 1) {
        await page.mouse(
          'mouseMoved',
          grabber[0],
          grabber[1] + height * 0.6 * step,
        );
        await sleep(40);
      }
      await sleep(400);
      assert.equal(
        await page.evaluate(
          `getComputedStyle(${row(0, 0)}).borderBottomLeftRadius`,
        ),
        '24px',
      );
      await page.mouse('mouseReleased', grabber[0], grabber[1] + height * 6);
      await sleep(900);
      const { titles: moved } = await state();
      assert.deepEqual(moved, ['Venus', 'Earth', 'Mars', 'Jupiter', 'Mercury']);

      // And the last row the first place.
      const last = await page.evaluate(`(() => {
        const { height, width, x, y } = ${row(0, 4)}.querySelector('[data-list-part=grabber]').getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.drag(last, [last[0], last[1] - height * 6], {
        duration: 500,
      });
      await sleep(900);
      const { titles: back } = await state();
      assert.deepEqual(back, planets);
    },
  },
  {
    name: 'list: a segmented control switches between groups',
    run: async (page) => {
      await page.open('list-segmented');
      const state = () =>
        page.evaluate(`(() => {
          const control = ${page.section}.querySelector('[role=radiogroup]').getBoundingClientRect();
          const groups = [...${page.section}.querySelectorAll('[data-list-part=group]')];
          const shown = groups.find((group) => !group.hidden);
          const box = shown.getBoundingClientRect();
          return {
            aligned: [Math.round(control.left - box.left), Math.round(control.right - box.right)],
            gap: Math.round(box.top - control.bottom),
            rows: [...shown.children].map((item) => item.querySelector('[data-list-part=title]').textContent),
            shown: shown.id,
          };
        })()`);
      assert.deepEqual(await state(), {
        aligned: [0, 0],
        gap: 16,
        rows: ['Planning', 'Offsite', 'Release 1.3', 'Retrospective'],
        shown: 'list-segmented-upcoming',
      });

      const past = await page.evaluate(`(() => {
        const { height, width, x, y } = ${page.section}.querySelector('[aria-controls=list-segmented-past]').getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(past);
      await sleep(400);
      const { rows, shown } = await state();
      assert.deepEqual(
        { rows, shown },
        {
          rows: ['Design Review', 'Team Lunch', 'Release 1.2'],
          shown: 'list-segmented-past',
        },
      );
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

      await page.setState(2, { size: 'regular' });
      assert.deepEqual(await index(), [30, 16, 9]);

      // Scrubbing from A to J jumps to J's section.
      const [first, target] = await page.evaluate(`(() => {
        const items = [...document.querySelectorAll('[data-list-part=index-item]')];
        const center = (item) => { const { height, width, x, y } = item.getBoundingClientRect(); return [x + width / 2, y + height / 2]; };
        return [center(items[0]), center(items.find((item) => item.textContent === 'J'))];
      })()`);
      await page.drag(first, target, { duration: 400 });
      await sleep(500);

      // At the top of the scrolled page (raw, the document scrolls).
      const top = await page.evaluate(
        'Math.round(document.querySelector(\'[data-letter="J"]\').getBoundingClientRect().top)',
      );
      assert.equal(top, 0);
      await page.screenshot('list-index');
    },
  },
  {
    name: 'list: rounded rectangle actions fill the row; text in capitals; shapes mixed',
    run: async (page) => {
      await page.open('list-swipe');

      // “Rounded rectangles” (labelled), “Text”: 4px from the row's edges
      // (above the labels), at least 60px wide, concentric corners.
      /** @param {number} index */
      const shapes = async (index) => {
        await swipe(page, 0, index, -240);
        return page.evaluate(`(() => {
          const item = ${row(0, index)};
          const box = item.getBoundingClientRect();
          const button = [...item.querySelectorAll('[data-list-part=swipe-action]')].at(-1);
          const shape = button.firstElementChild;
          const { bottom, top, width } = shape.getBoundingClientRect();
          const symbol = shape.firstElementChild;
          return {
            bottom: Math.round(box.bottom - bottom),
            radius: getComputedStyle(shape).borderTopLeftRadius,
            text: [getComputedStyle(symbol).textTransform, getComputedStyle(symbol).fontSize],
            top: Math.round(top - box.top),
            wide: width >= 60,
          };
        })()`);
      };

      assert.deepEqual(await shapes(3), {
        bottom: 4 + 20,
        radius: '12px',
        text: ['uppercase', '15px'],
        top: 4,
        wide: true,
      });
      assert.deepEqual(await shapes(5), {
        bottom: 4,
        radius: '12px',
        text: ['uppercase', '15px'],
        top: 4,
        wide: true,
      });

      // “Mixed”: circles, the outermost a rounded rectangle.
      await swipe(page, 0, 4, -240);
      const mixed = await page.evaluate(
        `[...${row(0, 4)}.querySelectorAll(${JSON.stringify('[data-list-part=swipe-actions]')})[1].children].map((button) => getComputedStyle(button.firstElementChild).borderTopLeftRadius)`,
      );
      assert.deepEqual(mixed, ['100px', '100px', '12px']);
    },
  },
  {
    name: 'list: actions fade in as they scale in',
    run: async (page) => {
      await page.open('list-swipe');
      const { height, width, x, y } = await rowRect(page, 0, 0);
      const from = /** @type {[number, number]} */ ([
        x + width - 40,
        y + height / 2,
      ]);

      // Halfway into the outermost (last) action's 44px.
      await page.mouse('mousePressed', ...from);
      for (let step = 1; step <= 4; step += 1) {
        await page.mouse('mouseMoved', from[0] - 8 - step * 9.5, from[1]);
        await sleep(30);
      }
      await sleep(100);
      const fade = await page.evaluate(`(() => {
        const button = ${row(0, 0)}.querySelectorAll('[data-list-part=swipe-actions]')[1].lastElementChild;
        return [new DOMMatrix(getComputedStyle(button).transform).a, Number(getComputedStyle(button.querySelector('[data-list-part=swipe-action-symbol]')).opacity)];
      })()`);
      await page.mouse('mouseReleased', from[0] - 46, from[1]);
      await sleep(500);

      const [scale, opacity] = fade;
      assert.ok(scale > 0.2 && scale < 0.8, `scale ${scale}`);
      assert.ok(
        Math.abs(opacity - (0.36 + 0.64 * scale)) < 0.01,
        `opacity ${opacity} at scale ${scale}`,
      );
    },
  },
  {
    name: 'list: rows with a click handler are pressable, passing clicks on',
    run: async (page) => {
      await page.open('list');
      const state = () =>
        page.evaluate(
          `[document.querySelector('[role=switch]').getAttribute('aria-checked'), getComputedStyle(${row(0, 0)}).backgroundColor, getComputedStyle(${row(0, 0)}).cursor]`,
        );
      const { height, width, x, y } = await rowRect(page, 0, 0);

      // Pressed on the row: highlighted, clicking the switch.
      await page.mouse('mousePressed', x + width / 2, y + height / 2);
      await sleep(100);
      const [, pressed, cursor] = await state();
      await page.mouse('mouseReleased', x + width / 2, y + height / 2);
      await sleep(300);
      assert.deepEqual([pressed, cursor], ['rgb(209, 209, 214)', 'pointer']);
      const [checked] = await state();
      assert.equal(checked, 'true');

      // Pressed on the switch: not highlighted, toggled once.
      /** @type {[number, number]} */
      const control = await page.evaluate(`(() => {
        const { height, width, x, y } = document.querySelector('[role=switch]').getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.mouse('mousePressed', ...control);
      await sleep(100);
      const [, background] = await state();
      await page.mouse('mouseReleased', ...control);
      await sleep(300);
      assert.equal(background, 'rgba(0, 0, 0, 0)');
      const [unchecked] = await state();
      assert.equal(unchecked, 'false');

      // The pop-up row opens its menu, as its button does: no item
      // highlighted (as when opened by keyboard).
      const popUp = await rowRect(page, 0, 3);
      await page.click([popUp.x + 100, popUp.y + popUp.height / 2]);
      await sleep(400);
      assert.deepEqual(
        await page.evaluate(
          `[document.querySelectorAll(${JSON.stringify('[role=menu]')}).length, document.querySelectorAll(${JSON.stringify('[role=menu] [data-highlighted]')}).length]`,
        ),
        [1, 0],
      );
    },
  },
  {
    name: 'list: a collapsible header is a button (cursor)',
    run: async (page) => {
      await page.open('list-parts');
      const cursor = () =>
        page.evaluate(
          `getComputedStyle(${page.section}.querySelector('[data-list-part=header][role=button]')).cursor`,
        );
      assert.equal(await cursor(), 'pointer');
      await page.setState(24, { cursor: 'copy' });
      assert.equal(await cursor(), 'copy');
    },
  },
  {
    name: 'list: deleting rows, with an insert row at the end',
    run: async (page) => {
      await page.open('list-edit', 'light', {
        state: [{ $rest: true, prefix: 'delete + insert' }],
      });
      const titles = () =>
        page.evaluate(
          `[...document.querySelector('[data-list-part=group]').children].map((item) => item.querySelector(${JSON.stringify('[data-list-part=title]')}).textContent)`,
        );
      const insert = await page.evaluate(`(() => {
        const button = [...document.querySelectorAll('[data-list-part=edit]')].at(-1);
        button.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = button.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(insert);
      await sleep(300);
      assert.deepEqual(await titles(), [
        'Mercury',
        'Venus',
        'Earth',
        'Mars',
        'Jupiter',
        'New 1',
        'Add Planet',
      ]);
    },
  },
  {
    name: 'list: an expandable row opens and closes below its row',
    run: async (page) => {
      await page.open('list-parts');
      const state = () =>
        page.evaluate(`(() => {
          const row = document.querySelector(${JSON.stringify('[data-list-part=item]:has([data-list-part=row] > [data-list-part=disclosure])')});
          const expandable = row.nextElementSibling;
          return [Math.round(expandable.getBoundingClientRect().height), expandable.inert];
        })()`);
      assert.deepEqual(await state(), [0, true]);
      const toggle = /** @type {[number, number]} */ (
        await page.evaluate(`(() => {
        const row = document.querySelector(${JSON.stringify('[data-list-part=item]:has([data-list-part=row] > [data-list-part=disclosure])')});
        row.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = row.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`)
      );
      await page.click(toggle);
      await sleep(500);
      assert.deepEqual(await state(), [68, false]);
      await page.click(toggle);
      await sleep(500);
      assert.deepEqual(await state(), [0, true]);
    },
  },
  {
    name: 'list: separators end 16px before the edge, also above multi-line rows',
    run: async (page) => {
      await page.open('list-mail');
      const ends =
        await page.evaluate(`[...document.querySelector(${JSON.stringify('[data-list-part=group]')}).children].slice(1).map((li) => {
        const item = li.querySelector(${JSON.stringify('[data-list-part=row]')});
        // Relative to its grid area, from the text's column (the title's).
        const style = getComputedStyle(item, '::before');
        const box = item.getBoundingClientRect();
        const start = item.querySelector(${JSON.stringify('[data-list-part=title]')}).getBoundingClientRect().left - box.left;
        return Math.round(box.width - start - parseFloat(style.left) - parseFloat(style.width));
      })`);
      assert.deepEqual(ends, [16, 16]);
    },
  },
  {
    name: 'list: rows and their buttons take secondary clicks',
    run: async (page) => {
      const state = Array.from({ length: 17 }, () => null);
      const onSecondaryClick = mapped('[log secondary click]');
      await page.open('list-parts', 'light', {
        state: Object.assign(state, {
          // (Items, buttons.)
          16: { $rest: true, onSecondaryClick },
          6: { $rest: true, onSecondaryClick },
        }),
      });
      /** @returns {Promise<[number, number]>} */
      const centerOf = (/** @type {string} */ text) =>
        page.evaluate(`(() => {
          const element = [...document.querySelectorAll('[data-list-part=title], [data-list-part=button]')].find((part) => part.textContent === ${JSON.stringify(text)});
          element.scrollIntoView({ block: 'center' });
          const { height, width, x, y } = element.getBoundingClientRect();
          return [x + width / 2, y + height / 2];
        })()`);

      await rightClick(page, await centerOf('Title'));
      await sleep(100);
      assert.match(await page.log(), /item secondary click/u);
      await rightClick(page, await centerOf('Button'));
      await sleep(100);
      assert.match(await page.log(), /button secondary click/u);
    },
  },
  {
    name: 'list: a pop-up button in a row is in the details’ text style, its symbol ending where the drill-in chevron does, 16px after its label',
    run: async (page) => {
      await page.open('list');
      const fonts = await page.evaluate(`(() => {
        const font = (element) => { const style = getComputedStyle(element); return [style.fontSize, style.lineHeight, style.letterSpacing]; };
        return [font(document.querySelector('[aria-haspopup]')), font(document.querySelector('[data-list-part=detail]'))];
      })()`);
      assert.deepEqual(fonts[0], fonts[1]);

      // From the rows' ends: the pop-up's symbol (its button's padding
      // beyond), and a drill-in chevron.
      const ends = await page.evaluate(`(() => {
        const end = (element) => Math.round(element.closest('[data-list-part=row]').getBoundingClientRect().right - element.getBoundingClientRect().right);
        return [end(document.querySelector('[aria-haspopup] [data-button-part=symbol]')), end(document.querySelector('[data-list-part=drill-in]'))];
      })()`);
      assert.equal(ends[0], ends[1], 'aligned');

      // Its label and symbol 16px apart (as a detail and its chevron).
      const gap = await page.evaluate(`(() => {
        const popup = document.querySelector('[aria-haspopup]');
        return Math.round(popup.querySelector('[data-button-part=symbol]').getBoundingClientRect().left - popup.querySelector('[data-button-part=label]').getBoundingClientRect().right);
      })()`);
      assert.equal(gap, 16);
    },
  },
  {
    name: 'list: screenshots',
    run: async (page) => {
      for (const id of [
        'list',
        'list-parts',
        'list-swipe',
        'list-edit',
        'list-mail',
        'list-segmented',
      ]) {
        for (const scheme of /** @type {const} */ (['light', 'dark'])) {
          await page.open(id, scheme);
          await page.screenshot(`${id}-${scheme}`);
        }
      }
    },
  },
  {
    name: 'list: a swipe action’s text color over its tint',
    run: async (page) => {
      await page.open('list-swipe', 'light', {
        state: [null, null, { $rest: true, textColor: '#000' }],
      });
      const colors = await page.evaluate(
        `[...${page.section}.querySelectorAll('[data-list-part=swipe-action]')].map((action) => getComputedStyle(action).color)`,
      );
      assert.ok(colors.includes('rgb(0, 0, 0)'), String(colors));
      assert.ok(colors.includes('rgb(255, 255, 255)'), 'the others white');
    },
  },
  {
    name: 'list: a pop-up opened through its row and closed by a pointer leaves no focus ring on its button',
    run: async (page) => {
      await page.open('list');
      await sleep(300);
      const rowCenter = await page.evaluate(`(() => {
        const { height, left, top } = document.querySelector(${JSON.stringify('[data-list-part=row] [aria-haspopup]')}).closest('[data-list-part=row]').getBoundingClientRect();
        return [left + 60, top + height / 2];
      })()`);
      await page.click(/** @type {[number, number]} */ (rowCenter));
      await sleep(600);
      assert.ok(
        await page.evaluate(
          `Boolean(document.querySelector(${JSON.stringify('[role=menu]')}))`,
        ),
        'open',
      );
      // Outside.
      await page.click([700, 790]);
      await sleep(600);
      const ringed = await page.evaluate(
        `document.querySelector(${JSON.stringify('[data-list-part=row] [aria-haspopup]')}).matches(':focus-visible')`,
      );
      assert.equal(ringed, false);
    },
  },
];
