/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

import { sleep } from '../lib.js';

/** @typedef {import('../lib.js').Page} Page */

const PRIMARY = 'tab-bar';
const SECONDARY = 'tab-bar-secondary';

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

/** @param {number[]} values */
const isMonotonic = (values, direction = 1) =>
  values.every(
    (value, index) =>
      index === 0 ||
      (value - (values[index - 1] ?? value)) * direction >= -0.01,
  );

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
        await page.open(id);
        await page.setControl('tabs', tabs);
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
      await page.open(SECONDARY);
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
      await page.open(PRIMARY);
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
      await page.open(SECONDARY);
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
      await page.open(PRIMARY);
      // The third tab without its label: a circle, narrower than the others.
      await page.evaluate(`(() => {
        const input = [...${page.section}.querySelectorAll('config input[name=label]')][2];
        input.focus();
        input.value = 'undefined';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.blur();
      })()`);
      await sleep(300);

      const centers = await tabCenters(page);
      const first = centers[0];
      const last = centers.at(-1);
      if (!first || !last) throw new Error('missing tabs');

      const target = await page.evaluate(`(() => {
        const tabs = [...${page.section}.querySelectorAll('[role=tab]')];
        const group = tabs.at(-1).parentElement.getBoundingClientRect();
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
        group && group.opacity > 0.05 ? [group.left] : [],
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
        await page.open(id);

        /** @returns {Promise<{ glass: number, icon: number, scale: string }>} */
        const measure = () =>
          page.evaluate(`(() => {
            const group = ${page.section}.querySelector('[role=tab]').parentElement;
            const glass = group.firstElementChild;
            return {
              glass: glass.getBoundingClientRect().width,
              icon: group.querySelector('[data-tab-bar-part=icon]').getBoundingClientRect().width,
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
      await page.open(SECONDARY);

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
      await page.setControl('collapsed', true);
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
      await page.setControl('collapsed', false);
      await page.setControl('collapsedPosition', 'center');
      await sleep(500);
      const centering = page.sample(
        `(() => { const glass = ${page.section}.querySelector('[role=tablist] > div').firstElementChild.getBoundingClientRect(); return glass.left + glass.width / 2; })()`,
      );
      await page.setControl('collapsed', true);
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
      await page.setControl('collapsedPosition', 'end');
      await sleep(500);
      const end = await measure();
      assert.equal(end.right, collapsed.left);
      await page.setControl('collapsedPosition', 'start');
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
        };
      })()`);
      await page.setControl('collapsed', false);
      /** @type {{ glass: number, offset: number, opacity: number }[]} */
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
      assert.ok(
        frames.every(
          ({ glass }, index) =>
            index === 0 || glass - (frames[index - 1]?.glass ?? glass) < 40,
        ),
        `glass widths ${frames.map(({ glass }) => Math.round(glass)).join(', ')}`,
      );
      const settled = await measure();
      assert.equal(settled.size, expanded.size);
      await page.setControl('collapsed', true);
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
      await page.open(SECONDARY);

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

      // Labels clip (no ellipsis) while the bar collapses and expands.
      const truncated = `[...${page.section}.querySelectorAll('[data-tab-bar-part=label] > span:first-child')].filter((text) => text.scrollWidth > text.clientWidth + 0.5 && getComputedStyle(text).textOverflow === 'ellipsis' && Number(getComputedStyle(text.closest('[role=tab]')).opacity) > 0).length`;
      const collapsing = page.sample(truncated, 600);
      await page.setControl('collapsed', true);
      /** @type {number[]} */
      const collapsingFrames = await collapsing;
      assert.deepEqual([...new Set(collapsingFrames)], [0], 'collapsing');
      assert.equal(await shown(), '40x40 symbol');

      for (const [content, expected] of /** @type {const} */ ([
        ['label', /^7\dx40 label$/],
        ['symbolAndLabel', /^1\d\dx40 label symbol$/],
      ])) {
        await page.setControl('collapsedContent', content);
        await sleep(500);
        assert.match(await shown(), expected, content);
      }

      // A tab's own content wins over the list's.
      await page.setControl('collapsedContent', 'symbol');
      await page.evaluate(`(() => {
        const input = ${page.section}.querySelectorAll('config input[name=collapsedContent]')[1];
        input.focus();
        input.value = ${JSON.stringify(JSON.stringify('label'))};
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.blur();
      })()`);
      await sleep(500);
      assert.match(await shown(), /^7\dx40 label$/, 'own content');
      await page.evaluate(`(() => {
        const input = ${page.section}.querySelectorAll('config input[name=collapsedContent]')[1];
        input.focus();
        input.value = 'undefined';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.blur();
      })()`);
      await sleep(300);

      // Without a symbol: its label, in a capsule.
      await page.setMappedControl('collapsedContent', 'undefined');
      await page.evaluate(`(() => {
        const input = ${page.section}.querySelector('config input[name=symbol]');
        input.focus();
        input.value = 'undefined';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.blur();
      })()`);
      await sleep(500);
      assert.match(await shown(), /^7\dx40 label$/);

      const expanding = page.sample(truncated, 600);
      await page.setControl('collapsed', false);
      /** @type {number[]} */
      const expandingFrames = await expanding;
      assert.deepEqual([...new Set(expandingFrames)], [0], 'expanding');
    },
  },
  {
    name: 'tab bar (iPad): expanding slowly, labels clip and the selection stays on its tab',
    run: async (page) => {
      await page.open('tab-bar-regular');
      await page.setControl('collapsed', true);
      await sleep(500);

      // Slowed down (as in the developer tools): ending the expansion waits
      // for the transitions, not for their usual duration.
      await page.browser.send('Animation.enable');
      await page.browser.send('Animation.setPlaybackRate', {
        playbackRate: 0.1,
      });
      try {
        await page.setControl('collapsed', false);
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
        await page.open(id);
        await page.setControl('collapsed', true);
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
          await page.setControl('collapsed', false);
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
      await page.open(SECONDARY);
      await page.setControl('size', 'regular');

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
      await page.setControl('collapsed', true);
      await sleep(500);
      assert.equal(await listSize(), expanded);
      await page.setControl('collapsed', false);
      await sleep(500);

      // Alone in its group: a circle; as a capsule: 50×36 (Figma iPad).
      assert.equal(await search(), '36x36');
      await page.evaluate(`(() => {
        const group = [...${page.section}.querySelectorAll('config details')].find((details) => details.querySelector('summary').textContent === 'secondary group');
        const input = group.querySelector('input[name=shape]');
        input.focus();
        input.value = ${JSON.stringify(JSON.stringify('capsule'))};
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.blur();
      })()`);
      await sleep(500);
      assert.match(await search(), /^(?:49|50)x36$/);
    },
  },
  {
    name: 'tab bar (iPad): circles are circles, symbol capsules 50×36',
    run: async (page) => {
      await page.open('tab-bar-regular');

      /** @returns {Promise<string>} */
      const first = () =>
        page.evaluate(`(() => {
          const { height, width } = ${page.section}.querySelector('[role=tab]').getBoundingClientRect();
          return Math.round(width) + 'x' + Math.round(height);
        })()`);

      assert.equal(await first(), '50x36');
      await page.evaluate(`(() => {
        // The group's shape comes first, then the 1st tab's.
        const input = ${page.section}.querySelectorAll('config input[name=shape]')[1];
        input.focus();
        input.value = ${JSON.stringify(JSON.stringify('circle'))};
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.blur();
      })()`);
      await sleep(300);
      assert.equal(await first(), '36x36');
    },
  },
  {
    name: 'tab bar: dragging the lens across groups activates the target',
    run: async (page) => {
      await page.open(SECONDARY);
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
      await page.open('tab-bar-regular');
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
      await page.open('tab-bar-regular');

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
      await page.open(SECONDARY);

      const icons = () =>
        page.evaluate(`(() => {
          const tab = ${page.section}.querySelector('[role=tab]');
          const icon = tab.querySelector('[data-tab-bar-part=icon]').getBoundingClientRect();
          const label = tab.querySelector('[data-tab-bar-part=label]').getBoundingClientRect();
          return { gap: Math.round(Math.max(label.top - icon.bottom, label.left - icon.right)), height: icon.height };
        })()`);

      // Figma: 28px line, 1px gap (compact); 20px line, 10px gap (regular).
      assert.deepEqual(await icons(), { gap: 1, height: 28 }, 'compact');
      await page.setControl('size', 'regular');
      await sleep(400);
      assert.deepEqual(await icons(), { gap: 10, height: 20 }, 'regular');
    },
  },
  {
    name: 'tab bar: the regular size turns an iPhone bar into an iPad bar',
    run: async (page) => {
      await page.open(SECONDARY);
      await page.setControl('size', 'regular');
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
];
