import { code, elementRows, PropRow, union } from '../guide/props-table.js';

// Every part's props, and the hooks' arguments and return values, for the
// parts page (all) and the overview (its key ones).

const safeAreaRow: PropRow = [
  'safeArea',
  union('all', 'block', 'inline', 'none'),
  code(union('all')),
  <>
    The safe area insets kept clear (as padding): all, those of the block
    dimension (top, bottom) or the inline one (left, right) only, or none (CSS{' '}
    <code>env(safe-area-inset-*)</code>).
  </>,
];

const anchorKeyboardRow: PropRow = [
  'keyboard',
  union('push', 'cover'),
  code(union('push')),
  <>
    At the block end: pushed up by the on-screen keyboard (e.g. a message
    field), or covered by it (e.g. a tab bar). At the other edges: none (side
    anchors always end at the keyboard’s top).
  </>,
];

export const viewportProviderRows: readonly PropRow[] = [
  [
    'scroller',
    'RefObject<HTMLElement | null>',
    'the document’s scrolling element',
    <>
      The scroll container tracked (e.g. a <code>Viewport.Content</code>’s ref):
      its direction and edges, for <code>useViewportScroll</code> and{' '}
      <code>useScrollDirection</code>.
    </>,
  ],
  [
    'threshold',
    'number',
    code('8'),
    'How far (px) to scroll from where the direction last turned before it changes, so jitter doesn’t flip it.',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'The app (or the part of it) using the hooks. It renders no element of its own.',
  ],
];

export const viewportContentRows: readonly PropRow[] = [
  [
    'keyboard',
    union('resize', 'overlay'),
    code(union('resize')),
    <>
      With the on-screen keyboard: resized to what’s above it (its end scrolls
      into view), or overlaid by it (filling the layout viewport, from its top).
    </>,
  ],
  safeAreaRow,
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportAnchorRows: readonly PropRow[] = [
  [
    'edge',
    union('block-start', 'block-end', 'inline-start', 'inline-end'),
    undefined,
    <>
      The edge it floats at (required): <code>block-start</code> (the top, e.g.
      a toolbar), <code>block-end</code> (the bottom, e.g. a tab bar), or the
      inline ones (the leading and trailing sides, e.g. a compact sidebar;
      mirrored right to left).
    </>,
  ],
  anchorKeyboardRow,
  safeAreaRow,
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportBlockStartRows: readonly PropRow[] = [
  [
    'keyboard',
    union('push', 'cover'),
    code(union('push')),
    'None at the top (an anchor’s prop, effective at the block end).',
  ],
  safeAreaRow,
  ...elementRows('div', 'HTMLDivElement'),
];

export const viewportBlockEndRows: readonly PropRow[] = [
  anchorKeyboardRow,
  safeAreaRow,
  ...elementRows('div', 'HTMLDivElement'),
];

/** `useVisualViewport()`: what it returns (`VisualViewportState`). */
export const useVisualViewportRows: readonly PropRow[] = [
  ['width', 'number', undefined, 'The visual viewport’s width (px).'],
  [
    'height',
    'number',
    undefined,
    'The visual viewport’s height (px): less the on-screen keyboard, while it’s shown.',
  ],
  [
    'left',
    'number',
    undefined,
    'The visual viewport’s offset from the layout viewport’s left edge (px), e.g. while zoomed in.',
  ],
  [
    'top',
    'number',
    undefined,
    'The visual viewport’s offset from the layout viewport’s top edge (px).',
  ],
  [
    'keyboardInset',
    'number',
    undefined,
    'What the visual viewport doesn’t show of the layout viewport’s bottom (px, rounded): the on-screen keyboard’s height (0 without one).',
  ],
];

/** `useViewportScroll(listener)`: its argument. */
export const useViewportScrollRows: readonly PropRow[] = [
  [
    'listener',
    '(event: ViewportScrollEvent) => void',
    undefined,
    'Called on every scroll of the tracked scroll container; it can change between renders without resubscribing.',
  ],
];

/** A scroll's event (`ViewportScrollEvent`), the listener's argument. */
export const viewportScrollEventRows: readonly PropRow[] = [
  [
    'direction',
    `${union('down', 'up')} | undefined`,
    undefined,
    'The direction scrolled in, once past the threshold (until then: none).',
  ],
  ['atTop', 'boolean', undefined, 'Scrolled to (or past) the start.'],
  [
    'atBottom',
    'boolean',
    undefined,
    'Scrolled to (or past) the end (within 1px).',
  ],
  ['position', 'number', undefined, 'The scroll position (px).'],
];

/** `useScrollDirection()`: what it returns. */
export const useScrollDirectionRows: readonly PropRow[] =
  viewportScrollEventRows.filter(([name]) => name !== 'position');
