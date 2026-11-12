import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { publicUrl } from '../../tooling/public-url.js';

// Its props, for the parts page (all) and the overview (its key ones).

export const pageControlRows: readonly PropRow[] = [
  ['count', 'number', undefined, 'The pages: a dot each (required).'],
  [
    'value',
    'number',
    undefined,
    <>
      The current page, from 0 (controlled). To render an uncontrolled page
      control, use the <code>defaultValue</code> prop instead.
    </>,
  ],
  [
    'defaultValue',
    'number',
    code('0'),
    <>
      The page that’s current at first, from 0 (uncontrolled). To render a
      controlled page control, use the <code>value</code> prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(page: number, eventDetails) => void',
    undefined,
    <>
      Called with the page to go to, and why (<code>reason</code>, like Base
      UI’s slider’s): <code>track-press</code> (a press before or after the
      current dot), <code>drag</code> (scrubbing across the dots), or{' '}
      <code>keyboard</code>.
    </>,
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Ignores presses, drags and keys, and leaves the tab order.',
  ],
  [
    'variant',
    union('glass', 'plain'),
    code('glass'),
    <>
      <code>glass</code>: a glass capsule (for example in a{' '}
      <a href={publicUrl('toolbar')}>Toolbar</a>). <code>plain</code>: only the
      dots, over content.
    </>,
  ],
  [
    'context',
    union('bright', 'dim', 'background-bright', 'background-dim', 'adaptive'),
    <>
      the toolbar’s, or <code>bright</code> (<code>dim</code> in dark mode)
    </>,
    <>
      How bright the content behind its glass is: a plain page, or a background
      of the app’s own (for example a picture). <code>adaptive</code> follows
      what’s behind it.
    </>,
  ],
  [
    'momentaryTooltip',
    'boolean',
    code('false'),
    <>
      Shows the current page (see <code>format</code>) in a tooltip above it
      while it’s hovered, pressed or focused by keyboard.
    </>,
  ],
  [
    'format',
    '(page: number, count: number) => string',
    code('3 of 8'),
    'The current page as text, for its accessible value and its tooltip.',
  ],
  ['aria-label', 'string', code('Page'), 'Its accessible name.'],
  ...elementRows('div', 'HTMLDivElement'),
];
