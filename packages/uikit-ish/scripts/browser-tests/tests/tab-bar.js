/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep, withTouch } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

const PRIMARY = 'tab-bar';
const SECONDARY = 'tab-bar-search';

/**
 * Centers of the current section's tabs.
 *
 * @param {Page} page
 * @returns {Promise<[number, number][]>}
 */
const tabCenters = (page) =>
  page.evaluate(`[...${page.section}.querySelectorAll('[role=tab]')].map((tab) => {
    const { height, width, x, y } = tab.getBoundingClientRect();
    return [x + width / 2, y + height / 2];
  })`);

/**
 * Selection fill opacity and left position per group, per animation frame.
 *
 * @param {Page} page
 * @param {() => Promise<void>} action
 * @returns {Promise<{ left: number, opacity: number }[][]>}
 */
const sampleSelections = async (page, action) => {
  const sampling =
    page.sample(`[...${page.section}.querySelectorAll('[role=tablist] > div')].map((group) => {
    const indicator = group.querySelector('[role=presentation]');
    return {
      left: Math.round(parseFloat(getComputedStyle(indicator).left)),
      opacity: +getComputedStyle(indicator, '::before').opacity,
    };
  })`);
  await action();
  return sampling;
};

/**
 * The groups of a (collapsed) bar: whether they show, where (relative to the
 * bar), which of their tabs show, and their selection.
 *
 * @param {Page} page
 * @returns {Promise<{ left: number, right: number, selection: number, selectionWidth: number, tabs: boolean[], visible: boolean, width: number }[]>}
 */
const collapsedState = (page) =>
  page.evaluate(`(() => {
    const list = ${page.section}.querySelector('[role=tablist]');
    const bar = list.getBoundingClientRect();
    return [...list.querySelectorAll(':scope > div')].map((group) => {
      // Without the spacing of side by side groups (borders).
      const rect = group.querySelector('[data-tab-bar-part=tabs]').getBoundingClientRect();
      const style = getComputedStyle(group);
      const indicator = group.querySelector('[role=presentation]');
      return {
        left: Math.round(rect.left - bar.left),
        right: Math.round(bar.right - rect.right),
        selection: +getComputedStyle(indicator, '::before').opacity,
        selectionWidth: indicator.getBoundingClientRect().width,
        tabs: [...group.querySelectorAll('[role=tab]')].map((tab) => getComputedStyle(tab).visibility === 'visible' && tab.getBoundingClientRect().width > 1),
        visible: style.visibility === 'visible' && +style.opacity > 0.5,
        width: Math.round(rect.width),
      };
    });
  })()`);

/** @param {number[]} values */
const isMonotonic = (values, direction = 1) =>
  values.every(
    (value, index) =>
      index === 0 ||
      (value - (values[index - 1] ?? value)) * direction >= -0.01,
  );

/**
 * Opens a tab bar demo, its bar sized by its content in the page's center
 * (as in a phone's width; raw, the page is a centering grid).
 *
 * @param {Page} page
 * @param {Parameters<Page['open']>} args
 */
