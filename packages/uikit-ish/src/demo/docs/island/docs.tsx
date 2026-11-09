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
      ’s <code>value</code>; by default the lowest.
    </>,
  ],
  [
    'snapPoint',
    'string',
    undefined,
    <>
      The stop it shows, controlled (a group’s <code>value</code>): set by the
      app, scrolled to; the app follows <code>onSnapPointChange</code>.
    </>,
  ],
  [
    'onSnapPointChange',
    '(snapPoint: string, details) => void',
    undefined,
    <>
      Called as the user swipes it to a stop (its group’s <code>value</code>),
      as it comes to rest; <code>details.cancel()</code> keeps it at its own
      stop (uncontrolled).
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
      <code>placement=&quot;block-start&quot;</code>); a sliver’s stop (an empty{' '}
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
    'The cursor over it, as a pointer hovers it (where one does).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const islandContentRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What scrolls below its header: e.g. a <a href={publicUrl('list')}>List</a>
      ; with stops, its snap groups.
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
      Its stop’s name: the island shows everything up to its end (its header
      too), named so in the root’s <code>snapPoint</code>,{' '}
      <code>defaultSnapPoint</code> and <code>onSnapPointChange</code>.
      Required.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'What it reveals: content up to its end, after the group before it. Empty: its header alone (in the content), or a sliver (in the header, right after the grabber).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];
