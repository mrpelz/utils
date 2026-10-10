/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

/**
 * The layout's columns' widths.
 *
 * @param {Page} page
 * @returns {Promise<number[]>}
 */
const widths = (page) =>
  page.evaluate(
    `[...document.querySelectorAll(${JSON.stringify('[data-layout-part=column]')})].map((column) => Math.round(column.getBoundingClientRect().width))`,
  );

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'layout: sized columns and a flexible one fill it; dividers resize them (pointer, keys), within their limits',
    run: async (page) => {
      await page.open('layout');
      const total = await page.evaluate(
        `Math.round(document.querySelector(${JSON.stringify('[data-layout-part=root]')}).getBoundingClientRect().width)`,
      );
      const [sidebar, list, detail] = await widths(page);
      assert.deepEqual([sidebar, list], [280, 320]);
      assert.equal(detail, total - 280 - 320, 'the detail takes the rest');

      const sidebarWidth = async () => {
        const [width] = await widths(page);
        return width;
      };
      /** Drags the sidebar's divider by `distance`. */
      const drag = async (/** @type {number} */ distance) => {
        const divider = await page.rect('[data-layout-part=divider]');
        const from = /** @type {[number, number]} */ ([
          divider.x + divider.width / 2,
          divider.y + divider.height / 2,
        ]);
        await page.drag(from, [from[0] + distance, from[1]]);
        await sleep(100);
      };

      await drag(60);
      assert.equal(await sidebarWidth(), 340, 'dragged');
      assert.match(await page.log(), /sidebar size: 340/u);

      // Not below its minimum (240).
      await drag(-300);
      assert.equal(await sidebarWidth(), 240, 'its minimum');

      // Keys: on by 10px, Home: its minimum.
      await page.evaluate(
        `document.querySelector(${JSON.stringify('[data-layout-part=divider]')}).focus()`,
      );
      await page.key('ArrowRight');
      assert.equal(await sidebarWidth(), 250, 'a key');
      await page.key('Home');
      assert.equal(await sidebarWidth(), 240, 'Home');
      assert.equal(
        await page.evaluate(
          `document.querySelector(${JSON.stringify('[data-layout-part=divider]')}).getAttribute('aria-valuenow')`,
        ),
        '240',
      );
    },
  },
  {
    name: 'page: a scroll container on the page background (grouped, plain)',
    run: async (page) => {
      await page.open('page');
      const style = () =>
        page.evaluate(`(() => {
          const style = getComputedStyle(document.querySelector(${JSON.stringify('[data-page-part=root]')}));
          return [style.overflowY, style.backgroundColor];
        })()`);
      assert.deepEqual(await style(), ['auto', 'rgb(242, 242, 247)']);
      await page.setState(1, { background: 'plain' });
      assert.deepEqual(await style(), ['auto', 'rgb(255, 255, 255)']);
    },
  },
  {
    name: 'sidebar: floating over the content (on the layout’s background), its page clear of it as it is resized; rerendered by its controls',
    run: async (page) => {
      await page.open('sidebar');
      await sleep(300);
      const layout = () =>
        page.evaluate(`(() => {
          const box = (element) => { const { left, top, width } = element.getBoundingClientRect(); return [left, top, width].map(Math.round); };
          const [sidebar, content] = document.querySelectorAll('[data-layout-part=column]');
          const pageRoot = content.querySelector('[data-page-part=root]');
          return {
            background: box(document.querySelector('[data-layout-part=root] > :not([data-layout-part=column])')),
            content: box(content),
            inset: getComputedStyle(pageRoot).paddingInlineStart,
            panel: [...box(sidebar.querySelector('[data-sidebar-part=root]')), getComputedStyle(sidebar.querySelector('[data-sidebar-part=root]')).borderRadius],
            sidebar: [...box(sidebar), getComputedStyle(sidebar).position],
            title: Math.round(content.querySelector('[data-header-part=large-title]').getBoundingClientRect().left),
          };
        })()`);
      assert.deepEqual(await layout(), {
        background: [0, 0, 1400],
        content: [0, 0, 1400],
        inset: '336px',
        panel: [8, 8, 320, '20px'],
        sidebar: [0, 0, 336, 'absolute'],
        // (Its text 16px in.)
        title: 336,
      });

      // Resized by its divider: the page's inset follows.
      const divider = await page.rect('[data-layout-part=divider]');
      const x = divider.x + divider.width / 2;
      const y = divider.y + 200;
      await page.mouse('mousePressed', x, y);
      await page.mouse('mouseMoved', x + 22, y);
      await page.mouse('mouseMoved', x + 44, y);
      await page.mouse('mouseReleased', x + 44, y);
      await sleep(300);
      const resized = await layout();
      assert.deepEqual(
        [resized.sidebar[2], resized.inset],
        [380, '380px'],
        'resized',
      );

      // Its controls rerender it: its column's size, not floating.
      await page.setState(2, { defaultSize: 280 });
      await sleep(300);
      const sized = await layout();
      assert.deepEqual([sized.sidebar[2], sized.inset], [280, '280px']);
      await page.setState(1, { floating: false });
      await sleep(300);
      const split = await layout();
      assert.deepEqual(
        [split.sidebar[3], split.content[0], split.inset],
        ['relative', 280, '0px'],
        'not floating',
      );
    },
  },
  {
    name: 'sidebar: its list as Figma’s (capsule rows, selected on a fill, emphasized in the tint; indented by level)',
    run: async (page) => {
      await page.open('sidebar');
      await sleep(300);
      const sidebar = await page.evaluate(`(() => {
        const rows = [...document.querySelectorAll('[data-sidebar-part=root] [data-list-part=item]')];
        const row = (text) => rows.find((item) => item.querySelector('[data-list-part=title]').textContent === text);
        const titleLeft = (text) => row(text).querySelector('[data-list-part=title]').getBoundingClientRect().left;
        const selected = row('Inbox');
        const style = getComputedStyle(selected);
        const box = selected.getBoundingClientRect();
        const title = getComputedStyle(selected.querySelector('[data-list-part=title]'));
        const symbol = selected.querySelector('[data-list-part=image]');
        const detail = selected.querySelector('[data-list-part=detail]').getBoundingClientRect();
        return {
          detail: Math.round(box.right - detail.right),
          height: Math.round(box.height),
          indent: [titleLeft('Design') - titleLeft('Projects'), titleLeft('Drafts') - titleLeft('Design')].map(Math.round),
          radius: [style.borderTopLeftRadius, getComputedStyle(row('Recents')).borderBottomRightRadius],
          selected: [selected.getAttribute('aria-current'), style.backgroundColor, title.color, title.fontVariationSettings, getComputedStyle(symbol).color],
          symbol: [Math.round(symbol.getBoundingClientRect().left - box.left), Math.round(symbol.getBoundingClientRect().width), getComputedStyle(row('Recents').querySelector('[data-list-part=image]')).color],
        };
      })()`);
      assert.deepEqual(sidebar, {
        detail: 16,
        height: 44,
        indent: [20, 20],
        radius: ['100px', '100px'],
        selected: [
          'true',
          'rgba(0, 0, 0, 0.07)',
          'rgb(0, 136, 255)',
          '"wght" 590',
          'rgb(0, 136, 255)',
        ],
        symbol: [10, 34, 'rgb(0, 0, 0)'],
      });

      // A row selects (the content shows it).
      const center = await page.evaluate(`(() => {
        const title = [...document.querySelectorAll('[data-list-part=title]')].find((element) => element.textContent === 'Trash');
        title.scrollIntoView({ block: 'center' });
        const { height, width, x, y } = title.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
      })()`);
      await page.click(/** @type {[number, number]} */ (center));
      await sleep(200);
      assert.match(await page.log(), /select: Trash/u);
    },
  },
  {
    name: 'layout (compact), sidebar (compact): a drawer swiped in from its edge (either side), closed by choosing a row; floating, without a background of its own',
    run: async (page) => {
      for (const [id, choice, background] of /** @type {const} */ ([
        ['layout-compact', 'Drafts', 'rgb(255, 255, 255)'],
        ['sidebar-compact', 'Favorites', 'rgba(0, 0, 0, 0)'],
      ])) {
        for (const drawer of ['inline-start', 'inline-end']) {
          await page.open(id, 'light', {
            state: [null, null, null, { $rest: true, drawer }],
          });
          await sleep(300);
          const box = () =>
            page.evaluate(`(() => {
              const column = document.querySelector('[data-drawer]');
              const root = column.parentElement.getBoundingClientRect();
              const { left, right } = column.getBoundingClientRect();
              return [Math.round(left - root.left), Math.round(root.right - right)];
            })()`);
          const [left, right] = await box();
          // Hidden past its side.
          assert.ok(
            drawer === 'inline-start'
              ? right > 0 && left <= -250
              : left > 0 && right <= -250,
            `${id} ${drawer} closed: ${String(left)}, ${String(right)}`,
          );

          // Swiped in from its edge.
          const edge = await page.rect('[data-layout-part=drawer-edge]');
          const y = edge.y + edge.height / 2;
          const x = edge.x + edge.width / 2;
          const toward = drawer === 'inline-start' ? 1 : -1;
          await page.mouse('mousePressed', x, y);
          for (let step = 1; step <= 6; step += 1) {
            await page.mouse('mouseMoved', x + toward * step * 40, y);
            await sleep(30);
          }
          await page.mouse('mouseReleased', x + toward * 240, y);
          await sleep(500);
          const opened = await box();
          assert.equal(
            opened[drawer === 'inline-start' ? 0 : 1],
            0,
            `${id} ${drawer} open`,
          );
          assert.match(await page.log(), /sidebar open: true/u);
          // Its background (floating: none, the sidebar's glass instead).
          const own = await page.evaluate(
            `getComputedStyle(document.querySelector(${JSON.stringify('[data-drawer]')})).backgroundColor`,
          );
          assert.equal(own, background, id);

          // Choosing a row closes it.
          const center = await page.evaluate(`(() => {
            const title = [...document.querySelectorAll('[data-drawer] [data-list-part=title]')].find((element) => element.textContent === ${JSON.stringify(choice)});
            const { height, width, x, y } = title.getBoundingClientRect();
            return [x + width / 2, y + height / 2];
          })()`);
          await page.click(/** @type {[number, number]} */ (center));
          await sleep(500);
          const closed = await box();
          assert.ok(
            Math.min(...closed) <= -250,
            `${id} ${drawer} closed again`,
          );
        }
      }
    },
  },
  {
    name: 'sidebar (compact): its trigger in the bar over the picture is glass floating over it (background-bright, background-dim), inherited from the bar',
    run: async (page) => {
      for (const [scheme, fill] of /** @type {const} */ ([
        ['light', 'rgb(255 255 255 / 30%)'],
        ['dark', 'rgb(0 0 0 / 20%)'],
      ])) {
        await page.open('sidebar-compact', scheme);
        await sleep(300);
        const glass = await page.evaluate(
          `getComputedStyle(document.querySelector(${JSON.stringify('[aria-label="Show Sidebar"]')})).getPropertyValue('--styled-glass-fill').trim()`,
        );
        assert.equal(glass, fill, scheme);
      }
    },
  },
  {
    name: 'layout (compact): an open drawer closes on a tap anywhere outside of it (also over a resizable column)',
    run: async (page) => {
      await page.open('layout-compact', 'light', {
        state: [{ columns: 3 }],
      });
      await sleep(300);
      const button = await page.rect('[aria-label="Show Sidebar"]');
      await page.click([
        button.x + button.width / 2,
        button.y + button.height / 2,
      ]);
      await sleep(500);
      // Over the list column (resizable: raised over the next one).
      const point = await page.evaluate(`(() => {
        const { right, top } = document.querySelector(${JSON.stringify('[data-layout-part=column][data-resizable]:not([data-drawer])')}).getBoundingClientRect();
        return [right - 40, top + 300];
      })()`);
      await page.click(/** @type {[number, number]} */ (point));
      await sleep(500);
      assert.match(await page.log(), /sidebar open: false/u);

      // Over a page's (sticky) bar.
      await page.click([
        button.x + button.width / 2,
        button.y + button.height / 2,
      ]);
      await sleep(500);
      await page.click([point[0], button.y + button.height / 2]);
      await sleep(500);
      const closed = await page.evaluate(
        `document.querySelector(${JSON.stringify('[data-drawer]')}).hasAttribute('data-open')`,
      );
      assert.equal(closed, false, 'over the bar');
    },
  },
  {
    name: 'sidebar: its search field rings on keyboard focus only; its clear button only while focused and filled',
    run: async (page) => {
      await page.open('sidebar');
      await sleep(300);
      const state = () =>
        page.evaluate(`(() => {
          const search = document.querySelector(${JSON.stringify('[data-text-field-part=search]')});
          return [search.hasAttribute('data-keyboard-focus'), getComputedStyle(search.querySelector(${JSON.stringify('[data-text-field-part=clear]')})).visibility];
        })()`);
      assert.deepEqual(await state(), [false, 'hidden'], 'at rest');

      // Pressed, then filled.
      const field = await page.rect('input[type=search]');
      await page.click([field.x + 20, field.y + field.height / 2]);
      await page.evaluate(`(() => {
        const input = document.querySelector('input[type=search]');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Design');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()`);
      await sleep(300);
      assert.deepEqual(await state(), [false, 'visible'], 'pressed, filled');

      // By keyboard (focused without a press).
      await page.evaluate(`(() => {
        document.activeElement.blur();
        document.querySelector('input[type=search]').focus();
      })()`);
      await sleep(200);
      const [ringed] = await state();
      assert.equal(ringed, true, 'keyboard');
    },
  },
];
