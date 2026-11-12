import {
  code,
  elementRows,
  type PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

export const islandRootRows: readonly PropRow[] = [
  [
    'defaultSnapPoint',
    'string',
    undefined,
    <>
      The stop it shows at first, uncontrolled: a{' '}
      <PartLink
        component="island"
        part="Island.SnapGroup"
      />
      ’s <code>value</code>. The lowest by default.
    </>,
  ],
  [
    'snapPoint',
    'string',
    undefined,
    <>
      The stop it shows, controlled (a group’s <code>value</code>). The app sets
      it, and the island moves there. The app follows{' '}
      <code>onSnapPointChange</code>.
    </>,
  ],
  [
    'onSnapPointChange',
    '(snapPoint: string, details) => void',
    undefined,
    <>
      Called when it’s swiped to a stop (its group’s <code>value</code>), as it
      comes to rest. When uncontrolled, <code>details.cancel()</code> keeps it
      at its current stop.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="island"
        part="Island.Header"
      />{' '}
      and its{' '}
      <PartLink
        component="island"
        part="Island.Content"
      />
      .
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const islandHeaderRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="island"
        part="Island.Grabber"
      />{' '}
      and its bar (a <a href={publicUrl('toolbar')}>Toolbar</a>,{' '}
      <code>placement=&quot;block-start&quot;</code>). Also a sliver’s stop (an
      empty{' '}
      <PartLink
        component="island"
        part="Island.SnapGroup"
      />{' '}
      right after the grabber).
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const islandGrabberRows: readonly PropRow[] = [
  [
    'cursor',
    'string',
    code(union('grab')),
    'The cursor shown while a pointer hovers it.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const islandContentRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What scrolls below its header, for example a{' '}
      <a href={publicUrl('list')}>List</a>. With stops, its snap groups.
    </>,
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const islandSnapGroupRows: readonly PropRow[] = [
  [
    'value',
    'string',
    undefined,
    <>
      Its stop’s name (required). The island shows everything up to the group’s
      end, its header included. The root’s <code>snapPoint</code>,{' '}
      <code>defaultSnapPoint</code> and <code>onSnapPointChange</code> use this
      name.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'What it reveals: the content after the group before it, up to its own end. Left empty, it makes a stop with only the header (in the content), or a sliver (in the header, right after the grabber).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
