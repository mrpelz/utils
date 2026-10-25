import { elementRows, PropRow } from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

/** A part's children (its own rows: what it holds), and an element's. */
const rows = (
  children: PropRow[3],
  element = 'div',
  refElement = 'HTMLDivElement',
): readonly PropRow[] => [
  ['children', 'ReactNode', undefined, children],
  ...elementRows(element, refElement),
];

export const activityViewHeaderRows = rows(
  <>
    What’s shared: a{' '}
    <PartLink
      component="activity-view"
      part="ActivityView.Thumbnail"
    />
    , a{' '}
    <PartLink
      component="activity-view"
      part="ActivityView.Heading"
    />
    , and e.g. the sheet’s close button at its end.
  </>,
);

export const activityViewThumbnailRows = rows(
  <>
    A picture of what’s shared (e.g. an <code>img</code>), 64px, its corners
    16px.
  </>,
);

export const activityViewHeadingRows = rows(
  <>
    Its{' '}
    <PartLink
      component="activity-view"
      part="ActivityView.Title"
    />{' '}
    and{' '}
    <PartLink
      component="activity-view"
      part="ActivityView.Subtitle"
    />
    , then (12px below) e.g. a menu (a <a href="button">Button</a>) and a{' '}
    <PartLink
      component="activity-view"
      part="ActivityView.Message"
    />
    .
  </>,
);

export const activityViewTitleRows = rows(
  'What’s shared, named (15px, medium).',
);

export const activityViewSubtitleRows = rows(
  'More about it (13px, in the secondary label color), e.g. its count, its URL.',
);

export const activityViewMessageRows = rows(
  'A note on sharing (13px, in the secondary label color), e.g. who can edit.',
);

export const activityViewPeopleRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="activity-view"
        part="ActivityView.Person"
      />
      s, in a row scrolling sideways (24px from its start, 14px apart).
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its name (it has the list role), e.g. “People”.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const activityViewPersonRows: readonly PropRow[] = [
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    'Sharing with the person (it’s a button).',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      An <a href="avatar">Avatar</a> (a group’s:{' '}
      <PartLink
        component="avatar"
        part="Avatar.Group"
      />
      ), its{' '}
      <PartLink
        component="activity-view"
        part="ActivityView.Name"
      />
      , and a group’s{' '}
      <PartLink
        component="activity-view"
        part="ActivityView.Count"
      />
      .
    </>,
  ],
  ...elementRows('button', 'HTMLButtonElement'),
];

export const activityViewNameRows = rows(
  'The person’s name (12px, two lines; with a count: one, truncated).',
  'span',
  'HTMLSpanElement',
);

export const activityViewCountRows = rows(
  'How many people a group is (e.g. “2 People”), below its name, in the secondary label color.',
  'span',
  'HTMLSpanElement',
);

export const activityViewActionsRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="activity-view"
        part="ActivityView.Action"
      />
      s, in a row scrolling sideways.
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its name (it has the list role), e.g. “Actions”.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const activityViewActionRows: readonly PropRow[] = [
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    'The action (it’s a button).',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="activity-view"
        part="ActivityView.Symbol"
      />{' '}
      above its{' '}
      <PartLink
        component="activity-view"
        part="ActivityView.Label"
      />
      .
    </>,
  ],
  ...elementRows('button', 'HTMLButtonElement'),
];

export const activityViewSymbolRows = rows(
  <>
    The action’s symbol (a <a href="symbol">Symbol</a>, 25px, light) in a 70px
    circle on a fill; hidden from assistive technology (the label names it).
  </>,
  'span',
  'HTMLSpanElement',
);

export const activityViewLabelRows = rows(
  'The action’s name (13px, two lines).',
  'span',
  'HTMLSpanElement',
);

export const activityViewSeparatorRows: readonly PropRow[] = elementRows(
  'hr',
  'HTMLHRElement',
);
