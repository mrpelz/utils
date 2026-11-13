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
    name: 'layout: a column closed slides out at its size (inert, hidden, its content not squeezed), the others taking its place; opened, it keeps its size',
    run: async (page) => {
      // (Framed: through its controls, as a user does; the column keeps
      // its key as it opens or closes, so it transitions.)
      await page.open('layout', 'light', { isFramed: true });
      /** Picks an option of the sidebar column's `open` control. */
      const setOpen = (/** @type {string} */ label) =>
        page.evaluate(
          `(() => {
          const section = [...document.querySelectorAll('.demo-config details')].find((element) => element.querySelector('summary').textContent.startsWith('Layout.Column (sidebar)'));
          const select = section.querySelector('select[name=open]');
          select.value = [...select.options].find((option) => option.textContent.trim() === ${JSON.stringify(label)}).value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        })()`,
        );
      const state = () =>
        page.evaluate(`(() => {
          const [first, second] = document.querySelectorAll(${JSON.stringify('.demo-stage [data-layout-part=root] > [data-layout-part=column]')});
          const root = first.parentElement.getBoundingClientRect();
          return {
            content: Math.round(first.querySelector(${JSON.stringify('[data-page-part=root]')}).getBoundingClientRect().width),
            hidden: getComputedStyle(first).visibility === 'hidden',
            inert: first.inert,
            second: Math.round(second.getBoundingClientRect().x - root.x),
            transitioning: first.parentElement.hasAttribute('data-transitioning'),
          };
        })()`);
      assert.deepEqual(await state(), {
        content: 280,
        hidden: false,
        inert: false,
        second: 280,
        transitioning: false,
      });

      const seconds = page.sample(
        `Math.round(document.querySelectorAll(${JSON.stringify('.demo-stage [data-layout-part=root] > [data-layout-part=column]')})[1].getBoundingClientRect().x)`,
        600,
      );
      await setOpen('false');
      /** @type {number[]} */
      const moved = [...new Set(await seconds)];
      assert.ok(moved.length > 4, `transitioned: ${moved.join(', ')}`);
      await sleep(200);
      assert.deepEqual(await state(), {
        content: 280,
        hidden: true,
        inert: true,
        second: 0,
        transitioning: false,
      });

      await setOpen('true');
      await sleep(600);
      assert.deepEqual(await state(), {
        content: 280,
        hidden: false,
        inert: false,
        second: 280,
        transitioning: false,
      });
    },
  },
  {
    name: 'layout: a floating column closed slides off its edge, the content’s inset following it (transitioned), and back',
    run: async (page) => {
      await page.open('sidebar-composition-hiding');
      const state = () =>
        page.evaluate(`(() => {
          const [side, content] = document.querySelectorAll(${JSON.stringify('[data-layout-part=root] > [data-layout-part=column]')});
          const root = side.parentElement.getBoundingClientRect();
          return {
            inert: side.inert,
            inset: getComputedStyle(content).getPropertyValue('--uikit-layout-inset-start'),
            show: Boolean(document.querySelector(${JSON.stringify('[aria-label="Show Sidebar"]')})),
            x: Math.round(side.getBoundingClientRect().right - root.left),
          };
        })()`);
      assert.deepEqual(await state(), {
        inert: false,
        inset: '300px',
        show: false,
        x: 300,
      });

      const hide = await page.rect('[aria-label="Hide Sidebar"]');
      const insets = page.sample(
        `parseFloat(getComputedStyle(document.querySelectorAll(${JSON.stringify('[data-layout-part=root] > [data-layout-part=column]')})[1]).getPropertyValue('--uikit-layout-inset-start'))`,
        600,
      );
      await page.click([hide.x + hide.width / 2, hide.y + hide.height / 2]);
      /** @type {number[]} */
      const sampled = await insets;
      const between = sampled.filter((inset) => inset > 1 && inset < 299);
      assert.ok(between.length > 3, `in between: ${sampled.join(', ')}`);
      await sleep(200);
      assert.deepEqual(await state(), {
        inert: true,
        inset: '0px',
        show: true,
        x: 0,
      });

      const show = await page.rect('[aria-label="Show Sidebar"]');
      await page.click([show.x + show.width / 2, show.y + show.height / 2]);
      await sleep(600);
      assert.deepEqual(await state(), {
        inert: false,
        inset: '300px',
        show: false,
        x: 300,
      });
      assert.match(await page.log(), /sidebar: hidden\nsidebar: shown/u);
    },
  },
  {
    name: 'sidebar: floating over the content, its page clear of it as it is resized; rerendered by its controls',
    run: async (page) => {
      await page.open('sidebar');
      await sleep(300);
      const layout = () =>
        page.evaluate(`(() => {
          const box = (element) => { const { left, top, width } = element.getBoundingClientRect(); return [left, top, width].map(Math.round); };
          const [sidebar, content] = document.querySelectorAll('[data-layout-part=column]');
          const pageRoot = content.querySelector('[data-page-part=root]');
          return {
            content: box(content),
            inset: getComputedStyle(pageRoot).paddingInlineStart,
            panel: [...box(sidebar.querySelector('[data-sidebar-part=root]')), getComputedStyle(sidebar.querySelector('[data-sidebar-part=root]')).borderRadius],
            sidebar: [...box(sidebar), getComputedStyle(sidebar).position],
            title: Math.round(content.querySelector('[data-header-part=large-title]').getBoundingClientRect().left),
          };
        })()`);
      assert.deepEqual(await layout(), {
        content: [0, 0, 1400],
        inset: '336px',
        // (Below the top safe area inset: raw, none; in a tablet's frame,
        // 24px.)
        panel: [8, 0, 320, '20px'],
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
      await page.setState(2, { floating: false });
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
    name: 'sidebar: its list (capsule rows, selected on a fill, emphasized in the tint; indented by level)',
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
    name: 'sidebar (compact): its trigger’s glass adapts to what is behind it (the picture: dim, in either scheme; a white page: bright)',
    run: async (page) => {
      // (Colors computed: the build's CSS may write them otherwise.)
      const fill = () =>
        page.evaluate(`(() => {
          const color = (value) => { const probe = document.createElement('span'); probe.style.color = value; document.body.append(probe); const computed = getComputedStyle(probe).color; probe.remove(); return computed; };
          return color(getComputedStyle(document.querySelector(${JSON.stringify('[aria-label="Show Sidebar"]')})).getPropertyValue('--uikit-glass-fill'));
        })()`);
      for (const scheme of /** @type {const} */ (['light', 'dark'])) {
        await page.open('sidebar-compact', scheme);
        await sleep(300);
        assert.equal(await fill(), 'rgba(0, 0, 0, 0.2)', scheme);
      }
      await page.open('sidebar-compact', 'light', {
        state: [{ $rest: true, background: 'none' }],
      });
      await sleep(300);
      assert.equal(await fill(), 'rgba(255, 255, 255, 0.3)', 'white page');
    },
  },
  {
    name: 'glass: opaque with reduced transparency or increased contrast',
    run: async (page) => {
      for (const [name, value] of /** @type {const} */ ([
        ['prefers-reduced-transparency', 'reduce'],
        ['prefers-contrast', 'more'],
      ])) {
        await page.open('sidebar-compact', 'light');
        await page.browser.send('Emulation.setEmulatedMedia', {
          features: [
            { name: 'prefers-color-scheme', value: 'light' },
            { name, value },
          ],
        });
        await sleep(300);
        const fills = await page.evaluate(`(() => {
          const style = getComputedStyle(document.documentElement);
          // (Colors computed: the build's CSS may write them otherwise.)
          const color = (value) => { const probe = document.createElement('span'); probe.style.color = value; document.body.append(probe); const computed = getComputedStyle(probe).color; probe.remove(); return computed; };
          return ['--glass-ui-bright-fill', '--glass-ui-background-dim-fill', '--glass-ui-medium-light-background'].map((token) => color(style.getPropertyValue(token)));
        })()`);
        assert.deepEqual(
          fills,
          ['rgb(247, 247, 247)', 'rgb(28, 28, 30)', 'rgb(246, 246, 246)'],
          name,
        );
      }
      await page.browser.send('Emulation.setEmulatedMedia', { features: [] });
    },
  },
  {
    name: 'sidebar: its search field rings on keyboard focus only; its clear button only while focused and filled',
    run: async (page) => {
      await page.open('sidebar');
      await sleep(300);
      const state = () =>
        page.evaluate(`(() => {
          // (Its frame: the field's ring, around its clear button.)
          const search = document.querySelector(${JSON.stringify('[data-sidebar-part=root] [data-text-field-part=frame]')});
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

      // By keyboard (a key pressed last, not a pointer, see
      // `isKeyboardFocus`).
      await page.evaluate('document.activeElement.blur()');
      await page.key('Shift');
      await page.evaluate(
        `document.querySelector(${JSON.stringify('input[type=search]')}).focus()`,
      );
      await sleep(200);
      const [ringed] = await state();
      assert.equal(ringed, true, 'keyboard');
    },
  },
];
