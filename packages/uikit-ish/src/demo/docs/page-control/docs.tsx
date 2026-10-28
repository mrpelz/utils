import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';

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
      The initially current page, from 0 (uncontrolled). To render a controlled
      page control, use the <code>value</code> prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(page: number, eventDetails) => void',
    undefined,
    <>
      Called with the page to go to, and why (<code>reason</code>, as Base UI’s
      slider’s): <code>track-press</code> (a press before or after the current
      dot), <code>drag</code> (scrubbing across the dots), or{' '}
      <code>keyboard</code>.
    </>,
  ],
  [
    'disabled',
    'boolean',
    code('false'),
    'Ignores presses, drags and keys; out of the tab order.',
  ],
  [
    'variant',
    union('glass', 'plain'),
    code('glass'),
    <>
      <code>glass</code>: a glass capsule (e.g. in a{' '}
      <a href="toolbar">Toolbar</a>); <code>plain</code>: dots only, over
      content.
    </>,
  ],
  [
    'context',
    union('bright', 'dim', 'background-bright', 'background-dim', 'adaptive'),
    <>
      the toolbar’s, or <code>bright</code> (<code>dim</code> in dark mode)
    </>,
    <>
      Brightness of the content behind its glass: a plain page, or a background
      of the app’s (e.g. a picture); <code>adaptive</code>: by what’s behind it.
    </>,
  ],
  [
    'momentaryTooltip',
    'boolean',
    code('false'),
    <>
      The current page (see <code>format</code>) in a tooltip above it while
      it’s hovered, pressed or focused by keyboard.
    </>,
  ],
  [
    'format',
    '(page: number, count: number) => string',
    code('3 of 8'),
    'The current page as text: its accessible value, and its tooltip’s.',
  ],
  ['aria-label', 'string', code('Page'), 'Its accessible name.'],
  ...elementRows('div', 'HTMLDivElement'),
];