const openBar = async (page, ...args) => {
  await page.open(...args);
  await page.evaluate(
    `document.body.style.cssText = ${JSON.stringify('display: grid; min-height: 100vh; margin: 0; place-items: center')}`,
  );
  await sleep(300);
};

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'tab bar: tab widths match Figma in a 402px wide bar',
    run: async (page) => {
      /** @type {[string, number, number[], number[]][]} */
      const cases = [
        [PRIMARY, 2, [194], [102, 102]],
        [PRIMARY, 3, [286], [102, 102, 102]],
        [PRIMARY, 4, [338], [90, 90, 90, 90]],
        [PRIMARY, 5, [338], [72, 72, 72, 72, 72]],
        [SECONDARY, 2, [194, 54], [102, 102, 54]],
        [SECONDARY, 3, [268, 54], [96, 96, 96, 54]],
        [SECONDARY, 4, [268, 54], [72.5, 72.5, 72.5, 72.5, 54]],
      ];

      for (const [id, tabs, groups, widths] of cases) {
        await openBar(page, id);
        await page.setState(0, { tabs });
        await page.evaluate(
          `${page.section}.querySelector('[role=tablist]').style.width = '402px'`,
        );
        await sleep(300);

        const measured = await page.evaluate(`(() => {
          const list = ${page.section}.querySelector('[role=tablist]');
          const round = (value) => Math.round(value * 10) / 10;
          return {
            groups: [...list.children].filter((child) => child.querySelector('[role=tab]')).map((group) => round(group.getBoundingClientRect().width)),
            widths: [...list.querySelectorAll('[role=tab]')].map((tab) => round(tab.getBoundingClientRect().width)),
          };
        })()`);

        assert.deepEqual(measured, { groups, widths }, `${id}, ${tabs} tabs`);
      }
    },
  },
  {
    name: 'tab bar: lens is placed at the tab size and follows the pointer',
    run: async (page) => {
      await openBar(page, SECONDARY);
      const [first, second] = await tabCenters(page);
      if (!first || !second) throw new Error('missing tabs');

      const { width } = await page.rect('[role=tab]', 1);
      await page.mouse('mousePressed', ...second);
      const widths = await page.sample(
        `parseFloat(getComputedStyle(${page.section}.querySelector('[role=tablist]').lastElementChild).width)`,
        100,
      );
      await page.mouse('mouseReleased', ...second);
      await sleep(500);

      // The pressed group grows (iPhone: 1.05), and the lens with it.
      assert.ok(
        widths.every((lensWidth) => Math.abs(lensWidth - width * 1.05) < 0.5),
        `lens widths ${widths.join(', ')} should all be ${width * 1.05}`,
      );

      /** @type {number[]} */
      const offsets = [];
      await page.drag(first, second, {
        onStep: async (x) => {
          offsets.push(
            await page.evaluate(`(() => {
              const lens = ${page.section}.querySelector('[role=tablist]').lastElementChild.getBoundingClientRect();
              return lens.x + lens.width / 2 - ${x};
            })()`),
          );
        },
      });

      assert.ok(
        offsets.every((offset) => Math.abs(offset) <= 1),
        `lens center - pointer: ${offsets.map((offset) => Math.round(offset)).join(', ')}`,
      );
    },
  },
  {
    name: 'tab bar: selection slides within a group',
    run: async (page) => {
      await openBar(page, PRIMARY);
      const [, second] = await tabCenters(page);
      if (!second) throw new Error('missing tabs');

      const samples = await sampleSelections(page, () => page.click(second));
      const lefts = samples.map(([primary]) => primary?.left ?? 0);

      assert.ok(isMonotonic(lefts), `lefts ${lefts.join(', ')}`);
      assert.ok((lefts.at(-1) ?? 0) > (lefts[0] ?? 0), 'selection moved');
    },
  },
  {
    name: 'tab bar: selection fades in place between groups',
    run: async (page) => {
      await openBar(page, SECONDARY);
      const centers = await tabCenters(page);
      const [first, , third] = centers;
      const secondary = centers.at(-1);
      if (!first || !third || !secondary) throw new Error('missing tabs');

      await page.click(third);
      await sleep(500);
      await page.click(secondary);
      await sleep(500);

      const samples = await sampleSelections(page, () => page.click(first));
      const primary = samples.map(([group]) => group);
      const other = samples.map(([, group]) => group);
      const settledLeft = primary.at(-1)?.left;

      assert.ok(
        primary.every(
          (group) => group?.opacity === 0 || group?.left === settledLeft,
        ),
        `primary selection moved while visible: ${JSON.stringify(primary)}`,
      );
      assert.ok(
        isMonotonic(primary.map((group) => group?.opacity ?? 0)),
        'primary selection fades in',
      );
      assert.ok(
        isMonotonic(
          other.map((group) => group?.opacity ?? 0),
          -1,
        ),
        'secondary selection fades out',
      );
    },
  },
  {
    name: 'tab bar: the lens settles into the selection on a tab of another size',
    run: async (page) => {
      await openBar(page, 'tab-bar-mixed');
      // The third tab without a label: a circle, narrower than the others.

      const centers = await tabCenters(page);
      const first = centers[0];
      const last = centers.at(-1);
      if (!first || !last) throw new Error('missing tabs');

      const target = await page.evaluate(`(() => {
        const tabs = [...${page.section}.querySelectorAll('[role=tab]')];
        const group = tabs.at(-1).closest('[role=tablist] > div').getBoundingClientRect();
        return Math.round(tabs.at(-1).getBoundingClientRect().left - group.left);
      })()`);

      // Dragged across (the hidden selection resizing on the way), then
      // released: the selection fades in on the target, not travelling there.
      await page.mouse('mousePressed', ...first);
      for (let step = 1; step <= 10; step += 1) {
        await page.mouse(
          'mouseMoved',
          first[0] + ((last[0] - first[0]) * step) / 10,
          first[1],
        );
        await sleep(30);
      }
      await sleep(400);

      const samples = await sampleSelections(page, () =>
        page.mouse('mouseReleased', ...last),
      );
      const visible = samples.flatMap(([group]) =>
        group && group.opacity > 0.05 ? group.left : [],
      );

      // Released (unscaled) on the tab's center, a few pixels from where its
      // grown group shows it: the selection settles from there, but doesn't
      // travel from the previous tab.
      assert.ok(visible.length > 0, 'the selection shows');
      assert.ok(
        visible.every((left) => Math.abs(left - target) <= 5),
        `selection lefts ${visible.join(', ')}, target ${target}`,
      );
    },
  },
  {
    name: 'tab bar: the group under the lens grows (iOS: iPhone 1.05, iPad 1.065)',
    run: async (page) => {
      for (const [id, scale] of /** @type {const} */ ([
        [PRIMARY, 1.05],
        ['tab-bar-regular', 1.065],
      ])) {
        await openBar(page, id);

        /** @returns {Promise<{ glass: number, icon: number, scale: string }>} */
        const measure = () =>
          page.evaluate(`(() => {
            const group = ${page.section}.querySelector('[role=tab]').closest('[role=tablist] > div');
            const glass = group.firstElementChild;
            return {
              glass: glass.getBoundingClientRect().width,
              icon: group.querySelector('[data-tab-bar-part=icon] svg').getBoundingClientRect().width,
              scale: getComputedStyle(glass).scale,
            };
          })()`);

        const rest = await measure();
        const centers = await tabCenters(page);
        const center = centers[1];
        if (!center) throw new Error('missing tab');

        await page.mouse('mousePressed', ...center);
        await sleep(500);
        const pressed = await measure();
        await page.mouse('mouseReleased', ...center);
        await sleep(500);
        const released = await measure();

        assert.equal(rest.scale, 'none', `${id}: nothing scaled at rest`);
        assert.equal(
          Math.round((pressed.glass / rest.glass) * 1000) / 1000,
          scale,
          id,
        );
        assert.equal(
          Math.round((pressed.icon / rest.icon) * 1000) / 1000,
          scale,
          id,
        );
        assert.equal(released.scale, 'none', `${id}: unscaled after release`);
      }
    },
  },
  {
    name: 'tab bar: collapsed, the active tab remains in a 48pt circle (iOS), other groups go',
    run: async (page) => {
      await openBar(page, SECONDARY);

      /** @returns {Promise<{ center: number, glass: number[][], left: number, right: number, size: string, tabs: number[][], visible: boolean[] }>} */
      const measure = () =>
        page.evaluate(`(() => {
          const list = ${page.section}.querySelector('[role=tablist]');
          const box = list.getBoundingClientRect();
          const groups = [...list.querySelectorAll(':scope > div')];
          const glass = groups.map((group) => group.firstElementChild.getBoundingClientRect());
          return {
            center: Math.round(glass[0].left + glass[0].width / 2 - box.left - box.width / 2),
            glass: glass.map((rect) => [Math.round(rect.width), Math.round(rect.height), Math.round(rect.top + rect.height / 2 - box.top)]),
            left: Math.round(glass[0].left - box.left),
            right: Math.round(box.right - glass[0].right),
            visible: groups.map((group) => getComputedStyle(group).visibility === 'visible'),
            size: Math.round(box.width) + 'x' + Math.round(box.height),
            tabs: groups.map((group) => [...group.querySelectorAll('[role=tab]')].map((tab) => Math.round(tab.getBoundingClientRect().width))),
          };
        })()`);

      const expanded = await measure();
      await page.setState(2, { collapsed: true });
      await sleep(500);
      const collapsed = await measure();

      // 62pt → 48pt high around the same center, 7pt further in, at the
      // start; the other group goes; the bar keeps its size.
      assert.deepEqual(collapsed.glass[0], [48, 48, expanded.glass[0]?.[2]]);
      assert.deepEqual(collapsed.visible, [true, false]);
      assert.equal(collapsed.size, expanded.size);
      assert.equal(collapsed.left, expanded.left + 7);
      assert.deepEqual(collapsed.tabs, [[40, 0, 0], [0]]);

      // `collapsedPosition`: collapsing into the center moves steadily, also
      // as the other group (a circle) goes.
      await page.setState(2, { collapsed: false });
      await page.setState(2, { collapsedPosition: 'center' });
      await sleep(500);
      const centering = page.sample(
        `(() => { const glass = ${page.section}.querySelector('[role=tablist] > div').firstElementChild.getBoundingClientRect(); return glass.left + glass.width / 2; })()`,
      );
      await page.setState(2, { collapsed: true });
      /** @type {number[]} */
      const groupCenters = await centering;
      assert.ok(
        isMonotonic(groupCenters),
        `group centers ${groupCenters.map((value) => Math.round(value)).join(', ')}`,
      );
      assert.ok(
        groupCenters.every(
          (value, index) =>
            index === 0 ||
            Math.abs(value - (groupCenters[index - 1] ?? value)) < 12,
        ),
        `group centers ${groupCenters.map((value) => Math.round(value)).join(', ')}`,
      );
      await sleep(300);
      const center = await measure();
      assert.ok(Math.abs(center.center) <= 1, `center offset ${center.center}`);
      await page.setState(2, { collapsedPosition: 'inline-end' });
      await sleep(500);
      const end = await measure();
      assert.equal(end.right, collapsed.left);
      await page.setState(2, { collapsedPosition: 'inline-start' });
      await sleep(500);

      // Expanding again: the selection fades in on the active tab, the glass
      // grows without jumps.
      const expanding = page.sample(`(() => {
        const group = ${page.section}.querySelector('[role=tablist] > div');
        const indicator = group.querySelector('[role=presentation]');
        const tab = group.querySelector('[role=tab][data-active]').getBoundingClientRect();
        return {
          glass: group.firstElementChild.getBoundingClientRect().width,
          offset: Math.abs(indicator.getBoundingClientRect().left - tab.left),
          opacity: +getComputedStyle(indicator, '::before').opacity,
          // The animations' clock (in 60 Hz frames, also when frames take
          // longer: performance.now() would undercount skipped ones).
          time: document.timeline.currentTime,
        };
      })()`);
      await page.setState(2, { collapsed: false });
      /** @type {{ glass: number, offset: number, opacity: number, time: number }[]} */
      const frames = await expanding;
      await sleep(300);

      assert.ok(
        isMonotonic(frames.map(({ opacity }) => opacity)),
        'the selection fades in',
      );
      assert.ok(
        frames.every(({ offset }) => offset < 1),
        'the selection stays on the active tab',
      );
      // Per 60 Hz frame (at any frame rate).
      assert.ok(
        frames.every(({ glass, time }, index) => {
          const previous = frames[index - 1];
          if (!previous) return true;
          const perFrame =
            (1000 / 60 / (time - previous.time || 1000 / 60)) *
            (glass - previous.glass);
          return perFrame < 40;
        }),
        `glass widths ${frames.map(({ glass }) => Math.round(glass)).join(', ')}`,
      );
      const settled = await measure();
      assert.equal(settled.size, expanded.size);
      await page.setState(2, { collapsed: true });
      await sleep(500);

      // The lens skips the hidden tabs: released just past the first tab,
      // where they are (without width), the first one stays active.
      const centers = await tabCenters(page);
      const first = centers[0];
      if (!first) throw new Error('missing tab');
      await page.drag(first, [first[0] + 25, first[1]], { steps: 5 });
      await sleep(400);

      const active = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=tab]')].findIndex((tab) => tab.hasAttribute('data-active'))`,
      );
      assert.equal(active, 0);
    },
  },
  {
    name: 'tab bar: collapsed content: a label-only tab is a capsule, labels never ellipsize',
    run: async (page) => {
      await openBar(page, SECONDARY);

      /** @returns {Promise<string>} */
      const shown = () =>
        page.evaluate(`(() => {
          const tab = ${page.section}.querySelector('[role=tab]');
          const label = tab.querySelector('[data-tab-bar-part=label]');
          const icon = tab.querySelector('[data-tab-bar-part=icon]');
          const { height, width } = tab.getBoundingClientRect();
          // Labels shrink away (and fade), symbols are left out.
          const visible = (element) => element && getComputedStyle(element).display !== 'none' && element.getBoundingClientRect().width > 0 && +getComputedStyle(element).opacity > 0;
          return [Math.round(width) + 'x' + Math.round(height), visible(label) ? 'label' : '', visible(icon) ? 'symbol' : ''].filter(Boolean).join(' ');
        })()`);
      // A capsule of its label (and symbol, a gap between them) and padding:
      // by their widths, as fonts render (e.g. SF Pro's differ on Linux).
      /** @returns {Promise<string>} */
      const capsule = () =>
        page.evaluate(`(() => {
          const tab = ${page.section}.querySelector('[role=tab]');
          const label = tab.querySelector('[data-tab-bar-part=label]');
          const icon = tab.querySelector('[data-tab-bar-part=icon]');
          const { height, width } = tab.getBoundingClientRect();
          const symbol = icon && getComputedStyle(icon).display !== 'none' && icon.getBoundingClientRect().width > 0 && +getComputedStyle(icon).opacity > 0;
          const content = label.getBoundingClientRect().width + (symbol ? icon.getBoundingClientRect().width + parseFloat(getComputedStyle(tab).columnGap) : 0);
          return (symbol ? 'symbol+' : '') + 'label+' + Math.round(width - content) + 'x' + Math.round(height);
        })()`);

      // Labels clip (no ellipsis) while the bar collapses and expands.
      const truncated = `[...${page.section}.querySelectorAll('[data-tab-bar-part=label] > span:first-child')].filter((text) => text.scrollWidth > text.clientWidth + 0.5 && getComputedStyle(text).textOverflow === 'ellipsis' && Number(getComputedStyle(text.closest('[role=tab]')).opacity) > 0).length`;
      const collapsing = page.sample(truncated, 600);
      await page.setState(2, { collapsed: true });
      /** @type {number[]} */
      const collapsingFrames = await collapsing;
      assert.deepEqual([...new Set(collapsingFrames)], [0], 'collapsing');
      assert.equal(await shown(), '40x40 symbol');

      await page.setState(2, { collapsedContent: 'label' });
      await sleep(500);
      assert.equal(await capsule(), 'label+36x40', 'label');
      await page.setState(2, { collapsedContent: 'symbolAndLabel' });
      await sleep(500);
      assert.equal(await capsule(), 'symbol+label+36x40', 'symbolAndLabel');

      // A tab's own content wins over the list's.
      await page.setState(2, { collapsedContent: 'symbol' });
      // (The group's.)
      await page.setState(3, { collapsedContent: 'label' });
      await sleep(200);
      assert.equal(await capsule(), 'label+36x40', 'own content');
      await page.setState(3, { collapsedContent: undefined });

      // Without a symbol: its label, in a capsule.
      await openBar(page, 'tab-bar-content', 'light', {
        state: [{ $rest: true, collapsed: true }],
      });
      await sleep(600);
      assert.equal(await capsule(), 'label+36x40');

      const expanding = page.sample(truncated, 600);
      await page.setState(0, { collapsed: false });
      /** @type {number[]} */
      const expandingFrames = await expanding;
      assert.deepEqual([...new Set(expandingFrames)], [0], 'expanding');
    },
  },
  {
    name: 'tab bar: too narrow, groups keep their shape and scroll their tabs within',
    run: async (page) => {
      // A group of several tabs shrinks, a single tab's (search) doesn't;
      // labels aren't truncated.
      for (const [id, tabs, width, single] of /** @type {const} */ ([
        ['tab-bar-regular', undefined, 360, null],
        [SECONDARY, 5, 260, 54],
      ])) {
        await openBar(page, id);
        if (tabs) await page.setState(0, { tabs });
        const list = `${page.section}.querySelector('[role=tablist]')`;
        await page.evaluate(`${list}.style.width = '${width}px'`);
        await sleep(400);

        const state = await page.evaluate(`(() => {
          const list = ${list};
          const listRect = list.getBoundingClientRect();
          const groups = [...list.querySelectorAll(':scope > div')];
          const scroller = groups[0].querySelector('[data-tab-bar-part=tabs]');
          return {
            inside: groups.every((group) => {
              const { left, right } = group.getBoundingClientRect();
              return left >= listRect.left + 31.5 && right <= listRect.right - 31.5;
            }),
            listOverflows: list.scrollWidth > list.clientWidth + 1,
            overflowing: scroller.hasAttribute('data-overflowing') && getComputedStyle(scroller).overflowX === 'auto',
            scrolls: scroller.scrollWidth > scroller.clientWidth + 1,
            single: groups.length > 1 ? Math.round(groups.at(-1).getBoundingClientRect().width) : null,
            truncated: [...list.querySelectorAll('[data-tab-bar-part=label] > span')].filter((text) => text.scrollWidth > text.clientWidth + 0.5).length,
          };
        })()`);
        assert.deepEqual(
          state,
          {
            inside: true,
            listOverflows: false,
            overflowing: true,
            scrolls: true,
            single,
            truncated: 0,
          },
          id,
        );
        await page.screenshot(`${id}-overflow`);

        // Dragging the lens to the group's end scrolls the tabs under it into
        // view, up to its last one.
        const first = await page.rect('[role=tab]');
        const scroller = `${page.section}.querySelector('[data-tab-bar-part=tabs]')`;
        const end = await page.evaluate(
          `${scroller}.getBoundingClientRect().right`,
        );
        const y = first.y + first.height / 2;
        await page.mouse('mousePressed', first.x + first.width / 2, y);
        await page.mouse('mouseMoved', end - 8, y);
        await sleep(1500);
        await page.mouse('mouseReleased', end - 8, y);
        await sleep(600);

        const result = await page.evaluate(`(() => {
          const scroller = ${scroller};
          const tabs = [...scroller.querySelectorAll(':scope > [role=tab]')];
          return {
            active: tabs.findIndex((tab) => tab.hasAttribute('data-active')),
            count: tabs.length,
            range: Math.round(scroller.scrollWidth - scroller.clientWidth),
            scrolled: Math.round(scroller.scrollLeft),
          };
        })()`);
        assert.equal(result.active, result.count - 1, id);
        assert.equal(result.scrolled, result.range, id);
      }
    },
  },
  {
    name: 'tab bar: touch dragging the lens over scrolling tabs is not taken over by scrolling',
    run: async (page) => {
      await openBar(page, 'tab-bar-regular');
      const list = `${page.section}.querySelector('[role=tablist]')`;
      await page.evaluate(`${list}.style.width = '360px'`);
      await sleep(400);

      const first = await page.rect('[role=tab]');
      const scroller = `${page.section}.querySelector('[data-tab-bar-part=tabs]')`;
      const end = await page.evaluate(
        `${scroller}.getBoundingClientRect().right`,
      );
      const y = first.y + first.height / 2;
      const pressed = `${list}.style.getPropertyValue('--uikit-tab-bar-pressed')`;

      /** @type {string[]} */
      const during = [];
      await withTouch(page, async (touch) => {
        const start = first.x + first.width / 2;
        await touch('touchStart', start, y);
        for (let step = 1; step <= 10; step += 1) {
          await touch('touchMove', start + ((end - 8 - start) * step) / 10, y);
          await sleep(30);
          during.push(await page.evaluate(pressed));
        }
        await sleep(1500);
        during.push(await page.evaluate(pressed));
        await touch('touchEnd');
        await sleep(600);
      });

      const result = await page.evaluate(`(() => {
        const scroller = ${scroller};
        const tabs = [...scroller.querySelectorAll(':scope > [role=tab]')];
        return {
          active: tabs.findIndex((tab) => tab.hasAttribute('data-active')) === tabs.length - 1,
          scrolled: Math.round(scroller.scrollLeft) === Math.round(scroller.scrollWidth - scroller.clientWidth),
          touchAction: getComputedStyle(scroller).touchAction,
        };
      })()`);
      assert.deepEqual([...new Set(during)], ['1'], 'pressed throughout');
      assert.deepEqual(result, {
        active: true,
        scrolled: true,
        touchAction: 'none',
      });
    },
  },
  {
    name: 'tab bar (iPad): in a container sized by its content, the bar shrinks and its lens stays within',
    run: async (page) => {
      await page.open('tab-bar-regular');
      // Such a container (a grid, scrolling), 420px wide, around the bar.
      await page.evaluate(`(() => {
        const container = document.createElement('div');
        container.id = 'container';
        container.style.cssText = 'display: grid; width: 420px; overflow: auto';
        const bar = document.querySelector('[role=tablist]').parentElement;
        bar.before(container);
        container.append(bar);
      })()`);
      const stage = `document.querySelector(${JSON.stringify('#container')})`;
      await sleep(400);

      const fits = await page.evaluate(
        `${stage}.querySelector('[role=tablist]').getBoundingClientRect().width <= 420.5`,
      );
      assert.ok(fits, 'the bar fits its container');

      // Dragged quickly onto the circle at the end, the lens is still a
      // capsule when it gets there, which must not overflow the container.
      const first = await page.rect('[role=tab]', 1);
      const end = await page.evaluate(
        `${stage}.querySelector('[role=tablist]').getBoundingClientRect().right`,
      );
      const y = first.y + first.height / 2;
      await page.mouse('mousePressed', first.x + first.width / 2, y);
      const sampling = page.sample(
        `${stage}.scrollWidth - ${stage}.clientWidth`,
        1500,
      );
      for (let step = 1; step <= 4; step += 1) {
        await page.mouse(
          'mouseMoved',
          first.x + ((end - 4 - first.x) * step) / 4,
          y,
        );
        await sleep(16);
      }
      /** @type {number[]} */
      const overflows = await sampling;
      await page.mouse('mouseReleased', end - 4, y);
      await sleep(600);

      assert.ok(
        overflows.every((overflow) => overflow <= 0),
        `container overflows ${overflows.filter((overflow) => overflow > 0).join(', ')}`,
      );
    },
  },
  {
    name: 'tab bar: a group not too narrow for its tabs does not clip them',
    run: async (page) => {
      await openBar(page, 'tab-bar-regular');
      assert.equal(
        await page.evaluate(
          `getComputedStyle(${page.section}.querySelector('[data-tab-bar-part=tabs]')).overflowX`,
        ),
        'visible',
      );
    },
  },
  {
    name: 'tab bar: collapsed, marked groups remain at their own positions, side by side at the same one',
    run: async (page) => {
      await openBar(page, SECONDARY, 'light', {
        state: [
          null,
          null,
          null,
          { $rest: true, visibleWhenCollapsed: true },
          null,
          null,
          null,
          {
            $rest: true,
            collapsedPosition: 'inline-end',
            visibleWhenCollapsed: true,
          },
        ],
      });
      // Collapsed once laid out (as it keeps its expanded width).
      await page.setState(2, { collapsed: true });
      await sleep(800);

      const [primary, secondary] = await collapsedState(page);
      if (!primary || !secondary) throw new Error('missing groups');
      assert.ok(primary.visible && secondary.visible, 'both remain');
      // Several tabs remain (one per group): the active one shows its
      // selection.
      assert.equal(primary.selection, 1);
      // 7pt further in than the bar's padding (32px), as a single group.
      assert.equal(primary.left, 39);
      assert.equal(secondary.right, 39);
      await page.screenshot('tab-bar-collapsed-groups-apart');

      await page.setState(7, { collapsedPosition: 'inline-start' });
      await sleep(800);
      const [first, second] = await collapsedState(page);
      if (!first || !second) throw new Error('missing groups');
      assert.equal(first.left, 39);
      assert.equal(second.left - (first.left + first.width), 16, 'the gap');
      await page.screenshot('tab-bar-collapsed-groups-together');

      // Expanding, the first group moves back to the bar's padding (from
      // its margin, spacing it from the other one) without a jump.
      /** @type {number[]} */
      const lefts = await Promise.all([
        page.sample(
          `${page.section}.querySelector('[role=tablist] > div').getBoundingClientRect().left`,
          900,
        ),
        page.setState(2, { collapsed: false }),
      ]).then(([sampled]) => sampled);
      const moves = lefts
        .slice(1)
        .map((left, index) => Math.abs(left - (lefts[index] ?? left)));
      assert.ok(
        Math.max(...moves) < 4,
        `largest move per frame ${Math.max(...moves)}`,
      );
    },
  },
  {
    name: 'tab bar: a group coming back from collapsing away fades its selection in',
    run: async (page) => {
      await openBar(page, SECONDARY, 'light', {
        state: [null, null, null, { $rest: true, visibleWhenCollapsed: true }],
      });
      const centers = await tabCenters(page);
      const search = centers.at(-1);
      if (!search) throw new Error('missing tabs');
      await page.click(search);
      await sleep(800);
      await page.setState(2, { collapsed: true });
      await sleep(900);

      const sampling = page.sample(
        `(() => {
          const group = ${page.section}.querySelectorAll('[role=tablist] > div')[1];
          return +getComputedStyle(group.querySelector('[role=presentation]'), '::before').opacity;
        })()`,
        900,
      );
      await page.setState(2, { collapsed: false });
      /** @type {number[]} */
      const opacities = await sampling;
      assert.ok(isMonotonic(opacities), `fades in: ${opacities.join(', ')}`);
      assert.ok(
        (opacities[1] ?? 1) < 0.2,
        `starts hidden: ${opacities.join(', ')}`,
      );
      assert.equal(opacities.at(-1), 1);
    },
  },
  {
    name: 'tab bar: a group coming back from collapsing away fades all its tabs in alike, its glass intact',
    run: async (page) => {
      await openBar(page, SECONDARY);
      const centers = await tabCenters(page);
      const search = centers.at(-1);
      if (!search) throw new Error('missing tabs');
      await page.click(search);
      await sleep(800);
      await page.setState(2, { collapsed: true });
      await sleep(900);

      // Its tabs' content fades (inside the blended parts); neither the
      // group nor its tabs (which would isolate the glass and blending).
      const sampling = page.sample(
        `(() => {
          const group = ${page.section}.querySelector('[role=tablist] > div');
          return {
            container: [group, ...group.querySelectorAll('[role=tab]')].map((element) => +getComputedStyle(element).opacity),
            content: [...group.querySelectorAll('[data-tab-bar-part=icon] > *')].map((element) => +getComputedStyle(element).opacity),
          };
        })()`,
        900,
      );
      await page.setState(2, { collapsed: false });
      /** @type {{ container: number[], content: number[] }[]} */
      const frames = await sampling;
      const spread = frames.map(
        ({ content }) => Math.max(...content) - Math.min(...content),
      );
      assert.ok(
        Math.max(...spread) < 0.01,
        `tabs' opacities differ by up to ${Math.max(...spread)}`,
      );
      assert.ok(
        frames.every(({ container }) =>
          container.every((value) => value === 1),
        ),
        'the group and its tabs stay opaque',
      );
      assert.ok(
        isMonotonic(frames.map(({ content }) => content[0] ?? 0)),
        'fades in',
      );
    },
  },
  {
    name: 'tab bar: collapsed, marked tabs remain, the selection only on the active one among them',
    run: async (page) => {
      await openBar(page, SECONDARY, 'light', {
        state: [
          null,
          null,
          { $rest: true, collapsed: true },
          null,
          { $rest: true, visibleWhenCollapsed: true },
          { $rest: true, visibleWhenCollapsed: true },
        ],
      });
      await sleep(800);

      const [group, secondary] = await collapsedState(page);
      assert.deepEqual(group?.tabs, [true, true, false]);
      assert.equal(secondary?.visible, false, 'the group of the active tab');
      assert.equal(group?.selection, 1, 'the active tab is selected');
      await page.screenshot('tab-bar-collapsed-tabs');

      // The active tab is not marked: no selection.
      await page.setState(4, { visibleWhenCollapsed: false });
      await page.setState(6, { visibleWhenCollapsed: true });
      await sleep(800);
      const [unselected] = await collapsedState(page);
      assert.deepEqual(unselected?.tabs, [false, true, true]);
      assert.ok(
        (unselected?.selectionWidth ?? 0) < 1 ||
          (unselected?.selection ?? 0) === 0,
        'no selection shows',
      );

      // A tab marked in another group keeps that group, too.
      await page.setState(8, { visibleWhenCollapsed: true });
      await sleep(800);
      const [, other] = await collapsedState(page);
      assert.equal(other?.visible, true, 'the other group remains');
      assert.deepEqual(other?.tabs, [true]);
    },
  },
  {
    name: 'tab bar: the accessory sits above the groups (in the bar’s layout), collapsed between them',
    run: async (page) => {
      await openBar(page, 'tab-bar-accessory', 'light', {
        state: [{ accessory: false }],
      });
      const bar = `${page.section}.querySelector('[role=tablist]')`;
      const height = await page.evaluate(
        `${bar}.getBoundingClientRect().height`,
      );
      await page.setState(0, { accessory: 'both' });
      await sleep(400);

      /** @typedef {{ bottom: number, height: number, left: number, right: number, top: number }} Box */
      /** @returns {Promise<{ accessory: Box, bar: number, groups: Box[], shadow: string[] }>} */
      const measure = () =>
        page.evaluate(`(() => {
          const list = ${bar};
          const round = ({ bottom, height, left, right, top }) => ({ bottom: Math.round(bottom), height: Math.round(height), left: Math.round(left), right: Math.round(right), top: Math.round(top) });
          // Their glass (the blur layer, extending beyond the elements).
          const glass = (element) => element.firstElementChild;
          const accessory = ${page.section}.querySelector('[data-tab-bar-part=accessory]');
          const groups = [...list.querySelectorAll(':scope > div')].filter((group) => getComputedStyle(group).visibility === 'visible');
          return {
            accessory: round(glass(accessory).getBoundingClientRect()),
            bar: list.getBoundingClientRect().height,
            groups: groups.map((group) => round(glass(group).getBoundingClientRect())),
            // The same glass material, its edge unclipped.
            shadow: [accessory, groups[0]].map((element) => [...element.children].slice(0, 3).map((layer) => getComputedStyle(layer).boxShadow + getComputedStyle(element).overflow).join()),
          };
        })()`);

      // Not in the tab list, for its content's semantics.
      assert.equal(
        await page.evaluate(
          `${page.section}.querySelector('[data-tab-bar-part=accessory]').closest('[role=tablist]')`,
        ),
        null,
      );

      const expanded = await measure();
      const [first, last] = [expanded.groups[0], expanded.groups.at(-1)];
      if (!first || !last) throw new Error('missing groups');
      assert.equal(expanded.bar, height, 'the bar keeps its height');
      assert.equal(expanded.shadow[0], expanded.shadow[1]);
      // Glass 48pt high, 8pt above the groups' glass.
      assert.deepEqual(
        expanded.accessory,
        {
          bottom: first.top - 8,
          height: 48,
          left: first.left,
          right: last.right,
          top: first.top - 56,
        },
        'above the groups',
      );
      // The bar's layout includes it (e.g. at the page's top).
      const contained = await page.evaluate(`(() => {
        const accessory = ${page.section}.querySelector('[data-tab-bar-part=accessory]').getBoundingClientRect();
        const root = ${bar}.parentElement.getBoundingClientRect();
        return Math.round(accessory.top - root.top) >= 0;
      })()`);
      assert.equal(contained, true, 'within the bar');
      await page.screenshot('tab-bar-accessory');

      await page.setState(2, { collapsed: true });
      await sleep(900);
      const alone = await measure();
      const [only] = alone.groups;
      if (!only) throw new Error('missing group');
      const barRight = await page.evaluate(
        `Math.round(${bar}.getBoundingClientRect().right)`,
      );
      // As high as the collapsed group's glass; its box (4px inside its
      // glass) at the bar's content edge, 16px from the group's box.
      assert.deepEqual(
        alone.accessory,
        {
          bottom: only.bottom,
          height: only.height,
          left: only.right + 8,
          right: barRight - 39 + 4,
          top: only.top,
        },
        'next to the remaining group',
      );

      // As in Music: the tab and search remain, the accessory between,
      // moving there without jumps: no edge moving by more than a third of
      // its way in one frame (an unanimated change: all of it), however far
      // its way (by the fonts' widths) and however many frames (dropped,
      // e.g. by a slow headless browser).
      await page.setState(3, { visibleWhenCollapsed: true });
      await page.setState(4, { visibleWhenCollapsed: true });
      await page.setState(4, { collapsedPosition: 'inline-end' });
      await page.setState(2, { collapsed: false });
      await sleep(900);
      /** @type {number[][]} */
      const frames = await Promise.all([
        page.sample(
          `(() => { const { left, right, top } = ${page.section}.querySelector('[data-tab-bar-part=accessory]').getBoundingClientRect(); return [left, right, top]; })()`,
          900,
        ),
        page.setState(2, { collapsed: true }),
      ]).then(([sampled]) => sampled);
      const moves = frames
        .slice(1)
        .map((frame, index) =>
          frame.map((value, edge) =>
            Math.abs(value - (frames[index]?.[edge] ?? value)),
          ),
        );
      const shares = [0, 1, 2].map((edge) => {
        const edgeMoves = moves.map((move) => move[edge] ?? 0);
        const way = edgeMoves.reduce((sum, move) => sum + move, 0);
        return way > 0 ? Math.max(...edgeMoves) / way : 0;
      });
      assert.ok(
        moves.some((move) => move.some((value) => value > 0)),
        'moving',
      );
      assert.ok(
        Math.max(...shares) < 1 / 3,
        `largest share of an edge's way in a frame ${Math.max(...shares)}`,
      );

      const collapsed = await measure();
      const [start, end] = collapsed.groups;
      if (!start || !end) throw new Error('missing groups');
      assert.deepEqual(
        collapsed.accessory,
        {
          bottom: start.bottom,
          height: start.height,
          left: start.right + 8,
          right: end.left - 8,
          top: start.top,
        },
        'between the groups',
      );
      await page.screenshot('tab-bar-accessory-collapsed');
    },
  },
  {
    name: 'tab bar: an accessory shown in one state only fades at its place there',
    run: async (page) => {
      const accessory = `${page.section}.querySelector('[data-tab-bar-part=accessory]')`;
      const bar = `${page.section}.querySelector('[role=tablist]')`;
      /** @returns {Promise<{ above: boolean, opacity: number, visible: boolean }>} */
      const state = () =>
        page.evaluate(`(() => {
          const accessory = ${accessory};
          const group = ${bar}.querySelector(':scope > div').getBoundingClientRect();
          const style = getComputedStyle(accessory);
          return {
            above: accessory.getBoundingClientRect().bottom <= group.top,
            // Its content and glass fade, not the accessory (see GlassBackground).
            opacity: +getComputedStyle(accessory.lastElementChild.firstElementChild).opacity,
            visible: style.visibility === 'visible',
          };
        })()`);

      // Expanded only: above the groups, fading out (there) on collapsing.
      await openBar(page, 'tab-bar-accessory', 'light', {
        state: [{ $rest: true, accessory: 'expanded' }],
      });
      await sleep(400);
      assert.deepEqual(await state(), {
        above: true,
        opacity: 1,
        visible: true,
      });
      /** @type {number[]} */
      const fading = await Promise.all([
        page.sample(
          `+getComputedStyle(${accessory}.lastElementChild.firstElementChild).opacity`,
          900,
        ),
        page.setState(2, { collapsed: true }),
      ]).then(([sampled]) => sampled);
      assert.ok(isMonotonic(fading, -1), `fades out: ${fading.join(', ')}`);
      assert.deepEqual(await state(), {
        above: true,
        opacity: 0,
        visible: false,
      });

      // Collapsed only: hidden while expanded, fading in between the
      // remaining groups (where an accessory shown in both states goes).
      await openBar(page, 'tab-bar-accessory', 'light', {
        state: [{ $rest: true, accessory: 'collapsed' }],
      });
      await sleep(400);
      assert.deepEqual(await state(), {
        above: false,
        opacity: 0,
        visible: false,
      });
      /** @type {number[]} */
      const appearing = await Promise.all([
        page.sample(
          `+getComputedStyle(${accessory}.lastElementChild.firstElementChild).opacity`,
          900,
        ),
        page.setState(2, { collapsed: true }),
      ]).then(([sampled]) => sampled);
      assert.ok(isMonotonic(appearing), `fades in: ${appearing.join(', ')}`);
      assert.deepEqual(await state(), {
        above: false,
        opacity: 1,
        visible: true,
      });
      const place = await page.evaluate(`(() => {
        const box = ${accessory}.getBoundingClientRect();
        const group = ${bar}.querySelector('[data-tab-bar-part=tabs]').getBoundingClientRect();
        return [Math.round(box.left - group.right), Math.round(box.top + box.height / 2 - (group.top + group.height / 2))];
      })()`);
      assert.deepEqual(place, [16, 0], 'next to the remaining group');
    },
  },
  {
    name: 'tab bar: collapsing and expanding, the bar keeps its width',
    run: async (page) => {
      for (const id of [PRIMARY, SECONDARY, 'tab-bar-regular']) {
        await openBar(page, id);
        for (const collapsed of [true, false]) {
          /** @type {number[]} */
          const widths = await Promise.all([
            page.sample(
              `Math.round(${page.section}.querySelector('[role=tablist]').getBoundingClientRect().width)`,
              800,
            ),
            page.setState(2, { collapsed }),
          ]).then(([sampled]) => sampled);
          assert.equal(new Set(widths).size, 1, `${id}: ${widths.join(', ')}`);
          await sleep(300);
        }
      }
    },
  },
  {
    name: 'tab bar (iPad): released on an outer tab, the lens shrinks onto it around its center',
    run: async (page) => {
      await openBar(page, 'tab-bar-regular');
      for (const index of [0, 8]) {
        const tab = await page.rect('[role=tab]', index);
        const x = tab.x + tab.width / 2;
        const y = tab.y + tab.height / 2;
        await page.mouse('mousePressed', x, y);
        await sleep(400);
        /** @type {number[]} */
        const centers = await Promise.all([
          page.sample(
            `(() => { const lens = ${page.section}.querySelector('[role=tablist]').lastElementChild; const { left, width } = lens.getBoundingClientRect(); return getComputedStyle(lens).opacity > 0.05 ? left + width / 2 : null; })()`,
            500,
          ),
          page.mouse('mouseReleased', x, y),
        ]).then(([sampled]) => sampled.filter((center) => center !== null));
        assert.ok(
          centers.every((center) => Math.abs(center - x) < 1),
          `tab ${index}: centers ${centers.join(', ')}, tab ${x}`,
        );
        await sleep(400);
      }
    },
  },
  {
    name: 'tab bar: collapsed content by list, group and tab, never nothing',
    run: async (page) => {
      await openBar(page, SECONDARY);

      /** @returns {Promise<string>} what the collapsed active tab shows */
      const shows = () =>
        page.evaluate(`(() => {
          const tab = ${page.section}.querySelector('[role=tab][data-active]');
          const icon = tab.querySelector('[data-tab-bar-part=icon]');
          const label = tab.querySelector('[data-tab-bar-part=label]');
          return [
            icon && getComputedStyle(icon).display !== 'none' ? 'symbol' : '',
            label && +getComputedStyle(label).opacity > 0.5 && label.getBoundingClientRect().width > 1 ? 'label' : '',
          ].filter(Boolean).join('+');
        })()`);

      await page.setState(2, { collapsed: true });
      await page.setState(3, { collapsedContent: 'label' });
      await sleep(600);
      assert.equal(await shows(), 'label', 'the group over the default');

      await page.setState(3, { collapsedContent: undefined });
      await page.setState(2, { collapsedContent: 'symbolAndLabel' });
      await sleep(600);
      assert.equal(await shows(), 'symbol+label', 'the list');

      await page.setState(3, { collapsedContent: 'label' });
      await sleep(600);
      assert.equal(await shows(), 'label', 'the group over the list');

      await page.setState(4, { collapsedContent: 'symbol' });
      await sleep(600);
      assert.equal(await shows(), 'symbol', 'the tab over the group');

      // Without a label, a tab shows its symbol, whatever it should show,
      // and without a symbol, its label.
      await openBar(page, 'tab-bar-content');
      const centers = await tabCenters(page);
      const symbolOnly = centers[2];
      await page.click(symbolOnly ?? [0, 0]);
      await sleep(400);
      await page.setState(0, { collapsed: true, collapsedContent: 'label' });
      await sleep(600);
      assert.equal(await shows(), 'symbol', 'only a symbol');

      await page.setState(0, { collapsed: false });
      await sleep(600);
      const [labelOnly] = await tabCenters(page);
      await page.click(labelOnly ?? [0, 0]);
      await sleep(400);
      await page.setState(0, { collapsed: true, collapsedContent: 'symbol' });
      await sleep(600);
      assert.equal(await shows(), 'label', 'only a label');
    },
  },
  {
    name: 'tab bar (iPad): expanding slowly, labels clip and the selection stays on its tab',
    run: async (page) => {
      await openBar(page, 'tab-bar-regular');
      // Collapsed once laid out (as it keeps its expanded width).
      await page.setState(2, { collapsed: true });
      await sleep(500);

      // Slowed down (as in the developer tools): ending the expansion waits
      // for the transitions, not for their usual duration.
      await page.browser.send('Animation.enable');
      await page.browser.send('Animation.setPlaybackRate', {
        playbackRate: 0.1,
      });
      try {
        await page.setState(2, { collapsed: false });
        // Sampled after the bar's own per-frame updates.
        /** @type {{ ellipsis: number, left: number, offset: number }[]} */
        const frames = await page.sample(
          `(() => {
            const list = ${page.section}.querySelector('[role=tablist]');
            const group = list.querySelector(':scope > div');
            const tab = group.querySelector('[role=tab][data-active]').getBoundingClientRect();
            return {
              ellipsis: [...list.querySelectorAll('[data-tab-bar-part=label] > span:first-child')].filter((text) => text.scrollWidth > text.clientWidth + 0.5 && getComputedStyle(text).textOverflow === 'ellipsis').length,
              left: tab.left,
              offset: Math.abs(group.querySelector('[role=presentation]').getBoundingClientRect().left - tab.left),
            };
          })()`,
          3500,
        );

        assert.deepEqual(
          [...new Set(frames.map(({ ellipsis }) => ellipsis))],
          [0],
        );
        assert.ok(
          isMonotonic(frames.map(({ left }) => left)),
          `tab lefts ${frames.map(({ left }) => Math.round(left)).join(', ')}`,
        );
        assert.ok(
          frames.every(({ offset }) => offset < 1),
          'the selection stays on the active tab',
        );
      } finally {
        await page.browser.send('Animation.setPlaybackRate', {
          playbackRate: 1,
        });
      }
    },
  },
  {
    name: 'tab bar: expanding slowly, symbols and labels move without jumps',
    run: async (page) => {
      /** @param {string} id */
      const expandSlowly = async (id) => {
        await openBar(page, id);
        await page.setState(2, { collapsed: true });
        await sleep(500);
        await page.browser.send('Animation.enable');
        await page.browser.send('Animation.setPlaybackRate', {
          playbackRate: 0.1,
        });
        try {
          // The symbol's and the label text's vertical offsets from the
          // active tab's center.
          const sampling = page.sample(
            `(() => {
              const tab = ${page.section}.querySelector('[role=tab][data-active]');
              const box = tab.getBoundingClientRect();
              const center = (rect) => rect.top + rect.height / 2 - (box.top + box.height / 2);
              const icon = tab.querySelector('[data-tab-bar-part=icon] svg');
              const range = document.createRange();
              range.selectNodeContents(tab.querySelector('[data-tab-bar-part=label] > span'));
              const text = range.getBoundingClientRect();
              return { icon: icon ? center(icon.getBoundingClientRect()) : 0, text: text.height ? center(text) : 0 };
            })()`,
            3500,
          );
          await sleep(100);
          await page.setState(2, { collapsed: false });
          /** @type {{ icon: number, text: number }[]} */
          const frames = await sampling;
          return frames;
        } finally {
          await page.browser.send('Animation.setPlaybackRate', {
            playbackRate: 1,
          });
        }
      };

      // iPhone: the symbol moves up as the label grows in.
      const compact = await expandSlowly(SECONDARY);
      assert.ok(
        compact.every(
          ({ icon }, index) =>
            index === 0 ||
            Math.abs(icon - (compact[index - 1]?.icon ?? icon)) < 1,
        ),
        `symbol offsets ${compact.map(({ icon }) => icon.toFixed(1)).join(', ')}`,
      );

      // iPad: the label text stays centered.
      const regular = await expandSlowly('tab-bar-regular');
      assert.ok(
        regular.every(({ text }) => Math.abs(text) < 0.5),
        `label offsets ${regular.map(({ text }) => text.toFixed(1)).join(', ')}`,
      );
    },
  },
  {
    name: 'tab bar (iPad): a collapsed bar keeps its height; a capsule search is no circle',
    run: async (page) => {
      await openBar(page, SECONDARY, 'light', {
        state: [null, null, { $rest: true, size: 'regular' }],
      });

      /** @returns {Promise<string>} */
      const listSize = () =>
        page.evaluate(`(() => {
          const { height, width } = ${page.section}.querySelector('[role=tablist]').getBoundingClientRect();
          return Math.round(width) + 'x' + Math.round(height);
        })()`);
      /** @returns {Promise<string>} */
      const search = () =>
        page.evaluate(`(() => {
          const { height, width } = [...${page.section}.querySelectorAll('[role=tab]')].at(-1).getBoundingClientRect();
          return Math.round(width) + 'x' + Math.round(height);
        })()`);

      const expanded = await listSize();
      await page.setState(2, { collapsed: true });
      await sleep(500);
      assert.equal(await listSize(), expanded);
      await page.setState(2, { collapsed: false });
      await sleep(500);

      // Alone in its group: a circle; as a capsule: 50×36 (Figma iPad).
      assert.equal(await search(), '36x36');
      // (The secondary group's.)
      await page.setState(7, { shape: 'capsule' });
      await sleep(200);
      assert.match(await search(), /^(?:49|50)x36$/);
    },
  },
  {
    name: 'tab bar (iPad): circles are circles, symbol capsules 50×36',
    run: async (page) => {
      await openBar(page, 'tab-bar-regular');

      /** @returns {Promise<string>} */
      const first = () =>
        page.evaluate(`(() => {
          const { height, width } = ${page.section}.querySelector('[role=tab]').getBoundingClientRect();
          return Math.round(width) + 'x' + Math.round(height);
        })()`);

      assert.equal(await first(), '50x36');
      // (The 1st tab's.)
      await page.setState(3, { shape: 'circle' });
      assert.equal(await first(), '36x36');
    },
  },
  {
    name: 'tab bar: dragging the lens across groups activates the target',
    run: async (page) => {
      await openBar(page, SECONDARY);
      await page.stripes();
      const centers = await tabCenters(page);
      const first = centers[0];
      const last = centers.at(-1);
      if (!first || !last) throw new Error('missing tabs');

      await page.drag(first, last, {
        duration: 800,
        onStep: async (_x, _y, step) => {
          if (step === 6) await page.screenshot('tab-bar-lens-between-groups');
        },
        steps: 10,
      });
      await sleep(500);

      const active = await page.evaluate(
        `[...${page.section}.querySelectorAll('[role=tab]')].map((tab) => tab.hasAttribute('data-active'))`,
      );
      assert.equal(active.at(-1), true, `active tabs: ${active.join(', ')}`);
    },
  },
  {
    name: 'tab bar (iPad): tabs match Figma',
    run: async (page) => {
      await openBar(page, 'tab-bar-regular');
      await page.screenshot('tab-bar-regular');

      const tabs =
        await page.evaluate(`[...${page.section}.querySelectorAll('[role=tab]')].map((tab) => {
        const { height, left, right } = tab.getBoundingClientRect();
        const label = tab.querySelector('[data-tab-bar-part=label] > span');
        return {
          fontSize: label ? getComputedStyle(label).fontSize : undefined,
          height,
          left,
          right,
          selected: tab.hasAttribute('data-active'),
        };
      })`);

      assert.ok(
        tabs.every(
          (/** @type {{ height: number }} */ { height }) => height === 36,
        ),
        `tab heights: ${tabs.map((/** @type {{ height: number }} */ { height }) => height).join(', ')}`,
      );
      for (let index = 1; index < tabs.length; index += 1) {
        assert.ok(
          tabs[index].left >= tabs[index - 1].right - 0.5,
          `tab ${index} overlaps the previous one`,
        );
      }
      assert.deepEqual(
        tabs
          .filter(
            (/** @type {{ fontSize?: string }} */ { fontSize }) => fontSize,
          )
          .map(
            (
              /** @type {{ fontSize: string, selected: boolean }} */ {
                fontSize,
                selected,
              },
            ) => `${fontSize}${selected ? ' (selected)' : ''}`,
          ),
        ['17px (selected)', '15px', '15px', '15px', '15px', '15px', '15px'],
      );
    },
  },
  {
    name: 'tab bar (iPad): selecting a tab does not shift the tabs',
    run: async (page) => {
      await openBar(page, 'tab-bar-regular');

      const widths = () =>
        page.evaluate(
          `[...${page.section}.querySelectorAll('[role=tab]')].map((tab) => tab.getBoundingClientRect().width)`,
        );

      const before = await widths();
      const third = await page.rect('[role=tab]', 3);
      await page.click([third.x + third.width / 2, third.y + third.height / 2]);
      await sleep(500);
      const after = await widths();

      assert.deepEqual(after, before);
    },
  },
  {
    name: 'tab bar: symbols take up a line like a glyph (Figma 􀋃)',
    run: async (page) => {
      await openBar(page, SECONDARY);

      const icons = () =>
        page.evaluate(`(() => {
          const tab = ${page.section}.querySelector('[role=tab]');
          const icon = tab.querySelector('[data-tab-bar-part=icon]').getBoundingClientRect();
          const label = tab.querySelector('[data-tab-bar-part=label]').getBoundingClientRect();
          return { gap: Math.round(Math.max(label.top - icon.bottom, label.left - icon.right)), height: icon.height };
        })()`);

      // Figma: 28px line, 1px gap (compact); 20px line, 10px gap (regular).
      assert.deepEqual(await icons(), { gap: 1, height: 28 }, 'compact');
      await page.setState(2, { size: 'regular' });
      await sleep(400);
      assert.deepEqual(await icons(), { gap: 10, height: 20 }, 'regular');
    },
  },
  {
    name: 'tab bar: the regular size turns an iPhone bar into an iPad bar',
    run: async (page) => {
      await openBar(page, SECONDARY, 'light', {
        state: [null, null, { $rest: true, size: 'regular' }],
      });
      await sleep(400);
      await page.screenshot('tab-bar-secondary-regular');

      const tabs =
        await page.evaluate(`[...${page.section}.querySelectorAll('[role=tab]')].map((tab) => {
        const icon = tab.querySelector('[data-tab-bar-part=icon]')?.getBoundingClientRect();
        const label = tab.querySelector('[data-tab-bar-part=label]')?.getBoundingClientRect();
        return {
          height: tab.getBoundingClientRect().height,
          row: icon && label ? icon.right <= label.left : null,
        };
      })`);

      assert.deepEqual(tabs, [
        { height: 36, row: true },
        { height: 36, row: true },
        { height: 36, row: true },
        { height: 36, row: null },
      ]);
    },
  },
  {
    name: 'tab bar: the app collapses it on a secondary tab, a click on a collapsed group expands it',
    run: async (page) => {
      await openBar(page, SECONDARY);
      const collapsed = () =>
        page.evaluate(
          `getComputedStyle(${page.section}.querySelector('[role=tablist]')).paddingTop`,
        );
      assert.equal(await collapsed(), '16px');

      // Search (the demo's `onValueChange`): collapsed, only its group.
      const centers = await tabCenters(page);
      await page.click(centers[3] ?? [0, 0]);
      await sleep(700);
      assert.equal(await collapsed(), '23px');
      const state = await collapsedState(page);
      assert.deepEqual(
        state.map(({ tabs, visible }) => [visible, tabs]),
        [
          [false, [false, false, false]],
          [true, [true]],
        ],
      );

      // Its (active) tab clicked again: no value change, but its group's
      // click expands the bar.
      const after = await tabCenters(page);
      await page.click(after[3] ?? [0, 0]);
      await sleep(700);
      assert.equal(await collapsed(), '16px');
      const log = await page.log();
      assert.equal(log.match(/value change: secondary-1/gu)?.length, 1);
    },
  },
  {
    name: 'tab bar: tabs of a collapsed group can be selected, expanding it',
    run: async (page) => {
      await openBar(page, PRIMARY);
      // Three remaining tabs (marked), the bar collapsed by the demo's
      // scroll handler stand-in: the list's control.
      // The 1st to 3rd tab's controls.
      for (const index of [4, 5, 6]) {
        await page.setState(index, { visibleWhenCollapsed: true });
      }
      await page.setState(2, { collapsed: true });
      await sleep(600);
      const centers = await tabCenters(page);
      await page.click(centers[2] ?? [0, 0]);
      await sleep(600);
      assert.match(await page.log(), /value change: tab-3/u);
    },
  },
  {
    name: 'tab bar: collapsedSelection: the active tab and its group, or the first',
    run: async (page) => {
      await openBar(page, SECONDARY, 'light', {
        state: [null, null, { $rest: true, collapsed: true }],
      });
      await sleep(600);
      // The first group's first tab (the active one).
      const state = await collapsedState(page);
      assert.deepEqual(
        state.map(({ tabs, visible }) => [visible, tabs]),
        [
          [true, [true, false, false]],
          [false, [false]],
        ],
      );
    },
  },
  {
    name: 'tab bar: scrolling down collapses it, scrolling up expands it (the demo)',
    run: async (page) => {
      await openBar(page, 'tab-bar-scroll');
      // Something to scroll (raw, the page is as high as the demo).
      await page.evaluate(
        `document.body.style.minHeight = ${JSON.stringify('300vh')}`,
      );
      const padding = () =>
        page.evaluate(
          `getComputedStyle(${page.section}.querySelector('[role=tablist]')).paddingTop`,
        );
      await page.evaluate('window.scrollBy(0, 200)');
      await sleep(700);
      assert.equal(await padding(), '23px');
      await page.evaluate('window.scrollBy(0, -40)');
      await sleep(700);
      assert.equal(await padding(), '16px');
    },
  },
  {
    name: 'tab bar: in a wide bar (e.g. a page of its own), the space between the groups widens; collapsing and expanding at its start without jumps',
    run: async (page) => {
      await page.open(SECONDARY);
      const list = `${page.section}.querySelector('[role=tablist]')`;
      await page.evaluate(`${list}.style.width = '1000px'`);
      await sleep(300);
      // The groups' starts and widths, relative to the bar.
      const groups = `(() => { const box = ${list}.getBoundingClientRect(); return [...${list}.querySelectorAll(':scope > div')].map((group) => { const rect = group.getBoundingClientRect(); return { left: Math.round(rect.left - box.left), width: Math.round(rect.width) }; }); })()`;

      // Their own widths (Figma), at the bar's ends.
      assert.deepEqual(await page.evaluate(groups), [
        { left: 32, width: 286 },
        { left: 1000 - 32 - 54, width: 54 },
      ]);

      for (const collapsed of [true, false]) {
        const sampled = page.sample(`${groups}[0]`, 700);
        await page.setState(2, { collapsed });
        /** @type {{ left: number, width: number }[]} */
        const frames = await sampled;
        const lefts = frames.map(({ left }) => left);
        assert.ok(
          lefts.every(
            (left, index) =>
              index === 0 || Math.abs(left - (lefts[index - 1] ?? 0)) <= 2,
          ),
          `group starts ${lefts.join(', ')}`,
        );
        assert.equal(frames.at(-1)?.left, collapsed ? 39 : 32);
        await sleep(300);
      }
    },
  },
  {
    name: 'tab bar: the accessory morphs straight, without narrowing in between, in step with the groups (also slowed down)',
    run: async (page) => {
      await openBar(page, 'tab-bar-accessory', 'light', {
        state: [{ $rest: true, accessory: 'both' }],
      });
      await sleep(300);
      const width = `${page.section}.querySelector('[data-tab-bar-part=accessory]').getBoundingClientRect().width`;

      // Its width changes one way only (collapsing: narrower, expanding:
      // wider).
      for (const collapsed of [true, false]) {
        const sampled = page.sample(width, 600);
        await page.setState(2, { collapsed });
        /** @type {number[]} */
        const widths = await sampled;
        const steps = widths
          .slice(1)
          .map((value, index) => value - (widths[index] ?? value));
        const backwards = steps.filter((step) =>
          collapsed ? step > 0.5 : step < -0.5,
        );
        assert.deepEqual(
          backwards,
          [],
          `${collapsed ? 'collapsing' : 'expanding'}: ${widths.map((value) => Math.round(value)).join(', ')}`,
        );
        assert.notEqual(widths[0], widths.at(-1), 'morphing');
        await sleep(300);
      }

      // Slowed down (as in the browser's developer tools): with the groups,
      // by their transitions' time.
      const accessoryLeft = `${page.section}.querySelector('[data-tab-bar-part=accessory]').getBoundingClientRect().left`;
      const before = Number(await page.evaluate(accessoryLeft));
      await page.browser.send('Animation.enable');
      await page.browser.send('Animation.setPlaybackRate', {
        playbackRate: 0.1,
      });
      try {
        await page.setState(2, { collapsed: true });
        // A fifth of the (slowed down) time in: well short of a third of
        // the way (its own clock would have ended it).
        await sleep(600);
        const early = Number(await page.evaluate(accessoryLeft));
        await sleep(3000);
        const after = Number(await page.evaluate(accessoryLeft));
        assert.ok(
          Math.abs(early - before) < Math.abs(after - before) / 3,
          `${before} → ${early} → ${after}`,
        );
      } finally {
        await page.browser.send('Animation.setPlaybackRate', {
          playbackRate: 1,
        });
      }
    },
  },
  {
    name: 'tab bar: the accessory expands along its collapse’s path, backwards',
    run: async (page) => {
      await openBar(page, 'tab-bar-accessory', 'light', {
        state: [{ $rest: true, accessory: 'both' }],
      });
      await sleep(300);
      const place = `(() => { const box = ${page.section}.querySelector('[role=tablist]').getBoundingClientRect(); const { left, right, top } = ${page.section}.querySelector('[data-tab-bar-part=accessory]').getBoundingClientRect(); return [left - box.left, right - box.left, top - box.top]; })()`;

      /** @type {Record<string, number[][]>} */
      const paths = {};
      for (const collapsed of [true, false]) {
        const sampled = page.sample(place, 600);
        await page.setState(2, { collapsed });
        paths[String(collapsed)] = await sampled;
        await sleep(300);
      }

      // Every place expanding passes is on the collapse's path: on the
      // lines between its frames (however far apart, e.g. dropped by a slow
      // headless browser).
      const collapsing = paths.true ?? [];
      const expanding = paths.false ?? [];
      /** The distance of `point` to the line from `from` to `to`. */
      const toLine = (
        /** @type {number[]} */ point,
        /** @type {number[]} */ from,
        /** @type {number[]} */ to,
      ) => {
        const along = to.map((value, index) => value - (from[index] ?? 0));
        const length = along.reduce((sum, value) => sum + value ** 2, 0);
        const share = length
          ? Math.min(
              1,
              Math.max(
                0,
                point.reduce(
                  (sum, value, index) =>
                    sum + (value - (from[index] ?? 0)) * (along[index] ?? 0),
                  0,
                ) / length,
              ),
            )
          : 0;
        return Math.hypot(
          ...point.map(
            (value, index) =>
              value - (from[index] ?? 0) - share * (along[index] ?? 0),
          ),
        );
      };
      const off = expanding.map((point) =>
        Math.min(
          ...collapsing.map((from, index) =>
            toLine(point, from, collapsing[index + 1] ?? from),
          ),
        ),
      );
      assert.ok(
        Math.max(...off) < 12,
        `off the path by ${off.map((value) => Math.round(value)).join(', ')}`,
      );
      // And the furthest it swings out sideways, both ways.
      const furthest = (/** @type {number[][]} */ path) =>
        Math.max(...path.map(([left = 0]) => left));
      assert.ok(
        Math.abs(furthest(collapsing) - furthest(expanding)) < 3,
        `furthest ${furthest(collapsing)}, ${furthest(expanding)}; ${collapsing.map(([left = 0]) => Math.round(left)).join(' ')} / ${expanding.map(([left = 0]) => Math.round(left)).join(' ')}`,
      );
    },
  },
];
