/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- JavaScript, typed via JSDoc */
/* eslint-disable no-await-in-loop -- browser steps are sequential by design */

import assert from 'node:assert/strict';

/** @typedef {import('../lib.js').Page} Page */

const styles = [
  'largeTitle',
  'title1',
  'title2',
  'title3',
  'headline',
  'body',
  'callout',
  'subheadline',
  'footnote',
  'caption1',
  'caption2',
];

/**
 * The text sizes (size/line height, tracking) for some sizes.
 *
 * @type {Record<string, string[]>}
 */
const figma = {
  ax5: [
    '60/70 0',
    '58/68 0',
    '56/66 0',
    '55/65 0',
    '53/62 0',
    '53/62 0',
    '51/60 0',
    '49/58 0',
    '44/52 0',
    '43/51 0',
    '40/48 0',
  ],
  large: [
    '34/41 0.4',
    '28/34 0.38',
    '22/28 -0.26',
    '20/25 -0.45',
    '17/22 -0.43',
    '17/22 -0.43',
    '16/21 -0.31',
    '15/20 -0.23',
    '13/18 -0.08',
    '12/16 0',
    '11/13 0.06',
  ],
  xSmall: [
    '31/38 0.37',
    '25/31 0.15',
    '19/23 -0.45',
    '17/22 -0.43',
    '14/19 -0.15',
    '14/19 -0.15',
    '13/18 -0.08',
    '12/16 0',
    '12/16 0',
    '11/13 0.06',
    '11/13 0.06',
  ],
  xxxLarge: [
    '40/48 0.37',
    '34/41 0.4',
    '28/34 0.38',
    '26/32 0.22',
    '23/29 -0.1',
    '23/29 -0.1',
    '22/28 -0.26',
    '21/28 -0.36',
    '19/24 -0.45',
    '18/23 -0.44',
    '17/22 -0.43',
  ],
};

/**
 * Metrics (“size/line height tracking”) of the matrix demo's text in the
 * text size table's column for `size`.
 *
 * @param {Page} page
 * @param {string} size
 * @returns {Promise<string[]>}
 */
const metrics = (page, size) =>
  page.evaluate(`(() => {
    const sizes = ${page.section}.querySelector('.typography-demo-sizes');
    const headings = [...sizes.children].slice(0, 13).map((element) => element.textContent);
    const column = headings.indexOf(${JSON.stringify(size)});
    return [...sizes.children].filter((_, index) => index % 13 === column && index >= 13).map((element) => {
      const style = getComputedStyle(element);
      return parseFloat(style.fontSize) + '/' + parseFloat(style.lineHeight) + ' ' + (parseFloat(style.letterSpacing) || 0);
    });
  })()`);

/** @type {import('../lib.js').Test[]} */
export const tests = [
  {
    name: 'typography: text styles match the spec at text sizes',
    run: async (page) => {
      await page.open('typography-sizes');

      for (const [size, expected] of Object.entries(figma)) {
        assert.deepEqual(await metrics(page, size), expected, size);
      }
    },
  },
  {
    name: 'typography: emphasized weights and italics match the spec',
    run: async (page) => {
      await page.open('typography-matrix');

      const weights = await page.evaluate(`(() => {
        const variants = ${page.section}.querySelector('.typography-demo-variants');
        const cells = [...variants.children].slice(5);
        return ${JSON.stringify(styles)}.map((_, row) => {
          const [, regular, emphasized, italic] = cells.slice(row * 5, row * 5 + 5).map((element) => getComputedStyle(element));
          const weight = (style) => style.fontVariationSettings.match(/[0-9.]+/)?.[0];
          return [weight(regular), weight(emphasized), italic.fontStyle].join(' ');
        });
      })()`);

      assert.deepEqual(weights, [
        '400 700 italic',
        '400 700 italic',
        '400 700 italic',
        '400 590 italic',
        '590 590 italic',
        '400 590 italic',
        '400 590 italic',
        '400 590 italic',
        '400 590 italic',
        '400 510 italic',
        '400 590 italic',
      ]);
    },
  },
  {
    name: 'typography: all text sizes render',
    run: async (page) => {
      await page.open('typography-sizes');
      await page.screenshot('typography-sizes');

      /** @type {string[]} */
      const bodies = [];
      for (const size of [
        'xSmall',
        'small',
        'medium',
        'large',
        'xLarge',
        'xxLarge',
        'xxxLarge',
        'ax1',
        'ax2',
        'ax3',
        'ax4',
        'ax5',
      ]) {
        const sizeMetrics = await metrics(page, size);
        bodies.push(sizeMetrics.at(styles.indexOf('body')) ?? '');
      }

      assert.deepEqual(bodies, [
        '14/19 -0.15',
        '15/20 -0.23',
        '16/21 -0.31',
        '17/22 -0.43',
        '19/24 -0.45',
        '21/26 -0.36',
        '23/29 -0.1',
        '28/34 0',
        '33/40 0',
        '40/48 0',
        '47/56 0',
        '53/62 0',
      ]);
    },
  },
  {
    name: 'typography: rendered as another element (render), a heading or paragraph in its style',
    run: async (page) => {
      await page.open('typography-composition-article');
      const elements = await page.evaluate(
        `[...${page.section}.querySelectorAll('.uikit-typography')].map((element) => [element.tagName, getComputedStyle(element).fontSize])`,
      );
      assert.deepEqual(elements, [
        ['H2', '22px'],
        ['P', '15px'],
        ['P', '17px'],
        ['P', '13px'],
      ]);
    },
  },
  {
    name: 'typography: a text size around a list sizes its rows’ text',
    run: async (page) => {
      /** The list's first title's font size. */
      const size = () =>
        page.evaluate(
          `getComputedStyle(${page.section}.querySelector('[data-list-part=title]')).fontSize`,
        );

      await page.open('typography-composition-size');
      assert.equal(await size(), '17px');
      await page.setState(0, { textSize: 'ax3' });
      assert.notEqual(await size(), '17px');
      await page.setState(0, { textSize: 'xSmall' });
      assert.equal(await size(), '14px');
    },
  },
];
