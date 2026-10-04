/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep, withTouch } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * Geometry of the open menu's parts, relative to its (first) popup.
 *
 * @param {Page} page
 */
/**
 * Opens the demo's menu by clicking its trigger.
 *
 * @param {Page} page
 */
const openMenu = async (page) => {
  const { height, width, x, y } = await page.rect('stage button');
  await page.click([x + width / 2, y + height / 2]);
  await sleep(500);
};

/** @param {Page} page */
const menuCount = (page) =>
  page.evaluate(
    `document.querySelectorAll(${JSON.stringify('[role=menu]')}).length`,
  );

/** @param {Page} page */
const measure = (page) =>
  page.evaluate(`(() => {
    const popup = document.querySelector('[role=menu]');
    const box = popup.getBoundingClientRect();
    const item = (text) => [...popup.querySelectorAll('[role^=menuitem]')].find((element) => element.textContent.startsWith(text));
    const label = (element) => element.querySelector('[data-menu-part=label]').getBoundingClientRect();
    const shortcut = item('Action').querySelector('kbd');
    return {
      groupLabel: popup.querySelector('[role=group] > div').getBoundingClientRect().height,
      iconInset: item('Action').querySelector('[data-menu-part=icon]').getBoundingClientRect().left - box.left,
      item: item('Action').getBoundingClientRect().height,
      labelInset: label(item('Action')).left - box.left,
      quickAction: popup.querySelector('[data-menu-part=quick-actions] > *').getBoundingClientRect().height,
      separators: [...popup.querySelectorAll('[role=separator]')].map((separator) => separator.getBoundingClientRect().height),
      shortcut: [...shortcut.children].map((glyph) => glyph.getBoundingClientRect().width).concat(shortcut.getBoundingClientRect().width, Math.round(box.right - shortcut.getBoundingClientRect().right)),
      subtitleItem: [...popup.querySelectorAll('[role=menuitem]')].find((element) => element.querySelector('[data-menu-part=subtitle]')).getBoundingClientRect().height,
      width: box.width,
    };
  })()`);

/**
 * Center of an element, by an expression for it.
 *
 * @param {Page} page
 * @param {string} expression
 * @returns {Promise<[number, number]>}
 */
const center = (page, expression) =>
  page.evaluate(
    `(() => { const { height, width, x, y } = (${expression}).getBoundingClientRect(); return [x + width / 2, y + height / 2]; })()`,
  );

/**
 * Expression for the first enabled item of an open menu (by index, e.g.
 * -1 for the topmost submenu).
 *
 * @param {number} menu
 */
const firstItem = (menu) =>
  `[...document.querySelectorAll(${JSON.stringify('[role=menu]')})].at(${menu}).querySelector('[role^=menuitem]:not([data-disabled])')`;

/**
 * The highlighted items' labels.
 *
 * @param {Page} page
 * @returns {Promise<string[]>}
 */
const highlighted = (page) =>
  page.evaluate(
    `[...document.querySelectorAll(${JSON.stringify('[data-highlighted]')})].map((item) => item.querySelector('[data-menu-part=label]')?.textContent ?? item.textContent)`,
  );

