import {
  code,
  PropRow,
  renderRows,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// Its parts' props, for the parts page (all) and the overview (its key
// ones).

export const pagerRootRows: readonly PropRow[] = [
  [
    'orientation',
    union('horizontal', 'vertical'),
    code('horizontal'),
    <>
      Its pages side by side, swiped sideways, or one below another, swiped up
      and down. A vertical pager needs a height, for example its container’s (it
      fills it).
    </>,
  ],
  [
    'value',
    'number',
    undefined,
    <>
      The current page, from 0 (controlled). When your app sets it (for example
      from a <a href={publicUrl('page-control')}>Page Control</a>’s press), the
      pager scrolls to it, or jumps there with motion reduced. To render an
      uncontrolled pager, use the <code>defaultValue</code> prop instead.
    </>,
  ],
  [
    'defaultValue',
    'number',
    code('0'),
    <>
      The page that’s current at first, from 0 (uncontrolled). To render a
      controlled pager, use the <code>value</code> prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(page: number, eventDetails) => void',
    undefined,
    <>
      Called with the page mostly in view as it’s scrolled, so dots follow the
      swipe, and why (<code>reason</code>): <code>swipe</code> (a finger, a
      trackpad, the mouse) or <code>keyboard</code>. It isn’t called on the way
      to a <code>value</code> your app set.
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its accessible name, for example what its pages are about.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its pages:{' '}
      <PartLink
        component="pager"
        part="Pager.Page"
      />
      s, one per page.
    </>,
  ],
  ...renderRows('div', 'HTMLDivElement'),
];

export const pagerPageRows: readonly PropRow[] = [
  [
    'aria-label',
    'string',
    'its place, e.g. “2 of 5”',
    'Its accessible name. By default, its place among the pager’s pages.',
  ],
  ['children', 'ReactNode', undefined, 'What the page shows: any components.'],
  ...renderRows('div', 'HTMLDivElement'),
];
