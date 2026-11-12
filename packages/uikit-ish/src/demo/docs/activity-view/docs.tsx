import { elementRows, PropRow } from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

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
    , and for example the sheet’s close button at its end.
  </>,
);

export const activityViewThumbnailRows = rows(
  <>
    A picture of what’s shared (for example an <code>img</code>), 64px, with
    16px corners.
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
    , then, 12px below, for example a menu (a{' '}
    <a href={publicUrl('button')}>Button</a>) and a{' '}
    <PartLink
      component="activity-view"
      part="ActivityView.Message"
    />
    .
  </>,
);

export const activityViewTitleRows = rows(
  'The name of what’s shared (15px, medium).',
);

export const activityViewSubtitleRows = rows(
  'More about it (13px, in the secondary label color), for example its count or its URL.',
);

export const activityViewMessageRows = rows(
  'A note about sharing (13px, in the secondary label color), for example who can edit.',
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
      s, in a row that scrolls sideways (24px from its start, 14px apart).
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its name (it has the list role), for example “People”.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const activityViewPersonRows: readonly PropRow[] = [
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    'Shares with the person (it’s a button).',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      An <a href={publicUrl('avatar')}>Avatar</a> (for a group, an{' '}
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
  'The person’s name (12px, on two lines; with a count, on one line, truncated).',
  'span',
  'HTMLSpanElement',
);

export const activityViewCountRows = rows(
  'How many people a group has (for example “2 People”), below its name, in the secondary label color.',
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
      s, in a row that scrolls sideways.
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its name (it has the list role), for example “Actions”.',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const activityViewActionRows: readonly PropRow[] = [
  [
    'onClick',
    '(event: MouseEvent) => void',
    undefined,
    'Does the action (it’s a button).',
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
    The action’s symbol (a <a href={publicUrl('symbol')}>Symbol</a>, 25px,
    light) in a 70px circle on a fill. It’s hidden from assistive technology,
    because the label names the action.
  </>,
  'span',
  'HTMLSpanElement',
);

export const activityViewLabelRows = rows(
  'The action’s name (13px, on two lines).',
  'span',
  'HTMLSpanElement',
);

export const activityViewSeparatorRows: readonly PropRow[] = elementRows(
  'hr',
  'HTMLHRElement',
);