/** Expression for the submenu trigger of the open menu. */
const submenuTrigger = `[...document.querySelectorAll('[role=menuitem]')].find((element) => element.textContent.startsWith(${JSON.stringify('Submenu')}))`;

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'menu: dragging from the trigger on touch highlights the item under the finger, opens a submenu held over, and chooses in it',
    run: async (page) => {
      await page.open('menu');
      const trigger = await page.rect('stage button');
      const [triggerX, triggerY] = [
        trigger.x + trigger.width / 2,
        trigger.y + trigger.height / 2,
      ];

      await withTouch(page, async (touch) => {
        await touch('touchStart', triggerX, triggerY);
        await sleep(500);

        await touch('touchMove', ...(await center(page, firstItem(0))));
        await sleep(100);
        assert.deepEqual(await highlighted(page), ['Share'], 'on an item');

        // Back on the trigger: nothing is.
        await touch('touchMove', triggerX, triggerY);
        await sleep(100);
        assert.deepEqual(await highlighted(page), [], 'on the trigger');

        // On a submenu's item, it opens; its own items aren't highlighted
        // until the finger is on one.
        const [x, y] = await center(page, submenuTrigger);
        await touch('touchMove', x, y - 4);
        await touch('touchMove', x, y);
        await sleep(800);
        assert.equal(await menuCount(page), 2, 'the submenu opens');
        assert.deepEqual(await highlighted(page), ['Submenu'], 'its trigger');

        const target = await center(page, firstItem(-1));
        await touch('touchMove', ...target);
        await sleep(100);
        assert.deepEqual(
          await highlighted(page),
          ['Submenu Action'],
          'only the item in it',
        );

        // Back on its trigger: only that is.
        await touch('touchMove', x, y);
        await sleep(100);
        assert.deepEqual(await highlighted(page), ['Submenu'], 'back');
        assert.equal(await menuCount(page), 2, 'the submenu stays open');

        await touch('touchMove', ...(await center(page, firstItem(-1))));
        await sleep(100);

        await touch('touchEnd');
        await sleep(500);
        assert.equal(await menuCount(page), 0, 'chosen, the menus close');
      });
    },
  },
  {
    name: 'menu: dragging on touch near an end of a scrolling menu scrolls it',
    run: async (page) => {
      await page.open('menu');
      const trigger = await page.rect('stage button');

      await withTouch(page, async (touch) => {
        await touch(
          'touchStart',
          trigger.x + trigger.width / 2,
          trigger.y + trigger.height / 2,
        );
        await sleep(500);
        const menu = `document.querySelector(${JSON.stringify('[role=menu]')})`;
        await page.evaluate(`${menu}.style.maxHeight = '160px'`);
        await sleep(100);

        const { bottom, left, width } = await page.evaluate(
          `(() => { const { bottom, left, width } = ${menu}.getBoundingClientRect(); return { bottom, left, width }; })()`,
        );
        const x = left + width / 2;
        // Above its padding, on an item.
        await touch('touchMove', x, bottom - 30);
        await touch('touchMove', x, bottom - 14);
        await sleep(800);

        const state = await page.evaluate(`(() => {
          const menu = ${menu};
          const item = document.elementsFromPoint(${x}, ${bottom - 14}).map((element) => element.closest('[role^=menuitem]')).find(Boolean);
          return {
            scrolled: menu.scrollTop,
            underFinger: item?.hasAttribute('data-highlighted') ?? false,
          };
        })()`);
        assert.ok(state.scrolled > 0, 'scrolled');
        assert.ok(
          state.underFinger,
          'the item under the finger is highlighted',
        );
        await touch('touchEnd');
      });
    },
  },
  {
    name: 'menu: items, separators and section titles match Figma',
    run: async (page) => {
      /** @type {[string, Record<string, number | number[]>][]} */
      const cases = [
        [
          'menu',
          {
            groupLabel: 29,
            iconInset: 8 + 8,
            item: 40,
            labelInset: 8 + 8 + 28 + 4,
            quickAction: 56,
            // After quick actions, before an item, before sections.
            separators: [21, 21, 21, 21],
            // ⌘, A, all, inset from the end.
            shortcut: [14, 14, 29, 8 + 8],
            subtitleItem: 60,
          },
        ],
        [
          'menu-regular',
          {
            groupLabel: 27,
            iconInset: 8 + 8,
            item: 36,
            labelInset: 8 + 8 + 28 + 4,
            quickAction: 53,
            separators: [21, 16, 17, 17],
            shortcut: [14, 14, 29, 8 + 8],
            subtitleItem: 54,
          },
        ],
      ];

      for (const [id, expected] of cases) {
        for (const scheme of /** @type {const} */ (['light', 'dark'])) {
          await page.open(id, scheme);
          await openMenu(page);
          await page.screenshot(`${id}-${scheme}`);
          const { width, ...measured } = await measure(page);
          assert.deepEqual(measured, expected, `${id} (${scheme})`);
          assert.ok(width >= 238, `${id} (${scheme}): width ${width}`);
        }
      }
    },
  },
  {
    name: 'menu: checkbox items reserve a checkmark column in every item',
    run: async (page) => {
      await page.open('menu');
      await openMenu(page);
      const { labelInset: before } = await measure(page);

      await page.open('menu');
      await page.setControl('toggles', 'checkbox');
      await openMenu(page);
      await page.screenshot('menu-toggles');
      const { labelInset: after } = await measure(page);

      assert.equal(after - before, 28);
    },
  },
  {
    name: 'menu: compact submenus open over their trigger, regular beside it',
    run: async (page) => {
      for (const id of ['menu', 'menu-regular']) {
        await page.open(id);
        await openMenu(page);
        await page.evaluate(`${submenuTrigger}.click()`);
        await sleep(500);
        await page.screenshot(`${id}-submenu`);

        const { parent, submenu, trigger } = await page.evaluate(`(() => {
          const [parent, submenu] = [...document.querySelectorAll('[role=menu]')].map((menu) => menu.getBoundingClientRect());
          const trigger = ${submenuTrigger}.getBoundingClientRect();
          return { parent, submenu, trigger };
        })()`);

        if (id === 'menu') {
          assert.equal(Math.round(submenu.top), Math.round(trigger.bottom));
          assert.equal(Math.round(submenu.left), Math.round(parent.left));
          assert.equal(Math.round(submenu.width), Math.round(parent.width));
        } else {
          assert.equal(Math.round(submenu.left), Math.round(parent.right + 8));
          assert.equal(Math.round(submenu.top), Math.round(trigger.top - 10));
        }
      }
    },
  },
  {
    name: 'edit menu: capsule matches iOS 26 (measured)',
    run: async (page) => {
      for (const scheme of /** @type {const} */ (['light', 'dark'])) {
        await page.open('edit-menu', scheme);
        await page.setControl('open', true);
        await sleep(500);
        await page.screenshot(`edit-menu-${scheme}`);

        const measured = await page.evaluate(`(() => {
          const popup = document.querySelector('[role=menu]');
          const box = popup.getBoundingClientRect();
          const [first] = popup.querySelectorAll('[role=menuitem] > span');
          const more = popup.querySelector('[aria-haspopup]').getBoundingClientRect();
          const text = document.querySelector('component p').getBoundingClientRect();
          const [one, two] = [...popup.querySelectorAll('[role=menuitem] > span')].map((label) => label.getBoundingClientRect());
          return {
            above: Math.round(text.top - box.bottom),
            between: Math.round(two.left - one.right),
            firstLabel: Math.round(first.getBoundingClientRect().left - box.left),
            height: box.height,
            more: [more.width, more.height, Math.round(box.right - more.right)],
          };
        })()`);

        assert.deepEqual(
          measured,
          {
            above: 8,
            between: 33,
            firstLabel: 20,
            height: 42,
            more: [34, 34, 4],
          },
          scheme,
        );
      }
    },
  },
  {
    name: 'menu: closes when its trigger leaves the viewport',
    run: async (page) => {
      await page.open('menu');
      await openMenu(page);
      assert.equal(await menuCount(page), 1, 'open');

      // The demo's stage is sticky: move the trigger out instead of
      // scrolling it out.
      await page.evaluate(
        `document.querySelector(${JSON.stringify('stage button')}).style.translate = '0 -2000px'`,
      );
      await sleep(800);
      assert.equal(await menuCount(page), 0, 'closed');
    },
  },
  {
    name: 'menu: cursors follow click handlers, as on buttons',
    run: async (page) => {
      await page.open('menu');
      const trigger = await page.evaluate(
        `getComputedStyle(document.querySelector(${JSON.stringify('stage button')})).cursor`,
      );
      await openMenu(page);

      const cursors = await page.evaluate(`(() => {
        const items = [...document.querySelectorAll('[role=menu] [role^=menuitem]')];
        const cursor = (text) => getComputedStyle(items.find((element) => element.textContent.startsWith(text))).cursor;
        return {
          clickHandler: cursor('Action'),
          disabled: cursor('Disabled Action'),
          noClickHandler: cursor('Delete'),
          submenu: cursor('Submenu'),
        };
      })()`);

      assert.deepEqual(
        { trigger, ...cursors },
        {
          clickHandler: 'pointer',
          disabled: 'not-allowed',
          noClickHandler: 'not-allowed',
          submenu: 'pointer',
          trigger: 'pointer',
        },
      );

      await page.open('menu');
      await page.setControl('cursor', 'copy');
      await openMenu(page);
      assert.equal(
        await page.evaluate(
          `getComputedStyle(document.querySelector(${JSON.stringify('[role=menu] [role=menuitem]:not([data-disabled])')})).cursor`,
        ),
        'copy',
        'overridden',
      );
    },
  },
  {
    name: 'edit menu: dragging over text selects it, the menu opens after',
    run: async (page) => {
      await page.open('edit-menu');
      const { height, width, x, y } = await page.rect('p');
      /** @type {number[]} */
      const openWhileDragging = [];

      await page.drag(
        [x + 10, y + height / 4],
        [x + width - 10, y + height / 2],
        {
          onStep: async () => {
            openWhileDragging.push(await menuCount(page));
          },
        },
      );
      await sleep(500);

      const selected = await page.evaluate(
        'String(document.getSelection()).length',
      );
      assert.ok(selected > 20, `selected ${selected} characters`);
      assert.ok(
        openWhileDragging.every((count) => count === 0),
        `open while dragging: ${openWhileDragging.join(', ')}`,
      );
      assert.equal(await menuCount(page), 1, 'open after release');
    },
  },
  {
    name: 'edit menu: the selection and the menu stay where focusing clears selections (WebKit)',
    run: async (page) => {
      await page.open('edit-menu');
      // WebKit (FocusController::clearSelectionIfNeeded) clears the
      // selection when focus moves to an element outside of it.
      await page.evaluate(`(() => {
        const { focus } = HTMLElement.prototype;
        HTMLElement.prototype.focus = function (...args) {
          const selection = document.getSelection();
          if (selection.rangeCount > 0 && !this.contains(selection.getRangeAt(0).startContainer)) {
            selection.removeAllRanges();
          }
          return focus.apply(this, args);
        };
      })()`);
      const { height, width, x, y } = await page.rect('p');

      await page.drag(
        [x + 10, y + height / 4],
        [x + width - 10, y + height / 2],
      );
      await sleep(1500);
      assert.equal(await menuCount(page), 1, 'open');

      // Highlighting an item focuses it.
      const item = await page.evaluate(`(() => {
        const { height, width, x, y } = document.querySelector('[role=menuitem]').getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.mouse('mouseMoved', item[0], item[1]);
      await sleep(1000);

      const selected = await page.evaluate(
        'String(document.getSelection()).length',
      );
      assert.ok(selected > 20, `selected ${selected} characters`);
      assert.equal(await menuCount(page), 1);
    },
  },
  {
    name: 'menu: popup corners are concentric with the item selections',
    run: async (page) => {
      /** @type {[string, string][]} */
      const cases = [
        ['menu', '28px / 30px'],
        ['menu-regular', '26px / 28px'],
      ];

      for (const [id, radius] of cases) {
        await page.open(id);
        await openMenu(page);
        assert.equal(
          await page.evaluate(
            `getComputedStyle(document.querySelector(${JSON.stringify('[role=menu]')})).borderRadius`,
          ),
          radius,
          id,
        );
      }
    },
  },
  {
    name: 'menu: a compact submenu is on the glass of its parent, which fades',
    run: async (page) => {
      for (const scheme of /** @type {const} */ (['light', 'dark'])) {
        await page.open('menu', scheme);
        await openMenu(page);
        await page.evaluate(`${submenuTrigger}.click()`);
        await sleep(600);

        const state = await page.evaluate(`(() => {
          const [parent, submenu] = document.querySelectorAll('[role=menu]');
          const item = submenu.querySelector('[role=menuitem]');
          return {
            parentItem: getComputedStyle(parent.querySelector(':scope > [role=menuitem]')).opacity,
            selection: getComputedStyle(item, '::before').backgroundColor,
            submenuBackground: getComputedStyle(submenu).backgroundColor,
            trigger: getComputedStyle(${submenuTrigger}).opacity,
          };
        })()`);

        assert.deepEqual(
          state,
          {
            parentItem: '0.2',
            selection:
              scheme === 'light'
                ? 'rgba(0, 0, 0, 0.07)'
                : 'rgba(255, 255, 255, 0.07)',
            submenuBackground: 'rgba(0, 0, 0, 0)',
            trigger: '1',
          },
          scheme,
        );
      }
    },
  },
  {
    name: 'edit menu: dividers next to the highlighted action are hidden',
    run: async (page) => {
      await page.open('edit-menu');
      await page.setControl('open', true);
      await sleep(500);
      const { height, width, x, y } = await page.evaluate(`(() => {
        const { height, width, x, y } = document.querySelectorAll('[role=menu] [role=menuitem]')[2].getBoundingClientRect();
        return { height, width, x, y };
      })()`);
      await page.mouse('mouseMoved', x + width / 2, y + height / 2);
      await sleep(400);

      const dividers = await page.evaluate(
        `[...document.querySelectorAll(${JSON.stringify('[role=menu] [role=menuitem]:not([aria-haspopup])')})].slice(1).map((item) => getComputedStyle(item, '::after').opacity)`,
      );
      // Before items 2 to 6; the 3rd is highlighted.
      assert.deepEqual(dividers, ['1', '0', '0', '1', '1']);
    },
  },
  {
    name: 'edit menu: its submenu is an iPad menu',
    run: async (page) => {
      await page.open('edit-menu');
      await page.setControl('open', true);
      await sleep(500);
      await page.evaluate(
        `document.querySelector(${JSON.stringify('[role=menu] [aria-haspopup]')}).click()`,
      );
      await sleep(600);
      await page.screenshot('edit-menu-submenu');

      const submenu = await page.evaluate(`(() => {
        const submenu = document.querySelectorAll('[role=menu]')[1];
        return {
          item: submenu.querySelector('[role=menuitem]').getBoundingClientRect().height,
          radius: getComputedStyle(submenu).borderRadius,
        };
      })()`);
      assert.deepEqual(submenu, { item: 36, radius: '26px / 28px' });
    },
  },
];
