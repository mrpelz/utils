import {
  baseUiRows,
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props (Base UI's with its descriptions), for the parts page
// (all) and the overview (its key ones).

export const avatarRootRows: readonly PropRow[] = [
  [
    'size',
    'number',
    code('70'),
    <>
      Its diameter in pixels (Figma’s contact: 70). In a{' '}
      <PartLink
        component="avatar"
        part="Avatar.Group"
      />
      , set none: the group sizes its people.
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its{' '}
      <PartLink
        component="avatar"
        part="Avatar.Image"
      />{' '}
      and{' '}
      <PartLink
        component="avatar"
        part="Avatar.Fallback"
      />{' '}
      (one shows at a time), and e.g. a <a href="badge">Badge</a> on its corner.
    </>,
  ],
  ...baseUiRows('span', 'HTMLSpanElement'),
];

export const avatarImageRows: readonly PropRow[] = [
  ['src', 'string', undefined, 'The photo’s URL.'],
  [
    'alt',
    'string',
    undefined,
    'The person’s name (or empty, when the avatar is named otherwise, e.g. in a row with the name).',
  ],
  [
    'onLoadingStatusChange',
    `(status: ${union('idle', 'loading', 'loaded', 'error')}) => void`,
    undefined,
    'Callback fired when the loading status changes.',
  ],
  [
    'keepMounted',
    'boolean',
    code('false'),
    <>
      Whether the image element stays mounted and loads in place instead of
      being preloaded. Supports <code>loading=&quot;lazy&quot;</code>.
    </>,
  ],
  ...baseUiRows('img', 'HTMLImageElement'),
];

export const avatarFallbackRows: readonly PropRow[] = [
  [
    'delay',
    'number',
    code('0'),
    'How long to wait before showing the fallback, in milliseconds (e.g. to not flash it while a fast image loads).',
  ],
  [
    'children',
    'ReactNode',
    undefined,
    'What shows without the photo (or until it loads): the person’s initials (the app’s), in white on gray.',
  ],
  ...baseUiRows('span', 'HTMLSpanElement'),
];

export const avatarGroupRows: readonly PropRow[] = [
  ['size', 'number', code('70'), 'Its diameter in pixels.'],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      Its people’s{' '}
      <PartLink
        component="avatar"
        part="Avatar.Root"
      />
      s (the first three shown, sized and placed by the group), and e.g. a{' '}
      <a href="badge">Badge</a> on its corner.
    </>,
  ],
  [
    'aria-label',
    'string',
    undefined,
    'Its name (it has the group role): e.g. the conversation’s.',
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];
